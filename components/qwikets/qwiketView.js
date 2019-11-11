import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Immutable from 'immutable'
import Typography from '@material-ui/core/Typography';
import { QwiketItem } from './items/qwiketItem'
import { withTheme, useTheme } from '@material-ui/core/styles';
import QwiketRenderer from './qwiketRenderer'
//import renderBlocks from './renderBlocks'
let QwiketView = ({ qwiket, app, session, qparams, user }) => {
    let [state, setState] = useState({});
    let [long, setLong] = useState(true);
    // qwiket = qwiket.toJS();
    if (!qwiket.get("body"))
        qwiket = qwiket.set("body", Immutable.fromJS({ blocks: [] }))
    const theme = useTheme();
    let channel = app.get("channel");
    let details = channel.get("channelDetails");
    let config = details.get("config").toJS();
    let configDefinedTags = config.definedTags;
    let cdtKeys = Object.keys(configDefinedTags);
    console.log("render QwiketView", { qwiket: qwiket.toJS() })
    if (!qwiket)
        return null;

    // let { title, description, body, published_time, definedTags, externalTags } = qwiket;
    const OuterShell = styled.div`
        display:flex;
        flex-direction:column;
        border:thick solid green;
        width:600px;
        & .q-qwiket-title-full{
            font-weight:500;
              
                line-height: 1.3; 
                font-size: 2.0rem; 
                font-family:roboto;
                text-align: left; 
                cursor:pointer;
                user-select:text;
        }
    `;
    const Credits = styled.div`
        display:flex,
        justify-content:space-between;
    `;
    let q = {
        columnType: 'full',
        topic: qwiket,
        channel: channel.get("channel"),
        qparams,
        forceShow: 1,
        qType: 'mix'

    }
    // const blocks = renderBlocks({ jsqwiket: qwiket.toJS(), theme, includeImage: true, includeDescription: true, htmlDescription: true, type: 'full', isZoom: false });
    return <OuterShell>
        <Typography variant="body1" gutterBottom>
            {JSON.stringify(cdtKeys, null, 4)}

        </Typography>
        <QwiketRenderer theme={theme} type='full' subtype='level' topic={qwiket} globals={session} state={state} setState={setState} approver={1} channel={channel.get("channel")} loud={session.get("loud")} keyprop="sdsd" long={long} setLong={setLong} link={false} onClick={false} inShow={false} qwiketOpened={true} zoom={false} />


        <QwiketItem {...q} />
    </OuterShell>

}

function mapStateToProps(state) {
    return {
        app: state.app,
        session: state.session,
        user: state.user
    };
}

export default connect(
    mapStateToProps,
    null
)(withTheme(QwiketView))