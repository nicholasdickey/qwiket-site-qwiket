import React, { Component } from "react";
import Link from 'next/link'
import $ from 'jquery';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Immutable from "immutable"
import Root from 'window-or-global';
//import ModalImage, { Lightbox } from "react-modal-image"
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import OldMarkdown from 'react-markdown';
import Markdown from 'markdown-to-jsx';
import { Image } from "react-bootstrap";
import ReactHoverObserver from 'react-hover-observer';
var linkify = require('linkifyjs');
import linkifyHtml from 'linkifyjs/html';

//Qwiket
import u from '../../qwiket-lib/lib/utils'

import { route } from '../../qwiket-lib/lib/qwiketRouter';

//import { ArticleView, renderToHtml } from '../../qwiket-lib/components/articleView'
//material-ui
import { withTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import yellow from "@material-ui/core/colors/yellow";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";
import indigo from "@material-ui/core/colors/indigo";
import grey from "@material-ui/core/colors/grey";
import blueGrey from "@material-ui/core/colors/blueGrey";
import blue from "@material-ui/core/colors/blue";
//icons
import Reply from 'mdi-material-ui/Reply';
import Star from 'mdi-material-ui/Star';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import ChevronUp from 'mdi-material-ui/ChevronUp';
import Replies from 'mdi-material-ui/CommentMultipleOutline';

const yellow500 = yellow[500];
const green500 = green[500];
const amber500 = amber[500];
const red900 = red[900];
const green700 = green[700];
const grey50 = grey[50];
const indigo900 = indigo[900];
const amber900 = amber[900];
const allowedTypes = ["html", "heading", "text", "paragraph", "break", "blockquote", "list", "listItem", "code", "delete", "strong", "emphasis", "link", "image"];
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
    if (!level)
        level = 0;
    let w = split(html, token, 1);
    if (w.length == 1) {
        //console.log('catedit cc77 exit',{html,level,w,token,insert,order});
        return html;
    }
    const s = w[0];
    //console.log('catedit cc77 ',{level,s,w,html,token,insert,order})
    const pre = s + ((order == 'pre') ? insert : '');
    const post = ((order == 'post') ? insert : '');
    const inner = innerX({ html: w[1], token, insert, order, level: level + 1 });
    //console.log("catedit innerX end:",{s,html,token,insert,order,level,pre,post,inner});

    return pre + token + post + inner;
}
function getTextNodesIn(node, includeWhitespaceNodes) {
    var textNodes = [], whitespace = /^\s*$/;

    function getTextNodes(node) {
        if (!node)
            return;
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

        html = innerX({ html, token: '<blockquote', insert: `<div class="${isZoom ? "zoom" : "normal"}-wrapper">`, order: 'pre' });
        //console.log("catedit 11",html)
        html = innerX({ html, token: '</blockquote>', insert: '</div>', order: 'post' });
        //console.log("catedit 12",html)
        let v = $('<div/>').html(html).contents();
        //v.find(`style`).remove();
        v.find(`img[src*="${image}"]`).remove();
        //v.find('.twitter-tweet').remove();
        v.find(`img:not([src])`).each(function () {
            const dataSrc = $(this).attr('data-src');
            if (dataSrc)
                $(this).attr('src', dataSrc);
        });
        v.find('img').each(function () {
            let img = $(this).attr('src') ? $(this).attr('src').split('?')[0] : '';
            let img2 = image ? image.split('?')[0] : '';
            const w = img2.split('//');
            if (w && w.length > 1)
                img2 = w[1];
            //console.log("catedit img:",{img,img2})
            if (img.indexOf(img2) >= 0) {
                //console.log("catedit img remove",img);
                $(this).remove();
            }
        });
        v.find('blockquote').wrap(`<div class="${isZoom ? "zoom" : "normal"}-wrapper"></div>`);
        v.find('img').wrap(`<div class="${isZoom ? "zoom" : "normal"}-wrapper"></div>`);
        v.find('iframe').wrap(`<div class="${isZoom ? "zoom" : "normal"}-iframe-wrapper"></div>`);

        var textnodes = getTextNodesIn(v.find('#markdown-shell')[0]);
        for (var i = 0; i < textnodes.length; i++) {
            if ($(textnodes[i]).parent().is("'#markdown-shell")) {
                $(textnodes[i]).wrap("<p>");
            }
        }

        html = $("<div />").append(v.clone()).html();
        return html;
    }
    else
        return html;
}
const renderArticle = ({ topic, index, theme, globals, zoom, channel, approver }) => {

    let threadid = topic.get("threadid");
    let editor = false;
    zoom = 'out';
    console.log("Render Article", { topic: topic ? topic.toJS() : 'no topic' })
    return <div globals={globals} approver={approver} zoom={zoom} editor={editor} topic={topic} threadid={threadid} channel={channel} />


}
const renderArticleHtml = ({ topic, index, theme, globals, zoom, channel, approver }) => {

    let threadid = topic.get("threadid");
    let editor = false;
    zoom = 'out';
    console.log("Render Article", { topic: topic ? topic.toJS() : 'no topic' })
    return "<div globals={globals} approver={approver}  zoom={zoom} editor={editor} topic={topic} threadid={threadid} channel={channel} />"


}
class ImageRenderer extends Component {


    state = {
    }
    render() {
        const props = this.props;
        const state = this.state;
        console.log("render Image", { props });
        let { src, alt, index } = props;
        const w = alt ? alt.split('x') : [];
        let width = 0;
        let height = 0;
        if (w) {
            width = (+w[0]) ? w[0] : width;
            height = (+w[1]) ? w[1] : height;

            const open = state.lightbox;
            //   console.log("r2", { state, src })
            return <div>{
                open ? <div><Lightbox
                    mainSrc={src}

                    onCloseRequest={() => { this.setState({ lightbox: false }) }}

                /><div data-id="image-renderer" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><img style={{ height: '100%', width: '100%' }} onClick={() => { this.setState({ lightbox: true }) }} width={width ? width : null} height={height ? height : null} src={src} /></div></div> : <div data-id="image-renderer-2" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><img style={{ height: '100%', width: '100%' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.setState({ lightbox: true }) }} width={width ? width : null} height={height ? height : null} src={src} /></div>}</div>
            // setTimeout(() => $.getScript("/static/css/fslightbox.js"), 1000)
            // return <a data-fslightbox={alt} href={`/lightbox/${encodeURIComponent(src)}`}><img width={width} height={height} src={src} /></a>
        }
    }
}
class LinkRenderer extends Component {


