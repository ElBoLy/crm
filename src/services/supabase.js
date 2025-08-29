// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

// Aquí colocas tu URL y tu API Key que te da Supabase
const SUPABASE_URL = 'https://ddbqylohrnafwakgxdrr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnF5bG9ocm5hZndha2d4ZHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0OTAxMzksImV4cCI6MjA3MjA2NjEzOX0.fDm-O4D6fdBeL9g6mSmKVrW9WTgUfnRy6Exza8NwioI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
