import { useState } from 'react';
import { Users as UsersIcon, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for UI
  const clients = [
    { id: '1', name: 'Maria Silva', phone: '(11) 98765-4321', created_at: new Date(2023, 10, 15) },
    { id: '2', name: 'Ana Paula Costa', phone: '(11) 91234-5678', created_at: new Date(2023, 11, 2) },
    { id: '3', name: 'Juliana Fernandes', phone: '(11) 99988-7766', created_at: new Date(2024, 0, 10) },
    { id: '4', name: 'Beatriz Almeida', phone: '(11) 95544-3322', created_at: new Date(2024, 1, 5) },
  ];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="clients-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gerencie os clientes cadastrados no salão</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Novo Cliente
        </button>
      </header>

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
                <th style={{ padding: '16px 8px', fontWeight: 500, width: '60px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <tr key={client.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 500 }}>{client.name}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>{client.phone}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>
                      {format(client.created_at, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon" title="Editar cliente" onClick={() => alert('Abrir formulário de edição do cliente: ' + client.name)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Remover cliente" onClick={() => alert('Deseja realmente remover o cliente: ' + client.name + '?')}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state" style={{ padding: '40px 0' }}>
                      <UsersIcon size={48} className="empty-icon" />
                      <h3>Nenhum cliente encontrado</h3>
                      <p>Revise a busca ou adicione um novo cliente.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
