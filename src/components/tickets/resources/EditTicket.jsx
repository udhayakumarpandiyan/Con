import React from 'react';
import Loader from '../../resources/Loader';

export default function EditTicket(props) {
    const { isClientEdited, editTicketRow, user_clients, handleEditClientChange, groupsListOnEditClient, groupsList, clientDepartmentEdit, OnEditClientID } = props;
    const { onChangeEvent, editTicketRowdeptId, usersListOnEditclient, usersList, priorityList, ticketType, helpTopicId, stateList, isDepartmentChanged, helpTopicsOnEditClient, helpTopics } = props;
    const { deptID, assignUser, ticketTypeMaster, ticketPriority, ticketStatus, editTicket, onTicketWindowCancel, loading } = props;
    return <div className="modal" id="editTicketModal">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title edit-ticket-modal-title">Edit ticket #{editTicketRow.ticketId}</h4>
                    <button type="button" className="close" data-dismiss="modal" onClick={onTicketWindowCancel}>&times;</button>
                </div>
                <div className="modal-body" style={{ paddingTop: '0px' }}>
                    <form>
                        <Loader loading={loading} />
                        <div className="form-group edit-ticket-pad">
                            <label htmlFor="sel1">Client</label>
                            <select required className="select-style edit-ticket-select" onChange={handleEditClientChange} value={OnEditClientID || editTicketRow.clientId}>
                                {Array.isArray(user_clients) && user_clients.map((client, c) => {
                                    return <option key={c} value={client.clientId}> {client.name} </option>
                                })}
                            </select>
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label class="edit-ticket-label" htmlFor="name">Full Name</label>
                                <input className="input-style edit-ticket-input" type="text" id="name"
                                    placeholder="Full Name" name="Fullname" defaultValue={editTicketRow.fullName} disabled />
                            </div>
                            <div className="col">
                                <label class="edit-ticket-label" htmlFor="email">Email</label>
                                <input className="input-style edit-ticket-input" type="text" disabled id="email" placeholder="Email" name="Email" value={editTicketRow.emailId} />
                            </div>
                        </div>

                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label class="edit-ticket-label">Client Department</label>
                                {
                                    isClientEdited ?
                                        <select className="select-style edit-ticket-select" value={deptID} onChange={clientDepartmentEdit} name="deptID" >
                                            <option>Select Department</option>
                                            {
                                                Array.isArray(groupsListOnEditClient) && groupsListOnEditClient.map((groupObj) =>
                                                    <option key={groupObj.groupId} value={groupObj.groupId}>{groupObj.name}</option>)
                                            }
                                        </select>
                                        :
                                        <select className="select-style edit-ticket-select" onChange={onChangeEvent} name="deptID" value={isDepartmentChanged ? deptID : editTicketRow.deptId} >
                                            {
                                                !editTicketRowdeptId && <option disabled={editTicketRow.deptId ? true : false}>Select Department</option>
                                            }
                                            {/* {
                                                editTicketRowdeptId && <option key={editTicketRowdeptId} value={editTicketRowdeptId}>{editTicketRowdeptName} </option>
                                            } */}
                                            {
                                                Array.isArray(groupsList) && groupsList.map((groupObj) => {
                                                    return <option key={groupObj.groupId} value={groupObj.groupId}>{groupObj.name}</option>
                                                })
                                            }
                                        </select>
                                }
                            </div>
                            <div className="col">
                                <label class="edit-ticket-label" >Assigned to</label>
                                <select className="select-style edit-ticket-select" name="assignUser" onChange={onChangeEvent} value={assignUser || (!isClientEdited && !isDepartmentChanged && editTicketRow.assignedTo || "None")} >
                                    <option disabled={!isClientEdited && !isDepartmentChanged && editTicketRow.assignedTo ? true : false} >Select Assignee</option>
                                    {/* {
                                        (!isClientEdited && editTicketRow.assignedTo) &&
                                        <option vlaue={editTicketRow.assignedTo}>{editTicketRow.assignedToName}</option>
                                    } */}
                                    {
                                        isClientEdited ?
                                            Array.isArray(usersListOnEditclient) && usersListOnEditclient.map((userOptions) => {
                                                return <option key={userOptions.userId} value={userOptions.userId}> {userOptions.userName} </option>
                                            })
                                            :
                                            Array.isArray(usersList) && usersList.map(userOptions => {
                                                return <option key={userOptions.userId} value={userOptions.userId}>{userOptions.userName} </option>
                                            })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label class="edit-ticket-label" >Ticket Type</label>
                                <select className="select-style edit-ticket-select" name="ticketTypeMaster" onChange={onChangeEvent} value={ticketTypeMaster || editTicketRow.ticketTypeId}>
                                    <option disabled={editTicketRow.ticketTypeId ? true : false}> select Ticket Type</option>
                                    {
                                        Array.isArray(ticketType) && ticketType.map((TTOptions) => {
                                            return <option key={TTOptions.id} value={TTOptions.id}>{TTOptions.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col">
                                <label class="edit-ticket-label" >Priority</label>
                                <select className="select-style edit-ticket-select" onChange={onChangeEvent} name="ticketPriority" value={ticketPriority || editTicketRow.priorityId} >
                                    <option>Select Priority</option>
                                    {
                                        Array.isArray(priorityList) && priorityList.map((priority) => {
                                            return <option key={priority.id} value={priority.id}>{priority.name} </option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label class="edit-ticket-label" >Help Topic</label>
                                <select className="select-style edit-ticket-select" name="helpTopicId" onChange={onChangeEvent} value={helpTopicId || !isClientEdited && !isDepartmentChanged && editTicketRow.helpTopicId}>
                                    <option disabled={(!isClientEdited && !isDepartmentChanged && editTicketRow.helpTopicId) ? true : false}>Select Help Topic</option>
                                    {
                                        isClientEdited ?
                                            Array.isArray(helpTopicsOnEditClient) && helpTopicsOnEditClient.map((helpTopic) =>
                                                <option name={helpTopic.displayName} title={helpTopic.displayName} key={helpTopic.helpTopicId} value={helpTopic.helpTopicId} > {helpTopic.displayName}</option>
                                            )
                                            :
                                            Array.isArray(helpTopics) && helpTopics.map((helpTopic) => {
                                                return <option name={helpTopic.displayName} title={helpTopic.displayName} key={helpTopic.helpTopicId} value={helpTopic.helpTopicId}>{helpTopic.displayName}</option>
                                            })
                                    }
                                </select>
                            </div>
                            <div className="col">
                                <label class="edit-ticket-label" >Status</label>
                                <select className="select-style edit-ticket-select" name="ticketStatus" value={ticketStatus || editTicketRow.state} onChange={onChangeEvent}>
                                    <option>Select Status</option>
                                    {
                                        Array.isArray(stateList) && stateList.map((stateOptions) => {
                                            return <option key={stateOptions.id} value={stateOptions.id}> {stateOptions.name} </option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="form-group edit-ticket-pad">
                            <label class="edit-ticket-label" htmlFor="comment">Leave comments/messages htmlFor assignee</label>
                            <textarea className="form-control" rows="5" name="addDescription" onChange={onChangeEvent} id="comment"></textarea>
                        </div>
                    </form>
                </div>
                <div className="modal-footer" >
                    <button type="button" className="save-btnn" style={{ padding: '3px 20px', backgroundColor: '#5c3eb0',maxWidth: '92px', height: '38px' }} onClick={() => editTicket(editTicketRow.ticketId, editTicketRow.clientId)}>Save</button>
                    <button type="button" className="btn btn-cancel" style={{ border: '1px solid rgb(222, 225, 228)' }} data-dismiss="modal" onClick={onTicketWindowCancel}>Cancel</button>
                </div>

            </div>
        </div>
    </div>
}