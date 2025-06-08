import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function InviteHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvite = async () => {
      const params = new URLSearchParams(location.search);
      const ref = params.get('ref');

      if (!ref) {
        console.error('No referral ID found in the URL');
        navigate('/');
        return;
      }

      const initData = window.Telegram?.WebApp?.initData || '';
      const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe || {};

      if (!initData || !initDataUnsafe) {
        console.error('Telegram WebApp data not found');
        navigate('/');
        return;
      }

      const userId = initDataUnsafe.user?.id;
      const firstName = initDataUnsafe.user?.first_name;
      const lastName = initDataUnsafe.user?.last_name || '';
      const username = initDataUnsafe.user?.username;

      if (!userId || !firstName) {
        console.error('User data not found in Telegram WebApp');
        navigate('/');
        return;
      }

      // Check if the user already exists in the database
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_user_id', userId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking user in Supabase:', selectError);
        navigate('/');
        return;
      }

      if (!existingUser) {
        // Add new user to the database
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              first_name: firstName,
              last_name: lastName,
              username: username,
              points: 0,
              telegram_user_id: userId,
            },
          ])
          .select('*')
          .single();

        if (insertError) {
          console.error('Error adding new user to Supabase:', insertError);
          navigate('/');
          return;
        }

        // Update the referrer's total friends and reward
        const { data: referrer, error: referrerError } = await supabase
          .from('users')
          .select('*')
          .eq('telegram_user_id', ref)
          .single();

        if (referrerError) {
          console.error('Error finding referrer in Supabase:', referrerError);
          navigate('/');
          return;
        }

        const updatedFriends = (referrer.total_friends || 0) + 1;
        const updatedReward = (referrer.total_reward || 0) + 205.033;

        const { error: updateError } = await supabase
          .from('users')
          .update({ total_friends: updatedFriends, total_reward: updatedReward })
          .eq('telegram_user_id', ref);

        if (updateError) {
          console.error('Error updating referrer in Supabase:', updateError);
          navigate('/');
          return;
        }
      }

      // Redirect to the home page or any other page
      navigate('/');
    };

    handleInvite();
  }, [location, navigate]);

  return <div>Processing invitation...</div>;
}

export default InviteHandler;