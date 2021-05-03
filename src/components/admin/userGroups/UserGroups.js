import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';
import ComponentHeader from '../../resources/DashboardHeader';
import { failureToast } from '../../../actions/commons/toaster';
import { generateToken } from '../../../actions/commons/commonActions';
import { groupsMappedToClient, fetchClientGroupDetails, getSelectedClientUsers } from "../../../actions/admin/groups";
import UserGroupDetails from './UserGroupDetails';
import Loader from '../../resources/Loader';
import './page.css';


function AddUsersToGroup() {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [groupId, setGroupId] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const [groupUsers, setGroupUsers] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const { featureId, userId, clientId, groups, clientGroupDetails, usersList } = useSelector(state => ({
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures?.featureIds?.["admin"],
        userId: state.current_user.payload ? state.current_user.payload.userId : "",
        groups: Array.isArray(state.groupsMappedToClient) ? state.groupsMappedToClient : [],
        clientGroupDetails: state.clientGroupDetails,
        usersList: state.getSelectedClientUsers && Array.isArray(state.getSelectedClientUsers.mappedUsers) ? state.getSelectedClientUsers.mappedUsers : []
    }));

    const getTableColumn = ['Group Name', 'No. of Users']

    useEffect(async () => {
        fetchClientGroups();
        const { generateToken: apiToken } = await dispatch(generateToken());
        // send internalCall as 1, we are calling user module from admin module;
        dispatch(getSelectedClientUsers({ clientId, featureId, apiToken }, 1));
    }, [clientId])

    const fetchClientGroups = async () => {
        try {
            setLoading(true);
            const { generateToken: apiToken } = await dispatch(generateToken());
            await dispatch(groupsMappedToClient(clientId, { apiToken, featureId }));
            setLoading(false);
            // for fetching no.of users for that client and group;
            getClientGroupDetails();
        } catch (err) {
            setLoading(false);
        }
    }

    const getClientGroupDetails = async () => {
        setLoading(true);
        const { generateToken: apiToken } = await dispatch(generateToken());
        await dispatch(fetchClientGroupDetails(clientId, { featureId, apiToken }));
        setLoading(false);
    }

    const groupListItems = () => {
        const mappedGroups = Array.isArray(groups) ? groups.filter(item => item.status === "active") : [];
        return mappedGroups.map((group) => {
            return (
                <tr key={group._id} onClick={() => handleClick(group.groupId, group.displayName)}>
                    <td>{group.displayName}</td>
                    <td>{getUserCount(group)}</td>
                </tr>
            )
        })
    }

    const getUserCount = (group) => {
        if (Array.isArray(clientGroupDetails) && clientGroupDetails[0]) {
            let details = clientGroupDetails[0];
            if (Array.isArray(details.list) && details.list.length) {
                let list = details.list;
                let obj = list.map((k, v) => k[group.groupId] ? k[group.groupId] : 0);
                let filter = obj.filter(f => f !== 0)
                let result = ((filter.length > 0) && (filter[0][0])) ? filter[0][0].userIds : []
                return result.length;
            }
        }
        return 0;
    }

    const handleClick = (groupId, groupName) => {
        setGroupId(groupId);
        setGroupName(groupName);
        setGroupUsers(getGroupUsers(groupId));
        setShowDetails(true);
        $(`#groupUserListModal`).modal('show');
    }


    const getGroupUsers = (groupId) => {
        if (Array.isArray(clientGroupDetails) && clientGroupDetails[0]) {
            let details = clientGroupDetails[0];
            if (Array.isArray(details.list) && details.list) {
                let list = details.list;
                let obj = list.map((k) => k[groupId] ? k[groupId] : 0);
                let filter = obj.filter(f => f !== 0)
                let result = ((filter.length > 0) && (filter[0][0])) ? filter[0][0].userIds : []
                return result;
            }
        }
        return [];
    }

    return (
        <>
            <ComponentHeader
                dashboardText={[{ name: 'Admin', className: "component-head-text " }]}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Add Users To Group', path: '' }]}
            />
            < Loader loading={loading} />
            <div className="page">
                <div className="bg-wh" >
                    <div className='form-group' id='admin-table'>
                        <table className="table table-hover my-table">
                            <thead>
                                <tr>
                                    {
                                        getTableColumn.map(column =>
                                            !column.name ? <th key={column}><span className="th-text">{column}</span></th> :
                                                <th key={column.name} style={{ width: column.width }}><span className="th-text">{column.name}</span></th>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    groupListItems()
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* details */}
            < UserGroupDetails
                hasShowDetails={showDetails}
                userList={usersList}
                groupName={groupName}
                groupId={groupId} // selected group id;
                clientId={clientId}
                groupUsers={groupUsers}
            />

        </>
    )
}

export default AddUsersToGroup;