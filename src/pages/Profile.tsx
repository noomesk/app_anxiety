import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface UserData {
  user_id: number;
  email: string;
  alias: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // No token, redirect to login/home
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Sesión expirada o inválida');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError("Inicia sesión para ver tu perfil.");
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : '👤';
  };

  return (
    <div className="bg-sanctuary-surface font-body text-sanctuary-on-surface min-h-screen flex flex-col pt-12">
      <main className="max-w-md mx-auto px-6 w-full flex-1 pb-32">
        
        {/* Header */}
        <h1 className="font-headline text-3xl font-bold text-sanctuary-on-surface mb-8 text-center pt-8 tracking-tight">
          Tu Espacio 🌿
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 rounded-full border-4 border-sanctuary-outline-variant/30 border-t-sanctuary-primary animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-[24px] text-center">
            <p>{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-sanctuary-primary text-white rounded-full font-bold"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* User Info Card */}
            <div className="bg-sanctuary-surface-container-lowest border border-sanctuary-outline-variant/30 rounded-[32px] p-6 flex flex-col items-center shadow-sm">
              <div className="w-24 h-24 bg-sanctuary-primary-container text-sanctuary-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {userData ? getInitials(userData.email) : 'BR'}
              </div>
              <h2 className="font-headline text-xl font-bold mb-1">
                {userData?.alias || 'Paciente Brotito'}
              </h2>
              <p className="text-sanctuary-on-surface-variant text-sm mb-6 bg-sanctuary-surface-container-high px-4 py-1 rounded-full">
                {userData?.email}
              </p>
            </div>

            {/* Menu Options */}
            <div className="bg-sanctuary-surface-container-lowest border border-sanctuary-outline-variant/20 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-4 flex items-center gap-4 border-b border-sanctuary-outline-variant/10 cursor-not-allowed opacity-60">
                <div className="w-10 h-10 bg-sanctuary-surface-variant rounded-full flex justify-center items-center text-sanctuary-on-surface">
                  <span className="material-symbols-outlined">settings</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Ajustes de Cuenta</h3>
                  <p className="text-xs text-sanctuary-on-surface-variant">Contraseña y notificaciones</p>
                </div>
                <span className="material-symbols-outlined text-sanctuary-outline-variant">chevron_right</span>
              </div>
              
              <div className="p-4 flex items-center gap-4 cursor-not-allowed opacity-60">
                <div className="w-10 h-10 bg-sanctuary-surface-variant rounded-full flex justify-center items-center text-sanctuary-on-surface">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Historial de Brotito</h3>
                  <p className="text-xs text-sanctuary-on-surface-variant">Memoria de tus conversaciones</p>
                </div>
                <span className="material-symbols-outlined text-sanctuary-outline-variant">chevron_right</span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full bg-[#fae1df] text-[#a83836] border border-[#f5c2c0] py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#fad4d2] active:scale-95 transition-all mt-8 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Cerrar Sesión
            </button>
            
            <p className="text-center text-xs text-sanctuary-on-surface-variant/60 mt-4">
              Anxiety Companion V1.0.0
            </p>

          </div>
        )}

      </main>

      {/* Global Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-4 bg-sanctuary-surface/95 backdrop-blur-xl rounded-t-[32px] border-t border-sanctuary-outline-variant/15 shadow-[0px_-10px_30px_rgba(52,50,43,0.04)]">
        <Link className="flex flex-col items-center justify-center text-sanctuary-on-surface/40 px-6 py-2 transition-all hover:text-sanctuary-on-surface/80" to="/chat">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          <span className="text-[10px] font-bold mt-1 uppercase">Chat</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-sanctuary-on-surface/40 px-6 py-2 transition-all hover:text-sanctuary-on-surface/80" to="/resources">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>library_books</span>
          <span className="text-[10px] font-bold mt-1 uppercase">Resources</span>
        </Link>
        <Link className="flex flex-col items-center text-sanctuary-on-primary-container px-6 py-2" to="/profile">
          <div className="bg-[#5c7a61] text-white px-8 py-2 rounded-full flex flex-col items-center shadow-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            <span className="text-[10px] font-bold mt-1 uppercase">Profile</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Profile;
