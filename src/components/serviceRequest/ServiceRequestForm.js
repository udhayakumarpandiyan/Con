import React, { useEffect, useState } from 'react';
import ComponentHeader from '../resources/DashboardHeader';
import Widgets from '../resources/Widgets';
import $ from 'jquery';
import AsyncComponent from '../../AsyncComponent';
import './resources/page.css';
import { useDispatch } from "react-redux";
import {
    saveUserRequest, saveClientRequest, saveHostRequest, saveNetworkRequest, saveProjectRequest, savePsgRequest,
    requestService, infraServiceRequest
} from "../../actions/requestForm/requestMain";
import { failureToast, successToast } from "../../actions/commons/toaster";
import Loader from '../resources/Loader';
let NetworkConfiguration = AsyncComponent(() => import('./NetworkConfiguration').then(module => module.default));
let UserCreation = AsyncComponent(() => import('./UserCreationForm').then(module => module.default));
let ClientCreationForm = AsyncComponent(() => import('./ClientCreationForm').then(module => module.default));
let HostRequestForm = AsyncComponent(() => import('./HostRequestForm').then(module => module.default));
let ProjectRequestForm = AsyncComponent(() => import('./ProjectRequestForm').then(module => module.default));
let PSGRequestForm = AsyncComponent(() => import('./PSGRequestForm').then(module => module.default));
let NewServiceRequestForm = AsyncComponent(() => import('./NewServiceRequestForm').then(module => module.default));
let IPRequestForm = AsyncComponent(() => import('./IPRequestForm').then(module => module.default));

