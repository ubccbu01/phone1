import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const res = await fetch(
    "https://business-api.tiktok.com/open_api/v1.3/event/track/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": process.env.TIKTOK_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        event_source: "web",
        event_source_id: process.env.TIKTOK_PIXEL_ID,
        data: [
          {
            event: body.event || "ClickButton",
            event_time: Math.floor(Date.now() / 1000),
            page: {
              url: body.url,
            },
            user: {
              user_agent: body.userAgent,
            },
          },
        ],
      }),
    }
  );

  const result = await res.json();
  return NextResponse.json(result);
}
