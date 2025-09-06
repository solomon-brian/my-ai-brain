import "../styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("myaibrain_theme") || "light";
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  return (
    <>
      <Head>
        <title>My AI Brain | Your Second Brain</title>
        <meta name="description" content="Your second brain. Powered by AI." />
        
        {/* --- INSIGNIA INTEGRATION --- */}
        {/* This section now points to your official icon set. */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" /> 
        {/* theme-color should match your manifest */}

      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;