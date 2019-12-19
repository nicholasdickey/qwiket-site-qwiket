import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { QwiketComment } from './qwikets/qwiketComment'
import Root from 'window-or-global'
import Disqus from './disqus'
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
let Topic = ({ theme, qparams, app, context, session, actions }) => {  // a.k.a context main panel
  if (Root.qparams)
    qparams = Root.qparams;
  let topic = context.get("topic");
  if (!topic) {
    console.log("NO TOPIC");
    return <div />
  }
  console.log("RENDER TOPIC", qparams);

  let details = app.get("channel").get("channelDetails");
  let forum = details.get("forum");
  let isDay = session.get("dark") ? 0 : 1;
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
  let channel = app.get("channel").get("channel");
  let homeChannel = app.get("channel").get("homeChannel")
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
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
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



  </OuterTopic>
}
function mapStateToProps(state) {
  return {
    app: state.app,
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Topic))