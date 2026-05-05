import { useState } from "react";
import { usePromises, useCreatePromise, useUpdatePromise, useDeletePromise, type PromiseItem, type PromiseStatus } from "@/hooks/usePromises";
import { STATUS_CONFIG } from "@/data/promises";
import { ShieldCheck, Plus, Pencil, Trash2, X, Check, Loader2, LogOut, ArrowLeft, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

const COLOR_OPTIONS = [
  { label: "Red → Orange", value: "from-red-500 to-orange-500" },
  { label: "Orange → Amber", value: "from-orange-500 to-amber-500" },
  { label: "Blue → Indigo", value: "from-blue-500 to-indigo-600" },
  { label: "Green → Emerald", value: "from-green-500 to-emerald-600" },
  { label: "Purple → Pink", value: "from-purple-500 to-pink-500" },
  { label: "Yellow → Amber", value: "from-yellow-500 to-amber-500" },
  { label: "Pink → Rose", value: "from-pink-500 to-rose-500" },
  { label: "Teal → Cyan", value: "from-teal-500 to-cyan-600" },
  { label: "Green → Teal", value: "from-green-600 to-teal-600" },
  { label: "Amber → Yellow", value: "from-amber-600 to-yellow-600" },
];

const CATEGORY_OPTIONS = [
  "financial", "housing", "health", "employment", "women", "youth", "elderly",
];

const EMPTY_FORM: Omit<PromiseItem, "_id"> = {
  slug: "",
  icon: "📌",
  titleBengali: "",
  titleEnglish: "",
  descriptionBengali: "",
  descriptionEnglish: "",
  amount: "",
  category: "financial",
  status: "pending",
  color: "from-orange-500 to-amber-500",
  order: 99,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem("bjp_admin") === "1"; } catch { return false; }
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<PromiseItem | null>(null);
  const [form, setForm] = useState<Omit<PromiseItem, "_id">>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [adminPwd] = useState(() => {
    try { return sessionStorage.getItem("bjp_admin_pwd") || ""; } catch { return ""; }
  });
  const [storedPwd, setStoredPwd] = useState(adminPwd);

  const { data: promises = [], isLoading } = usePromises();
  const createMutation = useCreatePromise(storedPwd);
  const updateMutation = useUpdatePromise(storedPwd);
  const deleteMutation = useDeletePromise(storedPwd);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json() as { valid: boolean };
      if (data.valid) {
        sessionStorage.setItem("bjp_admin", "1");
        sessionStorage.setItem("bjp_admin_pwd", password);
        setStoredPwd(password);
        setAuthed(true);
      } else {
        setAuthError("Incorrect password. Please try again.");
      }
    } catch {
      setAuthError("Could not connect to server. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("bjp_admin");
    sessionStorage.removeItem("bjp_admin_pwd");
    setAuthed(false);
    setPassword("");
  }

  function openAddForm() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(p: PromiseItem) {
    setEditTarget(p);
    setForm({
      slug: p.slug,
      icon: p.icon,
      titleBengali: p.titleBengali,
      titleEnglish: p.titleEnglish,
      descriptionBengali: p.descriptionBengali,
      descriptionEnglish: p.descriptionEnglish,
      amount: p.amount,
      category: p.category,
      status: p.status,
      color: p.color,
      order: p.order,
    });
    setFormError("");
    setShowForm(true);
  }

  function handleTitleChange(val: string) {
    setForm((f) => ({
      ...f,
      titleEnglish: val,
      slug: editTarget ? f.slug : slugify(val),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.titleEnglish || !form.titleBengali || !form.amount || !form.slug) {
      setFormError("Please fill in all required fields.");
      return;
    }
    try {
      if (editTarget) {
        await updateMutation.mutateAsync({ id: editTarget._id, data: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      setShowForm(false);
    } catch (err: unknown) {
      setFormError((err as Error).message || "Something went wrong.");
    }
  }

  async function handleDelete(id: string) {
    await deleteMutation.mutateAsync(id);
    setDeleteConfirm(null);
  }

  async function handleStatusChange(p: PromiseItem, status: PromiseStatus) {
    await updateMutation.mutateAsync({ id: p._id, data: { status } });
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">BJP Promise Tracker — Restricted Access</p>
          </div>
          <form onSubmit={handleLogin} className="bg-card border border-card-border rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
              <input
                data-testid="input-admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {authError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}
            <button
              type="submit"
              data-testid="btn-admin-login"
              disabled={!password || authLoading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {authLoading ? "Verifying..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to site</span>
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="btn-add-promise"
            onClick={openAddForm}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Promise</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Promise Cards</h2>
          <p className="text-sm text-muted-foreground">
            {promises.length} promise{promises.length !== 1 ? "s" : ""} — manage status, edit details, or add new cards
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading promises...
          </div>
        ) : (
          <div className="space-y-3">
            {promises.map((p) => {
              const statusCfg = STATUS_CONFIG[p.status];
              return (
                <div
                  key={p._id}
                  data-testid={`admin-card-${p.slug}`}
                  className="bg-card border border-card-border rounded-2xl overflow-hidden"
                >
                  <div className={`h-1 w-full bg-gradient-to-r ${p.color}`} />
                  <div className="p-4 flex items-start gap-4">
                    <span className="text-2xl shrink-0">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap mb-1">
                        <span className="font-bold text-foreground text-sm">{p.titleEnglish}</span>
                        <span className="text-xs text-muted-foreground">({p.titleBengali})</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{p.descriptionEnglish}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-primary">{p.amount}</span>
                        {/* Inline status changer */}
                        <select
                          data-testid={`status-select-${p.slug}`}
                          value={p.status}
                          onChange={(e) => handleStatusChange(p, e.target.value as PromiseStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="partial">Partially Done</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="broken">Broken</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        data-testid={`edit-promise-${p.slug}`}
                        onClick={() => openEditForm(p)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteConfirm === p._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            data-testid={`confirm-delete-${p.slug}`}
                            onClick={() => handleDelete(p._id)}
                            disabled={deleteMutation.isPending}
                            className="p-2 rounded-xl text-white bg-destructive hover:opacity-90 transition-opacity"
                            title="Confirm delete"
                          >
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-all"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          data-testid={`delete-promise-${p.slug}`}
                          onClick={() => setDeleteConfirm(p._id)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-card border border-card-border rounded-2xl shadow-xl my-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground">
                {editTarget ? "Edit Promise Card" : "Add New Promise Card"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Icon (emoji) *</label>
                  <input
                    data-testid="form-icon"
                    value={form.icon}
                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="🏠"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Amount *</label>
                  <input
                    data-testid="form-amount"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="₹5,000/month"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Title (English) *</label>
                <input
                  data-testid="form-title-english"
                  value={form.titleEnglish}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Free Healthcare for All"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Title (Bengali) *</label>
                <input
                  data-testid="form-title-bengali"
                  value={form.titleBengali}
                  onChange={(e) => setForm((f) => ({ ...f, titleBengali: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="সকলের জন্য বিনামূল্যে স্বাস্থ্যসেবা"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Description (English)</label>
                <textarea
                  data-testid="form-desc-english"
                  value={form.descriptionEnglish}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionEnglish: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  placeholder="Detailed description of the promise in English"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Description (Bengali)</label>
                <textarea
                  data-testid="form-desc-bengali"
                  value={form.descriptionBengali}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionBengali: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  placeholder="বাংলায় বিস্তারিত বিবরণ"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">URL Slug *</label>
                <input
                  data-testid="form-slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  placeholder="free-healthcare"
                />
                <p className="text-xs text-muted-foreground mt-1">Auto-generated from title. Must be unique.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Category</label>
                  <select
                    data-testid="form-category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Initial Status</label>
                  <select
                    data-testid="form-status"
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PromiseStatus }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partially Done</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="broken">Broken</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Card Color</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      data-testid={`color-${c.value}`}
                      onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                        form.color === c.value
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md bg-gradient-to-r shrink-0 ${c.value}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-accent transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="btn-submit-promise"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editTarget ? "Save Changes" : "Add Promise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
