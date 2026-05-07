import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { supabaseMiddleware } from './middleware/supabase';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import transactionRoutes from './routes/transactions';

const app = new Hono();

const localHost = process.env.LOCALHOST!;
const appUrl = process.env.APP_URL!;

app.use('/api/*', cors({
  origin: [localHost, appUrl],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

app.use('*', supabaseMiddleware());

const baseUrl = '/api';

app.route(`${baseUrl}/auth`, authRoutes);
app.route(`${baseUrl}/profile`, profileRoutes);
app.route(`${baseUrl}/transactions`, transactionRoutes);

export default app;
