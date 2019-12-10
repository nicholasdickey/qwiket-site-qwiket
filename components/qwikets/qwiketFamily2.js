/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
//Replaces Qwiket in qwikets.js
import React, { Component } from "react";
import $ from "jquery";
import PropTypes from "prop-types";
import { withTheme } from '@material-ui/core/styles';
import Immutable from "immutable";

import ReactHoverObserver from "react-hover-observer";
import Tooltip from "@material-ui/core/Tooltip";
//MaterialUI:
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//import IconButton from '@material-ui/core/IconButton';
import IconButton from "@material-ui/core/IconButton";
//import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
//import ReactTooltip from 'react-tooltip'
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import NewspaperIcon from "mdi-material-ui/Newspaper";
import Heart from "mdi-material-ui/HeartOutline";
import ReadArticle from "mdi-material-ui/BookOpen";
import FlagRemove from "mdi-material-ui/FlagOutline";
import ShareVariant from "mdi-material-ui/ShareVariant";
import Dots from "mdi-material-ui/DotsHorizontal";
import Reply from "mdi-material-ui/Reply";
import Replies from "mdi-material-ui/CommentMultipleOutline";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";

import QwiketRenderer from "./qwiketRenderer";
import { QwikieEditor } from "./qwiketComment";
//import { blueGrey800, blueGrey400, grey700, blueGrey100, grey200, cyan600, blueGrey200, blueGrey600, lightGreen50, lime50, yellow50, yellow500, green500, green50, amber50, amber500 } from 'material-ui/styles/colors';
import yellow from "@material-ui/core/colors/yellow";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";
import indigo from "@material-ui/core/colors/indigo";
import grey from "@material-ui/core/colors/grey";
import blueGrey from "@material-ui/core/colors/blueGrey";
import blue from "@material-ui/core/colors/blue";

import MediaQuery from "react-responsive";
import { ssRoutes } from '../../qwiket-lib/routes'
let { Link, Router } = ssRoutes;
import u from "../../qwiket-lib/lib/utils";
import Root from "window-or-global";

//import { red900, green700, grey50, indigo900, amber900 } from 'material-ui/styles/colors';

import Scroll from "react-scroll";
//import { Tooltip, OverlayTrigger } from 'react-bootstrap/lib';
//import IconButton from '@material-ui/core/IconButton';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ChevronDown from "mdi-material-ui/ChevronDown";
import ChevronUp from "mdi-material-ui/ChevronUp";
import Star from "mdi-material-ui/Star";
import StarOutline from "mdi-material-ui/StarOutline";
import ZoomIn from "mdi-material-ui/MagnifyPlusOutline";
import ZoomOut from "mdi-material-ui/MagnifyMinusOutline";
import animateScrollTo from "animated-scroll-to";
import CommentOutline from "mdi-material-ui/CommentOutline";
import Comment from "mdi-material-ui/Comment";
const yellow500 = yellow[500];
const green500 = green[500];
const amber500 = amber[500];
const red900 = red[900];
const green700 = green[700];
const grey50 = grey[50];
const indigo900 = indigo[900];
const amber900 = amber[900];
const allowedTypes = [
    "html",
    "heading",
    "text",
    "paragraph",
    "break",
    "blockquote",
    "list",
    "listItem",
    "code",
    "delete",
    "strong",
    "emphasis",
    "link",
    "image"
];
/* A function that splits a string `limit` tiGLymes and adds the remainder as a final array index.
 * > var a = 'convoluted.madeup.example';
 * > a.split('.', 1);
 * < ['convoluted']
 * // What I expected:
 * < ['convoluted', 'madeup.example']
 */
