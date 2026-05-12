'use client';

import { useState, useTransition } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Save, Upload, Trash2, ImageOff } from 'lucide-react';

export function SettingsForm({ initialLogoUrl }: { initialLogoUrl: string | null }) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string>(initialLogoUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [busy, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setMsg(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split('.').pop() ?? 'png';
      const filename = `logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('branding')
        .upload(filename, file, { upsert: true });
      if (upErr) {
        setMsg({ kind: 'err', text: upErr.message });
        return;
      }
      const { data } = supabase.storage.from('branding').getPublicUrl(filename);
      setLogoUrl(data.publicUrl);
    } catch (e) {
      setMsg({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  }

  function save() {
    setMsg(null);
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'logo_url', value: logoUrl || null, updated_at: new Date().toISOString() });
      if (error) {
        setMsg({ kind: 'err', text: error.message });
        return;
      }
      setMsg({ kind: 'ok', text: 'Saved. Refresh the public site to see it.' });
      router.refresh();
    });
  }

  function clearLogo() {
    setLogoUrl('');
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            msg.kind === 'ok'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {msg.text}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6">
        <h2 className="text-base font-semibold text-ink-900">Brand logo</h2>
        <p className="mt-1 text-sm text-slate-500">
          Shown in the header and mobile menu. Recommended: transparent PNG
          or SVG, ~200×60.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-[200px_1fr]">
          <div className="flex h-24 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 sm:h-32">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Current logo" className="max-h-full max-w-full object-contain p-3" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-300">
                <ImageOff className="h-6 w-6" />
                <span className="text-xs">No logo set</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition hover:border-brand-300 hover:bg-brand-50/40">
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading…' : 'Upload a new logo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
              />
            </label>
            <div>
              <Label htmlFor="logoUrl">Or paste an image URL</Label>
              <Input
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={save} disabled={busy} size="md">
                <Save className="h-4 w-4" />
                {busy ? 'Saving…' : 'Save logo'}
              </Button>
              {logoUrl && (
                <Button variant="ghost" size="md" onClick={clearLogo} className="!text-rose-600 hover:!bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        More site settings (brand colors, contact details, hero copy) coming
        soon. For now, edit <code>messages/en.json</code> &amp;{' '}
        <code>messages/id.json</code> directly for text content.
      </section>
    </div>
  );
}
