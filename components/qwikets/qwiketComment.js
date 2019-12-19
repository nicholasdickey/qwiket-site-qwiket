import React, { Component } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Immutable from "immutable"
import { withTheme } from '@material-ui/core/styles';
import Root from 'window-or-global';
import ReactHoverObserver from 'react-hover-observer';
import { Image } from 'react-bootstrap';
import Markdown from 'react-markdown';
import TrackVisibility from 'react-on-screen';
//import { Waypoint } from 'react-waypoint';
//import { Qwiket } from './qwikets';
//import { BoundQwiket } from './qwiketWrapper';
var debounce = require('lodash.debounce');
//var request = require('superagent');
var he = require('he');
import copy from 'copy-to-clipboard';
import $ from 'jquery';
import { updateOpenEditor, fetchDraftQwiket, fetchShowQwiket, saveQwiket, publishQwiket, localUpdateQwiket } from '../../qwiket-lib/actions/context'
import { unshareNewslineQwiket, fetchComments, unpublishQwiket } from '../../qwiket-lib/actions/contextActions';

import { updateOnlineState } from '../../qwiket-lib/actions/user';
import { ssRoutes } from '../../qwiket-lib/routes'

let { Link, Router } = ssRoutes;
import u from '../../qwiket-lib/lib/utils';
import { renderMarkdown } from './qwiketRenderer';
import QwiketRenderer from './qwiketRenderer';
import { ClickWalledGarden } from '../../qwiket-lib/components/walledGarden';
//import { ArticleView, renderToHtml } from '../../qwiket-lib/components/articleView'
//import Dropzone from 'react-dropzone';
import "core-js";
import regeneratorRuntime from "regenerator-runtime";
import { DropzoneArea } from 'material-ui-dropzone'
//import { DropzoneDialog } from 'material-ui-dropzone'
//import ModalImage from "react-modal-image"
//material-ui
import { useTheme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Collapse from '@material-ui/core/Collapse';
import Select from '@material-ui/core/Select';
//import Textarea from '@material-ui/core/TextareaAutosize';
import Textarea from 'react-expanding-textarea'
//import Textarea from 'react-textarea-autosize';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
//colors
import indigo from '@material-ui/core/colors/indigo';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import IconButton from '@material-ui/core/IconButton';
import blueGrey from '@material-ui/core/colors/blueGrey';
import teal from '@material-ui/core/colors/teal';
import pink from '@material-ui/core/colors/pink';
import yellow from '@material-ui/core/colors/yellow';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import { DropzonePrompt } from '../../qwiket-lib/components/widgets/imgUpload';

//icons

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Heart from 'mdi-material-ui/HeartOutline';
import ReadArticle from 'mdi-material-ui/BookOpen';
import FlagRemove from 'mdi-material-ui/FlagOutline';
import ShareVariant from 'mdi-material-ui/ShareVariant';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import Bullet from 'mdi-material-ui/CircleSmall';
import FilledInput from '@material-ui/core/FilledInput';
import SendIcon from 'mdi-material-ui/MessageTextOutline';
import PrivateMessage from 'mdi-material-ui/MessageText';
import Help from 'mdi-material-ui/HelpCircle';
import ImageIcon from 'mdi-material-ui/Image';
import CancelIcon from 'mdi-material-ui/Close';
import CheckIcon from 'mdi-material-ui/Check';
import Star from 'mdi-material-ui/StarOutline';
import CommentOutline from 'mdi-material-ui/CommentOutline';
import PlaylistEdit from 'mdi-material-ui/PlaylistEdit';
import ReplyTo from 'mdi-material-ui/Share';

import Reply from 'mdi-material-ui/Reply';
//import { doUpdateItemTopicState } from "../../actions/contextActions";

//import TextField, { HelperText, Input } from '@material/react-text-field';
//import '@material/react-text-field/dist/text-field.css';
const microtime = () => (new Date).getTime() | 0
var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const HelpBox = ({ title, text }) => {
    return <Paper className="q-comment-help-box">
        <div className="q-comment-help-box-title">
            {title}
        </div>
        <div className="q-comment-help-box-body">
            {text}
        </div>
    </Paper>
}

export class QwikieEditor extends Component {
    state = {
        drafts: false,
        //open: false,
        tab: 0,
        descrOpenMD: false,
        dirty: false,
        availableEntities: false,
        uid: randomstring()
    }

    constructor(props) {
        super(props);
        //this.myRef = React.createRef();

        //this.escFunction = this.escFunction.bind(this);
        this.saveComment = debounce(this.saveComment, 1000, { trailing: true, leading: true })
        this.fetchDrafts = debounce(this.fetchDrafts, 1000)
        this.reset = this.reset.bind(this);
        this.lastBlockRef = null;
        this.setLastBlockRef = element => {
            console.log("!!!!!!!!!!!!!!! setLastBlockRef", element)
            this.lastBlockRef = element;
        }
        this.focusTextInput = () => {
            // Focus the text input using the raw DOM API
            console.log("focusTextInput", this.lastBlockRef)
            if (this.lastBlockRef) this.lastBlockRef.focus();
        };
        let { pageRootThreadid, level, qedit } = props;
        if (!pageRootThreadid && level == 0 && qedit)
            this.state.stickie = true;
    }
    fetchDrafts() {
        const { qedit, actions, topic, setState } = this.props;
        if (actions.fetchDraftChildQwiket) {
            //console.log("fetchDraftChildQwiket")
            if (!this.state.drafts)
                actions.fetchDraftChildQwiket({ qwiketid: topic.get("qwiketid") });
            this.setState({ drafts: true })
        }
    }
    componentDidMount() {
        this.fetchDrafts();
        let props = this.props;
        let { qparams, actions, topic, level } = props;
        const cqid = qparams ? qparams.cqid : 0;

        console.log("componentDidMount:", { level, topic: topic ? topic.toJS() : '' })
        if (!topic.get('qwiketid') && level == 0) {

            console.log(" D17 COMPONENT DID MOUNT", { topic: topic.toJS() })
            actions.updateOpenEditor({ qwiketid: '__new:' + this.state.uid });

        }
        if (level) {
			/*setTimeout(() => {

				let textArea = $('.q-comment-text-input-default');
				console.log("textArea", { textArea })
				var data = textArea.val();

				console.log("setting focus on update1")
				textArea.focus().val('').val(data);
				textArea = $('.q-comment-text-input');
				console.log("textArea", { textArea })
				data = this.state.description;//textArea.val();

				console.log("setting focus on update2", data)
				if (data)
					textArea.focus().val('').val(data);
				else
					textArea.focus()//.val(data);
			}, 100); */
        }
		/*if (level) {
			console.log("focus")
			setTimeout(() => {
				let textArea = $('.q-comment-text-input');
				console.log("textArea", { textArea })
				var data = textArea.val();
				console.log("setting focus")
				textArea.focus().val('').val(data);
			}, 1500);
		}*/
		/*setTimeout(() => {
			let textArea = $('.q-comment-text-input-default');
			console.log("textArea", { textArea })
			var data = textArea.val();
			textArea.focus().val('').val(data);
		}, 100);*/
		/*$('textarea').focus(function () {
			console.log("11111")
			var theVal = $(this).val();
			$(this).val(theVal);
		});*/
        //setState({ dirty: qedit ? false : this.state.description ? true : false })
        //console.log("Qwikie Editor componentDidMount")
    }
    setFocus() {
        setTimeout(() => {

            let textArea = $('#editor-default');
            console.log("textArea", { textArea })
            var data = textArea.val();

            console.log("setting focus on update1")
            if (data)
                textArea.focus().val('').val(data).focus();
            else
                textArea.focus()//.val(data);
			/*textArea = $('.q-comment-text-input');
			console.log("textArea", { textArea })
			data = this.state.description;//textArea.val();

			console.log("setting focus on update2", data)
			if (data)
				textArea.focus().val('').val(data).focus();
			else
				textArea.focus()//.val(data);*/
        }, 100);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("d1")
        let state = this.state;
        if ((this.props.route != prevProps.route) && !state.hasInitTopic && !state.hasInitReply || !prevState.hasInitTopic && state.hasInitTopic || !prevState.hasInitReply && state.hasInitReply) {
            console.log("componentDidUpdate", { prevHasInitTopic: prevState.hasInitTopic, thishasInitTopic: state.hasInitTopic, prevHasInitReply: prevState.hasInitReply, thisHasInitReply: state.hasInitReply });
			/*setTimeout(() => {
				let textArea = $('.q-comment-text-input-default');
				console.log("textArea", { textArea })
				var data = textArea.val();

				console.log("setting focus on update")
				textArea.focus().val('').val(data);
				textArea = $('.q-comment-text-input');
				console.log("textArea", { textArea })
				data = this.state.description;//textArea.val();

				console.log("setting focus on update2", data)
				if (data)
					textArea.focus().val('').val(data);
				else
					textArea.focus()//.val(data);
			}, 1500); */
        }
        let props = this.props;
        let prevTopic = prevProps.topic;
        let prevQedit = prevProps.qedit;
        let prevItem = prevQedit ? prevTopic : prevProps.replyTopic;
        console.log("prevItem", prevItem.toJS())
        let prevUid = prevState.uid;
        let prevQwiketid = (!prevQedit && !prevItem) ? `__new:${prevUid}` : prevItem.get("qwiketid");
        let topic = props.topic;
        let qedit = props.qedit;
        let item = qedit ? prevTopic : props.replyTopic;
        let uid = state.uid;
        let qwiketid = (!qedit && !item) ? `__new:${uid}` : item.get("qwiketid");
        if (props.context.get("openEditor") == prevQwiketid) {

            if (qwiketid != prevQwiketid) {
                console.log("D17 componentDidUpdate 22 calling updateOpenEditor", { qwiketid, prevQwiketid, openEditor: prevProps.context.get("openEditor"), qedit, replyTopic: props.replyTopic ? props.replyTopic.toJS() : null })
                props.actions.updateOpenEditor({ qwiketid });
                console.log("opened2");
                this.setFocus();
            }
        }
        if ((prevProps.context.get("openEditor") != qwiketid) && props.context.get("openEditor") == qwiketid) {
            console.log("opened");
            this.setFocus();
        }
        console.log("reorder componentDidUpdate", { prevState, snapshot })
    }
    static getDerivedStateFromProps(props, state) {
        console.log("getDero");
        let { qedit, route, topic, replyTopic, rootThreadid, setState, context, actions, defaultTitle, globals, user, zoom, channel } = props; //qedit- type of QwiketEditor, edit- mode of QwiketComment

        const childDraft = context.get("childDraft");
        const draftParentThreadid = context.get("draftParentThreadid");
        let drafts = context.get("drafts");
        let loadingDraft = context.get("loadingDraft");
        if (qedit && loadingDraft)
            return;
        let draft = qedit && drafts && topic ? drafts.get(topic.get("qwiketid")) : null;
        const hasInitReply = replyTopic ? true : false;
        const hasInitTopic = draft ? true : false;
        const newReply = hasInitReply && (!state || !state.hasInitReply || state.rootThreadid != rootThreadid);

        const newTopic = hasInitTopic && (!state || !state.hasInitTopic);
        if (!qedit && state && !replyTopic && state.rootThreadid) {
            //console.log("qedit getDerivedStateFromProps 0", { rootThreadid, stateRootThreadid: state ? state.rootThreadid : 0, newReply, state, childDraft, replyTopic, topic, draft })

            return { description: "", title: topic.get("title"), body: null, site_name: null, stickie: false, dq: false, site_name: null, author: null, hasInitReply: false, hasInitTopic: false, rootThreadid: null };
        }
        if (!(qedit || replyTopic))
            return state;
        console.log({ rootThreadid, topic: topic ? topic.toJS() : {}, qedit, draft, newTopic, newReply, state })
        if (!rootThreadid) {
            rootThreadid = context.get('openEditor');

            draft = Immutable.fromJS({
                threadid: rootThreadid,
                qwiketid: rootThreadid,
                reshare: 59,
                author: user.get("user_name"),
                username: user.get("username"),
                site_name: `${os.get("user_name")} on Qwiket`

            })
        }
        //if (replyTopic && replyTopic.get('description') == 'sss')
        //console.log('reorder getDerivedStateFromProps', { hasInitReply, hasInitTopic, state, newTopic, newReply, replyTopic: replyTopic ? replyTopic.toJS() : '', props })
        //	console.log("getDerivedStateFromProps")
        //if (draft)
        //	console.log("draft", { drafts: drafts.toJS(), threadid: topic.get("threadid"), draft: draft ? draft.toJS() : '', newTopic, newReply, qedit })
        state = {
            description: state && (!newTopic && !newReply || state.dirty) ? state.description : qedit ? (draft ? draft.get("description") : topic.get("description")) : replyTopic ? replyTopic.get("description") : childDraft ? childDraft.get("description") : '',
            title: state && !newTopic && !newReply ? state.title : qedit ? draft ? draft.get("title") : topic.get("title") : replyTopic ? replyTopic.get("title") : childDraft ? childDraft.get("title") : topic.get("title") ? topic.get("title") : defaultTitle,
            body: state && !newTopic && !newReply ? state.body : qedit ? draft ? draft.get("body") : topic.get("body") : replyTopic ? replyTopic.get("body") : childDraft ? childDraft.get("body") : Immutable.fromJS({ blocks: [{ blockType: 'text', text: '' }] }),
            site_name: state && !newTopic && !newReply ? state.site_name : qedit ? draft ? draft.get("site_name") : topic.get("site_name") : replyTopic ? replyTopic.get("site_name") : childDraft ? childDraft.get("site_name") : '',
            author: state && !newTopic && !newReply ? state.author : qedit ? draft ? draft.get("author") : topic.get("author") : replyTopic ? replyTopic.get("author") : childDraft ? childDraft.get("author") : '',

            image_src: state && !newTopic && !newReply ? state.image_src : qedit ? draft ? draft.get("image_src") : topic.get("image_src") : replyTopic ? replyTopic.get("image_src") : childDraft ? childDraft.get("image_src") : '',
            dq: state && !newTopic && !newReply ? state.dq : qedit ? draft ? (draft.get("reshare") == 56 || draft.get("reshare" == 6) || draft.get("reshare") == 106) : (topic.get("reshare") == 56 || topic.get("reshare" == 6) || topic.get("reshare") == 106) : replyTopic ? (replyTopic.get("reshare") == 56 || replyTopic.get("reshare") == 6 || replyTopic.get("reshare") == 106) : childDraft ? (childDraft.get("reshare") == 56 || childDraft.get("reshare") == 6 || childDraft.get("reshare") == 106) : false,
            stickie: state && !newTopic && !newReply ? state.stickie : qedit ? draft ? (draft.get("reshare") == 59 || draft.get("reshare" == 9) || draft.get("reshare") == 109) : (topic.get("reshare") == 59 || topic.get("reshare") == 9 || topic.get("reshare") == 109) : replyTopic ? (replyTopic.get("reshare") == 59 || replyTopic.get("reshare") == 9 || replyTopic.get("reshare") == 109) : childDraft ? (childDraft.get("reshare") == 59 || childDraft.get("reshare") == 9 || childDraft.get("reshare") == 109) : topic ? (topic.get("reshare") == 59 || topic.get("reshare") == 9 || topic.get("reshare") == 109) : false,
            hasInitReply,
            hasInitTopic,
            rootThreadid: state && !newTopic && !newReply ? state.rootThreadid : rootThreadid,
            availableEntities: state && !newTopic && !newReply ? state.entities : qedit ? draft ? draft.get("availableEntities") : topic.get("availableEntities") : replyTopic ? replyTopic.get("availableEntities") : childDraft ? childDraft.get("availableEntities") : [],

        }
        if ((typeof state.body === "string" || state.body instanceof String) && (topic.get("reshare") == 8 || topic.get("reshare") == 108 || topic.get("reshare") == 0 || topic.get("reshare") == 108)) {
            //console.log("qedit body is a string", state.body)
            if (topic.get("reshare") == 8 || topic.get("reshare") == 108) {
                //console.log("qedit CONVERTING ARTICLE");
                const theme = +globals.get("theme");

                let htm = renderToHtml({ topic, d: topic.toJS(), theme, globals, os, cs, zoom, channel, approver: true });
                //let htm = topic.get("html");
                //	console.log('qedit parsed html:', htm);
                //if (htm)
                //	htm = htm.split('|')[2];
                state.body = htm;
            }
            let b = state.body;
            //console.log("before FIXED body:", b)
            b = he.decode(b);
            //console.log("FIXED body:", b)
            state.body = Immutable.fromJS({
                blocks: [{
                    blockType: 'text', text: b//.replace(/&nbsp;/g, ' ')
                }]
            });
            state.stickie = true;
        }

        console.log('qedit getDerivedStateFromProps', { replyTopic, topic: topic ? topic.toJS() : {}, state, newTopic })
        //console.log("getDerivedStateFromProps", { rootThreadid, stateRootThreadid: state ? state.rootThreadid : 0, newReply, state, childDraft, replyTopic, topic, draft })
        //	console.log("NO TITLE ---");
        if (!state.title) {
            //console.log("NO TITLE:", { topic: topic ? topic.toJS() : '', draft: draft ? draft.toJS() : '', defaultTitle, replyTopic, childDraft })
        }
        return state;
    }
    reset() {
        //console.log("RESET")
        const props = this.props;
        const { qedit, topic, replyTopic, setState } = props; //qedit- type of QwiketEditor, edit- mode of QwiketComment

        this.setState({
            description: "",
            image_src: "",
            dq: false,
            stickie: false,
            dqHelpOpen: false,
            stickieHelpOpen: false,
            dropzone: false,
            edit: false,
            dirty: false,
            //open: false,
            hasInitReply: false,
            hasInitTopic: false,
            newSaved: false,

            uid: randomstring()
        });
    }

    saveComment({ publish, chain }) {
        let { description, image_src, title, body, author, site_name, stickie, dq, uid } = this.state;
        let { qedit, topic, replyTopic, user, actions, channel, test, rootThreadid, columnType, defaultTitle } = this.props;

        let username = user.get("username");
        let user_name = user.get("user_name");
        let item = qedit ? topic : replyTopic;
        if (!title && item)
            title = item.title;
        if (!title)
            title = defaultTitle;

        let qwiketid = (!qedit && !item) ? '__new' : item.get("qwiketid");
        console.log("saveComment", { topic: topic ? topic.toJS() : {}, qwiketid })
        if (qwiketid == '__new') {
            if (!uid) {
                uid = randomstring();
                this.setState({ uid });
            }
            qwiketid = `__new:${uid}`;
            console.log("saveComment uid:", uid);
            //console.log("saveComment, __new but newSaved return", { item: item ? item.toJS() : '', replyTopic: replyTopic ? replyTopic.toJS() : '' });
            //return;
        }

        if (!description)
            description = '';
        if (!title)
            title = '';
		/*if (qwiketid == '__new') {
			this.setState({ newSaved: true });
		}*/
        let catIcon = user.get("avatar");
        let cat = user.get("username");
        let catName = user.get("user_name");
        //  console.log("RENDER COMMENT", { catIcon, cat, catName });
        if (!author)
            author = catName;
        if (!site_name) site_name = catName + " on Qwiket";
        let rootId = item ? item.get("rootId") : (topic.get("rootId") ? topic.get("rootId") : '') + `/${qwiketid}`;
        let root_threadid = rootThreadid;
        let parent_threadid = qedit ? item.get("parent_threadid") ? item.get("parent_threadid") : '' : topic.get("qwiketid");
        let published_time = (new Date()).getTime() / 1000 | 0;
        let shared_time = (new Date()).getTime() / 1000 | 0;
        let updated_time = (new Date()).getTime() / 1000 | 0;
        let reshare = 0;
        if (!qwiketid) {
            qwiketid = `__new:${uid}`;
            root_threadid = qwiketid;
        }
        console.log("saveComment>>", { publish, qwiketid })

        if (qedit) {
            const existReshare = +topic.get("reshare");
            //console.log("qedit save ", { existReshare })
            if (stickie && [6, 7, 9].indexOf(existReshare) >= 0) {
                reshare = 9;
            }
            else if (stickie && [106, 107, 109].indexOf(existReshare) >= 0) {
                reshare = 109;
            }
            else if (stickie && [56, 57, 59].indexOf(existReshare) >= 0) {
                reshare = 59;
            }
            else if (!stickie && !dq && [9].indexOf(existReshare) >= 0) {
                reshare = 7;
            }
            else if (!stickie && dq && [9].indexOf(existReshare) >= 0) {
                reshare = 6;
            }
            else if (!stickie && !dq && [109].indexOf(existReshare) >= 0) {
                reshare = 107;
            }
            else if (!stickie && dq && [109].indexOf(existReshare) >= 0) {
                reshare = 106;
            }
            else if (!stickie && !dq && [59].indexOf(existReshare) >= 0) {
                reshare = 57;
            }
            else if (!stickie && dq && [59].indexOf(existReshare) >= 0) {
                reshare = 56;
            }
            else {
                if (stickie)
                    reshare = 109;
                else
                    reshare = existReshare;
            }
            //console.log("qedit save2 ", { reshare })
        }
        else {
            if (dq)
                reshare = 56;
            if (stickie)
                reshare = 59;
            else
                reshare = 57;
        }
        if (!reshare)
            reshare = 59;
        if (!image_src)
            image_src = '';

        body = body ? body.toJS() : '';

        let request = {
            qwiketid,
            publish: publish ? 1 : 0,
            threadid: qwiketid,
            title,
            description,
            body,
            image_src,
            reshare,
            author,
            site_name,
            shortname: item && item.get("cat") ? item.get("cat") : username,
            username,
            test,
            rootId,
            root_threadid,
            parent_threadid,
            cat,
            catName,
            author,
            catIcon,
            published_time,
            publishedTime: published_time,
            shared_time,
            updated_time,
            site_name,
            columnType,
            username: cat,
            channel: test ? 'test' : channel
        }
        console.log("saveComment", { qedit, test, replyTopic: replyTopic ? replyTopic.toJS() : '', rootId, topic: topic ? topic.toJS() : '', qwiketid, description, image_src, request })
        const chainFetch = {
            type: 'new', // all/new
            storyId: root_threadid,
            rootId: topic.get("rootId"),
            nodes: item ? item.get("nodes") : {},
            channel: test ? 'test' : channel,
            targetId: 0,
            published_time: microtime(),

        };
        actions.saveQwiket(request, chain ? chainFetch : false);

        return { success: true }
    }
    publishComment() {
        let { updateOpenEditor, cancelRoute, qedit, columnType, topic, replyTopic, user, actions, channel, test, rootThreadid, setState, unfocusUrl, router } = this.props;
        this.saveComment({ publish: 1, chain: true });
        this.saveComment.flush();
        setTimeout(() => this.reset(), 200);
        setState({ edit: false });
        console.log("D17 calling updateOpenEditor")
        updateOpenEditor({ qwiketid: 0 });
        //Router.replace(cancelRoute);
		/*let { qedit, columnType, topic, replyTopic, online, actions, channel, test, rootThreadid, setState, unfocusUrl, router } = this.props;
		let username = online.get("username");
		//	const router = useRouter()
		let item = qedit ? topic : replyTopic;
		if (!item) {
			console.log("NO ITEM", { qedit, topic, replyTopic });
			return;
		}
		let qwiketid = item.get("threadid");
		let rootId = item.get("rootId") ? item.get("rootId") : "/";
		const fullunfocusUrl = `${unfocusUrl}/q/${qwiketid}`;
		let shortname = item.get("cat") ? item.get("cat") : username;
			const request = {
			type: 'new', // all/new
			storyId: rootThreadid,
			rootId: topic.get("rootId"),
			nodes: topic.get("nodes"),
			test,
			published_time: microtime(),
			channel: test ? 'test' : channel,

		};
		this.saveComment({ publish: 1, chainFetch: request });
		this.saveComment.flush();
		setTimeout(() => this.reset(), 200);
		setState({ edit: false, open: false });
		if (unfocusUrl) {
			//console.log("unfocusUrl:", { fullunfocusUrl })
			const href = `/context?threadid=${rootThreadid}`;
			//const as = `/learn/${id}/${view}`;
			router.replace(href, fullunfocusUrl, { shallow: false });
		}

		//	console.log("fetchComments", { request })
	
		return { success: true }
		*/
    }

    render() {
        let { updateOpenEditor, session, qedit, theme: muiTheme, isHovering1, topic, context, dq: isDq, stickie: isStickie, selected, globals, user, actions, rootThreadid, focusUrl, unfocusUrl, test, setState, dirty, level, replyTopic, columnType, channel, allowOpen } = this.props;
        let { dqHelpOpen, stickieHelpOpen, description, image_src, dropzone, body, site_name, author, title, dq, stickie, extraFields, tab, descrOpenMD, newSaved, uid } = this.state;
        let catIcon = user.get("avatar");
        let cat = user.get("username");
        let catName = user.get("user_name");
        let loadingDraft = context.get("loadingDraft");
        let published_time = (new Date()).getTime() / 1000 | 0;
        let shared_time = (new Date()).getTime() / 1000 | 0;
        let updated_time = (new Date()).getTime() / 1000 | 0;
        let avatar = catIcon;
        let item = qedit ? topic : replyTopic;
        let qwiketid = (!qedit && !item) ? `__new:${uid}` : item.get("qwiketid");
        if (!rootThreadid && qedit && level == 0) {
            console.log("FIXUP")
            rootThreadid = context.get("openEditor");
            qwiketid = rootThreadid
            item = Immutable.fromJS({
                threadid: rootThreadid,
                qwiketid: rootThreadid,
                reshare: 59,
                author: user.get("user_name"),
                username: user.get("username"),
                site_name: `${user.get("user_name")} on Qwiket`

            })
            author = user.get("user_name"),
                site_name = `${user.get("user_name")} on Qwiket`,
                stickie = true;
        }
        console.log("QwiketEditor render", { item: item ? item.toJS() : {}, topic: topic ? topic.toJS() : {}, qedit, replyTopic, qwiketid })
        let reshare = item ? item.get("reshare") : 0;
        let open = ((qwiketid == context.get("openEditor"))) && (level > 0 && selected || level == 0) ? true : false;
        let width = u.width(session);
        if (context.get("openEditor"))
            console.log("RENDER ", { selected, level, reshare, openEditor: context.get("openEditor"), qwiketid, open, allowOpen, qedit })
        //qedit = route.indexOf("qedit") >= 0 ? true : false;
        //let open = route.indexOf("qedit") >= 0 || route.indexOf("qreply") >= 0 ? true : false;
        let newTabUrl = qwiketid != rootThreadid ? `/context/channel/${channel}/topic/${qwiketid}` : null;
        let preview = Immutable.fromJS({
            qwiketid: 'preview',
            threadid: 'preview',
            title,
            description,
            body,
            image_src,
            reshare: 1,
            author,
            site_name,
            cat,
            catName,
            catIcon,
            published_time,
            publishedTime: published_time,
            shared_time,
            updated_time,
            site_name,
            columnType,
            channel
        });
        const edit = qedit;
        // const muiTheme = globals.get("muiTheme");
        const theme = +globals.get("dark") == 0 ? 1 : 0;
        const lapsed = "10 sec";
        const color = muiTheme.palette.text.primary;
        const backgroundColor = muiTheme.palette.background.default;
        const linkColor = theme == 1 ? red[900] : red[200];

        let loadingChildDraft = context.get("loadingChildDraft");
        //console.log("qedit1 ", { body });
        if (typeof body === "string" || body instanceof String)
            body = Immutable.fromJS({ blocks: [{ blockType: 'text', text: '' }] });
        if (stickie && !body) {
            body = Immutable.fromJS({ blocks: [{ blockType: 'text', text: '' }] })
        }
        //return <div /> 

        let deleteBlock = ({ blocks, index }) => {

        }
        let reorderBlocks = ({ blocks, dir, index }) => {
            let output = Immutable.fromJS([]);
            //console.log("reorder", { blocks, dir, index })
            blocks.forEach((block, i) => {
                //console.log("reorder loop", { i, block })
                if ((i < index - 1) || (i < index && dir > 0)) {
                    output = output.set(i, block);
                    //console.log('reorder 1', { i, output: output.toJS() })
                }
                else if ((i == index - 1) && dir < 0) {
                    output = output.set(i + 1, block);
                    //console.log('reorder 2', { i, output: output.toJS() })
                }
                else if ((i == index) && dir < 0) {
                    output = output.set(i - 1, block);
                    //console.log('reorder 3', { i, output: output.toJS() })
                }
                else if ((i == index) && dir > 0) {
                    output = output.set(i + 1, block);
                    //console.log('reorder 4', { i, output: output.toJS() })
                }
                else if ((i == index + 1) && dir > 0) {
                    output = output.set(i - 1, block);
                    //console.log('reorder 5', { i, output: output.toJS() })
                }
                else if ((i > index && dir < 0) || (i > index + 1 && dir > 0)) {
                    output = output.set(i, block);
                    //console.log('reorder 6', { i, output: output.toJS() })
                }
            })
            return output;
        }
        let BlockCountrols = ({ index, length, blocks, setStateNow }) => {
            return <div className="q-editor-blockcontrols-wrap">
                <div> <Tooltip title="Move Up"><IconButton disabled={index == 0} className="q-editor-icon" onClick={() => setStateNow({ body: body.set('blocks', reorderBlocks({ blocks, dir: -1, index })) })} variant="contained" ><ExpandLess /></IconButton></Tooltip></div >
                <div><Tooltip title="Delete"><IconButton onClick={() => setStateNow({ blocks: deletBlock({ blocks, index }) })} variant="contained" ><CancelIcon style={{ width: 16, height: 16 }} /></IconButton></Tooltip></div>
                <div><Tooltip title="Move Down"><IconButton disabled={index == length - 1} onClick={() => setStateNow({ body: body.set('blocks', reorderBlocks({ blocks, dir: 1, index })).set('sanity', 'check2') })} variant="contained"  ><ExpandMore /></IconButton></Tooltip></div>
                <style global jsx>{`
				.q-editor-icon{
					f
				}
				.q-editor-blockcontrols-wrap{
					display:flex;
					opacity:1.0;
					align-items:center;
				}
				`}</style>
            </div >

        }
        //	console.log("QEDIT", { dqHelpOpen, dropzone, lastBlockRef: this.lastBlockRef, open, body: body ? body.toJS() : {}, stickie, channel, defaultDescription, description, image_src, dirty, topic: topic ? topic.toJS() : '', replyTopic: replyTopic ? replyTopic.toJS() : '', columnType })
        if (loadingChildDraft && actions.fetchDraftChildQwiket)
            return <div>Checking for the existing draft...</div>
        let bodyHtml = [];

        let blocks = body ? body.get("blocks") : Immutable.fromJS([]);
        let openMDBlock = (index, value) => {
            this.setState({ body: body.set('blocks', blocks.set(index, blocks.get(index).set('openMD', value))) })
        }
        let getMDBlock = index => blocks.get(index).get('openMD');
        if (stickie) {
            blocks.forEach((block, index) => {
                const openMD = getMDBlock(index) ? true : false;
                const blockType = block.get("blockType");
                const dropCap = block.get("dropCap") ? true : false;
                //console.log("QEDIT block", blockType)
                let html = null;
                switch (blockType) {
                    case 'text':
                        const text = block.get("text");
                        //console.log("text block", { text })
                        //this.lastBlockRef = React.createRef();
                        html = <div key={"text-block-" + index} className="q-comment-text-wrap">
                            <FormControl className="q-comment-form-control">
                                <div className="q-text-block-title-line"><FormLabel className="q-comment-text-label">{index == 0 ? ` Below the fold ` : ` Additional text block`}</FormLabel>{false ? <BlockCountrols blocks={blocks} setStateNow={(update) => { this.setState(update) }} index={index} length={blocks.size} /> : <div />}</div>
                                <Textarea
                                    ref={(element) => { console.log("<><><><><>"); this.setLastBlockRef(element) }}
                                    //maxLength="300000"
                                    className="q-comment-text-input"
                                    value={text}
                                    //name={description}
                                    //placeholder={description}
                                    //name={stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}
                                    //placeholder={index == 0 ? ` Below the fold text block` : ` Text Block`}
                                    onChange={(event) => {
                                        //console.log("onChange 205", { dirty });
                                        let val = event.target.value;
                                        //	val = val.replace(/(\r\n|\n|\r)/gm, "\r\n\r\n");
                                        console.log("qedit setting block:", { index, val })
                                        blocks = blocks.set(index, block.set("text", val))
                                        //console.log("setting blocks:", { blocks: blocks.toJS() })

                                        body = body.set("blocks", blocks);
                                        console.log("qedit setting bodu:", { body: body.toJS() })

                                        this.setState({ body, dirty: 1 }, () => {
                                            //console.log("calling saveComment after setState");
                                            this.saveComment({ publish: 0 });
                                        })

                                    }}
                                />

                                <div className={openMD ? "q-edit-text-block-divider-open" : "q-edit-text-block-divider"}>{openMD ? <div style={{ width: 70, marginLeft: 4, marginRight: 12 }}><Tooltip title="CommonMark Cheat Sheet"><a href="https://commonmark.org/help/" target="_cm">Preview</a></Tooltip> </div> : <div style={{ width: 70, marginLeft: 4, marginRight: 12 }}><Tooltip title="CommonMark Cheat Sheet"><a href="https://commonmark.org/help/" target="_cm">Markdown</a></Tooltip></div>}
                                    {stickie ? <FormControlLabel
                                        classes={{ root: "q-edit-text-block-check-root", label: "q-edit-text-block-check-label" }}
                                        control={
                                            <Checkbox classes={{ root: "q-edit-text-block-check", checked: "q-edit-text-block-check-checked" }} checked={dropCap} onChange={() => this.setState({ body: body.set("blocks", blocks.set(index, block.set("dropCap", !dropCap))) }, () => {
                                                this.saveComment({ publish: 0 });
                                            })} value="checkedA" />
                                        }
                                        label="Drop Cap"
                                    /> : null}
                                    <div className="q-mdbar-buttons">
                                        <Tooltip title="Upload image">
                                            <Button className="q-comment-mdbar-image-button" onClick={() => { this.setState({ dropzone: true, dropzoneType: 'textblock', index }) }} aria-label="Image" color="primary">

                                                <ImageIcon style={{ height: 20, width: 20 }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Preview">
                                            <IconButton onClick={() => this.setState({ body: body.set("blocks", blocks.set(index, block.set("openMD", !openMD))) })}>
                                                <img style={{ width: 32, height: 32 }} src="/static/css/md.png" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                                {openMD ? <div className="q-edit-text-preview"> {renderMarkdown({ blockType: 'text', dataId: 'text-block', md: text, index, theme, reshare: 109, linkColor, dropCap, state: this.state, setState: (update) => this.setState(update) })}</div> : null}
                            </FormControl>
                            {
                                false ? <FormControl className="q-comment-form-control">
                                    <InputLabel className="q-comment-text-label" htmlFor={`outlined-dense-multiline-${index}`}>{index == 0 ? ` Below the fold text block` : ` Text Block`}</InputLabel>
                                    <OutlinedInput
                                        id={`outlined-dense-multiline-${index}`}
                                        //placeholder="Reply Qwiket"
                                        //className="q-comment-text-input"
                                        autoFocus={level > 0}
                                        onChange={(event) => {
                                            console.log("qedit setting block:", { index, val: event.target.value })
                                            blocks = blocks.set(index, block.set("text", event.target.value))
                                            console.log("setting blocs:", { blocks: blocks.toJS() })

                                            body = body.set("blocks", blocks);
                                            console.log("qedit setting bodu:", { body: body.toJS() })

                                            this.setState({ body }, () => {
                                                this.saveComment({ publish: 0 });
                                            })

                                        }}


                                        margin="dense"
                                        variant="outlined"
                                        notched={true}
                                        multiline
                                        value={text}
                                        rowsMax={40}
                                        classes={{ root: 'q-comment-text-input', focused: 'q-comment-text-input-focused', notchedOutline: 'q-comment-text-input-focused' }}
                                    />
                                    {text ? <FormHelperText className="q-qwiket-form-help">Markdown Text Block</FormHelperText> : null}
                                </FormControl> : null
                            }
                        </div >
                        break;
                    case 'rich-link':
                        break;
                    case 'image':
                        break;
                    case 'quote':
                        break;
                    case 'code':
                        break;
                    case 'toc':
                        break;
                    case 'chapter':
                        break;
                    case 'sub-chapter':
                        break;
                }
                bodyHtml.push(html);
            })
            bodyHtml = <div className="q-qwiket-stickie-blocks">{bodyHtml}</div>
        }
        let addBlock = null;
        if (stickie) {
            addBlock = (<div className="q-qwiket-add-block-wrap">
                {false ? <FormControl style={{ minWidth: 80 }}>
                    <InputLabel htmlFor="add-select" className="q-qwiket-add-block-label" >+ Add Block</InputLabel>
                    <Select
                        value={''}
                        style={{ minWidth: 180 }}
                        onChange={(event) => {
                            if (!body)
                                body = Immutable.fromJS({});
                            let blocks = body.get("blocks");
                            if (!blocks) {
                                blocks = new Immutable.List();
                            }
                            blocks = blocks.push(Immutable.fromJS({ blockType: event.target.value }))
                            body = body.set("blocks", blocks);
                            setTimeout(() => {
                                //if (this.lastBlockRef) {
                                console.log("setting focus on", this.lastBlockRef);
                                this.focusTextInput();
                                //}
                            }, 500)
                            console.log("qedit set body 11")
                            this.setState({ body });

                        }}
                        inputProps={{
                            name: 'blockAdd',
                            id: 'add-select',
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"text"}>MD Text</MenuItem>
                        <MenuItem value={"image"}>Image</MenuItem>
                        <MenuItem value={"quote"}>Pull Quote</MenuItem>
                        <MenuItem value={"rich-link"}>Embedded Link / Post</MenuItem>

                    </Select>
                </FormControl> : null}
                <Button className="q-meta-extrafields" onClick={() => this.setState({ extraFields: !extraFields })}>Extra Meta Fields {extraFields ? <ExpandLess /> : <ExpandMore />}</Button>
            </div>);
        }
        console.log("Qwikie Editor render done", { open, description, stickie });
        let qEditor = <Paper elevation={!stickie ? 4 : 4} className={(edit || description || open || stickie) ? stickie ? width > 750 ? "q-comment-outer-wrap-stickie" : "q-comment-outer-wrap-stickie-small" : "q-comment-outer-wrap" : "q-comment-outer-wrap-quiet"}>
            <div className="q-edit-cancel"><IconButton onClick={() => {
                setState({ edit: false }); updateOpenEditor({ qwiketid: 0 });//this.setState({ open: false })
            }} variant="contained" color="secondary" style={{ marginLeft: 10, float: 'right' }}>
                <CancelIcon fontSize={"small"} />
            </IconButton></div>
            <DropzonePrompt open={dropzone} onClose={(ret, rsp) => {
                const dropzoneType = this.state.dropzoneType;
                const src = rsp ? rsp.src : '';
                var s = { dropzone: false };
                if (dropzoneType == 'mainimage') {
                    console.log("dropzone mainImage", { src })
                    var image_src = src;
                    s.image_src = image_src;
                }
                else if (dropzoneType == 'description') {
                    if (src)
                        s.description = `${description ? description : ''}![](${src})`;
                }
                else if (dropzoneType == 'textblock') {
                    const index = this.state.index;
                    if (src)
                        s.body = body.set('blocks', blocks.set(index, blocks.get(index).set('text', `${blocks.get(index).get('text') ? blocks.get(index).get('text') : ''}![](${src})`)))

                }
                //	console.log("dropzone Setting image:", { s, dropzoneType, src })
                this.setState(s, () => {
                    this.saveComment({ publish: 0 });
                    setState({ dropzone: false, dropzoneType: false });
                })

            }}
				/*onSave={(files => {
					var req = request.post('/upload');
					let src = '';
					let random = randomstring(7);
					console.log("random:", random)
					files.forEach((file) => {
						src = random + file.name;
						req.attach(src, file);
					});
					this.setState({ masked: true })
					req.end((v) => {
						console.log("req.end ", src);
						this.setState({ image_src: '/cdn/uploads/' + src });
					});
				}
				)}*/
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                maxFileSize={5000000}
                showPreviews={true}
                showPreviewsInDropzone={true}
                filesLimit={1}
                showAlerts={false}
                dropzoneParagraphClass="q-comment-dropzone-text"
                dropzoneText="Drag or click to upload"
            />
            {loadingDraft ? <LinearProgress variant="query" /> : null}

            {
                stickie ? <Tabs
                    className="q-editor-tabs"
                    value={tab}
                    onChange={(e, v) => this.setState({ tab: v })}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                > <Tab label={stickie ? <div className="q-comment-editor-stickie-heading">Stickie Writer</div> : <div className="q-comment-editor-stickie-heading">Qwiket</div>} />
                    <Tab label="Preview" />
                </Tabs> : null
            }
            {
                tab == 0 ? <div className="q-comment-text-wrap">

                    <div className="q-comment-text-wrap">

                        {stickie ? <div className="q-qwiket-stickie-fields-wrap">
                            <FormControl className="q-comment-form-control" error={!title || title.length < 3}>
                                <FormLabel className="q-comment-text-label">Title</FormLabel>
                                <Textarea
                                    maxLength="255"
                                    className="q-comment-text-input-default"
                                    id="q-comment-description"
                                    value={title}
                                    autofocus={true}
                                    //name={description}
                                    //placeholder={description}
                                    //name={stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}
                                    //placeholder={index == 0 ? ` Below the fold text block` : ` Text Block`}
                                    onChange={(event) => {
                                        console.log("onChange title", { dirty });
                                        if (!qedit) {
                                            if (event.target.value && !dirty)
                                                setState({ dirty: true })
                                            else if (!event.target.value && dirty) {
                                                //console.log("calling setState",{dirty})
                                                setState({ dirty: false })
                                            }
                                        }
                                        this.setState({ title: event.target.value, dirty: true }, () => {
                                            this.saveComment({ publish: 0 });
                                        })

                                    }}


                                />
                                <FormHelperText className="q-qwiket-form-help">Good title is important. It drives the Search Engine Optimization.</FormHelperText>
                            </FormControl>
                        </div> : null
                        }
                        {image_src ? <div className="q-comment-main-image-container"><img onClick={() => this.setState({ dropzone: true, dropzoneType: 'mainimage' })} className="q-comment-main-image" src={image_src} /> </div> : stickie ? <Button className="q-comment-image-button" onClick={() => { this.setState({ dropzone: true, dropzoneType: 'mainimage' }) }} aria-label="Image" color="primary">

                            <ImageIcon style={{ height: 28, width: 28 }} />
                        </Button> : null}
                        {stickie ? <FormControl className="q-comment-form-control">
                            <FormLabel className="q-comment-text-label">Main Image</FormLabel>
                            <Textarea
                                maxLength="255"
                                className="q-comment-text-input"
                                value={image_src}
                                //autofocus={level > 0}
                                //name={description}
                                placeholder={"Enter the image URL for your Qwiket"}
                                //name={stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}
                                //placeholder={index == 0 ? ` Below the fold text block` : ` Text Block`}
                                onClick={() => this.setState({ dropzone: true, dropzoneType: 'mainimage' })}
                                onChange={(event) => {
                                    console.log("onChange title", { dirty });

                                    this.setState({ image_src: event.target.value, dirty: true }, () => {
                                        this.saveComment({ publish: 0 });
                                    })

                                }}


                            />
                            <FormHelperText className="q-qwiket-form-help">The main image is displayed when sharing the qwiket</FormHelperText>
                        </FormControl> : null}
                        <FormControl className={stickie ? "q-comment-form-control-stickie" : "q-comment-form-control"} error={!description || stickie && description.length < 3}>
                            {stickie ? <FormLabel className="q-comment-text-label">{stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}</FormLabel> : null}
                            {loadingDraft ? <LinearProgress variant="query" /> : null}

                            <Textarea
                                maxLength="3000"
                                className="q-comment-text-input-default"

                                //disabled={channel == 'qwiket'}
                                value={loadingDraft ? 'loading...' : description}
                                //name={description}       %%%%%%%%%%%%%%%%%%%%%%%%%%
                                //placeholder={description}
                                name={stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}
                                //placeholder={channel == 'qwiket1' ? "Coming Soon!" : stickie ? 'Lede text block (description)' : edit ? loadingDraft ? 'Loading, please wait...' : `Edit` : level == 0 ? ` React!` : ` Reply`}
                                data-id="qd"
                                id="editor-default"
                                onClick={() => {
                                    //console.log("descript", { description }); 
                                    if (!dirty)
                                        setState({ dirty: true })

                                    if (!open) {

                                        console.log("x updateOpenEditor1", qwiketid); updateOpenEditor({ qwiketid });//Router.replace(replyRoute);//this.setState({ open: true })
                                    }
                                }}
                                onChange={(event) => {
                                    let value = event.target.value
                                    console.log("onChange 1205", { dirty, value });

                                    if (!qedit) {
                                        if (event.target.value && !dirty)
                                            setState({ dirty: true })
                                        else if (!event.target.value && dirty) {
                                            //console.log("calling setState",{dirty})
                                            setState({ dirty: false })
                                        }
                                    }
                                    this.setState({
                                        description: value, dirty: true
                                    }, () => {
                                        this.saveComment({ publish: 0 });
                                    })

                                }}
                            />
                            {loadingDraft ? <LinearProgress variant="query" /> : null}

                            {open ? <div className={descrOpenMD ? "q-edit-text-block-divider-open" : "q-edit-text-block-divider"}>{descrOpenMD ?
                                <div style={{ marginLeft: 4, marginRight: 12, fontSize: '0.8rem' }}>
                                    <Tooltip title="CommonMark Spec">
                                        <a href="https://commonmark.org/help/" target="_cm">Preview</a>
                                    </Tooltip>
                                </div> :
                                stickie ?
                                    <div style={{ width: 70, marginLeft: 4, marginRight: 12, fontSize: '0.8rem' }}>
                                        <Tooltip title="CommonMark Cheat Sheet">
                                            <a href="https://commonmark.org/help/" target="_cm">Markdown</a>
                                        </Tooltip>
                                    </div> :
                                    !description ?
                                        <div />
                                        : <div style={{ width: 70, marginLeft: 4, marginRight: 12, fontSize: '0.8rem' }}>
                                            <Tooltip title="CommonMark Cheat Sheet">
                                                <a href="https://commonmark.org/help/" target="_cm">Markdown</a>
                                            </Tooltip>
                                        </div>}

                                {stickie ? <FormControlLabel
                                    classes={{ root: "q-edit-text-block-check-root", label: "q-edit-text-block-check-label" }}
                                    control={
                                        <Checkbox classes={{ root: "q-edit-text-block-check", checked: "q-edit-text-block-check-checked" }} checked={body.get("descrDropCap") ? true : false} onChange={() => this.setState({ body: body.set("descrDropCap", body.get("descrDropCap") ? false : true) }, () => {
                                            this.saveComment({ publish: 0 });
                                        })} value="checkedA" />
                                    }
                                    label="Drop Cap"
                                /> : null}
                                <div className="q-mdbar-buttons">
                                    {!stickie ? <Tooltip title="Upload image">
                                        <Button className="q-comment-mdbar-image-button" onClick={() => { this.setState({ dropzone: true, dropzoneType: 'description' }) }} aria-label="Image" color="primary">

                                            <ImageIcon style={{ height: 20, width: 20 }} />
                                        </Button>
                                    </Tooltip> : <div style={{ width: 48 }} />}
                                    <Tooltip title="Preview">
                                        <IconButton onClick={() => this.setState({ descrOpenMD: !descrOpenMD })}>
                                            <img style={{ width: 32, height: 32 }} src="/static/css/md.png" />
                                        </IconButton>
                                    </Tooltip>
                                </div>

                            </div> : null}

                            {description && descrOpenMD ? <div className="q-edit-text-preview"> {renderMarkdown({ blockType: 'text', dataId: 'text-description', md: description, index: 0, theme, reshare: 109, linkColor, dropCap: stickie && body.get("descrDropCap") ? true : false, state: this.state, setState: (update) => this.setState(update) })}</div> : null}

                        </FormControl>



                    </div>
                    {bodyHtml}
                    {addBlock}
                    {stickie ? <div className="q-comment-text-wrap">

                        <Collapse in={extraFields} timeout="auto" unmountOnExit>

                            <FormControl className="q-comment-form-control">
                                <FormLabel className="q-comment-text-label">Author</FormLabel>
                                <Textarea
                                    maxLength="255"
                                    className="q-comment-text-input"
                                    value={author}
                                    //autofocus={level > 0}
                                    onChange={(event) => {
                                        this.setState({ author: event.target.value, dirty: true }, () => {
                                            this.saveComment({ publish: 0 });
                                        })
                                    }}
                                />
                                <FormHelperText className="q-qwiket-form-help">Important for SEO and sharing.</FormHelperText>
                            </FormControl>
                            {false ? <FormControl className="q-comment-form-control-stickie">
                                <InputLabel className="q-comment-text-label" htmlFor="q-stickie-author">Author</InputLabel>
                                <OutlinedInput
                                    id="q-stickie-author"
                                    //placeholder="Reply Qwiket"
                                    //className="q-comment-text-input"
                                    //autoFocus={level > 0}
                                    onChange={(event) => {
                                        //console.log("onChange 205", { dirty });
										/*$$$if (!qedit) {
											if (event.target.value && !dirty)
												setState({ dirty: true })
											else if (!event.target.value && dirty) {
												//console.log("calling setState",{dirty})
												setState({ dirty: false })
											}
										}*/
                                        this.setState({ author: event.target.value, dirty: true }, () => {
                                            this.saveComment({ publish: 0 });
                                        })

                                    }}


                                    margin="dense"
                                    variant="outlined"
                                    notched={true}

                                    value={author}
                                    rowsMax={2}
                                    classes={{ root: 'q-comment-text-input', focused: 'q-comment-text-input-focused', notchedOutline: 'q-comment-text-input-focused' }}
                                />
                                <FormHelperText className="q-qwiket-form-help">Author meta field. Important for SEO and sharing.</FormHelperText>
                            </FormControl> : null}
                            <FormControl className="q-comment-form-control">
                                <FormLabel className="q-comment-text-label">Copyright</FormLabel>
                                <Textarea
                                    maxLength="255"
                                    className="q-comment-text-input"
                                    value={site_name}
                                    //autofocus={level > 0}
                                    onChange={(event) => {
                                        this.setState({ site_name: event.target.value, dirty: true }, () => {
                                            this.saveComment({ publish: 0 });
                                        })
                                    }}
                                />
                                <FormHelperText className="q-qwiket-form-help">Enter the site name meta field ( copyright) for your Qwiket.</FormHelperText>
                            </FormControl>
                            {false ? <FormControl className="q-comment-form-control-stickie">
                                <InputLabel className="q-comment-text-label" htmlFor="q-stickie-site_name">Copyright</InputLabel>
                                <OutlinedInput
                                    id="q-stickie-site_name"
                                    //placeholder="Reply Qwiket"
                                    //className="q-comment-text-input"
                                    //autoFocus={level > 0}
                                    onChange={(event) => {
                                        //console.log("onChange 205", { dirty });
										/*$$$if (!qedit) {
											if (event.target.value && !dirty)
												setState({ dirty: true })
											else if (!event.target.value && dirty) {
												//console.log("calling setState",{dirty})
												setState({ dirty: false })
											}
										} */
                                        this.setState({ site_name: event.target.value, dirty: true }, () => {
                                            this.saveComment({ publish: 0 });
                                        })

                                    }}


                                    margin="dense"
                                    variant="outlined"
                                    notched={true}

                                    value={site_name}
                                    rowsMax={2}
                                    classes={{ root: 'q-comment-text-input', focused: 'q-comment-text-input-focused', notchedOutline: 'q-comment-text-input-focused' }}
                                />
                                <FormHelperText className="q-qwiket-form-help">Enter the site name ( copyright) for your Qwiket.</FormHelperText>
                            </FormControl> : null}
                        </Collapse>
                    </div> : null}
                    {stickie && newTabUrl ? <div className="q-edit-new-tab"><Link route={newTabUrl}>Edit in own context</Link></div> : null}

                    {!loadingDraft && (description || open || stickie) ?


                        <div className="q-comment-controls">

                            <div className="q-comment-controls-row">

                                <div className={stickie ? "q-comment-toggles-stickie" : "q-comment-toggles"}>

                                    {!stickie ? <div className="q-comment-dq-wrap">
                                        <Tooltip title="Direct Qwiket: reply target + mentions only">
                                            <FormControlLabel
                                                classes={{ label: "q-comment-dq-label" }}
                                                control={
                                                    <Switch
                                                        size="small"
                                                        checked={dq}
                                                        onChange={() => {
                                                            this.setState({ dq: !dq }, () => {
                                                                this.saveComment({ publish: 0 });
                                                            })
                                                        }}
                                                        value="checkedB"
                                                        color="primary"
                                                        className="q-comment-dq-switch1"
                                                        classes={{ colorPrimary: 'q-comment-dq-switch1', checked: 'selected', bar: 'selected' }}
                                                    />
                                                }
                                                label={<span className="q-comment-dq-wrap">DQ</span>}
                                            />
                                        </Tooltip>
                                        <ReactHoverObserver data-id="p904">
                                            {({ isHovering }) => (
                                                <IconButton
                                                    className="q-comment-dq-help"
                                                    style={{ opacity: isHovering ? 1.0 : 0.7 }}
                                                    buttonRef={node => {
                                                        this.dqHelpAnchorEl = node;
                                                    }}
                                                    aria-controls="menu-list-grow"
                                                    aria-haspopup="true"
                                                    onClick={() => {
                                                        console.log("dqHelpOpen Icon click", { level });
                                                        this.setState({ dqHelpOpen: true })
                                                    }} edge="end" aria-label="Open Help">
                                                    <Help className="q-comment-dq-help-icon" />
                                                </IconButton>
                                            )}
                                        </ReactHoverObserver>
                                    </div> : null}
                                    <Popper className="q-comment-popper" open={dqHelpOpen} anchorEl={this.dqHelpOpen} transition disablePortal>
                                        {({ TransitionProps, placement }) => (
                                            <Grow
                                                {...TransitionProps}
                                                id="menu-list-grow"
                                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                            >
                                                <ClickAwayListener onClickAway={() => {

                                                    this.setState({ dqHelpOpen: false });
                                                }}>
                                                    <HelpBox title={"DQ: A Direct Qwiket"} text={<p>DQ is a private Qwiket, visible only to the intended recepient (author of the replied to post, for example) and mentions (@name user names).</p>} />

                                                </ClickAwayListener>

                                            </Grow>
                                        )}
                                    </Popper>
                                    {!dq ? <div className="q-comment-dq-wrap">
                                        <Tooltip title="Sticky Qwiket: Long-From Qwiket with its own comments">
                                            <FormControlLabel
                                                classes={{ label: "q-comment-dq-label" }}
                                                control={
                                                    <Switch
                                                        size="small"
                                                        checked={stickie}
                                                        onChange={() => {
                                                            console.log("toggle stickie", { stickie })
                                                            this.setState({ stickie: !stickie }, () => {
                                                                this.saveComment({ publish: 0 });
                                                            })
                                                        }}
                                                        value="checkedB"
                                                        color="primary"
                                                        className="q-comment-dq-switch1"
                                                        classes={{ colorPrimary: 'q-comment-dq-switch1' }}
                                                    />
                                                }
                                                label={<span className="q-comment-dq-wrap">STICKIE</span>}
                                            />
                                        </Tooltip>
                                        <ReactHoverObserver data-id="p905">
                                            {({ isHovering }) => (
                                                <IconButton
                                                    className="q-comment-dq-help"
                                                    style={{ opacity: isHovering ? 1.0 : 0.7 }}
                                                    buttonRef={node => {
                                                        this.stickieHelpAnchorEl = node;
                                                    }}
                                                    aria-controls="menu-list-grow3"
                                                    aria-haspopup="true"
                                                    onClick={() => {
                                                        //console.log("Icon click", { level });
                                                        this.setState({ stickieHelpOpen: true })
                                                    }} edge="end" aria-label="Open Help">
                                                    <Help className="q-comment-dq-help-icon" />
                                                </IconButton>
                                            )}
                                        </ReactHoverObserver>
                                        <Popper className="q-comment-popper" open={stickieHelpOpen} anchorEl={this.stickieHelpAnchorEl} transition disablePortal>
                                            {({ TransitionProps, placement }) => (
                                                <Grow
                                                    {...TransitionProps}
                                                    id="menu-list-grow3"
                                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                                >
                                                    <ClickAwayListener onClickAway={() => this.setState({ stickieHelpOpen: false })}>
                                                        <HelpBox title={"Stickie: A Sticky Qwiket"} text={<div><p>Stickie is a long-form Qwiket that has its own comments.</p> <p>Stickies serve as Qwiket-hosted and published articles.</p></div>} />
                                                    </ClickAwayListener>
                                                </Grow>
                                            )}
                                        </Popper>

                                    </div> : null}

                                </div>
                                {stickie ? <div className="q-comment-send-button-container"><Tooltip title="Publish Reply">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!description || stickie && description.length < 3 || !(title && title.length >= 3)}
                                        //disabled={!newSaved && qwiketid == '__new'}
                                        classes={{ root: "q-comment-send-button-in", disabled: "q-comment-send-button-disabled" }}
                                        onClick={() => {
                                            console.log("CLICK SEND")
                                            this.publishComment.bind(this)();
                                        }}
                                    >
                                        <SendIcon style={{ height: 22, width: 22 }} />
                                    </Button>
                                </Tooltip> </div> : null}

                            </div>
                            {!stickie ? <Tooltip title="Publish Reply">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={!description}

                                    //disabled={!newSaved && qwiketid == '__new'}
                                    classes={{ root: "q-comment-send-button", disabled: "q-comment-send-button-disabled" }}
                                    onClick={() => {
                                        console.log("CLICK SEND")
                                        this.publishComment.bind(this)();
                                    }}
                                >
                                    <SendIcon style={{ height: 22, width: 22 }} />
                                </Button>
                            </Tooltip> : null}
                        </div>
                        : null}
                </div> : null
            }
            {
                tab == 1 ? <div className="q-qwiket-preview">

                    <div data-id="w111" style={{ width: '100%', cursor: 'pointer0', display: 'flex' }}>
                        {false ? <img style={{ maxWidth: '20%', maxHeight: 36, marginTop: 10, marginLeft: 0, paddingTop: 0, marginRight: 6 }} src={avatar} /> : null}
                        <div data-id="P921" style={{ marginTop: 10, maxWidth: '100%' }}>

                            <div data-id="p931" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 0, marginBottom: 10 }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <div data-id="tr11" style={{ fontWeight: 400, fontSize: '1.3rem' }}>{author || cat}</div>


                                    <div className="q-qwiket-copyright">{site_name ? <span>&copy;&nbsp;</span> : ''}{site_name}</div>
                                    {site_name ? <Bullet style={{ opacity: 0.5 }} /> : null}
                                    <div >{lapsed}</div>

                                </div>

                            </div>
                            <QwiketRenderer
                                setLong={(val) => actions.updateOnlineState({ long: val }, true)}
                                long={user.get("long")}
                                type="full"
                                topic={preview}

                                channel={channel}
                                globals={globals}
                                state={this.state}
                                setState={(update) => this.setState(update)}
                                approver={false}
                                zoom={'out'}
                                loud={true}
                                onClick={() => {
                                    console.log("TWOCLICK")
                                    //if (type == 'full')
                                    //	return;
                                    //Router.replace(focusUrl, focusUrl, { shallow: true })
                                }}
                                link={null}
                            />
                        </div>
                    </div>
                </div>
                    : null
            }
        </Paper >
        console.log("!!!")
        return (

            <form data-id="qwiket-form" style={{ maxWidth: width > 750 ? 468 : '100%' }}><ClickWalledGarden placeHolder={
                (
                    <div>
                        <FormControl className="q-comment-form-control">
                            <Textarea
                                maxLength="255"
                                className="q-comment-text-input"
                                value={"React!"}

                            //autofocus={level > 0}
                            //name={description}
                            //placeholder={description}
                            //name={stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}
                            //placeholder={index == 0 ? ` Below the fold text block` : ` Text Block`}



                            />
                            <FormHelperText className="q-qwiket-form-help">You need to login in order to Qwiket. Click here to login.</FormHelperText>
                        </FormControl>
                    </div>

                )}>
                {open && (allowOpen || level == 0 || qedit) ? <div ><div className={width > 750 ? "q-editor-container" : "q-editor-container-small"}>{qEditor}</div></div> :
                    !allowOpen && false ? <div style={{ marginTop: 20, marginBottom: 20 }}>
                        <Link route={level > 0 ? focusUrl : unfocusUrl}>
                            <Textarea
                                ref={(element) => { console.log("<><><><><>"); this.setLastBlockRef(element) }}

                                maxLength="3000"
                                className="q-comment-text-input-default"
                                //disabled={channel == 'qwiket'}
                                value={description}
                                id="ta1"
                                //name={description}       %%%%%%%%%%%%%%%%%%%%%%%%%%
                                //placeholder={description}
                                name={stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? `React11!` : ` Reply`}
                                //placeholder={channel == 'qwiket1' ? "Coming Soon!" : stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}
                                onClick={(e) => {
                                    //e.preventDefault();
                                    //console.log("descript", { description }); 
                                    //Router.replace(focusUrl, focusUrl, { shallow: true })
                                    console.log("onClick", dirty)
                                    if (!dirty)
                                        setState({ dirty: true })

                                    if (!open) {

                                        console.log("x updateOpenEditor2", qwiketid); updateOpenEditor({ qwiketid });//Router.replace(replyRoute);//this.setState({ open: true })
                                    }
                                    //	e.stopPropagation();

                                }}
                                onKeyPress={(e) => {
                                    console.log("onKey", dirty)
                                    if (!dirty)
                                        setState({ dirty: true })

                                    if (!open) {

                                        console.log("x updateOpenEditor3", qwiketid); updateOpenEditor({ qwiketid });//this.setState({ open: true })
                                    }

                                }}
                                onChange={(event) => {
                                    let value = event.target.value
                                    console.log("onChange 205", { dirty, value });

                                    if (!qedit) {
                                        if (event.target.value && !dirty)
                                            setState({ dirty: true })
                                        else if (!event.target.value && dirty) {
                                            //console.log("calling setState",{dirty})
                                            setState({ dirty: false })
                                        }
                                    }
                                    this.setState({
                                        description: value, dirty: true
                                    }, () => {
                                        this.saveComment({ publish: 0 });
                                    })

                                }}
                            /></Link></div> : null} {!open ? <Link route={level > 0 ? focusUrl : unfocusUrl}><div style={{ marginLeft: level == 0 ? 0 : 10, marginTop: width < 750 ? 4 : 10, marginBottom: width < 750 ? 4 : 10, display: 'flex', alignItems: 'center' }}>{qedit ? null : <img style={{ maxWidth: '20%', maxHeight: 36, marginLeft: 0, paddingTop: 0, marginRight: 6 }} src={avatar} />} <Textarea
                                style={{ maxWidth: 368 - 36 }}
                                maxLength="3000"
                                ref={this.setLastBlockRef}

                                className={level == 0 ? "q-comment-text-input0" : "q-comment-text-input"}
                                //disabled={channel == 'qwiket'}
                                value={description}
                                id="ta2"
                                //name={description}       %%%%%%%%%%%%%%%%%%%%%%%%%%
                                //placeholder={description}
                                name={stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}
                                placeholder={channel == 'qwiket1' ? "Coming Soon!" : stickie ? 'Lede text block (description)' : edit ? `Edit` : level == 0 ? ` React!` : ` Reply`}
                                onClick={() => {
                                    console.log("descript onClick", { description, open, dirty });
									/*setTimeout(() => {
										let textArea = $(level == 0 ? '.q-comment-text-input-default' : '.q-comment-text-input');
										console.log("textArea111", { textArea })
										var data = textArea.val();
										textArea.focus().val('').val(data);
									}, 10);*/
                                    if (!dirty)
                                        setState({ dirty: true })

                                    if (!open) {
                                        console.log("onClick1 open:", open)

                                        updateOpenEditor({ qwiketid });//this.setState({ open: true })
                                    }
                                }}
                                onKeyPress={(e) => {
                                    console.log("onKey", dirty)
                                    if (!dirty)
                                        setState({ dirty: true })

                                    if (!open) {
                                        console.log("x updateOpenEditor4", qwiketid);

                                        updateOpenEditor({ qwiketid });//this.setState({ open: true })
                                    }

                                }}
                                onChange={(event) => {
                                    let value = event.target.value
                                    console.log("onChange 2051", { dirty, value });

                                    if (!qedit) {
                                        if (event.target.value && !dirty)
                                            setState({ dirty: true })
                                        else if (!event.target.value && dirty) {
                                            //console.log("calling setState",{dirty})
                                            setState({ dirty: false })
                                        }
                                    }
                                    this.setState({
                                        description: value, dirty: true
                                    }, () => {
                                        this.saveComment({ publish: 0 });
                                    })

                                }}
                            /></div></Link> : null}
            </ClickWalledGarden>
                <style global jsx>{`
				
				.q-editor-container{
					//position:absolute;
					z-index:99;
					//max-width:448px;
					//width:90%;
					margin-top:10px;
					//left: -2%;
					//right: -2%;
					margin-left:20px;
					margin-right:auto;
					display:flex;
					justify-content:flex-end;
				}
				.q-editor-container-small{
					//position:absolute;
					z-index:99;
					//max-width:448px;
					//width:90%;
					margin-top:10px;
					//left: -2%;
					//right: -2%;
					margin-left:auto
					margin-right:auto;
					display:flex;
					justify-content:center;
				}
				.q-comment-send-button-container{
					width:100%;
					display:flex;
					justify-content:flex-end;
				}
				.q-edit-new-tab{
					margin-left:auto;
					margin-right:auto;
					margin-bottom:20px;
					margin-top:0px;
					font-size:1.1rem;
					text-align:center;
					text-decoration:underline !important;
				}
				.q-mdbar-buttons{
					display:flex;
					width:120px;
					justify-content:flex-end;
				}
				.q-edit-text-block-check{
					height:12px !important;
					color:white !important;
					font-size:1.0rem;
				}
				.q-edit-text-block-check-root{} 
					height:10px !important;
					color:white !important;
					font-size:0.8rem;
				}
				.q-edit-text-block-check-label{
					font-size:1.0rem !important;
					color:white !important;
				}
				.q-edit-text-block-check-checked{
					height:12px !important;
					color:white !important;
				}
				.q-edit-text-preview{
					padding-left:6px;
					padding-right:6px;
					border:thin grey solid;
					margin-bottom:6px;
					border-radius:3px;
				}
				.q-edit-text-block-divider{
					height:20px;
					margin-top:6px;
					margin-bottom:6px;
					
					border-left:thin grey solid;
					border-right:thin grey solid;
					background-color:${blue[200]};
					color:white;
					display:flex;
					justify-content:space-between;
					align-items:center; 
					font-size:1.0rem; 
					border-radius:3px;

				}
				.q-edit-text-block-divider-open{ 
					height:20px;
					margin-top:6px;
					margin-bottom:6px;
					border-radius:3px; 
					border-left:thin grey solid;
					border-right:thin grey solid;
					background-color:${green[200]}; 
					color:white;
					display:flex;
					justify-content:space-between;
					align-items:center;
					font-size:1.0rem; 
				}
				.q-text-block-title-line{
					display:flex;
					justify-content:space-between;
					align-items:flex-end;
				}
				.q-editor-tabs{
					margin-left:10px;
				}
				.q-comment-main-image-container{
					display:flex;
					justify-content:center;
				}
				.q-qwiket-preview{
					margin:10px;
					padding:10px;
					max-width:448px;
				
				}
				.q-comment-image-button{ 
					padding-left:0px;
					margin-left:-10px;
				} 
				.q-comment-mdbar-image-button{ 
					width:24px;
					
				}
				.q-edit-cancel{
					width:100%;
					//position:absolute;
					z-index:100;
					height:24px;
					margin-top:-20px; 
				}
				#menu-blockAdd li{
					font-size:1.1rem !important;
				}
				.q-meta-extrafields{
					padding-top:20px !important;
					font-size:1.1rem !important;
				}
				.q-qwiket-add-block-label{
					margin-top:-0px !important;
					font-weight:500 !important;
					color:${color} !important;
					margin-bottom: 40px !important;
					font-size:1.1rem !important;
				}
				.q-qwiket-add-block-wrap{
					width:100%;
					margin-left:4px;
					display:flex;
				
					justify-content:space-between;
					align-items:flex-start;
					margin-bottom:0px;
				}
				.q-qwiket-stickie-fields-wrap{
					width:100%;
				}
				.q-qwiket-stickie-blocks{ 
					width:100%;
				}
				.q-comment-form-control{
					width:100%;
				
				}
				.q-comment-form-control-stickie{
					width:100%;
					margin-top:30px;
					margin-bottom:20px;
				
					
				}
				.q-comment-editor-stickie-heading{
					margin-left:6px;
					font-weight:500;
					font-size:1.2rem;
				}
				.q-qwiket-form-help{
					font-size:0.8rem !important;
					margin-bottom:10px; 
				}
					.q-comment-toggles{
						display:flex;
						flex-wrap:wrap;
						align-items:center;
						justify-content:space-between;	
						width:100%;
						border:thin ${blue[600]} solid;
						border-radius:6px;
						padding:4px;
						font-size:0.8rem !important;
						//height:26px;
					
					
					}
				.q-comment-toggles-stickie{
						display:flex;
						flex-wrap:wrap;
						align-items:center;
						justify-content:space-between;
						width:100%;
						border:thin ${blue[600]} solid;
						border-radius:6px;
						padding:4px;
						font-size:0.8rem !important;
						height:26px;
					}
					.q-comment-dq-wrap{
						display:flex;
						font-size:0.8rem !important;
						height:16px;
					

					}
					.q-comment-dq-switch{
						color:${grey[300]};
						font-size:0.8rem !important;
					
						height:16px;
					}
					.q-comment-dq-help{
						margin-left:-16px;
						height:26px;
						width:26px;
					
					}
					.q-comment-dq-help-icon{
						margin-top:-16px;
						width:16px;
						height:16px;
					}
					.q-comment-dq-label{
						font-size:1.0rem !important;
						color:${blue[600]};
						font-weight:500;
						height:16px;
					
					}
					.q-comment-dq-switch.selected{
						color:${blue[600]};
						height:16px;
						font-size:0.8rem !important;
						
					}
					.q-comment-send-button{
						color:#fff; 
						opacity:1.0;
						background-color:${blue[600]};
						
						font-size:1.0rem !important;
						margin:14px !important;
						width:80px; 
					} 
					.q-comment-send-button-in{
						color:#fff; 
						background-color:${blue[600]};
						opacity:0.8;
						font-size:1.0rem !important;
						margin-right:10px !important;
						margin-bottom:10px !important;
						margin-top:10px !important;
						width:80px; 
					} 
			`}</style>

            </form >



        )
    }
}
function Qwikie(props) {
    const { edit, topic, selected, user, cs, actions, unfocusUrl, focusUrl, test, setState, dropzone, state, globals, type, approver, loud, commentsOnly, topicOnly, level, channel, zoom } = props;
    const onlineUsername = user.get("username");
    const username = topic.get("username");
    const image_src = topic.get("image") ? topic.get("image") : topic.get("image_src");
    // console.log("QWIKIE", { edit, topic, user: user.toJS() })
    return (
        <div>
            {edit ? < QwikieEditor columnType="comment" qedit={true} {...props} />
                :
                <div className={level == 0 ? "q-qwikie-render-naked" : "q-qwikie-render"}>
                    <div data-id="ert" className="q-qwiket-outer-mark">
                        {(commentsOnly && level == 0) ? null : <div data-id="markdown2" className="q-qwiket-markdown" >
                            <QwiketRenderer
                                setLong={(val) => actions.updateOnlineState({ long: val }, true)}
                                long={user.get("long")}
                                type="comment"
                                topic={topic}

                                channel={channel}
                                globals={globals}
                                state={state}
                                setState={setState}
                                type={type}
                                approver={approver}
                                zoom={zoom}
                                loud={loud}
                                onClick={() => {
                                    console.log("TWOCLICK")
                                    //if (type == 'full')
                                    //	return;
                                    //Router.replace(focusUrl, focusUrl, { shallow: true })
                                }}
                                link={selected ? unfocusUrl : focusUrl}
                            />
                        </div>}


                    </div>
                </div>}
        </div>
    );
}
export class QwiketComment extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = props.level == 0 ? { //only for top QwiketComment
            firstVisibleId: "",
            lastVisibleId: "",
            preCount: 0,
            postCount: 0,
            flatView: new Immutable.OrderedMap({})

        } : {};
        console.log("QwiketComment construct")
        this.state.edit = false
        this.state.commentMenuOpen = false
        this.state.dirty = false;
        this.statedropzone = false;

        this.escFunction = this.escFunction.bind(this);
        this.fc = debounce(props.actions.fetchComments, 1000, { trailing: false, leading: true });
        this.fetchContextComments = debounce(this.fetchContextComments, 1000, { trailing: false, leading: true });


    }
    escFunction(event) {
        if (event.keyCode === 27) {
            //console.log("escape")
            const { actions, setState } = this.props;
            if (!this.state.dropzone) {
                actions.updateOnlineState({ cqid: '' }, true);
                this.setState({ dirty: false, edit: false })
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    shouldComponentUpdate(nextProps, nextState) {
        //console.log({props:this.props,nprops:nextProps})
        //return nextProps!=this.props||(this.props.level==0&&this.state!=nextState);
        console.log("qq comment shouldComponentUpdate0");
        const props = this.props;
        const topic = props.topic;
        const nextTopic = nextProps.topic;
        const nextRootThreadid = nextTopic ? nextTopic.get("qwiketid") : 0;
        const rootThreadid = topic ? topic.get("qwiketid") : 0;
        const nextContext = nextProps.context;
        const context = props.context;
        const user = props.user;
        const nextUser = nextProps.user;
        const nextQwiketChildren = nextTopic ? nextTopic.get('qcChildren') : null;
        //  console.log("qq shouldComponentUpdate nextQwiketChildren=", nextQwiketChildren ? nextQwiketChildren.toJS() : 'none', { cqid: props.online ? props.online.get("cqid") : '', ncqid: nextProps.online ? nextProps.online.get("cqid") : '' });
        const qwiketChildren = topic ? topic.get('qcChildren') : null;

        let { qparams } = props;
        let { qparams: nqParams } = nextProps;
        const cqid = qparams ? qparams.cqid : 0;
        const ncqid = nqParams ? nqParams.cqid : 0;
        let level = nextProps.level;
        if (rootThreadid != nextRootThreadid) {
            console.log("000111")
            return true;
        }
        if (cqid != ncqid) {
            console.log("000222")
            //console.log("CQID changed")
            return true;
        }

        if (qwiketChildren != nextQwiketChildren) {
            console.log("000333")
            //console.log(" RECEIVE_FETCH_COMMENTS qq 3 topic changed, update", { topic: topic.toJS(), nextTopic: nextTopic.toJS() });
            return true;
        }
        if (topic != nextTopic) {
            //if (level == 0)
            console.log("000444")
            console.log(" RECEIVE_FETCH_COMMENTS qq 3 topic changed, update", { topic: topic.toJS(), nextTopic: nextTopic.toJS() });
            return true;
        }
        /* if (context != nextContext) {
             //console.log("qq 3 context changed, update", { topic: topic.toJS(), nextTopic: nextTopic.toJS() });
             return true;
         }*/
        /*  if (user != nextUser) {
              //console.log("qq 3 context changed, update", { topic: topic.toJS(), nextTopic: nextTopic.toJS() });
              return true;
          }*/
        if (this.state != nextState) {
            console.log("000555")
            if (this.state.dirty != nextState.dirty) {
                console.log("dirty changed")
                return true;
            }
            if (this.state.lightbox != nextState.lightbox) {
                console.log("lightbox changed")
                return true;
            }
            if (this.state.edit != nextState.edit) {
                console.log("edit changed")
                return true;
            }
            if (this.state.commentMenuOpen != nextState.commentMenuOpen) {
                console.log("commentMenuOpen changed")
                return true;
            }
            if (this.state.firstVisibleId != nextState.firstVisibleId) {
                console.log("firstVisibleId changed")
                return true;
            }

            if (this.state.lastVisibleId != nextState.lastVisibleId) {
                console.log("lastVisibleId changed")
                return true;
            }
            if (this.state.postCount != nextState.postCount) {
                console.log("preCount changed")
                return true;
            }
            if (this.state.preCount != nextState.preCount) {
                console.log("preCount changed")
                return true;
            }


        }
        //  console.log("qq shouldComponentUpdate nothing", { qwiketChildren: qwiketChildren ? qwiketChildren.toJS() : 'none', nextQwiketChildren: nextQwiketChildren ? nextQwiketChildren.toJS() : 'none' })
        //  const ret = nextProps.params != props.params || props.session != nextProps.session /*|| props.user != nextProps.user*/
        return false;
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        const props = this.props;
        const { topic, level, actions, channel, qparams, context, commentsOnly } = props;
        if (!level && topic && (topic !== prevProps.topic)) {
            const rootThreadid = topic.get("qwiketid");

            if (level == 0 && commentsOnly && (rootThreadid != prevProps.topic.get("qwiketid"))) {
                //console.log("componentDidUpdate", { rootThreadid, fetched: this.fetched })
                //if (!this.fetched) {
                //	this.fetched = true;
                this.fetchContextComments(topic);
                //}
            }
            //console.log("qq rootThreadid:", { rootThreadid, channel });
            //actions.fetchQwiketChildren({qwiketid:rootThreadid,page:0,channel});
            if (qparams) {
                //console.log("registerComment REGISTER", { qparams, channel: qparams.channel, rootId: rootThreadid, nodes: topic.get("nodes") ? topic.get("nodes").toJS() : '', topic: topic ? topic.toJS() : '' })
                if (qparams.newItemsNotificationsAPI)
                    qparams.newItemsNotificationsAPI.registerComment({ storyId: rootThreadid, rootId: rootThreadid, context, nodes: topic.get("nodes"), channel: qparams.channel });
            }
        }
    }
	/*componentWillMount() {
		const props = this.props;
		const { topic, level, actions, channel, qparams, context } = props;
		if (!level && topic) { // top level
			const rootThreadid = topic.get("threadid");
			//console.log("qq rootThreadid:", { rootThreadid, channel });
			//actions.fetchQwiketChildren({qwiketid:rootThreadid,page:0,channel});
			if (qparams) {
				console.log("registerComment", { qparams, channel: qparams.channel, rootId: rootThreadid, nodes: topic.get("nodes") ? topic.get("nodes").toJS() : '', topic: topic ? topic.toJS() : '' })
				if (qparams.newItemsNotificationsAPI)
					qparams.newItemsNotificationsAPI.registerComment({ rootId: rootThreadid, context, nodes: topic.get("nodes"), channel: qparams.channel });
			}
		}

	} */
    componentDidMount() {
        const props = this.props;
        let { qparams, topic, level, commentsOnly, actions } = props;
        const cqid = qparams.cqid;
        const qwiketid = topic ? topic.get("qwiketid") : null;

        if (level == 0 && cqid && commentsOnly) {
            //console.log("componentDidMount 1")
            this.fetchContextComments(topic);
        }
        else {
            if (!cqid && level == 0 && qwiketid && commentsOnly) {
                //console.log("componentDidMount 2")
                this.fetchContextComments(topic);
            }
        }

        document.addEventListener("keydown", this.escFunction, false);
        //console.log("cqid>:",{cqid,threadid})s
        if (cqid && cqid == qwiketid && this.myRef.current) {
            //console.log("CQID> ref", { top: this.myRef.current.offsetTop, ref: this.myRef.current });

            setTimeout(() => { if (this.myRef.current) this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 1000);
            //this.setState({focus:true})

            // $#$ setTimeout(()=>window.scrollTo({top:this.myRef.current.offsetTop,behavior:'smooth'}),2000);

        }
        //console.log('QwiketComment qq did mount');
    }

    renderCallback({ isVisible, qwiketid, newCount, ordinal }) {
        let flatView = this.state.flatView;
        flatView = flatView.set(ordinal, { ordinal, isVisible, qwiketid, newCount })
        let sortedView = flatView.sort();
        let firstVisibleId = 0;
        let lastVisibleId = 0;
        let preCount = 0;
        let postCount = 0;
        let mode = 'pre';
        sortedView.forEach((p, i) => {
            //console.log('sortedView', { p, i, newCount })
            switch (mode) {
                case 'pre':
                    if (p.isVisible) {
                        mode = 'visible';
                        firstVisibleId = p.qwiketid;
                        if (i != 0) {
                            // console.log('counting in newCount', newCount);
                            preCount += newCount;
                        }
                    }
                    else {
                        if (p.newCount) {
                            preCount += p.newCount;
                        }
                    }
                    break;
                case 'visible':
                    if (!p.isVisible) {
                        mode = 'post';
                        lastVisibleId = p.qwiketid;
                    }
                    else
                        break;
                case 'post':
                    if (p.newCount) {
                        postCount += p.newCount;
                    }
            }
        })
        //s	console.log("renderCallback:", { preCount, postCount, isVisible, qwiketid, newCount, ordinal, sortedView: sortedView.toJS() })

        this.setState({ flatView: sortedView, preCount, postCount, firstVisibleId, lastVisibleId });
    }
    fetchNewComments() {
        const { channel, topic, test, actions, pageRootThreadid, context } = this.props;
        let rootId = topic.get('rootId');
        let top = 0;
        let firstId = 0;
        let nodes = {};
        if (!rootId) {
            rootId = pageRootThreadid;
            let qcComments = context.get('topic') ? context.get('topic').get("qcComments") : new Immutable.Map({});
            const first = qcComments ? qcComments.first() : new Immutable.Map({});
            firstId = first ? first.get("qwiketid") : "";
            //console.log("FETCHING NEW COMMENTS with *NO& rootId", { topic: topic.toJS() })
            nodes = topic.get("nodes");
        }
        else {
            nodes = topic.get("nodes");
            //	console.log("FETCHING NEW COMMENTS with rootId", { topic: topic.toJS() })
        }
        const request = {

            type: 'new', // all/new
            storyId: pageRootThreadid,
            rootId,
            nodes,
            firstId,
            test,
            channel: test ? 'test' : channel
        };
        //	console.log("fetchComments", { test, request })
        actions.fetchComments(request);
    }
    fetchContextComments(topic) {
        const { channel, test, actions, pageRootThreadid, context, qparams, user } = this.props;
        let rootId = topic.get('rootId');
        let cqid = qparams.cqid;
        if (test && !cqid && online)
            cqid = online.get("cqid");
        let top = 0;
        let firstId = 0;
        let nodes = {};
        if (!rootId) {
            rootId = pageRootThreadid;
            let qcComments = context.get('topic') ? context.get('topic').get("qcComments") : new Immutable.Map({});
            const first = qcComments ? qcComments.first() : new Immutable.Map({});
            firstId = first ? first.get("qwiketid") : "";
            //console.log("FETCHING NEW COMMENTS with *NO& rootId", { topic: topic.toJS() })
            nodes = topic.get("nodes");
        }
        else {
            nodes = topic.get("nodes");
            //	console.log("FETCHING NEW COMMENTS with rootId", { topic: topic.toJS() })
        }
        const request = {

            type: cqid ? 'target' : 'all', // all/new
            storyId: rootId,
            targetId: cqid,
            rootId,
            nodes: cqid ? null : nodes,
            firstId,
            test,
            channel: test ? 'test' : channel
        };
        //	console.log("fetchComments", { test, request })
        console.log("target fetch", request)
        this.fc(request);
    }

    render() {
        let {
		/*passed:*/		replyTo, theme: muiTheme, replyToUsername, parentSelected, topic, channel, qparams: params, updateQwiketState, zoom, test, renderCallback, topicOnly, commentsOnly, level, pageRootThreadid,
		/*bound: */		showQwiket, context, globals, session, user,
            actions, /*bound actions*/
            ...rest /* styles */
        } = this.props;
        console.log("QwiketComment RENDER")
        //  const muiTheme = useTheme();
        const width = u.width(globals);
        let loud = width > 900 ? (+session.get("loud")) : 1;
        const userEntities = user.get("userEntities");
        const backgroundColor = muiTheme.palette.background.default;
        //console.log({ muiTheme });
        const color = muiTheme.palette.text.primary;
        const theme = globals.get("theme");
        // if (level == 0)
        //     console.log("TOPIC COMMENT RENDER:", { props: this.props })
        const state = this.state;
        let { preCount, postCount, firstVisibleId, edit, commentMenuOpen, dirty, dropzone } = state;

        //const {fetchQwiketChildren}=actions;
        let cqid = params.cqid;
        let route = params.route;

        //console.log({ params })
        // if (test && !cqid && user)
        //     cqid = user.get("cqid");
        //console.log("comment:", { cqid })
        pageRootThreadid = pageRootThreadid ? pageRootThreadid : topic ? topic.get('qwiketid') : 0;
        if (level == 0)
            renderCallback = this.renderCallback.bind(this);

        let qwiketid = topic.get("qwiketid");
        let open = qwiketid == context.get('openEditor') ? true : false;
        //  console.log("************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", { open, qwiketid, openEditor: context.get('openEditor') })
        if (level == 0 && open)
            edit = true;

        if (!qwiketid) {
            edit = true;
            open = true;
        }
        //   console.log("MAIN RENDER", { edit, open, level, qwiketid, openEditor: context.get("openEditor") })
        let entity = topic.get("entity");
        const approver = userEntities ? userEntities.includes(entity) : true;
        //console.log("APPROVER:", { approver, entity, userEntities: userEntities ? userEntities.toJS() : '' });
        if (!qwiketid)
            edit = true;
        //  console.log("MAIN RENDERw", { edit, level, qwiketid, openEditor: context.get("openEditor") })

        //if(level==0)
        //console.log({ commentMenuOpen, level, dirty })
        const CallBacker = ({ renderCallback, ordinal, newCount, isVisible, qwiketid }) => {
            //console.log("CallBacker:", { renderCallback, ordinal, newCount, isVisible, qwiketid })
            setTimeout(() => { renderCallback({ ordinal, newCount, isVisible, qwiketid }) }, 100);

            return null;
        }
        const rootThreadid = topic ? topic.get('qwiketid') : 0;
        let reshare = +topic.get("reshare");

        const focusUrl = [109, 9, 59].indexOf(reshare) < 0 ? level == 0 ? `/context/channel/${channel}/topic/${pageRootThreadid}` : `/context/channel/${channel}/topic/${pageRootThreadid}/q/${rootThreadid}` : `/context/channel/${channel}/topic/${qwiketid}`;
        const editUrl = [109, 9, 59].indexOf(reshare) < 0 ? level == 0 ? `/context/channel/${channel}/topic/${pageRootThreadid}/qedit` : `/context/channel/${channel}/topic/${pageRootThreadid}/q/${rootThreadid}/qedit` : `/context/channel/${channel}/topic/${qwiketid}/qedit`;
        const replyUrl = [109, 9, 59].indexOf(reshare) < 0 ? level == 0 ? `/context/channel/${channel}/topic/${pageRootThreadid}/qreply` : `/context/channel/${channel}/topic/${pageRootThreadid}/q/${rootThreadid}/qreply` : `/context/channel/${channel}/topic/${qwiketid}/qreply`;
        const editRoute = {
            pathname: '/context',
            query: {
                channel,
                threadid: [109, 9, 59].indexOf(reshare) < 0 ? pageRootThreadid : qwiketid,
                cqid: level == 0 ? 0 : cqid,
                route: 'qedit'
            },
            as: editUrl
        }
        const replyRoute = {
            pathname: '/context',
            query: {
                channel,
                threadid: [109, 9, 59].indexOf(reshare) < 0 ? pageRootThreadid : qwiketid,
                cqid: level == 0 ? 0 : cqid,
                route: 'qreply'
            },
            as: editUrl
        }
        const cancelRoute = {
            pathname: '/context',
            query: {
                channel,
                threadid: [109, 9, 59].indexOf(reshare) < 0 ? pageRootThreadid : qwiketid,
                cqid: level == 0 ? 0 : cqid,
                route: 'valid'
            },
            as: editUrl
        }
        //   console.log({ edit, focusUrl, qwiketid, reshare, index: [109, 9, 59].indexOf(reshare) })
        const unfocusUrl = `/context/channel/${channel}/topic/${pageRootThreadid}`;
        const selected = level == 0 || cqid == rootThreadid//||state.focus;
        //console.log("qq RENDER selected:", { params, selected, cqid, rootThreadid, topic: selected && topic ? topic.toJS() : '' });
		/*if(!rootThreadid){
			console.log("qq RENDER1");
			
			return <span/>; 
		}
		else{
			console.log("qq RENDER2");
			
			return <div style={{width:600,height:200,border:'2px red solid',backgroundColor:'#311',color:'#eef'}}>BLAH</div>
		}*/
        //const qwiketChildren=topic.get('qcChildren');
        let myChildren = topic.get("qcComments");// || topic.get("children_summary");
        //if (level == 0)
        //	console.log('RENDER', { myChildren: myChildren ? myChildren.toJS() : {} })
		/*	if (myChildren)
				myChildren = myChildren.sort(function (a, b) {
					//let [key1, p1] = a;
					//let [key2, p2] = b;
					const a1 = +(a.get("published_time"));
					const b1 = +(b.get("published_time"));
					//console.log("2sorting ", { a: a.toJS(), b: b.toJS(), a1, b1 })
					return b1 - a1;
				}) */
        if (myChildren && !myChildren.size)
            myChildren = null;
        if (myChildren) {
            myChildren = myChildren.sort(function (lhs, rhs) {
                if (!lhs || !rhs) return 0;
                const lhsTime = +lhs.get('publishedTime') ? +lhs.get('publishedTime') : +lhs.get('published_time');
                const rhsTime = +rhs.get('publishedTime') ? +rhs.get('publishedTime') : +rhs.get('published_time');
                //	console.log("qwiketComment COMPARE", { lhs: lhs.toJS(), rhs: rhs.toJS(), lhsTime, rhsTime })
                if (lhsTime > rhsTime) { return -1; }
                if (lhsTime < rhsTime) { return 1; }
                if (lhsTime === rhsTime) { return 0; }
            });
            //console.log('compare after sort', { myChildren: myChildren.toJS() })


        }
        //console.log("qq render comment qwiket => ", { pageRootThreadid, myChildren: myChildren ? myChildren.toJS() : 'none', topic: topic.toJS() });
        if (reshare >= 1000 && !myChildren)
            return <div />
        const title = topic.get("title");
        const author = topic.get("author")// ? topic.get("author") : topic.get("s_un");
        const cat = topic.get("site_name") ? topic.get("site_name") : topic.get("cat");
        const username = topic.get("username");
        const onlineUsername = user.get("username");
        const user_name = topic.get("s_un");
        const image = topic.get("image");
        const avatar = topic.get("catIcon") ? topic.get("catIcon") : user.get("avatar");
        const onlineAvatar = user.get("avatar");
        const shaded = topic.get("shaded");
        const lastId = context.get("topic").get("lastId");
        const newFlag = topic.get("new");
        let ordinal = topic.get("ordinal");
        let typingCount = topic.get("typingCount") ? 1 : 0;

        //  if (level == 0)
        //     console.log({ onlineUsername, username })
        //	console.log("lastId:", lastId)
        //let offset = level > 12 ? 4 : level > 1 ? 25 - level * 1.6 > 8 ? 25 - level * 1.6 : 8 : level > 0 ? 0 : 10;
        //let offset2 = level * 25 - (25 - level * 1.6);//(level-1)*15;
        //let offset = level * (level > 12 ? 4 : level > 10 ? 6 : level > 8 ? 8 : level > 6 ? 10 : level > 4 ? 12 : level > 2 ? 14 : level > 1 ? 16 : 0);
        let offset = level * ((level > 1 && width > 750) ? 10 : 0);
        let offset2 = level * 10 + 10;
        //	const theme = +globals.get("theme");
        if (width < 750) {
            offset = level > 12 ? 4 : level > 1 ? 15 - level * 2.6 > 2 ? 15 - level * 2.6 : 2 : level > 0 ? 0 : 0;
            offset2 = level * 15 - (15 - level * 2.6);
        }
        const isSticky = topic.get("body") ? true : false;
        const isShortie = topic.get("reshare") == 7 || topic.get("reshare") == 6 || topic.get("reshare") == 107 || topic.get("reshare") == 106;//|| test;fqwi
        let timestamp = topic.get("published_time");
        if (test && timestamp < 1500000000)
            timestamp = (Date.now() / 1000 | 0) - timestamp * 10;
        //  console.log({ edit, timestamp })
        const more = topic.get("more");
        const newCount = topic.get("newCount") ? topic.get("newCount") : 0;

		/*if (level == 0 && preCount > 0) {
			//console.log("preCount", { preCount })
			preCount += newCount;
		}*/
        //	if (level == 0)
        //		console.log({ more, newCount })
        let lapsed = timestamp ? (u.timeConverter(timestamp, (Root.__CLIENT__ && window.virgin ? (globals.get("renderTime")) : 0), 0, true, width, globals)) : false;
        if (!lapsed && test) {
            const minutes = Math.floor(Math.random() * 60);
            lapsed = `${minutes} m`;
        }
        if (!channel)
            channel = 'qwiket';
        const ch = (channel ? '/channel/' + channel : '');
        const buttonColor = theme ? blue[600] : blue[100];
        let rootTargetLink = `/context${ch}/topic/${pageRootThreadid}`;
        //let selectLink = `/context${ch}/topic/${pageRootThreadid}/q/` + topic.get("threadid");
        const replyLink = rootTargetLink + '/qedit/__new/' + pageRootThreadid + '/' + topic.get("qwiketid");
        const stickyLink = `/context${ch}/topic/${topic.get("qwiketid")}`;
        //console.log("qq replyLink4:", replyLink);
        const likeLink = "";
        const flagLink = "";
        const shareLink = "";
        const chiRows = [];
        let j = 0;
        let replyTopic = null;
        let parent = false;
        if (!topicOnly)
            myChildren ? myChildren.forEach((o, i) => {
                //console.log("qq myChidren.forEach", { o: o ? o.toJS() : o, i })
                if (cqid == o.get('qwiketid'))
                    parent = true;
                if (!o)
                    return;
                if (!o.get("reshare") || o.get("reshare") >= 100 || o.get("reshare") < 50) {
                    chiRows.push(<BoundQwiketComment level={level + 1}
                        topic={o}
                        replyTo={author}
                        replyToUsername={username}
                        pageRootThreadid={pageRootThreadid}
                        channel={channel}
                        qparams={params}
                        updateQwiketState={updateQwiketState}
                        approver={approver}
                        zoom={zoom}
                        actions={actions}
                        globals={globals}
                        test={test}
                        parentSelected={cqid && (selected && level > 0 || parentSelected)}
                        context={context}
                        renderCallback={renderCallback}

                    />)
                }
                else {
                    //	console.log("CQID", { cqid, threadid: o.get("threadid") })
                    if (cqid == o.get('qwiketids'))
                        chiRows.push(<BoundQwiketComment level={level + 1}
                            topic={o}
                            pageRootThreadid={pageRootThreadid}
                            channel={channel}
                            qparams={params}
                            updateQwiketState={updateQwiketState}
                            approver={approver}
                            zoom={zoom}
                            actions={actions}
                            globals={globals}
                            test={test}
                            context={context}
                            renderCallback={renderCallback}

                        />)
                    //console.log("$$$$$$$$$$$$  ReplyTopic", { o: o.toJS(), i })
                    replyTopic = o;
                }
            }) : null;

        //console.log("qq actual render", { level, isSticky, author, lapsed, description })
        //<LoadChildren topic={topic} actions={actions} channel={channel} isVisible={isVisible}/>
        const rightBorder = selected ? 'thin ' + grey[500] + ' solid' : '';
        const selectedBck = backgroundColor;
        const threadBck = grey[100];
        const fadedBck = grey[400];

        const selectedOpacity = 1.0;
        const threadOpacity = 0.8;
        const fadedOpacity = 0.6;
        const paperBck = muiTheme.palette.background.paper;
        const selectedBorder = grey[400];
        const threadBorder = grey[100];
        const noBorder = backgroundColor;
        const selectedElevation = 4;
        const threadElevation = 4;

        //if (selected)
        // console.log({ edit, rightBorder })
        let isZoom = false;
        if (level == 0) {
            if (!cqid) {
                if (params.route == 'qreply') {
                    // console.log("QREPLY")
                }
                else
                    if (params.route == 'qedit') {
                        //  console.log("QEDIT")
                    }
            }
            isZoom = state.z == 'zz';
			/*$$$if (isZoom && state.z != 'zz') {
				this.setState({ z: 'zz' });
				if (Root.__CLIENT__)
					setTimeout(() => window.twttr.widgets.load(), 500);
			}*/
            //console.log("ZOOM:", { isZoom, zoom });
        }
        const fullunfocusUrl = `${unfocusUrl}/q/${qwiketid}`;
        const stickie = reshare == 9 || reshare == 59 || reshare == 109
        //const q = <div><Qwiket/><BoundQwiket /></div>
        //console.log("QwiketComment render done", { stickie, qwiketid, reshare })
        //	<Paper elevation={selected && level != 0 ? 0 : 0} data-id="w2" style={{ width: '100%', marginTop: level == 0 ? 20 : null, marginBottom: selected ? 8 : null, borderBottom: selected && level != 0 ? `thin ${blue[200]} solid ` : null, borderTop: selected && level != 0 ? `thin ${blue[200]} solid ` : null, borderRight: selected && level != 0 ? `thin ${blue[200]} solid ` : null, borderRadius: 7, backgroundColor: (selected && level != 0) ? theme ? yellow[25] : backgroundColor : backgroundColor }}>
        //console.log("!! @@ ## ", topic.toJS())
		/*let newCount = 0;
		if (topic.get("threadid")) {
			newCount = topic.get("newCount");
		}*/
        let is = level > 12 ? 12 : level >= 8 ? 14 : 16;
        let is2 = level > 12 ? 14 : level >= 8 ? 16 : 19
        let iw = level > 12 ? 110 : level >= 8 ? 130 : 180
        let imSize = level > 12 ? 24 : level >= 8 ? 28 : 36;
        let stripeInd = level % 3;
        //sconsole.log({ stripeInd, level })
        //console.log({ parentSelected, selected, approver, username, onlineUsername })
        //if (level == 0)
        // console.log("EDIT", edit);
        let borderColors = ['#81D4FA', '#CE93D8', '#FFAB91']
        console.log("QwiketComment RENDER2")
        return <div>

            <div ref={this.myRef} data-id={`qwiket-comment-level-${level}`} className={level > 0 ? "qwiket-comment" : commentsOnly ? 'qwiket-comment-level0-comments-only' : 'qwiket-comment-level-zero'} style={{ borderRight: newFlag ? `${level < 12 ? 'thick' : 'thin'} ${green[500]} solid` : selected ? 'none' : 'none', borderLeft1: level > 0 ? `thin ${borderColors[stripeInd]} solid` : 'none', marginBottom: width > 750 ? 10 : 2, marginTop1: selected || parentSelected || parent ? width > 750 ? 4 : 2 : 0, marginLeft: offset, opacity: shaded ? 0.5 : 1.0 }} >
                <ClickAwayListener data-id="11f1" style={{ display: 'flex', width: '100%' }} onClickAway={() => { if (!dropzone && false) Router.replace(cancelRoute); }}>
                    <ReactHoverObserver className="qwiket-comment" >
                        {({ isHovering: isHovering1 }) => (
                            <div data-id="react-hover" style={{ display: 'flex', width: '100%' }}>
                                {!(commentsOnly && level == 0) ? (
                                    <TrackVisibility style={{ display: 'flex', width: '100%' }}>
                                        {({ isVisible }) => (
                                            <div data-id="w1" style={{ display: 'flex', width: '100%' }}>
                                                {level > -10 ?
                                                    <div style={{ display: 'flex', width: '100%' }}>
                                                        {level == 0 ? <CallBacker renderCallback={renderCallback} ordinal={ordinal} newCount={newCount} isVisible={isVisible} qwiketid={qwiketid} /> : null}
                                                        <Paper square={false} elevation={selected && level != 0 ? selectedElevation : parentSelected || parent ? threadElevation : 0} data-id="w2" style={{ width: '100%', maxWidth: level == 0 ? '100%' : 468, marginTop: level == 0 ? 20 : null, borderStyle1: 'solid', borderWidth1: 'thick', borderColor1: (selected && level != 0) ? selectedBorder : parentSelected ? threadBorder : noBorder, backgroundColor: level > 0 && (isHovering1 || selected || parentSelected || parent) ? paperBck : backgroundColor }}>

                                                            <div data-id="w11" style={{ paddingRight: newFlag ? 4 : null, borderRadius1: 12, cursor: 'pointer', borderTop: false ? 'thin #BBDEFB solid' : 'none', borderBottom: false ? 'thin #BBDEFB solid' : 'none', display: 'flex' }}>
                                                                {level != 0 ? <img style={{ maxWidth: '20%', maxHeight: imSize, marginTop: 10, marginLeft: 0, paddingTop: 0, marginRight: 6, marginLeft: 6 }} src={avatar} /> : null}
                                                                <div data-id="P92" style={{ marginTop: 10, width: level > 0 ? '80%' : '100%' }}>

                                                                    <div data-id="p93" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 0, marginBottom: 10 }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                                            <div style={{ fontWeight: 400, fontSize: '1.0rem', color: selected && level != 0 ? 'green' : null }}>{author || cat}</div>


                                                                            {level == 0 ? <div className="q-qwiket-copyright">{cat ? <span>&copy;&nbsp;</span> : ''}{cat}</div> : null}
                                                                            {level > 1 && replyTo ?
                                                                                <div style={{ display: 'flex', alignItems: 'center' }}><ReplyTo style={{ width: 16, height: 16, opacity: 0.5 }} />
                                                                                    <div data-id="lapsed12" style={{ marginRight: 14, fontSize: '0.8rem' }} >{replyTo}</div>
                                                                                </div> : null
                                                                            }
                                                                            {cat ? <Bullet style={{ opacity: 0.5 }} /> : null}
                                                                            <div data-id="lapsed12" style={{ marginRight: 14, fontSize: '0.8rem' }} >{lapsed}</div>

                                                                        </div>

                                                                    </div>
                                                                    <Qwikie
                                                                        edit={edit}
                                                                        open={open}
                                                                        updateOpenEditor={actions.updateOpenEditor}
                                                                        type={level == 0 ? 'full' : stickie ? 'stickie' : 'comment'}
                                                                        isHovering1={isHovering1}
                                                                        topic={topic}
                                                                        replyTopic={replyTopic}
                                                                        context={context}
                                                                        dq={reshare == 6 || reshare == 56 || reshare == 106}
                                                                        stickie={stickie}

                                                                        actions={actions}
                                                                        channel={channel}
                                                                        selected={selected}
                                                                        rootThreadid={pageRootThreadid}
                                                                        focusUrl={focusUrl}
                                                                        test={test}
                                                                        dirty={dirty}
                                                                        state={state}
                                                                        globals={globals}
                                                                        channel={channel}
                                                                        approver={approver}
                                                                        zoom={zoom}
                                                                        loud={loud}
                                                                        level={level}
                                                                        topicOnly={topicOnly}
                                                                        unfocusUrl={unfocusUrl}
                                                                        dropzone={dropzone} //to prevent clickAway while in Dialog
                                                                        setState={(update, callback) => { this.setState(update, callback ? callback : null);/* console.log("setState !!!!!", { update });*/ }}
                                                                    />



                                                                    <div className="q-comment-bottom-outer-wrap">
                                                                        <div className="q-comment-bottom-wrap">
                                                                            {!stickie || level == 0 ? <div style={{ width: iw, display: 'flex', marginLeft: -6, paddingLeft: 0, paddingRight: 20, paddingBottom: 14, paddingTop: 4, marginTop: 2, alignItems: 'center', justifyContent: 'space-between', height: 22, marginBottom: 0, marginTop: 8 }}>

                                                                                {selected || stickie ? null : level > 0 ? <Tooltip title="Reply">
                                                                                    <CommentOutline
                                                                                        style={{ height: is, opacity: isHovering1 ? 1.0 : selected ? 0.8 : 0.4 }}
                                                                                        onClick={e => {
                                                                                            const href = `/context?threadid=${pageRootThreadid}`;
                                                                                            //const as = `/learn/${id}/${view}`;
                                                                                            console.log("Router:", { href, fullunfocusUrl })
                                                                                            Router.replace(href, fullunfocusUrl, { shallow: false });
                                                                                        }}
                                                                                    />

                                                                                </Tooltip> : null}

                                                                                <Tooltip title="Like">
                                                                                    <Heart style={{ height: is, opacity: isHovering1 ? 0.3 : selected ? 0.3 : 0.3 }} onClick={() => { preventDefault(); console.log("liked"), Router.push(likeLink) }}
                                                                                    />
                                                                                </Tooltip>
                                                                                <Tooltip title="Community Moderation">
                                                                                    <FlagRemove style={{ height: is, opacity: isHovering1 ? 0.3 : selected ? 0.3 : 0.3 }} onClick={() => { preventDefault(); console.log("flag"), Router.push(flagLink) }} />
                                                                                </Tooltip>
                                                                                <Tooltip title="Share">
                                                                                    <ShareVariant style={{ height: is, opacity: isHovering1 ? 0.3 : selected ? 0.3 : 0.3 }} onClick={() => { preventDefault(); console.log("share"), Router.push(shareLink) }} />
                                                                                </Tooltip>
                                                                                <Tooltip title="Add to favorites">
                                                                                    <Star style={{ height: is2, opacity: isHovering1 ? 0.3 : selected ? 0.3 : 0.3 }} onClick={() => { preventDefault(); console.log("share"), Router.push(shareLink) }} />
                                                                                </Tooltip>
                                                                                {__CLIENT__ && approver || (__CLIENT__ && (username == onlineUsername)) ? <div>
                                                                                    <Tooltip title="Edit">
                                                                                        <PlaylistEdit style={{ height: is2, width: is2, marginTop: 3, opacity: isHovering1 ? 1.0 : selected ? 0.8 : 0.4 }}
                                                                                            onClick={(e) => {
                                                                                                this.setState({ commentMenuTarget: e.currentTarget });
                                                                                                console.log("Icon click", { level, qwiketid });
                                                                                                this.setState({ commentMenuOpen: true })
                                                                                                //actions.updateOpenEditor({ qwiketid })
                                                                                            }} />
                                                                                    </Tooltip>
                                                                                    <ReactHoverObserver >

                                                                                        {({ isHovering }) => (
                                                                                            <Menu

                                                                                                anchorEl={this.state.commentMenuTarget}
                                                                                                keepMounted
                                                                                                open={Boolean(this.state.commentMenuOpen)}
                                                                                                onClose={() => this.setState({ commentMenuOpen: false })}
                                                                                            >
                                                                                                {approver || (username == onlineUsername) ? <MenuItem classes={{ root: 'q-comment-action-menu-item' }} onClick={() => {
                                                                                                    console.log("D17 SELECT EDIT")
                                                                                                    this.setState({ commentMenuOpen: false, edit: true });
                                                                                                    //Router.replace(editRoute);
                                                                                                    actions.updateOnlineState({ cqid: qwiketid }, true);
                                                                                                    actions.fetchDraftQwiket({ qwiketid })
                                                                                                    actions.updateOpenEditor({ qwiketid });
                                                                                                }}>Edit</MenuItem> : null}
                                                                                                {!isShortie && (approver || (username == onlineUsername)) ? <MenuItem classes={{ root: 'q-comment-action-menu-item' }}
                                                                                                    onClick={() => {
                                                                                                        console.log("CLICK UNSHARE", { topic: topic.toJS() })
                                                                                                        actions.updateOnlineState({ cqid: qwiketid }, true);
                                                                                                        this.setState({ commentMenuOpen: false });
                                                                                                        actions.unshareNewslineQwiket({
                                                                                                            qwiketid,
                                                                                                            channel,
                                                                                                            rootId: topic.get('rootId') ? topic.get('rootId') : '/',
                                                                                                            del: 0,
                                                                                                            columnType: 'comment'
                                                                                                        });
                                                                                                    }}>Unshare on Newsline</MenuItem> : null}
                                                                                                {!isShortie && (approver || (username == onlineUsername)) ? <MenuItem classes={{ root: 'q-comment-action-menu-item' }}
                                                                                                    onClick={() => {
                                                                                                        console.log("CLICK UNPUBLISH", { topic: topic.toJS() })
                                                                                                        actions.updateOnlineState({ cqid: qwiketid }, true);
                                                                                                        this.setState({ commentMenuOpen: false });
                                                                                                        const request = {
                                                                                                            type: 'new', // all/new
                                                                                                            storyId: pageRootThreadid,
                                                                                                            rootId: topic.get("rootId"),
                                                                                                            nodes: topic.get("nodes"),
                                                                                                            test,
                                                                                                            published_time: microtime(),
                                                                                                            channel: test ? 'test' : channel,

                                                                                                        };
                                                                                                        actions.unpublishQwiket({
                                                                                                            qwiketid,
                                                                                                            channel,
                                                                                                            rootId: topic.get('rootId') ? topic.get('rootId') : '/',
                                                                                                            del: 0,
                                                                                                            chainFetch: request,
                                                                                                            columnType: 'comment'
                                                                                                        });
                                                                                                    }}>Unpublish</MenuItem> : null}
                                                                                                {approver || (username == onlineUsername) ? <MenuItem classes={{ root: 'q-comment-action-menu-item' }} onClick={() => {
                                                                                                    actions.updateOnlineState({ cqid: qwiketid }, true);
                                                                                                    this.setState({ commentMenuOpen: false });
                                                                                                    const request = {
                                                                                                        type: 'new', // all/new
                                                                                                        storyId: pageRootThreadid,
                                                                                                        rootId: topic.get("rootId"),
                                                                                                        nodes: topic.get("nodes"),
                                                                                                        test,
                                                                                                        published_time: microtime(),
                                                                                                        channel: test ? 'test' : channel,

                                                                                                    };
                                                                                                    actions.unpublishQwiket({
                                                                                                        qwiketid,
                                                                                                        channel,
                                                                                                        rootId: topic.get('rootId') ? topic.get('rootId') : '/',
                                                                                                        del: 1,
                                                                                                        chainFetch: request,
                                                                                                        columnType: 'comment'
                                                                                                    });
                                                                                                }}>Delete</MenuItem> : null}

                                                                                                <MenuItem classes={{ root: 'q-comment-action-menu-item' }} onClick={() => { copy(`https://qwiket.com${fullunfocusUrl}`); this.setState({ commentMenuOpen: false }) }}>Copy Link to Clipboard</MenuItem>

                                                                                            </Menu>

                                                                                        )}
                                                                                    </ReactHoverObserver>
                                                                                </div> : null}
                                                                            </div> : null}
                                                                            {stickie && level > 0 ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32, marginBottom: 0, marginTop: 8 }}>
                                                                                <Link route={focusUrl}><a href={focusUrl}><img className="q-comment-sticky-logo" src="/static/css/blue-bell.png" /></a> </Link>

                                                                            </div> : null}

                                                                        </div>

                                                                    </div>



                                                                </div>
                                                            </div>


                                                        </Paper>
                                                    </div>
                                                    : null}
                                            </div>
                                        )}
                                    </TrackVisibility>

                                ) : null}
                            </div>
                        )}

                    </ReactHoverObserver>
                </ClickAwayListener >
                <div className="q-comment-bottom-right-msg" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                    {!dirty && newCount && level != 0 ?
                        <Tooltip title="New content is available"><Button className="q-comment-text-button" color="primary" onClick={() => { this.fetchNewComments.bind(this)() }}>
                            <div className="q-comment-show-new-reply">{`${'Show ' + newCount + ' new repl' + (newCount > 1 ? 'ies' : 'y')}...`}</div>
                        </Button></Tooltip> : null}
                    {!dirty && typingCount && level != 0 ?
                        <div className="q-qwiket-typing" > {typingCount == 1 ? "One other user is" : typingCount + " other users are"}  typing a response...</div> : null}

                </div>
                {!topicOnly && level == 0 && preCount > 0 && firstVisibleId ? <div className={firstVisibleId ? "q-comment-affix-top" : "q-comment-affix-top-remnant"}>
                    <Button variant="contained" className={firstVisibleId ? "q-comment-affix-button" : "q-comment-affix-button-remnant"} color="primary" onClick={() => {
                        if (firstVisibleId) {
                            this.fetchNewComments.bind(this)()
                        } else {
                            if (this.myRef && this.myRef.current)
                                setTimeout(() => this.myRef.current.scrollIntoView({ behavior: 'smooth' }), 200);
                        }
                    }}>
                        <div className="q-comment-affix-bottom-text">{`${preCount == 1 ? 'One' : preCount} ${`new ${firstVisibleId ? ' Qwiket' : 'Story React'}`}${preCount > 1 ? 's' : ''}${firstVisibleId ? ' above' : ''}`}</div>

                    </Button></div> : null}
                {!topicOnly && level == 0 && preCount > 0 && !firstVisibleId ? <div className={firstVisibleId ? "q-comment-affix-top" : "q-comment-affix-top-remnant"}>
                    <Button size="small" className={firstVisibleId ? "q-comment-affix-button" : "q-comment-affix-button-remnant"} onClick={() => {
                        if (firstVisibleId) {
                            this.fetchNewComments.bind(this)()
                        } else {
                            if (this.myRef && this.myRef.current)
                                setTimeout(() => this.myRef.current.scrollIntoView({ behavior: 'smooth' }), 200);
                        }
                    }}>
                        <div className="q-comment-text-remnant">{`${preCount == 1 ? 'One' : preCount} ${` new ${firstVisibleId ? ' Qwiket' : 'Qwiket'}`}${preCount > 1 ? 's' : ''}${firstVisibleId ? ' below.' : ''}`}</div>

                    </Button></div> : null}
                {level != 0 && selected && !topicOnly && !stickie ? <QwikieEditor
                    columnType="comment"
                    open={open}
                    updateOpenEditor={actions.updateOpenEditor}
                    edit={edit}
                    route={route}
                    type={level == 0 ? 'full' : 'comment'}
                    //isHovering1={isHovering1}
                    topic={topic}
                    defaultTitle={topic.get("title")}

                    replyTopic={replyTopic}
                    context={context}
                    dq={reshare == 6 || reshare == 56 || reshare == 106}
                    stickie={reshare == 9 || reshare == 59 || reshare == 109}

                    actions={actions}
                    channel={channel}
                    selected={selected}
                    rootThreadid={pageRootThreadid}
                    focusUrl={focusUrl}
                    test={test}
                    dirty={dirty}
                    state={state}
                    globals={globals}
                    channel={channel}
                    approver={approver}
                    zoom={zoom}
                    loud={loud}
                    level={level}
                    topicOnly={topicOnly}
                    unfocusUrl={unfocusUrl}
                    allowOpen={true}
                    dropzone={dropzone} //to prevent clickAway while in Dialog
                    setState={(update, callback) => { this.setState(update, callback ? callback : null); console.log("setState !!!!!", { update }); }}
                /> : null}

                {!topicOnly && level == 0 ? <div className="q-comment-section-title"><img className="q-comment-section-logo" src="/static/css/blue-bell.png" /><div className="q-comment-section-inner">{myChildren ? 'Native Qwiket Comments (Qwikets)' : 'No Native Qwiket Comments (Qwikets) yet'}</div></div> : null}

                {commentsOnly && level == 0 && qwiketid && !edit ? <QwikieEditor
                    columnType="comment"
                    open={open}
                    updateOpenEditor={actions.updateOpenEditor}
                    edit={edit}
                    route={route}
                    type={level == 0 ? 'full' : 'comment'}
                    defaultTitle={topic.get("title")}
                    topic={topic}
                    replyTopic={replyTopic}
                    context={context}
                    dq={reshare == 6 || reshare == 56 || reshare == 106}
                    stickie={reshare == 9 || reshare == 59 || reshare == 109}
                    actions={actions}
                    channel={channel}
                    selected={true}
                    rootThreadid={pageRootThreadid}
                    focusUrl={focusUrl}
                    test={test}
                    dirty={dirty}
                    state={state}
                    globals={globals}
                    channel={channel}
                    approver={approver}
                    zoom={zoom}
                    loud={loud}
                    level={level}
                    allowOpen={!cqid}
                    commentsOnly={commentsOnly}
                    unfocusUrl={unfocusUrl}
                    dropzone={dropzone} //to prevent clickAway while in Dialog
                    setState={(update, callback) => { this.setState(update, callback ? callback : null); console.log("setState !!!!!", { update }); }}
                /> : null}
                {!topicOnly && newCount && level == 0 ? <div styl={{ marginLeft: offset2 }}> <Button className="q-comment-text-button" color="primary" onClick={() => { this.fetchNewComments.bind(this)() }}>
                    <div>{`${'Show  ' + newCount + ' new qwiket' + (newCount > 1 ? 's' : '')}...`}</div>

                </Button> </div> : null}

            </div>
            {
                more ? <div style={{ marginLeft: offset2 }}> <Button className="q-comment-text-button" onClick={() => {
                    //console.log("calling fetchComments", { lastId })
                    const req = {
                        type: 'all',
                        nextPage: 1,
                        storyId: pageRootThreadid,
                        rootId: pageRootThreadid,
                        lastId,
                        pageSize: 4,
                        test,
                        channel: test ? 'test' : channel
                    }
                    //console.log("calling fetchComments", { req })
                    actions.fetchComments(req)
                }}>
                    <div>{`${level == 1 ? 'More' : ''}...`}</div>

                </Button> </div> : null
            }

            {
                level == 0 && postCount > 0 ? <div className="q-comment-affix-bottom">
                    <Button variant="contained" className="q-comment-affix-button" onClick={() => { this.fetchNewComments.bind(this)() }}>
                        <div className="q-comment-affix-bottom-text">{`${postCount == 1 ? 'One' : postCount} new Qwiket${postCount > 1 ? 's' : ''} below`}</div>

                    </Button></div> : null
            }
            {chiRows}
            <style jsx global>{`
			.q-qwiket-typing{
				opacity:0.8;
				font-size:1.0rem;
			}

			.qwiket-comment{ 
				display:flex;
				flex-direction:column;
				justify-content:flex-start;
				//border-radius: 15px; 
				//position: relative; 
			
			//	margin-top: 0px; 
			//	padding-left:  10px; 
			//	padding-right:  10px; 
			}
			.qwiket-comment-level-zero{
			
			}
			 @media (min-width:750px){
        
				.qwiket-comment-level-zero{
					//border-radius: 15px;
					position: relatisve;
					padding-left:  25px; 
					padding-right: 25px; 
					
				}
			}
			.qwiket-comment-level0-comments-only{
				//border-radius : 15px;
			//	position: relative;
			//	padding-left:  10px; 
			//	padding-right:  10px; 
				margin-left:10px;
				margin-right:10px;
			}	
				
				.q-qwikie-render{
					//width:100%; 
				}
				.q-qwikie-render-naked{
				//width:100%;
				margin-left:0px;
				padding-left:0px;
			}
				.q-qwikie-render-offset{
					//width:100%;
					margin-left:10px;
				}
				.q-comment-main-image{
					//position:relative;
					width:100%;
					max-width:380px !important;
					object-fit: contain;
					margin-top:20px;
				}
				.q-comment-dropzone-text{
					padding:20px;
					color:${color};
				}
				.q-comment-help-box-title{
					font-weight:500;
					text-align:center;	
				}
				.q-comment-help-box-body{
					background-color:${grey[800]};
				}
				.q-comment-help-box{
					width:200px;
					min-height:100px;
					padding:10px;
					background-color:${grey[800]};
					color:#eee;
				}
				.q-comment-controls{
					//width:100%;
						display:flex;
					flex-direction:column;
					align-items:flex-end;
					justify-content:flex-end;
					margin-left:5px;
					margin-right:5px;
					
				}
				.q-comment-controls-row{
					width:100%;
					display:flex;
					flex-wrap:wrap;
					justify-content:space-between;
					margin-top:4px;
				}
				
				.q-comment-action-menu-item{
					font-size:1.0rem !important;
					height:16px;
				}
				.q-comment-popper{ 
					z-index:10;
				}
				.q-comment-affix-top-remnant{
					position:absolute;
					top:0;
					right:0px;
					//width:0pxzz;
					z-index:9;
				}
				.q-comment-affix-button-remnant{
					z-index:90;
					font-size:0.7srem;
					color:${theme == 1 ? blue[600] : blue[200]} !important;
					//width:240px;
					//opacity:0.6; 
			
				}
				.q-comment-affix-button{
					z-index:90;
					font-size:0.7rem;
					background-color:${theme == 1 ? blue[600] : blue[200]} !important;
					width:600px;
					opacity:0.6;
			
				}
				.q-comment-affix-top{
					position:fixed;
					top:0;
					z-index:9;
				}
				.q-comment-affix-bottom{
					position:fixed;
					bottom:0;
					z-index:9;
					}
				.q-comment-affix-bottom-text{
					color:#fff;
				}
				.q-comment-text-remnant{ 

				}
				.q-comment-show-new-reply{
					font-size:0.7rem;
				}
				.q-comment-bottom-wrap{
					width:100%;
					display:flex;
					justify-content:space-between;		
				} 
				.q-comment-bottom-outer-wrap{
					width:100%;
					display:flex;
					justify-content:space-between;	
					flex-wrap:wrap;	
				}
				.q-comment-bottom-right-msg{
					//width:140px;
					font-size:0.7rem;
				}
				.q-comment-section-inner{
				
				}
				.q-comment-section-logo{
					width:32px; 
					height:32px;		
				}
				.q-comment-sticky-logo{
					width:26px;
					height:26px;	
					opacity:0.9;	
				}
				.q-comment-section-title{
					font-weight:500;
					font-size:1.0rem !important;
					display:flex;
					align-items:center;
					margin-bottom:0px;
					margin-top:40px;
				}
				.q-comment-text-button{
					color:${theme == 1 ? blue[600] : blue[200]}
					opacity:0.8;
					margin-right:10px;
					font-size:0.7rem !important;
				
				}
				.q-comment-send-button{
					color:#fff; 
					opacity:0.8;
					font-size:0.7rem;
					margin-right:10px;
					margin-bottom:20px;
					width:80px; 
				} 
				.q-comment-send-button-disabled{
					//opacity:0.6;
					
				}
				
				
				.q-comment-text-wrap{
					padding: 5px 5px 5px 5px;
					width:100%;
					
				}
				.q-comment-outer-wrap{
					//position:absolute:
					margin-bottom:10px;
					display:flex;
					flex-direction:column;
					align-items:flex-end;
					width:96%;
					//min-width:328px;
					padding-top:12px;

					border-radius:25px !important;
					border:thin ${blue[100]} solid
				}
				.q-comment-outer-wrap-stickie{
					//position:absolute;
					//min-width:328px;
					width:96%;
					margin-bottom:10px;
					display:flex;
					flex-direction:column;
					align-items:flex-start;
				
					padding-top:12px;

					border-radius:25px !important;
					border:thin ${blue[100]} solid
				}
				.q-comment-outer-wrap-stickie-small{
					//position:absolute;
					//min-width:328px;
					width:100%;
					margin-bottom:10px;
					display:flex;
					flex-direction:column;
					align-items:flex-start;

					padding-top:12px;

					//border-radius:25px !important;
					//border:thin ${blue[100]} solid
				}
				.q-comment-outer-wrap-quiet{ 
					margin-top:0px;
					margin-bottom:0px;
					display:flex;
					flex-direction:column;
					align-items:flex-end;
					margin-right:10px;
					padding-top:0px;

				}
				.q-comment-text-inner{
					padding: 5px 20px 5px 5px;
					display:flex;
					flex-direction:column;
					align-items:flex-end;
					
				}
				.q-comment-text-label{
					margin-top:10px;
					margin-bottom:10px;
					margin-left:0px;
					font-size:0.8rem !important;
					font-weight:500;
				}
				.q-comment-text-input{
					width:100%;
					font-size:0.9rem !important; 
					padding:6px !important; 
					resize:none;
					//height:36px !important;
					font-family:inherit;
					border-radius:3px !important;
				}
				.q-comment-text-input0{
					width:100%;
					font-size:0.9rem !important; 
					padding:6px !important; 
					resize:none;
					//height:36px !important;
					font-family:inherit;
					border-radius:3px !important;
				}
				.q-comment-text-input-default{
					width:100%;
					//height:36px !important;
					font-size:0.9rem !important; 
					padding:6px !important; 
					resize:none;
					font-family:inherit;
					border-radius:3px !important;
				}
				.q-comment-text-input-focused{
					border-color:${red[500]} !important;
				
				}
				.q-comment-text-input.textarea{
					resize:none;
					border-radius:6px !important;
				}
			`}
            </style>
        </div >
    }
}
/*
<Tooltip title="Reply">
																			<Image onClick={(event) => { actions.updateOnlineState({ cqid: topic.get("threadid") }, true); }}
																				style={{ height: 20, marginBottom: 0, opacity: isHovering1 ? 1.0 : selected ? 0.7 : 0.3 }} src={(Root.__STORY__ ? "http://dev.qwiket.com" : "") + "/static/css/qlogoplus.png"} />
																		</Tooltip>
																		*/
