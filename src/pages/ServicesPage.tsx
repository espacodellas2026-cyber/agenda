import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          professional:professional_id (name)
        `);

      if (error) throw error;
      setServices(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar serviços:', err);
    } finally {
      setLoading(false);
    }
  }

  // Get unique professionals from the fetched services
  const professionals = Array.from(new Set(services.map(s => s.professional?.name || 'Geral')));

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="content-wrapper">
        <header className="page-header">
          <div>
            <h1 className="page-title">Serviços</h1>
            <p className="page-subtitle">Configure os serviços e valores oferecidos no Espaço Della's</p>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Em breve: Formulário de novo serviço')}>
            <Plus size={20} />
            Novo Serviço
          </button>
        </header>

        {error && (
          <div className="login-error" style={{ marginBottom: '24px' }}>
            Erro ao carregar dados: {error}
          </div>
        )}

        {services.length === 0 && !error ? (
          <div className="card" style={{ textAlign: 'center', padding: '100px 0' }}>
            <RefreshCw size={48} className="empty-icon" style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3>Nenhum serviço cadastrado</h3>
            <p className="page-subtitle">Os serviços cadastrados no banco de dados aparecerão aqui separados por profissional.</p>
          </div>
        ) : (
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))' }}>
            {professionals.sort().map(profName => (
              <div key={profName} className="card">
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '1.2rem' }}>Serviços - {profName}</h2>
                  <span className={`badge ${profName === 'Isis' ? 'badge-isis' : profName === 'Jaiane' ? 'badge-jaiane' : 'badge-secondary'}`}>
                    {profName}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {services
                    .filter(s => (s.professional?.name || 'Geral') === profName)
                    .map(service => (
                      <div key={service.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{service.name}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{service.duration_minutes} minutos</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
                            {(service.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="btn-icon"><Edit2 size={16} /></button>
                            <button className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
