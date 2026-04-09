import { createClient } from '@/app/utils/supabase/server'
import { cookies } from 'next/headers'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  // Obtenemos el usuario actual
  const { data: { user } } = await supabase.auth.getUser()
  
  // Aquí podríamos consultar datos reales de la base de datos
  // por ahora simplemente pasamos el usuario al cliente
  // const { data: stats } = await supabase.from('stats').select('*').single()

  return <DashboardClient user={user} />
}
