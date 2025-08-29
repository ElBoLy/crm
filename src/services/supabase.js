// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

// Aquí colocas tu URL y tu API Key que te da Supabase
const SUPABASE_URL = 'https://dzoqwuwscfwqzwfncstg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6b3F3dXdzY2Z3cXp3Zm5jc3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTc3NDcsImV4cCI6MjA3MTEzMzc0N30.QbON63Onunody_AMeJrK1aM7R2HXe0ABICnP9upuKNc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
