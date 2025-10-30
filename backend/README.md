# ToDoApp Backend - Railway Deployment

## Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Kshitiz0809/TaskManagerApp)

### Steps:

1. Click the button above
2. Sign in with GitHub
3. Configure environment variables:
   - `DB_USER` - PostgreSQL username
   - `DB_HOST` - PostgreSQL host
   - `DB_NAME` - Database name (todoapp)
   - `DB_PASSWORD` - Database password
   - `DB_PORT` - Database port (5432)
   - `PORT` - Server port (3000)

4. Add PostgreSQL database:
   - Click "New" → "Database" → "PostgreSQL"
   - Copy connection details to environment variables

5. Deploy automatically!

Your backend will be live at: `https://your-app-name.up.railway.app`

## Local Development

```bash
npm install
npm run init-db
npm run dev
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/stats` - Get statistics
