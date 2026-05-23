import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * High-fidelity integration functions mapping directly to Supabase tables.
 * If Supabase is not connected yet, they fall back to local in-memory data
 * and instruct the user on how to provision their database tables.
 */
export async function getSupabaseServices(fallbackData: any[]) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: fallbackData, error: 'Database environment variables not set yet.' };
  }
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.warn('Supabase service fetch error (using fallback):', error.message);
    return { data: fallbackData, error: error.message };
  }
}

export async function getSupabasePosts(fallbackData: any[]) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: fallbackData, error: 'Database environment variables not set yet.' };
  }
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.warn('Supabase posts fetch error (using fallback):', error.message);
    return { data: fallbackData, error: error.message };
  }
}

export async function submitContactMessage(contactData: { name: string; email: string; message: string }) {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Simulating Supabase Save for contact query (VITE_SUPABASE config missing):', contactData);
    return { success: true, simulated: true };
  }
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData]);
    
    if (error) throw error;
    return { success: true, sended: true };
  } catch (error: any) {
    console.error('Supabase contact submission error:', error.message);
    throw error;
  }
}

export async function submitNewsletterSubscription(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Simulating Supabase Save for newsletter subscription (VITE_SUPABASE config missing):', email);
    return { success: true, simulated: true };
  }
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email, subscribed_at: new Date().toISOString() }]);
    
    if (error) throw error;
    return { success: true, sended: true };
  } catch (error: any) {
    console.error('Supabase newsletter subscription error:', error.message);
    throw error;
  }
}
