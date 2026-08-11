import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Check, Send, ExternalLink } from 'lucide-react';
import { courseService } from '../../services/courseService';

export default function ContactSection() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    course: 'Select a course',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getPublishedCourses();
        setCourses(res.data?.courses || []);
      } catch (err) {
        console.error("Failed to load courses for contact form:", err);
      }
    };
    fetchCourses();
  }, []);

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
      }, 4000);
    }, 800);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-yellow-400"></div>
            <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
              Get In Touch
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight leading-[1.1] max-w-2xl">
            Contact Us
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-xl">
            Have questions about our certification courses or need trade advisory? Reach out to our expert team.
          </p>
        </div>

        {/* 3 Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Call Us */}
          <div data-aos="fade-up" data-aos-delay="100" className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex items-start gap-4 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Call Us</h3>
              <p className="text-sm text-slate-600 font-medium">+27 82 496 7256</p>
              <p className="text-sm text-slate-600 font-medium">+27 72 035 4787</p>
            </div>
          </div>

          {/* Card 2: Mail Us */}
          <div data-aos="fade-up" data-aos-delay="200" className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex items-start gap-4 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Mail Us</h3>
              <p className="text-sm text-slate-600 font-medium">info@crmisa.co.za</p>
            </div>
          </div>

          {/* Card 3: Location */}
          <div data-aos="fade-up" data-aos-delay="300" className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex items-start gap-4 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Visit Us</h3>
              <p className="text-sm text-slate-600 font-medium">Pivot office Montecasino Fourways, 2191</p>
            </div>
          </div>
        </div>

        {/* Map & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map Embed */}
          <div data-aos="fade-right" className="lg:col-span-6 rounded-xl overflow-hidden border border-slate-200 min-h-[420px] bg-slate-100 flex relative group">
            <iframe
              title="CRMISA Office Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.281140921021!2d28.010188676288675!3d-26.024220057980507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9576b567d264e1%3A0xb3cf51d8db00dfdf!2sThe%20Pivot%20Conference%20Centre!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[420px] object-cover"
            />
            <a
              href="https://www.google.com/maps/search/?api=1&query=The+Pivot+Conference+Centre,+1+Montecasino+Blvd,+Fourways,+Sandton,+2191,+South+Africa"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 sm:right-auto bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-md px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all border border-white/10 group-hover:scale-105"
            >
              <MapPin className="w-4 h-4 text-yellow-400" />
              <span>Open Location in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>
          </div>

          {/* Form */}
          <div data-aos="fade-left" className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            {submitted ? (
              <div className="py-12 text-center space-y-4 my-auto">
                <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">Message Sent!</h4>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">
                  Thank you for reaching out to CRMISA. Our trade advisors will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 my-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+27 82 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>

                  {/* Course Interested */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Course Interested
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-slate-900 transition-colors"
                    >
                      <option value="Select a course">Select a course</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c.title}>
                          {c.title} (R{c.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {processing ? (
                    'Submitting...'
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
