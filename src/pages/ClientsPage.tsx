import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Plus, Edit2, Trash2, RefreshCw, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../lib/supabase';
import { Client } from '../types';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    if (!newClientName || !newClientPhone) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('clients')
        .insert([{ name: newClientName, phone: newClientPhone }]);

      if (error) throw error;

      // Reset and close
      setNewClientName('');
      setNewClientPhone('');
      setIsModalOpen(false);
      
      // Refresh list
      fetchClients();
      alert('Cliente cadastrado com sucesso!');
    } catch (err: any) {
      alert('Erro ao cadastrar cliente: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  if (loading && clients.length === 0) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="clients-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gerencie os clientes cadastrados no Espaço Della's</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Novo Cliente
        </button>
      </header>

      {error && (
        <div className="login-error" style={{ marginBottom: '24px' }}>
          Erro ao carregar dados: {error}
        </div>
      )}

      <div className="card">
        <div className="search-bar" style={{ marginBottom: '24px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 8px', fontWeight: 500 }}>Nome</th>
                <th style={{ padding: '16px 8px', fontWeight: 500 }}>Telefone</th>
                <th style={{ padding: '16px 8px', fontWeight: 500 }}>Cliente desde</th>
                <th style={{ padding: '16px 8px', fontWeight: 500, width: '100px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <tr key={client.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 500 }}>{client.name}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>{client.phone}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>
                      {client.created_at ? format(parseISO(client.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR }) : '-'}
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon" title="Editar cliente" onClick={() => alert('Em breve: Edição de cliente')}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Remover cliente" onClick={() => alert('Em breve: Remoção de cliente')}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state" style={{ padding: '80px 0' }}>
                      {loading ? <RefreshCw className="spinner" size={48} /> : (searchTerm ? <UsersIcon size={48} className="empty-icon" /> : <RefreshCw size={48} className="empty-icon" style={{ opacity: 0.2 }} />)}
                      <h3>{loading ? 'Carregando...' : (searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado')}</h3>
                      <p>{loading ? 'Aguarde um momento.' : (searchTerm ? 'Revise sua busca ou cadastre um novo cliente.' : 'Os clientes cadastrados aparecerão aqui.')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Novo Cliente */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '24px' }}>Novo Cliente</h2>
            <form onSubmit={handleAddClient}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  value={newClientName} 
                  onChange={(e) => setNewClientName(e.target.value)} 
                  placeholder="Ex: Maria Oliveira" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Telefone / WhatsApp</label>
                <input 
                  type="text" 
                  value={newClientPhone} 
                  onChange={(e) => setNewClientPhone(e.target.value)} 
                  placeholder="Ex: (11) 99999-9999" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={submitting}>
                {submitting ? 'Salvando...' : 'Cadastrar Cliente'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
