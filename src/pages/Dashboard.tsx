import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, RefreshCw, UserPlus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../lib/supabase';
import { Appointment, Client, Profile, Service } from '../types';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNewClient, setIsAddingNewClient] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  // Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [professionals, setProfessionals] = useState<Profile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    client_id: '',
    professional_id: '',
    service_id: '',
    appointment_date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00'
  });
  
  // Quick Client State
  const [newClientData, setNewClientData] = useState({ name: '', phone: '' });
  
  const [submitting, setSubmitting] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    fetchMonthAppointments();
    fetchFormData();
  }, [currentDate]);

  async function fetchFormData() {
    try {
      const [clientsRes, profsRes, servicesRes] = await Promise.all([
        supabase.from('clients').select('*').order('name'),
        supabase.from('profiles').select('*').order('name'),
        supabase.from('services').select('*')
      ]);

      if (clientsRes.data) setClients(clientsRes.data);
      if (profsRes.data) setProfessionals(profsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    } catch (err) {
      console.error('Erro ao carregar opções do formulário:', err);
    }
  }

  async function fetchMonthAppointments() {
    try {
      setLoading(true);
      setError(null);
      
      const firstDay = format(monthStart, 'yyyy-MM-dd');
      const lastDay = format(monthEnd, 'yyyy-MM-dd');

      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          client:client_id (name, phone),
          professional:professional_id (name),
          service:service_id (name, duration_minutes)
        `)
        .gte('appointment_date', firstDay)
        .lte('appointment_date', lastDay);

      if (fetchError) throw fetchError;
      setAppointments(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  }

  function openNewModal() {
    setEditingAppointment(null);
    setIsAddingNewClient(false);
    setNewClientData({ name: '', phone: '' });
    setFormData({
      client_id: '',
      professional_id: '',
      service_id: '',
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      start_time: '09:00'
    });
    setIsModalOpen(true);
  }

  function openEditModal(apt: Appointment) {
    setEditingAppointment(apt);
    setIsAddingNewClient(false);
    setFormData({
      client_id: apt.client_id,
      professional_id: apt.professional_id,
      service_id: apt.service_id || '',
      appointment_date: apt.appointment_date,
      start_time: apt.start_time.substring(0, 5)
    });
    setIsModalOpen(true);
  }

  async function handleDeleteAppointment(id: string) {
    if (!confirm('Deseja realmente apagar este agendamento?')) return;
    
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchMonthAppointments();
    } catch (err: any) {
      alert('Erro ao apagar agendamento: ' + err.message);
    }
  }

  async function checkConflicts(profId: string, date: string, startTime: string, endTime: string, currentId?: string) {
    // ALERT FORCED FOR DEBUGGING
    console.log(`DEBUG: Iniciando busca de conflitos para Prof ${profId} no dia ${date}`);
    
    // Check if any existing appointment for the same professional overlaps
    const { data: conflicts, error } = await supabase
      .from('appointments')
      .select('id, start_time, end_time')
      .eq('professional_id', profId)
      .eq('appointment_date', date);

    if (error) {
       console.error("DEBUG: Erro na busca:", error);
       return false;
    }

    console.log(`DEBUG: Encontrados ${conflicts?.length || 0} agendamentos no banco.`);

    if (!conflicts || conflicts.length === 0) return false;

    // Filter out the current appointment being edited
    const otherAppointments = currentId ? conflicts.filter(apt => apt.id !== currentId) : conflicts;
    
    const conflictingItem = otherAppointments.find(apt => {
      const aptStart = apt.start_time;
      const aptEnd = apt.end_time;
      const hasOverlap = (startTime < aptEnd && endTime > aptStart);
      if (hasOverlap) {
         console.log(`DEBUG: Conflito encontrado com ${aptStart} - ${aptEnd}`);
      }
      return hasOverlap;
    });

    return !!conflictingItem;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // ALERT FORCED TO CONFIRM SUBMIT IS CALLED
    console.log("DEBUG:handleSubmit() foi ativado!");
    
    if (!isAddingNewClient && !formData.client_id) {
       alert('Selecione um cliente ou cadastre um novo.'); return;
    }
    if (isAddingNewClient && (!newClientData.name || !newClientData.phone)) {
       alert('Preencha os dados do novo cliente.'); return;
    }
    if (!formData.professional_id || !formData.service_id) {
       alert('Selecione a profissional e o serviço.'); return;
    }

    try {
      setSubmitting(true);
      
      const service = services.find(s => s.id === formData.service_id);
      const duration = service?.duration_minutes || 60;
      
      const [h, m] = formData.start_time.split(':').map(Number);
      const totalMinutes = h * 60 + m + duration;
      const endH = Math.floor(totalMinutes / 60);
      const endM = totalMinutes % 60;
      const end_time = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;
      const start_time = `${formData.start_time}:00`;

      // CONFLICT CHECK
      const hasConflict = await checkConflicts(
        formData.professional_id, 
        formData.appointment_date, 
        start_time, 
        end_time,
        editingAppointment?.id
      );

      if (hasConflict) {
        const confirmSave = confirm('⚠️ ALERTA DE CONFLITO: A profissional selecionada já possui um agendamento neste mesmo horário! Deseja realizar este agendamento duplicado mesmo assim?');
        if (!confirmSave) {
          setSubmitting(false);
          return;
        }
      }

      let finalClientId = formData.client_id;
      
      if (isAddingNewClient) {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert([{ name: newClientData.name, phone: newClientData.phone }])
          .select()
          .single();
          
        if (clientError) throw clientError;
        finalClientId = newClient.id;
      }
      
      const payload = {
        client_id: finalClientId,
        professional_id: formData.professional_id,
        service_id: formData.service_id,
        appointment_date: formData.appointment_date,
        start_time,
        end_time,
        status: 'scheduled'
      };

      if (editingAppointment) {
        const { error: updateError } = await supabase
          .from('appointments')
          .update(payload)
          .eq('id', editingAppointment.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('appointments')
          .insert([payload]);

        if (insertError) throw insertError;
      }

      alert('Operação realizada com sucesso!');
      setIsModalOpen(false);
      fetchMonthAppointments();
      if (isAddingNewClient) fetchFormData(); 
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setFormData(prev => ({ ...prev, appointment_date: format(day, 'yyyy-MM-dd') }));
  };

  const selectedDateAppointments = appointments.filter(apt => 
    isSameDay(parseISO(apt.appointment_date), selectedDate)
  );

  return (
    <div className="dashboard">
      <div className="content-wrapper">
        <header className="page-header">
          <div>
            <h1 className="page-title">Agenda</h1>
            <p className="page-subtitle">Gerencie os agendamentos do Espaço Della's</p>
          </div>
          <button className="btn btn-primary" id="btn-novo-agendamento" onClick={openNewModal}>
            <Plus size={20} />
            Novo Agendamento
          </button>
        </header>

        {error && (
          <div className="login-error" style={{ marginBottom: '24px' }}>
            Erro ao carregar dados: {error}
          </div>
        )}

        <div className="dashboard-grid">
          <div className="calendar-panel card">
            <div className="calendar-header">
              <button onClick={prevMonth} className="btn-icon">
                <ChevronLeft size={24} />
              </button>
              <h2 className="calendar-month">
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </h2>
              <button onClick={nextMonth} className="btn-icon">
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="calendar-weekdays">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>

            <div className="calendar-days">
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-${index}`} className="calendar-day empty"></div>
              ))}
              
              {days.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                
                const dayAppointments = appointments.filter(apt => apt.appointment_date === dateStr);
                const hasIsis = dayAppointments.some(apt => apt.professional?.name === 'Isis');
                const hasJaiane = dayAppointments.some(apt => apt.professional?.name === 'Jaiane');
                
                return (
                  <div
                    key={day.toString()}
                    className={`calendar-day ${!isCurrentMonth ? "disabled" : ""} ${isSelected ? "selected" : ""} ${isToday(day) ? "today" : ""}`}
                    onClick={() => onDateClick(day)}
                  >
                    <span className="day-number">{format(day, "d")}</span>
                    {(hasIsis || hasJaiane) && (
                      <div className="dots-container">
                         {hasIsis && <span className="dot isis"></span>}
                         {hasJaiane && <span className="dot jaiane"></span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="appointments-panel card">
            <div className="appointments-header">
              <h2>
                Agendamentos
                <span id="label-selected-date" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '12px', fontWeight: 400 }}>
                  {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
              </h2>
            </div>

            <div className="appointments-list">
              {selectedDateAppointments.length > 0 ? (
                selectedDateAppointments
                  .sort((a,b) => a.start_time.localeCompare(b.start_time))
                  .map(apt => {
                    const profName = apt.professional?.name || 'Geral';
                    const isIsis = profName === 'Isis';
                    const professionalClass = isIsis ? 'pro-isis' : 'pro-jaiane';
                    const badgeClass = isIsis ? 'badge-isis' : 'badge-jaiane';
                    
                    return (
                      <div key={apt.id} className={`appointment-card ${professionalClass}`}>
                        <div className="appointment-time">{apt.start_time.substring(0, 5)}</div>
                        <div className="appointment-details">
                          <h3 className="client-name">{apt.client?.name}</h3>
                          <p className="service-name">{apt.service?.name}</p>
                          <div className="appointment-meta">
                            <span className={`badge ${badgeClass}`}>{profName}</span>
                            <span className="duration" style={{ marginLeft: '8px' }}>{apt.service?.duration_minutes || '?'} min</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-icon" title="Editar" onClick={() => openEditModal(apt)}><Edit2 size={16} /></button>
                          <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Apagar" onClick={() => handleDeleteAppointment(apt.id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="empty-state">
                  {loading ? <RefreshCw className="spinner" size={48} /> : <CalendarIcon size={48} className="empty-icon" />}
                  <h3>{loading ? 'Buscando...' : 'Nenhum agendamento'}</h3>
                  <p>{loading ? 'Aguarde um momento.' : 'Não há horários marcados para esta data.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Único (Inserir ou Editar) */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '540px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <button className="btn-icon" id="btn-fechar-modal" onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px' }}>
                <X size={24} />
              </button>
              <h2 style={{ marginBottom: '24px', fontSize: '1.6rem', fontWeight: 800 }}>
                {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h2>
              
              <form onSubmit={handleSubmit} id="form-agendamento">
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ margin: 0 }}>Cliente</label>
                    {!editingAppointment && (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingNewClient(!isAddingNewClient)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                      >
                        {isAddingNewClient ? 'Selecionar da Lista' : <><UserPlus size={16} /> Novo Cliente</>}
                      </button>
                    )}
                  </div>
                  
                  {isAddingNewClient ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px dashed var(--primary)' }}>
                      <input type="text" placeholder="Nome" value={newClientData.name} onChange={e => setNewClientData({...newClientData, name: e.target.value})} required />
                      <input type="text" placeholder="Telefone" value={newClientData.phone} onChange={e => setNewClientData({...newClientData, phone: e.target.value})} required />
                    </div>
                  ) : (
                    <select value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} required>
                      <option value="">Escolha um cliente...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label>Profissional Responsável</label>
                  <select value={formData.professional_id} id="select-profissional" onChange={e => setFormData({...formData, professional_id: e.target.value})} required>
                    <option value="">Selecione...</option>
                    {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Serviço</label>
                  <select value={formData.service_id} onChange={e => setFormData({...formData, service_id: e.target.value})} required>
                    <option value="">Selecione o procedimento...</option>
                    {services
                      .filter(s => !formData.professional_id || s.professional_id === formData.professional_id)
                      .map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} min)</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Data</label>
                    <input type="date" value={formData.appointment_date} onChange={e => setFormData({...formData, appointment_date: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Horário</label>
                    <input type="time" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} required />
                  </div>
                </div>

                <button type="submit" id="btn-confirmar-agendamento" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '16px', fontSize: '1.1rem' }} disabled={submitting}>
                  {submitting ? 'Salvando...' : (editingAppointment ? 'Salvar Alterações' : 'Confirmar Agendamento')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
