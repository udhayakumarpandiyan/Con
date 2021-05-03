import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import {
  Nav,
  NavList,
  Page,
  PageHeader as PFPageHeader,
  PageSidebar as PageSidebarChanges,
} from '@patternfly/react-core';
import { t } from '@lingui/macro';
import { withI18n } from '@lingui/react';
import styled from 'styled-components';

import { ConfigAPI, MeAPI, RootAPI } from '../../api';
import { ConfigProvider } from '../../contexts/Config';
import About from '../About';
import AlertModal from '../AlertModal';
import ErrorDetail from '../ErrorDetail';
import BrandLogo from './BrandLogo';
import NavExpandableGroup from './NavExpandableGroup';
import PageHeaderToolbar from './PageHeaderToolbar';

const PageHeader = styled(PFPageHeader)`
  background: var(--primary-color-light);
  & .pf-c-page__header-brand-link {
    color: inherit;

    &:hover {
      color: inherit;
    }
  }
`;
const PageSidebar = styled(PageSidebarChanges)`
  width: 132px;
  & a:hover{
    background: #E7DFFE;
  }
  & a{
    color: #333333;
    font-size: 13px;
  }
  & .pf-c-nav__link.pf-m-current{
    & a{
      color: #593CAB;
     
    }
    & a:hover{
      background: transparent;
    }
  }
  
  button{
    font-weight: bold;
  }
`;

function AppContainer({ i18n, navRouteConfig = [], children }) {
  const history = useHistory();
  const { pathname } = useLocation();
  const [config, setConfig] = useState({});
  const [configError, setConfigError] = useState(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleAboutModalOpen = () => setIsAboutModalOpen(true);
  const handleAboutModalClose = () => setIsAboutModalOpen(false);
  const handleConfigErrorClose = () => setConfigError(null);

  const handleLogout = useCallback(async () => {
    await RootAPI.logout();
    history.replace('/login');
  }, [history]);

  useEffect(() => {
    const loadConfig = async () => {
      if (config?.version) return;
      try {
        const [
          { data },
          {
            data: {
              results: [me],
            },
          },
        ] = await Promise.all([ConfigAPI.read(), MeAPI.read()]);
        setConfig({ ...data, me });
        setIsReady(true);
      } catch (err) {
        if (err && err.response && err.response.status === 401) {
          // handleLogout();
          return;
        }
        setConfigError(err);
      }
    };
    loadConfig();
  }, [config, pathname, handleLogout]);

  const header = (
    <PageHeader
      showNavToggle
      logo={<BrandLogo user={config?.me} />}
      logoProps={{ href: '/' }}
      headerTools={
        <PageHeaderToolbar
          loggedInUser={config?.me}
          isAboutDisabled={!config?.version}
          onAboutClick={handleAboutModalOpen}
          onLogoutClick={handleLogout}
        />
      }
    />
  );

  const sidebar = (
    <PageSidebar
      theme="light"
      nav={
        <Nav aria-label={i18n._(t`Navigation`)} theme="light">
          <NavList>
            {navRouteConfig.map(({ groupId, groupTitle, routes }) => (
              <NavExpandableGroup
                key={groupId}
                groupId={groupId}
                groupTitle={groupTitle}
                routes={routes}
              />
            ))}
          </NavList>
        </Nav>
      }
    />
  );

  return (
    <>
      <Page /* isManagedSidebar */ /* header={header} sidebar={sidebar} */>
        {isReady && <ConfigProvider value={config}>{children}</ConfigProvider>}
      </Page>
      <About
        ansible_version={config?.ansible_version}
        version={config?.version}
        isOpen={isAboutModalOpen}
        onClose={handleAboutModalClose}
      />
      <AlertModal
        isOpen={configError}
        variant="error"
        title={i18n._(t`Error!`)}
        onClose={handleConfigErrorClose}
      >
        {i18n._(t`Failed to retrieve configuration.`)}
        <ErrorDetail error={configError} />
      </AlertModal>
    </>
  );
}

export { AppContainer as _AppContainer };
export default withI18n()(withRouter(AppContainer));
