import { useState } from 'react';
import { Save, Clock, User, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('availability');

  return (
    <div className="settings-page">
      <div className="content-wrapper">
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

        <div className="dashboard-grid">
          <div className="card" style={{ alignSelf: 'start', padding: '16px 0' }}>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              <button 
                className={`nav-item ${activeTab === 'availability' ? 'active' : ''}`}
                style={{ padding: '16px 24px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: activeTab === 'availability' ? 'var(--primary)' : 'var(--text-main)', width: '100%' }}
                onClick={() => setActiveTab('availability')}
              >
                <Clock size={20} />
                Horários de Trabalho
              </button>
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                style={{ padding: '16px 24px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-main)', width: '100%' }}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                Meu Perfil
              </button>
              <button 
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                style={{ padding: '16px 24px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: activeTab === 'notifications' ? 'var(--primary)' : 'var(--text-main)', width: '100%' }}
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Disponibilidade - Isis</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'].map(day => (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="checkbox" defaultChecked={day !== 'Sábado'} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{day}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="time" defaultValue="09:00" style={{ width: 'auto', padding: '10px' }} disabled={day === 'Sábado'} />
                        <span style={{ color: 'var(--text-muted)' }}>até</span>
                        <input type="time" defaultValue="18:00" style={{ width: 'auto', padding: '10px' }} disabled={day === 'Sábado'} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '48px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Disponibilidade - Jaiane</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'].map(day => (
                      <div key={`jaiane-${day}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input type="checkbox" defaultChecked={day !== 'Segunda-feira'} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                          <span style={{ fontWeight: 600, fontSize: '1rem' }}>{day}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input type="time" defaultValue="08:00" style={{ width: 'auto', padding: '10px' }} disabled={day === 'Segunda-feira'} />
                          <span style={{ color: 'var(--text-muted)' }}>até</span>
                          <input type="time" defaultValue="17:00" style={{ width: 'auto', padding: '10px' }} disabled={day === 'Segunda-feira'} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div style={{ maxWidth: '800px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Meu Perfil</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Preferências de Notificação</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '16px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                    <span style={{ fontSize: '1rem' }}>Avisar-me sobre novos agendamentos criados</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '16px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                    <span style={{ fontSize: '1rem' }}>Notificar-me de cancelamentos imediatamente</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '16px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                    <span style={{ fontSize: '1rem' }}>Enviar resumo diário de caixa por e-mail</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
