import { useState } from 'react';
import { Save, Clock, User, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('availability');

  return (
    <div className="settings-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Configurações</h1>
          <p className="page-subtitle">Ajuste horários, disponibilidade e preferências</p>
        </div>
        <button className="btn btn-primary">
          <Save size={20} />
          Salvar Alterações
        </button>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
        <div className="card" style={{ alignSelf: 'start', padding: '16px 0' }}>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            <button 
              className={`nav-item ${activeTab === 'availability' ? 'active' : ''}`}
              style={{ padding: '16px 24px', background: 'none', border: 'none', borderRight: activeTab === 'availability' ? '3px solid var(--primary)' : 'none', textAlign: 'left', cursor: 'pointer', borderRadius: 0, color: activeTab === 'availability' ? 'var(--primary)' : 'var(--text-main)', width: '100%' }}
              onClick={() => setActiveTab('availability')}
            >
              <Clock size={20} />
              Horários de Trabalho
            </button>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              style={{ padding: '16px 24px', background: 'none', border: 'none', borderRight: activeTab === 'profile' ? '3px solid var(--primary)' : 'none', textAlign: 'left', cursor: 'pointer', borderRadius: 0, color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-main)', width: '100%' }}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              Meu Perfil
            </button>
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              style={{ padding: '16px 24px', background: 'none', border: 'none', borderRight: activeTab === 'notifications' ? '3px solid var(--primary)' : 'none', textAlign: 'left', cursor: 'pointer', borderRadius: 0, color: activeTab === 'notifications' ? 'var(--primary)' : 'var(--text-main)', width: '100%' }}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={20} />
              Notificações
            </button>
          </nav>
        </div>

        <div className="card">
          {activeTab === 'availability' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Disponibilidade - Isis</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'].map(day => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" defaultChecked={day !== 'Sábado'} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <span style={{ fontWeight: 500 }}>{day}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="time" defaultValue="09:00" style={{ width: 'auto', padding: '8px' }} disabled={day === 'Sábado'} />
                      <span style={{ color: 'var(--text-muted)' }}>até</span>
                      <input type="time" defaultValue="18:00" style={{ width: 'auto', padding: '8px' }} disabled={day === 'Sábado'} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Disponibilidade - Jaiane</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'].map(day => (
                    <div key={`jaiane-${day}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="checkbox" defaultChecked={day !== 'Segunda-feira'} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                        <span style={{ fontWeight: 500 }}>{day}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="time" defaultValue="08:00" style={{ width: 'auto', padding: '8px' }} disabled={day === 'Segunda-feira'} />
                        <span style={{ color: 'var(--text-muted)' }}>até</span>
                        <input type="time" defaultValue="17:00" style={{ width: 'auto', padding: '8px' }} disabled={day === 'Segunda-feira'} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Meu Perfil</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input type="text" defaultValue="Admin (Modo Dev)" />
                </div>
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" defaultValue="admin@espacodellas.com" disabled />
                </div>
                <div className="form-group">
                  <label>Senha atual</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label>Nova senha</label>
                  <input type="password" placeholder="Deixe em branco para não alterar" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Preferências de Notificação</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                  <span>Avisar-me sobre novos agendamentos criados</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                  <span>Notificar-me de cancelamentos imediatamente</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                  <span>Enviar resumo diário de caixa por e-mail</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
