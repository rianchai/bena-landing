  import "./globals.css";
  import Navbar from "../components/Navbar";
  import Footer from "../components/Footer";
  import SafeHydrate from "../components/SafeHydrate";

  export const metadata = {
    title: "BENA Landing Page",
    description: "Playful & Premium Kids Essentials 🌸",
  };

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
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
