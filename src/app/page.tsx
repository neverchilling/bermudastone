'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'living' | 'bedroom' | 'bath'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    {
      title: 'Open Living Room & Kitchen',
      category: 'living',
      subtitle: 'Original Exposed Brick, Modern Kitchen Island & Hardwood Finish Flooring',
      src: '/apt-main.jpg',
      badge: 'Featured Suite'
    },
    {
      title: 'Primary Bedroom Suite',
      category: 'bedroom',
      subtitle: 'White Brick Feature Wall, Wall-Mounted Smart TV & Built-in Workstation',
      src: '/room-apt.jpg',
      badge: 'Spacious Layout'
    },
    {
      title: 'Dining Nook & Barn Door Entry',
      category: 'living',
      subtitle: 'Custom Matte Black Sliding Barn Door & High-Top Seating Area',
      src: '/sliding-door.jpg',
      badge: 'Designer Finishes'
    },
    {
      title: 'Contemporary Spa Bathroom',
      category: 'bath',
      subtitle: 'Carrara Marble Vanity, Mosaic Tile Backsplash & Glass Tiled Walk-In Shower',
      src: '/shower-apt.jpg',
      badge: 'Renovated'
    }
  ];

  const filteredGallery = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 p-1 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Bermuda Stone Properties" 
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
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#amenities" className="hover:text-white transition-colors">Amenities</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-all"
            >
              Resident Login
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

      {/* HERO */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden border-b border-neutral-800/60">
        <div className="absolute inset-0 z-0 opacity-25">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent z-10" />
          <Image 
            src="/apt-main.jpg" 
            alt="Main Apartment View" 
            fill 
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Modern Boutique Residences
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Elevated Living With <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Timeless Character</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Thoughtfully restored apartments featuring original brick architecture, contemporary interior design, keyless entry, and convenient resident digital management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#gallery" 
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all text-center"
            >
              View Apartment Tour
            </a>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium border border-neutral-700 rounded-xl transition-all text-center"
            >
              Resident Portal & Rent Pay
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">Apartment Tour</h2>
              <p className="text-3xl font-bold text-white tracking-tight">Interior Gallery & Highlights</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'all' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                All Photos
              </button>
              <button
                onClick={() => setActiveTab('living')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'living' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                Living & Dining
              </button>
              <button
                onClick={() => setActiveTab('bedroom')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'bedroom' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                Bedroom
              </button>
              <button
                onClick={() => setActiveTab('bath')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'bath' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                Bath
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredGallery.map((item, index) => (
              <div 
                key={index}
                onClick={() => setSelectedImage(item.src)}
                className="group relative h-96 sm:h-[460px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer shadow-lg hover:border-neutral-700 transition-all"
              >
                <Image 
                  src={item.src} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/25 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-900/90 text-emerald-400 border border-neutral-700/80 rounded-full backdrop-blur-sm shadow">
                    {item.badge}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-300 text-sm font-light leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-[80vh] rounded-2xl overflow-hidden border border-neutral-800">
            <Image 
              src={selectedImage} 
              alt="Enlarged View" 
              fill 
              className="object-contain"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-neutral-900/90 text-white rounded-full px-4 py-2 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold uppercase tracking-wider"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* AMENITIES */}
      <section id="amenities" className="py-24 bg-neutral-900/40 border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">Designed For Living</h2>
            <p className="text-3xl font-bold text-white tracking-tight">Key Property Features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="text-lg font-bold text-whib-2">Digital Resident Portal</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Pay rent with one click via Debit, Credit, or ACH. View your payment ledger, charges, and real-time receipts.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="text-3xl mb-4">🛠️</div>
              <h3 className="text-lg font-bold text-white mb-2">Responsive Maintenance</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Direct online ticket dispatch with real-time updates and emergency support directly managed by local owners.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Keyless Living</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Secure electronic keypad access, well-lit entries, and climate-controlled living spaces for modern comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & PORTAL ACCESS */}
      <section id="contact" className="py-24 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">Connect With Us</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              Inquire About Available Residences
            </p>
            <p className="text-neutral-400 leading-relaxed mb-8">
              We look for quality residents who value well-kept homes and clear communication. Contact us regarding upcoming availability, lease requirements, or showings.
            </p>
            <div className="space-y-4 text-sm text-neutral-300">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">📍</span>
                <span>Philadelphia, PA</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✉️</span>
                <span>management@bermudastone.com</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Resident Access</h3>
            <p className="text-neutral-400 text-sm mb-6">Current tenant or property manager? Log into your portal below.</p>
            
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
                  <span>Landlord Console</span>
                </div>
                <span className="text-neutral-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-neutral-800/80 bg-neutral-950 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="opacity-80" />
            <span>© {new Date().getFullYear()} Bermuda Stone Properties LLC. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-neutral-300">Tenant Login</Link>
            <Link href="/admin/login" className="hover:text-neutral-300">Admin</Link>
            <a href="mailto:management@bermudastone.com" className="hover:text-neutral-300">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
