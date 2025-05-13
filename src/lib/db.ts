import { createClient } from '@supabase/supabase-js';

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
  gallery_images?: string[]; // Aggiungi questo campo
  client?: string;
  category?: string;
  completion_date?: string;
  featured?: boolean;
  created_at?: string;
};

// IMPORTANTE: Mantiene il nome della tabella 'calls' come nella versione vecchia
// anziché 'call_bookings' della nuova versione

// Funzione per ottenere le prenotazioni
export async function getAllBookings(): Promise<CallBooking[]> {
  try {
    const { data, error } = await supabase
      .from('calls') // ATTENZIONE: Usa 'calls' come nella versione originale
      .select('*')
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true });
    
    if (error) {
      console.error('Errore nel recupero delle prenotazioni:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Errore dettagliato:', error);
    return [];
  }
}

// Aggiorna lo stato di una prenotazione
export async function updateBookingStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('calls') // ATTENZIONE: Usa 'calls' come nella versione originale
      .update({ status })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Errore nell\'aggiornamento dello stato della prenotazione:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Errore nell\'aggiornamento dello stato:', error);
    throw error;
  }
}

// Prenotazione chiamata
export async function saveCallBooking(booking: Omit<CallBooking, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('calls') // ATTENZIONE: Usa 'calls' come nella versione originale
      .insert([{
        ...booking,
        status: booking.status || 'pending', // Default status
      }])
      .select();
    
    if (error) {
      console.error('Errore Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Errore dettagliato:', error);
    throw error;
  }
}

// Ottieni slot orari occupati per una data
export async function getBookedTimeSlots(date: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('calls') // ATTENZIONE: Usa 'calls' come nella versione originale
      .select('time_slot')
      .eq('date', date)
      .neq('status', 'cancelled');
    
    if (error) {
      console.error('Errore nel recupero degli slot orari occupati:', error);
      throw error;
    }
    
    return data?.map(item => item.time_slot) || [];
  } catch (error) {
    console.error('Errore dettagliato:', error);
    return [];
  }
}

// Messaggi di contatto
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Errore nel recupero dei messaggi:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Errore nel recupero dei messaggi:', error);
    return [];
  }
}

// Salva un messaggio di contatto
export async function saveContactMessage(message: ContactMessage) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore nel salvataggio del messaggio:', error);
    throw error;
  }
}

export async function markMessageAsRead(id: string, read: boolean = true) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore nell\'aggiornamento del messaggio:', error);
    throw error;
  }
}

export async function archiveMessage(id: string, archived: boolean = true) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ archived })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore nell\'archiviazione del messaggio:', error);
    throw error;
  }
}

// Prodotti
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Errore nel recupero dei prodotti:', error);
    return [];
  }
}

export async function saveProduct(product: Product) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore nel salvataggio del prodotto:', error);
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore nell\'aggiornamento del prodotto:', error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Errore nell\'eliminazione del prodotto:', error);
    throw error;
  }
}

// Ordini
export async function getAllOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Errore nel recupero degli ordini:', error);
    return [];
  }
}

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
  } catch (error: unknown) { // Usiamo unknown anziché any per rispettare i tipi stretti
    console.error("Errore completo nel salvataggio dell'ordine:", error);
    throw error;
  }
}

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

// Progetti
export async function getAllProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Errore nel recupero dei progetti:', error);
    return [];
  }
}

export async function saveProject(project: Project) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore nel salvataggio del progetto:', error);
    throw error;
  }
}

export async function updateProject(id: string, project: Partial<Project>) {
  try {
    console.log('Updating project with ID:', id);
    console.log('Data to update:', project);
    
    // Assicuriamoci che gallery_images sia un array se presente
    if (project.gallery_images && !Array.isArray(project.gallery_images)) {
      project.gallery_images = [];
      console.warn('gallery_images non è un array, convertito in array vuoto');
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Errore Supabase:', error);
      throw error;
    }
    
    console.log('Progetto aggiornato con successo:', data);
    return data;
  } catch (error) {
    // Mostriamo dettagli completi dell'errore
    console.error('Errore dettagliato nell\'aggiornamento del progetto:', error);
    
    // Riformattiamo l'errore per garantire che contenga informazioni utili
    const formattedError = {
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      details: error
    };
    
    throw formattedError;
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Errore nell\'eliminazione del progetto:', error);
    throw error;
  }
}