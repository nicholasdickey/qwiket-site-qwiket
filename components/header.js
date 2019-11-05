import React from 'react';
import { connect } from 'react-redux'
import styled from 'styled-components';
import { processLayout } from '../lib/layout'
let Header = ({ children, app, session, pageType, ...rest }) => {
};
function mapStateToProps(state) {
    return {
        app: state.app,
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(Header)