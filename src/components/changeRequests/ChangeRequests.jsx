import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Pagination from '@material-ui/lab/Pagination';
import $ from "jquery";
import Table from './resources/Table';
import { filterActivity, copyActivity, getActivityDetails, obsoleteActivity, submitActivity } from "../../actions/plannedActivity/activity";
import { generateToken } from "../../actions/commons/commonActions";
import { successToast, failureToast } from "../../actions/commons/toaster";
import ComponentHeader from "../resources/DashboardHeader";
import './resources/page.css';
import ChangeRequestInfo from './resources/ChangeRequestInfo';
import Loader from '../resources/Loader';
import ActivityAddPage from './AddNewActivity';
import TicketDetails from './resources/TicketDetails';
import HeaderActions from './resources/HeaderActions';
import SidePanel from './resources/SidePanel';
import { getIncidentDetails } from '../../actions/cemDashboard/activeEvents';
import SuggestedSOP from '../resources/SuggestedSOP';
import { TemplateList } from '../../screens/Template/TemplateList';
import axios from 'axios';
import { ticketApiUrls } from "../../util/apiManager";

class ChangeRequest extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.itemsPerPage = 30;
        this.searchText = null;
    }

    getInitialState = () => ({
        activePage: 1,
        loading: false,
        isShowSidePanel: false,
        suggestionArticles: [],
        suggestionArticlesTags: [],
        hasShowAutomationTemplates: false,
        filterApplied: false
    });

    componentDidMount() {
        this.fetchActivities();
        this.subscribeAddNew();
    }

    subscribeAddNew = () => {
        const self = this;
        $("#addNewCR").click(function () {
            self.setState({ hasShowAddNewWindow: true });
            $('#addnewId').modal('show');
        });
    }

    componentDidUpdate(preProps) {
        if (preProps.clientId !== this.props.clientId) {
            this.fetchActivities();
            this.subscribeAddNew();
        }
    }
    onTicketClick = (ticketId) => {
        this.getTicketDetails(ticketId);
        $('#TicketDetailsModal').modal('show');
    }
    onSearchClick = (activity) => {
        let url = `/change-requests/${activity.activityId}?featureId=${this.props.featureId}&clientId=${activity.clientId}`;
        localStorage.setItem('currentActivity', activity);
        this.props.history.replace(url, activity); // Update state of current entry in history stack.
    }

    onActivityClick = (activity) => {
        const { failureToast } = this.props;
        $('#ChangeRequestInfoModal').modal('show');
        try {
            this.showLoaderIcon(true);
            this.props.generateToken()
                .then((token) => {
                    let data = {
                        activityId: activity.activityId,
                        featureId: this.props.featureId,
                        clientId: this.props.clientId,
                        actionBy: this.props.actionBy,
                        apiToken: token?.generateToken
                    };
                    this.props.getActivityDetails(data)
                        .then(res => {
                            this.showLoaderIcon(false);
                        }).catch((err) => {
                            this.showLoaderIcon(false);
                            failureToast("Something went wrong while retrieving activity details!");
                        });
                })
        }
        catch (error) {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while retrieving activity details!");
        }
    }

    fetchActivities = async (pageNum) => {
        const { failureToast, clientId, actionBy, featureId } = this.props;
        try {
            const { generateToken: apiToken } = await this.props.generateToken();
            const payload = { clientId, actionBy, featureId, clientIdFilter: true, apiToken };
            if (this.state.status) {
                payload.status = this.state.status;
            };
            if (this.state.state) {
                payload.state = this.state.state;
            }
            if (this.state.activity) {
                payload.activity = this.state.activity;
            }
            if (this.state.activityId) {
                payload.activityId = this.state.activityId;
            }
            payload['limitValue'] = this.itemsPerPage;
            payload['skipValue'] = Number(pageNum) ? (pageNum - 1) * this.itemsPerPage : 0;
            payload['searchText'] = this.searchText ? this.searchText : undefined;
            this.showLoaderIcon(true);
            this.props.filterActivity(payload)
                .then(res => {
                    this.showLoaderIcon(false);
                    if (res.activity.status !== 200) {
                        const message = typeof (res.activity.message) === "string" ? res.activity.message : "Something went wrong! Please try again!"
                        failureToast(message);
                    }
                })
                .catch((err) => {
                    this.showLoaderIcon(false);
                    failureToast("Something went wrong while retrieving activities!");
                });
        } catch (error) {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while retrieving activities!");
        }
    }
    getSearchResults = (text) => {
        this.searchText = text;
    }
    resetSearch = () => {
        this.searchText = null;
        this.fetchActivities();
    }
    fetchSearchResults = () => {
        if (this.searchText && this.searchText.length > 0) {
            this.fetchActivities();
        }
    }

    handleSubmitActivity = () => {
        const { failureToast, actionBy, successToast, selectedActivityDetails } = this.props;
        let activityInformation = null;
        let data = {
            activityId: activityInformation && activityInformation.activityId ? activityInformation.activityId : "",
            actionBy: activityInformation && actionBy ? actionBy : "",
            status: activityInformation && activityInformation.status ? activityInformation.status : "",
            approvers: selectedActivityDetails && selectedActivityDetails.ApproverActivity ? selectedActivityDetails.ApproverActivity : [],
            clientId: this.props.clientId,
            featureId: this.props.featureId
        }
        if (data.approvers.length < 1) {
            return failureToast("Approvers are required to submit activity");
        }
        if (data.approvers.some(x => x["approverMail"] == this.props.userMail)) {
            return failureToast("User is an approver. Can not submit activity");
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.submitActivity(data).then((res) => {
                if (res.submitPlanActivity.status !== 200) {
                    const message = res.submitPlanActivity && res.submitPlanActivity.message ? res.submitPlanActivity.message : "Something Went Wrong While Submiting Activity!"
                    this.showLoaderIcon(false);
                    return failureToast(message);
                }
                this.fetchActivities();
                successToast("Planned activity has been submitted successfully");
                //setActivityListInitialState();
            });
        }).catch((err) => {
            this.showLoaderIcon(false);
            const message = err && err.message ? err.message : "Something went wrong. Please try again!";
            failureToast(message);
        });
    }

    handleObsolete = (activity) => {
        let activityInformation = null;
        if (activity) {
            activityInformation = activity;
        }
        const { failureToast, successToast, actionBy } = this.props;
        let data = {
            activityId: activityInformation && activityInformation.activityId ? activityInformation.activityId : "",
            userId: activityInformation && actionBy ? actionBy : "",
            clientId: activityInformation && activityInformation.clientId ? activityInformation.clientId : "",
            featureId: this.props.featureId
        };

        this.props.generateToken().then((token) => {
            data.apiToken = token.generateToken;
            this.showLoaderIcon(true);
            this.props.obsoleteActivity(data)
                .then((res) => {
                    if (res.obsoletePlanActivity.status !== 200) {
                        this.showLoaderIcon(false);
                        const message = res.obsoletePlanActivity && res.obsoletePlanActivity.message || "Something went wrong while updating activity!";
                        return failureToast(message);
                    }
                    successToast("Planned activity has been obsolete successfully");
                    this.fetchActivities();
                    // setActivityListInitialState();
                });
        }).catch(() => {
            this.showLoaderIcon(false);
            return failureToast("Something went wrong while updating activity!");
        });
    }

    handleCopy = (activity) => {
        let activityInformation = null;
        if (activity) {
            activityInformation = activity;
        }
        const { failureToast, successToast, actionBy } = this.props;
        let data = {
            activityId: activityInformation && activityInformation.activityId ? activityInformation.activityId : "",
            actionBy: activityInformation && actionBy ? actionBy : "",
            featureId: this.props.featureId,
            clientId: this.props.clientId
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.copyActivity(data)
                .then((res) => {
                    if (res.copyPlanActivity.status !== 200) {
                        this.showLoaderIcon(false);
                        const message = res.copyPlanActivity && res.copyPlanActivity.message ? res.copyPlanActivity.message : "Something Went Wrong While Cpoying Activity!";
                        return failureToast(message);
                    }
                    this.fetchActivities();
                    successToast("Planned activity has been copied successfully");
                });
        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something Went Wrong While Cpoying Activity!");
        });
    }

    handlePageChange = async (e, activePage) => (activePage !== this.state.activePage) && this.setState({ activePage }, () => this.fetchActivities(activePage));

    getHeaderButtons = () => {
        const buttons = [

            { name: 'Add New ', id: "addNewCR", className: 'btn add-new-tc' }];

        return [{ name: 'Change Requests', className: "component-head-text" },
        {
            name:
                <div className="header-controls" style={{ display: "flex", alignItems: "center" }}>
                    {
                        buttons.map((button, index) => <button key={index} onClick={button.onClick || null} {...button}>{button.name}</button>)
                    }
                </div>
        }];
    }

    // getSearchResults = (text) => {
    //     let { activities } = this.props;
    //     if (text.length > 0) {
    //         let searchResults = [];
    //         activities.forEach(activity => {
    //             if (activity.activity.match(text)) {
    //                 searchResults.push(activity);
    //             }
    //         });
    //         this.setState({ searchResults: searchResults });
    //     }
    //     else {
    //         this.setState({ searchResults: activities });
    //     }
    // }

    onSidePanelClick = (e) => {
        e.preventDefault();
        this.setState(PrevState => ({ isShowSidePanel: !PrevState.isShowSidePanel }));
    }

    onChanged = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onResetFilters = () => {

        if (this.state.filterApplied) {
            this.fetchActivities();
        }
        this.setState({ status: '', state: '', activity: '', activityId: '', isShowSidePanel: false, filterApplied: false });
    }
    // when filters has applyed, page number has to be set to 1;
    applyFilter = () => this.setState({ activePage: 1, filterApplied: true, isShowSidePanel: false }, () => this.getActivitiesWithFilters(1));

    showLoaderIcon = (loading) => this.setState({ loading });

    getActivitiesWithFilters = async (pageNum) => {
        const { actionBy, featureId, clientId, failureToast } = this.props;
        let filterData = { actionBy, featureId, clientId, clientIdFilter: true };
        if (this.state.status) {
            filterData.status = this.state.status;
        };
        if (this.state.state) {
            filterData.state = this.state.state;
        }
        if (this.state.activity) {
            filterData.activity = this.state.activity;
        }
        if (this.state.activityId) {
            filterData.activityId = this.state.activityId;
        }
        filterData['limitValue'] = this.itemsPerPage;
        filterData['skipValue'] = Number(pageNum) ? (pageNum - 1) * this.itemsPerPage : 0;
        var self = this;
        await this.props.generateToken().then((token) => {
            self.showLoaderIcon(true);
            filterData["apiToken"] = token.generateToken;
            self.props.filterActivity(filterData)
                .then(res => {
                    self.showLoaderIcon(false);
                    if (res.activity.status !== 200) {
                        const message = typeof (res.activity.message) === "string" ? res.activity.message : "Something went wrong! Please try again!";
                        failureToast(message);
                    }
                    self.setState(prevState => ({ currentPage: pageNum || prevState.currentActivePage }));
                })
                .catch(() => {
                    self.showLoaderIcon(false);
                    failureToast("Something went wrong while retrieving activities!");
                });
        }).catch(() => {
            self.showLoaderIcon(false)
            failureToast("Something went wrong. Please try again!");
        });
    }

    getTicketDetails = async (ticketId) => {
        const {
            getIncidentDetails,
            clientId,
            actionBy: userId,
            featureId,
            generateToken,
            failureToast,
        } = this.props;
        getIncidentDetails();
        const { generateToken: apiToken } = await generateToken();
        this.showLoaderIcon(true);
        await getIncidentDetails({
            clientId,
            userId,
            featureId,
            apiToken,
            ticketId,
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

    openSOPModal = async (subject, description) => {
        // const { ticketDescription: description, ticketSubject: subject } = this.state;
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


    onAutomationTemplatesOpen = () => {
        $('#TicketDetailsModal').modal('hide');
        this.setState({ hasShowAutomationTemplates: true });
    }

    onJobLunch = (resourceId) => {
        $('#admanceAutomation').modal('hide');
        if (resourceId) {
            this.props.successToast('Job launched Successfully');
        }
    }

    render() {
        const { activities, selectedActivityDetails, totalActivities = 0 } = this.props;
        const { activePage, loading } = this.state;
        let noOfPages = Math.ceil(Number(totalActivities) / this.itemsPerPage);
        const { CRState, statusList } = this.props.getAllMasterData || {};
        const { suggestionArticlesTags, suggestionArticles } = this.state;

        return (
            <>
                <Loader
                    loading={loading}
                />
                <ComponentHeader
                    dashboardText={this.getHeaderButtons()}
                />
                <SidePanel
                    isShowSidePanel={this.state.isShowSidePanel}
                    onSidePanelClick={this.onSidePanelClick}
                    onFilterChanged={this.onChanged}
                    statusList={statusList}
                    CRState={CRState}
                    applyFilter={this.applyFilter}
                    onReset={this.onResetFilters}
                    status={this.state.status}
                    state={this.state.state}
                    activity={this.state.activity}
                    activityId={this.state.activityId}
                />

                <div className="page">
                    <div className="bg-wh" >
                        {/* search and filters */}
                        <HeaderActions
                            onSidePanelClick={this.onSidePanelClick}
                            onSearchInput={this.onChanged}
                            text={this.searchText}
                            resetSearch={this.resetSearch}
                            onSearchSubmit={this.fetchSearchResults}
                            getSearchResults={this.getSearchResults}
                        />
                        {/* table */}
                        <div className="mt-3">
                            <Table
                                data={this.state.searchResults ? this.state.searchResults : activities}
                                currentPage={Number(this.state.activePage)}
                                itemsPerPage={Number(this.itemsPerPage)}
                                onSearchClick={this.onSearchClick}
                                onObseleteClick={this.handleObsolete}
                                onCopyClick={this.handleCopy}
                                onActivityClick={this.onActivityClick}
                                onTicketClick={this.onTicketClick}
                            />
                        </div>
                        {
                            totalActivities > this.itemsPerPage && <>
                                <div className="text-center" style={{ marginTop: '1rem' }}>
                                    <p>
                                        Showing {1 + (this.itemsPerPage * (activePage - 1))}-{activePage * this.itemsPerPage}/{totalActivities}
                                    </p>
                                </div>
                                <div className="pagination-center">
                                    <Pagination count={noOfPages} page={activePage} onChange={this.handlePageChange} />
                                </div>
                            </>
                        }
                    </div>
                </div>
                <ChangeRequestInfo
                    activity={selectedActivityDetails}
                    onCopyClick={this.handleCopy}
                    onObseleteClick={this.handleObsolete}
                    onSubmitClick={this.handleSubmitActivity}
                    loading={this.state.loading}
                    generateToken={this.props.generateToken}
                    userId={this.props.actionBy}
                />

                <TicketDetails
                    activity={selectedActivityDetails}
                    onCopyClick={this.handleCopy}
                    onObseleteClick={this.handleObsolete}
                    onSubmitClick={this.handleSubmitActivity}
                    ticketDetails={this.props.getIncidentDetailsData}
                    loading={this.state.loading}
                    history={this.props.history}
                    featureId={this.props.ticketFeatureId}
                    onAutomationTemplatesOpen={this.onAutomationTemplatesOpen}
                    openSOPModal={this.openSOPModal}
                />
                <SuggestedSOP
                    suggestionArticlesTags={suggestionArticlesTags}
                    suggestionArticles={suggestionArticles}
                />
                {/* add new window */}
                <div className="modal" id="addnewId" aria-labelledby="myLargeModalLabel" data-backdrop="static"
                    data-keyboard="false" tabIndex="-1" role="dialog" aria-hidden="true" style={{ overflow: "auto" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div class="modal-header" style={{ borderBottom: 'none' }}>
                                <h4 class="modal-title" style={{ fontFamily: 'Open Sans Bold' }}>New Activity</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => $('#addnewId').modal('hide')}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                {
                                    this.state.hasShowAddNewWindow &&
                                    <ActivityAddPage
                                        clientId={this.props.clientId}
                                        fetchActivities={() => {
                                            $('#addnewId').modal('hide');
                                            this.fetchActivities();
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* admanceAutomation */}
                <div className="modal" id="admanceAutomation" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel"> Automation Template</h5>
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
                                            subject={this.props.getIncidentDetailsData.subject}
                                            description={this.props.getIncidentDetailsData.description}
                                        />
                                    }
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
        activities: (state.activity && state.activity.data) ? state.activity.data : [],
        totalActivities: (state.activity && state.activity.totalCount) ? state.activity.totalCount : 0,
        selectedActivityDetails: state.activityDetails ? state.activityDetails : [],
        totalCount: (state.activity && state.activity.totalCount) ? state.activity.totalCount : 0,
        clientId: state.current_client?.payload?.client,
        actionBy: (state.current_user.payload) ? state.current_user.payload.userId : "",
        featureId: state.clientUserFeatures?.featureIds?.PlannedActivity,
        getAllMasterData: state?.getAllMasterData && Array.isArray(state.getAllMasterData) && state.getAllMasterData.length ? state.getAllMasterData[0] : {},
        getIncidentDetailsData: state.incidentDetails && state.incidentDetails.data ? state.incidentDetails.data : {},
        ticketFeatureId: state?.clientUserFeatures?.featureIds?.Tickets
    }
}

function mapdispatchToProps(dispatch) {
    return bindActionCreators({
        generateToken,
        filterActivity,
        getActivityDetails,
        copyActivity,
        obsoleteActivity,
        submitActivity,
        failureToast,
        successToast,
        getIncidentDetails
    }, dispatch);
}

export default connect(mapStateToProps, mapdispatchToProps)(ChangeRequest);