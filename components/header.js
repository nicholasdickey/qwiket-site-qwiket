import React from 'react';
import { connect } from 'react-redux'
import styled from 'styled-components';
import { Image } from 'react-bootstrap'
import StarOutline from 'mdi-material-ui/StarOutline';
import navMenu from '../qwiket-lib/lib/navMenu'

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
        <Logo src={leftLogo} /><Title>{title.toUpperCase()}</Title><Logo src={rightLogo} />
    </StyledWrapper>
}
const DatelineBand = ({ channelDetails, user }) => {
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
   
`
    const SubTitle = styled.div`
        font-size:1.4rem;
        text-align:center;
        margin-left:40px;
        margin-right:40px;
        @media(min-width:1200px){
            font-size:1.6rem;
        }
        @media(min-width:1400px){
            font-size:1.7rem;
        }
        @media(min-width:1800px){
            font-size:1.9rem;
        }
        @media(min-width:2100px){
            font-size:2.0rem;
        }
    `
    let hometown = channelDetails.get('hometown');
    let date = new Date();
    let dateStrging = date.toDateString();
    let name = user.get("user_name");
    let approver = user.get("approver");
    let avatar = user.get("avatar");
    let subscr_status = user.get("subscr_status");
    let isLoggedIn = user.get("isLoggedIn");
    return <StyledWrapper>
        <SubTitle>{`${dateStrging}  ${hometown}`}</SubTitle>
        <SubTitle>{`${isLoggedIn ? 'Sign Out' : 'Sign In'} ${approver ? '' : '|'} ${isLoggedIn ? approver ? '|' + name + '|' : name : 'Subscribe'}`}</SubTitle>
    </StyledWrapper>
}

const DesktopNavigation = ({ channelDetails, user }) => {
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
           `


    const Menu = ({ link, name }) => {
        const StyledItem = styled.div`
        font-family:Asap Condensed;
        font-weight:500;
        font-size: 1.4rem;
        text-align: center;
        margin-left: 20px;
        margin-right: 20px;
        @media(min-width: 1200px) {
            font-size: 1.6rem;
        }
        @media(min-width: 1400px) {
            font-size: 1.7rem;
        }
        @media(min-width: 1800px) {
            font-size: 1.9rem;
        }
        @media(min-width: 2100px) {
            font-size: 2.0rem;
        }
        `
        return <StyledItem>{name}</StyledItem>

    }
    let menu = navMenu({ config: channelDetails.get("config") })
    menu['find'] = 'Find';
    menu['channels'] = 'Channels';
    menu['lacantina'] = 'La Cantina';
    let keys = Object.keys(menu);

    let items = keys.map((key, i) => <Menu key={`NavmenuItems-${i}`} name={menu[key]} />)
    console.log({ menu })

    return <NavigationWrapper>
        {items}
    </NavigationWrapper>
}
const Lowline = ({ session }) => {

    let hasBand = +session.get("cover");
    const LowlineWrapper = styled.div`
            display: flex;
            margin-top:10px;
            border-top:thin solid grey;
            height:30px;
            border-bottom:${hasBand == 1 ? null : 'thin solid grey'};
            width: 100%;
            align-items: center;
            font-family: Roboto;
            justify-content: center;
            font-size: 0.9rem;
            @media(max-width: 749px) {
                display: none;
            }`
    const VerticalTablet = styled.div`
            display:none;
            @media(min-width:750px){
                display:flex;
            }
             @media(min-width:900px){
                display:none;
            }
    `
    const HorizontalTablet = styled.div`
            display:none;
            @media(min-width:900px){
                display:flex;
            }
             @media(min-width:1199px){
                display:none;
            }
    `
    const SmallDesktop = styled.div`
            display:none;
            @media(min-width:1200px){
                display:flex;
            }
             @media(min-width:1799px){
                display:none;
            }
    `
    const LargeDesktop = styled.div`
            display:none;
            @media(min-width:1800px){
                display:flex;
            }
    `
    const Stars = styled.div`
    flex-shrink:0;
    width:60px;
    margin-right:30px;
    margin-left:30px;
    `
    const Star = styled((...props) => <StarOutline style={{ marginLeft: 10, fontSize: 10 }} {...props} />)`
    font-size:10px;
    margin-left:10px;
    color:red;
    `
    return <LowlineWrapper>
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
    </LowlineWrapper>

}

let Header = ({ app, session, pageType, layout, user }) => {
    let channel = app.get("channel").get("channelDetails");
    let newsline = app.get("channel").get("newsline");
    console.log({ newsline: newsline.toJS(), session: session.toJS() })

    return <div>
        <TitleBand title={channel.get("name")} leftLogo={channel.get("logo")} rightLogo={newsline.get("logo") ? newsline.get("logo") : newsline.get("logo_src")} />
        <DatelineBand user={user} channelDetails={channel} />
        <DesktopNavigation channelDetails={channel} />
        <Lowline session={session} />
    </div>
};
/*function mapDispatchToProps(dispatch) {
    return {
            actions: bindActionCreators({updateSession}, dispatch)
    }
}*/
function mapStateToProps(state) {
    return {
        app: state.app,
        session: state.session,
        user: state.user
    };
}
export default connect(
    mapStateToProps,
    null// mapDispatchToProps
)(Header)