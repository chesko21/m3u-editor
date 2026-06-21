import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
  }

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    };

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers,
    });

    const finalUrl = response.url;
    console.log('Final URL after redirect:', finalUrl);

    if (!response.ok) {
      if (response.status === 403) {
        const retryResponse = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            ...headers,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
          },
        });

        if (retryResponse.ok) {
          const data = await retryResponse.text();
          return new NextResponse(data, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          });
        }

        const urlObj = new URL(url);
        if (urlObj.hostname === 'rebrand.ly') {
          const rebrandResponse = await fetch(`https://rebrand.ly/api/v1/links?url=${encodeURIComponent(url)}`, {
            headers: {
              'apikey': 'c2543b2c2e6140d786558c88f3c47a63',
              'User-Agent': headers['User-Agent'],
            },
          });

          if (rebrandResponse.ok) {
            const rebrandData = await rebrandResponse.json();
            if (rebrandData.length > 0 && rebrandData[0].destination) {
              const destinationUrl = rebrandData[0].destination;
              const destResponse = await fetch(destinationUrl, {
                redirect: 'follow',
                headers,
              });
              if (destResponse.ok) {
                const data = await destResponse.text();
                return new NextResponse(data, {
                  headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                  },
                });
              }
            }
          }
        }
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const data = await response.text();
    
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType.includes('text/html') ? 'text/plain; charset=utf-8' : contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}