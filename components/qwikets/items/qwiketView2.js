/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/**
  Qwiket 4.0 Navigation Refactoring
  Copyright(c) 2017 Qwiket.com, Nicholas Dickey
  Created By Nicholas Dickey 4/26/2017
**/
//FB:
import React from 'react';
import ReactDom from 'react-dom';
import Link from './link';
import Router from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
;
const microtime = () => (new Date).getTime() | 0
var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//---------------------------------------------------------
//Third party:
//import LoadMask from 'react-load-mask'
import DocumentTitle from 'react-document-title'

//const queryString = require('query-string');
var Markdown = require('react-markdown');
//var Frame = require('react-frame-component');
//import Iframe from 'react-iframe'

var debounce = require('lodash.debounce');


//MATERIAL UI

import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Avatar from '@material-ui/core/Avatar';
import Toggle from '@material-ui/core/Switch';
import ListItem from '@material-ui/core/ListItem';




//Material components:

import indigo from '@material-ui/core/colors/indigo';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import blueGrey from '@material-ui/core/colors/blueGrey';
import teal from '@material-ui/core/colors/teal';
import cyan from '@material-ui/core/colors/cyan';

//Bootstrap:
import { Image } from 'react-bootstrap'

//---------------------------------------------------------
//Qwiket:I4```
//import QS,{QT} from './qtext'
import u from './utils'

import Local from '../qwiket-lib/components/disqus'

import { ArticleView } from './articleView'
//Actions:
import Root from 'window-or-global'

import { BoundQwiket } from './qwiketWrapper';
import { QwiketComment } from '../qwiketComment'
import animateScrollTo from 'animated-scroll-to';

const red900 = red[900];
const green700 = green[700];
const indigo900 = indigo[900];
const blueGrey200 = blueGrey[200];
const blueGrey400 = blueGrey[400];
const amber900 = amber[900];
const cyan600 = cyan[600];
const scrollTop = debounce(() => window.scrollTo(0, 0)/*animateScrollTo(0)*/, 1000, { 'leading': true, 'trailing': false, 'maxWait': 100 });
export class QwiketView extends React.Component {

    constructor(props) {
        //  console.log("BoundTopic constructor")
        super(props);

    }
    componentDidUpdate() {
        try {
            if (Root.__CLIENT__)
                setTimeout(() => { if (window.twttr.widgets) window.twttr.widgets.load(); }, 500);

        }
        catch (x) {
            console.log(x);
        }
    }
    componentWillMount() {

        const props = this.props;
        const { globals, match, context, qparams, communityState, actions, test } = props;
        // const qparams=props.match?props.match.qparams:{};

        const channel = qparams.channel;//globals.get("channel");//u.channel();
        const homeChannel = communityState.get("v51") ? communityState.get("v51").get("channel") : false;
        const threadid = qparams ? qparams.threadid : props.threadid ? props.threadid : '';
        const shortname = qparams ? qparams.shortname : props.shortname ? props.shortname : '';
        const route = qparams ? qparams.route : '';
        console.log("BoundTopic  componentWillMount BoundTopic", { homeChannel, threadid, shortname, channel, qparams })

        //const topic=props.context.get("topic");
        /*if (threadid == '__new') {
          console.log("COMPONENT DID MOUNT")
          actions.updateOpenEditor({ qwiketid: '__new' });
    
        }*/
        if (threadid && !test/*&& context.get("topic").get("threadid") != threadid*/) {
            // if (Root.__CLIENT__)
            //   console.log("BoundTopic <<<componentWillMount fetch threadid:", threadid, { context: context.toJS() });
            actions.fetchContextTopicForThread({ threadid, state: context, community: homeChannel, test });
            // actions.loadQwiketComments({rootThreadid:threadid,qcFirstId:0,qcLastId:0,selectedId:0,channel:homeChannel})
        }
        else if (shortname && route == 'user') {
            //console.log("BoundTopic >>>componentWillMount fetching for shortname", shortname);
            actions.fetchContextTopicForThread({ threadid: shortname, state: context, community: homeChannel, test });
        }
        else if (shortname) {
            //console.log("BoundTopic >>>componentWillMount fetching for shortname", shortname);
            actions.fetchContextTopicForFeed(homeChannel, shortname);
        }


        actions.onlineCount();
    }
    componentDidMount() {
        const props = this.props;
        const { globals, match, qparams, context, communityState, location } = props;

        const channel = qparams.channel;//globals.get("channel");//u.channel();
        const homeChannel = communityState.get("v51") ? communityState.get("v51").get("channel") : false;
        const threadid = qparams ? qparams.threadid : props.threadid ? props.threadid : '';
        const shortname = qparams ? qparams.shortname : props.shortname ? props.shortname : '';

        //console.log("TOPIC2 didmount cc:",qparams.cc)

        // console.log("BoundTopic componentDidMount")
        //console.log(" GA TOPIC MOUNTED location:", location ? location.pathname : '');
        //$$$ setTimeout(() => { ga('set', 'page', location ? location.pathname : ''); ga('send', 'pageview') }, 10)
        // PRODUCTION setTimeout(() => { gtag('config', 'UA-85541506-2', { 'page_path': location ? location.pathname : '' }) }, 10)
        //$$$setTimeout(() => { gtag('config', 'UA-85541506-1', { 'page_path': location ? location.pathname : '' }) }, 10)

        ;
        //if(!qparams.cc&&!qparams.cqid)
        //    topScroll();
        try {
            setTimeout(() => { try { window.twttr.widgets.load() } catch (x) { } }, 500);
            if (window.setTop) {
                window.scrollTo(0, 0);
                window.setTop = false;
            }
        }
        catch (x) {
            console.log(x);
        }
    }


