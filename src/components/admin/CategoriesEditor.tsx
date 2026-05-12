'use client';

import { useState, useTransition } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { DbCategory } from '@/lib/catalogue';

type Row = DbCategory & { _draft?: boolean };

const EMPTY: Row = {
  id: '',
  slug: '',
  name_en: '',
  name_id: '',
  description_en: '',
  description_id: '',
  sort_order: 100,
  _draft: true,
};

export function CategoriesEditor({ initial }: { initial: DbCategory[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Row | null>(null);
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function startEdit(row: Row) {
    setEditingId(row.id);
    setDraft({ ...row });
    setError(null);
  }

  function startNew() {
    setEditingId('__new__');
    setDraft({ ...EMPTY });
    setError(null);
  }

  function cancel() {
    setEditingId(null);
    setDraft(null);
    setError(null);
  }

  async function save() {
    if (!draft) return;
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const payload = {
      slug: draft.slug.trim(),
      name_en: draft.name_en.trim(),
      name_id: draft.name_id.trim(),
      description_en: draft.description_en || null,
      description_id: draft.description_id || null,
      sort_order: draft.sort_order ?? 0,
    };
    if (!payload.slug || !payload.name_en || !payload.name_id) {
      setError('Slug, name (EN) and name (ID) are required.');
      return;
    }

    startTransition(async () => {
      const op = draft._draft
        ? supabase.from('product_categories').insert(payload).select().single()
        : supabase
            .from('product_categories')
            .update(payload)
            .eq('id', draft.id)
            .select()
            .single();
      const { data, error } = await op;
      if (error) {
        setError(error.message);
        return;
      }
      setRows((prev) => {
        if (draft._draft) return [...prev, data as DbCategory];
        return prev.map((r) => (r.id === draft.id ? (data as DbCategory) : r));
      });
      setEditingId(null);
      setDraft(null);
      router.refresh();
    });
  }

  async function remove(row: Row) {
    if (row._draft) return;
    if (
      !confirm(
        `Delete category "${row.name_en}"? Products in this category will be unlinked.`
      )
    )
      return;
    const supabase = createSupabaseBrowserClient();
    startTransition(async () => {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', row.id);
      if (error) {
        setError(error.message);
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={startNew} size="sm">
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {editingId === '__new__' && draft && (
        <Editor
          draft={draft}
          setDraft={setDraft}
          onSave={save}
          onCancel={cancel}
          busy={busy}
          isNew
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        {rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No categories yet. Click &quot;Add category&quot; to start.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rows.map((row) =>
              editingId === row.id && draft ? (
                <li key={row.id} className="p-5">
                  <Editor
                    draft={draft}
                    setDraft={setDraft}
                    onSave={save}
                    onCancel={cancel}
                    busy={busy}
                  />
                </li>
              ) : (
                <li
                  key={row.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                        {row.slug}
                      </span>
                      <p className="text-base font-semibold text-ink-900">
                        {row.name_en}
                      </p>
                      <span className="text-sm text-slate-500">·</span>
                      <p className="text-sm text-slate-600">{row.name_id}</p>
                    </div>
                    {row.description_en && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                        {row.description_en}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(row)}
                      className="!text-rose-600 hover:!bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function Editor({
  draft,
  setDraft,
  onSave,
  onCancel,
  busy,
  isNew = false,
}: {
  draft: Row;
  setDraft: (r: Row) => void;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
  isNew?: boolean;
}) {
  function patch<K extends keyof Row>(key: K, val: Row[K]) {
    setDraft({ ...draft, [key]: val });
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">
          {isNew ? 'New category' : 'Editing category'}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug" required>Slug</Label>
          <Input
            id="slug"
            value={draft.slug}
            onChange={(e) =>
              patch(
                'slug',
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
              )
            }
            placeholder="e.g. fiber-optic"
          />
        </div>
        <div>
          <Label htmlFor="sort">Sort order</Label>
          <Input
            id="sort"
            type="number"
            value={draft.sort_order ?? 0}
            onChange={(e) => patch('sort_order', Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="ne" required>Name (EN)</Label>
          <Input
            id="ne"
            value={draft.name_en}
            onChange={(e) => patch('name_en', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ni" required>Name (ID)</Label>
          <Input
            id="ni"
            value={draft.name_id}
            onChange={(e) => patch('name_id', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="de">Description (EN)</Label>
          <Textarea
            id="de"
            rows={2}
            value={draft.description_en ?? ''}
            onChange={(e) => patch('description_en', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="di">Description (ID)</Label>
          <Textarea
            id="di"
            rows={2}
            value={draft.description_id ?? ''}
            onChange={(e) => patch('description_id', e.target.value)}
          />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Button onClick={onSave} disabled={busy} size="md">
          <Save className="h-4 w-4" />
          {busy ? 'Saving…' : 'Save'}
        </Button>
        <Button onClick={onCancel} variant="ghost" size="md" disabled={busy}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