    state = {
    }
    render() {
        const props = this.props;
        const state = this.state;
        //  console.log("render Link", { props });
        let { href, index, dataId, theme, ...pr } = props;
        let url = href;
        if (url.indexOf("youtube.com") >= 0 && url.indexOf('url=') < 0) {
            //  console.log("youtu.be 21", { url });
            let w = url.split('v=');
            let r2 = w[1];
            let r3 = r2 ? r2.split(':')[0] : '';
            let l = w ? w.length : 0;
            let vlink = 'https://www.youtube.com/embed/' + r3;
            //   console.log("youtu.be 3", { vlink, r2, r3, w });
            return <iframe data-d1={r2} data-url={url} key={dataId + "-utube2-" + index} width='100%' height={315} src={vlink} style={{ marginLeft: "auto", marginRight: "auto" }} frameborder="0" allow="autoplay;encrypted-media" allowFullScreen={true} />;
        }
        else if (url.indexOf("youtu.be") >= 0 || url.indexOf("youtube.com") >= 0) {
            const htext = href;
            console.log("youtu.be 210", { htext });
            let w = htext.split('url=');
            let l = w ? w.length : 0;
            let url2 = decodeURIComponent(w[l - 1]);
            let vlink = url2;
            //   console.log("youtu.be 211", { w, l, url2 });
            // if (url.indexOf("youtu.be") >= 0) {

            if (url2.indexOf("youtu.be") >= 0) {
                // console.log("youtu 201", url2)
                w = url2.split('youtu.be/');
                let r2 = w && w.length ? w[1] : '';

                let r3 = r2 ? r2.split('?')[0] : r2;
                let r4 = r3 ? r3.split(':')[0] : r3;

                vlink = 'https://www.youtube.com/embed/' + r4;
                // console.log('youtu', { r2, r3, r4, vlink })
            }
            else {
                w = url2.split(':');
                // console.log("202", w)
                if (url2.indexOf("http") >= 0)
                    vlink = `${w[0]}:${w[1]}`;
                else
                    vlink = `${w[0]}`;
                w = vlink.split('v=');
                // console.log("203", w)
                let r2 = w[1];
                let r3 = r2 ? r2.split(':')[0] : '';
                // console.log("204", r3)
                let l = w ? w.length : 0;
                vlink = 'https://www.youtube.com/embed/' + r3;
            }
            // l = w ? w.length : 0;


            // }
            //  console.log("youtu.be 212", { vlink });

            return <iframe data-url={url} key={dataId + "-utube-" + index} width='100%' height={315} src={vlink} style={{ marginLeft: "auto", marginRight: "auto" }} frameborder="0" allow="autoplay;encrypted-media" allowFullScreen={true} />;

        }


        else if (url && url.indexOf("twitter.com") >= 0) {
            let href2 = href;
            if (href.indexOf('pic.twitter.com') >= 0) {
                console.log("pic.twitter.com", { url, props, ah: href.split("—")[0] })
                href2 = href.split("—")[0];
            }
            let hurl = href2;// href.replace('pic.twitter.com', 'twitter.com');
            let w = hurl.split('url=');
            let l = w ? w.length : 0;
            let url2 = decodeURIComponent(w[l - 1]);
            // console.log("processBlock4 twitter.com", url2)
            let tc = (<div key={dataId + "-tw1-" + index} className="q-embed-twitter">
                <blockquote class="twitter-tweet" data-lang="en" data-theme={theme ? 'light' : 'dark'}>
                    <a onclick={(e) => { e.stopPropagation(); e.preventDefault(); }} href={url2}>
                        <img src="https://banner2.kisspng.com/20180802/czs/kisspng-malta-blockchain-summit-ad-fraud-advertising-indus-twitter-logo-png-5b6352722ae8d6.4341314915332358261758.jpg" height="64" width="64" />
                    </a>
                </blockquote>
            </div>
            );
            if (Root.__CLIENT__ && (typeof window.twttr !== 'undefined'))
                setTimeout(() => {
                    if (Root.__CLIENT__ && (typeof window.twttr !== 'undefined')) {
                        window.twttr.widgets.load()
                        window.twttr.widgets.load();
                    }
                }, 500);

            return tc;
        }
        /* else if (url.indexOf("/t.co/") >= 0) {
             let hurl = href;
             let w = hurl.split('url=');
             let l = w ? w.length : 0;
             let url2 = decodeURIComponent(w[l - 1]);
             //console.log("processBlock4 t.co", url2)
             let tc = (<div key={dataId + "-r3-" + index} className="q-embed-twitter">
                 <blockquote class="twitter-tweet" data-lang="en"><a onclick={(e) => { e.stopPropagation(); e.preventDefault(); }} href={url2}>
                     <img src="https://banner2.kisspng.com/20180802/czs/kisspng-malta-blockchain-summit-ad-fraud-advertising-indus-twitter-logo-png-5b6352722ae8d6.4341314915332358261758.jpg" height="64" width="64" /></a></blockquote></div>);
             //el.replaceWith(htm);
             //console.log("processBlock5", htm);
             //  changed = true;
             if (Root.__CLIENT__)
                 setTimeout(() => {
                     window.twttr.widgets.load();
                     window.twttr.widgets.load();
                 }, 500);
             return tc;
         }*/
        else {
            /* ['uploads.disquscdn', 'jpg', 'png', 'gif', 'giphy'].forEach(function (token) {
                 console.log("inside1", { token, url, pr })
                 if (url.indexOf(token) >= 0) {
                     console.log("inside2", token)
                     const href = url;
                     if ((href.indexOf('disqus') >= 0 || href.indexOf('disq.us') >= 0) && href.indexOf('imgurl') < 0) {
                         console.log("inside3", token)
 
                         let src = href.split('url=');
                         if (src[1])
                             src = decodeURIComponent(src[1]);
                         else src = href;
                         const w = src ? src.split(token) : [];
                         if (w[1]) {
                             const w1 = w[1];
                             const s = w1.split(':')[0];
                             src = w[0] + token + s;
                         }
                         console.log("inside4", src)
                         return <div> <img src="${src}" class="q-react-embed-image" /></div >;
 
                     }
 
                 }
 
             })*/
            return <a href={href} {...pr} />
        }
    }
}
/**
 * Process images, videos etc in markdown / html
 */
