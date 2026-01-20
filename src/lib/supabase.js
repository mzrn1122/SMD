import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tjbpxbjffxfsaxfziuyu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYnB4YmpmZnhmc2F4ZnppdXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzU5NjUsImV4cCI6MjA4NDQ1MTk2NX0.o02wjmUMpgAh5GCFtnuo0MgDuKyvQtJj_Wyc1nxk944';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript-like autocomplete
export const TABLES = {
    PROFILES: 'profiles',
    DEVICES: 'devices',
    SCHEDULES: 'schedules',
    LOGS: 'logs',
    INVENTORY: 'inventory',
    PATIENTS: 'patients',
};

// Helper functions for common queries
export const dbHelpers = {
    // Get user profile with role
    async getUserProfile(userId) {
        const { data, error } = await supabase
            .from(TABLES.PROFILES)
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // Get all devices (admin only)
    async getAllDevices() {
        const { data, error } = await supabase
            .from(TABLES.DEVICES)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get logs for a specific patient
    async getPatientLogs(patientId, limit = 60) {
        const { data, error } = await supabase
            .from(TABLES.LOGS)
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    // Get inventory for a patient
    async getInventory(patientId) {
        const { data, error } = await supabase
            .from(TABLES.INVENTORY)
            .select('*')
            .eq('patient_id', patientId)
            .single();

        if (error) throw error;
        return data;
    },

    // Update inventory
    async updateInventory(patientId, virtualStock) {
        const { data, error } = await supabase
            .from(TABLES.INVENTORY)
            .update({ virtual_stock: virtualStock, updated_at: new Date().toISOString() })
            .eq('patient_id', patientId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Insert new log
    async insertLog(logData) {
        const { data, error } = await supabase
            .from(TABLES.LOGS)
            .insert([logData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get patient info
    async getPatient(patientId) {
        const { data, error } = await supabase
            .from(TABLES.PATIENTS)
            .select('*')
            .eq('id', patientId)
            .single();

        if (error) throw error;
        return data;
    },
};
