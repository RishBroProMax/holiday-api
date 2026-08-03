import { NextResponse } from 'next/server';
import holidayData from '@/data/holidays.json';

const holidaysList: any[] = (holidayData as any).holidays || [];

export async function GET() {
  const colomboDateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' });
  const todayTime = new Date(`${colomboDateStr}T00:00:00+05:30`).getTime();

  // Filter future Poya days
  const futurePoyas = holidaysList.filter(h => {
    const isPoya = h.type === 'buddhist' || h.name.toLowerCase().includes('poya');
    const hTime = new Date(`${h.date}T00:00:00+05:30`).getTime();
    return isPoya && hTime >= todayTime;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const nextPoya = futurePoyas[0] || null;

  let daysUntil = 0;
  if (nextPoya) {
    const pTime = new Date(`${nextPoya.date}T00:00:00+05:30`).getTime();
    daysUntil = Math.ceil((pTime - todayTime) / (1000 * 60 * 60 * 24));
  }

  return NextResponse.json({
    success: true,
    apiVersion: '3.0.0-beta',
    data: nextPoya ? {
      ...nextPoya,
      daysUntil
    } : null,
    meta: {
      timezone: 'Asia/Colombo',
      checkedDate: colomboDateStr
    }
  });
}
