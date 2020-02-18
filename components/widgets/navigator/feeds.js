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
import { updateSession, saveNewslineDefinition } from '../../../qwiket-lib/actions/app'
import { NavigatorData } from '../../../qwiket-lib/components/navigatorData'
import { route } from '../../../qwiket-lib/lib/qwiketRouter';


import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import blueGrey from '@material-ui/core/colors/blueGrey';
import teal from '@material-ui/core/colors/teal';
import cyan from '@material-ui/core/colors/cyan';

import { Select, FormLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

export let FeedItem = ({ type, noneSelected, name, image, description, metatag, shortname, included, channel, solo, selected, index, setSel, qparams, removable, actions, admin, myFeedsData }) => {
    // console.log("++++++++++++++++++++++++=")
    const theme = useTheme();
    let palette = theme.palette;
    let dark = palette.type == 'dark' ? 1 : 0;
    const [stateIncluded, setStateIncluded] = React.useState(included);
    // const [stateSelected, setStateSelected] = React.useState(selected);
    const [stateSolo, setStateSolo] = React.useState(solo);
    // console.log("FeedItem:", shortname)
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
    // console.log({ soloLink })
    const handleToggle = () => {
        let inc = stateIncluded ? 0 : 1;
        setStateIncluded(inc);
        let channelShortname = channel.get("channel");
        let myFeeds = myFeedsData.get(channelShortname);
        let found = 0;
        for (var i = 0; i < myFeeds.size; i++) {
            let item = myFeeds.get(i);
            if (item.get("shortname") == shortname) {
                found = 1;
                console.log("MF FOUND ", shortname);
                item = item.set('included', inc);
                myFeeds = myFeeds.set(i, item);
            }
        }
        if (!found) {
            console.log("FEED NOT FOUND")
            myFeeds = myFeeds.push(Immutable.fromJS({ shortname, included: inc }))
        }
        console.log("MF SAVING myFeedsData", { channel: channelShortname, myFeeds: myFeeds.toJS(), myFeedsData: myFeedsData.toJS() })
        actions.saveNewslineDefinition({ channel: channelShortname, type, myFeeds });
    };
    const handleClick = () => {
        let selO = {};

        if (selected)
            selO[type] = '';
        else {
            selO[type] = shortname;
        }
        console.log("calling setSel", { update: { sel: selO } })
        actions.updateNavigatorData({ update: { sel: selO } });
    }
    const handleRemove = (event) => {
        event.stopPropagation();
        let channelShortname = channel.get("channel");
        let myFeeds = myFeedsData.get(channelShortname);
        let found = 0;
        for (var i = 0; i < myFeeds.size; i++) {
            let item = myFeeds.get(i);
            if (item.get("shortname") == shortname) {
                found = 1;

                myFeeds = myFeeds.delete(i);
                break;
            }
        }
        if (found) {
            console.log("MF SAVING myFeedsData", { channel: channelShortname, myFeeds: myFeeds.toJS(), myFeedsData: myFeedsData.toJS() })
            actions.saveNewslineDefinition({ channel: channelShortname, type, myFeeds });
        }

    }
    //console.log("FeedItem", { name, included, solo })
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
            <Switch
                className="toggle"
                classes={{ thumb: 'thumb', checked: 'selected', track: 'track' }}
                edge="end"
                // size="small"
                onClick={(e) => e.stopPropagation()}
                onChange={handleToggle}
                checked={stateIncluded}
                inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
            />
        </ListItemSecondaryAction>

    </ListItem >
        {selected || (selected || noneSelected) && solo ? <FeedControls>{solo ? <FeedControl><Link replace scroll={false} href={cancelSoloLink.href} as={cancelSoloLink.as}><a rel="nofollow" data-id={`solo-link-${cancelSoloLink.href.query.route}`}><Button variant="outlined">Cancel Solo Mode</Button></a></Link></FeedControl>
            : <FeedControl><Link replace scroll={false} href={soloLink.href} as={soloLink.as}><a rel="nofollow" data-id={`solo-link-${soloLink.href.query.route}`}><Button variant="outlined">Solo Mode</Button></a></Link></FeedControl>}

            {admin ? <FeedControl><Link replace scroll={false} href={soloLink.href} as={soloLink.as}><a rel="nofollow" data-id={`solo-link-${soloLink.href.query.route}`}><Button variant="outlined">Edit</Button></a></Link></FeedControl> : null}
            {removable && !included ? <FeedControl><Button variant="outlined" onClick={(e) => handleRemove(e)}>Remove</Button></FeedControl> : null}

        </FeedControls> : null}</Styles >

}


export let Feeds = ({ type, channel, myFeeds, feeds, qparams, actions, user, myFeedsData, sel }) => {
    if (type == 'myFeeds')
        feeds = myFeeds;
    else {
        feeds = feeds.map(feed => {
            let included = 0;
            if (myFeeds) {
                for (var i = 0; i < myFeeds.size; i++) {
                    let feed1 = myFeeds.get(i);
                    // let objectKeys = Object.keys(feed1);
                    //  console.log("inner iterate", "type:", typeof feed1, objectKeys, feed1['shortname'], feed.tag, feed1)
                    if (feed1.get("shortname") == feed.get("shortname")) {
                        // console.log("set included", feed1)
                        included = feed1.get("included")
                        break;
                    }
                }
            }
            feed = feed.set("included", included);
            return feed;
        })
    }
    // console.log("**************************************************************************************Feeds:", feeds)
    //  const [sel, setSel] = React.useState(-1);
    console.log("Feeds feeds", { feeds: feeds.toJS(), myFeeds: myFeeds.toJS(), type })
    let mf = [];

    const theme = useTheme();
    let palette = theme.palette;
    let channelDetails = channel.get("channelDetails")
    console.log({ channelDetails: channelDetails.toJS() })
    // let username = user.get('username');
    let userEntities = user.get('userEntities');
    let tagEntity = channelDetails.get("entity");
    // let tagOwner = channelDetails.get("owner");
    let admin = userEntities.indexOf(tagEntity) >= 0/* || tagOwner == username;*/

    // console.log({ feeds: feeds.toJS() })
    if (feeds)
        feeds.forEach((item, i) => {
            // console.log({ i, item, user });
            // console.log("iteration feeds", { i, /*item: item.toJS() */ })
            let tag = item.get("tag");
            let shortname = item.get("shortname");
            let s = sel ? sel[type] == shortname : false;//= sel && type == sel.type && shortname == sel.shortname;

            if (tag)
                mf.push(<FeedItem admin={admin} type={type} removable={type == 'myFeeds' ? 1 : 0} noneSelected={!s} channel={channel} shortname={shortname} name={tag.get("name")} myFeedsData={myFeedsData} image={tag.get("image")} description={tag.get("description")} included={+item.get("included")} solo={shortname == qparams.soloShortname} selected={s} qparams={qparams} metatag={tag} actions={actions} user={user} />)
        });
    const OuterWrap = styled.div`
       
    `
    const InnerWrap = styled.div`
        display:flex;
        justify-content:center;
    `
    const FeedControl = styled.div`
        margin-top:-2px;
        margin-bottom:6px;
        font-size:0.9rem;
        `;
    let handleSetDefault = (e) => {

    }
    return <React.Fragment>{admin && type == 'myFeeds' ? <InnerWrap><FeedControl><Button variant="outlined" onClick={(e) => handleSetDefault(e)}>Set as Default for Newsline</Button></FeedControl></InnerWrap> : null}<List>{mf}</List></React.Fragment>
}
