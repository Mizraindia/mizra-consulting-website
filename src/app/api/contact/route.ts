import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, email, step } = body;

    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!GOOGLE_SHEETS_URL) {
      console.error('Sheet URL missing');
      return NextResponse.json({ success: true });
    }

    // Prepare Form Data for Google Apps Script
    const formData = new URLSearchParams();
    
    // Always send timestamp
    formData.append('timestamp', new Date().toISOString());
    
    // Step 1 & 2: Always send phone if present
    if (phone) formData.append('phone', phone);
    
    // Step 2: Send name and email if present
    if (name) formData.append('name', name);
    if (email) formData.append('email', email);
    
    // Metadata
    formData.append('step', step ? String(step) : '1');
    formData.append('source', 'social_media_app'); 
    formData.append('sheetName', 'Sheet1'); // Matches your script's dynamic sheet logic

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: formData, // Sends as application/x-www-form-urlencoded
    });

    if (!response.ok) {
      console.error('Sheet Error:', await response.text());
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: true });
  }
}