function ServiceRequestForm(props) {

    const lsItems = [
        {
            'modalId': 'networkCreation',
            "name": "Configure Network/URl/Port Monitor",
            "display": <>Configure <div>Network/URl/Port Monitor</div></>,
            "path": null,
            "icon": require('../assets/Service/ConfigureNetwork.svg')
        },
        {
            'modalId': 'userCreate',
            "name": "User Creation or Update",
            "display": <div>User Creation or Update</div>,
            "path": null,
            "icon": require('../assets/Service/UserRequest.svg')
        },
        {
            'modalId': 'clientCreate',
            "name": "Client Creation or Update",
            "display": <div>Client Creation or Update</div>,
            "path": null,
            "icon": require('../assets/Service/ClientRequest.svg')
        },
        {
            'modalId': 'projectCreate',
            "name": "Project Creation",
            "display": <div>Project Creation</div>,
            "path": null,
            "icon": require('../assets/Service/ProjectRequest.svg')
        },
        {
            'modalId': 'psgResource',
            "name": "PSG Resource",
            "display": <div>PSG Resource</div>,
            "path": null,
            "icon": require('../assets/Service/UserRequest.svg')
        },
        {
            'modalId': 'hostService',
            "name": "Host Memory Services",
            "display": <div>Host Memory Services</div>,
            "path": null,
            "icon": require('../assets/Service/HostRequest.svg')
        },
        {
            'modalId': 'newServiceRequest',
            "name": "New Service Request",
            "display": <><div>New Service Request</div></>,
            "path": null,
            "icon": require('../assets/Service/HostRequest.svg')
        },
        {
            'modalId': 'IPRequest',
            "name": "Infrastructure Provisioning Request",
            "display": <><div>Infrastructure Provisioning Request</div></>,
            "path": null,
            "icon": require('../assets/Service/HostRequest.svg')
        }
    ]

    const dispatch = useDispatch();
    useEffect(async () => {
        $("#networkCreation").click(() => {
            $('#networkConfiguration').modal('show');
        });
        $("#userCreate").click(() => {
            $('#userCreateModal').modal('show');
        });
        $("#clientCreate").click(() => {
            $('#clientCreationModal').modal('show');
        });
        $("#hostService").click(() => {
            $('#hostRequestModal').modal('show');
        });
        $("#projectCreate").click(() => {
            $('#projectCreationModal').modal('show');
        });
        $("#psgResource").click(() => {
            $('#psgRequestFormModal').modal('show');
        });
        $("#newServiceRequest").click(() => {
            $('#newServiceRequestFormModal').modal('show');
        });
        $("#IPRequest").click(() => {
            $('#IPRequestFormModal').modal('show');
        });
    }, [])

    const [loading, setLoading] = useState(false);

    const onSubmitNetworkReq = ({ clientName, protocolType, hostIp, port, response, additionalTags, createdBy, userId, emailId, clientId, featureId, apiToken, setInitialState = () => { } }) => {
        showLoaderIcon(true);
        const saveNetwork = dispatch(saveNetworkRequest({ clientName, protocolType, hostIp, port, response, additionalTags, createdBy, userId, emailId, clientId, featureId, apiToken }));
        return saveNetwork.then((res) => {
            showLoaderIcon(false);
            if (res.addProbeRequest.status === 200) {
                setInitialState();
                successToast("Network/URI/Port Monitor request added successfully.");
                $('#networkConfiguration').modal('hide');
                return;
            }
            const message = typeof res.addProbeRequest.message === "string" ? res.addProbeRequest.message : "Something went wrong. Please try again!";
            failureToast(message);
            $('#networkConfiguration').modal('hide');
            return res;
        }).catch(() => {
            showLoaderIcon(false);
            $('#networkConfiguration').modal('hide');
            failureToast("Something went wrong. Please try again!");
            return { status: 201, message: 'Something went wrong' };
        });
    };

    const submitUserRequest = (payload, setInitialState) => {
        showLoaderIcon(true);
        const userResponse = dispatch(saveUserRequest(payload));
        return userResponse.then((res) => {
            showLoaderIcon(false);
            setInitialState();
            if (res.addUserRequest.status === 200) {
                $('#userCreateModal').modal('hide');
                return successToast("User request added successfully.");
            }
            $('#userCreateModal').modal('hide');
            const message = typeof res.addUserRequest.message === "string" ? res.addUserRequest.message : "Something went wrong. Please try again!";
            failureToast(message);
        }).catch(() => {
            showLoaderIcon(false);
            $('#userCreateModal').modal('hide');
            failureToast("Something went wrong. Please try again!");
        });
    };

    const submitClientRequest = (payload, setInitialState) => {
        showLoaderIcon(true);
        const clientResponse = dispatch(saveClientRequest(payload));
        return clientResponse.then((res) => {
            showLoaderIcon(false);
            setInitialState();
            if (res.addClientRequest.status === 200) {
                $('#clientCreationModal').modal('hide');
                return successToast("Client request added successfully.");
            }
            $('#clientCreationModal').modal('hide');
            const message = typeof res.addClientRequest.message === "string" ? res.addClientRequest.message : "Something went wrong. Please try again!";
            failureToast(message);
        }).catch(() => {
            showLoaderIcon(false);
            $('#clientCreationModal').modal('hide');
            failureToast("Something went wrong. Please try again!");
        });
    };

    const submitHostRequest = ({ moduleName, createdBy, requestType, notes, userId, clientId, featureId, emailId, apiToken, setInitialState }) => {
        showLoaderIcon(true);
        const hostResponse = dispatch(saveHostRequest({ moduleName, createdBy, requestType, notes, userId, clientId, featureId, emailId, apiToken }));
        return hostResponse
            .then((res) => {
                showLoaderIcon(false);
                if (res.addHostRequest.status === 200) {
                    setInitialState();
                    $('#hostRequestModal').modal('hide');
                    return successToast("Host Memory Service request added successfully.");
                }
                $('#hostRequestModal').modal('hide');
                setInitialState();
                const message = typeof res.addHostRequest.message === "string" ? res.addHostRequest.message : "Something went wrong. Please try again!";
                failureToast(message);
            }).catch(() => {
                $('#hostRequestModal').modal('hide');
                showLoaderIcon(false);
                setInitialState();
                failureToast("Something went wrong. Please try again!");
            });
    };

    const onSubmitProjectRequest = async (postReq, setInitialState) => {
        showLoaderIcon(true);
        const projectRes = dispatch(saveProjectRequest(postReq));
        return projectRes.then((res) => {
            showLoaderIcon(false);
            if (res.addProjectRequest.status === 200) {
                setInitialState();
                $('#projectCreationModal').modal('hide');
                return successToast("Project request added successfully.");
            }
            const message = typeof res.addProjectRequest.message === "string" ? res.addProjectRequest.message : "Something went wrong. Please try again!";
            failureToast(message);
        }).catch(() => {
            showLoaderIcon(false);
            failureToast("Something went wrong. Please try again!");
        });
    };

    const onSubmitPsgRequest = (payload, setInitialState) => {
        showLoaderIcon(true);
        const psgRes = dispatch(savePsgRequest(payload));
        psgRes.then((res) => {
            if (res.addPsgRequest.status === 200) {
                setInitialState();
                showLoaderIcon(false);
                $('#psgRequestFormModal').modal('hide');
                return successToast("PSG Resource request added successfully.");
            }
            showLoaderIcon(false);
            const message = typeof res.addPsgRequest.message === "string" ? res.addPsgRequest.message : "Something went wrong. Please try again!";
            failureToast(message);
        }).catch(() => {
            showLoaderIcon(false);
            failureToast("Something went wrong. Please try again!");
        });
    };

    const onSubmitServiceRequest = (payload, setInitialState) => {
        showLoaderIcon(true);
        const addServiceRequest = dispatch(requestService(payload));
        addServiceRequest.then((res) => {
            if (res.serviceRequest.status === 200) {
                setInitialState();
                showLoaderIcon(false);
                $('#newServiceRequestFormModal').modal('hide');
                return successToast("Service Request added successfully. ITSM Team will contact you!");
            }
            showLoaderIcon(false);
            const message = typeof res.serviceRequest.message === "string" ? res.serviceRequest.message : "Something went wrong. Please try again!";
            failureToast(message);
        }).catch(() => {
            showLoaderIcon(false);
            failureToast("Something went wrong. Please try again!");
        });
    }

    const onSubmitIPRequest = (payload, setInitialState) => {
        showLoaderIcon(true);
        const addIP = dispatch(infraServiceRequest(payload));
        addIP.then((res) => {
            if (res.IPRequest.status === 200) {
                setInitialState();
                showLoaderIcon(false);
                $('#IPRequestFormModal').modal('hide');
                return successToast("Infrastructure Provisioning Request added successfully. ITSM Team will contact you!");
            }
            showLoaderIcon(false);
            const message = typeof res.IPRequest.message === "string" ? res.IPRequest.message : "Something went wrong. Please try again!";
            failureToast(message);
        }).catch((err) => {
            showLoaderIcon(false);
            failureToast("Something went wrong. Please try again!");
        });
    }

    const showLoaderIcon = (loading) => setLoading(loading);
    const { history } = props;
    return (
        <div className='request'>
            <Loader loading={loading} />
            <ComponentHeader
                dashboardText={[{ name: 'Service Request Forms', className: "component-head-text" }]}
            />
            <Widgets history={history} items={lsItems} />
            <NetworkConfiguration onSubmitNetworkReq={onSubmitNetworkReq} loading={loading} />
            <UserCreation submitUserRequest={submitUserRequest} loading={loading} />
            <ClientCreationForm submitClientRequest={submitClientRequest} loading={loading} />
            <HostRequestForm submitHostRequest={submitHostRequest} loading={loading} />
            <ProjectRequestForm onSubmitProjectRequest={onSubmitProjectRequest} loading={loading} />
            <PSGRequestForm onSubmitPsgRequest={onSubmitPsgRequest} loading={loading} />
            <NewServiceRequestForm onSubmitServiceRequest={onSubmitServiceRequest} loading={loading} />
            <IPRequestForm onSubmitIPRequest={onSubmitIPRequest} loading={loading} />
        </div>
    )
}

export default ServiceRequestForm;
