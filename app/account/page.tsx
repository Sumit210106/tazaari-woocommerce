"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, ShoppingBag, Download, MapPin, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'downloads' | 'addresses' | 'details'>('dashboard');

  useEffect(() => {
    // If not authenticated and finished loading, redirect to login
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F8F6' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-gold)' }} />
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'details', label: 'Account details', icon: User },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '110px', paddingBottom: '60px', backgroundColor: '#F9F8F6' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '40px', textAlign: 'center' }}>
          My Account
        </h1>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Sidebar Navigation */}
          <div style={{ width: '100%', maxWidth: '250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', 
                    backgroundColor: isActive ? '#111' : 'transparent',
                    color: isActive ? '#fff' : 'var(--color-primary)',
                    border: '1px solid',
                    borderColor: isActive ? '#111' : 'var(--color-border)',
                    borderRadius: '4px',
                    fontSize: '0.9rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className={isActive ? '' : 'hover-lift'}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
            
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', 
                backgroundColor: 'transparent',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                fontSize: '0.9rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer',
                marginTop: '16px'
              }}
              className="hover-lift"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#fff', padding: '40px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            
            {activeTab === 'dashboard' && (
              <div>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
                  Hello <strong>{user?.first_name || user?.email?.split('@')[0]}</strong> (not <strong>{user?.first_name || user?.email?.split('@')[0]}</strong>? <button onClick={handleLogout} style={{ color: 'var(--color-gold)', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>Log out</button>)
                </p>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  From your account dashboard you can view your <button onClick={() => setActiveTab('orders')} style={{ color: 'var(--color-gold)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>recent orders</button>, 
                  manage your <button onClick={() => setActiveTab('addresses')} style={{ color: 'var(--color-gold)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>shipping and billing addresses</button>, 
                  and <button onClick={() => setActiveTab('details')} style={{ color: 'var(--color-gold)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}>edit your password and account details</button>.
                </p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px' }}>Orders</h2>
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#F9F8F6', borderRadius: '4px' }}>
                  <ShoppingBag size={40} style={{ color: 'var(--color-border)', margin: '0 auto 16px' }} />
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>No order has been made yet.</p>
                  <Link href="/shop" className="btn-gold" style={{ padding: '10px 24px', display: 'inline-block' }}>
                    Browse Products
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '8px' }}>Addresses</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>The following addresses will be used on the checkout page by default.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      Billing address
                    </h3>
                    {user?.billing?.first_name ? (
                      <address style={{ fontStyle: 'normal', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                        {user.billing.first_name} {user.billing.last_name}<br/>
                        {user.billing.address_1}<br/>
                        {user.billing.address_2 && <>{user.billing.address_2}<br/></>}
                        {user.billing.city}, {user.billing.state} {user.billing.postcode}<br/>
                        {user.billing.country}
                      </address>
                    ) : (
                      <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>You have not set up this type of address yet.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      Shipping address
                    </h3>
                    {user?.shipping?.first_name ? (
                      <address style={{ fontStyle: 'normal', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                        {user.shipping.first_name} {user.shipping.last_name}<br/>
                        {user.shipping.address_1}<br/>
                        {user.shipping.address_2 && <>{user.shipping.address_2}<br/></>}
                        {user.shipping.city}, {user.shipping.state} {user.shipping.postcode}<br/>
                        {user.shipping.country}
                      </address>
                    ) : (
                      <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>You have not set up this type of address yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'downloads' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px' }}>Downloads</h2>
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#F9F8F6', borderRadius: '4px' }}>
                  <p style={{ color: 'var(--color-text-muted)' }}>No downloads available yet.</p>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px' }}>Account Details</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Your email is: <strong>{user?.email}</strong></p>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '16px', fontSize: '0.9rem' }}>
                  Note: Updating passwords and account details must be done through checkout or via the main WordPress backend currently.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
