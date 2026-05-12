import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(40).optional().nullable(),
  company: z.string().max(160).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(5).max(4000),
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
    // No DB configured yet — accept silently so the form works locally.
    console.log('[contact] (no supabase configured)', parsed.data);
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('inquiries').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
      source: 'contact_form',
    });
    if (error) {
      console.error('[contact] supabase error', error);
      return NextResponse.json({ error: 'db' }, { status: 500 });
    }
  } catch (err) {
    console.error('[contact] unexpected', err);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
