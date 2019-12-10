import React, { Component, useState } from "react";
import styled from 'styled-components';
import $ from 'jquery';
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
import Link, { MaskedLink, linkPush } from '../../qwiket-lib/components/link'
import { ArticleView, renderToHtml } from '../../qwiket-lib/components/articleView'
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
const renderArticle = ({ topic, index, theme, globals, os, cs, zoom, channel, approver }) => {

    let threadid = topic.get("threadid");
    let editor = false;
    zoom = 'out';
    console.log("Render Article", { topic: topic ? topic.toJS() : 'no topic' })
    return <ArticleView globals={globals} approver={approver} os={os} cs={cs} zoom={zoom} editor={editor} topic={topic} threadid={threadid} channel={channel} />


}
const renderArticleHtml = ({ topic, index, theme, globals, os, cs, zoom, channel, approver }) => {

    let threadid = topic.get("threadid");
    let editor = false;
    zoom = 'out';
    console.log("Render Article", { topic: topic ? topic.toJS() : 'no topic' })
    return "<ArticleView globals={globals} approver={approver} os={os} cs={cs} zoom={zoom} editor={editor} topic={topic} threadid={threadid} channel={channel} />"


}

let ImageRenderer = (props) => {
    const [lightbox, setLightbox] = useState(false);

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

                onCloseRequest={() => setLightbox(false)}

            /><div data-id="image-renderer" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <img style={{ height: '100%', width: '100%' }}
                        onClick={() => setLightbox(true)} width={width ? width : null} height={height ? height : null} src={src} />
                </div></div> :
                <div data-id="image-renderer-2" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><img style={{ height: '100%', width: '100%' }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.setState({ lightbox: true }) }} width={width ? width : null} height={height ? height : null} src={src} /></div>}</div>
        // setTimeout(() => $.getScript("/static/css/fslightbox.js"), 1000)
        // return <a data-fslightbox={alt} href={`/lightbox/${encodeURIComponent(src)}`}><img width={width} height={height} src={src} /></a>
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
            return <iframe data-d1={r2} data-url={url} key={dataId + "-utube2-" + index} width='100%' height={315} src={vlink} style={{ marginLeft: "auto", marginRight: "auto" }} frameborder="0" allow="autoplay;encrypted-media" allowFullscreen={true} />;
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
            if (Root.__CLIENT__)
                setTimeout(() => {
                    window.twttr.widgets.load()
                    window.twttr.widgets.load();
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
const processBlock = ({ blockType, dataId, md, index, isDraft, theme, dark }) => {
    let html = null;
    let embeds = null;
    let changed = false;
    let linkColor = dark ? theme.palette.linkColor.dark : theme.palette.linkColor.light;
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
        <div data-id={blockType == 'text' ? 'textblock-' + dataId : 'htmlblock-' + dataId} key={`pre-render-blocks-key-${index}`} className={isDraft ? "q-qwiket-markdown-draft" : "q-qwiket-markdown"} >
            {blockType == 'text' ? <Markdown options={{
                forceBlock: true,
                overrides: {
                    img: {
                        component: RenderImage,
                        props: {

                            index: `lightbox-${index}`,

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
                    .q-full.q-qwiket-main-image{
                    object-fit: cover;
                    margin-top: 20px;
                    position: relative;
                    max-width: 100 % !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-column.q-qwiket-main-image{
                    position: relative;
                    max-width: 100 % !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-qwiket-main-image-full{

                    max-width: 100% !important;
                    max-height: 100% !important;
                    margin-left: auto;
                    margin-right: auto;
                }
                .q-qwiket-markdown{
                    max-width: 100%;
                   // font - size: 1.3rem;
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
export const renderMarkdown = ({ blockType, dataId, md, index, children, theme, isDraft, dropCap, dark }) => {
    let html = null;
    let embeds = null;
    let changed = false;
    console.log("renderMarkdown", { blockType, md })
    if (md.indexOf("undefined") >= 0)
        console.log("renderMArkdown", { blockType, md })
    md = md.replace(/undefined!/ig, '!');
    if (md.indexOf("undefined") >= 0)
        console.log("renderMArkdown2", { blockType, md })
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
        let bl = processBlock({ blockType, dataId, md, index, children, theme, dark });
        //  console.log("childo processBlock", bl);
        r.push(bl)

        //   console.log("childo2", r)
        if (r && r.length) {
            // console.log("childo3", r)
            ret = <div key={dataId + "render-block-" + index}>{r}</div>
        }
        else
            ret = processBlock({ blockType, dataId, md, index, children, isDraft, theme, dark });
    }
    else {
        ret = processBlock({ blockType, dataId, md, index, children, isDraft, theme, dark });
    }

    if (md.indexOf("That was no sweet") >= 0)
        console.log("renderMArkdown AFTER", { ret })
    return ret;
}
let RenderImage = ({ src, alt, index, withLightbox, ...rest }) => {
    const [lightbox, setLightbox] = useState(false);
    let width = 0;
    let height = 0;
    console.log(alt)
    const w = alt ? alt.split(':x:') : [];

    if (w) {
        width = (+w[0]) ? w[0] : width;
        height = (+w[1]) ? w[1] : height;
    }
    const ImageWrapper = styled.div`
        padding-bottom:6px;
        padding-top:6px;`;
    const StyledImage = ((props) => {
        <Image
            {...props} />
    })` 
        position:relative; 
        max-width: 100% !important;
        max-height: 100% !important;
        margin-left: auto;
        margin-right: auto;`
    let html = <ImageWrapper data-id={`image-outer-wrapper-${index}`} >
        <Image
            width={width ? width : null}
            width={height ? height : null}
            onClick={(e) => {
                if ((withLightbox))
                    setlightbox(true);
            }} responsive data-id={`image-wrap-${index}`}
            src={u.cdn(src)}
            small={src} medium={src} large={src} />
        {withLightbox && lightbox ?
            <div style={{ position: 'relative', top: 0, left: 0, zIndex: 102 }}><Lightbox
                mainSrc={src}
                onCloseRequest={() => { setLightbox(false) }}
            /></div> : null}
    </ImageWrapper >
    return html
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
export default function renderBlocks({ type, theme, isDraft, jsqwiket, includeImage, includeDescription, includeBody, htmlDescription, dark, isZoom }) {
    console.log({ jsqwiket })
    let { body, image, description } = jsqwiket;

    if (body == "none")
        return null;

    let blocks = [];
    if (includeDescription && description) {
        if (htmlDescription)
            blocks.push({ blockType: 'html', html: description });
        else {
            if (Root.__CLIENT__)
                description = $('<textarea />').html(description).text();
            blocks.push({ blockType: 'text', text: description, dropCap: true });
        }
    }
    if (includeImage && image) {
        blocks.push({ blockType: 'image', image });
    }
    if (includeBody && blocks) {
        blocks.push(...body.blocks);
    }

    blocks = blocks.map((p, i) => {
        // if (full)
        //    console.log("BLOCK:", { p, type, reshare, description, body, article, blockType: p.blockType, cond: (type == 'full' && +article && d.html) ? 1 : 0 })
        let html = <div />;
        switch (p.blockType) {
            //  case 'article1':
            //      return renderArticle({ topic, d, theme, globals, os, cs, zoom, channel, approver })
            case 'text':
                console.log("blockType text")
                return renderMarkdown({ blockType: p.blockType, dataId: 'text-block', md: p.text, index: i, theme, isDraft, dropCap: p.dropCap ? true : false, dark, izZoom });
            case 'article':
                return renderMarkdown({ md: renderToHtml({}), dataId: 'markdown-block12', index: i, theme, dark });
            case 'html': // scraped from external page or description block 
                console.log("blockType html")
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


                        }</div > `;
                }
                // if (full)
                //     console.log("BLOCK2:", { html })
                return renderMarkdown({ md: html, dataId: 'markdown-block11', index: i, theme });
            case 'image':
                console.log("blockType image")
                if (description.indexOf("That was no sweet") >= 0)
                    console.log("image block", image)
                return <RenderImage src={image} index={i} />

            case 'rich-link':
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

    });
    return blocks;
};


//QwiketRenderer = withTheme(QwiketRenderer)