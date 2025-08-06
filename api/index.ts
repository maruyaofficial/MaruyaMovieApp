import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes for serverless
registerRoutes(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}