import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
/* actions */
import { getUserForHost, sendForApprovalAws } from "../../actions/hostInventory/awsHostInventoryMain";
import { generateToken } from "../../actions/commons/commonActions";
import { failureToast, successToast } from "../../actions/commons/toaster";
import { getAzureAutoDiscoveryList, getAzureAutoDiscoveryById, azureSendForApprovalHost, updateAzureDiscoverHost } from "../../actions/hostInventory/autoDiscovery/azureAutoDiscoveryHost";
import { getAwsAutoDiscoveryList, getAwsAutoDiscoveryById, updateAwsDiscoveredHost } from "../../actions/hostInventory/autoDiscovery/awsAutoDiscoveryHost";
/* Components */
import HOSTVIEW from "../aws/resources/HostView";

// import Loader from "../../commons/loader";
/* enums */
import { HOST_APPROVAL_STATUS } from "../../constants/index";
import $ from "jquery";

class AUTODISCOVERY extends PureComponent {

    constructor(props) {
        super(props);
        this.setInitialState = this.setInitialState.bind(this);
        this.actions = this.actions.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleAzureEditSubmit = this.handleAzureEditSubmit.bind(this);
        this.handleAwsEditSubmit = this.handleAwsEditSubmit.bind(this);
        this.sendApprovalHost = this.sendApprovalHost.bind(this);
        this.onUserSelect = this.onUserSelect.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = this.getInitialState();
        this.isAWSHost = window.location && window.location.pathname ? window.location.pathname.toLowerCase().includes('aws') : false;
        this.isAZUREHost = window.location && window.location.pathname ? window.location.pathname.toLowerCase().includes('azure') : false;
    }

    getInitialState() {
        return {
            hasShowDetails: false,
            hasShowEditForm: false,
            hasShowLoader: false,
            selectedRow: "",
            userList: [],
            userOptions: [],
            currentPage: 1
        }
    }

    handlePageChange(pageNum) {
        if (this.props.isSearchTxtBtnClicked === 'yes') {
            if (this.isAWSHost) {
                this.props.getAwsSearchHostData(pageNum);
            } else {
                this.props.getAzureSearchHostData(pageNum);
            }
        } else {
            this.getList(pageNum);
        }
    }

    async getUsers() {
        const { getUserForHostData } = this.props;
        let userList = Array.isArray(getUserForHostData) && getUserForHostData.map(x => ({
            'value': x.userId,
            'label': x.name
        }));
        let list = Array.isArray(getUserForHostData) && getUserForHostData.map(x => x.isPermission && ({
            'value': x.userId,
            'label': x.name
        }));
        const userOptions = Array.isArray(userList) && userList.filter(x => x) || [];
        const selectUsers = Array.isArray(list) && list.filter(x => x) || [];
        await this.setState({ userOptions, userList: selectUsers });
    }


    onUserSelect(selectedUsers) {
        this.setState({
            userList: selectedUsers
        });
    }

    setInitialState() {
        this.setState(this.getInitialState());
    }

