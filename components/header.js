import React, { useState } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import Link from 'next/link'
import { useRouter } from 'next/router'
import Root from 'window-or-global';

import { Image } from 'react-bootstrap'
import { useTheme } from '@material-ui/core/styles';
import StarOutline from 'mdi-material-ui/StarOutline';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import navMenu from '../qwiket-lib/lib/navMenu'
import { ClickWalledGarden } from '../qwiket-lib/components/walledGarden';
import { logout } from '../qwiket-lib/actions/user';

import indigo from '@material-ui/core/colors/indigo';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import blueGrey from '@material-ui/core/colors/blueGrey';
import teal from '@material-ui/core/colors/teal';
import cyan from '@material-ui/core/colors/cyan';
import FilledStar from 'mdi-material-ui/Star';
const TitleBand = ({ title, leftLogo, rightLogo }) => {
    const StyledWrapper = styled.div`
    display:flex;
    width:100%;
    align-items:center;
    font-family: Playfair Display !important;
    justify-content:center;
    font-size:2rem;
    @media(max-width:749px){
        display:none;
    }
   
`
    const Logo = styled((props) => {
        return <Image {...props} responsive />
    })`
        width:60px;
        height:60px;
        margin-left:30px;
        margin-right:30px;
        @media(min-width:900px){
             width:40px;
            height:40px;
        }
        @media(min-width:1000px){
             width:50px;
            height:50px;
        }

        @media(max-width:1200px){
            width:60px;
            height:60px;
        }
        @media(max-width:1800px){
            width:90px;
            height:90px;
        }
        @media(min-width:1800px){
            width:120px;
            height:120px;
        }
        @media(min-width:2100px){
            width:140px;
            height:140px;
        }
    `
    const Title = styled.div`
        font-size:2.0rem;
        text-align:center;
        margin-left:30px;
        margin-right:30px;
        @media(min-width:900px){
            font-size:2.2rem;
        }
        @media(min-width:1000px){
            font-size:2.7rem;
        }
        @media(min-width:1200px){
            font-size:3.7rem;
        }
        @media(min-width:1400px){
            font-size:4.5rem;
        }
        @media(min-width:1800px){
            font-size:5.4rem;
        }
        @media(min-width:2100px){
            font-size:6.0rem;
        }
    `

    return <StyledWrapper>
        <Logo src={leftLogo} /><Title>{title.toUpperCase()}</Title>{rightLogo ? <Logo src={rightLogo} /> : null}
    </StyledWrapper>
}
const DatelineBand = ({ session, channelDetails, user, actions }) => {
    let dark = +session.get('dark');
    const muiTheme = useTheme();
    const backgroundColor = muiTheme.palette.background.default;
    const color = muiTheme.palette.text.primary;
    const linkColor = dark ? muiTheme.palette.linkColor.dark : muiTheme.palette.linkColor.light;
    let subscr_status = +user.get('subscr_status');
    if (!subscr_status)
        subscr_status = 0;
    //console.log({ subscr_status })
    let starColor = green[700];
    switch (subscr_status) {
        case 1:
            starColor = green[700];
            break;
        case 2:
            //  console.log("subscr_status=2")
            starColor = indigo[900];
            break;
        case 3:
            starColor = blueGrey[200];
            break;
        case 4:
            starColor = amber[900];
            break;
        case 5:
            starColor = red[900];
    }


    const StyledWrapper = styled.div`
    display:flex;
    width:100%;
    align-items:center;
    font-family: Playfair Display !important;
    justify-content:center;
    font-size:1.8rem;
    @media(max-width:749px){
        display:none;
    }
    & a{
    cursor:pointer;
    text-decoration:none;
    color:${color};
    }
    & a:hover{
        font-weight:500;
        color:${linkColor};
    }

    `

    const HorizWrap = styled.div`
        display:flex;
        justify-content:flex-begin;
        margin-left:40px;
        margin-right:40px;
    `
    const SubTitle = styled.div`
        font-size:1.4rem;
        text-align:center;
        margin-left:10px;
        margin-right:10px;
        @media(min-width:1200px){
            font-size:1.3rem;
        }
        @media(min-width:1400px){
            font-size:1.4rem;
        }
        @media(min-width:1800px){
            font-size:1.5rem;
        }
        @media(min-width:2100px){
            font-size:1.6rem;
        }
    `
    const SubscriberStar = styled((...props) => <FilledStar style={{ color: starColor, marginTop: -4, marginLeft: 4 }} {...props} />)`
      
     `
    const AvatarGroup = styled.div`
        display:flex;
        align-items:flex-begin;
     `
    let hometown = channelDetails.get('hometown');
    let channel = channelDetails.get('shortname');
    // console.log("CHANNEL:", channel)
    let date = new Date();
    let dateStrging = date.toDateString();
    let name = user.get("user_name");
    let approver = user.get("approver");
    let avatar = user.get("avatar");

    let isLoggedIn = user.get("isLoggedIn");
    // console.log({ isLoggedIn })
    return <StyledWrapper>
        <HorizWrap><SubTitle>{`${dateStrging}  ${hometown}`}</SubTitle></HorizWrap>
        {isLoggedIn ? <HorizWrap><AvatarGroup><Image src={avatar} width={32} height={32} />{subscr_status > 0 ? <SubscriberStar /> : null}</AvatarGroup></HorizWrap> : null}

        {
            !isLoggedIn ? <ClickWalledGarden placeHolder={<SubTitle><a>Sign In</a>&nbsp; Subscribe</SubTitle>} /> :
                <HorizWrap>
                    <SubTitle>
                        <a onClick={() => { console.log("sign out:", `/disqus-logout?channel=${channel}`); window.location = `/channel/${channel}?logout=1` }}>
                            Sign Out
                    </a>
                    </SubTitle>
                    {!approver ? <SubTitle>
                        |
                </SubTitle> : null}
                    <SubTitle> {`${isLoggedIn ? approver ? '[' + name + ']' : name : 'Subscribe'}`}</SubTitle>


                </HorizWrap>
        }
    </StyledWrapper >
}

