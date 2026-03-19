import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Service, Profile } from '../types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [professionalsList, setProfessionalsList] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration_minutes: 60,
    professional_id: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchProfessionals();
  }, []);

  async function fetchProfessionals() {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setProfessionalsList(data);
  }

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

  async function handleAddService(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.professional_id) {
      alert('Por favor, preencha o nome e selecione a profissional.');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('services')
        .insert([{
          name: formData.name,
          duration_minutes: Number(formData.duration_minutes),
          professional_id: formData.professional_id,
          price: 0 // Defaulting to 0 since user said prices aren't needed
        }]);

      if (error) throw error;

      alert('Serviço cadastrado com sucesso!');
      setIsModalOpen(false);
      setFormData({ name: '', duration_minutes: 60, professional_id: '' });
      fetchServices();
    } catch (err: any) {
      alert('Erro ao cadastrar serviço: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Group services by professional
  const groupedProfessionals = Array.from(new Set(services.map(s => s.professional?.name || 'Geral')));

  if (loading && services.length === 0) {
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
            <p className="page-subtitle">Configure os serviços oferecidos no Espaço Della's</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
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
            {groupedProfessionals.sort().map(profName => (
              <div key={profName} className="card">
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Serviços - {profName}</h2>
                  <span className={`badge ${profName === 'Isis' ? 'badge-isis' : profName === 'Jaiane' ? 'badge-jaiane' : 'badge-secondary'}`}>
                    {profName}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {services
                    .filter(s => (s.professional?.name || 'Geral') === profName)
                    .map(service => (
                      <div key={service.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: '4px', fontWeight: 600 }}>{service.name}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{service.duration_minutes} minutos</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button className="btn-icon" title="Editar"><Edit2 size={16} /></button>
                          <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Remover"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Novo Serviço */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '440px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px' }}>
                <X size={24} />
              </button>
              <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 800 }}>Novo Serviço</h2>
              
              <form onSubmit={handleAddService}>
                <div className="form-group">
                  <label>Nome do Procedimento</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Escova com Hidratação" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Profissional Responsável</label>
                  <select 
                    value={formData.professional_id} 
                    onChange={(e) => setFormData({...formData, professional_id: e.target.value})} 
                    required
                  >
                    <option value="">Selecione...</option>
                    {professionalsList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Duração Estimada (minutos)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 60" 
                    value={formData.duration_minutes} 
                    onChange={(e) => setFormData({...formData, duration_minutes: Number(e.target.value)})} 
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '16px' }} disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Cadastrar Serviço'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
