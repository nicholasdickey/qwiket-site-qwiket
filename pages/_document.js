
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components'
import { ServerStyleSheets } from '@material-ui/styles';
import theme from '../views/theme';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const styledComponentsSheet = new ServerStyleSheet()
        const materialSheets = new ServerStyleSheets()
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: App => props => styledComponentsSheet.collectStyles(materialSheets.collect(<App {...props} />))
            })
            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <React.Fragment>
                        {initialProps.styles}
                        {materialSheets.getStyleElement()}
                        {styledComponentsSheet.getStyleElement()}
                    </React.Fragment>
                )
            }
        } finally {
            styledComponentsSheet.seal()
        }
    }

    render() {

        return (

            <html>
                <meta name="trademark" content="QWIKET: THE INTERNET OF US" />

                <meta name="values" content="QWIKET: AN AMERICAN COMPANY WITH AMERICAN VALUES == FREEDOM OF SPEECH, FREEDOM OF ASSOCIATION, TOLERANCE TO DISSENT, SELF-GOVERNANCE " />

                <meta name="why" content="DONT THREAD ON ME" />

                <meta name="mission" content="SPEECH, RELIGION AND GUN CONTROLS ARE EXPLICITLY OUTLAWED IN THE UNITED STATES CONSTITUTION" />

                <meta name="mission" content="WRESTING CONTROL OVER THE NEWS AND VIEWS FROM THE BIG TECH GLOBAL TOTALITARIANS, ONE HEADLINE, ONE COMMENT AT A TIME" />

                <Head>
                    <meta property="fb:app_id" content="358234474670240" />

                    <meta charSet="utf-8" />
                    {/* Use minimum-scale=1 to enable GPU rasterization */}
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    {/* PWA primary color */}
                    <meta
                        name="theme-color"
                        content={theme.palette.primary.main}
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

export default MyDocument;