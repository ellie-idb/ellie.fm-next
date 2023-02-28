import '../styles/globals.scss';
import Image from 'next/image';
import type { AppProps } from 'next/app'
import { ThemeProvider, GlobalStyle } from '@react95/core';
import { createGlobalStyle } from 'styled-components'

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
        <div className="fixed z-10">
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}

export default MyApp
