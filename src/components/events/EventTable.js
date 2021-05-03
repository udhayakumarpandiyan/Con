import React, { Component } from 'react';
import $ from 'jquery';
import _ from "lodash";
import { connect } from 'react-redux';
import Table from "./resources/Table";
import IncidentModal from '../resources/IncidentModal';
import EventModal from '../resources/EventModal';
import SuggestedSOP from '../resources/SuggestedSOP';
import AutomationTemplates from '../resources/AutomationTemplates';
import SendMail from '../resources/SendMail';
import { MONITORING_TOOLS } from '../../constants/index';
import { successToast, failureToast } from '../../actions/commons/toaster';
import './resources/eventData.css';
import { TemplateList } from '../../screens/Template/TemplateList';
// import { JobsAPI } from '../../api';

class EventTable extends Component {
    constructor(props) {
        super(props);
        this.intervalID = '';
        this.state = this.getInitialState();
        this.itemsPerPage = 30;
    }

    getInitialState = () => ({ selectedRow: '', suggestionArticles: [], suggestionArticlesTags: [], acknowledgeDes: '', hasShowAutomationTemplates: false });

    onRowClick = (e, data) => {
        const { nodeName } = e.target;
        this.setState({ selectedRow: data });
        if (typeof nodeName === 'string' && nodeName.toLowerCase() === 'button') {
            this.props.selectedTicketEvent(data);
            return $('#ticketmodal').modal('show');
        }
        return $('#eventDescModal').modal('show');
    }

    componentDidMount() {
        const { selectedEventType } = this.props;
        if (selectedEventType === 'Active') {
            this.setTick();
        }
        $("#eventSearch").keyup(function (event) {
            if (event.keyCode === 13) {
                $("#searchIcon").click();
            }
        });
    }

    setTick = () => {
        this.tick();
        this.intervalID = setInterval(() => this.tick(), 60000);
    }
    componentDidUpdate(prevProps) {
        // if tab changed to historical, need clear the interval;
        if (
            this.props.selectedEventType !== "Active" &&
            prevProps.selectedEventType !== this.props.selectedEventType
        ) {
            clearInterval(this.intervalID);
            this.tick();
        }
        // it will call only when we changed the tab from historical to active;
        if (
            prevProps.selectedEventType !== this.props.selectedEventType &&
            this.props.selectedEventType === "Active"
        ) {
            this.setTick();
        }
        // if initially bodyData empty and in next mount has data,then need to render the component; already we set the interval in didMount.
        if (!_.isEqualWith(prevProps.bodyData, this.props.bodyData)) {
            this.tick();
        }
    }

    tick = () => {
        const { selectedEventType, bodyData } = this.props;
        const array = Array.isArray(bodyData) ? bodyData : [];
        const data = JSON.parse(JSON.stringify(array));
        const rowData = data.map((item) => {
            item["timeatPriority"] = item.lastTimePriorityChanged;
            if (selectedEventType === "Active") {
                item["timeatPriority"] =
                    item.lastTimePriorityChanged &&
                    this.timeDiffrence(item.lastTimePriorityChanged);
            }
            return item;
        });
        this.setState({ rowData });
    };

    timeDiffrence = (eventDay) => {
        const date_future = new Date();
        const date_now = new Date(eventDay);
        let seconds = Math.floor((date_future - date_now) / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);
        hours = hours - days * 24;
        minutes = minutes - days * 24 * 60 - hours * 60;
        return `${days}D,${hours}h,${minutes}m`;
    };

    targetUrl = (ticketId, clientId) => {
        const { ticketFeatureId, failureToast } = this.props;
        if (!ticketFeatureId) {
            failureToast('You Do Not Have Access For Ticket.');
            return;
        }
        return `/ticket-list/${ticketId}?featureId=${ticketFeatureId}&clientId=${clientId}`;
    };

    onDetailedInfo = (e, ticketId, clientId) => {
        e.preventDefault();
        const url = this.targetUrl(ticketId, clientId);
        this.props.history.push(url);
    }

    openSOPModal = async (e, isFromIncidentPopUp) => {
        const { selectedRow: data } = this.state;
        const articles =
            data.articles && data.articles.articles ? data.articles.articles : [];
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
        if (isFromIncidentPopUp) {
            $('#ticketmodal').modal('hide');

        } else {
            $('#eventDescModal').modal('hide');
        }
        $("#suggestion").modal("toggle");
    };

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    openAutomationPopUp = (e, isFromIncidentPopUp) => {
        if (isFromIncidentPopUp) {
            $('#ticketmodal').modal('hide');
        }
        this.setState({ hasShowAutomationTemplates: true }, () => $('#admanceAutomation').modal('toggle'));
    }

