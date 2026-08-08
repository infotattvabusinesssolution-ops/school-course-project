import React from 'react';
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from './icons/Icons';

export default function FloatingSocialBar() {
  const socialLinks = [
    {
      name: 'Facebook',
      color: 'bg-[#3b5998] hover:bg-[#2d4373]',
      icon: <FacebookIcon className="w-5 h-5 text-white" />,
      url: 'https://facebook.com',
    },
    {
      name: 'Instagram',
      color: 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 hover:opacity-90',
      icon: <InstagramIcon className="w-5 h-5 text-white" />,
      url: 'https://instagram.com',
    },
    {
      name: 'TikTok',
      color: 'bg-black hover:bg-slate-900',
      icon: <TikTokIcon className="w-5 h-5 text-white" />,
      url: 'https://tiktok.com',
    },
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#1da851]',
      icon: <WhatsAppIcon className="w-5 h-5 text-white" />,
      url: 'https://whatsapp.com',
    },
  ];

  return (
    <aside className="fixed right-0 top-1/3 z-30 flex flex-col items-end space-y-1 group">
      <div className="flex flex-col rounded-l-xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-md p-1 border-l border-y border-white/50">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center ${social.color} transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 shadow-md mb-1 rounded-lg`}
            title={`Follow CRMISA on ${social.name}`}
          >
            {social.icon}
          </a>
        ))}
      </div>
      <div className="hidden lg:block text-[9px] text-slate-400 font-medium text-right pr-1 pt-0.5 tracking-tight opacity-75">
        Free Social Icons Widget<br/>by Elfsight
      </div>
    </aside>
  );
}
