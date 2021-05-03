import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';
import ComponentHeader from '../../resources/DashboardHeader';
import Loader from '../../resources/Loader';
import AddPermission from './AddPermission';
import { fetchPermissions, deletePermission } from "../../../actions/admin/permissions"
import { generateToken } from "../../../actions/commons/commonActions";
import { failureToast, successToast } from "../../../actions/commons/toaster";


function AdminPermissions() {
    const [loading, setLoading] = useState(false);
    const [hasShowAddNew, setAddNew] = useState(false);
    const [permission, setPermission] = useState({});
    const dispatch = useDispatch();
    const { featureId, clientId, permissions, userId } = useSelector(state => ({
        permissions: Array.isArray(state.permissions) ? state.permissions : [],
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures?.featureIds?.["admin"],
        userId: state.current_user.payload ? state.current_user.payload.userId : ""
    }));

    useEffect(() => {
        getAdminPermission();
        $('#addNewPermission').css('width', '11.25rem');
        $("#addNewPermission").click(function () {
            setAddNew(true);
            $('#addPermission').modal('show');
        });
    }, [clientId])

    const getAdminPermission = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let params = { clientId, featureId, apiToken, userId };
        dispatch(fetchPermissions(params))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }

    const deletePermissionFromList = async (id) => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        setLoading(true);
        dispatch(deletePermission(id, { featureId, clientId, apiToken }))
            .then((res) => {
                setLoading(false);
                const { message, status } = res.data;
                if (status === 200) {
                    successToast("Successfully deleted!");
                    return getAdminPermission();
                }
                const text = typeof message === "string" ? message : "Something went wrong!";
                failureToast(text);
            }).catch(() => {
                setLoading(false);
            });
    }

    const onCloseModal = () => {
        setAddNew(false);
        setPermission({});
        $('#addPermission').modal('hide');
    }

    const Header = [
        { name: 'Admin', className: "component-head-text " },
        { name: 'Add New Permission', id: 'addNewPermission', className: 'btn add-new-tc' }
    ];

    const onEditPermission = (permission) => {
        setPermission(permission);
        setAddNew(true);
        $('#addPermission').modal('show');
    }

    return (
        <>
            <ComponentHeader
                dashboardText={Header}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Permission List', path: '' }]}
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
                            Array.isArray(permissions) && getTableBody(permissions, deletePermissionFromList, onEditPermission)
                        }
                    </table>
                </div>
            </div>
            <div class="modal" id="addPermission" tabIndex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 className="modal-title">{`${permission?._id ? "Edit Permission" : "Add New Permission"}`}</h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => onCloseModal()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {
                                hasShowAddNew &&
                                <AddPermission
                                    permission={permission}
                                    onCloseModal={onCloseModal}
                                    fetchPermissions={getAdminPermission}
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

const getTableBody = (permissions, deletePermissionFromList, onEditPermission) => {
    return <tbody>
        {
            permissions.map((permission, index) =>
                <tr key={permission.name}>
                    <td>{index + 1}</td>
                    <td><span className='btn btn-link'>{permission.name}</span></td>
                    <td>{permission.displayName}</td>
                    <td>{permission.version}</td>
                    <td>{permission.status}</td>
                    <td>
                        <button className="btn-sm btn" onClick={() => onEditPermission(permission)} ><i className="fa fa-edit"></i></button>
                        <a active="true" className="btn-sm btn" onClick={() => permission.status !== "deleted" && deletePermissionFromList(permission._id)}  ><i className="fa fa-trash"></i></a>
                    </td>
                </tr>
            )
        }
    </tbody>
}

export default AdminPermissions;