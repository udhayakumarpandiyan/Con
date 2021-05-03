import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';
import ComponentHeader from '../../resources/DashboardHeader';
import Loader from '../../resources/Loader';
import AddHelpTopic from './AddHelpTopic';
import { fetchHelpTopics, deleteHelpTopic } from "../../../actions/admin/helpTopics"
import { generateToken } from "../../../actions/commons/commonActions";
import { failureToast, successToast } from "../../../actions/commons/toaster";


function AdminHelpTopics() {
    const [loading, setLoading] = useState(false);
    const [hasShowAddNew, setAddNew] = useState(false);
    const [helpTopic, setHelpTopic] = useState({});
    const dispatch = useDispatch();
    const { featureId, clientId, helpTopics, userId } = useSelector(state => ({
        helpTopics: Array.isArray(state.helpTopics) ? state.helpTopics : [],
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures?.featureIds?.["admin"],
        userId: state.current_user.payload ? state.current_user.payload.userId : ""
    }));

    useEffect(() => {
        getAdminHelpTopics();
        $('#addNewHelpTopic').css('width', '11.25rem');
        $("#addNewHelpTopic").click(function () {
            setAddNew(true);
            $('#addHelpTopic').modal('show');
        });
    }, [clientId])

    const getAdminHelpTopics = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let params = { clientId, featureId, apiToken, userId };
        dispatch(fetchHelpTopics(params))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }

    const deleteHelpTopicFromList = async (id) => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        setLoading(true);
        dispatch(deleteHelpTopic(id, { featureId, clientId, apiToken }))
            .then((res) => {
                setLoading(false);
                const { message, status } = res.data;
                if (status === 200) {
                    successToast("Successfully deleted!");
                    return getAdminHelpTopics();
                }
                const text = typeof message === "string" ? message : "Something went wrong!";
                failureToast(text);
            }).catch(() => {
                setLoading(false);
            });
    }

    const onCloseModal = () => {
        setAddNew(false);
        setHelpTopic({});
        $('#addHelpTopic').modal('hide');
    }

    const Header = [
        { name: 'Admin', className: "component-head-text" },
        { name: 'Add New Help Topic', id: 'addNewHelpTopic', className: 'btn add-new-tc' }
    ];

    const onEditHelpTopic = (helpTopic) => {
        setHelpTopic(helpTopic);
        setAddNew(true);
        $('#addHelpTopic').modal('show');
    }

    return (
        <>
            <ComponentHeader
                dashboardText={Header}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Help Topic List', path: '' }]}
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
                            Array.isArray(helpTopics) && getTableBody(helpTopics, deleteHelpTopicFromList, onEditHelpTopic)
                        }
                    </table>
                </div>
            </div>
            <div class="modal" id="addHelpTopic" tabIndex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 className="modal-title">{`${helpTopic._id ? "Edit Help Topic" : "Add New Help Topic"}`}</h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => onCloseModal()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {
                                hasShowAddNew &&
                                <AddHelpTopic
                                    helpTopic={helpTopic}
                                    onCloseModal={onCloseModal}
                                    fetchHelpTopics={getAdminHelpTopics}
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
        { displayName: 'Ticket Prority', className: '' },
        { displayName: 'Version', className: '' },
        { displayName: 'Status', className: '' },
        { displayName: 'Actions', className: '' }
    ]
};

const getTableBody = (helpTopics, deleteHelpTopicFromList, onEditHelpTopic) => {
    return <tbody>
        {
            helpTopics.map((helpTopic, index) =>
                <tr key={helpTopic._id}>
                    <td>{index + 1}</td>
                    <td><span className='btn btn-link'>{helpTopic.name}</span></td>
                    <td>{helpTopic.displayName}</td>
                    <td>{helpTopic.ticketPriority}</td>
                    <td>{helpTopic.version}</td>
                    <td>{helpTopic.status}</td>
                    <td>
                        <button className="btn-sm btn" onClick={() => onEditHelpTopic(helpTopic)} ><i className="fa fa-edit"></i></button>
                        <a active="true" className="btn-sm btn" onClick={() => helpTopic.status !== "deleted" && deleteHelpTopicFromList(helpTopic._id)}  ><i className="fa fa-trash"></i></a>
                    </td>
                </tr>
            )
        }
    </tbody>
}

export default AdminHelpTopics;