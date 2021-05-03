import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Pagination from '@material-ui/lab/Pagination';
import $ from "jquery";
import moment from 'moment';
import ComponentHeader from "../resources/DashboardHeader";
/* tabs */
import ApprovedHosts from './ApprovedHosts';
import AWSTBAHOST from './AWSTBAHosts';
import AutoDiscovery from '../InventoryPages/AutoDiscovery';
import UnVerifiedHost from '../InventoryPages/UnVerifiedHost';
import RejectedHost from '../InventoryPages/RejectedHost';
import HostAddWizard from './AddNewHost';
import { Inventory_TABS } from '../../constants/index';
import './resources/page.css';
/* actions */
import { failureToast, successToast, infoToast } from '../../actions/commons/toaster';
import { generateToken, getClientUsers } from '../../actions/commons/commonActions';
import { getProjectList } from "../../actions/projects";
import {
    fetchRegionAWS,
    fetchType, fetchEnv, fetchOs,
    fetchSsoLoginUrl, saveHost, onDemandAutoDiscoveryAws, getAutoDiscoveryStatus, setAWSAutoDiscoveryToken,
    setOnDemandSetIntervalId, switchRole, awsSearchHost
} from '../../actions/hostInventory/awsHostInventoryMain'
import Loader from '../resources/Loader';

