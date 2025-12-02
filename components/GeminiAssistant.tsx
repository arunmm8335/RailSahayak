import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithGemini } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I'm Sahayak. I can help you find platforms, suggest food, or book a coolie. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    const responseText = await chatWithGemini(input, history);
    
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 md:bg-white dark:md:bg-gray-900 md:rounded-xl md:border md:border-gray-200 dark:md:border-gray-800 md:shadow-sm md:max-w-4xl md:mx-auto transition-colors duration-200">
      <div className="bg-white dark:bg-gray-900 p-4 shadow-sm border-b border-gray-200 dark:border-gray-800 md:rounded-t-xl">
        <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-lg">
            <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 p-1.5 rounded-md text-sm">AI</span>
            Sahayak Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 text-sm md:text-base shadow-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-700 flex gap-2 items-center shadow-sm">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:rounded-b-xl">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-5 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Ask about platform numbers, train delay, or food..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-sm hover:shadow-md">
            <span className="text-xl">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;