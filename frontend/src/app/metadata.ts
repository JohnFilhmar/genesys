import type { Metadata, Viewport } from "next";


export const metadata: Metadata = {
  // --- Basic SEO ---
  applicationName: "GeneSys",
  title: {
    default: "GeneSys - Interactive Biology Learning Platform",
    template: "%s | GeneSys", // Results in "Login | GeneSys"
  },
  description: "A gamified learning module for General Biology designed for Filipino STEM students. Master Genetics, Evolution, and Taxonomy through interactive play.",
  
  // --- Keywords for Search Engines ---
  // Derived from your Research Background and Locale
  keywords: [
    "GeneSys",
    "Biology Game",
    "General Biology",
    "STEM Education",
    "Game-Based Learning",
    "Gamification",
    "Philippine K-12 Curriculum",
    "Puerto Galera National High School", 
    "Genetics",
    "Evolution",
    "Interactive Learning",
    "EdTech Philippines"
  ],

  // --- Authors & Credits ---
  // Full Research Team from
  authors: [
    { name: "Ceniza, Carl John D." },
    { name: "Bacay, Hannah D." },
    { name: "Como, Anne Loraine R." },
    { name: "Delos Santos, Shane L." },
    { name: "Sandoval, Jeny Jane F." },
    { name: "Vinas, Sophia Phoemela M." },
    { name: "STEM 12 Research Team" }
  ],
  creator: "STEM 12 - Galileo Galilei & Thomas Edison", //
  publisher: "Puerto Galera National High School",      //

  // --- Open Graph (Facebook, Discord, LinkedIn, iMessage) ---
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://genesys.vercel.app", // Replace with your actual deployment URL later
    siteName: "GeneSys",
    title: "GeneSys - Master Biology Through Play",
    description: "Join the interactive biology room! A digital game-based learning platform for Senior High School STEM students.",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add this image to your /public folder
        width: 1200,
        height: 630,
        alt: "GeneSys Platform Preview",
      },
    ],
  },

  // --- Twitter Cards (Twitter/X) ---
  twitter: {
    card: "summary_large_image",
    title: "GeneSys - Biology Learning Platform",
    description: "Gamified General Biology for Filipino STEM Students.",
    images: ["/og-image.jpg"], // Reuses the OG image
    creator: "@GeneSysPH", // Optional: if you make a social account
  },

  // --- PWA & Mobile Icons ---
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png" },
    ],
  },
  
  // --- Indexing (Robots) ---
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#2A52C0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};