    componentWillReceiveProps(nextProps) {
        //console.log("BoundTopic receive Properties:", nextProps, "this.props:", this.props, " topic:", nextProps.context && nextProps.context.get("topic") ? nextProps.context.get("topic").toJS() : "");
        const props = this.props;
        const state = this.state;
        const context = nextProps.context;
        const globals = props.globals;
        const channel = qparams ? qparams.channel : globals.get("channel");//u.channel();
        const homeChannel = nextProps.communityState.get("v51") ? nextProps.communityState.get("v51").get("channel") : false;

        const { actions, qparams, test } = props;

        const threadid = qparams ? qparams.threadid : props.threadid ? props.threadid : '';
        const shortname = qparams ? qparams.shortname : props.shortname ? props.shortname : '';
        const cc = qparams && qparams.cc ? props.cc : '';


        const nparams = nextProps.qparams;
        // const nparams=nextProps.match?nextProps.match.qparams:{};
        //if (Root.__CLIENT__)
        //  console.log("TOPIC2 componentWillReceiveProps: nparams=", nparams)
        const nthreadid = nparams ? nparams.threadid : ':';
        const nshortname = nparams ? nparams.shortname : '';
        //if (Root.__CLIENT__)
        //  console.log("nthreadid=", nthreadid, "nshortname=", nshortname, "threadid=", threadid, "shortname=", shortname);
        if (nthreadid && nthreadid != threadid) {
            // if (Root.__CLIENT__)
            //  console.log("TOPIC_SCROLL <<<componentWillReceiveProps:", { nthreadid, threadid });
            if (!nparams.cc && !nparams.qcid) {
                // console.log("scrolling 1", nparams)
                scrollTop();
            }
            // console.log("BoundTopic  <<<componentWillReceiveProps fetch threadid:", threadid);

            actions.fetchContextTopicForThread({ threadid: nthreadid, state: context, community: homeChannel, test });

        }
        else if (nshortname && nshortname != shortname) {
            // console.log(">>>componentWillReceiveProps fetching for nshortname",nshortname);
            // console.log("TOPIC_SCROLL <<<componentWillReceiveProps :", { nshortname, shortname });
            if (!nparams.cc && !nparams.qcid) {
                // console.log("scrolling 2", nparams)
                scrollTop();
            }

            actions.fetchContextTopicForFeed(homeChannel, nshortname);

        }
        if (nextProps.context.get("topic") != props.context.get("topic")) {
            actions.onlineCount();
            //   console.log("TOPIC CHANGED location:", location ? location.pathname : '');
            //console.log(" GA TOPIC CHANGED location:", location ? location.pathname : '');
            //$$ setTimeout(() => { ga('set', 'page', this.props.location ? this.props.location.pathname : ''); ga('send', 'pageview') }, 10)
            //setTimeout(() => { gtag('config', 'UA-85541506-2', { 'page_path': location ? location.pathname : '' }) }, 10);
            //$$   setTimeout(() => { gtag('config', 'UA-85541506-1', { 'page_path': location ? location.pathname : '' }) }, 10)

        }

    }
    render() {
        // console.log("BoundTopic render")
        var props = this.props;
        var props2 = { ...props };
        const publisher = props.publisher;
        props2.approver = props.app.get("isCatAdmin") ? 1 : 0
        props2.community = props.app.get("community");
        //console.log("props2.community=",props2.community)
        props2.itemAction = props.actions.itemAction;
        // console.log("BoundTopic Approver=",props2.approver)

        //console.log("TOPIC3 ",{props2,cc:props2.qparams.cc})

        if (publisher && !props.context.get("topic")) {

            return <Jumbotron style={{ marginTop: 80, fontSize: 24 }}>Welcome to Qwiket Publisher!<br /> <p style={{ fontSize: 18 }}> Create your first post or article by clicking on "START NEW ARTICLE" link on the right.</p></Jumbotron>

        }
        return <Topic {...props2} />
    }
}