    async onRowClick(event, hostInventoryId) {
        const { tagName } = event ? event.target : {};
        if (tagName && tagName.toLowerCase() === "input") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "i") {
            return;
        }
        if (tagName && tagName.toLowerCase() === "img") {
            return;
        }
        try {
            const { generateToken, clientId, userId, getAzureAutoDiscoveryById, getAwsAutoDiscoveryById, featureId, failureToast } = this.props;
            const getAutoDiscoverView = this.isAWSHost ? getAwsAutoDiscoveryById : getAzureAutoDiscoveryById;
            const { generateToken: apiToken } = await generateToken();
            const reqPayload = { clientId, userId, apiToken, hostInventoryId, featureId };
            await this.getUsersOfHost(reqPayload);
            this.setState({ hasShowLoader: true });
            const self = this;
            self.getUsers();
            getAutoDiscoverView(reqPayload)
                .then(res => {
                    const resType = self.isAWSHost ? "awsAutoDiscoveryView" : "azureAutoDiscoveryView";
                    if (res && res[resType]) {
                        const { message, status } = res[resType];
                        self.setState({ hasShowLoader: false });
                        if (status === 200) {
                            $('#viewHostDetails').toggle();
                            return self.setState({ hasShowDetails: true, hasShowEditForm: false, selectedRow: hostInventoryId });
                        }
                        const text = typeof message === "string" ? message : "Something went wrong while retrieving details!";
                        return failureToast(text);
                    }
                    this.setState({ hasShowLoader: false });
                    failureToast("Something went wrong!");
                });
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving details!";
            this.setState({ hasShowLoader: false });
            return this.props.failureToast(text);
        }
    }

    onCancel() {
        const { getUserForHost, getAzureAutoDiscoveryById, getAwsAutoDiscoveryById } = this.props;
        getUserForHost();
        $('#viewHostDetails').toggle();
        const getAutoDiscoverView = this.isAWSHost ? getAwsAutoDiscoveryById : getAzureAutoDiscoveryById;
        this.setInitialState();
        getAutoDiscoverView();
        $('#viewHostDetails').toggle();
    }

    async getUsersOfHost(reqPayload) {
        const { getUserForHost, failureToast } = this.props;
        reqPayload.accessPlatform = this.isAWSHost ? "1" : "2";
        await getUserForHost && getUserForHost(reqPayload)
            .then(res => {
                const { status, message } = res.data;
                if (status !== 200) {
                    return failureToast(message);
                }
            });
    }

    async onEditClick() {
        this.setState({ hasShowDetails: false, hasShowEditForm: true }, () => this.getUsers());
    }

    actions(hostInventoryId, index) {
        return <td className='flex-content'>
            {/* <i title="View" className="fa fa-eye icon-style" onClick={(e) => { e.preventDefault(); this.onRowClick(hostInventoryId) }} /> */}
            <i title="Send for approval" className="fa fa-send-o icon-style" onClick={(e) => { e.preventDefault(); this.sendApprovalHost(hostInventoryId, index) }} />
        </td>
    }

    async componentDidMount() {
        this.getList();
    }

    async getList(pageNum = 1) {
        try {
            if (this) {
                const { getAzureAutoDiscoveryList, getAwsAutoDiscoveryList, generateToken, clientId, userId, featureId, failureToast } = this.props;
                const getAutoDiscoveryData = this.isAWSHost ? getAwsAutoDiscoveryList : getAzureAutoDiscoveryList;
                const { generateToken: apiToken } = await generateToken();
                const payload = { apiToken, featureId, clientId, userId, pageNum, limit: 30 };
                payload['approvalStatus'] = HOST_APPROVAL_STATUS.AUTODISCOVERED;
                this.setState({ hasShowLoader: true });
                getAutoDiscoveryData(payload).then(res => {
                    const resType = this.isAWSHost ? "awsAutoDiscoveryList" : "azureAutoDiscoveryList";
                    if (res && res[resType]) {
                        const { message, status } = res[resType];
                        this.setState({ hasShowLoader: false, hasShowDetails: false, hasShowEditForm: false });
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while retrieving details!";
                            return failureToast(text);
                        }
                        return this.setState({ currentPage: pageNum });
                    }
                    this.setState({ hasShowLoader: false });
                    failureToast("Something went wrong!");
                });
            }
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
            this.setState({ hasShowLoader: false, hasShowDetails: false, hasShowEditForm: false });
            this.props.failureToast(text);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clientId !== this.props.clientId ||
            (prevProps.isClearTxtBtnClicked !== this.props.isClearTxtBtnClicked && this.state.currentPage > 1)) {
            this.setInitialState();
            this.getList();
        }
        if (this.state.hasShowDetails && (this.props.disableCheckbox === 'yes' ||
            this.props.isClearTxtBtnClicked === 'yes')) {
            this.setState({ selectedRow: "", hasShowDetails: false });
        }
        if (prevProps.hasAutoDiscoryNeedUpdate !== this.props.hasAutoDiscoryNeedUpdate) {
            this.getList();
            this.props.onUpdateAutoDiscoryNeedUpdate();
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    async handleAzureEditSubmit(hostInventoryId) {
        try {
            const { updateAzureDiscoverHost, featureId, clientId, userId, generateToken, azureViewDetails, failureToast, successToast } = this.props;
            const { generateToken: apiToken } = await generateToken();
            const payload = { apiToken, featureId, clientId, userId, hostInventoryId };
            const { hostId, type, os, hostname, fqdn, privateIp, publicIp, username, password, port, serverType, hosting, monitoring, dms, backup } = this.state;
            const { primaryOwner, secondaryOwner, comments, userList: selectedUsers, approver } = this.state;

            const userList = Array.isArray(selectedUsers) && selectedUsers.map(user => user.value);
            const { userList: existUsers } = azureViewDetails;
            payload['updateKeys'] = { hostId, type, os, hostname, fqdn, privateIp, publicIp, username, password, port, serverType, hosting, monitoring, dms, backup, primaryOwner, secondaryOwner, comments, approver };
            for (var propName in payload['updateKeys']) {
                // do not put !, bz we need to false value also in req body
                if (payload['updateKeys'][propName] === null || payload['updateKeys'][propName] === undefined || payload['updateKeys'][propName] === "") {
                    delete payload['updateKeys'][propName];
                }
            }
            if (Array.isArray(existUsers) && userList.sort().toString() !== existUsers.sort().toString()) {
                payload['updateKeys']['userList'] = userList;
            }
            this.setState({ hasShowLoader: true });
            const self = this;
            await updateAzureDiscoverHost(payload)
                .then(res => {
                    if (res && res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while updateing!";
                            self.setState({ hasShowLoader: false });
                            return failureToast(text);
                        }
                        $('#viewHostDetails').toggle();
                        successToast("Successfully updated!");
                        // this.setState({ hasShowLoader: false, hasShowDetails: false, hasShowEditForm: false });
                        return this.getList();
                    }
                    this.setState({ hasShowLoader: false });
                    return failureToast("Somethig went wrong!");
                }).catch(err => {
                    const text = typeof err.message === "string" ? err.message : "Something went wrong while updating!"; self.setState({ hasShowLoader: false });
                    self.setState({ hasShowLoader: false });
                    this.props.failureToast(text);
                });
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
            this.setState({ hasShowLoader: false });
            this.props.failureToast(text);
        }
    }

    async handleAwsEditSubmit(hostInventoryId) {
        try {
            const { updateAwsDiscoveredHost, featureId, clientId, userId, generateToken, awsViewDetails, failureToast, successToast } = this.props;
            const { hostId, type, serverType, instanceId, description, publicIp, fqdn, os, versionFlavor,
                buildKernel, username, password, port, hostname, region, hosting, monitoring, dms, tags,
                volumeExceptions, backup, primaryOwner, secondaryOwner, comments } = this.state;
            const payload = { featureId, clientId, userId, hostInventoryId };
            const { userList: selectedUsers, approver } = this.state;
            const userList = Array.isArray(selectedUsers) && selectedUsers.map(user => user.value);
            const { userList: existUsers } = awsViewDetails;
            payload['updateKeys'] = { hostId, type, os, buildKernel, volumeExceptions, hostname, description, region, tags, fqdn, versionFlavor, instanceId, publicIp, username, password, port, serverType, hosting, monitoring, dms, backup, primaryOwner, secondaryOwner, comments, approver };
            for (var propName in payload['updateKeys']) {
                if (payload['updateKeys'][propName] === null || payload['updateKeys'][propName] === undefined || payload['updateKeys'][propName] === "") {
                    delete payload['updateKeys'][propName];
                }
            }
            if (Array.isArray(existUsers) && userList.sort().toString() !== existUsers.sort().toString()) {
                payload['updateKeys']['userList'] = userList;
            }
            const { generateToken: apiToken } = await generateToken();
            payload['apiToken'] = apiToken;
            this.setState({ hasShowLoader: true });
            await updateAwsDiscoveredHost(payload)
                .then(res => {
                    if (res && res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while updateing!";
                            this.setState({ hasShowLoader: false });
                            return failureToast(text);
                        }
                        $('#viewHostDetails').toggle();
                        successToast("Successfully updated!");
                        return this.getList();
                    }
                    this.setState({ hasShowLoader: false });
                    return failureToast("Somethig went wrong!");
                }).catch(err => {
                    const text = typeof err.message === "string" ? err.message : "Something went wrong while updating!";
                    this.props.failureToast(text);
                });
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
            this.setState({ hasShowLoader: false });
            this.props.failureToast(text);
        }
    }

    async sendApprovalHost(hostInventoryId, selectedListIndex) {
        try {
            const { azureSendForApprovalHost, sendForApprovalAws, generateToken, clientId, userId, featureId, failureToast, successToast, awsAutoDiscoveryList, azureAutoDiscoveryList } = this.props;
            const autoDiscoveryList = this.isAWSHost ? awsAutoDiscoveryList : azureAutoDiscoveryList;

            if (Array.isArray(autoDiscoveryList) && autoDiscoveryList[selectedListIndex] && !autoDiscoveryList[selectedListIndex].approver) {
                return failureToast("You do not have approvers. Please add approvers! ");
            }
            const sendApprovalHost = this.isAWSHost ? sendForApprovalAws : azureSendForApprovalHost;
            const { generateToken: apiToken } = await generateToken();
            const payload = { apiToken, featureId, clientId, userId, hostInventoryId };
            this.setState({ hasShowLoader: true });
            sendApprovalHost(payload)
                .then(res => {
                    if (res && res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while sending approval!";
                            this.setState({ hasShowLoader: false });
                            return failureToast(text);
                        }
                        successToast("Approval mail has send sucessfully!");
                        return this.getList();
                    }
                    this.setState({ hasShowLoader: false });
                    return failureToast("Somethig went wrong!");
                }).catch(err => {
                    const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
                    this.setState({ hasShowLoader: false });
                    this.props.failureToast(text);
                });
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
            this.setState({ hasShowLoader: false });
            this.props.failureToast(text);
        }
    }

    onUpdateReset = () => {
        $('#viewHostDetails').toggle();
        this.getList();
    }

    render() {
        const { azureAutoDiscoveryList, azureViewDetails, awsAutoDiscoveryList, awsViewDetails, awsAutoDiscoveryListCount, azureAutoDiscoveryListCount } = this.props;
        const totalCount = this.isAWSHost ? awsAutoDiscoveryListCount : azureAutoDiscoveryListCount;
        const autoDiscoveryList = this.isAWSHost ? awsAutoDiscoveryList : azureAutoDiscoveryList;
        const viewDetails = this.isAWSHost ? awsViewDetails : azureViewDetails;
        const handleSubmit = this.isAWSHost ? this.handleAwsEditSubmit : this.handleAzureEditSubmit;
        const { hasShowDetails, hasShowEditForm, userList, userOptions, currentPage, hasShowLoader } = this.state;
        return (
            <Fragment>
                <HOSTVIEW
                    listData={autoDiscoveryList}
                    isAWSInventory={this.isAWSHost}
                    isAZUREInventory={this.isAZUREHost}
                    actions={this.actions}
                    hasShowDetails={hasShowDetails}
                    hasShowEditForm={hasShowEditForm}
                    viewDetails={viewDetails}
                    onCancel={this.onCancel}
                    onEditClick={this.onEditClick}
                    handleChange={this.handleChange}
                    handleSubmit={handleSubmit}
                    onUserSelect={this.onUserSelect}
                    userList={userList}
                    isAutoDiscoverTab={true}
                    userOptions={userOptions}
                    activePage={currentPage}
                    totalCount={totalCount}
                    handlePageChange={this.handlePageChange}
                    isLoading={hasShowLoader}
                    isSearchTxtBtnClicked={this.props.isSearchTxtBtnClicked}
                    SearchHostData={this.props.SearchHostData}
                    isClearTxtBtnClicked={this.props.isClearTxtBtnClicked}
                    activePageForSearchTxt={this.props.activePageForSearchTxt}
                    totalCountForSearchTxt={this.props.totalCountForSearchTxt}
                    disableCheckbox={this.props.disableCheckbox}
                    onRowClick={this.onRowClick}
                    getList={this.getList.bind(this, currentPage)}
                    onUpdateReset={this.onUpdateReset}
                />
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        userId: state.current_user.payload.userId,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures && state.clientUserFeatures.featureIds ? state.clientUserFeatures.featureIds.HostInventoryvault : "",
        azureAutoDiscoveryListCount: state.getAzureAutoDiscoveryList && state.getAzureAutoDiscoveryList.data && state.getAzureAutoDiscoveryList.data.totalHostCount ? state.getAzureAutoDiscoveryList.data.totalHostCount : 0,
        azureAutoDiscoveryList: state.getAzureAutoDiscoveryList && state.getAzureAutoDiscoveryList.data && Array.isArray(state.getAzureAutoDiscoveryList.data.hostList) ? state.getAzureAutoDiscoveryList.data.hostList : [],
        azureViewDetails: state.getAzureAutoDiscoveryById && state.getAzureAutoDiscoveryById.data && state.getAzureAutoDiscoveryById.data.hostData ? state.getAzureAutoDiscoveryById.data.hostData : {},
        awsAutoDiscoveryListCount: state.getAwsAutoDiscoveryList && state.getAwsAutoDiscoveryList.data && state.getAwsAutoDiscoveryList.data.totalHostCount ? state.getAwsAutoDiscoveryList.data.totalHostCount : 0,
        awsAutoDiscoveryList: state.getAwsAutoDiscoveryList && state.getAwsAutoDiscoveryList.data && Array.isArray(state.getAwsAutoDiscoveryList.data.hostList) ? state.getAwsAutoDiscoveryList.data.hostList : [],
        awsViewDetails: state.getAwsAutoDiscoveryById && state.getAwsAutoDiscoveryById.data && state.getAwsAutoDiscoveryById.data.hostData ? state.getAwsAutoDiscoveryById.data.hostData : {},
        getUserForHostData: state.getUserForHost && Array.isArray(state.getUserForHost.data) ? state.getUserForHost.data : []
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAzureAutoDiscoveryList,
        getAzureAutoDiscoveryById,
        getAwsAutoDiscoveryById,
        getAwsAutoDiscoveryList,
        getUserForHost,
        generateToken,
        failureToast,
        successToast,
        azureSendForApprovalHost,
        updateAzureDiscoverHost,
        sendForApprovalAws,
        updateAwsDiscoveredHost
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AUTODISCOVERY);