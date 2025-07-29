import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";

import "./globals.css";
import "./properties.css";
import "flag-icons/css/flag-icons.min.css";


const DMSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Pokédex",
    icons: {
        icon: [{ rel: "icon", url: "/images/favicon.png" }]
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: "cover",
    themeColor: 'oklch(20.8% .042 265.755)',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body
                className={`${DMSans.variable} antialiased bg-gray-50`}
                style={{ fontFamily: `var(--font-dm-sans)` }}
            >
                {children}
            </body>
        </html>
    );
}
