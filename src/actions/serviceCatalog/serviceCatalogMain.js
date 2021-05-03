import {
    TEMPLATE_LIST, CATALOG_LIST, CREATE_SERVICE_TEMPLATE, AWS_CATALOG,
    AZURE_STACK_UPDATE, AWS_STACK_UPDATE, AZURE_CATALOG_LAUNCH, AZURE_CATALOG,
    AWS_CATALOG_LAUNCH, GET_ENVIRONMENT, GET_REGION, GET_RESOURCE_GROUP, CREATE_ANSIBLE
} from "../../constants/index";

import { serviceCatalogUrls, masterApiUrls } from "./../../util/apiManager";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

//************* Listing *************//
export function getTemplateList(templates) {
    return {
        type: TEMPLATE_LIST,
        templates
    }
}

export function fetchTemplateList(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.getTemplates, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(getTemplateList(data.data));
                return data;
            });
    }
}

export function getCatalogList(catalogList) {
    return {
        type: CATALOG_LIST,
        catalogList
    }
}

export function fetchCatalogList(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.getCatalogs, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(getCatalogList(data.data));
                return data;
            });
    }
}

//************* Create Template *************//
export function createTemplate(templateCreated) {
    return {
        type: CREATE_SERVICE_TEMPLATE,
        templateCreated
    }
}

export function createServiceTemplate(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.createServTemplate, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createTemplate(data)));
    }
}

//************* Create Catalogs *************//
export function createAwsCata(awsCatalog) {
    return {
        type: AWS_CATALOG,
        awsCatalog
    }
}

export function createAwsCatalog(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.createAwsCatalog, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createAwsCata(data)));
    }
}

export function createAzureCata(azureCatalog) {
    return {
        type: AZURE_CATALOG,
        azureCatalog
    }
}

export function createAzureCatalog(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.createAzureCatalog, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createAzureCata(data)));
    }
}

export function createAnsible(ansibleData) {
    return {
        type: CREATE_ANSIBLE,
        ansibleData
    }
}

export function createAnsibleCata(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.createAnsibleCatalog, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createAnsible(data)));
    }
}

//************* Launch Catalogs *************//
export function launchAwsCata(awsCatalogLaunch) {
    return {
        type: AWS_CATALOG_LAUNCH,
        awsCatalogLaunch
    }
}

export function catalogAwsLaunch(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.launchAwsCatalog, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(launchAwsCata(data)));
    }
}

export function launchAzureCata(azureCatalogLaunch) {
    return {
        type: AZURE_CATALOG_LAUNCH,
        azureCatalogLaunch
    }
}

export function catalogAzureLaunch(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.launchAzureCatalog, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(launchAzureCata(data)));
    }
}

//************* Update Catalogs *************//
export function awsStackUpd(awsStackUpdated) {
    return {
        type: AWS_STACK_UPDATE,
        awsStackUpdated
    }
}

export function awsStackUpdate(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.updateAwsStack, {
            method: 'PUT',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(awsStackUpd(data)));
    }
}

export function azureStackUpd(azureStackUpdated) {
    return {
        type: AZURE_STACK_UPDATE,
        azureStackUpdated
    }
}

export function azureStackUpdate(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.updateAzureStack, {
            method: 'PUT',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(azureStackUpd(data)));
    }
}

//************* Master Data *************//
export function setMasterData(masterData, masterCode) {
    switch (masterCode) {
        case "ENV":
            let environment = masterData;
            return {
                type: GET_ENVIRONMENT,
                environment
            }
    }
}

export function masterData(masterCode, userId, apiToken) {
    return dispatch => {
        fetch(`${masterApiUrls.getMasterData}${masterCode}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(setMasterData(data.data, masterCode)));
    }
}

//************* GET Region and Resource Group *******//
export function getRegions(region) {
    return {
        type: GET_REGION,
        region: region.status === 200 ? region.data.regions : []
    }
}

export function fetchAwsRegions(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.getAwsRegions, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(getRegions(data))
            });
    }
}

export function getResourceGroups(resourceGroup) {
    return {
        type: GET_RESOURCE_GROUP,
        resourceGroup: resourceGroup.status === 200 ? resourceGroup.data.resourceGroups : []
    }
}

export function fetchAzureResourceGroup(request) {
    return dispatch => {
        return fetch(serviceCatalogUrls.getAzureResourceGroup, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getResourceGroups(data)));
    }
}