// components/NoteInput.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Controlled input component that holds the note text and exposes
// Submit / Update + Display buttons.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

/**
 * NoteInput component
 *
 * Props:
 *   value        {string}   - Current value of the text input (controlled)
 *   onChange     {Function} - Called with the new string when the user types
 *   onSubmit     {Function} - Called when the Submit / Update button is clicked
 *   onDisplay    {Function} - Called when the Display button is clicked
 *   isEditing    {boolean}  - When true, shows "Update" instead of "Submit"
 *   loading      {boolean}  - Disables buttons while an API call is in flight
 */
function NoteInput({ value, onChange, onSubmit, onDisplay, isEditing, loading }) {
  return (
    <div className="input-section">
      {/* Note text input -------------------------------------------------- */}
      <input
        id="note-input"
        type="text"
        className="note-input"
        placeholder="Type your note here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // Allow Enter key to submit / update
        onKeyDown={(e) => e.key === "Enter" && !loading && onSubmit()}
      />

      {/* Action buttons --------------------------------------------------- */}
      <div className="button-row">
        <button
          id="submit-btn"
          className={`btn btn-primary ${isEditing ? "btn-update" : ""}`}
          onClick={onSubmit}
          disabled={loading}
        >
          {/* Button label changes based on editing state */}
          {loading ? "Saving…" : isEditing ? "Update" : "Submit"}
        </button>

        <button
          id="display-btn"
          className="btn btn-secondary"
          onClick={onDisplay}
          disabled={loading}
        >
          Display
        </button>
      </div>
    </div>
  );
}

export default NoteInput;
