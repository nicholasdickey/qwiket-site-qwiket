import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import Head from 'next/head';
import Immutable from "immutable"
import LazyLoad from "vanilla-lazyload"
import Root from 'window-or-global'

import Typography from '@material-ui/core/Typography';
import { updateSession, checkAlerts, onlineCount } from '../qwiket-lib/actions/app'
import { fetchShowQwiket } from '../qwiket-lib/actions/context'
import { fetchComments } from '../qwiket-lib/actions/comments'
import { fetchNotifications } from '../qwiket-lib/actions/queue'
import u from '../qwiket-lib/lib/utils'
import Topline from './topline';
import { Layout, InnerGrid } from '../qwiket-lib/components/layout';
import QwiketView from '../components/qwikets/qwiketView'
import Header from './header'
import LayoutView from './layoutView'

export class Common extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.queues = {
            newItemsNotifications: Immutable.fromJS({}),
            commentNotifications: null,
            alerts: []
        }
    }
    newItemsNotificationsAPI() {
        if (this.api)
            return this.api;
        this.api = {
            registerQueue: (({ type, channel, homeChannel, shortname, solo, lastid, qwiketid }) => {
                var queueId = Math.floor(Math.random() * 1000000);
                // console.log("registerQueue", { queueId, type, channel, homeChannel, shortname, solo, lastid, qwiketid })

                this.queues.newItemsNotifications = this.queues.newItemsNotifications.set(queueId, { type, channel, homeChannel, shortname, solo, lastid, qwiketid, test: 0 });
                return queueId;
            }).bind(this),
            unregisterQueue: (({ queueId }) => {
                this.queues.newItemsNotifications = this.queues.newItemsNotifications.delete(queueId);
            }).bind(this),
            registerComment: (({ rootId, nodes, channel, storyId }) => {
                // console.log("registerComment>>")
                this.commentNotifications = { storyId, rootId, nodes, channel, type: 'notif', test: 0 };
            }).bind(this),
            unregisterAllComments: (() => {
                this.commentNotifications = null;
            }).bind(this)
            ,
            updateLastId: (({ queueId, lastid, tail }) => {
                if (!this.queues || !this.queues.newItemsNotifications)
                    return;
                let o = this.queues.newItemsNotifications.get(queueId);
                if (!o)
                    return;
                //console.log("COMMON updateLastId", { queueId, lastid, tail, o })
                o.lastid = lastid;
                o.tail = tail;
                this.queues.newItemsNotifications = this.queues.newItemsNotifications.set(queueId, o);
            }).bind(this)
        }
        return this.api;
    }
    updateDimensions() {
        if (Root.__CLIENT__) {
            let props = this.props;
            const width = props.session.get("width");
            const clientWidth = u.width(null);
            if (width != clientWidth) {
                // props.actions.updateSession({ width: clientWidth });
            }

        }
    }
    componentDidMount() {
        console.log("componentDidMount")
        //window.addEventListener("resize", debounce(this.updateDimensions.bind(this), 1000, { 'leading': true, 'trailing': false, 'maxWait': 1000 }));
        window.goBack = false;
        // this.updateDimensions();
        const props = this.props;
        const { actions, path, router, app, user, qparams } = props;
        let { sel } = qparams;
        let alerts = app.get("alerts");
        let username = user.get("username")

        if (sel == 'context') {
            actions.updateSession({ tPage: 0 });
        }
        let items = alerts ? alerts.get("items") : null;
        let lastid = '';
        if (items) {
            let lastAlert = items.get(0);
            lastid = lastAlert ? lastAlert.get("alertid") : '';
        }
        // actions.checkAlerts({ username, lastid });
        // console.log("registerComment seInterval");
        this.intervalHandler = setInterval(() => {
            // console.log("registerQueue notificationsHandler:", { newItemsNotifications: this.queues.newItemsNotifications.toJS() });
            this.queues.newItemsNotifications.forEach((p, i) => {
                //$$$PROD*   console.log("notif,queue:", { i, p });
                /*$$$PROD */ actions.fetchNotifications(p);
                /*$$$PROD*/   actions.onlineCount();
            });
            // console.log("registerComment CommentsNotifications action", this.commentNotifications)
            if (this.commentNotifications) {
                // console.log("registerComment action")
                actions.fetchComments(this.commentNotifications);
            }
            alerts = app.get("alerts");
            items = alerts ? alerts.get("items") : null;
            let lastid = '';
            if (items) {
                let lastAlert = items.get(0);
                lastid = lastAlert ? lastAlert.get("alertid") : '';
            }
            actions.checkAlerts({ username, lastid });
        }, 10000);

        if (Root.__CLIENT__) {
            //console.log("GA:", path);
            Root.__WEB__ = true;

            if (typeof ga !== 'undefined') {
                ga('set', 'page', path);
                ga('send', 'pageview');
            }
            this.lazyLoadInstance = new LazyLoad({
                elements_selector: ".lazyload"
                // ... more custom settings?
            });

        }

        // console.log("common did mount")

    }
    componentDidUpdate() {
        if (this.lazyLoadInstance) {
            this.lazyLoadInstance.update()
        }
    }
    componentWillUnmount() {
        // window.removeEventListener("resize", this.updateDimensions);
        if (this.intervalHandler) {
            clearInterval(this.intervalHandler)
        }
    }
    componentWillReceiveProps(nextProps) {
        const props = this.props;
        const { actions, session, globals, qparams: params, sel, path } = props;
        let nparams = nextProps.qparams;
        if (!params || !nparams)
            return;
        const width = u.width(globals);
        const channel = params && params.channel ? params.channel : 'qwiket';
        /* if (nparams && channel != globals.get("channel")) {
             actions.fetchApp(nparams.channel);
             props.actions.setGlobals(globals.set("channel", channel));
         }*/
        //   console.log("CommonPage componentWillReceiveProps", { nthreadid: nparams.threadid, threadid: params.threadid, width })
        if (nparams.threadid != params.threadid || nparams.shortname != params.shortname) {
            actions.updateSession({ tPage: 0 })
            //console.log("CommonPage o=",o);
            /*$$$ if (Root.__CLIENT__) {
                 console.log("2GA:", path);
                 ga('set', 'page', path);
                 ga('send', 'pageview');
             }*/
        }
        /*if(!nextProps.os.get("articles")||nextProps.os.get("articles").length==0){
          const categoryXid=nextProps.cs.get("community_category_xid");
          nextProps.actions.fetchCatArticles(categoryXid);
        }*/
        if (nparams.rootThreadid != params.rootThreadid || nparams.qwiketid != params.qwiketid || nparams.threadid != params.threadid) {
            // console.log('CommonPage componentWillReceiveProps fetchShowQwiket nparams:',nparams)
            const rootThreadid = nparams.rootThreadid ? nparams.rootThreadid : nparams.threadid;
            const qwiketid = nparams.qwiketid ? nparams.qwiketid : nparams.threadid;

            // props.actions.fetchShowQwiket({ rootThreadid, qwiketid, qType: nextProps.qType });
        }
        if (nparams.qwiketid != params.qwiketid) {
            // console.log('CommonPage componentWillReceiveProps fetchShowQwiket nparams:',nparams)
            const rootThreadid = nparams.rootThreadid ? nparams.rootThreadid : nparams.threadid;
            const qwiketid = nparams.qwiketid ? nparams.qwiketid : nparams.threadid;

            props.actions.fetchShowQwiket({ rootThreadid, qwiketid, qType: nextProps.qType });
        }

    }
    render() {
        const { app, qparams, context, user } = this.props;
        let pageType = qparams.sel ? qparams.sel : "newsline";

        // console.log({ user: user.toJS() })
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
        let qwiket = context.get("topic");
        let channel = app.get("channel");
        //  console.log("qwiket", { qwiket })
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
        opacity:${user.get("mask") ? 0.5 : 1.0};
      
       `;
        const QwiketViewWrap = styled.div`
            width:20%;
       `;
        /*
        <Typography variant="h6" gutterBottom>
                                QwiketView:
                        </Typography>
                            <QwiketViewWrap>
                                <QwiketView qwiket={qwiket} qparams={qparams} />
                            </QwiketViewWrap>*/
        /*
        <Typography variant="subtitile2" gutterBottom>CHANNEL: {app.get('channel').get('channelDetails').get('name')}</Typography>*/
        const InnerWrapper = ({ layout }) => <div>
            <Topline layout={layout} />
            <InnerGrid layout={layout}>
                <PageWrap>
                    <Header pageType={pageType} layout={layout} qparams={qparams} />
                    <LayoutView pageType={pageType} layout={layout} qparams={qparams} />
                </PageWrap>
            </InnerGrid>
        </div>;
        return <div> <Layout pageType={pageType}>
            <InnerWrapper /></Layout></div>
    }
}
function mapStateToProps(state) {
    return {
        context: state.context,
        session: state.session,
        user: state.user,
        globals: state.session,
        app: state.app,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            updateSession, fetchShowQwiket, checkAlerts, fetchComments, fetchNotifications, onlineCount
        }, dispatch)
    }
}
Common = connect(mapStateToProps, mapDispatchToProps)(Common);