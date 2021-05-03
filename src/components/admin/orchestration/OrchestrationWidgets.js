import React, { Component } from "react";
import WidgetsPage from '../resources/WidgetsPage';
import { ORCHESTRATION_ADMIN_DASHBOARD_HEAD } from '../../../constants/index';
import {
    MyViewIcon, OrganizationsIcon, UsersIcon, TeamsIcon, NotificationsIcon, ManagementJobsIcon, CredentialTypeIcon, InventoriesIcon
} from '../../../constants/Icons';

let adminWidgets = [
    { "name": "Organizations", "display": "Organizations", "path": "/organizations", 'svg': OrganizationsIcon },
    { "name": "Users", "display": "Users", "path": "/users", 'svg': UsersIcon },
    { "name": "Teams", "display": "Teams", "path": "/teams", 'svg': TeamsIcon },
    { "name": "Notifications", "display": "Notifications", "path": "/notification_templates", 'svg': NotificationsIcon },
    { "name": "Applications", "display": "Applications", "path": "/applications", 'svg': MyViewIcon },
    { "name": "Credential Types", "display": "Credential Types", "path": "/credential_types", 'svg': CredentialTypeIcon },
    { "name": "Management Jobs", "display": "Management Jobs", "path": "/management_jobs", 'svg': ManagementJobsIcon },
    { "name": "Instance Groups", "display": "Instance Groups", "path": "/instance_groups", 'svg': InventoriesIcon },
]

function AdminPage(props) {
    return (
        <WidgetsPage
            widgets={adminWidgets}
            header={ORCHESTRATION_ADMIN_DASHBOARD_HEAD}
            {...props}
        />
    )
}
export default AdminPage;