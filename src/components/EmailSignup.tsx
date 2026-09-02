'use client';

import { useState } from 'react';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // Use Cloudflare Worker endpoint
      const response = await fetch('https://signup-api.poom-a1d.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Thanks! You\'re on the list.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="wf-signup">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === 'loading'}
        className="wf-input"
        style={{
          backgroundColor: 'var(--sc-canvas)',
          color: 'var(--sc-ink)',
          borderColor: 'var(--sc-accent)',
        }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="wf-cta"
        style={{
          backgroundColor: 'var(--sc-accent)',
          color: 'var(--sc-accent-ink)',
        }}
      >
        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
      </button>
      {message && (
        <p className={`wf-message ${status === 'error' ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
