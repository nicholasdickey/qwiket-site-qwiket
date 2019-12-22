import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Queue from '../qwiket-lib/components/queue'
import { QwiketItem } from './qwikets/items/qwiketItem'
import Topic from './topic'
import Tag from './tag'
import u from '../qwiket-lib/lib/utils'
import Root from 'window-or-global'
import { Hotlist, HotItem } from './hotlist'

//let Hotlist = () => <div />
//let HotItem = () => <div />
let HotlistRow = React.memo(({ layres, qparams, loud, theme, channel }) => {
    // return <div>HOTLIST {spaces}</div>
    let spaces = layres.spaces;
    let singleWidth = layres.singleWidth;
    console.log('HotlistRow', { singleWidth, channel, qparams })
    const listRenderer = ({ rows }) => {
        //   console.log("render listRenderer", { type, selector })
        return <Hotlist spaces={spaces} qparams={qparams} loud={loud} rows={rows} />
    }
    const renderer = ({ item, channel, wrapper }) => {
        console.log('HotItem renderer', { channel })
        return <HotItem wrapper={wrapper} width={singleWidth} item={item} loud={loud} theme={theme} qparams={qparams} channel={channel} />
    }
    console.log("HotlistRow", { qparams })
    return <Queue tag={'hot'} spaces={spaces} renderer={renderer} qparams={qparams} listRenderer={listRenderer} />
})
let Column = React.memo(({ column, qparams }) => {
    if (!qparams && Root.qparams)
        qparams = Root.qparams;
    console.log("COLUMN:", { qparams })
    let tag = qparams.tag || qparams.shortname;
    let width = column.percentWidth;
    const StyledColumn = styled.div`
        width:${width};
    `
    const InnerStyledColumn = styled.div`
        width:100%;
    `
    let type = column.type;
    let selector = column.selector;
    let msc = column.msc;
    const listRenderer = ({ rows }) => {
        //   console.log("render listRenderer", { type, selector })
        return <InnerStyledColumn data-id="inner-styled-column" className="q-column">{rows}</InnerStyledColumn>
    }
    switch (selector) {
        case 'newsviews':
        case 'topics': {
            // console.log(`Column: ${selector}`)
            const renderer = ({ item, channel, wrapper }) => {
                //const [ref, setRef] = useState(false);
                //  console.log("RENDERER:", item)


                return <QwiketItem wrapper={wrapper} qparams={qparams} columnType={selector} topic={item} channel={channel} forceShow={false} approver={false} test={false} />
            }
            return <StyledColumn data-id="styled-column"><Queue qparams={qparams} tag={selector} renderer={renderer} listRenderer={listRenderer} /></StyledColumn>
        }
        case 'feed': {
            // console.log("Column:feed")
            const renderer = ({ item, channel, wrapper }) => {
                //const [ref, setRef] = useState(false);
                //  console.log("RENDERER:", item)


                return <QwiketItem wrapper={wrapper} columnType={'feed'} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
            }
            return <Queue tag={tag} renderer={renderer} qparams={qparams} listRenderer={listRenderer} />
        }
        case "topic": {
            // console.log("dbb Column:topic ", { qwiketid: qparams.threadid, time: Date.now() })
            let InnerTagWrap = styled.div`
                width:100%;
                display:flex;
            `
            let TopicWrap = styled.div`
                width:66.667%;
            `
            let FeedWrap = styled.div`
                width:33.333%;
            `
            let InnerFeedWrap = styled.div`
                width:100% !important;
            `
            tag = tag;
            // console.log("Column:feed", { tag })
            const renderer = ({ item, channel, wrapper }) => {
                //const [ref, setRef] = useState(false);
                //  console.log("RENDERER:", tag)


                return <QwiketItem wrapper={wrapper} qparams={qparams} columnType={'feed'} topic={item} channel={channel} forceShow={false} approver={false} test={false} />
            }
            return <StyledColumn data-id="styled-column">
                <Tag qparams={qparams} />
                <InnerTagWrap data-id="inner-tag-wrap">
                    <TopicWrap>
                        <Topic qparams={qparams} />
                    </TopicWrap>

                    <FeedWrap data-id="feed-wrap" >
                        <InnerFeedWrap data-id="inner-feed-wrap">
                            <Queue qparams={qparams} tag={tag} renderer={renderer} listRenderer={listRenderer} />
                        </InnerFeedWrap>
                    </FeedWrap>
                </InnerTagWrap>
            </StyledColumn>
        }
    }
    return <StyledColumn>{JSON.stringify(column, null, 4)}</StyledColumn>
});
let LayoutRes = React.memo(({ layout, res, hot, ...other }) => {
    // if (Root.qparams)
    //    qparams = Root.qparams;

    let layres = layout[res];
    console.log("LAYRES", layres, { other });
    let columns = layres.columns;
    //console.log({ columns })
    let cols = columns.map(c => {
        // console.log("column", res, c)
        return <Column column={c} {...other} />
    })
    let View = styled.div`
        width:100%;
        display:flex;     
    `
    let OuterWrap = styled.div`
        width:100%;

    `
    console.log({ layres })
    return <OuterWrap>
        {hot ? <HotlistRow layres={layres}  {...other} /> : null}
        <View>{cols}</View>
    </OuterWrap>


});
class LayoutView extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log("LayoutView constructor")
    }
    shouldComponentUpdate(nextProps) {
        let props = this.props;
        let widthChanged = props.width != nextProps.width;
        let layoutChanged = props.layout != nextProps.layout;
        console.log("shouldComponentUpdate LayoutView ", { widthChanged, layoutChanged });
        return widthChanged || layoutChanged;
    }
    render() {
        let { layout, width, ...other } = this.props;
        console.log("LAYOUT_VIEW:", { width, other });
        let layoutView = layout.layoutView;
        // let columns = layout.columns;
        // let defaultWidth = session.get("defaultWidth");
        //  console.log("defaultWidth:", +defaultWidth, +session.get("width"))
        let W000 = styled.div`
      //  display:none;
        width:100%;
        @media only screen  and (min-width:1px) and (max-width:899px){
            display:flex;
        }
    `
        let W900 = styled.div`
      //  display:none;
        width:100%;
        @media  only screen and (min-width:900px) and (max-width:1199px){
            display:flex;
        }
    `
        let W1200 = styled.div`
       // display:none;
        width:100%;
        @media  only screen and (min-width:1200px) and (max-width:1799px){
            display:flex;
        }
    `
        let W1800 = styled.div`
        width:100%;
     //  display:none;
        @media  only screen and (min-width:1800px) and (max-width:2099px){
            display:flex;
        }
    `
        let W2100 = styled.div`
        width:100%;
       // display:none;
        @media  only screen and  (min-width:2100px) {
            display:flex;
        }
    `
        const OuterWrapper = styled.div`
        width:100%;
        `;
        // console.log("LAYOUTVIEW ", { width })
        return <OuterWrapper>

            {width == 750 ? <W000><LayoutRes layout={layoutView} {...other} res="w900" /></W000> : null}
            {width == 900 ? <W900><LayoutRes layout={layoutView} {...other} res="w900" /></W900> : null}
            {width == 1200 ? <W1200><LayoutRes layout={layoutView} {...other} res="w1200" /></W1200> : null}
            {width == 1800 ? <W1800><LayoutRes layout={layoutView} {...other} res="w1800" /></W1800> : null}
            {width == 2100 ? <W2100><LayoutRes layout={layoutView} {...other} res="w2100" /></W2100> : null}

        </OuterWrapper>
        // return <div>{JSON.stringify(layout, null, 4)}</div>
    }
}

export default LayoutView