function split(str, separator, limit) {
    str = str.split(separator);

    if (str.length > limit) {
        var ret = str.splice(0, limit);
        ret.push(str.join(separator));

        return ret;
    }

    return str;
}
function innerX({ html, token, insert, order, level }) {
    //console.log("catedit innerX begin:",{html,token,insert,order,level});
    if (!level) level = 0;
    let w = split(html, token, 1);
    if (w.length == 1) {
        //console.log('catedit cc77 exit',{html,level,w,token,insert,order});
        return html;
    }
    const s = w[0];
    //console.log('catedit cc77 ',{level,s,w,html,token,insert,order})
    const pre = s + (order == "pre" ? insert : "");
    const post = order == "post" ? insert : "";
    const inner = innerX({ html: w[1], token, insert, order, level: level + 1 });
    //console.log("catedit innerX end:",{s,html,token,insert,order,level,pre,post,inner});

    return pre + token + post + inner;
}
function getTextNodesIn(node, includeWhitespaceNodes) {
    var textNodes = [],
        whitespace = /^\s*$/;

    function getTextNodes(node) {
        if (!node) return;
        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
                textNodes.push(node);
            }
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                getTextNodes(node.childNodes[i]);
            }
        }
    }

    getTextNodes(node);
    return textNodes;
}
const x = (html, isZoom, image) => {
    if (Root.__CLIENT__) {
        html = innerX({
            html,
            token: "<blockquote",
            insert: `<div class="${isZoom ? "zoom" : "normal"}-wrapper">`,
            order: "pre"
        });
        //console.log("catedit 11",html)
        html = innerX({
            html,
            token: "</blockquote>",
            insert: "</div>",
            order: "post"
        });
        //console.log("catedit 12",html)
        let v = $("<div/>")
            .html(html)
            .contents();
        //v.find(`style`).remove();
        v.find(`img[src*="${image}"]`).remove();
        //v.find('.twitter-tweet').remove();
        v.find(`img:not([src])`).each(function () {
            const dataSrc = $(this).attr("data-src");
            if (dataSrc) $(this).attr("src", dataSrc);
        });
        v.find("img").each(function () {
            let img = $(this).attr("src")
                ? $(this)
                    .attr("src")
                    .split("?")[0]
                : "";
            let img2 = image ? image.split("?")[0] : "";
            const w = img2.split("//");
            if (w && w.length > 1) img2 = w[1];
            //console.log("catedit img:",{img,img2})
            if (img.indexOf(img2) >= 0) {
                //console.log("catedit img remove",img);
                $(this).remove();
            }
        });
        v.find("blockquote").wrap(
            `<div class="${isZoom ? "zoom" : "normal"}-wrapper"></div>`
        );
        v.find("img").wrap(
            `<div class="${isZoom ? "zoom" : "normal"}-wrapper"></div>`
        );
        v.find("iframe").wrap(
            `<div class="${isZoom ? "zoom" : "normal"}-iframe-wrapper"></div>`
        );

        var textnodes = getTextNodesIn(v.find("#markdown-shell")[0]);
        for (var i = 0; i < textnodes.length; i++) {
            if (
                $(textnodes[i])
                    .parent()
                    .is("'#markdown-shell")
            ) {
                $(textnodes[i]).wrap("<p>");
            }
        }

        html = $("<div />")
            .append(v.clone())
            .html();
        return html;
    } else return html;
};

