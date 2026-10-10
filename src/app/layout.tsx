import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIDE — This Too Shall Pass | AI Emotional Support Companion",
  description: "Work is stressful. Life is messy. Let's talk. TIDE is your AI companion who listens to your rants, helps you handle difficult days, and even lets you roast your virtual boss. This too shall pass.",
  keywords: ["TIDE", "This too shall pass", "emotional support", "AI companion", "office wellness", "stress management", "burnout help"],
  openGraph: {
    title: "TIDE — This Too Shall Pass | AI Emotional Support Companion",
    description: "Work is stressful. Life is messy. Let's talk. This too shall pass.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased grain-overlay">
        {children}
      </body>
    </html>
  );
}
