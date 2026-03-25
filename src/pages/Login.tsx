"use client";

import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const MASCOT_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHFLGYbTmTeRXf-l4i2c_lKxAEARQNoxKd8G5rIMV55h7IZ-fGysr5vsABWGh5N2gvlqMz5DVuGP7XxbommEpWngXEp5bxldLAfjQmdffkHWPymjBI5NbpWLogPqHKXvELnrNlEDhsDvcLs1NW249Dn-JFW0cS7teCcIU9nywiO641mZFcel8IHki2czZMRv9UqEiIY1YYakyZZLSNMoJ-25oEYEfScqGqBZ5VB929YunD7jJho9Gr3q3rMQl5TODcNxQ9F8fpUI";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userId', data.user_id.toString());
      
      // Redirect to chat page
      window.location.href = '/chat';
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sanctuary-surface text-sanctuary-on-surface font-body flex flex-col">
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-md w-full flex flex-col items-center">
          
          {/* Mascot & Welcome Header */}
          <div className="relative mb-12 flex flex-col items-center text-center">
            {/* Mascot Image Container */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-sanctuary-primary-fixed-dim rounded-full flex items-center justify-center overflow-hidden mb-8 shadow-[0px_20px_40px_rgba(52,50,43,0.06)]">
              <img
                alt="Mascota amigable de planta suculenta"
                className="w-full h-full object-cover"
                src={MASCOT_URL}
              />
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-sanctuary-on-surface tracking-tight mb-3">
              Bienvenido a casa.
            </h1>
            <p className="text-sanctuary-on-surface-variant text-lg leading-relaxed max-w-[280px]">
              Encuentra tu centro y comienza tu camino hoy.
            </p>
          </div>

          {/* Login Form */}
          <form className="w-full space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="font-label text-sm font-semibold ml-4 text-sanctuary-on-surface-variant"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
                  mail
                </span>
                <input
                  className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
                  id="email"
                  placeholder="tu@correo.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label
                  className="font-label text-sm font-semibold text-sanctuary-on-surface-variant"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <a
                  className="text-sm font-semibold text-sanctuary-primary hover:text-sanctuary-primary-dim transition-colors cursor-pointer"
                  href="#"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
                  lock
                </span>
                <input
                  className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Primary Login Button */}
            <button
              className="w-full h-16 bg-sanctuary-primary text-sanctuary-on-primary font-headline font-bold text-lg rounded-full shadow-[0px_10px_25px_rgba(74,101,79,0.2)] hover:bg-sanctuary-primary-dim active:scale-95 transition-all duration-200 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Continuar al Santuario"}
            </button>

            {/* Social/Alternative Login */}
            <div className="pt-8 flex flex-col items-center">
              <div className="w-full flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-grow bg-sanctuary-outline-variant/20"></div>
                <span className="text-sm text-sanctuary-on-surface-variant font-medium">
                  o continúa con
                </span>
                <div className="h-[1px] flex-grow bg-sanctuary-outline-variant/20"></div>
              </div>
              <div className="flex gap-4 w-full">
                <button
                  className="flex-1 h-14 bg-sanctuary-surface-container-high rounded-sanctuary flex items-center justify-center hover:bg-sanctuary-surface-dim transition-colors active:scale-95 duration-200"
                  type="button"
                >
                  <span className="material-symbols-outlined">google</span>
                </button>
                <button
                  className="flex-1 h-14 bg-sanctuary-surface-container-high rounded-sanctuary flex items-center justify-center hover:bg-sanctuary-surface-dim transition-colors active:scale-95 duration-200"
                  type="button"
                >
                  <span className="material-symbols-outlined">ios</span>
                </button>
              </div>
            </div>
          </form>

          {/* Footer Link */}
          <p className="mt-12 text-sanctuary-on-surface-variant text-sm">
            ¿Nuevo en el santuario?{" "}
            <a className="text-sanctuary-primary font-bold ml-1 hover:underline cursor-pointer" href="#">
              Crea una cuenta
            </a>
          </p>
        </div>
      </main>

      {/* Visual Empathy Component: Breathing Indicator */}
      <div className="fixed top-8 right-8 hidden lg:flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-sanctuary-primary-fixed-dim animate-breath opacity-40"></div>
        <span className="text-[10px] font-label uppercase tracking-widest text-sanctuary-on-surface-variant">
          Respira
        </span>
      </div>
    </div>
  );
};

export default Login;