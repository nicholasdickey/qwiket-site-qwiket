import "regenerator-runtime/runtime"

import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux'
import Root from 'window-or-global'
import { connect } from 'react-redux'
import chalk from "chalk"
//import Router from "next/router";
import { withRouter } from 'next/router';
import parseCommonRoute, { getSel } from "../qwiket-lib/lib/parseCommonRoute";
import { fetchApp, dispatchSession, fetchColumns } from '../qwiket-lib/lib/ssrParams'
import { parseLayout } from '../qwiket-lib/lib/layout';
import { Common } from '../components/common'
import Landing from '../components/landing'
import u from '../qwiket-lib/lib/utils'
import nextReduxWrapper from "next-redux-wrapper";

class Channel extends React.Component {
    static async getInitialProps({ asPath, pathname, store, isServer, req, res, query }) {
        //  console.log({ isServer }, "getInitialProps ***********************************************************************", { query })
        if (isServer && req) {
            Root.host = req.headers.host;
            Root.__SERVER__ = true
            Root.__CLIENT__ = false;

        }
        else {
            // console.log("dbb CLIENT INIT", store.getState().queues.toJS(), Date.now())
            Root.__WEB__ = true;
            Root.__CLIENT__ = true;

        }
        let { code, appid, utm_source, utm_medium } = query;
        const path = req ? req.url : asPath;
        //  console.log("PATH:", { path, hasReq: req ? 1 : 0, query, pathname: asPath })
        //console.log({ store, isServer, query })
        // let props = path ? parseCommonRoute(path) : { qparams: Object.assign(query, { route: {}, path: req ? req.url : location.href }), nothing: true, path: req ? req.url : location.href };
        let params = query;//props.qparams;
        // console.log("QUERY:", { params })
        let sel = query.sel;
        //  console.log("sel", sel)
        let { channel, q, solo } = params;
        if (!sel)
            sel = "newsline"
        params.sel = sel;
        if (Root.__CLIENT__) {
            let api = Root.qparams ? Root.qparams.newItemsNotificationsAPI : qparams ? qparams.newItemsNotificationsAPI : null;
            // console.log("Updating Root.qparams", { params, api })
            Root.qparams = params;
            if (api)
                Root.qparams.newItemsNotificationsAPI = api;
        }
        // console.log({ props })

        //  console.log("fetchApp args", { channel, q, solo, code, appid, sel, utm_source, utm_medium })
        let force = false;
        if (Root.__SERVER__)
            await fetchApp({ req, store, channel, q, solo, code, appid, utm_source, utm_medium });
        else {

            let state = store.getState()
            let app = state.app;
            let app_channel = app.get("channel").get("channel");

            if (params.channel != app_channel) {
                console.log("CHANNEL CHANGED!", params.channel, app_channel, app.toJS());
                force = true;
                await fetchApp({ req, store, channel: params.channel, q, solo, code, appid, utm_source, utm_medium });
            }
        }
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
            let user = state.user;
            let { layout, selectors } = parseLayout({ qparams: params, app, session, pageType: sel, user });
            //  console.log("layout:", sel, layout)
            let width = u.getLayoutWidth({ session })
            let widthSelector = `w${width}`;
            //  console.log("## ## ## ", { width, widthSelector })

            if (layout.layoutView[widthSelector])
                columns = layout.layoutView[widthSelector].columns;
            if (!req) {
                //let props = this.props;
                params.url = window.location;
                // console.log("client side app:", app ? app.toJS() : {})
            }
            //  console.log("after fetchApp", columns, params)
            if (Root.__SERVER__)
                await fetchColumns({ columns, store, query: params, app, req, force });
            else
                fetchColumns({ columns, store, query: params, app, req, force });
            console.log("dbb DONE WITH FETCH", Date.now())
        }
        else if (req) {
            console.log("LANDING");
            let state = store.getState()
            let session = state.session;
            if (req.session && req.session.options && req.session.options[`loginRedirect`]) {
                let redirect = req.session.options[`loginRedirect`];
                req.session.options[`loginRedirect`] = '';
                let state = store.getState()
                let app = state.app;
                let cookie = app.get("cookie");
                let identity = cookie.get("identity");
                let anon = cookie.get("anon")
                //   console.log(chalk.cyan.bold("COOKIE"), { cookie, identity, anon });
                if (res) {
                    //  console.log(chalk.cyan.bold("REDIRECTING 302", redirect));
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
        console.log("dbb Channel:getInitialProps done", params, Date.now())

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
        /*  if (qparams && qparams.url && qparams.url.indexOf('logout') >= 0) {
              //  console.log("+++LOGOUT !!!!");
              const as = `/channel/${channelName}`
              const href = `/channel?channel=${channelName}`
              Router.replace(href, as);
          } */

    }
    shouldComponentUpdate(nextProps) {
        //  console.log("channel shouldComponentUpdate", nextProps.qparams)
        let props = this.props;
        let contextChanged = props.context != nextProps.context;
        let appChanged = props.app != nextProps.app;
        let qparamsChanged = props.qparams != nextProps.qparams;
        let queuesChanged = props.queues != nextProps.queues;
        let sessionChanged = props.session != nextProps.session;
        let userLayoutChanged = props.session.get('userLayout') != nextProps.session.get('userLayout');
        let selChanged = props.qparams.sel != nextProps.qparams.sel || props.qparams.channel != nextProps.qparams.channel

        //  console.log("dbb CHANNEL shouldComponentUpdate", { session: props.session.toJS(), nextSession: nextProps.session.toJS(), contextChanged, appChanged, qparamsChanged, queuesChanged, sessionChanged, userLayoutChanged, selChanged })
        return qparamsChanged || userLayoutChanged || selChanged;
    }
    render() {
        let { app, qparams, context, user } = this.props;
        if (Root.__CLIENT__ && Root.qparams)
            qparams = Root.qparams;
        let channelName = app.get("channel").get("channel");
        // console.log("dbb RENDER CHANNEL", qparams, Date.now())
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
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(Channel)
