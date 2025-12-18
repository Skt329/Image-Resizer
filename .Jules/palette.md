## 2024-05-23 - Improve Upload UX & Error Handling
**Learning:** Native `alert()` calls disrupt the user flow and feel jarring in modern web apps. Inline error messages provide a much smoother experience. Also, "ghost" buttons that look interactive but do nothing (like the "Supported Formats" button) confuse users.
**Action:** Always check for native alerts and replace them with toast notifications or inline errors. Ensure every button has a clear action.
