import React, { useState } from 'react';
import { SearchIcon, CheckIcon, CartIcon, HeartIcon } from '../components/icons/Icons';

export default function CoursesPage({ onOpenEnrol, onAddToCart, onAddToWishlist }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      id: 1,
      title: "Import & Export Full Masterclass Course",
      category: "Full Certification",
      duration: "12 Weeks",
      price: "R15 000",
      rating: "4.9 ★★★★★ (184 reviews)",
      description: "Complete end-to-end training covering customs, shipping modes, tariffs, supplier negotiation, and free company registration bonus.",
      featured: true,
      perks: ["FREE Registered Company", "FREE E-Commerce Website", "SAD500 Customs Guide"]
    },
    {
      id: 2,
      title: "Customs Procedures & Documentation Mastery",
      category: "Customs & Compliance",
      duration: "4 Weeks",
      price: "R4 500",
      rating: "4.8 ★★★★★ (92 reviews)",
      description: "Master South African revenue services (SARS) customs clearance, EUR.1 certificates, bills of lading, and tariff classifications.",
      featured: false,
      perks: ["SARS Clearance Templates", "Tariff Search Matrix"]
    },
    {
      id: 3,
      title: "Calculating Landed Costs & Pricing Strategies",
      category: "Finance & Costing",
      duration: "3 Weeks",
      price: "R3 800",
      rating: "4.9 ★★★★★ (67 reviews)",
      description: "Never lose money on shipments. Learn step-by-step formulas for currency exchange, insurance, duty taxes, and profit margins.",
      featured: false,
      perks: ["Automated Cost Excel Calculator", "Incoterms 2020 Chart"]
    },
    {
      id: 4,
      title: "Setting Up Overseas Trade Networks & Agents",
      category: "Sourcing & Logistics",
      duration: "4 Weeks",
      price: "R4 200",
      rating: "4.7 ★★★★★ (51 reviews)",
      description: "How to verify genuine suppliers in Asia, Europe, and Americas, avoid scammers, and negotiate freight container rates.",
      featured: false,
      perks: ["Verified Supplier Directory", "Contract Agreement Kit"]
    }
  ];

  const categories = ["All", "Full Certification", "Customs & Compliance", "Finance & Costing", "Sourcing & Logistics"];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-crmisa-navy uppercase tracking-widest bg-crmisa-lightBlue px-3.5 py-1 rounded-full">
            CRMISA Curriculum
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase">
            Import & Export Masterclasses
          </h1>
          <p className="text-sm text-slate-600">
            Learn practical, real-world international trade skills with South Africa's premier academy.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-crmisa-navy text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-crmisa-navy focus:outline-none"
            />
          </div>

        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <div 
              key={course.id}
              className={`bg-white rounded-2xl border ${
                course.featured ? 'border-2 border-crmisa-navy shadow-xl' : 'border-slate-200 shadow-md'
              } p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1`}
            >
              {course.featured && (
                <div className="absolute top-4 right-4 bg-crmisa-navy text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
                  Flagship Course
                </div>
              )}

              <div className="space-y-3">
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  {course.category} • {course.duration}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {course.title}
                </h3>
                <div className="text-xs text-amber-500 font-bold">
                  {course.rating}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {course.description}
                </p>

                {/* Perks Checklist */}
                <div className="pt-2 space-y-1.5">
                  {course.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center text-xs font-semibold text-slate-700">
                      <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-crmisa-navy">{course.price}</span>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Tuition Fee</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAddToWishlist(course)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 transition-colors"
                    title="Add to Wishlist"
                  >
                    <HeartIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      onAddToCart(course);
                      onOpenEnrol();
                    }}
                    className="px-5 py-2.5 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-extrabold rounded-xl shadow text-xs transition-all"
                  >
                    Enrol Now &gt;&gt;
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
