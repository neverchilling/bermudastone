'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'units' | 'neighborhood'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    {
      title: 'Duplex on Thompson - Unit A',
      category: 'units',
      subtitle: 'Modern Open-Concept Living & Stainless Finishes',
      src: '/bermuda-bg.png',
      badge: 'Available Now'
    },
    {
      title: 'Thompson Ave Residential Suite',
      category: 'units',
      subtitle: 'Premium Flooring & Recessed Architectural Lighting',
      src: '/bermudabackground.jpg',
      badge: 'Recently Renovated'
    },
    {
      title: 'Historic Neighborhood & Prime Access',
      category: 'neighborhood',
      subtitle: 'Steps from Public Transit, Dining & Key Corridors',
      src: '/philly-skyline.jpg',
      badge: 'Location'
    },
    {
      title: 'Executive Style Living',
      category: 'units',
      subtitle: 'Keyless Electronic Entry & High-Speed Connectivity',
      src: '/bermudacity.png',
      badge: 'Amenities'
    }
  ];

  const filteredGallery = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* --- STICKY NAVIGATION BAR --- */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 p-1 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Bermuda Stone Properties Logo" 
                width={36} 
                height={36} 
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider block text-white">BERMUDA STONE</span>
              <span className="text-[10px] tracking-widest uppercase text-emerald-400 font-semibold block -mt-1">Properties LLC</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#amenities" className="hover:text-white transition-colors">Amenities</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-all"
            >
              Resident Portal
            </Link>
            <Link 
              href="/admin/login" 
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all"
            >
              Owner Portal
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden border-b border-neutral-800/60">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent z-10" />
          <Image 
            src="/philly-skyline.jpg" 
            alt="City Background" 
            fill 
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Elevated Urban Living in Philadelphia
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Quality Residences Managed With <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Precision & Care</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Welcome to Bermuda Stone Properties. We provide thoughtfully maintained, modern apartment units with seamless digital rent payment, 24/7 maintenance tracking, and responsive local management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#gallery" 
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all text-center"
            >
              Explore Available Units
            </a>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium border border-neutral-700 rounded-xl transition-all text-center"
            >
              Sign In to Pay Rent
            </Link>
          </div>
        </div>
      </section>

      {/* --- AMENITIES & FEATURES --- */}
      <section id="amenities" className="py-24 bg-neutral-900/40 border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">Resident Experience</h2>
            <p className="text-3xl font-bold text-white tracking-tight">Built for Comfort & Convenience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mb-6">
                💳
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1-Click Online Payments</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Pay rent securely via debit card, credit card, or direct ACH transfer through Stripe. Real-time balance tracking and instant digital receipts.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all">
              <div classme="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Direct Maintenance Portal</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Submit service and maintenance tickets straight from your phone with priority emergency dispatch and status tracking from start to finish.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mb-6">
                🔒
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Keyless & Secure</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Individual keyless entry codes, well-lit exteriors, and professionally updated properties designed for peace of mind and effortless move-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- GALLERY & PROPERTIES --- */}
      <section id="gallery" className="py-24 border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">Our Portfolio</h2>
              <p className="text-3xl font-bold text-white tracking-tight">Spaces Designed for Living</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'all' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                All Views
              </button>
              <button
                onClick={() => setActiveTab('units')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'units' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                Units & Interiors
              </button>
              <button
                onClick={() => setActiveTab('neighborhood')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'neighborhood' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                Neighborhood
              </button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredGallery.map((item, index) => (
              <div 
                key={index}
                onClick={() => setSelectedImage(item.src)}
                className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer shadow-md"
              >
                <Image 
                  src={item.src} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-900/90 text-emerald-400 border border-neutral-700/80 rounded-full backdrop-blur-sm">
                    {item.badge}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-300 text-sm font-light">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-[75vh] rounded-2xl overflow-hidden border border-neutral-800">
            <Image 
              src={selectedImage} 
              alt="Enlarged View" 
              fill 
              className="object-contain"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-neutral-900/80 text-white rounded-full p-3 hover:bg-neutral-800 border border-neutral-700 text-sm font-bold"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* --- ABOUT & CONTACT SECTION --- */}
      <section id="contact" className="py-24 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">Inquire & Connect</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              Interested in Leasing a Bermuda Stone Residence?
            </p>
            <p className="text-neutral-400 leading-relaxed mb-8">
              We look for quality, long-term tenants who appreciate well-kept homes and seamless communication. Contact our leasing office for upcoming vacancies, application requirements, and scheduled showings.
            </p>
            <div className="space-y-4 text-sm text-neutral-300">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">📍</span>
                <span>Philadelphia, Pennsylvania</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✉️</span>
                <span>management@bermudastone.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">⚡</span>
                <span>Direct portal support active 7 days a week</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Resident Quick Access</h3>
            <p className="text-neutral-400 text-sm mb-6">Already lease with us? Jump directly to your account services below.</p>
            
            <div className="space-y-3">
              <Link 
                href="/login" 
                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 transition-all font-medium text-white group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 text-lg">🔑</span>
                  <span>Resident Portal Login</span>
                </div>
                <span className="text-neutral-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link 
                href="/admin/login" 
                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-800/60 hover:bg-neutral-750 border border-neutral-700/60 transition-all font-medium text-neutral-300 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400 text-lg">⚙️</span>
                  <span>Landlord & Admin Console</span>
                </div>
                <span className="text-neutral-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-neutral-800/80 bg-neutral-950 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="opacity-80" />
            <span>© {new Date().getFullYear()} Bermuda Stone Properties LLC. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-neutral-300">Tenant Portal</Link>
            <Link href="/admin/login" className="hover:text-neutral-300">Admin Console</Link>
            <a href="mailto:management@bermudastone.com" className="hover:text-neutral-300">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
