import React from 'react';
import { Provider } from 'react-redux'
import App from 'next/app';
import Head from 'next/head';
import Immutable from 'immutable'
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRedux from 'next-redux-wrapper'
import { initStore } from '../qwiket-lib/store'
import theme from '../views/theme';

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        //  console.log({ ctx })

        return {
            pageProps: Component.getInitialProps
                ? await Component.getInitialProps(ctx)
                : {}
        }
    }
    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps, store } = this.props;
        let meta = store && store.getState() && store.getState().app && store.getState().app.get ? store.getState().app.get("meta") : null;
        if (meta)
            meta = meta.toJS();
        else
            meta = {};
        console.log("RENDER APP:", { meta })
        return (
            <div>
                <Head>
                    <link rel="canonical" href={meta.canonical} />
                    <meta property="comment" content="NOT FACEBOOK meta share" />
                    <meta property="ua" content={meta.ua} />
                    {meta.image_width ? <meta property="og:image:width" content={meta.image_width} /> : null}
                    {meta.image_height ? <meta property="og:image:height" content={meta.image_height} /> : null}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={meta.title} />
                    <meta name="description" content={meta.description ? meta.description : ''} />
                    <meta property="og:description" content={meta.description ? meta.description : ''} />
                    <meta property="og:site_name" content={meta.site_name} />
                    <meta property="og:url" content={meta.url} />
                    <meta property="og:image" content={meta.image} />
                    <link rel="shortcut icon" type="image/png" href={'/static/css/blue-bell.png'} />
                    <meta property="og:author" content={meta.author} />
                    <meta property="dcterms.replaces" content={meta.link} />
                    <meta property="dcterms.identifier" content={meta.tid} />
                    <meta name="pjax-timeout" content="1000" />
                    <meta name="is-dotcom" content="true" />
                    <meta name="google-site-verification" content="PMhSQkvtt0XVBm8DIMXJiwTkUpMODTShDIAs5q0zGXc" />
                    <meta property="cxid" content={meta.cxid} />
                    <meta property="txid" content={meta.txid} />
                    <meta property="channel" content={meta.channel} />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                    <meta name="msvalidate.01" content="F6078DEB781FF7EEBAAF3723CBE56F5E" />
                    <title>My page</title>

                    <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=995006553995561&autoLogAppEvents=1" > </script>

                    < script async src="https://www.googletagmanager.com/gtag/js?id=UA-85541506-1" > </script>

                    < script dangerouslySetInnerHTML={{
                        __html: ` window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                      
                        gtag('config', 'UA-85541506-1');`
                    }
                    } />
                </Head>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Provider store={store}>
                        <Component {...pageProps} />
                    </Provider>
                </ThemeProvider>
            </div>
        );
    }
}

export default withRedux(initStore.bind(MyApp.route))(MyApp);