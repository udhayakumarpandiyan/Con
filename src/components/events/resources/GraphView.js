import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import OverView from '../../home/resources/OverView';
// import Gauge from './GaugeChart';
import { SimpleGauge } from 'react-simple-gauges'

import { CustomDropDown } from '../../home/resources/CustomDropDown'
import {
    EventStats, AcknowledgeEvents, eventsBySource,
    eventsToolsTrendsData
} from "../../../actions/MainDashBoard";
import { generateToken } from "../../../actions/commons/commonActions";
import { successToast, failureToast } from '../../../actions/commons/toaster';
import { INCIDENT_SOURCE } from '../../../constants/index';
import Loader from '../../resources/Loader';
import { eventByRecurrence } from "../../../actions/cemDashboard/activeEvents";
import { EVENT_TYPE } from '../../../constants/index';

class GraphView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventsStateTime: 7,
            eventsEventType: 'Active'
        }
    }
    async componentDidMount() {
        this.setState({ loading: true });
        await this.OverviewAPI();
    }

    OverviewAPI = async () => {
        this.getEventActivity();
        this.getAcknowledgeEvents();
        this.getEventsBySources();
        this.getEventsToolsTrendsData();
        this.setState({ loading: false });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.clientId !== this.props.clientId) {
            this.setState({ loading: true });
            await this.OverviewAPI();
        }
    }

    getEventActivity = async (time = 7) => {
        const { clientId, userId, generateToken, EventStats } = this.props;
        this.setState({ loading: true });
        const { generateToken: apiToken } = await generateToken();
        const eventStats = {
            clientId,
            userId,
            apiToken,
            filters: {
                duration: time
            }
        };
        EventStats(eventStats).then(() => this.setState({ loading: false }));
    }

    getAcknowledgeEvents = async (time = this.state.eventsStateTime, eventType = this.state.eventsEventType) => {
        const { clientId, userId, generateToken, AcknowledgeEvents } = this.props;
        this.setState({ loading: true });
        const { generateToken: apiToken } = await generateToken();
        const value = { 1: 'daily', 7: 'weekly', 30: 'monthly' };
        const acknowledgeEvents = {
            clientId,
            userId,
            filters: {
                timePeriod: value[time],
                eventType
            },
            apiToken
        };
        AcknowledgeEvents(acknowledgeEvents).then(() => this.setState({ loading: false }));
    }

    getEventsBySources = async (time = 7) => {
        const { clientId, userId, generateToken, eventsBySource } = this.props;
        this.setState({ loading: true });
        const { generateToken: apiToken } = await generateToken();
        const sourceBody = {
            clientId, userId, apiToken, "timePeriod": time
        };
        eventsBySource(sourceBody).then(() => this.setState({ loading: false }));
    }

    getEventsToolsTrendsData = async (time = 7) => {
        const { clientId, userId, generateToken, eventsToolsTrendsData } = this.props;
        this.setState({ loading: true });
        const { generateToken: apiToken } = await generateToken();
        const value = { 1: 'daily', 7: 'weekly', 30: 'monthly' };
        const trendPayload = {
            clientId, userId, apiToken,
            "timePeriod": value[time]
        }
        eventsToolsTrendsData(trendPayload).then(() => this.setState({ loading: false }));
    }

    onEventActivityFilter = ({ label, value }) => {
        this.getEventActivity(value);
    }

    onAcknowledgeEventsFilter = ({ value }, { value: value1 }) => {
        this.setState(prevState => ({ eventsStateTime: value || prevState.eventsStateTime, eventsEventType: value1 || prevState.eventsEventType }));
        this.getAcknowledgeEvents(value, value1);
    }

    onEventsToolsTrendsFilter = ({ label, value }) => {
        this.getEventsToolsTrendsData(value);
    }

    onEventsBySourceFilter = ({ label, value }) => {
        this.getEventsBySources(value);
    }

    async getEventByRecurrence(reqParams) {
        const {
            eventByRecurrence,
            generateToken,
            clientId,
            userId
        } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const payload = { filters: reqParams, apiToken, clientId, userId };
        this.showLoaderIcon(true);
        const self = this;
        eventByRecurrence(payload)
            .then((res) => {
                self.showLoaderIcon(false);
            })
            .catch((err) => {
                self.showLoaderIcon(false);
            });
    }

    onEventByRecurrenceChanged = ({ label, value }) => {
        // const payload = {};
        // this.getEventByRecurrence({});
    }

    render() {
        const recurrenceColor = ['#ff0000', '#f16e33cf', 'rgb(232 43 149)', '#f2ba21', '#5cc047', '#a192c5'];
        const eventSource = INCIDENT_SOURCE.map(source => ({ label: source, value: source }));
        const { loading } = this.state;
        return (
            <>
                <Loader loading={loading} />
                <OverView
                    hasShowOverView={true}
                    eventAndTicketStats={this.props.eventAndTicketStats}
                    acknowledgeEventsData={this.props.AcknowledgeEventsData}
                    eventsBySourceData={this.props.eventsBySourceData}
                    eventsToolsTrendsObj={this.props.eventsToolsTrendsObj}
                    hasHideTickets={true}
                    onEventActivityFilter={this.onEventActivityFilter.bind(this)}
                    onAcknowledgeEventsFilter={this.onAcknowledgeEventsFilter.bind(this)}
                    onEventsToolsTrendsFilter={this.onEventsToolsTrendsFilter.bind(this)}
                    onEventsBySourceFilter={this.onEventsBySourceFilter.bind(this)}
                    defaultEventType={this.state.eventsEventType}
                />
                <div className='row' style={{ margin: '0px 0px 20px 0px' }}>
                    <div className='col-md-6 col-sm-12 page' >
                        <div className="bg-wh" style={{ paddingBottom: '25px', marginRight: '0px' }}>
                            <div className="title-head" style={{ flex: "0 0 45%" }}>EVENTS TYPE RECURRENCE</div>
                            <div className='flex-content' style={{ flexDirection: 'row-reverse' }}>
                                <div id='er' className='d-flex'>
                                    <div><CustomDropDown
                                        list={eventSource}
                                        defaultSelected={'ZABBIX'}
                                        onChange={this.onEventByRecurrenceChanged}
                                    /></div>
                                    <div>
                                        <CustomDropDown
                                            onChange={this.onEventByRecurrenceChanged}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className='event-recurrence-content-div'>
                                <div className='recurrence-content'>
                                    <div className='recurrence-count' style={{ color: recurrenceColor[0] }}>
                                        90
                                    </div>
                                    <div className='recurrence-text'>
                                        /aws-glue/jobs/output
                                    </div>
                                </div>
                                <div className='recurrence-content'>
                                    <div className='recurrence-count' style={{ color: recurrenceColor[1] }}>
                                        32
                                    </div>
                                    <div className='recurrence-text'>
                                        /aws-glue/jobs/error
                                    </div>
                                </div>

                                <div className='recurrence-content'>
                                    <div className='recurrence-count' style={{ color: recurrenceColor[2] }}>
                                        15
                                    </div>
                                    <div className='recurrence-text'>
                                        /aws/state/customlogs
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12 page'>
                        <div className="bg-wh" style={{ paddingBottom: '25px', marginRight: '0px' }}>
                            <div className="title-head">EVENT & Tickets OverView</div>
                            <div className='flex-content' style={{ padding: '1rem' }}>
                                <div className='fs-h' style={{ flexBasis: '30%' }}>Active Events</div>
                                <div className='fs-h' style={{ flexBasis: '10%' }}>22%</div>
                                <div style={{ flexBasis: '60%', position: 'relative', bottom: '0.8rem' }}>
                                    <progress max="24" value="15" data-label="15/24"></progress>
                                </div>
                            </div>
                            <div className='flex-content' style={{ padding: '1rem' }}>
                                <div className='fs-h' style={{ flexBasis: '30%' }}>Resolved Tickets</div>
                                <div className='fs-h' style={{ flexBasis: '10%' }}>62%</div>
                                <div style={{
                                    flexBasis: '60%', position: 'relative', bottom: '0.8rem'
                                }}>
                                    <progress max="16" value="10" data-label="10/16"></progress>
                                </div>
                            </div>
                            {/* gauge chart */}
                            <div className='row' style={{ margin: '30px 0px' }}>
                                <div className='col-md-6 col-sm-12' style={{ padding: '0px' }}>
                                    <SimpleGauge percent="60" color='' width="250px" /* width="18.125rem" */ />
                                </div>
                                <div className='col-md-6 col-sm-12' style={{ padding: '0px' }}>
                                    <SimpleGauge percent="65" color='' width="250px" /* width="18.125rem" */ />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: state?.current_user?.payload?.userId,
        clientId: state?.current_client?.payload?.client,
        featureId: state?.clientUserFeatures?.featureIds?.cem,
        masterClient: state?.masterClient,
        user_clients: state?.userClients,
        eventAndTicketStats: state.EventStats,
        AcknowledgeEventsData: state.AcknowledgeEvents,
        eventsBySourceData: state?.eventsBySource,
        eventsToolsTrendsObj: state?.eventsToolsTrendsData
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        generateToken,
        AcknowledgeEvents,
        EventStats,
        eventsBySource,
        eventsToolsTrendsData,
        successToast,
        failureToast,
        eventByRecurrence
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView);