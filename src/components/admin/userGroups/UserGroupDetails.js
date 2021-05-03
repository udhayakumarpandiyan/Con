import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { failureToast } from '../../../actions/commons/toaster';
import Loader from '../../resources/Loader';
import { saveClientGroupUser } from "../../../actions/admin/groups";
import UserList from './UserList';

function UserGroupDetails({ hasShowDetails, groupName, userList, groupId, clientId, groupUsers }) {

    return (
        <>
            <div className="modal" id="groupUserListModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header ">
                            <h3 className="modal-title">Add Users To Group</h3>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        {
                            hasShowDetails &&
                            <div className="modal-body">
                                <div className="form_block flex-fill mb-3">
                                    <form>
                                        <ul>
                                            <li className="clear w-100">
                                                <label>Group Name: </label>
                                                <input type="text" value={groupName} readOnly />
                                            </li>
                                        </ul>
                                        <UserList
                                            userList={userList}
                                            groupUsers={groupUsers}
                                            clientId={clientId}
                                        />
                                        <div className="modal-footer">
                                            <div className="float-left mr-4">
                                                &nbsp;&nbsp;&nbsp;<button>Cancel</button>
                                            </div>
                                            <div className="float-left">
                                                <button className="">save</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

        </>
    )
}


export default UserGroupDetails;