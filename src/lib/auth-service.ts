import { supabase } from './supabase';
import { verifyPassword, hashPassword } from '@/lib/password-utils';/**
 * Interfaccia per gli utenti admin
 */
export interface AdminUser {
  id?: string;
  username: string;
  email?: string;
  created_at?: string;
  last_login?: string;
  active?: boolean;
}

/**
 * Autentica un utente admin
 * @param username Nome utente
 * @param password Password in chiaro
 * @returns L'utente admin se autenticato, null altrimenti
 */
export async function loginAdmin(username: string, password: string): Promise<AdminUser | null> {
  try {
    // 1. Recupera l'utente dal database
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('active', true)
      .single();
    
    if (error || !data) {
      console.error('Errore nel recupero dell\'utente admin:', error);
      return null;
    }
    
    // 2. Verifica la password
    const isValid = await verifyPassword(password, data.password_hash);
    
    if (!isValid) {
      return null;
    }
    
    // 3. Aggiorna il timestamp dell'ultimo login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);
    
    // 4. Ritorna i dati dell'utente senza la password
    const {...userWithoutPassword } = data;
    return userWithoutPassword as AdminUser;
  } catch (error) {
    console.error('Errore nel login admin:', error);
    return null;
  }
}

/**
 * Crea un nuovo utente admin
 * @param username Nome utente
 * @param password Password in chiaro
 * @param email Email (opzionale)
 * @returns L'utente admin creato, null in caso di errore
 */
export async function createAdmin(
  username: string, 
  password: string, 
  email?: string
): Promise<AdminUser | null> {
  try {
    // 1. Verifica se l'utente esiste già
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .single();
    
    if (existingUser) {
      console.error('Utente già esistente');
      return null;
    }
    
    // 2. Genera l'hash della password
    const hashedPassword = await hashPassword(password);
    
    // 3. Inserisci il nuovo utente
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        { 
          username, 
          password_hash: hashedPassword, 
          email: email || null 
        }
      ])
      .select('id, username, email, created_at, active')
      .single();
    
    if (error) {
      console.error('Errore nella creazione dell\'utente admin:', error);
      return null;
    }
    
    return data as AdminUser;
  } catch (error) {
    console.error('Errore nella creazione dell\'admin:', error);
    return null;
  }
}

/**
 * Ottiene l'utente admin attuale dalla sessione
 * @returns L'utente admin corrente, null se non autenticato
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    // Recupera l'ID admin dalla sessione locale
    const adminId = localStorage.getItem('admin_id');
    
    if (!adminId) {
      return null;
    }
    
    // Recupera i dati admin dal database
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username, email, created_at, last_login, active')
      .eq('id', adminId)
      .eq('active', true)
      .single();
    
    if (error || !data) {
      localStorage.removeItem('admin_id');
      return null;
    }
    
    return data as AdminUser;
  } catch (error) {
    console.error('Errore nel recupero dell\'admin attuale:', error);
    return null;
  }
}

/**
 * Logout dell'utente admin
 */
export function logoutAdmin(): void {
  localStorage.removeItem('admin_id');
  localStorage.removeItem('admin_authenticated');
}