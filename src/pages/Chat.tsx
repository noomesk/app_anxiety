"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Heart, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Remove the user message if failed to send
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAnxiety = async () => {
    const anxietyMessage = "Estoy muy ansioso ahora";
    setInputValue(anxietyMessage);
    
    // Trigger send after a short delay to allow state update
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">Acompañamiento para Ansiedad</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              window.location.href = '/login';
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-4 max-w-4xl w-full mx-auto">
        <div className="mb-4">
          <Button 
            onClick={handleQuickAnxiety}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Heart className="mr-2 h-4 w-4" />
            Estoy muy ansioso ahora
          </Button>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-220px)] p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {!message.isUser && (
                          <div className="mt-0.5">
                            <Heart className="h-4 w-4 text-indigo-500" />
                          </div>
                        )}
                        <div>
                          {message.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0">{line}</p>
                          ))}
                        </div>
                        {message.isUser && (
                          <div className="mt-0.5">
                            <User className="h-4 w-4 text-indigo-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Area */}
        <div className="mt-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-gray-500">
        <p>
          Esta aplicación es un acompañamiento entre sesiones terapéuticas, 
          no reemplaza la terapia profesional.
        </p>
        <p className="mt-1">Desarrollado por noomesk 2026 - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Chat;