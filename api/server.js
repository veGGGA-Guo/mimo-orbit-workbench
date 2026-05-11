import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { generateApplication } from './mimoClient.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    model: process.env.MIMO_MODEL || 'mimo-v2.5-pro',
    mode: process.env.MIMO_API_KEY ? 'live' : 'mock',
  });
});

app.post('/api/generate-application', async (req, res) => {
  try {
    const result = await generateApplication(req.body || {});
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'generation_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`MiMo Orbit Workbench API listening on http://127.0.0.1:${port}`);
});