QwiketComment.propTypes = {
    level: PropTypes.number.isRequired,
    topic: PropTypes.object.isRequired,
    updateQwiketState: PropTypes.func.isRequired, //(xid,updatePOJSO)

    globals: PropTypes.object.isRequired,

    baseThreadid: PropTypes.string,
    rootThreadid: PropTypes.string,
    channel: PropTypes.string,
    columnType: PropTypes.string, 				//feed,story-qwikets, disq-tids,sticky-qwikets,story-stickies,comments,newsline,context
    forceShow: PropTypes.bool,
    qparams: PropTypes.object,

};






function mapStateToProps(state) {
    return {
        context: state.context,
        session: state.session,
        globals: state.session,
        user: state.user,
        app: state.app

    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            updateOpenEditor, fetchDraftQwiket, unshareNewslineQwiket, localUpdateQwiket, saveQwiket, publishQwiket, updateOnlineState, fetchComments: debounce(fetchComments, 1000, { trailing: false, leading: true }), unpublishQwiket, fetchShowQwiket,
        }, dispatch)
    }
}
QwiketComment = withTheme(QwiketComment)
QwikieEditor = withTheme(QwikieEditor)
const BoundQwiketComment = connect(mapStateToProps, mapDispatchToProps)(QwiketComment);
QwiketComment = connect(mapStateToProps, mapDispatchToProps)(QwiketComment);
Qwikie = connect(mapStateToProps, mapDispatchToProps)(Qwikie);
QwikieEditor = connect(mapStateToProps, mapDispatchToProps)(QwikieEditor);