const processBlock = ({ blockType, dataId, md, index, reshare, linkColor, state, setState, theme }) => {
    let html = null;
    let embeds = null;
    let changed = false;

    if (Root.__CLIENT__) {

        let v = $('<div/>').html('<div>' + md + '</div>').contents();
        if (md && md.indexOf('https') >= 0) {
            // console.log("processBlock", { md })
        }
        //has to use jquery as the link is scrambled and markdown uses the b
        ['uploads.disquscdn', 'jpg', 'png', 'gif', 'giphy'].forEach(function (token) {
            // console.log("processBlock", { md, token })
            let disqusImages = v.find(`a[href *= "${token}"]`);
            disqusImages.each(function (index) {
                // console.log("processBlock IMAGE FOUNDs", { token })
                let el = $(this);
                const href = el.attr('href');
                if ((href.indexOf('disqus') >= 0 || href.indexOf('disq.us') >= 0) && href.indexOf('imgurl') < 0) {

                    let src = href.split('url=');
                    if (src[1])
                        src = decodeURIComponent(src[1]);
                    else src = href;
                    const w = src ? src.split(token) : [];
                    if (w[1]) {
                        const w1 = w[1];
                        const s = w1.split(':')[0];
                        src = w[0] + token + s;
                    }
                    const htm = `<div> <img src="${src}" class="q-react-embed-image" /></div > `;
                    // console.log("processBlock IMAGE CONFIRMED", { title: el.attr('title'), href: el.attr('href'), htm })
                    el.replaceWith(htm);
                    //  console.log("processBlock2", { htm, title: el.attr('title'), href: el.attr('href'), text: el.text() })
                    changed = true;
                }

            })
        })


        if (changed) {
            if (md.indexOf("That was no sweet") >= 0)
                console.log("changed");
            html = v.html();
            // if (md.indexOf("This is what") >= 0)
            //    console.log("IMAGE replace ", { md, html })
            if (html)
                md = html;


        }

    }
    if (md.indexOf("That was no sweet") >= 0)
        console.log("render processBlock7", md);
    html = (
        <div data-id={blockType == 'text' ? 'textblock-' + dataId : 'htmlblock-' + dataId} key={`pre-render-blocks-key-${index}`} className={reshare > 50 && reshare < 60 ? "q-qwiket-markdown-draft" : "q-qwiket-markdown"} >
            {blockType == 'text' || blockType == 'html' ? <Markdown options={{
                forceBlock: true,
                overrides: {
                    img: {
                        component: ImageRenderer,
                        props: {
                            setState,
                            index: `lightbox-${index}`,
                            state
                        }

                    },
                    a: {
                        component: LinkRenderer,
                        index: `link-${index}`,
                        theme
                    }
                },
            }}>{md.indexOf('<p') < 0 ? `<div data-id="inner-wrap">${md}</div>` : md}</Markdown> : <OldMarkdown data-id={`${dataId}-md`} escapeHtml={false} source={md} renderers={{
                link: (props) => {
                    // console.log("renderLink", { props })
                    /* const embedVideo = renderIFrame({ href });
                     if (embedVideo)
                         return embedVideo;
                     else 
                     */
                    const href = props.href;
                    if (href.indexOf('twitter.com') >= 0)
                        return null;
                    return <a data-id="link" href={href} className="q-qwiket-link">{children}</a>
                },

            }} />}
            {false ? <Markdown data-id={`${dataId}-md`} escapeHtml={false} source={md} renderers={{
                link: (props) => {
                    // console.log("renderLink", { props })
                    /* const embedVideo = renderIFrame({ href });
                     if (embedVideo)
                         return embedVideo;
                     else 
                     */
                    const href = props.href;
                    if (href.indexOf('twitter.com') >= 0)
                        return null;
                    return <a data-id="link" href={href} className="q-qwiket-link">{children}</a>
                },
                image: imageRenderer
            }} /> : null}
            <style global jsx>{`
                a{
                     text-decoration:none;
                }
                    .q-full.q-qwiket-main-image{
                    object-fit: cover;
                    margin-top: 20px;
                    position: relative;
                    max-width: 100% !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-column .q-qwiket-main-image{
                    position: relative;
                    max-width: 100% !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-qwiket-main-image-full{

                    max-width: 100% !important;
                    max-height: 100% !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-qwiket-title{
                    font-weight:500;
                    line-height: 1.2;
                    font-size: 1.2rem; 
                    font-family:roboto;
                    text-align: left; 
                    margin-top:10px;
                    cursor:pointer;
                }
                .q-qwiket-title-full{
                    font-weight:500;
                
                    line-height: 1.3; 
                    font-size: 2.0rem; 
                    font-family:roboto;
                    text-align: left; 
                    cursor:pointer;
                    user-select:text;
                }
                .q-qwiket-title-full-zoom{
                    font-weight:500;
                    
                    line-height: 3.2rem;
                    font-size: 2.6rem; 
                    font-family:roboto;
                    text-align: left; 
                    cursor:pointer;
                    user-select:text;
                }
                .q-qwiket-markdown{
                    max-width: 100%;
                    font-size: 1.0rem;
                    line-height: 1.4;
                    overflow: hidden;
                    font-weight: 400;
                    font-family: roboto;
                    text-transform: none !important;
                    user-select: text;
                }
                 .q-column .q-qwiket-markdown{
                    max-width: 100%;
                   // font - size: 1.3rem;
                    line-height: 1.3 !important;
                    overflow: hidden;
                    font-weight: 400;
                    font-family: roboto;
                    text-transform: none !important;
                    user-select: text;
                }
                .q-qwiket-markdown-reshare{
                    width: 100%;
                    //font - size: 1.3rem;
                    line - height: 1.4;
                    overflow: hidden;
                    font-weight: 400;
                    font-family: roboto;
                    background-color: #eee;
                    user-select: text;
                    text-transform: none !important;
                }
               
            
                .q- weak.q-qwiket-markdown{
                    width: 100%;
                    font-size: 1.2rem;
                    line-height: 1.5;
                    overflow: hidden;
                    font-weight: 300;
                    font-family: roboto;

                    user-select: text;
                }
                .q-qwiket-markdown p: last-of-type{
                    margin-block-end: 12px;

                }
                .q-qwiket-markdown p{
                    margin-block- end: 30px;
                    margin-block-start: 12px;
                    width: 100%;
                }

                .q-qwiket-a{
                    text-decoration: underline !important;
                    //font - size: 0.9rem;
                    color: ${ linkColor} !important;
                    text-align: center;
                }
            
                .q-qwiket-markdown img{
                    margin-bottom: 10px !important;
                    margin-top: 12px !important;
                    max-width: 100%;
                }
                 .q-qwiket-markdown blockquote{
                    margin-left: 0px;
                    margin-right: 8px;
                    padding-left: 10px;
                    line-height: 1.3;
                }
                .q-full{
                    width: 100 %;
                }
                .q-full blockquote{
                    margin-left: 0px;
                    padding-left: 20px;
                    padding-right: 15px;
                    line-height: 1.3;
                    margin-right: 0px;
                }
                .q-column{
                    cursor: pointer;
                }
                .q-column-shaded{
                    opacity: 0.5;
                    cursor: pointer;
                }
                .q-column blockquote{
                    margin-left: 0px;
                    margin-right: 8px;
                    padding-left: 10px;
                    line-height: 1.3;
                }
                blockquote{
                    border-left: 5px solid ${ linkColor};
                    margin-block-end: 30px;
                    margin-block-start: 12px;
                    padding-left: 10px;
                    line-height: 1.4;
                }
                .html-body.q-drop{
                    color: ${ linkColor} !important;
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 80px;
                    line-height: 64px;
                    padding-right: 10px;
                    margin-bottom: 10px;
                }
                .html-zoom.q-drop{
                    color: ${ linkColor} !important;
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 100px;
                    line-height: 78px;
                    padding-right: 10px;
                }
                .q-full strong{
                    font-weight: 500;

                }
                .html-body br{
                    margin - top: 0px;
                    margin - bottom: 0px;
                }
                .q-markdown-wrap{
                    width: 100 %;
                    overflow: hidden;

                }
                .normal-iframe-wrapper{
                    height: 350px;
                }
                .html-zoom.drop{
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 100px;
                    line-height: 78px;
                    padding-right: 10px;
                    color: ${ linkColor} !important;
                }
                .html-body.drop{
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 80px;
                    line-height: 64px;
                    padding-right: 10px;
                    color: ${ linkColor} !important;
                    margin-bottom: 10px;
                }
                .q-drop{
                    float: left;
                    font-family: Gentium Basic, serif;
                    font-size: 72px;
                    line-height: 58px;
                    padding-right: 10px;
                    color: ${ linkColor} !important;
                    margin-bottom: 10px;
                }


                `}</style>
        </div >);
    return html;

}
export const renderMarkdown = ({ blockType, dataId, md, index, children, theme, reshare, linkColor, dropCap, state, setState }) => {
    let html = null;
    let embeds = null;
    let changed = false;
    if (md.indexOf("undefined") >= 0)
        console.log("renderMArkdown", { blockType, md })
    md = md.replace(/undefined!/ig, '!');
    if (md.indexOf("undefined") >= 0)
        console.log("renderMArkdown2", { blockType, md })
    //console.log("renderMarkdown", blockType)
    try {
        //  md = md.replace(/(^|\s)(#[a-z\d-]+)/ig, `$1 < span class="hashtag" >\\$2</span > `);
        //  md = md.replace(/<a /ig, '<a target="article" ')
        //, className: "q-qwiket-a", target: { url: "_blank" }
        const md2 = md; //linkifyHtml(`<div> ${md}</div > `, { defaultPropocol: 'https' });
        if (md.indexOf("undefined") >= 0)
            console.log("after linkify", { blockType, md2 })
        md = md2;
        const lf = linkify.find(md);
        // console.log("linkify.find", lf);
    }
    catch (x) {
        console.log(x);
    }

    // md = md ? md.replace(/\n/g, '<br/>') : '';
    if (blockType == 'text') {

        // console.log("renderMarkdown1 0", { md, blockType })
    }
    //  if (blockType == 'reacts')
    if (blockType == "text" && dropCap) {
        let c = md.trim().charAt(0);

        if (c != '<' && c != '&') {
            let crest = md.trim().slice(1);

            md = `< p > <span class="q-drop" >${c}</span>${crest}</p > `;
            if (md.indexOf("That was no sweet") >= 0)
                console.log(" rendering dropCap", { md });

        }
    }
    let ret = '';
    if (Root.__CLIENT__ && (md.indexOf('youtu') >= 0 || md.indexOf("/t.co") >= 0 || md.indexOf("twitter.com"))) {
        // console.log("!!!!!  childo renderMarkdown2", { blockType, md });
        let r = [];
        let bl = processBlock({ blockType, dataId, md, index, children, state, setState, theme });
        //  console.log("childo processBlock", bl);
        r.push(bl)
        /* let v = $('<div/>').html(md).contents();
         let utubes = v.find('a[href*="youtu.be"]');
         utubes.each(function (index) {
             const ut = $(this);
             const htext = ut.attr('href');
             console.log("youtu.be 210", { htext });
             let w = htext.split('url=');
             let l = w ? w.length : 0;
             let url = decodeURIComponent(w[l - 1]);
             //  console.log("youtu.be 211", { url });
             w = url.split('youtu.be/');
             let r2 = w && w.length ? w[1] : '';
             let r3 = r2 ? r2.split('?')[0] : url;
             r3 = r3 ? r3.split(':')[0] : url;
             // l = w ? w.length : 0;
             let vlink = 'https://www.youtube.com/embed/' + r3;
             //   console.log("youtu.be 212", { vlink });
 
             r.push(<iframe key={dataId + "-utube-" + index} width='100%' height={315} src={vlink} style={{ marginLeft: "auto", marginRight: "auto" }} frameborder="0" allow="autoplay;encrypted-media" allowfullscreen={true} />);
             // console.log("youtu.be 4", { repl });
             // ut.replaceWith(repl);
 
         }) */
        /*  utubes = v.find('a[href*="youtube.com"]');
          console.log("utubes:", utubes);
          utubes.each(function (index) {
              const ut = $(this);
              const htext = ut.attr('href');
              console.log("youtu.be 2", { htext });
              let w = htext.split('url=');
              let l = w ? w.length : 0;
              let url = decodeURIComponent(w[l - 1]);
              console.log("youtu.be 21", { url });
              w = url.split('v=');
              let r2 = w[1];
              let r3 = r2 ? r2.split(':')[0] : '';
              l = w ? w.length : 0;
              let vlink = 'https://www.youtube.com/embed/' + r3;
              // console.log("youtu.be 3", { vlink, r2, r3, w });
              r.push(<iframe key={dataId + "-utube2-" + index} width='100%' height={315} src={vlink} style={{ marginLeft: "auto", marginRight: "auto" }} frameborder="0" allow="autoplay;encrypted-media" allowfullscreen={true} />);
              // console.log("youtu.be 4", { repl });
              //ut.replaceWith(repl);
  
          })
          */
        /*  let tweets = v.find('a[href*="twitter.com"]');
          tweets.each(function (index) {
              const el = $(this);
              //  console.log("processBlock3", el)
              const hurl = el.attr('href');
              let w = hurl.split('url=');
              let l = w ? w.length : 0;
              let url = decodeURIComponent(w[l - 1]);
              //  console.log("processBlock4", url)
              let tc = (<div key={dataId + "-tw1-" + index} className="q-embed-twitter">
                  <blockquote class="twitter-tweet" data-lang="en" data-theme={theme ? 'light' : 'dark'}>
                      <a onclick={(e) => { e.stopPropagation(); e.preventDefault(); }} href={url}>
                          <img src="https://banner2.kisspng.com/20180802/czs/kisspng-malta-blockchain-summit-ad-fraud-advertising-indus-twitter-logo-png-5b6352722ae8d6.4341314915332358261758.jpg" height="64" width="64" />
                      </a>
                  </blockquote>
              </div>
              );
              r.push(tc)
              // el.replaceWith(htm);
              //console.log("processBlock5", htm);
              changed = true;
              setTimeout(() => {
                  window.twttr.widgets.load()
                  window.twttr.widgets.load(); 
              }, 500);
  
  
          }) */
        /* let tweets2 = v.find('a[href*="/t.co"]');
         tweets2.each(function (index) {
             const el = $(this);
             //  console.log("processBlock3", el)
             const hurl = el.attr('href');
             let w = hurl.split('url=');
             let l = w ? w.length : 0;
             let url = decodeURIComponent(w[l - 1]);
             //   console.log("processBlock4", url)
             r.push(<div key={dataId + "-r3-" + index} className="q-embed-twitter">
                 <blockquote class="twitter-tweet" data-lang="en"><a onclick={(e) => { e.stopPropagation(); e.preventDefault(); }} href={url}>
                     <img src="https://banner2.kisspng.com/20180802/czs/kisspng-malta-blockchain-summit-ad-fraud-advertising-indus-twitter-logo-png-5b6352722ae8d6.4341314915332358261758.jpg" height="64" width="64" /></a></blockquote></div>);
             //el.replaceWith(htm);
             // console.log("processBlock5", htm);
             changed = true;
             setTimeout(() => {
                 window.twttr.widgets.load()
                 window.twttr.widgets.load();
             }, 500);
 
 
         })*/
        //   console.log("childo2", r)
        if (r && r.length) {
            // console.log("childo3", r)
            ret = <div key={dataId + "render-block-" + index}>{r}</div>
        }
        else
            ret = processBlock({ blockType, dataId, md, index, children, reshare, linkColor, theme });
    }
    else {
        ret = processBlock({ blockType, dataId, md, index, children, reshare, linkColor, theme });
    }

    if (md.indexOf("That was no sweet") >= 0)
        console.log("renderMArkdown AFTER", { ret })
    return ret;
}
class RenderImage extends Component {


