/*
  # Restore Signup and Referral System

  This migration restores the complete signup and referral system by creating:

  1. Database Functions
     - `create_user_profile()` - Creates user profile when new user signs up
     - `assign_referral_code()` - Generates unique referral codes for users
     - `credit_referral_signup_bonus()` - Credits signup bonuses for referrals

  2. Database Triggers
     - `on_auth_user_created` - Triggers profile creation on new user signup
     - `on_new_user_referral_credit` - Triggers referral bonus crediting

  3. Security
     - All functions use SECURITY DEFINER for proper permissions
     - Handles NULL values and edge cases properly
*/

-- Drop existing triggers if they exist (cleanup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_new_user_referral_credit ON auth.users;

-- Drop existing functions if they exist (cleanup)
DROP FUNCTION IF EXISTS public.create_user_profile();
DROP FUNCTION IF EXISTS public.assign_referral_code(UUID);
DROP FUNCTION IF EXISTS public.credit_referral_signup_bonus();

-- 1. Create the user profile creation function
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    full_name,
    email_address,
    is_active,
    profile_created_at,
    profile_updated_at,
    referred_by
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'User'),
    NEW.email,
    true,
    now(),
    now(),
    COALESCE(NEW.raw_user_meta_data->>'referralCode', NULL)
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), user_profiles.full_name),
    email_address = NEW.email,
    profile_updated_at = now(),
    referred_by = COALESCE(NEW.raw_user_meta_data->>'referralCode', user_profiles.referred_by);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the referral code assignment function
CREATE OR REPLACE FUNCTION public.assign_referral_code(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  generated_code TEXT;
  existing_code TEXT;
  max_attempts INTEGER := 10;
  attempt_count INTEGER := 0;
BEGIN
  -- Check if a referral code already exists for the user
  SELECT referral_code INTO existing_code 
  FROM public.user_profiles 
  WHERE id = user_uuid;

  IF existing_code IS NOT NULL THEN
    RETURN existing_code;
  END IF;

  -- Generate a unique 8-character alphanumeric code
  LOOP
    generated_code := upper(substring(md5(random()::text || clock_timestamp()::text) for 8));
    
    -- Check if this code already exists
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE referral_code = generated_code) THEN
      EXIT; -- Code is unique, exit loop
    END IF;
    
    attempt_count := attempt_count + 1;
    IF attempt_count >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique referral code after % attempts', max_attempts;
    END IF;
  END LOOP;

  -- Update the user's profile with the new referral code
  UPDATE public.user_profiles
  SET 
    referral_code = generated_code, 
    profile_updated_at = now()
  WHERE id = user_uuid;

  -- Verify the update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for UUID: %', user_uuid;
  END IF;

  RETURN generated_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the referral signup bonus function
CREATE OR REPLACE FUNCTION public.credit_referral_signup_bonus()
RETURNS TRIGGER AS $$
DECLARE
  referrer_profile_id UUID;
  referred_by_code TEXT;
  signup_bonus_amount NUMERIC := 10.00; -- ₹10 signup bonus
  new_user_bonus_amount NUMERIC := 10.00; -- ₹10 bonus for new user
BEGIN
  -- Extract referral code from user metadata
  referred_by_code := NEW.raw_user_meta_data->>'referralCode';

  -- Only process if a referral code was provided
  IF referred_by_code IS NOT NULL AND trim(referred_by_code) != '' THEN
    
    -- Find the referrer's profile ID using their referral code
    SELECT id INTO referrer_profile_id
    FROM public.user_profiles
    WHERE referral_code = trim(referred_by_code);

    IF referrer_profile_id IS NOT NULL THEN
      
      -- Prevent self-referral
      IF referrer_profile_id = NEW.id THEN
        RAISE WARNING 'User % attempted self-referral with code %', NEW.id, referred_by_code;
        RETURN NEW;
      END IF;

      -- Check if this specific referral bonus has already been credited
      IF NOT EXISTS (
        SELECT 1 FROM public.wallet_transactions
        WHERE user_id = NEW.id
        AND type = 'referral_signup_bonus'
        AND source_user_id = referrer_profile_id
      ) THEN
        
        -- Credit bonus to the new user (referred user)
        INSERT INTO public.wallet_transactions (
          user_id, 
          type, 
          amount, 
          status, 
          source_user_id, 
          transaction_ref,
          redeem_details
        )
        VALUES (
          NEW.id, 
          'referral_signup_bonus', 
          new_user_bonus_amount, 
          'completed', 
          referrer_profile_id, 
          'signup_bonus_new_user_' || NEW.id,
          jsonb_build_object(
            'bonus_type', 'new_user_signup',
            'referral_code_used', referred_by_code,
            'referrer_id', referrer_profile_id
          )
        );

        -- Credit bonus to the referrer
        INSERT INTO public.wallet_transactions (
          user_id, 
          type, 
          amount, 
          status, 
          source_user_id, 
          transaction_ref,
          redeem_details
        )
        VALUES (
          referrer_profile_id, 
          'referral_signup_bonus', 
          signup_bonus_amount, 
          'completed', 
          NEW.id, 
          'signup_bonus_referrer_' || NEW.id,
          jsonb_build_object(
            'bonus_type', 'referrer_signup',
            'referred_user_id', NEW.id,
            'referral_code', referred_by_code
          )
        );

        RAISE NOTICE 'Referral signup bonus credited: ₹% to new user % and ₹% to referrer %', 
          new_user_bonus_amount, NEW.id, signup_bonus_amount, referrer_profile_id;
      ELSE
        RAISE NOTICE 'Referral signup bonus already credited for new user %', NEW.id;
      END IF;
    ELSE
      RAISE WARNING 'Referral code % not found for new user %', referred_by_code, NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger for user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

-- 5. Create trigger for referral signup bonus
CREATE TRIGGER on_new_user_referral_credit
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.credit_referral_signup_bonus();

-- 6. Ensure referred_by column is nullable (if it isn't already)
DO $$
BEGIN
  -- Check if referred_by column exists and make it nullable if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' 
    AND column_name = 'referred_by'
    AND table_schema = 'public'
  ) THEN
    -- Make sure the column is nullable
    ALTER TABLE public.user_profiles ALTER COLUMN referred_by DROP NOT NULL;
    RAISE NOTICE 'referred_by column made nullable';
  END IF;
END $$;

-- 7. Ensure source_user_id column exists in wallet_transactions and is nullable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallet_transactions' 
    AND column_name = 'source_user_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.wallet_transactions ADD COLUMN source_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;
    RAISE NOTICE 'source_user_id column added to wallet_transactions';
  END IF;
END $$;

-- 8. Create index for better performance on referral code lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code_lookup 
ON public.user_profiles(referral_code) 
WHERE referral_code IS NOT NULL;

-- 9. Create index for wallet transactions referral lookups
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_referral_bonus 
ON public.wallet_transactions(user_id, type, source_user_id) 
WHERE type = 'referral_signup_bonus';

-- 10. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_user_profile() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.assign_referral_code(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.credit_referral_signup_bonus() TO authenticated, anon;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Signup and referral system restoration completed successfully';
  RAISE NOTICE 'Functions created: create_user_profile, assign_referral_code, credit_referral_signup_bonus';
  RAISE NOTICE 'Triggers created: on_auth_user_created, on_new_user_referral_credit';
  RAISE NOTICE 'Signup bonus amount set to: ₹10.00 for both new users and referrers';
END $$;