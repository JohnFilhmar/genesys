import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "GeneSys - Biology Learning Platform",
  description: "Digital Game-Based Learning Module for General Biology",
  manifest: "manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GeneSys",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2A52C0",
};
