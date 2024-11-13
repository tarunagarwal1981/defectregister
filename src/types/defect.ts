// src/types/defect.ts
export interface Defect {
  'S.No': number;
  'Vessel Name': string;
  'Equipments': string;
  'Description': string;
  'Action Planned': string;
  'Criticality': 'High' | 'Medium' | 'Low';
  'Date reported': string;
  'Date Completed': string;
  'Status (Vessel)': string;
  'Comments': string;
  'Item Type': string;
  'Path': string;
}

// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// src/hooks/useDefects.ts
import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Defect } from '@/types/defect';

export const useDefects = () => {
  const [defects, setDefects] = useState<Defect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDefects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('defects register')
        .select('*')
        .order('S.No', { ascending: true });

      if (error) throw error;
      setDefects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addDefect = useCallback(async (newDefect: Omit<Defect, 'S.No'>) => {
    try {
      const { data, error } = await supabase
        .from('defects register')
        .insert([newDefect])
        .select()
        .single();

      if (error) throw error;
      setDefects(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateDefect = useCallback(async (id: number, updates: Partial<Defect>) => {
    try {
      const { data, error } = await supabase
        .from('defects register')
        .update(updates)
        .eq('S.No', id)
        .select()
        .single();

      if (error) throw error;
      setDefects(prev => prev.map(d => d['S.No'] === id ? data : d));
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    defects,
    loading,
    error,
    fetchDefects,
    addDefect,
    updateDefect
  };
};
