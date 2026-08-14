"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import ImageUpload from "@/components/ui/ImageUpload";
import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";
import {
  fetchAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  uploadImage,
} from "@/lib/fetchers";
import type { Achievement, AchievementInput } from "@/lib/types";
import { formatDate, truncate } from "@/lib/utils";

const columns: Column<Achievement>[] = [
  {
    key: "title",
    label: "Title",
    render: (a) => <span className="text-royal font-semibold">{a.title}</span>,
  },
  {
    key: "achievedAt",
    label: "Date",
    render: (a) => formatDate(a.achievedAt),
  },
  {
    key: "description",
    label: "Description",
    render: (a) => truncate(a.description, 60),
  },
];

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [deleting, setDeleting] = useState<Achievement | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [achievedAt, setAchievedAt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setAchievements(await fetchAchievements());
    } catch {
      showToast("error", "Failed to load achievements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setAchievedAt("");
    setImageFile(null);
    setExistingImageUrl(null);
    setEditing(null);
    setFormOpen(false);
  }

  function handleEdit(achievement: Achievement) {
    setEditing(achievement);
    setTitle(achievement.title);
    setDescription(achievement.description);
    setAchievedAt(achievement.achievedAt.slice(0, 16));
    setExistingImageUrl(achievement.imageUrl);
    setImageFile(null);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = existingImageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const data: AchievementInput = {
        title,
        description,
        achievedAt: new Date(achievedAt).toISOString(),
        imageUrl,
      };

      if (editing) {
        await updateAchievement(editing.id, data);
        showToast("success", "Achievement updated");
      } else {
        await createAchievement(data);
        showToast("success", "Achievement added");
      }

      resetForm();
      load();
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to save"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setSaving(true);
    try {
      await deleteAchievement(deleting.id);
      showToast("success", "Achievement deleted");
      setDeleting(null);
      load();
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to delete"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-royal">
          Achievements
        </h1>
        <button
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="flex items-center gap-2 bg-cobalt hover:bg-cobalt/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>

      {formOpen && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-royal">
              {editing ? "Edit Achievement" : "New Achievement"}
            </h2>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Title
                </label>
                <input
                  required
                  maxLength={160}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt transition-all"
                  placeholder="Won National CTF Championship"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Date Achieved
                </label>
                <input
                  required
                  type="datetime-local"
                  value={achievedAt}
                  onChange={(e) => setAchievedAt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cobalt transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Description
              </label>
              <textarea
                required
                maxLength={4000}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt transition-all resize-y"
                placeholder="Details about the achievement..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Image
              </label>
              <ImageUpload
                value={existingImageUrl}
                onChange={(file) => {
                  setImageFile(file);
                  if (!file) setExistingImageUrl(null);
                }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-cobalt hover:bg-cobalt/90 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors shadow-sm"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-cobalt" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <DataTable
            columns={columns}
            data={achievements}
            onEdit={handleEdit}
            onDelete={setDeleting}
          />
        </div>
      )}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Achievement"
        message={`Are you sure you want to delete "${deleting?.title}"? This action cannot be undone.`}
        loading={saving}
      />
    </div>
  );
}
