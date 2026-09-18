'use client';

import { useEffect, useState } from 'react';

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  background: '#151518',
  border: '1px solid #2a2a2e',
  borderRadius: 6,
  color: '#eaeaea',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '0.6rem 1.2rem',
  background: '#7dd3a8',
  border: 'none',
  borderRadius: 6,
  color: '#0b0b0d',
  fontWeight: 600,
  cursor: 'pointer',
};

export default function Dashboard() {
  const [secret, setSecret] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newSlug, setNewSlug] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rvthless_admin_secret');
    if (saved) {
      setSecret(saved);
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  async function fetchStats() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stats', {
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) throw new Error('Wrong secret or server error');
      const data = await res.json();
      setStats(data.stats || []);
    } catch (e) {
      setError(e.message);
      setUnlocked(false);
      localStorage.removeItem('rvthless_admin_secret');
    } finally {
      setLoading(false);
    }
  }

  function handleUnlock() {
    localStorage.setItem('rvthless_admin_secret', secret);
    setUnlocked(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ slug: newSlug.trim(), destination: newDestination.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to create link');
      }
      setNewSlug('');
      setNewDestination('');
      fetchStats();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  if (!unlocked) {
    return (
      <main style={{ padding: '4rem 2rem', maxWidth: 380, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Admin access</h1>
        <input
          type="password"
          placeholder="Admin secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          style={{ ...inputStyle, marginBottom: '0.8rem' }}
        />
        <button style={buttonStyle} onClick={handleUnlock}>Unlock</button>
        {error && <p style={{ color: '#e07a7a', marginTop: '1rem' }}>{error}</p>}
      </main>
    );
  }

  return (
    <main style={{ padding: '3rem 1.5rem', maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>rvthless links — dashboard</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: '2.5rem', display: 'grid', gap: '0.6rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#999' }}>New short link</label>
        <input
          placeholder="slug (e.g. fiverr-shirt)"
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="destination URL"
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle} disabled={creating}>
          {creating ? 'Creating…' : 'Create link'}
        </button>
      </form>

      {error && <p style={{ color: '#e07a7a' }}>{error}</p>}
      {loading && <p style={{ color: '#999' }}>Loading…</p>}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {stats.map((s) => (
          <div key={s.slug} style={{ border: '1px solid #2a2a2e', borderRadius: 8, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong>/{s.slug}</strong>
              <span style={{ color: '#7dd3a8', fontSize: '1.2rem', fontWeight: 700 }}>{s.total} clicks</span>
            </div>
            <p style={{ color: '#999', fontSize: '0.85rem', wordBreak: 'break-all', margin: '0.4rem 0' }}>
              → {s.destination}
            </p>
            {s.recent.length > 0 && (
              <details style={{ marginTop: '0.6rem' }}>
                <summary style={{ cursor: 'pointer', color: '#7dd3a8', fontSize: '0.85rem' }}>
                  Recent clicks ({s.recent.length})
                </summary>
                <ul style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                  {s.recent.map((c, i) => (
                    <li key={i}>
                      {new Date(c.ts).toLocaleString()} — from: {c.referer}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
        {!loading && stats.length === 0 && (
          <p style={{ color: '#999' }}>No links yet — create one above.</p>
        )}
      </div>
    </main>
  );
}
