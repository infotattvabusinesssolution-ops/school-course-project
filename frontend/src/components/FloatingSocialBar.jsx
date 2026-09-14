import React from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "./icons/Icons";

export default function FloatingSocialBar() {
  const socialLinks = [
    {
      name: "Facebook",
      bgClass: "bg-[#3b5998]",
      hoverBgClass: "hover:bg-white",
      textClass: "text-white",
      hoverTextClass: "group-hover:text-[#3b5998]",
      Icon: FacebookIcon,
      url: "https://www.facebook.com/people/crmisa/61577110555385/",
    },
    {
      name: "Instagram",
      bgClass: "bg-[#E1306C]",
      hoverBgClass: "hover:bg-white",
      textClass: "text-white",
      hoverTextClass: "group-hover:text-[#E1306C]",
      Icon: InstagramIcon,
      url: "https://www.instagram.com/crmi_sa?fbclid=IwY2xjawTnnghleHRuA2FlbQIxMABicmlkETEwZ1ZCOTNuVGJ0RjBxVjY3AR5-eMRf_5jFfgYCNZ7bbQPO3Urc2Jx9qosEVQl4Da9vueHcvlAJetheFzys8w_aem_iJtMNl1MetlAk1xTSoffBw",
    },
    {
      name: "TikTok",
      bgClass: "bg-crmisa-darkNavy",
      hoverBgClass: "hover:bg-white",
      textClass: "text-white",
      hoverTextClass: "group-hover:text-crmisa-darkNavy",
      Icon: TikTokIcon,
      url: "https://www.tiktok.com/@_crmisa3",
    },
    {
      name: "WhatsApp",
      bgClass: "bg-[#25D366]",
      hoverBgClass: "hover:bg-white",
      textClass: "text-white",
      hoverTextClass: "group-hover:text-[#25D366]",
      Icon: WhatsAppIcon,
      url: "https://wa.me/27824967256?text=I%20want%20to%20register",
    },
  ];

  return (
    <aside className="fixed right-0 top-1/3 z-30 flex flex-col items-end">
      <div className="flex flex-col rounded-l-2xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-md p-3 gap-3 border-l border-y border-white/50">
        {socialLinks.map((social) => {
          const IconComponent = social.Icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className={`group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center ${social.bgClass} ${social.hoverBgClass} transition-colors duration-300 shadow-md rounded-[14px] border border-transparent hover:border-slate-200`}
              title={`Follow CRMISA on ${social.name}`}
            >
              <IconComponent
                className={`w-6 h-6 sm:w-7 sm:h-7 ${social.textClass} ${social.hoverTextClass} transition-colors duration-300`}
              />
            </a>
          );
        })}
      </div>
    </aside>
  );
}
