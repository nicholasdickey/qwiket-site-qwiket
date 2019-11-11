import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import u from '../../qwiket-lib/lib/utils'

const Column = ({ app, session, items, qparams }) => {
    let channel = app.get("channel").get("channel");
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
)(Column)