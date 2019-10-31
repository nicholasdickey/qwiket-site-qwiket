import React from 'react';
import { bindActionCreators } from 'redux'
import Root from 'window-or-global'
import { connect } from 'react-redux'
import { fetchPageData } from '../qwiket-lib/actions/app'

class Channel extends React.Component {
    static async getInitialProps({ store, isServer, req, query }) {
        if (isServer && req) {
            Root.host = req.headers.host;
            Root.xff = req.headers['x-forwarded-for'];
            Root.ua = req.headers['user-agent'];
        }
        let { channel, q, solo, code } = query;
        //  console.log({ store, isServer, query })
        await store.dispatch(fetchPageData({ ssrType: 'channel', channel, ssrQid: q, code }));
        console.log("AFTER DISPATCH")
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
