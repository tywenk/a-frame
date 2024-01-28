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
