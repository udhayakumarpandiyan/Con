import React, { useEffect, useState } from 'react';
import { t } from '@lingui/macro';
import { withI18n } from '@lingui/react';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card, PageSection, Button } from '@patternfly/react-core';
import {
  Switch,
  useParams,
  useLocation,
  useRouteMatch,
  Route,
  Redirect,
  Link,
} from 'react-router-dom';
import { ResourceAccessList } from '../../components/ResourceAccessList';
import ContentError from '../../components/ContentError';
import RoutedTabs from '../../components/RoutedTabs';
import CredentialDetail from './CredentialDetail';
import CredentialEdit from './CredentialEdit';
import { CredentialsAPI } from '../../api';
import styled from 'styled-components';

const MainPageSection = styled(PageSection)`
    padding: 0 0;
`;


const TitleBottomSection = styled.div`
 display: flex;
 justify-content: space-between;
 background: transparent;
 padding: 0px 20px 10px 25px;
 margin-top: -46px;
 & label{
   text-align: left; 
   font: 1.25rem;
   letter-spacing: 0px;
   color: #593CAB;
   text-transform: capitalize;
   opacity: 1;
   margin-top: 14px;
 }
`;
const OrchestrationPrimaryButton = {
    width: "7.65rem",
    height: "2.37rem",
    background: "#593CAB 0% 0% no-repeat padding-box",
}

function Credential({ i18n, setBreadcrumb }) {
  const [credential, setCredential] = useState(null);
  const [contentError, setContentError] = useState(null);
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { pathname } = useLocation();
  const match = useRouteMatch({
    path: '/credentials/:id',
  });
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await CredentialsAPI.readDetail(id);
        setBreadcrumb(data);
        setCredential(data);
      } catch (error) {
        setContentError(error);
      } finally {
        setHasContentLoading(false);
      }
    }
    fetchData();
  }, [id, pathname, setBreadcrumb]);

  let credentialName;
  if (credential) {
    credentialName = credential.name;
  }
  const tabsArray = [
    { name: i18n._(t`Details`), link: `/credentials/${id}/details`, id: 0 },
  ];

  if (credential && credential.organization) {
    tabsArray.push({
      name: i18n._(t`Access`),
      link: `/credentials/${id}/access`,
      id: 1,
    });
  }

  let showCardHeader = true;

  if (pathname.endsWith('edit') || pathname.endsWith('add')) {
    showCardHeader = false;
  }

  if (!hasContentLoading && contentError) {
    return (
      <div>
    <TitleBottomSection>
          <label></label>
          <Link to="/credentials"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
      </TitleBottomSection>
    <MainPageSection>
      <PageSection>
        <Card>
          <ContentError error={contentError}>
            {contentError.response && contentError.response.status === 404 && (
              <span>
                {i18n._(t`Credential not found.`)}{' '}
                <Link to="/credentials">
                  {i18n._(t`View all Credentials.`)}
                </Link>
              </span>
            )}
          </ContentError>
        </Card>
      </PageSection>
    </MainPageSection>
    </div>
    );
  }

  return (
    <div>
    <TitleBottomSection>
          <label>{credentialName}</label>
          <Link to="/credentials"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
      </TitleBottomSection>
    <MainPageSection>
    <PageSection>
      <Card>
        {showCardHeader && <RoutedTabs tabsArray={tabsArray} />}
        <Switch>
          <Redirect
            from="/credentials/:id"
            to="/credentials/:id/details"
            exact
          />
          {credential && [
            <Route key="details" path="/credentials/:id/details">
              <CredentialDetail credential={credential} />
            </Route>,
            <Route key="edit" path="/credentials/:id/edit">
              <CredentialEdit credential={credential} />
            </Route>,
            credential.organization && (
              <Route key="access" path="/credentials/:id/access">
                <ResourceAccessList
                  resource={credential}
                  apiModel={CredentialsAPI}
                />
              </Route>
            ),
            <Route key="not-found" path="*">
              {!hasContentLoading && (
                <ContentError isNotFound>
                  {match.params.id && (
                    <Link to={`/credentials/${match.params.id}/details`}>
                      {i18n._(t`View Credential Details`)}
                    </Link>
                  )}
                </ContentError>
              )}
            </Route>,
          ]}
          <Route key="not-found" path="*">
            {!hasContentLoading && (
              <ContentError isNotFound>
                {id && (
                  <Link to={`/credentials/${id}/details`}>
                    {i18n._(t`View Credential Details`)}
                  </Link>
                )}
              </ContentError>
            )}
          </Route>
        </Switch>
      </Card>
    </PageSection>
    </MainPageSection>
    </div>
  );
}

export default withI18n()(Credential);
