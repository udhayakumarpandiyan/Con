import React, { useState } from 'react';

export default function EditTaskDetails({ onSaveClick, statusList, selectedTask, activityDetails }) {
    let startTime;
    let endTime;
    if (selectedTask) {
        startTime = selectedTask.startTime.split(' ');
        endTime = selectedTask.endTime.split(' ');
    }
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

    const [actualSD, setActualSD] = useState(formatDateString(startTime && startTime[0] || ''));
    const [actualED, setActualED] = useState(formatDateString(endTime && endTime[0] || ''));
    const [actualST, setActualST] = useState(startTime && startTime[2]);
    const [actualET, setActualET] = useState(endTime && endTime[2]);
    const [comments, setComments] = useState(selectedTask ? selectedTask.comments : '');
    const [status, setStatus] = useState(selectedTask ? selectedTask.status : '');

    const onSave = () => {
        const post = {
            actualSD, actualED, actualST, actualET, comments, status
        };
        onSaveClick(activityDetails, post);
    }

    const onStatusChange = (e) => {
        setStatus(e.target.value)
    }
    return (
        <div className="modal" id="EditTaskDetailsModal" data-backdrop="static" data-keyboard="false" >
            <div className="modal-dialog">
                <div className="modal-content custom">
                    <div className="modal-body">
                        <div className="container">
                            <div className="row">
                                <h4 className="modal-title title">Edit Task Details</h4>
                                <button type="button" className="close clos" data-dismiss="modal" style={{ marginRight: "30px" }}>&times;</button>
                            </div>

                        </div>
                        <div className="form-group" style={{ padding: "10px 50px" }}>
                            <div className="row">
                                <div className="col">
                                    <text className="text-label">Task Status</text>
                                </div>

                            </div>
                        </div>
                        <div className="form-group" style={{ padding: "10px 50px" }}>
                            <div className="row">
                                <div className="col">
                                    <select value={status} onChange={onStatusChange}>{
                                        statusList && statusList.map((status, i) => {
                                            return <option key={'status' + i} value={status.id}>{status.name}</option>
                                        })
                                    }</select>
                                </div>

                            </div>
                        </div>
                        <div className="form-group" style={{ padding: "10px 50px" }}>
                            <div className="row">
                                <div className="col">
                                    <text className="text-label">Actual Start</text>
                                </div>
                                <div className="col">
                                    <text className="text-label">Actual End</text>
                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ padding: "10px 50px" }}>
                            <div className="row">
                                <div className="col">
                                    <input className="text-label" type="date" id="fromdate" name="fromdate"
                                        defaultValue={startTime && startTime[0]}
                                        value={actualSD}
                                        onChange={(e) => setActualSD(formatDateString(new Date(e.target.value).toISOString()))}
                                    />

                                </div>
                                <div className="col">
                                    <input className="text-label" type="date" id="todate" name="todate"
                                        defaultValue={endTime && endTime[0]}
                                        value={actualED}
                                        onChange={(e) => setActualED(formatDateString(new Date(e.target.value).toISOString()))}
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ padding: "10px 50px" }}>
                            <div className="row">
                                <div className="col">
                                    <input className="text-label" type="time" id="fromtime" name="fromtime"
                                        value={actualST}
                                        defaultValue={startTime && startTime[2]}
                                        onChange={(e) => setActualST(e.target.value)}
                                    />
                                </div>
                                <div className="col">
                                    <input className="text-label" type="time" id="totime" name="totime"
                                        defaultValue={endTime && endTime[2]}
                                        value={actualET}
                                        onChange={(e) => setActualET(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group" style={{ padding: "10px 50px" }}>
                            <label className="text-label" for="sel1">Add comments on task</label>
                            <textarea className="form-control" rows="3" id="comment"
                                defaultValue={selectedTask ? selectedTask.comments : comments}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="edit-details-footer" style={{ textAlign: 'center' }}>
                            <button type="button" className="btn btn-outline-primary save-btn" onClick={onSave}>Save</button>
                            <button type="button" className="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal">Cancel</button>
                        </div>
                    </div >
                </div>

            </div>
        </div>
    )
}