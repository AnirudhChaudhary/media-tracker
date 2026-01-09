import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mediaRoutes from './routes/media.js';
import searchRoutes from './routes/search.js';
import sportsRoutes from './routes/sports.js';
import teamsRoutes from './routes/teams.js';
import highlightsRoutes from './routes/highlights.js';
import savedHighlightsRoutes from './routes/savedHighlights.js';
import todosRoutes from './routes/todos.js';
import habitsRoutes from './routes/habits.js';
import papersRoutes from './routes/papers.js';
import relationshipsRoutes from './routes/relationships.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/media', mediaRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/highlights', highlightsRoutes);
app.use('/api/saved-highlights', savedHighlightsRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/papers', papersRoutes);
app.use('/api/relationships', relationshipsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Media Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});