import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { auth } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, childName, results, testDate } = body;

    if (!email || !childName || !results) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the results for email
    const formatScore = (score: number) => {
      if (score >= 80) return `✅ ${score}% (Strong)`;
      if (score >= 60) return `⚠️ ${score}% (Watch)`;
      return `🔴 ${score}% (Concern)`;
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .result-item {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 15px;
              border-left: 4px solid #667eea;
            }
            .result-item h3 {
              margin: 0 0 10px 0;
              color: #667eea;
            }
            .result-item p {
              margin: 5px 0;
            }
            .metric {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .metric-label {
              font-weight: 500;
              color: #666;
            }
            .metric-value {
              font-weight: 600;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .cta {
              text-align: center;
              margin: 30px 0;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌱 SproutSense Assessment Results</h1>
            <p>Early Learning Signal Report for ${childName}</p>
          </div>

          <div class="content">
            <p><strong>Assessment Date:</strong> ${new Date(testDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>

            <h2 style="color: #333; margin-top: 20px;">📊 Assessment Results</h2>

            ${results.map((result: any) => `
              <div class="result-item">
                <h3>${result.domain}</h3>
                <div class="metric">
                  <span class="metric-label">Overall Score:</span>
                  <span class="metric-value">${formatScore(result.score)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Accuracy:</span>
                  <span class="metric-value">${result.metrics.accuracy}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Avg Response Time:</span>
                  <span class="metric-value">${result.metrics.avgResponseTime}ms</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Signal:</span>
                  <span class="metric-value">${result.signal}</span>
                </div>
                ${result.notes ? `<p style="margin-top: 10px; font-style: italic; color: #666;">${result.notes}</p>` : ''}
              </div>
            `).join('')}
          </div>

          <div class="cta">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">
              View Full Dashboard
            </a>
          </div>

          <div class="footer">
            <p><strong>SproutSense - Early Learning Signal Detector</strong></p>
            <p>This is an automated assessment report. Results are for informational purposes only.</p>
            <p>For professional guidance, please consult with a qualified early childhood specialist.</p>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SproutSense <onboarding@resend.dev>',
      to: [email],
      subject: `SproutSense Assessment Results - ${childName}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Email send error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
