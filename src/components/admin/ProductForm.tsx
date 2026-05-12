'use client';

import { useState, useTransition } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { Save, Trash2, Upload, X, ImageOff } from 'lucide-react';
import type { DbCategory, DbProduct } from '@/lib/catalogue';

type Mode = 'new' | 'edit';

interface FormState {
  category_id: string;
  slug: string;
  name_en: string;
  name_id: string;
  short_en: string;
  short_id: string;
  description_en: string;
  description_id: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

function emptyForm(categories: DbCategory[]): FormState {
  return {
    category_id: categories[0]?.id ?? '',
    slug: '',
    name_en: '',
    name_id: '',
    short_en: '',
    short_id: '',
    description_en: '',
    description_id: '',
    image_url: '',
    is_active: true,
    sort_order: 100,
  };
}

function fromProduct(p: DbProduct): FormState {
  return {
    category_id: p.category_id ?? '',
    slug: p.slug,
    name_en: p.name_en,
    name_id: p.name_id,
    short_en: p.short_en ?? '',
    short_id: p.short_id ?? '',
    description_en: p.description_en ?? '',
    description_id: p.description_id ?? '',
    image_url: p.image_url ?? '',
    is_active: p.is_active,
    sort_order: p.sort_order,
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ProductForm({
  initial,
  categories,
}: {
  initial: DbProduct | null;
  categories: DbCategory[];
}) {
  const router = useRouter();
  const mode: Mode = initial ? 'edit' : 'new';
  const [form, setForm] = useState<FormState>(
    initial ? fromProduct(initial) : emptyForm(categories)
  );
  const [uploading, setUploading] = useState(false);
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function patch<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split('.').pop() ?? 'bin';
      const safeBase = (form.slug || slugify(form.name_en) || 'product').slice(0, 50);
      const filename = `${safeBase}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('products')
        .upload(filename, file, { upsert: true });
      if (upErr) {
        setError(upErr.message);
        return;
      }
      const { data } = supabase.storage.from('products').getPublicUrl(filename);
      patch('image_url', data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setError(null);
    if (!form.category_id) {
      setError('Pick a category first.');
      return;
    }
    if (!form.slug) {
      setError('Slug is required.');
      return;
    }
    if (!form.name_en || !form.name_id) {
      setError('Name (EN) and Name (ID) are required.');
      return;
    }

    const payload = {
      category_id: form.category_id,
      slug: form.slug.trim(),
      name_en: form.name_en.trim(),
      name_id: form.name_id.trim(),
      short_en: form.short_en || null,
      short_id: form.short_id || null,
      description_en: form.description_en || null,
      description_id: form.description_id || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
      sort_order: form.sort_order,
    };

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const op =
        mode === 'new'
          ? supabase.from('products').insert(payload).select().single()
          : supabase
              .from('products')
              .update(payload)
              .eq('id', initial!.id)
              .select()
              .single();

      const { data, error } = await op;
      if (error) {
        setError(error.message);
        return;
      }
      // Redirect to edit page so the user can keep tweaking.
      router.push(
        `/${window.location.pathname.split('/')[1] ?? 'en'}/admin/products/${(data as DbProduct).id}`
      );
      router.refresh();
    });
  }

  async function remove() {
    if (!initial) return;
    if (
      !confirm(
        `Permanently delete "${initial.name_en}"? This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', initial.id);
      if (error) {
        setError(error.message);
        return;
      }
      router.push(
        `/${window.location.pathname.split('/')[1] ?? 'en'}/admin/products`
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Image column */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <Label>Image</Label>
            <div className="mt-2 aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {form.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image_url}
                  alt=""
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <ImageOff className="h-10 w-10" />
                </div>
              )}
            </div>
            <label className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition hover:border-brand-300 hover:bg-brand-50/40">
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading…' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                }}
              />
            </label>
            <Input
              className="mt-2"
              placeholder="or paste image URL"
              value={form.image_url}
              onChange={(e) => patch('image_url', e.target.value)}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-5">
            <Label>Visibility</Label>
            <label className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => patch('is_active', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm">Show on public site</span>
            </label>
            <div className="mt-4">
              <Label htmlFor="sort">Sort order</Label>
              <Input
                id="sort"
                type="number"
                value={form.sort_order}
                onChange={(e) => patch('sort_order', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Fields column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="cat" required>Category</Label>
              <select
                id="cat"
                value={form.category_id}
                onChange={(e) => patch('category_id', e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              >
                <option value="" disabled>Select a category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="slug" required>Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => patch('slug', slugify(e.target.value))}
                onBlur={() => {
                  if (!form.slug && form.name_en) patch('slug', slugify(form.name_en));
                }}
                placeholder="e.g. fast-connector"
              />
            </div>
            <div>
              <Label htmlFor="ne" required>Name (EN)</Label>
              <Input
                id="ne"
                value={form.name_en}
                onChange={(e) => patch('name_en', e.target.value)}
                onBlur={() => {
                  if (!form.slug) patch('slug', slugify(form.name_en));
                }}
              />
            </div>
            <div>
              <Label htmlFor="ni" required>Name (ID)</Label>
              <Input
                id="ni"
                value={form.name_id}
                onChange={(e) => patch('name_id', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="se">Short description (EN)</Label>
              <Input
                id="se"
                value={form.short_en}
                onChange={(e) => patch('short_en', e.target.value)}
                placeholder="One sentence shown in lists."
              />
            </div>
            <div>
              <Label htmlFor="si">Short description (ID)</Label>
              <Input
                id="si"
                value={form.short_id}
                onChange={(e) => patch('short_id', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="de">Detailed description (EN)</Label>
              <Textarea
                id="de"
                rows={5}
                value={form.description_en}
                onChange={(e) => patch('description_en', e.target.value)}
                placeholder="Full description, specs, use cases…"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="di">Detailed description (ID)</Label>
              <Textarea
                id="di"
                rows={5}
                value={form.description_id}
                onChange={(e) => patch('description_id', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-5">
            <Button onClick={save} disabled={busy} size="md">
              <Save className="h-4 w-4" />
              {busy ? 'Saving…' : mode === 'new' ? 'Create product' : 'Save changes'}
            </Button>
            <Button
              variant="ghost"
              size="md"
              disabled={busy}
              onClick={() => router.back()}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            {mode === 'edit' && (
              <Button
                variant="ghost"
                size="md"
                disabled={busy}
                onClick={remove}
                className="!text-rose-600 hover:!bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
