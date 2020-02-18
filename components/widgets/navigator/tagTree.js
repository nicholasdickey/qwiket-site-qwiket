import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Immutable from "immutable"
import styled from 'styled-components'
import Root from 'window-or-global'
import Router from 'next/router';
import Link from 'next/link'


import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import SwipeableViews from 'react-swipeable-views';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import { updateNavigatorData, fetchMetatag, updateSession, saveNewslineDefinition } from '../../../qwiket-lib/actions/app'
import { NavigatorData } from '../../../qwiket-lib/components/navigatorData'
import { route } from '../../../qwiket-lib/lib/qwiketRouter';


import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import blueGrey from '@material-ui/core/colors/blueGrey';
import teal from '@material-ui/core/colors/teal';
import cyan from '@material-ui/core/colors/cyan';
import purple from '@material-ui/core/colors/purple';
import lightGreen from '@material-ui/core/colors/lightGreen';


import { Select, FormLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import ArrowUp from 'mdi-material-ui/ArrowUp';
import ArrowForward from 'mdi-material-ui/ArrowRight';
import ArrowDownward from 'mdi-material-ui/ArrowDown';

import { Feeds } from './feeds'

const purple500 = purple[500];
const lightGreen900 = lightGreen[900];

export let TagTree = ({ session, channel, parents, level, childrenItems, feeds, actions, user, navigatorData, qparams, ...other }) => {
    //   const [sel, setSel] = React.useState(-1);
    const theme = useTheme();
    let palette = theme.palette;
    let dark = palette.type == 'dark' ? 1 : 0;
    let sel = navigatorData.get("sel");
    if (!sel) {
        let channelDetails = channel.get("channelDetails");
        let config = channelDetails.get("config");
        sel = { categores: config.get("cme") };
    }
    console.log({ sel })
    //    console.log("TagTree", { user: JSON.stringify(user.toJS()), feeds: JSON.stringify(feeds.toJS(), null, 4), parents: parents.toJS(), level: level.toJS(), childrenItems: childrenItems.toJS() })
    let CategoryItem = ({ cpath, noneSelected, name, image, description, shortname, solo, selected, setSel, index, type, currentTag }) => {
        //  console.log("CategoryItem cpath=", cpath, 'shortname=', shortname)
        if (!cpath)
            cpath = ":"
        //  const [stateIncluded, setStateIncluded] = React.useState(included);
        // const [stateSelected, setStateSelected] = React.useState(selected);
        //  console.log("CategoyType", type)
        // let cpath = '';
        //  let cme = '';
        //  console.log("currentTag:", currentTag, cpath)
        // const [stateSolo, setStateSolo] = React.useState(solo);
        let username = user.get('username');
        let userEntities = user.get('userEntities');
        let a;
        switch (type) {
            case "parent":
                a = <Avatar className="q-navigator-arrow" backgroundColor={lightGreen900}><ArrowUp className="q-navigator-arrow-icon" color={'#eee'} /></Avatar>;
                break;
            case "level":
                a = <Avatar className="q-navigator-arrow" backgroundColor={lightGreen900}><ArrowForward className="q-navigator-arrow-icon" color={'#eee'} /></Avatar>;
                break;
            case "child":
                a = <Avatar className="q-navigator-arrow" backgroundColor={lightGreen900}><ArrowDownward className="q-navigator-arrow-icon" color={'#eee'} /></Avatar>;
                break;
        }

        //let tagEntity = null// metatag.get("entity");
        //let tagOwner = null// metatag.get("owner");
        let admin = false//userEntities.indexOf(tagEntity) >= 0 || tagOwner == username;

        const border = selected || (selected || noneSelected) && solo ? dark ? `thin solid ${solo ? red[600] : green[600]}` : `thin solid ${(selected || noneSelected) && solo ? red[200] : green[200]}` : `none`;
        let soloLink = route(
            {
                sel: qparams.sel,
                qparams,
                nextParams: {
                    solo: [{ soloShortname: shortname }]
                }
            });
        let cancelSoloLink = route(
            {
                sel: qparams.sel,
                qparams,
                nextParams: {
                    solo: false
                }
            });
        let cpathLink = route(
            {
                sel: qparams.sel,
                qparams,
                nextParams: {
                    cpath: [{ cpath }],
                    cme: [{ cme: shortname }]
                }
            });
        //  console.log("Building cpathLink", cpath, cpathLink)

        // console.log({ soloLink })
        const handleToggle = () => {
            let inc = stateIncluded ? 0 : 1;
            setStateIncluded(inc);
            let channelShortname = channel.get("channel");
            let myFeeds = myFeedsData.get(channelShortname);
            /* for (var i = 0; i < myFeeds.size; i++) {
                 let item = myFeeds.get(i);
                 if (item.get("shortname") == shortname) {
                     console.log("MF FOUND ", shortname);
                     item = item.set('included', inc);
                     myFeeds = myFeeds.set(i, item);
                 }
                 // item = item.delete("tag");
 
             }*/
            console.log("MF SAVING myFeedsData", { channel: channelShortname, myFeeds: myFeeds.toJS(), myFeedsData: myFeedsData.toJS() })
            actions.saveNewslineDefinition({ channel: channelShortname, type: removable ? 'myfeeds' : 'newsline', myFeeds });
        };
        const handleClick = () => {
            let channelShortname = channel.get("channel");

            if (selected)
                setSel({ categories: -1 });
            else {
                console.log("calling setSel", { update: { sel: { categories: shortname } } })
                actions.updateNavigatorData({ update: { sel: { categories: shortname } } });
                //   setSel({ sel: { categories: shortname } });
                actions.fetchMetatag({ cpath, cme: shortname, channel: channelShortname, metatag: currentTag });
            }
        }
        //   console.log("CategoryItem", { name, solo, currentTag }) //: currentTag ? JSON.stringify(currentTag.toJS(), null, 4) : {}
        const StyledAvatar = styled(({ ...other }) => <Avatar{...other} />)`
           & .small-avatar{ 
                 width: 10px;
                height:10px;
           }
        `;
        const Styles = styled.div` 
        padding-right:20px;
        margin-right:-20px;
        padding-left:20px;
        margin-left:-20px;
        margin-top:4px;
        margin-bottom:4px;
        border:${border};
        border-radius:12px;
        & .small-avatar{ 
                width: 24px;
                height:24px;
                margin-left:-10px;
            
            
              
           }
        & .navi-text{
            font-size:0.9rem !important;
           // margin-right:16px;
           // padding-right:14px;
           
        }
        & .toggle{
            margin-right:-25px;
            color:${palette.background.default};
            font-size:1.0rem !important;

        }
       
        & .selected{
            color:${palette.background.paper} !important;
        }
        & .track{
            background-color:${palette.action.active} !important;
        }
          & .thumb{
            color:${ palette.grey[palette.type == "light" ? 100 : 300]} !important;
        }
        & .li{
           cursor:pointer;  
        }
        & a{
            color:${palette.linkColor} !important
        }  
        & .q-navigator-arrow{
             margin-right:-10px;
        width:24px !important;
        height:24px !important;
      }
      & .q-navigator-arrow-icon{
        width:18px !important;
        height:18px !important;
      }
  
        `;
        const FeedControls = styled.div`
        display:flex;
        margin-left:-20px;
        margin-right:-20px;
        justify-content:space-between;
        align-items:center;
        `;
        const FeedControl = styled.div`
        margin:10px;
        font-size:0.9rem;
        `;
        return <Styles onClick={handleClick}><ListItem className="li" alignItems="flex-start" >
            <ListItemAvatar>
                <StyledAvatar className="small-avatar" classes={{ root: 'small-avatar' }} alt={name} src={image} />
            </ListItemAvatar>
            <ListItemText
                classes={{ primary: "navi-text" }}
                primary={name}
                secondary={
                    <React.Fragment>
                        {selected || solo ? <Typography
                            component="span"
                            variant="body2"
                            className={'tag-inline'}
                            color="textSecondary"
                        >
                            {description}
                        </Typography> : null}

                    </React.Fragment>
                }
            />
            <ListItemSecondaryAction>

                {a}
            </ListItemSecondaryAction>


        </ListItem >
            {selected || (selected || noneSelected) && solo ? <FeedControls>{solo ? <FeedControl><Link replace scroll={false} href={cancelSoloLink.href} as={cancelSoloLink.as}><a rel="nofollow" data-id={`solo-link-${cancelSoloLink.href.query.route}`}><Button variant="outlined">Cancel Solo Mode</Button></a></Link></FeedControl>
                : <FeedControl><Link replace scroll={false} href={soloLink.href} as={soloLink.as}><a rel="nofollow" data-id={`solo-link-${soloLink.href.query.route}`}><Button variant="outlined">Solo Mode</Button></a></Link></FeedControl>}

                {admin ? <FeedControl><Link replace scroll={false} href={soloLink.href} as={soloLink.as}><a rel="nofollow" data-id={`solo-link-${soloLink.href.query.route}`}><Button variant="outlined">Edit</Button></a></Link></FeedControl> : null}
                {admin ? <FeedControl><Link replace scroll={false} href={soloLink.href} as={soloLink.as}><a rel="nofollow" data-id={`solo-link-${soloLink.href.query.route}`}><Button variant="outlined">Remove</Button></a></Link></FeedControl> : null}

            </FeedControls> : null}</Styles >

    }

    let Categories = ({ sel, setSel, type, ...other }) => {
        //  console.log("MyFeeds", { qparams })
        let mf = [];
        const theme = useTheme();
        let palette = theme.palette;
        //   console.log({ palette })

        let items = type == 'parent' ? parents : type == 'level' ? level : type == 'children' ? childrenItems : null;
        //   console.log("Categories", items ? items.toJS() : [])
        if (!items)
            return null;
        items.forEach((item, i) => {
            // console.log({ item: item.toJS() })
            // let tag = item.get("tag");
            let shortname = item.get("shortname");
            //  if (tag)
            let s = sel ? sel.categories == shortname : false;//= sel && type == sel.type && shortname == sel.shortname;
            let cpath = item.get("cpath");
            // console.log("Categories Item", { shortname, soloShortname: qparams.soloShortname, cpath })
            mf.push(<CategoryItem type={type} noneSelected={sel == -1} shortname={shortname} cpath={cpath} name={item.get("name")} image={item.get("icon")} description={item.get("description")} solo={shortname == qparams.soloShortname} selected={s} index={i} setSel={setSel} qparams={qparams} {...other} />)
        });
        let OuterWrap = styled.div`
            width:100%;
            & .tabs{
                margin-right:20px;
                margin-left:20px;
            }
            & .styled-tab{
                min-width:52px;
                 position:relative;
            }
            & .tab-label{
                color:${palette.text.primary} !important; 
            }
            & .indicator{
                background-color:${palette.text.secondary} !important; 
            }
            & .tag-inline{
                display:inline;
            }
            
        `;
        return <OuterWrap><List>{mf}</List></OuterWrap>
    }
    let FeedsSection = ({ feeds: feedsSection, channel, navigatorData, ...other }) => {


        const children = feedsSection.get("children");
        let OuterWrap = styled.div`
            width:100%;
            & .tabs{
                margin-right:20px;
                margin-left:20px;
            }
            & .styled-tab{
                min-width:52px;
                 position:relative;
            }
            & .tab-label{
                color:${palette.text.primary} !important; 
            }
            & .indicator{
                background-color:${palette.text.secondary} !important; 
            }
            & .tag-inline{
                display:inline;
            }
           
        `;
        let sectionName = feedsSection.get("name");
        let sectionImage = feedsSection.get("icon");
        let sectionDescripton = feedsSection.get("description");
        let sectionFeeds = feedsSection.get("feeds");
        let sel = navigatorData ? navigatorData.get("sel") : Immutable.fromJS({});

        let childrenRows = [];
        if (children)
            children.forEach(child => {
                let sectionName = child.get("name");
                let sectionImage = child.get("icon");
                let sectionDescripton = child.get("description");
                let sectionFeeds = child.get("feeds");
                // console.log({ sectonName, sectionImage, sectionDescripton, feedsSize: sectionFeeds.size, sectionFeeds: JSON.stringify(sectionFeeds.toJS(), null, 4), });
                childrenRows.push(<FeedsSection feeds={child} channel={channel} {...other} />)
            })
        return <OuterWrap>
            <Divider />
            {sectionName}

            {sectionFeeds && sectionFeeds.size > 0 ? <Feeds channel={channel} type={'feeds'} feeds={sectionFeeds} sel={sel} navigatorData={navigatorData}{...other} /> : null}
            {childrenRows}
        </OuterWrap>;

    }

    let OuterWrap = styled.div`
            width:100%;
            & .tabs{
                margin-right:20px;
                margin-left:20px;
            }
            & .styled-tab{
                min-width:52px;
                 position:relative;
            }
            & .tab-label{
                color:${palette.text.primary} !important; 
            }
            & .indicator{
                background-color:${palette.text.secondary} !important; 
            }
            & .tag-inline{
                display:inline;
            }
           
        `;
    let SmallCaption = styled.div`
           width:100%;
            font-size:0.8rem;
            opacity:0.8;
           text-align:left;
           padding-top:4px;
           padding-bottom:4px;
           
        `;
    let LargeHeading = styled.div`
           width:100%;
            font-size:1.2rem;
            opacity:0.8;
           text-align:left;
           padding-top:14px;
           padding-bottom:4px;
           
        `;
    let SmallHeading = styled.div`
           width:100%;
            font-size:0.8rem;
            opacity:0.8;
           text-align:left;
           padding-top:4px;
           padding-bottom:14px;
           
        `;
    const StyledTab = styled(({ ...other }) => <Tab{...other} />)`
            position: relative;
            //display:flex;
            //width:100%;
            min-width:72px;;
            //align-items:flex-start;
            //flex-direction:row;
            //padding:10px 40px 10px 15px;
            //margin-left:10px;
            //margin-top:4px;
            color:${palette.text.primary};
            //font-family:roboto;
            

        `;
    //  console.log("========>", JSON.stringify(feeds.toJS(), null, 4))
    const setSel = ({ update }) => {
        console.log("calling updateNavigatorData", update)
        actions.updateNavigatorData({ update });
    }
    return <OuterWrap>
        <LargeHeading>Sections:</LargeHeading>
        <SmallHeading>Publicatons categories' hierarchy</SmallHeading>
        <Divider />
        {parents && parents.size > 0 ? <React.Fragment>
            <SmallCaption>Parents:</SmallCaption>
            <Categories type={'parent'} sel={sel} setSel={setSel}{...other} />
        </React.Fragment> : null}
        <Divider />
        <SmallCaption>Siblings:</SmallCaption>
        <Categories type={'level'} sel={sel} setSel={setSel}{...other} />
        <Divider />
        {childrenItems && childrenItems.size > 0 ? <React.Fragment>
            <SmallCaption>Children:</SmallCaption>
            <Categories type={'children'} sel={sel} setSel={setSel}{...other} />
        </React.Fragment> : null}
        <Divider />
        <LargeHeading> Publications (Feeds):</LargeHeading>
        <SmallHeading>Toggle to include in the newsline (My Feeds).</SmallHeading>

        <FeedsSection type={'feeds'} channel={channel} sel={sel} feeds={feeds} setSel={setSel} qparams={qparams} user={user} actions={actions}{...other} />


    </OuterWrap>

}

function mapStateToProps(state) {
    return {
        channel: state.app.get("channel"),
        navigatorData: state.app.get("navigatorData"),
        myFeedsData: state.app.get("myFeeds"),
        session: state.session,
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ updateNavigatorData, fetchMetatag, updateSession, saveNewslineDefinition }, dispatch)
    }
}
TagTree = connect(
    mapStateToProps,
    mapDispatchToProps
)(TagTree)