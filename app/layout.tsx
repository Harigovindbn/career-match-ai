import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CareerMatch AI",
    template: "%s | CareerMatch AI",
  },
  description:
    "AI-powered resume analysis, ATS scoring, job matching and career coaching.",
};

// Applies the saved theme before first paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem("career-match-theme")||"dark";if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t!=="light")t="dark";var r=document.documentElement;r.classList.remove("dark","light");r.classList.add(t);r.style.colorScheme=t}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
