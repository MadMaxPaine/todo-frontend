
import { StoreProvider } from "../stores/Context";
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "ToDo Next App",
  description: "A simple ToDo app built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
