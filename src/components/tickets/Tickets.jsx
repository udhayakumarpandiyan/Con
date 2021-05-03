import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Pagination from '@material-ui/lab/Pagination';
import axios from "axios";
import $ from "jquery";
import ComponentHeader from "../resources/DashboardHeader";
import TicketTable from "./resources/TicketsTable";
import EditTicket from "./resources/EditTicket";
import AddNewTicket from "./resources/AddNewTicket";
import SidePanel from "./resources/SidePanel";

/* enum */
import { TICKET_TABS, TICKET_DASHBOARD_HEAD } from "../../constants/index";
import "./resources/page.css";
import { ticketApiUrls, userApiUrls, adminApiUrls, masterApiUrls } from "../../util/apiManager";
import { groupHelpTopics, generateToken } from '../../actions/commons/commonActions';
import { getGroups as getGroupsMappedToClient } from "../../actions/rca/rcaMain";
import { filterUsers as getAssignedUsersOnBaseClient } from "../../actions/userDirectoryAction/userDirectoryAction";
import { saveMergeTickets } from "../../actions/ticketing/ticketMain";
import Loader from '../resources/Loader';
import { failureToast, successToast } from '../../actions/commons/toaster';

class Tickets extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
        this.editTicket = this.editTicket.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.removeAttachment = this.removeAttachment.bind(this);
        this.addNewTicket = this.addNewTicket.bind(this);
        this.clientDepartmentEdit = this.clientDepartmentEdit.bind(this);
        this.createTicketBtn = React.createRef();
        this.itemsPerPage = 30;
    }

    getInitialState = () => ({
        ticketsData: [],
        isShowSidePanel: false,
        status: '',
        priority: '',
        type: '',
        startDate: '',
        endDate: '',
        checkedTickets: [],
        editTicketRow: {},
        groupsListOnEditClient: [],
        groupsList: [],
        usersList: [],
        isClientEdited: false,
        deptID: '',
        helpTopicsOnEditClient: [],
        helpTopicId: '',
        usersListOnEditclient: [],
        addAttachments: [],
        activePage: 1,
        totalItemsCount: 0,
        loading: false,
        hasShowAddNew: false,
        activeTabIndex: 0,
        hasShowEditTicket: false
    });

    componentDidMount() {
        this.getRequiredInitialDetails();
        $("#ticketSearch").keyup(function (event) {
            if (event.keyCode === 13) {
                $("#searchIcon").click();
            }
        });
        const self = this;
        $("#addNewTicket").click(function () {
            self.setState({ hasShowAddNew: true });
            $('#AddNewTicketModal').modal('show');
        });
    }

    async getRequiredInitialDetails() {
        this.setState({ loading: true });
        await this.basicCall();
        this.getGroups(this.props.clientId);
        this.getUsers(this.props.clientId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clientId !== this.props.clientId) {
            const { activeTabIndex } = this.state;
            this.setState({ ...this.getInitialState(), activeTabIndex });
            // when client has changed, page number would be 1
            this.apiCalls(activeTabIndex, 1);
            this.getGroups(this.props.clientId);
            this.getUsers(this.props.clientId);
            const self = this;
        }
        this.setHasChecked();
    }

    prepareReqBody = (pageNumber) => {
        const { clientId, userId, user_clients,
            masterClient: { clientId: masterClientId }, featureId } = this.props;
        const { status, priority, type, startDate, endDate } = this.state;
        if (!clientId) {
            return failureToast("Access Denied");
        }
        const { activePage, searchText } = this.state;
        const isPayloadAll = clientId === "all";
        let filters = {};
        let postData = {
            "clientId": isPayloadAll ? masterClientId : clientId,
            "userId": userId,
            "featureId": featureId,
            "limitValue": this.itemsPerPage,
            "skipValue": (parseInt(pageNumber) || activePage) ? ((parseInt(pageNumber) || activePage) - 1) * this.itemsPerPage : 0
        };
        if (isPayloadAll) {
            filters["allClientTickets"] = true;
            filters["clientList"] = Array.isArray(user_clients) && user_clients.length ? user_clients.map(x => x.clientId) : []
        }
        if (status) {
            filters["state"] = status;
        }
        if (priority) {
            filters["priorityId"] = priority;
        }
        if (type) {
            filters["ticketTypeId"] = type;
        }
        if (startDate) {
            filters["fromDate"] = `${startDate}T00:00:00.000Z`;
        }
        if (endDate) {
            filters["toDate"] = `${endDate}T23:59:59.000Z`;
        }
        postData["filters"] = filters;
        if (searchText) {
            postData["searchText"] = searchText;
        }
        return postData;
    }

    async basicCall(pageNumber) {
        this.setState({ loading: true, activePage: parseInt(pageNumber) ? parseInt(pageNumber) : this.state.activePage });
        const postData = this.prepareReqBody(pageNumber);
        let { generateToken } = await this.props.generateToken();
        postData["apiToken"] = generateToken;
        const uri = ticketApiUrls.ticketList;
        this.sendReq(uri, postData);
    }

    sendReq = (uri, postData) => {
        axios.post(`${uri}`, postData)
            .then((res) => {
                if (Number(res.data.status) === 200) {
                    return this.setState({
                        ticketsData: res.data.data,
                        totalItemsCount: res.data.ticketCount,
                        loading: false,
                        isTicketPageRendered: false
                    });
                }
                this.setState({ loading: false, isTicketPageRendered: false });
                return typeof res.data.message === "string" ?
                    failureToast(res.data.message) : failureToast("Something went wrong. Please try again");
            }).catch((err) => {
                this.setState({ loading: false, isTicketPageRendered: false });
                typeof err.message === "string" ?
                    failureToast(err.message) : failureToast("Something went wrong. Please try again");
            });
    }

    onTabClick = (index) => {
        this.setState({ ...this.getInitialState(), activeTabIndex: index });
        // when tab changed, page number has to be 1; 
        this.apiCalls(index, 1);
    }

    apiCalls = (index = this.state.activeTabIndex, pageNum = this.state.activePage) => {
        if (index === 0) {
            this.setState({ loading: true });
            this.basicCall(pageNum);
        }
        if (index === 1) {
            this.setState({ loading: true });
            this.myOpenTickets(pageNum);
        }
        if (index === 2) {
            this.setState({ loading: true });
            this.escalatedTickets(pageNum);
        }
        if (index === 3) {
            this.setState({ loading: true });
            this.slaBreachedTickets(pageNum);
        }
    }

    async myOpenTickets(pageNumber) {
        const postData = this.prepareReqBody(pageNumber);
        const uri = ticketApiUrls.myOpenTickets;
        let { generateToken } = await this.props.generateToken();
        postData["apiToken"] = generateToken;
        this.sendReq(uri, postData);
    }

    async escalatedTickets(pageNumber) {
        const { userId, clientId, featureId, generateToken } = this.props;
        const { status, priority, type, startDate, endDate, activePage } = this.state;
        const { generateToken: apiToken } = await generateToken();
        let escalateParams = {
            userId,
            clientId,
            featureId,
            apiToken,
            filters: {
                isTicketEscalated: true,
                limitValue: this.itemsPerPage,
                skipValue: (parseInt(pageNumber) || activePage) ? ((parseInt(pageNumber) || activePage) - 1) * this.itemsPerPage : 0
            },
            limitValue: 30,
            skipValue: 0,
        };
        if (status) {
            escalateParams['filters']["state"] = status;
        }
        if (priority) {
            escalateParams['filters']["priorityId"] = priority;
        }
        if (type) {
            escalateParams['filters']["ticketTypeId"] = type;
        }
        if (startDate) {
            escalateParams['filters']["fromDate"] = `${startDate}T00:00:00.000Z`;
        }
        if (endDate) {
            escalateParams['filters']["toDate"] = `${endDate}T23:59:59.000Z`;
        }
        const uri = ticketApiUrls.ticketList;
        this.sendReq(uri, escalateParams);
    }

    async slaBreachedTickets(pageNumber) {
        const { activePage } = this.state;
        let uri = ticketApiUrls.ticketDashBaord;
        const postData = this.prepareReqBody(pageNumber);
        // need to add filters for 
        postData['filters'] = {
            isSlaBreached: 1,
            limitValue: postData['limitValue'],
            skipValue: postData['skipValue']
        }
        let { generateToken } = await this.props.generateToken();
        postData["apiToken"] = generateToken;
        this.sendReq(uri, postData);
    }

    /* merged tickets need different UI */

    /* need to show different merged ticket dashboard when click on ticketid */

    onTicketEdit = (e, row) => {
        e.preventDefault();
        this.setState({ editTicketRow: row, hasShowEditTicket: true }, () => $('#editTicketModal').modal('show'));
        this.openEditForm(row.ticketId, row.clientId, row.deptId);
    }

    onSidePanelClick = (e) => {
        e.preventDefault();
        this.setState(PrevState => ({ isShowSidePanel: !PrevState.isShowSidePanel }));
    }

    handleCellClick = async (event, ticket) => {
        const { tagName } = event.target;
        if (tagName && tagName.toLowerCase() === "input") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "label") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "img") {
            return;
        }
        this.props.history.push(`/ticket-list/${ticket.ticketId}?featureId=${this.props.featureId}&clientId=${ticket.clientId}`);
        // window.location = `/ticket-list/${ticket.ticketId}?featureId=${this.props.featureId}&clientId=${ticket.clientId}`;
    }

    // when filters has applyed, page number has to be set to 1;
    applyFilter = () => this.setState({ activePage: 1, isShowSidePanel: false }, () => this.apiCalls(this.state.activeTabIndex, 1));

    async applyFilters() {
        const { status, priority, type, startDate, endDate } = this.state;
        const { user_clients, featureId, clientId, masterClient: { clientId: masterClientId }, userId } = this.props;
        this.setState({ hasFiltersApplyed: true, loading: true });
        let filters = {};
        let reqParams = {
            "clientId": (clientId === "all") ? masterClientId : clientId,
            "userId": userId,
            "featureId": featureId,
            "limitValue": this.itemsPerPage,
            "skipValue": 0
        };
        if (clientId === "all") {
            let clientList = Array.isArray(user_clients) && user_clients.map(x => x.clientId) || [];
            filters["allClientTickets"] = true;
            filters["clientList"] = clientList;
        }
        if (status) {
            filters["state"] = status;
        }
        if (priority) {
            filters["priorityId"] = priority;
        }
        if (type) {
            filters["ticketTypeId"] = type;
        }
        if (startDate) {
            filters["fromDate"] = `${startDate}T00:00:00.000Z`;
        }
        if (endDate) {
            filters["toDate"] = `${endDate}T23:59:59.000Z`;
        }

        reqParams["filters"] = filters;
        let { generateToken } = await this.props.generateToken();
        reqParams["apiToken"] = generateToken;
        return reqParams;
        /*     axios.post(`${ticketApiUrls.ticketList}`, reqParams, axiosConfig)
                .then((res) => {
                    if (res.data.status === 200) {
                        return this.setState({ tickets: res.data.data, totalItemsCount: res.data.ticketCount, isTicketPageRendered: false, loading: false });
                    }
                    this.setState({ isTicketPageRendered: false, loading: false });
                    const isString = typeof res.data.message === "string";
                    return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again");
                }).catch(ex => {
                    this.setState({ isTicketPageRendered: false, loading: false });
                    return typeof ex.message === "string" ? failureToast(ex.message) : failureToast("Something went wrong. Please try again!");
                }); */
    }

    onFilterChanged = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSearchInput = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSearchSubmit = () => {
        this.setState({ activePage: 1 }, () => this.apiCalls());
    }

    values = [];
    onCheckChange(e) {
        const value = e.target.value;
        if ($(`#${e.target.id}`).is(':checked')) {
            $(this).prop('checked', true);
            this.values.push(value)
        } else {
            var i = this.values.indexOf(value);
            if (i !== -1) this.values.splice(i, 1);
            $(this).prop('checked', false);
        }
        this.setState({ checkedTickets: this.values });
    }

    onSelectAll(e) {
        const { checked } = e.target;
        this.updateAllCheckboxes(checked);
    }

    updateAllCheckboxes(checked) {
        // this.values = [];
        const { ticketsData } = this.state;
        if (Array.isArray(ticketsData)) {
            var slectedTickets = ticketsData.map(ticket => {
                $(`#${ticket.ticketId}`).prop('checked', checked);
                return ticket.ticketId;
            });
            this.setState({ checkedTickets: checked ? slectedTickets : [] });
        }
    }

    handleEditClientChange = async (e) => {
        const OnEditClientID = e.target.value;
        const { userId, featureId, failureToast } = this.props;
        this.setState({ OnEditClientID, isClientEdited: true, usersListOnEditclient: [], groupsListOnEditClient: [], ticketTypeMaster: "", ticketStatus: "", assignUser: "", helpTopicsOnEditClient: [], /* onAddorEditPage: true, loading: true */ });
        let userApiUrl = `${userApiUrls.getUserDashboard}`;
        const { generateToken } = await this.props.generateToken();
        //Get department group list on Client change
        let uri = adminApiUrls.groupsMappedToClient_v2 + OnEditClientID + "&userId=" + userId + "&apiToken=" + generateToken + '&internalCall=1';
        axios.get(uri)
            .then((res) => {
                if (res.status === 200) {
                    return this.setState({ groupsListOnEditClient: res.data["data"] });
                }
                // this.setState({ onAddorEditPage: false, loading: false });
                return failureToast("error while retriving client departments");
            }).catch(() => {
                // this.setState({ onAddorEditPage: false, loading: false });
            });
        const { generateToken: token } = await this.props.generateToken();
        let post = {
            "skip": 0,
            "limit": 100,
            "actionBy": userId,
            "clientId": OnEditClientID,
            "featureId": featureId,
            "apiToken": token,
            "status": await this.getMasterData()
        }
        axios.post(userApiUrl, post)
            .then((res) => {
                if (res.data.status === 200) {
                    return this.setState({ usersListOnEditclient: res.data["data"], /* onAddorEditPage: false, loading: false  */ });
                }
                // this.setState({ onAddorEditPage: false, loading: false });
                const isString = typeof res.data.message === "string";
                return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again!");
            }).catch(() => {
                // this.setState({ onAddorEditPage: false, loading: false });
            });
    }
    async getMasterData() {
        let status = "";
        const { statusList } = this.props.getAllMasterData || {};
        let activeData = statusList.filter(x => x.data.some(a => a.value === 1));
        return activeData.length ? activeData[0].id : status;
    }

    async openEditForm(ticketId, clientId, deptId) {
        this.props.groupHelpTopics(null);
        this.setState({
            ticketId: ticketId,
            OnEditClientID: clientId
        });
        const { generateToken: apiToken } = await this.props.generateToken();
        // we are calling admin apis, so internalCall is 1;
        let internalCall = 1;
        await this.props.groupHelpTopics(deptId, { apiToken, featureId: this.props.featureId, clientId }, internalCall);
    }

    async getUsers(clientId) {
        try {
            const { userId, featureId } = this.props;
            let { generateToken } = await this.props.generateToken();
            const status = await this.getMasterData();
            let post = {
                "skip": 0,
                "limit": 100,
                "apiToken": generateToken,
                "actionBy": userId,
                "clientId": clientId,
                "featureId": featureId,
                "status": status
            };
            // calling userdir module, so sending internalCall as 1;
            let internalCall = 1;
            this.props.getAssignedUsersOnBaseClient(post, internalCall)
                .then(res => {
                    this.setState({ usersList: res.userDirList || [] });
                });
        } catch (error) {
            const isString = typeof error.message === "string";
            if (isString) {
                // return this.props.failureToast(error.message);
            }
            // this.props.failureToast("Something went wrong whilte getting master data!");
        }
    }

    async getGroups(clientId) {
        let { generateToken } = await this.props.generateToken();
        // calling userDir module, so sending internalCall as 1;
        let internalCall = 1;
        this.props.getGroupsMappedToClient(clientId, this.props.userId, generateToken, this.props.featureId, internalCall)
            .then(res => {
                this.setState({
                    groupsList: res.groupsList
                });
            });
    }

    clientDepartmentEdit(e) {
        const { value, name } = e.target;
        //when switched the group, need to empty the helptopic of previous selected;
        this.setState({ [name]: value, helpTopicId: "" }, () => this.editClientDepartmentHelp(value));
    }

    async editClientDepartmentHelp(groupID) {
        const { failureToast, featureId, userId } = this.props;
        let { generateToken } = await this.props.generateToken();
        const clientId = this.state.OnEditClientID;
        let uri = `${adminApiUrls.getGroups_v2}${groupID}/helpTopics?userId=${userId}&apiToken=${generateToken}&featureId=${featureId}&clientId=${clientId}&internalCall=1`;
        axios.get(uri)
            .then(res => {
                if (res.data.status === 200 || (Array.isArray(res.data))) {
                    return this.setState({ helpTopicsOnEditClient: res.data.data, onAddorEditPage: false, loading: false, });
                }
                this.setState({ onAddorEditPage: false, loading: false });
                const isString = typeof res.data.message === "string";
                return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again");
            }).catch(ex => {
                this.setState({ onAddorEditPage: false, loading: false });
                return typeof ex.message === "string" ? failureToast(ex.message) : failureToast("Something went wrong. Please try again!");
            });
    }

    onChangeEvent = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
        if (name === "deptID") {
            this.setState({
                isDepartmentChanged: true,
                helpTopicId: ""
            }, () => {
                this.getHelpTopics(value);
            });
        }
    }

    async getHelpTopics(groupId) {
        const { featureId, clientId: current_client } = this.props;
        const { OnEditClientID, isClientEdited, editTicketRow } = this.state;
        const clientId = isClientEdited ? OnEditClientID : (editTicketRow.clientId || current_client);
        const { generateToken: apiToken } = await this.props.generateToken();
        // we are calling admin apis, so internalCall is 1;
        let internalCall = 1;
        await this.props.groupHelpTopics(groupId, { apiToken, featureId, clientId }, internalCall);
    }

    editTicket(ticketId, clientId) {
        const { successToast, failureToast } = this.props;
        const { OnEditClientID, isClientEdited, addDescription, assignUser, dueDate, deptID, ticketStatus, subjectTxt, helpTopicId, ticketPriority, ticketTypeMaster,
            isDepartmentChanged, customerName } = this.state;
        if (isClientEdited || isDepartmentChanged) {
            if (!deptID) {
                return failureToast("Please select client department!");
            }
            if (!helpTopicId) {
                return failureToast("Please select help topic!");
            }
            if (!assignUser) {
                return failureToast("Please select assignee!");
            }
        }
        let post = {
            "ticketId": ticketId,
            "clientId": clientId,
            "userId": this.props.userId,
            "featureId": this.props.featureId,
            "updateKeys": {
                customerName: customerName ? customerName : undefined
            }
        }
        if (deptID) {
            post.updateKeys.deptId = deptID;
        }
        if (ticketPriority) {
            post.updateKeys.priorityId = ticketPriority;
        }
        if (ticketTypeMaster) {
            post.updateKeys.ticketTypeId = ticketTypeMaster;
        }
        if (assignUser) {
            post.updateKeys.assignedTo = assignUser;
        }
        if (subjectTxt) {
            post.updateKeys.subject = subjectTxt;
        }
        if (dueDate) {
            post.updateKeys.dueDate = dueDate;
        }
        if (ticketStatus) {
            post.updateKeys.state = ticketStatus;
        }
        if (OnEditClientID) {
            post.updateKeys.clientId = OnEditClientID;
        }
        if (helpTopicId) {
            post.updateKeys.helpTopicId = helpTopicId;
        }
        if (addDescription) {
            post.updateKeys.description = addDescription;
        }
        this.setState({ loading: true });
        this.props.generateToken().then((data) => {
            post.apiToken = data.generateToken;
            axios.put(`${ticketApiUrls.updateTicket}`, post)
                .then(async (res) => {
                    const isString = (typeof res.data.message === "string");
                    if (Number(res.data.status) === 200) {
                        $('#editTicketModal').modal('hide');
                        isString ? successToast(res.data.message) : successToast("Successfully updated the ticket.");
                        this.apiCalls(this.state.activeTabIndex, this.state.activePage);
                        return;

                    }
                    this.setState({ loading: false });
                    return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again!");
                }).catch(err => {
                    this.setState({ loading: false });
                    return (typeof err.message === "string") ? failureToast(err.message) : failureToast("Something went wrong. Please try again!");
                })
        }).catch(err => {
            this.setState({ loading: false });
            return (typeof err.message === "string") ? failureToast(err.message) : failureToast("Something went wrong. Please try again!");
        });
    }

    onTicketWindowCancel = () => {
        this.setState(prevState => ({
            editTicketRow: {}, groupsListOnEditClient: [], OnEditClientID: "", isClientEdited: false,
            deptID: "", helpTopicId: "", helpTopicsOnEditClient: [], usersListOnEditclient: [], assignUser: "", ticketTypeMaster: "",
            ticketPriority: "", ticketStatus: "", ...this.getInitialState(), groupsList: prevState.groupsList, usersList: prevState.usersList, ticketsData: prevState.ticketsData
        }));
    }

    async onFileChange(e) {
        e.preventDefault();
        const { files } = e.target;
        const self = this;
        files && Object.values(files).forEach((file) => self.fileUpload(file));
    }


    async fileUpload(file) {
        const { clientId, userId, masterClient: { clientId: masterClientId },
            failureToast, generateToken, successToast } = this.props;
        this.setState({ loading: true });
        var formData = new FormData();
        formData.append('clientId', clientId === "all" ? masterClientId : clientId);
        formData.append('userId', userId);
        formData.append('files', file);
        const { generateToken: apiToken } = await generateToken();
        formData.append('apiToken', apiToken);
        let headers = {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        };
        const self = this;
        axios.post(masterApiUrls.uploadFile, formData, headers)
            .then((res) => {
                this.setState({ loading: false });
                const { message, status } = res.data;
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
                successToast('File uploaded Successfully!');
            }).catch((err) => {
                typeof err.message === "string" ?
                    failureToast(err.message) : failureToast("Something went wrong. Please try again!");
            }).finally(() => {
                // self.setState({ loading: false });
            });
    }

    removeAttachment(index) {
        this.setState(prevState => {
            if (Array.isArray(prevState.addAttachments)) {
                const addAttachments = index === 0 ? [...prevState.addAttachments.slice(index + 1)] : [...prevState.addAttachments.slice(0, index), ...prevState.addAttachments.slice(index + 1)];
                return { addAttachments: addAttachments };
            }
        });
    }

    async addNewTicket() {
        const refBtn = this.createTicketBtn.current;
        refBtn && refBtn.setAttribute('disabled', 'disabled');
        let hasAllFields = true, index = 0;
        const { clientId, userId, featureId, masterClient: { clientId: masterClientId },
            generateToken, successToast, failureToast } = this.props;
        const { deviceType } = this.props.getAllMasterData;

        const { fullName, emailaddr, deptID, helpTopicId, ticketPriority,
            assignUser, ticketTypeMaster, dueDate, subjectTxt, addDescription, phone, addAttachments } = this.state;

        const validations = [{ boolean: !!fullName, value: "Full Name" }, { boolean: !!emailaddr, value: "Email" }, { boolean: !!deptID, value: "Client Department" }
            , { boolean: !!helpTopicId, value: "Help Topic" }, { boolean: !!ticketPriority, value: "Ticket Priority" }, { boolean: !!assignUser, value: "AssignTo" },
        { boolean: !!ticketTypeMaster, value: "Ticket Type" }, { boolean: !!subjectTxt, value: "Ticket Subject" }, { boolean: !!addDescription, value: "Ticket Details" }
            , { boolean: !!dueDate, value: "Due Date" }];

        while (index < validations.length) {
            if (!validations[index].boolean) {
                failureToast(`${validations[index].value} is required!`);
                hasAllFields = false;
                break;
            }
            index += 1;
        }
        if (!hasAllFields) {
            refBtn && refBtn.removeAttribute("disabled");
            return;
        }

        let addPostData = {
            "clientId": (clientId === "all") ? masterClientId : clientId,
            "userId": userId,
            "featureId": featureId,
            "fullName": fullName,
            "emailId": emailaddr,
            "deptId": deptID,
            "helpTopicId": helpTopicId,
            "helpSubTopicId": helpTopicId ? helpTopicId : "",
            "deviceId": (!!deviceType.length && deviceType[0].id) ? deviceType[0].id : "",
            "priorityId": ticketPriority,
            "ticketTypeId": ticketTypeMaster,
            "phone": phone,
            "sourceId": featureId,
            "subject": subjectTxt,
            "sendAlertToUser": 1,
            "assignedTo": assignUser,
            "dueDate": dueDate,
            "description": addDescription,
            attachments: Array.isArray(addAttachments) && addAttachments.length ? addAttachments : undefined,
            originId: "RE_5f2bdc1b4878412cf340a96b"
        };
        const { generateToken: apiToken } = await generateToken();
        addPostData.apiToken = apiToken;
        this.setState({ loading: true });
        axios.post(`${ticketApiUrls.createTicket}`, addPostData)
            .then(async (res) => {
                const isString = typeof res.data.message === "string";
                refBtn && refBtn.removeAttribute("disabled");
                if (Number(res.data.status) === 200) {
                    return this.setState(prevState => ({
                        fullName: '', emailaddr: '', deptID: '', helpTopicId: '', ticketPriority: '',
                        assignUser: '', ticketTypeMaster: '', dueDate: '',
                        subjectTxt: '', addDescription: '', phone: '', addAttachments: [],
                        ...this.getInitialState(), groupsList: prevState.groupsList, usersList: prevState.usersList
                    }), () => {
                        this.apiCalls();
                        this.props.groupHelpTopics(null);
                        $(`#AddNewTicketModal`).modal('hide');
                        // isString ? successToast(res.data.message) : successToast("Success")
                    });
                }
                this.setState({ loading: false });
                return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again");
            }).catch(ex => {
                refBtn && refBtn.removeAttribute("disabled");
                this.setState({ loading: false });
                return typeof ex.message === "string" ? failureToast(ex.message) : failureToast("Something went wrong. Please try again!");
            });
    }

    handleChange = (e, activePage) => {
        this.apiCalls(this.state.activeTabIndex, activePage);
        this.setState({ activePage });
    }

    closeBulkTicketes = async (data) => {
        const { successToast, failureToast } = this.props;
        const { generateToken } = await this.props.generateToken();
        data["apiToken"] = generateToken;
        axios.put(`${ticketApiUrls.bulkCloseTicket}`, data)
            .then(async (res) => {
                const isString = typeof res.data.message === "string";
                if (res.data.status === 200) {
                    this.setState({ checkedTickets: [], }, () => this.apiCalls());
                    this.values = [];
                    return isString ? successToast(res.data.message) : successToast("Successfully closed the tickets!");
                }
                // this.setState({ loading: false });
                return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again");
            }).catch(ex => {
                // this.setState({ onAddorEditPage: false, loading: false });
                return typeof ex.message === "string" ? failureToast(ex.message) : failureToast("Something went wrong. Please try again!");
            });
    }

    saveMergeTickets = async (obj) => {
        const { successToast, failureToast } = this.props;
        const { generateToken } = await this.props.generateToken();
        obj.apiToken = generateToken;
        this.setState({ loading: true });
        return this.props.saveMergeTickets(obj)
            .then(async (res) => {
                this.setState({ loading: false });
                const isString = typeof res.tickets.message === "string";
                if (res.tickets.status == 200) {
                    this.values = [];
                    this.setState({ checkedTickets: [], loading: false }, async () => await this.apiCalls());
                    isString ? successToast(res.tickets.message) : successToast("Success");
                    return { message: res.tickets.message, status: 200 };
                }
                isString ? failureToast(res.tickets.message) : failureToast("Something went wrong. Please try again.");
                return { message: res.tickets.message, status: 201 };
            }).catch(() => {
                this.setState({ loading: false });
            });
    }

    setHasChecked = () => {
        const { checkedTickets } = this.state;
        checkedTickets.map(ticketId => $("#" + ticketId).prop('checked', true));
    }

    onResetFilters = () => {
        this.setState({ status: '', priority: '', type: '', startDate: '', endDate: '', isShowSidePanel: false },
            () => this.apiCalls(this.state.activeTabIndex, this.state.activePage));
    }

    render() {
        const { ticketsData, totalItemsCount, activePage, loading, status, endDate, type, startDate, priority } = this.state;
        const { stateList,
            priorityList,
            ticketType } = this.props.getAllMasterData || {};
        let noOfPages = Math.ceil(Number(totalItemsCount) / this.itemsPerPage);
        return (
            <>
                <Loader loading={loading} />
                <ComponentHeader
                    dashboardText={TICKET_DASHBOARD_HEAD}
                    headerClass=""
                    tabsText={TICKET_TABS}
                    onTabClick={this.onTabClick}
                />
                <SidePanel
                    isShowSidePanel={this.state.isShowSidePanel}
                    onSidePanelClick={this.onSidePanelClick}
                    onFilterChanged={this.onFilterChanged}
                    stateList={stateList}
                    priorityList={priorityList}
                    ticketType={ticketType}
                    applyFilter={this.applyFilter}
                    onReset={this.onResetFilters}
                    status={status}
                    endDate={endDate}
                    type={type}
                    startDate={startDate}
                    priority={priority}
                />
                <div className="page">
                    <div className="bg-wh" >
                        <TicketTable
                            ticketsData={ticketsData}
                            onTicketEdit={this.onTicketEdit}
                            onSidePanelClick={this.onSidePanelClick}
                            handleCellClick={this.handleCellClick}
                            onSearchInput={this.onSearchInput}
                            onSearchSubmit={this.onSearchSubmit}
                            onSelectAll={this.onSelectAll}
                            onCheckChange={this.onCheckChange}
                            onChangeEvent={this.onChangeEvent}
                            checkedTickets={this.state.checkedTickets}
                            saveMergeTickets={this.saveMergeTickets}
                            featureId={this.props.featureId}
                            closeBulkTicketes={this.closeBulkTicketes}
                            activePage={this.state.activePage}
                            itemsPerPage={this.itemsPerPage}
                            searchText={this.state.searchText}
                            clientId={this.props.clientId}
                            failureToast={this.props.failureToast}
                        />
                        {/* pagination */}
                        {
                            totalItemsCount > this.itemsPerPage && <>
                                <div className="text-center">
                                    <p>
                                        Showing {1 + (this.itemsPerPage * (activePage - 1))}-{(activePage !== noOfPages) ? (activePage * this.itemsPerPage) : totalItemsCount}/{totalItemsCount}
                                    </p>
                                </div>
                                <div className="pagination-center">
                                    <Pagination count={noOfPages} page={activePage} onChange={this.handleChange} />
                                </div>
                            </>
                        }
                    </div>
                </div>
                <AddNewTicket
                    stateList={stateList}
                    priorityList={priorityList}
                    ticketType={ticketType}
                    user_clients={this.props.user_clients}
                    usersList={this.state.usersList}
                    groupsList={this.state.groupsList}
                    deptID={this.state.deptID}
                    helpTopics={this.props.helpTopics}
                    helpTopicId={this.state.helpTopicId}
                    assignUser={this.state.assignUser}
                    ticketTypeMaster={this.state.ticketTypeMaster}
                    ticketPriority={this.state.ticketPriority}
                    ticketStatus={this.state.ticketStatus}
                    onChangeEvent={this.onChangeEvent}
                    clientId={this.props.clientId}
                    onFileChange={this.onFileChange}
                    addAttachments={this.state.addAttachments}
                    removeAttachment={this.removeAttachment}
                    createTicketBtn={this.createTicketBtn}
                    addNewTicket={this.addNewTicket}
                    onTicketWindowCancel={this.onTicketWindowCancel}
                    addDescription={this.state.addDescription}
                    phone={this.state.phone}
                    hasShowAddNew={this.state.hasShowAddNew}
                    loading={this.state.loading}
                />
                <EditTicket
                    editTicketRow={this.state.editTicketRow}
                    user_clients={this.props.user_clients}
                    handleEditClientChange={this.handleEditClientChange}
                    groupsListOnEditClient={this.state.groupsListOnEditClient}
                    usersList={this.state.usersList}
                    groupsList={this.state.groupsList}
                    stateList={stateList}
                    priorityList={priorityList}
                    ticketType={ticketType}
                    OnEditClientID={this.state.OnEditClientID}
                    isClientEdited={this.state.isClientEdited}
                    clientDepartmentEdit={this.clientDepartmentEdit}
                    deptID={this.state.deptID}
                    helpTopics={this.props.helpTopics}
                    helpTopicId={this.state.helpTopicId}
                    helpTopicsOnEditClient={this.state.helpTopicsOnEditClient}
                    usersListOnEditclient={this.state.usersListOnEditclient}
                    assignUser={this.state.assignUser}
                    ticketTypeMaster={this.state.ticketTypeMaster}
                    ticketPriority={this.state.ticketPriority}
                    ticketStatus={this.state.ticketStatus}
                    onChangeEvent={this.onChangeEvent}
                    editTicket={this.editTicket}
                    onTicketWindowCancel={this.onTicketWindowCancel}
                    isDepartmentChanged={this.state.isDepartmentChanged}
                    loading={this.state.loading}
                    hasShowEditTicket={this.state.hasShowEditTicket}
                />
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: state?.current_user?.payload?.userId,
        actionBy: state?.current_user?.payload?.userId,
        clientId: state?.current_client?.payload?.client,
        featureId: state?.clientUserFeatures?.featureIds?.Tickets,
        masterClient: state?.masterClient,
        user_clients: state?.userClients,
        getAllMasterData: state?.getAllMasterData && Array.isArray(state.getAllMasterData) && state.getAllMasterData.length ? state.getAllMasterData[0] : {},
        helpTopics: state.groupHelpTopics,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        generateToken, groupHelpTopics, getGroupsMappedToClient, getAssignedUsersOnBaseClient, saveMergeTickets,
        failureToast,
        successToast

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);
