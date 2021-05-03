import { combineReducers } from "redux";
import clients from "./reducers/admin/clients";
import users from "./reducers/admin/users";
import groups, { getAverageTickets, getSLAInfo, cemEventBarGraphData, getTicketStatus, getAvailableTicketArticles, getEventsBySource, getTicketsCountByStatus, ticketAvgResponceResolution } from "./reducers/admin/groups";
import helpTopics from "./reducers/admin/helpTopics";
import features from "./reducers/admin/features";
import permissions from "./reducers/admin/permissions";
import roles from "./reducers/admin/roles";
import audits from "./reducers/admin/audits";
import clientGroupHelpTopics from "./reducers/admin/clientGroupHelpTopics"
import {
    clientVisGroups,
    allClientVisGroups, groupsMappedToClient, getSelectedClientUsers
} from "./reducers/admin/clientVisGroups"
import userClientTickets from "./reducers/admin/userClientTickets"
import {
    projects, projectDetails,
    projectTypes, projectClients,
    editProjectDetails, timeSheetData, viewProjectDetails, deleteProjectDetails, viewSandBoxAccountList,
    addAlreadyHaveAccount, editSandboxAccount, editSandboxProject, addSandboxWithApprovalFlow,
    addApprover, removeApprover, sendReminder, addUser, removeUser, addAWSInfo, addAZUREInfo, getProjectList, sandboxAccountsByProject,
    getOnDemandAutoDiscoverySBTokens, setOnDemandSBSetIntervalIds as getOnDemandSBSetIntervalIds, autoApproverForHost
} from "./reducers/projects/projects";
import rcas from "./reducers/rca/rcaList";
import {
    rcaDetails,
    groupsList,
    usersList
} from "./reducers/rca/rcaDetails";
import actionBarReducer from "./reducers/actionBarReducer";
import current_user from "./reducers/auth/authReducer"
import current_client from "./reducers/auth/clientReducer"
import userClients from "./reducers/auth/userClients"
// import topGroupTickets from "./reducers/auth/topGroupTickets"
import clientUserFeatures, { hasAdminAccess } from "./reducers/auth/clientUserFeature"
import groupList from "./reducers/admin/groups"
import featuresList from "./reducers/featureList"
import userList from "./reducers/userList"
import clientGroupDetails from "./reducers/clientGroupDetails"
import clientGroupUser from "./reducers/clientGroup";
import clientsList from "./reducers/rca/clientList";
import mom from "./reducers/mom/momList";
import {
    momDetails, momUpdatedData,
    momTopicStatus, submittedData
} from "./reducers/mom/momDetails";
import momClientList from "./reducers/mom/momClientList";
import momProjectList from "./reducers/mom/momProjectList";
import momStatus from "./reducers/mom/momStatus";
import momData from "./reducers/mom/momAdd";
import momDeletedData from "./reducers/mom/momDelete";
import groupFeaturePermissions from "./reducers/admin/groupFeaturePermission"
import rcaEdit from "./reducers/rca/rcaEdit"
import tickets from "./reducers/ticketing/ticketReducer";
import ticketDetails from "./reducers/ticketing/ticketDetailReducer";
import ticketStory from "./reducers/ticketing/ticketStoryReducer"
import ticketType from "./reducers/ticketing/ticketTypeReducer";
import ticketState, { awsServiceCodes, awsCategoryCodes, timeZonesBehalfOfUser } from "./reducers/ticketing/ticketStatusReducer";
import ticketPriority from "./reducers/ticketing/ticketPriorityReducer";
import usersLists from "./reducers/ticketing/usersListReducer";
import { activity, activityState, activityStatus } from "./reducers/plannedActivity/activity";
import { newActivity, activityDetails } from "./reducers/plannedActivity/addActivity";
import {
    copyPlanActivity,
    obsoletePlanActivity,
    submitPlanActivity,
    approvePlanActivity,
    automationTemplates
} from "./reducers/plannedActivity/activityDetails";
import {
    newScheduleTask,
    tasks,
    scheduleTaskClients,
    updateScheduledTask
} from "./reducers/scheduleTask/tasks";
import userDirList from "./reducers/userDirReducer/userDirReducer";
import userDirDetails from "./reducers/userDirReducer/userDirDetailsReducer";
import userDirStatus from "./reducers/userDirReducer/userDirStatusReducer";
import userDirRole from "./reducers/userDirReducer/userDirRoleReducer";
import userDirGroup from "./reducers/userDirReducer/userDirGroupReducer";
import userDirAdd from "./reducers/userDirReducer/userDirAddReducer";
import userDirClient from "./reducers/userDirReducer/userDirClientReducer";
import clientDirList from "./reducers/clientDirReducer/clientDirReducer";
import clientDirStatus from "./reducers/clientDirReducer/clientDirStatusReducer";
import clientDirLevel from "./reducers/clientDirReducer/clientDirLevelReducer";
import clientDirDetails from "./reducers/clientDirReducer/clientDirDetailsReducer";
import clientDirSubmitSms from "./reducers/clientDirReducer/clientDirSmsReducer";
import clientDirUnsubscribedServices from "./reducers/clientDirReducer/clientDirUnServiceReducer";
import clientDirSubscribedServices from "./reducers/clientDirReducer/clientDirServiceReducer";
import clientDirServiceDelete from "./reducers/clientDirReducer/clientDirServiceDeleteReducer";
import clientDirServiceAdd from "./reducers/clientDirReducer/clientDirServiceAddReducer";
import clientDirCountry from "./reducers/clientDirReducer/clientDirCountryReducer";
import userDirListForClient from "./reducers/clientDirReducer/clientDirUserListReducer";
import clientDirAdd from "./reducers/clientDirReducer/clientDirAddReducer";
import userDirEdit from "./reducers/userDirReducer/userDirEditReducer";
import clientDirEdit from "./reducers/clientDirReducer/clientDirEditReducer";
import clientDirPolicies from "./reducers/clientDirReducer/clientDirPoliciesReducer";
import masterClientCD from "./reducers/clientDirReducer/clientMasterClientReducer";
import {
    awsList, hostClients,
    getEnvList, getTypeList, getOsList,
    getRegionAWS, getRegionAzure
} from "./reducers/hostInventory/awsHostList";
import awsHostDetails from "./reducers/hostInventory/awsHostDetails";
import { awsApproveDetails } from "./reducers/hostInventory/awsHostDetails";
import { awsRejectDetails } from "./reducers/hostInventory/awsHostDetails";
import {
    azureList, getAzureList, onDemandAutoDiscoveryAzure, onDemandADAzureSandbox, setAzureAutoDiscoveryToken,
    setAzureOnDemandSetIntervalId, bulkApproveAzure, azureCurrentState, manualStartAzureHost, manualStopAzureHost
    , bulkRejectAzure, azureSearchHost
} from "./reducers/hostInventory/azureHostList";
import { startEc2Data } from "./reducers/hostInventory/awsHostDetails";
import { stopEc2Data } from "./reducers/hostInventory/awsHostDetails";
import {
    getSsoUrl, getAwsList, getUserForHost, getClientAutoDiscover, updateClientAutoDiscover,
    getSandboxAutoDiscover, updateSandboxAutoDiscover, onDemandAutoDiscoveryAws, onDemandADAwsSandbox, removeAwsHost,
    getAutoDiscoveryStatus, sendForApprovalAws, setAWSAutoDiscoveryToken, getOnDemandSetIntervalId, bulkApproveAws,
    bulkRejectAws, awsCurrentState, manualStartAwsHost, manualStopAwsHost, awsSearchHost
} from "./reducers/hostInventory/awsHostList";
import { addHost, addAzureHost, editHost, roleInfo, deleteAWSHost, updateAWSHost } from "./reducers/hostInventory/hostAdd";
import azureHostDetails from "./reducers/hostInventory/azureHostDetails";
import { stopVmData, azureApproveDetails, azureRejectDetails, startVmData, deleteAzureHost, updateAzureHost } from "./reducers/hostInventory/azureHostDetails";
import { getAzureAutoDiscoveryList, getAzureAutoDiscoveryById, deleteAutoDiscoveryHost, azureSendForApprovalHost, updateAzureDiscoverHost } from "./reducers/hostInventory/autoDiscovery/azureAutoDiscoveryHost";
import { getAzureUnVerifiedList, getAzureUnVerifiedById, sendToAzurePreviousState } from "./reducers/hostInventory/unVerified/azureUnVerifiedHost";
import { getAzureRejectedList, getAzureRejectedById, updateAzureRejectedHost } from "./reducers/hostInventory/rejected/azureRejectedHost";
import { getAwsAutoDiscoveryList, getAwsAutoDiscoveryById, updateAwsDiscoveredHost } from "./reducers/hostInventory/autoDiscovery/awsAutoDiscoveryHost";
import { getAwsUnVerifiedList, getAwsUnVerifiedById, sendPreviousStateAws } from "./reducers/hostInventory/unVerified/awsUnVerifiedHost";
import { getAwsRejectedList, getAwsRejectedById, updateAwsRejectedHost } from "./reducers/hostInventory/rejected/awsRejectedHost";

