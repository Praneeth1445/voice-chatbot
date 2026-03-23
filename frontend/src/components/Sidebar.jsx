import React from 'react';
import { Menu, Search, Edit, Star, ChevronRight, Settings } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="w-[280px] bg-[#1e1f20] flex-col hidden md:flex h-full border-r border-gray-800 shrink-0 select-none">
            <div className="p-4 flex justify-between items-center text-gray-300">
                <Menu className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
                <Search className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            </div>

            <div className="px-4 py-2 space-y-1 mt-2">
                <div className="flex items-center gap-3 p-3 text-sm font-medium bg-gray-800/50 hover:bg-gray-800 rounded-full cursor-pointer transition-colors text-white">
                    <Edit className="w-4 h-4" /> New chat
                </div>
                <div className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-gray-800 rounded-full cursor-pointer transition-colors text-gray-300">
                    <Star className="w-4 h-4" /> My information
                </div>
            </div>

            <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-200 hover:bg-gray-800 rounded-md cursor-pointer transition-colors mx-2 mt-4">
                <span>Gems</span>
                <ChevronRight className="w-4 h-4" />
            </div>

            <div className="px-4 pt-4 pb-2 text-sm text-gray-200 font-medium">Chats</div>

            <div className="flex-1 overflow-y-auto w-full px-2 space-y-0.5 text-sm text-[#e3e3e3] custom-scrollbar">
                {[
                    "Voice Chatbot Architecture",
                    "Tailwind CSS Animations",
                    "React Websocket Hook",
                    "Prompt Engineering Tips",
                    "Debugging Groq Errors",
                    "Aesthetic UI Guidelines"
                ].map((title, i) => (
                    <div key={i} className="truncate p-3 hover:bg-gray-800 rounded-full cursor-pointer transition-colors">
                        {title}
                    </div>
                ))}
            </div>

            <div className="p-4 mt-auto border-t border-gray-800">
                <div className="flex items-center gap-3 p-2 text-sm font-medium hover:bg-gray-800 rounded-full cursor-pointer text-[#e3e3e3] transition-colors">
                    <Settings className="w-4 h-4" /> Settings, Help
                </div>
            </div>
        </div>
    );
}
