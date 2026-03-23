import React from 'react';
import classNames from 'classnames';
import { Plus, Settings2, ChevronDown, Send, Mic, MicOff } from 'lucide-react';

export default function InputBar({
    inputText,
    setInputText,
    handleSendText,
    isRecording,
    startRecording,
    stopRecording
}) {
    return (
        <div className="absolute bottom-0 w-full pt-10 pb-6 bg-gradient-to-t from-[#131314] via-[#131314] to-transparent">
            <div className="max-w-3xl mx-auto px-4">
                <form
                    onSubmit={handleSendText}
                    className="bg-[#1e1f20] hover:bg-[#252628] focus-within:bg-[#252628] focus-within:ring-[0.5px] ring-gray-600 transition-all rounded-[32px] p-2 flex items-center justify-between shadow-lg mb-4 h-[60px]"
                >
                    {/* Left icons */}
                    <div className="flex items-center pl-2 gap-1">
                        <button type="button" className="p-2.5 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-full transition-colors">
                            <Plus className="w-[1.1rem] h-[1.1rem]" />
                        </button>
                        <div className="w-[1px] h-5 bg-gray-700 mx-1"></div>
                        <button type="button" className="p-2.5 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-full flex gap-1.5 items-center transition-colors">
                            <Settings2 className="w-[1.1rem] h-[1.1rem]" />
                            <span className="text-[13px] font-medium hidden sm:block">Tools</span>
                        </button>
                    </div>

                    {/* Input */}
                    <input
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        className="flex-1 bg-transparent text-[#e3e3e3] px-3 outline-none text-[15px] placeholder-gray-400 w-full"
                        placeholder="Gemini 3ని అడగండి..."
                    />

                    {/* Right icons */}
                    <div className="flex items-center pr-2 gap-1">
                        <button type="button" className="hidden sm:flex items-center text-[13px] font-medium text-gray-300 hover:bg-gray-700/50 px-3 py-1.5 rounded-full gap-1.5 cursor-pointer transition-colors mx-1">
                            Fast <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>

                        {inputText ? (
                            <button
                                type="submit"
                                className="p-2.5 rounded-full text-blue-400 hover:bg-blue-500/10 transition-colors"
                                title="Send Message"
                            >
                                <Send className="w-[1.2rem] h-[1.2rem]" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onPointerDown={startRecording}
                                onPointerUp={stopRecording}
                                onPointerLeave={stopRecording}
                                className={classNames(
                                    "p-2.5 rounded-full transition-all duration-300 relative select-none touch-none",
                                    isRecording
                                        ? "bg-red-500/20 text-red-400 scale-105"
                                        : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                                )}
                                title="Hold to Talk"
                            >
                                {isRecording && <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>}
                                {isRecording ? <Mic className="w-[1.2rem] h-[1.2rem] relative z-10" /> : <MicOff className="w-[1.2rem] h-[1.2rem] relative z-10" />}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
