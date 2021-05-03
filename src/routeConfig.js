import { t } from '@lingui/macro';

import Applications from './screens/Application';
import Credentials from './screens/Credential';
import Dashboard from './screens/Dashboard';
import Hosts from './screens/Host';
import InstanceGroups from './screens/InstanceGroup';
import Inventory from './screens/Inventory';
import { Jobs } from './screens/Job';
import NotificationTemplates from './screens/NotificationTemplate';
import Organizations from './screens/Organization';
import Projects from './screens/Project';
import Schedules from './screens/Schedule';
import Settings from './screens/Setting';
import Teams from './screens/Team';
import Templates from './screens/Template';
import Users from './screens/User';
import WorkflowApprovals from './screens/WorkflowApproval';
import Integrations from './screens/Integrations';
import ManagementJobs from './screens/ManagementJob';
import CredentialTypes from './screens/CredentialType';
import {
  DashboardIcon, JobsIcon, SchedulesIcon, MyViewIcon, TemplatesIcon,
  CredentialsIcon, ProjectsIcon, InventoriesIcon, InventoryScriptsIcon,
  OrganizationsIcon, UsersIcon, TeamsIcon, NotificationsIcon, IntegrationsIcon, ManagementJobsIcon, CredentialTypeIcon
} from './constants/Icons';

// Ideally, this should just be a regular object that we export, but we
// need the i18n. When lingui3 arrives, we will be able to import i18n
// directly and we can replace this function with a simple export.

function getRouteConfig(i18n) {
  return [
    {
      groupTitle: i18n._(t`Views`),
      groupId: 'views_group',
      routes: [
        {
          title: i18n._(t`Dashboard`),
          path: '/orchestartion-home',
          icon: DashboardIcon,
          screen: Dashboard,
        },
        {
          title: i18n._(t`Jobs`),
          path: '/jobs',
          icon: JobsIcon,
          screen: Jobs,
        },
        {
          title: i18n._(t`Schedules`),
          path: '/schedules',
          icon: SchedulesIcon,
          screen: Schedules,
        },
        {
          title: i18n._(t`Workflow Approvals`),
          path: '/workflow_approvals',
          icon: MyViewIcon,
          screen: WorkflowApprovals,
        },
      ],
    },
    {
      groupTitle: i18n._(t`Resources`),
      groupId: 'resources_group',
      routes: [
        {
          title: i18n._(t`Templates`),
          path: '/templates',
          icon: TemplatesIcon,
          screen: Templates,
        },
        {
          title: i18n._(t`Credentials`),
          path: '/credentials',
          icon: CredentialsIcon,
          screen: Credentials,
        },
        {
          title: i18n._(t`Projects`),
          path: '/projects',
          icon: ProjectsIcon,
          screen: Projects,
        },
        {
          title: i18n._(t`Inventories`),
          path: '/inventories',
          icon: InventoriesIcon,
          screen: Inventory,
        },
        {
          title: i18n._(t`Hosts`),
          path: '/hosts',
          icon: InventoryScriptsIcon,
          screen: Hosts,
        },
      ],
    },
    {
      groupTitle: i18n._(t`Access`),
      groupId: 'access_group',
      routes: [
        {
          title: i18n._(t`Organizations`),
          path: '/organizations',
          icon: OrganizationsIcon,
          screen: Organizations,
        },
        {
          title: i18n._(t`Users`),
          path: '/users',
          icon: UsersIcon,
          screen: Users,
        },
        {
          title: i18n._(t`Teams`),
          path: '/teams',
          icon: TeamsIcon,
          screen: Teams,
        },
      ],
    },
    {
      groupTitle: i18n._(t`Administration`),
      groupId: 'administration_group',
      routes: [
        {
          title: i18n._(t`Credential Types`),
          path: '/credential_types',
          icon: CredentialTypeIcon,
          screen: CredentialTypes,
        },
        {
          title: i18n._(t`Notifications`),
          path: '/notification_templates',
          icon: NotificationsIcon,
          screen: NotificationTemplates,
        },
        {
          title: i18n._(t`Management Jobs`),
          path: '/management_jobs',
          icon: ManagementJobsIcon,
          screen: ManagementJobs,
        },
        {
          title: i18n._(t`Instance Groups`),
          path: '/instance_groups',
          icon: InventoriesIcon,
          screen: InstanceGroups,
        },
        {
          title: i18n._(t`Applications`),
          path: '/applications',
          icon: MyViewIcon,
          screen: Applications,
        },
        {
          title: i18n._(t`Integrations`),
          path: '/integrations',
          icon: IntegrationsIcon,
          screen: Integrations,
        }
      ],
    },
    {
      groupTitle: i18n._(t`Settings`),
      groupId: 'settings',
      routes: [
        {
          title: i18n._(t`Settings`),
          path: '/settings',
          screen: Settings,
        },
      ],
    },
  ];
}

export default getRouteConfig;
