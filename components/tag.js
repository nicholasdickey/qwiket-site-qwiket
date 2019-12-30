import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Immutable from "immutable"
import Root from 'window-or-global'
import styled from 'styled-components';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import LinkPlus from 'mdi-material-ui/LinkPlus';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Toggle from '@material-ui/core/Switch';
import red from '@material-ui/core/colors/red';
import { ssRoutes } from '../qwiket-lib/routes'
import { Image } from 'react-bootstrap'
var Markdown = require('react-markdown');
let { Link, Router } = ssRoutes;
import { ClickWalledGarden } from '../qwiket-lib/components/walledGarden';
import LinkPopup from '../qwiket-lib/components/linkPage';

let RenderTag = React.memo(({ channel, shortname, parentName, parentShortname, metaLink, name, description, image, included, dark, actions }) => {
  console.log("RENDER RenderTag", shortname);
  const muiTheme = useTheme();
  const backgroundColor = muiTheme.palette.background.default;
  const color = muiTheme.palette.text.primary;

  let [linkOpen, setLinkOpen] = useState(false);
  let hcolor = '#eee';
  if (dark == 1) {
    hcolor = '#222';
  }
  const linkColor = dark == 1 ? muiTheme.palette.linkColor.dark : muiTheme.palette.linkColor.light;

  let leftWidth = '70%';
  let rightWidth = '30%';

  let OW = styled.div`
    width:100%;
    padding-right:4px;
  `
  let OuterWrap = styled.div`
      width:100%;
      margin-top:10px;
      display:flex;
      justify-content:space-between;
      line-height:1.2;
      background-color:${hcolor};
      & a{
        color:${color} !important;
      }
      & a:hover{
         color:${linkColor} !important;
        font-weight:500;
      }
    `;
  let LeftWrap = styled.div`
      width:${leftWidth};
      padding-right:6px;
    `;
  const OuterLink = styled(({ ...other }) => <div>{metaLink.external ? <a data-id="tag-outer-link-external" href={metLink.link} {...other} /> : <a data-id="tag-outer-link"><Link route={metaLink.route} params={metaLink.params} {...other} /></a>}</div>)`
    width:100%;
   `;
  const StyledPaper = styled(({ ...other }) => <Paper{...other} />)`
    position: relative;
    display:flex;
    width:100%;
    align-items:flex-start;
    flex-direction:row;
    padding:10px 40px 10px 15px;
    margin-left:10px;
    margin-top:4px;
  
    font-family:roboto;

  `;
  const StyledImage = styled(({ ...other }) => <Image{...other} />)`
   max-height:66px;
   margin:4px;

  `;
  const StyledIconButton = styled(({ ...other }) => <IconButton{...other} />)`
  margin-top:0px !important;
  `;

  const TitleOuterDiv = styled.div`
     margin-left:10px;
     flex-grow:10;
    
     display:flex;
     flex-direction:column;
     align-items:flex-end;
    `;
  const TitleDiv = styled.div`
    font-weight:500;
    margin-bottom:15px;
    font-size:${name.length > 24 ? '1.5rem' : '1.8rem'};
    `;
  const DescriptionDiv = styled.div`
    font-weight:400;
    font-size:${description.length > 24 ? '1rem' : '1.2rem'};
    `;
  const RightWrap = styled.div`
    width:${rightWidth};
    display:flex;
    justify-content:flex-end;
    `;
  const ParentLinks =
    styled.div`
   
    width:100%;
    display:flex;
    height:20px;
    font-size:0.9rem;
    margin:6px;
    justify-content:flex-begin;
    font-family:Asap Condensed;
    `;
  //console.log("TOPIC:", topic.toJS())

  return <OW><OuterWrap>

    <LeftWrap>
      <ParentLinks>
        {parentName ? <Link route='solo-newsline' params={{ channel, soloShortname: parentShortname }}><a>{parentName}</a></Link> : null}
        <Link route="news" params={{ channel }}><a>&nbsp;&nbsp;&nbsp;&nbsp;To Newsline</a></Link>
      </ParentLinks>
      <OuterLink>

        <StyledPaper>
          {Boolean(image) ? <StyledImage responsive src={image} /> : null}
          <TitleOuterDiv>
            {Boolean(name) ? <TitleDiv>{name}</TitleDiv> : null}
            {Boolean(description) ? <DescriptionDiv>{<Markdown escapeHtml={false} source={description} />}</DescriptionDiv> : null}
          </TitleOuterDiv>
        </StyledPaper>
      </OuterLink>
      <ClickWalledGarden placeHolder={<StyledIconButton variant="contained"><LinkPlus /></StyledIconButton>}>
        <div>

          <LinkPopup
            shortname={shortname}
            open={linkOpen}
            onClose={() => setLinkOpen(false)}
          ></LinkPopup>
          <StyledIconButton onClick={() => setLinkOpen(true)}
            variant="contained"
          >
            <LinkPlus />
          </StyledIconButton>
        </div>
      </ClickWalledGarden>
    </LeftWrap>
    <RightWrap> <FormControlLabel
      control={<Toggle
        id="includeToggle"
        checked={included ? true : false}
        onChange={(e, val) => {
          actions.includeCat(shortname, included ? 0 : 1);
          actions.includeFeed(channel, shortname, included ? 'exclude' : 'include');
        }}

        color="primary"
      />}
      label={<span style={{ fontSize: '0.9rem' }}>In Newsline</span>}
    />

    </RightWrap>
  </OuterWrap></OW >
});
let Tag = ({ qparams, context, app, session, actions }) => {  // a.k.a context main panel
  //  if (Root.qparams)
  //   qparams = Root.qparams;
  if (Root.qparams)
    qparams = Root.qparams;
  console.log("RENDER TAG 1")

  let topic = context.get("topic");
  let dark = ! +session.get('theme');
  if (!topic) {
    // console.log("NO TOPIC");
    return <div />
  }
  let channel = app.get("channel").get("channel");
  let shortname = qparams.tag || qparams.shortname;

  if (!shortname) { //if explicit shortname is not present in url, then pick the first tag from the topic itself
    let tags = topic.get("tags");
    //console.log("Tag getting tags", tags.toJS());
    shortname = tags.get(0);
  }
  // console.log({app})
  let tags = app.get("tags");
  console.log("app tags", { tags: tags ? tags.toJS() : '', shortname })
  let metaTag = tags ? tags.get(shortname) : ''
  //console.log({metaTag});
  if (metaTag) {
    // console.log({ raw_metaTag: metaTag, metaTag: metaTag.toJS() });
  }
  else
    metaTag = Immutable.fromJS({ name: 'Loading...', image: '', link: '', description: '' });
  let parent = metaTag ? metaTag.get("parentObject") : null;
  if (!parent) {
    // console.log("NO PARENT!!!")
  }
  console.log("RENDER TAG", { metaTag, shortname });
  let parentShortname = parent ? parent.get("shortname") : '';
  let parentName = parent ? parent.get("name") : '';
  //if (parent)
  //  console.log("parent:::", parent.toJS())
  let link = metaTag ? metaTag.get("link") : '';
  let metaLink = {};
  if (!link) {
    metaLink.params = { channel, shortname };
    metaLink.route = 'context-home';
    metaLink.external = false;
  }
  else {
    metaLink.external = true;
    metaLink.link = link;
  }
  let image = metaTag.get("image");
  let name = metaTag.get("name");
  if (!name)
    name = "Loading..."
  let description = metaTag.get("description");
  let myfeeds = app.get("channel").get('myfeeds');
  let isIncluded = shortname => {
    return myfeeds.find(feed => (feed.shortname == shortname) && feed.included
    )
  }

  let included = isIncluded(shortname);
  return <RenderTag
    channel={channel}
    shortname={shortname}
    parentName={parentName}
    parentShortname={parentShortname}
    metaLink={metaLink}
    name={name}
    description={description}
    image={image}
    included={included}
    dark={dark}
    actions={actions} />
}
function mapStateToProps(state) {
  return {
    app: state.app,
    session: state.session,
    context: state.context
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
)(React.memo(Tag))