import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import u from '../qwiket-lib/lib/utils'
import Root from 'window-or-global'
export class Items extends React.Component {

    constructor(props) {
        super(props);
        this.fetch = debounce(this.fetch, 1000)
        this.state = { queueId: null };
    }

    topScroll(name, e) {
        //console.log("topScroll")
        //console.log("QWIKETITEMS FETCH topScroll")
        this.fetch(true, false, this.props, 0);
        if (this.props.count)
            this.props.count();
    }
    bottomScroll(name, e) {
        const props = this.props;
        if (props.noscroll || props.drafts)
            return;

        let page = props.state.get("page")
        if (!page) {
            page = 0;
        }
        page++;

        this.fetch(false, false, props, page);
    }
    componentDidMount() {
        const props = this.props;
        if (!props.noscroll)
            u.registerEvent('topScroll', this.topScroll.bind(this), { me: this });
        if (props.topics || props.topics.count() == 0) {
            //console.log("EMTPTY TOPICS")
            const page = 0;
            //if(this.props.type!='c')
            //	console.log("QWIKETITEMS FETCH 3")

            this.fetch(true, false, this.props, page)

        }
        if (Root.__CLIENT__) {
            let { channel, solo, type, shortname, qparams, state, qwiketid, communityState } = this.props;
            const homeChannel = u.homeChannel(communityState);

            //	console.log('calling registerQueue:', { type, channel, shortname, solo })
            if (type != 'topics' && type != 'hot' && type != 'stickies' && type != 'drafts' && type != 'alerts' && qparams && qparams.newItemsNotificationsAPI) {
                const queueId = qparams.newItemsNotificationsAPI.registerQueue({ type, channel, homeChannel, qwiketid, shortname: solo ? solo : shortname, solo: solo ? 1 : 0, lastid: state ? state.get("lastid") : 0 });
                //console.log("QwiketItems registered ", { queueId })
                if (queueId)
                    this.setState({ queueId });
            }
        }
    }

    componentWillUnmount() {
        //console.log('Items componentWillUnmount')
        let { qparams } = this.props;
        u.unregisterEvents('topScroll', this);
        if (qparams && qparams.newItemsNotificationsAPI) {

            qparams.newItemsNotificationsAPI.unregisterQueue({ queueId: this.state.queueId });
        }
    }

}
function mapStateToProps(state) {
    return {
        app: state.app,
        session: state.session
    };
}
function mapDispatchToProps(dispatch) {
    return {
        //actions: bindActionCreators({ updateSession }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Items)