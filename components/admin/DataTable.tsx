"use client";

import { Pencil, Trash2 } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        No entries yet. Add one above.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3.5 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th className="text-right py-3.5 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-slate-200/70 hover:bg-slate-50/80 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3.5 px-4 text-slate-700 font-medium">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-lg hover:bg-cobalt/10 text-slate-500 hover:text-cobalt transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-alert transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
