// components/NoteCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Displays a single note inside a card with Edit and Delete buttons.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

/**
 * NoteCard component
 *
 * Props:
 *   note     {Object}   - The note object { id, message }
 *   onEdit   {Function} - Called with the note object when Edit is clicked
 *   onDelete {Function} - Called with the note id when Delete is clicked
 *   loading  {boolean}  - Disables action buttons during API calls
 */
function NoteCard({ note, onEdit, onDelete, loading }) {
  return (
    <div className="note-card" id={`note-card-${note.id}`}>
      {/* Divider at the top of the card ----------------------------------- */}
      <div className="note-divider" />

      {/* Note message text ------------------------------------------------ */}
      <p className="note-message">{note.message}</p>

      {/* Edit / Delete buttons aligned to the right ----------------------- */}
      <div className="note-actions">
        <button
          id={`edit-btn-${note.id}`}
          className="btn btn-edit"
          onClick={() => onEdit(note)}
          disabled={loading}
        >
          Edit
        </button>

        <button
          id={`delete-btn-${note.id}`}
          className="btn btn-delete"
          onClick={() => onDelete(note.id)}
          disabled={loading}
        >
          Delete
        </button>
      </div>

      {/* Divider at the bottom of the card -------------------------------- */}
      <div className="note-divider" />
    </div>
  );
}

export default NoteCard;
