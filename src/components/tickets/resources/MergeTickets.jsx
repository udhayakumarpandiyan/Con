import React, { Component, Fragment } from 'react';
import $ from "jquery";
import mergeIcon from "../../assets/Tickets/resize.svg";
import { failureToast } from '../../../actions/commons/toaster';

export default class MergeTickets extends Component {

    state = {
        mergeTicket: "",
        notes: ""
    }

    ticketMergeTicketSubmit(e) {
        e.preventDefault();
        const { checkedTickets: checkedAllTickets, featureId } = this.props;
        const mergeTicket = parseInt(this.state.mergeTicket, 10);
        const notes = this.state.notes;
        const userId = localStorage.getItem('userId');
        const clientId = localStorage.getItem('client');

        let checkedTickets = checkedAllTickets && checkedAllTickets.map(function (item) {
            return parseInt(item, 10);
        });
        if (!checkedTickets || !checkedTickets.length) {
            return failureToast("Please select the tickets!");
        }
        if (!mergeTicket) {
            return failureToast("Please enter TicketId");
        }
        const min = Math.min(...checkedTickets);
        var s = min < mergeTicket;
        if (min < mergeTicket) {
            return failureToast("Merged Ticket should be lower value");
        }
        if (!notes) {
            return failureToast("Notes required!");
        }
        let obj = {
            parentTicket: mergeTicket,
            childTickets: checkedTickets,
            notes,
            userId,
            clientId,
            featureId
        }
        this.props.saveMergeTickets(obj).then(res => {
            if (res && res.status === 200) {
                this.onCancel();
                $(".modal-backdrop").remove();
                $("#mergeTickets").modal('toggle');
                document.getElementById('mergeTicket').value = "";
                document.getElementById('notes').value = "";
            }
        });
    }

    onCancel = () => {
        this.setState({ mergeTicket: "", notes: "" });
    }

    onChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    // checked tickets are child tickets;
    // input ticket is parent ticket id;
    render() {
        return (
            <Fragment>
                <div className="modal" id="mergeTickets" role="dialog" data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header close-tickets-header">
                                <span className="modal-title modal-title-text">Merge Tickets </span>
                                <button type="button" className="close" data-dismiss="modal" style={{ color: "#000", fontSize: "25px" }} aria-label="Close" onClick={this.onCancel}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <form className="" onSubmit={(e) => e.preventDefault()}>
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label" style={{ color: "#000000", fontWeight: "normal", paddingRight: "10px" }}>Enter Ticket ID  </label>
                                        <input type="text" id="mergeTicket" className="input-align" name="mergeTicket" placeholder="Enter Ticket Id" value={this.state.mergeTicket} onChange={this.onChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label" style={{ color: "#000000", fontWeight: "normal" }}>Enter Notes:</label>
                                        <textarea className="form-control" id="notes" name="notes" style={{ height: "200px" }} placeholder="Enter notes" value={this.state.notes} onChange={this.onChange}></textarea>
                                    </div>
                                    <label htmlFor="inputPassword2" className="sr-only">Password</label>
                                    {/* <input type="text" id="mergeTicket" name="mergeTicket" placeholder="Enter Ticekt Id" />
                                    <input type="text" id="notes" name="notes" placeholder="Enter notes" /> */}
                                    <input type="hidden" name="checkedTickets" value={this.props.checkedTickets} />
                                    <input type="hidden" name="userId" value={localStorage.getItem('userId')} />
                                    <input type="hidden" name="clientId" value={localStorage.getItem('client')} />
                                    <input type="hidden" name="featureId" value={this.props.featureId} />

                                    {/* <span className="centerBtnClient">
                                        <button type="submit" className="btn btn-primary" >Submit</button>
                                    </span> */}
                                </form>
                            </div>
                            {/* <div className="modal-footer">
                                <button type="button" id="closeButton" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div> */}

                            <div className="modal-footer">
                                <button type="submit" className="btn btn veiw-btn backBtn mr-3" style={{ color: "#593CAB", border: "1px solid #593CAB", minWidth: "7rem", height: '38px' }} onClick={this.ticketMergeTicketSubmit.bind(this)}>Submit</button>
                                <button type="button" className="btn edit-btn mr-auto" id="closeButton" data-dismiss="modal" onClick={this.onCancel}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <button type="button" className="btn cls-btn" data-toggle="modal" data-target="#mergeTickets">Merge Tickets</button> */}
                <button className="btn btn-link" data-toggle="modal" data-target="#mergeTickets">
                    <img src={mergeIcon} alt="merge icon" title="Merge Tickets" />
                </button>
            </Fragment>
        );
    }
}
