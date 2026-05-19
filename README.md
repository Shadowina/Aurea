# Aurea

## 🪐 Overview

**Aurea** is a beautifully designed, privacy-focused mood journaling web app built with React, Vite, and Firebase. It lets you track your moods, visualize emotional patterns over time, and reflect on your well-being with insightful analytics—all in a modern, responsive interface.

## 🚀 Features

- **Mood Dashboard:** Log your mood entries, filter and search by tags or favorites, and view streaks & summaries.
- **Interactive Analytics:** Pie charts, bar graphs, and key stats to help you spot patterns in your mood over time.
- **Calendar Heatmap:** See at a glance which days you were most active and how your emotions varied.
- **Gallery:** Browse and revisit journal entries with images, organized and searchable.
- **Personalization & Themes:** Switch between light/dark themes, change display language (English, French, Spanish), and adjust your profile.
- **Notifications:** Opt-in for daily reminders or weekly digests to encourage consistent journaling.
- **Firebase Authentication:** Secure sign-in and out, with the ability to edit your profile and delete your account.
- **Multi-language Support:** UI and content available in several languages.

## 📦 Installation

To get started, clone this repository and install dependencies:

```bash
git clone https://github.com/Shadowina/Aurea.git
cd Aurea

# Using npm
npm install

# Or using yarn
yarn install
```

### 🔑 Environment Variables

You need a Firebase project. Copy `.env.example` to `.env` and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
...
```

## 🏃 Usage

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser at [http://localhost:5173](http://localhost:5173) (*default Vite port*).

## 🗂️ Project Structure

```
src/
  ├── App.jsx                  # Main app router and structure
  ├── main.jsx                 # Application entry point
  ├── context/                 # Auth, Mood, Theme providers
  ├── features/
  │   ├── analytics/           # Mood charts & analytics pages
  │   ├── calendar/            # Calendar heatmap visualization
  │   ├── dashboard/           # Main dashboard and mood log
  │   ├── gallery/             # Journal entry image gallery
  │   ├── settings/            # User settings and preferences
  ├── components/              # Reusable UI components
  ├── i18n/                    # Internationalization config
  └── index.css                # Main styles (Tailwind CSS)
```

## 🛠️ Tooling

- **Built With:** React, Vite, Tailwind CSS
- **State/Context:** React context providers for Auth, Moods, and Theme
- **Charts:** [Recharts](https://recharts.org/)
- **Authentication & Data:** Firebase
- **Internationalization:** [i18next](https://react.i18next.com/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Linting:** ESLint

## 👩‍💻 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature or fix branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -am "Add amazing feature"`
4. Push to your fork: `git push origin feature/amazing-feature`
5. Open a Pull Request with a description of your changes.


## 🧑‍⚖️ License

Distributed under the MIT License. 

## 🙋‍♀️ Support & Contact

- Open an [issue](https://github.com/Shadowina/Aurea/issues) for bug reports or feature requests.
- Suggestions and contributions are always appreciated!
- Email: ea.obaitan@gmail.com

---

> _Aurea helps you reflect, grow, and see yourself more clearly. Take charge of your mood journey today!_
