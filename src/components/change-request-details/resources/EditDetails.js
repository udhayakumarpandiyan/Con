import React, { useState } from 'react';
import MultiSelect from "react-multi-select-component";
import _ from "lodash";
import './modal.css';
import Process from './Process';

export default function EditDetails({ activityDetails, steps, setStep, step = 0, crTypes, destroyPopup, risks, onSaveClick, approverList = [], infoToast }) {
    let information = activityDetails ? activityDetails.Information : [];
    let info = information && information[0] ? information[0] : {};
    const ApproverActivity = Array.isArray(activityDetails.ApproverActivity) ? activityDetails.ApproverActivity.map(approver =>
        ({ label: approver.approverName, approverName: approver.approverName, value: approver.approverMail, approverMail: approver.approverMail, approverActivityId: approver.approverActivityId })) : [];
    const formatDateString = (dateString) => {
        if (dateString) {
            let formatDate = new Date(dateString);
            let month = formatDate.getMonth() + 1;
            let date = formatDate.getDate();
            date = date < 10 ? `0${date}` : date;
            month = month < 10 ? `0${month}` : month;
            return `${formatDate.getFullYear()}-${month}-${date}`;
        }
        return null;
    }

    const [actualSD, setActualSD] = useState(formatDateString(info.actualSD || ''));
    const [actualED, setActualED] = useState(formatDateString(info.actualED || ''));
    const [actualST, setActualST] = useState(info.actualST);
    const [actualET, setActualET] = useState(info.actualET);
    const [scheduleSD, setScheduleSD] = useState(formatDateString(info.scheduleSD || ''));
    const [scheduleED, setScheduleED] = useState(formatDateString(info.scheduleED || ''));
    const [scheduleST, setScheduleST] = useState(info.scheduleST);
    const [scheduleET, setScheduleET] = useState(info.scheduleET);
    const [location, setLocation] = useState(info.location);
    const [description, setDescription] = useState(info.description);
    const [crType, setCRType] = useState(info.crType);
    const [riskLevel, setRiskLevel] = useState(info.riskLevel);
    const [impact, setImpact] = useState(info.impact);
    const [services, setServices] = useState(info.services);
    const [releaseNotes, setReleaseNotes] = useState(info.releaseNotes);
    const [verification, setVerification] = useState(info.verification);
    const [approvers, setApprovers] = useState(ApproverActivity || []);
    const [planDuration, setTaskDuration] = useState('');
    const [taskPlan, setTaskPlan] = useState('');
    const [planOwner, setPlanOwner] = useState('');
    const [rollbackDuration, setRollbackDuration] = useState('');
    const [rollbackTask, setRollbackPlan] = useState('');
    const [rollbackOwner, setRollbackOwner] = useState('');
    const [rollbackAssociateTask, setRollbackAssociateTask] = useState('');
    const [detailActivity, setDetailActivities] = useState([]);
    const [rollbackActivity, setRollbackActivities] = useState([]);

    const onSubmitApproves = (approver) => {
        setApprovers(approver);
    }

    const onNext = () => {
        setStep(step + 1);
    }
    const onCancel = () => {
        setStep(0);
        destroyPopup();

    }


    const onSave = () => {
        const post = {
            detailActivity, rollbackActivity, actualED, actualET, actualSD,
            actualST, description, crType, riskLevel, impact, location, releaseNotes, scheduleED, scheduleET, scheduleSD, scheduleST, services, verification, approvers
        };
        onSaveClick(activityDetails, post);
    }
    const multiApprovers = Array.isArray(approverList) ? approverList.map(approver => ({ label: approver.userName, approverName: approver.userName, value: approver.officialEmail, approverMail: approver.officialEmail })) : [];
    const duration = _.range(5, 125, 5);

    const handleDetailPlanAdd = () => {
        if (!taskPlan || !planOwner || !planDuration) {
            const item = !taskPlan ? "task name" : !planOwner ? "task owner" : !planDuration ? "task duration" : "";
            return infoToast(`Please provide ${item} to add detail activity`);
        }
        let data = {};
        const [owner, name] = planOwner.split(',');
        data['taskId'] = detailActivity.length;
        data['order'] = Math.random();
        data['description'] = taskPlan;
        data['duration'] = planDuration;
        data['owner'] = owner;
        data['name'] = name;
        setDetailActivities([...detailActivity, data]);
        setTaskPlan('');
        setPlanOwner('');
        setTaskDuration('');
    }

    const handleRollbackAdd = () => {
        if (!rollbackTask || !rollbackOwner || !rollbackDuration || !rollbackAssociateTask) {
            const item = !rollbackTask ? "rollback name" : !rollbackOwner ? "rollback owner" : !rollbackDuration ? "rollback duration" : !rollbackAssociateTask ? 'associate task ' : "";
            return infoToast(`Please provide ${item} to add rollback activity`);
        }
        let data = {};
        const [owner, name] = rollbackOwner.split(',');
        data['order'] = Math.random();
        data['description'] = rollbackTask;
        data['taskId'] = rollbackAssociateTask;
        data['owner'] = owner;
        data['name'] = name;
        data['duration'] = rollbackDuration;
        setRollbackActivities([...rollbackActivity, data]);
        setRollbackDuration('');
        setRollbackPlan('');
        setRollbackOwner('');
        setRollbackAssociateTask('');
    }

    let getDetailActivityList = () => Array.isArray(detailActivity) && detailActivity.map((detail) =>
        <tr key={`${detail.taskId}`}>
            <td>{detail.taskId}</td>
            <td>
                <div name="description" >{detail.description}</div>
            </td>
            <td>{detail.duration}</td>
            <td>
                <a title={detail.name}>{detail.name}</a>
            </td>
            <td title={"Delete"} style={{ width: "10%" }}><a href="javascript:void();"><i className="fa fa-minus-square p-2" /* onClick={this.handleDARemove.bind(this, da)} */></i></a></td>
        </tr>);

    let getRollbackActivityList = () => Array.isArray(rollbackActivity) && rollbackActivity.map((detail) =>
        <tr key={`${detail.taskId}`}>
            <td>{detail.taskId}</td>
            <td>
                <div>{detail.description}</div>
            </td>
            <td>{detail.duration}</td>
            <td>
                <a title={detail.name}>{detail.name}</a>
            </td>
            <td title={"Delete"} style={{ width: "10%" }}><a href="javascript:void();"><i className="fa fa-minus-square p-2" /* onClick={this.handleDARemove.bind(this, da)} */></i></a></td>
        </tr>);

    return (
        <div className="modal edit-details" id="EditDetailsModal" data-backdrop="static" data-keyboard="false" >
            <div className="modal-dialog">
                <div className="modal-content custom">
                    <div className="modal-body">
                        <div className="container">
                            <div className="row">
                                <h4 className="modal-title title">Edit Info Details</h4>
                                <button type="button" className="close clos" data-dismiss="modal" style={{ marginRight: "30px" }} onClick={onCancel}>&times;</button>
                            </div>
                            <h4 className="activity-id">{activityDetails ? activityDetails.activityId : ''}</h4>
                        </div>


                        <div className="container">
                            <Process steps={steps} currentStep={step} setStep={setStep} />
                            <div className="tab-content" id="myTabContent">
                                <div className={step === 0 ? "tab-pane fade show active" : "tab-pane fade"} id="schedule" role="tabpanel" aria-labelledby="schedule-tab">
                                    <div className="form-group">
                                        <div className="form-group">
                                            <br></br>
                                            <label className="text-label" for="sel1">Client</label><br></br>
                                            <input className="input-style" type="text" id="client"
                                                value={activityDetails ? activityDetails.clientName : ''} disabled />
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col">
                                                    <text className="text-label">Scheduled Start</text>
                                                </div>
                                                <div className="col">
                                                    <text className="text-label">Scheduled End</text>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col">
                                                    <input className="text-label" type="date" id="fromdate" name="fromdate"
                                                        defaultValue={scheduleSD}
                                                        value={scheduleSD}
                                                        onChange={(e) => setScheduleSD(formatDateString(new Date(e.target.value)))} />
                                                </div>
                                                <div className="col">
                                                    <input className="text-label" type="date" id="todate" name="todate"
                                                        defaultValue={scheduleED}
                                                        value={scheduleED}
                                                        onChange={(e) => setScheduleED(formatDateString(new Date(e.target.value)))} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col">
                                                    <input className="text-label" type="time" id="fromtime" name="fromtime"
                                                        defaultValue={scheduleST}
                                                        value={scheduleST}
                                                        onChange={(e) => setScheduleST(e.target.value)} />
                                                </div>
                                                <div className="col">
                                                    <input className="text-label" type="time" id="totime" name="totime"
                                                        defaultValue={scheduleET}
                                                        value={scheduleET}
                                                        onChange={(e) => setScheduleET(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div className={step === 1 ? "tab-pane fade show active" : "tab-pane fade"} id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                    <div className="form-group">
                                        <div className="form-group">
                                            <br></br>
                                            <label className="text-label" for="sel1">Location</label><br></br>
                                            <input className="input-style" type="text" id="client" value={location}
                                                onChange={(e) => setLocation(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col">
                                                    <text className="text-label">Type</text>
                                                </div>
                                                <div className="col">
                                                    <text className="text-label">Risk Level</text>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col">
                                                    <select value={crType} onChange={(e) => setCRType(e.target.value)}>
                                                        <option value=''>Select Type</option>
                                                        {crTypes && crTypes.map((type, i) => {
                                                            return <option key={'typeoption' + i} value={type.id}>{type.name}</option>
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
                                                        <option value=''>Select Level</option>
                                                        {risks && risks.map((risk, i) => {
                                                            return <option key={'riskoption' + i} value={risk.level}>{risk.level}</option>
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col">
                                                    <text className="text-label">Actual Start</text>
                                                </div>
                                                <div className="col">
                                                    <text className="text-label">Actual End</text>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col">
                                                    <input className="text-label" type="date" id="fromdate" name="fromdate"
                                                        defaultValue={actualSD}
                                                        value={actualSD}
                                                        onChange={(e) => setActualSD(formatDateString(new Date(e.target.value).toISOString()))} />

                                                </div>
                                                <div className="col">
                                                    <input className="text-label" type="date" id="todate" name="todate"
                                                        defaultValue={actualED}
                                                        value={actualED}
                                                        onChange={(e) => setActualED(formatDateString(new Date(e.target.value).toISOString()))} />

                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col">
                                                    <input className="text-label" type="time" id="fromtime" name="fromtime"
                                                        value={actualST}
                                                        defaultValue={actualST}
                                                        onChange={(e) => setActualST(e.target.value)} />
                                                </div>
                                                <div className="col">
                                                    <input className="text-label" type="time" id="totime" name="totime"
                                                        defaultValue={actualET}
                                                        value={actualET}
                                                        onChange={(e) => setActualET(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="text-label" for="sel1">Description</label>
                                        <textarea className="form-control" rows="3" id="comment"
                                            defaultValue={description}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}></textarea>
                                    </div>
                                </div>

                                <div className={step === 2 ? "tab-pane fade show active" : "tab-pane fade"} id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                    <div className="form-group">
                                        <br></br>
                                        <div className="form-group">
                                            <label className="text-label" for="sel1">Release Notes</label>
                                            <textarea className="form-control" rows="3" id="comment"
                                                defaultValue={releaseNotes}
                                                value={releaseNotes}
                                                onChange={(e) => setReleaseNotes(e.target.value)}></textarea>
                                        </div>

                                        <div className="form-group">
                                            <label className="text-label" for="sel1">Scope of Impact</label>
                                            <textarea className="form-control" rows="3" id="comment"
                                                defaultValue={impact}
                                                value={impact}
                                                onChange={(e) => setImpact(e.target.value)}></textarea>
                                        </div>

                                        <div className="form-group">
                                            <label className="text-label" for="sel1">Testing of Services After Implementation</label>
                                            <textarea className="form-control" rows="3" id="comment"
                                                defaultValue={services}
                                                value={services}
                                                onChange={(e) => setServices(e.target.value)}></textarea>
                                        </div>

                                        <div className="form-group">
                                            <label className="text-label" for="sel1">Verification of Impact</label>
                                            <textarea className="form-control" rows="3" id="comment"
                                                defaultValue={verification}
                                                value={verification}
                                                onChange={(e) => setVerification(e.target.value)}></textarea>
                                        </div>

                                    </div>
                                </div>

                                <div className={step === 3 ? "tab-pane fade show active" : "tab-pane fade"} id="approval" role="tabpanel" aria-labelledby="approval-tab">
                                    <div className="col activity-plan-col-style">
                                        <text className="activity-approval-header">Approvers</text>
                                        <div class="activity-plan-input-col-style">
                                            <div style={{ width: '25rem' }}>
                                                <MultiSelect
                                                    options={multiApprovers}
                                                    value={approvers}
                                                    onChange={onSubmitApproves}
                                                    labelledBy={"Select"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="edit-details-footer" style={{ textAlign: 'center' }}>
                        <button type="button" className="details-save-btn" onClick={step <= 2 ? onNext : onSave}>{step <= 2 ? 'Next' : 'Submit'}</button>
                        <button type="button" className="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal" onClick={onCancel}>Cancel</button>
                    </div>

                </div>
            </div>
        </div>
    );
}
