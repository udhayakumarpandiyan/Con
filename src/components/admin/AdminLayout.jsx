import React, { Component } from "react";
import WidgetsPage from './resources/WidgetsPage';
import { ADMIN_DASHBOARD_HEAD } from '../../constants/index';

let adminWidgets = [
    { "name": "Group List", "display": "Groups", "path": "/admin/groups", "iconPath": "group-list-new.svg" },
    { "name": "HelpTopic List", "display": "Help Topics", "path": "/admin/helpTopics", "iconPath": "help-topic-list-new.svg" },
    { "name": "Feature List", "display": "Features", "path": "/admin/features", "iconPath": "Feature-list-new.svg" },
    { "name": "Permission List", "display": "Permissions", "path": "/admin/permissions", "iconPath": "Permission-list-new.svg" },
    { "name": "Add Users to Group", "display": "Add Users to Group", "path": "/admin/add-users-to-groups", "iconPath": "Add-Users-to-Group-new.svg" },
    { "name": "Map/UnMap Features To Groups", "display": "Map/UnMap Features To Groups", "path": "/admin/features-to-groups", "iconPath": "Group-permission-list-new.svg" },
    { "name": "Group HelpTopics", "display": "Group Help Topics", "path": "/admin/group_help_topics", "iconPath": "Group-HelpTopics-new.svg" },
    { "name": "Client Groups", "display": "Client Groups", "path": "/admin/client_groups", "iconPath": "Client-groups-new.svg" },
    { "name": "Ticket Settings", "display": "Ticket Settings", "path": "/admin/ticketSettings", "iconPath": "Ticket-settings-new.svg" },
    { "name": "Event Rule Setup", "display": "Event Rule Setup", "path": "/admin/event-rule-setup", "iconPath": "CEM-Event-Settings-new.svg" },
    { "name": "Plugins", "display": "Plugins", "path": "/admin/plugins", "iconPath": "plugin-icon.svg" },
    { "name": "Orchestration Engine", "display": "Orchestration Engine", "path": "/orchestration-settings", "iconPath": "orchestration-engine.svg", 'width': '25%' }
]

function AdminPage(props) {
    return (
        <WidgetsPage
            widgets={adminWidgets}
            header={ADMIN_DASHBOARD_HEAD}
            {...props}
        />
    )
}
export default AdminPage;