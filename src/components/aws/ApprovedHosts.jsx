import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import $ from 'jquery';
import Loader from '../resources/Loader';
import { HostDetails } from './resources/HostDetails';
import {
    fetchHostDetails, awsCurrentState, manualStartAwsHost, manualStopAwsHost, getAwsList
} from "../../actions/hostInventory/awsHostInventoryMain";
import { successToast, failureToast, infoToast } from '../../actions/commons/toaster';
import { generateToken } from "../../actions/commons/commonActions";
import { hostInventoryApiUrls } from "./../../util/apiManager";
import Filters from '../InventoryPages/SidePanelFilters';
import { sandboxAccountsByProject } from "../../actions/projects";
import "./resources/page.css";
import { HostActions } from '../InventoryPages/HostActions';
import axios from 'axios';
import { ServicenowExportMessage } from '../InventoryPages/ServicenowExportMessage';

class ApprovedHosts extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        availableApprovedHosts: [],
        loading: false,
        searchText: '',
        isShowSidePanel: false,
        hasShowHostDetails: false,
        selectedExport: '',
        exportResults: {}
    });

    values = [];
    onCheckChange = async (e) => {
        const value = e.target.value;
        if ($(`#${e.target.id}`).is(':checked')) {
            $(this).prop('checked', true);
            this.values.push(value)
        } else {
            var i = this.values.indexOf(value);
            if (i != -1) this.values.splice(i, 1);
            $(this).prop('checked', false);
        }
    }

    onSelectAll = (e) => {
        const { checked } = e.target;
        this.updateAllCheckboxes(checked);
    }

    updateAllCheckboxes(checked, unCheckList) {
        // this.values = [];
        let availableApprovedHosts = [];
        if (unCheckList) {
            availableApprovedHosts = unCheckList;
        } else {
            availableApprovedHosts = this.props.isSearchTxtBtnClicked === "yes" ? this.props.awsSearchHostData : this.state.availableApprovedHosts;
        }
        if (Array.isArray(availableApprovedHosts)) {
            var hostInventories = availableApprovedHosts.map(awsData => {
                const id = typeof awsData === 'string' ? awsData : awsData.hostInventoryId;
                $(`#${id}`).prop('checked', checked);
                return id;
            });
            this.values = checked ? this.values.concat(hostInventories) : [];
        }
    }

    showLoaderIcon = (loading) => this.setState({ loading });

    manualStartOrStopAwsHosts = async (e) => {
        const { name } = e.currentTarget;
        const { userId, featureId, clientId, generateToken, failureToast, successToast, manualStartAwsHost, manualStopAwsHost } = this.props;
        if (!Array.isArray(this.values) || !this.values.length) {
            return failureToast('Please select atleast one host!');
        }
        const { generateToken: apiToken } = await generateToken();
        const payload = { userId, featureId, clientId, apiToken, hostIds: this.values };
        const self = this;
        const func = name === "Start" ? manualStartAwsHost : manualStopAwsHost;
        self.showLoaderIcon(true);
        try {
            func(payload)
                .then(res => {
                    self.showLoaderIcon(false);
                    if (res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong";
                            return failureToast(text);
                        }
                        self.values.map(hostId => $(`#${hostId}`).prop('checked', false));
                        $('#selectAll').prop('checked', false);
                        self.getApprovedHosts(self.props.activePage);
                        successToast(message);
                        self.values = [];
                    }
                })
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong!";
            self.showLoaderIcon(false);
            failureToast(text);
        }
    }

    exportAwsExcel = () => {
        const { projectIdFilter, isProjectLinkedFilter, accountIdFilter } = this.state;
        let uri = `${hostInventoryApiUrls.downloadAwsReport}` + this.props.clientId + "&userId=" + this.props.userId;
        if (projectIdFilter) {
            uri = uri + "&projectId=" + projectIdFilter;
        }
        if (isProjectLinkedFilter) {
            uri = uri + "&isProjectLinked=" + (isProjectLinkedFilter === "TRUE" ? true : false);
        }
        if (accountIdFilter) {
            uri = uri + "&sandboxAccountId=" + accountIdFilter;
        }
        window.open(uri);
    }

    getApprovedHostButtonsLIst = () => {
        const list = [
            <button onClick={this.manualStartOrStopAwsHosts} name="Start" style={{ padding: '4px 20px' }}>
                <i className="fa fa-play-circle" style={{ color: '#4CAF50', marginRight: '0.3rem' }}></i>Start </button>,
            <button onClick={this.manualStartOrStopAwsHosts} name="Stop" style={{ padding: '4px 20px' }}> <i className="fa fa-stop-circle" style={{ color: '#f44336', marginRight: '0.3rem' }}></i>Stop</button>,
            <button onClick={this.onSyncHostStatus} name="Sync Host Status" style={{ padding: '4px 20px' }}> <i className="fa fa-refresh" style={{ color: "#6767bd", marginRight: '0.3rem' }} ></i>Sync Host Status</button>,
            <select value={this.state.selectedExport} onChange={this.onExport} style={{ width: "20%", background: '#f2f2f2', border: 'none' }}>
                <option value='' className='export-icon-option' /* data-img_src={require('../assets/resources/export-icon.png')} */>Export</option>
                {[{ value: 1, label: 'Export to ServiceNow' }, { value: 2, label: 'Export to Excel' }].map(item =>
                    <option key={item.label} value={item.value}>{item.label}</option>
                )}
            </select>,
            // <button onClick={this.exportAwsExcel} style={{ padding: '4px 20px' }}> <i className="fa fa-file-excel-o" style={{ color: "#6767bd", marginRight: '0.3rem' }}  ></i>Export to Excel</button>,
            <div className="search-sec search-wrapper" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '13.75rem' }}>
                <input
                    id='awsSearch'
                    className="search-input"
                    type="text"
                    name="searchText"
                    onChange={this.onTextChange}
                    value={this.state.searchText}
                >
                </input>

                <div className="search-icon" onClick={(e) => this.onSubmitSearch(1, e)} style={{ cursor: 'pointer' }} id='searchIcon'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-search"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                        />
                    </svg>
                    <button style={{ display: this.state.searchText ? 'contents' : 'none' }} class="close-icon" type="reset" onClick={this.onResetSearch}></button>
                </div>
            </div>,
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

    onSyncHostStatus = async () => {
        const { userId, featureId, clientId, generateToken, failureToast, successToast, awsCurrentState } = this.props;
        if (!Array.isArray(this.values) || !this.values.length) {
            return failureToast('Please select atleast one host!');
        }
        const { generateToken: apiToken } = await generateToken();
        const payload = { userId, featureId, clientId, apiToken, hostInventoryIds: this.values };
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
                        self.getApprovedHosts(self.props.activePage);
                        self.values.map(hostId => $(`#${hostId}`).prop('checked', false));
                        $('#selectAll').prop('checked', false);
                        successToast('Successfully updated!');
                        self.values = [];
                    }
                })
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong!";
            self.showLoaderIcon(false);
            failureToast(text);
        }
    }

    getTableColumns = () => {
        return [
            {
                tag: <span className="checkbox-all">
                    <div className="form-group group-lable m-0">
                        <input type="checkbox" id="checkAll" onClick={this.onSelectAll} />
                        <label htmlFor="checkAll" className="th-text table-th-label"></label>
                    </div>
                </span>,
                className: 'aws-col-sn'
            },
            { tag: <div className="th-text table-th-label">Name</div>, className: 'aws-col-name' },
            { tag: <div className="th-text table-th-label">Server</div>, className: 'aws-col-Instance' },
            { tag: <div className="th-text table-th-label">Status</div> },
            { tag: <div className="th-text table-th-label">Last Sync</div> },
            { tag: <div className="th-text table-th-label">Public Ip</div> },
            { tag: <div className="th-text table-th-label">Private Ip</div> },
            { tag: <div className="th-text table-th-label">Description</div> },
            { tag: <div className="th-text table-th-label">Env</div> },
            { tag: <div className="th-text">Account</div>, className: 'aws-col-account' }
        ];
    }

    getTableBody = (availableApprovedHosts) => {
        const { activePage } = this.props;
        return availableApprovedHosts.map((host, index) =>
            <tr key={host.hostInventoryId} onClick={(e) => this.onRowClick(host.hostInventoryId, e)}>

                <td>
                    <div className="form-group group-lable m-0">
                        <input /* className="form-check-input" */ type="checkbox" id={`${host.hostInventoryId}`} value={host.hostInventoryId} onClick={this.onCheckChange} />
                        <label htmlFor={`${host.hostInventoryId}`}>
                            {/*  {
                                activePage === 1 ? index + 1 : (activePage - 1) * 30 + index + 1
                            } */}
                        </label>
                    </div>
                </td>

                <td title={host.hostname}>
                    <span className='table-data-elipse'>{host.hostname} </span>
                </td>
                <td>
                    <span>{host.typeName} </span>
                </td>
                <td>
                    <span>{host.status} </span>
                </td>
                <td>
                    <span>{window.DateTimeParser(host.lastSyncStatus)} </span>
                </td>
                <td>
                    <span>{host.publicIp} </span>
                </td>
                <td>
                    <span>{host.privateIp} </span>
                </td>
                <td title={host.description}>
                    <span className='table-data-elipse'>{host.description} </span>
                </td>
                <td>
                    <span>{host.serverType} </span>
                </td>
                <td>
                    <span>{host.sandboxName} </span>
                </td>
            </tr>
        )
    }

    onRowClick = async (hostInventoryId, event) => {
        const { tagName } = event ? event.target : {};
        if (tagName && tagName.toLowerCase() === "input") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "label") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "img") {
            return;
        }
        const { featureId, clientId, userId, generateToken, fetchHostDetails, failureToast } = this.props;
        const self = this;
        const { generateToken: apiToken } = await generateToken();
        const reqPayload = { featureId, clientId, userId, apiToken, hostInventoryId };
        this.setState({ loading: true });
        fetchHostDetails(reqPayload)
            .then(res => {
                const { status, message } = res;
                if (status !== 200) {
                    const text = message && typeof message === "string" ? message : "Something went wrong!";
                    self.setState({ loading: false });
                    return failureToast(text);
                }
                self.setState({ hasShowHostDetails: true, loading: false });
            }).catch(this.catchBlock);
        $('#viewHostDetails').modal('show');
    }

    catchBlock = (err) => {
        const text = err.message && typeof err.message === "string" ? err.message : "Something went wrong!";
        this.props.failureToast(text);
        this.setState({ loading: false });
    }

    componentDidMount() {
        this.getApprovedHosts();
        $("#awsSearch").keyup(function (event) {
            if (event.keyCode === 13) {
                $("#searchIcon").click();
            }
        });
    }


    hasShowLoader = (loading) => this.setState({ loading });

    getApprovedHosts = async (pageNum) => {
        const { featureId, clientId, userId, generateToken, getAwsList: getAllApprovedHosts = () => { },
            failureToast, infoToast, setTotalCount } = this.props;
        if (this.state.projectIdFilter) {
            reqPayload["projectId"] = this.state.projectIdFilter;
        }
        if (this.state.isProjectLinkedFilter) {
            reqPayload["isProjectLinked"] = this.state.isProjectLinkedFilter === "TRUE" ? true : false;
        }
        if (this.state.accountIdFilter) {
            reqPayload["sandboxAccountId"] = this.state.accountIdFilter;
        }
        const { generateToken: apiToken } = await generateToken();
        const reqPayload = { approvalStatus: "APPROVED", featureId, clientId, actionBy: userId, userId, apiToken };
        const self = this;
        self.hasShowLoader(true);
        if (pageNum && pageNum > 1) {
            reqPayload["pageNum"] = pageNum;
        }
        try {
            getAllApprovedHosts(reqPayload)
                .then(async (res) => {
                    self.hasShowLoader(false);
                    const { data, status, message } = res.data;
                    if (Array.isArray(data) && status === 200) {
                        self.setState({
                            availableApprovedHosts: [],
                        });
                        return infoToast("No AWS Hosts Available!!!");
                    }
                    if (status === 200) {
                        self.setState({
                            availableApprovedHosts: data.hostList,
                        });
                        if (data?.totalHostCount) {
                            setTotalCount(data.totalHostCount)
                        }
                        let query = queryString.parse(window.location.search);
                        if (query && query.from === 'pm' && !pageNum && Array.isArray(data.hostList) && data.hostList.length) {
                            window.history.replaceState({}, window.location.pathname, window.location.pathname);
                            await self.onRowClick(query.hostId);
                        }
                        return !data?.totalHostCount && infoToast("No AWS Hosts present!!!");
                    }
                    return failureToast(message);
                });
        } catch (err) {
            this.catchBlock(err);
        };
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.activePage !== this.props.activePage) && !this.props.hasShowingSearchData) {
            this.getApprovedHosts(this.props.activePage);
        }
        if (prevProps.clientId !== this.props.clientId) {
            this.setState(this.getInitialState());
            this.getApprovedHosts();
        }
        if ((prevProps.activePage !== this.props.activePage) && this.props.hasShowingSearchData) {
            this.onSubmitSearch(this.props.activePage);
        }
    }

    onCancel = () => {
        $('#viewHostDetails').modal('hide');
    }
    onUpdateReset = () => {
        $('#viewHostDetails').modal('hide');
        this.setState({ hasShowHostDetails: false });
        this.getApprovedHosts();
    }

    onTextChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitSearch = (activePage = 1, e) => {
        if (e && e.target.tagName === "BUTTON") {
            return;
        }
        const { searchText } = this.state;
        if (!searchText) {
            return this.props.infoToast('Please enter sarch text');
        }
        // when hit the search api by search icon, page number must be set to 1
        this.props.getAwsSearchHostData(activePage, searchText, 1);
    }
    onResetSearch = () => {
        this.setState({ searchText: '' }, () => this.props.onResetSearch(this.getApprovedHosts));
    }

    onSidePanelClick = () => this.setState(prevState => ({ isShowSidePanel: !prevState.isShowSidePanel }))

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

    Resetfilter = () => {
        const { sandboxAccountsByProject } = this.props;
        sandboxAccountsByProject("");
        this.setState({
            projectIdFilter: "",
            accountIdFilter: "",
            isProjectLinkedFilter: "",
            isShowSidePanel: false,
            hostStatus: ''
        }, () => this.getApprovedHosts());
    }

    applyFilter = (e) => {
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
            approvalStatus: "APPROVED"
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
        this.hasShowLoader(true);
        const { generateToken } = await generateTokenFunc();
        param["apiToken"] = generateToken;
        const self = this;
        getAwsList && getAwsList(param)
            .then(res => {
                self.hasShowLoader(false);
                this.setState({ isShowSidePanel: false });
                const { data, status, message } = res.data;
                if (Array.isArray(data) && status === 200) {
                    self.setState({
                        availableApprovedHosts: [],
                    });
                    return infoToast("No AWS Hosts Available!!!");
                }
                if (status === 200) {
                    self.setState({
                        availableApprovedHosts: data.hostList,
                    });
                    if (data?.totalHostCount) {
                        setTotalCount(data.totalHostCount)
                    }
                    return !data?.totalHostCount && infoToast("No AWS Hosts present!!!");
                }
                return failureToast(message);
            });
    }

    onExport = (event) => {
        const { value } = event.target;
        if (Number(value) === 2) {
            this.setState({ selectedExport: '' });
            this.exportAwsExcel();
        }
        if (Number(value) === 1) {
            this.onExportToServiceNow();
        }
    }

    onExportToServiceNow = async () => {
        const { clientId, userId, generateToken, failureToast, successToast } = this.props;
        const { generateToken: apiToken } = await generateToken();
        if (!Array.isArray(this.values) || !this.values.length) {
            return failureToast('Please select atleast one host!');
        }
        this.setState({ loading: true });
        axios.post(hostInventoryApiUrls.syncAWSHostServiceNow, { clientId, userId, apiToken, hostIds: this.values })
            .then(res => {
                const { status, message, data } = res.data;
                this.setState({ loading: false, selectedExport: '' });
                if (status === 200) {
                    this.setState({ exportResults: data }, () => $('#servicenowresults').modal('show'));
                    this.updateAllCheckboxes(false, this.values);
                    return successToast(message);
                }
                return failureToast(message);
            });
    }

    onServicenowWindowClose = () => {
        this.setState({ exportResults: {} });
    }

    render() {
        const { loading, hasShowHostDetails, isShowSidePanel, projectIdFilter, accountIdFilter, isProjectLinkedFilter, hostStatus } = this.state;
        const awsListHostData = this.props.isSearchTxtBtnClicked === "yes" ? this.props.awsSearchHostData : this.state.availableApprovedHosts;
        const { projectListData, sandboxAccountData } = this.props;
        return (
            <>
                <Loader loading={loading} />
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
                <HostActions
                    buttonsList={this.getApprovedHostButtonsLIst()}
                />
                <table className="table table-hover aws-table my-table">
                    <thead>
                        <tr>
                            {
                                this.getTableColumns().map((column, index) => <th className={column.className} key={index}>{column.tag}</th>)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.getTableBody(awsListHostData)
                        }
                    </tbody>
                </table>
                {
                    Array.isArray(awsListHostData) && !awsListHostData.length && <div style={{ textAlign: "center" }}><p>No Host  listed for this User </p></div>
                }
                {/* host details */}
                <div className="modal" data-backdrop="static" data-keyboard="false" id="viewHostDetails">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Host Details</h3>
                                <button type="button" className="close" data-dismiss="modal" onClick={() => this.setState({ hasShowHostDetails: false })}>&times;</button>
                            </div>
                            <Loader loading={loading} />
                            {
                                hasShowHostDetails &&
                                <HostDetails
                                    hostDetails={this.props.awsHostDetails}
                                    showLoaderIcon={this.showLoaderIcon}
                                    loading={this.state.loading}
                                    onCancel={this.onCancel}
                                    getList={this.getApprovedHosts.bind(this, this.props.activePage)}
                                    onUpdateReset={this.onUpdateReset}
                                />
                            }
                        </div>
                    </div>
                </div>
                {/* servicenow export results */}
                <ServicenowExportMessage results={this.state.exportResults} onClose={this.onServicenowWindowClose} />
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        awsHostDetails: state.awsHostDetails,
        userId: state.current_user.payload.userId,
        hostClients: state.hostClients,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        userClients: Array.isArray(state.userClients) ? state.userClients : [],
        featureId: state.clientUserFeatures.featureIds ? state.clientUserFeatures.featureIds.HostInventoryvault : "",
        awsMapping: state.roleInfo,
        userName: state.current_user.payload.userName,
        awsSsoUrl: (state.ssoUrl && state.ssoUrl.awsSsoUrl) ? state.ssoUrl.awsSsoUrl : null,
        projectListData: state.getProjectList && Array.isArray(state.getProjectList.data) ? state.getProjectList.data : [],
        onDemandToken: state.setAWSAutoDiscoveryToken && state.setAWSAutoDiscoveryToken.onDemandToken,
        loaderAutoDiscovery: state.setAWSAutoDiscoveryToken && state.setAWSAutoDiscoveryToken.loaderAutoDiscovery,
        getOnDemandSetIntervalId: state.getOnDemandSetIntervalId,
        sandboxAccountData: state.sandboxAccountsByProject && Array.isArray(state.sandboxAccountsByProject.data) ? state.sandboxAccountsByProject.data : []
    }
}

function mapdispatchToProps(dispatch) {
    return bindActionCreators({
        failureToast,
        successToast,
        getAwsList,
        generateToken,
        infoToast,
        fetchHostDetails,
        manualStartAwsHost,
        manualStopAwsHost,
        awsCurrentState,
        sandboxAccountsByProject
    }, dispatch);
}

ApprovedHosts.defaultProps = {

}

export default connect(mapStateToProps, mapdispatchToProps)(ApprovedHosts);