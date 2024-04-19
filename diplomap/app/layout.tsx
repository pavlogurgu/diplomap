import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton  } from '@clerk/nextjs'
import NavBar from "@/components/ui/side-nav";



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
