"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is already authenticated, redirect them to account page
    if (isAuthenticated && !isLoading) {
      router.push('/account');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await login(email, password);
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F8F6' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-gold)' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '110px', paddingBottom: '60px', backgroundColor: '#F9F8F6' }}>
      <div className="container" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '32px', textDecoration: 'none' }}>
          <ChevronLeft size={16} />
          Back to store
        </Link>

        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Log in to your account to manage your orders and saved details.
            </p>
          </div>

          {error && (
            <div style={{ padding: '14px 18px', backgroundColor: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} style={{ color: '#C62828', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: '#C62828', fontWeight: 600 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-primary)' }}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-primary)' }}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold hover-lift"
              style={{ padding: '14px', width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
