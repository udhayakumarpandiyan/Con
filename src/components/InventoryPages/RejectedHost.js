import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
/* actions */
import { getUserForHost, sendForApprovalAws, removeAwsHost as deleteAwsAutoDiscoveryHost } from "../../actions/hostInventory/awsHostInventoryMain";
import { generateToken } from "../../actions/commons/commonActions";
import { failureToast, successToast } from "../../actions/commons/toaster";
import { getAzureRejectedList, getAzureRejectedById, updateAzureRejectedHost } from "../../actions/hostInventory/rejected/azureRejectedHost";
import { deleteAutoDiscoveryHost as deleteAzureAutoDiscoveryHost, azureSendForApprovalHost } from "../../actions/hostInventory/autoDiscovery/azureAutoDiscoveryHost";
import { getAwsRejectedList, getAwsRejectedById, updateAwsRejectedHost } from "../../actions/hostInventory/rejected/awsRejectedHost";
/* Components */
import HOSTVIEW from "../aws/resources/HostView";
/* enums */
import { HOST_APPROVAL_STATUS } from "../../constants/index";
import $ from "jquery";

class REJECTEDHOST extends PureComponent {

    constructor(props) {
        super(props);
        this.setInitialState = this.setInitialState.bind(this);
        this.actions = this.actions.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.sendApprovalHost = this.sendApprovalHost.bind(this);
        this.handleAzureSubmit = this.handleAzureSubmit.bind(this);
        this.handleAwsEditSubmit = this.handleAwsEditSubmit.bind(this);
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
            const { generateToken, clientId, userId, getAzureRejectedById, getAwsRejectedById, featureId, failureToast } = this.props;
            const getRejectedView = this.isAWSHost ? getAwsRejectedById : getAzureRejectedById;
            const { generateToken: apiToken } = await generateToken();
            const reqPayload = { clientId, userId, apiToken, hostInventoryId, featureId };
            await this.getUsersOfHost(reqPayload);
            const self = this;
            this.setState({ hasShowLoader: true });
            self.getUsers();
            await getRejectedView(reqPayload)
                .then(res => {
                    const resType = self.isAWSHost ? "awsRejectedView" : "azureRejectedView";
                    if (res && res[resType]) {
                        const { message, status } = res[resType];
                        this.setState({ hasShowLoader: false });
                        if (status === 200) {
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
        $('#viewHostDetails').modal('show');
    }

    onCancel() {
        const { getUserForHost, getAwsRejectedById, getAzureRejectedById } = this.props;
        const getRejectedView = this.isAWSHost ? getAwsRejectedById : getAzureRejectedById;
        this.setState({ hasShowDetails: false, hasShowEditForm: false });
        getUserForHost();
        getRejectedView();
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
        return <td>
            {/* <i title="View" className="fa fa-eye icon-style" onClick={() => this.onRowClick(hostInventoryId)} /> */}
            <span title="Send for Approval" style={{ width: "25%", padding: "5%", marginRight: "5%", cursor: "pointer" }} onClick={(e) => { e.preventDefault(); this.sendApprovalHost(hostInventoryId, index) }}>
                <i className="fa fa-send-o icon-style" style={{ color: "#484848" }} aria-hidden="true"></i>
            </span>
            <span title="Delete" style={{ width: "25%", padding: "5%", marginRight: "5%", cursor: "pointer" }} onClick={() => this.deleteHost(hostInventoryId)}>
                <i className="fa fa-trash-o icon-style" style={{ color: "#484848" }} aria-hidden="true"></i>
            </span>
        </td>
    }

    componentDidMount() {
        this.getList();
    }

    async getList(pageNum = 1) {
        try {
            if (this) {
                const { getAzureRejectedList, getAwsRejectedList, generateToken, clientId, userId, featureId, failureToast } = this.props;
                const getRejectedData = this.isAWSHost ? getAwsRejectedList : getAzureRejectedList;
                const { generateToken: apiToken } = await generateToken();
                const payload = { apiToken, featureId, clientId, userId, pageNum, limit: 30 };
                payload['approvalStatus'] = HOST_APPROVAL_STATUS.REJECTED;
                this.setState({ hasShowLoader: true });
                await getRejectedData(payload).then(res => {
                    const resType = this.isAWSHost ? "awsRejectedList" : "azureRejectedList";
                    if (res && res[resType]) {
                        const { message, status } = res[resType];
                        this.setState({ hasShowLoader: false, currentPage: pageNum });
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while retrieving details!";
                            return failureToast(text);
                        }
                        return;
                    }
                    failureToast("Something went wrong!");
                    this.setState({ hasShowLoader: false });
                });
            }
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
            this.setState({ hasShowLoader: false });
            this.props.failureToast(text);
        }
        finally {
            this.setState({ hasShowDetails: false, hasShowEditForm: false });
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
    }


    async deleteHost(hostInventoryId) {
        try {
            const { generateToken, clientId, userId, featureId, failureToast, deleteAwsAutoDiscoveryHost, deleteAzureAutoDiscoveryHost } = this.props;
            const deleteHost = this.isAWSHost ? deleteAwsAutoDiscoveryHost : deleteAzureAutoDiscoveryHost;
            const { generateToken: apiToken } = await generateToken();
            const reqPayload = { clientId, userId, apiToken, hostInventoryId, featureId };
            const self = this;
            this.setState({ hasShowLoader: true });
            await deleteHost(reqPayload)
                .then(res => {
                    if (res && res.data) {
                        const { message, status } = res.data;
                        if (status === 200) {
                            self.setInitialState()
                            return self.getList();
                        }
                        const text = typeof message === "string" ? message : "Something went wrong while retrieving details!";
                        return failureToast(text);
                    }
                });
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while deleting!";
            this.props.failureToast(text);
        }
        finally {
            this.setState({ hasShowLoader: false });
        }
    }

    async sendApprovalHost(hostInventoryId, selectedListIndex) {
        try {
            const { azureSendForApprovalHost, sendForApprovalAws, generateToken, clientId, userId, featureId, failureToast, successToast, awsRejectedList, azureRejectedList } = this.props;
            const rejectedList = this.isAWSHost ? awsRejectedList : azureRejectedList;
            if (Array.isArray(rejectedList) && rejectedList[selectedListIndex] && !rejectedList[selectedListIndex].approver) {
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
                            return failureToast(text);
                        }
                        successToast("Approval mail has send sucessfully!");
                        return this.getList();
                    }
                    return failureToast("Somethig went wrong!");
                }).catch(err => {
                    const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
                    this.props.failureToast(text);
                });
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
            this.props.failureToast(text);
        }
        finally {
            this.setState({ hasShowLoader: false });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    async handleAzureSubmit(hostInventoryId) {
        try {
            const { updateAzureRejectedHost, featureId, clientId, userId, generateToken, azureViewDetails, failureToast, successToast } = this.props;
            const { generateToken: apiToken } = await generateToken();
            const payload = { apiToken, featureId, clientId, userId, hostInventoryId };
            const { hostId, type, os, hostname, fqdn, privateIp, publicIp, username, password, port, serverType, hosting, monitoring, dms, backup, resourceGroup } = this.state;
            const { primaryOwner, secondaryOwner, comments, region, userList: selectedUsers, approver, vmName, env } = this.state;

            const userList = Array.isArray(selectedUsers) && selectedUsers.map(user => user.value);
            const { userList: existUsers } = azureViewDetails;

            payload['updateKeys'] = { hostId, vmName, type, env, region, os, hostname, fqdn, privateIp, publicIp, username, password, port, serverType, hosting, resourceGroup, monitoring, dms, backup, primaryOwner, secondaryOwner, comments, approver };
            for (var propName in payload['updateKeys']) {
                if (payload['updateKeys'][propName] === null || payload['updateKeys'][propName] === undefined || payload['updateKeys'][propName] === "") {
                    delete payload['updateKeys'][propName];
                }
            }
            if (userList.sort().toString() !== existUsers.sort().toString()) {
                payload['updateKeys']['userList'] = userList;
            }
            this.setState({ hasShowLoader: true });
            updateAzureRejectedHost(payload)
                .then(res => {
                    if (res && res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while updateing!";
                            this.setState({ hasShowLoader: false });
                            return failureToast(text);
                        }
                        $('#viewHostDetails').modal('hide');
                        successToast("Successfully updated!");
                        return this.getList();
                    }
                    this.setState({ hasShowLoader: false });
                    return failureToast("Somethig went wrong!");
                }).catch(err => {
                    const text = typeof err.message === "string" ? err.message : "Something went wrong while updating!";
                    this.setState({ hasShowLoader: false });
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
            const { updateAwsRejectedHost, featureId, clientId, userId, generateToken, awsViewDetails, failureToast, successToast } = this.props;

            const { hostId, type, serverType, instanceId, description, publicIp, fqdn, os, versionFlavor,
                buildKernel, username, password, port, hostname, region, hosting, monitoring, dms, tags,
                volumeExceptions, backup, primaryOwner, secondaryOwner, comments, privateIp, env } = this.state;

            const payload = { featureId, clientId, userId, hostInventoryId };
            const { userList: selectedUsers, approver } = this.state;
            const userList = Array.isArray(selectedUsers) && selectedUsers.map(user => user.value);
            const { userList: existUsers } = awsViewDetails;
            payload['updateKeys'] = { hostId, type, os, buildKernel, region, volumeExceptions, privateIp, env, hostname, tags, description, region, fqdn, versionFlavor, instanceId, publicIp, username, password, port, serverType, hosting, monitoring, dms, backup, primaryOwner, secondaryOwner, comments, approver };
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
            await updateAwsRejectedHost(payload)
                .then(res => {
                    if (res && res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while updateing!";
                            this.setState({ hasShowLoader: false });
                            return failureToast(text);
                        }
                        $('#viewHostDetails').modal('hide');
                        successToast("Successfully updated!");
                        return this.getList();
                    }
                    this.setState({ hasShowLoader: false });
                    return failureToast("Somethig went wrong!");
                }).catch(err => {
                    const text = typeof err.message === "string" ? err.message : "Something went wrong while updating!";
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
        $('#viewHostDetails').modal('hide');
        this.getList();
    }

    render() {
        const { azureRejectedList, azureViewDetails, awsRejectedList, awsViewDetails, awsRejectedListCount, azureRejectedListCount } = this.props;
        const rejectedList = this.isAWSHost ? awsRejectedList : azureRejectedList;
        const viewDetails = this.isAWSHost ? awsViewDetails : azureViewDetails;
        const { hasShowDetails, hasShowEditForm, userList, userOptions, currentPage, hasShowLoader } = this.state;
        const totalCount = this.isAWSHost ? awsRejectedListCount : azureRejectedListCount;
        const handleSubmit = this.isAWSHost ? this.handleAwsEditSubmit : this.handleAzureSubmit;

        return (
            <Fragment>
                <HOSTVIEW
                    listData={rejectedList}
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
        azureRejectedListCount: state.getAzureRejectedList && state.getAzureRejectedList.data && state.getAzureRejectedList.data.totalHostCount ? state.getAzureRejectedList.data.totalHostCount : 0,
        azureRejectedList: state.getAzureRejectedList && state.getAzureRejectedList.data && Array.isArray(state.getAzureRejectedList.data.hostList) ? state.getAzureRejectedList.data.hostList : [],
        azureViewDetails: state.getAzureRejectedById && state.getAzureRejectedById.data && state.getAzureRejectedById.data.hostData ? state.getAzureRejectedById.data.hostData : {},
        awsRejectedListCount: state.getAwsRejectedList && state.getAwsRejectedList.data && state.getAwsRejectedList.data.totalHostCount ? state.getAwsRejectedList.data.totalHostCount : 0,
        awsRejectedList: state.getAwsRejectedList && state.getAwsRejectedList.data && Array.isArray(state.getAwsRejectedList.data.hostList) ? state.getAwsRejectedList.data.hostList : [],
        awsViewDetails: state.getAwsRejectedById && state.getAwsRejectedById.data && state.getAwsRejectedById.data.hostData ? state.getAwsRejectedById.data.hostData : {},
        getUserForHostData: state.getUserForHost && Array.isArray(state.getUserForHost.data) ? state.getUserForHost.data : []
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAzureRejectedList,
        getAzureRejectedById,
        getAwsRejectedList,
        getAwsRejectedById,
        getUserForHost,
        generateToken,
        failureToast,
        successToast,
        deleteAzureAutoDiscoveryHost,
        azureSendForApprovalHost,
        updateAzureRejectedHost,
        sendForApprovalAws,
        deleteAwsAutoDiscoveryHost,
        updateAwsRejectedHost
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(REJECTEDHOST);