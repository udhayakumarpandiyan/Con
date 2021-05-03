import React from 'react';

export default function EventModal(props) {
    const { eventData, openSOPModal, openAutomationPopUp, onOpenSendMail, onShowAcknowledgeModal, updateEventState, createIncident, onAutomationTemplatesOpen } = props;
    return (
        <>
            <div className="modal" id="eventDescModal">
                <div className="modal-dialog" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title header-title">Event #{eventData.eventId}</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-row">
                                    <div className="col-md-6" style={{ width: '50%' }}>
                                        <h5 className='header-title'>Log Stream</h5>
                                        <p className='eventdes'>{eventData.description}</p>
                                    </div>
                                    <div className="col-md-6" style={{ paddingLeft: '35px' }}>
                                        <h5 className='header-title'>View Event Details</h5>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <b>Date Arrived</b>
                                            </div>
                                            <div className="col-md-7">
                                                <text>01/01/2020, 8:00AM</text>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-5">
                                                <b>Source</b>
                                            </div>
                                            <div className="col-md-7">
                                                <text>AWS Cloud Watch</text>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-5">
                                                <b>Type</b>
                                            </div>
                                            <div className="col-md-7">
                                                <text>metric_alert_monitor</text>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-5">
                                                <b>Department</b>
                                            </div>
                                            <div className="col-md-7">
                                                <text>G2</text>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-5">
                                                <b>Ticket</b>
                                            </div>
                                            <div className="col-md-7">
                                                <text>-</text>
                                            </div>
                                        </div>
                                        <h5 className='header-title header-margin'>Advanced Actions</h5>
                                        <button type="button" className="button1" onClick={openSOPModal} style={{ width: '95%' }}>
                                            <i className="fa fa-lightbulb-o"
                                                aria-hidden="true"></i>
                                            View Suggested SOP
                                            </button>

                                        <button type="button" className="button1" onClick={openAutomationPopUp} style={{ width: '95%' }}>
                                            <i className="fa fa-bolt"
                                                aria-hidden="true" style={{ color: '#61c7b9', paddingRight: '5px' }}></i>
                                                Apply Automations</button>

                                    </div >
                                </div >

                            </form >
                        </div >
                        <div className="modal-footer">
                            <div className="btn-group">
                                <button onClick={onShowAcknowledgeModal} style={{ padding: '6px 20px' }}><i className="fa fa-eye" style={{ color: 'gray' }}></i> Acknowledge</button>
                                <button onClick={
                                    Number(eventData.eventState) === 2
                                        ? () => { }
                                        : updateEventState
                                } style={{ padding: '6px 45px' }}><i className="fa fa-check" style={{ color: 'gray' }}></i> Accept</button>
                            </div>
                            {
                                !eventData.ticketId &&
                                <button className="btn1 btn-primary float-right" style={{ padding: '6px 20px' }} onClick={createIncident}>
                                    <i className="fa fa-file-o" style={{ color: 'white', paddingRight: '7px' }}></i>
                                 Create Ticket
                            </button>
                            }
                        </div>
                    </div >
                </div >
            </div >
        </>
    )
}