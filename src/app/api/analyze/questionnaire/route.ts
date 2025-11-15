import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://7fg18gc3-8000.uks1.devtunnels.ms/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API Proxy] Received questionnaire request:', JSON.stringify(body, null, 2));
    
    // Forward the request to the game-based analysis endpoint for early childhood students
    const response = await fetch(`${API_BASE_URL}/analysis/game-based`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    console.log('[API Proxy] External API response status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const text = await response.text();
        errorData = { error: text || `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('[API Proxy] Error response:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API Proxy] Success response:', data);
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to call questionnaire analysis API' },
      { status: 500 }
    );
  }
}

