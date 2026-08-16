'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  UploadCloud,
  Loader2,
  Github,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Trophy,
  ImageIcon,
  GripVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ListOrdered,
} from 'lucide-react'
import { COLLECTIONS, type CollectionKey } from '@/lib/content-config'
import { SCHEMA, blankItem, type Field } from './schema'
import { resizeImage } from './imageUtils'
import { mergeCopy, type SiteSettings, type SiteCopy } from '@/lib/site-settings'

type Item = Record<string, unknown>
type Tab = CollectionKey | 'site' | 'copy' | 'resume'
const TABS = Object.keys(COLLECTIONS) as CollectionKey[]
const ALL_TABS: Tab[] = ['site', 'copy', ...TABS, 'resume']

export default function AdminDashboard({ cmsConfigured }: { cmsConfigured: boolean }) {
  const [tab, setTab] = useState<Tab>('projects')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editIndex, setEditIndex] = useState<number | null>(null) // null=list, -1=new
  const [draft, setDraft] = useState<Item | null>(null)
  const [dirty, setDirty] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)

  const load = useCallback(async (key: CollectionKey) => {
    setLoading(true)
    setEditIndex(null)
    setDirty(false)
    try {
      const res = await fetch(`/api/admin/content?type=${key}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e) {
      setItems([])
      setToast({ kind: 'err', msg: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tab !== 'resume' && tab !== 'site' && tab !== 'copy') load(tab)
  }, [tab, load])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  function startAdd() {
    if (tab === 'resume' || tab === 'site' || tab === 'copy') return
    setDraft(blankItem(tab))
    setEditIndex(-1)
  }
  function startEdit(i: number) {
    setDraft(structuredClone(items[i]))
    setEditIndex(i)
  }
  function remove(i: number) {
    if (!confirm('Delete this item? (applied after you Publish)')) return
    setItems((prev) => prev.filter((_, idx) => idx !== i))
    setDirty(true)
  }
  function cancelEdit() {
    setEditIndex(null)
    setDraft(null)
  }
  function saveDraft() {
    if (!draft) return
    const d = { ...draft }
    // auto-slug for projects
    if (tab === 'projects' && !String(d.slug || '').trim()) {
      d.slug = String(d.name || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }
    setItems((prev) => {
      if (editIndex === -1) return [...prev, d]
      return prev.map((it, idx) => (idx === editIndex ? d : it))
    })
    setDirty(true)
    cancelEdit()
  }

  async function publish() {
    setPublishing(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: tab, items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publish failed')
      setDirty(false)
      setToast({
        kind: 'ok',
        msg:
          process.env.NODE_ENV === 'production'
            ? 'Published! Vercel will rebuild in ~30–60s and the site will update.'
            : 'Saved to local files. Refresh the site to see your changes.',
      })
    } catch (e) {
      setToast({ kind: 'err', msg: (e as Error).message })
    } finally {
      setPublishing(false)
    }
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
    setDirty(true)
  }

  function toggleHidden(i: number) {
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i ? { ...it, hidden: !it.hidden } : it
      )
    )
    setDirty(true)
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">Portfolio Admin</h1>
            <p className="text-xs text-gray-500">Git-based CMS · Utkarsh Kushwaha</p>
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <button
                onClick={publish}
                disabled={publishing}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 text-sm font-medium px-3 py-2 rounded-lg"
              >
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                {publishing ? 'Publishing…' : 'Publish to GitHub'}
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100 px-3 py-2 rounded-lg border border-gray-800"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {!cmsConfigured && (
          <div className="mb-4 flex items-start gap-2 text-sm bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <span>
              GitHub CMS is not configured. Set <code>GITHUB_COMMIT_TOKEN</code>,{' '}
              <code>GITHUB_REPO_OWNER</code> and <code>GITHUB_REPO_NAME</code> to enable publishing.
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {ALL_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                tab === t ? 'bg-emerald-500 text-gray-950 font-medium' : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              {t === 'resume' ? 'Resume' : t === 'site' ? 'Site' : t === 'copy' ? 'Copy' : COLLECTIONS[t].label}
            </button>
          ))}
        </div>

        {tab === 'site' ? (
          <SettingsPanel onToast={setToast} />
        ) : tab === 'copy' ? (
          <CopyPanel onToast={setToast} />
        ) : tab === 'resume' ? (
          <ResumePanel onToast={setToast} />
        ) : loading ? (
          <div className="flex items-center gap-2 text-gray-500 py-20 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading {tab}…
          </div>
        ) : editIndex !== null && draft ? (
          <EditForm
            fields={SCHEMA[tab].fields}
            draft={draft}
            setDraft={setDraft}
            onSave={saveDraft}
            onCancel={cancelEdit}
            isNew={editIndex === -1}
          />
        ) : (
          <ItemList
            tab={tab}
            items={items}
            onAdd={startAdd}
            onEdit={startEdit}
            onRemove={remove}
            onMove={move}
            onToggleHidden={toggleHidden}
          />
        )}
      </main>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-30 flex items-start gap-2 max-w-sm text-sm px-4 py-3 rounded-xl border shadow-2xl ${
            toast.kind === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/10 border-red-500/40 text-red-300'
          }`}
        >
          {toast.kind === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 mt-0.5" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  )
}

/* ----------------------------- Item list ----------------------------- */
function ItemList({
  tab,
  items,
  onAdd,
  onEdit,
  onRemove,
  onMove,
  onToggleHidden,
}: {
  tab: CollectionKey
  items: Item[]
  onAdd: () => void
  onEdit: (i: number) => void
  onRemove: (i: number) => void
  onMove: (from: number, to: number) => void
  onToggleHidden: (i: number) => void
}) {
  const { titleKey, subtitleKey } = SCHEMA[tab]
  const [orderMode, setOrderMode] = useState(false)

  // Only show order mode for projects tab
  const canOrder = tab === 'projects'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{items.length} item(s)</p>
        <div className="flex items-center gap-2">
          {canOrder && (
            <button
              onClick={() => setOrderMode((v) => !v)}
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors ${
                orderMode
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-gray-100 hover:bg-gray-700'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              {orderMode ? 'Done Ordering' : 'Manage Order & Visibility'}
            </button>
          )}
          {!orderMode && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm px-3 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" /> Add new
            </button>
          )}
        </div>
      </div>

      {orderMode && canOrder ? (
        <OrderPanel
          items={items}
          titleKey={titleKey}
          onMove={onMove}
          onToggleHidden={onToggleHidden}
        />
      ) : (
        <div className="grid gap-3">
          {items.map((it, i) => {
            const images = Array.isArray(it.images) ? (it.images as string[]) : []
            const cover = images[0] || (typeof it.logo === 'string' ? it.logo : '')
            const award = typeof it.award === 'string' ? it.award.trim() : ''
            const hidden = it.hidden === true
            return (
              <div
                key={i}
                className={`group flex items-center gap-3 rounded-xl border bg-gray-900 p-3 transition-colors hover:border-emerald-500/30 ${
                  hidden ? 'border-gray-800/50 opacity-50' : 'border-gray-800'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-800 bg-gray-950">
                  {cover ? (
                    <Image src={cover} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-700">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                  {images.length > 1 && (
                    <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 text-[9px] font-medium text-white">
                      {images.length}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{String(it[titleKey] || '(untitled)')}</p>
                    {award && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                        <Trophy className="h-3 w-3" /> Award
                      </span>
                    )}
                    {hidden && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-600/30 bg-gray-600/10 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400">
                        <EyeOff className="h-3 w-3" /> Hidden
                      </span>
                    )}
                  </div>
                  {subtitleKey && (
                    <p className="line-clamp-1 text-sm text-gray-500">{String(it[subtitleKey] || '')}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => onEdit(i)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-emerald-400"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemove(i)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
          {items.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-800 py-12 text-center">
              <ImageIcon className="mx-auto mb-2 h-6 w-6 text-gray-700" />
              <p className="text-sm text-gray-600">No items yet. Click “Add new” to create one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ----------------------------- Order Panel ----------------------------- */
function OrderPanel({
  items,
  titleKey,
  onMove,
  onToggleHidden,
}: {
  items: Item[]
  titleKey: string
  onMove: (from: number, to: number) => void
  onToggleHidden: (i: number) => void
}) {
  // Drag state
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  function handleDragStart(e: React.DragEvent, i: number) {
    setDragIdx(i)
    e.dataTransfer.effectAllowed = 'move'
  }
  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIdx(i)
  }
  function handleDrop(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragIdx !== null && dragIdx !== i) onMove(dragIdx, i)
    setDragIdx(null)
    setDragOverIdx(null)
  }
  function handleDragEnd() {
    setDragIdx(null)
    setDragOverIdx(null)
  }

  const visibleCount = items.filter((it) => !it.hidden).length

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-300">
        <GripVertical className="h-3.5 w-3.5" />
        <span>Drag rows to reorder · use the eye icon to hide/show projects · changes save when you Publish</span>
        <span className="ml-auto rounded-full bg-indigo-500/20 px-2 py-0.5 font-semibold">
          {visibleCount} visible
        </span>
      </div>
      <div className="grid gap-2">
        {items.map((it, i) => {
          const images = Array.isArray(it.images) ? (it.images as string[]) : []
          const cover = images[0] || (typeof it.logo === 'string' ? it.logo : '')
          const hidden = it.hidden === true
          const isDragging = dragIdx === i
          const isOver = dragOverIdx === i && dragIdx !== i

          return (
            <div
              key={i}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 rounded-xl border bg-gray-900 p-3 transition-all select-none ${
                isDragging ? 'opacity-40 scale-95 border-indigo-500/40' : ''
              } ${
                isOver ? 'border-indigo-400/60 bg-indigo-500/10 shadow-[0_0_12px_-4px_rgba(99,102,241,0.4)]' : 'border-gray-800'
              } ${
                hidden ? 'opacity-50' : ''
              }`}
            >
              {/* Position badge */}
              <span className="w-6 shrink-0 text-center font-mono text-xs font-bold text-gray-600">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Drag handle */}
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-gray-600 active:cursor-grabbing" />

              {/* Thumbnail */}
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-800 bg-gray-950">
                {cover ? (
                  <Image src={cover} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-700">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Title */}
              <p className={`flex-1 truncate font-medium text-sm ${
                hidden ? 'text-gray-600' : 'text-gray-100'
              }`}>
                {String(it[titleKey] || '(untitled)')}
              </p>

              {/* Up / Down arrows */}
              <div className="flex shrink-0 flex-col gap-0.5">
                <button
                  onClick={() => onMove(i, i - 1)}
                  disabled={i === 0}
                  className="rounded p-1 text-gray-600 hover:bg-gray-800 hover:text-gray-300 disabled:opacity-25 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onMove(i, i + 1)}
                  disabled={i === items.length - 1}
                  className="rounded p-1 text-gray-600 hover:bg-gray-800 hover:text-gray-300 disabled:opacity-25 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>

              {/* Eye toggle */}
              <button
                onClick={() => onToggleHidden(i)}
                className={`rounded-lg p-2 transition-colors ${
                  hidden
                    ? 'text-gray-600 hover:bg-gray-800 hover:text-gray-300'
                    : 'text-emerald-400 hover:bg-gray-800 hover:text-emerald-300'
                }`}
                title={hidden ? 'Show on portfolio' : 'Hide from portfolio'}
              >
                {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ----------------------------- Edit form ----------------------------- */
function EditForm({
  fields,
  draft,
  setDraft,
  onSave,
  onCancel,
  isNew,
}: {
  fields: Field[]
  draft: Item
  setDraft: (d: Item) => void
  onSave: () => void
  onCancel: () => void
  isNew: boolean
}) {
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  function set(key: string, value: unknown) {
    setDraft({ ...draft, [key]: value })
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }))
  }

  function isEmpty(f: Field): boolean {
    const v = draft[f.key]
    if (Array.isArray(v)) return v.length === 0
    return String(v ?? '').trim() === ''
  }

  function handleSave() {
    const next: Record<string, boolean> = {}
    for (const f of fields) if (f.required && isEmpty(f)) next[f.key] = true
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onSave()
  }

  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-emerald-500/10 to-transparent px-5 py-4 sm:px-6">
        <h2 className="font-semibold">{isNew ? 'Add new item' : 'Edit item'}</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          Fill the details below. Required fields are marked <span className="text-red-400">*</span>.
        </p>
      </div>

      {/* Fields */}
      <div className="grid gap-5 p-5 sm:p-6">
        {fields.map((f) => (
          <div key={f.key}>
            <FieldInput field={f} value={draft[f.key]} onChange={(v) => set(f.key, v)} />
            {errors[f.key] && <p className="mt-1 text-xs text-red-400">{f.label} is required.</p>}
          </div>
        ))}
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 flex items-center gap-2 border-t border-gray-800 bg-gray-900/95 px-5 py-3.5 backdrop-blur sm:px-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-gray-950 transition hover:bg-emerald-400"
        >
          <Save className="h-4 w-4" /> Done
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-gray-800 px-4 py-2 text-gray-400 transition hover:text-gray-100"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
        <p className="ml-auto text-xs text-gray-600">
          {hasErrors ? (
            <span className="text-red-400">Fill the required fields above.</span>
          ) : (
            'Changes apply locally — Publish to go live.'
          )}
        </p>
      </div>
    </div>
  )
}

/* --------------------------- Field renderer -------------------------- */
function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field
  value: unknown
  onChange: (v: unknown) => void
}) {
  const base =
    'w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 focus:border-emerald-500 outline-none text-sm transition-colors'

  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {(field.type === 'text' || field.type === 'url' || field.type === 'number') && (
        <input
          className={base}
          type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
          value={String(value ?? '')}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'date' && (
        <input
          className={base}
          type="date"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'color' && <ColorField value={value} onChange={onChange} placeholder={field.placeholder} />}

      {field.type === 'icon' && <IconField value={value} onChange={onChange} placeholder={field.placeholder} />}

      {field.type === 'tags' && <TagsField value={value} onChange={onChange} placeholder={field.placeholder} />}

      {field.type === 'markdown' && <MarkdownField value={value} onChange={onChange} placeholder={field.placeholder} />}

      {field.type === 'textarea' && (() => {
        const str = String(value ?? '')
        const len = str.length
        const max = field.maxLength
        const over = max !== undefined && len > max
        const near = max !== undefined && len >= max * 0.85
        return (
          <div className="relative">
            <textarea
              className={`${base} min-h-28 ${over ? 'border-orange-500/70' : near ? 'border-yellow-600/50' : ''}`}
              value={str}
              placeholder={field.placeholder}
              onChange={(e) => onChange(e.target.value)}
            />
            {max !== undefined && (
              <span
                className={`absolute bottom-2 right-3 text-[11px] font-mono select-none ${
                  over ? 'text-orange-400' : near ? 'text-yellow-500' : 'text-gray-600'
                }`}
              >
                {len}/{max}
                {over && <span className="ml-1 text-orange-400">— exceeds limit, will scroll on site</span>}
              </span>
            )}
          </div>
        )
      })()}


      {field.type === 'select' && (
        <select className={base} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o || '— none —'}
            </option>
          ))}
        </select>
      )}

      {field.type === 'boolean' && (
        <label className="flex w-fit cursor-pointer select-none items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 accent-emerald-500"
          />
          {Boolean(value) ? 'On' : 'Off'}
        </label>
      )}

      {field.type === 'list' && (
        <textarea
          className={`${base} min-h-24`}
          value={Array.isArray(value) ? (value as string[]).join('\n') : ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        />
      )}

      {field.type === 'image' && (
        <ImageField multiple={false} value={value} onChange={onChange} />
      )}
      {field.type === 'images' && (
        <ImageField multiple value={value} onChange={onChange} />
      )}

      {field.help && <p className="text-xs text-gray-600 mt-1">{field.help}</p>}
    </div>
  )
}

/* --------------------------- Image uploader -------------------------- */
function ImageField({
  multiple,
  value,
  onChange,
}: {
  multiple: boolean
  value: unknown
  onChange: (v: unknown) => void
}) {
  const list: string[] = multiple
    ? Array.isArray(value)
      ? (value as string[])
      : []
    : value
      ? [String(value)]
      : []

  // Keep a ref to the latest list so async handleFiles never reads stale data
  const listRef = useRef(list)
  listRef.current = list
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0 || busy) return
    setBusy(true)
    setErr('')
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        // Pasted clipboard images always arrive as "image.png" — give each a unique name
        let filename = file.name.replace(/\.[^.]+$/, '.jpg')
        if (/^image\.(png|jpg|jpeg|bmp|webp)$/i.test(file.name)) {
          filename = `paste-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.jpg`
        }
        const dataUrl = await resizeImage(file)
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, dataUrl }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        // Cache-bust so preview always shows the NEW image
        uploaded.push(`${data.path}?v=${Date.now()}`)
        if (!multiple) break
      }
      // Use ref to get the LATEST list, not the stale closure value
      if (multiple) onChangeRef.current([...listRef.current, ...uploaded])
      else onChangeRef.current(uploaded[0])
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  function removeAt(i: number) {
    if (multiple) onChange(list.filter((_, idx) => idx !== i))
    else onChange('')
  }

  function move(i: number, delta: number) {
    const j = i + delta
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      {list.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {list.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-gray-800 bg-gray-950"
            >
              {/* Use native img to avoid Next.js Image caching issues in admin preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />

              {/* Cover badge on the first image (the one shown first on the site) */}
              {multiple && i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-md bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-gray-950">
                  Cover
                </span>
              )}

              {/* Hover controls */}
              <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                {multiple ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="rounded-md bg-black/60 p-1 text-white disabled:opacity-30"
                      title="Move left"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === list.length - 1}
                      className="rounded-md bg-black/60 p-1 text-white disabled:opacity-30"
                      title="Move right"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="rounded-md bg-red-500/90 p-1 text-white"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DropZone multiple={multiple} busy={busy} onFiles={handleFiles} listCount={list.length} />
      <p className="mt-1.5 text-xs text-gray-600">
        {multiple
          ? 'First image is the cover. Hover a tile to reorder or remove. Auto-resized & committed to '
          : 'Auto-resized & committed to '}
        <code>/public</code> on upload.
      </p>
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Drop zone: drag-drop + paste + click-to-browse
   Uses ONLY local React event handlers — no global document listeners,
   no singleton state, no risk of duplicates or cross-zone conflicts.
   • Click → opens file picker
   • Drag & drop onto the zone → uploads
   • Ctrl+V / Cmd+V → uploads (click the zone once to focus it first)
──────────────────────────────────────────────────────────────────── */
function DropZone({
  multiple,
  busy,
  listCount,
  onFiles,
}: {
  multiple: boolean
  busy: boolean
  listCount: number
  onFiles: (f: FileList | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const dragCounter = useRef(0) // nested dragenter/leave counter

  /* ── Drag & drop (local) ── */
  function onDragEnter(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.types.includes('Files')) setDragging(true)
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current <= 0) { dragCounter.current = 0; setDragging(false) }
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setDragging(false)
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files)
  }

  /* ── Paste (local — works when zone is focused) ── */
  function onPaste(e: React.ClipboardEvent) {
    if (busy) return
    const items = e.clipboardData?.items
    if (!items) return
    // Collect image files, deduplicate by size+type to avoid clipboard quirks
    const seen = new Set<string>()
    const imageFiles: File[] = []
    for (const item of Array.from(items)) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const f = item.getAsFile()
        if (!f) continue
        const key = `${f.size}-${f.type}`
        if (seen.has(key)) continue
        seen.add(key)
        imageFiles.push(f)
      }
    }
    if (!imageFiles.length) return
    e.preventDefault()
    e.stopPropagation()
    const dt = new DataTransfer()
    imageFiles.forEach((f) => dt.items.add(f))
    onFiles(dt.files)
  }

  /* ── Click to browse ── */
  function onClick() {
    if (!busy) {
      // Focus the zone so future Ctrl+V will work
      zoneRef.current?.focus()
      inputRef.current?.click()
    }
  }

  const label = busy
    ? 'Uploading…'
    : multiple
      ? listCount > 0 ? 'Add more images' : 'Drop, paste, or click to add images'
      : listCount > 0 ? 'Drop, paste, or click to replace' : 'Drop, paste, or click to choose'

  return (
    <div
      ref={zoneRef}
      role="button"
      tabIndex={0}
      aria-label="Image upload zone"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onPaste={onPaste}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={[
        'flex w-full cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-7 text-center transition-all duration-200 outline-none',
        dragging
          ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02] shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]'
          : 'border-gray-700 bg-gray-900/60 hover:border-emerald-500/50 hover:bg-gray-800/60 focus:border-emerald-500/50 focus:bg-gray-800/60',
        busy ? 'pointer-events-none opacity-60' : '',
      ].join(' ')}
    >
      {busy ? (
        <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
      ) : (
        <UploadCloud className={`h-7 w-7 transition-colors ${dragging ? 'text-emerald-400' : 'text-gray-500'}`} />
      )}
      <p className={`text-sm font-medium transition-colors ${dragging ? 'text-emerald-300' : 'text-gray-400'}`}>
        {dragging ? '🎯 Release to upload!' : label}
      </p>
      {!busy && !dragging && (
        <p className="text-[11px] text-gray-600">
          Drag &amp; drop · Ctrl+V to paste · or click to browse
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        disabled={busy}
        onChange={(e) => { onFiles(e.target.files); e.target.value = '' }}
      />
    </div>
  )
}

/* --------------------------- Color field --------------------------- */
function ColorField({
  value,
  onChange,
  placeholder,
}: {
  value: unknown
  onChange: (v: unknown) => void
  placeholder?: string
}) {
  const str = String(value ?? '')
  const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str)
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={isHex ? str : '#10b981'}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-12 cursor-pointer rounded-lg border border-gray-800 bg-gray-950 p-1"
      />
      <input
        className="flex-1 px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 focus:border-emerald-500 outline-none text-sm font-mono transition-colors"
        value={str}
        placeholder={placeholder || '#10b981'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

/* --------------------------- Icon field (simpleicons) --------------------------- */
function IconField({
  value,
  onChange,
  placeholder,
}: {
  value: unknown
  onChange: (v: unknown) => void
  placeholder?: string
}) {
  const slug = String(value ?? '').trim().toLowerCase()
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-800 bg-gray-950">
        {slug ? (
          // simpleicons CDN renders any valid slug as an SVG.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://cdn.simpleicons.org/${slug}`}
            alt={slug}
            width={20}
            height={20}
            onError={(e) => ((e.currentTarget.style.visibility = 'hidden'))}
          />
        ) : (
          <span className="text-gray-700 text-xs">—</span>
        )}
      </div>
      <input
        className="flex-1 px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 focus:border-emerald-500 outline-none text-sm transition-colors"
        value={String(value ?? '')}
        placeholder={placeholder || 'simpleicons slug (e.g. typescript)'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

/* --------------------------- Tags field (chips) --------------------------- */
function TagsField({
  value,
  onChange,
  placeholder,
}: {
  value: unknown
  onChange: (v: unknown) => void
  placeholder?: string
}) {
  const tags: string[] = Array.isArray(value) ? (value as string[]) : []
  const [input, setInput] = useState('')

  function add() {
    const t = input.trim()
    if (t && !tags.includes(t)) onChange([...tags, t])
    setInput('')
  }
  function removeAt(i: number) {
    onChange(tags.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300"
          >
            {t}
            <button type="button" onClick={() => removeAt(i)} className="hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-xs text-gray-600">No tags yet</span>}
      </div>
      <input
        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 focus:border-emerald-500 outline-none text-sm transition-colors"
        value={input}
        placeholder={placeholder || 'Type and press Enter'}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add()
          }
        }}
      />
    </div>
  )
}

/* --------------------------- Markdown field --------------------------- */
function mdToHtml(src: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return esc(src)
    .replace(/^### (.*)$/gm, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
    .replace(/^## (.*)$/gm, '<h2 class="text-lg font-semibold mt-3 mb-1">$1</h2>')
    .replace(/^# (.*)$/gm, '<h1 class="text-xl font-bold mt-3 mb-1">$1</h1>')
    .replace(/^\s*[-*] (.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1 rounded bg-gray-800 text-emerald-300">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-400 underline">$1</a>')
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

function MarkdownField({
  value,
  onChange,
  placeholder,
}: {
  value: unknown
  onChange: (v: unknown) => void
  placeholder?: string
}) {
  const [preview, setPreview] = useState(false)
  const str = String(value ?? '')
  return (
    <div>
      <div className="mb-1.5 flex gap-1 text-xs">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`px-2 py-1 rounded ${!preview ? 'bg-emerald-500 text-gray-950' : 'text-gray-400 hover:text-gray-100'}`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`px-2 py-1 rounded ${preview ? 'bg-emerald-500 text-gray-950' : 'text-gray-400 hover:text-gray-100'}`}
        >
          Preview
        </button>
      </div>
      {preview ? (
        <div
          className="min-h-32 rounded-lg bg-gray-950 border border-gray-800 p-3 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: mdToHtml(str) || '<span class="text-gray-600">Nothing to preview</span>' }}
        />
      ) : (
        <textarea
          className="w-full min-h-32 px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 focus:border-emerald-500 outline-none text-sm font-mono transition-colors"
          value={str}
          placeholder={placeholder || '# Markdown supported\n\n**bold**, *italic*, `code`, [links](url), - lists'}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

/* ----------------------------- Site settings panel ----------------------------- */
const HERO_FIELDS: Field[] = [
  { key: 'greeting', label: 'Greeting', type: 'text', placeholder: "Hi, I'm" },
  { key: 'firstName', label: 'First name', type: 'text', required: true },
  { key: 'nickname', label: 'Nickname / handle', type: 'text', placeholder: '(ut-code-crush)' },
  { key: 'lastName', label: 'Last name', type: 'text' },
  { key: 'roles', label: 'Typing roles', type: 'list', help: 'One phrase per line — these cycle in the typing animation' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'availabilityText', label: 'Availability text', type: 'text', placeholder: 'Available for opportunities' },
  { key: 'primaryCtaLabel', label: 'Primary button label', type: 'text', placeholder: 'Contact' },
  { key: 'primaryCtaHref', label: 'Primary button link', type: 'text', placeholder: '#contact' },
  { key: 'resumeHref', label: 'Resume link', type: 'text', placeholder: '/resume.pdf' },
]

const SOCIAL_FIELDS: Field[] = [
  { key: 'github', label: 'GitHub URL', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'twitter', label: 'Twitter / X URL', type: 'url' },
  { key: 'instagram', label: 'Instagram URL', type: 'url' },
]

const ABOUT_FIELDS: Field[] = [
  { key: 'bio', label: 'Bio ("Who am I?")', type: 'textarea', help: 'Shown in the "Get to Know Me" section' },
  {
    key: 'funFacts',
    label: 'Fun facts',
    type: 'list',
    help: 'One per line — start each with an emoji, e.g. "☕ Fueled by chai & curiosity"',
  },
]

const CONTACT_FIELDS: Field[] = [
  {
    key: 'notes',
    label: 'Availability notes',
    type: 'list',
    help: 'One per line, shown near the contact form, e.g. "💼 Open for freelance work"',
  },
]

function SettingsPanel({
  onToast,
}: {
  onToast: (t: { kind: 'ok' | 'err'; msg: string }) => void
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load')
        setSettings(data.settings)
      } catch (e) {
        onToast({ kind: 'err', msg: (e as Error).message })
      } finally {
        setLoading(false)
      }
    })()
  }, [onToast])

  function setHero(key: string, value: unknown) {
    setSettings((s) => (s ? { ...s, hero: { ...s.hero, [key]: value } } : s))
  }
  function setSocial(key: string, value: unknown) {
    setSettings((s) => (s ? { ...s, socials: { ...s.socials, [key]: value } } : s))
  }
  function setAbout(key: string, value: unknown) {
    setSettings((s) => {
      if (!s) return s
      const about = { ...(s.about ?? { bio: '', funFacts: [] }) }
      return { ...s, about: { ...about, [key]: value } }
    })
  }
  function setContact(key: string, value: unknown) {
    setSettings((s) => {
      if (!s) return s
      const contact = { ...(s.contact ?? { notes: [] }) }
      return { ...s, contact: { ...contact, [key]: value } }
    })
  }

  async function save() {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      onToast({ kind: 'ok', msg: 'Site settings published! Vercel rebuilds in ~30–60s.' })
    } catch (e) {
      onToast({ kind: 'err', msg: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-20 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading site settings…
      </div>
    )
  }
  if (!settings) return null

  return (
    <div className="grid gap-6">
      {/* Hero group */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-1">Hero</h2>
        <p className="text-xs text-gray-500 mb-5">The first thing visitors see. Drives the homepage hero section.</p>
        <div className="grid gap-5">
          {HERO_FIELDS.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              value={(settings.hero as Record<string, unknown>)[f.key]}
              onChange={(v) => setHero(f.key, v)}
            />
          ))}
          {/* Available-for-work toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(settings.hero.availableForWork)}
              onChange={(e) => setHero('availableForWork', e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            Show “available for work” status pill
          </label>
        </div>
      </div>

      {/* Socials group */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-1">Social links</h2>
        <p className="text-xs text-gray-500 mb-5">Used across the hero, contact and footer.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {SOCIAL_FIELDS.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              value={(settings.socials as Record<string, unknown>)[f.key]}
              onChange={(v) => setSocial(f.key, v)}
            />
          ))}
        </div>
      </div>

      {/* About group */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-1">About / Get to Know Me</h2>
        <p className="text-xs text-gray-500 mb-5">Bio and fun facts shown in the “Get to Know Me” section.</p>
        <div className="grid gap-5">
          {ABOUT_FIELDS.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              value={((settings.about ?? {}) as Record<string, unknown>)[f.key]}
              onChange={(v) => setAbout(f.key, v)}
            />
          ))}
        </div>
      </div>

      {/* Contact group */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-1">Contact</h2>
        <p className="text-xs text-gray-500 mb-5">Availability notes shown beside the contact form.</p>
        <div className="grid gap-5">
          {CONTACT_FIELDS.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              value={((settings.contact ?? {}) as Record<string, unknown>)[f.key]}
              onChange={(v) => setContact(f.key, v)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-medium px-4 py-2 rounded-lg"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
          {saving ? 'Publishing…' : 'Publish site settings'}
        </button>
        <p className="text-xs text-gray-600">Saves straight to GitHub — no separate Publish needed.</p>
      </div>
    </div>
  )
}

/* ----------------------------- Copy panel ----------------------------- */
const COPY_SECTIONS: { key: keyof SiteCopy; label: string }[] = [
  { key: 'about', label: 'About / Get to Know Me' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'codingStats', label: 'Coding Stats' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'contact', label: 'Contact' },
]

const SECTION_FIELDS: Field[] = [
  { key: 'eyebrow', label: 'Eyebrow (small label)', type: 'text' },
  { key: 'title', label: 'Title — plain part', type: 'text', help: 'Leave blank if the whole heading is the gradient part' },
  { key: 'highlight', label: 'Title — gradient (green) part', type: 'text' },
  { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
]

function CopyPanel({ onToast }: { onToast: (t: { kind: 'ok' | 'err'; msg: string }) => void }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [copy, setCopy] = useState<SiteCopy | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load')
        setSettings(data.settings)
        setCopy(mergeCopy(data.settings?.copy))
      } catch (e) {
        onToast({ kind: 'err', msg: (e as Error).message })
      } finally {
        setLoading(false)
      }
    })()
  }, [onToast])

  function setSection(section: keyof SiteCopy, key: string, value: unknown) {
    setCopy((c) => (c ? { ...c, [section]: { ...(c[section] as object), [key]: value } } : c))
  }
  function setTop(key: keyof SiteCopy, value: unknown) {
    setCopy((c) => (c ? { ...c, [key]: value } : c))
  }

  async function save() {
    if (!settings || !copy) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { ...settings, copy } }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      onToast({
        kind: 'ok',
        msg:
          process.env.NODE_ENV === 'production'
            ? 'Copy published! Vercel rebuilds in ~30–60s.'
            : 'Copy saved to local files. Refresh the site to see changes.',
      })
    } catch (e) {
      onToast({ kind: 'err', msg: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-20 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading site copy…
      </div>
    )
  }
  if (!copy) return null
  const cp = copy as unknown as Record<string, Record<string, unknown>>

  return (
    <div className="grid gap-6">
      <p className="text-sm text-gray-400">
        Edit every section&apos;s headings and stray text. The <span className="text-emerald-400">green</span> part of
        each title is the “gradient” field.
      </p>

      {/* Section headings */}
      {COPY_SECTIONS.map((s) => (
        <div key={s.key} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
          <h2 className="font-semibold mb-4">{s.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SECTION_FIELDS.map((f) => (
              <FieldInput
                key={f.key}
                field={f}
                value={cp[s.key as string]?.[f.key]}
                onChange={(v) => setSection(s.key, f.key, v)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Misc values */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-4">Other values</h2>
        <div className="grid gap-5">
          <FieldInput
            field={{ key: 'aboutExperienceValue', label: 'About — “Experience” tile value', type: 'text' }}
            value={copy.aboutExperienceValue}
            onChange={(v) => setTop('aboutExperienceValue', v)}
          />
          <FieldInput
            field={{ key: 'footerTagline', label: 'Footer tagline', type: 'text' }}
            value={copy.footerTagline}
            onChange={(v) => setTop('footerTagline', v)}
          />
        </div>
      </div>

      {/* Footer services */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-1">Footer — Services</h2>
        <p className="text-xs text-gray-500 mb-4">The list of services shown in the footer.</p>
        <div className="grid gap-3">
          {copy.footerServices.map((svc, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                className="flex-1 min-w-[140px] px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 focus:border-emerald-500 outline-none text-sm"
                value={svc.label}
                placeholder="Label"
                onChange={(e) =>
                  setTop('footerServices', copy.footerServices.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))
                }
              />
              <input
                className="flex-1 min-w-[140px] px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 focus:border-emerald-500 outline-none text-sm font-mono"
                value={svc.href}
                placeholder="/link"
                onChange={(e) =>
                  setTop('footerServices', copy.footerServices.map((x, idx) => (idx === i ? { ...x, href: e.target.value } : x)))
                }
              />
              <button
                type="button"
                onClick={() => setTop('footerServices', copy.footerServices.filter((_, idx) => idx !== i))}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTop('footerServices', [...copy.footerServices, { label: '', href: '' }])}
            className="flex w-fit items-center gap-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm px-3 py-2"
          >
            <Plus className="w-4 h-4" /> Add service
          </button>
        </div>
      </div>

      {/* Contact descriptions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-4">Contact — card descriptions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['email', 'linkedin', 'github', 'instagram'] as const).map((k) => (
            <FieldInput
              key={k}
              field={{ key: k, label: k.charAt(0).toUpperCase() + k.slice(1), type: 'text' }}
              value={copy.contactDescriptions[k]}
              onChange={(v) => setTop('contactDescriptions', { ...copy.contactDescriptions, [k]: v })}
            />
          ))}
        </div>
      </div>

      {/* Terminal responses */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-4">Footer Terminal — command responses</h2>
        <div className="grid gap-5">
          <FieldInput
            field={{ key: 'terminalWhoami', label: '"whoami" output', type: 'list', help: 'One line per row' }}
            value={copy.terminalWhoami}
            onChange={(v) => setTop('terminalWhoami', v)}
          />
          <FieldInput
            field={{ key: 'terminalSkills', label: '"skills" output', type: 'list', help: 'One line per row' }}
            value={copy.terminalSkills}
            onChange={(v) => setTop('terminalSkills', v)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-medium px-4 py-2 rounded-lg"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save site copy'}
        </button>
        <p className="text-xs text-gray-600">Saves straight to the data file — no separate Publish needed.</p>
      </div>
    </div>
  )
}

/* ----------------------------- Resume panel ----------------------------- */
function ResumePanel({
  onToast,
}: {
  onToast: (t: { kind: 'ok' | 'err'; msg: string }) => void
}) {
  const [busy, setBusy] = useState(false)
  const [fileName, setFileName] = useState('')

  async function upload(file: File | null) {
    if (!file) return
    if (file.type !== 'application/pdf') {
      onToast({ kind: 'err', msg: 'Please choose a PDF file.' })
      return
    }
    setBusy(true)
    setFileName(file.name)
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result as string)
        r.onerror = () => reject(new Error('Could not read file'))
        r.readAsDataURL(file)
      })
      const res = await fetch('/api/admin/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onToast({
        kind: 'ok',
        msg: 'Resume updated! Vercel will rebuild in ~30–60s. Every "Resume" link now points to the new file.',
      })
    } catch (e) {
      onToast({ kind: 'err', msg: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-xl">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-emerald-400" />
        <h2 className="font-semibold">Resume / CV</h2>
      </div>
      <p className="text-sm text-gray-400 mb-5">
        Upload a new PDF to replace your current resume. It overwrites{' '}
        <code>/resume.pdf</code>, so the Hero, About and Footer “Resume” buttons update automatically
        — no code changes needed.
      </p>

      <label className="inline-flex items-center gap-2 text-sm cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-medium px-4 py-2.5 rounded-lg">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
        {busy ? 'Uploading…' : 'Upload new resume (PDF)'}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={busy}
          onChange={(e) => upload(e.target.files?.[0] ?? null)}
        />
      </label>

      {fileName && !busy && <p className="text-xs text-gray-500 mt-3">Last selected: {fileName}</p>}

      <div className="mt-5 pt-4 border-t border-gray-800">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-400 hover:underline"
        >
          View current resume →
        </a>
      </div>
    </div>
  )
}
