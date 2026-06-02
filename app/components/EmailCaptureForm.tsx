'use client';

import { useState } from 'react';

export default function EmailCaptureForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    // Save to localStorage as requested
    try {
      const subscribers = JSON.parse(localStorage.getItem('email_subscribers') || '[]');
      subscribers.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('email_subscribers', JSON.stringify(subscribers));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let success = false;

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      // 1. Try sending to the new email_subscribers table
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/email_subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            email: email,
            source: 'trustrepid.dev',
            subscribed_at: new Date().toISOString()
          })
        });

        if (response.ok || response.status === 201) {
          success = true;
        }
      } catch (err) {
        console.warn('Failed to submit to email_subscribers, trying leads table:', err);
      }

      // 2. Fallback to leads table
      if (!success) {
        try {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              email: email,
              referral_source: 'trustrepid.dev',
              verification_status: 'pending'
            })
          });

          if (response.ok || response.status === 201) {
            success = true;
          }
        } catch (err) {
          console.error('Failed to submit to leads table:', err);
        }
      }
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center text-sm font-semibold">
        ✓ You have subscribed to reputation insights!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={loading}
        className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-6 py-3 rounded-xl font-medium text-sm transition-colors shrink-0 disabled:opacity-50"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