export var Topic = (props) => {
    let { globals, mp, online, communityState: cs, session, context, qparams, qType, forceShow, width: cWidth, catIcon, actions, store, test } = props;

    const { baseThreadid, rootThreadid } = qparams;
    const approver = props.approver || test;
    const muiTheme = globals.get("muiTheme");
    const theme = +globals.get("theme");
    const brd = theme ? '#ccc' : '#444'
    const backgroundColor = muiTheme.palette;
    const color = muiTheme.palette.text.primary;
    const width = u.width(globals);//globals.get("width");//u.width();
    //console.log("TOPIC RENDER WIDTH>>>", width);
    const os = online;
    const channel = qparams.channel;//globals.get("channel");//u.channel();
    const homeChannel = cs.get("v51") ? cs.get("v51").get("channel") : false;

    const subscr_status = online.get("subscr_status");
    //const topic=store?store.getState().context.get("topic"):context.get("topic"); // for storybook
    const topic = context.get("topic");
    if (!topic)
        return <div />
    // const showQwiket=store?store.getState().context.get("showQwiket"):context.get("showQwiket");
    const showQwiket = context.get("showQwiket");
    ///console.log("BoundTopic:",{topic:topic.toJS(),showQwiket:(showQwiket?showQwiket.toJS():""),storyQwikets:(storyQwikets?storyQwikets.toJS():'none')});
    let qwiketChildren = topic.get("qcComments");
    if (qwiketChildren && qwiketChildren.size == 0)
        qwiketChildren = null;
    //if(qwiketChildren&&!qwiketChildren.get(topic.get("threadid"))||qwiketChildren&&qwiketChildren.get(topic.get("threadid"))&&qwiketChildren.get(topic.get("threadid")).size==0)
    //    qwiketChildren=null;
    /*console.log("qq qwiketChildren:",
      {
        topic: topic.toJS(),
        test,
        qwiketChildren: qwiketChildren ? qwiketChildren.toJS() : null
      }); */
    const i411 = context.get("i411");
    const topicSource = context.get("topicSource");
    const topicRefs = context.get("topicRefs");
    const icons = online.get("icons");
    // console.log('i411:',i411?i411.toJS():null);
    const threadid = topic ? topic.get("threadid") : qparams.threadid ? qparams.threadid : '';


    const forum = props.communityState.get("v51") && props.communityState.get("v51").get("channelDetails") ? props.communityState.get("v51").get("channelDetails").get("forum") : false;
    //  console.log("TOPIC topicSource=",topicSource)
    // console.log("forum=",forum);
    const colW = "" + (100 / (mp - 1)) + "%";
    const wleft = "" + (100 - 100 / (mp - 1)) + "%";
    const shortname = topic ? topic.get("cat") : '';
    const upd = actions.updateOnlineState;
    const setPost = actions.setPost;
    const unlink = actions.unlink;
    if (shortname != online.get("shortname"))
        upd({ shortname }, true);

    const noads_option = online.get("noads_option") == 1 ? 1 : 0
    var ch = (channel && channel != 'usconservative' && channel != 'qwiket') ? ('/channel/' + channel) : '';
    const disqusContextUrl = '/context' + ch

    //if(m())
    // ch='';

    const contextUrl = (m() ? '/m' : '') + '/context' + ch
    const shareUrl = 'https://qwiket.com' + contextUrl + '/topic/' + threadid;//'http://qwiket.com/';//contextUrl;//topic.get("url");
    const isStarred = qparams ? qparams.starred ? 1 : 0 : 0;
    const cc = qparams ? qparams.cc : '';
    //console.log("TOPIC4 cc",cc,qparams);
    // console.log("RENDER TOPIC editor=",props.editor)
    var local_href = ''
    let crossPostsHtml = [];
    const title = topic ? topic.get("title") : 'The Internet of Us';
    //console.log("Render Topic title=",title)
    const crossPosts = props.context.get("crossPosts");
    const cp = crossPosts ? crossPosts.size : 0;
    /* if(cp){
       crossPosts.forEach((p,i)=>{
         //console.log("push crosspost");
       crossPostsHtml.push(
         <div style={{width:'95%',marginTop:20,border:"0px  #73AD21",borderRadius:25}}>
           <BoundQwiket
             history={props.history}
             session={props.session}  
             globals={globals}
             community={props.community}
             i411={props.i411}
             key={"cp"+i} 
            
             starred={false} 
             side={false} 
             topic={p} 
             updateTopicState={()=>{}}
             channel={channel} 
             sideTopics={false} 
             full={0} 
             orderby={0} 
             approver={props.approver}
             itemAction={props.itemAction} 
             updateQwiketState={(xid,update)=>actions.updateQwiketState("crosspost",xid,update)}
             crossPost={true}/>
   
         </div>);
       })
        <Switch
        color="primary"
        disabled={false}
        checked={toggled}
        onClick={()=>console.log("switch on click")}
        onChange={(e,val) => { console.log("THROTTLING"); this.setState({ throttle: true }); setTimeout(() => this.setState({ throttle: false }), 200); console.log("TOGGLE", val, e); setTimeout(() => setState2(shortname, { toggled: !toggled }), 1); this.props.onToggleSwitch(f.get("path"), f.get("shortname"), f.get("included") == 1 ? 'exclude' : 'include'); if (mf) this.props.onReloadNewsline() }}
        classes={{colorPrimary:'q-toggle-primary',checked:'selected',bar:'selected'}}
          /> 
     } */
    //console.log("Topic: editor=",props.editor)
    const Promoted = (props) => {
        //console.log("*** %%% PROMOTED")
        return <div><FormControlLabel
            control={<Toggle
                id="hideAdsToggle"
                checked={noads_option == 1}
                onChange={props.onToggle}
                color="primary"
                className="q-hide-ads"
            />}
            label={<span style={{ fontSize: '1.0rem', marginLeft: 10 }}>Hide Ads</span>}

        />
            <style global jsx>{`.q-hide-ads{margin-left:20px;}`}</style>
        </div>
    };
    const zoom = u.zoom();//session.get('zoom')!=='out';
    // console.log("Topic zoom=",zoom,session.get('zoom'));
    const promoted = topic ? topic.get("promoted") ? topic.get("promoted") : null : null;
    // console.log("promoted:",promoted)
    const promotedMeta = topic ? topic.get("promotedMeta") : null;
    let isbook = topic ? topic.get("isbook") : 0;
    if (!topic.get("firstThreadid"))
        isbook = 0;
    // console.log("ArticleView isbook=",isbook)
    let disqThreadid = isbook == 1 ? (topic.get("firstThreadid") ? topic.get("firstThreadid") : threadid) : threadid;
    // console.log("disqThreadid",disqThreadid)
    //  console.log('promotedMeta',promoted,promotedMeta,+topic.get("article"),subscr_status)
    let realDisqThreadid = disqThreadid;
    let primary = topic.get("primary");
    let primaryPerc = '';
    if (primary) {
        primary = Immutable.Map.isMap(primary) ? primary.toJS() : false;
        primaryPerc = primary.perc ? "  [" + primary.perc + "%]" : "";
    }
    // console.log("Topic approver=",approver);
    const primaryThreadid = primary ? primary.primaryThreadid : false;
    let matches = topic.get("matches");
    if (matches)
        matches = matches.toJS();
    /*
      if(primaryThreadid)
        disqThreadid=primaryThreadid;
      else if(matches&&matches.length>0){
        disqThreadid=matches[0].primaryThreadid;
      }
      */
    // console.log("matches=",matches);
    // console.log("primaryThreadid=",primaryThreadid);
    // console.log("realDisqThreadid=",realDisqThreadid);
    let mb = false;
    // console.log("matchesHtml")
    let matchesHtml = matches ? matches.map((p, i) => {
        mb = true;
        const url = contextUrl + '/topic/' + p.threadid;
        const perc = p.perc ? "  [" + p.perc + "%]" : "";
        // console.log('perc=',perc);
        return <ListItem key={"asdalksfj" + i}  ><div>
            <Link to={url} ><span style={{ fontSize: '1.2rem' }}>{p.site_name + ": " + p.title + perc}</span></Link>

        </div></ListItem>
    }) : []
    //  <Unlink channel={channel} threadid={threadid} targetThreadid={p.threadid} unlink={unlink} title={title} targetTitle={primary.site_name+": "+primary.title+perc}/>
    if (primaryThreadid) {
        mb = true;
        // console.log("unshift ",primary.title)
        const url = contextUrl + '/topic/' + primaryThreadid;
        matchesHtml.unshift(<ListItem key={"asdalksfj" + 345} id='li' >
            <div><Link to={url}><span style={{ fontSize: '1.2rem' }}>{primary.site_name + ": " + primary.title + primaryPerc}</span></Link>

            </div></ListItem>)
    }
    var sourceCatIcon = "";
    var sourceCatLink = "";
    if (topicSource) {
        const sourceShortname = topicSource.get("shortname");
        if (sourceShortname) {
            // console.log("render Source Topic shortname=",sourceShortname,icons.toJS());
            if (icons && icons.get(sourceShortname)) {
                /* const cat=props.categories.get(sourceShortname)
                 console.log("cat:",cat?cat.toJS():'');
                 category_xid=cat.get("category_xid");*/
                sourceCatIcon = icons.get(sourceShortname);

                const pid = topicSource.get("id");
                sourceCatLink = contextUrl + '/topic/' + topicSource.get("source_threadid") + "/cc/comment-" + pid + "#comment-" + pid;
                // console.log("icon:",sourceCatIcon,sourceCatLink)
                //sourceCatName=sourceShortname.get("text");
            }
            else {
                actions.requestIcon(sourceShortname);
            }
        }
    }
    var refCats = [];
    if (topicRefs) {
        topicRefs.forEach((p, i) => {
            const sourceShortname = p.get("shortname");
            if (sourceShortname) {
                //console.log("a12 render Refs Topic shortname=", sourceShortname);
                if (icons && icons.get(sourceShortname)) {
                    /* const cat=props.categories.get(sourceShortname)
                     console.log("cat:",cat?cat.toJS():'');
                     category_xid=cat.get("category_xid");*/
                    sourceCatIcon = icons.get(sourceShortname);

                    const pid = p.get("id");
                    sourceCatLink = contextUrl + '/topic/' + p.get("source_threadid") + "/cc/comment-" + pid + "#comment-" + pid;
                    console.log(" a12 icon:", sourceCatIcon, sourceCatLink);
                    refCats.push(<div className="q-reference-card-wrap"><Link key={"topic-refs-" + i} to={sourceCatLink}>
                        <Card className='q-reference-card-root' onclick={() => props.history.push(sourceCatLink)}>
                            <CardHeader
                                title={"Article referenced via comment by " + p.get("author_name") + ":"}

                                avatar={
                                    <Avatar aria-label="Shared by avatar" src={u.cdn(p.get("author_avatar"))} />
                                }
                            />
                            <div className="q-refs-body"><Markdown data-id="markdown-src-comment" escapeHtml={false} source={p.get("body")} /></div>
                            <CardMedia
                                classes={{ root: "q-refs-media-root" }} overlay={<CardContent component={<div className="q-refs-card-content">{p.get("thread_title")}<Image className=".q-refs-card-content-image" src={u.cdn(sourceCatIcon)} responsive rounded /></div>} />}
                            >
                                <img className="q-refs-media-img" src={u.cdn(p.get("image"))} alt="" />
                            </CardMedia>
                            <CardContent>
                                <Typography component="p">
                                    Qwiket: The Internet of Us™
          </Typography>
                            </CardContent>

                        </Card>
                    </Link></div>)
                    //sourceCatName=sourceShortname.get("text");
                }
                else {
                    actions.requestIcon(sourceShortname);
                }
            }
        });
    }

    //topicSource.get("author_avatar")
    /*
    <CardTitle title={topicSource.get("thread_title")} subtitle="Card subtitle" />
      <CardText>
        {u.sanitize(topicSource.get("body"))}
      </CardText>
      <CardActions>
        <FlatButton label="Action1" />
        <FlatButton label="Action2" />
      </CardActions>*/
    const isCatAdmin = props.app.get("isCatAdmin") ? 1 : 0;
    var tsHtml = topicSource ? <div className="q-reference-card-wrap"><Link to={sourceCatLink} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card className='q-reference-card-root' onclick={() => props.history.push(sourceCatLink)}>
            <CardHeader
                title={"Article shared via comment by " + topicSource.get("author_name") + ":"}

                avatar={
                    <Avatar aria-label="Shared by avatar" src={topicSource.get("author_avatar")} />
                }
            />
            <div className="q-refs-body"><Markdown data-id="markdown-src-comment" escapeHtml={false} source={topicSource.get("body")} /></div>
            <CardMedia classes={{ root: "q-refs-media-root" }}
                overlay={<CardContent component={<div className="q-refs-card-content">{topicSource.get("thread_title")}<Image className=".q-refs-card-content-image" src={sourceCatIcon} responsive rounded /></div>} />}
            >
                <img className="q-refs-media-img" src={u.cdn(topicSource.get("image"))} alt="" />
            </CardMedia>
            <CardContent>
                <Typography component="p">
                    Qwiket: The Internet of Us™
          </Typography>
            </CardContent>

        </Card>
    </Link></div> : null;
    //console.log("tsHtml",tsHtml)
    // <Unlink channel={channel} threadid={threadid} targetThreadid={primaryThreadid} unlink={unlink} title={title} targetTitle={primary.site_name+": "+primary.title}/>
    // matchesHtml=matchesHtml.toJS();
    const height = noads_option ? 0 : width > 1200 ? (zoom != 'out' ? 240 : 200) : width > 600 ? (zoom != 'out' ? 180 : 180) : zoom != 'out' ? 140 : 140;
    const messages = props.app.get("meta") && props.app.get("meta").get("messages") ? props.app.get("meta").get("messages") : false;
    const redwaveAd = messages && messages.get(3) ? messages.get(3).get("message") : "https://qwiket.com/cdn/uploads/1c827afe69157411c85c8ac4e20d9091-default-avatar-big-0f74f42b7d831ec812545b20b3745225cb99887e701c453e5876f5f607c0d965.png-fbcover.png";
    const redwaveAdTarget = messages && messages.get(4) ? messages.get(4).get("message") : "/redwave/default-avatar-big-0f74f42b7d831ec812545b20b3745225cb99887e701c453e5876f5f607c0d965.png";
    //http://qwiket.com/cdn/uploads/21150015_913316235488253_94275099575551812_n.png-fbcover.png
    //  console.log("messages=",messages?messages.toJS():'',redwaveAd);
    // console.log("RENDER qwiketChildren:",qwiketChildren);

    /*let promotedHtml = !tsHtml && !topicRefs && promoted && (+topic.get("article") != 1) ? (<div id="ad" style={{ height: height + 80, width: '100%' }}>
      {noads_option ? <span /> : <ListItem id='li' >
        {promotedMeta ? <OverlayMod
          maskNewsline={actions.maskNewsline}
          newslineMaskMap={props.newslineMaskMap}
          globals={globals} channel={channel} homeChannel={homeChannel} zoom={zoom} noclick={false} height={height} meta={promotedMeta} /> : <div />}</ListItem>}
  
      {subscr_status > 0 ? <div>
        <Promoted onToggle={(val, e) => { actions.updateOnlineState({ noads_option: noads_option == 1 ? 0 : 1 }, false) }} /></div> :
        <div><Promoted onToggle={(val, e) => props.history.push('/context/topic/become-qwiket-member')} />
        </div>}
    </div>) : <div />*/


    /******************************************** */

    let promotedHtml = (<div>{noads_option ? <span /> : <div className="q-qwiket-ad-wrap"><div className="q-qwiket-ad">
        <div className="q-qwiket-ad-block">
            <div variant="body2" className="q-qwiket-ad-body">
                <p><span className="q-qwiket-ad-drop">H</span>ire the technology team behind Qwiket for your company's next web app project.
          We are scaling up and out, and are looking for projects in our core area of expertise: React full stack.</p>
                <img className='q-hl-image' src={"https://qwiket.com/static/css/hvad1.jpeg"} />
                <p>Business / workforce flows and automation, customer engagement, supply chain, etc. </p>
                <p>Or, perhaps, the turn-key technology team for your Internet startup?</p>
                <p>Hudson Wilde Labs,<br /> Kingston, NY</p>
            </div>
            <div variant="body1" className="q-qwiket-ad-sub">  <p>Technology: React JS, Next JS, WPA / Expo-native Android or iOS, full-stack.</p>
                <p>Lifetimes of experience with US Enterprise / Wall St. / Startup business environments. Informal, aggressive, agile!</p>
            </div>
        </div>
        <div className="q-qwiket-ad-block">
            <div variant="subtitle2" className="q-qwiket-ad-email" >sales @ hudsonwilde . com</div>
        </div>

    </div>
        <div className="q-qwiket-ad-react">
            <div variant="h6" className="q-qwiket-ad-for-hire">
                FOR HIRE!
      </div>
            <div className="q-qwiket-ad-react-img"><img src="https://qwiket.com/static/css/react.png" /></div>


            <div className="q-qwiket-ad-react-caption">
                <div variant="caption" className="q-qwiket-ad-madin">MADE IN USA</div>

            </div>

        </div>
    </div >}
        {
            subscr_status > 0 ? <div>
                <Promoted onToggle={(val, e) => { actions.updateOnlineState({ noads_option: noads_option == 1 ? 0 : 1 }, false) }} /></div> :
                <div><Promoted onToggle={(val, e) => Router.push('/context/topic/become-qwiket-member')} />
                </div>
        }
    </div >)

    const hasStoryQwikets = qwiketChildren ? true : false;
    const rightColumn = tsHtml || hasStoryQwikets;
    if (!mp)
        mp = 0;
    // console.log("rightColumn:",rightColumn,mp)
    //console.log("TOPIC passing", { qparams })
    return <DocumentTitle title={title}><div style={{ color, backgroundColor }}>

        {false ? <div id="cItem" style={{ margin: '0px 0px 6px 0px', paddingTop: 0 }}>

            {topic && +topic.get("article") == 1 ?
                <ArticleView history={props.history} globals={props.globals} dashboard={props.dashboard} i411={props.i411} approver={approver} actions={actions} os={os} cs={cs} zoom={zoom} editor={props.editor ? true : false} topic={topic} route={props.route} isStarred={isStarred} threadid={threadid} channel={channel} />
                :
                <div>{topic ? <BoundQwiket
                    test={0}
                    type={'context'}
                    columnType={'context'}
                    maskNewsline={props.maskNewsline}
                    newslineMaskMap={props.newslineMaskMap} history={props.history} globals={props.globals} context={props.context}
                    i411={props.i411} actions={actions} session={session} community={props.community} shareUrl={shareUrl} itemAction={props.itemAction} approver={approver} starred={isStarred} side={false} topic={topic} updateTopicState={actions.updateItemTopicState} channel={channel} sideTopics={false} full={1}
                    rootThreadid={threadid}
                    baseThreadid={threadid}
                    showQwiket={showQwiket}
                    feed={false}
                    updateTopicState={actions.updateSideTopicState}
                    invalidateContext={(actions.invalidateContext)}
                    updateQwiketState={(xid, update) => actions.updateQwiketState("context", threadid, update)}
                    {...props}
                /> : <BoundQwiket maskNewsline={props.maskNewsline}
                    newslineMaskMap={props.newslineMaskMap} history={props.history} globals={props.globals} i411={props.i411} actions={props.actions} session={props.session} community={props.community} shareUrl={shareUrl} itemAction={props.itemAction} approver={props.approver} starred={isStarred} side={false} topic={topic} updateTopicState={actions.updateItemTopicState} channel={channel} sideTopics={false} full={1} orderby={0} updateQwiketState={(threadid, update) => actions.updateQwiketState("context", threadid, update)} />}
                </div>
            }
            {mb ? <div style={{ marginLeft: 10 }}> <Typography>Linked articles:</Typography>
                {matchesHtml}
            </div> : null}
            <div style={{ width: '100%' }}><div data-id="qwikets" style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: (width > 800 ? '60%' : '100%') }}>
                {cp ?
                    <div data-id="crosses" style={{ marginTop: 10, color, marginBottom: 15, maxWidth: 400 }}>
                        {crossPostsHtml}
                    </div>
                    : <span />
                }



            </div>
                <div style={{ height: width < 900 ? 30 : 4 }} />
            </div>
        </div> : null}

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div data-id='w01' style={{ width: '100%' }}>

                {true ? <div style={{ width: '100%', height: '100%' }}>
                    <QwiketComment
                        topic={topic}
                        level={0}
                        pageRootThreadid={threadid}

                        history={props.history}
                        context={props.context}
                        publisher={props.publisher}
                        session={props.session}
                        globals={globals}
                        maskNewsline={actions.maskNewsline}
                        newslineMaskMap={props.newslineMaskMap}
                        homeChannel={homeChannel}
                        itemAction={actions.itemAction}
                        query={""}
                        shortname={shortname}
                        approver={approver || isCatAdmin}
                        channel={channel}
                        author={props.author}
                        updateTopicState={actions.updateSideTopicState}
                        invalidateContext={actions.invalidateContext}
                        communityState={props.communityState}
                        rootThreadid={rootThreadid}
                        baseThreadid={baseThreadid}
                        qparams={qparams}
                        topicOnly={true}
                        test={test ? 1 : 0}
                        updateQwiketState={(threadid, update) => actions.updateQwiketState("storyQwikets", threadid, update)}
                    />
                </div> : null}
                {tsHtml}
                {refCats}
            </div>
            {test ? <div>AD SPACE</div> : <div data-id="w000">{promotedHtml}</div>}
            <QwiketComment
                topic={topic}
                level={0}
                pageRootThreadid={threadid}

                history={props.history}
                context={props.context}
                publisher={props.publisher}
                session={props.session}
                globals={globals}
                maskNewsline={actions.maskNewsline}
                newslineMaskMap={props.newslineMaskMap}
                homeChannel={homeChannel}
                itemAction={actions.itemAction}
                query={""}
                shortname={shortname}
                approver={approver || isCatAdmin}
                channel={channel}
                author={props.author}
                updateTopicState={actions.updateSideTopicState}
                invalidateContext={actions.invalidateContext}
                communityState={props.communityState}
                rootThreadid={rootThreadid}
                baseThreadid={baseThreadid}
                qparams={qparams}
                commentsOnly={true}
                test={test ? 1 : 0}
                updateQwiketState={(threadid, update) => actions.updateQwiketState("storyQwikets", threadid, update)}
            />



            {forum ? <div className="q-comments">
                <div style={{ display: 'flex', fontSize: '1.8rem', padding: 0, marginTop: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <img height={24} src={"https://c.disquscdn.com/next/c393ff4/marketing/assets/img/brand/disqus-social-icon-blue-white.svg"} />
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>Disqus</span>
                </div>

                <Local site={forum}
                    theme={theme}
                    globals={globals}
                    contextUrl={disqusContextUrl}
                    channel={channel}
                    cc={cc} skip={topic ? topic.get("description") == "Please wait, it could take a minute or two to put the report together for you..." : true}
                    threadid={disqThreadid}
                    realDisqThreadid={realDisqThreadid}
                    setPost={setPost}
                    shortname={shortname}
                    color={color}
                    topic={topic} />
            </div> : null}

        </div>

        <div data-id="qwiket-logo" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}> <img style={{ width: '50%', height: '50%', maxWidth: 300, maxHeight: 300 }} src="/static/css/qwiket-logo.png" /></div>
        <style global jsx>{`
      .q-qwiket-ad-block{
        width:100%;
      }
     .q-qwiket-ad-drop{
      float: left;
      font-family: Gentium Basic,serif;
      font-size: 50px;
      line-height: 45px;
      padding-right: 6px;
     
      color: ${theme == 1 ? '#005662' : '#18FFFF'} !important;
    }
    .q-qwiket-ad-for-hire{
      margin-top:40px  !important;
      color:#fff !important;
      text-align:center;
      font-size:1.4rem !important;
       font-weight:400 !important;
    }
     .q-qwiket-ad-tile-root {
     
      margin:0px !important;
      height:80px; !important;
      width:100%;
      background: #222;
     }
     .q-qwiket-ad-title{
      height:20px;
      text-overflow: ellipsis;
      overflow: hidden; 
      white-space: normal;
    }
    .q-qwiket-ad-body{
      line-height:1.4 !important;
      font-weight:400 !important;
      font-size:1.0rem !important;
    }

    .q-qwiket-ad-email{
      border-top:solid ${theme == 1 ? 'black' : 'white'} thick;
      font-weight:500;
      font-size:1.0rem !important;
      margin-top:20px;
      margin-bottom:10px;
    }
    .q-qwiket-ad-react-img{
      display:flex;
      justify-content:center;
      align-items:center;
      min-height:40%;
    }
    .q-qwiket-ad-react-caption{
      height:60px;
      text-align:center;
    }
    .q-qwiket-ad-madin{
      color:#fff !important;
    }
    .q-qwiket-ad-sub{
      font-size:0.7rem !important;
      margin-left:0px;
      margin-right:0px;
      font-weight:400 !important;
      line-height:1.4 !important;
    }
    
    .q-qwiket-ad-wrap{
      display:flex;
      background-color:${theme == 1 ? '#eee' : '#322'};
      font-family:roboto !important;
      line-height:1.4 !important;
      width:100%;
      position:relative;
      margin-top:20px;
      margin-right:30px;
    }
    .q-qwiket-ad{
        flex:1.61;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-between;
        padding-bottom:40px;
       
        margin:40px;
    }
      @media (max-width:750px){
       
        .q-qwiket-ad-wrap{
          flex-direction:column;
           margin-top:10px;
            margin-bottom:10px;
        }
        .q-qwiket-ad{
          
          align-items:flex-start;
           margin:10px;
        }
        
       
      }
      @media (min-width:750px){
        .q-qwiket-ad{
          height:720px;
          margin:40px;
        }
        .q-qwiket-ad{
          
          align-items:flex-start;
        }
       
      }
      @media (min-width:900px){
        .q-qwiket-ad{
          height:820px;   
          margin:20px;
        }
       
      }
      @media (min-width:1400px){
        .q-qwiket-ad{
          height:780px;
          margin:30px;
        }
       
      }
      @media (min-width:1800px){
        .q-qwiket-ad{
          height:800px;
          margin-bottom:50px;
        }
       
      }
      
      .q-qwiket-ad-react{
        background-color:#222 !important;
        color:#fff !important;
        flex:1;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
      
      }
      .q-comments{
        padding:40px ${zoom != 'out' ? '5%' : '10px'} 10px 10px;
        margin-bottom:10px;
        width:100%;
        font-family:roboto !important;
        
      }
      .q-comments a{
        font-weight: 500 !important;
        
      }
      .q-hide-ads{
        margin-left:10px;
      }
      .q-reference-card-wrap{
        display:flex;
        justify-content:center;
      }
      .q-reference-card-root{
        max-width:400px;
      }
      .q-refs-media-root{
        display:flex !important;
        justify-content:center;   
        }
      .q-refs-media-img{
        max-height:300px;
      }
      .q-refs-card-content{
        display:flex !important;
        justiy-content:space-between;
        font-Size:1.6rem;
        line-height:2rem;

      } 
      .q-refs-card-content-image{
        max-height:48px;
      }
      .q-refs-body{
        opacity:0.7;
        padding:10px 20px 20px 20px;
      }
    `}</style>

    </div>

    </DocumentTitle>
}


function mapStateToProps(state) {
    return {
        app: state.app,
        context: state.context
    };
}

export default connect(
    mapStateToProps,
    null
)(Channel)
