import React, { Component, Fragment } from 'react';
import $ from "jquery";
import closeBulk from "../../assets/Tickets/close-bulk.svg";


export default class BulkTickets extends Component {
    constructor() {
        super();
        this.state = {
            note: ""
        };
    }

    handleNotechange = (e) => {
        this.setState({ note: e.target.value });
    }

    handleSubmit = async () => {
        let ticketIds = this.props.ticketIds.map(x => parseInt(x));
        let post = {
            "ticketIds": ticketIds,
            "clientId": localStorage.getItem('client'),
            "content": this.state.note,
            "userId": localStorage.getItem('userId'),
            "featureId": this.props.featureId
        };
        this.setState({ note: "" });
        $(".modal-backdrop").remove();
        $("#cancelButton").click();
        await this.props.closeBulkTicketes(post);
    }

    render() {
        return (
            <Fragment>
                {/* <button type="button" className="btn cls-btn"  data-toggle="modal" data-target="#bulkTicketModal">
                        Close Bulk Tickets
                </button> */}
                <button className="btn btn-link mr-2" data-toggle="modal" data-target="#bulkTicketModal" >
                    <img src={closeBulk} alt="close bulk icon" title="Close Bulk Tickets" />
                </button>
                <div className="modal" data-backdrop="static" data-keyboard="false" href="#" id="bulkTicketModal" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div class="modal-header close-tickets-header">
                                <span className="modal-title modal-title-text">Close Bulk Tickets</span>
                                <button type="button" className="close" data-dismiss="modal" style={{ color: "#000", fontSize: "25px" }} aria-label="Close" onClick={this.onCancel}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <p className="modl-txt">Are You Sure You want to Close the Selected Tickets?</p>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label" style={{ color: "#000000" }}>Enter Notes:</label>
                                        <textarea className="form-control" id="message-text" style={{ height: "250px" }} onChange={this.handleNotechange} value={this.state.note}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className=" modal-footer">
                                <button type="button" className="btn btn veiw-btn backBtn mr-3" style={{ color: "#593CAB", border: "1px solid #593CAB", minWidth: "7rem", height: '38px' }} disabled={this.props.ticketIds.length && this.state.note.length ? false : true} onClick={this.handleSubmit}> Close Ticket</button>
                                <button type="button" className="btn edit-btn mr-auto" id="cancelButton" data-dismiss="modal" onClick={() => this.setState({ note: "" })} >Close</button>


                            </div>
                            {/* <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" id="cancelButton" data-dismiss="modal" onClick={()=> this.setState({note: ""})} >Cancel</button>
                                    <button type="button" className="btn btn-secondary" disabled={this.props.ticketIds.length && this.state.note.length ? false : true} onClick={this.handleSubmit}>Close Tickets</button>
                                </div> */}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
