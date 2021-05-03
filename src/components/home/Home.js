import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyTickets from "./resources/MyTickets";
import Overview from "./resources/OverView";
import ComponentHeader from "../resources/DashboardHeader";
import Loader from '../resources/Loader';

import "./resources/home.css";
/* actions */
import { generateToken } from "../../actions/commons/commonActions";
import { filterActivity as getPlannedActivites } from "../../actions/plannedActivity/activity";
// import { EscalateTickets } from "../../actions/escalationTickets";
import { getEventsBySource } from "../../actions/admin/dashBoardAPI";
import {
  MyTicketSLAStas, EscalateTickets, AcknowledgeEvents, EventStats,
  TicketStats, MyResponseResolution, MyPerformanceStats, eventsBySource,
  eventsToolsTrendsData
} from "../../actions/MainDashBoard";
import { fetchUserClientTickets } from "../../actions/admin/userClientTickets";
import { MAIN_DASHBOARD_TABS, MAIN_DASHBOARD_HEAD } from "../../constants/index";
import Dashboard from '../../screens/Dashboard';
import { failureToast } from '../../actions/commons/toaster';

class Home extends Component {


  getInitialState = () => ({
    loading: false,
    activeTabIndex: 0,
    eventsStateTime: 7,
    eventsEventType: 'Active'
  });

  state = this.getInitialState();

