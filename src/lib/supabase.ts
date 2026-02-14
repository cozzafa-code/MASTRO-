import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const AZIENDA_ID = process.env.NEXT_PUBLIC_AZIENDA_ID || '00000001-0000-0000-0000-000000000001'