import React, { useState } from 'react';
import _ from "lodash";
import './modal.css';
import { failureToast, infoToast } from '../../../actions/commons/toaster';

export default function AddTask({ activity, onSaveClick
    , statusList, userList }) {
    let details = activity && Array.isArray(activity.DetailActivity) && activity.DetailActivity.length ? activity.DetailActivity : [{}];
    let rollback = activity && Array.isArray(activity.RollbackActivity) && activity.RollbackActivity.length ? activity.RollbackActivity : [{}];
    let duration = _.range(5, 125, 5);

    let information = activity ? activity.Information : [];
    let info = information && information[0] ? information[0] : {};

    const [txtDATask, setTxtDATask] = useState(details[0].description);
    const [txtRBTask, setTxtRBTask] = useState(rollback[0].description);
    const [ddlDATaskOwner, setDdlDATaskOwner] = useState([details[0].owner, details[0].ownerName]);
    const [ddlDADuration, setDdlDADuration] = useState(details[0].duration);
    const [ddlRBTaskOwner, setDdlRBTaskOwner] = useState([rollback[0].owner, rollback[0].ownerName]);
    const [ddlRBDuration, setDdlRBDuration] = useState(rollback[0].duration);

    const [planDuration, setTaskDuration] = useState('');
    const [taskPlan, setTaskPlan] = useState('');
    const [planOwner, setPlanOwner] = useState('');

    const [ddlAssociateTask, setDdlAssociateTask] = useState('');
    const [rollbackDuration, setRollbackDuration] = useState('');
    const [rollbackTask, setRollbackPlan] = useState('');
    const [rollbackOwner, setRollbackOwner] = useState('');
    const [rollbackAssociateTask, setRollbackAssociateTask] = useState('');
    const [detailActivity, setDetailActivities] = useState([]);
    const [rollbackActivity, setRollbackActivities] = useState([]);

    const [taskActualSD, setTaskActualSD] = useState('');
    const [taskActualED, setTaskActualED] = useState('');
    const [taskActualST, setTaskActualST] = useState('');
    const [taskActualET, setTaskActualET] = useState('');
    const [taskComments, setTaskComments] = useState('');

    const [rollbackActualSD, setRollbackActualSD] = useState('');
    const [rollbackActualED, setRollbackActualED] = useState('');
    const [rollbackActualST, setRollbackActualST] = useState('');
    const [rollbackActualET, setRollbackActualET] = useState('');
    const [rollbackcomments, setRollbackComments] = useState('');



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

    const handleDAAdd = () => {
        let data = {};
        data.description = txtDATask ? txtDATask : "";
        data.owner = ddlDATaskOwner ? ddlDATaskOwner.split(",")[0] : "";
        data.ownerName = ddlDATaskOwner ? ddlDATaskOwner.split(",")[1] : "";
        data.duration = ddlDADuration ? ddlDADuration : "";
        // data.startTime = actualSD ? actualSD : "";
        // data.endTime = actualED ? actualED : "";
        // data.comments = comments ? comments : "";

        if (!data.description || !data.owner || !data.duration) {
            const item = !data.description ? "description" : !data.owner ? "owner" : !data.duration ? "duration" : "";
            failureToast(`Please provide ${item} to add detail activity`);
            return;
        }
        let maxTask = (detailActivity.length > 0) ? (_.maxBy(detailActivity, x => x.taskId)).taskId : 0;
        if (data.description && data.owner && data.duration) {
            data.taskId = maxTask + 1;
            data.order = Math.random();
            var _detailActivity = JSON.parse(JSON.stringify(details));
            _detailActivity = _detailActivity.filter(_detailActivity, function (obj) { return obj.order != -1 });
            details.push(data);
            _detailActivity.push(data);
            _detailActivity = _detailActivity.sort((a, b) => a.taskId - b.taskId);
        }
        localStorage.setItem("detailActivity", JSON.stringify(details));
        setDetailActivities(_detailActivity);
        setTxtDATask("");
        setDdlDATaskOwner("");
        setDdlDADuration("");
    }

    const handleDARemove = (da) => {
        var rollData = rollbackActivity.some(x => x["taskId"] == da.taskId.toString());
        if (rollData) {
            failureToast("Please remove associated rollbacks for this activity and try again !!");
            return;
        }
        let _detailActivity = JSON.parse(JSON.stringify(detailActivity));
        let tempDA = JSON.parse(JSON.stringify(detailActivity));
        let sL = statusList;
        var deleteId = sL.filter(x => x.data.some(a => a.value === 2));
        if (deleteId.length < 1) {
            failureToast("Error in getting info from server. Please try again !!");
            return;
        }
        var index = _detailActivity.findIndex(obj => obj["taskId"] == da.taskId);
        if (index > -1) {
            let record = Object.assign({}, _detailActivity[index]);
            var daIndex = details.findIndex(obj => obj["taskId"] == record.taskId);
            if (daIndex > -1) {
                if (record.hasOwnProperty("detailActivityId")) {
                    record = Object.assign({}, {
                        ["detailActivityId"]: record["detailActivityId"],
                        "status": record["status"]
                        , "order": record["order"]
                    });
                    record.status = deleteId[0].id;
                    record.taskId = -1;
                    record.order = -1;
                    record.modified = 1
                    details[daIndex] = record;
                } else {
                    details.splice(daIndex, 1);
                }
                localStorage.setItem("detailActivity", JSON.stringify(details));
                tempDA.splice(index, 1);
                setDetailActivities(tempDA);
            } else {
                failureToast("Something went wrong while removing record. Please try again !!");
                return;
            }
        } else {
            failureToast("Something went wrong while removing record. Please try again !!");
            return;
        }
    }

    const handleRBAdd = () => {
        let data = {};
        data.description = txtRBTask ? txtRBTask : "";
        data.taskId = ddlAssociateTask ? ddlAssociateTask : "";
        data.owner = ddlRBTaskOwner ? ddlRBTaskOwner.split(",")[0] : "";
        data.ownerName = ddlRBTaskOwner ? ddlRBTaskOwner.split(",")[1] : "";
        data.duration = ddlRBDuration ? ddlRBDuration : "";
        // data.startTime = actualSD ? actualSD : "";
        // data.endTime = actualED ? actualED : "";
        // data.comments = comments ? comments : "";

        if (!data.description || !data.owner || !data.duration || !data.taskId) {
            return failureToast("Please provide required field to add rollback activity");
        }
        if (data.description && data.owner && data.duration && data.taskId) {
            data.order = Math.random();
            var _rollback = JSON.parse(JSON.stringify(rollback));
            _rollback = _rollback.filter(_rollback, function (obj) { return obj.order != -1 });
            rollback.push(data);
            _rollback.push(data);
            _rollback = _rollback.sort((a, b) => a.taskId - b.taskId);
        }
        localStorage.setItem("rollback", JSON.stringify(rollback));
        setTxtRBTask("");
        setDdlAssociateTask("");
        setDdlRBTaskOwner("");
        setDdlRBDuration("");
    }

    const handleRBRemove = (rb) => {
        let _rollback = JSON.parse(JSON.stringify(rollbackActivity));
        let tempRB = JSON.parse(JSON.stringify(rollbackActivity));
        let sL = statusList;
        var deleteId = sL.filter(x => x.data.some(a => a.value === 2));
        if (deleteId.length < 1) {
            return failureToast("Error in getting info from server. Please try again !!");
        }
        var index = _rollback.findIndex(obj => (obj["description"] == rb.description && obj["taskId"] == rb.taskId));
        if (index > -1) {
            let record = Object.assign({}, _rollback[index]);
            var rbIndex = rollback.findIndex(obj => (obj["description"] == record.description && obj["taskId"] == record.taskId));
            if (rbIndex > -1) {
                if (record.hasOwnProperty("rollbackActivityId")) {
                    record = Object.assign({}, {
                        ["rollbackActivityId"]: record["rollbackActivityId"],
                        "status": record["status"]
                        , "order": record["order"]
                    });
                    record.status = deleteId[0].id;
                    record.order = -1;
                    record.modified = 1
                    rollback[rbIndex] = record;
                } else {
                    rollback.splice(rbIndex, 1);
                }
                localStorage.setItem("rollback", JSON.stringify(rollback));
                tempRB.splice(index, 1);
                setRollbackActivities(tempRB);
            } else {
                failureToast("Something went wrong while removing record. Please try again !!");
                return;
            }
        } else {
            failureToast("Something went wrong while removing record. Please try again !!");
            return;
        }

    }

    const handleDetailPlanAdd = () => {
        if (!taskPlan || !planOwner || !planDuration) {
            const item = !taskPlan ? "task name" : !planOwner ? "task owner" : !planDuration ? "task duration" : "";
            return infoToast(`Please provide ${item} to add detail activity`);
        }
        let data = {};
        const [owner, name,] = planOwner.split(',');
        data['taskId'] = detailActivity.length;
        data['order'] = Math.random();
        data['description'] = taskPlan;
        data['duration'] = planDuration;
        data['owner'] = owner;
        data['name'] = name;
        data['startTime'] = `${taskActualSD + '  ' + taskActualST}`;
        data['endTime'] = `${taskActualED + '  ' + taskActualET}`;
        data['comments'] = taskComments;
        setDetailActivities([...detailActivity, data]);
        setTaskPlan('');
        setPlanOwner('');
        setTaskDuration('');
        setTaskActualSD('');
        setTaskActualED('');
        setTaskActualST('');
        setTaskActualET('');
        setTaskComments('');
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
        data['startTime'] = `${rollbackActualSD + '  ' + rollbackActualST}`;
        data['endTime'] = `${rollbackActualED + '  ' + rollbackActualET}`;
        data['comments'] = rollbackcomments;
        setRollbackActivities([...rollbackActivity, data]);
        setRollbackDuration('');
        setRollbackPlan('');
        setRollbackOwner('');
        setRollbackAssociateTask('');
        setRollbackActualSD('');
        setRollbackActualED('');
        setRollbackActualST('');
        setRollbackActualET('');
        setRollbackComments('');
    }

    const getDetailActivityList = () => {
        return Array.isArray(detailActivity) && detailActivity.map((da) =>
            <tr key={da.taskId}>
                <td>{da.taskId}</td>
                <td>
                    <textarea rows={1} cols={20} name="description" style={{ "resize": "None" }} value={da.description} disabled />
                </td>
                <td>{da.duration}</td>
                <td>
                    <a title={da.ownerName}>{da.ownerName}</a>
                </td>
                <td title={"Delete"} style={{ width: "10%" }}><a href="javascript:void();"><i className="fa fa-minus-square p-2"
                    onClick={() => handleDARemove(da)}></i></a></td>
            </tr>);
    }

    const getRollbackActivityList = () => {
        return Array.isArray(rollbackActivity) && rollbackActivity.map((rb) => {
            return (
                <tr key={rb.taskId}>
                    <td>{rb.taskId}</td>
                    <td>
                        <textarea rows={1} cols={20} style={{ "resize": "None" }} value={rb.description} disabled />
                    </td>
                    <td>{rb.duration}</td>
                    <td>
                        <a title={rb.ownerName}>{rb.ownerName}</a>
                    </td>
                    <td title={"Delete"} style={{ width: "10%" }}><a href="javascript:void();"><i className="fa fa-minus-square p-2"
                        onClick={() => handleRBRemove(rb)}></i></a></td>
                </tr>
            )
        });
    }
    const onSave = () => {
        const post = {
            detailActivity, rollbackActivity
        };
        onSaveClick(activity, post);
    }
    // const cancelPA = () => {
    //     localStorage.removeItem("rollback");
    //     localStorage.removeItem("detailActivity");
    //     localStorage.removeItem("approverActivity");
    //     localStorage.removeItem("paAttachment");
    // }

    return (
        <div className="modal" id="AddTaskModal">
            <div className="modal-dialog">
                <div className="modal-content custom">
                    <div className="modal-body">
                        <div className="container">
                            <div className="row">
                                <button type="button" className="close clos" data-dismiss="modal"
                                    style={{ marginRight: "30px" }}>&times;</button>
                            </div>
                        </div>
                        <div className="form" style={{ marginTop: "50px", marginRight: "20px" }}>
                            <div className="col activity-plan-col-style">
                                <div className="row activity-plan-row-style">
                                    <div class="col">
                                        <text><b>Detailed Activity Plan</b></text>
                                        <button className="btn btn-secondary activity-plan-button" onClick={handleDetailPlanAdd}>+ Add</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div class="col">
                                        <label htmlFor="text" className="login-label">Tasks<span className='text-danger'>*</span></label>
                                        <input type="text" name="taskPlan" value={taskPlan} onChange={(e) => setTaskPlan(e.target.value)} />
                                    </div>
                                    <div class="col">
                                        <label htmlFor="text" className="login-label">Task Owner<span className='text-danger'>*</span></label>
                                        <select name='planOwner' value={planOwner} onChange={(e) => setPlanOwner(e.target.value)}>
                                            <option value=''>Select</option>
                                            {
                                                Array.isArray(userList) && userList.map((user) => <option key={user.userId} value={user.userId + "," + user.userName} name={user.userName}>{user.userName}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div class="col activity-plan-input-col-style">
                                        <label htmlFor="password" className="login-label">Duration<span className='text-danger'>*</span></label>
                                        <select name='planDuration' value={planDuration} onChange={(e) => setTaskDuration(e.target.value)}>
                                            <option value=''>Select</option>
                                            {duration.map((number) => <option key={number} value={number} name={number}>{number}</option>)}
                                        </select>
                                    </div>
                                    <div class="col">
                                    </div>
                                </div>

                                <div className="form-group" style={{ padding: "10px" }}>
                                    <div className="row">
                                        <div className="col">
                                            <text className="text-label">Actual Start</text>
                                        </div>
                                        <div className="col">
                                            <text className="text-label">Actual End</text>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ padding: "10px" }}>
                                    <div className="row">
                                        <div className="col">
                                            <input className="text-label" type="date" id="fromdate" name="fromdate"
                                                defaultValue={taskActualSD}
                                                value={taskActualSD}
                                                onChange={(e) => setTaskActualSD(formatDateString(new Date(e.target.value).toISOString()))}
                                            />

                                        </div>
                                        <div className="col">
                                            <input className="text-label" type="date" id="todate" name="todate"
                                                defaultValue={taskActualED}
                                                value={taskActualED}
                                                onChange={(e) => setTaskActualED(formatDateString(new Date(e.target.value).toISOString()))}
                                            />

                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ padding: "10px" }}>
                                    <div className="row">
                                        <div className="col">
                                            <input className="text-label" type="time" id="fromtime" name="fromtime"
                                                value={taskActualST}
                                                defaultValue={taskActualST}
                                                onChange={(e) => setTaskActualST(e.target.value)}
                                            />
                                        </div>
                                        <div className="col">
                                            <input className="text-label" type="time" id="totime" name="totime"
                                                defaultValue={taskActualET}
                                                value={taskActualET}
                                                onChange={(e) => setTaskActualET(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group" style={{ padding: "10px" }}>
                                    <label className="text-label" for="sel1">Add comments on task</label>
                                    <textarea className="form-control" rows="3" id="comment"
                                        defaultValue={taskComments}
                                        value={taskComments}
                                        onChange={(e) => setTaskComments(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="row activity-plan-row-style">
                                    <div class="col">
                                        <text><b>Rollback Plan</b></text>
                                        <button className="btn btn-secondary activity-plan-button" onClick={handleRollbackAdd}>+ Add</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div class="col">
                                        <label htmlFor="text" className="login-label">Rollback<span className='text-danger'>*</span></label>
                                        <input type="text" name="rollbackTask" value={rollbackTask} onChange={(e) => setRollbackPlan(e.target.value)} />
                                    </div>
                                    <div class="col">
                                        <label htmlFor="text" className="login-label">Associate Task<span className='text-danger'>*</span></label>
                                        <select name='rollbackAssociateTask' value={rollbackAssociateTask} onChange={(e) => setRollbackAssociateTask(e.target.value)}>
                                            <option value=''>Select</option>
                                            {
                                                Array.isArray(detailActivity) && detailActivity.map((da) => <option key={da.taskId} value={da.taskId} name={da.description}>{da.description}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div class="col activity-plan-input-col-style">
                                        <label htmlFor="text" className="login-label">Task Owner<span className='text-danger'>*</span></label>
                                        <select name='rollbackOwner' value={rollbackOwner} onChange={(e) => setRollbackOwner(e.target.value)}>
                                            <option value=''>Select</option>
                                            {
                                                Array.isArray(userList) && userList.map((user) => <option key={user.userId} value={user.userId + "," + user.userName} name={user.userName}>{user.userName}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div class="col activity-plan-input-col-style">
                                        <label htmlFor="text" className="login-label">Duration<span className='text-danger'>*</span></label>
                                        <select name='rollbackDuration' value={rollbackDuration} onChange={(e) => setRollbackDuration(e.target.value)}>
                                            <option value=''>Select</option>
                                            {duration.map((number) => <option key={number} value={number} name={number}>{number}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group" style={{ padding: "10px" }}>
                                    <div className="row">
                                        <div className="col">
                                            <text className="text-label">Actual Start</text>
                                        </div>
                                        <div className="col">
                                            <text className="text-label">Actual End</text>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ padding: "10px" }}>
                                    <div className="row">
                                        <div className="col">
                                            <input className="text-label" type="date" id="fromdate" name="fromdate"
                                                defaultValue={rollbackActualSD}
                                                value={rollbackActualSD}
                                                onChange={(e) => setRollbackActualSD(formatDateString(new Date(e.target.value).toISOString()))}
                                            />

                                        </div>
                                        <div className="col">
                                            <input className="text-label" type="date" id="todate" name="todate"
                                                defaultValue={rollbackActualED}
                                                value={rollbackActualED}
                                                onChange={(e) => setRollbackActualED(formatDateString(new Date(e.target.value).toISOString()))}
                                            />

                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ padding: "10px" }}>
                                    <div className="row">
                                        <div className="col">
                                            <input className="text-label" type="time" id="fromtime" name="fromtime"
                                                value={rollbackActualST}
                                                defaultValue={rollbackActualST}
                                                onChange={(e) => setRollbackActualST(e.target.value)}
                                            />
                                        </div>
                                        <div className="col">
                                            <input className="text-label" type="time" id="totime" name="totime"
                                                defaultValue={rollbackActualET}
                                                value={rollbackActualET}
                                                onChange={(e) => setRollbackActualET(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group" style={{ padding: "10px" }}>
                                    <label className="text-label" for="sel1">Add comments on task</label>
                                    <textarea className="form-control" rows="3" id="comment"
                                        defaultValue={rollbackcomments}
                                        value={rollbackcomments}
                                        onChange={(e) => setRollbackComments(e.target.value)}
                                    ></textarea>
                                </div>


                                <div className="row activity-plan-row-style">
                                    <div className="col">
                                        <text className="activity-plan-table-header-style">Detailed Activity Plan</text>
                                        <div className="tableFixHead overflow-auto">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Task No</th>
                                                        <th scope="col">Task</th>
                                                        <th scope="col">Duration (Min)</th>
                                                        <th scope="col">Owner</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="tbody-style">
                                                    {getDetailActivityList()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row activity-plan-row-style">
                                    <div className="col">
                                        <text className="activity-plan-table-header-style">Rollback Plan</text>
                                        <div className="tableFixHead overflow-auto">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Task No</th>
                                                        <th scope="col">Task</th>
                                                        <th scope="col">Duration (Min)</th>
                                                        <th scope="col">Owner</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="tbody-style">
                                                    {getRollbackActivityList()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-primary save-btn" onClick={onSave}>Save</button>
                                <button type="button" className="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
