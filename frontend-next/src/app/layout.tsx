import './globals.css';
import React from 'react';

export const metadata = { title: 'MRP Portal', description: 'Material Resource Planning' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><div className="container">{children}</div></body>
    </html>
  );
}
