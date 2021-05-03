import React from 'react';
import './change-request-info.css';
import Loader from '../../resources/Loader';

export default function TicketDetails({ activity, ticketDetails, onCopyClick, onObseleteClick, onSubmitClick, loading, history, featureId, onAutomationTemplatesOpen, openSOPModal }) {
    let information = activity ? activity.Information : [];
    activity = activity ? activity : {};
    let info = information && information[0] ? information[0] : {};

    const formatDateString = (dateString) => {
        let formatDate = new Date(dateString);
        let month = formatDate.getMonth() + 1;
        let date = formatDate.getDate();
        date = date < 10 ? `0${date}` : date;
        month = month < 10 ? `0${month}` : month;
        return `${date}/${month}/${formatDate.getFullYear()}`;
    }

    return (
        <div className="modal span-lable-style" id="TicketDetailsModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <Loader loading={loading} />
                    <div className="modal-header">
                        <div class="col">
                            <div class="div-head">Ticket</div>
                            <div class="div-text" style={{ marginTop: '0.75rem' }}>{ticketDetails.ticketId}</div>
                        </div>
                        <div class="vl"></div>
                        <div class="col">
                            <div class="div-head">Status</div>
                            <div class="div-text"><i className="icon-open"></i>{ticketDetails.status}</div>
                        </div>
                        <div class="vl"></div>
                        <div class="col">
                            <div class="div-head">Priority</div>
                            <div class="div-text"><i className="icon-emr"></i>{ticketDetails.severity}</div>
                        </div>
                        <div class="vl"></div>
                        <div class="col">
                            <div class="div-head">Time to SLA</div>
                            <div class="div-text"><i className="icon-time"></i>{ticketDetails.slaResolutionBreachTime}</div>
                        </div>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h5>Incident details</h5>
                                    <table className="table table-borderless table-sm">
                                        <tbody>
                                            <tr>
                                                <th>Date Created</th>
                                                <td>{activity && window.DateTimeParser(ticketDetails.createdDate)}</td>
                                            </tr>
                                            <tr>
                                                <th>Source</th>
                                                <td>{ticketDetails.source}</td>
                                            </tr>
                                            <tr>
                                                <th>assignee</th>
                                                <td>{ticketDetails.assignedTo}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col">
                                    <h5>Advanced Automation</h5>
                                    <table className="table table-borderless table-sm">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <button type="button" className="button1" style={{ fontSize: "12px", outline: "none", width: '95%' }} onClick={() => openSOPModal(ticketDetails.subject, ticketDetails.description)}><i className="fa fa-lightbulb-o" aria-hidden="true" style={{ color: "#61c7b9" }}></i> Suggested SOP</button>
                                                    <br />
                                                    <button data-toggle="modal" data-target="#admanceAutomation" onClick={onAutomationTemplatesOpen} data-target="#admanceAutomation" type="button" className="button1" style={{ fontSize: "12px", outline: "none", width: '95%' }}><i className="fa fa-bolt" aria-hidden="true" style={{ color: "#61c7b9" }}></i> Automation template</button>
                                                    <br />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div className="modal-footer">
                            <div className="btn-group mr-auto">
                                {/* <button onClick={onCopyClick}><i className="fa fa-file-o" style={{ color: "gray" }}></i> Accept</button> */}
                                {/* <button onClick={onCopyClick}><i className="fa fa-file-o" style={{ color: "gray" }}></i> Reassign</button> */}
                                {/* <button onClick={onCopyClick}><i className="fa fa-file-o" style={{ color: "gray" }}></i> Transfer</button> */}
                                {/* <button onClick={onObseleteClick}><i className="fa fa-clock-o" style={{ color: "gray" }}></i> Add Note</button> */}
                            </div>
                            <button className="btn1 btn-primary float-right" onClick={() => history.push(`/ticket-list/${ticketDetails.ticketId}?featureId=${featureId}&clientId=${ticketDetails.clientId}`)}>
                                <i className="fa fa-eye" style={{ color: "white" }}></i> View Details</button>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}