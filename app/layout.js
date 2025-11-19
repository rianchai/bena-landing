  import "./globals.css";
  import Navbar from "../components/Navbar";
  import Footer from "../components/Footer";
  import SafeHydrate from "../components/SafeHydrate";
  import Script from "next/script";

  export const metadata = {
    title: "BENA Landing Page",
    description: "Playful & Premium Kids Essentials 🌸",
  };

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D23WKVRJ13"
          strategy="afterInteractive"
        />

        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D23WKVRJ13');
          `}
        </Script>

        <body suppressHydrationWarning={true}>
          {/* Wrap semua Client Components di dalam div */}
          <SafeHydrate>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </SafeHydrate>
        </body>
      </html>
    );
  }
