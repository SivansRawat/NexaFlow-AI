import { Instagram, Linkedin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] py-8 px-6 flex flex-col md:flex-row items-center justify-between border-t border-[#262626] mt-12">
      <span className="text-[#737373] text-sm mb-4 md:mb-0">© {new Date().getFullYear()} NexaFlow AI. All rights reserved.</span>
      <div className="flex gap-4">
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="group">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0b0b0f] border border-[#262626] hover:border-[#2640D9]/30 transition-all">
            <MessageCircle className="text-[#737373] group-hover:text-green-400 transition-colors" size={20} />
          </span>
        </a>
        <a href="https://www.instagram.com/nexaflowai" target="_blank" rel="noopener noreferrer" className="group">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0b0b0f] border border-[#262626] hover:border-[#2640D9]/30 transition-all">
            <Instagram className="text-[#737373] group-hover:text-pink-400 transition-colors" size={20} />
          </span>
        </a>
        <a href="https://www.linkedin.com/in/nexaflow-ai-611575373?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="group">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0b0b0f] border border-[#262626] hover:border-[#2640D9]/30 transition-all">
            <Linkedin className="text-[#737373] group-hover:text-blue-400 transition-colors" size={20} />
          </span>
        </a>
      </div>
    </footer>
  );
} 
