import React, { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ComponentHeader from '../../resources/DashboardHeader';
import Pagination from '@material-ui/lab/Pagination';
import axios from "axios";
import moment from "moment";
import $ from 'jquery';
import { failureToast } from "../../../actions/commons/toaster";
import { generateToken } from "../../../actions/commons/commonActions";
import { productConfigUrls } from "../../../util/apiManager";
import Loader from '../../resources/Loader';
import { fetchRegionAWS } from "../../../actions/hostInventory/awsHostInventoryMain";
import { getAlarmNames } from "../../../actions/admin/cemSettingsActions";


function ConfigTab({ onTabClick, toolsDetails }) {



    const dispatch = useDispatch();
    const [configDetails, setConfigDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItemsCount, setTotalCount] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [hasShowAddNew, setHasShowAddNew] = useState(false);
    const itemsPerPage = 10;

    const { userId, clientId } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.admin
        }
    })

    useEffect(() => {
        getConfigDetails();
        // $("#addNewMute").click(function () {
        //     setHasShowAddNew(true);
        //     $('#addMuteWindow').modal('show');
        // });
    }, [clientId])

    useEffect(async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        fetchRegionAWS(userId, apiToken);
    }, [userId])



    const getConfigDetails = async (skipValue = 0, limitValue = itemsPerPage) => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        setLoading(true);
        let uri = `${productConfigUrls.getEventConfiguration}?clientId=${clientId}&limitValue=${limitValue}&skipValue=${skipValue}&userId=${userId}&apiToken=${apiToken}`;
        axios.get(uri)
            .then(res => {
                setLoading(false);
                if (res.data.status === 200) {
                    setConfigDetails(res.data.data);
                    setTotalCount(res.data.totalCount);
                }
            });
    }

    const handlePageChange = async (e, pageNum) => {
        if (Number(activePage) === Number(pageNum)) {
            return;
        }
        setActivePage(pageNum);
        getConfigDetails((pageNum - 1) * itemsPerPage);
    }
    const TableColumns = ['Tool', 'Rule Name', 'Template', 'Value 1', 'Operator', 'Value 2', 'Notification', 'Ticket', 'Ticket Type', 'Prority', 'Groups', 'Actions'];
    const noOfPages = Math.ceil(Number(totalItemsCount) / itemsPerPage);
    return (
        <>
            <ComponentHeader
                dashboardText={[{ name: 'Admin', className: "component-head-text " }, { name: 'Add Config', id: 'addNewConfig', className: 'btn add-new-tc' }]}
                tabsText={['Monitoring Apps', 'Mute', 'Config']}
                onTabClick={onTabClick}
                activeTabIndex={2}
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Configure Event Rules / Config', path: '' }]}
            />
            <div className="page" id='admin-table'>
                <div className="bg-wh" >
                    <table className="table table-hover my-table">
                        <thead>
                            <tr>
                                {
                                    Array.isArray(TableColumns) && TableColumns.map(column =>
                                        <th key={column} className={column} title={column} ><span className="th-text">{column}</span></th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                configDetails && configDetails.map((config, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {config.config.length > 0 && config.config.map((x, i) => {
                                                return (i === 0) ?
                                                    (<tr key={i}>
                                                        <td title={config.monitoringToolName} rowSpan={config.config.length}>{config.monitoringToolName}</td>
                                                        <td title={config.eventConfigRuleName} rowSpan={config.config.length}>{config.eventConfigRuleName}</td>
                                                        <td rowSpan={config.config.length}>{config.cftInformation ? config.cftInformation.templateName : ""}</td>
                                                        <td>{x.value}</td>
                                                        <td>{x.operatorName}</td>
                                                        <td>{x.value2}</td>
                                                        <td><input type="checkbox" checked={x.notify} readOnly /></td>
                                                        <td><input type="checkbox" checked={x.ticket} readOnly /></td>
                                                        <td>{x.ticketTypeName}</td>
                                                        <td title={x.ticketPriorityName}>{x.ticketPriorityName}</td>
                                                        <td>{x.group}</td>
                                                        <td rowSpan={config.config.length}><i className="fa fa-edit" onClick={() => {
                                                            if (config.cftInformation) {
                                                                this.openEdit(config.config, config.monitoringToolId, config.eventString, config.eventConfigId, config.cftInformation.templateId, config)
                                                            } else {
                                                                this.openEdit(config.config, config.monitoringToolId, config.eventString, config.eventConfigId, config.cftInformation, config)
                                                            }
                                                        }}></i> &nbsp; <i className="fa fa-trash" data-toggle="modal" data-target="#deleteConfigModal" onClick={() => this.setConfigId(config.eventConfigId)}></i></td>
                                                    </tr>)
                                                    :
                                                    (<tr key={i}>
                                                        <td>{x.value}</td>
                                                        <td>{x.operatorName}</td>
                                                        <td>{x.value2}</td>
                                                        <td><input type="checkbox" checked={x.notify} readOnly /></td>
                                                        <td><input type="checkbox" checked={x.ticket} readOnly /></td>
                                                        <td>{x.ticketTypeName}</td>
                                                        <td>{x.ticketPriorityName}</td>
                                                        <td>{x.group}</td>
                                                    </tr>);
                                            })}
                                        </Fragment>
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
        </>
    )
}

export default ConfigTab;

