import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DIU Food Review & Rating",
    template: "%s | DIU Food Review",
  },
  description:
    "Rate and review food shops at Daffodil International University. Find the best campus eats.",
  keywords: ["DIU", "food", "review", "rating", "campus", "university"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
