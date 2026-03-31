"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

const MASCOT_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHFLGYbTmTeRXf-l4i2c_lKxAEARQNoxKd8G5rIMV55h7IZ-fGysr5vsABWGh5N2gvlqMz5DVuGP7XxbommEpWngXEp5bxldLAfjQmdffkHWPymjBI5NbpWLogPqHKXvELnrNlEDhsDvcLs1NW249Dn-JFW0cS7teCcIU9nywiO641mZFcel8IHki2czZMRv9UqEiIY1YYakyZZLSNMoJ-25oEYEfScqGqBZ5VB929YunD7jJho9Gr3q3rMQl5TODcNxQ9F8fpUI";

// ─── Tipos de vista ────────────────────────────────────────────
type View = "login" | "register" | "forgot";

// ─── Componente principal ──────────────────────────────────────
const Login = () => {
  const [view, setView] = useState<View>("login");
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-sanctuary-surface text-sanctuary-on-surface font-body flex flex-col">
      <main className="flex-grow flex items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-md w-full flex flex-col items-center">

          {/* Mascota y encabezado */}
          <div className="relative mb-10 flex flex-col items-center text-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-sanctuary-primary-fixed-dim rounded-full flex items-center justify-center overflow-hidden mb-8 shadow-[0px_20px_40px_rgba(52,50,43,0.06)]">
              <img
                alt="Mascota amigable de planta suculenta"
                className="w-full h-full object-cover"
                src={MASCOT_URL}
              />
            </div>

            {view === "login" && (
              <>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-sanctuary-on-surface tracking-tight mb-3">
                  Bienvenido a casa.
                </h1>
                <p className="text-sanctuary-on-surface-variant text-lg leading-relaxed max-w-[280px]">
                  Encuentra tu centro y comienza tu camino hoy.
                </p>
              </>
            )}

            {view === "register" && (
              <>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-sanctuary-on-surface tracking-tight mb-3">
                  Crea tu espacio.
                </h1>
                <p className="text-sanctuary-on-surface-variant text-lg leading-relaxed max-w-[280px]">
                  Tu santuario personal te está esperando.
                </p>
              </>
            )}

            {view === "forgot" && (
              <>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-sanctuary-on-surface tracking-tight mb-3">
                  Sin problema.
                </h1>
                <p className="text-sanctuary-on-surface-variant text-lg leading-relaxed max-w-[280px]">
                  Ingresa tu correo y te enviaremos instrucciones para recuperar tu cuenta.
                </p>
              </>
            )}
          </div>

          {/* Vistas */}
          {view === "login" && (
            <LoginForm
              onForgot={() => setView("forgot")}
              onRegister={() => setView("register")}
              toast={toast}
            />
          )}
          {view === "register" && (
            <RegisterForm
              onBack={() => setView("login")}
              toast={toast}
            />
          )}
          {view === "forgot" && (
            <ForgotForm
              onBack={() => setView("login")}
              toast={toast}
            />
          )}
        </div>
      </main>

      {/* Indicador de respiración */}
      <div className="fixed top-8 right-8 hidden lg:flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-sanctuary-primary-fixed-dim animate-breath opacity-40" />
        <span className="text-[10px] font-label uppercase tracking-widest text-sanctuary-on-surface-variant">
          Respira
        </span>
      </div>
    </div>
  );
};

export default Login;


// ─── Vista: Login ──────────────────────────────────────────────
interface LoginFormProps {
  onForgot: () => void;
  onRegister: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}

const LoginForm = ({ onForgot, onRegister, toast }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),  // ← ahora envía contraseña
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Error al iniciar sesión");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userId", data.user_id.toString());
      window.location.href = "/chat";

    } catch (error: any) {
      toast({
        title: "Error al ingresar",
        description: error.message || "Correo o contraseña incorrectos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full space-y-6" onSubmit={handleLogin}>
      {/* Email */}
      <div className="space-y-2">
        <label className="font-label text-sm font-semibold ml-4 text-sanctuary-on-surface-variant" htmlFor="login-email">
          Correo electrónico
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
            mail
          </span>
          <input
            className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
            id="login-email"
            placeholder="tu@correo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Contraseña */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-4">
          <label className="font-label text-sm font-semibold text-sanctuary-on-surface-variant" htmlFor="login-password">
            Contraseña
          </label>
          <button
            type="button"
            onClick={onForgot}
            className="text-sm font-semibold text-sanctuary-primary hover:text-sanctuary-primary-dim transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
            lock
          </span>
          <input
            className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
            id="login-password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Botón principal */}
      <button
        className="w-full h-16 bg-sanctuary-primary text-sanctuary-on-primary font-headline font-bold text-lg rounded-full shadow-[0px_10px_25px_rgba(74,101,79,0.2)] hover:bg-sanctuary-primary-dim active:scale-95 transition-all duration-200 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Ingresando..." : "Continuar al Santuario"}
      </button>

      {/* Footer */}
      <p className="mt-8 text-center text-sanctuary-on-surface-variant text-sm">
        ¿Nuevo en el santuario?{" "}
        <button
          type="button"
          onClick={onRegister}
          className="text-sanctuary-primary font-bold ml-1 hover:underline"
        >
          Crea una cuenta
        </button>
      </p>
    </form>
  );
};


