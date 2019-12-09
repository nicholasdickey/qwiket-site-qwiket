import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { QwiketComment } from './qwikets/qwiketComment'

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
let Topic = ({ app, session, context, qparams, user }) => {  // a.k.a context main panel
  let topic = context.get("topic");
  if (!topic) {
    console.log("NO TOPIC");
    return <div />
  }
  let channel = app.get("channel").get("channel");
  let homeChannel = app.get("channel").get("homeChannel")

  let OuterTopic = styled.div`

    `;
  console.log("TOPIC:", topic.toJS())
  //< QwiketItem columnType = { 'context'} topic = { topic } channel = { channel } qparams = { qparams } forceShow = { true} approver = { false} test = { false} />
  return <OuterTopic><QwiketComment
    topic={topic}
    level={0}
    pageRootThreadid={qparams.threadid}

    homeChannel={homeChannel}
    shortname={qparams.shortname}
    //approver={approver || isCatAdmin}
    channel={channel}
    rootThreadid={qparams.threadid}
    baseThreadid={qparams.threadid}
    qparams={qparams}
    topicOnly={true}

  /></OuterTopic>
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
    // actions: bindActionCreators({ updateSession }, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Topic)