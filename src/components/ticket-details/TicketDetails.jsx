import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import axios from "axios";
import $ from "jquery";
import queryString from "query-string";
import TicketDetailsHeader from "./resources/TicketDetailsHeader";
import SendMessageTeamsBox from "./resources/TeamsSendMessage";
import TeamsConferenceWindow from "./resources/TeamsConferenceWindow";
import OutLookWindow from "./resources/OutlookWindow";
import { ticketApiUrls, rcaApiUrls, userApiUrls, adminApiUrls, teamsConfiguration, masterApiUrls, requestFormApiUrls } from "../../util/apiManager";
import { getServiceCodesAws, getCategoryCodesAws, createAwsSupportTicket, timeZonesBehalfOfUser } from "../../actions/ticketing/ticketMain"
import { generateToken } from './../../actions/commons/commonActions';
import "./resources/page.css";
import ReactDOMServer from 'react-dom/server';
import { AWS_SEVERITY_TYPE, AWS_ISSUE_TYPE } from "../../constants/index";
import { successToast, failureToast } from '../../actions/commons/toaster';
import Loader from '../resources/Loader';
/* jobs */
import { TemplateList } from '../../screens/Template/TemplateList';
import { JobsAPI } from '../../api';
import ShowMoreText from 'react-show-more-text';
import SuggestedSOP from '../resources/SuggestedSOP';
import { JOB_TYPE_URL_SEGMENTS } from '../../constants';
import JobOutput from '../../screens/Job/JobOutput';
import { WorkflowOutput } from '../../screens/Job/WorkflowOutput';
import parse from 'html-react-parser';


class TicketDetails extends Component {
    constructor(props) {
        super(props);
        this.query = queryString.parse(this.props.location.search);
        this.state = this.getInitialState();
        this.onSelectedChannel = this.onSelectedChannel.bind(this);
        this.initiateRCA = this.initiateRCA.bind(this);
        this.postReply = this.postReply.bind(this);
    }

    getInitialState = () => ({
        selectedTicketClientId: this.query.clientId,
        featureId: this.query.featureId,
        viewTicket: [],
        ticketStory: [],
        hasShowTeamsSendBox: false,
        hasShowTeamsConferenceWindow: false,
        hasShowOutLookWindow: false,
        teamsList: [],
        getChannelsList: [],
        teamId: "",
        channelId: "",
        teamsSendMessage: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        timeZone: "",
        location: "",
        emailAddress: '',
        meetingDetails: "",
        ticketSubject: "",
        ticketDescription: "",
        assignee: "",
        descforAssignee: "",
        departmentId: "",
        descforDepart: "",
        isEscalated: false,
        issueType: AWS_ISSUE_TYPE[0],
        severityCode: AWS_SEVERITY_TYPE[0],
        hasShowAutomationTemplates: false,
        loading: false,
        hasShowEditTicket: false,
        ticketStatus: '',
        ticketPriority: '',
        onTeamsMessageChange: '',
        suggestionArticles: [],
        suggestionArticlesTags: [],
        currentJob: {},
        jobType: '',
        hasShowOutputWindow: false
    })

    message = (e) => {
        this.setState({ msgContent: e.target.value });
    }

    async onFileChange(e) {
        e.preventDefault();
        await this.fileUpload(e.target.files[0]);
    }

    async fileUpload(file) {
        const { generateToken, failureToast, successToast } = this.props;
        this.setState({ loading: true });
        var formData = new FormData();
        formData.append('clientId', this.state.selectedTicketClientId);
        formData.append('userId', this.props.userId);
        formData.append('files', file);
        const { generateToken: apiToken } = await generateToken();
        formData.append('apiToken', apiToken);
        let headers = {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        };
        const self = this;
        axios.post(masterApiUrls.uploadFile, formData, headers)
            .then((res) => {
                const { status, message } = res.data;
                if (status !== 200) {
                    const text = typeof message === "string" ? message : "Something went wrong while uploading!";
                    return failureToast(text);
                }
                self.setState(prevState => {
                    const addAttachments = [...prevState.addAttachments, {
                        "fileUrl": res.data.data.link,
                        "fileName": file.name,
                        "key": res.data.data.key
                    }];
                    return ({ addAttachments });
                });
                successToast("Successfully upload the file!");
            }).catch((err) => {
                typeof err.message === "string" ?
                    failureToast(err.message) : failureToast("Something went wrong. Please try again!");
            }).finally(() => {
                self.setState({ loading: false });
            });
    }

    emailAddr(e) {
        this.setState({ email: e.target.value });
    }
    ticketTime(e) {
        this.setState({ tickettime: e.target.value });
    }

    closeTicket(e) {
        this.setState({ closeticket: true });
        if (e.target.checked === true || e.target.checked === "true") {
            this.setState({ setLocation: true });
        } else {
            this.setState({ setLocation: false });
        }
    }
    location(e) {
        this.setState({ location: e.target.value });
    }
    async componentDidMount() {
        $(".modal-backdrop").remove();
        $('body').removeClass('modal-open');
        this.setState({
            paramsID: parseInt(this.props.match.params.ticketId)
        }, async () => {
            await this.getTicketDetails();
            this.getTimezones();
        });
        this.onLunchTemplateAddExtraParams();
    }

    async getTicketDetails() {
        const { userId, failureToast } = this.props;
        const { selectedTicketClientId, paramsID } = this.state;
        const { generateToken } = await this.props.generateToken();
        const { featureId } = this.state;
        var query = `&userId=${userId}&clientId=${selectedTicketClientId}&featureId=${featureId}&apiToken=${generateToken}`;
        this.setState({ loading: true });
        await axios.get(`${ticketApiUrls.ticketDetails}` + paramsID + query)
            .then((res) => {
                const ticketResult = res?.data?.data;
                this.setState({ loading: false });
                if (ticketResult) {
                    const defaultEmail = ticketResult?.ticketDetails?.length ? ticketResult.ticketDetails[0]["emailId"] : "";
                    this.setState(
                        {
                            viewTicket: ticketResult.ticketDetails,
                            ticketStory: ticketResult.ticketStory,
                            email: defaultEmail,
                            ticketDescription: Array.isArray(ticketResult.ticketDetails) && ticketResult.ticketDetails[0] && ticketResult.ticketDetails[0].description,
                            awsCaseDescription: Array.isArray(ticketResult.ticketDetails) && ticketResult.ticketDetails[0] && ticketResult.ticketDetails[0].description,
                            ticketSubject: Array.isArray(ticketResult.ticketDetails) && ticketResult.ticketDetails[0] && ticketResult.ticketDetails[0].subject,
                            awsCaseSubject: Array.isArray(ticketResult.ticketDetails) && ticketResult.ticketDetails[0] && ticketResult.ticketDetails[0].subject,
                        }
                    );
                }
                if (res.data.status !== 200) {
                    typeof res?.data?.message === "string" ?
                        failureToast(res.data.message) : failureToast("Something went wrong!");
                }
            }).catch(err => {
                // this.setState({ loading: false });
            });
    }

