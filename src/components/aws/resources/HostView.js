import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
/* actions */
import { generateToken } from "../../../actions/commons/commonActions";
import { failureToast, successToast } from "../../../actions/commons/toaster";
import Loader from '../../resources/Loader';
import { HostDetails } from './HostDetails';
// import AzureHostDetailPage from "../../pages/hostInventory/azureHostDetailPage";
// import { HostEdit } from "./hostEdit";
import { awsCurrentState } from "../../../actions/hostInventory/awsHostInventoryMain";
import { azureCurrentState } from "../../../actions/hostInventory/azureHostInventoryMain";
import $ from "jquery";
import './page.css';
import { HostDetails as AZUREHostDetails } from '../../Azure/resources/HostDetails';


class HOSTVIEW extends Component {

    constructor(props) {
        super(props);
        this.onSyncHostStatus = this.onSyncHostStatus.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
        this.updateAllCheckboxes = this.updateAllCheckboxes.bind(this);
        this.state = {
            checkedInstances: []
        }
    }

    onSelectAll(e) {
        const { checked } = e.target;
        this.updateAllCheckboxes(checked);
    }
    updateAllCheckboxes(checked) {
        const listData = this.props.isSearchTxtBtnClicked === "yes" ? this.props.SearchHostData : this.props.listData;
        if (Array.isArray(listData)) {
            var hostInventories = listData.map(data => {
                $(`#${data.hostInventoryId}`).prop('checked', checked);
                return data.hostInventoryId;
            });
            this.values = checked ? hostInventories : [];
            this.setState({ checkedInstances: checked ? hostInventories : [] });
        }
    }