  async componentDidMount() {
    this.setState({ loading: true });
    await this.OverviewAPI();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.clientId !== this.props.clientId) {
      this.apiCallBasedOnActiveTab(this.state.activeTabIndex);
    }
  }


  OverviewAPI = async () => {
    this.setState({ loading: true });
    this.getTicketStats();
    this.getEventActivity();
    this.getEventsBySources();
    this.getAcknowledgeEvents();
    this.getEventsToolsTrendsData();
    this.setState({ loading: false });
  }

  MyTicketsAPI = async () => {
    const { clientId, userId, generateToken } = this.props;
    const { EscalateTickets } = this.props;
    this.setState({ loading: true });
    const { generateToken: apiToken } = await generateToken();
    this.fetchUserChangeRequests();
    this.getSLAStatistics();
    const payload2 = {
      clientId, duration: 49, escalatedTo: userId, userId, apiToken
    };
    EscalateTickets(payload2);
    this.fetchActivities();
    this.getMyPerformanceStats();
    this.getMyResponseResolution();
    this.setState({ loading: false });
  }

  fetchActivities = async (pageNum) => {
    const { clientId, actionBy, PlannedActivityFeature: featureId, getPlannedActivites } = this.props;
    try {
      const { generateToken: apiToken } = await this.props.generateToken();
      const payload = { clientId, actionBy, featureId, clientIdFilter: true, apiToken };
      payload['limitValue'] = 30;
      payload['skipValue'] = Number(pageNum) ? (pageNum - 1) * 30 : 0;
      getPlannedActivites(payload)
        .then(res => {
          if (res.activity.status !== 200) {
            const message = typeof (res.activity.message) === "string" ? res.activity.message : "Something went wrong! Please try again!";
            failureToast(message);
          }
        })
        .catch((error) => {
          failureToast("Something went wrong while retrieving activities!", error);
        });
    } catch (error) {
      failureToast("Something went wrong while retrieving activities!", error);
    }
  }

  onTabClick = (index) => {
    this.setState({ ...this.getInitialState(), activeTabIndex: index, loading: false }, () => {
      this.apiCallBasedOnActiveTab(index);
    });
  }

  apiCallBasedOnActiveTab = async (index) => {
    if (!Number(index)) {
      await this.OverviewAPI();
    }
    if (Number(index)) {
      await this.MyTicketsAPI();
    }
  }

  // getEventsBySources = async () => {
  //   const { getEventsBySource, clientId, actionBy: userId, generateToken } = this.props;
  //   const { generateToken: apiToken } = await generateToken();
  //   getEventsBySource({
  //     "filters": {
  //       days: 14,
  //       period: 24
  //     },
  //     clientId,
  //     apiToken,
  //     userId
  //   });
  // }

  getTicketStats = async (time = 7) => {
    const { clientId, userId, generateToken, TicketStats } = this.props;
    this.setState({ loading: true });
    const { generateToken: apiToken } = await generateToken();
    const value = { 1: 7, 7: 49, 30: 210 };
    const ticketStats = {
      clientId,
      timePeriod: value[time],
      userId,
      apiToken
    };
    TicketStats(ticketStats).then(() => this.setState({ loading: false }));
  }

  getEventActivity = async (time = 7) => {
    const { clientId, userId, generateToken, EventStats } = this.props;
    this.setState({ loading: true });
    const { generateToken: apiToken } = await generateToken();
    const value = { 1: 7, 7: 49, 30: 210 };
    const eventStats = {
      clientId,
      userId,
      apiToken,
      filters: {
        duration: value[time]
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
    const value = { 1: 7, 7: 49, 30: 210 };
    const sourceBody = {
      clientId, userId, apiToken, "timePeriod": value[time]
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


  onAllTicketsFilter = ({ label, value }) => {
    this.getTicketStats(value);
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

  getSLAStatistics = async (time = 7) => {
    const { clientId, userId, generateToken, MyTicketSLAStas } = this.props;
    this.setState({ loading: true });
    const { generateToken: apiToken } = await generateToken();
    const value = { 1: 7, 7: 49, 30: 210 };
    const payload1 = {
      clientId, userId, timePeriod: value[time], apiToken, assignedTo: userId
    };
    MyTicketSLAStas(payload1).then(() => this.setState({ loading: false }));
  }

  getMyResponseResolution = async (time = 7) => {
    const { clientId, userId, generateToken, MyResponseResolution } = this.props;
    this.setState({ loading: true });
    const { generateToken: apiToken } = await generateToken();
    const value = { 1: 'daily', 7: 'weekly', 30: 'monthly' };
    const payload6 = {
      clientId,
      timePeriod: value[time],  //daily/weekly/monthly,
      // priority: "SA_5aaa4042776f97469a9c7645",
      assignedTo: userId,
      userId,
      apiToken
    };
    MyResponseResolution(payload6).then(() => this.setState({ loading: false }));
  }

  getMyPerformanceStats = async (time = 7) => {
    const { clientId, userId, generateToken, MyPerformanceStats } = this.props;
    this.setState({ loading: true });
    const { generateToken: apiToken } = await generateToken();

    const value = { 1: 'daily', 7: 'weekly', 30: 'monthly' };
    const payload7 = {
      clientId, assignedTo: userId, userId, apiToken, timePeriod: value[time], //daily/weekly/monthly
    };
    MyPerformanceStats(payload7).then(() => this.setState({ loading: false }));
  }

  onSLAStatisticsFilter = ({ label, value }) => {
    this.getSLAStatistics(value);
  }

  onMyResponseResolutionFilter = ({ label, value }) => {
    this.getMyResponseResolution(value);
  }

  onMyPerformanceStatsFilter = ({ label, value }) => {
    this.getMyPerformanceStats(value);
  }

  fetchUserChangeRequests = async () => {
    const { fetchUserClientTickets } = this.props;
    const { clientId, userId, generateToken } = this.props;
    const { generateToken: apiToken } = await generateToken();
    fetchUserClientTickets([clientId], userId, apiToken);
  }

  render() {
    const { loading, activeTabIndex } = this.state;
    return (
      <div className='dashboard-page'>
        <Loader loading={loading} />
        <ComponentHeader
          dashboardText={MAIN_DASHBOARD_HEAD}
          tabsText={MAIN_DASHBOARD_TABS}
          onTabClick={this.onTabClick}
        />
        < Overview
          hasShowOverView={Number(activeTabIndex) === 0}
          eventAndTicketStats={this.props.eventAndTicketStats}
          acknowledgeEventsData={this.props.AcknowledgeEventsData}
          TicketStatsData={this.props.TicketStatsData}
          eventsBySourceData={this.props.eventsBySourceData}
          eventsToolsTrendsObj={this.props.eventsToolsTrendsObj}
          onAllTicketsFilter={this.onAllTicketsFilter.bind(this)}
          onEventActivityFilter={this.onEventActivityFilter.bind(this)}
          onAcknowledgeEventsFilter={this.onAcknowledgeEventsFilter.bind(this)}
          onEventsToolsTrendsFilter={this.onEventsToolsTrendsFilter.bind(this)}
          onEventsBySourceFilter={this.onEventsBySourceFilter.bind(this)}
          defaultEventType={this.state.eventsEventType}
        />
        <MyTickets
          getPlannedActivityData={this.props.getPlannedActivityData}
          hasShowMyTickets={Number(activeTabIndex) === 1}
          MyTicketSLAStasData={this.props.MyTicketSLAStasData}
          MyPerformanceStatsData={this.props.MyPerformanceStatsData}
          MyResponseResolutionData={this.props.MyResponseResolutionData}
          EscalateTicketsData={this.props.EscalateTicketsData}
          MyTicketDetails={this.props.MyTicketDetails}
          onSLAStatisticsFilter={this.onSLAStatisticsFilter}
          onMyResponseResolutionFilter={this.onMyResponseResolutionFilter}
          onMyPerformanceStatsFilter={this.onMyPerformanceStatsFilter}
          fetchActivities={this.fetchActivities}
        />
        {
          Number(activeTabIndex) === 2 &&
          <Dashboard />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userId: state?.current_user?.payload?.userId,
    actionBy: state?.current_user?.payload?.userId,
    clientId: state?.current_client?.payload?.client,
    featureId: state?.clientUserFeatures?.featureIds?.Tickets,
    PlannedActivityFeature: state?.clientUserFeatures?.featureIds?.PlannedActivity,
    masterClient: state?.masterClient,
    user_clients: state?.userClients,
    getPlannedActivityData: state?.activity && Array.isArray(state.activity.data) ? state.activity.data : [],
    eventAndTicketStats: state.EventStats,
    MyTicketSLAStasData: state.MyTicketSLAStas,
    EscalateTicketsData: state.EscalateTickets,
    AcknowledgeEventsData: state.AcknowledgeEvents,
    TicketStatsData: state.TicketStats,
    MyResponseResolutionData: state.MyResponseResolution,
    MyPerformanceStatsData: state.MyPerformanceStats,
    MyTicketDetails: state.userClientTickets?.data,
    eventsBySourceData: state?.eventsBySource,
    eventsToolsTrendsObj: state?.eventsToolsTrendsData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    generateToken,
    getPlannedActivites,
    getEventsBySource,
    MyTicketSLAStas,
    EscalateTickets,
    AcknowledgeEvents,
    EventStats,
    TicketStats,
    MyResponseResolution,
    MyPerformanceStats,
    fetchUserClientTickets,
    eventsBySource,
    eventsToolsTrendsData
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);