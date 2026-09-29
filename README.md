# A Frame in 100 lines (or less)

Farcaster Frames in less than 100 lines, and ready to be deployed to Vercel.

Have fun! ⛵️

## Getting started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env.local` file with your [Neynar](https://neynar.com) API key. The frame route uses it to validate the frame message and look up the cast:
   ```sh
   NEYNAR_API_KEY=your-neynar-api-key
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```

When you deploy to Vercel, add `NEYNAR_API_KEY` as an environment variable in your project settings.

## Files

### `app/page.tsx`

```tsx
import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const frameMetadata = getFrameMetadata({
  buttons: ['Am I a true fan'],
  image: 'https://a-frame-ashen.vercel.app/',
  post_url: 'https://a-frame-ashen.vercel.app/api/frame',
});

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'tywen was here',
  openGraph: {
    title: 'testing',
    description: 'tywen was here',
    images: ['https://a-frame-ashen.vercel.app/'],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>zizzamia.xyz</h1>
    </>
  );
}
```

### `app/layout.tsx`

```tsx
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### `app/api/frame/route.ts`

```ts
import { getFrameAccountAddress } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { CastParamType, NeynarAPIClient, isApiErrorResponse } from '@neynar/nodejs-sdk';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress = '';
  try {
    const body: {
      untrustedData?: {
        fid?: number;
        url?: string;
        messageHash?: string;
        timestamp: number;
        network?: number;
        buttonIndex?: 1;
        castId?: { fid?: number; hash?: string };
      };
      trustedData?: { messageBytes?: string };
    } = await req.json();
    const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string);
    accountAddress = await getFrameAccountAddress(body, {
      NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
    });
    const cast = await client.lookUpCastByHashOrWarpcastUrl(
      body.untrustedData?.castId?.hash as string,
      CastParamType.Hash,
    );
    console.log('the cast!!!', cast);
  } catch (err) {
    if (isApiErrorResponse(err)) {
      console.log('API Error', err.response.data);
    } else {
      console.log('Generic Error', err);
    }
  }

  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="" />
    <meta property="fc:frame:button:1" content="${accountAddress}" />
    <meta property="fc:frame:post_url" content="" />
  </head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
```

## Resources

- [Official Farcaster Frames docs](https://warpcast.notion.site/Farcaster-Frames-4bd47fe97dc74a42a48d3a234636d8c5)
- [Neynar Node.js SDK](https://github.com/neynarxyz/nodejs-sdk)
- [OnchainKit](https://github.com/coinbase/onchainkit)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
