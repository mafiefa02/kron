# Genta

Genta is a modern desktop scheduling application built with **Tauri**, **React**, and **Rust**. It allows users to manage complex schedules with profiles, recurring events, and custom sound notifications.

## 🚀 Key Features

- **Profiles**: Organize your schedules into different contexts (e.g., Work, Home, Vacation).
- **Advanced Scheduling**: Support for one-time, daily, and weekly recurring events.
- **Instance Overrides**: Cancel or reschedule specific instances of recurring events without affecting the entire series.
- **Custom Notifications**: Associate schedules with custom audio files to be played upon trigger.
- **Background Scheduler**: A lightweight Rust-based background process that ensures schedules trigger reliably with minimal resource usage.
- **Modern UI**: A sleek, responsive interface built with React 19, Tailwind CSS 4, and Framer Motion.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React 19](https://react.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [TanStack Form](https://tanstack.com/form/latest)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Base UI](https://base-ui.com/)
- **Database Querying**: [Kysely](https://kysely.dev/) (via Tauri SQL plugin)

### Backend

- **Framework**: [Tauri v2](https://v2.tauri.app/)
- **Language**: [Rust](https://www.rust-lang.org/)
- **Database**: SQLite (via `tauri-plugin-sql`)
- **Audio**: [Rodio](https://github.com/RustAudio/rodio) for low-level audio playback.
- **Persistence**: [SQLx](https://github.com/launchbadge/sqlx) for migrations and background scheduler DB access.

## 📂 Project Structure

```text
├── src/                # React Frontend
│   ├── features/       # Feature-based modules (Profiles, Schedules, Sounds)
│   ├── pages/          # Application views/routes
│   ├── shared/         # Reusable components, hooks, and utilities
│   └── models/         # Database models and repository patterns
├── src-tauri/          # Rust Backend
│   ├── src/
│   │   ├── main.rs     # Entry point
│   │   ├── lib.rs      # Tauri setup & plugin configuration
│   │   └── scheduler.rs# Background loop for triggering schedules
│   └── db/migrations/  # SQL migration files
└── resources/          # Static assets and default sounds
```

## 🛠️ Development

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/) (pnpm recommended)

### Setup & Run

1.  Install dependencies:
    ```bash
    pnpm install
    ```
2.  Run the app in development mode:
    ```bash
    pnpm tauri dev
    ```

### Build

To build the production application:

```bash
pnpm tauri build
```

## 📝 License

[MIT](LICENSE)
