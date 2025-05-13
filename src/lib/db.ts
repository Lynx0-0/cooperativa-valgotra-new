// Questo è un file suggerito per lib/db.ts con le correzioni dei tipi 'any'

import { createClient } from '@supabase/supabase-js';

// Qui dovresti definire i tipi correttamente invece di usare 'any'
// Per esempio:
type DatabaseRecord = Record<string, unknown>;

// Crea il client Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Definizione tipi
export type CallBooking = {
  id?: string;
  name: string;
  surname: string;
  phone: string;
  email?: string;
  date: string;
  time_slot: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
};

export type ContactMessage = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  read?: boolean;
  archived?: boolean;
  created_at?: string;
};

export type Product = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  in_stock: boolean;
  featured?: boolean;
  created_at?: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id?: string;
  customer: {
    name: string;
    surname: string;
    phone: string;
    email?: string;
    notes?: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
};

export type Project = {
  id?: string;
  title: string;
  description: string;
  image_url?: string;
  client?: string;
  category?: string;
  completion_date?: string;
  featured?: boolean;
  created_at?: string;
};

// Funzione per ottenere le prenotazioni
export async function getAllBookings(): Promise<CallBooking[]> {
  const { data, error } = await supabase
    .from('call_bookings')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Errore nel recupero delle prenotazioni:', error);
    throw error;
  }
  
  return data || [];
}

// Aggiorna lo stato di una prenotazione
export async function updateBookingStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('call_bookings')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error('Errore nell\'aggiornamento dello stato della prenotazione:', error);
    throw error;
  }
}

// Prenotazione chiamata
export async function saveCallBooking(booking: Omit<CallBooking, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('call_bookings')
    .insert([
      {
        ...booking,
        status: 'pending', // Default status
        created_at: new Date().toISOString(),
      }
    ]);
  
  if (error) {
    console.error('Errore nel salvataggio della prenotazione:', error);
    throw error;
  }
}

// Ottieni slot orari occupati per una data
export async function getBookedTimeSlots(date: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('call_bookings')
    .select('time_slot')
    .eq('date', date)
    .in('status', ['pending', 'confirmed']);
  
  if (error) {
    console.error('Errore nel recupero degli slot orari occupati:', error);
    throw error;
  }
  
  return data?.map(item => item.time_slot) || [];
}

// Messaggi di contatto
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Errore nel recupero dei messaggi:', error);
    throw error;
  }
  
  return data || [];
}

// Salva un messaggio di contatto
export async function saveContactMessage(message: Omit<ContactMessage, 'id' | 'created_at' | 'read' | 'archived'>): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .insert([
      {
        ...message,
        read: false,
        archived: false,
        created_at: new Date().toISOString(),
      }
    ]);
  
  if (error) {
    console.error('Errore nel salvataggio del messaggio:', error);
    throw error;
  }
}

export async function markMessageAsRead(id: string, read: boolean): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .update({ read })
    .eq('id', id);
  
  if (error) {
    console.error('Errore nell\'aggiornamento dello stato di lettura:', error);
    throw error;
  }
}

export async function archiveMessage(id: string, archived: boolean): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .update({ archived })
    .eq('id', id);
  
  if (error) {
    console.error('Errore nell\'archiviazione del messaggio:', error);
    throw error;
  }
}

// Prodotti
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Errore nel recupero dei prodotti:', error);
    throw error;
  }
  
  return data || [];
}

export async function saveProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        ...product,
        created_at: new Date().toISOString(),
      }
    ])
    .select();
  
  if (error) {
    console.error('Errore nel salvataggio del prodotto:', error);
    throw error;
  }
  
  return data || [];
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id);
  
  if (error) {
    console.error('Errore nell\'aggiornamento del prodotto:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Errore nella cancellazione del prodotto:', error);
    throw error;
  }
}

// Ordini
export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Errore nel recupero degli ordini:', error);
    throw error;
  }
  
  return data || [];
}

export async function saveOrder(order: Omit<Order, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .insert([order]);
  
  if (error) {
    console.error('Errore nel salvataggio dell\'ordine:', error);
    throw error;
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error('Errore nell\'aggiornamento dello stato dell\'ordine:', error);
    throw error;
  }
}

// Progetti
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Errore nel recupero dei progetti:', error);
    throw error;
  }
  
  return data || [];
}

export async function saveProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        ...project,
        created_at: new Date().toISOString(),
      }
    ])
    .select();
  
  if (error) {
    console.error('Errore nel salvataggio del progetto:', error);
    throw error;
  }
  
  return data || [];
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id);
  
  if (error) {
    console.error('Errore nell\'aggiornamento del progetto:', error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Errore nella cancellazione del progetto:', error);
    throw error;
  }
}

// Funzioni per l'autenticazione
export async function loginAdmin(username: string, password: string): Promise<DatabaseRecord | null> {
  try {
    // In un'app reale, la verifica della password dovrebbe essere gestita sul server
    // Questa è solo una simulazione per demo
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('active', true)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // In una vera app, dovresti verificare la password con bcrypt o simili
    const passwordMatches = password === data.password; // Semplificato per demo
    
    if (passwordMatches) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Errore durante il login:', error);
    return null;
  }
}