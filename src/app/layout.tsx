import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import "./globals.css";

const geist = Geist({ 
  variable: "--font-geist",
  subsets: ["latin"] 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono",
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "SproutSense - Early Learning Signal Detector",
  description: "Professional early learning assessment platform helping educators and parents identify learning patterns through evidence-based assessments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "oklch(0.65 0.22 250)",
          colorBackground: "oklch(0.12 0 0)",
          colorInputBackground: "oklch(0.15 0 0)",
          colorInputText: "oklch(0.98 0 0)",
          colorText: "oklch(0.98 0 0)",
          colorTextSecondary: "oklch(0.85 0 0)",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist)",
        },
        elements: {
          userButtonPopoverCard: "bg-card/95 border-border backdrop-blur-xl shadow-2xl",
          userButtonPopoverMain: "bg-transparent",
          userButtonPopoverActionButton: "text-white hover:bg-white/10 transition-colors rounded-lg",
          userButtonPopoverActionButtonText: "text-white font-medium",
          userButtonPopoverActionButtonIcon: "text-white",
          userButtonPopoverUserPreview: "border-b border-border/50 pb-4 mb-4",
          userButtonPopoverUserPreviewText: "text-white font-medium",
          userButtonPopoverUserPreviewSecondaryIdentifier: "text-white/80 text-sm",
          userButtonPopoverFooter: "hidden",
          userButtonPopoverFooterPages: "hidden",
          userButtonPopoverHeader: "hidden",
        },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${geist.variable} ${geistMono.variable} antialiased font-sans`} suppressHydrationWarning>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