    state = {
        lightbox: false
    }
    render() {
        const props = this.props;
        const state = this.state;
        //   console.log("render Image", { props });
        let { src, alt, index } = props;
        let { dataId, image, full, top, loud, opened, type, subtype } = props;
        // if (type == 'reacts' && subtype == 'level')
        //   console.log("renderImage", { subtype, opened, type, image, lightbox: state.lightbox })
        let html = <div data-id="image-wrapper1" className="q-qwiket-image-wrapper">
            {type == 'stickie' || type == 'comment' || type == 'reacts' && !top || full || opened || (top && subtype == 'level' && loud) ?
                <Image onClick={(e) => { if ((full || type == 'comment')) this.setState({ lightbox: true }) }} responsive data-id={dataId} className={full ? "q-qwiket-main-image-full" : "q-qwiket-main-image"} src={u.cdn(image)} small={image} medium={image} large={image} /> : null}
            {
                (full || type == 'comment') && state.lightbox ?
                    <div style={{ position: 'relative', top: 0, left: 0, zIndex: 102 }}><Lightbox
                        mainSrc={image}

                        onCloseRequest={() => { this.setState({ lightbox: false }) }}
                    /></div> : null

            }
        </div>
        //let html = <ImageRenderer src={image} alt={dataId} />
        return html
    }
}
/** 
 * type:
 * full - main page topic
 * comment - has no author avatar or name, title only for a sticky
 * default - column Qwiket
 * subtype:
 * child
 * parent
 * top
 * level
 * */
