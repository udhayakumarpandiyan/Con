import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from "jquery";
import axios from "axios";
import moment from "moment";
import { bindActionCreators } from 'redux';
import ComponentHeader from '../resources/DashboardHeader';
import GraphView from './resources/GraphView';
import OperationsDashboard from './resources/OperationsDashboard';
import EventTable from './EventTable';
import SidePanel from './resources/SidePanel';
import "./resources/page.css";
import { EVENTS_TABLE_COLUMNS } from './resources/enum';
/* actions */
import {
    getAllActiveEvents,
    getFilteredNSortedActiveEvents,
    addCreatedEvent,
    updatedActiveEvents,
    deletedActiveEvent,
    loginDetailsByClientId,
    getAllEventList,
    graphanaWidgetList,
    eventByRecurrence,
    eventByTheTime,
    sendMailCemDashboard,
    ticketByEvents,
    getIncidentDetails,
    acknowledgeEvents,
    updateEvent,
    availableOrchTemplate,
    getEventsBySearch
} from "../../actions/cemDashboard/activeEvents";
import {
    generateToken,
} from "./../../actions/commons/commonActions";
import { cemEventBarGraphData, getEventsBySource } from "../../actions/admin/dashBoardAPI";
import { getGroups as getGroupsMappedToClient } from "../../actions/rca/rcaMain";
import { runPowerShellScript } from "../../actions/orchestration/orchestrationMain";

