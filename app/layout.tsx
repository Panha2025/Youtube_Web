import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Polika",
    template: "%s | Polika"
  },
  description: "Polika recipe videos, cooking tutorials, and homemade dishes.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "Polika",
    description: "Browse Polika recipe videos, search dishes, and watch cooking tutorials.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
