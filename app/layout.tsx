import type { Metadata, Viewport } from "next";
import { PwaLifecycle } from "@/components/PwaLifecycle";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import "./globals.css";
import "./phase2.css";
import "./phase3.css";
import "./phase4.css";
import "./phase5.css";
import "./phase6.css";
import "./phase7.css";
import "./journey.css";
import "./v2.css";
import "./phase8.css";
import "./phase9.css";
import "./phase10.css";
import "./phase11.css";
import "./cosmo-studio.css";
import "./bulk-production.css";
import "./pwa-experience.css";
import "./home-dashboard.css";

const deploymentHost=process.env.VERCEL_PROJECT_PRODUCTION_URL??process.env.VERCEL_URL;

export const metadata: Metadata = {
  metadataBase: new URL(deploymentHost?`https://${deploymentHost}`:"http://localhost:3000"),
  title: "Cosmo Quest｜うちゅうをたびしてまなぶAIずかん",
  description: "うちゅうをたびし、ずかんをあつめながらてんもんがくをまなぶゲームがた学習アプリ。",
  applicationName: "Cosmo Quest",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Cosmo Quest",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  openGraph: { title:"Cosmo Quest", description:"うちゅうをたびしてまなぶAIずかん", type:"website", images:["/og.png"] },
  twitter: { card:"summary_large_image", images:["/og.png"] }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#081229",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="ja">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1179x2556.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1206x2622.png" media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1320x2868.png" media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1640x2360.png" media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1668x2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-2048x2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      </head>
      <body>
        <div id="launch-screen" className="launch-screen" role="status" aria-label="Cosmo Questを起動しています"><div className="launch-stars" aria-hidden="true"><i/><i/><i/><i/><i/></div><div className="launch-ship" aria-hidden="true">🚀</div><img src="/icons/icon-192.png" alt=""/><strong>COSMO QUEST</strong><span>EXPLORE THE UNIVERSE</span><div className="launch-progress"><i/></div></div>
        <PwaLifecycle />
        <AppErrorBoundary>{children}</AppErrorBoundary>
      </body>
    </html>
  );
}
