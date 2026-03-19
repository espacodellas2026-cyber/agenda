import { Outlet, useLocation } from 'react-router-dom';
import { Calendar, Users, Briefcase, Settings, LogOut, Sparkles } from 'lucide-react';

export default function AppLayout() {
  const location = useLocation();

  // Mock profile data later to be replaced by AuthContext
  const profile = { name: 'Admin (Modo Dev)', role: 'Gerente' };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Sparkles className="sidebar-logo-icon" />
          <h2 className="sidebar-title">Espaço Della's</h2>
        </div>

        <nav className="sidebar-nav">
          <a href="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Calendar size={20} />
            <span>Agenda</span>
          </a>
          <a href="/clientes" className={`nav-item ${location.pathname === '/clientes' ? 'active' : ''}`}>
            <Users size={20} />
            <span>Clientes</span>
          </a>
          <a href="/servicos" className={`nav-item ${location.pathname === '/servicos' ? 'active' : ''}`}>
            <Briefcase size={20} />
            <span>Serviços</span>
          </a>
          <a href="/configuracoes" className={`nav-item ${location.pathname === '/configuracoes' ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Configurações</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{profile.name}</span>
              <span className="user-role">{profile.role}</span>
            </div>
          </div>
          <button className="logout-btn" title="Sair (Desativado em Teste)">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <Outlet />
      </main>
    </div>
  );
}