    async InitiateSubmit(ticketId, view) {
        const { failureToast, successToast, userId } = this.props;
        if (this.state.initiatePATxt) {
            return failureToast('This ticket already initiated!');
        }

        const { selectedTicketClientId, featureId } = this.state;
        let { generateToken } = await this.props.generateToken();
        let initiatePost = {
            "ticketId": ticketId,
            "clientId": selectedTicketClientId,
            "featureId": featureId,
            "plannedActivityData": `${ticketId} ${view.ticketTypeDesc}`,
            "userId": userId,
            "apiToken": generateToken
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        };
        axios.post(`${ticketApiUrls.initiatePlannedActivity}`, initiatePost, axiosConfig)
            .then((res) => {
                const isString = (typeof res.data.message === "string");
                if (res.data.status !== 200) {
                    return isString ? failureToast(res.data.message) : failureToast("Something went wrong!");
                }
                this.setState({ initiatePATxt: true });
                return isString ? successToast(res.data.message) : successToast("Success!");
            });
    }

    async filterTicketOptions() {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        };
        const { selectedTicketClientId, featureId } = this.state;
        const { userId } = this.props;
        let { generateToken } = await this.props.generateToken();
        let post = {
            "skip": 0,
            "limit": 100,
            "apiToken": generateToken,
            "actionBy": userId,
            "clientId": selectedTicketClientId,
            "featureId": featureId
        }
        axios.post(`${userApiUrls.getUserDashboard}`, post, axiosConfig)
            .then((res) => {
                const usersList = res.data["data"];
                this.setState({ usersList, loading: false });
            });
    }

    async groupFilterOptions() {
        const { userId } = this.props;
        const { selectedTicketClientId } = this.state;
        let { generateToken } = await this.props.generateToken();
        // we are calling admin api, so sending internalcall as 1;
        let uri = `${adminApiUrls.groupsMappedToClient_v2}${selectedTicketClientId}&userId=${userId}&apiToken=${generateToken}&internalCall=${1}`;
        axios.get(uri)
            .then((res) => {
                const groupsList = res.data["data"];
                this.setState({ groupsList, loading: false });
            });
    }

    onTeamsMessage = (e) => {
        e.preventDefault();
        this.setState({ hasShowTeamsSendBox: true }, () => this.getTeamsList());
    }

    onTeamsConferenceOpen = (e) => {
        e.preventDefault();
        const self = this;
        this.setState({ hasShowTeamsConferenceWindow: true }, () => self.getTeamsAndChannelsList());
    }

    getTeamsAndChannelsList = async () => {
        const { teamsList, getChannelsList } = this.state;
        if (Array.isArray(teamsList) && teamsList.length && Array.isArray(getChannelsList) && getChannelsList.length) {
            return;
        }
        const self = this;
        const allTeams = await this.getAllTeams() || teamsList;
        Array.isArray(allTeams) && allTeams.map((team, index) => self.getChannelsList(index, team.id));
    }

    onOutlookConference = (e) => {
        e.preventDefault();
        this.setState({ hasShowOutLookWindow: true });
    }

    onCloseWindow = (e, window) => {
        e && e.preventDefault();
        this.setState({
            [window]: false,
            teamId: "",
            channelId: ""
        });
    }

    componentDidUpdate(prevProps, preState) {
        if (this.props.clientId !== preState.selectedTicketClientId) {
            return this.props.history.push('/ticket-list');
        }
        this.state.hasShowTeamsSendBox && this.enableCaret();
        $(document).ready(function () {
            var showChar = 40;
            var ellipsestext = "...";
            var moretext = "more";
            var lesstext = "less";
            $('.more').each(function () {
                var content = $(this).html();
                if (content.length > showChar) {
                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar - 1, content.length - showChar);
                    var html = c + '<span class="moreelipses">' + ellipsestext + '</span>&nbsp;<span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
                    $(this).html(html);
                }
            });

            $(".morelink").click(function () {
                if ($(this).hasClass("less")) {
                    $(this).removeClass("less");
                    $(this).html(moretext);
                } else {
                    $(this).addClass("less");
                    $(this).html(lesstext);
                }
                $(this).parent().prev().toggle();
                $(this).prev().toggle();
                return false;
            });
        });
    }

    enableCaret = () => {
        var toggler = document.getElementsByClassName("caret");
        this.eventListenerAdded = this.eventListenerAdded || false;
        var i;
        if (!this.eventListenerAdded) {
            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function () {
                    this.parentElement.querySelector(".nested").classList.toggle("active-team");
                    this.classList.toggle("caret-down");
                    this.eventListenerAdded = true;
                });
            }
        }
    }

    getTeamsList = () => {
        this.getAllTeams();
    }

    getAllTeams = async () => {
        const { userId, generateToken } = this.props;
        const { selectedTicketClientId: clientId, teamsList } = this.state;
        const { generateToken: apiToken } = await generateToken();
        if (Array.isArray(teamsList) && !teamsList.length) {
            this.setState({ loading: true });
            return axios.post(teamsConfiguration.getTeamsList, { clientId, userId, apiToken })
                .then(res => {
                    const { data } = res?.data || {};
                    const { value } = data || {};
                    this.setState({ loading: false });
                    this.setState({ teamsList: value });
                    return value;
                }).catch(err => {
                    console.log(err);
                    this.setState({ loading: true });
                });
        }
    }

    getChannelsList = async (teamIndex, teamId) => {
        const { userId, generateToken } = this.props;
        const { selectedTicketClientId: clientId, getChannelsList } = this.state;
        const { generateToken: apiToken } = await generateToken();
        if (Array.isArray(getChannelsList) && !getChannelsList[teamIndex]) {
            this.setState({ loading: true });
            axios.post(teamsConfiguration.getChannelsList, { clientId, userId, apiToken, teamId })
                .then(res => {
                    const { data } = res?.data || {};
                    const { value } = data || {};
                    this.setState({ loading: false });
                    this.setState(prevState => {
                        const prevChannels = prevState.getChannelsList;
                        const newArray = [...prevChannels];
                        newArray[teamIndex] = value;
                        return { getChannelsList: newArray };
                    });
                }).catch(err => {
                    this.setState({ loading: false });
                    console.log(err);
                });
        }
    }

    onTeamsMessageChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSelectedChannel(e, teamId, channelId) {
        this.setState({ teamId, channelId });
    }

    sendTeamsMessage = async (e) => {
        e.preventDefault();
        const { failureToast, successToast } = this.props;
        const { channelId, teamId, selectedTicketClientId: clientId, teamsSendMessage: chatMessage, paramsID, ticketSubject } = this.state;
        if (!(chatMessage.trim())) {
            return failureToast('Please Enter Text Message!');
        }
        if (!(channelId.trim()) || !(teamId.trim())) {
            return failureToast('Please Select Team/Channel!');
        }
        const { generateToken, userId } = this.props;
        let message = <>
            <p><b>SUBJECT :</b>{ticketSubject} </p>
            <p><b>TicketId :</b>{paramsID} </p>
            <br />
            <hr />
            <p style={{ color: '#f74d4d' }}>{chatMessage}</p>
        </>
        message = ReactDOMServer.renderToStaticMarkup(message);
        const { generateToken: apiToken } = await generateToken();
        this.setState({ loading: true });
        axios.post(teamsConfiguration.sendMessageInChannelBehalfOfUser, { clientId, userId, apiToken, teamId, channelId, chatMessage: message })
            .then(res => {
                const { status } = res.data;
                this.setState({ loading: false });
                if (Number(status) === 200) {
                    this.setState({ hasShowTeamsSendBox: false, teamsSendMessage: "" });
                    successToast('Message sent successfully!');
                }
            }).catch(err => {
                this.setState({ loading: false });
                console.log(err);
            });
    }

    onSubmitConference = async (e) => {
        e.preventDefault();
        const { userId, generateToken, failureToast, successToast } = this.props;
        const { meetingDetails, channelId, selectedTicketClientId: clientId, teamId, paramsID } = this.state;
        const { startDate, startTime, endDate, endTime, timeZone, location } = this.state;
        const startDateTime = `${startDate}T${startTime}:00`;
        const endDateTime = `${endDate}T${endTime}:00`;
        const { generateToken: apiToken } = await generateToken();
        const subject = `Ticket #${paramsID} -- ${meetingDetails}`;
        const emailAddress = this.state.emailAddress.split(',');
        // const convertedStartDate = moment.tz(`${startDate}T${startTime}:00`, timeZone);
        // const convertedEndDate = moment.tz(`${endDate}T${endTime}:00`, timeZone);
        const payload = { endDateTime: endDateTime, startDateTime: startDateTime, userId, apiToken, clientId, teamId, channelId, subject, timeZone, location, emailAddress };
        axios.post(teamsConfiguration.scheduleMeetingBehalfOfUser, payload)
            .then(res => {
                const { status, message } = res.data;
                if (status === 200) {
                    this.setState({ hasShowTeamsConferenceWindow: false });
                    return successToast(message);
                }
                failureToast(message);
            });
    }

    onModalOpen = (id) => {
        $(`#${id}`).modal('show');
    }

    onModalClose = (id) => {
        $(`#${id}`).modal('hide');
        this.setState({ isEscalated: false });
    }

    onEscalatedWindowOpen = () => {
        this.setState({ isEscalated: true }, () => this.onModalOpen('assigneModal'));
    }

    async assignTicket(ticketid, assigneModal) {
        const { successToast, failureToast, userId } = this.props;
        const { assignee, descforAssignee, featureId, selectedTicketClientId } = this.state;
        this.setState({ loading: true });
        let { generateToken } = await this.props.generateToken();
        let reqParamsAssign = {
            "clientId": selectedTicketClientId,
            "assignedTo": assignee,
            "assignedToSubject": descforAssignee,
            "ticketId": ticketid,
            "userId": userId,
            "featureId": featureId,
            "createdBy": userId,
            "apiToken": generateToken
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        };
        this.setState({ isEscalated: false, loading: true });
        axios.post(`${ticketApiUrls.assignStaff}`, reqParamsAssign, axiosConfig)
            .then(async (res) => {
                const isString = typeof res.data.message === "string";
                this.setState({ loading: false });
                if (res.data.status !== 200) {
                    return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again!");
                }
                this.setState(this.getInitialState());
                this.onModalClose(assigneModal);
                successToast('Ticket assigned successfully!');
                await this.getTicketDetails();
            });
    }

    async DepartmentTransfer(ticketid, modalWindowId) {
        this.setState({ loading: true });
        const { failureToast, successToast, userId } = this.props;
        const { departmentId, featureId, descforDepart, selectedTicketClientId } = this.state;
        let { generateToken } = await this.props.generateToken();
        let reqParamsDeptTransfer = {
            "ticketId": ticketid,
            "clientId": selectedTicketClientId,
            "featureId": featureId,
            "userId": userId,
            "deptId": departmentId,
            "createdBy": userId,
            "apiToken": generateToken
        }
        if (descforDepart.trim()) {
            reqParamsDeptTransfer.note = descforDepart.trim();
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        };
        axios.post(`${ticketApiUrls.transferDept}`, reqParamsDeptTransfer, axiosConfig)
            .then(async (res) => {
                const isString = typeof res.data.message === "string";
                this.setState({ loading: false });
                if (res.data.status === 200) {
                    successToast(res.data.message);
                    this.setState(this.getInitialState());
                    this.onModalClose(modalWindowId);
                    await this.getTicketDetails();
                }
            }).catch(() => {
                failureToast("Something went wrong. Please try again!");
            });
    }

    async escalateTicket(ticketid, clientId, modalWindowId) {
        const { successToast, failureToast, userId } = this.props;
        if (!this.state.assignee) {
            return failureToast(" Please select the assignee!");
        }
        this.setState({ loading: true });
        let { generateToken } = await this.props.generateToken();
        let reqParamsEscalate = {
            "ticketId": ticketid,
            "clientId": clientId,
            "userId": userId,
            "featureId": this.state.featureId,
            "escalatedTo": this.state.assignee,
            "createdBy": userId,
            "apiToken": generateToken
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        };
        axios.post(`${ticketApiUrls.escalateTicket}`, reqParamsEscalate, axiosConfig)
            .then((res) => {
                const isString = typeof res.data.message === "string";
                this.setState({ loading: false });
                if (res.data.status !== 200) {
                    this.onCloseWindow('', modalWindowId);
                    failureToast(res.data.message);
                } else {
                    this.onModalClose(modalWindowId);
                    this.setState({ assignee: "", descforAssignee: "", isEscalated: false });
                    this.onCloseWindow('', modalWindowId);
                    successToast(res.data.message);
                }
            });
    }

    getServiceCodesAws = async () => {
        const { failureToast, userId } = this.props;
        const { generateToken } = await this.props.generateToken();
        this.setState({ loading: true });
        const self = this;
        this.props.getServiceCodesAws(userId, generateToken)
            .then(res => {
                self.setState({ loading: false });
                if (res && res.status !== 200) {
                    return failureToast(res.message);
                }
                const id = Array.isArray(res.data) && res.data[0]['code'];
                self.getCategoryCodesAws(id);
            });
    }
    async getCategoryCodesAws(serviceCode) {
        const { failureToast, userId, successToast } = this.props;
        const { generateToken } = await this.props.generateToken();
        this.setState({ loading: true });
        const self = this;
        this.props.getCategoryCodesAws(serviceCode, userId, generateToken)
            .then(res => {
                self.setState({ loading: false });
                if (res && res.status !== 200) {
                    return failureToast(res.message);
                }
            });
    }

    onAWSCreateCaseSubmit = async () => {
        const { featureId, userId, createAwsSupportTicket, match: { params }, failureToast, successToast, awsServiceCodes, awsCategoryCodes } = this.props;
        const { awsCaseDescription, categoryCode, issueType, severityCode, awsCaseSubject, serviceCode, selectedTicketClientId: clientId } = this.state;
        let { generateToken: apiToken } = await this.props.generateToken();
        const payload = { ticketId: parseInt(params.ticketId), serviceCode, apiToken, featureId, userId, description: awsCaseDescription, subject: awsCaseSubject, categoryCode, severityCode, issueType, clientId };
        const self = this;
        if (!awsCaseSubject) {
            return failureToast("Subject required!");
        }
        if (!awsCaseDescription) {
            return failureToast("description required!");
        }
        if (!serviceCode) {
            payload['serviceCode'] = Array.isArray(awsServiceCodes) ? awsServiceCodes[0]['code'] : "";
        }
        if (!categoryCode) {
            payload['categoryCode'] = Array.isArray(awsCategoryCodes) ? awsCategoryCodes[0]['code'] : "";
        }
        this.setState({ loading: true });
        createAwsSupportTicket(payload).then(res => {
            self.setState({ loading: false });
            if (res && res.status !== 200) {
                $('#awsCreateCaseModal').toggle();
                $(".modal-backdrop").remove();
                return failureToast(res.message);
            }
            $('#awsCreateCaseModal').toggle();
            return $(".modal-backdrop").remove();
        });
    }

    onAWSCaseCancel = () => {
        const { viewTicket } = this.state;
        this.setState({
            awsCaseDescription: Array.isArray(viewTicket) && viewTicket[0] && viewTicket[0].description,
            awsCaseSubject: Array.isArray(viewTicket) && viewTicket[0] && viewTicket[0].subject,
            serviceCode: "",
            categoryCode: "",
            severityCode: AWS_SEVERITY_TYPE[0],
            issueType: AWS_ISSUE_TYPE[0],
        });
    }

    async initiateRCA(ticketid) {
        try {
            const { successToast, userId, failureToast } = this.props;
            const { selectedTicketClientId, featureId, viewTicket } = this.state;
            let { generateToken } = await this.props.generateToken();
            let initiateRCAPost = {
                "ticketId": ticketid,
                "actionBy": userId,
                "userId": userId,
                "clientId": selectedTicketClientId,
                "featureId": featureId,
                "apiToken": generateToken,
                "deptId": viewTicket[0]["deptId"],
                "assignedTo": viewTicket[0]["assignedTo"]
            }
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            };
            this.setState({ loading: true });
            axios.post(`${rcaApiUrls.initiateRca}`, initiateRCAPost, axiosConfig)
                .then((res) => {
                    const isString = typeof res.data.message === "string";
                    if (res.data.status !== 200) {
                        this.setState({ loading: false });
                        return isString ?
                            failureToast(res.data.message) : failureToast("Something went wrong!");
                    } else {
                        this.setState({ initiateRCATxt: true, loading: false });
                        return isString ? successToast(res.data.message) : successToast("initiated RCA successfully!");
                    }
                }).catch((err) => {
                    console.log(err);
                    this.setState({ loading: false });
                    failureToast("Something went wrong!");
                });
        } catch (e) {
            this.setState({ loading: false });
            failureToast("Something went wrong. Please try again!");
        }
    }

    updateTicket = async (ticketId, clientId, type = { isAccept: false, isResolved: false, isUpdate: false }) => {
        const { generateToken, userId, featureId, successToast, failureToast } = this.props;
        const payload = {
            ticketId, clientId, userId, featureId
        };
        const { stateList } = this.props.getAllMasterData || {};
        //"Work In Progress"
        payload['updateKeys'] = {};
        if (type.isAccept) {
            const InProgressObj = Array.isArray(stateList) && stateList.filter(list => {
                return list?.name?.toLowerCase() === 'work in progress';
            });
            payload['updateKeys']['state'] = Array.isArray(InProgressObj) && InProgressObj.length ? InProgressObj[0].id : undefined;
        }
        if (type.isResolved) {
            const resolvedObj = Array.isArray(stateList) && stateList.filter(list => {
                return list?.name?.toLowerCase() === 'resolved';
            });
            payload['updateKeys']['state'] = Array.isArray(resolvedObj) && resolvedObj.length ? resolvedObj[0].id : undefined;
        }
        if (type.isUpdate) {
            payload['updateKeys']['state'] = this.state.ticketStatus ? this.state.ticketStatus : undefined;
            payload['updateKeys']['priorityId'] = this.state.ticketPriority ? this.state.ticketPriority : undefined;
        }
        const { generateToken: apiToken } = await generateToken();
        payload['apiToken'] = apiToken;
        this.setState({ loading: true });
        return axios.put(`${ticketApiUrls.updateTicket}`, payload)
            .then(res => {
                this.setState({ loading: false });
                if (Number(res?.data?.status) === 200) {
                    successToast(res.data.message);
                    this.getTicketDetails();
                    return res;
                }
                failureToast(res.data.message);
                return res;
            })
    }

    postReply(ticketid, jobSubject) {
        this.setState({ loading: true });
        const { userId, successToast, failureToast } = this.props;
        const { featureId, email, msgContent,
            tickettime, location,
            closeticket, selectedTicketClientId, addAttachments } = this.state;
        let reqParamsPostReply = {
            "clientId": selectedTicketClientId,
            "userId": userId,
            "featureId": featureId,
            "ticketId": ticketid,
            "createdBy": userId
        };
        if (!jobSubject && Array.isArray(addAttachments) && addAttachments.length) {
            reqParamsPostReply["attachments"] = addAttachments;
        }
        if (!jobSubject && email) {
            reqParamsPostReply.copyTo = email;
        }
        if (jobSubject || msgContent?.trim()) {
            reqParamsPostReply.message = jobSubject || msgContent.trim();
        }
        if (!jobSubject && tickettime) {
            const time = tickettime.split(':');
            reqParamsPostReply.timeSpentInMinutes = (parseInt(time[0]) * 60) + Number(time[1]);
        }
        if (!jobSubject && location) {
            reqParamsPostReply.location = location;
        }
        if (!jobSubject && closeticket) {
            reqParamsPostReply.isTicketClosed = closeticket;
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        };
        this.setState({ loading: true });
        this.props.generateToken().then((data) => {
            reqParamsPostReply.apiToken = data.generateToken;
            axios.post(`${ticketApiUrls.postReply}`, reqParamsPostReply, axiosConfig).then(async (res) => {
                this.setState({ loading: false });
                const isString = typeof res.data.message === "string";
                if (res.data.status !== 200) {
                    $(`#postReplyModal`).modal('hide');
                    return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again!");
                }
                await this.getTicketDetails();
                $(`#postReplyModal`).modal('hide');
                this.onPostReplyCancel();
                this.setState({ Postreply: false, addAttachments: [], msgContent: "" }, function () {
                });
                isString ? successToast(res.data.message) : successToast("Ticket Notes Updated Successfully");
            });
        });
    }

    onPostReplyCancel = () => {
        $("#fileControl").val('');
        this.setState({ tickettime: 0, msgContent: "", setLocation: false, location: "" });
    }

    initiateServiceNow = async () => {
        const { userId, generateToken, failureToast, successToast } = this.props;
        const { selectedTicketClientId: clientId, paramsID: ticketId, ticketDescription: description, ticketSubject: subject } = this.state;
        const { generateToken: apiToken } = await generateToken();
        this.setState({ loading: true });
        axios.post(ticketApiUrls.createServiceNowTicket, { userId, clientId, apiToken, ticketId, description, subject })
            .then(res => {
                this.setState({ loading: false });
                if (res.data.status !== 200) {
                    const message = typeof res.data.message === 'string' ? res.data.message : 'Something went wrong!';
                    return failureToast(message);
                }
                const message = typeof res.data.message === 'string' ? res.data.message : 'Ticket initiated servicenow!';
                successToast(message);
            })
    }
    onJobLunch = (resourceId, jobType) => {
        $('#admanceAutomation').modal('hide');
        if (resourceId) {
            this.props.successToast('Job launched Successfully');
            var obj = JSON.stringify({ orchJobId: resourceId, content: `<div class='btn-link'>Click here to see the job out put</div>`, jobType });
            this.postReply(this.state.paramsID, obj);
        }
    }

    onAutomationTemplatesOpen = () => {
        this.setState({ hasShowAutomationTemplates: true });
    }

    detailedBody = (body) => {
        const parseBody = body?.includes('orchJobId') ? JSON.parse(body) : body;
        if (parseBody && parseBody.orchJobId) {
            return <div onClick={() => this.getJobOutput(parseBody.orchJobId, parseBody.jobType)} className='btn btn-link' dangerouslySetInnerHTML={{ __html: parseBody.content }} />
        }

        return <ShowMoreText
            lines={3}
            more='Show more'
            less='Show less'
            className='content-css'
            anchorClass='my-anchor-css-class'
            onClick={this.executeOnClick}
            expanded={false}
            width={280}
        >
            {parse(parseBody || '')}
        </ShowMoreText>
    }

    getJobOutput = async (jobId, jobType) => {
        $('#jobOutput').modal('show');
        $('.modal-backdrop').css('z-index', '101');
        this.setState({ loading: true, hasShowOutputWindow: true, currentJob: {}, jobType: '' });
        const type = JOB_TYPE_URL_SEGMENTS[jobType || 'job'];
        const { data } = await JobsAPI.readDetail(jobId, type);
        this.setState({ currentJob: data, jobType: type, loading: false });
    }

    onEditClick = () => {
        if (!this.state.hasShowEditTicket) {
            this.setState({ hasShowEditTicket: true });
        }
    }
    onChangeEvent = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onEditSave = async (ticketId, clientId) => {
        const updated = await this.updateTicket(ticketId, clientId, { isUpdate: true });
        if (updated) {
            this.setState({ hasShowEditTicket: false, ticketStatus: '', ticketPriority: '' });
        }
    }

    executeOnClick = (isExpanded) => {
        console.log(isExpanded);
    }

    getTimezones = () => {
        const { timeZonesBehalfOfUser } = this.props;
        timeZonesBehalfOfUser({ clientId: this.state.selectedTicketClientId });

    }

    openSOPModal = async () => {
        const { ticketDescription: description, ticketSubject: subject } = this.state;
        const { failureToast } = this.props;
        axios.post(ticketApiUrls.getMatchedArticles, { description, subject })
            .then(res => {
                if (res.data.status !== 200) {
                    return failureToast(res.data.message);
                }
                const { data } = res.data;
                const articles = data?.articles ? data.articles : [];
                var articletags = [];
                for (let v of articles) {
                    articletags = Array.isArray(v.tags)
                        ? [...articletags, ...v.tags]
                        : [...articletags, ...[]];
                }
                this.setState({
                    suggestionArticles: articles,
                    suggestionArticlesTags: articletags
                });
            })
        $("#suggestion").modal("toggle");
    }

    onLunchTemplateAddExtraParams = async () => {
        const { generateToken: apiToken } = await this.props.generateToken();
        const res = await axios.get(`${requestFormApiUrls.getInfraServiceDetails}?userId=${this.props.userId}&apiToken=${apiToken}&ticketId=${this.props.match.params.ticketId}`);
        return (Array.isArray(res.data?.data) && res.data.data.length && res.data.data[0].formatResponse?.extra_vars) ? res.data.data[0].formatResponse : null;
    }

    render() {
        const { hasShowTeamsSendBox, hasShowTeamsConferenceWindow, hasShowOutLookWindow, teamsList, getChannelsList, teamsSendMessage } = this.state;
        const ticketDetails = Array.isArray(this.state.viewTicket) && this.state.viewTicket.length ? this.state.viewTicket[0] : {};
        const { usersList, groupsList } = this.props;
        const { awsCaseDescription, categoryCode, issueType, severityCode, awsCaseSubject, serviceCode, hasShowEditTicket, ticketStatus, ticketPriority, descforDepart, descforAssignee } = this.state;
        const { awsServiceCodes, awsCategoryCodes, timezones } = this.props;
        var location = ["onsite", "remote"];
        const { stateList, priorityList, } = this.props.getAllMasterData || {};
        const isOpenState = ticketDetails.stateDesc?.toLowerCase()?.includes('open');
        const { suggestionArticlesTags, suggestionArticles, hasShowOutputWindow } = this.state;

        return (
            <div id='ticketDetailsSpan'>
                <Loader loading={this.state.loading} />
                <TicketDetailsHeader
                    ticketDetails={ticketDetails}
                    onEditClick={this.onEditClick}
                    stateList={stateList}
                    priorityList={priorityList}
                    hasShowEditTicket={hasShowEditTicket}
                    onChangeEvent={this.onChangeEvent}
                    ticketStatus={ticketStatus}
                    ticketPriority={ticketPriority}
                    onEditSave={this.onEditSave}
                />
                <div className="card" style={{
                    padding: "8px",
                    margin: "10px 15px 0px",
                    marginRight: '15px'
                }}>
                    <div className="card-body">
                        <h5 className="card-title ticket-details-card-title">Quick Action</h5>
                        <div className="btn-group">
                            <button style={{ color: isOpenState ? 'inherit' : '#a9a9a9' }} disabled={isOpenState ? false : true} onClick={() => this.updateTicket(ticketDetails.ticketId, ticketDetails.clientId, { isAccept: true })}><i className="fa fa-check text-secondary"></i>{isOpenState ? 'Accept' : 'Accepted'}</button>
                            <button onClick={() => this.onModalOpen('assigneModal')}><i className="fa fa-user-o text-secondary" ></i> Assign</button>
                            <button onClick={() => this.onModalOpen('departmentTransferModal')}><i className="fa fa-exchange text-secondary" ></i> Transfer</button>
                            <button onClick={this.onEscalatedWindowOpen}><i className="fa fa-arrow-up text-secondary" ></i> Escalate</button>
                            {/* <button>More Action <i className="fa fa-chevron-down text-secondary" ></i></button> */}

                            <button className="btn btn-secondary dropdown-toggle more-dw" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ marginLeft: '11px' }}>
                                More Actions
                                     <i class="fa fa-chevron-down" style={{ color: "#5D5D5D" }}></i>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <button className="dropdown-item more-actions-btns" type="button"
                                    onClick={() => this.initiateRCA(ticketDetails.ticketId)}
                                    disabled={(this.state.initiateRCATxt || ticketDetails.isRcaInitiated) ? true : false}>
                                    {(this.state.initiateRCATxt || ticketDetails.isRcaInitiated) ? 'RCA Initiated' : 'Initiate RCA'}
                                </button>
                                <button className="dropdown-item more-actions-btns" type="button" onClick={() => this.InitiateSubmit(ticketDetails.ticketId, ticketDetails)}>Initiate Change Request</button>
                                <button className="dropdown-item more-actions-btns" type="button" data-toggle="modal" data-target="#awsCreateCaseModal" data-backdrop="static"
                                    onClick={this.getServiceCodesAws}>Create AWS Support Case</button>
                                <button className="dropdown-item more-actions-btns" type="button" data-toggle="modal" data-target="#awsCreateCaseModal" data-backdrop="static"
                                    onClick={this.getServiceCodesAws}>Create Azure Support Ticket</button>
                                <button className="dropdown-item more-actions-btns" type="button" onClick={this.initiateServiceNow}>Initiate ServiceNow Ticket</button>
                            </div>

                        </div>
                        <button className="float-right btn-resolve" style={{ marginRight: '-9px' }} onClick={() => this.updateTicket(ticketDetails.ticketId, ticketDetails.clientId, { isResolved: true })}>
                            <i className="fa fa-file-o" style={{ color: "white" }}></i> Resolve</button>
                    </div>
                    {/* Teams send message box */}
                    {
                        hasShowTeamsSendBox &&
                        <SendMessageTeamsBox
                            onCloseWindow={this.onCloseWindow}
                            hasShowTeamsSendBox={'hasShowTeamsSendBox'}
                            teamsList={teamsList}
                            onCaretOpen={this.getChannelsList}
                            getChannelsList={getChannelsList}
                            teamsSendMessage={teamsSendMessage}
                            sendTeamsMessage={this.sendTeamsMessage}
                            selectedChannelId={this.state.channelId}
                            onSelectedChannel={this.onSelectedChannel}
                            onTeamsMessageChange={this.onTeamsMessageChange}
                            ticketId={ticketDetails.ticketId}
                            loading={this.state.loading}
                        />
                    }
                    {
                        hasShowTeamsConferenceWindow &&
                        <TeamsConferenceWindow
                            onCloseWindow={this.onCloseWindow}
                            hasShowTeamsConferenceWindow={'hasShowTeamsConferenceWindow'}
                            onChange={this.onTeamsMessageChange}
                            onSelectedChannel={this.onSelectedChannel}
                            onSubmitConference={this.onSubmitConference}
                            teamsList={teamsList}
                            getChannelsList={getChannelsList}
                            ticketId={ticketDetails.ticketId}
                            zones={timezones}
                            timeZone={this.state.timeZone}
                            loading={this.state.loading}
                        />
                    }
                    {
                        hasShowOutLookWindow &&
                        <OutLookWindow
                            onCloseWindow={this.onCloseWindow}
                            hasShowOutLookWindow={hasShowOutLookWindow}
                        />
                    }
                </div>
                <div className="row">
                    <div className="col-sm-4" style={{ paddingLeft: '0px', paddingRight: '0px', marginRight: '-15px', marginLeft: '15px' }} >
                        <div className="card card-height" style={{ padding: "8px", margin: "15px", marginRight: "0px", height: '500px', overflowY: 'auto' }}>
                            <div className="card-body">
                                <h5 className="card-title ticket-details-card-title">View {ticketDetails.ticketTypeDesc} Details</h5>
                                <form>
                                    <label>
                                        <span><b class="ticket-details-card-label">Date Created</b></span>
                                        <text class="ticket-details-card-text">{window.DateTimeParser(ticketDetails.createdDate)}</text>
                                    </label>
                                    <label>
                                        <span><b class="ticket-details-card-label">Source</b></span>
                                        <text class="ticket-details-card-text">{ticketDetails.source}</text>
                                    </label>
                                    <label>
                                        <span><b class="ticket-details-card-label">Rule</b></span>
                                        <text class="ticket-details-card-text">{ }</text>
                                    </label>
                                    <label>
                                        <span><b class="ticket-details-card-label">Impact</b></span>
                                        <text class="ticket-details-card-text">{ }</text>
                                    </label>
                                    <label>
                                        <span><b class="ticket-details-card-label">Policy</b></span>
                                        <text class="ticket-details-card-text">{ }</text>
                                    </label>
                                    <br />
                                    <label>
                                        <span><b class="ticket-details-card-label">Description</b></span>
                                        <text class="ticket-details-card-text">{parse(ticketDetails.description || '')}</text>
                                    </label>
                                </form>
                            </div>
                        </div >
                    </div >
                    <div className="col-sm-4" style={{ paddingRight: '0px' }}>
                        <div className="card card-height" style={{ padding: "8px", margin: "15px", height: '500px', overflowY: 'auto' }}>
                            <div className="card-body">
                                <form>
                                    <div className="form-row">
                                        <h5 className="card-title ticket-details-card-title">View Detailed Timeline</h5>
                                        <div className="col-6">
                                        </div>
                                        <div className="col-6">
                                            <button className="button float-right" style={{ padding: '4px 6px' }} data-toggle="modal" data-target="#postReplyModal" onClick={(e) => {
                                                e.preventDefault();
                                            }}> Add Note</button>
                                        </div>
                                    </div>
                                </form>
                                <div className="container mb-3">
                                    <div className="row">
                                        <div className="offset-md-0">
                                            <ul className="timeline" style={{ wordBreak: 'break-word' }}>
                                                {
                                                    Array.isArray(this.state.ticketStory) && this.state.ticketStory.map((story, index) => {
                                                        return <li key={index}>
                                                            <div class="tickets-details-timeline-small" style={{ backgroundColor: "#593CAB27", padding: "2px", width: 'fit-content' }}>
                                                                {window.DateTimeParser(story.createdDate)}</div>
                                                            <div class="ticket-details-timeline-p">{story.actionName}</div>
                                                            <div style={{ textAlign: 'left' }}>{this.detailedBody(story.body)}</div>
                                                        </li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >

                    <div className="col-sm-4" style={{ paddingLeft: '15px', marginLeft: '-15px' }}>
                        <div className="card card-height" style={{ padding: "8px", marginTop: "15px", marginLeft: "0px", height: '500px', overflowY: 'auto' }}>
                            <div className="card-body">
                                <h5 className="card-title ticket-details-card-title">Collaborate</h5>
                                <form>
                                    <label>
                                        <span><b class="ticket-details-card-label">Assignee</b></span>
                                        <text>{ticketDetails.assignedToName}</text>
                                    </label>
                                    <label>
                                        <span><b class="ticket-details-card-label">Department</b></span>
                                        <text>{ticketDetails.deptName}</text>
                                    </label>
                                    <label>
                                        <span><b class="ticket-details-card-label">Send Message</b></span>
                                        <span className="teams-blue-icon" onClick={this.onTeamsMessage}>Teams</span>
                                        <span className="outlook-icon" onClick={this.onOutlookConference}>outlook</span>
                                    </label>
                                    <label>
                                        <span><b class="ticket-details-card-label">Start Conference</b></span>
                                        <span className="teams-blue-icon" onClick={this.onTeamsConferenceOpen}>Teams</span>
                                        <span className="zoom-icon">zoom</span>
                                    </label>
                                    {/* <label>
                                        <span><b class="ticket-details-card-label">Share Status</b></span>
                                        <text>{ }</text>
                                    </label> */}
                                </form>
                                <br />
                                <h5 className="card-title ticket-details-card-title">Advanced Actions</h5>
                                <button type="button" className="button1" style={{ fontSize: "12px", outline: "none", width: '200px' }} onClick={this.openSOPModal}><i className="fa fa-lightbulb-o" aria-hidden="true" style={{ color: "#61c7b9" }}></i>View Suggested SOP</button>
                                <br />
                                <button data-toggle="modal" onClick={this.onAutomationTemplatesOpen} data-target="#admanceAutomation" type="button" className="button1" style={{ fontSize: "12px", outline: "none", width: '200px' }}><i className="fa fa-bolt" aria-hidden="true" style={{ color: "#61c7b9" }}></i> Apply Automations</button>
                                {/* <button type="button" className="button1" style={{ fontSize: "12px", outline: "none", paddingRight: '80px' }}><i className="fa fa-envelope" aria-hidden="true" style={{ color: "#61c7b9" }}></i> Share Status</button> */}
                            </div >
                        </div >
                    </div >
                </div >
                {/* assign modal */}
                <div className="modal" id="assigneModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title ticket-details-modal-header">{this.state.isEscalated ? 'Escalate To' : 'Assign incident to'}</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <Loader loading={this.state.loading} />
                                <form>
                                    <div className="form-group">
                                        <label class="ticket-details-modal-label">Select assignee to this incident</label>
                                        <select className="select-tm" style={{ borderTop: "none" }} name="assignee" value={this.state.assignee || ticketDetails.assignedTo} onChange={this.onTeamsMessageChange}>
                                            <option>Select {this.state.isEscalated ? 'Escalate To' : 'Assignee'}</option>
                                            {
                                                Array.isArray(usersList) && usersList.map(userOptions => {
                                                    return <option key={userOptions.userId} value={userOptions.userId}>{userOptions.userName} </option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label class="ticket-details-modal-label">Comments/Messages for {this.state.isEscalated ? 'Escalate To' : 'assignee'}</label>
                                        <textarea className="form-control" rows="5" onChange={this.onTeamsMessageChange} name="descforAssignee" value={descforAssignee}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-primary ticket-details-modal-save-btn" onClick={() => this.state.isEscalated ? this.escalateTicket(ticketDetails.ticketId, ticketDetails.clientId, 'assigneModal') : this.assignTicket(ticketDetails.ticketId, 'assigneModal')}>Save</button>
                                <button type="button" className="btn btn-cancel mr-auto" data-dismiss="modal">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
                {/* deprt transfer modal */}
                <div className="modal" id="departmentTransferModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title ticket-details-modal-header">Department Transfer</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <Loader loading={this.state.loading} />
                                <form>
                                    <div className="form-group">
                                        <label >Department</label>
                                        <select className="select-tm" style={{ borderTop: "none" }} name="departmentId" value={this.state.departmentId || ticketDetails.deptId} onChange={this.onTeamsMessageChange}>
                                            <option value="">Select Department</option>
                                            {
                                                Array.isArray(groupsList) && groupsList.map((groupOptions) => {
                                                    return <option key={groupOptions.groupId} value={groupOptions.groupId}>
                                                        {groupOptions.name} </option>
                                                })
                                            }
                                        </select>

                                    </div>
                                    <div className="form-group">
                                        <textarea className="form-control" name="descforDepart" onChange={this.onTeamsMessageChange} rows="5" id="comment" placeholder="Note..." value={descforDepart}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-primary" onClick={() => this.DepartmentTransfer(ticketDetails.ticketId, 'departmentTransferModal')}>Transfer</button>
                                <button type="button" className="btn btn-cancel mr-auto" data-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal" id="awsCreateCaseModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header bgcolors">
                                <h5 className="modal-title ticket-details-modal-header" id="exampleModalLabel">Create AWS Case</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={this.onAWSCaseCancel}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ padding: "2rem" }}>
                                <form>
                                    <div className="row no-margin-horizontal">
                                        <div className="form-group row" style={{ width: '100%' }}>
                                            <label htmlFor="subject" className="col-sm-4 col-form-label">Subject :</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control no-border modal-input-height bg-color-input" id="awsCaseSubject"
                                                    value={awsCaseSubject} onChange={this.categoryCode} name="awsCaseSubject" />
                                            </div>
                                        </div>
                                        <div className="form-group row" style={{ width: '100%' }}>
                                            <label htmlFor="description" className="col-sm-4 col-form-label">Description:</label>
                                            <div className="col-sm-8">
                                                <textarea type="text" id="pre_text" style={{ padding: "5px 0 20px 20px", fontSize: "15px" }} name="awsCaseDescription" onChange={this.categoryCode}
                                                    className="form-control no-border modal-input-height bg-color-input" value={awsCaseDescription} ref={(el) => {
                                                        if (el) {
                                                            el.style.setProperty("height", "auto", "important");
                                                        }
                                                    }} />
                                            </div>
                                        </div>

                                        <div className="form-group row" style={{ width: '100%' }}>
                                            <label htmlFor="serviceCode" className="col-sm-4 col-form-label">Service Code:</label>
                                            <div className="col-sm-8">
                                                <select name="serviceCode" onChange={this.serviceCode} value={serviceCode} className="form-control no-border modal-input-height bg-color-input">
                                                    {
                                                        Array.isArray(awsServiceCodes) && awsServiceCodes.map((service) => <option key={service.name} value={service.code}>{service.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row" style={{ width: '100%' }}>
                                            <label htmlFor="categoryCode" className="col-sm-4 col-form-label">Category Code:</label>
                                            <div className="col-sm-8">
                                                <select name="categoryCode" onChange={this.categoryCode} value={categoryCode} className="form-control no-border modal-input-height bg-color-input">
                                                    {
                                                        Array.isArray(awsCategoryCodes) && awsCategoryCodes.map((service) => <option key={service.name} value={service.code}>{service.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row" style={{ width: '100%' }}>
                                            <label htmlFor="severityCode" className="col-sm-4 col-form-label">Severity Code:</label>
                                            <div className="col-sm-8">
                                                <select name="severityCode" onChange={this.categoryCode} value={severityCode} className="form-control no-border modal-input-height bg-color-input">
                                                    {
                                                        Array.isArray(AWS_SEVERITY_TYPE) && AWS_SEVERITY_TYPE.map((severity) => <option key={severity} value={severity}>{severity}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row" style={{ width: '100%' }}>
                                            <label htmlFor="issueType" className="col-sm-4 col-form-label">Issue Type:</label>
                                            <div className="col-sm-8">
                                                <select name="issueType" onChange={this.categoryCode} value={issueType} className="form-control no-border modal-input-height bg-color-input">
                                                    {
                                                        Array.isArray(AWS_ISSUE_TYPE) && AWS_ISSUE_TYPE.map((issue) => <option key={issue} value={issue}>{issue}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="container" style={{ paddingTop: "30px", paddingBottom: "20px" }}>
                                <div className="col-12 right-align justify-content-between">
                                    <button type="button" className="btn btn-align" data-dismiss="modal" onClick={this.onAWSCaseCancel}
                                        style={{
                                            background: '#FFFFFF 0% 0% no-repeat padding-box',
                                            border: '0.5px solid #5C3EB0',
                                            color: '#5C3EB0',
                                            marginRight: '1rem'
                                        }}
                                    >Close</button>
                                    <button type="button" className="btn btn-align button-clor" style={{
                                        background: '#5C3EB0 0% 0% no-repeat padding-box',
                                        color: '#fff'
                                    }} onClick={this.onAWSCreateCaseSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* post reply */}
                <div className="modal" id="postReplyModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title ticket-details-modal-header">Post Reply</h4>
                                <button type="button" className="close" data-dismiss="modal" onClick={this.onPostReplyCancel}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="name">Email address</label>
                                        <input type="text"
                                            id="email"
                                            placeholder="Email"
                                            value={this.state.email}
                                            name="Email" className="input-tm" style={{ width: "100%" }}
                                            onChange={this.emailAddr.bind(this)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <textarea className="form-control" rows="5" id="comment" placeholder="Note..." value={this.state.msgContent} onChange={(e) => { this.message(e) }}></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Time Spent on Tickets:</label>
                                        <input type="time" id="timespent" name="tickettime" onChange={this.ticketTime.bind(this)} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Attach File </label>
                                        <input type="file" id="file" name="file" style={{ border: 0 }} onChange={this.onFileChange.bind(this)} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name"><b>Ticket Status</b> </label>
                                        <label style={{
                                            display: 'inline-block',
                                            marginRight: '10px'
                                        }}> close on Reply</label>
                                        <input type="checkbox" id="close" name="close" defaultChecked={this.state.setLocation} onChange={this.closeTicket.bind(this)} />
                                        {this.state.setLocation === true ?
                                            (<Fragment>
                                                <strong className="pl-2">location : </strong>
                                                <select name="location" style={{ marginRight: '1em' }} onChange={this.location.bind(this)} >
                                                    <option value="">Select location</option>
                                                    {Array.isArray(location) && location.map((loc, i) =>
                                                        <option name="location" key={i} value={loc}>{loc}</option>
                                                    )}
                                                </select>
                                            </Fragment>) : ""}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-primary" onClick={() => this.postReply(ticketDetails.ticketId)}>Post Reply</button>
                                <button type="button" className="btn btn-cancel mr-auto" data-dismiss="modal" onClick={this.onPostReplyCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* admanceAutomation */}
                <div className="modal" id="admanceAutomation" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Apply Automations</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.setState({ hasShowAutomationTemplates: false })}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    {
                                        this.state.hasShowAutomationTemplates &&
                                        <TemplateList
                                            isFromConcierto
                                            onJobLunchFromConcierto={this.onJobLunch}
                                            subject={this.state.ticketSubject}
                                            description={this.state.ticketDescription}
                                            onLunchTemplateAddExtraParams={this.onLunchTemplateAddExtraParams}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* job output */}
                <div className="modal" id='jobOutput' tabIndex="-1" role="dialog"/*  data-backdrop="static" */ data-keyboard="false" ref={(el) => {
                    if (el) {
                        el.style.setProperty("z-index", "104", "important");
                    }
                }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content joboutput-modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title btn btn-link">Job-Results</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {
                                    $('.modal-backdrop').css('z-index', '1040');
                                    this.setState({ hasShowOutputWindow: false, currentJob: {}, jobType: {} })
                                }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <Loader loading={this.state.loading} />
                            <div className="modal-body">
                                {
                                    (hasShowOutputWindow && this.state.currentJob.type && this.state.currentJob.type === 'workflow_job') ? <WorkflowOutput job={this.state.currentJob} /> : null
                                }
                                {
                                    (hasShowOutputWindow && this.state.currentJob.type && this.state.currentJob.type !== 'workflow_job') ? <JobOutput type={this.state.jobType} job={this.state.currentJob} /> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <SuggestedSOP
                    suggestionArticlesTags={suggestionArticlesTags}
                    suggestionArticles={suggestionArticles}
                />
            </div >
        );
    }
}


const mapStateToProps = state => {
    return {
        userId: localStorage.getItem('userId'),
        awsServiceCodes: state.awsServiceCodes,
        awsCategoryCodes: state.awsCategoryCodes,
        featureId: state?.clientUserFeatures?.featureIds?.Tickets,
        usersList: state?.userDirList,
        groupsList: state?.groupsList,
        getAllMasterData: state?.getAllMasterData && Array.isArray(state.getAllMasterData) && state.getAllMasterData.length ? state.getAllMasterData[0] : {},
        clientId: state.current_client?.payload?.client,
        timezones: state.timeZonesBehalfOfUser?.value
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        generateToken,
        getServiceCodesAws,
        getCategoryCodesAws,
        createAwsSupportTicket,
        successToast, failureToast,
        timeZonesBehalfOfUser
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails)