import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Immutable from "immutable"
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
import { LinkPopup } from '../qwiket-lib/components/linkPage';
/**
 *
          {shortname == 'nro' ? <div style={{ textTransform: 'none', width: '100%', marginLeft: 'auto', alignItems: 'center', marginRight: 'auto', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.0rem' }}><a href={website}><div>{full_description + (channel == 'qwiket') ? (
              <div>
                <div>Waiting for NRO's<span style={{ color: 'red' }}> honest </span>apology to Covington Students for spreading libelous lies.
                      </div><div style={{ fontSize: '1.0rem' }}>And no, "Sorry for being too passionate", or "Everybody did it" is not it!</div></div>) : "Click here for more..."}</div></a>
              {channel == 'qwiket' ? <Clock
                date={Date(covingtonInterval)}
                format={`[${days} days]  HH:mm:ss`}
                style={{ fontSize: '1.2rem', color: 'red' }}
                ticking={true}
                interval={1000}

              /> : null}
            </div></div> : null}
 */
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
let Tag = ({ app, session, context, qparams, user }) => {  // a.k.a context main panel
  const muiTheme = useTheme();
  const backgroundColor = muiTheme.palette.background.default;
  const color = muiTheme.palette.text.primary;

  let [linkOpen, setLinkOpen] = useState(false);
  let leftWidth = '70%';
  let rightWidth = '30%';
  let topic = context.get("topic");
  let dark = +session.get('dark');
  if (!topic) {
    console.log("NO TOPIC");
    return <div />
  }
  let channel = app.get("channel").get("channel");
  let shortname = qparams.shortname;

  if (!shortname) { //if explicit shortname is not present in url, then pick the first tag from the topic itself
    let tags = topic.get("tags");
    console.log("Tag getting tags", tags.toJS());
    shortname = tags.get(0);
  }
  console.log({ app })
  let tags = app.get("tags");
  console.log("app tags", { tags: tags.toJS(), shortname })
  let metaTag = tags.get(shortname)
  console.log({ metaTag });
  if (metaTag)
    console.log({ raw_metaTag: metaTag, metaTag: metaTag.toJS() });
  else
    metaTag = Immutable.fromJS({ name: '', image: '', link: '', description: '' });
  let parent = metaTag ? metaTag.get("parentObject") : null;
  if (!parent) {
    console.log("NO PARENT!!!")
  }
  let parentShortname = parent ? parent.get("shortname") : '';
  let parentName = parent ? parent.get("name") : '';
  if (parent)
    console.log("parent:::", parent.toJS())
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
  let description = metaTag.get("description");
  let myfeeds = app.get("channel").get('myfeeds');
  let isIncluded = shortname => {
    return myfeeds.find(feed => (feed.shortname == shortname) && feed.included
    )
  }
  let hcolor = '#eee';
  if (dark == 1) {
    hcolor = '#222';
  }
  const linkColor = dark == 1 ? muiTheme.palette.linkColor.dark : muiTheme.palette.linkColor.light;

  let included = isIncluded(shortname);
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
  console.log("TOPIC:", topic.toJS())

  return <OuterWrap>

    <LeftWrap>
      <ParentLinks>
        {parentName ? <a><Link route='solo-newsline' params={{ channel, soloShortname: parentShortname }}>{parentName}</Link></a> : null}
        <a><Link route="news" params={{ channel }}>&nbsp;&nbsp;To Newsline</Link></a>
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
            qparams={qparams}
            shortname={shortname}
            channel={channel}
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

        color={red[900]}
      />}
      label={<span style={{ fontSize: '0.9rem' }}>In Newsline</span>}
    />

    </RightWrap>
  </OuterWrap>
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
)(Tag)