import {
    request,
    addUserRequest,
    addProbeRequest,
    addProjectRequest,
    addPsgRequest,
    addClientRequest,
    addHostRequest,
    addServiceRequest,
    addIPRequest
} from "./reducers/requestForm/request";
import requestType from "./reducers/requestForm/requestType";
import hostRequestType from "./reducers/requestForm/hostRequestType";
import requestClientName from "./reducers/requestForm/clientName";
import requestTaskType from "./reducers/requestForm/requestTaskType";
import requestProjectType from "./reducers/requestForm/requestProjectType";
import requestProjectList from "./reducers/requestForm/requestProjectList";
import monitoring from "./reducers/monitoring/monitoringReducer";
import {
    monitoringDetails,
    masterClient
} from "./reducers/monitoring/monitoringDetails";


import {
    policyReport, ticketSummary, serviceSummary, userReport, clientReport,
    usersForClients, userOpenTickets
} from "./reducers/reports/reports"
import { autoDocHostList, autoDocCurrentDelta, autoDeltaList } from "./reducers/autoDoc/autoDoc";
import {
    changeList,
    changeRegDetails,
    changeDeleteDetails,
    changeUserList,
    addChangeRegister,
    changeType,
    editChangeRegister,
    changeSubmitDetails
} from "./reducers/changeRegister/change";

import { getAllMasterData, groupHelpTopics, generateToken, clientUsers, tokenExpiredTime, getClientLogos, setSelectedClientName } from "./reducers/commons/commonDetails";
import {
    ticketSettings, getLogs,
    emailTemplates, systemLogs,
    maxLogins, timeZones, editTicketSettings,
    banList, templateList, emailList, emailDetails,
    deletedEmail, updatedEmail, newEmail,
    deletedTemplate, deletedBanEmail, protoList
} from "./reducers/admin/settings";

import {
    templates, catalogList,
    templateCreated, awsCatalog,
    awsCatalogLaunch, azureCatalog,
    azureCatalogLaunch, awsStackUpdated,
    azureStackUpdated, environment,
    region, resourceGroup, ansibleData
} from "./reducers/serviceCatalog";

import {
    orchTemplatesList, orchTemplatesListById, orchServiceList,
    orchTemplateCreated, modifyOrchServicePlan,
    orchTemplateDeleted, createOrchService, orchListById,
    orchProviderList, modifyOrchService, orchLaunchedDeleted
} from "./reducers/orchestration";

import {
    getAllActiveEvents, getActiveFilteredEvents, loginDetailsByClientId, getAllEventList, graphanaWidgetList, eventByRecurrence, eventByTheTime, sendMailCemDashboard, ticketByEvents, getAcknowledgeEvents,
    incidentDetails, availableOrchTemplate
} from "./reducers/cemDashboard/activeEvents";
import { docType, relatedModule, userListDoc } from "./reducers/documentMgmt";
import { setArticleStatus, setActivePage } from "./reducers/knowledgeBase/kbMainReducer";
import { hasFeaturePermission } from "./reducers/auth/checkingFeature";
import { SelectedSessionTab, activeSessions } from "./reducers/admin/userSessions"
import { getAlarmNames, getLogGroupTypes, getLogGroupsNames } from "./reducers/admin/cemSettingsReducers";
import {
    MyTicketSLAStas,
    EscalateTickets,
    AcknowledgeEvents,
    EventStats,
    TicketStats,
    MyResponseResolution,
    MyPerformanceStats,
    eventsBySource,
    eventsToolsTrendsData
} from "./reducers/MainDashBoard";

