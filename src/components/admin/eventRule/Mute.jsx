import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Pagination from '@material-ui/lab/Pagination';
import axios from "axios";
import moment from "moment";
import $ from 'jquery';
import { failureToast, successToast } from "../../../actions/commons/toaster";
import { generateToken } from "../../../actions/commons/commonActions";
import { productConfigUrls } from "../../../util/apiManager";
import Loader from '../../resources/Loader';
import AddMute from './AddMute';
import ComponentHeader from '../../resources/DashboardHeader';

function MuteTab({ onTabClick, toolsDetails }) {
    const dispatch = useDispatch();
    const [muteDetails, setMuteData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItemsCount, setTotalCount] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [hasShowAddNew, setHasShowAddNew] = useState(false);
    const [monitoringMuteId, setMonitoringMuteId] = useState('');
    const itemsPerPage = 10;

    const { userId, clientId } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.admin
        }
    })

    useEffect(() => {
        getMuteList();
        $("#addNewMute").click(function () {
            setHasShowAddNew(true);
            $('#addMuteWindow').modal('show');
        });
    }, [clientId])

    const getMuteList = async (skipValue = 0, limitValue = itemsPerPage) => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let uri = `${productConfigUrls.muteTab}?clientId=${clientId}&limitValue=${limitValue}&skipValue=${skipValue}&userId=${userId}&apiToken=${apiToken}`;
        setLoading(true);
        axios.get(uri).then(res => {
            if (res.data.status === 200 && res.data.data) {
                setMuteData(res.data.data);
                setTotalCount(res.data.totalCount);
                return setLoading(false);
            }
            failureToast('Something went wrong! Please try again');
            return setLoading(false);
        }).catch(() => {
            failureToast('Something went wrong! Please try again');
            return setLoading(false);
        });
    }

    const handlePageChange = async (e, pageNum) => {
        if (Number(activePage) === Number(pageNum)) {
            return;
        }
        setActivePage(pageNum);
        getMuteList((pageNum - 1) * itemsPerPage);
    }

    const openEditForm = () => {

    }
    const onCloseModal = () => {
        setHasShowAddNew(false);
        $('#addMuteWindow').modal('hide');
    }

    const setMuteId = (tooId) => {
        setMonitoringMuteId(tooId);
    }
    const deleteMuteDetails = async () => {
        let payload = {
            clientId: clientId,
            monitoringMuteId: monitoringMuteId,
            updateKeys: {
                modifiedBy: userId,
                modifiedDate: new Date().toISOString(),
                status: 2 // 2 for Delete
            }
        }
        const { generateToken: apiToken } = await dispatch(generateToken());
        setLoading(true);
        axios.put(`${productConfigUrls.muteTab}`, { ...payload, userId, apiToken })
            .then((res) => {
                const isString = (typeof res && res.data.message === "string");
                setLoading(false);
                if (res && res.data.status === 200) {
                    getMuteList();
                    isString ? successToast(res.data.message) : successToast("Record Deleted successfully");
                    return;
                }
                isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again!");
            }).catch(() => {
                setLoading(false);
                failureToast("Something went wrong. Please try again!");
            });
    }



    const TableColumns = ['Start Date', 'End Date', 'Tools', 'Host/Log', 'App/Alarm', 'CR#', 'Status', 'Action']
    let noOfPages = Math.ceil(Number(totalItemsCount) / itemsPerPage);
    return (
        <>
            <Loader loading={loading} />
            <ComponentHeader
                dashboardText={[{ name: 'Admin', className: "component-head-text " }, { name: 'Add Mute', id: 'addNewMute', className: 'btn add-new-tc' }]}
                tabsText={['Monitoring Apps', 'Mute', 'Config']}
                onTabClick={onTabClick}
                activeTabIndex={1}
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Configure Event Rules / Mute', path: '' }]}
            />
            <AddMute
                toolsDetails={toolsDetails}
                onCloseModal={onCloseModal}
                hasShowBody={hasShowAddNew}
                getMuteList={getMuteList}
            />
            <div className="page" id='admin-table'>
                <div className="bg-wh" >
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                {
                                    Array.isArray(TableColumns) && TableColumns.map(column =>
                                        <th key={column} className={column}><span className="th-text">{column}</span></th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(muteDetails) && muteDetails.map((mute, index) => {
                                    let startDate = moment(mute.startDateTime).format();
                                    let start_date = startDate.split('T')[0];
                                    let start_time = (startDate.split('T')[1]).split('+')[0];
                                    let start = `${start_date} ${start_time}`;
                                    let endDate = moment(mute.endDateTime).format();
                                    let end_date = endDate.split('T')[0];
                                    let end_time = (endDate.split('T')[1]).split('+')[0];
                                    let end = `${end_date} ${end_time}`;
                                    return (
                                        <tr key={index}>
                                            <td title={start}>{start}</td>
                                            <td title={end}>{end}</td>
                                            <td title={mute.monitoringToolName}>{mute.monitoringToolName}</td>
                                            {
                                                Number(mute.monitoringToolId) === 8 ?
                                                    <td title={[].concat(mute?.mutedByLog).join(';')}>{(Array.isArray(mute.mutedByLog) && mute.mutedByLog.length) ? mute.mutedByLog.join(';') : ""}</td> :
                                                    <td title={Array.isArray(mute.host) && mute.host[0]}>{(Array.isArray(mute.host) && mute.host.length > 0) ? mute.host[0] : ""}</td>
                                            }
                                            {
                                                Number(mute.monitoringToolId) === 8 ?
                                                    <td title={[].concat(mute?.mutedByAlarm).join(';')}>{(Array.isArray(mute.mutedByAlarm) && mute.mutedByAlarm.length) ? mute.mutedByAlarm.join(';') : ""}</td>
                                                    :
                                                    <td title={mute.applicationName}>{mute.applicationName}</td>
                                            }
                                            <td title={mute.CRId}>{mute.CRId}</td>
                                            <td title={mute.statusName}>{mute.statusName}</td>
                                            <td>
                                                {/* <i className="fa fa-edit" onClick={() => openEditForm(mute)}></i> */}
                                            &nbsp; <i className="fa fa-trash" data-toggle="modal" data-target="#deleteModal" onClick={() => setMuteId(mute.monitoringMuteId)}></i></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {
                    totalItemsCount > itemsPerPage && <>
                        <div className="text-center" style={{ marginTop: '1rem' }}>
                            <p>
                                Showing {1 + (itemsPerPage * (activePage - 1))}-{activePage !== noOfPages ? (activePage * itemsPerPage) : totalItemsCount}/{totalItemsCount}
                            </p>
                        </div>
                        <div className="pagination-center">
                            <Pagination count={noOfPages} page={activePage} onChange={handlePageChange} />
                        </div>
                    </>
                }
            </div>
            {/* <----Modal ----> */}
            <div className="modal" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" style={{ width: '420px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Mute</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Do you really want to delete the mute details?
                    </div>
                        <div className="modal-footer">
                            <button type="button" className="cancel-btn" data-dismiss="modal">Close</button>
                            <button type="button" className="save-btn-all" data-dismiss="modal" onClick={deleteMuteDetails}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MuteTab;

