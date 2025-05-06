import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import FooterBar from "../components/FooterBar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Study platform",
  description: "Very user friendly Study platform powered by with IA",
};

export default function RootLayout({ children }) {
  return (
    <>
      <NavBar />
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
      <FooterBar />
    </>
  );
}
