import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Pagination from '@material-ui/lab/Pagination';
import $ from "jquery";
import moment from 'moment';
import ComponentHeader from "../resources/DashboardHeader";
/* tabs */
import ApprovedHosts from './ApprovedHosts';
import AZURETBAHOST from './AZURETBAHOST';
import AutoDiscovery from '../InventoryPages/AutoDiscovery';
import UnVerifiedHost from '../InventoryPages/UnVerifiedHost';
import RejectedHost from '../InventoryPages/RejectedHost';
import AddHost from './AddHost';
import { Inventory_TABS } from '../../constants/index';
import './resources/page.css';
/* actions */
import { failureToast, successToast, infoToast } from '../../actions/commons/toaster';
import { generateToken, getClientUsers } from '../../actions/commons/commonActions';
import { getProjectList } from "../../actions/projects";
import {
    fetchType, fetchEnv, fetchOs, getAutoDiscoveryStatus
} from '../../actions/hostInventory/awsHostInventoryMain'
import {
    fetchRegionAzure, onDemandAutoDiscoveryAzure, setAzureAutoDiscoveryToken,
    setAzureOnDemandSetIntervalId, saveAzureHost, azureSearchHost
} from "../../actions/hostInventory/azureHostInventoryMain";

import Loader from '../resources/Loader';

