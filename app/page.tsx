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
