'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { authAPI } from '@/services/api';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const lastUpdateRef = useRef<number>(0);

  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    // Throttle activity writes to at most once every 15 seconds
    if (now - lastUpdateRef.current > 15000) {
      lastUpdateRef.current = now;
      authAPI.recordActivity();
    }
  }, []);

  useEffect(() => {
    lastUpdateRef.current = Date.now();
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Check if session has timed out due to inactivity
    if (authAPI.isSessionExpired()) {
      authAPI.logout('timeout');
      return;
    }

    authAPI.recordActivity();
    setChecked(true);

    // Activity event listeners to maintain active session
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Periodic check every 15 seconds to detect idle timeout while tab is open
    const interval = setInterval(() => {
      if (authAPI.isSessionExpired()) {
        authAPI.logout('timeout');
      }
    }, 15000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(interval);
    };
  }, [router, handleUserActivity]);

  if (!checked) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const lastUpdateRef = useRef<number>(0);

  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current > 15000) {
      lastUpdateRef.current = now;
      authAPI.recordActivity();
    }
  }, []);

  useEffect(() => {
    lastUpdateRef.current = Date.now();
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.replace('/login?admin=true');
      return;
    }

    if (authAPI.isSessionExpired()) {
      authAPI.logout('timeout');
      return;
    }

    authAPI.recordActivity();
    setChecked(true);

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    const interval = setInterval(() => {
      if (authAPI.isSessionExpired()) {
        authAPI.logout('timeout');
      }
    }, 15000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(interval);
    };
  }, [router, handleUserActivity]);

  if (!checked) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
