import React from 'react';
import { connect } from 'react-redux'
import { styled } from '@material-ui/styles';
import Column from '../qwikets/column';

let AlertsColumn = ({ qparams, app, session }) => {
    const muiTheme = useTheme();
    const username = app.get("user") ? app.get("user").get("username") : '';
    const backgroundColor = muiTheme.palette.background.default;
    const color = muiTheme.palette.text.primary;
    const alerts = app.get("alerts");

    return styled(<Column data-id="alerts-items"
        type="alerts"
        items={alerts ? alerts.get("items") : ''}
        qparams={qparams}
        qType={"alerts"}
    />)`
    color:${color};
    background-color:${backgroundColor};
    `
}
function mapStateToProps(state) {
    return {
        app: state.app,
        session: state.session
    };
}
export default connect(
    mapStateToProps,
    null
)(AlertsColumn)
