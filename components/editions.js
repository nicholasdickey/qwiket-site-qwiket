import React from "react";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
//import "../styles/normalize.css";

//MUI
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
//import {List, ListItem} from 'material-ui/List';
import Avatar from '@material-ui/core/Avatar';
import u from '../qwiket-lib/lib/utils';


//--------------------------------->


//import u from './utils'
import MediaQuery from 'react-responsive';

let NewEditionSwitch = ({ app, actions, session, onSelect, onClose }) => {
    const channels = app.get("channels");
    const channel = app.get("channel").get("channel")
    if (!channels)
        return <div />;
    var editions = [];
    console.log("channels:", channels.toJS())
    channels.forEach((o, i) => {
        if ((+o.get("published")) !== 1) {
            console.log("channel ", o.get("shortname"), " is not published")
            return;
        }

        console.log("Adding o=", o.toJS())
        const forum = o.get("forum");
        var name = o.get("name");
        const description = o.get("description");
        const homeChannel = o.get("shortname");
        var target = '';
        //const textStyle = props.textStyle ? props.textStyle : null;

        //if(homeChannel&&homeChannel!='qwiket')
        target = '/channel/' + homeChannel;
        /*else
          target='/';*/
        const row = (
            <ListItem
                button
                component="nav"
                // leftAvatar={<Avatar src={o.get("logo")} />}
                selected={homeChannel == channel} key={"editionsListItem" + i}
                // primaryText={name}
                // secondaryText={<div style={{ color: '#222' }}>{description}</div>}
                // secondaryTextLines={2}
                onClick={() => { console.log("calling onSelect"); onSelect(target, homeChannel); onClose(); }}
            // innerDivStyle={props.textStyle ? props.textStyle : null}
            //  style={props.textStyle ? props.textStyle : null}

            >
                <ListItemAvatar           >
                    <Avatar src={o.get("logo")} />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={description}

                />
            </ListItem >
        )
        editions.push(row);
    });
    return <div><List > {editions}</List ></div >

}


export class Editions extends React.Component {
    constructor(props, context) {
        super(props);
        this.escFunction = this.escFunction.bind(this);
    }
    escFunction(event) {

        if (event.keyCode === 27) {
            this.props.onClose();
        }
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    render() {
        let props = this.props
        const { open, onSelect, fullScreen } = props;
        console.log("editions: ", { open, fullScreen })
        return <div>
            <Dialog
                open={open}
                // title="Select a Qwiket Edition"
                fullScreen={fullScreen}
                autoScrollBodyContent={true}
                maxWidth='md'

            >
                <DialogTitle >Most Popular Qwiket Channels</DialogTitle>

                <NewEditionSwitch onSelect={onSelect} />
            </Dialog>

        </div>
    }
}
Editions.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    open: PropTypes.bool,
}

Editions = withMobileDialog()(Editions);
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
NewEditionSwitch = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewEditionSwitch)