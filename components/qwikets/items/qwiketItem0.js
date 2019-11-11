import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

/**
 * v10 rewrite, november 2019
 * A qwiket inside a column
 */

let QwiketItem = ({ session, qwiket, channel, pageQwiketid, actions }) => {

    return <div>{channel}</div>

}
function mapStateToProps(state) {
    return {
        app: state.app,
        session: state.session
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
)(QwiketItem)