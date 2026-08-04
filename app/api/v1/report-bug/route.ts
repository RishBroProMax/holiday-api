import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1534092913942855724/lz2TuEoX92fdULLeo-QVh3I1t3cQzInKK8mtj9_Lmq91piDTWCCHIr-nal50P2zvksEJ';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, reporterEmail, pageUrl } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    const discordEmbed = {
      username: 'Sri Lanka Holiday API - Bug Reporter',
      avatar_url: 'https://holiday.imrishmika.dev/favicon.png',
      embeds: [
        {
          title: `🚨 Bug Report: ${title.slice(0, 200)}`,
          description: description.slice(0, 2000),
          color: 15158332, // Crimson Red (#E74C3C)
          fields: [
            {
              name: '🏷️ Category',
              value: category || 'Unspecified',
              inline: true
            },
            {
              name: '📧 Reporter Email',
              value: reporterEmail ? `\`${reporterEmail}\`` : '*Anonymous*',
              inline: true
            },
            {
              name: '🌐 Source Page',
              value: pageUrl ? `\`${pageUrl}\`` : 'Web Client',
              inline: true
            }
          ],
          footer: {
            text: '🇱🇰 Sri Lankan Holiday API • Automatic Discord Webhook Alert'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordEmbed)
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error('Discord Webhook Error:', errText);
      return NextResponse.json(
        { success: false, error: 'Failed to deliver bug report to Discord server.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bug report successfully sent to developers via Discord!'
    });
  } catch (err: any) {
    console.error('Report Bug Endpoint Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
