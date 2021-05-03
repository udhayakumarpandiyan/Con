import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import $ from 'jquery';
import './hostDetails.css';
import { deleteAzureHost } from "../../../actions/hostInventory/azureHostInventoryMain";
import { generateToken } from "../../../actions/commons/commonActions";
import { failureToast, successToast } from "../../../actions/commons/toaster";
import Loader from '../../resources/Loader';
import HostEditPage from './HostEdit';

class HostDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasShowEdit: false
        };
    }

    async deleteAzureHost(hostInventoryId, clientId) {
        const { onCancel = () => { }, getList = () => { }, showLoaderIcon = () => { }, failureToast, successToast, catchBlock, deleteAzureHost, userId } = this.props;
        const { generateToken } = await this.props.generateToken();
        let request = { hostInventoryId, clientId, userId, apiToken: generateToken };
        showLoaderIcon(true);
        deleteAzureHost && deleteAzureHost(request)
            .then((res) => {
                const { status, message } = res.data;
                if (status === 200) {
                    successToast("AWS Host Deleted!");
                    onCancel();
                    return getList();
                }
                const text = typeof message === "string" ? message : "Something went wrong!";
                failureToast(text);
                showLoaderIcon(false);
            });
    }


    actionButtons(hostInventoryId, clientId) {
        const { isUnVerified, isAutoDiscovery } = this.props;
        if (!isUnVerified) {
            return isAutoDiscovery ?
                <button type="button" className='edit edit-icon' style={{ marginLeft: '13px' }} onClick={this.onEditIconClick}>
                    <span className="edt"><i className="fa fa-edit"></i> Edit </span>
                </button>
                :
                <button type="button" className='edit delete-icon' style={{ marginLeft: '10px' }} onClick={this.deleteAzureHost.bind(this, hostInventoryId, clientId)}>
                    <span className="edt"><i className="fa fa-trash"></i> Delete </span>
                </button>
        }
    }

    onEditIconClick = () => this.setState({ hasShowEdit: true }, () => {
        $('#editHostDetails').modal('show');
    });

    renderEditPage = () => {
        const { handleSubmit } = this.props;
        return <div>
            {
                this.state.hasShowEdit &&
                <HostEditPage
                    hostDetails={this.props.hostDetails}
                    showLoaderIcon={this.props.showLoaderIcon}
                    onUpdateReset={this.props.onUpdateReset}
                />
            }

        </div>
    }

    render() {
        const { hostDetails = {}, loading } = this.props;
        return (
            <>
                <Loader loading={loading} />
                {
                    !this.state.hasShowEdit && <>
                        <div className="azure-details modal-body">
                            <div className="row">
                                {hostDetails?.approvalStatus === "APPROVED" &&
                                    <button type="button" className='edit edit-icon' style={{ marginLeft: '13px' }} onClick={this.onEditIconClick}>
                                        <span className="edt"><i className="fa fa-edit"></i> Edit </span>
                                    </button>}

                                {
                                    this.actionButtons(hostDetails.hostInventoryId, hostDetails.clientId)
                                }
                            </div>



                            <form onClick={e => e.preventDefault()} style={{ marginLeft: '10px' }}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>FQDN</label>
                                            <p> {hostDetails.fqdn} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Disk Information (GB)</label>
                                            <p> {hostDetails.diskInformation} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Secondary Owner</label>
                                            <p> {hostDetails.secondaryOwner} </p>
                                        </dl>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Instance ID</label>
                                            <p> {hostDetails.instanceId} </p>
                                        </dl>
                                    </div>
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Host Status</label>
                                            <p> {hostDetails.status} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Tags</label>
                                            <p> {hostDetails.tags} </p>
                                        </dl>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Public IP</label>
                                            <p> {hostDetails.publicIp} </p>
                                        </dl>
                                    </div>
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Memory (GB)</label>
                                            <p> {hostDetails.memory} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Project Name</label>
                                            <p> {hostDetails.projectName} </p>
                                        </dl>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Private IP</label>
                                            <p> {hostDetails.privateIp} </p>
                                        </dl>


                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Number Of CPU</label>
                                            <p> {hostDetails.numberOfCpu} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Account Name</label>
                                            <p> {hostDetails.sandboxName} </p>
                                        </dl>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Hosting</label>
                                            <p> {hostDetails.hosting} </p>
                                        </dl>
                                    </div>
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Instance Details</label>
                                            <p> {hostDetails.instanceDetails} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Schedule Priority</label>
                                            <p> {hostDetails.autoStartStopSchedularPriority} </p>
                                        </dl>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>DMS</label>
                                            <p> {hostDetails.dms} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Availability Zone</label>
                                            <p> {hostDetails.availabilityZone} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Start Date</label>
                                            <p> {hostDetails.startDate} </p>
                                        </dl>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Monitoring</label>
                                            <p> {hostDetails.monitoring} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>PrivateKey</label>
                                            <p> {hostDetails.privateKey} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Stop Date</label>
                                            <p> {hostDetails.stopDate} </p>
                                        </dl>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Backup</label>
                                            <p> {hostDetails.backup} </p>
                                        </dl>
                                    </div>
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Volume Exceptions</label>
                                            <p> {hostDetails.volumeExceptions} </p>
                                        </dl>
                                    </div>
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Start Hours</label>
                                            <p> {hostDetails.startHours}:{hostDetails.startMins} </p>
                                        </dl>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <dl>
                                            <label>Host Name</label>
                                            <p> {hostDetails.hostname} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Primary Owner</label>
                                            <p> {hostDetails.primaryOwner} </p>
                                        </dl>
                                    </div>

                                    <div className="col-md-4">
                                        <dl>
                                            <label>Stop Hours</label>
                                            <p> {hostDetails.stopHours}:{hostDetails.stopMins} </p>
                                        </dl>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                }
                <>
                    {
                        this.renderEditPage()
                    }
                </>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.current_user.payload.userId,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: (state.clientUserFeatures.featureIds) ? state.clientUserFeatures.featureIds.HostInventoryvault : ""
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        generateToken, failureToast, successToast,
        deleteAzureHost
    }, dispatch);
}

const Details = connect(mapStateToProps, mapDispatchToProps)(HostDetails);
export { Details as HostDetails };