/* enum constants */
import {
    // MONITORING_TOOLS,
    // CEM_TICKET_PRIORITY,
    // /* CEM_TICKET_STATUS, */ EVENT_TYPE,
    // AZURE_EVENT_TYPE,
    // EVENT_STATUS,
    EVENTS_TABS, EVENTS_DASHBOARD_HEAD
} from "../../constants/index";
import {
    // cemDashboardEventsURLs,
    orchestrationUrls,
    ticketApiUrls,
} from "../../util/apiManager";
import { failureToast, successToast } from '../../actions/commons/toaster';
// const socketURL = cemDashboardEventsURLs.socketConnection;
import Loader from '../resources/Loader';

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.setAcknowledgeEvents = this.setAcknowledgeEvents.bind(this);
    }

    getInitialState = () => ({
        selectedEventType: 'Active',
        isShowSidePanel: false,
        activePage: 1,
        ranCFTIds: [],
        groupsList: [],
        activeTabIndex: 0,
        selectedGrafanaURL: '',
        graphanaName: '',
        filtereventservice: '',
        filterpriority: '',
        filterstatus: '',
        filterstartdate: '',
        filterenddate: '',
        searchEventId: ''
    });

    onSidePanelClick = (e) => {
        e.preventDefault();
        this.setState(PrevState => ({ isShowSidePanel: !PrevState.isShowSidePanel }));
    }

    onEventRaise = (url, name) => {
        this.setState({ 'selectedGrafanaURL': url, graphanaName: name });
    }


    onTabClick = (index) => {
        if (Number(index) === Number(this.state.activeTabIndex)) {
            return;
        }
        this.setState({ ...this.getInitialState(), activeTabIndex: index, loader: true });
        // based on index value, call api's;
        if (Number(index) === 0) {

        }
        if (Number(index) === 1) {
            // when tab changed, page number would be set to 1
            this.fetchAllEventList(1);
        }
        if (Number(index) === 2) {
            this.graphanaWidgetList();
        }
    }

    async componentDidMount() {
        // this.filterOptions();
        // this.availableOrchTemplate();
    }


    async getGroups() {
        let { generateToken } = await this.props.generateToken();
        // calling userDir module, so sending internalCall as 1;
        let internalCall = 1;
        const self = this;
        return this.props.getGroupsMappedToClient(
            this.props.clientId,
            this.props.userId,
            generateToken,
            this.props.ticketFeatureId,
            internalCall
        ).then((res) => {
            self.setState({
                groupsList: res.groupsList,
            });
            return res.groupsList;
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clientId !== this.props.clientId) {
            const { activeTabIndex } = this.state;
            this.setState({ ...this.getInitialState(), activeTabIndex });
            if (Number(this.state.activeTabIndex) === 1) {
                // when client has changed , page number would be 1
                this.fetchAllEventList(1);
            }
            if (Number(this.state.activeTabIndex) === 2) {
                this.graphanaWidgetList();
            }
        }
    }

    fetchAllEventList = async (pageNumber) => {
        const {
            clientId,
            failureToast,
            getAllEventList,
            generateToken,
            cemFeatureId,
            userId,
            getFilteredNSortedActiveEvents,
        } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const bodydata = {
            apiToken: apiToken,
            featureId: cemFeatureId,
            clientId,
            userId,
            filters: {
                ...this.bodyDataFilter(),
                pageNum: pageNumber || this.state.activePage,
            }
        };

        const self = this;
        this.showLoaderIcon(true);
        try {
            getAllEventList(bodydata)
                .then((res) => {
                    const { message, status, data } = res;
                    self.showLoaderIcon(false);
                    if (status !== 200) {
                        // setState for count
                        const text =
                            typeof message === "string"
                                ? message
                                : "Something went wrong while fetching events!";
                        return failureToast(text);
                    }
                    this.setState({ eventsCount: data.eventsCount });
                    getFilteredNSortedActiveEvents();
                })
                .catch((err) => {
                    this.showLoaderIcon(false);
                    return failureToast("Something went wrong. Please try again!");
                });
        } catch (error) {
            this.showLoaderIcon(false);
            const message = typeof error === "string" ? error : error.message;
            return failureToast(message || "Something went wrong. Please try again!");
        }
    };

    showLoaderIcon = (loading) => this.setState({ loading });

    bodyDataFilter() {
        const {
            filtereventservice,
            filterpriority,
            filterstatus,
            filterstartdate,
            filterenddate,
        } = this.state;
        const obj = {};
        obj.eventState = 1;
        if (filterstatus && filterstatus !== "Select status") {
            obj.eventState = Number(filterstatus);
        }
        if (filterpriority && filterpriority !== "Select priority") {
            obj.priority = filterpriority;
        }
        if (filterstartdate && filterstartdate !== null) {
            let fromdate = moment(filterstartdate).format("YYYY-MM-DD");
            obj.fromDate = fromdate;
        }
        if (filterenddate && filterenddate !== null) {
            let todate = moment(filterenddate).format("YYYY-MM-DD");
            obj.toDate = todate;
        }
        if (filtereventservice && filtereventservice !== "Select event") {
            obj.monitoringToolId = Number(filtereventservice);
        }
        return obj;
    }

    selectedTicketEvent = async (selectedRow) => {
        const {
            getIncidentDetails,
            clientId,
            userId,
            ticketFeatureId: featureId,
            generateToken,
            failureToast,
        } = this.props;
        getIncidentDetails();
        const { generateToken: apiToken } = await generateToken();
        this.showLoaderIcon(true);
        const self = this;
        await getIncidentDetails({
            clientId,
            userId,
            featureId,
            apiToken,
            ticketId: selectedRow.ticketId,
        }).then((res) => {
            this.showLoaderIcon(false);
            if (res && res.data) {
                const { message, status } = res.data;
                if (status !== 200) {
                    failureToast(message);
                }
            }
        });
        this.showLoaderIcon(false);
    }

    handlePageChange = async (e, activePage) => {
        this.setState({ activePage });
        this.fetchAllEventList(activePage);
    };

    sendMail = async (to, subject, desc) => {
        const {
            failureToast,
            successToast,
            sendMailCemDashboard,
            generateToken,
            userId,
            clientId,
        } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const bodydata = {
            apiToken: apiToken,
            userId: userId,
            to: to,
            subject: subject,
            text: desc,
            clientId,
        };
        const self = this;
        this.showLoaderIcon(true);
        sendMailCemDashboard(bodydata)
            .then((res) => {
                self.showLoaderIcon(false);
                if (res && res.data) {
                    const { message, status } = res.data;
                    const toaster = status === 200 ? successToast : failureToast;
                    toaster(message);
                }
            })
            .catch((err) => {
                self.showLoaderIcon(false);
                return failureToast("Something went wrong. Please try again!");
            });
    };

    runCFT = async (event) => {
        if (event) {
            const userId = localStorage.getItem("userId");
            var randomstring = require("randomstring");
            this.setState((prevState) => ({
                ranCFTIds: [...prevState.ranCFTIds, event.eventId],
            }));
            const { generateToken: apiToken } = await this.props.generateToken();
            const reqBody = {
                createdBy: userId,
                userId,
                templateId: event.cftInformation.templateId,
                applicationName: `${event.appName || event.appUrl
                    }-${randomstring.generate(7)}`,
                serviceName: `${event.cftInformation.templateName}-${event.eventId
                    }-${randomstring.generate(7)}`,
                description: "cemtest",
                clientId: event.clientId,
                operationRequestType: "APPLYPLAN",
                launchType: "CREATED",
                launchStatus: "YES",
                apiToken,
            };
            this.showLoaderIcon(true);
            if (Number(event.cftInformation.templateType) === 2) {
                this.props.runPowerShellScript(reqBody);
            } else {
                axios.post(orchestrationUrls.createOrchService, reqBody);
            }
            this.props.successToast("Service Launched Successfully!");
            $("#runCEF").modal("toggle");
            this.showLoaderIcon(false);
        }
    };

    async setAcknowledgeEvents(acknowledgeNotes, eventId) {
        const {
            clientId,
            userId,
            cemFeatureId: featureId,
            successToast,
            acknowledgeEvents,
            generateToken,
            failureToast,
        } = this.props;
        const { generateToken: apiToken } = await generateToken();
        this.showLoaderIcon(true);
        const self = this;
        acknowledgeEvents({
            clientId,
            eventId,
            acknowledgeNotes,
            userId,
            apiToken,
            featureId,
        })
            .then((res) => {
                self.showLoaderIcon(false);
                if (res && res.data) {
                    const { message, status } = res.data;
                    const toaster = status === 200 ? successToast : failureToast;
                    toaster(message);
                    if (status === 200) {
                        $(`#acknowledgemodal`).modal('hide');
                        self.fetchAllEventList(this.state.activePage);
                    }
                }
            })
            .catch((err) => {
                self.showLoaderIcon(false);
                return failureToast("Something went wrong. Please try again!");
            });
    }

    updateEventState = async (eventId, eventState) => {
        if (Number(eventState) === 4) {
            return this.props.infoToast("Event Is Already In Progress");
        }
        const {
            updateEvent,
            clientId,
            userId,
            generateToken,
            failureToast,
            successToast,
        } = this.props;
        this.showLoaderIcon(true);
        const { generateToken: apiToken } = await generateToken();
        const payload = {
            clientId,
            userId,
            apiToken,
            eventId,
            updateKeys: { eventState: 3 },
        }; // 3 for inProgress  //EVENT_STATUS
        const self = this;
        updateEvent(payload)
            .then((res) => {
                self.showLoaderIcon(false);
                $(`#view_${eventId}`).modal("toggle");
                if (res && res.data) {
                    const { message, status } = res.data;
                    const toaster = status === 200 ? successToast : failureToast;
                    toaster(message);
                    if (status === 200) {
                        self.fetchAllEventList(this.state.activePage);
                    }
                }
            })
            .catch((err) => {
                self.showLoaderIcon(false);
                return failureToast("Something went wrong. Please try again!");
            });
    }

    createIncident = async (description, eventId) => {
        const {
            groupsList,
        } = this.state;
        let groupsListData = groupsList;
        console.log(groupsListData);
        if (!Array.isArray(groupsListData) || !groupsListData.length) {
            groupsListData = await this.getGroups();
        }
        const {
            priorityList, deviceType,
            ticketType } = this.props.getAllMasterData || {};
        const normalPriority =
            Array.isArray(priorityList) &&
            priorityList.filter(
                (priority) => priority.name.toLowerCase() === "normal"
            );
        const incidentType =
            Array.isArray(ticketType) &&
            ticketType.filter((type) => type.name.toLowerCase() === "incident");
        const {
            generateToken,
            clientId,
            userId,
            failureToast,
            ticketFeatureId: featureId,
            successToast,
            updateEvent,
        } = this.props;
        const { generateToken: apiToken } = await generateToken();
        let addPostData = {
            clientId,
            userId,
            featureId,
            apiToken,
            fullName: "Cloud Watch",
            emailId: localStorage.getItem("email"),
            helpTopicId: "Ticket Created From CEM",
            helpSubTopicId: "Ticket Created From CEM",
            deptId:
                Array.isArray(groupsListData) && groupsListData.length
                    ? groupsListData[0].groupId
                    : "",
            priorityId:
                Array.isArray(normalPriority) && normalPriority.length
                    ? normalPriority[0]["id"]
                    : "",
            ticketTypeId:
                Array.isArray(incidentType) && incidentType.length
                    ? incidentType[0]["id"]
                    : "",
            sourceId: featureId,
            subject: `Ticket Created For Event-${eventId}`,
            sendAlertToUser: 0,
            description,
            deviceId:
                Array.isArray(deviceType) && deviceType[0].id ? deviceType[0].id : "",
        };
        const self = this;
        this.setState({ loading: true });
        axios
            .post(`${ticketApiUrls.createTicket}`, addPostData)
            .then(async (res) => {
                const isString = typeof res.data.message === "string";
                self.setState({ loading: false });
                if (res.data.status == "200" && res.data.data) {
                    const {
                        data: { ticketId },
                    } = res.data;
                    successToast("Ticket Created Successfully!");
                    const { generateToken: apiToken } = await generateToken();
                    const payload = {
                        clientId,
                        userId,
                        apiToken,
                        eventId,
                        updateKeys: { ticketId },
                    };
                    updateEvent(payload);
                    self.fetchAllEventList(this.state.activePage);
                    $(`#view_${eventId}`).modal("toggle");
                    return;
                }
                return isString
                    ? failureToast(res.data.message)
                    : failureToast("Something went wrong. Please try again");
            })
            .catch((ex) => {
                this.setState({ loading: false });
                return typeof ex.message === "string"
                    ? failureToast(ex.message)
                    : failureToast("Something went wrong. Please try again!");
            });
    }

    getEventByRecurrence = async (reqParams) => {
        const {
            eventByRecurrence,
            generateToken,
            clientId,
            userId,
            failureToast,
            infoToast,
        } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const payload = { filters: reqParams, apiToken, clientId, userId };
        this.showLoaderIcon(true);
        const self = this;
        eventByRecurrence(payload)
            .then((res) => {
                self.showLoaderIcon(false);
            }).catch((err) => {
                self.showLoaderIcon(false);
            });
    }

    graphanaWidgetList = async () => {
        const {
            clientId,
            failureToast,
            graphanaWidgetList,
            generateToken,
            userId,
        } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const bodydata = {
            apiToken: apiToken,
            clientId,
            userId,
        };
        const self = this;
        this.showLoaderIcon(true);
        graphanaWidgetList(bodydata)
            .then((res) => {
                self.showLoaderIcon(false);
                if (res.data && res.data.status !== 200) {
                    const { message } = res.data;
                    const text =
                        typeof message === "string"
                            ? message
                            : "Something went wrong while fetching events!";
                    return failureToast(text);
                }
            })
            .catch((err) => {
                this.showLoaderIcon(false);
                return failureToast("Something went wrong. Please try again!");
            });
    };

    handleChange = (event) => {
        let { name, value } = event.target;
        this.setState({ [name]: value });
    }

    onApplyFilters = () => {
        // when filters has applyed, page number has to be set to 1;
        this.setState({ activePage: 1, isShowSidePanel: false }, () => this.fetchAllEventList(1));
    }

    resetFilters = (e) => {
        // when filters has reset, page number has to be set to 1;
        this.setState(prevState => ({ ...this.getInitialState(), activeTabIndex: prevState.activeTabIndex }), () => this.fetchAllEventList(1));
    }

    eventsBySearch = async (e) => {
        if (e.target.tagName === "BUTTON") {
            return;
        }
        const { searchEventId: eventId } = this.state;
        if (!eventId) {
            return this.props.failureToast('Please enter search text');
        }
        const { getEventsBySearch, clientId, userId, generateToken, getFilteredNSortedActiveEvents } = this.props;
        const { generateToken: apiToken } = await generateToken();
        this.setState(prevState => ({ ...this.getInitialState(), activeTabIndex: prevState.activeTabIndex, loading: true, searchEventId: eventId }));
        getEventsBySearch({ clientId, userId, apiToken, filters: { eventId: Number(eventId) } })
            .then(res => {
                console.log(res);
                this.setState({ loading: false })
                getFilteredNSortedActiveEvents();
            });
    }

    render() {
        const { activeTabIndex, loading, filtereventservice, filterpriority, filterstatus, filterstartdate, filterenddate } = this.state;
        const { getActiveFilteredEvents, inActiveEvents, ticketFeatureId } = this.props;
        const { selectedEventType } = this.state;
        const headers = selectedEventType === "Active" ? EVENTS_TABLE_COLUMNS : [];
        const bodyData = selectedEventType === "Active" ? getActiveFilteredEvents : inActiveEvents;
        return (
            <>
                <Loader loading={loading} />
                <ComponentHeader
                    dashboardText={EVENTS_DASHBOARD_HEAD}
                    headerClass=""
                    tabsText={EVENTS_TABS}
                    onTabClick={this.onTabClick}
                />
                {
                    Number(activeTabIndex) === 0 &&
                    <GraphView
                        getEventByRecurrence={this.getEventByRecurrence}
                    />
                }
                {
                    Number(activeTabIndex) === 1 &&
                    <>
                        <SidePanel
                            isShowSidePanel={this.state.isShowSidePanel}
                            onSidePanelClick={this.onSidePanelClick}
                            onFilterChanged={this.handleChange}
                            applyFilters={this.onApplyFilters}
                            resetFilters={this.resetFilters}
                            filtereventservice={filtereventservice}
                            filterpriority={filterpriority}
                            filterstatus={filterstatus}
                            filterstartdate={filterstartdate}
                            filterenddate={filterenddate}
                        />
                        <EventTable
                            selectedEventType={selectedEventType}
                            headers={headers}
                            bodyData={bodyData}
                            onSidePanelClick={this.onSidePanelClick}
                            selectedTicketEvent={this.selectedTicketEvent}
                            eventsCount={this.state.eventsCount}
                            activePage={this.state.activePage}
                            handlePageChange={this.handlePageChange}
                            ticketFeatureId={ticketFeatureId}
                            sendMail={this.sendMail}
                            runCFT={this.runCFT}
                            setAcknowledgeEvents={this.setAcknowledgeEvents}
                            updateEventState={this.updateEventState}
                            createIncident={this.createIncident}
                            loading={loading}
                            showLoaderIcon={this.showLoaderIcon}
                            onSeachChanged={this.handleChange}
                            onSearchSubmit={this.eventsBySearch}
                            searchEventId={this.state.searchEventId}
                            resetSearch={this.resetFilters}
                            history={this.props.history}
                        />
                    </>
                }
                {
                    Number(activeTabIndex) === 2 &&
                    <>
                        <OperationsDashboard
                            graphanaWidgetData={this.props.graphanaWidgetData}
                            onOperationsDashBoardChange={this.onEventRaise}
                            selectedGrafanaURL={this.state.selectedGrafanaURL}
                            graphanaName={this.state.graphanaName}
                            loading={loading}
                        />
                    </>
                }
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        getActiveFilteredEvents:
            state.getActiveFilteredEvents &&
                Array.isArray(state.getActiveFilteredEvents)
                ? state.getActiveFilteredEvents
                : [],
        user_clients: state.userClients,
        clientId: state.current_client.payload
            ? state.current_client.payload.client
            : "",
        masterClient: state.masterClient,
        ssoLoginDetails:
            state.loginDetailsByClientId &&
                Array.isArray(state.loginDetailsByClientId.ssoLoginDetails)
                ? state.loginDetailsByClientId.ssoLoginDetails
                : [],
        ticketFeatureId: state?.clientUserFeatures?.featureIds?.Tickets,
        userId: state.current_user.payload.userId,
        eventByRecurrenceData:
            state.eventByRecurrence && Array.isArray(state.eventByRecurrence.data)
                ? state.eventByRecurrence.data
                : [],
        eventByTheTimeData:
            state.eventByTheTime && Array.isArray(state.eventByTheTime.data)
                ? state.eventByTheTime.data
                : [],
        eventsByTrend:
            state.cemEventBarGraphData && state.cemEventBarGraphData.eventData
                ? state.cemEventBarGraphData.eventData
                : { xAccess: {}, yAccess: {} },
        cemFeatureId: state?.clientUserFeatures?.featureIds?.cem,
        ticketEventsData:
            state.ticketByEvents && state.ticketByEvents.data
                ? state.ticketByEvents.data
                : {},
        graphanaWidgetData:
            state.graphanaWidgetList && Array.isArray(state.graphanaWidgetList.data)
                ? state.graphanaWidgetList.data
                : [],
        getEventsBySourceData: state.getEventsBySource,
        availableOrchTemplateData: state.availableOrchTemplate,
        getAvailableTicketArticlesData: state.getAvailableTicketArticles,
        getAllMasterData: state?.getAllMasterData && Array.isArray(state.getAllMasterData) && state.getAllMasterData.length ? state.getAllMasterData[0] : {}
        // eventsCount: state.getAllActiveEvents && state.getAllActiveEvents.data ? state.getAllActiveEvents.data.eventsCount : 0
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getAllActiveEvents,
            addCreatedEvent,
            getFilteredNSortedActiveEvents,
            updatedActiveEvents,
            deletedActiveEvent,
            generateToken,
            loginDetailsByClientId,
            getAllEventList,
            graphanaWidgetList,
            eventByRecurrence,
            eventByTheTime,
            cemEventBarGraphData,
            sendMailCemDashboard,
            ticketByEvents,
            getGroupsMappedToClient,
            getIncidentDetails,
            acknowledgeEvents,
            updateEvent,
            getEventsBySource,
            availableOrchTemplate,
            runPowerShellScript,
            failureToast,
            successToast,
            getEventsBySearch
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Events);
