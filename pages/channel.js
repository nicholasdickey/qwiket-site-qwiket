import React from 'react';
import { bindActionCreators } from 'redux'
import Root from 'window-or-global'
import { connect } from 'react-redux'
import { fetchApp, dispatchSession } from '../qwiket-lib/lib/ssrParams'
import { Layout, InnerGrid } from '../qwiket-lib/components/layout';
import Topline from '../components/topline';

class Channel extends React.Component {
    static async getInitialProps({ store, isServer, req, query }) {
        if (isServer && req) {
            Root.host = req.headers.host;

        }
        let { channel, q, solo, code } = query;
        //  console.log({ store, isServer, query })

        await fetchApp({ req, store, channel, q, solo, code });
        await dispatchSession({ req, store });
        console.log("after fetchApp")
        /*
        const cookie = Immutable.fromJS(json.cookie ? json.cookie : {});
        console.log({ cookie });
        const identity = cookie.get("identity");
        const anon = cookie.get("anon");
        req.res.cookie('identity', identity, { maxAge, sameSite: 'Lax' })
        req.res.cookie('anon', anon, { maxAge, sameSite: 'Lax' })
        console.log("SET COOKIE ", { identity, anon }) */
        return {
            qparams: query
        }
    }
    /*
        componentDidMount() {
            this.timer = this.props.startClock()
        }
     
        componentWillUnmount() {
            clearInterval(this.timer)
        }*/

    render() {
        const { app } = this.props;
        console.log("RENDER CHANNEL:")
        const InnerWrapper = ({ layout }) => <div><Topline layout={layout} /><InnerGrid layout={layout}><div>BLAH</div></InnerGrid></div>;
        return <div>CHANNEL:<Layout pageType="context"><InnerWrapper /></Layout></div>
    }
}
function mapStateToProps(state) {
    return {
        app: state.app,
    };
}

export default connect(
    mapStateToProps,
    null
)(Channel)
