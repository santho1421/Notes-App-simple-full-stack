// services/notesApi.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralised Axios API service for communicating with the FastAPI backend.
// All HTTP calls to /notes are defined here so components stay clean.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

// Base URL of the FastAPI backend
const BASE_URL = "http://localhost:8000";

// Create an Axios instance with the base URL pre-configured
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all notes from the backend.
 * @returns {Promise<Array>} Array of note objects { id, message }
 */
export const getAllNotes = () => api.get("/notes");

/**
 * Create a new note.
 * @param {string} message - The text content of the note
 * @returns {Promise<Object>} The newly created note object
 */
export const createNote = (message) => api.post("/notes", { message });

/**
 * Update an existing note by id.
 * @param {number} id      - The note's primary key
 * @param {string} message - The updated text content
 * @returns {Promise<Object>} The updated note object
 */
export const updateNote = (id, message) => api.put(`/notes/${id}`, { message });

/**
 * Delete a note by id.
 * @param {number} id - The note's primary key
 * @returns {Promise<Object>} Confirmation message from the API
 */
export const deleteNote = (id) => api.delete(`/notes/${id}`);
