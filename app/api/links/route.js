import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

function isAuthorized(request) {
  const secret = request.headers.get('x-admin-secret');
  return secret && secret === process.env.ADMIN_SECRET;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug, destination } = await request.json();

  if (!slug || !destination) {
    return NextResponse.json({ error: 'slug and destination are required' }, { status: 400 });
  }

  // Keep a registry of all slugs so the dashboard can list them
  await kv.sadd('links:all', slug);
  await kv.set(`link:${slug}`, destination);

  return NextResponse.json({ ok: true, slug, destination });
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slugs = await kv.smembers('links:all');
  const links = await Promise.all(
    (slugs || []).map(async (slug) => ({
      slug,
      destination: await kv.get(`link:${slug}`),
    }))
  );

  return NextResponse.json({ links });
}
