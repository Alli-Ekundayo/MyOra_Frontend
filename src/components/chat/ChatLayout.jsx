import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Wifi, WifiOff } from 'lucide-react';
import useWebSocket from '../../hooks/useWebSocket';

export default function ChatLayout() {
    const { status, messages, sendMessage, error } = useWebSocket();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">MyOra Coach</h2>
                    <p className="text-xs text-gray-500">Always here to help.</p>
                </div>
                <div className="flex items-center gap-2">
                    {status === 'connected' ? (
                        <span className="flex items-center text-xs text-green-600 font-medium">
                            <Wifi className="w-4 h-4 mr-1" />
                            Online
                        </span>
                    ) : status === 'connecting' ? (
                        <span className="flex items-center text-xs text-yellow-600 font-medium animate-pulse">
                            Connecting...
                        </span>
                    ) : (
                        <span className="flex items-center text-xs text-red-500 font-medium">
                            <WifiOff className="w-4 h-4 mr-1" />
                            Offline
                        </span>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {messages.length === 0 && !error && (
                    <div className="text-center text-gray-400 mt-12">
                        <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>Start a conversation with your health coach.</p>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isUser = msg.direction === 'outgoing';
                    return (
                        <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>

                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-indigo-100 text-indigo-600' : 'bg-myora-100 text-myora-600'
                                    }`}>
                                    {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>

                                <div className={`
                       px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                       ${isUser
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
                   `}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={status !== 'connected'}
                        placeholder={status === 'connected' ? "Type your message..." : "Connecting..."}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-myora-500 focus:border-transparent outline-none disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || status !== 'connected'}
                        className="bg-myora-500 hover:bg-myora-600 disabled:opacity-50 text-white p-3 rounded-xl transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
