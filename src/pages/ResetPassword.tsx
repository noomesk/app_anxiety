"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const MASCOT_URL =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHFLGYbTmTeRXf-l4i2c_lKxAEARQNoxKd8G5rIMV55h7IZ-fGysr5vsABWGh5N2gvlqMz5DVuGP7XxbommEpWngXEp5bxldLAfjQmdffkHWPymjBI5NbpWLogPqHKXvELnrNlEDhsDvcLs1NW249Dn-JFW0cS7teCcIU9nywiO641mZFcel8IHki2czZMRv9UqEiIY1YYakyZZLSNMoJ-25oEYEfScqGqBZ5VB929YunD7jJho9Gr3q3rMQl5TODcNxQ9F8fpUI";

const ResetPassword = () => {
    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const { toast } = useToast();

    // Leer el token de la URL al montar el componente
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("token");
        if (!t) {
            toast({
                title: "Enlace inválido",
                description: "Este enlace de recuperación no es válido.",
                variant: "destructive",
            });
        }
        setToken(t);
    }, []);

    const handleReset = async (e: React.FormEvent) => {
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
                description: "Revisa que ambas sean iguales.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, new_password: password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.detail || "No se pudo restablecer la contraseña.");
            }

            setIsDone(true);

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "El enlace expiró o es inválido. Solicita uno nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-sanctuary-surface text-sanctuary-on-surface font-body flex flex-col">
            <main className="flex-grow flex items-center justify-center px-6 py-12 md:py-20">
                <div className="max-w-md w-full flex flex-col items-center">

                    {/* Mascota */}
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-sanctuary-primary-fixed-dim rounded-full flex items-center justify-center overflow-hidden mb-8 shadow-[0px_20px_40px_rgba(52,50,43,0.06)]">
                        <img
                            alt="Mascota Brotito"
                            className="w-full h-full object-cover"
                            src={MASCOT_URL}
                        />
                    </div>

                    {isDone ? (
                        /* ── Estado: éxito ── */
                        <div className="w-full flex flex-col items-center text-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-sanctuary-primary-fixed-dim flex items-center justify-center">
                                <span className="material-symbols-outlined text-sanctuary-primary text-3xl">
                                    check_circle
                                </span>
                            </div>
                            <div>
                                <h1 className="font-headline text-2xl font-bold text-sanctuary-on-surface mb-3">
                                    ¡Contraseña actualizada!
                                </h1>
                                <p className="text-sanctuary-on-surface-variant text-base leading-relaxed max-w-[280px]">
                                    Tu contraseña fue cambiada correctamente. Ya puedes iniciar sesión.
                                </p>
                            </div>
                            <button
                                onClick={() => { window.location.href = "/"; }}
                                className="w-full h-16 bg-sanctuary-primary text-sanctuary-on-primary font-headline font-bold text-lg rounded-full shadow-[0px_10px_25px_rgba(74,101,79,0.2)] hover:bg-sanctuary-primary-dim active:scale-95 transition-all duration-200"
                            >
                                Ir al inicio de sesión
                            </button>
                        </div>

                    ) : (
                        /* ── Formulario ── */
                        <>
                            <div className="text-center mb-10">
                                <h1 className="font-headline text-3xl md:text-4xl font-bold text-sanctuary-on-surface tracking-tight mb-3">
                                    Nueva contraseña
                                </h1>
                                <p className="text-sanctuary-on-surface-variant text-lg leading-relaxed max-w-[280px]">
                                    Elige una contraseña segura para tu cuenta.
                                </p>
                            </div>

                            <form className="w-full space-y-6" onSubmit={handleReset}>
                                {/* Nueva contraseña */}
                                <div className="space-y-2">
                                    <label
                                        className="font-label text-sm font-semibold ml-4 text-sanctuary-on-surface-variant"
                                        htmlFor="new-password"
                                    >
                                        Nueva contraseña <span className="font-normal opacity-60">(mín. 8 caracteres)</span>
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
                                            lock
                                        </span>
                                        <input
                                            className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
                                            id="new-password"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={!token}
                                        />
                                    </div>
                                </div>

                                {/* Confirmar */}
                                <div className="space-y-2">
                                    <label
                                        className="font-label text-sm font-semibold ml-4 text-sanctuary-on-surface-variant"
                                        htmlFor="confirm-password"
                                    >
                                        Confirma tu contraseña
                                    </label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-sanctuary-on-surface-variant group-focus-within:text-sanctuary-primary transition-colors">
                                            lock_check
                                        </span>
                                        <input
                                            className="w-full h-16 pl-14 pr-6 bg-sanctuary-surface-container-lowest border-none rounded-sanctuary focus:ring-2 focus:ring-sanctuary-primary/20 focus:bg-sanctuary-surface-container-low transition-all placeholder:text-sanctuary-outline-variant font-body"
                                            id="confirm-password"
                                            placeholder="••••••••"
                                            type="password"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            required
                                            disabled={!token}
                                        />
                                    </div>
                                </div>

                                <button
                                    className="w-full h-16 bg-sanctuary-primary text-sanctuary-on-primary font-headline font-bold text-lg rounded-full shadow-[0px_10px_25px_rgba(74,101,79,0.2)] hover:bg-sanctuary-primary-dim active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={isLoading || !token}
                                >
                                    {isLoading ? "Guardando..." : "Guardar nueva contraseña"}
                                </button>

                                <p className="text-center text-sanctuary-on-surface-variant text-sm">
                                    <a
                                        href="/"
                                        className="text-sanctuary-primary font-bold hover:underline"
                                    >
                                        ← Volver al inicio de sesión
                                    </a>
                                </p>
                            </form>
                        </>
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

export default ResetPassword;
