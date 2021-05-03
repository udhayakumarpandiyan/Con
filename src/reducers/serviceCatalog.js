import {TEMPLATE_LIST, CATALOG_LIST, CREATE_SERVICE_TEMPLATE, AWS_CATALOG, AZURE_STACK_UPDATE, 
    AWS_STACK_UPDATE, AZURE_CATALOG_LAUNCH, AZURE_CATALOG, AWS_CATALOG_LAUNCH, GET_ENVIRONMENT,
    GET_REGION, CREATE_ANSIBLE, GET_RESOURCE_GROUP} from "../constants/index"

export function templates(state = [], action = {} )  {
switch(action.type) {
    case TEMPLATE_LIST: 
        return action.templates
    default: return state;
}
}

export function catalogList(state = [], action = {} )  {
switch(action.type) {
    case CATALOG_LIST: 
        return action.catalogList
    default: return state;
}
}

export function templateCreated(state = [], action = {} )  {
switch(action.type) {
    case CREATE_SERVICE_TEMPLATE: 
        return action.templateCreated
    default: return state;
}
}

export function awsCatalog(state = [], action = {} )  {
switch(action.type) {
    case AWS_CATALOG: 
        return action.awsCatalog
    default: return state;
}
}

export function awsCatalogLaunch(state = [], action = {} )  {
switch(action.type) {
    case AWS_CATALOG_LAUNCH: 
        return action.awsCatalogLaunch
    default: return state;
}
}

export function azureCatalog(state = [], action = {} )  {
switch(action.type) {
    case AZURE_CATALOG: 
        return action.azureCatalog
    default: return state;
}
}

export function azureCatalogLaunch(state = [], action = {} )  {
switch(action.type) {
    case AZURE_CATALOG_LAUNCH: 
        return action.azureCatalogLaunch
    default: return state;
}
}

export function awsStackUpdated(state = [], action = {} )  {
switch(action.type) {
    case AWS_STACK_UPDATE: 
        return action.awsStackUpdated
    default: return state;
}
}

export function azureStackUpdated(state = [], action = {} )  {
switch(action.type) {
    case AZURE_STACK_UPDATE: 
        return action.azureStackUpdated
    default: return state;
}
}

export function environment(state = [], action = {} )  {
switch(action.type) {
    case GET_ENVIRONMENT: 
        return action.environment
    default: return state;
}
}

export function region(state = [], action = {} )  {
switch(action.type) {
    case GET_REGION: 
        return action.region
    default: return state;
}
}

export function resourceGroup(state = [], action = {} )  {
switch(action.type) {
    case GET_RESOURCE_GROUP: 
        return action.resourceGroup
    default: return state;
}
}

export function ansibleData(state = [], action = {} )  {
switch(action.type) {
    case CREATE_ANSIBLE: 
        return action.ansibleData
    default: return state;
}
}