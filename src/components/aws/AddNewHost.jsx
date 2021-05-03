import React, { Component, Fragment } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import { sandboxAccountsByProject } from "../../actions/projects";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { generateToken } from "../../actions/commons/commonActions";
import { failureToast, infoToast } from "../../actions/commons/toaster";
import moment from 'moment';
import $ from "jquery";
let hosting = ["Yes", "No"];
let monitoring = ["Yes", "No"];
let dms = ["Yes", "No"];
let backup = ["Yes", "No"];



class HostAddWizard extends Component {

    constructor(props) {
        super(props);
        this.onCheckLinkProject = this.onCheckLinkProject.bind(this);
        this.onClickAutoSchedulerEnable = this.onClickAutoSchedulerEnable.bind(this);
        this.onProjectChange = this.onProjectChange.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
        this.validationForHours = this.validationForHours.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            selectedEventKey: 1,
            userList: [],
            selectedUserList: [],
            isProjectLinked: false,
            isHostAutoSchedule: false,
            stopHour: "",
            startHour: "",
            startDate: "",
            stopDate: "",
            projectId: "",
            sandboxAccountId: ""
        };
        this.props.onAddSubmit(this);
        this.useroptions = Array.isArray(props.clientUsers) && props.clientUsers.map(user => ({ label: user.name, value: user.userId }));
    }


    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    // componentDidMount() {
    //     const { clientUsers } = this.props;
    //     let useroptions = Array.isArray(clientUsers) && clientUsers.map(user => ({ label: user.name, value: user.userId }));

    // }
    // async componentDidMount() {
    //     const { getProjectList, clientId, failureToast, showLoaderIcon, userId } = this.props;
    //     const { generateToken } = await this.props.generateToken();
    //     getProjectList(clientId, userId, generateToken)
    //         .then(res => {
    //             if (res.data) {
    //                 const { message, status } = res.data;
    //                 if (status !== 200) {
    //                     const text = typeof message === "string" ? message : "Something went wrong while getting projects";
    //                     failureToast(text);
    //                 }
    //             }
    //         });
    // }


    onCheckLinkProject(e) {
        const { name, checked } = e.target;
        this.setState({
            [name]: checked,
            projectId: "",
            sandboxAccountId: ""
        });
        if (!checked) {
            this.setState({
                isProjectLinked: false,
                isHostAutoSchedule: false,
                stopHour: "",
                startHour: "",
                startDate: "",
                stopDate: "",
                projectId: "",
                sandboxAccountId: ""
            });
        }
    }

    _onFocus() {
        const { getProjectListData, showLoaderIcon } = this.props;
        const { projectId } = this.state;
        // for setting start/stop dates;
        const projectList = Array.isArray(getProjectListData) && getProjectListData.map(item => item.projectId);
        const selectedIndex = Array.isArray(projectList) && projectList.indexOf(projectId);
        if (selectedIndex > -1) {
            const { startDate, endDate } = getProjectListData && getProjectListData[selectedIndex];
            if (startDate && endDate) {
                let min = startDate.split('T')[0];
                let max = endDate.split('T')[0];
                document.getElementById("startDate") && document.getElementById("startDate").setAttribute('min', min);
                document.getElementById("startDate") && document.getElementById("startDate").setAttribute('max', max);
                document.getElementById("startDate") && document.getElementById("startDate").setAttribute('placeholder', 'Start Date');
                document.getElementById("stopDate") && document.getElementById("stopDate").setAttribute('min', min);
                document.getElementById("stopDate") && document.getElementById("stopDate").setAttribute('max', max);
                document.getElementById("stopDate") && document.getElementById("stopDate").setAttribute('placeholder', 'Stop Date');
            }
        }
    }


    onClickAutoSchedulerEnable(e) {
        const { name, checked } = e.target;
        this.setState({
            [name]: checked,
            stopHour: "",
            startHour: "",
            startDate: "",
            stopDate: ""
        });
    }

    onProjectChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
            stopHour: "",
            startHour: "",
            startDate: "",
            stopDate: "",
            sandboxAccountId: ""
        });
        const { sandboxAccountsByProject, failureToast, showLoaderIcon, clientId, infoToast } = this.props;
        // 1 for aws type
        sandboxAccountsByProject(value, clientId, 1)
            .then(res => {
                const { status, message, data } = res.data;
                if (status !== 200) {
                    const text = typeof message === "string" ? message : "Something went wrong while listing sandbox accounts";
                    return failureToast(text);
                }
                if (status === 200 && (!Array.isArray(data) || Array.isArray(data) && !data.length)) {
                    infoToast('You do not have sandbox accounts for this project. Please create sandbox accounts!');
                }
            });
        // for setting start/stop dates;
        this._onFocus();
    }

    handleUserChange = (selectedUserList) => {
        const userList = selectedUserList.map(user => user.value);
        this.setState({
            userList,
            selectedUserList
        });
    }

    validationForHours() {
        const { failureToast } = this.props;
        const { stopHour, startHour, startDate, stopDate } = this.state;
        const start_Hour = startHour ? startHour.trim() : "";
        const end_Hour = stopHour ? stopHour.trim() : "";
        if (!startDate || !stopDate) {
            return failureToast('start/stop date is required');
        }
        if (startDate !== stopDate) {
            if (new Date(startDate) > new Date(stopDate)) {
                return failureToast('start date should be prior to end date');
            }
        }
        const validations = [
            { name: "start hour should be in hh:mm and ", boolean: !!start_Hour, value: start_Hour },
            { name: "stop hour should be in hh:mm and ", boolean: !!end_Hour, value: end_Hour }
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
            if (hasAllFields) {
                index += 1;
            }
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
        // if (hasAllFields && isSameDate && (Number(shh) >= Number(ehh))) {
        // 	return failureToast("stop hour has to be greater than start hour as minimum 1hr!");
        // }
        return hasAllFields;
    }

    onNextPage(selectedEventKey) {
        const { failureToast } = this.props;
        const { isProjectLinked, isHostAutoSchedule, projectId, sandboxAccountId, autoStartStopSchedularPriority } = this.state || {};
        if (isHostAutoSchedule && !this.validationForHours()) {
            return;
        };
        if (isProjectLinked && !projectId) {
            return failureToast('Please select the project!');
        }
        if (isProjectLinked && projectId && !sandboxAccountId) {
            return failureToast('Please select sandbox account!');
        }
        if (sandboxAccountId && !autoStartStopSchedularPriority) {
            return failureToast('Please select schedule priority!');
        }
        this.setState({ selectedEventKey });
    }

    handleSubmit() {
        const { approver, autoStartStopSchedularPriority, availabilityZone, comments, description, diskInformation, env, fqdn, hostId, hostname,
            instanceDetails, instanceId, isHostAutoSchedule, isProjectLinked, memory, numberOfCpu, os, primaryOwner, privateIp, projectId, publicIp, region, sandboxAccountId, secondaryOwner,
            serverType, startDate, startHour, status, stopDate, stopHour, tags, type, userList } = this.state;

        this.props.onSubmit && this.props.onSubmit({
            approver, autoStartStopSchedularPriority, availabilityZone, comments, description, diskInformation, env, fqdn, hostId, hostname,
            instanceDetails, instanceId, isHostAutoSchedule, isProjectLinked, memory, numberOfCpu, os, primaryOwner, privateIp, projectId: projectId ? projectId : undefined, publicIp, region, sandboxAccountId: sandboxAccountId ? sandboxAccountId : undefined, secondaryOwner,
            serverType, startDate: startDate ? startDate : undefined, startHour: startHour ? startHour : undefined, status, stopDate: stopDate ? stopDate : undefined, stopHour: stopHour ? stopHour : undefined, tags, type, userList
        });
    }


    render() {
        const { selectedEventKey, hostId, isProjectLinked, autoStartStopSchedularPriority, sandboxAccountId, isHostAutoSchedule, startDate, stopDate, stopHour, startHour, userList, selectedUserList } = this.state;
        const { getProjectListData, sandboxAccountsByProjectData } = this.props;
        const { diskInformation, memory, status, primaryOwner, secondaryOwner, privateKey, tags, numberOfCpu, availabilityZone, hostname, volumeExceptions, instanceDetails, comments } = this.state;
        return (
            <React.Fragment>
                <div style={{ width: '100%', padding: '4px' }}>
                    <Tabs activeKey={selectedEventKey} animation={false} variant="fill" onSelect={(selectedEventKey) => {
                        this.onNextPage(selectedEventKey);
                    }}>
                        <Tab eventKey={1} title="Host Info" id="hostInfoTab" style={{ marginLeft: '5px' }} tabClassName={`${selectedEventKey === 1 ? "plannedActivitytabName" : ""} tabClass_tab`}>
                            <form >
                                <div className="row pmm">
                                    <div className="form-group col-md-12">
                                        <div>
                                            <input type="checkbox" id="isProjectLinked" style={{ marginRight: "10px", width: 'unset' }}
                                                name="isProjectLinked" onChange={this.onCheckLinkProject} />
                                            <label className="col-form-label">Link to Project/Account</label>
                                        </div>
                                    </div>
                                    {
                                        isProjectLinked &&
                                        <React.Fragment>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">Select Project:</label>
                                                <select className="form-control no-border modal-input-height bg-color-input" name="projectId" onChange={this.onProjectChange} >
                                                    <option value="">Select Project</option>
                                                    {Array.isArray(getProjectListData) && getProjectListData.map((project) => {
                                                        if (project && project.projectName.trim()) {
                                                            return <option title={project.projectName} key={project.projectId} value={project.projectId}>{project.projectName}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">Select SandBox:</label>
                                                <select className="form-control no-border modal-input-height bg-color-input" name="sandboxAccountId" onChange={this.handleChange} >
                                                    <option value="">Select sandboxAccountId</option>
                                                    {Array.isArray(sandboxAccountsByProjectData) && sandboxAccountsByProjectData.map((sb) => {
                                                        if (sb.sandboxName && sb.sandboxName.trim()) {
                                                            return <option key={sb.sandboxId} value={sb.sandboxId}>{sb.sandboxName}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>

                                            {/* schedule priority  */}
                                            {
                                                sandboxAccountId &&
                                                <div className="form-group col-md-8">
                                                    <label className="col-form-label">Please Select Schedule Priority:</label>
                                                    <span style={{ margin: "20px" }}>
                                                        <input
                                                            type="radio"
                                                            name="autoStartStopSchedularPriority"
                                                            value={"host"}
                                                            checked={autoStartStopSchedularPriority === "host"}
                                                            onChange={this.handleChange}
                                                            style={{ width: 'unset' }}
                                                        />Host</span>
                                                    <span>
                                                        <input
                                                            type="radio"
                                                            name="autoStartStopSchedularPriority"
                                                            value={"account"}
                                                            checked={autoStartStopSchedularPriority === "account"}
                                                            onChange={this.handleChange}
                                                            style={{ width: 'unset' }}
                                                        />Sandbox Account</span>
                                                </div>
                                            }
                                            <div className="form-group col-md-12">
                                                <div>
                                                    <input type="checkbox" id="isHostAutoSchedule" style={{ marginRight: "10px", width: 'unset' }}
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
                                                        <input type="date" name="startDate" id="startDate" className="form-control no-border modal-input-height bg-color-input" /* min={ProjMinDate} max={ProjMaxDate} */
                                                            value={startDate} onChange={this.handleChange}
                                                            onFocus={this._onFocus}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label className="col-form-label">End date::</label>
                                                        <input type="date" name="stopDate" id="stopDate" className="form-control no-border modal-input-height bg-color-input" /* min={ProjMinDate} max={ProjMaxDate} */
                                                            value={stopDate} onChange={this.handleChange}
                                                            onFocus={this._onFocus}
                                                        />
                                                    </div>
                                                    <div className="row" style={{ marginTop: "30px", marginLeft: "18px", width: "100%" }}>
                                                        <details style={{ paddingLeft: '3px' }}>
                                                            <summary>Hours to be in <strong style={{ color: "red" }}>UTC</strong> 24 hours format</summary>
                                                            <p> - when you entering start/end hours need to be in UTC hours</p>
                                                        </details>
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label className="col-form-label">Start Hour::</label>
                                                        <input type="text" name="startHour" placeholder="hh:mm" className="form-control no-border modal-input-height bg-color-input"
                                                            value={startHour} onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label className="col-form-label">Stop Hour::</label>
                                                        <input type="text" name="stopHour" placeholder="hh:mm" className="form-control no-border modal-input-height bg-color-input"
                                                            value={stopHour} onChange={this.handleChange} />
                                                    </div>
                                                </Fragment>
                                            }
                                        </React.Fragment>
                                    }

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Host ID:</label>
                                        <input type="number" className=" no-border modal-input-height bg-color-input aws-text-box" id="hostId" name="hostId"
                                            onChange={this.handleChange} defaultValue={hostId} />
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Cloud Providers:</label>
                                        <select className="no-border modal-input-height bg-color-input aws-text-box" name="env" onChange={this.handleChange} >
                                            <option value="">Select</option>
                                            {
                                                Array.isArray(this.props.getEnvList) &&
                                                this.props.getEnvList.map((data) =>
                                                    <option key={data.id} value={data.id}>{data.env}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Environment:</label>
                                        <select className="no-border modal-input-height bg-color-input aws-text-box" name="serverType" onChange={this.handleChange} >
                                            <option value="">Select</option>
                                            <option value="Prod">Production</option>
                                            <option value="Non-Prod">Non-Production</option>
                                            <option value="Appliance">Appliance</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Region:</label>
                                        <select className="no-border modal-input-height bg-color-input aws-text-box" name="region" onChange={this.handleChange} >
                                            <option value="">Select</option>
                                            {
                                                Array.isArray(this.props.getRegionAWS) &&
                                                this.props.getRegionAWS.map((data) =>
                                                    <option value={data.region} key={data.region}>{data.region}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Server Type:</label>
                                        <select className="no-border modal-input-height bg-color-input aws-text-box" name="type" onChange={this.handleChange} >
                                        <option value="">Select</option>
                                            {
                                                Array.isArray(this.props.getTypeList) && this.props.getTypeList.map((data) =>
                                                    <option key={data.id} value={data.id}>{data.type}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Operating System:</label>
                                        <select className=" no-border modal-input-height bg-color-input aws-text-box" name="os" onChange={this.handleChange} >
                                            <option value="">Select</option>
                                            {
                                                Array.isArray(this.props.getOsList) &&
                                                this.props.getOsList.map((data) =>
                                                    <option key={data.id} value={data.id}>{data.os}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Instance ID:</label>
                                        <input type="text" className="no-border modal-input-height bg-color-input aws-text-box" id="instanceId" name="instanceId"
                                            onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Host Description:</label>
                                        <input type="text" className="no-border modal-input-height bg-color-input aws-text-box" id="description" name="description"
                                            onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">FQDN:</label>
                                        <input type="text" className="no-border modal-input-height bg-color-input aws-text-box" id="fqdn" name="fqdn"
                                            onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Public IP Address:</label>
                                        <input type="text" className="no-border modal-input-height bg-color-input aws-text-box" id="publicIp" name="publicIp"
                                            onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Private IP Address:</label>
                                        <input type="text" className="no-border modal-input-height bg-color-input aws-text-box" id="privateIp" name="privateIp"
                                            onChange={this.handleChange} />
                                    </div>
                                    {
                                        !isProjectLinked &&
                                        <Fragment>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">Windows/Linux Version:</label>
                                                <input type="text" className="no-border modal-input-height bg-color-input aws-text-box" name="versionFlavor"
                                                    onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label" title='Windows Build No/linux Kernel Version'>Windows Build No/Kernel Version:</label>
                                                <input type="text" className="no-border modal-input-height bg-color-input aws-text-box" name="buildKernel"
                                                    onChange={this.handleChange} />
                                            </div>
                                        </Fragment>
                                    }
                                    <div className="form-group col-md-6">
                                        <label
                                            className="col-form-label">Approver:</label>
                                        <select className="no-border modal-input-height bg-color-input aws-text-box" name="approver" onChange={this.handleChange} >
                                            <option value="">Select Approver</option>
                                            {

                                                Array.isArray(this.props.clientUsers) && this.props.clientUsers.map((userObj, k) =>
                                                    <option name="approver" title={userObj.name} key={userObj.userId} value={userObj.userId}>{userObj.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">User List:</label>
                                        <MultiSelect
                                            options={this.useroptions}
                                            value={selectedUserList}
                                            onChange={this.handleUserChange}
                                            labelledBy={"Select"}
                                            className="aws-text-box"
                                        />
                                    </div>
                                    {
                                        !isProjectLinked && <Fragment>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">UserName:</label>
                                                <input type="text" className="no-border modal-input-height bg-color-input aws-text-box" style={{ paddingBottom: '1rem' }}
                                                    name="username" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">Password:</label>
                                                <input type="password" name="password" className="no-border modal-input-height bg-color-input aws-text-box"

                                                    onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">SSH/RDP PORT:</label>
                                                <input type="text" name="port" className="no-border modal-input-height bg-color-input aws-text-box"
                                                    onChange={this.handleChange} />
                                            </div>
                                        </Fragment>
                                    }
                                </div>
                            </form>
                        </Tab>
                        <Tab eventKey={2} title="Other Info" id="otherInfoTab" style={{ marginLeft: '8px' }} tabClassName={`${selectedEventKey === 2 ? "plannedActivitytabName" : ""} tabClass_tab`} >
                            <form >
                                <div className="row pmm">
                                    {
                                        !isProjectLinked &&
                                        <Fragment>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">Hosting:</label>
                                                <select className="no-border modal-input-height bg-color-input aws-text-box" ref="hosting" name="hosting" onChange={this.handleChange} >
                                                    <option value="">Select Hosting</option>
                                                    {Array.isArray(hosting) && hosting.map((host, i) =>
                                                        <option name={host} key={i} value={host}>{host}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">Monitoring:</label>
                                                <select className="no-border modal-input-height bg-color-input aws-text-box" name="monitoring" onChange={this.handleChange} >
                                                    <option value="">Select Monitoring</option>
                                                    {Array.isArray(monitoring) && monitoring.map((host, i) =>
                                                        <option name={host} key={i} value={host}>{host}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">DMS:</label>
                                                <select className="no-border modal-input-height bg-color-input aws-text-box" name="dms" onChange={this.handleChange} >
                                                    <option value="">Select DMS</option>
                                                    {Array.isArray(dms) && dms.map((host, i) =>
                                                        <option name={host} key={i} value={host}>{host}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">Backup:</label>
                                                <select className="no-border modal-input-height bg-color-input aws-text-box" name="backup" onChange={this.handleChange} >
                                                    <option value="">Select Backup</option>
                                                    {Array.isArray(backup) && backup.map((host, i) =>
                                                        <option name={host} key={i} value={host}>{host}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label"> Private Key:</label>
                                                <input type="text" name="privateKey" className="no-border modal-input-height bg-color-input aws-text-box"
                                                    onChange={this.handleChange} value={privateKey} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label">Volume Exceptions (comma seperated):</label>
                                                <input type="text" name="volumeExceptions" className="no-border modal-input-height bg-color-input aws-text-box"
                                                    onChange={this.handleChange} value={volumeExceptions} />
                                            </div>
                                        </Fragment>
                                    }
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Disk Information(GB):</label>
                                        <input type="text" name="diskInformation" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={diskInformation} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Memory(GB):</label>
                                        <input type="text" name="memory" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={memory} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Host Status:</label>
                                        <input type="text" name="status" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={status} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Primary Owner:</label>
                                        <input type="text" name="primaryOwner" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={primaryOwner} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Secondary Owner:</label>
                                        <input type="text" name="secondaryOwner" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={secondaryOwner} />
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Additional Tags:</label>
                                        <input type="text" name="tags" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={tags} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Host Name:</label>
                                        <input type="text" name="hostname" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={hostname} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Available Zone:</label>
                                        <input type="text" name="availabilityZone" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={availabilityZone} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Number Of CPU:</label>
                                        <input type="text" name="numberOfCpu" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} defaultValue={numberOfCpu} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Instance Details:</label>
                                        <input type="text" name="instanceDetails" className="no-border modal-input-height bg-color-input aws-text-box"
                                            onChange={this.handleChange} value={instanceDetails} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="col-form-label">Comments:</label>
                                        <input type="text" name="comments" className="no-border modal-input-height bg-color-inputaws-text-box"
                                            onChange={this.handleChange} value={comments} />
                                    </div>
                                </div>
                            </form>

                        </Tab>
                    </Tabs >
                </div>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        getEnvList: state.getEnvList,
        getTypeList: state.getTypeList,
        getOsList: state.getOsList,
        getRegionAWS: state.getRegionAWS,
        userId: state.current_user.payload.userId,
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures.featureIds ? state.clientUserFeatures.featureIds.HostInventoryvault : "",
        clientUsers: state.clientUsers,
        awsWizard: state.form && state.form.awsWizard && state.form.awsWizard.values ? state.form.awsWizard.values : {},
        getProjectListData: state.getProjectList && Array.isArray(state.getProjectList.data) ? state.getProjectList.data : [],
        sandboxAccountsByProjectData: state.sandboxAccountsByProject && Array.isArray(state.sandboxAccountsByProject.data) ? state.sandboxAccountsByProject.data : []
    }
}

let mapDispatchToProps = (dispatch) => {
    let action = bindActionCreators({
        generateToken, failureToast,
        sandboxAccountsByProject,
        infoToast
    }, dispatch)
    return action
}

export default connect(mapStateToProps, mapDispatchToProps)(HostAddWizard);