export default class QwiketRenderer extends Component {
    state = {

    }
    shouldComponentUpdate(nextProps) {
        let props = this.props;
        let changedTopic = props.topic != nextProps.topic;
        let changedSession = props.session != nextProps.session;
        let longChanged = props.long != nextProps.long;
        console.log("QwiketRenderer shouldComponentsUpdate", { threadid: nextProps.topic.get("threadid") || nextProps.topic.get("qwiketid"), changedTopic, changedSession, longChanged })
        return changedTopic || changedSession || longChanged;
    }
    render() {
        let { theme, type, subtype, topic, globals, state, setState, approver, channel, loud, keyprop, long, setLong, link, onClick, inShow, qwiketOpened, zoom } = this.props;
        const muiTheme = theme;
        theme = +globals.get("theme");
        const palette = muiTheme.palette;
        //console.log("PALETTE", palette)
        const textColor = palette.text.primary;
        const bg = palette.background;
        const linkColor = theme == 1 ? red[900] : red[200];

        let d = topic.toJS();
        //   console.log("QWIKETRENDER", { type })
        //console.log("TOPIC>>>:", d)
        if (d.deleted || d.reshare > 1000)
            return <div>comment deleted by the user</div>
        //  if (type == 'reacts')
        //     console.log('red1', { type, subtype, d })
        if (type == "full")
            d.topLevel = true;
        const top = d.topLevel;
        const full = type == 'full';
        const width = u.width(globals);
        //if (top && subtype == 'parent')
        //   console.log({ opened, title: d.title, inShow, d })
        let key = keyprop;
        if (!key)
            key = "rendered-qwiket"

        let { reshare, description, body, image, image_src, author, site_name, title, showedHistory, opened, article } = d;
        if (body == "none")
            body = null;
        if (!author)
            author = "AUTHOR"
        if (!site_name)
            site_name = "SITENAME"
        //  console.log({ author, site_name })
        // console.log("showedHistory:", { showedHistory, title, d })
        opened = qwiketOpened || opened;
        //if (+article)
        // console.log('renderer:', { d, type, subtype })
        if (!image)
            image = image_src;
        let sharedBy = d.sharedBy && d.sharedBy != 'Hudson Wilde' && d.sharedBy != '- Q -' ? d.sharedBy : null;
        let shaded = d.shaded ? 1 : 0;
        const timestamp = d.publishedTime;
        const catAvatar = d.catIcon ? d.catIcon : d.categoryIcon;

        // if (full)
        //    console.log({ d });
        //    console.log({ sharedBy });

        // console.log({ catAvatar, cdn: u.cdn(catAvatar) })
        const lapsed = timestamp ? (u.timeConverter(timestamp, (Root.__CLIENT__ && window.virgin ? (globals.get("renderTime")) : 0), 0, true, width, globals)) : false;
        author = author ? author.split("@")[0] : "";

        let rs = !reshare || reshare == 100 || reshare == 50 ? 0 : reshare == 6 || reshare == 106 || reshare == 56 ? 6 : reshare == 7 || reshare == 107 || reshare == 57 ? 7 : reshare == 9 || reshare == 59 || reshare == 109 ? 9 : -1;
        let isVideo = false;
        let readMore = body && long ? true : false;
        //   if (Root.__SERVER__)
        //       readMore = true; // or Google indexing, should only be limited to bots and subscribers
        // if (full)
        //    console.log({ readMore, rs, reshare })
        //if (type == 'full')
        //   readMore = true; //if stickie - extend for full (root page topic)
        const isZoom = state.z == 'zz';
        //render description and body blocks into an array
        let blocks = [];

        if (type == 'reacts' || type == 'mix' || type == 'comment' || type == 'stickie') {
            // if (full)
            //     console.log("r1 0 react:", { description });
            if (description.indexOf("That was no sweet") >= 0)
                console.log("first case", description)
            if (Root.__CLIENT__)
                description = $('<textarea />').html(description).text();

            blocks.push({ blockType: 'text', text: description });
        }
        else if (type == 'full' && +article && d.html) {
            // if (full)
            let h = d.html.split('|')[2];
            // if (d.body)
            // console.log("r1 ARTICLE", h);

            // h = h.replace(/<div(["A-Za-z0-9 -_%]*>)/g, '<div>')
            h = h.replace(/width:100%/g, '')
            h = h.replace(/height:100%/g, '')
            //  console.log("r2 ARTICLE", h);

            blocks.push({ blockType: 'article', html: h })
        }
        else if (subtype != 'parent' && (!readMore || !full || !body)) {
            // if (full)
            //    console.log('r1 1')
            blocks.push({ blockType: 'html', html: description });
        }
        else if (subtype == 'parent' && !top || subtype == 'parent' && opened) {
            // if (full)
            //    console.log('r1 2')
            blocks.push({ blockType: 'html', html: description });
        }

        //  else if (rs == 9 || rs == 109)
        //    blocks.push({ blockType: 'html', html: description });
        else if (!body) {
            // if (full)
            //     console.log('r1 3')
            blocks.push({ blockType: 'html', html: description });
        }

        if (image) {
            if (description.indexOf("That was no sweet") >= 0)
                console.log("adding image:", image);
            blocks.push({ blockType: 'image', image });
        }
        if (readMore && body && body != 'none' && body.blocks && !d.html && type != 'stickie') {
            //  if (full)
            //     console.log(' r1 body.blocks', { body })
            if (description.indexOf("That was no sweet") >= 0)
                console.log("adding dropCap", { description })
            if (reshare && reshare != 100)
                blocks.push({ blockType: 'text', text: description, dropCap: true });

            blocks.push(...body.blocks);
        }
        //  if (full)
        //     console.log(">>>> BLOCKS MAP", {});
        blocks = blocks.map((p, i) => {
            // if (full)
            //    console.log("BLOCK:", { p, type, reshare, description, body, article, blockType: p.blockType, cond: (type == 'full' && +article && d.html) ? 1 : 0 })
            let html = <div />;
            switch (p.blockType) {
                case 'article1':
                    return renderArticle({ topic, d, theme, globals, zoom, channel, approver })
                case 'text':
                    return renderMarkdown({ blockType: p.blockType, dataId: 'text-block', md: p.text, index: i, theme, reshare, linkColor, dropCap: p.dropCap ? true : false, state: this.state, setState: (update) => this.setState(update) });
                case 'article':
                    return renderMarkdown({ blockType: p.blockType, md: renderToHtml({ topic, d, theme, globals, zoom, channel, approver }), dataId: 'markdown-block12', index: i, theme, linkColor, state: this.state, setState: (update) => this.setState(update) });
                case 'html': // scraped from external page or description block 
                    // console.log("block:html")
                    if (!p.html)
                        return;
                    html = p.html.replace(/<p><\/p>/g, '').replace(/<br>/g, '<br /><br />');
                    if (type == 'full') {
                        let lw = html.split("<p>");
                        if (lw.length > 1) {
                            let c = lw[1].trim().charAt(0);

                            if (c != '<' && c != '&') {
                                let crest = lw[1].trim().slice(1);

                                lw[1] = `<span class="q-drop"> ${c}</span > ${crest} `;
                                html = lw.join('<p>');
                            }
                            else if (html.indexOf('class="drop"') >= 0) {
                                // console.log("CLASS=DROP");
                                html = html.replace(/class="drop"/g, `class="q-drop" `)
                            }
                        }
                    }
                    else {
                        html = html.replace(/class="drop"/g, `class="disabled-drop" `)
                    }
                    //console.log("catedit shtml:", shtml);
                    html = x('<div id="markdown-shell" class="q-qwiket-md-shell">' + html + '</div>', isZoom, image);
                    //console.log("catedit shtml-pos-x:", shtml);
                    if (isZoom) {
                        html = `<div style = "display:flex;flex-direction:column;width:100%" class="${isZoom ? "html - zoom" : "html - body"}" > ${
                            html.replace(/\t/g, ``).replace(/\n/g, ``).trim()
                                .replace(/float( *?):( *?)left;/g, `margin-left:auto;margin-right:auto;`)
                                .replace(/float( *?):( *?)right;/g, `margin-left:auto;margin-right:auto;`)
                            }</div > `;

                    }
                    else {
                        html = `<div  style = "position:relative;display:flex;flex-direction:column;width:100%;height:100%;" class="${isZoom ? "html - zoom" : "html - body"}" > ${
                            html.replace(/\t/g, ``).replace(/\n/g, ``).trim()
                                .replace(/width( *?):( *?)([A-Za-z0-9]*);?/g, `width:${isZoom ? "500px" : "100%"};`)
                                .replace(/height( *?):( *?)([A-Za-z0-9]*);/g, `height:100%;`)
                                .replace(/width='([A-Za-z0-9 _%]*)'/g, `width='100%'`)
                                .replace(/width="([A-Za-z0-9 _%]*)"/g, `width='100%'`)
                                .replace(/width( *?)=( *)"([A-Za-z0-9 _]*)"/g, `width="100%"`)
                                .replace(/height=[",']([A-Za-z0-9 _]*)[",']/g, `height="${isZoom ? "500px" : "100%"}"`)
                                .replace(/height:[",']([A-Za-z0-9 _]*)[",']/g, `minHeight:350px;height:${isZoom ? "500px" : "100%"}`)


                            } `;
                    }
                    // if (full)
                    //     console.log("BLOCK2:", { html })
                    html = html.replace('&rsquo;', "'");
                    return renderMarkdown({ blockType: p.blockType, md: html, dataId: 'markdown-block11', index: i, theme, linkColor, state: this.state, setState: (update) => this.setState(update) });
                case 'image': {
                    if (description.indexOf("That was no sweet") >= 0)
                        console.log("image block", image)
                    return <RenderImage dataId={`image - dds - ${i} `} image={image} top={top} loud={loud} full={full} opened={opened} type={type} subtype={subtype} />
                }
                case 'rich-link': {
                    const m = p.meta;
                    if (m) {
                        //console.log("qwiket rich-link meta:", m)
                        const embeddedQwiket = Immutable.fromJS(
                            {
                                relation: 'level',

                                title: m.title,
                                description: m.description,
                                image_src: m.image_src ? m.image_src : m.image,
                                image: m.image,
                                author: m.author,
                                authorAvatar: m.authorAvatar,
                                categoryName: m.site_name,
                                categoryIcon: m.avatar,
                                publishedTime: m.publishedTime,
                                link: m.url,
                                typeOfQwiket: 'embed',
                                opened: true,
                                topLevel: true, isTwitter: false, isDisqus: false, childrenCount: 0, meta: false, inShow: false
                            });
                        /*html = <div style={{ width: '100%', padding: 8 }}>
                            <Qwiket
                                inShow={false}
                                level={embeddedQwiket}
                                children={new Immutable.List()}
                                parents={new Immutable.List()}
                                levelLink={m.url}
                                replyLink={""}
                                likeLink={""}
                                shareLink={""}
                                flagLink={""}
                                date={m.publishedTime}
                                colorBorder={""}
                                globals={globals}
                                session={session}
                                meta={false}
                                zoom={z}
                                history={history}
                            /> */
                        return <div className="q-qwiket-rich-link"><QwiketRenderer
                            full={false}
                            topic={embeddedQwiket}
                            globals={globalse}
                            state={state}
                            setState={setState}
                        />
                        </div >
                    }
                }

            }
        });
        // if (full)
        //     console.log("<<<<<END BLOCKS MAP");
        let header = null;
        if (type == 'comment') {
            /*
             {image_src ? <ModalImage className="q-comment-main-image" small={image_src} medium={image_src} large={image_src} /> : null}
             <Markdown data-id="markdown" allowedNodeTypes={["html", "heading", "text", "paragraph", "break", "blockquote", "list", "listItem", "code", "delete", "strong", "emphasis", "link", "image"]} escapeHtml={false} source={"" + topic.get("description") + ""} />
             */
        }
        else {
            switch (subtype) {
                case 'child':
                    header = <div data-id="subtype-child-outer" className="selectable" style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', paddingRight: 8 }}>
                        <div ata-id="subtype-child-inner" style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                            <Reply style={{ maxHeight: 24, marginRight: 8, opacity: 0.5 }} />


                            <img data-id="001" style={{ position: 'relative', maxHeight: 18, maxWidth: 60, marginTop: 0, marginLeft: 4, paddingTop: 0, marginRight: 6, }} src={(Root.__STORY__ ? "http://dev.qwiket.com" : "") + u.cdn(d.authorAvatar)} />

                            <div className="q-qwiket-author-small" >{author}</div>
                        </div>
                        <div style={{ display: 'flex' }}>{lapsed ? <div className="q-qwiket-lapsed">{lapsed}</div> : null}
                        </div></div>
                    break;
                case 'parent':
                    header = <div><div style={{ display: 'flex', justifyContent: 'flex-start', paddingRight: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                            <img data-id="007" style={{ position: 'relative', maxWidth: 28, marginTop: 0, paddingTop: 0, marginRight: 6 }} src={u.cdn(d.authorAvatar)} />
                            <div className={top ? "q-qwiket-author-small" : "q-qwiket-author-small"}>{author}</div>

                        </div>
                        <div style={{ display: 'flex' }}>
                            {lapsed && (!d.topLevel) ? <span className="q-qwiket-lapsed">{lapsed}</span> : null}

                            {!top ? <Reply style={{ maxHeight: 24, marginRight: 8, marginLeft: 8, opacity: 0.5 }} /> : null}
                        </div>

                    </div>
                        {(!full && top) ?

                            <Link href={d.v10Link.href} as={d.v10Link.as}><a data-id={`title-link-${d.v10Link.href.query.route}`} >
                                <div data-id="inner-block" onClick={() => { console.log("ONECLICK2"); onClick() }}>
                                    <div style={{ marginBottom: 10 }} >
                                        <div data-id="title31" className={full ? "q-qwiket-title-full" : "q-qwiket-title"} >{d.title}</div>


                                    </div>
                                </div>
                            </a></Link>
                            : null}
                    </div>
                    break;
                default:
                    header = <div style={{ width: '100%' }}>
                        <div data-id="level" style={{
                            position: 'relative',
                            display: 'flex', justifyContent: 'space-between', marginBottom: 4, marginTop: 4, flexDirection: 'row',
                            flexWrap: 'wrap',
                            width: '100%'
                        }}>
                            <div data-id="oval1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                                {sharedBy ? <div>Shared by:{sharedBy}</div> : null}
                                {(sharedBy && d.starColor && (top || d)) ?

                                    <div data-id="g12" ><Star style={{ width: 16, marginLeft: 10, color: d.starColor }} /></div>
                                    : null}
                                {(!top && d.starColor) ?

                                    <div data-id="g11" style={{ position: 'absolute', top: 0, right: 10 }}><Star style={{ width: 16, marginLeft: 10, color: d.starColor }} /></div>
                                    : null}
                                <div data-id="level11-3" className="selectable" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%', padding: 0 }}>
                                    <div data-id="l1" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginLeft: 2, alignItems: 'center' }}>
                                        <div data-id="l2" style={{ display: 'flex' }}>
                                            {!full ? <div style={{ position: 'relative' }}>
                                                {top ? <img data-id="003" className={!loud ? 'bleach' : 'not-bleach'} style={{ position: 'relative', maxWidth: loud ? 38 : 28, maxHeight: loud ? 38 : 28, marginTop: 10, paddingTop: 0, marginRight: 16, marginBottom: 10 }} src={u.cdn(catAvatar)} />
                                                    : <img data-id="0033" className={!loud ? 'bleach' : 'not-bleach'} style={{ position: 'relative', maxWidth: loud ? 38 : 28, maxHeight: loud ? 38 : 28, marginTop: 10, paddingTop: 0, marginRight: 6, marginBottom: 10 }} src={u.cdn(d.authorAvatar)} />}

                                            </div> : null}

                                        </div>

                                        {!full && top && subtype != 'parent' ? <div data-id="a125" className="q-qwiket-copyright-small">&copy;&nbsp;{d.categoryName}</div> : subtype == 'parent' ? <div data-id="a126" className="q-qwiket-author-small" >{d.author}</div> : null}

                                        {sharedBy && full ? <div data-id="113" style={{ display: 'flex', marginLeft: 0, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className="q-qwiket-author" style={{ marginTop: 0 }}>Shared by {d.sharedBy}</div>
                                                {(d.starColor && (!d.topLevel || d)) ?
                                                    <Link  {...route({ sel: 'context', qparams, nextParams: { topic: [{ threadid: 'become-qwiket-member' }] } })}><a data-id={`subsribe-link-${d.v10Link.href.query.route}`} >

                                                        <div data-id="g2"><Star style={{ marginLeft: 10, color: d.starColor }} /></div>
                                                    </a></Link> : null}
                                            </div>

                                        </div> : null}

                                        {!full && !top && subtype == 'level' ? <div data-id="a432" ><div className="q-qwiket-author-small-short" >{author}</div> </div> : null}
                                    </div>
                                    {lapsed && ((subtype == 'level' && !top) || loud && !full) ? <span data-id="l2" className="q-qwiket-lapsed" >{`${lapsed} `}</span> : null}

                                </div>

                                {!full && type != 'comment' && subtype == 'level' && top ? <div data-id="a432" style={{ marginLeft: 2 }}>
                                    <div className="q-qwiket-author-small" >{author}</div> </div> : null}


                            </div>

                            {(!full && top) ? <Link href={d.v10Link.href} as={d.v10Link.as}><a data-id={`title-full-link-${d.v10Link.href.query.route}`} >

                                <div data-id="title-block" onClick={() => { console.log("ONECLICK3", { link, d }); onClick() }}>
                                    <div  >
                                        <div data-id="title3" className={full ? "q-qwiket-title-full" : "q-qwiket-title"} >{d.title}</div>


                                    </div></div>
                            </a></Link> : null}
                            {full ? <a data-id="masked-link" href={d.url} target="article" >
                                <div data-id="title-block" onClick={() => { console.log("ONECLICK3", { link, d }); onClick() }}>
                                    <div  >
                                        <div data-id="title32" className={full ? "q-qwiket-title-full" : "q-qwiket-title"} >{d.title}</div>


                                    </div></div>
                            </a> : null}
                        </div></div >

            }
        }
        /*
{approver || (loud && !d.topLevel) ? approver ? <QwiketMenu qwiketid={d.threadid} updateOnlineState={updateOnlineState} reshare={d.reshare} history={history} icon={<img data-id="009" style={{ marginRight: 8, marginTop: 0, opacity: inShow ? 1.0 : 0.7 }} height={24} src={u.cdn(d.indicatorIcon)} />} stickie={d.stickie} editLink={editLink} un={un} /> : <img data-id="004" style={{ marginRight: 2, opacity: inShow ? 0.5 : 0.4 }} height={24} src={u.cdn(d.indicatorIcon)} /> : null}

            */
        //if (subtype == 'parent')
        //    console.log("qwiket-renderer:", {link})
        const StyledDiv = styled.div`
           & a{
                cursor:pointer;
                text-decoration:none;
                color:${textColor};
            }
        `;
        //console.log("QwiketRenderer RENDER", { textColor })
        return (<StyledDiv data-id="QWIKET_RENDERER2" key={key} className={full ? 'q-full' : subtype == 'parent' && !top ? 'q-column q-weak' : shaded ? 'q-column-shaded' : 'q-column'}>
            {header}
            <div data-id={`d1-${type}`}>{type == "full" ? <div style={{ opacity: subtype == 'parent' ? 0.9 : 1.0 }} data-id="inner-blocks">
                {blocks}
            </div> : <div data-id="m1">  <Link href={d.v10Link.href} as={d.v10Link.as}><a data-id={`blocks-link-${d.v10Link.href.query.route}`} >
                <div style={{ opacity: subtype == 'parent' ? 0.9 : 1.0 }} data-id="d2-inner-blocks" onClick={onClick}>
                    {blocks}
                </div>
            </a></Link></div>}</div>



            <div>
                {
                    body && body.blocks && full && !readMore ? <div data-id="oolong-short" style={{ height: 60, width: '100%', paddingBottom: 20, marginTop: 20, cursor: 'pointer', display: 'flex', justifyContent: 'flex-end', paddingRight: 8, fontSize: '0.9rem', alignItems: 'flex-end' }} onClick={() => setLong(!readMore)}>
                        Show More<ChevronDown style={{ height: 38, width: 38 }} /></div> : null
                }
                {full && readMore ? <div data-id="oolong-long" className="q-qwiket-rollup" onClick={() => setLong(!readMore)}>
                    Roll Up<ChevronUp style={{ height: 38, width: 38 }} /> </div> : null
                }
                <div style={{ width: '100%' }}> {full && (reshare == 0 || reshare == 100) ? <div className=".q-qwiket-aaaa-wrap" style={{ display: 'flex', marginBottom: 20, width: '100%' }}><a className="q-qwiket-a" style={{
                    width: '100%',
                    textAlign: 'center'
                }} href={d.url} target="article">{d.url}</a></div> : null}</div>
                <ReactHoverObserver>
                    {({ isHovering }) => (
                        <div>{d.childrenCount > 0 ? <div style={{ margingRight: 8, display: 'flex', justifyContent: 'flex-end', opacity: 0.8, marginRight: 8, marginBottom: 8, alignItems: 'center' }}><Replies style={{ maxHeight: 14, marginRight: 0 }} />{isHovering ? " Sub-thread size: " : ""}{d.childrenCount}</div> : null}</div>
                    )}</ReactHoverObserver>
                {(!full && opened && top && (subtype == 'parent')) ? <div data-id="blank-1" style={{ height: 20, marginTop: 10, borderTop: 'dotted thin green', opacity: 0.4 }} /> : null}
            </div>

        </StyledDiv >)
    }
}
QwiketRenderer = withTheme(QwiketRenderer)
