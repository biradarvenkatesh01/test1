import { getAuth } from '@clerk/express';

/**
 * Clerk Authentication Verification Middleware
 * Requires the global clerkMiddleware to be mounted first.
 */
export function requireClerkAuth(req, res, next) {
  try {
    // If authUserId is already populated (e.g. in testing environments), proceed directly
    if (req.authUserId) {
      return next();
    }
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'A valid Clerk authentication session token is required.'
      });
    }
    req.authUserId = auth.userId;
    next();
  } catch (err) {
    console.error('Clerk Auth Verification Error:', err);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Failed to verify Clerk authentication token.'
    });
  }
}
