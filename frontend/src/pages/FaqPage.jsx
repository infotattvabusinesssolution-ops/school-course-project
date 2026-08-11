import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ChevronDown, ArrowLeft, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqPage() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqData = [
    {
      category: "General Course Questions",
      items: [
        { q: "What is this course about?", a: "This course provides comprehensive training on starting and managing an import/export business, including logistics, customs, and global trade compliance." },
        { q: "Who is this course for?", a: "It is designed for aspiring entrepreneurs, existing business owners, and professionals looking to enter the global trade market." },
        { q: "Do I need any prior experience in trade or business?", a: "No prior experience is necessary. The course takes you from complete basics to advanced trade strategies." },
        { q: "What countries or regions does the course focus on?", a: "While the principles apply globally, there is a specific focus on the African market, cross-border trade, and international standards." },
        { q: "How long is the course?", a: "The course is self-paced. Most students complete it in 4 to 6 weeks depending on their availability." }
      ]
    },
    {
      category: "Content & Curriculum",
      items: [
        { q: "What topics are covered in the course?", a: "We cover product selection, finding suppliers/buyers, logistics, Incoterms, customs clearance, and trade finance." },
        { q: "Is this a practical or theoretical course?", a: "It is highly practical, featuring real-world examples, actionable steps, and templates you can use immediately." },
        { q: "Will I learn how to find international buyers and suppliers?", a: "Yes, you will learn proven strategies and use specific directories to find and vet global partners." },
        { q: "Will I be able to start my own import/export business after the course?", a: "Absolutely. The course provides all the knowledge required, plus a free registered company and website." },
        { q: "Do you provide real-world examples or case studies?", a: "Yes, our modules are packed with real-life case studies and practical scenarios from experienced traders." }
      ]
    },
    {
      category: "Enrollment & Access",
      items: [
        { q: "How do I register for the course?", a: "Click on 'Enroll Now' anywhere on the site, create an account, and complete the secure payment process." },
        { q: "What happens after I register?", a: "You gain instant access to your student dashboard, video lessons, and downloadable resources." },
        { q: "Is the course self-paced?", a: "Yes, you can watch the videos and complete the quizzes on your own schedule." },
        { q: "Do I get a certificate after completion?", a: "Yes, upon 100% completion, you receive an official, verifiable Certificate from CRMISA." },
        { q: "How long do I have access to the course materials?", a: "You get full, ongoing access to all current course materials and resources." }
      ]
    },
    {
      category: "Support & Community",
      items: [
        { q: "Will I get support during the course?", a: "Yes, our instructors and support team are available to answer your questions via the Q&A section." },
        { q: "Is there a community or group I can join?", a: "Students get access to our dedicated community forum to network and share insights." },
        { q: "Can I ask questions or get feedback on my trade ideas?", a: "Yes! Our platform encourages direct interaction with experts to refine your business plans." }
      ]
    },
    {
      category: "Payments & Refunds",
      items: [
        { q: "How much does the course cost?", a: "Pricing is listed on our Courses page and varies based on specific modules and offers." },
        { q: "Is there a refund policy?", a: "Due to the digital nature of the course and immediate access to resources, refunds are evaluated on a case-by-case basis." },
        { q: "Will I learn how to register an import-export business legally?", a: "Yes, and we even assist in providing a registered company for you upon completion." },
        { q: "Does the course cover customs procedures and documentation?", a: "We provide comprehensive guides and templates for all major customs documents." },
        { q: "Will I learn about Incoterms and how to use them correctly?", a: "Yes, a dedicated module covers Incoterms and how they affect pricing and liability." },
        { q: "Does the course explain how to calculate landed cost or profit margins?", a: "Yes, detailed financial templates and formulas are provided to ensure profitability." },
        { q: "Will you teach how to avoid scams or fraud in international trade?", a: "We cover extensive vetting processes and safe payment methods to protect your business." }
      ]
    },
    {
      category: "Trade Finance & Payments",
      items: [
        { q: "Does the course explain how to get paid safely when exporting?", a: "Yes, we teach you how to use Letters of Credit and secure escrow services." },
        { q: "Can I learn how to get trade finance or export funding?", a: "We outline options for securing capital, including government grants and trade finance institutions." },
        { q: "Will the course show how to handle currency exchange risks?", a: "Yes, we cover hedging strategies and multi-currency accounts." },
        { q: "Do you cover online payment platforms or escrow services for global deals?", a: "We introduce reliable international payment gateways and platforms for secure trade." },
        { q: "Is there any content on negotiating trade deals or contracts?", a: "Negotiation tactics and contract structuring are vital parts of our curriculum." }
      ]
    },
    {
      category: "Product & Market Strategy",
      items: [
        { q: "Will I learn how to choose the right product to import or export?", a: "Yes, we teach product viability analysis and market research techniques." },
        { q: "Do you cover compliance with international standards (CE, FDA, ISO)?", a: "We guide you on how to research and meet specific international product standards." },
        { q: "Can I export agricultural or handmade products from Africa?", a: "Absolutely, we have modules tailored to exporting regional goods to global markets." },
        { q: "Is there a strategy for selling products on Amazon or online marketplaces?", a: "We discuss e-commerce integration and direct-to-consumer international strategies." },
        { q: "Will I learn how to participate in international trade fairs or expos?", a: "Yes, we provide tips on networking, exhibiting, and maximizing ROI at trade shows." }
      ]
    },
    {
      category: "Logistics & Practical Tools",
      items: [
        { q: "Do you teach how to choose a freight forwarder or shipping agent?", a: "We explain exactly what to look for and how to negotiate rates with forwarders." },
        { q: "Can I learn how to track a container shipment?", a: "Yes, tracking tools and Bill of Lading fundamentals are fully explained." },
        { q: "Do you offer templates like contracts, invoices, and quotations?", a: "Yes, the course includes a full suite of downloadable, ready-to-use business templates." },
        { q: "Will I be able to build a real trade plan by the end of the course?", a: "Yes, step-by-step guidance ensures you have a complete, actionable business plan." },
        { q: "Is this course updated regularly with the latest trends and regulations?", a: "We continuously update the material to reflect current global trade regulations." }
      ]
    },
    {
      category: "Learning Outcomes & Career Goals",
      items: [
        { q: "Will this course help me get a job in an import-export company?", a: "The practical knowledge and certification make you a strong candidate for logistics and trade roles." },
        { q: "Can I start a side business while working full time?", a: "Yes, the self-paced nature of the course makes it perfect for part-time entrepreneurs." },
        { q: "Does the course teach export from small African countries?", a: "The core principles are universal, and we focus heavily on the African context." },
        { q: "Is this course relevant if I live in a landlocked country?", a: "Yes, we cover multi-modal transport including road and rail logistics for landlocked regions." },
        { q: "Can I focus only on importing or only exporting?", a: "Yes, you can specialize in one area, though understanding both provides a massive advantage." }
      ]
    },
    {
      category: "Real-World Challenges",
      items: [
        { q: "What if I don’t have capital to start?", a: "We cover low-capital strategies like dropshipping, brokering, and securing buyer deposits." },
        { q: "What if I can’t find trusted suppliers?", a: "Our vetting techniques will teach you how to reliably verify suppliers before sending money." },
        { q: "Can I still export if I don’t own a factory or produce goods?", a: "Yes, acting as a merchant exporter or broker is one of the most common ways to trade." },
        { q: "How do I deal with language barriers in international trade?", a: "We share communication tips, translator tools, and standards to overcome language gaps." },
        { q: "What happens if goods are damaged or delayed during shipping?", a: "We cover marine insurance and risk management strategies to protect your investments." }
      ]
    },
    {
      category: "Tools & Technology",
      items: [
        { q: "Do I need special software to manage import-export business?", a: "No, we show you how to start with basic tools and introduce advanced software as you scale." },
        { q: "Is there an app or digital tool included with the course?", a: "You get access to our online platform, calculators, and digital resources." },
        { q: "Will I learn how to read trade data and HS Codes?", a: "HS Code classification and understanding tariffs is a core part of the curriculum." },
        { q: "Can I use AI to grow my import-export business?", a: "We touch upon modern tools and how technology can streamline market research." },
        { q: "Does the course teach how to use government portals like SARS, DGFT, or customs systems?", a: "We provide overviews of essential portals and guide you on where to register locally." }
      ]
    },
    {
      category: "Scaling, Marketing & Outreach",
      items: [
        { q: "Can I scale this into a multi-country operation?", a: "Yes, the strategies taught can be applied to build a massive global supply chain." },
        { q: "Will I learn how to market my products overseas?", a: "We cover B2B outreach, digital presence, and international marketing strategies." },
        { q: "Do you cover how to build a trade website or online profile?", a: "Yes, and as a bonus, we even provide a professional website when you complete the course." },
        { q: "Can I learn how to win government tenders or NGO supply deals?", a: "We introduce institutional supply strategies and bidding fundamentals." },
        { q: "Does this course offer networking opportunities or alumni access?", a: "Graduates join our exclusive alumni network for continued support and business partnerships." }
      ]
    }
  ];

  // Flatten the FAQs for searching, but keep category info
  const allFaqs = faqData.flatMap(category => 
    category.items.map(item => ({ ...item, category: category.category }))
  );

  const filteredFaqs = allFaqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered faqs back into categories for display
  const groupedFaqs = filteredFaqs.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support & Help</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Find quick answers to common questions about enrollment, payment, course access, and certificates.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-12">
          {Object.keys(groupedFaqs).length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-slate-500 text-sm">No questions found matching your search query.</p>
            </div>
          ) : (
            Object.keys(groupedFaqs).map((category, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">{category}</h2>
                <div className="space-y-3">
                  {groupedFaqs[category].map((faq, i) => {
                    const uniqueId = `${catIdx}-${i}`;
                    const isOpen = openIdx === uniqueId;
                    return (
                      <div
                        key={uniqueId}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-colors"
                      >
                        <button
                          onClick={() => setOpenIdx(isOpen ? null : uniqueId)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-base hover:bg-slate-50 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-slate-900" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
