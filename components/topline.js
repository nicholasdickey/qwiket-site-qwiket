import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { updateSession } from '../qwiket-lib/actions/app'
import AlertWidget from './widgets/alert'
const StyledCheckbox = styled(({ ...other }) => <Checkbox classes={{ checked: 'checked', disabled: 'disabled' }}{...other} />)`
  color: #eee !important;
  width:200px%;
  & .label {
    #color: ${props => props.color};
    color: #ddd;
    font-size: 14px; 
    font-family: Asap Condensed;
    font-weight:bold;
  }
   & .checked {
    color: #eee !important;
   
  }
  & .disabled {
    color:  #aff; !important;
  }
`;
const StyledFormControlLabel = styled(({ ...other }) => <FormControlLabel classes={{ root: 'label' }}{...other} />)`
    color: #ddd;
    font-size: 14px; 
    font-family: Asap Condensed;
    font-weight:bold;
`;

let Topline = ({ session, layout, actions }) => {
    let upd = actions.updateSession;
    //console.log("RENDER TOPLINE");
    let hpads = layout.hpads;



    const alert = <div style={{ flexShrink: 4 }}> <Tooltip title="Alerts"><AlertWidget onClick={(v) => {
        console.log("alert click ", v);
        /* if (v.threadid) {
           // console.log("Alert clicked thread=", v.threadid);
           const url = contextUrl + v.threadid;
           props.history.push(url);
         }*/


    }} /></Tooltip></div>
    const Check = ({ label, checked, onChange, disabled }) => {
        return <StyledFormControlLabel
            control={
                <StyledCheckbox
                    checked={checked}
                    color="primary"
                    onChange={onChange}
                    disabled={disabled}
                />
            }
            label={label}
        />
    }


    const Loud = () => {
        return <Check label='Loud' checked={session.get('loud') == 1 ? true : false} onChange={(e, v) => {
            console.log("Changed Loud")
            upd({ loud: v ? 1 : 0 });
        }} />
    }
    const Thick = () => {
        const StyledCheck = styled.div`
            display:flex;
            width:120px;
          
            @media(max-width:1200px){
                display:none;
            }
        `
        return <StyledCheck><Check label='Thick' checked={session.get('thick') == 1 ? true : false} onChange={(e, v) => {
            console.log("Changed And The Band")
            upd({ thick: v ? 1 : 0 });
        }} /></StyledCheck>
    }
    const Dense = () => {
        const StyledCheck = styled.div`
            display:flex;
             width:120px;
            @media(max-width:1200px){
                display:none;
            }
        `
        return <StyledCheck><Check label='Dense' checked={session.get('dense') == 1 ? true : false} onChange={(e, v) => {
            console.log("Changed And The Band")
            upd({ dense: v ? 1 : 0 });
        }} /></StyledCheck>
    }
    const Dark = () => {
        return <Check label='Dark' checked={session.get('theme') == 0 ? true : false} onChange={(e, v) => {
            console.log("Changed Loud")
            upd({ theme: v ? 0 : 1 });
            //setTimeout(() => location.reload(true), 200)
        }} />
    }
    const Band = () => {
        const StyledCheck = styled.div`
            display:flex;
            @media(max-width:750px){
                display:none;
            }
        `
        return <StyledCheck><Check label='And The Band' checked={session.get('cover') == 1 ? true : false} onChange={(e, v) => {
            console.log("Changed And The Band")
            upd({ cover: v ? 1 : 0 });
        }} /></StyledCheck>
    }


    const ToplineBand = styled.div`
        width:100%;
        height:30%;
        display:block;
        background-color:#000;
        @media(max-width:749px){
            display:none;
        }
    `
    const InnerBand = styled.div`
        padding-left: ${hpads.w0};
        padding-right: ${hpads.w0};
        width: '100%'
        @media(min-width:750px){
            padding-left: ${hpads.w750};
            padding-right: ${hpads.w750};
        }
        @media(min-width:900px){
            padding-left: ${hpads.w900};
            padding-right: ${hpads.w900};
        }
        @media(min-width:1200px){
            padding-left: ${hpads.w1200};
            padding-right: ${hpads.w1200};
        }
        @media(min-width:1600px){
            padding-left: ${hpads.w1600};
            padding-right: ${hpads.w1600};
        }
        @media(min-width:1800px){
            padding-left: ${hpads.w1800};
            padding-right: ${hpads.w1800};
        }
        @media(min-width:1950px){
            padding-left: ${hpads.w1950};
            padding-right: ${hpads.w1950};
        }
        @media(min-width:2100px){
            padding-left: ${hpads.w2100};
            padding-right: ${hpads.w2100};
        }
        @media(min-width:2400px){
            padding-left: ${hpads.w2400};
            padding-right: ${hpads.w2400};
        }
        display:flex;
        justify-content:space-between;
        align-items:center;
        color:#eee;
        font-size:10px;
        font-weight:normal;
        height:30px;
        margin-bottom:0px;
    
    `
    return <ToplineBand data-id="topline"><InnerBand><Loud /><Thick /><Dense /><Dark /><Band />{alert}</InnerBand></ToplineBand>
};
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
)(Topline)