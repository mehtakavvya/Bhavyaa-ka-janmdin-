import type { Metadata, Viewport } from "next";
import { Cal_Sans } from "next/font/google";
import "./globals.css";

const calSans = Cal_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "for Bhavyaa",
  description: "To the apple of my eye.",
};

export const viewport: Viewport = {
  themeColor: "#FFFDEF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={calSans.variable}>
      <body>{children}</body>
    </html>
  );
}
