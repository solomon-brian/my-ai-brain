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
        <meta name="description" content="Your second brain. Capture thoughts and use AI to analyze your own data." />
        <link rel="icon" href="/icons/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;