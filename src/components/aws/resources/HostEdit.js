import React from "react";
import { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    fetchHostDetails, updateAWSHost, getUserForHost
} from "../../../actions/hostInventory/awsHostInventoryMain";
// import { fetchChangeUsers } from "../../actions/changeRegister/changeRegisterMain";
import { generateToken } from "../../../actions/commons/commonActions";
import _ from 'lodash';
import moment from "moment";
import { Tabs, Tab, } from 'react-bootstrap';
import { failureToast, successToast } from "../../../actions/commons/toaster";
import { viewProjectDetails } from "../../../actions/projects";
import Select from 'react-select';
import Loader from "../../resources/Loader";
import $ from "jquery";
import MultiSelect from "react-multi-select-component";

class HostEditPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clientId: this.props.clientId,
            userId: this.props.userId,
            featureId: this.props.featureId,
            userId: sessionStorage.getItem("userId"),
            hostInventoryId: this.props.hostDetails.hostInventoryId,
            fromDate: this.props.hostDetails.startDate,
            endDate: this.props.hostDetails.stopDate,
            startHours: this.props.hostDetails.startHours,
            stopHours: this.props.hostDetails.stopHours,
            isProjectLinked: this.props.hostDetails.isProjectLinked,
            isHostAutoSchedule: this.props.hostDetails.isHostAutoSchedule,
            userOptions: [],
            userList: [],
            stopHour: "",
            startHour: "",
            startDate: "",
            stopDate: "",
            hasUsersChanged: false,
            autoStartStopSchedularPriority: this.props.hostDetails.autoStartStopSchedularPriority,
            isLoading: false,
            hostId: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.userClicked = this.userClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClickAutoSchedulerEnable = this.onClickAutoSchedulerEnable.bind(this);
    }

    setDates() {
        const { startDate, stopDate, startHours, stopHours, startMins, stopMins } = this.props.hostDetails;
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

    async componentDidMount() {
        try {
            const { clientId, userId, generateToken, failureToast, viewProjectDetails, hostDetails } = this.props;
            const { projectId, hostInventoryId } = hostDetails || {};
            const { generateToken: token } = await generateToken();
            await viewProjectDetails(projectId, userId, token);
            this.getUsers();
            this.setDates();
            if (!this.props.isAutoDiscovery) {
                const { generateToken: apiToken } = await generateToken();
                const reqPayload = { clientId, userId, apiToken, hostInventoryId };
                this.getUsersOfHost(reqPayload);
            }
        } catch (error) {
            this.props.failureToast(error.message);
        }
    }

    componentDidUpdate() {
        const { userList, hasUsersChanged } = this.state;
        const { getUserForHostData } = this.props;
        if (Array.isArray(userList) && Array.isArray(getUserForHostData) && getUserForHostData.length && !userList.length && !hasUsersChanged) {
            this.getUsers();
        }
    }

    getUsers() {
        const { getUserForHostData } = this.props;
        let userList = Array.isArray(getUserForHostData) && getUserForHostData.map(x => ({
            'value': x.userId,
            'label': x.name,
        }));

        let list = Array.isArray(getUserForHostData) && getUserForHostData.map(x => x.isPermission && ({
            'value': x.userId,
            'label': x.name,
        }));
        const userOptions = Array.isArray(userList) && userList.filter(x => x) || [];
        const selecUsers = Array.isArray(list) && list.filter(x => x) || [];
        this.setState({ userOptions, userList: selecUsers });
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
        const { onUpdateReset, failureToast, successToast, showLoaderIcon = () => { }, catchBlock, updateAWSHost, onCancel = () => { } } = this.props;
        const {
            hostId, type, os, serverType, instanceId, region, description, fqdn, publicIp, privateIp, versionFlavor, buildKernel, username, password, port, env, hostname, hosting,
            monitoring, dms, backup, volumeExceptions, primaryOwner, secondaryOwner, tags, comments, startDate, stopDate, startHours, stopHours, userList, isHostAutoSchedule, autoStartStopSchedularPriority
            , status, diskInformation, memory, numberOfCpu, availabilityZone, instanceDetails, approver } = this.state;
        const startHour = startHours ? startHours.split(':') : undefined;
        const stopHour = stopHours ? stopHours.split(':') : undefined;
        var data = {
            hostId, type, os, serverType, instanceId, region, description, fqdn, publicIp, privateIp, versionFlavor, buildKernel, username, password, port, env, hostname, hosting,
            monitoring, dms, backup, volumeExceptions, primaryOwner, secondaryOwner, tags, comments, isHostAutoSchedule,
            startDate: startDate ? `${startDate}T00:00:00.000Z` : undefined,
            stopDate: stopDate ? `${stopDate}T23:59:59.000Z` : undefined,
            startHours: startHour ? startHour[0] : undefined,
            startMins: startHour ? startHour[1] : undefined,
            stopMins: stopHour ? stopHour[1] : undefined,
            stopHours: stopHour ? stopHour[0] : undefined,
            autoStartStopSchedularPriority: autoStartStopSchedularPriority ? autoStartStopSchedularPriority : undefined,
            status, diskInformation, memory, numberOfCpu, availabilityZone, instanceDetails,
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
        if (data.startDate === this.props.hostDetails.startDate) {
            delete data.startDate;
        }
        if (data.stopDate === this.props.hostDetails.stopDate) {
            delete data.stopDate;
        }
        const selectedUsers = Array.isArray(userList) && userList.map(member => member.value);
        const { isProjectLinked } = this.props.hostDetails;
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
                upkey[key] = data[key];
            }
        });
        const { generateToken } = await this.props.generateToken();
        var tempReq = {
            apiToken: generateToken,
            userId: this.props.userId,
            clientId: this.props.clientId,
            featureId: this.props.featureId,
            hostInventoryId: this.state.hostInventoryId,
            updateKeys: upkey
        }
        showLoaderIcon(true);
        updateAWSHost && updateAWSHost(tempReq)
            .then((res) => {
                this.setState({ isLoading: false });
                const { status, message: text } = res.data;
                if (status === 200) {
                    const message = typeof text === "string" ? text : "Successfully";
                    successToast(message);
                    return onUpdateReset();
                }
                const message = typeof text === "string" ? text : "Something went wrong!";
                failureToast(message);
                showLoaderIcon(false);
            }).catch(catchBlock);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    userClicked = (e) => {
        e.preventDefault();
    }

    onUserSelect = (selectedUsers) => {
        this.setState({
            userList: selectedUsers,
            hasUsersChanged: true
        });
    }


    async getUsersOfHost(reqPayload) {
        const { getUserForHost, failureToast } = this.props;
        reqPayload.accessPlatform = "1";
        await getUserForHost && getUserForHost(reqPayload)
            .then(res => {
                const { status, message } = res.data;
                if (status !== 200) {
                    return failureToast(message);
                }
            });
    }

    render() {
        const { userOptions, userList, isProjectLinked, isHostAutoSchedule, autoStartStopSchedularPriority, isLoading } = this.state;
        const hasUsersNotExist = (!Array.isArray(userList) || Array.isArray(userList) && !userList.length);
        const { startDate, stopDate, startHours, stopHours } = this.state || {};
        const { hostDetails, viewProjectDetailsData } = this.props;
        const { startDate: ProjectStartDate, endDate: ProjectEndDate } = viewProjectDetailsData || {};
        const ProjMinDate = ProjectStartDate ? ProjectStartDate.split('T')[0] : "";
        const ProjMaxDate = ProjectEndDate ? ProjectEndDate.split('T')[0] : "";
        const { hostId, type, serverType, os, instanceId, description, fqdn, publicIp, privateIp, versionFlavor,
            buildKernel, username, password, env, port, hostname, region, hosting, monitoring, backup, diskInformation, memory, status,
            instanceDetails, numberOfCpu, volumeExceptions, tags, primaryOwner, secondaryOwner, comments, availabilityZone, dms } = this.state;
        const onSubmit = this.handleSubmit;
        return (
            <div style={{ width: '100%', padding: '5px' }} id='inventory'>
                <Loader loading={isLoading} />
                <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                    <Tab eventKey={1} title="Host Info">
                        <form >
                            <div className="row" style={{ marginLeft: '5px', width: '97%' }}>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Host ID:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="hostId" name="hostId"
                                        onChange={this.handleChange} value={hostId || hostDetails.hostId} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType"
                                        className="col-form-label">Cloud Providers:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={env || hostDetails.env} name="env" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.env ? true : false}>Select</option>
                                        {
                                            Array.isArray(this.props.getEnvList) &&
                                            this.props.getEnvList.map((data) =>
                                                <option key={data.id} value={data.id}>{data.env}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType"
                                        className="col-form-label">Server Type:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={type || hostDetails.type} name="type" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.type ? true : false}>Select</option>
                                        {
                                            Array.isArray(this.props.getTypeList) && this.props.getTypeList.map((data) =>
                                                <option key={data.id} value={data.id}>{data.type}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType"
                                        className="col-form-label">Operating System:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={os || hostDetails.os} name="os" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.os ? true : false}>Select</option>
                                        {
                                            Array.isArray(this.props.getOsList) &&
                                            this.props.getOsList.map((data) =>
                                                <option key={data.id} value={data.id}>{data.os}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Instance ID:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="instanceId" name="instanceId"
                                        onChange={this.handleChange} value={instanceId || hostDetails.instanceId} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Host Description:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="description" name="description"
                                        onChange={this.handleChange} value={description || hostDetails.description} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">FQDN:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="fqdn" name="fqdn"
                                        onChange={this.handleChange} value={fqdn || hostDetails.fqdn} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Public IP Address:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="publicIp" name="publicIp"
                                        onChange={this.handleChange} value={publicIp || hostDetails.publicIp} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Private IP Address:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" id="privateIp" name="privateIp"
                                        onChange={this.handleChange} value={privateIp || hostDetails.privateIp} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Windows/Linux Version:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" name="versionFlavor"
                                        onChange={this.handleChange} value={versionFlavor || hostDetails.versionFlavor} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Windows Build No/Kernel Version:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input" name="buildKernel"
                                        onChange={this.handleChange} value={buildKernel || hostDetails.buildKernel} />
                                </div>
                                {/* <h4>Connection Information</h4>
								<hr /> */}
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">UserName:</label>
                                    <input type="text" className="form-control no-border modal-input-height bg-color-input"
                                        name="username"
                                        onChange={this.handleChange} value={username || hostDetails.username} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Password:</label>
                                    <input type="password" name="password" className="form-control no-border modal-input-height bg-color-input" style={{
                                        padding: "0.375rem 0.75rem",
                                        border: "1px solid #ced4da"
                                    }}
                                        onChange={this.handleChange} value={password || hostDetails.password} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">SSH/RDP PORT:</label>
                                    <input type="text" name="port" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={port || hostDetails.port} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType"
                                        className="col-form-label">Environment:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={serverType || hostDetails.serverType} name="serverType" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.serverType ? true : false}>Select</option>
                                        <option value="Prod">Production</option>
                                        <option value="Non-Prod">Non-Production</option>
                                        <option value="Appliance">Appliance</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Host Name:</label>
                                    <input type="text" name="hostname" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={hostname || hostDetails.hostname} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType"
                                        className="col-form-label">Region:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={region || hostDetails.region} name="region" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.region ? true : false}>Select</option>
                                        {
                                            Array.isArray(this.props.getRegionAWS) &&
                                            this.props.getRegionAWS.map((data) =>
                                                <option value={data.region} key={data.region}>{data.region}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-6" style={{
                                    display: hostDetails.approvalStatus === "APPROVED" ? 'none' : 'block'
                                }}>
                                    <label className="col-form-label">Approver:</label>
                                    <select name="approver" defaultValue={hostDetails.approver} onChange={this.handleChange}>
                                        <option value="" disabled={hostDetails.approver ? true : false}>Select Approver</option>
                                        {
                                            Array.isArray(this.props.clientUsers) && this.props.clientUsers.map((userObj) =>
                                                <option key={userObj.userId} value={userObj.userId}>{userObj.name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                {/* <div className="form-group col-md-6">
                                    <label className="col-form-label">Approvers:</label>
                                    <select name="approver" defaultValue={hostDetails.approver} onChange={this.handleChange}>
                                        <option value="" disabled={hostDetails.approver ? true : false}>Select Approver</option>
                                        {
                                            Array.isArray(clientUsers) && clientUsers.map((userObj) =>
                                                <option key={userObj.userId} value={userObj.userId}>{userObj.name}</option>
                                            )
                                        }
                                    </select>
                                </div> */}
                            </div>
                        </form>
                    </Tab>
                    <Tab eventKey={2} title="Other Info">
                        <form>
                            <div className="row" style={{ marginLeft: '6px', width: '97%' }}>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType" className="col-form-label">Hosting:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={hosting || hostDetails.hosting} name="hosting" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.hosting ? true : false}>Select</option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType" className="col-form-label">Monitoring:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={monitoring || hostDetails.monitoring} name="monitoring" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.monitoring ? true : false}>Select</option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType" className="col-form-label">DMS:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={dms || hostDetails.dms} name="dms" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.monitoring ? true : false}>Select</option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="accountType" className="col-form-label">Backup:</label>
                                    <select className="form-control no-border modal-input-height bg-color-input" value={backup || hostDetails.backup} name="backup" onChange={this.handleChange} >
                                        <option value="" disabled={hostDetails.monitoring ? true : false}>Select</option>
                                        <option value="Yes">YES</option>
                                        <option value="No">NO</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Disk Information(GB):</label>
                                    <input type="text" name="diskInformation" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={diskInformation || hostDetails.diskInformation} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Memory(GB):</label>
                                    <input type="text" name="memory" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={memory || hostDetails.memory} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Host Status:</label>
                                    <input type="text" name="status" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={status || hostDetails.status} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Available Zone:</label>
                                    <input type="text" name="availabilityZone" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={availabilityZone || hostDetails.availabilityZone} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Instance Details:</label>
                                    <input type="text" name="instanceDetails" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={instanceDetails || hostDetails.instanceDetails} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Number Of CPU:</label>
                                    <input type="text" name="numberOfCpu" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={numberOfCpu || hostDetails.numberOfCpu} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Volume Exceptions:</label>
                                    <input type="text" name="volumeExceptions" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={volumeExceptions || hostDetails.volumeExceptions} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Additional Tags:</label>
                                    <input type="text" name="tags" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={tags || hostDetails.tags} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Primary Owner:</label>
                                    <input type="text" name="primaryOwner" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={primaryOwner || hostDetails.primaryOwner} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Secondary Owner:</label>
                                    <input type="text" name="secondaryOwner" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={secondaryOwner || hostDetails.secondaryOwner} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="col-form-label">Comments:</label>
                                    <input type="text" name="comments" className="form-control no-border modal-input-height bg-color-input"
                                        onChange={this.handleChange} value={comments || hostDetails.comments} />
                                </div>
                                <div className="modal" id="userList" role="dialog" data-backdrop="static" data-keyboard="false">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Update AWS Host Users</h4>
                                            </div>
                                            <div className="modal-body">
                                                <Select
                                                    isMulti
                                                    onChange={this.onUserSelect}
                                                    defaultValue={userList}
                                                    value={userList}
                                                    options={userOptions}
                                                    placeholder="Select Users"
                                                />
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" className="btn btn-aws" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!isProjectLinked &&
                                    <Fragment>
                                        <div className="form_block flex-fill mb-3" style={{ marginTop: '15px', marginLeft: "15px" }}>
                                            <div style={{ marginTop: "1rem" }}>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="User List"
                                                        className="col-form-label">User List:</label>
                                                    <button className="btn btn-aws btn-info btn-sm" data-toggle="modal" data-target="#userList" style={{
                                                        float: "right", border: '1px solid #a47fea',
                                                        color: '#646363',
                                                        backgroundColor: ' #fff'
                                                    }}
                                                        onClick={this.userClicked.bind(this)}>Update User List</button>
                                                </div>
                                            </div>
                                            <div style={{ width: "100%", margin: "1rem 0.5rem" }}>
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
                                        <div className="modal-footer">
                                            <button className="save-btnn update-save" onClick={(e) => {
                                                e.preventDefault();
                                                onSubmit(hostDetails.hostInventoryId);
                                            }}>Submit</button>
                                        </div>
                                    </Fragment>
                                }
                            </div>
                        </form>
                    </Tab>
                    {isProjectLinked ?
                        <Tab eventKey={3} title="Project Info">
                            <form>
                                <div className="row" style={{ marginLeft: '8px', width: '97%' }}>
                                    <div className="form-group col-md-8">
                                        <label className="col-form-label">Please Select Schedule Priority:</label>

                                        <div class="form-check" style={{ marginTop: "10px" }}>
                                            <label class="form-check-label" style={{ width: "500px" }}>
                                                <input
                                                    type="radio"
                                                    class="form-check-input"
                                                    name="autoStartStopSchedularPriority"
                                                    value={"host"}
                                                    checked={autoStartStopSchedularPriority === "host"}
                                                    onChange={this.handleChange}
                                                />Host
  </label>
                                        </div>
                                        <div class="form-check">
                                            <label class="form-check-label" style={{ width: "500px" }}>
                                                <input
                                                    type="radio"
                                                    class="form-check-input"
                                                    name="autoStartStopSchedularPriority"
                                                    value={"account"}
                                                    checked={autoStartStopSchedularPriority === "account"}
                                                    onChange={this.handleChange}
                                                />Sandbox Account </label>
                                        </div>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <div>
                                            <input type="checkbox" id="isHostAutoSchedule" style={{ marginRight: "6px" }}
                                                name="isHostAutoSchedule" checked={isHostAutoSchedule ? true : false}
                                                onChange={this.onClickAutoSchedulerEnable} />
                                            <label className="col-form-label" style={{ display: 'inline-block' }}>Enable Auto Start/Stop</label>
                                        </div>
                                    </div>
                                    {
                                        isHostAutoSchedule &&
                                        <Fragment>
                                            <div className="form-group col-md-4">
                                                <label className="col-form-label">Start date:</label>
                                                <input type="date" name="startDate" className="form-control no-border modal-input-height bg-color-input" min={ProjMinDate} max={ProjMaxDate}
                                                    value={startDate} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label className="col-form-label">End date:</label>
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
                                                <label className="col-form-label">Start Hour:</label>
                                                <input type="text" name="startHours" placeholder="hh:mm" className="form-control no-border modal-input-height bg-color-input"
                                                    value={startHours} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label className="col-form-label">Stop Hour:</label>
                                                <input type="text" name="stopHours" placeholder="hh:mm" className="form-control no-border modal-input-height bg-color-input"
                                                    value={stopHours} onChange={this.handleChange} />
                                            </div>
                                        </Fragment>
                                    }
                                    <div className="modal" id="userListProjectInfo" role="dialog" data-backdrop="static" data-keyboard="false">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Update AWS Host Users</h4>
                                                </div>
                                                <div className="modal-body">
                                                    <Select
                                                        isMulti
                                                        onChange={this.onUserSelect}
                                                        defaultValue={userList}
                                                        value={userList}
                                                        options={userOptions}
                                                        placeholder="Select Users"
                                                    />
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" className="btn btn-aws" onClick={() => {
                                                        $('#userListProjectInfo').modal('hide');
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
                                                <button className="btn btn-aws" data-toggle="modal" data-target="#userListProjectInfo" style={{ float: "right" }}
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
                                        onSubmit(hostDetails.hostInventoryId);
                                    }}>Submit</button>
                                </div>
                            </form>
                        </Tab> : ""}
                </Tabs>
            </div>
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
        getTypeList: state.getTypeList,
        getRegionAWS: state.getRegionAWS,
        getEnvList: state.getEnvList,
        getOsList: state.getOsList,
        getUserForHostData: state.getUserForHost && Array.isArray(state.getUserForHost.data) ? state.getUserForHost.data : [],
        viewProjectDetailsData: Array.isArray(state.viewProjectDetails) && state.viewProjectDetails.length ? state.viewProjectDetails[0] : {},
        clientUsers: state.clientUsers
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchHostDetails,
        generateToken, failureToast, successToast, updateAWSHost, viewProjectDetails, getUserForHost
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(HostEditPage)