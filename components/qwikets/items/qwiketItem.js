//old QwiketWrapper/* eslint-disable no-class-assign */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { Component, useState } from "react";
import PropTypes from 'prop-types';
import Immutable from "immutable"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Root from 'window-or-global';


import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { fetchStoryQwikets, fetchShowQwiket, invalidateContext, localUpdateQwiket, createQwiket, saveQwiket, publishQwiket, unpublishQwiket, fetchDraftChildQwiket } from '../../../qwiket-lib/actions/contextActions';
import { updateQwiketState, itemAction } from '../../../qwiket-lib/actions/newslineActions';
import { requestIcon, updateOnlineState, } from '../../../qwiket-lib/actions/appActions';

import u from '../../../qwiket-lib/lib/utils';


import { QwiketFamily } from '../qwiketFamily2';


const green500 = green[500];
const amber500 = amber[500];
const red900 = red[900];
const green700 = green[700];
const blueGrey200 = blueGrey[200];
const indigo900 = indigo[900];
const amber900 = amber[900];
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true, info, error });
        // You can also log the error to an error reporting service
        console.log("exception dump", error, info);
    }

    render() {
        if (this.state.hasError) {
            const { info, error } = this.state;
            // You can render any custom fallback UI
            return <div><h4>Unhandled Exception in Markdown</h4> {info}<div>{error}</div></div>;
        }
        return this.props.children;
    }
}
export class QwiketItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showedHistory: false
        };
    }
    componentDidMount() {
        //console.log('BoundQwiket mounted');
    }
    shouldComponentUpdate(nextProps) {
        const props = this.props;
        //if(props.full)
        //console.log("QwiketRenderer: shouldComponentUpdate props.topic:",props.topic?props.topic.toJS():'none',"nextProps.topic:",nextProps.topic?nextProps.topic.toJS():'none')
        const ret = (nextProps.columnType != props.columnType) || nextProps.topic != props.topic || nextProps.showQwiket != props.showQwiket || props.session != nextProps.session || nextProps.context != props.context
        //if(props.full)
        //console.log("QwiketRenderer: shouldComponentUpdate ret=",ret);
        return ret;
    }

    render() {
        let {
		/*passed:*/		columnType, topic, channel, qparams, forceShow, firstRow, approver, test,
		/*bound: */		showQwiket, context, session, online,
            actions, /*bound actions*/
            ...rest /* styles */
        } = this.props;
        if (!qparams || !topic)
            return <div >QPARAMS:{qparams}</div>
        let globals = session;
        const { fetchStoryQwikets, fetchShowQwiket, invalidateContext, requestIcon } = actions;
		/**
			Qwikets are classified into three types: a normal Qwiket, a Qwiket from a Comment Stream (displayed opened from the beginning), a full qwiket - in the context page.
        **/
        if (columnType == 'newsviews') {
            columnType = 'mix';
            // console.log("qwiketItem", { channel })
        }
        const typeOfQwiket = columnType == 'context' ? 'full' : (columnType == 'reacts' || columnType == 'mix' || columnType == 'story-qwikets') ? 'commentStream' : 'qwiketColumn'; //full,commentStream,qwiketColumn, TBA - meta qwikets, hotlist?
        const zoom = qparams.z;
        // console.log({ topic })
        //console.log("BoundQwiket render...")

		/**
		Refactoring March 1, 2019
		xColumnType={reacts,full,incontext,story}
		xQwiketType={story,react}
		xQwiketSubtype={disqus,qwiket,tview}

		**/
        const xColumnType = columnType == 'reacts' || columnType == 'mix' ? 'reacts' : columnType == 'context' ? 'full' : columnType == 'story-qwikets' ? 'incontext' : 'story';
        //console.log("QW:", { columnType });

        //if(columnType=='disqus')
        //	console.log("columnType:",columnType,"typeOfQwiket-->:",typeOfQwiket,topic?topic.toJS():'')
		/**
			headless Qwikets do not show top parent, a story itself, appropriate for the story-qwikets
		**/
        const headless = columnType == 'story-qwikets' ? true : false;
		/**
			Qwikets may have a colored top and left borders to indicate freshness. Used in the publication feed
		**/
        const colorBorder = columnType == 'feed' || columnType == 'story-qwikets' ? true : false;
        //if(colorBorder&&(topic.get("reshare")==7||topic.get("reshare")==59))
        //	return <div/>;
        const meta = false; //TBA: meta qwikets processing

        //  const width = u.width(globals);
        let loud = (+session.get("loud"));

		/**
	A Qwiket caches all opened sub-Qwikets in showedHistory, so that they remain opened even when the showQwiket does not match ( the focus shifted to another Qwiket or sub-Qwiket).
	We do not want sub-Qwikets to close on the shift of focus - to much jumpiness on the page
**/
        let showedHistory = this.state.showedHistory//get("showedHistory");
		/*if(showedHistory){
			console.log("QDBG 4: showedHistory:",showedHistory)
		}*/
		/** Root is a term used for an overall Qwiket,  the main container. It may have parents and children.
			It's data object is in props.topic. It could be either a Disqus comments, or a native Qwiket
			Id is an actual post or thread id. Key is a string postid:id or threadid
		**/
        //if(typeOfQwiket=='commentStream')	
        //console.log("MIX QWIKET WRAPPER", { topic: topic.toJS(), columnType })
        const rootIsDisqus = (topic.get("qtype") == 'disqus' || topic.get("qtype") == 'mix') && ((topic.get("body")) ? true : false);
        const rootThreadid = topic.get("threadid")
        const rootId = rootIsDisqus ? topic.get("id") : rootThreadid;
        const rootKey = rootIsDisqus ? 'postid:' + rootId : rootId;
        const rootXid = topic.get("threadid");
        //console.log('QDBGT:',topic.toJS(),rootXid);
        const rootTopic = topic; //backup
        if (!channel)
            channel = 'qwiket';
        const ch = (channel ? '/channel/' + channel : '');
        let parents = topic.get("parent_summary");
        const whatAMessRootId = parents && parents.get(parents.size - 1) ? parents.get(parents.size - 1).get("threadid") : null;
        //console.log({ whatAMessRootId, parents: parents ? parents.toJS() : [] })
        let rootTargetLink = `/context${ch}/topic/${rootThreadid}`;
        let replyRootThreadid = rootThreadid;
        if ([6, 7, 106, 107].indexOf(topic.get("reshare")) >= 0) {
            //console.log("links: topic:",topic.toJS(),"datumQwiketLink:",datumQwiketLink,'targetLink:',targetLink,'levelLink:',levelLink,'rootTargetLink:',rootTargetLink)
            const url = topic.get("url");
            const s1 = url ? url.split("//") : [];
            const s2 = s1 ? s1[1] : '';
            const s3 = s2 ? s2.split(":")[0] : '';
            rootTargetLink = `/context${ch}/topic/${whatAMessRootId}/`;
            //	console.log('QLINK:', { url, s1, s2, s3, rootTargetLink })
            replyRootThreadid = s3;
            //	console.log("QLINK: QGBG 4: links: targetLink", { rootThreadid, s3, s2, s1, url, routePageLink, rootTargetLink, replyRootThreadid })
        }
        const rootDate = topic.get("published_time");


		/**
			showQwiket is a fresh copy of the Qwiket (jsapi: task=qwiket) for the focused Qwiket on the page (result of a dots or sub-Qwiket firstStep click).
			The concept of two steps means first time you click on a closed sub-Qwiket it is opened (showQwiket is set to it), second time - the navigation to the associated resource is executed.
			commonPage is responsible for calling loadQwiket (jsapi task=qwiket) for the key (qwiketid) based on route qparams.
			On SSR showQwiket is part of context load.
		**/
		/**
			rootThreadid - a route param, the second of the ids in url (base,root,target). Base - the threadid of the context page on which
			everything is displayed, Root - the id of the Qwiket in the column. Target - is the replacement id, used by CommonPage to request a showQwiket.
			For full/context Qwiket Base == Root(if present) == Target (if present). Target is irrelevant for the Qwiket rendering itself.
			qparams is a combined match from the routes (have all the qparams)
		**/
        const routeBaseKey = qparams.threadid;
        let routeRootKey = (qparams.rootThreadid ? (qparams.rootThreadid) : ((typeOfQwiket == 'full') ? rootKey : null));
        //console.log("QGBG ==> typeOfQwiket:",typeOfQwiket,';approver:',approver);
        const routeTargetKey = qparams ? qparams.qwiketid : routeRootKey;
        const routePageLink = qparams ? qparams.path : 'https://qwiket.com';  //for links that want to stay on the same page, just change root or target key, like when you are browsing within the Qwiket or switching to a different Qwiket inside the page
        //console.log("links 11:", { routeBaseKey, routeRootKey, routeTargetKey, routePageLink })
        // if(columnType=='story-qwikets')	
        // console.log("QGBG 4: story-qwikets rootKey",{rootKey,rootThreadid,routeTargetKey,routeRootKey});
        // if(rootKey=='i-did-the-first-category-of-the-konmari-method-here-s-how-it-went-0')
        //if(typeOfQwiket=='commentStream')	
        //	console.log("QGBG 4: rootTopic:",{rootKey,routeRootKey,topic:topic?topic.toJS():'',	qparams,showQwiket:showQwiket?showQwiket.toJS():'',rootKey,routeRootKey,rootXid,showedHistory})
        if (rootIsDisqus) {
            //if(topic.get("reshare")==7)
            //console.log("QDBD 4: disqus",{rootThreadid,rootId,rootKey,rootTopic,rootTargetLink,routePageLink,qparams,topic,routeRootKey,routeBaseKey})
        } else {
            //if(topic.get("reshare")==7&&(topic.get("description").indexOf("q3")>0))
            //console.log("QDBD 4: not disqus",{rootThreadid,rootId,rootKey,rootTopic:rootTopic.toJS(),rootTargetLink,routePageLink,qparams,topic:topic.toJS(),routeRootKey,routeBaseKey})

        }
        let show = 'qshow';
        let view = 'qview'
		/*if (qType == 'disqus') {
			show = 'qshowdisq';
			view = 'qviewdisq';
		}
		else if (qType == 'mix') {
			show = 'qshowmix';
			view = 'qviewmix';
		}*/

        if (typeOfQwiket == 'full') {
            routeRootKey = routeBaseKey; //supporting simple /context/topic/threadid route for full Qwikets
            //console.log("Q5GBG 5 FULL :",{qparams,qparams,topic:topic?topic.toJS():'missing',showQwiket:showQwiket?showQwiket.toJS():'missing',rootKey});
        }

        let inShow = false;  //root qwiket in focus
        let rootOpened = false; //root qwiket is opened, either because inShow or it was inShow previously and gotten from cache
        let replacementQwiket = null;
        let replacementKey = rootKey;
        //if(showQwiket&&rootIsDisqus)
        //if(columnType=='disq-tids')
        //if (showQwiket && rootIsDisqus)
        //console.log("Q1GBGD showQwiket CHK2:", { topic: topic ? topic.toJS() : '', qparams, rootIsDisqus, showQwiket: showQwiket ? showQwiket.toJS() : '', rootKey, routeRootKey })

        if (showQwiket && (rootKey == showQwiket.get("rootThreadid"))) {
            //  if(rootKey=='re-the-indefensible-morality-of-andrew-cuomo-0')
            //	console.log("Q1GBG 4: 1 rootTopic:", { threadid: topic ? topic.get('threadid') : '', qparams, showQwiket: showQwiket ? showQwiket.toJS() : '', rootKey, routeRootKey })


			/**
				If the current Qwiket is in focus
			**/
            //console.log("QDEBUG: showQwiket:", showQwiket ? showQwiket.toJS() : 'none')
            replacementQwiket = showQwiket.get("qwiket");

            replacementKey = replacementQwiket.get("qtype") == 'disqus' ? 'postid:' + replacementQwiket.get("id") : replacementQwiket.get("threadid");
            //if(columnType=='story-qwikets')
            //console.log("QDEBUG BoundQwiket CHK replacementKey:", replacementKey)
            //double check that the appropriate showQwiket already loaded
            if (rootKey == showQwiket.get("rootThreadid")) {
                // if(rootKey=='200-years-ago-we-endured-a-year-without-a-summer-0')
                //if(columnType=='QDEBUG-qwikets')
                //console.log("QDEBUG BoundQwiket CHK repl:", replacementKey)
                if (typeOfQwiket != 'full') {
                    let oldTopic = topic;
                    topic = replacementQwiket;
                    //console.log('QDEBUG columnType: replacement:', { columnType, typeOfQwiket, newtopic: topic.toJS(), oldtopic: oldTopic.toJS() })
                }
                inShow = true;
                rootOpened = true;
            }
        }
        if (inShow) {
            // if(typeOfQwiket!='full'&&rootKey=='200-years-ago-we-endured-a-year-without-a-summer-0')
            //	console.log("QGBG 4:",{topic:topic?topic.toJS():'',qparams,showQwiket:showQwiket?showQwiket.toJS():'',rootKey,routeRootKey,showedHistory:showedHistory?showedHistory.toJS():'no history'})

            //console.log("Q1GBG 22 inShow:", topic ? topic.toJS() : 'missing', 'showQwiket:', showQwiket ? showQwiket.toJS() : 'missing');
            //	console.log("inShow", { showQwiket: showQwiket.toJS() })
            //cache the focused qwiket
            if (!showedHistory)
                showedHistory = new Immutable.Map();
            let setHistory = false;
            if (!showedHistory.has(replacementKey)) {
                //if(rootKey=='200-years-ago-we-endured-a-year-without-a-summer-00')
                //console.log("QDEBUG 4:  setting cache,replacementKey:", replacementKey, { inShow, rootKey, showedHistory: showedHistory ? showedHistory.toJS() : '' })
                showedHistory = showedHistory.set(replacementKey, topic);
                setHistory = true;
                //	console.log({ showedHistory: showedHistory.toJS() })

            }
            if (!showedHistory.has(rootKey)) {
                //if(rootKey=='re-the-indefensible-morality-of-andrew-cuomo-0')
                //.log("QDEBUG BoundQwiket CHK setting cache for rootKey", rootKey, showedHistory ? showedHistory.toJS() : '')
                //console.log("setting showedHIstory", { rootKey })
                showedHistory = showedHistory.set(rootKey, rootTopic);
                setHistory = true;
            }
            if (setHistory) {
                //if(rootKey=='i-did-the-first-category-of-the-konmari-method-here-s-how-it-went-0')
                //console.log("QDEBUG showedHistory 4:  setting history:", replacementKey, { rootXid, inShow, rootKey, showedHistory: showedHistory ? showedHistory.toJS() : '' })

                this.setState({ showedHistory });
            }
            //if(rootKey=='re-the-indefensible-morality-of-andrew-cuomo-0')
            //console.log("QGBGR 5:",{topic:topic?topic.toJS():'',
            //	qparams,showQwiket:showQwiket?showQwiket.toJS():'',rootKey,routeRootKey,setHistory,showedHistory})

        }
        else {
            //if(rootKey=='200-years-ago-we-endured-a-year-without-a-summer-0')
            //console.log("QGBG 4: :CHK trying from cache :", { replacementKey, rootKey, showedHistory: showedHistory ? showedHistory.toJS() : '' })

            if (showedHistory && showedHistory.has(rootKey)) {  //try to get from cache
                // if(rootKey=='200-years-ago-we-endured-a-year-without-a-summer-0')
                //console.log("QDEBUG 41: CHK try sucess from cache replacementKey:", { rootKey, topic: topic.toJS(), qparams })

                if (typeOfQwiket != 'full')
                    topic = showedHistory.get(rootKey);
                rootOpened = true;
                //inShow = true;
                //if(rootKey=='200-years-ago-we-endured-a-year-without-a-summer-0')
                //	console.log("QGBG 4: BoundQwiket CHK sucess from cache replacementKey:",{rootKey,topic:topic.toJS()})

            }
        }


		/**
		Construct main (level) datum for rendering a root or replaced sub-Qwiket, parent and children data ("datums"). This normalises variations in types of sub-Qwikets
		datum:{
			xid,					//xid
			id,						//post?id:threadid, used to adde comment route
			key,					//postid:id|[threadid:]threadid	
			title,
			description,
			image,
			video, 					//boolean, if known embedded video
			author,
			categoryName,
			publishedTime,
			indicatorIcon  			//Disqus, Qwiket - to display appropriate icon
			opened
		}
		**/
		/**
			Disqus links if not muzzled go immediately to the page and comment with the invalidateContext call first,
			if muzzled - same behavior as Top Level Qwiket - open phase one, .
			Native Qwiket links , 
			if topLevel: (the top-most parent, which is the original story-level Qwiket) have two-phase behavior, on first click - open, on second go 
			to the story using short link (/context/topic/threadid) and invalidateContext.
			otherwise: on click set focus on the Qwiket
		**/
        let reshare = topic.get("reshare") ? topic.get("reshare") : 0;

        const createDatum = (topic, opened, topLevel, muzzled, starColor, relation, levelLink) => {
            reshare = topic.get('reshare');
            const isDisqus = (topic.get("qtype") == 'disqus' || topic.get("type") == 'disqus') && topic.get("body") ? true : false;
            const id = isDisqus ? topic.get("id") : topic.get("threadid");
            const key = isDisqus ? ('postid:' + id) : id;

            const xQwiketType = (topic.get('qtype') == 'disqus' || topic.get('reshare') == 7) ? 'react' : 'story';
            const xQwiketSubtype = (topic.get('qtype') == 'disqus' || topic.get("type") == 'disqus') ? 'disqus' : (reshare == 0 || reshare == 100) ? 'tview' : 'qwiket';
            //	console.log("datumus", { topic: topic.toJS() })
			/**
			xColumnType;
			xQwiketType;
			xQwiketSubtype;

			Links: openLink (show muzzled, show top level),targetLink,levelLink (menu,open the whole qwiket)

			**/
            const xId = xQwiketSubtype == 'disqus' ? topic.get("id") : topic.get("threadid");
            const xKey = xQwiketSubtype == 'disqus' ? ('postid:' + xId) : xId;
            const xOpenLink = (xQwiketType == "react") && !topLevel ? `${routePageLink}/${view}/${routeRootKey}/${key}` : levelLink;
            let xTargetLink = (xQwiketSubtype == 'disqus') ? `${rootTargetLink}/cc/comment-${xId}#comment-${xId}` : xQwiketType == "react" && !topLevel ? `${rootTargetLink}/q/${xId}` : topLevel ? `/context${ch}/topic/${topic.get("threadid")}` : rootTargetLink;
            xTargetLink = xTargetLink.replace(/\/\//g, `/`);
            let xLink = (loud || opened || !topLevel) ? xTargetLink : xOpenLink;
            // if (relation == 'parent')
            //   console.log("XLINK", { opened, loud, xQwiketType, xQwiketSubtype, topLevel, xLink, xTargetLink, xOpenLink })

            const datumQwiketLink = `${routePageLink}/${muzzled ? view : show}/${routeRootKey ? routeRootKey : key}/${key}`;
            let targetLink = isDisqus ? rootTargetLink : `/context${ch}/topic/${topic.get("threadid")}`;
            if (!xLink) {
                xLink = `${routePageLink}/${muzzled ? view : show}/${key}/${key}`;
                // console.log("xTargetLink datum", { topic, topLevel, xTargetLink, typeOfQwiket, xQwiketSubtype, xId, xKey, xOpenLink, xQwiketType, routePageLink, routeRootKey, key, datumQwiketLink, levelLink, targetLink, xLink });

            }
            //if (inShow && relation == 'level' && typeOfQwiket == 'commentStream' && Root.__CLIENT__)
            //if (relation == 'parent')
            //	console.log("Q1GBG 4: createDatum", { targetLink, levelLink, routePageLink, qparams, props: this.props })

            //if(qType!='disqus'&&typeOfQwiket=='commentStream')
            //if(relation=='parent'&&typeOfQwiket=='commentStream')
            //	console.log("QGBG 4: xTargetLink:",{topLevel,reshare,url:topic.get("url"),description:topic.get("description"),xTargetLink,xQwiketSubtype,xLink,xQwiketType})
            //console.log("link 33:", { reshare })
            if ([6, 7, 106, 107].indexOf(+reshare) >= 0) {
                //	console.log("links: topic:",


                //		{ topic: topic.toJS(), datumQwiketLink, targetLink, levelLink, rootTargetLink })
                const url = topic.get("url");
                const s1 = url ? url.split("//") : [];
                const s2 = s1 ? s1[1] : '';
                const s3 = s2 ? s2.split(":")[0] : '';
                //targetLink = `/context${ch}/topic/${s3}/${muzzled ? view : show}/${s3}/q/${key}`;
                //targetLink = `${rootTargetLink}/q/${key}`;
                if (url)
                    targetLink = `/context${ch}/topic/${s3}/q/${key}`;
                else
                    targetLink = `${rootTargetLink}/q/${key}`;
                xLink = targetLink;
                //console.log("QGBG 4: links: targetLink", { reshare, topic: topic ? topic.toJS() : '', datumQwiketLink, targetLink, s3, s2, s1, url, routePageLink, rootTargetLink })
            }
            else if (reshare == 109 || reshare == 59 && typeOfQwiket == 'commentStream') {
                //console.log("stickie links: topic:",topic.toJS(),"datumQwiketLink:",datumQwiketLink,'targetLink:',targetLink,'levelLink:',levelLink,'rootTargetLink:',rootTargetLink)

            }
            const stickie = reshare == 9 || reshare == 59 || reshare == 109;
            const link = isDisqus ? (muzzled ? null : `${targetLink}/cc/comment-${id}#comment-${id}`) :
                topLevel ? (opened ? targetLink : levelLink) : relation == 'level' ? (stickie ? targetLink : targetLink) : datumQwiketLink;
            //if (relation == 'parent')
            //	console.log("LINK:", { rootId, link, targetLink, xTargetLink, xLink, reshare, })
            if (stickie && typeOfQwiket == 'commentStream') {
                // console.log({ "stickie links link": link, 'topLevel': topLevel, 'relation': relation })

            }
            // if (relation == 'parent')
            //   console.log("QGBG: parent_summary QGBG link:", link, datumQwiketLink, routePageLink, 'muzzled:', muzzled)
            const onClick = () => {
                //console.log(" setTop onClick invalidateContext:", { topic: topic.toJS(), isDisqus, topLevel })
                if (isDisqus) {
                    if (muzzled) {
                        if (!showedHistory.has(key)) {
                            showedHistory = showedHistory.set(key, topic);
                            updateQwiketState(rootXid, { showedHistory });
                        }
                    }
                    else {
                        //console.log("invalidateContext:",topic.toJS())
                        invalidateContext(true, topic.get("category"), topic.get("threadid"));
                        //console.log("setTop1")
                        window.setTop = true;

                    }
                }
                else if ([6, 7, 106, 107].indexOf(topic.get("reshare")) >= 0) {
                    //console.log("onClick invalidateContext: reshare==7",{topic:topic.toJS(),isDisqus,topLevel})

                    if (muzzled) {
                        if (!showedHistory.has(key)) {
                            showedHistory = showedHistory.set(key, topic);
                            updateQwiketState(rootXid, { showedHistory });
                        }
                    }
                }
                else if (topLevel) {
                    //console.log("QGBG link onClick topLevel", { opened, loud, link: topic.get("link") });
                    if (opened || loud) {
                        //console.log("QGBG link onClick opened", "cat:", topic.get("cat"), 'threadid:', topic.get("threadid"), 'topic:', topic ? topic.toJS() : 'no topic');
                        invalidateContext(true, topic.get("cat"), topic.get("threadid"), topic);
                        //console.log("setTop2")
                        window.setTop = true;
                    }
                    else {
                        if (!showedHistory)
                            showedHistory = new Immutable.Map();
                        //	console.log("QGBG link onClick not opened", showedHistory);

                        //cache the topic, so it becomes an opened
                        if (!showedHistory.has(key)) {
                            //
                            showedHistory = showedHistory.set(key, topic);
                            //	console.log("QGBG UPDATE_QWIKET_STATE link onClick not cached", rootXid, key, topic.toJS());

                            updateQwiketState(rootXid, { showedHistory });
                        }
                        else {
                            //console.log("QGBG link onClick cached",showedHistory);

                        }
                    }
                }
                else {
                    //do nothing, we are staying on the same page
                    //console.log("QGBG link onClick not topLevel");
                    //console.log("onClick invalidateContext: else",{topic:topic.toJS(),isDisqus,topLevel})

                    if (opened) {
                        //console.log("QGBG link onClick not topLevel opened","cat:",topic.get("cat"),'threadid:',topic.get("threadid"),'topic:',topic?topic.toJS():'no topic');
                        invalidateContext(true, topic.get("cat"), topic.get("threadid"), topic);
                        window.setTop = true;
                        //	console.log("setTop3")
                    }
                }
            }
            const bodyRec = isDisqus ? u.sanitizeDisqus(topic.get("body")) : null;
            let description;
            let isTwitter = false;
            if (isDisqus && bodyRec) {
                description = bodyRec.body;
                isTwitter = bodyRec.isTwitter;
            }
            else {
                description = topic.get("description");
                const descr_limit = typeOfQwiket == 'full' ? 14096 : (opened) ? 256 : 256;
                description = description ? description.substring(0, descr_limit) + (description.length >= descr_limit ? '...' : '') : '';
                if (!description)
                    description = "";


                //descr=descr.replaceAll('<p>','').replaceAll('</p>','')
            }
            description = description.replaceAll('<p> </p>', '');
            let body = (typeOfQwiket == 'full' && !isDisqus && topic.get("body")) ? topic.get("body") : null;
            let sticky = body ? true : false;
            //if (relation == 'parent' && inShow)
            //	console.log("QGBG: parent_summary QGBG BoundQwiket createDatum", { topic: topic.toJS(), opened, topLevel, muzzled, starColor, relation, typeOfQwiket })
            return Immutable.fromJS({
                xid: topic.get("xid"),
                threadid: id,
                rootThreadid,
                key,
                body,
                noDraftOrShort: colorBorder,
                title: isDisqus || !topic.get("title") ? '' : topic.get("title").replace('NRO Is Moving to Facebook Comments', 'La Cantina'),
                description: muzzled ? 'Muzzled... Click to view.' : description,
                image: isDisqus ? '' : topic.get("image"),
                image_src: isDisqus ? '' : topic.get("image_src"),
                author: isDisqus ? topic.get("author_name") : topic.get("author") ? topic.get("author") : topic.get("catName") ? topic.get("catName") : topic.get("cat_name"),
                authorAvatar: isDisqus ? (topic.get("author_avatar") ? topic.get("author_avatar") : topic.get("avatar")) : topic.get("catIcon") ? topic.get("catIcon") : topic.get("cat_icon"),
                publishedTime: isDisqus ? topic.get("createdat") : topic.get("published_time"),
                categoryName: topic.get("site_name") ? topic.get("site_name") : isDisqus ? (rootTopic.get("cat_name") ? rootTopic.get("cat_name") : rootTopic.get("author_name")) : topic.get("catName") ? topic.get("catName") : topic.get("cat_name"),
                categoryIcon: isDisqus ? (topic.get("cat_icon") ? topic.get("cat_icon") : topic.get("avatar")) : topic.get("catIcon") ? topic.get("catIcon") : topic.get("cat_icon"),
                video: isDisqus ? null : topic.get("video"),
                indicatorIcon: isDisqus ? "https://c.disquscdn.com/next/c393ff4/marketing/assets/img/brand/disqus-social-icon-blue-white.svg" : (Root.__STORY__ ? "http://dev.qwiket.com" : "") + "/static/css/blue-bell.png",
                url: topic.get("url"),
                cat: topic.get("cat"),
                channel,
                link: xLink,
                targetLink: xTargetLink,
                opened,
                approver,
                onClick,
                starColor,
                topLevel,
                relation,
                stickie,
                edit: topic.get("edit"),
                typeOfQwiket,
                isMarkdown: !(isDisqus || !stickie),
                isTwitter,
                reshare: reshare,
                childrenCount: +topic.get("children"),
                sharedBy: (typeOfQwiket == 'commentStream' ? null : topic.get('s_un')),


            })
        };
		/**
		Level:
		**/
        //console.log("RENDER LEVEL", topic.toJS())
        const { role, rule } = topic.get("d4status") ? topic.get("d4status").toJS() : {};
        //console.log("RENDER LEVEL2", topic.toJS())
        const ruleAction = rule && rule.status == 1 ? +rule.action : 0;
        let subscr_status = topic.get("subscr_status");
        if (!subscr_status)
            subscr_status = 0;
        let starColor = null;
        switch (+subscr_status) {
            case 1:
                starColor = green700;
                break;
            case 2:
                starColor = indigo900;
                break;
            case 3:
                starColor = blueGrey200;
                break;
            case 4:
                starColor = amber900;
                break;
            case 5:
                starColor = red900;
        }
        const levelTopLevel = topic.get("url") ? topic.get("url").indexOf('q://') < 0 : !topic.get("url") && (topic.get("qtype") != 'disqus') ? true : false
        const levelIsDisqus = (topic.get("qtype") == 'disqus') && (topic.get("body") ? true : false);
        const levelId = levelIsDisqus ? topic.get("id") : topic.get("threadid");
        const levelKey = levelIsDisqus ? ('postid:' + levelId) : levelId;

        const replyLink = levelIsDisqus ? null : `${routePageLink}/qedit/__new/${replyRootThreadid}/${levelKey}`;
        const likeLink = `${routePageLink}/qlike/${levelKey}`;
        const shareLink = `${routePageLink}/qshare/${routeRootKey}/${levelKey}`;
        const levelLink = `${routePageLink}/${show}/${levelKey}/${levelKey}`;
        const flagLink = `${routePageLink}/qflag/${levelIsDisqus ? topic.get("author_username") : topic.get("username")}/${levelKey}`;
        //if (rootOpened)
        //	console.log("rootOpened:", { levelId })
        const levelQwiket = createDatum(topic, rootOpened || levelTopLevel && typeOfQwiket == 'full' || firstRow && columnType == 'newsline', levelTopLevel, !rootOpened && !forceShow && ruleAction > 2, starColor, 'level', levelLink);
        //if(columnType=='disqus')
        //if(levelId=='north-korea-to-us-change-your-political-calculation-or-we-re-back-to-testing-nukes-and-missiles-1')
        //console.log("qq replyLink QGBGD BoundQwiket created levelQwiket:", { routePageLink, rootTargetLink, levelTopLevel, levelIsDisqus, levelId, levelKey, replyLink, levelLink, levelQwiket: levelQwiket.toJS(), topic: topic.toJS() })
        //if(levelId=='north-korea-to-us-change-your-political-calculation-or-we-re-back-to-testing-nukes-and-missiles-1')
        //	console.log("qq replyLink1:",{replyLink,description:topic.get("description")});

        //if(typeOfQwiket=='full')
        //console.log("QGBG links:replyLink:",replyLink,"likeLink:",likeLink,levelIsDisqus)
		/**
		Children:
		**/
        //if (typeOfQwiket == 'full')
        //	console.log("catedit level: ", { reshare, levelQwiket: levelQwiket.toJS(), rootThreadid })

        let childrenQwikets = null;
        let children_summary = topic.get("children_summary");
        const showChildren = inShow || rootOpened;
        //if(columnType=='disq-tids'&&rootOpened)
        //	if (topic.get("title").indexOf('Reducing Immigration') >= 0)
        //	console.log("Q1GBG : ", { rootThreadid, columnType, rootOpened, typeOfQwiket, showChildren, children_summary, inShow })
        let replyTo = null;
        if (children_summary && showChildren) {
            //console.log("Q1GBG inside children", { rootThreadid, children_summary: children_summary.toJS() })

            children_summary = children_summary.sort(function (lhs, rhs) { if (!lhs || !rhs) return 0; return +lhs.get('published_time') < +rhs.get('published_time') });

            childrenQwikets = children_summary.map((p, i) => {
                if (!p)
                    return null;
                //	console.log("Q1GBG inside map",{p:p.toJS(),i,rootThreadid})
                const isDisqus = (p.get("qtype") == 'disqus' || p.get("type") == 'disqus') && p.get("body") ? true : false;
                const id = isDisqus ? p.get("id") : p.get("threadid");
                const key = isDisqus ? ('postid:' + id) : id;
                //console.log("QDBG: key:",key);
                const { role, rul } = p.get("d4status") ? p.get("d4status").toJS() : {};
                const ruleAction = rule && rule.status == 1 ? +rule.action : 0;
                let opened = showedHistory ? showedHistory.get(key) : false;
                //if(!rootOpened&&!opened)
                //	return null;
                //	console.log("Q1GBG cs: children adding item", p.toJS(), 'opened:', opened);
                if (p.get("reshare") > 50 && p.get("reshare") < 60) {
                    //console.log("replyTo ", { p })
                    replyTo = p;
                    return null;
                }
                return createDatum(opened ? opened : p, opened ? true : false, false, !opened && ruleAction > 2, null, 'child');
            })
        }

		/**
		Parents:
		**/
        let parentQwikets = null;
        let parent_summary = topic.get("parent_summary") ? topic.get("parent_summary") : Immutable.fromJS([]);
        const showParents = typeOfQwiket == 'commentStream' || rootOpened && typeOfQwiket != 'full';
        //if (inShow)
        //  console.log("DMP", { typeOfQwiket, parent_summary: parent_summary ? parent_summary.toJS() : '', rootIsDisqus, showParents, rootOpened })
        if (rootIsDisqus) {
            //if(columnType=='story-qwikets')
            // console.log("QGBG adding topLevel parent to disq comment, columnType:", columnType, "headless:", headless)
            //Add Top Level pseudo-Qwiket
            parent_summary = parent_summary.push(Immutable.fromJS({
                type: 'tview',
                author: topic.get("thread_author"),
                title: topic.get("thread_title"),
                image: topic.get("thread_image"),
                description: topic.get("description"),
                threadid: topic.get("threadid"),
                cat_name: topic.get("cat_name"),
                cat_icon: topic.get("cat_icon"),
                published_time: topic.get("published_time")
            }));
        }
        if (parent_summary && showParents) {
            //console.log("QGBG: parent_summary 0 adding item", { parent_summary: parent_summary.toJS() });

            parentQwikets = parent_summary.reverse().map((p, i) => {
                //console.log("QGBG: parent_summary 1 adding item", p.toJS());

                if (i == 0 && headless) // do not show the Top Level Qwiket when it is implied by the context
                    return null;
                //console.log("QGBG: parent_summary 2 adding item", p.toJS());

                const isDisqus = (p.get("qtype") == 'disqus' || p.get("type") == 'disqus') && p.get("body") ? true : false;
                const id = isDisqus ? p.get("id") : p.get("threadid");
                const key = isDisqus ? ('postid:' + id) : id;

                const { role, rule } = p.get("d4status") ? p.get("d4status").toJS() : {};
                const ruleAction = rule && rule.status == 1 ? +rule.action : 0;
                let opened = showedHistory ? showedHistory.get(key) : false;
                //console.log("xlink showedHistory", { showedHistory: showedHistory ? showedHistory.toJS() : '' })
                if (i > 0 && !rootOpened && !opened)
                    return null;
                //if(i==0&&columnType=='disqus')
                //if(columnType=='story-qwikets')
                //console.log("QGBG: parent_summary 3 adding item", { key, p: p.toJS(), opened, opened_p: opened ? opened.toJS() : p.toJS() });

                const parentDatum = createDatum(opened ? opened : p, opened ? true : false, i == 0 ? true : false, !opened && ruleAction > 2, null, 'parent');
                //console.log("DATUM:", { parentDatum: parentDatum.toJS() });
                //if(i==0&&columnType=='disqus')
                //if(columnType=='story-qwikets')
                //if(i!=0)
                //	console.log("QGBG: parent_summary->>>datum",parentDatum.toJS());
                //console.log("QGBG: parent_summary 4 adding item", p.toJS(), 'opened:', opened, opened ? opened : p);

                return parentDatum;
            })
        }
        //console.log("QGBG BoundQwiket Render End parents:",parentQwikets?parentQwikets.toJS():'')
        //if(levelId=='north-korea-to-us-change-your-political-calculation-or-we-re-back-to-testing-nukes-and-missiles-1')
        //	console.log("qq replyLink2:",{replyLink,description:topic.get("description")});
        return (
            <ErrorBoundary data-id="error-boundary">
                <QwiketFamily
                    data-id="qwiket-family"
                    inShow={inShow}
                    level={levelQwiket}
                    children={childrenQwikets}
                    parents={parentQwikets}
                    levelLink={levelLink}
                    replyLink={replyLink}
                    replyid={levelKey}
                    likeLink={likeLink}
                    shareLink={shareLink}
                    flagLink={flagLink}
                    date={rootDate}
                    colorBorder={colorBorder}
                    globals={globals}
                    channel={channel}
                    session={session}
                    meta={meta}
                    zoom={zoom}
                    approver={approver}

                    itemAction={actions.itemAction}
                    unpublishQwiket={actions.unpublishQwiket}
                    updateOnlineState={actions.updateOnlineState}
                    lazy={qparams.lazy}

                    context={context}
                    test={test}
                    actions={actions}
                    replyTo={replyTo}
                    columnType={columnType}
                />
            </ErrorBoundary>

        )
    }
}
QwiketItem.propTypes = {
    topic: PropTypes.object.isRequired,
    updateQwiketState: PropTypes.func.isRequired, //(xid,updatePOJSO)
    globals: PropTypes.object.isRequired,
    online: PropTypes.object.isRequired,
    baseThreadid: PropTypes.string,
    rootThreadid: PropTypes.string,
    channel: PropTypes.string,
    columnType: PropTypes.string, 				//feed,story-qwikets, disq-tids,sticky-qwikets,story-stickies,comments,newsline,context
    showQwiket: PropTypes.object,
    forceShow: PropTypes.bool,
    qparams: PropTypes.object,

    updateOnlineState: PropTypes.func.isRequired
};
function mapStateToProps(state) {
    return {
        context: state.context,
        session: state.session,
        online: state.user,
        globals: state.app.get("globals"),
        app: state.app,
        newslineMaskMap: state.app.get("newslineMaskMap"),
        showQwiket: state.context.get("showQwiket"),

    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            updateOnlineState, unpublishQwiket, itemAction, fetchStoryQwikets, fetchShowQwiket, invalidateContext, requestIcon,
            localUpdateQwiket, createQwiket, saveQwiket, publishQwiket, unpublishQwiket, fetchDraftChildQwiket
        }, dispatch)
    }
}
QwiketItem = connect(mapStateToProps, mapDispatchToProps)(QwiketItem);
