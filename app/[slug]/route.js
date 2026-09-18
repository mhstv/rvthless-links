import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { slug } = params;

  const destination = await kv.get(`link:${slug}`);

  if (!destination) {
    return new NextResponse('Link not found', { status: 404 });
  }

  // Log the click (fire-and-forget style, but we await to keep it simple/reliable)
  const click = {
    ts: Date.now(),
    referer: request.headers.get('referer') || 'direct',
    ua: request.headers.get('user-agent') || 'unknown',
  };

  await Promise.all([
    kv.incr(`clicks:total:${slug}`),
    kv.lpush(`clicks:log:${slug}`, JSON.stringify(click)),
    kv.ltrim(`clicks:log:${slug}`, 0, 499), // keep only the last 500 clicks per link
  ]);

  return NextResponse.redirect(destination, { status: 307 });
}
