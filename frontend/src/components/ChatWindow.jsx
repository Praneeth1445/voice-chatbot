import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Activity, Music, Loader2 } from 'lucide-react';
import classNames from 'classnames';

export default function ChatWindow({
    messages,
    status,
    isConnected,
    errorText
}) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, status]);

    const showWelcome = messages.length === 0;

    return (
        <div className="flex-1 flex flex-col relative h-full">
            {/* Top Header */}
            <header className="flex justify-between items-center p-4">
                <div className="text-xl font-medium text-gray-200">Gemini</div>
                <div className="flex items-center gap-3">
                    <span className="bg-gray-800 text-xs px-2 py-1 rounded-md text-[#e3e3e3] cursor-pointer hover:bg-gray-700 font-medium select-none transition-colors">PRO</span>
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center border border-green-500/50 text-sm font-semibold cursor-pointer ring-2 ring-transparent hover:ring-gray-700 transition-all select-none">
                        P
                    </div>
                </div>
            </header>

            {/* Main Timeline */}
            <main className="flex-1 overflow-y-auto w-full pb-36 px-4 custom-scrollbar">
                <AnimatePresence>
                    {showWelcome ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-3xl mx-auto mt-16 px-6 text-center md:text-left"
                        >
                            <h1 className="text-[2.75rem] leading-tight font-medium mb-1">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 text-transparent bg-clip-text flex gap-3 items-center justify-center md:justify-start">
                                    <Sparkles className="w-8 h-8 text-blue-400" /> Hi Praneeth
                                </span>
                            </h1>
                            <h2 className="text-[2.75rem] leading-tight font-medium text-[#444746] dark:text-[#c4c7c5]">
                                What should we start with?
                            </h2>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-10">
                                <span className="px-5 py-2.5 bg-[#1e1f20] hover:bg-[#252628] text-[#e3e3e3] text-[13px] font-medium rounded-full flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                                    <ImageIcon className="w-4 h-4 text-orange-400" /> Create Image
                                </span>
                                <span className="px-5 py-2.5 bg-[#1e1f20] hover:bg-[#252628] text-[#e3e3e3] text-[13px] font-medium rounded-full flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                                    <Activity className="w-4 h-4 text-pink-400" /> Explore Cricket
                                </span>
                                <span className="px-5 py-2.5 bg-[#1e1f20] hover:bg-[#252628] text-[#e3e3e3] text-[13px] font-medium rounded-full flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                                    <Music className="w-4 h-4 text-purple-400" /> Create music
                                </span>
                                <span className="px-5 py-2.5 bg-[#1e1f20] hover:bg-[#252628] text-[#e3e3e3] text-[13px] font-medium rounded-full flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                                    Help me learn.
                                </span>
                                <span className="px-5 py-2.5 bg-[#1e1f20] hover:bg-[#252628] text-[#e3e3e3] text-[13px] font-medium rounded-full flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                                    Write something.
                                </span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="max-w-3xl mx-auto mt-6 flex flex-col gap-6">

                            {/* Messages Array */}
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    key={idx}
                                    className={classNames("flex", msg.role === 'user' ? "justify-end" : "justify-start items-start gap-4")}
                                >
                                    {msg.role === 'ai' && <Sparkles className="w-6 h-6 text-blue-400 mt-1 shrink-0" />}

                                    <div className={classNames(
                                        "text-[15px] leading-relaxed max-w-[85%] break-words",
                                        msg.role === 'user'
                                            ? "bg-[#1e1f20] rounded-3xl rounded-tr-sm px-5 py-3.5 text-[#e3e3e3]"
                                            : "text-[#e3e3e3] py-1"
                                    )}>
                                        {msg.text}
                                        {msg.streaming && (status.includes("Thinking") || status.includes("Searching")) && msg.role === 'ai' && (
                                            <span className="animate-pulse ml-1 text-blue-400">▍</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                        </div>
                    )}
                </AnimatePresence>

                {/* Status Indicator at the bottom */}
                {(!showWelcome || errorText) && (
                    <div className="max-w-3xl mx-auto w-full flex items-center justify-center gap-2 mt-8 text-[11px] text-gray-500 font-medium">
                        {errorText ? (
                            <span className="text-red-400">{errorText}</span>
                        ) : (
                            <>
                                {(status.includes("Thinking") || status.includes("Searching") || status.includes("Transcribing")) ? (
                                    <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                                ) : (
                                    <span className={classNames("w-1.5 h-1.5 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                                )}
                                {status}
                            </>
                        )}
                    </div>
                )}

                <div ref={bottomRef} className="h-20" />
            </main>
        </div>
    );
}