export class QwiketMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { anchorEl: null };
    }

    render() {
        const {
            qwiketid,
            icon,
            editLink,
            stickie,
            published,
            un,
            deleteLink,
            history,
            reshare,
            updateOnlineState
        } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        const handleClick = event => {
            this.setState({ anchorEl: event.currentTarget });
        };

        const handleClose = () => {
            this.setState({ anchorEl: null });
        };

        const options = stickie
            ? published
                ? ["Edit", "Unpublish"]
                : ["Edit", "Delete"]
            : reshare == 7
                ? ["Edit", "Delete"]
                : ["Edit", "Unpublish"];

        return (
            <div>
                <IconButton
                    aria-label="Qwiket Action Menu"
                    aria-owns={open ? "q-menu" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick.bind(this)}
                >
                    {icon}
                </IconButton>
                <Menu
                    id="q-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose.bind(this)}
                >
                    {options.map(option => (
                        <MenuItem
                            classes={{ root: "menu-item" }}
                            key={option}
                            onClick={() => {
                                console.log("handleSelect:", option);

                                switch (option) {
                                    case "Edit":
                                        updateOnlineState(
                                            { qedit: true, qeditQwiketid: qwiketid },
                                            true
                                        );
                                        //console.log("pushing ", editLink)
                                        //Router.push(editLink);
                                        break;
                                    case "Unpublish":
                                        un(0);
                                        break;
                                    case "Delete":
                                        un(1);
                                        break;
                                }
                                this.setState({ anchorEl: null });
                            }}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}

export class QwiketFamily extends Component {
    constructor(props) {
        super(props);
        //  console.log("LONG: construct");
        // if(props.level.get("typeOfQwiket")=='full')
        // console.log("LONG: init false");
        this.state = {
            openReply: false,
            long: true,
            z: ""
        };
    }
    componentWillMount() {
        const full = this.props.level ? this.props.level.get("typeOfQwiket") == "full" : 0;
        /*if(full&&Root.__CLIENT__){
                console.log("SHOULD SCROLL UP0")
                animateScrollTo(320);
            }*/
    }
    shouldComponentUpdate(nextProps, nextState) {
        const props = this.props;
        //if(props.full)
        const ret = nextProps != props || this.state != nextState;
        //if(props.full)
        //	console.log("QGBG Qwiket: shouldComponentUpdate ret=",ret);
        return ret;
    }
    componentWillReceiveProps(nextProps, nextState) {
        //console.log("LONG: componentWillReceiveProperties ", nextProps);
        if (nextProps.level != this.props.level) {
            //console.log("LONG: new level:",nextProps.level.toJS())
            if (nextProps.level.get("typeOfQwiket") == "full") {
                if (
                    nextProps.level.get("threadid") != this.props.level.get("threadid")
                ) {
                    this.setState({ long: false });
                    //console.log("SHOULD SCROLL UP",{nextThreadid:nextProps.level.get("threadid"),prevThreadid:this.props.level.get("threadid")})
                    //	animateScrollTo(320);
                }
            }
        }
        if (nextProps != this.props) {
            //	if(nextProps.level.get("typeOfQwiket")=='full')
            //this.setState({long:false});
        }
    }

    render() {
        let {
            actions,
            replyTo,
            columnType,
            updateOnlineState,
            fullScreen,
            inShow,
            noDraftOrShort,
            level,
            children,
            parents,
            levelLink,
            replyLink,
            replyid,
            likeLink,
            shareLink,
            flagLink,
            date,
            colorBorder,
            session,
            meta,
            history,
            approver,
            zoom,
            channel,
            itemAction,
            unpublishQwiket,
            updateOnllineState,
            lazy,
            test,
            online,
            theme,
            topParent
        } = this.props;
        let globals = session;
        if (test) approver = 1;
        //  console.log("QwiketFamily", { columnType })
        //console.log("SUP QWIKET",{test,approver})
        //if (inShow)
        //console.log(" Qwiket: render: level:", level, 'meta:', meta)
        if (!level)
            return <div />
        //	console.log("QWIKET", { approver });
        const width = u.width(session);
        let loud = width > 900 ? +session.get("loud") : 1;
        const embed = level.get("typeOfQwiket") == "embed";
        const draft = level.get("reshare") == "59";
        const short = level.get("reshare") == "7";
        //console.log("DRAFT:",draft,level.get("reshare"));
        const qwiketOpened = level.get("opened");
        function update(b) {
            try {
                setTimeout(() => window.twttr.widgets.load(), 500);
                lazy.update();
            } catch (x) {
                console.log(x);
            }
            this.setState({ long: b });
        }
        let rows = [];
        const state = this.state;
        if (!meta) {
            if (parents) {
                // console.log("QGBG Qwiket:: add parent row", datum)
                const parentRows = parents.map((datum, i) => {
                    if (!datum) return null;
                    // console.log("QGBG map parent", i, datum.toJS());
                    let onClick = datum.get("onClick");
                    //return <SubQwiket test={test} updateOnlineState={updateOnlineState} itemAction={itemAction} unpublishQwiket={unpublishQwiket} long={state.long} doLong={update.bind(this)} key={"subqwiket-parents" + i} datum={datum} inShow={inShow} channel={channel} globals={globals} session={session} history={history} approver={approver} zoom={zoom} /> })
                    return (
                        <div onClick={() => onClick(topParent)}>
                            <QwiketRenderer
                                subtype={"parent"}
                                test={test}
                                updateOnlineState={updateOnlineState}
                                itemAction={itemAction}
                                unpublishQwiket={unpublishQwiket}
                                long={state.long}
                                key={"subqwiket-parents" + i}
                                topic={datum}
                                inShow={inShow}
                                channel={channel}
                                globals={globals}
                                session={session}
                                approver={approver}
                                state={state}
                                loud={loud}
                                zoom={zoom}
                                link={datum.get("link")}
                                onClick={() => onClick(topParent)}
                                setLong={val => updateOnlineState({ long: val }, true)}
                                long={state.long}
                                qwiketOpened={qwiketOpened}
                                type={columnType}

                            /></div >
                    );
                });
                // console.log("after map --->>")
                rows = rows.concat(parentRows);
            }
            /*	const levelRow = <SubQwiket test={test} updateOnlineState={updateOnlineState} itemAction={itemAction} unpublishQwiket={unpublishQwiket} long={state.long} doLong={update.bind(this)}
              	
                      doZoom={(z) => {
                              if (z != 'zz') {
                                  this.setState({ z: 'zz' });
                                  setTimeout(() => window.twttr.widgets.load(), 500);
                              }
                              else {
                                  this.setState({ z: '' });
                                  linkPush(levelLink, true);
                              }
                          }}
                          key="subqwiket-level" datum={level} inShow={inShow} globals={globals} session={session} history={history} levelLink={levelLink} approver={approver} channel={channel} zoom={this.state.z} />
                          */
            let onClick = level.get("onClick");
            const levelRow = (
                <QwiketRenderer
                    subtype={"level"}
                    state={state}
                    test={test}
                    updateOnlineState={updateOnlineState}
                    itemAction={itemAction}
                    unpublishQwiket={unpublishQwiket}
                    long={state.long}
                    key="subqwiket-level"
                    topic={level}
                    inShow={inShow}
                    globals={session}
                    session={session}
                    levelLink={levelLink}
                    approver={approver}
                    channel={channel}
                    loud={loud}
                    zoom={this.state.z}
                    link={level.get("link")}
                    onClick={() => { console.log("family onClick"); onClick(topParent) }}
                    setLong={val => updateOnlineState({ long: val }, true)}
                    long={this.state.long}
                    qwiketOpened={qwiketOpened}
                    type={columnType}
                />
            );

            rows.push(levelRow);
            //	console.log("QGBG Qwiket:: add level: ",level,'rows:',rows);
            let replyTopic = null;

            if (children) {
                children = children.sort(function (lhs, rhs) {
                    if (!lhs || !rhs) return 0;
                    const lhsTime = +lhs.get("publishedTime")
                        ? +lhs.get("publishedTime")
                        : +lhs.get("published_time");
                    const rhsTime = +rhs.get("publishedTime")
                        ? +rhs.get("publishedTime")
                        : +rhs.get("published_time");
                    //
                    //  console.log("COMPARE", { lhs: lhs.toJS(), rhs: rhs.toJS() });
                    if (lhsTime > rhsTime) { return -1; }
                    if (lhsTime < rhsTime) { return 1; }
                    if (lhsTime === rhsTime) { return 0; }
                });

                const childRows = children.map((datum, i) => {
          /*console.log("QGBG map child",i);*/ if (!datum) return null;
                    let onClick = datum.get("onClick");
                    //return <SubQwiket test={test} updateOnlineState={updateOnlineState} itemAction={itemAction} unpublishQwiket={unpublishQwiket} long={state.long} doLong={update.bind(this)} key={"subqwiket-children" + i} datum={datum} inShow={inShow} globals={globals} channel={channel} session={session} history={history} approver={approver} zoom={zoom} /> });
                    if (
                        !datum.get("reshare") ||
                        datum.get("reshare") >= 100 ||
                        datum.get("reshare") < 50
                    ) {
                        return (
                            <QwiketRenderer
                                subtype={"child"}
                                state={state}
                                test={test}
                                updateOnlineState={updateOnlineState}
                                itemAction={itemAction}
                                unpublishQwiket={unpublishQwiket}
                                long={state.long}
                                key={"subqwiket-children" + i}
                                topic={datum}
                                inShow={inShow}
                                globals={session}
                                channel={channel}
                                session={session}
                                approver={approver}
                                zoom={zoom}
                                link={datum.get("link")}
                                onClick={() => onClick(topParent)}
                                setLong={val => updateOnlineState({ long: val }, true)}
                                long={online.get("long")}
                                qwiketOpened={qwiketOpened}
                                type={columnType}
                            />
                        );
                    } else {
                        console.log("$$$$$$$$$$$$  ReplyTopic", { o: o.toJS() });
                        replyTopic = o;
                        return null;
                    }
                });

                //console.log("QGBG Qwiket:: add child rows:",rows,'childRows:',childRows);
                rows = rows.concat(childRows);
                //console.log("QGBG Qwiket:: add child rows after concat",rows);
            }
        } else {
            //TBD: meta Qwikets - refs, src, messages
        }
        const muiTheme = theme;
        theme = +globals.get("theme");
        const palette = muiTheme.palette;
        //console.log("PALETTE", palette)
        const textColor = palette.text.primary;
        const bg = palette.background;

        let border = 0;
        // const theme=u.theme();
        const brd = theme ? "#ccc" : "#444";
        let sg = brd;
        let d = (Date.now() / 1000) | 0;
        let df = d - date;
        border = 1;
        if (colorBorder) {
            if (df < 3600) {
                sg = green500;
                border = 1;
            } else if (df < 4 * 3600) {
                sg = amber500;
                border = 1;
            } else if (df < 8 * 3600) {
                sg = yellow500;
                border = 1;
            } else {
                sg = brd;
                border = 1;
            }
        }
        //if(level.get("typeOfQwiket")=='full')
        //	console.log("QGBGA Qwiket: full:",full,"approver",approver, "RENDER end",level.toJS(),inShow&&(level.get("typeOfQwiket")!='full'),rows)
        const full = level.get("typeOfQwiket") == "full";
        //console.log("qwiket full:", full)
        let isZoom = false;
        if (full) {
            isZoom = state.z == "zz" || zoom == "zz";
            if (isZoom && state.z != "zz") {
                this.setState({ z: "zz" });
                if (Root.__CLIENT__) setTimeout(() => window.twttr.widgets.load(), 500);
            }
            //console.log("ZOOM:", { isZoom, zoom });
        }

        //if (level.get("threadid") == 'north-korea-to-us-change-your-political-calculation-or-we-re-back-to-testing-nukes-and-missiles-1')
        //	console.log("qq replyLink3:", { replyLink, description: level.get("description") });
        //console.log("QWIKET RENDER ",{inShow,full,embed,meta})
        const InnerQwiket = [];
        InnerQwiket.push(
            <div
                className="q-inner-qwiket"
                style={
                    embed
                        ? { width: "100%", border: "solid thin grey" }
                        : {
                            marginTop: 6,
                            position: "relative",
                            borderTop:
                                border && !full
                                    ? "solid thin " + sg
                                    : full
                                        ? null
                                        : "solid thin " + brd,
                            borderLeft:
                                border == 1 && !full
                                    ? "solid thin " + sg
                                    : full
                                        ? null
                                        : "solid thin " + brd,
                            borderRight:
                                !colorBorder && !full
                                    ? "solid thin " + sg
                                    : full
                                        ? null
                                        : "solid thin " + brd,
                            borderBottom:
                                colorBorder && !full
                                    ? "solid thin " + sg
                                    : full
                                        ? null
                                        : "solid thin " + brd,
                            borderWidth: 1,
                            paddingBottom: 0,
                            marginRight: 8,
                            // marginLeft: 4,
                            paddingTop: 5,
                            backgroundColor:
                                inShow && level.get("typeOfQwiket") != "full"
                                    ? theme
                                        ? draft
                                            ? null
                                            : "#f1f8fe"
                                        : draft
                                            ? "#666"
                                            : "#333"
                                    : draft
                                        ? null
                                        : null
                        }
                }
            >
                <div data-id="i2-qwiket" style={{ margin: 8 }}>
                    <ReactHoverObserver>
                        {({ isHovering: isHoveringListItem }) => (
                            <div
                                data-id="i3-qwiket"
                                style={{
                                    backgroundColor:
                                        isHoveringListItem && !full && !embed && !isZoom
                                            ? theme
                                                ? draft
                                                    ? "#ddd"
                                                    : "#F1F8FE"
                                                : draft
                                                    ? "#666"
                                                    : "#202024"
                                            : draft
                                                ? theme
                                                    ? "#ffffea"
                                                    : "#111108"
                                                : null,
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%"
                                }}
                            >
                                {rows}
                                {!full && !embed && !meta && !inShow && !level.get("opened") ? (
                                    <div data-id="w1">
                                        <ReactHoverObserver>
                                            {({ isHovering }) => (
                                                <a><Link data-id="dots-link" route={levelLink}>
                                                    <div
                                                        style={{
                                                            fontSize: "1.0rem",
                                                            height: 30,
                                                            paddingTop: 4,
                                                            opacity: isHovering ? 1.0 : 0.7,
                                                            marginTop: 0,
                                                            display: "flex",
                                                            justifyContent: "center"
                                                        }}
                                                    >
                                                        {isHovering ? (
                                                            <Dots style={{ color: textColor, height: 24 }} />
                                                        ) : (
                                                                <Dots style={{ color: textColor, height: 24 }} />
                                                            )}
                                                    </div>
                                                </Link></a>
                                            )}
                                        </ReactHoverObserver>
                                    </div>
                                ) : state.openReply && inShow ? (
                                    <div data-id="in-place-reply">
                                        <QwikieEditor
                                            replyTopic={replyTo}
                                            columnType={columnType}
                                            test={0}
                                            actions={actions}
                                            topic={level}
                                            setState={this.setState.bind(this)}
                                            state={this.state}
                                            qedit={false}
                                            {...this.props}
                                        />
                                    </div>
                                ) : meta || embed ? (
                                    <div
                                        style={{
                                            opacity: 0.4,
                                            display: "flex",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            width: "100%",
                                            fontSize: "1.2rem",
                                            height: 30
                                        }}
                                    >
                                        <span> Qwiket: The Internet of Us™</span>
                                    </div>
                                ) : (
                                                <div data-id="bottom-outer-wrapper">
                                                    {replyLink ? (
                                                        <div
                                                            data-id="qwiket-menu-wrapperx"
                                                            style={{
                                                                maxWidth: 220,
                                                                display: "flex",
                                                                paddingLeft: 8,
                                                                paddingRight: 20,
                                                                paddingBottom: 4,
                                                                paddingTop: 4,
                                                                marginTop: 2,
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                                height: full ? 64 : 22,
                                                                marginBottom: 0,
                                                                marginTop: 8
                                                            }}
                                                        >
                                                            {[6, 7, 106, 107].indexOf(level.get('reshare')) >= 0 ? <ReactHoverObserver>
                                                                {({ isHovering }) => (
                                                                    <Tooltip title="Reply">
                                                                        {inShow ? (
                                                                            <CommentOutline
                                                                                style={{
                                                                                    height: 16,
                                                                                    opacity: isHovering ? 1.0 : 0.7
                                                                                }}
                                                                                onClick={e => {
                                                                                    e.preventDefault();
                                                                                    setTimeout(
                                                                                        () => this.setState({ openReply: true }),
                                                                                        100
                                                                                    );
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                                <Link data-id="dots-link" route={levelLink}>
                                                                                    <Comment
                                                                                        style={{
                                                                                            height: 16,
                                                                                            opacity: isHovering ? 1.0 : 0.7
                                                                                        }}
                                                                                        onClick={e => {
                                                                                            setTimeout(
                                                                                                () =>
                                                                                                    this.setState({ openReply: true }),
                                                                                                100
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </Link>
                                                                            )}
                                                                    </Tooltip>
                                                                )}
                                                            </ReactHoverObserver> : null}
                                                            <ReactHoverObserver>
                                                                {({ isHovering }) => (
                                                                    <Tooltip title="Like">
                                                                        <Heart
                                                                            style={{
                                                                                height: full ? 16 : 16,
                                                                                opacity: isHovering ? 1.0 : 0.7
                                                                            }}
                                                                            onClick={e => {
                                                                                e.preventDefault();
                                                                                console.log("liked"), history.push(likeLink);
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </ReactHoverObserver>
                                                            <ReactHoverObserver>
                                                                {({ isHovering }) => (
                                                                    <Tooltip title="Community Moderation.">
                                                                        <FlagRemove
                                                                            style={{
                                                                                height: full ? 16 : 16,
                                                                                opacity: isHovering ? 1.0 : 0.7
                                                                            }}
                                                                            onClick={e => {
                                                                                e.preventDefault();
                                                                                console.log("flag"), history.push(flagLink);
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </ReactHoverObserver>
                                                            <ReactHoverObserver>
                                                                {({ isHovering }) => (
                                                                    <Tooltip title="Share">
                                                                        <ShareVariant
                                                                            style={{
                                                                                height: full ? 16 : 16,
                                                                                opacity: isHovering ? 1.0 : 0.7
                                                                            }}
                                                                            onClick={e => {
                                                                                e.preventDefault();
                                                                                console.log("share"), history.push(shareLink);
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </ReactHoverObserver>
                                                            <ReactHoverObserver>
                                                                {({ isHovering }) => (
                                                                    <Tooltip title="Add to favorites.">
                                                                        <StarOutline
                                                                            style={{
                                                                                height: full ? 19 : 19,
                                                                                opacity: isHovering ? 1.0 : 0.7
                                                                            }}
                                                                            onClick={() => {
                                                                                preventDefault();
                                                                                console.log("share"), history.push(shareLink);
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </ReactHoverObserver>
                                                        </div>
                                                    ) : (
                                                            <div
                                                                data-id="disqus-menu-wrapper"
                                                                className="q-qwiket-disqus-wrapper"
                                                            >
                                                                <div className="q-qwiket-disqus-logo">
                                                                    <img
                                                                        height={10}
                                                                        src="/static/css/disqus-logo-blue.svg"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                            </div>
                        )}
                    </ReactHoverObserver>
                </div>
            </div>
        );
        const linkColor = theme == 1 ? red[900] : red[200];
        const red900 = red[900];
        //console.log({linkColor, theme, red900 })
        //const color = theme ? '#d50000' : '#ff5252'

        return (
            <div className="q-qwiket-outer-shell">
                {isZoom ? (
                    <div>
                        <MediaQuery minWidth={1200} values={{ width }}>
                            <Dialog
                                fullScreen={false}
                                fullWidth={true}
                                maxWidth={"lg"}
                                open={true}
                                scroll="paper"
                                onClose={() => {
                                    this.setState({ z: "" });
                                    linkPush(levelLink, true);
                                }}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <Paper
                                    className="q-qwiket-paper"
                                    style={{
                                        padding: "40px 15% 40px 15%",
                                        color: textColor,
                                        backgroundColor: bg
                                    }}
                                >
                                    {InnerQwiket}
                                </Paper>
                            </Dialog>
                        </MediaQuery>
                        <MediaQuery minWidth={800} maxWidth={1200} values={{ width }}>
                            <Dialog
                                fullScreen={false}
                                fullWidth={true}
                                maxWidth={"md"}
                                open={true}
                                scroll="paper"
                                onClose={() => {
                                    this.setState({ z: "" });
                                    linkPush(levelLink, true);
                                }}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <Paper
                                    className="q-qwiket-paper"
                                    style={{
                                        padding: "40px 80px 80px 80px",
                                        color: textColor,
                                        backgroundColor: bg
                                    }}
                                >
                                    {InnerQwiket}
                                </Paper>
                            </Dialog>
                        </MediaQuery>
                        <MediaQuery maxWidth={799} values={{ width }}>
                            <div>{InnerQwiket}</div>
                        </MediaQuery>
                    </div>
                ) : (
                        <div className="q-qwiket-inner-qwiket">{InnerQwiket}</div>
                    )}
                <style global jsx>{`
			
			
                .q-inner-qwiket{
                    overflow:hidden;
                    padding-left:4px;
                    padding-right:4px;
                    text-decoration:none;
                }
               
				.zoom-wrapper{
					width:100%;
					display:flex;
					flex-direction:column;
					align-items: center; 
					margin-bottom:24px;
				}
				
			
				`}</style>
            </div>
        );
    }
}
QwiketFamily.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
}
QwiketFamily = withTheme(QwiketFamily);
//Qwiket=withMobileDialog()(Qwiket);
