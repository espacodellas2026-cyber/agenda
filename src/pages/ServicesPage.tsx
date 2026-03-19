import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ServicesPage() {
  // Mock data representing services from database
  const services = [
    { id: '1', professional: 'Isis', name: 'Design de Sobrancelha', duration: 60, price: 45.00 },
    { id: '2', professional: 'Isis', name: 'Alongamento de Cílios', duration: 120, price: 120.00 },
    { id: '3', professional: 'Jaiane', name: 'Manicure', duration: 60, price: 35.00 },
    { id: '4', professional: 'Jaiane', name: 'Pedicure', duration: 60, price: 35.00 },
    { id: '5', professional: 'Jaiane', name: 'Spa dos Pés', duration: 90, price: 65.00 },
  ];

  return (
    <div className="services-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Serviços</h1>
          <p className="page-subtitle">Configure os serviços e valores oferecidos</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Novo Serviço
        </button>
      </header>

      <div className="dashboard-grid">
        <div className="card">
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Serviços - Isis</h2>
            <span className="badge badge-professional">Isis</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.filter(s => s.professional === 'Isis').map(service => (
              <div key={service.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{service.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{service.duration} minutos</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
                    {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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

        <div className="card">
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Serviços - Jaiane</h2>
            <span className="badge badge-professional">Jaiane</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.filter(s => s.professional === 'Jaiane').map(service => (
              <div key={service.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{service.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{service.duration} minutos</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
                    {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
      </div>
    </div>
  );
}
