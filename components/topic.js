import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { QwiketComment } from './qwikets/qwiketComment'
import Root from 'window-or-global'
import Disqus from './disqus'
import Tag from './tag'
import Queue from '../qwiket-lib/components/queue'
import { setPost } from '../qwiket-lib/actions/app'
const StyledCheckbox = styled(({ ...other }) => <div classes={{ checked: 'checked', disabled: 'disabled' }}{...other} />)`
  color: #eee !important;
  width:200px%;
  & .label {
    #color: ${props => props.color};
    color: #ddd;
    font-size: 14px; 
    font-family: Asap Condensed;
    font-weight:bold;
  }
   & .checked {
    color: #eee !important;
   
  }
  & .disabled {
    color:  #aff; !important;
  }
`;

export let Context = ({ qparams, context, renderer, listRenderer }) => {

  if (Root.qparams)
    qparams = Root.qparams;

  let tag = qparams.tag || qparams.shortname;
  if (!tag) {
    let topic = context.get("topic");
    tag = topic.get("cat") || topic.get("category");
  }
  console.log("Context RENDER", { tag, qparams })
  const StyledColumn = styled.div`
        width:100%;
    `
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
let Topic = ({ theme, qparams, channel, context, session, actions }) => {  // a.k.a context main panel
  if (Root.qparams)
    qparams = Root.qparams;
  let topic = context.get("topic");
  if (!topic) {
    console.log("NO TOPIC");
    return <div />
  }
  console.log("RENDER TOPIC", qparams);

  let details = channel.get("channelDetails");
  let forum = details.get("forum");
  let isDay = session.get("theme") ? 1 : 0;
  // if (Root.qparams)
  //   qparams = Root.qparams;
  let qwiketid = qparams.threadid;
  let topicid = topic.get("qwiketid") || topic.get("threadid");
  if (qparams.hub)
    qwiketid = `${qparams.hub}-slug-${qwiketid}`
  if (qwiketid != topicid) {
    console.log("LOADING", { qwiketid, topicid })
    return <div>Loading...</div>
  }
  let shortname = qparams.tag || qparams.shortname;
  const muiTheme = theme;
  const backgroundColor = muiTheme.palette.background;
  const color = muiTheme.palette.text.primary;
  //let channel = app.get("channel").get("channel");
  let homeChannel = channel.get("homeChannel")
  var ch = (channel && channel != 'usconservative' && channel != 'qwiket') ? ('/channel/' + channel) : '';
  const disqusContextUrl = '/context' + ch
  let OuterTopic = styled.div`

    `;
  //console.log("dbb TOPIC:", qwiketid)
  //< QwiketItem columnType = { 'context'} topic = { topic } channel = { channel } qparams = { qparams } forceShow = { true} approver = { false} test = { false} />
  /*
  {tsHtml}
        {refCats}

        */
  let promotedHtml = '';
  return <OuterTopic><QwiketComment
    topic={topic}
    level={0}
    pageRootThreadid={qwiketid}

    homeChannel={homeChannel}
    shortname={qparams.shortname}
    //approver={approver || isCatAdmin}
    channel={channel}
    rootThreadid={qwiketid}
    baseThreadid={qwiketid}
    qparams={qparams}
    topicOnly={true}

  />
    <div style={{ paddingLeft: 8, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div data-id='w01' style={{ width: '100%' }}>

        {true ? <div style={{ width: '100%', height: '100%' }}>

        </div> : null}
      </div>
      <div data-id="w000">{promotedHtml}</div>
      <QwiketComment
        topic={topic}
        level={0}
        pageRootThreadid={qwiketid}

        channel={channel}
        rootThreadid={qwiketid}
        baseThreadid={qwiketid}
        qparams={qparams}
        commentsOnly={true}
      />



      {forum ? <div className="q-comments">
        <div style={{ display: 'flex', fontSize: '1.8rem', padding: 0, marginTop: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
          <img height={24} src={"https://c.disquscdn.com/next/c393ff4/marketing/assets/img/brand/disqus-social-icon-blue-white.svg"} />
          <span style={{ fontSize: '15px', fontWeight: 600 }}>Disqus</span>
        </div>

        <Disqus site={forum}
          theme={isDay}
          globals={session}
          contextUrl={disqusContextUrl}
          channel={channel}
          cc={qparams.cc} skip={topic ? topic.get("description") == "Please wait, it could take a minute or two to put the report together for you..." : true}
          threadid={qwiketid}
          realDisqThreadid={qwiketid}
          setPost={actions.setPost}
          shortname={shortname}
          color={color}
          topic={topic} />
      </div> : null}

    </div>

    <div data-id="qwiket-logo" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}> <img style={{ width: '50%', height: '50%', maxWidth: 300, maxHeight: 300 }} src="/static/css/qwiket-logo.png" /></div>



  </OuterTopic >
}
function mapStateToProps(state) {
  return {
    channel: state.app.get("channel"),
    session: state.session,
    context: state.context,
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ setPost }, dispatch)
  }
}
Topic = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Topic))

Context = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Context))