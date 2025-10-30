# Task Manager App

A full-stack mobile task management application with analytics dashboard built using React Native and PostgreSQL.

## Features

- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Task Completion**: Interactive checkbox interface with visual feedback
- ✅ **Analytics Dashboard**: View progress with charts and statistics
- ✅ **7-Day Trends**: Track your productivity over the last week
- ✅ **Dark Mode Support**: Automatic theme detection
- ✅ **Real-time Updates**: Instant synchronization with PostgreSQL database
- ✅ **Timestamps**: Automatic creation and update time tracking

## Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- react-native-chart-kit (Data visualization)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- PostgreSQL
- node-postgres (pg)

## Project Structure

```
ToDoApp/
├── backend/                 # Node.js backend
│   ├── server.js           # Express server with API endpoints
│   ├── db.js               # PostgreSQL connection
│   ├── initDatabase.js     # Database schema initialization
│   └── package.json        # Backend dependencies
│
├── ToDoApp/                # React Native frontend
│   ├── app/
│   │   └── (tabs)/
│   │       ├── index.tsx   # Tasks screen
│   │       ├── stats.tsx   # Statistics screen
│   │       └── _layout.tsx # Tab navigation
│   ├── api/
│   │   └── todoAPI.ts      # API client
│   └── package.json        # Frontend dependencies
│
└── RESUME_PROJECT_DESCRIPTION.md  # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=todoapp
DB_PASSWORD=your_password_here
DB_PORT=5432
PORT=3000
```

4. Create the database in PostgreSQL:
```sql
CREATE DATABASE todoapp;
```

5. Initialize the database schema:
```bash
npm run init-db
```

6. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the mobile app directory:
```bash
cd ToDoApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npx expo start
```

4. Run on Android/iOS:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app for physical device

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all tasks |
| GET | `/api/todos/:id` | Get specific task |
| POST | `/api/todos` | Create new task |
| PUT | `/api/todos/:id` | Update task |
| DELETE | `/api/todos/:id` | Delete specific task |
| DELETE | `/api/todos` | Delete all tasks |
| GET | `/api/stats` | Get statistics and analytics |

## Database Schema

```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  text VARCHAR(500) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

1. **Adding Tasks**: Type in the input field and click "Add"
2. **Completing Tasks**: Tap the checkbox to mark as complete
3. **Editing Tasks**: Tap on the task text to edit
4. **Deleting Tasks**: Tap the "Delete" button
5. **View Statistics**: Switch to the "Statistics" tab for analytics
6. **Pull to Refresh**: Pull down to refresh task list

## Screenshots

### Tasks Screen
- Task list with checkboxes
- Timestamps for each task
- Edit and delete functionality

### Statistics Screen
- Overall completion rate
- 7-day task creation trends
- Daily breakdown
- Progress charts

## Development

### Running Backend in Development Mode
```bash
cd backend
npm run dev
```

### Running Frontend in Development Mode
```bash
cd ToDoApp
npx expo start
```

## Contributing

Feel free to fork this project and submit pull requests!

## License

MIT

## Author

Kshitiz Sharma

## Acknowledgments

- Built with React Native and Expo
- Charts powered by react-native-chart-kit
- Database: PostgreSQL
