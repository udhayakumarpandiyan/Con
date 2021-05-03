import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import { bindActionCreators } from "redux";
import queryString from "query-string";
import $ from "jquery";
import './resources/page.css';
import EditDetails from './resources/EditDetails';
import { masterApiUrls, userApiUrls } from "../../util/apiManager";
import {
    copyActivity, obsoleteActivity, getActivityDetails, submitActivity,
    saveActivityDetails, deletePATask, deletePARollback, initiateRollback,
    unsuccessFullActivity, completeActivity, updateTicket, getAutomationTemplates, updatePATask, updatePARollBack,
    onLunchTemplate, approvalActivity
} from "../../actions/plannedActivity/activity";
import { generateToken } from "../../actions/commons/commonActions";
import { successToast, failureToast, infoToast } from "../../actions/commons/toaster";
import AddTask from './resources/AddTask';
import EditPlanDetails from './resources/EditPlanDetails';
import EditTaskDetails from './resources/EditTaskDetails';
import AutomationTemplates from './resources/AutomationTemplates';
import Loader from '../resources/Loader';
/* jobs start */
import { TemplateList } from '../../screens/Template/TemplateList';
import { JobsAPI } from '../../api';
import { JOB_TYPE_URL_SEGMENTS } from '../../constants';
import JobOutput from '../../screens/Job/JobOutput';
import { WorkflowOutput } from '../../screens/Job/WorkflowOutput';
/* jobs end */
const steps = [{ name: 'Schedule Info', done: false, selected: true },
{ name: 'Activity Info', done: false, selected: false },
{ name: 'Activity Details', done: false, selected: false },
{ name: 'Activity Approval', done: false, selected: false }];

class ChangeRequestDetails extends Component {
    constructor(props) {
        super(props);
        let location = this.props.location;
        let query = queryString.parse(location.search);
        this.state = {
            selectedRequestClientId: query.clientId,
            featureId: query.featureId,
            activity: location.state,
            activityId: location.state.activityId,
            activityDetails: null,
            loading: false,
            editModalActivaTab: 0,
            approverList: [],
            userList: [],
            selectedTask: null,
            showEditPopup: false,
            step: 0,
            automationTemplates: null,
            closeTicketEnabled: false,
            hasShowTemplates: false,
            selectedDetailActivityId: '',
            selectedRollbackActivityId: '',
            existingTemplate: '',
            hasShowAutomationTemplates: false,
            currentJob: {},
            jobType: '',
            hasShowOutputWindow: false
        };
        this.getApprovers = this.getApprovers.bind(this);
    }
    componentDidMount() {
        this.props.getActivityDetails();
        this.getActivityDetails(this.state.activity);
        let parent = this;
        $("#editDetails").click(function () {
            parent.setState({ editModalActivaTab: 0, showEditPopup: true }, () => {
                $('#EditDetailsModal').modal('show');
            });
        });
        $("#editActivityInfo").click(function () {
            parent.setState({ editModalActivaTab: 1, showEditPopup: true }, () => {
                $('#EditDetailsModal').modal('show');
            });

        });
        $("#editActivityDetails").click(function () {
            parent.setState({ editModalActivaTab: 2, showEditPopup: true }, () => {
                $('#EditDetailsModal').modal('show');
            });

        });

        $("#addActivityPlan").click(function () {
            $('#AddTaskModal').modal('show');
        });
        $("#addRollbackPlan").click(function () {
            $('#AddTaskModal').modal('show');
        });
        $("#editActivityApproval").click(function () {
            parent.setState({ editModalActivaTab: 3, showEditPopup: true }, () => {
                $('#EditDetailsModal').modal('show');
            });

        });
        $("#editExecutionDetails").click(function () {
            $('#EditPlanDetailsModal').modal('show');

        });
        this.getUsersList();
    }
    showLoaderIcon = (loading) => {
        this.setState({ loading });
    }

    processClick = (id) => {

        if (id) {
            var i_id = document.getElementById(id);
            var final_id;

            if (id.includes("check")) {
                var ret = id.replace('check', '');
                final_id = ret;
            }

            else if (id.includes("cancel")) {
                var ret = id.replace('cancel', '');
                final_id = ret;
            }

            else {
                var ret = id.replace('exclam', '');
                final_id = ret;
            }

            var check_id = document.getElementById("check" + final_id + "Control");
            var cancel_id = document.getElementById("cancel" + final_id + "Control");
            var exclam_id = document.getElementById("exclam" + final_id + "Control");

            var check_icon = document.getElementById("check" + final_id + "icon");
            var cancel_icon = document.getElementById("cancel" + final_id + "icon");
            var exclam_icon = document.getElementById("exclam" + final_id + "icon");

            var uicon = document.getElementById("uicon" + final_id);



            if (id.includes("check")) {
                cancel_id.checked = false;
                exclam_id.checked = false;

                if ((check_id.checked == true)) {
                    check_icon.style.display = "none";
                    uicon.style.display = "block";
                }
                else {

                    check_icon.style.display = "block";
                    cancel_icon.style.display = "none";
                    exclam_icon.style.display = "none";
                    uicon.style.display = "none";

                }


            }

            if (id.includes("cancel")) {
                check_id.checked = false;
                exclam_id.checked = false;

                if ((cancel_id.checked == true)) {
                    cancel_icon.style.display = "none";
                    uicon.style.display = "block";
                }
                else {
                    check_icon.style.display = "none";
                    cancel_icon.style.display = "block";
                    exclam_icon.style.display = "none";
                    uicon.style.display = "none";

                }

            }

            if (id.includes("exclam")) {
                cancel_id.checked = false;
                check_id.checked = false;

                if ((exclam_id.checked == true)) {
                    exclam_icon.style.display = "none";
                    uicon.style.display = "block";
                }

                else {
                    check_icon.style.display = "none";
                    cancel_icon.style.display = "none";
                    exclam_icon.style.display = "block";
                    uicon.style.display = "none";

                }
            }
        }
    }

    getActivityDetails = (activity) => {
        try {
            this.props.generateToken().then((token) => {
                let data = {
                    activityId: activity && activity.activityId,
                    featureId: this.props.featureId,
                    clientId: this.props.clientId,
                    actionBy: this.props.userId,
                    apiToken: token.generateToken
                };

                this.props.getActivityDetails(data)
                    .then(res => {
                        this.showLoaderIcon(false);
                        if (res.activity.status !== 200) {
                            const message = typeof (res.activity.message) === "string" ? res.activity.message : "Something went wrong! Please try again!"
                            failureToast(message);
                        }
                        else {
                            this.setState({ activityDetails: res.activity })
                        }
                        this.setState({ loading: false });
                    })
                    .catch(() => {
                        this.showLoaderIcon(false);
                        //failureToast("Something went wrong while retrieving activity details !!");
                    });
            })
        }
        catch (error) {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while retrieving activity details!");
        }
    }


    handleSubmitActivity = () => {
        const { failureToast, successToast, activityDetails, userId } = this.props;
        const { activity, featureId } = this.state;

        let data = {
            activityId: activity && activity.activityId ? activity.activityId : "",
            actionBy: userId,
            status: activity && activity.status ? activity.status : "",
            approvers: activityDetails && activityDetails.ApproverActivity ? activityDetails.ApproverActivity : [],
            clientId: activity && activity ? activity.clientId : "",
            featureId: featureId ? featureId : ""
        }
        if (data.approvers.length < 1) {
            return failureToast("Approvers are required to submit activity");
        }
        if (data.approvers.some(x => x["approverMail"] == this.props.userMail)) {
            return failureToast("User is an approver. Can not submit activity");
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.submitActivity(data).then((res) => {
                if (res.submitPlanActivity.status !== 200) {
                    const message = res.submitPlanActivity && res.submitPlanActivity.message ? res.submitPlanActivity.message : "Something Went Wrong While Submiting Activity!"
                    this.showLoaderIcon(false);
                    return failureToast(message);
                }
                successToast("Change Request has been submitted successfully");
                this.getActivityDetails(this.state.activity);
            });
        }).catch((err) => {
            this.showLoaderIcon(false);
            const message = err && err.message ? err.message : "Something went wrong. Please try again!";
            failureToast(message);
        });
    }

    handleObsolete = () => {
        const { failureToast, successToast, userId } = this.props;
        const { activity, featureId } = this.state;
        let data = {
            activityId: activity && activity.activityId ? activity.activityId : "",
            userId: userId,
            clientId: activity && activity.clientId ? activity.clientId : "",
            featureId: featureId ? featureId : ""
        };

        this.props.generateToken().then((token) => {
            data.apiToken = token.generateToken;
            this.showLoaderIcon(true);
            this.props.obsoleteActivity(data)
                .then((res) => {
                    if (res.obsoletePlanActivity.status !== 200) {
                        this.showLoaderIcon(false);
                        const message = res.obsoletePlanActivity && res.obsoletePlanActivity.message || "Something went wrong while updating activity!";
                        return failureToast(message);
                    }
                    this.getActivityDetails(activity);
                    successToast("Planned activity has been obsolete successfully");
                });
        }).catch(() => {
            this.showLoaderIcon(false);
            return failureToast("Something went wrong while updating activity!");
        });
    }

    handleCopy = () => {
        const { failureToast, successToast, userId } = this.props;
        const { activity, featureId } = this.state;
        let data = {
            activityId: activity && activity.activityId ? activity.activityId : "",
            actionBy: userId,
            featureId: featureId ? featureId : "",
            clientId: activity && activity ? activity.clientId : "",
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.copyActivity(data)
                .then((res) => {
                    if (res.copyPlanActivity.status !== 200) {
                        this.showLoaderIcon(false);
                        const message = res.copyPlanActivity && res.copyPlanActivity.message ? res.copyPlanActivity.message : "Something Went Wrong While Cpoying Activity!";
                        return failureToast(message);
                    }
                    this.getActivityDetails(activity);
                    successToast("Planned activity has been copied successfully");
                });
        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something Went Wrong While Cpoying Activity!");
        });
    }
    handleSaveDetail = (activity, informationPageDetails) => {

        const { activityDetails, failureToast, successToast } = this.props;
        let data = {
            activityId: this.state.activityId,
            clientId: this.props.clientId,
            featureId: this.props.featureId,
            actionBy: this.props.userId,
            approverActivity: { save: [], update: [] },
            information: { save: {}, update: {} },
            detailActivity: { save: [], update: [] },
            rollbackActivity: { save: [], update: [] }
        };
        var activityData = {
            activity: activity ? activity.activity : undefined
        }

        //request formation for activity name
        if (activityData !== undefined && activityData.activity && activityData.activity.trim() === "") {
            return failureToast("activity name can not be empty");
        }
        if (activityData && activityData.activity !== activityDetails.activity) {
            data.activity = activityData.activity;
        }


        // request formation for approverActivity
        var approvers = [].concat(informationPageDetails.approvers);
        delete informationPageDetails.approvers;
        if (Array.isArray(approvers) && approvers.length) {
            approvers.forEach((obj, index) => {
                if (obj && !obj.approverActivityId && !obj.modified) {
                    delete obj.label;
                    delete obj.value;
                    obj['order'] = index + 1;
                    data.approverActivity.save.push(obj);
                }
                else if (obj && obj.approverActivityId && obj.modified) {
                    delete obj.stateName
                    delete obj.modified
                    let updateKeys = Object.assign({}, obj);
                    delete updateKeys.approverActivityId;
                    data.approverActivity.update.push({ approverActivityId: obj.approverActivityId, updatekeys: updateKeys });
                }
            });
        }

        // request formation for detail Activity
        if (informationPageDetails.detailActivity && Array.isArray(informationPageDetails.detailActivity)) {
            var detailActivities = [...informationPageDetails.detailActivity];
            delete informationPageDetails.detailActivity;
            if (detailActivities && Array.isArray(detailActivities)) {
                detailActivities.forEach((obj) => {
                    if (!obj.detailActivityId && !obj.modified) {
                        delete obj.name;
                        data.detailActivity.save.push(obj);
                    }
                    else if (obj.detailActivityId && obj.modified) {
                        delete obj.stateName
                        delete obj.modified
                        let updateKeys = Object.assign({}, obj);
                        delete updateKeys.detailActivityId;
                        data.detailActivity.update.push({ detailActivityId: obj.detailActivityId, updatekeys: updateKeys });
                    }
                })
            }
        }

        // request formation for rollback Activity
        if (informationPageDetails.rollbackActivity && Array.isArray(informationPageDetails.rollbackActivity)) {
            var rollbacks = [...informationPageDetails.rollbackActivity];
            delete informationPageDetails.rollbackActivity;

            if (Array.isArray(rollbacks)) {
                rollbacks.forEach((obj) => {
                    if (!obj.rollbackActivityId && !obj.modified) {
                        delete obj.name;
                        data.rollbackActivity.save.push(obj);
                    }
                    else if (obj.rollbackActivityId && obj.modified) {
                        delete obj.stateName
                        delete obj.modified
                        let updateKeys = Object.assign({}, obj);
                        delete updateKeys.rollbackActivityId;
                        data.rollbackActivity.update.push({ rollbackActivityId: obj.rollbackActivityId, updatekeys: updateKeys });
                    }
                })
            }
        }
        //request formation for information page

        if (activityDetails && activityDetails.Information && activityDetails.Information.length > 0 && activityDetails.Information[0].informationId) {
            data.information.update.informationId = activityDetails.Information[0].informationId;
            data.information.update.updatekeys = {};
            delete informationPageDetails.documents;
            delete informationPageDetails.fileName;
            delete informationPageDetails.detailActivity;
            delete informationPageDetails.rollbackActivity;
            Object.assign(data.information.update.updatekeys, informationPageDetails);
            if (localStorage.getItem("paAttachment") != null) {
                data.information.update.updatekeys.attachments = JSON.parse(localStorage.paAttachment);
            } else {
                data.information.update.updatekeys.attachments = [];
            }
        }
        else {
            if (informationPageDetails.detailActivity && informationPageDetails.detailActivity.length === 0) {
                delete informationPageDetails.detailActivity;
            }
            if (informationPageDetails.rollbackActivity && informationPageDetails.rollbackActivity.length === 0) {

                delete informationPageDetails.rollbackActivity;
            }
            Object.assign(data.information.save, informationPageDetails);
            if (localStorage.getItem("paAttachment") != null) {
                data.information.save.attachments = JSON.parse(localStorage.paAttachment);
            }
            else {
                data.information.save.attachments = []
            }
        }



        if ((data.detailActivity.save.length == 0) && (data.detailActivity.update.length == 0)) delete data.detailActivity;
        if (data.detailActivity && data.detailActivity.save.length < 1) delete data.detailActivity.save;
        if (data.detailActivity && data.detailActivity.update.length < 1) delete data.detailActivity.update;

        if ((data.rollbackActivity.save.length == 0) && (data.rollbackActivity.update.length == 0)) delete data.rollbackActivity;
        if (data.rollbackActivity && data.rollbackActivity.save.length < 1) delete data.rollbackActivity.save;
        if (data.rollbackActivity && data.rollbackActivity.update.length < 1) delete data.rollbackActivity.update;

        if ((data.approverActivity.save.length == 0) && (data.approverActivity.update.length == 0)) delete data.approverActivity;
        if (data.approverActivity && data.approverActivity.save.length < 1) delete data.approverActivity.save;
        if (data.approverActivity && data.approverActivity.update.length < 1) delete data.approverActivity.update;

        if ((Object.keys(data.information.save).length == 0) && (Object.keys(data.information.update).length == 0)) delete data.information;
        if (data.information && Object.keys(data.information.save).length == 0) delete data.information.save;
        if (data.information && Object.keys(data.information.update).length == 0) delete data.information.update;
        this.setState({ isLoading: true })
        this.props.generateToken().then((token) => {
            data.apiToken = token.generateToken;
            this.showLoaderIcon(true);
            this.props.saveActivityDetails(data)
                .then((res) => {
                    this.setState({ isLoading: false, showEditPopup: false });
                    if (res.saveActivityInfo.status !== 200) {
                        this.showLoaderIcon(false);
                        const message = res.saveActivityInfo && typeof res.saveActivityInfo.message === "string" ? res.saveActivityInfo.message : "Something went wrong while updating activity!"
                        return failureToast(message);
                    }
                    $('#EditDetailsModal').modal('hide');
                    $('#EditPlanDetailsModal').modal('hide');
                    $('#EditTaskDetailsModal').modal('hide');
                    $('#AddTaskModal').modal('hide');
                    successToast("Record has been updated successfully");
                    this.getActivityDetails(this.state.activity);
                }).catch(() => {
                    this.showLoaderIcon(false);
                    failureToast("Something went wrong while updating activity!");

                });
        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while updating activity!");
        });
    }

    onSaveClick = (activity, params) => {
        let { actualED, actualET, actualSD, actualST, crType, riskLevel, description, impact, location, releaseNotes, scheduleED, scheduleET,
            scheduleSD, scheduleST, services, verification, detailActivity, rollbackActivity, approvers } = params;
        actualED = actualED ? new Date(actualED).toISOString() : '';
        actualSD = actualSD ? new Date(actualSD).toISOString() : '';
        scheduleSD = scheduleSD ? new Date(scheduleSD).toISOString() : '';
        scheduleED = scheduleED ? new Date(scheduleED).toISOString() : '';
        riskLevel = riskLevel ? Number(riskLevel) : 0;
        this.validationsCheck()
            .then(() => {
                this.handleSaveDetail(activity, {
                    actualED, actualET, actualSD, actualST, crType, riskLevel, description, impact, location,
                    releaseNotes, scheduleED, scheduleET, scheduleSD, scheduleST, services,
                    verification, detailActivity, rollbackActivity, approvers
                });
            });
    }

    validationsCheck = () => {
        const { failureToast } = this.props;
        const { scheduleST, scheduleET, actualST, actualET } = this.state;
        const scheduleStartTime = scheduleST ? scheduleST.trim() : false;
        const scheduleEndTime = scheduleET ? scheduleET.trim() : false;
        const actualStartTime = actualST ? actualST.trim() : false;
        const actualEndTime = actualET ? actualET.trim() : false;
        const validations = [];
        if (scheduleStartTime !== false) {
            validations.push({ name: "schedule start time", boolean: !!scheduleStartTime, value: scheduleStartTime, originalValue: scheduleST });
        }
        if (scheduleEndTime !== false) {
            validations.push({ name: "schedule end time", boolean: !!scheduleEndTime, value: scheduleEndTime, originalValue: scheduleET });
        }
        if (actualStartTime !== false) {
            validations.push({ name: "actual start time", boolean: !!actualStartTime, value: actualStartTime, originalValue: actualStartTime });
        }
        if (actualEndTime !== false) {
            validations.push({ name: "actual end time", boolean: !!actualEndTime, value: actualEndTime, originalValue: actualEndTime });
        }

        let hasAllFields = true, index = 0;
        // for checking values must not empty
        while (index < validations.length) {
            if (!validations[index].boolean) {
                failureToast(`${validations[index].name} is required!`);
                hasAllFields = false;
                break;
            }
            if (!validations[index].value.includes(":")) {
                failureToast(`${validations[index].name} is should be in hh:mm format!`);
                hasAllFields = false;
                break;
            }
            const [hh, mm] = validations[index].value.split(":");
            if (!Number(hh) && Number(hh) !== 0 || Number(hh) > 23 || !(hh.length === 2) || (Number(hh) !== 0 && !Number(hh))) {
                failureToast(`${validations[index].name} is should be in hh:mm format!`);
                hasAllFields = false;
                break;
            }
            if (!Number(mm) && Number(mm) !== 0 || Number(mm) > 59 || !(mm.length === 2) || (Number(mm) !== 0 && !Number(mm))) {
                failureToast(`${validations[index].name} is should be in hh:mm format!`);
                hasAllFields = false;
                break;
            }
            index += 1;
        }

        if (!hasAllFields) {
            return Promise.reject(false);
        }
        return Promise.resolve(true);
    }

    async getApprovers() {
        const { failureToast, showLoaderIcon, userId } = this.props;
        const { activity, featureId } = this.state;

        try {
            let status = "";
            let tkoken = await this.props.generateToken();

            let masterService = await axios.get(`${masterApiUrls.getMasterData}SM&userId=${userId}&apiToken=${tkoken.generateToken}`);
            if (Array.isArray(masterService.data.data) && masterService.data.data.length > 0) {
                let masterData = masterService.data.data;
                this.setState({
                    statusList: masterData
                })
                let activeData = masterData.filter(x => Array.isArray(x.data) && x.data.some(a => a.value === 1));
                if (activeData.length > 0) {
                    let activeObject = activeData[0];
                    status = activeObject.id;
                }
            }
            let { generateToken: token } = await this.props.generateToken();
            let post = {
                "skip": 0,
                "limit": 100,
                "actionBy": this.props.actionBy,
                "apiToken": token,
                "clientId": this.props.clientId,
                "featureId": this.props.featureId,
                "status": status
            };
            this.showLoaderIcon(true);
            axios.post(`${userApiUrls.getUserDashboard}`, post)
                .then((res) => {
                    this.showLoaderIcon(false);
                    if (res.data.status === 200) {
                        const usersList = res.data["data"];
                        var filteredUsersList = usersList.filter(x => x.userId !== this.props.actionBy);
                        if (this.props.activityInformation && this.props.activityInformation.createdBy) {
                            filteredUsersList = filteredUsersList.filter(x => x.userId !== this.props.activityInformation.createdBy);
                        }
                        this.setState({
                            approverList: filteredUsersList,
                            userList: usersList
                        });
                    }
                    else {
                        failureToast(res.data.message);
                    }
                });
        } catch (error) {
            this.showLoaderIcon(false);
            failureToast(error.message);
        }
    }




    formatDateString = (dateString) => {
        let date = new Date(dateString);
        let month = date.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        return `${date.getDate()}/${month}/${date.getFullYear()}`;
    }

    getUsersList = async () => {
        const { failureToast } = this.props;
        let { generateToken: token } = await this.props.generateToken();
        let status = '';
        const { statusList } = this.props.getAllMasterData || {};
        let activeData = statusList.filter(x => Array.isArray(x.data) && x.data.some(a => a.value === 1));
        if (activeData.length > 0) {
            let activeObject = activeData[0];
            status = activeObject.id;
        }
        let post = {
            "skip": 0,
            "limit": 100,
            "actionBy": this.props.actionBy,
            "apiToken": token,
            "clientId": this.state.selectedRequestClientId,
            "featureId": this.props.featureId,
            "status": status
        };

        axios.post(`${userApiUrls.getUserDashboard}`, post)
            .then((res) => {
                if (res.data.status === 200) {
                    const usersList = res.data["data"];
                    var filteredUsersList = usersList.filter(x => x.userId !== this.props.actionBy);
                    if (this.props.activityInformation && this.props.activityInformation.createdBy) {
                        filteredUsersList = filteredUsersList.filter(x => x.userId !== this.props.activityInformation.createdBy);
                    }
                    this.setState({
                        approverList: filteredUsersList,
                        userList: usersList
                    });
                }
                else {
                    failureToast(res.data.message);
                }
            });
    }

    goBack = () => {
        if (this.props.history) {
            let url = `/change-requests/`;
            this.props.history.replace(url);
        }

    }
    initiateRollback = () => {
        let data = {
            activityId: this.state.activityId,
            clientId: this.props.clientId,
            featureId: this.props.featureId,
            actionBy: this.props.userId
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.initiateRollback(data).then((res) => {
                this.setState({ isLoading: false });
                if (res.saveActivityInfo.status !== 200) {
                    this.showLoaderIcon(false);
                    const message = res.saveActivityInfo && typeof res.saveActivityInfo.message === "string" ? res.saveActivityInfo.message : "Something went wrong while updating activity!"
                    return failureToast(message);
                }
                successToast("Record has been updated successfully");
            });
        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while updating activity!");
        });
    }

    markUnsuccessfull = () => {
        let data = {
            activityId: this.state.activityId,
            clientId: this.props.clientId,
            featureId: this.props.featureId,
            actionBy: this.props.userId
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.unsuccessFullActivity(data).then((res) => {
                this.setState({ isLoading: false });
                if (res.saveActivityInfo.status !== 200) {
                    this.showLoaderIcon(false);
                    const message = res.saveActivityInfo && typeof res.saveActivityInfo.message === "string" ? res.saveActivityInfo.message : "Something went wrong while updating activity!"
                    return failureToast(message);
                }
                this.getActivityDetails(this.state.activity);
                successToast("Record has been updated successfully");
            });
        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while updating activity!");
        });
    }
    markComplete = () => {
        let data = {
            activityId: this.state.activityId,
            clientId: this.props.clientId,
            featureId: this.props.featureId,
            actionBy: this.props.userId
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.completeActivity(data).then((res) => {
                if (this.state.closeTicketEnabled) {
                    this.updateTicket();
                }
                else {
                    this.setState({ isLoading: false });
                    if (res.saveActivityInfo.status !== 200) {
                        this.showLoaderIcon(false);
                        const message = res.saveActivityInfo && typeof res.saveActivityInfo.message === "string" ? res.saveActivityInfo.message : "Something went wrong while updating activity!"
                        return failureToast(message);
                    }
                    this.getActivityDetails(this.state.activity);
                    successToast("Record has been updated successfully");
                }
            }).catch(() => {
                this.showLoaderIcon(false);
                failureToast("Something went wrong while updating activity!");
            });

        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while updating activity!");
        });
    }

    updateTicket = () => {  // ticketId
        if (!this.props?.activityDetails?.ticketId) {
            return infoToast('This Change Request does not have ticket to close!');
        }
        let updateKeys = {};
        const { stateList } = this.props.getAllMasterData || {};
        const resolvedObj = Array.isArray(stateList) && stateList.filter(list => {
            return list?.name?.toLowerCase() === 'resolved';
        });
        updateKeys['state'] = Array.isArray(resolvedObj) && resolvedObj.length ? resolvedObj[0].id : undefined;
        let data = {
            ticketId: this.props.activityDetails ? this.props.activityDetails.ticketId : '',
            userId: this.props.userId,
            clientId: this.props.clientId,
            featureId: this.props.featureId,
            updateKeys: updateKeys
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.updateTicket(data).then((res) => {
                this.setState({ isLoading: false });
                if (res.saveActivityInfo.status !== 200) {
                    this.showLoaderIcon(false);
                    const message = res.saveActivityInfo && typeof res.saveActivityInfo.message === "string" ? res.saveActivityInfo.message : "Something went wrong while updating activity!"
                    return failureToast(message);
                }
                successToast("Record has been updated successfully");
            });
        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while updating activity!");
        });
    }
    onCloseTicketChange = () => {
        this.setState({ closeTicketEnabled: !this.state.closeTicketEnabled })
    }


    setSelectedTask = (task) => {
        this.setState({ selectedTask: task });
    }
    onDeleteTask = () => {
        let task = this.state.selectedTask;
        if (task) {
            task.detailActivityId ? this.onDeletePATask(task) : this.onDeletePARollback(task);
        }
    }
    onDeletePATask = (task) => {
        const { failureToast, successToast, userId } = this.props;
        const { activity, featureId } = this.state;
        let data = {
            detailActivityId: task ? task.detailActivityId : "",
            actionBy: userId,
            featureId: featureId ? featureId : "",
            clientId: activity && activity ? activity.clientId : "",
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.deletePATask(data)
                .then((res) => {
                    if (res.saveActivityInfo.status !== 200) {
                        this.showLoaderIcon(false);
                        const message = res.saveActivityInfo && res.saveActivityInfo.message ? res.saveActivityInfo.message : "Something went wrong while deleting task!";
                        return failureToast(message);
                    }
                    this.getActivityDetails(this.state.activity);
                    $('#myModal').modal('hide');
                    successToast("Planned activity task has been deleted successfully");
                });
        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while deleting task!");
        });


    }

    onDeletePARollback = (task) => {
        const { failureToast, successToast, userId } = this.props;
        const { activity, featureId } = this.state;
        let data = {
            rollbackActivityId: task ? task.rollbackActivityId : "",
            actionBy: userId,
            featureId: featureId ? featureId : "",
            clientId: activity && activity ? activity.clientId : "",
        }
        this.props.generateToken().then((token) => {
            data["apiToken"] = token.generateToken;
            this.showLoaderIcon(true);
            this.props.deletePARollback(data)
                .then((res) => {
                    if (res.saveActivityInfo.status !== 200) {
                        this.showLoaderIcon(false);
                        const message = res.saveActivityInfo && res.saveActivityInfo.message ? res.saveActivityInfo.message : "Something went wrong while deleting rollback task!";
                        return failureToast(message);
                    }
                    this.getActivityDetails(this.state.activity);
                    $('#myModal').modal('hide');
                    successToast("Rollback task has been deleted successfully");
                });
        }).catch(() => {
            this.showLoaderIcon(false);
            failureToast("Something went wrong while deleting task!");
        });


    }
    destroyPopup = () => {
        steps.forEach((step, i) => {
            i > 0 ? step.selected = false : step.selected = true;
        })
        this.setState({ showEditPopup: false, step: 0 });
    }

    setStep = (step) => {
        this.setState({ step: step });
    }

    fetchAutomationTemplates = (id, isDetailPlan, isRollbackPlan, existingTemplateid) => {
        this.showLoaderIcon(true);
        this.setState({ selectedDetailActivityId: '', selectedRollbackActivityId: '', existingTemplate: '' });
        this.props.getAutomationTemplates()
            .then((res) => {
                if (res.automationTemplates.status !== 200) {
                    this.showLoaderIcon(false);
                    const message = res.automationTemplates && res.automationTemplates.message ? res.automationTemplates.message : "Something went wrong while fetching automation templates !";
                    return failureToast(message);
                }
                this.setState({
                    hasShowTemplates: true, loading: false,
                    selectedDetailActivityId: isDetailPlan ? id : '',
                    selectedRollbackActivityId: isRollbackPlan ? id : '',
                    existingTemplate: Number(existingTemplateid)
                });
            }).catch((err) => {
                this.showLoaderIcon(false);
                failureToast("Something went wrong while getting automation templates list!");
            });
    }

    updatePADetailPlan = async (id, jobResults) => {
        const automationTemplate = String(id);
        const { clientId, featureId, userId: actionBy } = this.props;
        const { generateToken: apiToken } = await this.props.generateToken();
        this.showLoaderIcon(true);
        const res = await updatePATask({
            clientId, featureId, actionBy, apiToken, detailActivityId: this.state.selectedDetailActivityId,
            updateKeys: {
                automationTemplate: automationTemplate ? automationTemplate : undefined,
                automationTemplateResponse: jobResults ? [jobResults] : undefined
            }
        });
        if (res && res.data.status === 200) {
            this.getActivityDetails(this.state.activity);
            successToast('Successfully added automation template');
            $('#AutomationTemplatesModal').modal('hide');
        }
        this.showLoaderIcon(false);
    }

    updatePARollbackPlan = async (id, jobResults) => {
        const automationTemplate = String(id);
        const { clientId, featureId, userId: actionBy } = this.props;
        const { generateToken: apiToken } = await this.props.generateToken();
        const res = await updatePARollBack({
            clientId, featureId, actionBy, apiToken, rollbackActivityId: this.state.selectedRollbackActivityId,
            updateKeys: {
                automationTemplate: automationTemplate ? automationTemplate : undefined,
                automationTemplateResponse: jobResults ? [jobResults] : undefined
            }
        });
        if (res && res.data.status === 200) {
            this.getActivityDetails(this.state.activity);
            successToast('Successfully added automation template');
            $('#AutomationTemplatesModal').modal('hide');
        }
        this.showLoaderIcon(false);
    }

    onLaunchingTemplate = async (templateId, id, isDetailPlan, isRollbackPlan,) => {
        this.showLoaderIcon(true);
        this.setState({
            existingTemplate: Number(templateId),
            hasShowAutomationTemplates: true,
            selectedDetailActivityId: isDetailPlan ? id : '',
            selectedRollbackActivityId: isRollbackPlan ? id : ''
        }, () => $('#admanceAutomation').modal('show'));
    }

    handleApproval = async (action) => {
        const showLoaderIcon = this.showLoaderIcon;
        const { activityDetails: activityInformation, failureToast, successToast, userId } = this.props;
        const { CRState: states } = this.props.getAllMasterData;// CRState
        let state = Array.isArray(states) && states.filter((obj) => obj.name == action);
        // if (state.length < 1) {
        //     return failureToast("Activity state not found");
        // }
        let data = {
            activityId: activityInformation && activityInformation.activityId ? activityInformation.activityId : "",
            actionBy: activityInformation && this.props.actionBy ? this.props.actionBy : "",
            // actionBy: userId,
            status: activityInformation && activityInformation.status ? activityInformation.status : "",
            state: state.length > 0 ? state[0].id : "",
            approverMail: this.props.userMail,
            approverName: this.props.userName,
            clientId: this.props.clientId,
            featureId: this.props.featureId
        }
        this.props.generateToken().then((token) => {
            data.apiToken = token.generateToken;
            showLoaderIcon(true);
            this.props.approvalActivity(data)
                .then((res) => {
                    if (res.approvePlanActivity.status !== 200) {
                        showLoaderIcon(false);
                        return failureToast(res.approvePlanActivity.message);
                    }
                    this.getActivityDetails(this.state.activity);
                    successToast("Change Request has been " + action.toLowerCase() + " successfully");
                });
        }).catch(() => {
            showLoaderIcon(false);
            return failureToast("Something went wrong.Please try again!");
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clientId !== this.props.clientId) {
            this.props.history.push('/change-requests');
        }
    }

    onJobLunch = (resourceId, jobType) => {
        $('#admanceAutomation').modal('hide');
        if (resourceId) {
            successToast('Job launched Successfully');
            const func = this.state.selectedDetailActivityId ? this.updatePADetailPlan : this.updatePARollbackPlan;
            // update api call for storing jobId and jobType updatePA and updateRollback
            func(this.state.existingTemplate, { orchJobId: resourceId, jobType });
        }
    }

    getJobOutput = async (jobsDetails = []) => {
        const { orchJobId, jobType } = Array.isArray(jobsDetails) && jobsDetails.length ? jobsDetails[0] : [{}];
        if (!orchJobId) {
            return failureToast('Unable to get job Id. Please try again after some time');
        }
        $('#jobOutput').modal('show');
        $('.modal-backdrop').css('z-index', '101');
        this.setState({ loading: true, hasShowOutputWindow: true, currentJob: {}, jobType: '' });
        const type = JOB_TYPE_URL_SEGMENTS[jobType || 'job'];
        const { data } = await JobsAPI.readDetail(orchJobId, type);
        this.setState({ currentJob: data, jobType: type, loading: false });
    }

    render() {
        const { activityDetails } = this.props;
        let information = activityDetails ? activityDetails.Information : [];
        let activity = activityDetails ? activityDetails : {};
        let info = information && information ? information[0] : {};
        const detailActivity = activityDetails ? activityDetails.DetailActivity : [];
        const rollbackActivity = activityDetails ? activityDetails.RollbackActivity : [];
        const { CRType, statusList } = this.props.getAllMasterData || {};
        const { hasShowOutputWindow } = this.state;

        return (
            <>
                <div className="card" style={{ border: 'none', borderRadius: '0' }}>
                    <div className="card-body">
                        <text className="t1 change-request-details-text"><a className='btn btn-link' onClick={this.goBack}>{'Change Requests >'}</a> {activity && activity.activityId}</text>
                        <h4 className="header change-request-details-header">{activity?.ticketId} Change Request</h4>
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true"><text className="nav-title">Info</text></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="plan-tab" data-toggle="tab" href="#plan" role="tab" aria-controls="plan" aria-selected="false"><text className="nav-title">Plan</text></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="execution-tab" data-toggle="tab" href="#execution" role="tab" aria-controls="execution" aria-selected="false"><text className="nav-title">Execution</text></a>
                                </li>
                            </ul>
                            <div className="flex-content">
                                <div className="vl"></div>
                                <div className="col details-header">
                                    <div className="div-head">Status</div>
                                    <div className="div-text details-text" style={{ fontSize: '1rem' }}>
                                        {
                                            activityDetails && activityDetails.stateName &&
                                            <i className="icon-open"></i>
                                        }
                                        {activityDetails && activityDetails.stateName}
                                    </div>
                                </div>
                                <div className="vl"></div>
                                <div className="col details-header">
                                    <div className="div-head">Type</div>
                                    <div className="div-text details-text"><i className="icon-emr"></i>{activityDetails && activityDetails.typeName}</div>
                                </div>
                                <div className="vl"></div>
                                <div className="col details-header">
                                    <div className="div-head">Risk</div>
                                    <div className="div-text details-text">
                                        {
                                            activityDetails && activityDetails.riskLevel ?
                                                <i className="icon-time"></i> : ''
                                        }
                                        {`${activityDetails && activityDetails.riskLevel ? 'Level' : ''}`} {activityDetails && activityDetails.riskLevel ? activityDetails.riskLevel : ''}</div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content" id="tabContent" style={{ background: '#F4F4F4' }}>
                            <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                                {/* Info Tab Start */}
                                <div className="col" style={{ padding: '1rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }} >
                                    <div className="row" style={{
                                        background: "#F4F4F4",
                                        padding: '0rem 0rem 0.9rem'
                                    }}>
                                        < div className="card w-100" style={{
                                            margin: "10px"
                                        }}>
                                            < div className="card-body" style={{
                                                width: '100%',
                                                margin: "10px", width: "100%"
                                            }}>
                                                < h5 className="card-title cardheader change-request-details-table-title" style={{
                                                    width: "70rem"
                                                }} > Quick action</ h5>
                                                <div style={{ width: '100%', padding: '20px', paddingLeft: '0px', display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ width: '50%', display: 'flex' }}>
                                                        <button className="quick-action-button" onClick={this.handleCopy}> <i className="fa fa-files-o" style={{ color: "gray", padding: '0px 5px' }}></i>Copy</button>
                                                        <button className="quick-action-button" onClick={this.handleObsolete}><i className="fa fa-clock-o" style={{ color: "gray", padding: '0px 5px' }}></i>Obselete</button>
                                                    </div>
                                                    <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
                                                        {((activityDetails && activityDetails.stateName === "Pending Approval") &&
                                                            (activityDetails && activityDetails.ApproverActivity && activityDetails.ApproverActivity.length > 0 &&
                                                                activityDetails.ApproverActivity.findIndex(x => x.approverMail === this.props.userMail) > -1 &&
                                                                activityDetails.ApproverActivity[activityDetails.ApproverActivity.findIndex(x => x.approverMail === this.props.userMail)].stateName.toLowerCase() === "pending approval")) ?
                                                            <button type="button" className="btn btn-secondary save-btn-all" onClick={this.handleApproval.bind(this, "Approved")}>Approve</button>
                                                            : ''
                                                        }
                                                        {((activityDetails && activityDetails.stateName === "Pending Approval") &&
                                                            (activityDetails && activityDetails.ApproverActivity && activityDetails.ApproverActivity.length > 0 &&
                                                                activityDetails.ApproverActivity.findIndex(x => x.approverMail === this.props.userMail) > -1 &&
                                                                activityDetails.ApproverActivity[activityDetails.ApproverActivity.findIndex(x => x.approverMail === this.props.userMail)].stateName.toLowerCase() === "pending approval")) ?
                                                            <button type="button" className="btn btn-secondary cancel-btn" style={{ marginLeft: '6px', border: '1px solid #f2f2f2' }} onClick={this.handleApproval.bind(this, "Rejected")}>Reject</button>
                                                            : ''
                                                        }
                                                    </div>
                                                </div>
                                            </ div>
                                        </ div>
                                    </div>
                                    <div className="row" style={{ padding: '0rem 0rem 0.9rem 0rem', justifyContent: 'space-around' }} >
                                        <div className="card" style={{ flexBasis: '30%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title cardheader change-request-details-card-header">Schedule Info<i id="editDetails" className="fa fa-pencil float-right" aria-hidden="true"></i></h5>
                                                <table className="table table-borderless table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Client</th>
                                                            <td className="tabledata change-request-details-card-data">{activity && activity.clientName}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Scheduled Start</th>
                                                            <td className="tabledata change-request-details-card-data">{info && `${info.scheduleSD && this.formatDateString(info.scheduleSD)}, ${info.scheduleST ? info.scheduleST : ''}`}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Scheduled End</th>
                                                            <td className="tabledata change-request-details-card-data">{info && `${info.scheduleED && this.formatDateString(info.scheduleED)}, ${info.scheduleET ? info.scheduleET : ''}`}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Initiated By</th>
                                                            <td className="tabledata change-request-details-card-data">{activity && activity.createdByName}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Initiated On</th>
                                                            <td className="tabledata change-request-details-card-data">{info && `${info.scheduleED && this.formatDateString(info.scheduleED)}, ${info.scheduleET ? info.scheduleET : ''}`}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="card" style={{ flexBasis: '68%' }}>
                                            <div className="card-body">
                                                <h5 className="card-title cardheader change-request-details-card-header">Activity Info<i id="editActivityInfo" className="fa fa-pencil float-right" aria-hidden="true"></i></h5>
                                                <table className="table table-borderless table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Location</th>
                                                            <td className="tabledata change-request-details-card-data">{info && info.location}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Actual Start</th>
                                                            <td className="tabledata change-request-details-card-data">{info && `${info.actualSD && this.formatDateString(info.actualSD)}, ${info.actualST ? info.actualST : ''}`}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Actual End</th>
                                                            <td className="tabledata change-request-details-card-data">{info && `${info.actualED && this.formatDateString(info.actualED)}, ${info.actualET ? info.actualET : ''}`}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Description</th>
                                                            <td className="tabledata change-request-details-card-data">{info && info.description}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={{ background: "#F4F4F4", padding: '0rem 0rem 0.9rem', justifyContent: 'space-around' }}>
                                        <div className="card" style={{ backgroundColor: "#ffffff", flexBasis: '30%' }}>
                                            <div className="card-body" style={{ margin: "10px" }}>
                                                <h5 className="card-title cardheader change-request-details-card-header">Activity Approval<i id="editActivityApproval" className="fa fa-pencil float-right" aria-hidden="true"></i></h5>


                                                <div className="container mt-3 mb-3">
                                                    <div className="row">
                                                        <div className="offset-md-0">
                                                            <ul className="timeline">
                                                                {activityDetails && activityDetails.approvalLC && activityDetails.approvalLC.map(approver => {
                                                                    return (
                                                                        <li>
                                                                            <small className="li-date" style={{ backgroundColor: "#f2f2f2", padding: "2px" }}>{approver.createdDate && this.formatDateString(approver.createdDate)}</small>
                                                                            <br></br>
                                                                            <p className="li-p">Initiated by {activity && activity.userName}<br></br><text className="li-text">{approver.officialEmail}</text><br></br>{approver.stateName}</p>
                                                                        </li>)
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div >
                                            </div >
                                        </div >
                                        <div className="card" style={{ flexBasis: '68%' }}>
                                            <div className="card-body" style={{ margin: "10px" }}>
                                                <h5 className="card-title cardheader change-request-details-card-header">Activity Details<i id="editActivityDetails" className="fa fa-pencil float-right" aria-hidden="true"></i></h5>
                                                <table className="table table-borderless table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Release Notes</th>
                                                            <td className="tabledata change-request-details-card-data">{info && info.releaseNotes}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Scope of Impact</th>
                                                            <td className="tabledata change-request-details-card-data">{info && info.impact}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Testing of Services</th>
                                                            <td className="tabledata change-request-details-card-data">{info && info.services}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Verification of Impact</th>
                                                            <td className="tabledata change-request-details-card-data">{info && info.verification}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div >
                                </div >
                            </div >

                            <div className="tab-pane fade" id="plan" role="tabpanel" aria-labelledby="plan-tab">
                                <div className="row" style={{
                                    background: "#F4F4F4",
                                    padding: '0rem 0rem 0.9rem'
                                }}>
                                    < div className="card w-100" style={{
                                        margin: "10px"
                                    }}>
                                        < div className="card-body" style={{
                                            width: '100%',
                                            margin: "10px", width: "100%"
                                        }}>
                                            < h5 className="card-title cardheader change-request-details-table-title" style={{
                                                width: "70rem"
                                            }} > Quick action</ h5>

                                            <div style={{ width: '100%', padding: '20px', paddingLeft: '0px', display: 'flex', justifyContent: 'space-between' }}>
                                                <div style={{ width: '50%', display: 'flex' }}>
                                                    <button className="quick-action-button" onClick={this.handleCopy}> <i className="fa fa-files-o" style={{ color: "gray", padding: '0px 5px' }}></i>Copy</button>
                                                    <button className="quick-action-button" onClick={this.handleObsolete}><i className="fa fa-clock-o" style={{ color: "gray", padding: '0px 5px' }}></i>Obselete</button>
                                                </div>
                                                <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button className="quick-action-blue-button"
                                                        onClick={this.handleSubmitActivity}>
                                                        <i className="fa fa-check" style={{ color: "white", padding: '0px 5px' }}></i>
                                                            Submit</button>

                                                </div>
                                            </div>
                                        </ div>
                                    </ div>
                                </ div>
                                <div className="row" style={{ background: "#F4F4F4", padding: '0rem 0rem 0.9rem 0rem', justifyContent: 'space-around' }}>
                                    <div className="card w-100" style={{ margin: "10px" }}>
                                        <div className="card-body" style={{ margin: "10px" }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <h5 className="card-title cardheader change-request-details-table-title">Detailed Activity Plan</h5>

                                                <button className="btn1 float-right border-0" id="addRollbackPlan" style={{ height: '2.2rem' }}>
                                                    <i className="fa fa-plus" style={{ color: "gray" }}></i> Add Task</button>

                                            </div>
                                            <div className="tableFixHead overflow-auto">
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">S.no</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Task</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Sched Start</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Duration</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Sched End</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Owner</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Comments</th>
                                                            <th> </th>
                                                            <th> </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="tbody-style">
                                                        {detailActivity && detailActivity.map((detail, index) => {
                                                            return <tr>
                                                                <td width={60}>{index + 1}</td>
                                                                <td>{detail.description}</td>
                                                                <td>{detail.startTime}</td>
                                                                <td>{detail.duration}</td>
                                                                <td>{detail.endTime}</td>
                                                                <td>{detail.ownerName}</td>
                                                                <td>{detail.comments}</td>
                                                                <td width={50} data-toggle="modal" data-target="#myModal" onClick={() => this.setSelectedTask(detail)}><i className="fa fa-trash" style={{ color: "#707070" }} aria-hidden="true"></i></td>
                                                                <td width={50} data-toggle="modal" data-target="#EditTaskDetailsModal" onClick={() => this.setSelectedTask(detail)}><i id="editTask" className="fa fa-pencil" style={{ color: "#707070" }} aria-hidden="true"></i></td>
                                                                <td width={50} data-toggle="modal" data-target="#AutomationTemplatesModal" onClick={() => this.fetchAutomationTemplates(detail.detailActivityId, true, false, detail.automationTemplate)} ><i id="addTemplates" className="fa fa-paperclip" style={{ color: "#707070", transform: 'rotate(-275deg)' }} aria-hidden="true"></i></td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div >
                                    </div >
                                    <div className="card w-100" style={{
                                        margin: "10px"
                                    }}>
                                        <div className="card-body" style={{
                                            margin: "10px"
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <h5 className="card-title cardheader change-request-details-table-title">Rollback Plan</h5>

                                                <button className="btn1 float-right border-0" id="addActivityPlan" style={{ height: '2.2rem' }}>
                                                    <i className="fa fa-plus" style={{ color: "gray" }}></i> Add Task</button>

                                            </div>
                                            <div className="tableFixHead overflow-auto">
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">S.no</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Task</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Sched Start</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Duration</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Sched End</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Owner</th>
                                                            <th scope="col" className="plan-table-head change-request-details-table-th">Comments</th>
                                                            <th>  </th>
                                                            <th>  </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="tbody-style">
                                                        {rollbackActivity && rollbackActivity.map((rollback, index) => {
                                                            return <tr>
                                                                <td width={60}>{index + 1}</td>
                                                                <td>{rollback.description}</td>
                                                                <td>{rollback.startTime}</td>
                                                                <td>{rollback.duration}</td>
                                                                <td>{rollback.endTime}</td>
                                                                <td>{rollback.ownerName}</td>
                                                                <td>{rollback.comments}</td>
                                                                <td width={50} data-toggle="modal" data-target="#myModal" onClick={() => this.setSelectedTask(rollback)}><i className="fa fa-trash" style={{ color: "#707070" }} aria-hidden="true"></i></td>
                                                                <td width={50} data-toggle="modal" data-target="#EditTaskDetailsModal" onClick={() => this.setSelectedTask(rollback)}><i id="editRollbackTask" className="fa fa-pencil" style={{ color: "#707070" }} aria-hidden="true"></i></td>
                                                                <td width={50} data-toggle="modal" data-target="#AutomationTemplatesModal" onClick={() => this.fetchAutomationTemplates(rollback.rollbackActivityId, false, true, rollback.automationTemplate)}><i id="addTemplates" className="fa fa-paperclip" style={{ color: "#707070", transform: 'rotate(-275deg)' }} aria-hidden="true"></i></td>
                                                            </tr>
                                                        })}
                                                    </tbody >
                                                </table >
                                            </div >
                                        </div >
                                    </div >
                                </div >
                            </div >

                            < div className="modal" id="myModal" >
                                <div className="modal-dialog">
                                    <div className="modal-content" style={{ width: '500px' }}>
                                        <div className="modal-header">
                                            <h4 className="modal-title">Delete?</h4>
                                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div className="modal-body">
                                            <h6>Are you sure you want to delete?</h6>
                                        </div>
                                        <div className="modal-footer" style={{ borderTop: 'none' }}>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-outline-primary" onClick={this.onDeleteTask}>Delete</button>
                                                <button type="button" className="btn btn-cancel mr-auto" data-dismiss="modal">Cancel</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div >


                            {/* //Execution Tab Start */}
                            < div className="tab-pane fade" id="execution" role="tabpanel" aria-labelledby="execution-tab" >

                                <div className="col" style={{
                                    background: "#F4F4F4"
                                }}>

                                    <div className="row" style={{
                                        background: "#F4F4F4",
                                        padding: '0rem 0rem 0.9rem'
                                    }}>
                                        < div className="card w-100" style={{
                                            margin: "10px"
                                        }}>
                                            < div className="card-body" style={{
                                                width: '100%',
                                                margin: "10px", width: "100%"
                                            }}>
                                                < h5 className="card-title cardheader change-request-details-table-title" style={{
                                                    width: "70rem"
                                                }} > Quick action</ h5>

                                                <div style={{ width: '100%', padding: '20px', paddingLeft: '0px', display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ width: '50%', display: 'flex' }}>
                                                        <button className="quick-action-button" onClick={this.initiateRollback}> <i className="fa fa-refresh" style={{ color: "gray", padding: '0px 5px' }}></i>Initiate Rollback</button>
                                                    </div>
                                                    <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
                                                        <button className="quick-action-button" onClick={this.markUnsuccessfull}> <i className="fa fa-warning" style={{ color: "gray", padding: '0px 5px' }}></i>Mark Unsuccessfull</button>
                                                        <button className="quick-action-blue-button" disabled={activity && activity.stateName === "Completed"}
                                                            onClick={this.markComplete}>
                                                            <i className="fa fa-calendar-check-o" style={{ color: "white", padding: '0px 5px' }}></i>
                                                            Mark Complete</button>
                                                    </div>
                                                </div>
                                            </ div>
                                        </ div>
                                    </div>

                                    <div className="row" style={{
                                        background: "#F4F4F4",
                                        padding: '0rem 0rem 0.9rem'
                                    }}>
                                        < div className="card w-100" style={{
                                            margin: "10px"
                                        }}>
                                            < div className="card-body" style={{
                                                margin: "10px", width: "30rem"
                                            }}>
                                                < h5 className="card-title cardheader change-request-details-table-title" style={{
                                                    width: "70rem"
                                                }} > Execution Details < i id="editExecutionDetails" className="fa fa-pencil float-right" style={{
                                                    position: "absolute", right: "24px", marginTop: "19px"
                                                }}  ></i ></h5 >
                                                <table className="table table-borderless table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Actual Start</th>
                                                            <td className="tabledata change-request-details-card-data">{info && `${info.actualSD && this.formatDateString(info.actualSD)}, ${info.actualST ? info.actualST : ''}`}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Actual End</th>
                                                            <td className="tabledata change-request-details-card-data">{info && `${info.actualED && this.formatDateString(info.actualED)}, ${info.actualET ? info.actualET : ''}`}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Comments</th>
                                                            <td className="tabledata change-request-details-card-data">{info && info.description}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="tablehead change-request-details-card-title">Close Ticket On Success </th>
                                                            <td className="tabledata change-request-details-card-data" >
                                                                <label className="switch">
                                                                    <input type="checkbox" checked={this.state.closeTicketEnabled} onChange={this.onCloseTicketChange} />
                                                                    <span className="slider round" style={{ width: "45px" }}></span>
                                                                </label>
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div >
                                        </div >
                                    </div >


                                    <div className="row" style={{
                                        background: "#F4F4F4",
                                        padding: '0rem 0rem 0.9rem'
                                    }}>
                                        <div className="card w-100" style={{
                                            margin: "10px"
                                        }}>
                                            < div className="card-body" style={{
                                                margin: "10px"
                                            }}>
                                                < h5 className="card-title cardheader change-request-details-table-title" > Detailed Activity Plan</h5 >
                                                <div className="tableFixHead overflow-auto">
                                                    <table id="table1" className="table table-sm hover_cls" >
                                                        <thead>
                                                            <tr >
                                                                <th scope="col" className="plan-table-head td1 change-request-details-table-th">S.no</th>
                                                                <th scope="col" className="plan-table-head td2 change-request-details-table-th">Task</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Actual Start</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Duration</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Actual End</th>
                                                                <th scope="col" className="plan-table-head td4 change-request-details-table-th">Owner</th>
                                                                <th scope="col" className="plan-table-head td5 change-request-details-table-th">Comments</th>
                                                                <th scope="col" className="plan-table-head td6 change-request-details-table-th">Mark Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="tbody-style">
                                                            {detailActivity && detailActivity.map((detail, index) => {
                                                                return <tr>
                                                                    <td className="padding_cls td1" > 1
                                                                     <span style={{
                                                                            display: /* "inline-block" */ 'none', marginLeft: "16px"
                                                                        }}>
                                                                            <div id="uicon1" style={{
                                                                                width: "16px", height: "20px", backgroundColor: "#F2F2F2", verticalAlign: "center"
                                                                            }}>
                                                                                <i className="fa fa-ellipsis-h" style={{ color: "white", marginLeft: "1.5px" }}></i>
                                                                            </div>
                                                                            <i id="check1icon" className="fa fa-check-square" aria-hidden="true" style={{ color: "#11A63D", display: "none" }}></i>
                                                                            <i id="cancel1icon" className="fa fa-window-close" aria-hidden="true" style={{ color: "#CC141E", horizontalAlign: "center", display: "none" }}></i>
                                                                            <svg id="exclam1icon" style={{ color: "#F1C21B", display: "none" }} xmlns="http://www.w3.org/2000/svg" width="16" height="15" fill="currentColor" className="bi bi-exclamation-square-fill" viewBox="0 0 16 16" >
                                                                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                                                            </svg>
                                                                        </span>
                                                                    </td>
                                                                    <td>{detail.description}</td>
                                                                    <td>{detail.startTime}</td>
                                                                    <td>{detail.duration}</td>
                                                                    <td>{detail.endTime}</td>
                                                                    <td>{detail.ownerName}</td>
                                                                    <td>{detail.comments}</td>
                                                                    <td className="td6" >
                                                                        <span title='Launch Template' onClick={() => this.onLaunchingTemplate(detail.automationTemplate, detail.detailActivityId, true, false,)}><i className="fa fa-play-circle" style={{ color: detail.automationTemplate ? '#4CAF50' : '#f4f4f4', marginRight: '0.3rem' }}></i></span>
                                                                        <span title='Job Results' style={{ pointerEvents: Array.isArray(detail.automationTemplateResponse) && detail.automationTemplateResponse.length ? '' : 'none' }} className='job-results-cr' onClick={() => this.getJobOutput(detail.automationTemplateResponse)}></span>
                                                                        <input name="control1_grp" style={{ width: '0px', height: '0px' }} type="checkbox" id="check1Control" />
                                                                        <label style={{ width: "9px", height: "9px", marginLeft: "0px" }} className="btn" for="check1Control" >
                                                                            <i style={{ verticalAlign: "top", margin: "-8px 20px 0px -10px" }} id="check1" onClick={this.processClick(this.id)} className="fa fa-check"></i>
                                                                        </label>

                                                                        <input name="control1_grp" style={{ width: '0px', height: '0px' }} className="checkbox_cls " type="checkbox" id="cancel1Control" />
                                                                        <label style={{ border: "none", width: "9px", height: "9px", marginLeft: "0px" }} className="btn" for="cancel1Control" >
                                                                            <i style={{ verticalAlign: "top", margin: "-8px 20px 0px -10px" }} id="cancel1" onClick={this.processClick(this.id)} className="fa fa-times" ></i></label>

                                                                        <input name="control1_grp" style={{ width: '0px', height: '0px' }} className="checkbox_cls " type="checkbox" id="exclam1Control" />
                                                                        <label style={{ border: "none", width: "9px", height: "9px", marginLeft: "0px" }} className="btn" for="exclam1Control" >
                                                                            <i style={{ verticalAlign: "top", margin: "-8px 20px 0px -10px" }} id="exclam1" onClick={this.processClick(this.id)} className="fa fa-exclamation"></i></label>

                                                                    </td >
                                                                </tr>
                                                            })}
                                                        </tbody >
                                                    </table >
                                                </div >
                                            </div >
                                        </div >
                                    </div >
                                    <div className="row" style={{
                                        background: "#F4F4F4",
                                        padding: '0rem 0rem 0.9rem'
                                    }}>
                                        <div className="card w-100" style={{
                                            margin: "10px"
                                        }}>
                                            < div className="card-body" style={{
                                                margin: "10px"
                                            }}>
                                                < h5 className="card-title cardheader change-request-details-table-title" > Rollback Plan</h5 >
                                                <div className="tableFixHead overflow-auto">
                                                    <table className="table table-sm hover_cls">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">S.no</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Rollback Task</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Actual Start</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Duration</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Actual End</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Owner</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Comments</th>
                                                                <th scope="col" className="plan-table-head change-request-details-table-th">Mark Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="tbody-style">
                                                            {rollbackActivity && rollbackActivity.map((detail, index) => {
                                                                return <tr>
                                                                    <td className="padding_cls rb_td1">1
                                                                      <span style={{
                                                                            display: "inline-block", marginLeft: "16px"
                                                                        }}>
                                                                            <div id="uicon7" style={{
                                                                                width: "16px", height: "20px", backgroundColor: "#F2F2F2", verticalAlign: "center"
                                                                            }}>
                                                                                <i className="fa fa-ellipsis-h" style={{ color: "white", marginLeft: "1.5px" }}></i>
                                                                            </div>
                                                                            <i id="check7icon" className="fa fa-check-square" aria-hidden="true" style={{ color: "#11A63D", display: "none" }}></i>
                                                                            <i id="cancel7icon" className="fa fa-window-close" aria-hidden="true" style={{ color: "#CC141E", horizontalAlign: "center", display: "none" }}></i>
                                                                            <svg id="exclam7icon" style={{
                                                                                color: "#F1C21B", display: "none"
                                                                            }} xmlns="http://www.w3.org/2000/svg" width="16" height="15" fill="currentColor" className="bi bi-exclamation-square-fill" viewBox="0 0 16 16" >
                                                                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                                                            </svg>
                                                                        </span>
                                                                    </td>
                                                                    <td className="rb_td1">{detail.description}</td>
                                                                    <td className="rb_td2">{detail.startTime}</td>
                                                                    <td className="rb_td3">{detail.duration}</td>
                                                                    <td className="rb_td4">{detail.endTime}</td>
                                                                    <td className="rb_td5">{detail.ownerName}</td>
                                                                    <td className="rb_td6">{detail.comments}</td>
                                                                    <td className="rb_td7" >
                                                                        <span onClick={() => this.onLaunchingTemplate(detail.automationTemplate, detail.rollbackActivityId, false, true)}><i className="fa fa-play-circle" style={{ color: detail.automationTemplate ? '#4CAF50' : '#f4f4f4', marginRight: '0.3rem' }}></i></span>
                                                                        <span title='Job Results' style={{ pointerEvents: Array.isArray(detail.automationTemplateResponse) && detail.automationTemplateResponse.length ? '' : 'none' }} className='job-results-cr' onClick={() => Array.isArray(detail.automationTemplateResponse) && detail.automationTemplateResponse.length && this.getJobOutput(detail.automationTemplateResponse)}></span>
                                                                        <input name="control1_grp" style={{ width: '0px', height: '0px' }} type="checkbox" id="check1Control" />
                                                                        <label style={{ width: "9px", height: "9px", marginLeft: "0px" }} className="btn" for="check1Control" >
                                                                            <i style={{ verticalAlign: "top", margin: "-8px 20px 0px -10px" }} id="check1" onClick={this.processClick(this.id)} className="fa fa-check"></i>
                                                                        </label>

                                                                        <input name="control1_grp" style={{ width: '0px', height: '0px' }} className="checkbox_cls " type="checkbox" id="cancel1Control" />
                                                                        <label style={{ border: "none", width: "9px", height: "9px", marginLeft: "0px" }} className="btn" for="cancel1Control" >
                                                                            <i style={{ verticalAlign: "top", margin: "-8px 20px 0px -10px" }} id="cancel1" onClick={this.processClick(this.id)} className="fa fa-times" ></i></label>

                                                                        <input name="control1_grp" style={{ width: '0px', height: '0px' }} className="checkbox_cls " type="checkbox" id="exclam1Control" />
                                                                        <label style={{ border: "none", width: "9px", height: "9px", marginLeft: "0px" }} className="btn" for="exclam1Control" >
                                                                            <i style={{ verticalAlign: "top", margin: "-8px 20px 0px -10px" }} id="exclam1" onClick={this.processClick(this.id)} className="fa fa-exclamation"></i></label>

                                                                    </td >
                                                                </tr>
                                                            })}
                                                        </tbody >
                                                    </table >
                                                </div >
                                            </div >
                                        </div >
                                    </div >
                                </div >
                            </div >
                            {/* Execution tab End */}
                        </div >
                    </div >
                </div >
                <EditDetails
                    activityDetails={this.props.activityDetails || this.state.activityDetails}
                    activeTab={this.state.editModalActivaTab}
                    onSaveClick={this.onSaveClick}
                    approverList={this.state.approverList}
                    userList={this.state.userList}
                    infoToast={this.props.infoToast}
                    crTypes={CRType}
                    risks={[{ level: 1 }, { level: 2 }, { level: 3 }]}
                    destroyPopup={this.destroyPopup}
                    setStep={this.setStep}
                    steps={steps}
                    step={this.state.step}
                />

                <EditPlanDetails activityDetails={this.props.activityDetails || this.state.activityDetails}
                    onSaveClick={this.onSaveClick} />
                <EditTaskDetails selectedTask={this.state.selectedTask}
                    statusList={statusList}
                    activityDetails={this.props.activityDetails || this.state.activityDetails}
                    onSaveClick={this.onSaveClick}
                />

                <AutomationTemplates
                    templates={this.props.automationTemplates}
                    hasShowTemplates={this.state.hasShowTemplates}
                    updateAPI={this.state.selectedDetailActivityId ? this.updatePADetailPlan : this.updatePARollbackPlan}
                    loading={this.state.loading}
                    existingTemplate={Number(this.state.existingTemplate)}
                />

                <AddTask
                    activity={this.props.activityDetails}
                    failureToast={failureToast}
                    userList={this.state.userList}
                    onSaveClick={this.handleSaveDetail}
                />
                {/* templates modal */}
                <div className="modal" id="admanceAutomation" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Apply Automations</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={() => this.setState({ hasShowAutomationTemplates: false })}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    {
                                        this.state.hasShowAutomationTemplates &&
                                        <TemplateList
                                            isFromConcierto
                                            onJobLunchFromConcierto={this.onJobLunch}
                                            templateId={this.state.existingTemplate}
                                        // onLunchTemplateAddExtraParams={this.onLunchTemplateAddExtraParams}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* templates modal end */}
                {/* job output */}
                <div className="modal" id='jobOutput' tabIndex="-1" role="dialog" data-backdrop="static" data-keyboard="false" data-keyboard="false" ref={(el) => {
                    if (el) {
                        el.style.setProperty("z-index", "104", "important");
                    }
                }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content joboutput-modal-content" style={{ width: '65%' }}>
                            <div className="modal-header">
                                <h5 className="modal-title btn btn-link">Job-Results</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {
                                    $('.modal-backdrop').css('z-index', '1040');
                                    this.setState({ hasShowOutputWindow: false, currentJob: {}, jobType: {} })
                                }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <Loader loading={this.state.loading} />
                            <div className="modal-body">
                                {
                                    (hasShowOutputWindow && this.state.currentJob.type && this.state.currentJob.type === 'workflow_job') ? <WorkflowOutput job={this.state.currentJob} /> : null
                                }
                                {
                                    (hasShowOutputWindow && this.state.currentJob.type && this.state.currentJob.type !== 'workflow_job') ? <JobOutput type={this.state.jobType} job={this.state.currentJob} /> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* job output end window */}
            </>
        )
    }
}
const mapStateToProps = (state) => {
    let current_client = state.current_client.payload ? state.current_client.payload.client : "";
    let fId = (state.clientUserFeatures.featureIds && state.clientUserFeatures.featureIds.PlannedActivity) ? state.clientUserFeatures.featureIds.PlannedActivity : ""
    return {
        clientId: current_client,
        activityDetails: state.activityDetails ? state.activityDetails : {},
        states: state.activityState,
        userMail: (state.current_user.payload) ? state.current_user.payload.email : "",
        userName: (state.current_user.payload) ? state.current_user.payload.userName : "",
        featureId: fId,
        userId: state.current_user.payload ? state.current_user.payload.userId : "",
        // userList: state.userDirList ? state.userDirList : [],
        automationTemplates: state.automationTemplates ? state.automationTemplates?.data?.results : {},
        actionBy: state.current_user.payload ? state.current_user.payload.userId : "",
        getAllMasterData: state?.getAllMasterData && Array.isArray(state.getAllMasterData) && state.getAllMasterData.length ? state.getAllMasterData[0] : {}
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        generateToken,
        copyActivity,
        getActivityDetails,
        saveActivityDetails,
        obsoleteActivity,
        submitActivity,
        deletePATask,
        deletePARollback,
        initiateRollback,
        unsuccessFullActivity,
        completeActivity,
        getAutomationTemplates,
        updateTicket,
        failureToast,
        successToast,
        infoToast,
        approvalActivity
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ChangeRequestDetails);
