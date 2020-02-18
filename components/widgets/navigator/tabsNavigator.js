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
import { updateNavigatorData, updateSession, saveNewslineDefinition } from '../../../qwiket-lib/actions/app'
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

import { Feeds } from './feeds'

export let TabsNavigator = ({ session, channel, leftRenderer, actions, navigatorData, ...other }) => {
    console.log("TabsNavigator", channel.get("channel"))


    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
    }

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    other.actions = actions;
    other.navigatorData = navigatorData;
    let sel = navigatorData ? navigatorData.get("sel") : Immutable.fromJS({});
    //  const [value, setValue] = React.useState(1);
    const theme = useTheme();
    let palette = theme.palette;
    const sessionTab = + session.get("navigatorTab");
    //  console.log("SESSION TAB:", sessionTab);

    const handleChange = (event, newValue) => {
        // console.log("handleChange", newValue)
        // setValue(newValue);
        actions.updateSession({ navigatorTab: newValue })
    };

    const handleChangeIndex = index => {
        // console.log("handleChangeIndex", newValue)
        //  setValue(index);
        actions.updateSession({ navigatorTab: newValue })
    }
    //let tab = session.get("navigatorTab") || 1;


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
    return <OuterWrap><div position="static" color="default">

        <Tabs
            value={sessionTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
            classes={{ indicator: 'indicator', root: 'tabs' }}
        >
            <StyledTab classes={{ root: 'styled-tab', selected: 'tab-label', textColorSecondary: 'tab-label' }} label="Explore" {...a11yProps(0)} />
            <StyledTab classes={{ root: 'styled-tab', selected: 'tab-label', textColorSecondary: 'tab-label' }} label="My Feeds" {...a11yProps(1)} />

        </Tabs>

        <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={sessionTab}
            onChangeIndex={handleChangeIndex}
        >
            <TabPanel value={sessionTab} index={0} dir={theme.direction}>
                {leftRenderer(other)}
            </TabPanel>
            <TabPanel value={sessionTab} index={1} dir={theme.direction}>
                <Feeds channel={channel} type={'myFeeds'} sel={sel} navigatorData={navigatorData}{...other} />
            </TabPanel>
        </SwipeableViews>
    </div>
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
        actions: bindActionCreators({ updateNavigatorData, updateSession, saveNewslineDefinition }, dispatch)
    }
}
TabsNavigator = connect(
    mapStateToProps,
    mapDispatchToProps
)(TabsNavigator)