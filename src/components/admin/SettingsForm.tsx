'use client';

import { useState, useTransition } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Save, Upload, Trash2, ImageOff } from 'lucide-react';

type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  hoursEn: string;
  hoursId: string;
};

export function SettingsForm({
  initialLogoUrl,
  initialContact,
}: {
  initialLogoUrl: string | null;
  initialContact: ContactInfo;
}) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string>(initialLogoUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [logoBusy, startLogoSave] = useTransition();
  const [logoMsg, setLogoMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const [contact, setContact] = useState<ContactInfo>(initialContact);
  const [contactBusy, startContactSave] = useTransition();
  const [contactMsg, setContactMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setLogoMsg(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split('.').pop() ?? 'png';
      const filename = `logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('branding')
        .upload(filename, file, { upsert: true });
      if (upErr) {
        setLogoMsg({ kind: 'err', text: upErr.message });
        return;
      }
      const { data } = supabase.storage.from('branding').getPublicUrl(filename);
      setLogoUrl(data.publicUrl);
    } catch (e) {
      setLogoMsg({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  }

  function saveLogo() {
    setLogoMsg(null);
    startLogoSave(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'logo_url', value: logoUrl || null, updated_at: new Date().toISOString() });
      if (error) {
        setLogoMsg({ kind: 'err', text: error.message });
        return;
      }
      setLogoMsg({ kind: 'ok', text: 'Saved. Refresh the public site to see it.' });
      router.refresh();
    });
  }

  function saveContact() {
    setContactMsg(null);
    startContactSave(async () => {
      const supabase = createSupabaseBrowserClient();
      const now = new Date().toISOString();
      const rows = [
        { key: 'contact_address', value: contact.address.trim() || null, updated_at: now },
        { key: 'contact_phone', value: contact.phone.trim() || null, updated_at: now },
        { key: 'contact_email', value: contact.email.trim() || null, updated_at: now },
        { key: 'contact_hours_en', value: contact.hoursEn.trim() || null, updated_at: now },
        { key: 'contact_hours_id', value: contact.hoursId.trim() || null, updated_at: now },
      ];
      const { error } = await supabase.from('site_settings').upsert(rows);
      if (error) {
        setContactMsg({ kind: 'err', text: error.message });
        return;
      }
      setContactMsg({
        kind: 'ok',
        text: 'Contact info saved. Footer and contact page will update on next load.',
      });
      router.refresh();
    });
  }

  function clearLogo() {
    setLogoUrl('');
  }

  return (
    <div className="space-y-6">
      {logoMsg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            logoMsg.kind === 'ok'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {logoMsg.text}
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
              <Button onClick={saveLogo} disabled={logoBusy} size="md">
                <Save className="h-4 w-4" />
                {logoBusy ? 'Saving…' : 'Save logo'}
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

      {contactMsg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            contactMsg.kind === 'ok'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {contactMsg.text}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6">
        <h2 className="text-base font-semibold text-ink-900">Contact information</h2>
        <p className="mt-1 text-sm text-slate-500">
          Shown in the site footer and on the Contact page. Office hours have
          separate English and Indonesian versions; the others are shared.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="contactAddress">Office address</Label>
            <textarea
              id="contactAddress"
              value={contact.address}
              onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))}
              rows={3}
              className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
              placeholder="Jl. … RT.X/RW.Y, Kelurahan, Kecamatan, Kota, Provinsi, ZIP"
            />
          </div>
          <div>
            <Label htmlFor="contactPhone">Phone</Label>
            <Input
              id="contactPhone"
              value={contact.phone}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              placeholder="+62 …"
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contact.email}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
              placeholder="contact@…"
            />
          </div>
          <div>
            <Label htmlFor="contactHoursEn">Office hours (English)</Label>
            <Input
              id="contactHoursEn"
              value={contact.hoursEn}
              onChange={(e) => setContact((c) => ({ ...c, hoursEn: e.target.value }))}
              placeholder="Mon – Fri · 8:00 am – 5:00 pm"
            />
          </div>
          <div>
            <Label htmlFor="contactHoursId">Office hours (Indonesian)</Label>
            <Input
              id="contactHoursId"
              value={contact.hoursId}
              onChange={(e) => setContact((c) => ({ ...c, hoursId: e.target.value }))}
              placeholder="Sen – Jum · 08:00 – 17:00 WIB"
            />
          </div>
        </div>

        <div className="mt-5">
          <Button onClick={saveContact} disabled={contactBusy} size="md">
            <Save className="h-4 w-4" />
            {contactBusy ? 'Saving…' : 'Save contact info'}
          </Button>
        </div>
      </section>
    </div>
  );
}
