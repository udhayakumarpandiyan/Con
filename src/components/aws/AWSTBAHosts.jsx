import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import $ from 'jquery';
import Loader from '../resources/Loader';
import { HostActions } from '../InventoryPages/HostActions';
import { HostDetails } from './resources/HostDetails';
/* actions */
import { fetchHostDetails, approveHostDetails, rejectHostDetails, bulkApproveAws, bulkRejectAws, awsCurrentState } from "../../actions/hostInventory/awsHostInventoryMain";
import { generateToken } from "../../actions/commons/commonActions";
import { failureToast, successToast, infoToast } from "../../actions/commons/toaster";
import { getAwsList } from "../../actions/hostInventory/awsHostInventoryMain";
import "./resources/page.css";
import Filters from '../InventoryPages/SidePanelFilters';
import { sandboxAccountsByProject } from "../../actions/projects";


class AWSTBAHOST extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        availableTBAHosts: [],
        isShowSidePanel: false,
        loading: false
    })

    showLoaderIcon = (loading) => this.setState({ loading });

    getApprovedHostButtonsLIst = () => {
        const list = [
            <div className="d-inline-block has-search" style={{ marginRight: '5px', marginLeft: '5px' }}>
                <span className="fa fa-search form-control-feedback"></span>
                <input type="text" className="form-control" placeholder="Search" />
            </div>,
            <button onClick={this.onBulkChecks} name='approve'><i className="fa fa-check-circle" style={{ color: '#4CAF50' }}></i> Approve </button>,
            <button onClick={this.onBulkChecks} style={{ padding: '5px 20px' }}> <i className="fa fa-times-circle" style={{ color: '#f44336' }}></i> Reject</button>,
            <button onClick={this.onSyncHostStatus}> <i className="fa fa-refresh" style={{ color: "#6767bd", marginRight: '0.2rem' }}></i> Sync Host Status</button>,
            <div className="filter">
                <button className="btn btn-link p-0" style={{ background: 'none' }} onClick={this.onSidePanelClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#7d7f7d"
                        className="bi bi-funnel-fill"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"
                        />
                    </svg>
                </button>
            </div>
        ];
        return list;
    }

    getTableColumns = () => {
        return [
            {
                tag: <span className="checkbox-all">
                    <div className="form-group group-lable m-0">
                        <input type="checkbox" id="checkAll" onClick={this.onSelectAll} />
                        <label htmlFor="checkAll" className="th-text table-th-label"> S.no </label>
                    </div>
                </span>,
                className: 'aws-col-sn'
            },
            { tag: <div className="th-text table-th-label">name</div>, className: 'aws-col-name' },
            { tag: <div className="th-text table-th-label">Instance Id</div>, className: 'aws-col-inst' },
            { tag: <div className="th-text table-th-label">status</div> },
            { tag: <div className="th-text table-th-label">public ip</div> },
            { tag: <div className="th-text table-th-label">Project Name</div> },
            { tag: <div className="th-text table-th-label">Account</div>, className: 'aws-col-account' },
            { tag: <div className="th-text table-th-label">Type/OS/PORT</div> },
            { tag: <div className="th-text table-th-label">Actions</div> }
        ];
    }

    getTableBody = (availableTBAHosts) => {
        const { userId } = this.props;
        let awsList = this.props.isSearchTxtBtnClicked === "yes" ? this.props.awsSearchHostData : availableTBAHosts;
        if (this.props.isClearTxtBtnClicked === 'yes' || this.props.disableCheckbox === 'yes') {
            this.disableCheckboxAndDetailPage();
        }
        return awsList.map((host, index) =>
            <tr key={host.hostInventoryId} onClick={(e) => this.fetchHostDetails(host.hostInventoryId, e)}>
                <td>
                    <div className="form-group group-lable m-0">
                        <input type="checkbox" id={`${host.hostInventoryId}`} value={host.hostInventoryId} onClick={this.onCheckChange} />
                        <label htmlFor={`${host.hostInventoryId}`}>{index + 1}</label>
                    </div>
                </td>
                <td>
                    <span>{host.hostname} </span>
                </td>
                <td>
                    <span>{host.instanceId} </span>
                </td>
                <td>
                    <span>{host.status} </span>
                </td>
                <td>
                    <span>{host.publicIp} </span>
                </td>
                <td>
                    <span>{host.projectName} </span>
                </td>
                <td>
                    <span>{host.sandboxName} </span>
                </td>
                <td>
                    <span>{host.typeName + "/" + host.osName + "/" + host.port} </span>
                </td>
                <td>
                    {
                        host.approver === userId &&
                        <i className="fa fa-check-circle float-sm-center" onClick={() => this.approveHostDetails(host.hostInventoryId, host.hostname, host.approvalReqBy)} title="Approve Host"></i>
                    }
                        &nbsp;&nbsp;
                            <i className="fa fa-times-circle float-sm-center" onClick={() => this.rejectHostDetails(host.hostInventoryId, host.approvalReqBy)} title="Reject Host"></i>
                        &nbsp;&nbsp;
                </td>
            </tr>
        )
    }

    fetchHostDetails = async (hostInventoryId, event) => {
        const { tagName } = event ? event.target : {};
        if (tagName && tagName.toLowerCase() === "input") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "i") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "label") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "img") {
            return;
        }
        const self = this;
        this.setState({ hasShowDetails: false });
        self.showLoaderIcon(true);
        const { featureId, clientId, userId, generateToken, failureToast } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const reqPayload = { approvalStatus: "PENDING APPROVAL", featureId, clientId, userId, apiToken, hostInventoryId };
        this.props.fetchHostDetails(reqPayload)
            .then(res => {
                const { status, message } = res;
                if (status !== 200) {
                    const text = message && typeof message === "string" ? message : "Something went wrong!";
                    failureToast(text);
                    self.showLoaderIcon(false);
                }
                self.setState({ hasShowDetails: true, loading: false });
            }).catch(err => {
                const text = err.message && typeof err.message === "string" ? err.message : "Something went wrong!";
                failureToast(text);
                self.showLoaderIcon(false);
            });
        $('#viewHostDetails').modal('show');
    }

    componentDidMount() {
        this.getAWSTBAHostsList();
    }

    getAWSTBAHostsList = async (pageNum) => {
        const { featureId, clientId, userId: actionBy, generateToken, getAwsList, failureToast, setTotalCount, infoToast } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const reqPayload = { approvalStatus: "PENDING APPROVAL", featureId, clientId, actionBy, apiToken };
        const self = this;
        self.showLoaderIcon(true);
        if (pageNum && pageNum > 1) {
            reqPayload["pageNum"] = pageNum;
        }
        getAwsList(reqPayload)
            .then(res => {
                self.showLoaderIcon(false);
                const { data, status, message } = res.data;
                if (Array.isArray(data) && status === 200) {
                    self.setState({ availableTBAHosts: [] });
                    return infoToast("No AWS Hosts Available!!!");
                }
                if (status === 200) {
                    self.setState({ availableTBAHosts: data.hostList });
                    if (data?.totalHostCount) {
                        setTotalCount(data.totalHostCount)
                    }
                    return;
                }
                return failureToast(message);
            });
    }

    approveHostDetails = (hostInventoryId, hostname, approvalReqBy) => {
        const { failureToast, successToast, userId } = this.props;
        this.showLoaderIcon(true);
        const self = this;
        this.props.approveHostDetails(hostInventoryId, hostname, approvalReqBy, userId)
            .then(res => {
                const { status, message } = res && res.awsApproveDetails;
                if (status !== 200) {
                    const text = message && typeof message === "string" ? message : "Something went wrong!";
                    failureToast(text);
                    return self.showLoaderIcon(false);
                }
                successToast("Host approved succesfully!");
                self.setState({ loading: false, hasShowDetails: false });
                self.getAWSTBAHostsList(self.props.activePage);
            }).catch(err => {
                const text = err.message && typeof err.message === "string" ? err.message : "Something went wrong!";
                failureToast(text);
                self.showLoaderIcon(false);
            });
    }


    rejectHostDetails = (hostInventoryId, approvalReqBy) => {
        const { failureToast, successToast, userId } = this.props;
        this.showLoaderIcon(true);
        const self = this;
        this.props.rejectHostDetails(hostInventoryId, approvalReqBy, userId)
            .then(res => {
                const { status, message } = res && res.awsRejectDetails;
                if (status !== 200) {
                    const text = message && typeof message === "string" ? message : "Something went wrong!";
                    failureToast(text);
                    return self.showLoaderIcon(false);
                }
                successToast("Host approval cancelled succesfully!");
                self.setState({ loading: false, hasShowDetails: false });
                self.getAWSTBAHostsList();
            }).catch(err => {
                const text = err.message && typeof err.message === "string" ? err.message : "Something went wrong!";
                failureToast(text);
                self.showLoaderIcon(false);
            });
    }
    values = [];
    onCheckChange = (e) => {
        const value = e.target.value;
        if ($(`#${e.target.id}`).is(':checked')) {
            $(this).prop('checked', true);
            this.values.push(value)
        } else {
            var i = this.values.indexOf(value);
            if (i != -1) this.values.splice(i, 1);
            $(this).prop('checked', false);
        }
        this.setState({ checkedInstances: this.values });
    }

    resetHosts() {
        this.values = [];
        this.setState({ checkedInstances: [] })
    }

    onBulkChecks = async (e) => {
        const { name } = e.currentTarget;
        const { checkedInstances: hostIds } = this.state;
        const { failureToast, successToast, bulkApproveAws, bulkRejectAws, userId, clientId, featureId, generateToken } = this.props;
        if (!Array.isArray(hostIds) || !hostIds.length) {
            return failureToast('Please select atleast one Host!');
        }
        const { generateToken: apiToken } = await generateToken();
        const payload = { userId, clientId, featureId, apiToken, hostIds };
        const self = this;
        this.showLoaderIcon(true);
        if (name === "approve") {
            return bulkApproveAws(payload)
                .then(res => {
                    self.showLoaderIcon(false);
                    if (res.data) {
                        const { message, status } = res.data;
                        if (status === 200) {
                            self.getAWSTBAHostsList();
                            $('#selectAll').prop('checked', false);
                            self.resetHosts();
                            return successToast("Successfully Approved!");
                        }
                        const text = typeof message === "string" ? message : "Something went wrong while approving hosts!";
                        return failureToast(text);
                    }
                });
        }
        return bulkRejectAws(payload)
            .then(res => {
                self.showLoaderIcon(false);
                if (res.data) {
                    const { message, status } = res.data;
                    if (status === 200) {
                        self.getAWSTBAHostsList();
                        $('#selectAll').prop('checked', false);
                        self.resetHosts();
                        return successToast("Successfully Rejected!");
                    }
                    const text = typeof message === "string" ? message : "Something went wrong while rejecting hosts!";
                    return failureToast(text);
                }
            });
    }
    onSyncHostStatus = async () => {
        const { userId, featureId, clientId, generateToken, failureToast, successToast, awsCurrentState } = this.props;
        const { checkedInstances } = this.state;
        if (!Array.isArray(checkedInstances) || !checkedInstances.length) {
            return failureToast('Please select atleast one host!');
        }
        const { generateToken: apiToken } = await generateToken();
        const payload = { userId, featureId, clientId, apiToken, hostInventoryIds: checkedInstances };
        const self = this;
        self.showLoaderIcon(true);
        try {
            awsCurrentState(payload)
                .then(res => {
                    self.showLoaderIcon(false);
                    if (res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong";
                            return failureToast(text);
                        }
                        self.getAWSTBAHostsList(self.props.activePage);
                        self.values = [];
                        self.setState({ checkedInstances: [] });
                        $('#selectAll').prop('checked', false);
                        checkedInstances.map(hostId => $(`#${hostId}`).prop('checked', false));
                        successToast('Successfully updated!');
                    }
                })
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong!";
            self.showLoaderIcon(false);
            failureToast(text);
        }
    }

    onSelectAll = (e) => {
        const { checked } = e.target;
        this.updateAllCheckboxes(checked);
    }

    updateAllCheckboxes = async (checked) => {
        let getAwsList = this.props.isSearchTxtBtnClicked === "yes" ? this.props.awsSearchHostData : this.state.availableTBAHosts;
        if (Array.isArray(getAwsList)) {
            var hostInventories = getAwsList.map(awsData => {
                $(`#${awsData.hostInventoryId}`).prop('checked', checked);
                return awsData.hostInventoryId;
            });
            this.values = checked ? hostInventories : [];
            this.setState({ checkedInstances: checked ? hostInventories : [] });
        }
    }

    disableCheckboxAndDetailPage() {
        let isChecked = $("#selectAll").prop("checked");
        if (isChecked && this.props.isClearTxtBtnClicked === 'yes') {
            $("#selectAll").prop("checked", false); this.updateAllCheckboxes(!isChecked);
        } else if (!isChecked && this.state.checkedInstances.length > 0 &&
            this.props.isClearTxtBtnClicked === 'yes') {
            this.updateAllCheckboxes(false);
        } else if (this.props.disableCheckbox === "yes" && isChecked) {
            $("#selectAll").prop("checked", false); this.updateAllCheckboxes(!isChecked);
        } else if (this.props.disableCheckbox === "yes" && this.state.checkedInstances.length > 0) {
            this.updateAllCheckboxes(false);
        } else if (this.state.hasShowDetails && (this.props.disableCheckbox === 'yes' ||
            this.props.isClearTxtBtnClicked === 'yes')) {
            this.setState({ selectedRow: "", hasShowDetails: false });
        }
    }

    onCancel = () => {
        $('#viewHostDetails').modal('hide');
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.activePage !== this.props.activePage) && !this.props.hasShowingSearchData) {
            this.getAWSTBAHostsList(this.props.activePage);
        }
        if (prevProps.clientId !== this.props.clientId) {
            this.setState(this.getInitialState());
            this.getAWSTBAHostsList();
        }
    }

    onTextChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onProjectChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value, accountIdFilter: "" });
        const { sandboxAccountsByProject, clientId, infoToast, failureToast } = this.props;
        // 1 for aws type
        this.showLoaderIcon(true);
        sandboxAccountsByProject(value, clientId, 1)
            .then(res => {
                this.showLoaderIcon(false);
                const { status, message, data } = res.data;
                if (status !== 200) {
                    const text = typeof message === "string" ? message : "Something went wrong while listing sandbox accounts";
                    return failureToast(text);
                }
                if (status === 200 && (!Array.isArray(data) || Array.isArray(data) && !data.length)) {
                    infoToast('You do not have sandbox accounts for this project');
                }
            });
    }

    onSidePanelClick = () => this.setState(prevState => ({ isShowSidePanel: !prevState.isShowSidePanel }))


    applyFilter = () => {
        this.setState({ isShowSidePanel: false });
        this.filteringAwsList();
    }

    filteringAwsList = async () => {
        let param = {};
        const { generateToken: generateTokenFunc, clientId, userId, featureId, getAwsList, setTotalCount, infoToast } = this.props;
        param = {
            "skip": 0,
            "limit": 30,
            "featureId": featureId,
            "actionBy": userId,
            "clientId": clientId,
            approvalStatus: "PENDING APPROVAL"
        };
        if (this.state.projectIdFilter) {
            param["projectId"] = this.state.projectIdFilter;
        }
        if (this.state.isProjectLinkedFilter) {
            param["isProjectLinked"] = this.state.isProjectLinkedFilter === "TRUE" ? true : false;
        }
        if (this.state.accountIdFilter) {
            param["sandboxAccountId"] = this.state.accountIdFilter;
        }
        if (this.state.hostStatus) {
            param["hostStatus"] = this.state.hostStatus;
        }
        this.showLoaderIcon(true);
        const { generateToken } = await generateTokenFunc();
        param["apiToken"] = generateToken;
        const self = this;
        getAwsList && getAwsList(param)
            .then(res => {
                self.showLoaderIcon(false);
                const { data, status, message } = res.data;
                if (Array.isArray(data) && status === 200) {
                    self.setState({ availableTBAHosts: [] });
                    return infoToast("No AWS Hosts Available!!!");
                }
                if (status === 200) {
                    self.setState({ availableTBAHosts: data.hostList });
                    if (data?.totalHostCount) {
                        setTotalCount(data.totalHostCount)
                    }
                    return;
                }
                return failureToast(message);
            });
    }

    Resetfilter = () => {
        const { sandboxAccountsByProject } = this.props;
        sandboxAccountsByProject("");
        this.setState({
            projectIdFilter: "",
            accountIdFilter: "",
            isProjectLinkedFilter: "",
            isShowSidePanel: false,
            hostStatus: ''
        }, () => this.getAWSTBAHostsList());
    }

    render() {
        const { loading, availableTBAHosts, hasShowDetails } = this.state;
        const { isShowSidePanel, projectIdFilter, accountIdFilter, isProjectLinkedFilter, hostStatus } = this.state;
        const { projectListData, sandboxAccountData } = this.props;
        return (
            <>
                <Loader loading={loading} />
                <HostActions
                    buttonsList={this.getApprovedHostButtonsLIst()}
                />
                <Filters
                    isShowSidePanel={isShowSidePanel}
                    onFilterChanged={this.onTextChange}
                    projectListData={projectListData}
                    sandboxAccountData={sandboxAccountData}
                    onProjectChange={this.onProjectChange}
                    onReset={this.Resetfilter}
                    applyFilter={this.applyFilter}
                    onSidePanelClick={this.onSidePanelClick}
                    projectIdFilter={projectIdFilter}
                    accountIdFilter={accountIdFilter}
                    isProjectLinkedFilter={isProjectLinkedFilter}
                    hostStatus={hostStatus}
                />
                <table className="table table-hover aws-table">
                    <thead>
                        <tr>
                            {
                                this.getTableColumns().map((column, index) => <th className={column.className} key={index}>{column.tag}</th>)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.getTableBody(availableTBAHosts)
                        }
                    </tbody>
                </table>
                <div className="modal" id="viewHostDetails" data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Host Details</h3>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <Loader loading={loading} />
                            {
                                hasShowDetails &&
                                <HostDetails
                                    hostDetails={this.props.awsHostDetails}
                                    showLoaderIcon={this.showLoaderIcon}
                                    loading={this.state.loading}
                                    onCancel={this.onCancel}
                                    getList={this.getAWSTBAHostsList.bind(this, this.props.activePage)}
                                />
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}


function mapStateToProps(state) {
    return {
        awsHostDetails: state.awsHostDetails,
        userId: state.current_user.payload.userId,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures.featureIds ? state.clientUserFeatures.featureIds.HostInventoryvault : "",
        awsApproveDetails: state.awsApproveDetails,
        projectListData: state.getProjectList && Array.isArray(state.getProjectList.data) ? state.getProjectList.data : [],
        sandboxAccountData: state.sandboxAccountsByProject && Array.isArray(state.sandboxAccountsByProject.data) ? state.sandboxAccountsByProject.data : []
    }
}

function mapdispatchToProps(dispatch) {
    return bindActionCreators({
        fetchHostDetails,
        approveHostDetails,
        rejectHostDetails,
        bulkApproveAws,
        bulkRejectAws,
        awsCurrentState,
        getAwsList,
        failureToast,
        successToast,
        generateToken,
        infoToast,
        sandboxAccountsByProject
    }, dispatch);
}

export default connect(mapStateToProps, mapdispatchToProps)(AWSTBAHOST);
