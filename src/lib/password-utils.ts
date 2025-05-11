/**
 * Funzioni di utilità per la gestione sicura delle password
 * 
 * Utilizziamo bcrypt per l'hashing delle password, che è un metodo sicuro
 * che incorpora automaticamente salt e protezione contro attacchi di timing.
 */

import * as bcrypt from 'bcryptjs';

/**
 * Genera un hash sicuro della password
 * @param password La password in chiaro da hashare
 * @returns Promise che risolve con l'hash della password
 */
export async function hashPassword(password: string): Promise<string> {
  // Usiamo 10 round per il salt, che è un buon compromesso tra sicurezza e performance
  return bcrypt.hash(password, 10);
}

/**
 * Verifica una password confrontandola con un hash
 * @param password La password in chiaro da verificare
 * @param hashedPassword L'hash della password memorizzato
 * @returns Promise che risolve con un booleano che indica se la password è corretta
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Funzione di supporto per generare un admin iniziale
 * Da utilizzare una sola volta in fase di setup o per aggiungere nuovi admin
 */
export async function createInitialAdmin(username: string, password: string, email?: string) {
  const hashedPassword = await hashPassword(password);
  
  // Esempio di output da utilizzare nella query SQL
  const adminData = {
    username,
    password_hash: hashedPassword,
    email: email || null
  };
  
  return adminData;
}