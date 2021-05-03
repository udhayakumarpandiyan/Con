import React from "react";
import {
  useRouteMatch,
  useLocation,
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom';
import { I18n, I18nProvider } from '@lingui/react';

import AppContainer from './components/AppContainer';
// import NotFound from './screens/NotFound';
// import Login from './screens/Login';

import ja from './locales/ja/messages';
import en from './locales/en/messages';
import { isAuthenticated } from './util/auth';
import { getLanguageWithoutRegionCode } from './util/language';

import getRouteConfig from './routeConfig';
// import RootTemplate from "./RootTemplate";
import './App.css';

/* concierto */
import { MainLayout } from "./MainLayout";
import Login from "./components/Auth/Login";
import { RouteWithSubRoutes } from "./RouteWithSubRoutes";
import AsyncComponent from './AsyncComponent';
import NotFound from './components/notFound/NotFound';
const Home = AsyncComponent(() => import('./components/home/Home').then(module => module.default));
const Tickets = AsyncComponent(() => import('./components/tickets/Tickets').then(module => module.default));
const TicketDetails = AsyncComponent(() => import('./components/ticket-details/TicketDetails').then(module => module.default));
const Events = AsyncComponent(() => import('./components/events/Events').then(module => module.default));
const AdminLayout = AsyncComponent(() => import('./components/admin/AdminLayout').then(module => module.default));
const OrchestrationAdmin = AsyncComponent(() => import('./components/admin/orchestration/OrchestrationWidgets').then(module => module.default));
const ChangeRequest = AsyncComponent(() => import('./components/changeRequests/ChangeRequests').then(module => module.default));
const ChangeRequestDetails = AsyncComponent(() => import('./components/change-request-details/ChangeRequestDetails').then(module => module.default));
const KnowledgeBase = AsyncComponent(() => import('./components/knowledgeBase/KnowledgeBase').then(module => module.default));
const ArticleDetails = AsyncComponent(() => import('./components/knowledgeBase/resources/ArticleDetails').then(module => module.default));
const AWSInventory = AsyncComponent(() => import('./components/aws/AWSInventory').then(module => module.default));
const AZUREInventory = AsyncComponent(() => import('./components/Azure/AzureInventory').then(module => module.default));
const ServiceRequest = AsyncComponent(() => import('./components/serviceRequest/ServiceRequestForm').then(module => module.default));
const Plugins = AsyncComponent(() => import('./components/admin/Plugins').then(module => module.default));
const MSTeams = AsyncComponent(() => import('./components/admin/MSTeams').then(module => module.default));
const Prometheus = AsyncComponent(() => import('./components/admin/Prometheus').then(module => module.default));
const ServiceNow = AsyncComponent(() => import('./components/admin/ServiceNow').then(module => module.default));
const AdminGroups = AsyncComponent(() => import('./components/admin/groups/Group').then(module => module.default));
const AdminHelpTopics = AsyncComponent(() => import('./components/admin/helpTopics/HelpTopic').then(module => module.default));
const AdminPermissions = AsyncComponent(() => import('./components/admin/permissions/Permission').then(module => module.default));
const AdminFeatures = AsyncComponent(() => import('./components/admin/features/Feature').then(module => module.default));
const GenerateReport = AsyncComponent(() => import('./components/reports/Report').then(module => module.default));
const TicketSummary = AsyncComponent(() => import('./components/reports/TicketSummary').then(module => module.default));
const ServiceSummary = AsyncComponent(() => import('./components/reports/ServiceSummary').then(module => module.default));
const RetensionPolicy = AsyncComponent(() => import('./components/reports/RetensionPolicy').then(module => module.default));
const UserManagementTickets = AsyncComponent(() => import('./components/reports/UserManagementTickets').then(module => module.default));
const ClientManagementTickets = AsyncComponent(() => import('./components/reports/ClientManagementTickets').then(module => module.default));
const OpenTickets = AsyncComponent(() => import('./components/reports/OpenTickets').then(module => module.default));
const UserReport = AsyncComponent(() => import('./components/reports/UserReport').then(module => module.default));
const AddUsersToGroup = AsyncComponent(() => import('./components/admin/userGroups/UserGroups').then(module => module.default));
const GroupPermissions = AsyncComponent(() => import('./components/admin/groupPermissions/GroupPermissions').then(module => module.default));
const EventRuleSetup = AsyncComponent(() => import('./components/admin/eventRule/EventRule').then(module => module.default));


export const ROUTES = [
  {
    path: "/home",
    component: Home,
    layout: MainLayout
  },
  {
    path: "/admin",
    component: AdminLayout,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/ticket-list",
    component: Tickets,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/ticket-list/:ticketId",
    component: TicketDetails,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/events",
    component: Events,
    layout: MainLayout
  },
  {
    path: "/orchestration-settings",
    component: OrchestrationAdmin,
    layout: MainLayout
  },
  {
    path: "/change-requests",
    component: ChangeRequest,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/change-requests/:id",
    component: ChangeRequestDetails,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/knowledge-base",
    component: KnowledgeBase,
    layout: MainLayout,
    exact: true
  },
  {

    path: "/knowledge-base/:id",
    component: ArticleDetails,
    layout: MainLayout,
    exact: true

  },
  {
    path: "/awsInventory",
    component: AWSInventory,
    layout: MainLayout
  },
  {
    path: "/service-request",
    component: ServiceRequest,
    layout: MainLayout
  },
  {
    path: "/azureInventory",
    component: AZUREInventory,
    layout: MainLayout
  },
  {
    path: "/admin/plugins",
    component: Plugins,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/plugins/ms-teams",
    component: MSTeams,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/plugins/prometheus",
    component: Prometheus,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/plugins/serviceNow",
    component: ServiceNow,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/groups",
    component: AdminGroups,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/helpTopics",
    component: AdminHelpTopics,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/permissions",
    component: AdminPermissions,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/features",
    component: AdminFeatures,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/reports",
    component: GenerateReport,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/reports/ticket-summary",
    component: TicketSummary,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/reports/service-summary",
    component: ServiceSummary,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/reports/retention-policy-summary",
    component: RetensionPolicy,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/reports/user-management-tickets",
    component: UserManagementTickets,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/reports/client-management-tickets",
    component: ClientManagementTickets,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/reports/open-tickets",
    component: OpenTickets,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/reports/user-report",
    component: UserReport,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/add-users-to-groups",
    component: AddUsersToGroup,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/features-to-groups",
    component: GroupPermissions,
    layout: MainLayout,
    exact: true
  },
  {
    path: "/admin/event-rule-setup",
    component: EventRuleSetup,
    layout: MainLayout,
    exact: true
  }
];

const ProtectedRoute = ({ children, ...rest }) =>
  // isAuthenticated(document.cookie) ? (
  <Route {...rest}>{children}</Route>
// ) : (
//     <Redirect to="/login" />
//   );

function App(params) {
  const catalogs = { en, ja };
  const language = getLanguageWithoutRegionCode(navigator);
  const match = useRouteMatch();
  const { hash, search, pathname } = useLocation();
  const history = useHistory();

  return (
    <I18nProvider language={language} catalogs={catalogs}>
      <I18n>
        {({ i18n }) => (
          <Switch>
            {
              ROUTES.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)
            }
            <Route exact strict path="/*/">
              <Redirect to={`${pathname.slice(0, -1)}${search}${hash}`} />
            </Route>
            <Route path="/login">
              <Login history={history} />
            </Route>
            <Route exact path="/">
              {
                localStorage.getItem('userId') ? <Redirect to="/home" /> : <Redirect to="/login" />
              }
            </Route>
            <ProtectedRoute>
              <AppContainer navRouteConfig={getRouteConfig(i18n)}>
                <Switch>
                {getRouteConfig(i18n)
                  .flatMap(({ routes }) => routes)
                  .map(({ path, screen: Screen }) => (
                    <ProtectedRoute key={path} path={path}>
                      <MainLayout>
                        <Screen match={match} />
                      </MainLayout>
                    </ProtectedRoute>
                  ))
                  .concat(
                    <Route path="*" component={NotFound} />
                  )
                }
                </Switch>
              </AppContainer>
            </ProtectedRoute>
          </Switch>
        )}
      </I18n>
    </I18nProvider>
  );
}

export default () => (
  // <HashRouter>
  <App />
  // </HashRouter>
);
