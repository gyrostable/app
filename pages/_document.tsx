import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            property="og:description"
            content="Gyroscope: an asset-backed stablecoin built on resilient DeFi infrastructure leveraging a diversified reserve, autonomous monetary policy, and innovative AMMs"
          />
          <meta name="title" property="og:title" content="Gyroscope Protocol" />
          <meta
            name="keywords"
            content="stablecoin, algorithmic, crypto, blockchain, DeFi, decentralized finance, ethereum"
          />
          <meta name="type" property="og:type" content="website" />
          <meta
            name="image"
            property="og:image"
            content="https://lh3.googleusercontent.com/drive-viewer/AJc5JmSMlopGzM1Fgr_TClaB5UafLayH-kpGvVwgdJl-SYbByX4F1Iofj_bSEw0lW-YnV4CMyR5n4D4=w3456-h1822"
          />
          <meta
            name="url"
            property="og:url"
            content="https://app.gyro.finance/"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@GyroStable" />
          <meta name="twitter:title" content="Gyroscope UI" />
          <meta
            name="twitter:description"
            content="Gyroscope: an asset-backed stablecoin built on resilient DeFi infrastructure leveraging a diversified reserve, autonomous monetary policy, and innovative AMMs"
          />
          <meta
            name="twitter:image"
            content="https://drive.google.com/file/d/1t_CF_wGtw6zwbWm3F5atPmlphd-fVFi0/view?usp=sharing"
          />
          <link
            rel="preload"
            href="/noi-grotesk/NoiGrotesk-Regular.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
