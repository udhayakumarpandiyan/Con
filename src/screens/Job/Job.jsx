import React, { useEffect, useCallback } from 'react';
import {
  Route,
  withRouter,
  Switch,
  Redirect,
  Link,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card, PageSection, CardBody, Button } from '@patternfly/react-core';
import { JobsAPI } from '../../api';
import ContentError from '../../components/ContentError';
import RoutedTabs from '../../components/RoutedTabs';
import useRequest from '../../util/useRequest';
import JobDetail from './JobDetail';
import JobOutput from './JobOutput';
import { WorkflowOutput } from './WorkflowOutput';
import useWsJob from './useWsJob';
import { JOB_TYPE_URL_SEGMENTS } from '../../constants';
import styled from 'styled-components';
import Loader from '../../components/Loader';

const MainPageSection = styled(PageSection)`
    padding: 0 0;
`;


const TitleBottomSection = styled.div`
 display: flex;
 justify-content: space-between;
 background: transparent;
 padding: 0px 20px 10px 25px;
 margin-top: -70px;
 & label{
   text-align: left; 
   font: 1.25rem;
   letter-spacing: 0px;
   color: #593CAB;
   text-transform: capitalize;
   opacity: 1;
   margin-top: 14px;
 }
 & Button{
   background: red;
 }
`;
const OrchestrationPrimaryButton = {
    width: "7.65rem",
    height: "2.37rem",
    background: "#593CAB 0% 0% no-repeat padding-box",
}
function Job({ i18n, lookup, setBreadcrumb }) {
  const { id, type } = useParams();
  const match = useRouteMatch();

  const { isLoading, error, request: fetchJob, result } = useRequest(
    useCallback(async () => {
      // for api call, need type from enum;
      const { data } = await JobsAPI.readDetail(id, type);
      setBreadcrumb(data);
      return data;
    }, [id, type, setBreadcrumb]),
    null
  );

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const job = useWsJob(result);

  let jobType;
  let jobName;
  if (job) {
    jobType = JOB_TYPE_URL_SEGMENTS[job.type];
    jobName = `${job.id} - ${job.name}`;
  }

  const tabsArray = [    
    { name: i18n._(t`Details`), link: `${match.url}/details`, id: 0 },
    { name: i18n._(t`Output`), link: `${match.url}/output`, id: 1 },
  ];

  if (!isLoading && error) {
    return (
      <PageSection>
        <Card>
          <ContentError error={error}>
            {error && error.response && error.response.status === 404 && (
              <span>
                {i18n._(t`The page you requested could not be found.`)}{' '}
                <Link to="/jobs">{i18n._(t`View all Jobs.`)}</Link>
              </span>
            )}
          </ContentError>
        </Card>
      </PageSection>
    );
  }

  if (lookup && job) {
    return (
      <Switch>
        <Redirect from="jobs/:id" to={`/jobs/${jobType}/:id/output`} />
        <Redirect from="jobs/:id/details" to={`/jobs/${jobType}/:id/details`} />
        <Redirect from="jobs/:id/output" to={`/jobs/${jobType}/:id/output`} />
      </Switch>
    );
  }

  return (
    <div>      
        <TitleBottomSection>
          <label>{jobName}</label>
          <Link to="/jobs"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
      </TitleBottomSection>
    <MainPageSection>
    <PageSection>
      <Card>
        {!isLoading && <RoutedTabs tabsArray={tabsArray} />}
        <Switch>
          <Redirect from="/jobs/:type/:id" to="/jobs/:type/:id/output" exact />
          {job &&
            job.type === 'workflow_job' && [
              <Route key="workflow-details" path="/jobs/workflow/:id/details">
                <JobDetail type={match.params.type} job={job} />
              </Route>,
              <Route key="workflow-output" path="/jobs/workflow/:id/output">
                <WorkflowOutput job={job} />
              </Route>,
            ]}
          {job &&
            job.type !== 'workflow_job' && [
              <Route key="details" path="/jobs/:type/:id/details">
                <JobDetail type={type} job={job} />
              </Route>,
              <Route key="output" path="/jobs/:type/:id/output">
                <JobOutput type={type} job={job} />
              </Route>,
              <Route key="not-found" path="*">
                {!isLoading && (
                  <ContentError isNotFound>
                    <Link to={`/jobs/${type}/${id}/details`}>
                      {i18n._(t`View Job Details`)}
                    </Link>
                  </ContentError>
                )}
              </Route>,
            ]}
        </Switch>
      </Card>
    </PageSection>
  </MainPageSection>
  <Loader loading={isLoading}/>
  </div>
  );
}

export default withI18n()(withRouter(Job));
export { Job as _Job };