    onChange = (e) => {
        const { value, name } = e.target;
        this.setState({ [name]: value });
    }

    onCancelSendMail = () => {
        this.setState({ smdescription: "", smemailid: "", smsubject: "" });
    };

    onSubmitSendMail = () => {
        const { smdescription, smemailid, smsubject } = this.state;
        if (!smemailid) {
            return this.props.failureToast("To EmailId is Required!");
        }
        if (!smsubject) {
            return this.props.failureToast("Subject is Required!");
        }
        if (!smdescription) {
            return this.props.failureToast("Description Required!");
        }
        this.props.sendMail(smemailid, smsubject, smdescription);
        this.onCancelSendMail();
        $(`#sendEmailModal`).modal("toggle");
    };

    onOpenSendMail = (e) => {
        $('#eventDescModal').modal('hide');
        $(`#sendEmailModal`).modal("toggle");
    }

    onAcknowledgeSubmit() {
        const { acknowledgeDes } = this.state;
        if (!acknowledgeDes) {
            return this.props.failureToast("Description Required!");
        }
        this.props.setAcknowledgeEvents(acknowledgeDes, this.state.selectedRow.eventId);
        this.setState({ hasShowAcknowledge: false, hasShowSendMail: false });
    }

    onShowAcknowledgeModal = () => {
        $('#eventDescModal').modal('hide');
        $(`#acknowledgemodal`).modal('show');
    }

    updateEventState = () => {
        const { selectedRow } = this.state;
        this.props.updateEventState(selectedRow.eventId, selectedRow.eventState);
    }

    createIncident = () => {
        const { selectedRow } = this.state;
        const { failureToast } = this.props;
        if (selectedRow.ticketId || Number(selectedRow.eventState) === 2) {
            return failureToast('Ticket Generated Already or event closed!');
        }
        this.props.createIncident(selectedRow.description, selectedRow.eventId);
    }

    onAutomationTemplatesOpen = () => {
        $('#eventDescModal').modal('hide')
        this.setState({ hasShowAutomationTemplates: true }, () => $('#admanceAutomation').modal('toggle'));
    }

    onJobLunch = (resourceId) => {
        $('#admanceAutomation').modal('hide');
        if (resourceId) {
            this.props.successToast('Job launched Successfully');
            // var obj = JSON.stringify({ orchJobId: resourceId, content: `<div class='btn-link'>Click here to see the job out put</div>` });
            // this.postReply(this.state.paramsID, obj);
        }
    }

