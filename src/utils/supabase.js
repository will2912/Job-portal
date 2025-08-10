import { createClient } from "@supabase/supabase-js";

export const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// supabaseClient.js
const supabaseClient = async (token) => {
  if (!window._supabase) {
    window._supabase = createClient(URL, KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
  }
  return window._supabase;
};


export default supabaseClient;