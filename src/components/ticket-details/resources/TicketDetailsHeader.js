

import React from 'react';
import "./page.css";
import { NavLink } from "react-router-dom"
import parse from 'html-react-parser';

export default function TicketDetailsHeader({ ticketDetails, onEditClick, stateList, priorityList, hasShowEditTicket, onChangeEvent, ticketStatus, ticketPriority, onEditSave }) {

  return (
    <React.Fragment>
      <div id="dashboard" className="dashboard-bg card spanStyles" style={{ marginLeft: '15px', marginRight: '15px', marginBottom: '15px' }}>
        <div className="flex-content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb" style={{ background: "none" }}>
              <li className="breadcrumb-item ticket-details-header-breadcrumb">
                <NavLink to="/ticket-list" className='btn-link' style={{ color: "#484848" }} >Tickets</NavLink></li>
              <li className="breadcrumb-item ticket-details-header-breadcrumb" aria-current="page">{ticketDetails.ticketId}</li>
            </ol>
          </nav>
          <div className="edit-td" id="editDetails" onClick={hasShowEditTicket ? () => onEditSave(ticketDetails.ticketId, ticketDetails.clientId) : onEditClick}>{hasShowEditTicket ? 'Save' : 'Edit'}</div>
        </div>
        <div class="row">
          <div class="col-6" style={{ height: '80px', overflow: 'hidden' }}>
            <p class="ticket-details-header-p multi-line-ellipsis"> {parse(ticketDetails.subject || "")}</p>
          </div>
          <div class="vl"></div>
          <div class="col">
            <div class="div-head">Status</div>
            {
              hasShowEditTicket ?
                <select className="select-style edit-ticket-select mt-3" name="ticketStatus" value={ticketStatus || ticketDetails.state} onChange={onChangeEvent}>
                  <option>Select Status</option>
                  {
                    Array.isArray(stateList) && stateList.map((stateOptions) => {
                      return <option key={stateOptions.id} value={stateOptions.id}> {stateOptions.name} </option>
                    })
                  }
                </select>
                :
                <div class="div-text"><i className="icon-open"></i>{ticketDetails.stateDesc}</div>
            }
          </div>
          <div class="vl"></div>
          <div class="col">
            <div class="div-head">Priority</div>
            {
              hasShowEditTicket ?
                <select className="select-style edit-ticket-select mt-3" onChange={onChangeEvent} name="ticketPriority" value={ticketPriority || ticketDetails.priorityId} >
                  <option>Select Priority</option>
                  {
                    Array.isArray(priorityList) && priorityList.map((priority) => {
                      return <option key={priority.id} value={priority.id}>{priority.name} </option>
                    })
                  }
                </select>
                :
                <div class="div-text"><i className="icon-emr"></i>{ticketDetails.priorityDesc}</div>
            }
          </div>
          <div class="vl"></div>
          <div class="col">
            <div class="div-head">Time to SLA</div>
            <div class="div-text"><i className="icon-time"></i>{ticketDetails.slaResolutionBreachTime}</div>
          </div>
        </div>
      </div >
    </React.Fragment >
  )
}