import { getServicenowObj } from './reducers/admin/servicenow';
const reducers = {
    current_user,
    groupList,
    clients,
    users,
    groups,
    helpTopics,
    features,
    permissions,
    roles,
    audits,
    projects,
    projectDetails,
    projectTypes,
    projectClients,
    editProjectDetails,
    timeSheetData,
    rcas,
    rcaDetails,
    roleInfo,
    rcaEdit,
    groupsList,
    usersList,
    actionClientId: actionBarReducer,
    clientsList,
    clientId: actionBarReducer,
    featuresList,
    userList,
    clientGroupDetails,
    tasks,
    clientGroupUser,
    mom,
    momDetails,
    momClientList,
    momProjectList,
    momStatus,
    momData,
    momUpdatedData,
    momDeletedData,
    momTopicStatus,
    submittedData,
    updateScheduledTask,
    newScheduleTask,
    scheduleTaskClients,
    groupFeaturePermissions,
    tickets,
    ticketDetails,
    ticketStory,
    ticketType,
    ticketState,
    ticketPriority,
    userClientTickets,
    current_client,
    clientUserFeatures,
    userClients,
    usersLists,
    // topGroupTickets,
    activity,
    activityState,
    activityStatus,
    newActivity,
    activityDetails,
    copyPlanActivity,
    obsoletePlanActivity,
    submitPlanActivity,
    approvePlanActivity,
    automationTemplates,
    userDirList,
    userDirDetails,
    userDirStatus,
    userDirRole,
    userDirGroup,
    userDirAdd,
    userDirClient,
    request,
    requestType,
    addUserRequest,
    hostRequestType,
    requestClientName,
    requestTaskType,
    addProbeRequest,
    requestProjectType,
    addProjectRequest,
    requestProjectList,
    addPsgRequest,
    addClientRequest,
    addHostRequest,
    awsList,
    awsHostDetails,
    awsApproveDetails,
    awsRejectDetails,
    azureApproveDetails,
    azureRejectDetails,
    azureList,
    azureHostDetails,
    startEc2Data,
    stopEc2Data,
    startVmData,
    stopVmData,
    addHost,
    addAzureHost,
    hostClients,
    getEnvList,
    getTypeList,
    getOsList,
    editHost,
    monitoring,
    monitoringDetails,
    masterClient,
    changeList,
    changeRegDetails,
    changeDeleteDetails,
    changeUserList,
    addChangeRegister,
    changeType,
    editChangeRegister,
    changeSubmitDetails,
    clientDirList,
    clientDirStatus,
    clientDirLevel,
    clientDirDetails,
    clientDirSubmitSms,
    clientDirUnsubscribedServices,
    clientDirSubscribedServices,
    clientDirServiceDelete,
    clientDirServiceAdd,
    clientDirCountry,
    userDirListForClient,
    clientDirAdd,
    userDirEdit,
    clientDirEdit,
    clientDirPolicies,
    masterClientCD,
    getAllMasterData,
    groupHelpTopics,
    generateToken,
    getRegionAWS,
    getRegionAzure,
    ticketSettings,
    getLogs,
    emailTemplates,
    systemLogs,
    maxLogins,
    banList,
    templateList,
    emailList,
    timeZones,
    editTicketSettings,
    clientGroupHelpTopics,
    clientVisGroups,
    allClientVisGroups,
    clientUsers,
    emailDetails,
    deletedEmail,
    updatedEmail,
    newEmail,
    deletedTemplate,
    deletedBanEmail,
    protoList,
    policyReport,
    ticketSummary,
    serviceSummary,
    userReport,
    clientReport,
    usersForClients,
    userOpenTickets,
    autoDocHostList,
    autoDocCurrentDelta,
    autoDeltaList,

    //service catalog
    templates,
    catalogList,
    templateCreated,
    awsCatalog,
    awsCatalogLaunch,
    azureCatalog,
    azureCatalogLaunch,
    awsStackUpdated,
    azureStackUpdated,
    environment,
    region,
    resourceGroup,
    ansibleData,

    //orchestration
    orchTemplatesList,
    orchServiceList,
    orchTemplatesListById,
    orchTemplateCreated,
    createOrchService,
    modifyOrchService,
    orchTemplateDeleted,
    orchProviderList,
    orchListById,
    modifyOrchServicePlan,
    orchLaunchedDeleted,
    // cem dashboard
    getAllActiveEvents,
    getActiveFilteredEvents,
    getAllEventList,

    // token expired time
    tokenExpiredTime,
    hasAdminAccess,

    //Document Mgmt
    relatedModule,
    docType,
    userListDoc,
    //knowledge base
    getArticleStatus: setArticleStatus,
    getActivePage: setActivePage,

    // average tickets
    getAverageTickets,
    getSLAInfo,
    // checking feature permissions
    hasFeaturePermission,
    // groups mapped to client 
    groupsMappedToClient,
    getSelectedClientUsers,

    //sso login
    ssoUrl: getSsoUrl,
    // sessions
    SelectedSessionTab,
    activeSessions,

    // view project details;

    viewProjectDetails,
    deleteProjectDetails,
    viewSandBoxAccountList,
    addAlreadyHaveAccount,
    editSandboxAccount,
    editSandboxProject,
    addSandboxWithApprovalFlow,
    addApprover,
    autoApproverForHost,
    removeApprover,
    sendReminder,
    addUser,
    removeUser,
    addAWSInfo,
    addAZUREInfo,
    // host inventory actions
    deleteAWSHost,
    updateAWSHost,
    deleteAzureHost,
    updateAzureHost,
    getProjectList,
    sandboxAccountsByProject,

    // PM AWS/AZURE List / New Host Inventory data
    getAzureList,
    getAwsList,
    getUserForHost,
    loginDetailsByClientId,

    // Auto Discovery Host Inventory
    getClientAutoDiscover,
    updateClientAutoDiscover,
    getSandboxAutoDiscover,
    updateSandboxAutoDiscover,
    onDemandADAwsSandbox,
    onDemandADAzureSandbox,
    onDemandAutoDiscoveryAws,
    onDemandAutoDiscoveryAzure,
    removeAwsHost,
    sendForApprovalAws,
    getAutoDiscoveryStatus,
    /* auto discovery  */
    getAzureAutoDiscoveryList,
    getAzureAutoDiscoveryById,
    getAwsAutoDiscoveryList,
    getAwsAutoDiscoveryById,
    updateAwsDiscoveredHost,
    /* un verified */
    getAzureUnVerifiedList,
    getAzureUnVerifiedById,
    getAwsUnVerifiedById,
    getAwsUnVerifiedList,
    sendPreviousStateAws,
    /* rejected */
    getAzureRejectedList,
    getAzureRejectedById,
    getAwsRejectedById,
    getAwsRejectedList,
    updateAwsRejectedHost,
    deleteAutoDiscoveryHost,
    azureSendForApprovalHost,
    updateAzureDiscoverHost,
    sendToAzurePreviousState,
    updateAzureRejectedHost,
    setAWSAutoDiscoveryToken,
    getOnDemandSetIntervalId,
    setAzureAutoDiscoveryToken,
    setAzureOnDemandSetIntervalId,
    getOnDemandAutoDiscoverySBTokens,
    getOnDemandSBSetIntervalIds,
    bulkApproveAws,
    bulkRejectAws,
    bulkApproveAzure,
    bulkRejectAzure,
    awsCurrentState,
    azureCurrentState,
    awsSearchHost,
    azureSearchHost,
    manualStartAwsHost,
    manualStopAwsHost,
    manualStartAzureHost,
    manualStopAzureHost,
    awsServiceCodes,
    awsCategoryCodes,
    cemEventBarGraphData,
    getTicketStatus,
    getAlarmNames,
    getLogGroupTypes,
    getLogGroupsNames,
    graphanaWidgetList,
    eventByRecurrence,
    eventByTheTime,
    sendMailCemDashboard,
    ticketByEvents,
    getAcknowledgeEvents,
    incidentDetails,
    getClientLogos,
    getAvailableTicketArticles,
    getEventsBySource,
    getTicketsCountByStatus,
    availableOrchTemplate,
    ticketAvgResponceResolution,
    MyTicketSLAStas,
    EscalateTickets,
    AcknowledgeEvents,
    EventStats,
    TicketStats,
    MyResponseResolution,
    MyPerformanceStats,
    eventsBySource,
    eventsToolsTrendsData,
    setSelectedClientName,
    timeZonesBehalfOfUser,
    getServicenowObj,
    addServiceRequest,
    addIPRequest
}

export default combineReducers(reducers)