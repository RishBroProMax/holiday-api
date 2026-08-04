import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1534092913942855724/lz2TuEoX92fdULLeo-QVh3I1t3cQzInKK8mtj9_Lmq91piDTWCCHIr-nal50P2zvksEJ';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, reportType, reporterEmail, pageUrl } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    const isIdea = reportType === 'idea' || category === 'Feature Request';

    const discordEmbed = {
      username: isIdea ? 'Sri Lanka Holiday API - Idea Box' : 'Sri Lanka Holiday API - Bug Reporter',
      avatar_url: 'https://holiday.imrishmika.dev/favicon.png',
      embeds: [
        {
          title: isIdea ? `💡 New Idea: ${title.slice(0, 200)}` : `🚨 Bug Report: ${title.slice(0, 200)}`,
          description: description.slice(0, 2000),
          color: isIdea ? 15844367 : 15158332, // Gold for Ideas (#F1C40F), Crimson Red for Bugs (#E74C3C)
          fields: [
            {
              name: '📌 Submission Type',
              value: isIdea ? '💡 New Idea / Feature Suggestion' : '🐛 Bug / Data Issue',
              inline: true
            },
            {
              name: '🏷️ Category',
              value: category || 'General',
              inline: true
            },
            {
              name: '📧 Reporter / Contact',
              value: reporterEmail ? `\`${reporterEmail}\`` : '*Anonymous*',
              inline: true
            },
            {
              name: '🌐 Source URL',
              value: pageUrl ? `\`${pageUrl}\`` : 'Web Client',
              inline: true
            }
          ],
          footer: {
            text: '🇱🇰 Sri Lankan Holiday API • Discord Real-Time Notification Engine'
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
        { success: false, error: 'Failed to deliver message to Discord.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isIdea ? 'Idea successfully sent to developers via Discord!' : 'Bug report successfully sent to developers via Discord!'
    });
  } catch (err: any) {
    console.error('Report Endpoint Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
