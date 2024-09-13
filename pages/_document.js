// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { getConfig } from '../config/privateLabel'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const config = getConfig(ctx.req.headers.host)
    return { ...initialProps, config }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href={this.props.config.favicon} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument