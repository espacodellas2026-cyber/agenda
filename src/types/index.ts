export interface Profile {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  created_at: string;
}

export interface Service {
  id: string;
  professional_id: string;
  name: string;
  duration_minutes: number;
  price: number | null;
  created_at: string;
  // joined
  professional?: Profile;
}

export interface Appointment {
  id: string;
  client_id: string;
  professional_id: string;
  service_id: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'canceled';
  created_at: string;
  // joined
  client?: Client;
  professional?: Profile;
  service?: Service;
}

export interface AvailabilitySetting {
  id: string;
  professional_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}
