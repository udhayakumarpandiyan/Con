import React from "react";
import { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchAzureHostDetails, updateAzureHost } from "../../../actions/hostInventory/azureHostInventoryMain";
import { generateToken } from "../../../actions/commons/commonActions";
import _ from 'lodash';
import moment from "moment";
import { Tabs, Tab, } from 'react-bootstrap';
import { failureToast, successToast } from "../../../actions/commons/toaster";
import { viewProjectDetails } from "../../../actions/projects";
import Select from 'react-select';
import $ from "jquery";

class AzureHostEditPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clientId: this.props.clientId,
            featureId: this.props.featureId,
            hostInventoryId: this.props.azureHostDetails.hostInventoryId,
            isHostAutoSchedule: this.props.azureHostDetails.isHostAutoSchedule,
            userOptions: [],
            stopHour: "",
            startHour: "",
            startDate: "",
            stopDate: "",
            autoStartStopSchedularPriority: this.props.azureHostDetails.autoStartStopSchedularPriority
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.userClicked = this.userClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClickAutoSchedulerEnable = this.onClickAutoSchedulerEnable.bind(this);
    }

    async componentDidMount() {
        const { featureId, clientId, userId, generateToken, fetchAzureHostDetails, viewProjectDetails, failureToast } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const { hostInventoryId } = this.state;
        const reqPayload = { featureId, clientId, userId, apiToken, hostInventoryId };
        const self = this;
        fetchAzureHostDetails(reqPayload)
            .then(async (res) => {
                const { message, status, data } = res;
                self.setDates();
                if (status === 200) {
                    const { projectId } = Array.isArray(data) && data.length ? data[0] : {};
                    const { generateToken: token } = await generateToken();
                    return await viewProjectDetails(projectId, userId, token);
                }
                return failureToast(message);
            });
        this.getUsers();
    }

    setDates() {
        const { startDate, stopDate, startHours, stopHours, startMins, stopMins } = this.props.azureHostDetails;
        this.setState({
            startDate: startDate && startDate.split('T')[0] !== "1970-01-01" ? startDate.split('T')[0] : null,
            stopDate: stopDate && stopDate.split('T')[0] !== "1970-01-01" ? stopDate.split('T')[0] : null,
            startHours: startHours && `${startHours || "00"}:${startMins || "00"}`,
            stopHours: stopHours && `${stopHours || "00"}:${stopMins || "00"}`
        });
    }

    onClickAutoSchedulerEnable(e) {
        const { name, checked } = e.target;
        this.setState({
            [name]: checked,
            stopHours: "",
            startHours: "",
            startDate: "",
            stopDate: ""
        });
    }

    getUsers() {
        const { getUserForHost } = this.props;
        let userList = Array.isArray(getUserForHost) && getUserForHost.map(x => ({
            'value': x.userId,
            'label': x.name,
        }));
        let list = Array.isArray(getUserForHost) && getUserForHost.map(x => x.isPermission && ({
            'value': x.userId,
            'label': x.name,
        }));
        const userOptions = Array.isArray(userList) && userList.filter(x => x) || [];
        const selectUsers = Array.isArray(list) && list.filter(x => x) || [];
        this.setState({ userOptions, userList: selectUsers });
    }

    validationForHours() {
        const { failureToast } = this.props;
        const { stopHours, startHours, startDate, stopDate, isHostAutoSchedule } = this.state;
        const start_Hour = startHours ? startHours.trim() : "";
        const end_Hour = stopHours ? stopHours.trim() : "";
        if (isHostAutoSchedule) {
            if (!startDate) {
                return failureToast('please enter start date');
            }
            if (!stopDate) {
                return failureToast('please enter stop date');
            }
        }
        if (startDate !== stopDate) {
            if (new Date(startDate) > new Date(stopDate)) {
                return failureToast('start date should be prior to end date');
            }
        }
        const validations = [
            { name: "start hour", boolean: !!start_Hour, value: start_Hour },
            { name: "stop hour", boolean: !!end_Hour, value: end_Hour }
        ];
        let hasAllFields = true, index = 0;
        // for checking values must not empty
        while (index < validations.length) {
            if (!validations[index].boolean) {
                failureToast(`${validations[index].name} is required!`);
                hasAllFields = false;
                break;
            }
            if (!validations[index].value.includes(":")) {
                failureToast(`${validations[index].name} is should be in hh:mm format and numbers only !`);
                hasAllFields = false;
                break;
            }
            const [hh, mm] = validations[index].value.split(":");
            if (!Number(hh) && Number(hh) !== 0 || Number(hh) > 23 || !(hh.length === 2) || (Number(hh) !== 0 && !Number(hh))) {
                failureToast(`${validations[index].name} is should be in hh:mm format and numbers only!`);
                hasAllFields = false;
                break;
            }
            if (!Number(mm) && Number(mm) !== 0 || Number(mm) > 59 || !(mm.length === 2) || (Number(mm) !== 0 && !Number(mm))) {
                failureToast(`${validations[index].name} is should be in hh:mm format and numbers only!`);
                hasAllFields = false;
                break;
            }
            index = hasAllFields ? index + 1 : index;
        }
        const [shh] = start_Hour.split(":");
        const [ehh] = end_Hour.split(":");
        var greater = false;
        if ((Number(shh) > Number(ehh)) || (Number(ehh) > Number(shh))) {
            var greater = true;
        }
        const isSameDate = moment(startDate).format('YYYY-MM-DD') === moment(stopDate).format('YYYY-MM-DD');
        if (!greater && hasAllFields) {
            return failureToast("Diffrence between start and stop hour must be equal/grater than 1 hour");
        }
        return hasAllFields;
    }



    handleSubmit = async () => {
        const { onUpdateReset, catchBlock, successToast, failureToast, updateAzureHost } = this.props;
        const { generateToken: apiToken } = await this.props.generateToken();
        const { hostId, type, resourceGroup, serverType, os, region, vmName, hostname, fqdn, publicIp, privateIp, username, password, port,
            env, hosting, monitoring, dms, backup, primaryOwner, secondaryOwner, tags, comments, isHostAutoSchedule,
            startDate, stopDate, startHours, stopHours, userList, autoStartStopSchedularPriority
            , status, diskInformation, memory, numberOfCpu, instanceDetails, versionFlavor, approver } = this.state;
        const selectedUsers = Array.isArray(userList) && userList.map(member => member.value);
        const startHour = startHours ? startHours.split(':') : undefined;
        const stopHour = stopHours ? stopHours.split(':') : undefined;

        var data = {
            hostId, type, resourceGroup, serverType, os, region, vmName, hostname, fqdn, publicIp, privateIp, username, password, port,
            env, hosting, monitoring, dms, backup, primaryOwner, secondaryOwner, tags, comments, isHostAutoSchedule,
            startDate: startDate ? `${startDate}T00:00:00.000Z` : undefined,
            stopDate: stopDate ? `${stopDate}T23:59:59.000Z` : undefined,
            startHours: startHour ? startHour[0] : undefined,
            startMins: startHour ? startHour[1] : undefined,
            stopMins: stopHour ? stopHour[1] : undefined,
            stopHours: stopHour ? stopHour[0] : undefined,
            autoStartStopSchedularPriority: autoStartStopSchedularPriority ? autoStartStopSchedularPriority : undefined
            , status, diskInformation, memory, numberOfCpu, instanceDetails, versionFlavor,
            approver: approver ? approver : undefined
        };
        if (!isHostAutoSchedule) {
            data.startDate = "";
            data.stopDate = "";
            data.startHours = "";
            data.startMins = "";
            data.stopMins = "";
            data.stopHours = "";
        }
        //delete start/Stop Date if not updated
        if (data.startDate === this.props.azureHostDetails.startDate) {
            delete data.startDate;
        }
        if (data.stopDate === this.props.azureHostDetails.stopDate) {
            delete data.stopDate;
        }
        const { isProjectLinked } = this.props.azureHostDetails;
        data['userList'] = selectedUsers;
        data['isProjectLinked'] = isProjectLinked;
        if (!isProjectLinked && autoStartStopSchedularPriority) {
            delete data.autoStartStopSchedularPriority;
        }
        if (isProjectLinked && isHostAutoSchedule) {
            if (!this.validationForHours()) {
                return;
            }
        }

        let upkey = {};
        _.each(Object.keys(data), (key) => {
            if (data[key] && data[key] !== undefined) {
                upkey[key] = data[key]
            }
        });
        var tempReq = {
            apiToken: apiToken,
            userId: this.props.userId,
            clientId: this.props.clientId,
            featureId: this.props.featureId,
            hostInventoryId: this.state.hostInventoryId,
            updateKeys: upkey
        }
        updateAzureHost && updateAzureHost(tempReq)
            .then((res) => {
                const { status, message } = res.data;
                if (status === 200) {
                    successToast(message);
                    onUpdateReset();
                    return;
                }
                failureToast(message);
            }).catch(catchBlock);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onCancel = () => {
        this.props.onCancel();
    }

    userClicked = (e) => {
        e.preventDefault();
    }

    onUserSelect = (selectedUsers) => {
        this.setState({
            userList: selectedUsers
        });
    }

    render() {
        const { userOptions, userList, isHostAutoSchedule, autoStartStopSchedularPriority } = this.state;
        const hasUsersNotExist = (!Array.isArray(userList) || Array.isArray(userList) && !userList.length);
        const { startDate, stopDate, startHours, stopHours } = this.state || {};
        const { azureHostDetails, viewProjectDetailsData } = this.props;
        const { isProjectLinked } = azureHostDetails;
        const { startDate: ProjectStartDate, endDate: ProjectEndDate } = viewProjectDetailsData || {};
        const ProjMinDate = ProjectStartDate ? ProjectStartDate.split('T')[0] : "";
        const ProjMaxDate = ProjectEndDate ? ProjectEndDate.split('T')[0] : "";
        return (
            <div style={{ width: '100%', padding: '5px' }} id='inventory'>
                <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example"
                    ref={(div) => { this.showNewForm = div; }} >
                    <Tab eventKey={1} title="Host Info" tabClassName="plannedActivitytabName"
                        bsClass="tabClicked" style={{ padding: '0px' }}>
                        <form style={{ padding: '1rem' }}>
                            <div className="row pmm">
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Host ID:</label>
                                    <input type="number" className="form-control no-border modal-input-height bg-color-input" id="hostId" name="hostId"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.hostId} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label
                                        className="col-form-label">Host Type:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.type} name="type" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.type ? true : false}>Select</option>
                                        {
                                            Array.isArray(this.props.getTypeList) &&
                                            this.props.getTypeList.map((data) =>
                                                <option key={data.id} value={data.id}>{data.type}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label
                                        className="col-form-label">Operating System:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.os} name="os" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.os ? true : false}>Select</option>
                                        {
                                            Array.isArray(this.props.getOsList) &&
                                            this.props.getOsList.map((data) =>
                                                <option key={data.id} value={data.id}>{data.os}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label
                                        className="col-form-label">Environment:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.env} name="env" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.env ? true : false}>Select</option>
                                        {
                                            Array.isArray(this.props.getEnvList) &&
                                            this.props.getEnvList.map((data) =>
                                                <option key={data.id} value={data.id}>{data.env}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label
                                        className="col-form-label">Region:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.region} name="region" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.region ? true : false}>Select</option>
                                        {
                                            Array.isArray(this.props.getRegionAzure) &&
                                            this.props.getRegionAzure.map((data, index) =>
                                                <option key={index} value={data.region}>{data.region}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Resource Group:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="resourceGroup" name="resourceGroup"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.resourceGroup} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">VM Name:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="vmName" name="vmName"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.vmName} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Host Name:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="hostname" name="hostname"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.hostname} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">FQDN:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="fqdn" name="fqdn"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.fqdn} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Public IP Address:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="publicIp" name="publicIp"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.publicIp} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Private IP Address:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="privateIp" name="privateIp"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.privateIp} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">UserName:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="username" name="username"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.username} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Password:</label>
                                    <input type="password" className="form-control no-border modal-input-height bg-color-input" id="password" name="password"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.password} style={{
                                            padding: "0.375rem 0.75rem",
                                            border: "1px solid #ced4da"
                                        }} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">SSH/RDP PORT:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="port" name="port"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.port} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label
                                        className="col-form-label">Server Type:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.serverType} name="serverType" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.serverType ? true : false}>Select</option>
                                        <option value="Prod">Production</option>
                                        <option value="Non-Prod">Non-Production</option>
                                        <option value="Appliance">Appliance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group col-md-4" style={{
                                display: azureHostDetails.approvalStatus === "APPROVED" ? 'none' : 'block'
                            }}>
                                <label className="col-form-label">Approver:</label>
                                <select name="approver" defaultValue={azureHostDetails.approver} onChange={this.handleChange}>
                                    <option value="" disabled={azureHostDetails.approver ? true : false}>Select Approver</option>
                                    {
                                        Array.isArray(this.props.clientUsers) && this.props.clientUsers.map((userObj) =>
                                            <option key={userObj.userId} value={userObj.userId}>{userObj.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </form>
                    </Tab>
                    <Tab eventKey={2} title="Other Info" tabClassName="plannedActivitytabName" style={{ padding: '0px' }}>
                        <form style={{ padding: '1rem' }}>

                            <div className="row pmm">
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Hosting:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.hosting} name="hosting" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.hosting ? true : false}>Select</option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Monitoring:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.monitoring} name="monitoring" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.monitoring ? true : false}>Select</option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">DMS:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.dms} name="dms" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.dms ? true : false}>Select</option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Backup:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" defaultValue={azureHostDetails.backup} name="backup" onChange={this.handleChange} >
                                        <option value="" disabled={azureHostDetails.backup ? true : false}>Select</option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Primary Owner:</label>
                                    <input type="text" name="primaryOwner" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.primaryOwner} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Secondary Owner:</label>
                                    <input type="text" name="secondaryOwner" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.secondaryOwner} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Comments:</label>
                                    <input type="text" name="comments" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.comments} />
                                </div>

                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Disk Information(GB):</label>
                                    <input type="text" name="diskInformation" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.diskInformation} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Memory(GB):</label>
                                    <input type="text" name="memory" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.memory} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Host Status:</label>
                                    <input type="text" name="status" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.status} />
                                </div>

                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Instance Details:</label>
                                    <input type="text" name="instanceDetails" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.instanceDetails} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Number Of CPU:</label>
                                    <input type="text" name="numberOfCpu" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.numberOfCpu} />
                                </div>

                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Windows/Linux:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" name="versionFlavor"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.versionFlavor} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Additional Tags:</label>
                                    <input type="text" name="tags" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} defaultValue={azureHostDetails.tags} />
                                </div>
                                <div className="modal" id="userList" role="dialog" data-backdrop="static" data-keyboard="false">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Update AZURE Host Users</h4>
                                            </div>
                                            <div className="modal-body">
                                                {/* <li className="clear w-50" style={{ "textAlign": "left", ...border }}> */}
                                                <Select
                                                    isMulti
                                                    onChange={this.onUserSelect}
                                                    defaultValue={userList}
                                                    value={userList}
                                                    options={userOptions}
                                                    placeholder="Select Users"
                                                />
                                                {/* </li> */}
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" className="btn" onClick={() => {
                                                    $('#userList').modal('hide');
                                                }} style={{ border: '1px solid #d7d6d6' }}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    !isProjectLinked &&
                                    <Fragment>
                                        <ul>
                                            <li class="clear form_3col need_rt_border" style={{ width: "100%", marginTop: "0.5rem", marginBottom: "0.3rem" }}>
                                                <label style={{ fontWeight: "600", fontSize: "14px", color: "rgb(54, 53, 53)", top: "3px" }}>User List</label>
                                                <button className="btn btn-info btn-sm" data-toggle="modal" data-target="#userList"
                                                    style={{
                                                        float: "right", border: '1px solid #a47fea',
                                                        color: '#646363',
                                                        backgroundColor: ' #fff'
                                                    }}
                                                    onClick={this.userClicked.bind(this)}>Update User List</button>
                                            </li>
                                            <li style={{ width: "100%" }}>
                                                <div className="updateUsersData" style={{
                                                    maxWidth: "100%",
                                                    display: "block",
                                                    maxInlineSize: hasUsersNotExist ? "none" : "fit-content"
                                                }}>
                                                    {
                                                        Array.isArray(userList) && userList.map(item =>
                                                            <div className="dataTag">{item.label}</div>
                                                        )
                                                    }
                                                    {
                                                        hasUsersNotExist &&
                                                        <div>No Users assigned</div>
                                                    }
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="modal-footer">
                                            <button className="save-btnn update-save" onClick={(e) => {
                                                e.preventDefault();
                                                this.handleSubmit(azureHostDetails.hostInventoryId);
                                            }}>Submit</button>
                                        </div>
                                    </Fragment>
                                }
                            </div>
                        </form>
                    </Tab>
                    {
                        isProjectLinked ?
                            <Tab eventKey={3} title="Project Info" tabClassName="plannedActivitytabName" style={{ padding: '0px', background: "#ffffff" }}>
                                <form style={{ padding: '1rem' }}>
                                    <div className="row pmm">
                                        <div className="form-group col-md-8">
                                            <label className="col-form-label">Please Select Schedule Priority:</label>
                                            <div className='d-flex'>
                                                <div style={{ width: '40%' }}>Host</div>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="autoStartStopSchedularPriority"
                                                        value={"host"}
                                                        checked={autoStartStopSchedularPriority === "host"}
                                                        onChange={this.handleChange}
                                                        style={{ width: '1rem' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='d-flex'>
                                                <div style={{ width: '40%' }}>Sandbox Account</div>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="autoStartStopSchedularPriority"
                                                        value={"account"}
                                                        checked={autoStartStopSchedularPriority === "account"}
                                                        onChange={this.handleChange}
                                                        style={{ width: '1rem' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-12">
                                            <div>
                                                <input type="checkbox" id="isHostAutoSchedule" style={{ marginRight: "10px" }}
                                                    name="isHostAutoSchedule" checked={isHostAutoSchedule ? true : false}
                                                    onChange={this.onClickAutoSchedulerEnable} />
                                                <label className="col-form-label">Enable Auto Start/Stop</label>
                                            </div>
                                        </div>

                                        {
                                            isHostAutoSchedule &&
                                            <Fragment>
                                                <div className="form-group col-md-4">
                                                    <label className="col-form-label">Start date::</label>
                                                    <input type="date" name="startDate" className="form-control no-border modal-input-height bg-color-input" min={ProjMinDate} max={ProjMaxDate}
                                                        value={startDate} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label className="col-form-label">End date::</label>
                                                    <input type="date" name="stopDate" className="form-control no-border modal-input-height bg-color-input" min={ProjMinDate} max={ProjMaxDate}
                                                        value={stopDate} onChange={this.handleChange} />
                                                </div>
                                                <div className="row" style={{ marginTop: "30px", marginLeft: "18px", width: "100%" }}>
                                                    <details style={{ paddingLeft: '3px' }}>
                                                        <summary>Hours to be in <strong style={{ color: "red" }}>UTC</strong> 24 hours format</summary>
                                                        <p> - when you entering start/end hours need to be in UTC hours</p>
                                                    </details>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label className="col-form-label">Start Hour::</label>
                                                    <input type="text" name="startHours" placeholder="hh:mm" className="form-control no-border modal-input-height bg-color-input"
                                                        value={startHours} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label className="col-form-label">Stop Hour::</label>
                                                    <input type="text" name="stopHours" placeholder="hh:mm" className="form-control no-border modal-input-height bg-color-input"
                                                        value={stopHours} onChange={this.handleChange} />
                                                </div>

                                            </Fragment>
                                        }
                                        <div className="modal" id="userListProjectInfo" role="dialog" data-backdrop="static" data-keyboard="false">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Update AZURE Host Users</h4>
                                                    </div>
                                                    <div className="modal-body">
                                                        {/* <li className="clear w-50" style={{ "textAlign": "left", ...border }}> */}
                                                        <Select
                                                            isMulti
                                                            onChange={this.onUserSelect}
                                                            defaultValue={userList}
                                                            value={userList}
                                                            options={userOptions}
                                                            placeholder="Select Users"
                                                        />
                                                        {/* </li> */}
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" className="btn" onClick={() => {
                                                            $('#userListProjectInfo').modal('hide')
                                                        }} style={{ border: '1px solid #d7d6d6' }}>Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_block flex-fill mb-3" style={{ width: '100%', marginTop: '15px', marginLeft: "15px" }}>
                                            <div style={{ marginTop: "1rem" }}>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="User List"
                                                        className="col-form-label">User List:</label>
                                                    <button className="btn btn-info btn-sm" data-toggle="modal" data-target="#userListProjectInfo" style={{
                                                        float: "right", border: '1px solid #a47fea',
                                                        color: '#646363',
                                                        backgroundColor: ' #fff'
                                                    }}
                                                        onClick={this.userClicked.bind(this)}>Update User List</button>
                                                </div>
                                            </div>
                                            <div style={{ margin: "1rem 0.5rem" }}>
                                                <div className="updateUsersData" style={{
                                                    maxWidth: "100%",
                                                    display: "block",
                                                    maxInlineSize: hasUsersNotExist ? "none" : "fit-content"
                                                }}>
                                                    {
                                                        Array.isArray(userList) && userList.map(item =>
                                                            <div className="dataTag">{item.label}</div>
                                                        )
                                                    }
                                                    {
                                                        hasUsersNotExist &&
                                                        <div>No Users assigned</div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button className="save-btnn update-save" onClick={(e) => {
                                            e.preventDefault();
                                            this.handleSubmit(azureHostDetails.hostInventoryId);
                                        }}>Submit</button>
                                    </div>
                                </form>
                            </Tab> : ""}
                </Tabs>
            </div >
        )
    }
}

function mapStateToProps(state) {
    return {
        userName: state.current_user.payload.userName,
        userId: state.current_user.payload.userId,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: (state.clientUserFeatures.featureIds) ? state.clientUserFeatures.featureIds.HostInventoryvault : "",
        hostClients: state.hostClients,
        getRegionAzure: state.getRegionAzure,
        getTypeList: state.getTypeList,
        getEnvList: state.getEnvList,
        getOsList: state.getOsList,
        azureHostDetails: state.azureHostDetails,
        getUserForHost: state.getUserForHost && Array.isArray(state.getUserForHost.data) ? state.getUserForHost.data : [],
        viewProjectDetailsData: Array.isArray(state.viewProjectDetails) && state.viewProjectDetails.length ? state.viewProjectDetails[0] : {},
        clientUsers: state.clientUsers,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        failureToast, successToast,
        fetchAzureHostDetails, generateToken, updateAzureHost, viewProjectDetails
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AzureHostEditPage);