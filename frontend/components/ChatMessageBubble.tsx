import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '../utils/cn';

interface ChatMessageBubbleProps {
    message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={cn(
            "flex w-full",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "flex max-w-[80%] items-start gap-3",
                isUser ? "flex-row-reverse" : ""
            )}>
                <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isUser ? "bg-gray-900 text-white" : "bg-indigo-600 text-white"
                )}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    isUser
                        ? "bg-gray-900 text-white rounded-tr-none"
                        : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                )}>
                    {message.text}
                </div>
            </div>
        </div>
    );
};

export const ChatLoadingBubble: React.FC = () => {
    return (
        <div className="flex w-full justify-start">
            <div className="flex max-w-[80%] items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Bot size={16} />
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 border border-gray-100 rounded-tl-none shadow-sm">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-0"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
