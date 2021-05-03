import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import $ from 'jquery';
import Loader from '../resources/Loader';
import { HostActions } from '../InventoryPages/HostActions';
import { HostDetails } from './resources/HostDetails';

import { fetchAzureHostDetails } from "../../actions/hostInventory/azureHostInventoryMain";
import { approveHostDetailsAz, rejectHostDetailsAz, bulkApproveAzure, bulkRejectAzure, azureCurrentState } from "../../actions/hostInventory/azureHostInventoryMain";
import { generateToken } from "../../actions/commons/commonActions";
import { failureToast, successToast, infoToast } from "../../actions/commons/toaster";
import { getAzureList } from "../../actions/hostInventory/azureHostInventoryMain";
import "./resources/page.css";
import Filters from '../InventoryPages/SidePanelFilters';
import { sandboxAccountsByProject } from "../../actions/projects";

class AzureTBAList extends Component {


    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.azureList = this.azureList.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
        this.onBulkChecks = this.onBulkChecks.bind(this);
        this.onSyncHostStatus = this.onSyncHostStatus.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.updateAllCheckboxes = this.updateAllCheckboxes.bind(this);
    };

    getInitialState = () => ({
        isLoading: false,
        hasShowDetails: false,
        checkedInstances: [],
        availableTBAHosts: [],
        isShowSidePanel: false
    });

    componentDidMount() {
        this.azureList();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.clientId !== this.props.clientId) {
            this.setState({ isLoading: false, hasShowDetails: false });
            this.azureList();
        }
        if (prevProps.isClearTxtBtnClicked !== this.props.isClearTxtBtnClicked && this.state.activePage > 1) {
            await this.setInitialState();
            this.azureList();
        }
    }

    catchBlock = (err) => {
        const text = err.message && typeof err.message === "string" ? err.message : "Something went wrong!";
        this.props.failureToast(text);
        this.showLoaderIcon(false);
    }

    setInitialState = () => this.setState(this.getInitialState());

    showLoaderIcon = (isLoading) => this.setState({ isLoading });

    async azureList(pageNum) {
        const { featureId, clientId, userId: actionBy, generateToken, getAzureList, failureToast, setTotalCount, infoToast } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const reqPayload = { approvalStatus: "PENDING APPROVAL", featureId, clientId, actionBy, apiToken };
        const self = this;
        self.showLoaderIcon(true);
        if (pageNum && pageNum > 1) {
            reqPayload["pageNum"] = pageNum;
        }
        getAzureList && getAzureList(reqPayload)
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

    getAzureHostDetails = async (hostInventoryId, event) => {
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
        self.showLoaderIcon(true);
        const { featureId, clientId, userId, generateToken, failureToast } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const reqPayload = { approvalStatus: "PENDING APPROVAL", featureId, clientId, userId, apiToken, hostInventoryId };
        this.props.fetchAzureHostDetails(reqPayload)
            .then(res => {
                const { status, message } = res;
                if (status !== 200) {
                    const text = message && typeof message === "string" ? message : "Something went wrong!";
                    failureToast(text);
                    return self.showLoaderIcon(false);
                }
                $('#viewHostDetails').modal('show');
                self.setState({ hasShowDetails: true, isLoading: false });
            }).catch(err => {
                const text = err.message && typeof err.message === "string" ? err.message : "Something went wrong!";
                failureToast(text);
                self.showLoaderIcon(false);
            });
    }


    approveHostDetails = (hostInventoryId, hostname, approvalReqBy) => {
        const { failureToast, successToast, userId } = this.props;
        this.showLoaderIcon(true);
        const self = this;
        this.props.approveHostDetailsAz(hostInventoryId, hostname, approvalReqBy, userId)
            .then(res => {
                const { status, message } = res && res.azureApproveDetails;
                if (status !== 200) {
                    const text = message && typeof message === "string" ? message : "Something went wrong!";
                    failureToast(text);
                    return self.showLoaderIcon(false);
                }
                successToast("Host got approved successfully");
                self.azureList();
                self.setState({ isLoading: false, hasShowDetails: false });
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
        this.props.rejectHostDetailsAz(hostInventoryId, approvalReqBy, userId)
            .then(res => {
                const { status, message } = res && res.azureRejectDetails;
                if (status !== 200) {
                    const text = message && typeof message === "string" ? message : "Something went wrong!";
                    failureToast(text);
                    return self.showLoaderIcon(false);
                }
                successToast("Host got rejected successfully");
                self.setState({ isLoading: false, hasShowDetails: false });
                self.azureList();
            }).catch(err => {
                const text = err.message && typeof err.message === "string" ? err.message : "Something went wrong!";
                failureToast(text);
                self.showLoaderIcon(false);
            });
    }

    values = [];
    onCheckChange(e) {
        const value = e.target.value
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

    async onBulkChecks(e) {
        const { name } = e.currentTarget;
        const { checkedInstances: hostIds } = this.state;
        const { failureToast, successToast, bulkApproveAzure, bulkRejectAzure, userId, clientId, featureId, generateToken } = this.props;
        if (!Array.isArray(hostIds) || !hostIds.length) {
            return failureToast('Please select atleast one Host!');
        }
        const { generateToken: apiToken } = await generateToken();
        const payload = { userId, clientId, featureId, apiToken, hostIds };
        const self = this;
        this.showLoaderIcon(true);
        if (name === "approve") {
            return bulkApproveAzure(payload)
                .then(res => {
                    self.showLoaderIcon(false);
                    if (res.data) {
                        const { message, status } = res.data;
                        if (status === 200) {
                            self.azureList();
                            $('#selectAll').prop('checked', false);
                            self.resetHosts();
                            return successToast("Successfully Approved!");
                        }
                        const text = typeof message === "string" ? message : "Something went wrong while approving hosts!";
                        return failureToast(text);
                    }
                });
        }
        return bulkRejectAzure(payload)
            .then(res => {
                self.showLoaderIcon(false);
                if (res.data) {
                    const { message, status } = res.data;
                    if (status === 200) {
                        self.azureList();
                        $('#selectAll').prop('checked', false);
                        self.resetHosts();
                        return successToast("Successfully Rejected!");
                    }
                    const text = typeof message === "string" ? message : "Something went wrong while rejecting hosts!";
                    return failureToast(text);
                }
            });
    }


    async onSyncHostStatus() {
        const { userId, featureId, clientId, generateToken, failureToast, successToast, azureCurrentState } = this.props;
        const { checkedInstances } = this.state;
        if (!Array.isArray(checkedInstances) || !checkedInstances.length) {
            return failureToast('Please select atleast one host!');
        }
        const { generateToken: apiToken } = await generateToken();
        const payload = { userId, featureId, clientId, apiToken, hostInventoryIds: checkedInstances };
        const self = this;
        self.showLoaderIcon(true);
        try {
            azureCurrentState(payload)
                .then(res => {
                    self.showLoaderIcon(false);
                    if (res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong";
                            return failureToast(text);
                        }
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

    onSelectAll(e) {
        const { checked } = e.target;
        this.updateAllCheckboxes(checked);
    }
    updateAllCheckboxes(checked) {
        const getAzureList = this.props.isSearchTxtBtnClicked === "yes" ? this.props.azureSearchHostData : this.state.availableTBAHosts;
        if (Array.isArray(getAzureList)) {
            var hostInventories = getAzureList.map(azureData => {
                $(`#${azureData.hostInventoryId}`).prop('checked', checked)
                return azureData.hostInventoryId;
            });
            this.values = checked ? hostInventories : [];
            this.setState({ checkedInstances: checked ? hostInventories : [] });
        }
    }

    onCancel = () => {
        this.setInitialState();
        $('#viewHostDetails').modal('hide');
    }


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
                        fill="currentColor"
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
            { tag: <div className="th-text table-th-label">VM Name</div>, className: 'aws-col-inst' },
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
        return availableTBAHosts.map((host, index) =>
            <tr key={host.hostInventoryId} onClick={(e) => this.getAzureHostDetails(host.hostInventoryId, e)}>
                <td>
                    <div className="form-check form-check-inline" style={{ width: "50px" }}>
                        <input className="form-check-input" type="checkbox" id={`${host.hostInventoryId}`} value={host.hostInventoryId} onClick={this.onCheckChange} />
                        <label className="form-check-label" htmlFor={`${host.hostInventoryId}`}>{index + 1}</label>
                    </div>
                </td>
                
                <td>
                    <span>{host.hostname} </span>
                </td>
                <td>
                    <span>{host.vmName} </span>
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

    onTextChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onProjectChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value, accountIdFilter: "" });
        const { sandboxAccountsByProject, clientId, infoToast, failureToast } = this.props;
        // 2 for azure type
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

    Resetfilter = () => {
        const { sandboxAccountsByProject } = this.props;
        sandboxAccountsByProject("");
        this.setState({
            projectIdFilter: "",
            accountIdFilter: "",
            isProjectLinkedFilter: "",
            isShowSidePanel: false,
            hostStatus: ''
        }, () => this.azureList());
    }

    async filteringAzureList() {
        let param = {};
        const { generateToken: generateTokenFunc, clientId, userId, featureId, getAzureList, setTotalCount } = this.props;
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
        const { generateToken } = await generateTokenFunc();
        param["apiToken"] = generateToken;
        const self = this;
        this.showLoaderIcon(true);
        getAzureList && getAzureList(param)
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

    applyFilter = (e) => {
        this.setState({ isShowSidePanel: false });
        this.filteringAzureList();
    }

    onSidePanelClick = () => this.setState(prevState => ({ isShowSidePanel: !prevState.isShowSidePanel }))


    render() {
        const { loading, hasShowDetails, availableTBAHosts } = this.state;
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
                                    hostDetails={this.props.azureHostDetails}
                                    showLoaderIcon={this.showLoaderIcon}
                                    loading={this.state.loading}
                                    onCancel={this.onCancel}
                                    getList={this.azureList.bind(this, this.props.activePage)}
                                />
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        azureHostDetails: state.azureHostDetails,
        userId: state.current_user.payload.userId,
        hostClients: state.hostClients,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures.featureIds ? state.clientUserFeatures.featureIds.HostInventoryvault : "",
        generateToken: generateToken,
        awsApproveDetails: state.awsApproveDetails,
        projectListData: state.getProjectList && Array.isArray(state.getProjectList.data) ? state.getProjectList.data : [],
        sandboxAccountData: state.sandboxAccountsByProject && Array.isArray(state.sandboxAccountsByProject.data) ? state.sandboxAccountsByProject.data : []
    }
}

function mapDispatchToProps(dispatch) {
    let action = bindActionCreators({
        fetchAzureHostDetails,
        rejectHostDetailsAz,
        approveHostDetailsAz,
        failureToast,
        successToast,
        generateToken,
        getAzureList,
        bulkApproveAzure,
        bulkRejectAzure,
        azureCurrentState,
        infoToast,
        sandboxAccountsByProject
    }, dispatch)
    return action
}

export default connect(mapStateToProps, mapDispatchToProps)(AzureTBAList);