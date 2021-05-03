import React, { useState, useCallback } from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { PageSection } from '@patternfly/react-core';
import Job from './Job';
import JobTypeRedirect from './JobTypeRedirect';
import JobList from '../../components/JobList';
import { JOB_TYPE_URL_SEGMENTS } from '../../constants';
import TitleBar from '../../components/TitleBar';
import styled from 'styled-components';

const MainPageSection = styled(PageSection)`
  padding-top: 0;
  padding-bottom: 0;
  padding: 0px;
  & section{
    padding-top: 8px;
    padding-left : 5px;
    padding-right : 5px;
  }
`;

const JobsPageSection = styled(PageSection)`
padding: 0px;
`;

function Jobs({ i18n }) {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const [breadcrumbConfig, setBreadcrumbConfig] = useState({
    '/jobs': i18n._(t`Jobs`),
  });

  const buildBreadcrumbConfig = useCallback(
    job => {
      if (!job) {
        return;
      }

      const type = JOB_TYPE_URL_SEGMENTS[job.type];
      setBreadcrumbConfig({
        '/jobs': i18n._(t`Jobs`),
        [`/jobs/${type}/${job.id}`]: `${job.name}`,
        [`/jobs/${type}/${job.id}/output`]: i18n._(t`Output`),
        [`/jobs/${type}/${job.id}/details`]: i18n._(t`Details`),
      });
    },
    [i18n]
  );

  function TypeRedirect({ view }) {
    const { id } = useParams();
    const { path } = useRouteMatch();
    return <JobTypeRedirect id={id} path={path} view={view} />;
  }

  return (
    <>
      <TitleBar title={'Orchestration Engine / '+i18n._(t`Jobs`)} />
      <MainPageSection>
        <Switch>
          <Route exact path={match.path}>
            <JobsPageSection>
              <JobList showTypeColumn />
            </JobsPageSection>
          </Route>
          <Route path={`${match.path}/:id/details`}>
            <TypeRedirect view="details" />
          </Route>
          <Route path={`${match.path}/:id/output`}>
            <TypeRedirect view="output" />
          </Route>
          <Route path={`${match.path}/:type/:id`}>
            <Job
              history={history}
              location={location}
              setBreadcrumb={buildBreadcrumbConfig}
            />
          </Route>
          <Route path={`${match.path}/:id`}>
            <TypeRedirect />
          </Route>
        </Switch>
      </MainPageSection>
    </>
  );
}

export { Jobs as _Jobs };
export default withI18n()(Jobs);
