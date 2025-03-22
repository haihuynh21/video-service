import { Context, Next } from 'hono';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token logic here
    // For now just check if token exists
    if (!token) {
      throw new Error('Invalid token');
    }
    
    // Add user info to context
    c.set('user', { id: 1, role: 'admin' });
    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
}