class AWSInventory extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.awsSSOClick = this.awsSSOClick.bind(this);
        this.switchRoleClick = this.switchRoleClick.bind(this);
        this.itemsPerPage = 30
    }

    getInitialState = () => ({
        isShowSidePanel: false,
        hasShowTab0: true,
        hasShowTab1: false,
        hasShowTab2: false,
        hasShowTab3: false,
        hasShowTab4: false,
        activePage: 1,
        totalItemsCount: null,
        onAddSubmit: '',
        hasShowingSearchData: false,
        loading: false,
        hasAutoDiscoryNeedUpdate: false
    });


    onTabClick = (index) => {
        this.setState({ ...this.getInitialState(), hasShowTab0: false, [`hasShowTab${index}`]: true });
    }

    onSidePanelClick = (e) => {
        e.preventDefault();
        this.setState(PrevState => ({ isShowSidePanel: !PrevState.isShowSidePanel }));
    }

    onFilterChanged = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    async awsSSOClick() {
        let { awsSsoUrl, userName, failureToast } = this.props;
        let { fetchSsoLoginUrl, generateToken, userId } = this.props;
        const { generateToken: token } = await generateToken();
        fetchSsoLoginUrl(userId, token).then(res => {
            if (res.data.status !== 200) {
                return failureToast('SSO URL not found');
            }
            awsSsoUrl = res.data.data.awsSsoUrl;
            if (awsSsoUrl) {
                const url = typeof awsSsoUrl === "string" ? awsSsoUrl : awsSsoUrl.url;
                window.open(url + userName, "_blank");
            } else {
                return failureToast('AWS SSO URL not found');
            }
        }).catch(ex => {
            let msg = ex.message ? ex.message : 'Something went wrong. Please try again';
            return failureToast(msg);
        })
    }

    async onDemandAutoDiscovery() {
        const { userId, generateToken, clientId, featureId, failureToast, infoToast, onDemandAutoDiscoveryAws, setAWSAutoDiscoveryToken, setOnDemandSetIntervalId } = this.props;
        const { generateToken: apiToken } = await generateToken();
        var param = { userId, clientId, featureId, apiToken };
        var self = this;
        await onDemandAutoDiscoveryAws(param)
            .then((res) => {
                const { message, status, data } = res.data;
                if (status !== 200) {
                    const text = typeof message === "string" ? message : "Something went wrong while retrieving data!";
                    self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                    return failureToast(text);
                }
                infoToast(message);
                setAWSAutoDiscoveryToken({ onDemandToken: data.tokenId, loaderAutoDiscovery: true, expTime: moment().add(240, 'seconds').format() });
                return setOnDemandSetIntervalId(self.setIntervalFunc(data.tokenId));
            }).catch((err) => {
                console.log(err);
                self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                failureToast("Something went wrong while retrieving data!");
            });
    }

    manualAutoDiscoveryonClick = async () => {
        try {
            this.refs && this.refs.manualAutoDiscoveryBt && this.refs.manualAutoDiscoveryBt.setAttribute('disabled', 'disabled');
            await this.onDemandAutoDiscovery();
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while initiating autoDiscovery";
            this.props.failureToast(text);
            this.refs && this.refs.manualAutoDiscoveryBt && this.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
        }
    }

    checkingExpTime = () => {
        const { expTime, setAWSAutoDiscoveryToken, setOnDemandSetIntervalId, getOnDemandSetIntervalId, infoToast } = this.props;;
        if (new Date() > new Date(expTime)) {
            clearInterval(getOnDemandSetIntervalId);
            setAWSAutoDiscoveryToken({});
            this.refs && this.refs.manualAutoDiscoveryBt && this.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
            setOnDemandSetIntervalId("");
            infoToast("On Demand Auto Discovery Has Stopped!");
            if (this.state.hasShowTab2) {
                this.setState({ hasAutoDiscoryNeedUpdate: true });
            }
            return true;
        }
        return false;
    }

    setIntervalFunc = (onDemandTokenId = "") => {
        const self = this;
        return setInterval(async () => {
            const { getAutoDiscoveryStatus, failureToast, infoToast, onDemandToken: stateOnDemandToken, setAWSAutoDiscoveryToken, setOnDemandSetIntervalId, userId, generateToken } = self.props;
            let tokenId = onDemandTokenId ? onDemandTokenId : stateOnDemandToken;
            const { generateToken: apiToken } = await generateToken();
            getAutoDiscoveryStatus({ tokenId, apiToken, userId })
                .then(async (res) => {
                    const { status, data } = res.data;
                    if (self.checkingExpTime()) {
                        return;
                    }
                    if (status === 200 && data[0] && data[0].status === "completed") {
                        // when executing setInterval or setTimeout functions, if we define variables as parent closure props, then interval functions always taking initial values for the closures even if we modify the existing values. 
                        // So that need to be self.props.getOnDemandSetIntervalId
                        infoToast("Auto Discovery Completed Successfully.");
                        if (this.state.hasShowTab2) {
                            this.setState({ hasAutoDiscoryNeedUpdate: true });
                        }
                        self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                        clearInterval(self.props.getOnDemandSetIntervalId);
                        await setOnDemandSetIntervalId("");
                        await setAWSAutoDiscoveryToken({});
                    }
                    if (data[0] && data[0].status === "failed" || status !== 200) {
                        clearInterval(self.props.getOnDemandSetIntervalId);
                        await setAWSAutoDiscoveryToken({});
                        self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                        await setOnDemandSetIntervalId("");
                        typeof data[0].status === "string" ? failureToast(data[0].status) : failureToast("Something went wrong while retrieving status of auto discovery!");
                        return;
                    }
                }).catch((err) => {
                    failureToast("Something went wrong while retrieving data!");
                    self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                    clearInterval(self.props.getOnDemandSetIntervalId);
                    setOnDemandSetIntervalId("");
                    setAWSAutoDiscoveryToken({});
                });
        }, 5000)
    }

    addAwsHost = async (values) => {
        const self = this;
        const { failureToast, successToast, featureId, userId, clientId, saveHost } = this.props;
        const { isProjectLinked, startHour, stopHour, startDate, stopDate, isHostAutoSchedule } = values;
        if (isProjectLinked && isHostAutoSchedule && startDate) {
            values['startDate'] = `${startDate}T00:00:00.000Z`;
        }
        if (isProjectLinked && isHostAutoSchedule && stopDate) {
            values['stopDate'] = `${stopDate}T23:59:59.000Z`;
        }
        if (isProjectLinked && isHostAutoSchedule && startHour && startHour.trim()) {
            const [hour, minute] = startHour.split(':');
            values['startHours'] = hour;
            values['startMins'] = minute;
            delete values['startHour'];
        }
        if (isProjectLinked && isHostAutoSchedule && stopHour && stopHour.trim()) {
            const [endHours, endMinutes] = stopHour.split(':');
            values['stopHours'] = endHours;
            values['stopMins'] = endMinutes;
            delete values['stopHour'];
        }
        const { generateToken: apiToken } = await this.props.generateToken();
        let request = { ...values, env: '1', featureId, userId, clientId, apiToken };
        self.showLoaderIcon(true);
        return saveHost(request)
            .then((res) => {
                const { status, message } = res.addHost;
                if (status === 200) {
                    successToast("Success");
                    $('#addHostModal').modal('hide');
                    this.setState({ addHost: false });
                    return { status };
                }
                failureToast(message);
                self.showLoaderIcon(false);
            }).catch(self.catchBlock);
    }

    //functions for search texts
    getApprovalStatus(tabIndex) {
        if (tabIndex === 1) {
            return "APPROVED";
        }
        if (tabIndex === 2) {
            return "PENDING APPROVAL";
        }
        if (tabIndex === 3) {
            return "AUTODISCOVERED";
        }
        if (tabIndex === 4) {
            return "UNVERIFIED";
        }
        if (tabIndex === 5) {
            return "CANCELLED";
        }
    }

    getAwsSearchHostData = async (pageno, searchText, index) => {
        const { generateToken, failureToast, awsSearchHost } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const pageNum = pageno ? pageno : this.state.activePage;
        let body = {
            "searchText": searchText,
            "pageNum": pageNum,
            "limit": this.itemsPerPage,
            "approvalStatus": this.getApprovalStatus(index),
            "clientId": this.props.clientId,
            "featureId": this.props.featureId,
            "apiToken": apiToken,
            "userId": this.props.userId,
        };
        const self = this;
        self.showLoaderIcon(true);
        awsSearchHost && awsSearchHost(body)
            .then(res => {
                self.showLoaderIcon(false);
                const { message, status, data } = res.data || {};
                if (status !== 200) {
                    return failureToast(message);
                }
                self.setState({
                    awsSearchHostData: data.hostList ? data.hostList : [],
                    activePage: pageNum,
                    hasShowingSearchData: true
                }, () => self.setTotalCount(data.totalHostCount));
            });
    }

    async handleChangeAwsSearchTxt(event) {
        let value = event.target.value;
        if (value) {
            await this.setState({ awsSearchTxt: value });
        } else {
            this.clearAwsSearchTxt();
        }
    }

    async getUsers() {
        const { userId, clientId, featureId } = this.props;
        const { generateToken: apiToken } = await this.props.generateToken();
        await this.props.getClientUsers({ userId, clientId, featureId, apiToken });
    }

    componentDidMount() {
        this.getInitalData();
        this.getEssentialData();
    }

    getEssentialData = async () => {
        const { userId } = this.props;
        const { generateToken: token } = await this.props.generateToken();
        this.props.fetchType(userId, token);
        this.props.fetchEnv(userId, token);
        const { generateToken: tokens } = await this.props.generateToken();
        this.props.fetchOs(userId, tokens);
        this.props.fetchRegionAWS(userId, tokens);
    }

    getInitalData = async () => {
        const { getProjectList, clientId, failureToast, userId, setOnDemandSetIntervalId, getOnDemandSetIntervalId } = this.props;
        this.getSwitchRole();

        await this.getUsers();
        if (getOnDemandSetIntervalId && typeof getOnDemandSetIntervalId === "number") {
            if (this.checkingExpTime()) {
                return;
            }
            setOnDemandSetIntervalId(this.setIntervalFunc());
        }
        const { generateToken: apiToken } = await this.props.generateToken();
        getProjectList(clientId, userId, apiToken)
            .then(res => {
                if (res.data) {
                    const { message, status } = res.data;
                    if (status !== 200) {
                        const text = typeof message === "string" ? message : "Something went wrong while getting projects";
                        failureToast(text);
                    }
                }
            });
    }

    getSwitchRole = async () => {
        const { generateToken, clientId, userId, switchRole } = this.props;
        const { generateToken: token } = await generateToken();
        switchRole(token, clientId, userId);
    }


    setTotalCount = (totalItemsCount) => this.setState({ totalItemsCount });

    switchRoleClick() {
        const { userClients, clientId, awsMapping } = this.props;
        const { targetAccountRole, accountId, userName } = awsMapping || {};
        const clientArray = Array.isArray(userClients) ? userClients.map(client => client.clientId) : [];
        const currentClientIndex = clientArray.indexOf(clientId);
        let displayName = userName;
        if (currentClientIndex > -1) {
            const currentClientObj = userClients[currentClientIndex];
            displayName = currentClientObj['name'];
        }
        window.open("https://signin.aws.amazon.com/switchrole?roleName=" + targetAccountRole + "&account=" + accountId + "&displayName=" + displayName, "_blank")
    }

    getHeaderButtons = () => {
        const buttons = [
            { name: 'AWS SSO', className: 'aws-header-buttons', onClick: this.awsSSOClick },
            { name: 'Switch Role', className: 'aws-header-buttons', onClick: this.switchRoleClick },
            { name: this.props.loaderAutoDiscovery ? <img className="imgCursorPoint" src={require('../../assets/concierto/images/loader5.gif')} /> : 'On-Demand Discovery', className: 'aws-header-buttons', disabled: this.props.loaderAutoDiscovery ? true : false, onClick: this.manualAutoDiscoveryonClick, ref: "manualAutoDiscoveryBt" },
            { name: 'Add New Host', className: 'aws-header-buttons aws-add-new', onClick: this.addHostClicked }];

        return [{ name: 'AWS Inventory', className: "component-head-text align-self-end" },
        {
            name:
                <>
                    {
                        buttons.map((button, index) => <button key={index} onClick={button.onClick || null} {...button}>{button.name}</button>)
                    }
                </>
        }];
    }

    async awsSSOClick() {
        let { awsSsoUrl, userName, failureToast } = this.props;
        let { fetchSsoLoginUrl, generateToken, userId } = this.props;
        const { generateToken: token } = await generateToken();
        fetchSsoLoginUrl(userId, token).then(res => {
            if (res.data.status !== 200) {
                return failureToast('SSO URL not found');
            }
            awsSsoUrl = res.data.data.awsSsoUrl;
            if (awsSsoUrl) {
                const url = typeof awsSsoUrl === "string" ? awsSsoUrl : awsSsoUrl.url;
                window.open(url + userName, "_blank");
            } else {
                return failureToast('AWS SSO URL not found');
            }
        }).catch(ex => {
            let msg = ex.message ? ex.message : 'Something went wrong. Please try again';
            return failureToast(msg);
        })
    }

    async onDemandAutoDiscovery() {
        const { userId, generateToken, clientId, featureId, failureToast, infoToast, onDemandAutoDiscoveryAws, setAWSAutoDiscoveryToken, setOnDemandSetIntervalId } = this.props;
        const { generateToken: apiToken } = await generateToken();
        var param = { userId, clientId, featureId, apiToken };
        var self = this;
        await onDemandAutoDiscoveryAws(param)
            .then((res) => {
                const { message, status, data } = res.data;
                if (status !== 200) {
                    const text = typeof message === "string" ? message : "Something went wrong while retrieving data!";
                    self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                    return failureToast(text);
                }
                infoToast(message);
                setAWSAutoDiscoveryToken({ onDemandToken: data.tokenId, loaderAutoDiscovery: true, expTime: moment().add(240, 'seconds').format() });
                return setOnDemandSetIntervalId(self.setIntervalFunc(data.tokenId));
            }).catch((err) => {
                console.log(err);
                self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                failureToast("Something went wrong while retrieving data!");
            });
    }

    manualAutoDiscoveryonClick = async () => {
        try {
            this.refs && this.refs.manualAutoDiscoveryBt && this.refs.manualAutoDiscoveryBt.setAttribute('disabled', 'disabled');
            await this.onDemandAutoDiscovery();
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while initiating autoDiscovery";
            this.props.failureToast(text);
            this.refs && this.refs.manualAutoDiscoveryBt && this.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
        }
    }

    checkingExpTime = () => {
        const { expTime, setAWSAutoDiscoveryToken, setOnDemandSetIntervalId, getOnDemandSetIntervalId, infoToast } = this.props;;
        if (new Date() > new Date(expTime)) {
            clearInterval(getOnDemandSetIntervalId);
            setAWSAutoDiscoveryToken({});
            this.refs && this.refs.manualAutoDiscoveryBt && this.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
            setOnDemandSetIntervalId("");
            infoToast("On Demand Auto Discovery Has Stopped!");
            return true;
        }
        return false;
    }

    addAwsHost = async (values) => {
        const self = this;
        const { failureToast, successToast, featureId, userId, clientId, saveHost } = this.props;
        const { isProjectLinked, startHour, stopHour, startDate, stopDate, isHostAutoSchedule } = values;
        if (isProjectLinked && isHostAutoSchedule && startDate) {
            values['startDate'] = `${startDate}T00:00:00.000Z`;
        }
        if (isProjectLinked && isHostAutoSchedule && stopDate) {
            values['stopDate'] = `${stopDate}T23:59:59.000Z`;
        }
        if (isProjectLinked && isHostAutoSchedule && startHour && startHour.trim()) {
            const [hour, minute] = startHour.split(':');
            values['startHours'] = hour;
            values['startMins'] = minute;
            delete values['startHour'];
        }
        if (isProjectLinked && isHostAutoSchedule && stopHour && stopHour.trim()) {
            const [endHours, endMinutes] = stopHour.split(':');
            values['stopHours'] = endHours;
            values['stopMins'] = endMinutes;
            delete values['stopHour'];
        }
        const { generateToken: apiToken } = await this.props.generateToken();
        let request = { ...values, env: '1', featureId, userId, clientId, apiToken };
        // self.showLoaderIcon(true);
        return saveHost(request)
            .then((res) => {
                const { status, message } = res.addHost;
                if (status === 200) {
                    successToast("Success");
                    $('#addHostModal').modal('hide');
                    this.setState({ addHost: false });
                    return { status };
                }
                failureToast(message);
                // self.showLoaderIcon(false);
            }).catch(self.catchBlock);
    }

    async getUsers() {
        const { userId, clientId, featureId } = this.props;
        const { generateToken: apiToken } = await this.props.generateToken();
        await this.props.getClientUsers({ userId, clientId, featureId, apiToken });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clientId !== this.props.clientId) {
            this.setState(preState => ({
                ...this.getInitialState(),
                hasShowTab0: preState.hasShowTab0,
                hasShowTab1: preState.hasShowTab1,
                hasShowTab2: preState.hasShowTab2,
                hasShowTab3: preState.hasShowTab3,
                hasShowTab4: preState.hasShowTab4
            }));
            this.getInitalData();
        }
    }

    handlePageChange = async (e, activePage) => this.setState({ activePage });

    switchRoleClick() {
        const { userClients, clientId, awsMapping } = this.props;
        const { targetAccountRole, accountId, userName } = awsMapping || {};
        const clientArray = Array.isArray(userClients) ? userClients.map(client => client.clientId) : [];
        const currentClientIndex = clientArray.indexOf(clientId);
        let displayName = userName;
        if (currentClientIndex > -1) {
            const currentClientObj = userClients[currentClientIndex];
            displayName = currentClientObj['name'];
        }
        window.open("https://signin.aws.amazon.com/switchrole?roleName=" + targetAccountRole + "&account=" + accountId + "&displayName=" + displayName, "_blank")
    }

    addHostClicked = () => {
        this.setState({ addHost: true }, () => $('#addHostModal').modal('show'));
    }

    onCancelAddHost = () => {
        this.setState({ addHost: false }, () => $('#addHostModal').modal('hide'));
    }

    onResetSearch = (callback = () => { }) => {
        if (this.state.hasShowingSearchData)
            this.setState({ hasShowingSearchData: false, activePage: 1 }, () => callback());
    }

    showLoaderIcon = (loading) => this.setState({ loading });

    onUpdateAutoDiscoryNeedUpdate = () => ({ hasAutoDiscoryNeedUpdate: false });

    render() {
        // const { stateList, priorityList, ticketType } = this.props.getAllMasterData;
        const { hasShowTab0, hasShowTab1, hasShowTab2, hasShowTab3, hasShowTab4, activePage, totalItemsCount, loading } = this.state;
        let noOfPages = Math.ceil(Number(totalItemsCount) / this.itemsPerPage);
        return (
            <>
                <Loader loading={loading} />
                <ComponentHeader
                    dashboardText={this.getHeaderButtons()}
                    headerClass=""
                    tabsText={Inventory_TABS}
                    onTabClick={this.onTabClick}
                />

                <div id='aws-page' className="page">
                    <div className="bg-wh" >
                        {
                            hasShowTab0 &&
                            <ApprovedHosts
                                activePage={activePage}
                                setTotalCount={this.setTotalCount}
                                isSearchTxtBtnClicked={this.state.hasShowingSearchData ? 'yes' : 'no'}
                                hasShowingSearchData={this.state.hasShowingSearchData}
                                awsSearchHostData={this.state.awsSearchHostData}
                                isClearTxtBtnClicked={this.state.isClearTxtBtnClicked}
                                totalCountForSearchTxt={this.state.totalCountForSearchTxt}
                                getAwsSearchHostData={this.getAwsSearchHostData}
                                onResetSearch={this.onResetSearch}
                            />
                        }
                        {
                            hasShowTab1 &&
                            <AWSTBAHOST
                                activePage={activePage}
                                setTotalCount={this.setTotalCount}
                            />
                        }
                        {
                            hasShowTab2 &&
                            <AutoDiscovery
                                activePage={activePage}
                                setTotalCount={this.setTotalCount}
                                onUpdateAutoDiscoryNeedUpdate={this.onUpdateAutoDiscoryNeedUpdate}
                                hasAutoDiscoryNeedUpdate={this.state.hasAutoDiscoryNeedUpdate}
                            />
                        }
                        {
                            hasShowTab3 &&
                            <UnVerifiedHost
                                activePage={activePage}
                                setTotalCount={this.setTotalCount}
                            />
                        }
                        {
                            hasShowTab4 &&
                            <RejectedHost
                                activePage={activePage}
                                setTotalCount={this.setTotalCount}
                            />
                        }
                    </div>
                </div>
                {/* pagination */}
                {
                    totalItemsCount > this.itemsPerPage && <>
                        <div className="text-center" style={{ marginTop: '1rem' }}>
                            <p>
                                Showing {1 + (this.itemsPerPage * (activePage - 1))}-{activePage !== noOfPages ? (activePage * this.itemsPerPage) : totalItemsCount}/{totalItemsCount}
                            </p>
                        </div>
                        <div className="pagination-center">
                            <Pagination count={noOfPages} page={activePage} onChange={this.handlePageChange} />
                        </div>
                    </>
                }
                <div className="modal" id="addHostModal" aria-labelledby="myLargeModalLabel" data-backdrop="static"
                    data-keyboard="false" tabIndex="-1" role="dialog" aria-hidden="true" style={{ overflow: "auto" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header edit-header">
                                <h3 className="modal-title" id="exampleModalLabel">ADD HOST</h3>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.onCancelAddHost}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                {/* loader */}
                            </div>
                            {
                                this.state.addHost &&
                                <div className="modal-body">
                                    <HostAddWizard
                                        showLoaderIcon={this.showLoaderIcon}
                                        onSubmit={this.addAwsHost}
                                        failureToast={this.props.failureToast}
                                        clientId={this.props.clientId}
                                        userId={this.props.userId}
                                        generateToken={this.props.generateToken}
                                        onAddSubmit={(onAddSubmit) => {
                                            this.setState({ onAddSubmit });
                                        }}
                                        clientUsers={this.props.clientUsers}
                                    />
                                </div>
                            }
                            <div className="modal-footer" style={{ paddingTop: "30px", paddingBottom: "20px" }}>
                                <div className="">
                                    <button type="button" className="save-btnn " style={{ backgroundColor: '#593CAB', padding: '4px 20px', marginRight: '20px' }} onClick={this.state.onAddSubmit.handleSubmit}>Save</button>
                                    {
                                        this.state.onAddSubmit && typeof this.state.onAddSubmit.handleSubmit === "function" &&
                                        <button type="button" className="btn btn-aws btn-default float-right" style={{ border: '1px solid rgb(222, 225, 228)' }} onClick={this.onCancel} data-dismiss="modal">Cancel</button>
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
        userId: state.current_user.payload.userId,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures && state.clientUserFeatures.featureIds ? state.clientUserFeatures.featureIds.HostInventoryvault : "",
        userClients: Array.isArray(state.userClients) ? state.userClients : [],
        awsMapping: state.roleInfo,
        userName: state.current_user.payload.userName,
        awsSsoUrl: (state.ssoUrl && state.ssoUrl.awsSsoUrl) ? state.ssoUrl.awsSsoUrl : null,
        onDemandToken: state.setAWSAutoDiscoveryToken && state.setAWSAutoDiscoveryToken.onDemandToken,
        loaderAutoDiscovery: state.setAWSAutoDiscoveryToken && state.setAWSAutoDiscoveryToken.loaderAutoDiscovery,
        expTime: state.setAWSAutoDiscoveryToken && state.setAWSAutoDiscoveryToken.expTime,
        getOnDemandSetIntervalId: state.getOnDemandSetIntervalId,
        clientUsers: state.clientUsers,
    }
}

function mapdispatchToProps(dispatch) {
    return bindActionCreators({
        failureToast,
        successToast,
        getClientUsers,
        getProjectList,
        generateToken,
        fetchSsoLoginUrl,
        saveHost,
        onDemandAutoDiscoveryAws,
        getAutoDiscoveryStatus,
        setAWSAutoDiscoveryToken,
        setOnDemandSetIntervalId,
        switchRole,
        infoToast,
        fetchRegionAWS,
        fetchType,
        fetchEnv,
        fetchOs,
        awsSearchHost
    }, dispatch);
}

AWSInventory.defaultProps = {
    getAllMasterData: {}
}

export default connect(mapStateToProps, mapdispatchToProps)(AWSInventory);
