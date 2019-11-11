import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import Divider from '@material-ui/core/Divider';

import Link, { MaskedLink } from '../qwiket-lib/lib/link'
import { invalidateContext } from '../qwiket-lib/'

let NewsgridTile = ({ actions, session, link, v, cb, lr, x, y, i, qwiket, title, description, byline, image }) => {
    let loud = (+session.get("loud"));
    const theme = +globals.get("theme");//u.theme();
    const tbck = theme ? '#333' : '#222';
    const Title = styled.div`white-space:normal;`;
    const Subtitle = styled.div`white-space:normal;user-select:text;`;
    const Byline = styled.div` margin-top: 3px, margin-bottom: 3px`;
    return styled(
        <GridListTile
            ref={cb}
            lastRow={lr}
            onClick={() => {
                actions.invalidateContext({ local: true, shortname: qwiket.get('cat'), threadid: qwiket.get('threadid'), qwiket });
            }}
            cols={x}
            rows={y}
            key={"item" + i}
            classes={{ imgFullHeight: 'img-fullheight', imgFullWidth: 'img-fullwidth' }}
        >
            <Link to={link}>
                <img className='img-fullheight' src={image} />
            </Link>
            <Link to={innerLink}>
                <GridListTileBar
                    title={<Title><b><Link to={link}>{title.slice(0, 128)}</Link></b></Title>}
                    subtitle={
                        <Link style={{ paddingBottom: 10 }} to={innerLink} >
                            <Subtitle> {description}</Subtitle>
                            <Divider />
                            <Byline>{byline}</Byline>
                        </Link>}
                    sclasses={{ title: 'title', titleWrap: 'titlewrap' }}
                />
            </Link>
        </GridListTile>)`
    & .titlewrap{
        padding: 14px;
        z-index:2;
        margin:0px;
        user-select: text;
    }
    & .title{
            background-color: ${tbck};
    }
    & .img-fullheight{
	    background-color: ${tbck};
		object-fit: cover;
		opacity: ${loud ? 1.0 : 0.9}
	}
	& .img-fullwidth{
		object-fit: cover;
		opacity: ${loud ? 1.0 : 0.9}
	}
    `
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
)(NewsgridTile)
