import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import Queue from '../qwiket-lib/components/queue'
import { QwiketItem } from './qwikets/items/qwiketItem'
import Topic from './topic'
import Tag from './tag'
import u from '../qwiket-lib/lib/utils'
let Column = ({ column, qparams }) => {
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
    const listRenderer = ({ qparams, rows, tag, ...rest }) => {
        return <InnerStyledColumn data-id="inner-styled-column" className="q-column">{rows}</InnerStyledColumn>
    }
    switch (selector) {
        case 'newsviews':
        case 'topics': {
            console.log(`Column: ${selector}`)
            const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                //const [ref, setRef] = useState(false);
                //  console.log("RENDERER:", item)


                return <QwiketItem columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
            }
            return <StyledColumn data-id="styled-column"><Queue tag={selector} renderer={renderer} qparams={qparams} listRenderer={listRenderer} /></StyledColumn>
        }
        case 'feed': {
            console.log("Column:feed")
            const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                //const [ref, setRef] = useState(false);
                //  console.log("RENDERER:", item)


                return <QwiketItem columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
            }
            return <Queue tag={selector} renderer={renderer} qparams={qparams} listRenderer={listRenderer} />
        }
        case "topic": {
            console.log("Column:topic")
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
            console.log("Column:feed")
            const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                //const [ref, setRef] = useState(false);
                //  console.log("RENDERER:", item)


                return <QwiketItem data-id="qwiket-item" columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
            }
            return <StyledColumn data-id="styled-column">
                <Tag qparams={qparams} />
                <InnerTagWrap data-id="inner-tag-wrap">
                    <TopicWrap>
                        <Topic qparams={qparams} />
                    </TopicWrap>

                    <FeedWrap data-id="feed-wrap" >
                        <InnerFeedWrap data-id="inner-feed-wrap">
                            <Queue tag={msc} renderer={renderer} qparams={qparams} listRenderer={listRenderer} />
                        </InnerFeedWrap>
                    </FeedWrap>
                </InnerTagWrap>
            </StyledColumn>
        }
    }
    return <StyledColumn>{JSON.stringify(column, null, 4)}</StyledColumn>
}
let LayoutRes = ({ layout, res, qparams }) => {
    let layres = layout[res];
    //console.log("LAYRES", layres);
    let columns = layres.columns;
    //console.log({ columns })
    let cols = columns.map(c => {
        // console.log("column", res, c)
        return <Column column={c} qparams={qparams} />
    })
    let View = styled.div`
        width:100%;
        display:flex;
        
    `
    // <div>{JSON.stringify(layres, null, 4)}</div>
    return <View>{cols}</View>


}
let LayoutView = ({ app, session, pageType, layout, user, qparams, actions }) => {
    // console.log("LAYOUT_VIEW:", layout);
    let layoutView = layout.layoutView;
    let columns = layout.columns;
    let defaultWidth = session.get("defaultWidth");
    console.log("defaultWidth:", +defaultWidth, +session.get("width"))
    let width = u.getLayoutWidth({ session });
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
    console.log("LAYOUTVIEW ", { width })
    return <OuterWrapper>
        {width == 750 ? <W000><LayoutRes layout={layoutView} res="w900" qparams={qparams} /></W000> : null}
        {width == 900 ? <W900><LayoutRes layout={layoutView} res="w900" qparams={qparams} /></W900> : null}
        {width == 1200 ? <W1200><LayoutRes layout={layoutView} res="w1200" qparams={qparams} /></W1200> : null}
        {width == 1800 ? <W1800><LayoutRes layout={layoutView} res="w1800" qparams={qparams} /></W1800> : null}
        {width == 2100 ? <W2100><LayoutRes layout={layoutView} res="w2100" qparams={qparams} /></W2100> : null}

    </OuterWrapper>
    // return <div>{JSON.stringify(layout, null, 4)}</div>
}

function mapDispatchToProps(dispatch) {
    return {
        // actions: bindActionCreators({ logout }, dispatch)
    }
}
function mapStateToProps(state) {
    return {
        app: state.app,
        session: state.session,
        user: state.user
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LayoutView)