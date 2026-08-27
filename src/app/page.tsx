'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'1bed' | '2bed' | 'bath' | 'outdoor' | 'all'>('1bed');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    // 1-BEDROOM SUITE
    {
      title: '1-Bed Open Living & Kitchen Island',
      category: '1bed',
      subtitle: 'Historic Exposed Brick Chimney, Sleek Dark Island & Open-Concept Layout',
      src: '/apt-main.jpg',
      badge: '1-Bedroom Suite'
    },
    {
      title: '1-Bed Primary Bedroom Suite',
      category: '1bed',
      subtitle: 'Whitewashed Brick Wall, Mounted Flat Screen & Built-In Executive Desk',
      src: '/room-apt.jpg',
      badge: '1-Bedroom Suite'
    },
    {
      title: 'Sliding Barn Door & Dining Nook',
      category: '1bed',
      subtitle: 'Custom Matte Black Sliding Barn Door with Contemporary High-Top Seating',
      src: '/sliding-door.jpg',
      badge: 'Designer Interior'
    },

    // 2-BEDROOM SUITE
    {
      title: '2-Bed Kitchen & Stainless Suite',
      category: '2bed',
      subtitle: 'Whirlpool Stainless Appliance Suite, Modern Cabinetry & Full Exposed Brick Accent Wall',
      src: '/2bed-kitchen.jpg',
      badge: '2-Bedroom Suite'
    },
    {
      title: '2-Bed Primary Bedroom',
      category: '2bed',
      subtitle: 'Queen-Sized Residence featuring Recessed Lighting & Modern Ceiling Fan',
      src: '/2bed-bedroom-primary.jpg',
      badge: 'Primary Bedroom'
    },
    {
      title: '2-Bed Second Bedroom & Workstation',
      category: '2bed',
      subtitle: 'Spacious Layout with Built-In Home Office Desk & Closet Storage',
      src: '/2bed-bedroom-second.jpg',
      badge: '2-Bed Bedroom'
    },
    {
      title: 'Exposed Brick Hallway Gallery',
      category: '2bed',
      subtitle: 'Dramatic Brick Architectural Corridor with Recessed Ceiling Lighting',
      src: '/2bed-brickhall.jpg',
      badge: 'Character Finishes'
    },
    {
      title: 'In-Unit Smart Washer & Dryer',
      category: '2bed',
      subtitle: 'Integrated LG ThinQ Combo High-Efficiency Front-Load Smart Laundry',
      src: '/2bed-laundry.jpg',
      badge: 'In-Unit Laundry'
    },
    {
      title: '2-Bed Living & Lounge Suite',
      category: '2bed',
      subtitle: 'Wide Plank Flooring, Modern Ceiling Fan & Wall-Mounted Entertainment Display',
      src: '/2bed-living-angle.jpg',
      badge: 'Living Space'
    },

    // BATHROOMS
    {
      title: 'Master Bath LED Smart Vanity',
      category: 'bath',
      subtitle: 'Backlit Touch LED Anti-Fog Mirror, Quartz Top & Slate Grey Shaker Vanity',
      src: '/2bed-bath-vanity.jpg',
      badge: 'Luxury Bath'
    },
    {
      title: 'Deep Soaking Tub & Rainfall Shower',
      category: 'bath',
      subtitle: 'Porcelain Marble Surround, Brushed Nickel Fixtures & Rainfall Showerhead',
      src: '/2bed-tub.jpg',
      badge: 'Spa Bath'
    },
    {
      title: '1-Bed Contemporary Bath',
      category: 'bath',
      subtitle: 'Carrara Marble Vanity, Mosaic Backsplash & Natural Light Accent Window',
      src: '/shower-apt.jpg',
      badge: '1-Bed Bath'
    },

    // DECKS & AMENITIES
    {
      title: 'Private Cedar Rooftop / Rear Deck',
      category: 'outdoor',
      subtitle: 'Dedicated Outdoor Living and Dining Deck with Open Skyline Views',
      src: '/2bed-deck.jpg',
      badge: 'Outdoor Space'
    },
    {
      title: 'Covered Carport & Outdoor Space',
      category: 'outdoor',
      subtitle: 'Protected under-deck parking port and outdoor utility area',
      src: '/2bed-underdeck-parking.jpg',
      badge: 'Parking & Outdoor'
    }
  ];

  const filteredGallery = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-stone-200 selection:text-stone-900">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#FDFBF7]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-stone-200 bg-white p-1.5 flex items-center justify-center shadow-sm">
              <Image 
                src="/logo.png" 
                alt="Bermuda Stone Properties" 
                width={36} 
                height={36} 
                className="object-contain" 
              />
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-wide block text-stone-800">BERMUDA STONE</span>
              <span className="text-[11px] tracking-widest uppercase text-stone-500 font-medium block">Properties LLC</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#amenities" className="hover:text-stone-900 transition-colors">Features</a>
            <a href="#gallery" className="hover:text-stone-900 transition-colors">Photo Tours</a>
            <a href="#contact" className="hover:text-stone-900 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl shadow-sm transition-all"
            >
              Resident Login
            </Link>
            <Link 
              href="/admin/login" 
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition-all"
            >
              Owner Portal
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-[#FDFBF7] via-stone-100/50 to-[#FDFBF7] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-stone-500"></span>
              Boutique Residences · Philadelphia
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-stone-900 tracking-tight leading-[1.15]">
              Modern living with <span className="italic font-normal text-stone-700">timeless character</span>.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              Thoughtfully restored apartments featuring original brick architecture, contemporary interior design, keyless entry, and convenient resident digital management.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a 
                href="#gallery" 
                className="w-full sm:w-auto px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl shadow-md transition-all text-center text-sm"
              >
                View Apartment Tours
              </a>
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-medium border border-stone-300 rounded-xl shadow-sm transition-all text-center text-sm"
              >
                Resident Portal & Rent Pay
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image 
                src="/2bed-kitchen.jpg" 
                alt="Bermuda Stone Residences" 
                fill 
                className="object-cover object-center" 
                priority
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">Featured Residence</p>
                  <p className="text-stone-900 font-serif font-bold text-base">2-Bedroom Suite & Kitchen</p>
                </div>
                <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200">Tour Ready</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* GALLERY & UNITS TOUR */}
      <section id="gallery" className="py-24 border-b border-stone-200 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-stone-500 mb-2">Interior Portfolio</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">Apartment Tours & Finishes</h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <button
                onClick={() => setActiveTab('1bed')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === '1bed' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
              >
                1-Bedroom Unit
              </button>
              <button
                onClick={() => setActiveTab('2bed')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === '2bed' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
              >
                2-Bedroom Unit
             </button>
              <button
                onClick={() => setActiveTab('bath')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === 'bath' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
              >
                Bathrooms
              </button>
              <button
                onClick={() => setActiveTab('outdoor')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === 'outdoor' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
              >
                Decks, Parking & Amenities
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === 'all' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
              >
                All Views ({galleryItems.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGallery.map((item, index) => (
              <div 
                key={index}
                onClick={() => setSelectedImage(item.src)}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-72 w-full overflow-hidden bg-stone-100">
                  <Image 
                    src={item.src} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-white/95 text-stone-800 border border-stone-200/80 rounded-full backdrop-blur-md shadow-sm">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-1.5 group-hover:text-stone-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-xs font-normal leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-500">
                    <span>Click to enlarge photo</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-[85vh] rounded-3xl overflow-hidden border border-stone-700 shadow-2xl bg-black">
            <Image 
              src={selectedImage} 
              alt="Enlarged View" 
              fill 
              className="object-contain"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-stone-900 rounded-full px-4 py-2 hover:bg-stone-100 border border-stone-300 text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* AMENITIES */}
      <section id="amenities" className="py-24 bg-stone-100/50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase font-bold tracking-widest text-stone-500 mb-2">Designed For Comfort</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">Key Property Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl font-bold mb-5">🧺</div>
              <h3 className="font-serif text-base font-bold text-stone-900 mb-2">In-Unit Smart Laundry</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                LG ThinQ high-efficiency front-loading washer and dryer equipped directly in unit.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl font-bold mb-5">🌿</div>
              <h3 className="font-serif text-base font-bold text-stone-900 mb-2">Deck & Carport</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Private cedar rear luxury deck plus protected under-deck carport space.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl font-bold mb-5">💡</div>
              <h3 className="font-serif text-base font-bold text-stone-900 mb-2">LED Spa Bathrooms</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Touch backlit anti-fog vanity mirrors, porcelain surrounds & rainfall heads.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl font-bold mb-5">🔐</div>
              <h3 className="font-serif text-base font-bold text-stone-900 mb-2">Keyless Electronic Access</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Secure digital keypads, responsive maintenance dispatch & 24/7 online rent pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & PORTAL ACCESS */}
      <section id="contact" className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase font-bold tracking-widest text-stone-500 mb-2">Connect With Us</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-6">
              Inquire About Available Residences
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8 text-sm">
              We look for quality residents who value well-kept homes and clear communication. Contact us regarding upcoming availability, lease requirements, or showings.
            </p>
            <div className="space-y-4 text-sm text-stone-700 font-medium">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm">📍</div>
                <span>Philadelphia, PA</span>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm">✉️</div>
                <span>management@bermudastone.com</span>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-lg">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Resident & Owner Access</h3>
            <p className="text-stone-600 text-sm mb-6">Current tenant or property owner? Access your account below.</p>
            
            <div className="space-y-3.5">
              <Link 
                href="/login" 
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all font-medium text-stone-900 group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-base shadow-sm border border-stone-200/80">🔑</span>
                  <span>Resident Portal Login</span>
                </div>
                <span className="text-stone-400 group-hover:translate-x-1 group-hover:text-stone-800 transition-all">→</span>
              </Link>

              <Link 
                href="/admin/login" 
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all font-medium text-stone-900 group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-base shadow-sm border border-stone-200/80">⚙️</span>
                  <span>Landlord & Owner Console</span>
                </div>
                <span className="text-stone-400 group-hover:translate-x-1 group-hover:text-stone-800 transition-all">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-stone-200 bg-white text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-stone-200 bg-white p-0.5 flex items-center justify-center shadow-sm">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={20} 
                height={20} 
                className="object-contain" 
              />
            </div>
            <span>© {new Date().getFullYear()} Bermuda Stone Properties LLC. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/login" className="hover:text-stone-800 transition-colors">Tenant Login</Link>
            <Link href="/admin/login" className="hover:text-stone-800 transition-colors">Admin</Link>
            <a href="mailto:management@bermudastone.com" className="hover:text-stone-800 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
