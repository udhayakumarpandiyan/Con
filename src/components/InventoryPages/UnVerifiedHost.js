import React, { PureComponent, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
/* actions */
import { getUserForHost, removeAwsHost as deleteAwsAutoDiscoveryHost } from "../../actions/hostInventory/awsHostInventoryMain";
import { generateToken } from "../../actions/commons/commonActions";
import { failureToast, successToast } from "../../actions/commons/toaster";
import { getAzureUnVerifiedList, getAzureUnVerifiedById, sendToAzurePreviousState } from "../../actions/hostInventory/unVerified/azureUnVerifiedHost";
import { deleteAutoDiscoveryHost as deleteAzureAutoDiscoveryHost } from "../../actions/hostInventory/autoDiscovery/azureAutoDiscoveryHost";
import { getAwsUnVerifiedList, getAwsUnVerifiedById, sendPreviousStateAws } from "../../actions/hostInventory/unVerified/awsUnVerifiedHost";
/* Components */
import HOSTVIEW from "../aws/resources/HostView";
/* enums */
import { HOST_APPROVAL_STATUS } from "../../constants/index"
import $ from "jquery";


class UnVerifiedHost extends PureComponent {

    constructor(props) {
        super(props);
        this.getInitialState = this.getInitialState.bind(this);
        this.setInitialState = this.setInitialState.bind(this);
        this.actions = this.actions.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.sendToAzurePreviousState = this.sendToAzurePreviousState.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = this.getInitialState();
        this.isAWSHost = window.location && window.location.pathname ? window.location.pathname.toLowerCase().includes('aws') : false;
        this.isAZUREHost = window.location && window.location.pathname ? window.location.pathname.toLowerCase().includes('azure') : false;
        this.deleteHost = this.deleteHost.bind(this);
    }

    getInitialState() {
        return {
            hasShowDetails: false,
            hasShowEditForm: false,
            hasShowLoader: false,
            selectedRow: "",
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
            const { generateToken, clientId, userId, getAzureUnVerifiedById, getAwsUnVerifiedById, featureId, failureToast } = this.props;
            const getUnverifiedView = this.isAWSHost ? getAwsUnVerifiedById : getAzureUnVerifiedById;
            const { generateToken: apiToken } = await generateToken();
            const reqPayload = { clientId, userId, apiToken, hostInventoryId, featureId };
            this.getUsersOfHost(reqPayload);
            const self = this;
            this.setState({ hasShowLoader: true });
            getUnverifiedView(reqPayload)
                .then(res => {
                    const resType = this.isAWSHost ? "awsUnVerifiedView" : "azureUnVerifiedView";
                    if (res && res[resType]) {
                        const { message, status } = res[resType];
                        if (status === 200) {
                            return self.setState({ hasShowDetails: true, hasShowEditForm: false, selectedRow: hostInventoryId });
                        }
                        const text = typeof message === "string" ? message : "Something went wrong while retrieving details!";
                        return failureToast(text);
                    } else if (res && res.awsUnVerifiedView) {
                        const { message, status } = res.awsUnVerifiedView;
                        if (status === 200) {
                            return self.setState({ hasShowDetails: true, hasShowEditForm: false, selectedRow: hostInventoryId });
                        }
                        const text = typeof message === "string" ? message : "Something went wrong while retrieving details!";
                        return failureToast(text);
                    }
                });
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving details!";
            return this.props.failureToast(text);
        }
        finally {
            this.setState({ hasShowLoader: false });
            $('#viewHostDetails').toggle();
        }
    }

    onCancel() {
        const { getUserForHost } = this.props;
        this.setState({ hasShowDetails: false, hasShowEditForm: false });
        getUserForHost();
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

    onEditClick() {
        this.setState({ hasShowDetails: false, hasShowEditForm: true });
    }

    actions(hostInventoryId) {
        return <td>
            {/* <i title="View" className="fa fa-eye icon-style" onClick={() => this.onRowClick(hostInventoryId)} /> */}

            <span title="Send to Previous State" style={{ width: "25%", padding: "5%", marginRight: "5%", cursor: "pointer" }} onClick={() => this.sendToAzurePreviousState(hostInventoryId)}>
                                <i className="fa fa-send-o" style={{ color: "#484848" }} aria-hidden="true"></i>
                            </span>
            <span title="Delete" style={{ width: "25%", padding: "5%", marginRight: "5%", cursor: "pointer" }} onClick={() => this.deleteHost(hostInventoryId)}>
                                <i className="fa fa-trash-o" style={{ color: "#484848" }} aria-hidden="true"></i>
                            </span>
        </td>
    }

    componentDidMount() {
        this.getList();
    }

    getList = async (pageNum = 1) => {
        try {
            if (this) {
                const { getAzureUnVerifiedList, getAwsUnVerifiedList, generateToken, clientId, userId, featureId, failureToast } = this.props;
                const getUnVerifiedData = this.isAWSHost ? getAwsUnVerifiedList : getAzureUnVerifiedList;
                const { generateToken: apiToken } = await generateToken();
                const payload = { apiToken, featureId, clientId, userId, pageNum, limit: 30 };
                payload['approvalStatus'] = HOST_APPROVAL_STATUS.UNVERIFIED;
                this.setState({ hasShowLoader: true });
                getUnVerifiedData(payload).then(res => {
                    const resType = this.isAWSHost ? "awsUnVerifiedList" : "azureUnVerifiedList";
                    if (res && res[resType]) {
                        const { message, status } = res[resType];
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while retrieving details!";
                            return failureToast(text);
                        }
                        return this.setState({ currentPage: pageNum, hasShowLoader: false });
                    }
                    failureToast("Something went wrong!");
                    this.setState({ hasShowLoader: false });
                });
            }
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong while retrieving list!";
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

    async sendToAzurePreviousState(hostInventoryId) {
        try {
            const { generateToken, clientId, userId, featureId, failureToast, sendToAzurePreviousState, sendPreviousStateAws } = this.props;
            const sendPreviousState = this.isAWSHost ? sendPreviousStateAws : sendToAzurePreviousState;
            const { generateToken: apiToken } = await generateToken();
            const reqPayload = { clientId, userId, apiToken, hostInventoryId, featureId };
            this.setState({ hasShowLoader: true });
            sendPreviousState(reqPayload)
                .then(res => {
                    if (res && res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong while sending to previous state!";
                            return failureToast(text);
                        }
                        successToast("Sucessfully sent to previous state!");
                        return this.getList();
                    }
                    return failureToast("Somethig went wrong!");
                }).catch(err => {
                    const text = typeof err.message === "string" ? err.message : "Something went wrong while sending to previous state!";
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

    async deleteHost(hostInventoryId) {
        try {
            const { generateToken, deleteAwsAutoDiscoveryHost, clientId, userId, featureId, failureToast, deleteAzureAutoDiscoveryHost, successToast } = this.props;
            const deletingHost = this.isAWSHost ? deleteAwsAutoDiscoveryHost : deleteAzureAutoDiscoveryHost;
            const { generateToken: apiToken } = await generateToken();
            const reqPayload = { clientId, userId, apiToken, hostInventoryId, featureId };
            const self = this;
            this.setState({ hasShowLoader: true });
            deletingHost(reqPayload)
                .then(res => {
                    if (res && res.data) {
                        const { message, status } = res.data;
                        if (status === 200) {
                            successToast('Successfully Deleted!');
                            self.setInitialState();
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

    render() {
        const { azureUnVerifiedList, azureViewDetails, awsUnVerifiedList, awsViewDetails, awsUnVerifiedListCount, azureUnVerifiedListCount } = this.props;
        const UnVerifiedList = this.isAWSHost ? awsUnVerifiedList : azureUnVerifiedList;
        const viewDetails = this.isAWSHost ? awsViewDetails : azureViewDetails;
        const { hasShowDetails, hasShowEditForm, currentPage, hasShowLoader } = this.state;
        const totalCount = this.isAWSHost ? awsUnVerifiedListCount : azureUnVerifiedListCount;

        return (
            <Fragment>
                <HOSTVIEW
                    listData={UnVerifiedList}
                    isAWSInventory={this.isAWSHost}
                    isAZUREInventory={this.isAZUREHost}
                    actions={this.actions}
                    hasShowDetails={hasShowDetails}
                    hasShowEditForm={hasShowEditForm}
                    viewDetails={viewDetails}
                    onCancel={this.onCancel}
                    onEditClick={this.onEditClick}
                    isUnVerified={true}
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
        azureUnVerifiedListCount: state.getAzureUnVerifiedList && state.getAzureUnVerifiedList.data && state.getAzureUnVerifiedList.data.totalHostCount ? state.getAzureUnVerifiedList.data.totalHostCount : 0,
        azureUnVerifiedList: state.getAzureUnVerifiedList && state.getAzureUnVerifiedList.data && Array.isArray(state.getAzureUnVerifiedList.data.hostList) ? state.getAzureUnVerifiedList.data.hostList : [],
        azureViewDetails: state.getAzureUnVerifiedById && state.getAzureUnVerifiedById.data && state.getAzureUnVerifiedById.data.hostData ? state.getAzureUnVerifiedById.data.hostData : {},
        awsUnVerifiedListCount: state.getAwsUnVerifiedList && state.getAwsUnVerifiedList.data && state.getAwsUnVerifiedList.data.totalHostCount ? state.getAwsUnVerifiedList.data.totalHostCount : 0,
        awsUnVerifiedList: state.getAwsUnVerifiedList && state.getAwsUnVerifiedList.data && Array.isArray(state.getAwsUnVerifiedList.data.hostList) ? state.getAwsUnVerifiedList.data.hostList : [],
        awsViewDetails: state.getAwsUnVerifiedById && state.getAwsUnVerifiedById.data && state.getAwsUnVerifiedById.data.hostData ? state.getAwsUnVerifiedById.data.hostData : {}
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAzureUnVerifiedList,
        getAzureUnVerifiedById,
        getAwsUnVerifiedList,
        getAwsUnVerifiedById,
        getUserForHost,
        generateToken,
        failureToast,
        successToast,
        deleteAzureAutoDiscoveryHost,
        sendToAzurePreviousState,
        deleteAwsAutoDiscoveryHost,
        sendPreviousStateAws
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UnVerifiedHost);