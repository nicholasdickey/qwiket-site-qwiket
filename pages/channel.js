import "regenerator-runtime/runtime"

import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux'
import Root from 'window-or-global'
import { connect } from 'react-redux'
import chalk from "chalk"
import Router from "next/router";
import parseCommonRoute, { getSel } from "../qwiket-lib/lib/parseCommonRoute";
import { fetchApp, dispatchSession, fetchColumns } from '../qwiket-lib/lib/ssrParams'
import { parseLayout } from '../qwiket-lib/lib/layout';
import { Common } from '../components/common'
import Landing from '../components/landing'

class Channel extends React.Component {
    static async getInitialProps({ store, isServer, req, res, query }) {
        console.log(isServer, "**********************************************************************************************")
        if (isServer && req) {
            Root.host = req.headers.host;
            Root.__SERVER__ = true
            Root.__CLIENT__ = false;

        }
        else {
            console.log("CLIENT INIT")
            Root.__WEB__ = true;
            Root.__CLIENT__ = true;
        }
        let { code, appid, utm_source, utm_medium } = query;
        const path = req ? req.url : location.href;
        console.log("PATH:", path, '====================================>')
        //console.log({ store, isServer, query })
        let props = path ? parseCommonRoute(path) : { qparams: Object.assign(query, { route: {}, path: req ? req.url : location.href }), nothing: true, path: req ? req.url : location.href };
        let params = props.qparams;
        let sel = params.route.qroute;
        console.log("sel", sel)
        let { channel, q, solo } = params;
        if (!sel)
            sel = "newsline"
        params.sel = sel;
        console.log({ props })

        console.log("fetchApp args", { channel, q, solo, code, appid, sel, utm_source, utm_medium })
        await fetchApp({ req, store, channel, q, solo, code, appid, utm_source, utm_medium });
        let columns = null;
        if (req) {
            await dispatchSession({ req, store });
            params.url = req.url;
            // query.path = req.path;
        }
        else {
            // query.path = window.location.href;
        }
        if (channel != 'landing') {
            let state = store.getState()
            let app = state.app;
            let session = state.session;
            let layout = parseLayout({ app, session, pageType: sel });
            console.log("layout:", sel, layout)
            let width = +session.get('width');
            if (width > 900 && width < 1200)
                width = 900;
            else if (width > 1200 && width < 1800)
                width = 1200;
            else if (width > 1800 && width < 2100)
                width = 1800
            else width = 2100;
            let widthSelector = `w${width}`;
            console.log({ width, widthSelector })
            columns = layout.layoutView[widthSelector].columns;

            if (!req) {
                //let props = this.props;
                params.url = window.location;
                console.log("client side app:", app ? app.toJS() : {})
            }
            //  console.log("after fetchApp", columns)

            await fetchColumns({ columns, store, query: params, app, req });
        }
        else if (req) {
            console.log("LANDING");
            let state = store.getState()
            let session = state.session;
            if (req.session.options[`loginRedirect`]) {
                let redirect = req.session.options[`loginRedirect`];
                req.session.options[`loginRedirect`] = '';
                let state = store.getState()
                let app = state.app;
                let cookie = app.get("cookie");
                let identity = cookie.get("identity");
                let anon = cookie.get("anon")
                console.log(chalk.cyan.bold("COOKIE"), { cookie, identity, anon });
                if (res) {
                    console.log(chalk.cyan.bold("REDIRECTING 302", redirect));
                    const maxAge = 24 * 3600 * 30 * 1000 * 100;
                    res.cookie('_ga', 'GA1.2.' + identity, { maxAge, sameSite: 'Lax' });
                    res.cookie('qid', identity, { maxAge, sameSite: 'Lax' });
                    res.cookie('identity', identity, { maxAge, sameSite: 'Lax' });
                    res.cookie('anon', anon, { maxAge, sameSite: 'Lax' });
                    res.writeHead(302, {
                        Location: redirect
                    })
                    res.end()
                }
            }


        }
        // console.log("after fetchColumns", columns)
        /*
        const cookie = Immutable.fromJS(json.cookie ? json.cookie : {});
        console.log({ cookie });
        const identity = cookie.get("identity");
        const anon = cookie.get("anon");
        req.res.cookie('identity', identity, { maxAge, sameSite: 'Lax' })
        req.res.cookie('anon', anon, { maxAge, sameSite: 'Lax' })
        console.log("SET COOKIE ", { identity, anon }) */
        return {
            qparams: params
        }
    }
    /*
        componentDidMount() {
            this.timer = this.props.startClock()
        }
     
        componentWillUnmount() {
            clearInterval(this.timer)
        }*/

    componentDidMount() {
        const { app, qparams, context, user } = this.props;
        let channelName = app.get("channel").get("channel");
        // console.log("+++CLIENT")
        if (qparams.url.indexOf('logout') >= 0) {
            console.log("+++LOGOUT !!!!");
            const as = `/channel/${channelName}`
            const href = `/channel?channel=${channelName}`
            Router.replace(href, as);
        }

    }

    render() {
        const { app, qparams, context, user } = this.props;
        let channelName = app.get("channel").get("channel");
        //  console.log("channel+++", { qparams, channelName, RootC: Root.__CLIENT__ })
        if (channelName && channelName == 'landing') {

            return <Landing />
        }

        /* let qwiket = Immutable.fromJS({
             title: 'Test Title',
             description: "Test Description",
             image: "",
             definedTags: {
                 'publication': {
                     name: 'Test Publication',
                     shortname: 'testpublication'
                 }, 'author': {
                     name: 'Test Auhtor',
                     shortname: 'testauthor'
                 }
             },
             extraTags: [],
             published_time: 0
         }) */
        let qwiket = context ? context.get("topic") : {};
        let channel = app.get("channel");
        // console.log("qwiket", { qwiket })
        const PageTitle = styled.div`
        display:flex;
        justify-content:center;
        margin-top:20px;
        font-family: Playfair Display !important;
        font-size:5rem;
       `;
        const PageWrap = styled.div`
        display:flex;
        flex-direction:column;
        align-items:center;
       `;
        const QwiketViewWrap = styled.div`
            width:20%;
       `;

        return <Common qparams={qparams} />
    }
}
function mapStateToProps(state) {
    return {
        app: state.app,
    };
}

export default connect(
    mapStateToProps,
    null
)(Channel)
