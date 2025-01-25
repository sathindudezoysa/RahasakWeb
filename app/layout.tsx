import "./globals.css";
import { Roboto } from "next/font/google";
import MiddleWare from "./lib/middleware";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <MiddleWare />

        {children}
      </body>
    </html>
  );
}
