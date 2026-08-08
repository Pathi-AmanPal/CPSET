"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import ImageUpload from "@/components/ui/ImageUpload";
import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadImage,
} from "@/lib/fetchers";
import type { Event, EventInput } from "@/lib/types";
import { formatDate, truncate } from "@/lib/utils";

const columns: Column<Event>[] = [
  {
    key: "title",
    label: "Title",
    render: (e) => <span className="text-royal font-semibold">{e.title}</span>,
  },
  {
    key: "eventDate",
    label: "Date",
    render: (e) => formatDate(e.eventDate),
  },
  { key: "location", label: "Location" },
  {
    key: "description",
    label: "Description",
    render: (e) => truncate(e.description, 50),
  },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setEvents(await fetchEvents());
    } catch {
      showToast("error", "Failed to load events");
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
    setEventDate("");
    setLocation("");
    setImageFile(null);
    setExistingImageUrl(null);
    setEditing(null);
    setFormOpen(false);
  }

  function handleEdit(event: Event) {
    setEditing(event);
    setTitle(event.title);
    setDescription(event.description);
    setEventDate(event.eventDate.slice(0, 16)); // datetime-local format
    setLocation(event.location);
    setExistingImageUrl(event.imageUrl);
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

      const data: EventInput = {
        title,
        description,
        eventDate: new Date(eventDate).toISOString(),
        location,
        imageUrl,
      };

      if (editing) {
        await updateEvent(editing.id, data);
        showToast("success", "Event updated");
      } else {
        await createEvent(data);
        showToast("success", "Event created");
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
      await deleteEvent(deleting.id);
      showToast("success", "Event deleted");
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
        <h1 className="font-heading font-bold text-2xl text-royal">Events</h1>
        <button
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="flex items-center gap-2 bg-cobalt hover:bg-cobalt/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {formOpen && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-royal">
              {editing ? "Edit Event" : "New Event"}
            </h2>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Workshop on Ethical Hacking"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Date & Time
                </label>
                <input
                  required
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cobalt transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Location
                </label>
                <input
                  required
                  maxLength={200}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt transition-all"
                  placeholder="Seminar Hall 3, Block A"
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
                placeholder="Event details..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Cover Image
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
                {editing ? "Update" : "Create"}
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
            data={events}
            onEdit={handleEdit}
            onDelete={setDeleting}
          />
        </div>
      )}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleting?.title}"? This action cannot be undone.`}
        loading={saving}
      />
    </div>
  );
}
