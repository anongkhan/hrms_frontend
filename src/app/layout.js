import "./globals.css";
import { Noto_Serif } from "next/font/google";

const notoSerif = Noto_Serif({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
});


export default function RootLayout({ children }) {
  return (
    <html lang="lo" className={notoSerif.variable}>
      <body className="antialiased bg-gray-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