const DesktopNavigation = ({ session, channelDetails, url }) => {
    let dark = +session.get('dark');
    const muiTheme = useTheme();
    const backgroundColor = muiTheme.palette.background.default;
    const color = muiTheme.palette.text.primary;
    const linkColor = dark ? muiTheme.palette.linkColor.dark : muiTheme.palette.linkColor.light;
    const NavigationWrapper = styled.div`
            display: flex;
            margin:10px;
            width: 100%;
            align-items: center;
            font-family: Playfair Display!important;
            justify-content: center;
            font-size: 1.8rem;
            @media(max-width: 749px) {
                display: none;
            }
            & a{
            text-decoration:none;
            color:${color};
            }
            & a:hover{
                font-weight:500;
                color:${linkColor};
            }
           `


    const MenuEntry = ({ link, name, as, gap, subMenu }) => {
        let [anchorEl, setAnchorEl] = useState(0);

        const StyledItem = styled.div`
        font-family:Asap Condensed;
        font-weight:500;
        font-size: 1.4rem;
        text-align: center;
        margin-left: ${gap ? `60px` : `20px`};
        margin-right: 20px;
        @media(min-width: 1200px) {
            font-size: 1.6rem;
        }
        @media(min-width: 1400px) {
            font-size: 1.7rem;
        }
        @media(min-width: 1800px) {
            font-size: 1.8rem;
        }
        @media(min-width: 2100px) {
            font-size: 1.9rem;
        }
     cursor:pointer;   
       

        `
        if (!subMenu)
            return <StyledItem><Link href={link} as={as}><a data-id="menu-anchor">{name}</a></Link></StyledItem>
        //  console.log({ subMenu, anchorEl })
        const handleClose = (target) => {
            setAnchorEl(null);
        };
        let keys = Object.keys(subMenu);
        let rows = keys.map(key => {
            let link = `/channel?channel=${key}`;
            let as = `/channel/${key}`;
            let StyledLink = styled.a` 
            text-decoration:none;
            color:${color};
           :hover{
                //text-decoration:underline;
                color:${linkColor};
           }`
            return <MenuItem key={`navmenu-${key}`} onClick={() => handleClose(key)}><Link href={link} as={as}><StyledLink>{subMenu[key]}</StyledLink></Link></MenuItem>
        })
        const Item = () => <StyledItem ><a >{name}</a></StyledItem >
        return <div onClick={(event) => {
            // console.log("onClick", { anchorEl })
            if (anchorEl)
                setAnchorEl(false)
            else {
                let anchor = event.currentTarget;
                // console.log("opening menu", anchor);
                setAnchorEl(anchor)
            }
        }} >
            <Item />
            <Menu
                id="section-sub-menu"
                anchorEl={anchorEl}
                //keepMounted
                elevation={8}
                open={Boolean(anchorEl)}
                onClose={handleClose}

            >
                {rows}
            </Menu>
        </div >

    }
    let menu = navMenu({ config: channelDetails.get("config") });
    menu['find'] = 'Find';
    menu['channels'] = 'Channels';
    menu['lacantina'] = 'La Cantina';
    let keys = Object.keys(menu);
    const router = useRouter();
    //console.log({ router, Root })
    let channel = channelDetails.get("shortname");
    let asPath = router.asPath;

    let items = keys.map((key, i) => {
        let subMenu = navMenu({ config: channelDetails.get("config"), toplevel: key });

        let link = '';
        let as = '';
        let gap = false;
        if (key == 'home') {
            link = `/channel?channel=${channelDetails.get("shortname")}`;
            as = `/channel/${channel}`;
        }
        else if (key == 'find') {
            link = `${asPath}&find=1`;
            as = `${url}/find`
            gap = true;
        }
        else if (key == 'lacantina') {
            link = `/context?channel=${channel}&qwiketid=${'la-cantina'}`;
            as = `/context/channel/${channel}/topic/0/la-cantina`;
        }
        else if (subMenu) {
            link = '';
            as = ''
        }
        else {
            link = `/channel?channel=${key}`;
            as = `/channel/${key}`;
        }
        // console.log("Menu:", { name: menu[key], link, as })
        return <MenuEntry key={`NavmenuItems - ${i} `} name={menu[key]} link={link} as={as} gap={gap} subMenu={subMenu} />
    })
    //  console.log({ menu })

    return <NavigationWrapper>
        {items}
    </NavigationWrapper>
}
const Lowline = ({ session }) => {

    let hasBand = +session.get("cover");
    const OuterWrapper = styled.div`
     margin-left:4px;
     margin-right:4px;
    `
    const LowlineWrapper = styled.div`
            display: flex;
            margin-top: 10px;
          
            border-top: thin solid grey;
            height: 30px;
            border-bottom: ${ hasBand == 1 ? null : 'thin solid grey'};
            width: 100%;
            align-items: center;
            font-family: Roboto;
            justify-content: center;
            font-size: 0.9rem;
            @media(max-width: 749px) {
                display: none;
            } `
    const VerticalTablet = styled.div`
            display: none;
            @media(min-width: 750px) {
                display: flex;
            }
            @media(min-width: 900px) {
                display: none;
            }
            `
    const HorizontalTablet = styled.div`
            display: none;
            @media(min-width: 900px) {
                display: flex;
            }
            @media(min-width: 1199px) {
                display: none;
            }
            `
    const SmallDesktop = styled.div`
            display: none;
            @media(min-width: 1200px) {
                display: flex;
            }
            @media(min-width: 1799px) {
                display: none;
            }
            `
    const LargeDesktop = styled.div`
            display: none;
            @media(min-width: 1800px) {
                display: flex;
            }
            `
    const Stars = styled.div`
            flex-shrink: 0;
            width: 60px;
            margin-right: 30px;
            margin-left: 30px;
            `
    const Star = styled((...props) => <StarOutline style={{ marginLeft: 10, fontSize: 10 }} {...props} />)`
            font-size: 10px;
            margin-left: 10px;
            color: red;
            `
    return <OuterWrapper><LowlineWrapper>
        <Stars>
            <Star />
            <Star />
            <Star />
        </Stars>
        <VerticalTablet>The go-to-site for the news WE read. Contact: support@qwiket.com</VerticalTablet>
        <HorizontalTablet>The go-to-site for the news WE read. : Created and operated in USA. Contact: support@qwiket.com</HorizontalTablet>
        <SmallDesktop>QWIKET.COM: The go-to-site for the news WE read : Made in USA - with love. Contact: support@qwiket.com: The Internet of Us™ : QWIKET.COM</SmallDesktop>
        <LargeDesktop>QWIKET.COM: The go-to-site for the news WE read : Made in USA - with love. Contact: support@qwiket.com, ads@qwiket.com, invest@qwiket.com, copyright@qwiket.com : The Internet of Us™ : QWIKET.COM</LargeDesktop>
        <Stars>
            <Star />
            <Star />
            <Star />
        </Stars>
    </LowlineWrapper></OuterWrapper>

}

let Header = ({ app, session, pageType, layout, user, qparams, actions }) => {
    let channel = app.get("channel").get("channelDetails");
    let newsline = app.get("channel").get("newsline");
    //  console.log({ newsline: newsline.toJS(), session: session.toJS() })
    const StyledHeader = styled.div`
        width:100%;
    `
    return <StyledHeader>
        <TitleBand title={`${newsline.get("shortname") != newsline.get("channel") ? `${channel.get("nickname")}:` : ''}${newsline.get("name")}`} leftLogo={channel.get("logo")} rightLogo={newsline.get("logo") ? newsline.get("logo") : newsline.get("logo_src")} />
        <DatelineBand session={session} user={user} channelDetails={channel} actions={actions} />
        <DesktopNavigation session={session} channelDetails={channel} url={qparams.url} />
        <Lowline session={session} />
    </StyledHeader>
};
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ logout }, dispatch)
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
)(Header)