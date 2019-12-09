import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { QwiketItem } from './qwikets/items/qwiketItem'

export class FeedHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            linkOpen: false
        }
    }
    fetch(props, shortname, channel) {
        if (!shortname) {
            return;
        }
        props.actions.requestCat(shortname);
        props.actions.isCatAdmin(shortname);
    }
    componentWillMount() {
        const props = this.props;
        const qparams = props.match ? props.match.qparams : false;

        const shortname = qparams ? qparams.shortname : props.shortname;
        //console.log("FeedHeader willMount",props);
        const globals = props.globals;
        const channel = qparams.channel;//globals.get("channel");//u.channel();
        if (shortname) {
            // console.log("FeedHheader, fetching", { shortname })
            this.fetch(props, shortname, channel);
        }
        else {
            const topic = props.context.get("topic");
            if (topic) {
                let cat = topic.get("cat");
                // console.log("FeedHheader, fetching", { cat })
                this.fetch(props, cat, channel);
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        const props = this.props;
        const qparams = props.match ? props.match.qparams : false;
        const nparams = nextProps.match ? nextProps.match.qparams : false;
        const globals = props.globals;
        const context = props.context;
        const topic = context.get("topic")
        const shortname = qparams ? qparams.shortname : props.shortname;//props.qparams.shortname;//props.shortname?props.shortname:props.qparams.shortname?props.qparams.shortname:topic.get("cat")?topic.get("cat"):'';
        const ncontext = nextProps.context;
        const ntopic = ncontext.get("topic")
        const nshortname = nparams ? nparams.shortname : nextProps.shortname;//nextProps.shortname?nextProps.shortname:nextProps.qparams.shortname?nextProps.qparams.shortname:ntopic.get("cat")?ntopic.get("cat"):'';
        const channel = qparams.channel;// globals.get("channel");//u.channel();

        if (nextProps.online.get("requestedCatStatus") != props.online.get("requestedCatStatus")) {
            const reqShortname = nextProps.online.get("requestedCatShortname");
            const reqStatus = nextProps.online.get("requestedCatStatus");
            if (reqStatus == 'fail' && shortname) {
                // console.log("reqStatuls=fail", shortname)
                props.history.replace('/home/' + shortname + "/nav/411");
            }
        }
        if (shortname != nshortname && nshortname) {
            this.fetch(nextProps, nshortname, channel);
        }
    }
    render() {
        const props = this.props;
        const state = this.state;
        const { qparams, width, w, communityState: cs, online, globals, context, app, sideTopics, actions, sel } = props;
        const theme = +globals.get("theme");//.theme();
        const muiTheme = globals.get("muiTheme");
        const backgroundColor = muiTheme.palette.background;
        const color = muiTheme.palette.text.primary;
        const channel = qparams.channel;//globals.get("channel");//u.channel();
        const pOrderby = qparams ? qparams.orderby : props.orderby;
        const orderby = +pOrderby >= 0 ? pOrderby.orderby : 1;
        const dev = online.get("dev");

        const v51 = cs.get("v51");
        // if(globals.get("client"))
        //  console.log("Has v51=",v51?true:false)
        if (!v51 || !cs.get("v51").get("channelDetails"))
            return <div />
        //console.log("FeedHEader", sel)
        // console.log("cs.entity=",cs.get("entity"),os.get("userEntities")?os.get("userEntities").toJS():'');
        //console.log("v51:",v51?v51.toJS():'',"os:",os?os.toJS():'')

        const channelDetails = v51.get("channelDetails") ? v51.get("channelDetails").toJS() : {};

        let { addHome, cb_name, cb_threadid, cb_cat, description, facebook, forum, logo, nickname, hometown, website, full_description, avatar } = channelDetails;


        let hcolor = '#eee';
        if (theme == 0) {
            hcolor = '#222';
        }
        const isCatAdmin = app.get("isCatAdmin") ? 1 : 0;
        const topic = context.get("topic")
        // console.log("FeedHeader render", { propsShortname: props.shortname, qparamsShortname: qparams && qparams.shortname ? qparams.shortname : '', topicCat: topic ? topic.get("cat") : ''})
        var shortname = props.shortname ? props.shortname : qparams && qparams.shortname ? qparams.shortname : topic ? topic.get("cat") : '';
        var username = online.get("username");

        var catIcon = '';
        let cat, category_xid = 0;
        const cats = topic ? topic.get("cat") : '';
        let alias = '';
        if (shortname) {
            if (props.categories && props.categories.get(shortname)) {
                /// console.log('CATEGORIES_CACHE feed render', { categories: props.categories ? props.categories.toJS() : {}, cat: props.categories ? props.categories.get(shortname).toJS() : {}, shortname })
                cat = props.categories.get(shortname)
                if (cat) {
                    category_xid = cat.get("category_xid");
                    catIcon = cat.get("icon");
                    alias = cat.get("alias");
                }
                if (Root.__CLIENT__) {
                    if (alias && alias != shortname && shortname == qparams ? qparams.shortname : '') {
                        //s console.log("VVV replace Nav Away", alias)
                        props.history.replace('/home/' + alias);
                    }
                    else if (alias)
                        shortname = alias;
                }
            }
            else {

                cat = new Immutable.Map();
                actions.requestCat(shortname);
                // console.log("not in cache, requesting", { shortname })
                actions.isCatAdmin(shortname);
            }
        }
        else {
            //console.log("FeedHeader NO SHORTNAME")
            cat = new Immutable.Map();
        }
        const stylesNav = {
            marginLeft: 0,
            marginRight: 10,
            color,
            fontSize: 14, fontFamily: 'Asap Condensed',
            fontWeight: 500
        };
        const i411 = props.i411;
        var i411html = null;
        const dashboard = props.dashboard;
        if (i411 && i411.get("author")) {
            let shortname = i411.get("shortname");
            const username = i411.get("author").get("username");
            const user_name = i411.get("author").get("user_name")
            i411html = <div style={{ marginLeft: 40 }}><Link style={stylesNav} onClick={(e) => e.stopPropagation()} to={"/home/" + shortname + "/nav/411"}>{dashboard ? "Go to My Dashboard" : "411 on " + user_name}</Link></div>
        }
        const feeds = props.online.get("profile") ? props.online.get("profile").get("feeds") : false;
        var feed;
        var included = false;
        if (feeds) {
            feed = feeds.find(p => p && p.get && p.get("shortname") == shortname);
        }
        if (feed) {
            included = feed.get("included");
        }
        let ch = channel ? ('/channel/' + channel) : ''
        const parent = <div style={{ marginLeft: 10 }}>{cs.get("parent") ? <Link style={stylesNav} to={"/solo" + ch + "/" + cs.get("parent")}> {cs.get("parentName")}</Link>
            : <div />}</div>
        const backToNewsline = <div style={{ marginLeft: 10 }}><Link style={stylesNav} to={ch ? ch : '/'}> {"To Newsline"}</Link>
        </div>
        /*
        <div
                 innerDivStyle={{width:'100%',paddingBottom:0,paddingRight:10,marginRight:0,marginBottom:10,height:90,color}}
                 style={{display:'flex',width:'100%',backgroundColor,color,marginTop:8,marginRight:0,paddingRight:0,fontSize:22,borderRight:'1px solid grey',paddingBottom:4,borderBottom:'1px solid grey'}}
                 primaryText={<div className={titleClass} style={{marginBottom:10,marginLeft:16,display:'flex',justifyContent:'flex-end',color}}><Link className={titleClass}  to={st+ch+'/home/'+shortname}>{cat?cat.get("text"):''}</Link></div>}
                 secondaryText={
                   <div data-id="feed-header-secondary-container" className={titleClass} style={{padding:5,color}}>
                     <Link data-id="feed-header-secondary-inner" 
                       className={titleClass} 
                       style={{mfontSize:cat&&cat.get("description")&&cat.get("description").length>24?11:14}} 
                       to={st+ch+'/home/'+shortname}>{cat?<Markdown source={cat.get("description")}/>:''}
                     </Link> 
                   </div> 
                 }
                 secondaryTextLines={2}
                 leftAvatar={<Link style={{marginRight:20}} to={st+ch+'/home/'+shortname}>{cat?<Image style={{backgroundColor,maxHeight:66,margin:4}} responsive  src={catIcon}/>:<span/>}</Link>}
               >
               */
        var st = '';
        const titleClass = 'qwiket-title' + (theme ? '' : '-dark');
        const tnow = Date.now();
        const dthen = new Date("2019-01-21T00:00:00");
        const then = dthen.getTime();
        const covingtonInterval = (tnow - then) / 1000;
        const rci = Math.floor(covingtonInterval);
        const daymillis = 3600 * 24;
        const rdays = rci / daymillis;
        const days = Math.floor(rdays);
        /// console.log("FEED HEADER width:",width)
        return (
            <div style={{ color, backgroundColor, width: '100%' }}>
                <div data-id="v-wrap" style={{ marginTop: 10, marginRight: 8, backgroundColor: hcolor }}>
                    <div style={{ width: '100%', marginBottom: 0, marginTop: 2, display: 'flex' }}>
                        {parent}{i411html}{backToNewsline}
                    </div>
                    <div data-id="header-wrap" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', lineHeight: 1.2 }}>
                        <div data-id="header-inner-wrap" style={{ width, paddingRight: 6 }}>
                            <Paper data-id="header-paper" style={{ position: 'relative', display: 'flex', width: '100%', alignItems: 'flex-start', flexDirection: 'row', minHeight: (shortname == 'nro' ? 210 : 100), padding: '10px 40px 10px 15px', marginLeft: 10, marginTop: 4 }}>
                                <Link style={{ marginRight: 0 }} to={st + ch + '/home/' + shortname}>{cat ? <Image style={{ backgroundColor, maxHeight: 66, margin: 4 }} responsive src={u.cdn(catIcon)} /> : <span />}</Link>
                                <div style={{ marginLeft: 10, flexGrow: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <div className={titleClass} style={{ fontFamily: 'roboto', fontWeight: 500, fontSize: '1.2rem' }}><Link className={titleClass} to={st + ch + '/home/' + shortname}>{cat ? cat.get("text") : ''}</Link></div>
                                    <div data-id="feed-header-secondary-container" className={titleClass} >
                                        <Link data-id="feed-header-secondary-inner"
                                            className={titleClass}
                                            style={{ fontFamily: 'roboto', fontSize: cat && cat.get("description") && cat.get("description").length > 24 ? 11 : 14 }}
                                            to={st + ch + '/home/' + shortname}>{cat ? <Markdown allowedNodeTypes={["html", "heading", "text", "paragraph", "break", "blockquote", "list", "listItem", "code", "delete", "strong", "emphasis", "link", "image"]} escapeHtml={false} source={cat.get("description")} /> : ''}
                                        </Link>
                                    </div>

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



                                </div>

                            </Paper>
                            <ClickWalledGarden placeHolder={<IconButton className="q-link-plus" variant="contained"><LinkPlus /></IconButton>}>
                                <div>

                                    <LinkPopup
                                        qparams={qparams}
                                        shortname={shortname}
                                        channel={channel}
                                        open={state.linkOpen}
                                        onClose={() => this.setState({ linkOpen: false })}
                                    ></LinkPopup>
                                    <IconButton className="q-link-plus" onClick={() => {
                                        this.setState({ linkOpen: true });
                                    }}
                                        variant="contained"
                                    >
                                        <LinkPlus />
                                    </IconButton>
                                </div>
                            </ClickWalledGarden>
                        </div>

                        <div data-id="header-right" style={{ width: w, display: 'flex', justifyContent: 'flex-end' }}>

                            <FormControlLabel
                                control={<Toggle
                                    id="includeToggle"
                                    checked={included ? true : false}
                                    onChange={(e, val) => {
                                        actions.includeCat(shortname, included ? 0 : 1);
                                        actions.includeFeed(channel, shortname, included ? 'exclude' : 'include');
                                    }}

                                    color={red900}
                                />}
                                label={<span style={{ fontSize: '0.9rem' }}>In Newsline</span>}
                            />



                        </div>
                    </div>


                </div>
                <div data-id="header-bottom-wrap" style={{ width: '100%', marginTop: -20, marginBottom: 0 }}>
                    <div data-id="header-bottom-right" style={{ position: 'relative', paddingRight: 0, marginRight: 20, display: 'flex', justifyContent: 'flex-end' }}>


                    </div>
                </div>
                <style global jsx>{`.q-link-plus{
          margin-top:0px !important;
         
          }`}</style>
            </div>)
    }
}
export class MicroFeedHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            shortname: ''
        }
    }
    fetch(props, shortname, channel) {
        //console.log("FeedHeader FETCH",shortname)
        if (!shortname) {
            return;
        }
        this.setState({ shortname })
        props.actions.requestCat(shortname);
        props.actions.isCatAdmin(shortname);


    }
    componentWillMount() {

        const props = this.props;
        const qparams = props.match ? props.match.qparams : false;

        const shortname = qparams ? qparams.shortname : props.shortname;
        //console.log("FeedHeader willMount",props);
        const globals = props.globals;
        const channel = qparams.channel;//globals.get("channel");//u.channel();
        // console.log("Feed:componentWillMount",shortname)
        if (shortname) {
            // const upd=props.updateOnlineStateAction.updateOnlineState;
            // if(shortname!=props.online.get("shortname"))
            //  upd({shortname},true); 
            // console.log("FETCHING FEED");
            this.fetch(props, shortname, channel);
        }
        else {
            const topic = props.context.get("topic");
            if (topic) {
                let cat = topic.get("cat");
                // console.log("FEEDHEADER cat=",cat);
                // if(cat!=props.online.get("shortname"))
                // upd({shortname:cat},true); 
                // console.log("FETCHING FEED");
                this.fetch(props, cat, channel);
            }
        }

    }
    componentWillReceiveProps(nextProps) {
        // console.log("Feed:componentWillReceiveProps",nextProps)
        const props = this.props;
        const globals = props.globals;
        const { actions, qparams } = props;
        const nparams = nextProps.qparams;

        const context = props.context;
        const topic = context.get("topic")
        const shortname = qparams ? qparams.shortname : props.shortname;//props.qparams.shortname;//props.shortname?props.shortname:props.qparams.shortname?props.qparams.shortname:topic.get("cat")?topic.get("cat"):'';
        const ncontext = nextProps.context;
        const ntopic = ncontext.get("topic")
        const nshortname = nparams ? nparams.shortname : nextProps.shortname;//nextProps.shortname?nextProps.shortname:nextProps.qparams.shortname?nextProps.qparams.shortname:ntopic.get("cat")?ntopic.get("cat"):'';
        const channel = qparams.channel;//globals.get("channel");//u.channel();
        // console.log('next requestedCatStatus',nextProps.online.get("requestedCatStatus"))
        if (nextProps.online.get("requestedCatStatus") != props.online.get("requestedCatStatus")) {
            // console.log("requestedCatStatus:",nextProps.online.get("requestedCatStatus"),nextProps.online.get("requestedCatShortname"))
            const reqShortname = nextProps.online.get("requestedCatShortname");
            const reqStatus = nextProps.online.get("requestedCatStatus");
            if (reqStatus == 'fail' && shortname) {
                console.log('nav on reqCat fail', shortname, nshortname)
                props.history.replace('/home/' + shortname + "/nav/411");
            }
        }

        // console.log('feed componentWillReceiveProps shortname=',shortname,'nshortname=',nshortname,props,nextProps,topic,ntopic)
        if (shortname != nshortname && nshortname/*||props.shortname!=nextProps.shortname||props.qparams.shortname!=nextProps.qparams.shortname*/) {
            // const upd=props.updateOnlineStateAction.updateOnlineState;
            // if(nshortname!=props.online.get("shortname"))
            //   upd({nshortname},true); 
            // console.log("NEW SHORTNAME")
            this.fetch(nextProps, nshortname, channel);
        }


    }
    render() {
        // console.log("Feed Header")
        const props = this.props;
        const globals = props.globals;
        const { actions, qparams } = props;
        const cs = props.communityState;
        const theme = +globals.get("theme");//.theme();
        const muiTheme = globals.get("muiTheme");
        const backgroundColor = muiTheme.palette.background.default;
        const color = muiTheme.palette.text.primary;
        const channel = qparams.channel;//globals.get("channel");//u.channel();
        const pOrderby = qparams ? qparams.orderby : props.orderby;
        const orderby = +pOrderby >= 0 ? pOrderby.orderby : 1;
        const dev = props.online.get("dev");
        let hcolor = '#eee';
        if (theme == 0) {
            hcolor = '#222';
            //console.log("DARK",theme)
        }
        //    console.log("APP=",props.app.toJS())
        const isCatAdmin = props.app.get("isCatAdmin") ? 1 : 0;
        //console.log("isCatAdmin:",isCatAdmin)
        const sideTopics = props.sideTopics;
        /*  if(!sideTopics)
            return <div/>*/
        const context = props.context;
        const topic = context.get("topic")
        //const propsShortname=
        var shortname = props.shortname ? props.shortname : qparams && qparams.shortname ? qparams.shortname : topic ? topic.get("cat") : '';
        // console.log("RENDER freed shortname=",shortname,'state.shortname=',this.state.shortname,'isCatAdmin:',isCatAdmin)
        // console.log("shortname=",shortname,props.shortname,props.qparams.shortname)
        var catIcon = ''//topic?topic.get('catIcon'):'';
        let cat, category_xid = 0;
        const cats = topic ? topic.get("cat") : '';

        if (shortname) {
            //console.log("render FeedHeader shortname=",shortname,props.categories);
            if (props.categories && props.categories.get(shortname)) {
                cat = props.categories.get(shortname)
                // console.log("cat:",cat?cat.toJS():'');
                category_xid = cat.get("category_xid");
                catIcon = cat.get("icon");

                const alias = cat.get("alias");
                // console.log("Alias=",alias)
                if (Root.__CLIENT__) {
                    if (alias && alias != shortname && shortname == qparams ? qparams.shortname : '') {
                        console.log("VVV replace Nav Away", alias)
                        props.history.replace('/home/' + alias);
                        //return <div/>
                    }
                    else if (alias)
                        shortname = alias;
                }
            }
            else {
                // console.log('no cat',shortname,catIcon)
                cat = new Immutable.Map();
                actions.requestCat(shortname);
                actions.isCatAdmin(shortname);
            }
        }
        else {
            //console.log(8888888)
            cat = new Immutable.Map();
        }
        // console.log('cat=',cat?cat.toJS():'',';props.categgoties=',props.categories?props.categories.toJS():'')

        const stylesNav = {
            marginLeft: 0,
            marginRight: 10,
            color,
            fontSize: 14, fontFamily: 'Asap Condensed',
            fontWeight: 500

        };
        const i411 = props.i411;
        var i411html = null;
        const dashboard = props.dashboard;
        if (i411 && i411.get("author")) {
            let shortname = i411.get("shortname");
            const username = i411.get("author").get("username");
            const user_name = i411.get("author").get("user_name")
            i411html = <div style={{ marginLeft: 40 }}><Link style={stylesNav} onClick={(e) => e.stopPropagation()} to={"/home/" + shortname + "/nav/411"}>{dashboard ? "Go to My Dashboard" : "411 on " + user_name}</Link></div>
        }
        // if(catIcon&&catIcon.indexOf("http")==-1)
        //  catIcon='http://qwiket.com'+catIcon;

        // console.log("online:",props.online)
        const feeds = props.online.get("profile") ? props.online.get("profile").get("feeds") : false;
        var feed;
        var included = false;
        if (feeds) {
            feed = feeds.find(p => p && p.get && p.get("shortname") == shortname);
        }
        if (feed) {
            included = feed.get("included");
            //console.log("FOUND FEED included=",included)
        }

        let ch = channel ? ('/channel/' + channel) : ''
        //if(m())
        //  ch='';
        const parent = <div style={{ marginLeft: 10 }}>{cs.get("parent") ? <Link style={stylesNav} to={"/solo" + ch + "/" + cs.get("parent")}> {cs.get("parentName")}</Link>
            : <div />}</div>
        const backToNewsline = <div style={{ marginLeft: 10 }}><Link style={stylesNav} to={ch ? ch : '/'}> To Newsline</Link>
        </div>

        var st = m() ? '/m' : '';

        const titleClass = 'qwiket-title' + (theme ? '' : '-dark');
        // console.log("feed header ",cat?cat.toJS():'')
        //   console.log("RENDER MicroFeedHeader:",cat?cat.get("description"):'');
        return (<div style={{ marginLeft: 8, display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', color: "white", paddingBottom: 4 }}>
            <div data-id="123" style={{ fontSize: "0.9rem", marginTop: 8 }} >{cat ? cat.get("text") : ''}</div>
            <div data-id="feed-header-secondary-inner"

                style={{ fontSize: "0.8rem", color: 'white' }}
            >{cat ? cat.get("description") : ''}</div>
        </div>
        )
    }
}


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

    let OuterTopic = styled.div`

    `;
    console.log("TOPIC:", topic.toJS())

    return <OuterTopic><QwiketItem columnType={'context'} topic={topic} channel={channel} qparams={qparams} forceShow={true} approver={false} test={false} /></OuterTopic>
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