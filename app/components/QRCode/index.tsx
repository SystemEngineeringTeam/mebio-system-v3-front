'use client';

import ReactQRCode from 'react-qr-code';

interface Props {
  value: string;
};

export default function QRCode({ value }: Props) {
  return <ReactQRCode value={value} />;
}
