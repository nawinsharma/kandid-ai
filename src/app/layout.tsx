import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthModalProvider } from "@/components/providers/auth-modal-provider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkBird",
  description: "LinkBird application ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Suspense fallback={null}>
            <QueryProvider>
              <AuthProvider>
                <AuthModalProvider>
                  <SidebarProvider>{children}</SidebarProvider>
                </AuthModalProvider>
              </AuthProvider>
            </QueryProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
