export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { JetBrains_Mono, Ubuntu_Sans_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/Query-Provider";

import { Toaster } from "@/components/ui/sonner";
import ChatBot from "@/components/Shared/ChatBot";
import Footer from "@/components/Modules/Home/Footer";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jet-brains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ubuntuMono = Ubuntu_Sans_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Censura",
  description: "The Social Media For Reviewing and Rating Everything.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${jetBrainsMono.variable} ${ubuntuMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors position="top-right" />
            <TooltipProvider>
              <main className="flex-1">
                {children}
              </main>
              <ChatBot />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
