// components/NoteList.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders the list of notes returned by the API.
// Handles three visual states: loading, empty, and populated.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import NoteCard from "./NoteCard";

/**
 * NoteList component
 *
 * Props:
 *   notes    {Array}    - Array of note objects { id, message }
 *   onEdit   {Function} - Forwarded to each NoteCard's Edit button
 *   onDelete {Function} - Forwarded to each NoteCard's Delete button
 *   loading  {boolean}  - Shows a loading indicator while fetching
 *   visible  {boolean}  - Controls whether the list section is rendered at all
 */
function NoteList({ notes, onEdit, onDelete, loading, visible }) {
  // Don't render the section if the user hasn't clicked Display yet
  if (!visible) return null;

  return (
    <section className="notes-section" aria-label="Notes list">
      <h2 className="notes-heading">All Notes</h2>

      {/* Loading state --------------------------------------------------- */}
      {loading && (
        <p className="loading-text" aria-live="polite">
          Loading notes…
        </p>
      )}

      {/* Empty state ----------------------------------------------------- */}
      {!loading && notes.length === 0 && (
        <p className="empty-text">No notes found. Add your first note above!</p>
      )}

      {/* Notes list ------------------------------------------------------- */}
      {!loading && notes.length > 0 && (
        <div className="notes-list" id="notes-list">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default NoteList;
