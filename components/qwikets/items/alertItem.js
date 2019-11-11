//require("babel/register");
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Link, { MaskedLink } from '../qwiket-lib/lib/link'
import { renderMarkdown } from '../qwiketRenderer';


let AlertView = ({ actions, session, app, link, v, cb, lr, x, y, i, alert, title, description, byline, image }) => {

    let username = app && app.get("user") ? app.get("user").get("username") : "";
    alert = alert.toJS();
    let { alertid, viewed, channel, target_tid, type, link, threadid, author, subscr, avatar, target_reshare, notif_reshare, notif_text, notif_title, target_text, target_title } = alert;

    target_reshare = +target_reshare;
    let targetIsStickie = target_reshare == 9 || target_reshare == 109;
    const StyledListItem = styled((props) => <ListItem className="q-alert" alignItems="flex-start"  {...props} />)`
    & .q-alert-secondary-viewed{
			font-size:0.9rem;
			line-height:1.3;
			font-weight:300;
			padding:0px;
		}	
	& .q-alert-secondary-unviewed{
			font-size:0.9rem;
			line-height:1.3;
			font-weight:500;
			padding:0px;
		}
	& .q-alert-viewed{
			opacity:0.6;
			font-weight:500;
			font-size:1.0rem !important;
			line-height:1.3;
			padding:0px;
		}
	& .q-alert-unviewed{
			font-weight:500;
			font-size:1.0rem !important;
			line-height:1.3;
			padding:0px;
		}
	& .q-alert-text-root{
			padding-right:0px;
		}
            
        `

    return <Link to={link}>
        <StyledListItem button onClick={() => actions.viewAlert({ alertid, username })}>
            <ListItemAvatar>
                <Avatar style={{ width: 32, height: 32 }} alt={author} src={avatar} />
            </ListItemAvatar>
            <ListItemText
                classes={{ root: 'q-alert-text-root' }}
                primary={<div className={viewed ? 'q-alert-viewed' : 'q-alert-unviewed'}>{type == 'reply' ? `${author} replied to your qwiket${targetIsStickie ? ` "${target_title}"` : ''}.` : `Unknown Alert`}</div>}
                secondary={
                    <React.Fragment>
                        <div className={viewed ? "q-alert-secondary-viewed" : "q-alert-secondary-unviewed"}>
                            — {renderMarkdown({ blockType: 'text', dataId: 'alert-' + alertid, md: notif_text ? notif_text : '' })}
                        </div>

                    </React.Fragment>
                }
            />
            <style global jsx>{`
			
		
	
	`}
            </style>
        </StyledListItem>></Link >
}

function mapStateToProps(state) {
    return {
        session: state.session
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ invalidateContext }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertView)
