import React from 'react';

const Ticket_Status_Color = {
    "open": '#F08943',
    'inprogress': '#298BCC',
    'closed': 'gray',
    'resolved': 'green'
}

const Ticket_priority_class = {
    'emrg': 'icon-emr',
    'emergency': 'icon-emr',
    'normal': 'icon-normal',
    'low': 'icon-low',
    'exception': 'icon-excep',
    'high': 'icon-hg'
};

function TicketIcon(status = '') {
    return <svg style={{
        width: '18px',
        transform: 'rotate(90deg)',
        color: Ticket_Status_Color[`${status.toLowerCase()}`]
    }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ticket-alt" className="svg-inline--fa fa-ticket-alt fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M128 160h320v192H128V160zm400 96c0 26.51 21.49 48 48 48v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c26.51 0 48-21.49 48-48s-21.49-48-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v96c-26.51 0-48 21.49-48 48zm-48-104c0-13.255-10.745-24-24-24H120c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V152z"></path></svg>
}



export default function IncidentModal({ incidentData, selectedRow, openSOPModal, openAutomationPopUp, onDetailedInfo = () => { } }) {
    return (
        <div className="modal" id="ticketmodal" data-backdrop="static" data-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title header-title">Ticket #{incidentData.ticketId}</h5>
                        <div className="gap"></div>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm">
                                    <small>Status</small>
                                    <text>
                                        <span>{TicketIcon(incidentData.status)}</span>
                                        <b>{incidentData.status} </b>
                                    </text>
                                </div>
                                <div className="vl"></div>
                                <div className="col-sm">
                                    <small>Priority</small>
                                    <text>
                                        <span style={{ margin: '0px', width: '1rem' }} className={typeof incidentData.severity === 'string' ? Ticket_priority_class[`${incidentData.severity.toLowerCase()}`] : ''}></span>
                                        <b> {incidentData.severity}</b></text>
                                </div>

                                <div className="vl"></div>
                                <div className="col-sm">
                                    <small>Time to SLA</small>
                                    <text><i className="fa fa-clock-o" aria-hidden="true" style={{ color: 'red' }}></i><b style={{marginLeft:'6px'}}>{incidentData.slaResolutionBreachTime}</b></text>
                                </div>

                            </div>
                        </div>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body body-margin">
                        <form>
                            <div className="form-row">
                                <div className="col-md-7">
                                    <h5 className='header-title'>View Incident Details</h5>
                                    <form>
                                        <div className='list-item' style={{ marginTop: '20px', marginLeft: '-19px' }}>
                                            <div className="col-md-4">
                                                <label className="desc-head">Date Created</label>
                                            </div>
                                            <div className="col-md-8">
                                                <div className='desc'>{window.DateTimeParser(incidentData.createdDate)}</div>
                                            </div>
                                        </div>
                                        <div className='list-item' style={{ marginLeft: '-19px' }}>
                                            <div className="col-md-4">
                                                <div className='desc-head'>Source</div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className='desc'>{incidentData.source}</div>
                                            </div>
                                        </div>
                                        <div className='list-item' style={{ marginLeft: '-19px' }}>
                                            <div className="col-md-4">
                                                <div className='desc-head'>Description</div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className='desc incident-des-scroll'>{selectedRow.description}</div>
                                            </div>
                                        </div>
                                    </form>
                                </div>


                                <div className="col-md-5" style={{ paddingLeft: '20px' }}>
                                    <h4 className='header-title'>Advanced Actions</h4>
                                    <button type="button" className="button1" style={{ width: '100%' }} onClick={(e) => openSOPModal(e, true)}>
                                        <i className="fa fa-lightbulb-o"
                                            aria-hidden="true" style={{ color: '#61c7b9', paddingLeft: '5px' }}></i>
                                       View Suggested SOP
                                        </button>

                                    <button type="button" className="button1" style={{ width: '100%' }} onClick={(e) => openAutomationPopUp(e, true)}>
                                        <i className="fa fa-bolt"
                                            aria-hidden="true" style={{ color: '#61c7b9', paddingRight: '5px' }}></i>
                                        Apply Automations</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer row">
                        <div className="btn-group">
                            {/* <button onClick={(e) => onDetailedInfo(e, selectedRow.ticketId, selectedRow.clientId)}><i className="fa fa-check float-sm-center btn-link mr-2" style={{ color: 'gray' }}></i>Accept</button> */}
                            {/* <button onClick={(e) => onDetailedInfo(e, selectedRow.ticketId, selectedRow.clientId)}><i className="fa fa-user float-sm-center btn-link mr-2" style={{ color: 'gray' }}></i>Reassign</button> */}
                            {/* <button onClick={(e) => onDetailedInfo(e, selectedRow.ticketId, selectedRow.clientId)}><i className="fa fa-exchange-alt float-sm-center btn-link mr-2" style={{ color: 'gray' }}></i>Transfer</button> */}
                            {/* <button onClick={(e) => onDetailedInfo(e, selectedRow.ticketId, selectedRow.clientId)}><i className="fa fa-plus float-sm-center btn-link mr-2" style={{ color: 'gray' }}></i>Add Note</button>                                                         */}
                            <button className="btnn resolve-btn-primary" style={{ marginRight: '60px', border: '0px', padding: '6px 20px' }} onClick={(e) => onDetailedInfo(e, selectedRow.ticketId, selectedRow.clientId)}><i className="fa fa-eye" style={{ color: 'white', paddingRight: '8px' }}></i>View Details</button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}