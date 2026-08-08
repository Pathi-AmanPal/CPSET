"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import ImageUpload from "@/components/ui/ImageUpload";
import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";
import {
  fetchTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadImage,
} from "@/lib/fetchers";
import type { TeamMember, TeamInput } from "@/lib/types";
import { truncate } from "@/lib/utils";

const columns: Column<TeamMember>[] = [
  {
    key: "name",
    label: "Name",
    render: (m) => <span className="text-royal font-semibold">{m.name}</span>,
  },
  { key: "role", label: "Role" },
  {
    key: "bio",
    label: "Bio",
    render: (m) => truncate(m.bio, 60),
  },
  {
    key: "imageUrl",
    label: "Image",
    render: (m) =>
      m.imageUrl ? (
        <img
          src={m.imageUrl}
          alt=""
          className="w-8 h-8 rounded-full object-cover border border-slate-200"
        />
      ) : (
        <span className="text-slate-400">—</span>
      ),
  },
];

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setMembers(await fetchTeam());
    } catch {
      showToast("error", "Failed to load team members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setName("");
    setRole("");
    setBio("");
    setImageFile(null);
    setExistingImageUrl(null);
    setEditing(null);
    setFormOpen(false);
  }

  function handleEdit(member: TeamMember) {
    setEditing(member);
    setName(member.name);
    setRole(member.role);
    setBio(member.bio);
    setExistingImageUrl(member.imageUrl);
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

      const data: TeamInput = { name, role, bio, imageUrl };

      if (editing) {
        await updateTeamMember(editing.id, data);
        showToast("success", "Team member updated");
      } else {
        await createTeamMember(data);
        showToast("success", "Team member added");
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
      await deleteTeamMember(deleting.id);
      showToast("success", "Team member deleted");
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
          Team Members
        </h1>
        <button
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="flex items-center gap-2 bg-cobalt hover:bg-cobalt/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-royal">
              {editing ? "Edit Member" : "New Member"}
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
                  Name
                </label>
                <input
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Role
                </label>
                <input
                  required
                  maxLength={120}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt transition-all"
                  placeholder="Lead, Member, Advisor..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Bio
              </label>
              <textarea
                required
                maxLength={2000}
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt transition-all resize-y"
                placeholder="Brief bio..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Photo
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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-cobalt" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <DataTable
            columns={columns}
            data={members}
            onEdit={handleEdit}
            onDelete={setDeleting}
          />
        </div>
      )}

      {/* Delete modal */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        loading={saving}
      />
    </div>
  );
}
