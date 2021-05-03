import React, { useState } from 'react';

export default function EditPlanDetails({ onSaveClick, activityDetails }) {
    let information = activityDetails ? activityDetails.Information : [];
    let info = information && information[0] ? information[0] : {};
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
    const [description, setComments] = useState(info.description);

    const onSave = () => {
        let riskLevel = info.riskLevel;
        const post = {
            actualED, actualET, actualSD,
            actualST, description, riskLevel
        };
        onSaveClick(activityDetails, post);
    }


    return (
        <div className="modal" id="EditPlanDetailsModal" data-backdrop="static" data-keyboard="false" >
            <div className="modal-dialog">
                <div className="modal-content custom">
                    <div className="modal-body">
                        <div className="container">
                            <div className="row">
                                <h4 className="modal-title title">Edit Plan Details</h4>
                                <button type="button" className="close clos" data-dismiss="modal" style={{ marginRight: "30px" }}>&times;</button>
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
                                        defaultValue={actualSD}
                                        value={actualSD}
                                        onChange={(e) => setActualSD(formatDateString(new Date(e.target.value).toISOString()))}
                                    />

                                </div>
                                <div className="col">
                                    <input className="text-label" type="date" id="todate" name="todate"
                                        defaultValue={actualED}
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
                                        defaultValue={actualST}
                                        onChange={(e) => setActualST(e.target.value)}
                                    />
                                </div>
                                <div className="col">
                                    <input className="text-label" type="time" id="totime" name="totime"
                                        defaultValue={actualET}
                                        value={actualET}
                                        onChange={(e) => setActualET(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group" style={{ padding: "10px 50px" }}>
                            <label className="text-label" for="sel1">Add overall comments on plan execution</label>
                            <textarea className="form-control" rows="3" id="comment"
                                defaultValue={description}
                                value={description}
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