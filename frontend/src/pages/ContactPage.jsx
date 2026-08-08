import React, { useState } from 'react';
import { PhoneCallIcon, EnvelopeIcon, LocationPinIcon, CheckIcon } from '../components/icons/Icons';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    course: 'Select a course',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          course: 'Select a course',
          message: ''
        });
      }, 3500);
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-16">
      
      {/* SECTION 1: Hero Banner Header */}
      <div className="relative bg-slate-900 text-white py-20 sm:py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1200&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-950/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center">
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            <div className="grid grid-cols-2 gap-1.5 p-2 border border-white/30 rounded-xl backdrop-blur-xs bg-white/5">
              <span className="text-white text-base">@</span>
              <span className="text-white text-base">📞</span>
              <span className="text-white text-base">✉️</span>
              <span className="text-white text-base">👆</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
              CONTACT US
            </h1>

          </div>
        </div>
      </div>

      {/* SECTION 2: 3 Info Cards Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Call Us */}
          <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#1c3c78] text-white flex items-center justify-center shadow-md">
              <PhoneCallIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Call Us
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 font-medium space-y-1">
              <p>+27 82 496 7256</p>
              <p>+27 72 035 4787</p>
            </div>
          </div>

          {/* Card 2: Mail Us */}
          <div data-aos="fade-up" data-aos-delay="200" className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#1c3c78] text-white flex items-center justify-center shadow-md">
              <EnvelopeIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Mail Us
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 font-medium">
              <p>info@crmisa.co.za</p>
            </div>
          </div>

          {/* Card 3: Address */}
          <div data-aos="fade-up" data-aos-delay="300" className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-md">
              <LocationPinIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Address
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 font-medium">
              <p>Pivot office Montecasino Fourways, 2191</p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: Google Map & Contact Form with Equal Height Stretch */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Google Map Embed (Equal Height) */}
          <div data-aos="fade-right" className="md:col-span-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative h-full min-h-[500px] bg-slate-100 flex flex-col">
            <iframe
              title="CRMISA Sandton Office Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.281140921021!2d28.010188676288675!3d-26.024220057980507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9576b567d264e1%3A0xb3cf51d8db00dfdf!2sThe%20Pivot%20Conference%20Centre!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[500px] grow object-cover"
            />
          </div>

          {/* Right Column: Contact Form Card (Equal Height) */}
          <div data-aos="fade-left" className="md:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 h-full flex flex-col justify-between">
            {submitted ? (
              <div className="py-12 text-center space-y-4 my-auto animate-fade-in">
                <div className="w-16 h-16 bg-[#1c3c78] text-white rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
                  <CheckIcon className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-black text-slate-900">Message Sent!</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto">
                  Thank you for reaching out to CRMISA. Our trade advisors will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 my-auto">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
                  />
                </div>

                {/* Select Course Interested */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Course Interested
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:ring-1 focus:ring-[#1c3c78]"
                  >
                    <option value="Select a course">Select a course</option>
                    <option value="Import & Export Full Course">Import & Export Full Course (R15 000)</option>
                    <option value="International Trade Bodies">International Trade Bodies (R3 000)</option>
                    <option value="Incoterms">Incoterms (R3 000)</option>
                    <option value="Modes of Transport">Modes of Transport (R3 000)</option>
                    <option value="Export and Import Procedures">Export and Import Procedures (R3 000)</option>
                    <option value="Customs Procedures">Customs Procedures (R3 000)</option>
                    <option value="Cross Trades Module">Cross Trades Module (R3 000)</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
                  />
                </div>

                {/* Submit Navy Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold rounded-lg shadow-md transition-colors text-sm"
                  >
                    {processing ? 'Submitting...' : 'Submit'}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
