import "./globals.css";
import { Inter, Noto_Sans_Lao } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-inter",
});

const notoSansLao = Noto_Sans_Lao({
  subsets: ["lao"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-noto-sans-lao",
});

export default function RootLayout({ children }) {
  return (
    <html lang="lo" className={`${inter.variable} ${notoSansLao.variable}`}>
      <body className="antialiased bg-gray-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
