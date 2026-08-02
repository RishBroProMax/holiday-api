import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-Memory Rate Limiting Cache for DDoS protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Security Configuration
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per window
const WINDOW_MS = 60 * 1000; // 1 minute window

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply Rate Limiting & Security Headers to all /api/ endpoints
  if (pathname.startsWith('/api')) {
    // Extract IP address from request headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'anonymous';

    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (!userLimit || now > userLimit.resetTime) {
      // First request or reset window passed
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + WINDOW_MS
      });
    } else {
      userLimit.count += 1;
      if (userLimit.count > MAX_REQUESTS_PER_WINDOW) {
        // Rate limit exceeded -> Return HTTP 429
        const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: {
              code: 429,
              message: 'Rate limit exceeded (DDoS protection). Max 60 requests/minute.',
              retryAfterSeconds: retryAfter
            }
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfter),
              'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(Math.ceil(userLimit.resetTime / 1000))
            }
          }
        );
      }
    }
  }

  // Create response and attach production security headers
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // CORS Headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.png|OG.png).*)'],
};
