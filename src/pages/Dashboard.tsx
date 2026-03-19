import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart; // For a full calendar you might want startOfWeek
  const endDate = monthEnd; // and endOfWeek

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  // Mock appointments com datas concretas do ciclo atual
  const appointments = [
    { id: '1', client: 'Maria Silva', service: 'Design de Sobrancelha', time: '09:00', duration: '60 min', professional: 'Isis', date: new Date() },
    { id: '2', client: 'Ana Paula', service: 'Manicure', time: '10:30', duration: '90 min', professional: 'Jaiane', date: new Date() },
    { id: '3', client: 'Juliana Costa', service: 'Alongamento Cílios', time: '14:00', duration: '120 min', professional: 'Isis', date: addMonths(new Date(), 0) },
    { id: '4', client: 'Carla', service: 'Pedicure', time: '08:00', duration: '45 min', professional: 'Jaiane', date: addMonths(new Date(), 0) }
  ];

  // Adicionando um de teste amanhã pra ver as bolinhas coloridas
  appointments[2].date.setDate(currentDate.getDate() + 1);
  appointments[3].date.setDate(currentDate.getDate() + 1);

  // Filtrando os agendamentos pelo selectedDate atual
  const selectedDateAppointments = appointments.filter(apt => isSameDay(apt.date, selectedDate));

  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">Agenda</h1>
          <p className="page-subtitle">Gerencie os agendamentos do salão</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Novo Agendamento
        </button>
      </header>

      <div className="dashboard-grid">
        <div className="calendar-panel card">
          <div className="calendar-header">
            <button onClick={prevMonth} className="btn-icon">
              <ChevronLeft size={24} />
            </button>
            <h2 className="calendar-month">
              {format(currentDate, dateFormat, { locale: ptBR })}
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
            {/* Pad empty days if month doesn't start on Sunday */}
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="calendar-day empty"></div>
            ))}
            
            {days.map((day) => {
              const formattedDate = format(day, "d");
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);
              
              // Verify professionals with appointments on this specific day
              const dayAppointments = appointments.filter(apt => isSameDay(apt.date, day));
              const hasIsis = dayAppointments.some(apt => apt.professional === 'Isis');
              const hasJaiane = dayAppointments.some(apt => apt.professional === 'Jaiane');
              
              return (
                <div
                  key={day.toString()}
                  className={`calendar-day ${!isCurrentMonth ? "disabled" : ""} ${isSelected ? "selected" : ""} ${isToday(day) ? "today" : ""}`}
                  onClick={() => onDateClick(day)}
                >
                  <span className="day-number">{formattedDate}</span>
                  
                  {/* Color dots depending on who is working that day */}
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
              <span className="text-muted text-sm ml-2">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </span>
            </h2>
          </div>

          <div className="appointments-list">
            {selectedDateAppointments.length > 0 ? (
              selectedDateAppointments.sort((a,b) => a.time.localeCompare(b.time)).map(apt => {
                const isIsis = apt.professional === 'Isis';
                const professionalClass = isIsis ? 'pro-isis' : 'pro-jaiane';
                const badgeClass = isIsis ? 'badge-isis' : 'badge-jaiane';
                
                return (
                  <div key={apt.id} className={`appointment-card ${professionalClass}`}>
                    <div className="appointment-time">{apt.time}</div>
                    <div className="appointment-details">
                      <h3 className="client-name">{apt.client}</h3>
                      <p className="service-name">{apt.service}</p>
                      <div className="appointment-meta">
                        <span className={`badge ${badgeClass}`}>{apt.professional}</span>
                        <span className="duration">{apt.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <CalendarIcon size={48} className="empty-icon" />
                <h3>Nenhum agendamento</h3>
                <p>Não há horários marcados para esta data.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Novo Agendamento */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <button 
              className="btn-icon" 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Novo Agendamento</h2>
            
            <form onSubmit={(e) => { 
                e.preventDefault(); 
                alert('Os formulários estão prontos! Quando integrarmos o Supabase, os agendamentos serão salvos de verdade.'); 
                setIsModalOpen(false); 
            }}>
              <div className="form-group">
                <label>Cliente</label>
                <input type="text" placeholder="Nome do cliente (ou busque um existente)" required />
              </div>
              <div className="form-group">
                <label>Profissional Responsável</label>
                <select required>
                  <option value="">Selecione...</option>
                  <option value="Isis">Isis</option>
                  <option value="Jaiane">Jaiane</option>
                </select>
              </div>
              <div className="form-group">
                <label>Serviço Desejado</label>
                <select required>
                  <option value="">Selecione...</option>
                  <option value="Design">Design de Sobrancelha</option>
                  <option value="Cílios">Alongamento de Cílios</option>
                  <option value="Manicure">Manicure / Pedicure</option>
                  <option value="Spa">Spa dos Pés</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Data</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>Horário</label>
                  <input type="time" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
                Confirmar Agendamento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
