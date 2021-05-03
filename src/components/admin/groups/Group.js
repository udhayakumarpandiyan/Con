import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';
import ComponentHeader from '../../resources/DashboardHeader';
import Loader from '../../resources/Loader';
import AddGroup from './AddGroup';
import { fetchGroups, deleteGroup } from "../../../actions/admin/groups";
import { generateToken } from "../../../actions/commons/commonActions";
import { failureToast, successToast } from "../../../actions/commons/toaster";


function AdminGroups() {
    const [loading, setLoading] = useState(false);
    const [hasShowAddNew, setAddNew] = useState(false);
    const [group, setGroup] = useState({});
    const dispatch = useDispatch();
    const { featureId, clientId, groups, userId } = useSelector(state => ({
        groups: Array.isArray(state.groups) ? state.groups : [],
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures?.featureIds?.["admin"],
        userId: state.current_user.payload ? state.current_user.payload.userId : ""
    }));

    useEffect(() => {
        getAdminGroups();
        $("#addNewGroup").click(function () {
            setAddNew(true);
            $('#addGroup').modal('show');
        });
    }, [clientId])

    const getAdminGroups = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let params = { clientId, featureId, apiToken, userId };
        dispatch(fetchGroups(params))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }

    const deleteGroupFromList = async (id) => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        setLoading(true);
        dispatch(deleteGroup(id, { featureId, clientId, apiToken }))
            .then((res) => {
                setLoading(false);
                const { message, status } = res.data;
                if (status === 200) {
                    successToast("Successfully deleted!");
                    return getAdminGroups();
                }
                const text = typeof message === "string" ? message : "Something went wrong!";
                failureToast(text);
            }).catch(() => {
                setLoading(false);
            });
    }

    const onCloseModal = () => {
        setAddNew(false);
        setGroup({});
        $('#addGroup').modal('hide');
    }

    const Header = [
        { name: 'Admin', className: "component-head-text " },
        { name: 'Add New Group', id: 'addNewGroup', className: 'btn add-new-tc' }
    ];

    const onEditGroup = (group) => {
        setGroup(group);
        setAddNew(true);
        $('#addGroup').modal('show');
    }

    return (
        <>
            <ComponentHeader
                dashboardText={Header}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Group List', path: '' }]}
            />
            < Loader loading={loading} />
            <div id='admin-table' className="page">
                <div className="bg-wh" >
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                {
                                    [].concat(getColumnNames()).map(column =>
                                        <th key={column.displayName} className={column.className}><span className="th-text">{column.displayName}</span></th>)
                                }
                            </tr>
                        </thead>
                        {
                            Array.isArray(groups) && getTableBody(groups, deleteGroupFromList, onEditGroup)
                        }
                    </table>
                </div>
            </div>
            <div class="modal" id="addGroup" tabIndex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 className="modal-title">{`${group?._id ? "Edit Group" : "Add New Group"}`}</h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => onCloseModal()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {
                                hasShowAddNew &&
                                <AddGroup
                                    group={group}
                                    onCloseModal={onCloseModal}
                                    fetchGroups={getAdminGroups}
                                    featureId={featureId}
                                    clientId={clientId}
                                    generateToken={generateToken}
                                    dispatch={dispatch}
                                    onCloseModal={onCloseModal}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const getColumnNames = () => {
    return [
        { displayName: 'S.N', className: '' },
        { displayName: 'Name', className: '' },
        { displayName: 'Display Name', className: '' },
        { displayName: 'Version', className: '' },
        { displayName: 'Status', className: '' },
        { displayName: 'Actions', className: '' }
    ]
};

const getTableBody = (groups, deleteGroupFromList, onEditGroup) => {
    return <tbody>
        {
            groups.map((group, index) =>
                <tr key={group.name}>
                    <td>{index + 1}</td>
                    <td><span className='btn btn-link'>{group.name}</span></td>
                    <td>{group.displayName}</td>
                    <td>{group.version}</td>
                    <td>{group.status}</td>
                    <td>
                        <button className="btn-sm btn" onClick={() => onEditGroup(group)} ><i className="fa fa-edit"></i></button>
                        <a active="true" className="btn-sm btn" onClick={() => group.status !== "deleted" && deleteGroupFromList(group._id)}  ><i className="fa fa-trash"></i></a>
                    </td>
                </tr>
            )
        }
    </tbody>
}

export default AdminGroups;