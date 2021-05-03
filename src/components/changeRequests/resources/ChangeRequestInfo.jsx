import React from 'react';
import Loader from '../../resources/Loader';
import { masterApiUrls } from '../../../util/apiManager';
import './change-request-info.css';

export default function ChangeRequestInfo({ activity = {}, onCopyClick, onObseleteClick, onSubmitClick, loading, userId, generateToken }) {
    let information = activity ? activity.Information : [];
    let info = information && information[0] ? information[0] : null;

    const formatDateString = (dateString) => {
        if (dateString) {
            let formatDate = new Date(dateString);
            let month = formatDate.getMonth() + 1;
            let date = formatDate.getDate();
            date = date < 10 ? `0${date}` : date;
            month = month < 10 ? `0${month}` : month;
            return `${date}/${month}/${formatDate.getFullYear()}`;
        }
        return null;
    }

    const downloadFile = async (key) => {
        const { generateToken: apiToken } = await generateToken();
        window.open(`${masterApiUrls.downloadFile}fileName=${key}&userId=${userId}&apiToken=${apiToken}`);
    }

    const getDocumentList = () => {
        return Array.isArray(info) &&
            Array.isArray(info.attachments) && info.attachments.map((doc, d) => {
                return (
                    <tr key={d}>
                        <td className="pa_download_action_table" title={doc.fileName}>{doc.fileName}</td>
                        <td className="pa_download_action_table" style={{ textAlign: "center" }}>
                            <i className="fa fa-download float-sm-center" title="Download" onClick={() => downloadFile(doc.key)}></i>
                        </td>
                    </tr>
                )
            });
    }

    return (
        <div className="modal" id="ChangeRequestInfoModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title  modal-title-style">Change Request</h4>
                        <button type="button" className="close close-btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <Loader loading={loading} />
                        <div className="container">
                            <h5 className="header-style">Info</h5>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <table class="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <th>Initiated By</th>
                                                <td>{activity && activity.createdByName}</td>
                                            </tr>
                                            <tr>
                                                <th>Scheduled Start</th>
                                                <td>{info ? `${formatDateString(info.scheduleSD)}, ${information && info.scheduleST}` : ""}</td>
                                            </tr>
                                            <tr>
                                                <th>Scheduled End</th>
                                                <td>{info ? `${formatDateString(info.scheduleED)}, ${information && info.scheduleET}` : ""}</td>
                                            </tr>
                                            <tr>
                                                <th>Ticket ID</th>
                                                <td>{activity && activity.ticketId}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col">
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <th>Initiated On</th>
                                                <td>{formatDateString(activity && activity.actionDate)}</td>
                                            </tr>
                                            <tr>
                                                <th>Actual Start</th>
                                                <td>{info ? `${formatDateString(info.actualSD)}, ${information && info.actualST}` : ""}</td>
                                            </tr>
                                            <tr>
                                                <th>Actual End</th>
                                                <td>{info ? `${formatDateString(info.actualED)}, ${information && info.actualET}` : ""}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <br></br>
                        <div className="container text-left">
                            <h3>Attachments</h3>
                        </div>

                        <div className="container">
                            <div className="row">
                                <table class="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>Filename</th>
                                            <th className='text-center'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getDocumentList()}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <div className="modal-footer">
                        <div className="btn-group mr-auto">
                            <button onClick={() => onCopyClick(activity)}><i className="fa fa-file-o" style={{ color: "gray" }}></i> Copy</button>
                            <button onClick={() => onObseleteClick(activity)}><i className="fa fa-clock-o" style={{ color: "gray" }}></i> Obsolete</button>
                        </div>

                        <button className="btn1 btn-primary float-right" onClick={() => onSubmitClick(activity)}><i className="fa fa-check" style={{ color: "white" }}></i> Submit</button>
                    </div>

                </div>
            </div>
        </div >
    );
}