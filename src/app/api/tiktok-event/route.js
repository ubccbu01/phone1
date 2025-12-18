import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const payload = {
      event_source: 'web',
      event_source_id: process.env.TIKTOK_PIXEL_ID,
      data: [
        {
          event: 'CompleteRegistration',
          event_time: Date.now(),
          event_id: 'reg_' + Date.now(),
          user: {
            ip: req.headers.get('x-forwarded-for') || '0.0.0.0',
            user_agent: req.headers.get('user-agent'),
          },
          page: {
            url: body?.url || '',
          },
        },
      ],
    };

    const res = await fetch(
      'https://business-api.tiktok.com/open_api/v1.3/event/track/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': process.env.TIKTOK_ACCESS_TOKEN,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
