import type { Metadata } from "next";
import { Geist } from 'next/font/google';
import { Toaster } from 'sonner';
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Kosh | Web-Based Crypto Wallet",
  description: "A secure, non-custodial web wallet for managing your digital assets and interacting with the  blockchain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1E1B2E',
              border: '0.5px solid #2E2A45',
              color: '#E2DCFF',
            },
          }}
        />
      </body>
    </html>
  );
}