class AWSInventory extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
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

    setInitialState = () => this.setState(this.getInitialState());

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
        const { expTime, setAzureAutoDiscoveryToken, setAzureOnDemandSetIntervalId, getOnDemandSetIntervalId } = this.props;;
        if (new Date() > new Date(expTime)) {
            clearInterval(getOnDemandSetIntervalId);
            setAzureAutoDiscoveryToken({});
            this.refs && this.refs.manualAutoDiscoveryBt && this.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
            setAzureOnDemandSetIntervalId("");
            failureToast("On Demand Auto Discovery Has Stopped!");
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
            const { getAutoDiscoveryStatus, infoToast, setAzureAutoDiscoveryToken, setAzureOnDemandSetIntervalId, userId, generateToken } = self.props;
            let tokenId = onDemandTokenId ? onDemandTokenId : self.props.onDemandToken;
            const { generateToken: apiToken } = await generateToken();
            getAutoDiscoveryStatus({ tokenId, userId, apiToken })
                .then((res) => {
                    const { message, status, data } = res.data;
                    if (self.checkingExpTime()) {
                        return;
                    }
                    if (status === 200 && data[0] && data[0].status === "completed") {
                        infoToast("Auto Discovery Completed Successfully");
                        if (this.state.hasShowTab2) {
                            this.setState({ hasAutoDiscoryNeedUpdate: true });
                        }
                        clearInterval(self.props.getOnDemandSetIntervalId);
                        setAzureAutoDiscoveryToken({});
                        self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                        setAzureOnDemandSetIntervalId("");
                    }
                    if (status !== 200 || data[0] && data[0].status === "failed") {
                        clearInterval(self.props.getOnDemandSetIntervalId);
                        setAzureAutoDiscoveryToken({});
                        setAzureOnDemandSetIntervalId("");
                        self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                        return typeof data[0].status === "string" ? failureToast(data[0].status) : failureToast("Something went wrong while retrieving status of auto discovery!");
                    }
                }).catch((err) => {
                    clearInterval(self.props.getOnDemandSetIntervalId);
                    setAzureAutoDiscoveryToken({});
                    setAzureOnDemandSetIntervalId("");
                    self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                    failureToast("Something went wrong while retrieving data!");
                });
        }, 8000)
    }

    async onDemandAutoDiscovery() {
        const { userId, generateToken, clientId, featureId, failureToast, infoToast, onDemandAutoDiscoveryAzure, setAzureAutoDiscoveryToken, setAzureOnDemandSetIntervalId } = this.props;
        const { generateToken: apiToken } = await generateToken();
        var param = { userId, clientId, featureId, apiToken };
        const self = this;
        self.showLoaderIcon(true);
        await onDemandAutoDiscoveryAzure(param)
            .then(async (res) => {
                if (res.data) {
                    const { message, status, data: { tokenId } } = res.data;
                    if (status !== 200) {
                        self.showLoaderIcon(false);
                        self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                        return typeof message === "string" ? failureToast(message) : failureToast("Something went wrong while retrieving data!");
                    }
                    await setAzureAutoDiscoveryToken({ onDemandToken: tokenId, loaderAutoDiscovery: true, expTime: moment().add(240, 'seconds').format() });
                    infoToast(message);
                    self.showLoaderIcon(false);
                    return await setAzureOnDemandSetIntervalId(this.setIntervalFunc(tokenId));
                }
            }).catch(() => {
                self.refs && self.refs.manualAutoDiscoveryBt && self.refs.manualAutoDiscoveryBt.removeAttribute("disabled");
                failureToast("Something went wrong while retrieving data!");
            });
    }

    getHeaderButtons = () => {
        const buttons = [
            { name: this.props.loaderAutoDiscovery ? <img className="imgCursorPoint" src={require('../../assets/concierto/images/loader5.gif')} /> : 'On-Demand Discovery', className: 'azure-header-buttons', disabled: this.props.loaderAutoDiscovery ? true : false, onClick: this.manualAutoDiscoveryonClick, ref: "manualAutoDiscoveryBt" },
            { name: 'Add New Host', className: 'azure-header-buttons azure-add-new', onClick: this.addHostClicked }];

        return [{ name: 'AZURE Inventory', className: "component-head-text align-self-end" },
        {
            name:
                <>
                    {
                        buttons.map((button, index) => <button key={index} onClick={button.onClick || null} {...button}>{button.name}</button>)
                    }
                </>
        }];
    }

    addAzureHostClicked = () => {
        this.setState({ addHost: true }, () => $('#addHostModal').modal('show'));
    }

    addAzureHost = async (values) => {
        const { featureId, userId, clientId, failureToast, successToast, saveAzureHost, registerField, change } = this.props;
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
        let request = { ...values, type: '2', featureId, userId, clientId };
        const { generateToken: apiToken } = await this.props.generateToken();
        request["apiToken"] = apiToken;
        this.showLoaderIcon(true);
        const self = this;
        return saveAzureHost && saveAzureHost(request)
            .then((res) => {
                const { message, status } = res.addAzureHost;
                self.showLoaderIcon(false);
                if (status === 200) {
                    $('#addHostModal').modal('hide');
                    const text = typeof message === "string" ? message : "Success!";
                    successToast(text);
                    return { status };
                }
                const text = typeof message === "string" ? message : "Something went wrong!";
                failureToast(text);
                return { status };
            }).catch(self.catchBlock);
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
        this.props.fetchRegionAzure(userId, tokens);
    }

    getInitalData = async () => {
        const { getProjectList, clientId, failureToast, getOnDemandSetIntervalId, setAzureOnDemandSetIntervalId, userId } = this.props;
        await this.getUsers();
        if (getOnDemandSetIntervalId && typeof getOnDemandSetIntervalId === "number") {
            if (this.checkingExpTime()) {
                return;
            }
            setAzureOnDemandSetIntervalId(this.setIntervalFunc());
        }
        const { generateToken: tokenAuth } = await this.props.generateToken();
        getProjectList(clientId, this.props.userId, tokenAuth)
            .then(res => {
                if (res.data) {
                    const { message, status } = res.data;
                    if (status !== 200) {
                        const text = typeof message === "string" ? message : "Something went wrong while getting projects";
                        failureToast(text);
                    }
                }
            })
    }

    async componentDidUpdate(prevProps) {
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



    setTotalCount = (totalItemsCount) => this.setState({ totalItemsCount });

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

    handlePageChange = async (e, activePage) => this.setState({ activePage });

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

    getazureSearchHostData = async (pageno, searchText, index) => {
        const { failureToast, azureSearchHost } = this.props;
        const { generateToken: apiToken } = await this.props.generateToken();
        const pageNum = pageno ? pageno : this.state.activePage;
        let body = {
            "searchText": searchText,
            "pageNum": pageNum,
            "limit": 30,
            "approvalStatus": this.getApprovalStatus(index),
            "clientId": this.props.clientId,
            "featureId": this.props.featureId,
            "apiToken": apiToken,
            "userId": this.props.userId,
        };
        const self = this;
        self.showLoaderIcon(true);
        azureSearchHost && azureSearchHost(body)
            .then(res => {
                const { message, status, data } = res.data;
                self.showLoaderIcon(false);
                self.setState({
                    azureSearchHostData: data.hostList ? data.hostList : [],
                    hasShowingSearchData: true,
                    activePageForSearchTxt: pageNum, disableCheckbox: "yes",
                }, () => self.setTotalCount(data.totalHostCount));
                setTimeout(() => self.setState({ disableCheckbox: "no" }), 500);
                if (status !== 200) {
                    self.clearAzureSearchTxt();
                    return failureToast(message);
                }
            });
    }

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

                <div id='azure-page' className="page">
                    <div className="bg-wh" >
                        {
                            hasShowTab0 &&
                            <ApprovedHosts
                                activePage={activePage}
                                setTotalCount={this.setTotalCount}
                                isSearchTxtBtnClicked={this.state.hasShowingSearchData ? 'yes' : 'no'}
                                hasShowingSearchData={this.state.hasShowingSearchData}
                                azureSearchHostData={this.state.azureSearchHostData}
                                isClearTxtBtnClicked={this.state.isClearTxtBtnClicked}
                                totalCountForSearchTxt={this.state.totalCountForSearchTxt}
                                getazureSearchHostData={this.getazureSearchHostData}
                                onResetSearch={this.onResetSearch}
                            />
                        }
                        {
                            hasShowTab1
                            &&
                            <AZURETBAHOST
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
                                    <Loader loading={loading} />
                                    <AddHost
                                        showLoaderIcon={this.showLoaderIcon}
                                        onSubmit={this.addAzureHost}
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
                                    {
                                        this.state.onAddSubmit && typeof this.state.onAddSubmit.handleSubmit === "function" &&
                                        <button type="button" className="save-btnn " style={{ backgroundColor: '#593CAB', padding: '4px 20px', marginRight: '20px' }} onClick={this.state.onAddSubmit.handleSubmit}>Save</button>
                                    }
                                    <button type="button" className="btn btn-azure btn-default float-right" style={{ border: '1px solid rgb(222, 225, 228)' }} onClick={this.onCancelAddHost} data-dismiss="modal">Cancel</button>
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
        userName: state.current_user.payload.userName,
        clientUsers: state.clientUsers,
        loaderAutoDiscovery: state.setAzureAutoDiscoveryToken && state.setAzureAutoDiscoveryToken.loaderAutoDiscovery,
        onDemandToken: state.setAzureAutoDiscoveryToken && state.setAzureAutoDiscoveryToken.onDemandToken,
        expTime: state.setAzureAutoDiscoveryToken && state.setAzureAutoDiscoveryToken.expTime,
        getOnDemandSetIntervalId: state.setAzureOnDemandSetIntervalId
    }
}

function mapdispatchToProps(dispatch) {
    return bindActionCreators({
        failureToast,
        successToast,
        getClientUsers,
        getProjectList,
        generateToken,
        getAutoDiscoveryStatus,
        infoToast,
        fetchType,
        fetchEnv,
        fetchOs,
        fetchRegionAzure,
        onDemandAutoDiscoveryAzure,
        setAzureAutoDiscoveryToken,
        setAzureOnDemandSetIntervalId,
        saveAzureHost,
        azureSearchHost
    }, dispatch);
}

AWSInventory.defaultProps = {
    getAllMasterData: {}
}

export default connect(mapStateToProps, mapdispatchToProps)(AWSInventory);
