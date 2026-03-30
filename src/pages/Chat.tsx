"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const MASCOT_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHFLGYbTmTeRXf-l4i2c_lKxAEARQNoxKd8G5rIMV55h7IZ-fGysr5vsABWGh5N2gvlqMz5DVuGP7XxbommEpWngXEp5bxldLAfjQmdffkHWPymjBI5NbpWLogPqHKXvELnrNlEDhsDvcLs1NW249Dn-JFW0cS7teCcIU9nywiO641mZFcel8IHki2czZMRv9UqEiIY1YYakyZZLSNMoJ-25oEYEfScqGqBZ5VB929YunD7jJho9Gr3q3rMQl5TODcNxQ9F8fpUI";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('userId');

  // Load chat history on component mount
  useEffect(() => {
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    
    loadChatHistory();
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/chat/history/${userId}`);
      if (response.ok) {
        const history = await response.json();
        const formattedMessages = history.map((msg: any, index: number) => ({
          id: index,
          content: msg.content,
          isUser: msg.is_user,
          timestamp: new Date()
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userId || isLoading) return;

    const userMessage: Message = {
      id: messages.length,
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message to chat
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputValue,
          user_id: parseInt(userId)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: newMessages.length + 1,
        content: data.content,
        isUser: false,
        timestamp: new Date()
      };

      setMessages([...newMessages, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intenta de nuevo.",
        variant: "destructive",
      });
      // Remove the user message if failed to send
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (text: string) => {
    setInputValue(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-sanctuary-surface font-body text-sanctuary-on-surface min-h-screen flex flex-col selection:bg-sanctuary-primary-container">
      {/* Top Navigation Shell */}
      <header className="w-full sticky top-0 z-40 bg-sanctuary-surface flex justify-between items-center px-6 py-4 max-w-full mx-auto">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-sanctuary-surface-variant/50 transition-colors active:scale-95 duration-200"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              window.location.href = '/login';
            }}
          >
            <span className="material-symbols-outlined text-sanctuary-primary">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            <img
              alt="Avatar de Brotito"
              className="w-10 h-10 rounded-full object-cover"
              src={MASCOT_URL}
            />
            <div>
              <h1 className="font-headline text-lg font-semibold tracking-tight text-sanctuary-primary">
                Brotito
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-sanctuary-on-surface-variant font-bold">
                En línea
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-sanctuary-surface-variant/50 transition-colors">
            <span className="material-symbols-outlined text-sanctuary-primary">info</span>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-3xl mx-auto px-6 pt-6 pb-44 flex-1 w-full">
        {/* Floating Breathing Tool */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="relative flex items-center justify-center">
            <div className="animate-breath absolute w-16 h-16 rounded-full bg-sanctuary-primary-fixed-dim"></div>
            <div className="relative w-12 h-12 rounded-full bg-sanctuary-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-sanctuary-on-primary text-xl">air</span>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-sanctuary-on-surface-variant">
            Enfócate en tu respiración
          </p>
        </div>

        {/* Chat Conversation */}
        <div className="space-y-8" ref={scrollAreaRef}>
          {/* Timestamp */}
          <div className="flex justify-center">
            <span className="px-4 py-1 rounded-full bg-sanctuary-surface-container text-[11px] font-bold tracking-widest text-sanctuary-on-surface-variant uppercase">
              Hoy
            </span>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div key={message.id}>
              {message.isUser ? (
                /* User Message */
                <div className="flex flex-col items-end gap-2 ml-auto max-w-[85%]">
                  <div className="bg-sanctuary-secondary-container text-sanctuary-on-secondary-container rounded-sanctuary rounded-br-none p-5 shadow-sm">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="text-base leading-relaxed mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                  <span className="text-[10px] text-sanctuary-on-surface-variant mr-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              ) : (
                /* Assistant Message */
                <div className="flex items-end gap-3 max-w-[85%] group">
                  <div className="flex-shrink-0 mb-1">
                    <img
                      className="w-8 h-8 rounded-full"
                      alt="Brotito"
                      src={MASCOT_URL}
                    />
                  </div>
                  <div className="bg-sanctuary-surface-container-high text-sanctuary-on-surface rounded-sanctuary rounded-bl-none p-5 shadow-sm">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="text-base leading-relaxed mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-end gap-3 max-w-[85%]">
              <div className="flex-shrink-0 mb-1">
                <img className="w-8 h-8 rounded-full" alt="Brotito" src={MASCOT_URL} />
              </div>
              <div className="bg-sanctuary-surface-container-high text-sanctuary-on-surface rounded-sanctuary rounded-bl-none p-5 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sanctuary-outline animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-sanctuary-outline animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 rounded-full bg-sanctuary-outline animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Suggestion Chips — show only when no messages yet */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              <button
                onClick={() => handleSuggestion("Me siento ansioso/a")}
                className="px-5 py-2 rounded-full bg-sanctuary-surface-container-lowest border border-sanctuary-outline-variant/15 text-sanctuary-primary text-sm font-medium hover:bg-sanctuary-surface-container-low transition-all active:scale-95"
              >
                Me siento ansioso/a
              </button>
              <button
                onClick={() => handleSuggestion("Quiero hablar")}
                className="px-5 py-2 rounded-full bg-sanctuary-surface-container-lowest border border-sanctuary-outline-variant/15 text-sanctuary-primary text-sm font-medium hover:bg-sanctuary-surface-container-low transition-all active:scale-95"
              >
                Quiero hablar
              </button>
              <button
                onClick={() => handleSuggestion("Mostrar recursos")}
                className="px-5 py-2 rounded-full bg-sanctuary-surface-container-lowest border border-sanctuary-outline-variant/15 text-sanctuary-primary text-sm font-medium hover:bg-sanctuary-surface-container-low transition-all active:scale-95"
              >
                Mostrar recursos
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Interaction Area */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        {/* Input Bar Container */}
        <div className="max-w-3xl mx-auto px-6 pb-24">
          <div className="bg-glass rounded-sanctuary-xl shadow-[0px_-10px_30px_rgba(52,50,43,0.04)] p-3 flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-sanctuary-surface-variant/50 transition-colors text-sanctuary-primary active:scale-90"
              type="button"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="flex-1 relative">
              <input
                className="w-full bg-sanctuary-surface-container-lowest border-none rounded-full py-3 px-5 focus:ring-2 focus:ring-sanctuary-primary/20 text-sanctuary-on-surface placeholder:text-sanctuary-on-surface-variant/50 font-body"
                placeholder="Comparte lo que tienes en mente..."
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-sanctuary-surface-variant/50 transition-colors text-sanctuary-on-surface-variant active:scale-90"
                type="button"
              >
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button
                className="w-12 h-12 rounded-full bg-sanctuary-primary flex items-center justify-center text-sanctuary-on-primary shadow-lg shadow-sanctuary-primary/20 active:scale-95 transition-transform disabled:opacity-60"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  send
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Navigation */}
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-4 bg-glass rounded-t-sanctuary-xl border-t border-sanctuary-outline-variant/15 shadow-[0px_-10px_30px_rgba(52,50,43,0.04)]">
          <Link
            className="flex flex-col items-center justify-center bg-sanctuary-primary-container text-sanctuary-on-primary-container rounded-full px-6 py-2 transition-all"
            to="/chat"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              chat_bubble
            </span>
            <span className="font-label text-[12px] font-medium tracking-wide mt-1">Chat</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center text-sanctuary-on-surface/60 px-6 py-2 hover:text-sanctuary-primary transition-all"
            to="/resources"
          >
            <span className="material-symbols-outlined">library_books</span>
            <span className="font-label text-[12px] font-medium tracking-wide mt-1">Recursos</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center text-sanctuary-on-surface/60 px-6 py-2 hover:text-sanctuary-primary transition-all"
            to="/profile"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="font-label text-[12px] font-medium tracking-wide mt-1">Perfil</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Chat;