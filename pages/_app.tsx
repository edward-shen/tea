// tslint:disable-next-line:import-name
import App, { Container } from 'next/app';
import * as React from 'react';

class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render () {
    const { Component, pageProps } = this.props;
    return <Container>
      <Component {...pageProps} />
    </Container>;
  }
}

export default MyApp;
