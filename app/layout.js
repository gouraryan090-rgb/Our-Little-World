import "./globals.css";
import { Sora, Inter, Playfair_Display } from "next/font/google";
import SmoothScroll from "../components/SmoothScroll";
import Providers from "./providers";
import MaintenanceGuard from "../components/MaintenanceGuard";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-accent",
  style: ["italic", "normal"],
});

export const metadata = {
  title: "Our Little World",
  description: "A private space for us.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="font-body">
        <Providers>
          <MaintenanceGuard />
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}