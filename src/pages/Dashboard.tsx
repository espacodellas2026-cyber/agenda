import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // Mock appointments
  const appointments = [
    { id: '1', client: 'Maria Silva', service: 'Design de Sobrancelha', time: '09:00', duration: '60 min', professional: 'Isis' },
    { id: '2', client: 'Ana Paula', service: 'Manicure', time: '10:30', duration: '90 min', professional: 'Jaiane' },
    { id: '3', client: 'Juliana Costa', service: 'Alongamento Cílios', time: '14:00', duration: '120 min', professional: 'Isis' },
  ];

  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">Agenda</h1>
          <p className="page-subtitle">Gerencie os agendamentos do salão</p>
        </div>
        <button className="btn btn-primary">
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
              
              return (
                <div
                  key={day.toString()}
                  className={`calendar-day ${!isCurrentMonth ? "disabled" : ""} ${isSelected ? "selected" : ""} ${isToday(day) ? "today" : ""}`}
                  onClick={() => onDateClick(day)}
                >
                  <span className="day-number">{formattedDate}</span>
                  {/* Mock indicators */}
                  {isCurrentMonth && (day.getDate() % 3 === 0) && <span className="day-indicator"></span>}
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
            {appointments.length > 0 ? (
              appointments.map(apt => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-time">{apt.time}</div>
                  <div className="appointment-details">
                    <h3 className="client-name">{apt.client}</h3>
                    <p className="service-name">{apt.service}</p>
                    <div className="appointment-meta">
                      <span className="badge badge-professional">{apt.professional}</span>
                      <span className="duration">{apt.duration}</span>
                    </div>
                  </div>
                </div>
              ))
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
    </div>
  );
}
