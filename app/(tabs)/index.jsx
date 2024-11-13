// app/index.js
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import LoadingScreen from './loading';

export default function RootScreen() {
  const router = useRouter();

  useEffect(() => {
    // Wait for a few seconds, then navigate to login screen
    const timer = setTimeout(() => {
      router.push('/login'); // Redirect to login screen after delay
    }, 3000); // Adjust the delay (in ms) as needed for loading duration

    return () => clearTimeout(timer); // Clear timeout on unmount
  }, [router]);

  return <LoadingScreen />; // Render the loading screen as root
}
