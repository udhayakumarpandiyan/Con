import React from 'react';
import Loader from '../../resources/Loader';

export default function AddNewTicket(props) {
    const label_style = {
        color: "red", padding: "2px"
    }
    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();
    var minDate = dtToday.getFullYear() + '-' + month + '-' + day;
    const { addNewTicket, onTicketWindowCancel, hasShowAddNew, loading } = props;
    const { clientId, user_clients, fullName, onChangeEvent, emailId, phone, groupsList, deptID, onFileChange, ticketType, priorityList, createTicketBtn } = props;
    const { ticketPriority, ticketTypeMaster, addAttachments, assignUser, usersList, helpTopicId, helpTopics, subjectTxt, dueDate, removeAttachment, addDescription } = props;
    return <div className="modal" id="AddNewTicketModal">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header ">
                    <h3 className="modal-title">Add New Ticket</h3>
                    <button type="button" className="close" data-dismiss="modal" onClick={onTicketWindowCancel}>&times;</button>
                </div>
                {
                    hasShowAddNew &&
                    <div className="modal-body">
                        <Loader loading={loading} />
                        <div className="form-group edit-ticket-pad">
                            <label htmlFor="sel1"><span className='text-danger' >*</span>Client</label>
                            <input className="input-style" type="text" id="client" value={localStorage.getItem('clientName')} disabled />
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label htmlFor="name"><span className='text-danger' >*</span>Full Name</label>
                                <input className="input-style" type="text" id="name"
                                    placeholder="Full Name" name="fullName" value={fullName} onChange={onChangeEvent} />
                            </div>
                            <div className="col">
                                <label htmlFor="email"><span className='text-danger' >*</span>Email</label>
                                <input className="input-style" type="email" id="email" placeholder="Email" name="emailaddr" onChange={onChangeEvent} />
                            </div>
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label htmlFor="phone">Phone</label>
                                <input className="input-style" type="number" id="phone"
                                    placeholder="Phone Number" name="phone" value={phone} onChange={onChangeEvent} />
                            </div>
                            <div className="col">
                                <label htmlFor="Client Department"><span className='text-danger' >*</span>Client Department</label>
                                <select className="select-style" onChange={onChangeEvent} name="deptID" value={deptID} required={true}>
                                    <option value="">Select Department</option>
                                    {
                                        Array.isArray(groupsList) && groupsList.map((groupOptions) => {
                                            return <option key={groupOptions.groupId} value={groupOptions.groupId}>
                                                {groupOptions.name} </option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label><span className='text-danger' >*</span>Ticket Type</label>
                                <select className="select-style" name="ticketTypeMaster" onChange={onChangeEvent} value={ticketTypeMaster}>
                                    <option> select Ticket Type</option>
                                    {
                                        Array.isArray(ticketType) && ticketType.map((TTOptions) => {
                                            return <option key={TTOptions.id} value={TTOptions.id}>{TTOptions.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col">
                                <label ><span className='text-danger' >*</span>Priority</label>
                                <select className="select-style" onChange={onChangeEvent} name="ticketPriority" value={ticketPriority} >
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
                                <label ><span className='text-danger' >*</span>Assigned To</label>
                                <select className="select-style" name="assignUser" onChange={onChangeEvent} value={assignUser} >
                                    <option>Select Assignee</option>
                                    {
                                        Array.isArray(usersList) && usersList.map(userOptions => {
                                            return <option key={userOptions.userId} value={userOptions.userId}>{userOptions.userName} </option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col">
                                <label><span className='text-danger' >*</span>Help Topic</label>
                                <select className="select-style" name="helpTopicId" onChange={onChangeEvent} value={helpTopicId}>
                                    <option>Select Help Topic</option>
                                    {
                                        Array.isArray(helpTopics) && helpTopics.map((helpTopic) => {
                                            return <option name={helpTopic.displayName} title={helpTopic.displayName} key={helpTopic.helpTopicId} value={helpTopic.helpTopicId}>{helpTopic.displayName}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label htmlFor="subject"><span className='text-danger' >*</span>Ticket Subject:</label>
                                <input type="text" className="input-style" placeholder="Ticket Subject" name="subjectTxt" value={subjectTxt} onChange={onChangeEvent} required />
                            </div>
                            <div className="col">
                                <label htmlFor="due date"><span className='text-danger' >*</span>Due Date</label>
                                <input min={minDate} id="datepicker" className="input-style" name="dueDate" value={dueDate} onChange={onChangeEvent} placeholder="dd-mm-yy" type="date" required />
                            </div>
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label htmlFor="Description"><span className='text-danger' >*</span>Ticket Details</label>
                                <textarea className="form-control" rows="5" value={addDescription} name="addDescription" onChange={onChangeEvent} id="comment"></textarea>
                            </div>
                        </div>
                        <div className="form-row edit-ticket-pad">
                            <div className="col">
                                <label htmlFor="Description" style={{ display: 'initial' }}>Upload Documents</label>
                                <span className="inputfile-span">
                                    {/* <input type="file" onChange={onFileChange} name="addAttachments" multiple style={{ direction: "ltr", width: "98px" }} /> */}

                                    <input style={{ display: "none" }} type="file" name="addAttachments" id="file" onChange={onFileChange} data-multiple-caption="{count} files selected" className="inputfile inputfile-2" multiple />
                                    <label htmlFor="file" style={{ display: 'inherit' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                                        <a >Choose a file…</a>
                                    </label>
                                </span>
                                {
                                    Array.isArray(addAttachments) && addAttachments.map((attachment, index) => {
                                        return <div key={index} style={{ width: "max-content", marginTop: "5px" }} className="updateUsersData">
                                            <div className="dataTag">
                                                <span>{attachment.fileName}</span>
                                                <span style={{ marginLeft: "20px", color: "#ff0000", cursor: "pointer" }} onClick={(e) => {
                                                    e.preventDefault();
                                                    removeAttachment(index);
                                                }}>X</span>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        {/*  */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" style={{ padding: '6px 20px', backgroundColor: '#5c3eb0', marginLeft: '-12px' }} ref={createTicketBtn} onClick={addNewTicket}>Save</button>
                            <button type="button" className="btn btn-cancel" style={{ border: '1px solid rgb(222, 225, 228)' }} data-dismiss="modal" onClick={onTicketWindowCancel}>Cancel</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
}