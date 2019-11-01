import React from 'react';
import { bindActionCreators } from 'redux'
import Root from 'window-or-global'
import { connect } from 'react-redux'
import { fetchPageData } from '../qwiket-lib/actions/app'
import ssrParams from '../qwiket-lib/lib/ssrParams'

class Channel extends React.Component {
    static async getInitialProps({ store, isServer, req, query }) {
        if (isServer && req) {
            Root.host = req.headers.host;

        }
        let { channel, q, solo, code } = query;
        //  console.log({ store, isServer, query })

        await store.dispatch(fetchPageData({ ssrType: 'channel', channel, ssrQid: q, code, ssrParams: ssrParams(req) }));
        console.log("AFTER DISPATCH>>>>>>>>>>>>>>", store);
        /*
        const cookie = Immutable.fromJS(json.cookie ? json.cookie : {});
        console.log({ cookie });
        const identity = cookie.get("identity");
        const anon = cookie.get("anon");
        req.res.cookie('identity', identity, { maxAge, sameSite: 'Lax' })
        req.res.cookie('anon', anon, { maxAge, sameSite: 'Lax' })
        console.log("SET COOKIE ", { identity, anon }) */
        return { query }
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
        return <div>CHANNEL:<div>{JSON.stringify(app, null, 4)}</div></div>
    }
}
function mapStateToProps(state) {
    return {
        app: state.app,
    };
}
const mapDispatchToProps = dispatch => {
    return {
        fetchPageData: bindActionCreators(fetchPageData, dispatch),

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Channel)
