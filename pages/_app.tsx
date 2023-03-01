import '../styles/globals.scss';
import Image from 'next/image';
import type { AppProps } from 'next/app'
import { ThemeProvider, GlobalStyle } from '@react95/core';
import { computer3Data } from '@react95/icons';
import { createGlobalStyle } from 'styled-components'
import Head from 'next/head';

const CustomGlobalStyle = createGlobalStyle`
  body {
    user-select: none;
    background-color: #000
  }

  img {
    pointer-events: none;
  }
`;


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>ud2.sh</title>
        <meta content="ud2.sh" property="og:site_name" />
        <meta content="ud2.sh" property="og:title" />
        <meta content="Raise invalid opcode exception." property="og:description" />
        <meta content="object" property="og:type" />
        <meta content="https://ud2.sh" property="og:url" />
        <meta content="#37474f" data-react-helmet="true" name="theme-color" />
        <link rel='icon' type='image/x-icon' href={computer3Data['32x32_4'].imageSrc} />
      </Head>
      <ThemeProvider>
        <GlobalStyle />
        <CustomGlobalStyle />
        <div className="fixed w-full h-full z-0">
          <Image
            src='/win_setup_img.png'
            fill={true}
            alt='The Windows 95 Setup image'
            />
        </div>
        <div className="fixed z-10 overflow-hidden">
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}

export default MyApp
