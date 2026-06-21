import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  const { original_url } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const short_code = nanoid(6)  // genera código como "aB3x9Z"

  const { data, error } = await supabase
    .from('links')
    .insert({ user_id: user.id, original_url, short_code })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    short_code,
    short_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${short_code}`
  })
}
