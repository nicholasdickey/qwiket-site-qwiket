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

import { TabsNavigator } from './tabsNavigator';
import { TagTree } from './tagTree';


export let NavigatorPanel = ({ qparams, session, channel: channelState, navigatorData, actions, ...other }) => {
    console.log("NavigatorPanel:", { navigatorData: navigatorData ? navigatorData.toJS() : {} })
    //  console.log({ channelState: channelState.toJS() })
    let channelDetails = channelState.get("channelDetails");
    let config = channelDetails.get("config");
    // console.log("config:", config.toJS(), session.toJS())
    let defaultDefinedTag = config.get("defaultDefinedTag");
    let definedTags = config.get("definedTags");
    let navigatorTag = session.get("navigatorTag") || defaultDefinedTag;
    let navigatorType = "definedTags";
    if (navigatorTag == 'users') {
        navigatorType = "users";
    }
    else if (navigatorTag == "tags") {
        navigatorType = "tags";
    }
    if (navigatorType == "definedTags") {
        let navigatorTree = definedTags.get(navigatorTag);
        console.log({ navigatorTree: navigatorTree ? navigatorTree.toJS() : {}, definedTags, navigatorTag });
    }

    console.log({ navigatorTag })
    let TagSelect = (({ tags, currentTag }) => {
        const [selectedMetatag, setSelectedMetatag] = React.useState(currentTag);
        let handleChange = event => {
            let newValue = event.target.value;
            setSelectedMetatag(newValue);
            actions.updateSession({ navigatorTag: newValue })
        }
        let selector = tags.map(t => <MenuItem value={t.tag}>{t.text}</MenuItem>);
        let SelectC = () => <Select
            labelId="tag-selector-label"
            id="tag-selector"
            value={selectedMetatag}
            onChange={handleChange}
        >
            {selector}
        </Select>

        const Styles = styled.div`
        & .metatag-selector{
            display:flex;
            //flex-direction:row;
            margin-top:-10px;
            margin-bottom:20px;
        }
        & .metatag-selector-label{
            margin-bottom:14px;
            font-size:0.8rem;

        }
        `
        return <Styles> <FormControl classes={{ root: 'metatag-selector' }} variant="outlined" fullWidth><FormLabel className="metatag-selector-label" id="demo-simple-select-label">Tag Type:</FormLabel><SelectC /></FormControl></Styles>;

    })

    let innerTreeRenderer = ({ tags, currentTag, ...other }) => {
        console.log("treeRenderer")

        return <div>

            <TagSelect tags={tags} currentTag={currentTag} />
            <Divider />
            <TagTree tags={tags} currentTag={currentTag} {...other} />
        </div>

    }



    let treeRenderer = ({ session, ...other }) => {
        console.log("treeRenderer")
        return <TabsNavigator session={session} {...other} leftRenderer={innerTreeRenderer} />;
    }
    let innerListRenderer = ({ navigatorData, tags, currentTag, session, qparams }) => {
        let items = navigatorData.get(currentTag);
        return <div><TagSelect tags={tags} currentTag={currentTag} />
            {items ? JSON.stringify(items.toJS()) : 'Loading...'}
        </div>
    }

    let listRenderer = ({ ...other }) => {
        console.log("listRenderer")
        return <TabsNavigator  {...other} leftRenderer={innerListRenderer} />;
        //  
    }
    console.log("Render NavigatorPanel")
    return <NavigatorData listRenderer={listRenderer} treeRenderer={treeRenderer} qparams={qparams} />

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
        actions: bindActionCreators({ updateSession, saveNewslineDefinition }, dispatch)
    }
}
NavigatorPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavigatorPanel)
