import React, { useState } from 'react';
import { UserIcon } from '../components/icons/Icons';
import CreatePostModal from '../components/CreatePostModal';

export default function ForumPage({ onSelectPost }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [questionText, setQuestionText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Gyana Singh",
      category: "Import",
      time: "2 hours ago",
      question: "What are the key documents required for SARS SAD500 customs clearance in Durban port?",
      details: "I am importing a 20ft container of electronics from Guangzhou to Durban harbor and need clarification on duty rates and SAD500 processing timelines.",
      replies: 3
    },
    {
      id: 2,
      author: "Thandi M",
      category: "Export",
      time: "1 day ago",
      question: "Which Incoterm is recommended when exporting perishable produce to the EU via air freight?",
      details: "We are shipping fresh avocados from Johannesburg to Frankfurt and want to minimize risk allocation.",
      replies: 5
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Posts', icon: 'list', count: posts.length },
    { id: 'general', name: 'General', icon: 'tag', count: posts.filter(p => p.category === 'General').length },
    { id: 'import', name: 'Import', icon: 'tag', count: posts.filter(p => p.category === 'Import').length },
    { id: 'export', name: 'Export', icon: 'tag', count: posts.filter(p => p.category === 'Export').length },
  ];

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: "Gyana Singh",
      category: activeCategory === 'all' ? 'General' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1),
      time: "Just now",
      question: questionText,
      replies: 0
    };

    setPosts([newPostObj, ...posts]);
    setQuestionText('');
  };

  const handleAddModalPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-16">
      
      {/* Dark Port Crane Hero Banner matching Image */}
      <div className="relative bg-slate-900 text-white py-16 sm:py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Forum
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Categories Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              
              <h3 className="text-sm font-bold text-slate-900">
                Categories
              </h3>

              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        {cat.icon === 'list' ? (
                          <svg className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        ) : (
                          <svg className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-800'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.266 0 .52.105.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>{cat.name}</span>
                      </div>

                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Column: Ask A Question Card & Posts Feed */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            
            {/* Ask A Question Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
              
              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="flex items-center space-x-3">
                  
                  <div className="w-10 h-10 rounded-full border-2 border-slate-300 bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-700">
                    <UserIcon className="w-6 h-6 text-slate-600" />
                  </div>

                  <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ask A Question"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1c3c78] focus:bg-white"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1c3c78] hover:bg-crmisa-navy text-white text-xs sm:text-sm font-extrabold rounded-lg shadow-xs transition-colors"
                  >
                    Post
                  </button>

                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Post</span>
                  </button>

                  <span className="text-[11px] text-slate-400 font-medium">
                    Click post or enter to publish question
                  </span>
                </div>
              </form>

            </div>

            {/* Forum Posts List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                  No questions in this category yet. Be the first to ask!
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div 
                    key={post.id} 
                    onClick={() => onSelectPost && onSelectPost(post)}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-[#1c3c78] group-hover:text-blue-600 transition-colors">{post.author}</span>
                        <span className="text-slate-400">•</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{post.category}</span>
                      </div>
                      <span className="text-slate-400">{post.time}</span>
                    </div>

                    <p className="text-sm font-semibold text-slate-800 leading-relaxed group-hover:text-crmisa-navy transition-colors">
                      {post.question}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="hover:text-blue-600 font-medium">💬 {post.replies} Replies</span>
                      <button className="text-blue-600 hover:underline font-bold">Reply & View &rarr;</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Modal for Creating Detailed Post */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleAddModalPost}
      />

    </div>
  );
}