    values = [];
    onCheckChange(e) {
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

    async onSyncHostStatus() {
        const { userId, featureId, clientId, generateToken, failureToast, isAWSInventory, successToast, awsCurrentState, listData, azureCurrentState, isAutoDiscoverTab } = this.props;
        let hostData = [];
        if (!isAutoDiscoverTab) {
            const data = Array.isArray(listData) ? listData : [];
            const hostInventoryIds = data.map(awsData => awsData.hostInventoryId);
            hostData = hostInventoryIds;
        } else {
            const { checkedInstances } = this.state;
            hostData = checkedInstances;
        }
        if (!Array.isArray(hostData) || !hostData.length) {
            return failureToast('Please select atleast one host!');
        }
        const { generateToken: apiToken } = await generateToken();
        const payload = { userId, featureId, clientId, apiToken, hostInventoryIds: hostData };
        const self = this;
        const func = isAWSInventory ? awsCurrentState : azureCurrentState;
        try {
            func(payload)
                .then(res => {
                    if (res.data) {
                        const { status, message } = res.data;
                        if (status !== 200) {
                            const text = typeof message === "string" ? message : "Something went wrong";
                            return failureToast(text);
                        }
                        self.values = [];
                        self.setState({ checkedInstances: [] });
                        $('#selectAll').prop('checked', false);
                        hostData.map(hostId => $(`#${hostId}`).prop('checked', false));
                        successToast('Successfully updated!');
                    }
                })
        } catch (err) {
            const text = typeof err.message === "string" ? err.message : "Something went wrong!";
            failureToast(text);
        }
    }

    getAutoDiscover() {
        const { listData, actions, isAWSInventory, isAutoDiscoverTab } = this.props;
        const awsList = this.props.isSearchTxtBtnClicked === "yes" ? this.props.SearchHostData : listData;
        let isChecked = $("#selectAll").prop("checked");
        if (isChecked && this.props.isClearTxtBtnClicked === 'yes') {
            $("#selectAll").prop("checked", false); this.updateAllCheckboxes(!isChecked);
        } else if (!isChecked && this.state.checkedInstances.length > 0 &&
            this.props.isClearTxtBtnClicked === 'yes') {
            this.updateAllCheckboxes(false);
        } else if (isAutoDiscoverTab) {
            if (this.props.disableCheckbox === "yes" && isChecked) {
                $("#selectAll").prop("checked", false); this.updateAllCheckboxes(!isChecked);
            } else if (this.props.disableCheckbox === "yes" && this.state.checkedInstances.length > 0) {
                this.updateAllCheckboxes(false);
            }
        }
        return Array.isArray(awsList) && awsList.map((host, index) =>
            <tr key={host.hostInventoryId} onClick={(e) => this.props.onRowClick(e, host.hostInventoryId)}>
                {
                    isAutoDiscoverTab &&
                    <td style={{ width: '30px' }}>
                        <input style={{ float: "none" }} className="select_check" name={"merge_" + host.hostInventoryId} type="checkbox" value={host.hostInventoryId}
                            id={`${host.hostInventoryId}`} onChange={this.onCheckChange} />
                    </td>
                }
                <td ><span>{host.hostname}</span></td>
                {
                    isAWSInventory ? < td ><span>{host.instanceId}</span> </td> : <td><span>{host.vmName}</span></td>
                }
                <td><span>{host.status}</span></td>
                <td><span>{host.publicIp}</span></td>
                <td><span>{host.privateIp}</span></td>
                <td><span>{host.projectName}</span></td>
                <td><span>{host.sandboxName}</span></td>
                <td><span>{host.lastSyncStatus ? window.DateTimeParser(host.lastSyncStatus) : ""}</span></td>
                {
                    typeof actions === "function" && actions(host.hostInventoryId, index)
                }
            </tr >
        )
    }

    onCancel = () => {
        this.props.onCancel();
        $('#viewHostDetails').modal('hide');
    }

    render() {
        const { listData, hasShowDetails, viewDetails, hasShowEditForm, isAWSInventory, isAZUREInventory, isUnVerified, clientUsers } = this.props;
        const { getTypeList, getOsList, getEnvList, getRegionAzure, handleChange, handleSubmit, getRegionAWS,
            onEditClick, userList, userOptions, onUserSelect, isAutoDiscoverTab, isLoading, handlePageChange } = this.props;
        const getRegions = isAWSInventory ? getRegionAWS : getRegionAzure;
        const awsListHostData = this.props.isSearchTxtBtnClicked === "yes" ? this.props.SearchHostData : listData;
        const activePage = this.props.isSearchTxtBtnClicked == "yes" ? this.props.activePageForSearchTxt : this.props.activePage;
        const totalCount = this.props.isSearchTxtBtnClicked === "yes" ? this.props.totalCountForSearchTxt : this.props.totalCount;
        return (
            <Fragment>
                <Loader loading={isLoading} />
                {/* <OnDemandStatus onSyncHostStatus={this.onSyncHostStatus} /> */}
                <table className="table table-hover aws-table" r>
                    <thead>
                        <tr className="table-head">
                            {
                                isAutoDiscoverTab &&
                                <th>
                                    <span className="checkbox-all">
                                        <div className="form-group group-lable m-0">
                                            <input type="checkbox" id="checkAll" onClick={this.onSelectAll} />
                                            <label htmlFor="checkAll" className="th-text"> S.no </label>
                                        </div>
                                    </span>
                                </th>
                            }
                            <th><span className='th-text col-form-label'>Name</span></th>
                            {
                                isAWSInventory ? <th><span className='th-text col-form-label'>Instance Id</span></th> : <th><span className='th-text'>VM NAME</span></th>
                            }
                            <th ><span className='th-text col-form-label'>Status</span></th>
                            <th><span className='th-text col-form-label'>Public Ip</span></th>
                            <th ><span className='th-text col-form-label'>Private Ip</span></th>
                            <th><span className='th-text col-form-label'>Project Name</span></th>
                            <th><span className='th-text col-form-label'>Account</span></th>
                            <th><span className='th-text col-form-label'>Last Sync</span></th>
                            <th><span className='th-text col-form-label'>Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.getAutoDiscover()
                        }
                    </tbody>
                </table>
                {
                    (!Array.isArray(awsListHostData) || !awsListHostData.length) &&
                    <div >
                        <p style={{ textAlign: "center" }}>No Data Found</p>
                    </div>
                }
                <div className="modal" data-backdrop="static" data-keyboard="false" id="viewHostDetails">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Host Details</h3>
                                {
                                    isLoading && <Loader />
                                }
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={this.onCancel}>&times;</span>
                                </button>
                            </div>
                            {
                                hasShowDetails && isAWSInventory &&
                                <HostDetails
                                    hostDetails={viewDetails}
                                    showLoaderIcon={this.showLoaderIcon}
                                    loading={this.state.loading}
                                    onCancel={this.onCancel}
                                    getList={this.props.getList}
                                    isAutoDiscovery={true}
                                    onEditClick={onEditClick}
                                    isUnVerified={isUnVerified}
                                    // isFromHostView={isAWSInventory}
                                    handleSubmit={handleSubmit}
                                    onUpdateReset={this.props.onUpdateReset}
                                />
                            }
                            {
                                hasShowDetails && isAZUREInventory &&
                                <AZUREHostDetails
                                    hostDetails={viewDetails}
                                    showLoaderIcon={this.showLoaderIcon}
                                    loading={this.state.loading}
                                    onCancel={this.onCancel}
                                    onEditClick={onEditClick}
                                    isUnVerified={isUnVerified}
                                    // isFromHostView={isAZUREInventory}
                                    getList={this.props.getList}
                                    isAutoDiscovery={true}
                                    handleSubmit={handleSubmit}
                                    onUpdateReset={this.props.onUpdateReset}
                                />
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}


//  instanceId, hostname, privateIp, publicIp, projectId, sandboxAccountId
function mapStateToProps(state) {
    return {
        userId: state.current_user.payload.userId,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures.featureIds ? state.clientUserFeatures.featureIds.HostInventoryvault : "",
        getTypeList: state.getTypeList,
        getRegionAWS: state.getRegionAWS,
        getEnvList: state.getEnvList,
        getOsList: state.getOsList,
        getRegionAzure: state.getRegionAzure,
        clientUsers: state.clientUsers
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        failureToast,
        successToast,
        generateToken,
        awsCurrentState,
        azureCurrentState
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HOSTVIEW);
