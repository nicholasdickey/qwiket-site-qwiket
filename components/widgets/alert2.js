/* eslint-disable no-unused-vars */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import ReactDOM from 'react-dom';
import Root from 'window-or-global'
import u from '../utils'
import { BoundAlerts } from '../boundComponents'
import PropTypes from 'prop-types';
//import IconButton from 'material-ui/IconButton';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Notifications from 'mdi-material-ui/Bell';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import CancelIcon from 'mdi-material-ui/Close';
//import MediaQuery from 'react-responsive';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
export function AlertDialog(props) {
    let { onClick, open, anchorEl, globals, qparams, communityState, online, actions, session, app } = props;
    //console.log("AlertDialog", { open })
    let alerts = app.get("alerts");
    let unviewedCount = alerts ? +alerts.get("unviewedCount") : 0;
    let page = alerts ? alerts.get("page") : 0;
    let username = online.get("userName");
    let more = alerts ? alerts.get("more") : 0;
    return <Dialog
        scroll="paper"
        fullScreen={props.fullScreen}
        open={open}
        //scroll='paper'
        onClose={(event) => onClick({ open: false, anchorEl: null })}

        aria-labelledby="responsive-dialog-title"
        maxWidth='md'
        classes={{ root: 'q-dialog-root' }
        }
    >
        <Paper elevation={0} >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0 }}><DialogTitle id="responsive-dialog-title">Alerts</DialogTitle>
                <IconButton onClick={(event) => onClick({ open: false, anchorEl: null })} variant="contained" color="secondary" >
                    <CancelIcon style={{ width: 36, height: 36 }} />
                </IconButton></div>
        </Paper>
        <DialogContent >
            {unviewedCount ? <DialogContentText className="q-form-label" ><Button primary={true} className="q-alerts-more" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                actions.resetAlerts({ username })

            }}>Reset all alerts as viewed...</Button></DialogContentText> : null}
            <div onClick={() => { onClick({ open: false, anchorEl: null }); console.log("CLICK") }}>
                <BoundAlerts {...props} />
            </div>
            {more ? <DialogContentText className="q-form-label" ><Button primary={true} className="q-alerts-more" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                actions.fetchAlerts({ username, page: page + 1 })

            }}>More...</Button></DialogContentText> : null}

        </DialogContent>
        <style global jsx>{`
    .q-dialog-root{
     
	}
	.q-alerts-more{
		font-size:1.0rem;
		//text-decoration:underline;
	}
  `}</style>
    </Dialog >
}
AlertDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};
AlertDialog = withMobileDialog()(AlertDialog);
const Alert = (props) => {
    let { onClick, open, anchorEl, globals, qparams, communityState, online, actions, session, app } = props;
    //console.log("props.z=",props.z)
    //console.log("alert globals",globals)
    //console.log("AlertWidget", open)
    const width = u.width(globals);//globals.get("width");//u.width();
    var items = [];
    const shellStyle = { marginLeft: 30, display: 'flex', alignItems: 'center', paddingBottom: 4, color: 'red' };
    const buttonStyle = { width: 24, height: 24, padding: 1 };
    let alerts = app.get("alerts");
    let unviewedCount = alerts ? +alerts.get('unviewedCount') : 0;
    if (!unviewedCount)
        unviewedCount = 0;
    //console.log("RENDER ALERT_WIDGET", { unviewedCount, alerts: alerts ? alerts.toJS() : '' })

    //console.log(" ALERT WIDGET open:",open,"anchorEl:",anchorEl)
    if (alerts) {
        //console.log('alerts:',alerts.toJS())
		/*items = alerts.map((p, i) => <MenuItem key={"sdfskjh" + i} primaryText={p.get("title") + "   (" + p.get("count") + ")"}
			onClick={() => onClick({ open: false, threadid: p.get("threadid") })} />)*/

    }
    return (<div>{unviewedCount ? <div className="q-alert-wrapper">
        <IconButton
            tooltip="Alerts"
            onClick={(event) => onClick({ open: true, anchorEl: event.currentTarget })}
            color='primary'

            classes={{
                root: 'q-alert-button'
            }}
        ><Badge classes={{ root: 'q-alert-badge', badge: 'q-alert-badge' }} className={"q-alert-badge"} badgeContent={unviewedCount} max={99} color="primary">

                <Notifications fontSize='small' classes={{ root: 'q-alert-root', colorPrimary: 'q-alert-root' }} />

            </Badge>

        </IconButton>

    </div> : <div className="q-alert-wrapper" id="button-shell" >
            <Badge classes={{ badge: 'q-alert-badge' }} badgeContent={unviewedCount} max={99} color="primary">
                <IconButton id='button' style={buttonStyle}
                    onClick={(event) => onClick({ open: true, anchorEl: event.currentTarget })}
                    data-tooltip="Notifications" data-tooltipPosition="bottom-left"
                    iconStyle={{ color: 'grey', height: 22, width: 22 }}
                ><Notifications fontSize='small' id='icon' /></IconButton>			</Badge>
        </div>}
        <AlertDialog {...props} />
        <style global jsx>{`
            .q-alert-root{
				color: red !important;
				
			}
			.q-alert-button{
				
				
			
			}
			.q-alert-wrapper{
				margin-left:30px;
				display:flex;
				align-items:flex-begin;
				margin-top:6px;
				margin-right:10px;
			}		
			.q-alert-badge{
				font-size:0.8rem !important;
			}
           
          `}</style>
    </div >)
}
function mapStateToProps(state) {
    return {
        app: state.app,
        session: state.session
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ updateSession }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Alert)