import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton  } from '@clerk/nextjs'
import NavBar from "@/components/ui/side-nav";
import Script from 'next/script'


import Header from '@/components/ui/header';
import HeaderMobile from '@/components/ui/header-mobile';
import MarginWidthWrapper from '@/components/ui/margin-width-wrapper';
import PageWrapper from '@/components/ui/page-wrapper';
import SideNav from '@/components/ui/side-nav';



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Diplomap',
    default: 'Diplomap',
  },
  description: "Diplomap App",
};

export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) 

// {
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>
    // <html lang="en">
    //   <body className={inter.className}>{children}</body>
    // </html>
    // </ClerkProvider>


    <ClerkProvider>
    {/* <html lang="en">
      <body>
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
          </SignedIn>
        </header>
        <main>
          <NavBar/>
          {children}
        </main>
      </body>
    </html> */}
 <html lang="en">
  <head>
  <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.3.1/mapbox-gl-directions.css" type="text/css" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js" async ></script>
  <link href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css' rel='stylesheet' />
  <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.3.1/mapbox-gl-directions.js" async ></script>
<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.3.1/mapbox-gl-directions.css" type="text/css" />
    </head>
      <body className={`bg-white${inter.className}`}>
        <div className="flex">
          <SideNav />
          <main className="flex-1">
            <MarginWidthWrapper>
              <Header />
              <HeaderMobile />
              <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
          </main>
        </div>
      </body>
    </html>
  </ClerkProvider>
  );
}
