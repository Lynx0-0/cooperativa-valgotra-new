import { supabase } from './supabase'

// Tipi di dati
export type CallBooking = {
  id?: string
  name: string
  surname: string
  phone: string
  email?: string
  date: string
  time_slot: string
  notes?: string
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export type ContactMessage = {
  created_at: any
  id?: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  read?: boolean
  archived?: boolean
}

export type Product = {
  id?: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  in_stock?: boolean
  featured?: boolean
}

export type Project = {
  id?: string
  title: string
  description: string
  image_url?: string
  completion_date?: string
  client?: string
  category?: string
  featured?: boolean
}

// PRENOTAZIONI CHIAMATE
export async function saveCallBooking(booking: CallBooking) {
  try {
    const { data, error } = await supabase
      .from('calls')
      .insert([booking])
      .select()

    if (error) {
      console.error("Errore Supabase:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Errore dettagliato:", error);
    throw error;
  }
}

export async function getBookedTimeSlots(date: string) {
  try {
    const { data, error } = await supabase
      .from('calls')
      .select('time_slot')
      .eq('date', date)
      .neq('status', 'cancelled')

    if (error) {
      console.error("Errore nel recupero slot orari:", error);
      throw error;
    }
    
    return data?.map(item => item.time_slot) || [];
  } catch (error) {
    console.error("Errore dettagliato:", error);
    return [];
  }
}

export async function getAllBookings() {
  try {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true })

    if (error) {
      console.error("Errore nel recupero prenotazioni:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Errore dettagliato:", error);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('calls')
      .update({ status })
      .eq('id', id)
      .select()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nell'aggiornamento dello stato:", error);
    throw error;
  }
}

// MESSAGGI DI CONTATTO
export async function saveContactMessage(message: ContactMessage) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message])
      .select()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nel salvataggio del messaggio:", error);
    throw error;
  }
}

export async function getAllContactMessages() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Errore nel recupero dei messaggi:", error);
    return [];
  }
}

export async function markMessageAsRead(id: string, read: boolean = true) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read })
      .eq('id', id)
      .select()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nell'aggiornamento del messaggio:", error);
    throw error;
  }
}

export async function archiveMessage(id: string, archived: boolean = true) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ archived })
      .eq('id', id)
      .select()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nell'archiviazione del messaggio:", error);
    throw error;
  }
}

// PRODOTTI
export async function saveProduct(product: Product) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nel salvataggio del prodotto:", error);
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nell'aggiornamento del prodotto:", error);
    throw error;
  }
}

export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Errore nel recupero dei prodotti:", error);
    return [];
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Errore nell'eliminazione del prodotto:", error);
    throw error;
  }
}

// PROGETTI
export async function saveProject(project: Project) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nel salvataggio del progetto:", error);
    throw error;
  }
}

export async function updateProject(id: string, project: Partial<Project>) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nell'aggiornamento del progetto:", error);
    throw error;
  }
}

export async function getAllProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Errore nel recupero dei progetti:", error);
    return [];
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Errore nell'eliminazione del progetto:", error);
    throw error;
  }
}

// Aggiungi questi tipi e funzioni al tuo file db.ts

// Tipo per gli elementi dell'ordine
export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

// Tipo per i dati del cliente
export interface CustomerInfo {
  name: string;
  surname: string;
  phone: string;
  email?: string;
  notes?: string;
}

// Tipo per l'ordine completo
export interface Order {
  id?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

// Funzione per salvare un nuovo ordine
export async function saveOrder(order: Order) {
  try {
    console.log("Tentativo di salvare l'ordine:", order);
    
    // Aggiungere un controllo preliminare
    if (!order || !order.customer || !order.items || order.items.length === 0) {
      console.error("Dati dell'ordine non validi:", order);
      throw new Error("Dati dell'ordine incompleti o non validi");
    }
    
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();

    if (error) {
      console.error("Errore Supabase dettagliato:", JSON.stringify(error, null, 2));
      throw error;
    }
    
    console.log("Ordine salvato con successo:", data);
    return data;
  } catch (error: any) {
    console.error("Errore completo nel salvataggio dell'ordine:", 
      error.message || error.toString(), 
      "Dettagli:", error.details || "Nessun dettaglio disponibile"
    );
    throw error;
  }
}

// Funzione per ottenere tutti gli ordini
export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Errore nel recupero degli ordini:", error);
    return [];
  }
}

// Funzione per aggiornare lo stato di un ordine
export async function updateOrderStatus(
  id: string, 
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Errore nell'aggiornamento dello stato dell'ordine:", error);
    throw error;
  }
}


