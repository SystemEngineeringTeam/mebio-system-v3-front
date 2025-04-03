'use client';

import { QRCodeSVG } from 'qrcode.react';

interface Props {
  value: string;
};

export default function QRCode({ value }: Props) {
  return <QRCodeSVG value={value} />;
}