    render() {
        const { selectedRow, rowData, suggestionArticlesTags, suggestionArticles } = this.state;
        const { headers, onSidePanelClick, getIncidentDetailsData, eventsCount, activePage, handlePageChange, runCFT, onSeachChanged, onSearchSubmit } = this.props;
        const tbody = Array.isArray(rowData) && generateBody(rowData, this.onRowClick, activePage, this.itemsPerPage);

        return (
            <div id='eventStyle'>
                <Table
                    TableColumns={headers}
                    onSidePanelClick={onSidePanelClick}
                    tbody={tbody}
                    totalItemsCount={eventsCount}
                    activePage={activePage}
                    handlePageChange={handlePageChange}
                    itemsPerPage={this.itemsPerPage}
                    onSearchInput={onSeachChanged}
                    onSearchSubmit={onSearchSubmit}
                    searchEventId={this.props.searchEventId}
                    resetSearch={this.props.resetSearch}
                />
                {/* event modal popup */}
                <EventModal
                    eventData={selectedRow}
                    openSOPModal={this.openSOPModal}
                    openAutomationPopUp={this.onAutomationTemplatesOpen}
                    onOpenSendMail={this.onOpenSendMail}
                    onShowAcknowledgeModal={this.onShowAcknowledgeModal}
                    updateEventState={this.updateEventState}
                    createIncident={this.createIncident}
                // onAutomationTemplatesOpen={this.onAutomationTemplatesOpen}
                />
                {/* event modal popup end */}
                {/* ticket popup */}
                <IncidentModal
                    selectedRow={selectedRow}
                    incidentData={getIncidentDetailsData}
                    onDetailedInfo={this.onDetailedInfo}
                    openSOPModal={this.openSOPModal}
                    openAutomationPopUp={this.openAutomationPopUp}
                    onOpenSendMail={this.onOpenSendMail}
                />
                {/* ticket popup end */}
                {/* sop popup */}
                <SuggestedSOP
                    suggestionArticlesTags={suggestionArticlesTags}
                    suggestionArticles={suggestionArticles}
                />
                {/* automation popup */}
                <AutomationTemplates
                    data={selectedRow}
                    runCFT={runCFT}
                />
                <SendMail
                    smemailid={this.state.smemailid}
                    eventState={selectedRow.eventState}
                    smsubject={selectedRow.smsubject}
                    smdescription={selectedRow.smdescription}
                    onChange={this.onChange}
                    onCancelSendMail={this.onCancelSendMail}
                    onSubmitSendMail={this.onSubmitSendMail}
                />
                <div id="acknowledgemodal" className='modal' tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{ height: '400px' }}>
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    Acknowledge
                                </h3>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body" style={{ height: "330px" }}>
                                {/* {isLoading && <Loader />} */}
                                <div className="container-fluid mt-3">
                                    <div className="row form-group">
                                        <h4 className="">
                                            Description
                                        </h4>
                                        <textarea
                                            name="acknowledgeDes"
                                            value={this.state.acknowledgeDes}
                                            className="form-control"
                                            onChange={this.onChange}
                                            style={{ height: '170px' }}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer" >
                                    <div className="col-md-12" style={{ paddingLeft: '0px', marginRight: '22px' }}>
                                        <button type="button" className="btn1 btn-primary float-right" style={{ padding: '4px 20px', marginRight: '-50px' }}
                                            onClick={() =>
                                                this.onAcknowledgeSubmit(selectedRow.eventId)}>
                                            Submit
                                         </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* admanceAutomation */}
                <div className="modal" id="admanceAutomation" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Apply Automations</h5>
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
                                            subject={this.state.selectedRow.description}
                                            description={this.state.selectedRow.description}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function generateBody(rowData, onRowClick, activePage, itemsPerPage) {
    return (
        rowData.map((data, index) =>
            <tr
                key={data.eventId}
                onClick={(e) => onRowClick(e, data)}
            >
                <td className="text-left"><span>
                    {
                        Number(activePage) === 1 ? index + 1 : (activePage - 1) * itemsPerPage + index + 1
                    }
                </span></td>
                <td className="text-left"><span title={data.eventId}> {data.eventId}</span></td>
                <td className="text-left"><span title={window.DateTimeParser(data.createdAt)} > {window.DateTimeParser(data.createdAt)}</span></td>
                <td className="text-left"><span title={window.DateTimeParser(data.lastOccurenceTime)} > {window.DateTimeParser(data.lastOccurenceTime)}</span></td>
                <td><span title={MONITORING_TOOLS[data.monitoringToolId].name} >{MONITORING_TOOLS[data.monitoringToolId] &&
                    MONITORING_TOOLS[data.monitoringToolId].name
                    ? MONITORING_TOOLS[data.monitoringToolId].name
                    : ""}</span>
                </td>
                <td className="event-des-col" title={data.logStreamName}><span className="event-des-ellipse">{data.logStreamName}</span></td>
                <td><span title={data.appName} >{data.appName}</span></td>
                <td className="text-center"><span>{data.emailTriggerred ? <i className="fa fa-check-circle" style={{ color: '#008000', fontSize: '1.3rem' }}></i> : <i style={{ color: '#ff0000', fontSize: '1.3rem' }} className="fa fa-times-circle"></i>}</span></td>
                <td>
                    <span>
                        <button
                            type="button"
                            style={{ padding: "0px", fontSize: "14px" }}
                            className="btn btn-link"
                        >
                            {data.ticketId}
                        </button>
                    </span>
                </td>
                <td>
                    <span title={data.timeatPriority} >{data.timeatPriority}</span>
                </td>
            </tr>
        )
    )
}

function mapStateToProps(state) {
    return {
        getIncidentDetailsData:
            state.incidentDetails && state.incidentDetails.data
                ? state.incidentDetails.data
                : {}
    }
}

export default connect(mapStateToProps, { successToast, failureToast })(EventTable);