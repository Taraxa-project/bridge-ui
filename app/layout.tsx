import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "../components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taraxa Bridge",
  description: "Bridge for Taraxa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="relative flex flex-col">
            <Navbar />
            <main className="flex-grow mt-20">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