// ─── Vista: Registro ───────────────────────────────────────────
interface RegisterFormProps {
  onBack: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}

const RegisterForm = ({ onBack, toast }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Contraseña muy corta",
        description: "Debe tener al menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirm) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Revisa que ambas contraseñas sean iguales.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "No se pudo crear la cuenta");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userId", data.user_id.toString());
      window.location.href = "/chat";

    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleRegister}>
      {/* Email */}
      <div className="space-y-2">
        <label className="font-label text-sm font-semibold ml-4 text-sanctuary-on-surface-variant" htmlFor="reg-email">
          Correo electrónico
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
            mail
          </span>
          <input
            className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
            id="reg-email"
            placeholder="tu@correo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Contraseña */}
      <div className="space-y-2">
        <label className="font-label text-sm font-semibold ml-4 text-sanctuary-on-surface-variant" htmlFor="reg-password">
          Contraseña <span className="font-normal opacity-60">(mín. 8 caracteres)</span>
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
            lock
          </span>
          <input
            className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
            id="reg-password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Confirmar contraseña */}
      <div className="space-y-2">
        <label className="font-label text-sm font-semibold ml-4 text-sanctuary-on-surface-variant" htmlFor="reg-confirm">
          Confirma tu contraseña
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
            lock_check
          </span>
          <input
            className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
            id="reg-confirm"
            placeholder="••••••••"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Botón principal */}
      <button
        className="w-full h-16 bg-sanctuary-primary text-sanctuary-on-primary font-headline font-bold text-lg rounded-full shadow-[0px_10px_25px_rgba(74,101,79,0.2)] hover:bg-sanctuary-primary-dim active:scale-95 transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creando tu espacio..." : "Crear cuenta"}
      </button>

      {/* Volver */}
      <p className="mt-6 text-center text-sanctuary-on-surface-variant text-sm">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={onBack}
          className="text-sanctuary-primary font-bold ml-1 hover:underline"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
};


// ─── Vista: Recuperar contraseña ───────────────────────────────
interface ForgotFormProps {
  onBack: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}

const ForgotForm = ({ onBack, toast }: ForgotFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Llama al endpoint de recuperación.
      // El backend siempre responde OK (no revela si el email existe).
      await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Siempre mostramos confirmación, independiente del resultado
      setSent(true);

    } catch {
      // Igual mostramos confirmación para no revelar si el email existe
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-sanctuary-primary-fixed-dim flex items-center justify-center">
          <span className="material-symbols-outlined text-sanctuary-primary text-3xl">
            mark_email_read
          </span>
        </div>
        <div>
          <p className="font-headline text-xl font-bold text-sanctuary-on-surface mb-2">
            Revisa tu correo
          </p>
          <p className="text-sanctuary-on-surface-variant text-base leading-relaxed max-w-[280px]">
            Si existe una cuenta con ese correo, recibirás las instrucciones en unos minutos.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sanctuary-primary font-bold hover:underline text-sm mt-2"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <form className="w-full space-y-6" onSubmit={handleForgot}>
      {/* Email */}
      <div className="space-y-2">
        <label className="font-label text-sm font-semibold ml-4 text-sanctuary-on-surface-variant" htmlFor="forgot-email">
          Correo electrónico
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
            mail
          </span>
          <input
            className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
            id="forgot-email"
            placeholder="tu@correo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        className="w-full h-16 bg-sanctuary-primary text-sanctuary-on-primary font-headline font-bold text-lg rounded-full shadow-[0px_10px_25px_rgba(74,101,79,0.2)] hover:bg-sanctuary-primary-dim active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar instrucciones"}
      </button>

      <p className="text-center text-sanctuary-on-surface-variant text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-sanctuary-primary font-bold hover:underline"
        >
          ← Volver al inicio de sesión
        </button>
      </p>
    </form>
  );
};
