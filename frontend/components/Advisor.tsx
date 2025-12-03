import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { getAIAdvisorResponse } from '../services/gemini';
import { ChatMessage } from '../types';
import { Button } from './ui/Button';
import { ChatMessageBubble, ChatLoadingBubble } from './ChatMessageBubble';
import { cn } from '../utils/cn';

export const Advisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm Visionary Space, your AI Marketing Strategist. How can I help you improve your campaigns today?",
      timestamp: Date.now()
    }
  ]);
  const [currentInputText, setCurrentInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentInputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setCurrentInputText('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await getAIAdvisorResponse(history, userMsg.text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm having trouble connecting right now. Please try again.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error. Please check your API configuration.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "flex flex-col overflow-hidden",
      "h-[calc(100vh-140px)]",
      "rounded-2xl border border-gray-200 shadow-sm",
      "bg-white"
    )}>
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Visionary Space Strategy Advisor</h2>
          <p className="text-xs text-gray-500">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/30">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <ChatLoadingBubble />}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="Ask about marketing strategy, segmentation, or copy analysis..."
            value={currentInputText}
            onChange={(e) => setCurrentInputText(e.target.value)}
            onKeyDown={handleInputKeyPress}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!currentInputText.trim() || isLoading}
            className="rounded-xl px-6"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
};