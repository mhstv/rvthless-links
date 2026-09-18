import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

function isAuthorized(request) {
  const secret = request.headers.get('x-admin-secret');
  return secret && secret === process.env.ADMIN_SECRET;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slugs = (await kv.smembers('links:all')) || [];

  const stats = await Promise.all(
    slugs.map(async (slug) => {
      const destination = await kv.get(`link:${slug}`);
      const total = (await kv.get(`clicks:total:${slug}`)) || 0;
      const rawLog = await kv.lrange(`clicks:log:${slug}`, 0, 19); // last 20 clicks
      const recent = (rawLog || []).map((entry) => {
        try {
          return JSON.parse(entry);
        } catch {
          return null;
        }
      }).filter(Boolean);

      return { slug, destination, total, recent };
    })
  );

  return NextResponse.json({ stats });
}
