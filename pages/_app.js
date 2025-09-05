import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* --- This is the current, active line in your code --- */}
        <title>My AI Brain | Your Second Brain</title>
        
        <meta name="description" content="Your second brain. Capture thoughts and use AI to analyze your own data, cutting through the noise to find clarity." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007BFF" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;