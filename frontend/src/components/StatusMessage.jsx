// components/StatusMessage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Displays a temporary success or error banner at the top of the app.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

/**
 * StatusMessage component
 *
 * Props:
 *   message {string} - The text to show; renders nothing when empty / null
 *   type    {string} - "success" | "error" — drives the CSS class applied
 */
function StatusMessage({ message, type }) {
  return (
    // Wrapper always occupies space to prevent layout shift on banner appear
    <div className="status-message-wrapper">
      {message && (
        <div
          id="status-message"
          className={`status-message status-${type}`}
          role="alert"               // screen-reader friendly
          aria-live="polite"
        >
          {/* Icon prefix based on message type */}
          <span className="status-icon">{type === "success" ? "✓" : "✗"}</span>
          {message}
        </div>
      )}
    </div>
  );
}

export default StatusMessage;
