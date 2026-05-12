import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const schema = z.object({
  posting_id: z.string().uuid().optional().nullable(),
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(40).optional().nullable(),
  resume_url: z.string().url().optional().nullable(),
  cover_letter: z.string().max(4000).optional().nullable(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 422 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('[careers] (no supabase configured)', parsed.data);
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('career_applications').insert(parsed.data);
    if (error) {
      console.error('[careers] supabase error', error);
      return NextResponse.json({ error: 'db' }, { status: 500 });
    }
  } catch (err) {
    console.error('[careers] unexpected', err);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
