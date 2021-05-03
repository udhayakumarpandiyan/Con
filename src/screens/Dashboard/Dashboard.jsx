import React, { Fragment, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import {
  Card,
  CardHeader,
  CardActions,
  CardBody,
  PageSection,
  Select,
  SelectVariant,
  SelectOption,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core';

import useRequest from '../../util/useRequest';
import { DashboardAPI } from '../../api';
import TitleBar from '../../components/TitleBar';
import JobList from '../../components/JobList';

import LineChart from './shared/LineChart';
import Count from './shared/Count';
import DashboardTemplateList from './shared/DashboardTemplateList';
import FrequencyOfExecution from './frequencyOfExecution/FrequencyOfExceution';
import SuccessRate from './successRate/SuccessRate';
import Loader from '../../components/Loader';

const Counts = styled.div`
  display: grid;
  margin: 0px;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 5px;
  background-color: #ffffff;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
  }
`;
const JobDetailsContainer = styled.div`
display: flex;
flex-direction: column;
background: #fff;
padding: 0px;
font-size: 18px;
text-tranform: capitalize;
`;
const MainPageSection = styled(PageSection)`
  padding-top: 0;
  padding-bottom: 0;
  padding: 0px;

  & .spacer {
    padding: 0px 16px;
    margin-bottom: var(--pf-global--spacer--lg);
    & .pf-c-tabs{
      margin: 0px -16px;
      background: #FFFFFF;
      border: none !important;
      & button{
        outline: none;
      }
      & .pf-c-tabs__item.pf-m-current{
        --pf-c-tabs__link--after--BorderColor: #4BC6B9;
      }
     
    }
    & article{
      box-shadow: none;
      & section{
        padding: 16px 0px;
      }
      & .pf-c-card__header{
        justify-content: flex-end;
        & .pf-c-select__toggle{
          border: 0.5px solid #707070;
          border-radius: 5px;
          width: 167px;
        }
        & .pf-c-select__toggle: before{
          border-bottom-color: transparent;
          border-width: 0px;
        }
        & .pf-m-selected{
          background: #e7dffe;
          border: none;
        }
        & .pf-c-select__menu{
          box-shadow: 0px 3px 6px #00000017;
          border: 0.5px solid #cacaca;
          border-radius: 5px;
          padding: 0px;
          & .pf-c-select__menu-wrapper{
            outline: none;
            border-bottom: 0.5px solid #cacaca;
          }
        }
        &. pf-c-select__menu-item:hover{
          background: #e7dffe;
        }
        & .pf-c-select__menu-item-icon{
          display: none;
        }
      }
    }
  }
`;

const JobDetails = styled.label`
 padding: 10px;
`;

const GraphCardHeader = styled(CardHeader)`
  margin: 0px 10px;
  margin-top: var(--pf-global--spacer--lg);
`;

const GraphCardActions = styled(CardActions)`
  margin-left: 0;
  padding-left: 0;
`;

const Gray_set = styled.div`
height: 17px;
margin-bottom: -6px;
background: #f4f4f4
`;

function Dashboard({ i18n }) {
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isJobTypeDropdownOpen, setIsJobTypeDropdownOpen] = useState(false);
  const [periodSelection, setPeriodSelection] = useState('month');
  const [jobTypeSelection, setJobTypeSelection] = useState('all');
  const [activeTabId, setActiveTabId] = useState(0);
  const [hasJobTemplatesRequestMade, sethasJobTemplatesRequestMade] = useState(false);
  const [hasJobGragpRequestMade, sethasJobGragpRequestMade] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    result: { jobs },
    request: fetchJobs,
  } = useRequest(
    useCallback(async (jobTemplates) => {
      let templatesRequest = jobTemplates.map(template => {
        return DashboardAPI.readJobs(template.id);
      });
      const response = await Promise.all(templatesRequest);
      let jobs = [];
      response.forEach((result) => {
        let results = result.data.results;
        results.forEach((job) => {
          jobs.push(job);
        })
      });
      setIsLoading(false);
      return {
        jobs: jobs,
      };
    }, []),
    {
      jobs: [],
    }
  );


  const {
    result: { jobGraphData, countData },
    request: fetchDashboardGraph,
  } = useRequest(
    useCallback(async () => {
      const [{ data }, { data: dataFromCount }] = await Promise.all([
        DashboardAPI.readJobGraph({
          period: periodSelection,
          job_type: jobTypeSelection,
        }),
        DashboardAPI.read(),

      ]);
      setIsLoading(false);
      const newData = {};
      data.jobs.successful.forEach(([dateSecs, count]) => {
        if (!newData[dateSecs]) {
          newData[dateSecs] = {};
        }
        newData[dateSecs].successful = count;
      });
      data.jobs.failed.forEach(([dateSecs, count]) => {
        if (!newData[dateSecs]) {
          newData[dateSecs] = {};
        }
        newData[dateSecs].failed = count;
      });
      const jobData = Object.keys(newData).map(dateSecs => {
        const [created] = new Date(dateSecs * 1000).toISOString().split('T');
        newData[dateSecs].created = created;
        return newData[dateSecs];
      });
      return {
        jobGraphData: jobData,
        countData: dataFromCount,
        data: data
      };
    }, [periodSelection, jobTypeSelection]),
    {
      jobGraphData: [],
      countData: {},
      data: {},
    }
  );


  const {
    result: { jobTemplates },
    request: fetchJobTemplates,
  } = useRequest(
    useCallback(async () => {
      setIsLoading(true);
      const [{ data }] = await Promise.all([DashboardAPI.readJobTemplates()]);
      await fetchJobs(data.results);
      return {
        jobTemplates: data.results,
      };
    }, [fetchJobs]),
    {
      jobTemplates: [],
    }
  );

  useEffect(() => {
    if (!hasJobGragpRequestMade) {
      fetchDashboardGraph();
      sethasJobGragpRequestMade(true);
    }
    if (!hasJobTemplatesRequestMade) {
      fetchJobTemplates();
      sethasJobTemplatesRequestMade(true);
    }


  }, [fetchDashboardGraph, fetchJobTemplates, fetchJobs, hasJobGragpRequestMade, hasJobTemplatesRequestMade,
    periodSelection, jobTypeSelection]);



  const onJobTypeChange = (type) => {
    sethasJobGragpRequestMade(false);
    setJobTypeSelection(type);

  }
  const onJobPeriodChange = (period) => {
    sethasJobGragpRequestMade(false);
    setPeriodSelection(period);
  }

  return (
    <Fragment>
      {/* <TitleBar title={i18n._(t`Dashboard`)} /> */}
      <MainPageSection>
        <div className="spacer">
          <Card id="dashboard-main-container">
            <Tabs
              aria-label={i18n._(t`Tabs`)}
              activeKey={activeTabId}
              onSelect={(key, eventKey) => setActiveTabId(eventKey)}
            >
              <Tab
                aria-label={i18n._(t`Job status graph tab`)}
                eventKey={0}
                title={<TabTitleText>{i18n._(t`Job status`)}</TabTitleText>}
              />
              <Tab
                aria-label={i18n._(t`Recent Jobs list tab`)}
                eventKey={1}
                title={<TabTitleText>{i18n._(t`Recent Jobs`)}</TabTitleText>}
              />
              <Tab
                aria-label={i18n._(t`Recent Templates list tab`)}
                eventKey={2}
                title={
                  <TabTitleText>{i18n._(t`Recent Templates`)}</TabTitleText>
                }
              />
            </Tabs>

            {activeTabId === 0 && (
              <Fragment>
                <Gray_set />
                <PageSection>
                  <JobDetailsContainer>
                    <JobDetails>Job Details</JobDetails>
                    <Counts>
                      <Count
                        link="/hosts"
                        data={countData?.hosts?.total}
                        label={i18n._(t`Hosts`)}
                      />
                      <Count
                        failed
                        link="/hosts?host.last_job_host_summary__failed=true"
                        data={countData?.hosts?.failed}
                        label={i18n._(t`Failed hosts`)}
                      />
                      <Count
                        link="/inventories"
                        data={countData?.inventories?.total}
                        label={i18n._(t`Inventories`)}
                      />
                      <Count
                        failed
                        link="/inventories?inventory.inventory_sources_with_failures__gt=0"
                        data={countData?.inventories?.inventory_failed}
                        label={i18n._(t`Inventory sync failures`)}
                      />
                      <Count
                        link="/projects"
                        data={countData?.projects?.total}
                        label={i18n._(t`Projects`)}
                      />
                      <Count
                        failed
                        link="/projects?project.status__in=failed,canceled"
                        data={countData?.projects?.failed}
                        label={i18n._(t`Project sync failures`)}
                      />
                    </Counts>
                  </JobDetailsContainer>
                </PageSection>

                <GraphCardHeader>
                  <GraphCardActions>
                    <Select
                      variant={SelectVariant.single}
                      placeholderText={i18n._(t`Select period`)}
                      aria-label={i18n._(t`Select period`)}
                      className="periodSelect"
                      onToggle={setIsPeriodDropdownOpen}
                      onSelect={(event, selection) =>
                        onJobPeriodChange(selection)
                      }
                      selections={periodSelection}
                      isOpen={isPeriodDropdownOpen}
                    >
                      <SelectOption key="month" value="month">
                        {i18n._(t`Past month`)}
                      </SelectOption>
                      <SelectOption key="two_weeks" value="two_weeks">
                        {i18n._(t`Past two weeks`)}
                      </SelectOption>
                      <SelectOption key="week" value="week">
                        {i18n._(t`Past week`)}
                      </SelectOption>
                    </Select>
                    <Select
                      variant={SelectVariant.single}
                      placeholderText={i18n._(t`Select job type`)}
                      aria-label={i18n._(t`Select job type`)}
                      className="jobTypeSelect"
                      onToggle={setIsJobTypeDropdownOpen}
                      onSelect={(event, selection) =>
                        onJobTypeChange(selection)
                      }
                      selections={jobTypeSelection}
                      isOpen={isJobTypeDropdownOpen}
                    >
                      <SelectOption key="all" value="all">
                        {i18n._(t`All job types`)}
                      </SelectOption>
                      <SelectOption key="inv_sync" value="inv_sync">
                        {i18n._(t`Inventory sync`)}
                      </SelectOption>
                      <SelectOption key="scm_update" value="scm_update">
                        {i18n._(t`SCM update`)}
                      </SelectOption>
                      <SelectOption key="playbook_run" value="playbook_run">
                        {i18n._(t`Playbook run`)}
                      </SelectOption>
                    </Select>
                  </GraphCardActions>
                </GraphCardHeader>
                <CardBody>
                  <LineChart
                    height={390}
                    id="d3-line-chart-root"
                    data={jobGraphData}
                  />
                </CardBody>
              </Fragment>
            )}
            {activeTabId === 1 &&
              <Fragment>
                <Gray_set />
                <PageSection>
                  <JobList defaultParams={{ page_size: 5 }} />
                </PageSection>
              </Fragment>
            }
            {activeTabId === 2 &&
              <Fragment>
                <Gray_set />
                <PageSection>
                  <DashboardTemplateList />
                </PageSection>
              </Fragment>
            }
          </Card>
          <FrequencyOfExecution templates={jobTemplates} jobs={jobs} />
          <SuccessRate templates={jobTemplates} jobs={jobs} />
        </div>
      </MainPageSection>
      <Loader loading={isLoading} />
    </Fragment>
  );
}

export default withI18n()(Dashboard);
