import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';
import ComponentHeader from '../../resources/DashboardHeader';
import Loader from '../../resources/Loader';
import AddFeature from './AddFeature';
import { fetchFeatures, deleteFeature } from "../../../actions/admin/features"
import { generateToken } from "../../../actions/commons/commonActions";
import { failureToast, successToast } from "../../../actions/commons/toaster";


function AdminFeatures() {
    const [loading, setLoading] = useState(false);
    const [hasShowAddNew, setAddNew] = useState(false);
    const [feature, setFeature] = useState({});
    const dispatch = useDispatch();
    const { featureId, clientId, features, userId } = useSelector(state => ({
        features: Array.isArray(state.features) ? state.features : [],
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures?.featureIds?.["admin"],
        userId: state.current_user.payload ? state.current_user.payload.userId : ""
    }));

    useEffect(() => {
        getAdminFeatures();
        $("#addNewFeature").click(function () {
            setAddNew(true);
            $('#addFeature').modal('show');
        });
    }, [clientId])

    const getAdminFeatures = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let params = { clientId, featureId, apiToken, userId };
        dispatch(fetchFeatures(params))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }

    const deleteFeatureFromList = async (id) => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        setLoading(true);
        dispatch(deleteFeature(id, { featureId, clientId, apiToken }))
            .then((res) => {
                setLoading(false);
                const { message, status } = res.data;
                if (status === 200) {
                    successToast("Successfully deleted!");
                    return getAdminFeatures();
                }
                const text = typeof message === "string" ? message : "Something went wrong!";
                failureToast(text);
            }).catch(() => {
                setLoading(false);
            });
    }

    const onCloseModal = () => {
        setAddNew(false);
        setFeature({});
        $('#addFeature').modal('hide');
    }

    const Header = [
        { name: 'Admin', className: "component-head-text " },
        { name: 'Add New Feature', id: 'addNewFeature', className: 'btn add-new-tc' }
    ];

    const onEditFeature = (feature) => {
        setFeature(feature);
        setAddNew(true);
        $('#addFeature').modal('show');
    }

    return (
        <>
            <ComponentHeader
                dashboardText={Header}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Features', path: '' }]}
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
                            Array.isArray(features) && getTableBody(features, deleteFeatureFromList, onEditFeature)
                        }
                    </table>
                </div>
            </div>
            <div class="modal" id="addFeature" tabIndex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 className="modal-title">{`${feature?._id ? "Edit Feature" : "Add New Feature"}`}</h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => onCloseModal()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {
                                hasShowAddNew &&
                                <AddFeature
                                    feature={feature}
                                    onCloseModal={onCloseModal}
                                    fetchFeatures={getAdminFeatures}
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

const getTableBody = (features, deleteFeatureFromList, onEditFeature) => {
    return <tbody>
        {
            features.map((item, index) =>
                <tr key={item.name}>
                    <td>{index + 1}</td>
                    <td><span className='btn btn-link'>{item.name}</span></td>
                    <td>{item.displayName}</td>
                    <td>{item.version}</td>
                    <td>{item.status}</td>
                    <td>
                        <button className="btn-sm btn" onClick={() => onEditFeature(item)} ><i className="fa fa-edit"></i></button>
                        <a active="true" className="btn-sm btn" onClick={() => item.status !== "deleted" && deleteFeatureFromList(item._id)}  ><i className="fa fa-trash"></i></a>
                    </td>
                </tr>
            )
        }
    </tbody>
}

export default AdminFeatures;