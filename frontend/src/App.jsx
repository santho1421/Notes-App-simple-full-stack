// App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root component of the Notes App.
// Manages all application state and wires together the child components.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback } from "react";
import NoteInput from "./components/NoteInput";
import NoteList from "./components/NoteList";
import StatusMessage from "./components/StatusMessage";
import { getAllNotes, createNote, updateNote, deleteNote } from "./services/notesApi";
import "./App.css";

function App() {
  // ── State ────────────────────────────────────────────────────────────────

  /** Current value of the text input */
  const [inputValue, setInputValue] = useState("");

  /** Full list of notes fetched from the backend */
  const [notes, setNotes] = useState([]);

  /** Controls whether the NoteList section is shown */
  const [listVisible, setListVisible] = useState(false);

  /** True while any API call is in flight */
  const [loading, setLoading] = useState(false);

  /** True while the notes list is being fetched */
  const [listLoading, setListLoading] = useState(false);

  /** Status banner: { message: string, type: "success"|"error" } | null */
  const [status, setStatus] = useState(null);

  /** The note currently being edited, or null when in create mode */
  const [editingNote, setEditingNote] = useState(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Show a status banner that auto-dismisses after 3 seconds.
   * @param {string} message
   * @param {"success"|"error"} type
   */
  const showStatus = useCallback((message, type = "success") => {
    setStatus({ message, type });
    setTimeout(() => setStatus(null), 3000);
  }, []);

  /**
   * Fetch all notes from the backend and update state.
   * Called after every mutating operation to keep the list fresh.
   */
  const refreshNotes = useCallback(async () => {
    setListLoading(true);
    try {
      const response = await getAllNotes();
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      showStatus("Failed to load notes. Is the backend running?", "error");
    } finally {
      setListLoading(false);
    }
  }, [showStatus]);

  /** Reset the input field and exit edit mode. */
  const resetForm = useCallback(() => {
    setInputValue("");
    setEditingNote(null);
  }, []);

  // ── Event handlers ───────────────────────────────────────────────────────

  /**
   * Handle Submit (create) or Update (edit) button click.
   * Validates the input, calls the appropriate API, then refreshes the list.
   */
  const handleSubmit = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      showStatus("Please enter a note before submitting.", "error");
      return;
    }

    setLoading(true);
    try {
      if (editingNote) {
        // ── UPDATE existing note ─────────────────────────────────────────
        await updateNote(editingNote.id, trimmed);
        showStatus("Note updated successfully!", "success");
      } else {
        // ── CREATE new note ──────────────────────────────────────────────
        await createNote(trimmed);
        showStatus("Note added successfully!", "success");
      }

      resetForm();

      // Refresh the list only if it is already visible
      if (listVisible) {
        await refreshNotes();
      }
    } catch (error) {
      console.error("Submit error:", error);
      showStatus(
        error.response?.data?.detail || "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Display button click.
   * Shows the notes section and fetches notes from the backend.
   */
  const handleDisplay = async () => {
    setListVisible(true);
    await refreshNotes();
  };

  /**
   * Handle Edit button click on a NoteCard.
   * Populates the input field with the note's message and enters edit mode.
   * @param {Object} note - The note to edit { id, message }
   */
  const handleEdit = (note) => {
    setEditingNote(note);
    setInputValue(note.message);
    // Scroll to the top so the user can see the pre-filled input
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Handle Delete button click on a NoteCard.
   * Calls the API, then refreshes the list.
   * @param {number} id - The note id to delete
   */
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteNote(id);
      showStatus("Note deleted successfully!", "success");

      // If we were editing the note that got deleted, clear the form
      if (editingNote?.id === id) resetForm();

      await refreshNotes();
    } catch (error) {
      console.error("Delete error:", error);
      showStatus(
        error.response?.data?.detail || "Failed to delete note.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="app-wrapper">
      <div className="app-container">

        {/* App header ------------------------------------------------------ */}
        <header className="app-header">
          <h1 className="app-title">📝 Notes App</h1>
          <p className="app-subtitle">Create, view, edit, and delete your notes</p>
        </header>

        {/* Status banner --------------------------------------------------- */}
        <StatusMessage message={status?.message} type={status?.type} />

        {/* Input section --------------------------------------------------- */}
        <NoteInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          onDisplay={handleDisplay}
          isEditing={!!editingNote}
          loading={loading}
        />

        {/* Cancel edit hint ------------------------------------------------ */}
        {editingNote && (
          <p className="edit-hint">
            Editing note #{editingNote.id}.{" "}
            <button className="cancel-edit-btn" onClick={resetForm}>
              Cancel
            </button>
          </p>
        )}

        {/* Notes list ------------------------------------------------------- */}
        <NoteList
          notes={notes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={listLoading}
          visible={listVisible}
        />
      </div>
    </div>
  );
}

export default App;
