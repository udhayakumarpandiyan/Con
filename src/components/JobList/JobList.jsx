import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

import { Button, Card, Tooltip } from '@patternfly/react-core';
import AlertModal from '../AlertModal';
import ErrorDetail from '../ErrorDetail';
import useRequest, {
  useDeleteItems,
  useDismissableError,
} from '../../util/useRequest';
import { ToolbarDeleteButton } from '../PaginatedDataList';
import { getQSConfig, parseQueryString } from '../../util/qs';
import { formatDateString } from '../../util/dates';
import useWsJobs from './useWsJobs';
import JobListCancelButton from './JobListCancelButton';
import {
  AdHocCommandsAPI,
  InventoryUpdatesAPI,
  JobsAPI,
  ProjectUpdatesAPI,
  SystemJobsAPI,
  UnifiedJobsAPI,
  WorkflowJobsAPI,
} from '../../api';
import Table from '../Table/Table';
import {
  sortable
} from '@patternfly/react-table';
import styled from 'styled-components';
import LaunchButton from '../../components/LaunchButton';
import { LaunchIcon } from '../../constants/Icons';
import { JOB_TYPE_URL_SEGMENTS } from '../../constants';
import SearchBox from '../../components/SearchBox';
import { FilterIcon } from '../../constants/Icons';
import Loader from '../Loader';

const Status = styled.div`
display: flex;
flex-direction: row;
align-items: center;
& label{
  padding-left : 10px;
  text-transform: capitalized;
}
`;
const StatusBar = styled.div`
display: inline-block;
width: 30px; 
margin-right: 10px;
height: 30px;
border: 5px solid ${props => props.failed ? '#FF0000' : '#1C7C11'}; 
${props => props.failed && 'border-left-color: transparent'};
-ms-transform: rotate(45deg); 
-webkit-transform: rotate(45deg);
transform: rotate(45deg);
opacity: 1;
border-radius: 50%;
`;
const FilterButton = styled(Button)`
height: 30px;
background-color: transparent !important;
border: none !important;
& img{
    height: 26px;
    width: 26px;
}
`;
const Icon = styled.img`
 margin-right: 10px;
`;
const ActionItemsDiv = styled.div`
  height: 0px;
  & a{
    float: right;
    top: -20px; 
    background: #4BC6B9 !important;
    --pf-c-button--m-secondary--after--BorderColor: #61c7b9;
  }
  & button{
    float: right;
    top: -20px;
  }
`;

function JobList({ i18n, defaultParams, controls, showTypeColumn = false, tabHeaderSection }) {
  const QS_CONFIG = getQSConfig(
    'job',
    {
      page: 1,
      page_size: 20,
      order_by: '-finished',
      not__launch_type: 'sync',
      ...defaultParams,
    },
    ['id', 'page', 'page_size']
  );

  const [selected, setSelected] = useState([]);
  const location = useLocation();
  const {
    result: { results, count, relatedSearchableKeys, searchableKeys },
    error: contentError,
    isLoading,
    request: fetchJobs,
  } = useRequest(
    useCallback(
      async () => {
        const params = parseQueryString(QS_CONFIG, location.search);
        const [response, actionsResponse] = await Promise.all([
          UnifiedJobsAPI.read({ ...params }),
          UnifiedJobsAPI.readOptions(),
        ]);

        return {
          results: response.data.results,
          count: response.data.count,
          relatedSearchableKeys: (
            actionsResponse?.data?.related_search_fields || []
          ).map(val => val.slice(0, -8)),
          searchableKeys: Object.keys(
            actionsResponse.data.actions?.GET || {}
          ).filter(key => actionsResponse.data.actions?.GET[key].filterable),
        };
      },
      [location] // eslint-disable-line react-hooks/exhaustive-deps
    ),
    {
      results: [],
      count: 0,
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // TODO: update QS_CONFIG to be safe for deps array
  const fetchJobsById = useCallback(
    async ids => {
      const params = parseQueryString(QS_CONFIG, location.search);
      params.id__in = ids.join(',');
      const { data } = await UnifiedJobsAPI.read(params);
      return data.results;
    },
    [location.search] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const jobs = useWsJobs(results, fetchJobsById, QS_CONFIG);

  const isAllSelected = selected.length === jobs.length && selected.length > 0;

  const {
    error: cancelJobsError,
    isLoading: isCancelLoading,
    request: cancelJobs,
  } = useRequest(
    useCallback(async () => {
      return Promise.all(
        selected.map(job => {
          if (['new', 'pending', 'waiting', 'running'].includes(job.status)) {
            return JobsAPI.cancel(job.id, job.type);
          }
          return Promise.resolve();
        })
      );
    }, [selected]),
    {}
  );

  const {
    error: cancelError,
    dismissError: dismissCancelError,
  } = useDismissableError(cancelJobsError);

  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteJobs,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(
        selected.map(({ type, id }) => {
          switch (type) {
            case 'job':
              return JobsAPI.destroy(id);
            case 'ad_hoc_command':
              return AdHocCommandsAPI.destroy(id);
            case 'system_job':
              return SystemJobsAPI.destroy(id);
            case 'project_update':
              return ProjectUpdatesAPI.destroy(id);
            case 'inventory_update':
              return InventoryUpdatesAPI.destroy(id);
            case 'workflow_job':
              return WorkflowJobsAPI.destroy(id);
            default:
              return null;
          }
        })
      );
    }, [selected]),
    {
      qsConfig: QS_CONFIG,
      allItemsSelected: isAllSelected,
      fetchItems: fetchJobs,
    }
  );

  const handleJobCancel = async () => {
    await cancelJobs();
    setSelected([]);
  };

  const handleJobDelete = async () => {
    await deleteJobs();
    setSelected([]);
  };

  const handleSelectAll = isSelected => {
    jobs.forEach(job => {
      job.selected = isSelected;
    })
    setSelected(isSelected ? [...jobs] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    jobs.forEach(job => {
      if (job.id === item.id) {
        job.selected = isSelected;
        item = job;
      }
    })
    if (selected.some(s => s.id === item.id)) {
      setSelected(selected.filter(s => s.id !== item.id));
    } else {
      setSelected(selected.concat(item));
    }
  }
  const handleSelect = (item, isSelected) => {
    setSelectedItems(item, isSelected);
  }
  const handleRowClick = (event, item) => {

    if (event.target.nodeName === "INPUT" || event.target.nodeName === "LABEL" || event.target.nodeName === "IMG") {
      event.stopPropagation();
    }
    else {
      item.selected = !item.selected;
      setSelectedItems(item, item.selected);
    }
  };

  return (
    <>
      <Card>
        {tabHeaderSection &&
          <ActionItemsDiv>
            <JobListCancelButton
              key="cancel"
              onCancel={handleJobCancel}
              jobsToCancel={selected}
            />
            <ToolbarDeleteButton
              key="delete"
              onDelete={handleJobDelete}
              itemsToDelete={selected}
              pluralizedItemName="Jobs"
            />
          </ActionItemsDiv>
        }
        <Table contentError={contentError}
          handleSelectAll={handleSelectAll}
          handleSelect={handleSelect}
          hasContentLoading={isLoading || isDeleteLoading || isCancelLoading}
          onRowClick={handleRowClick}
          items={jobs}
          itemCount={count}
          qsConfig={QS_CONFIG}
          onDelete={handleJobDelete}
          columns={[
            { title: 'JOB NAME', transforms: [sortable] },
            { title: 'CREATED ON' },
            { title: 'STATUS' },
            'ACTIONS',
          ]}
          rows={jobs && jobs.map(job => {
            return {
              cells: [
                <span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                  <Link to={`/jobs/${JOB_TYPE_URL_SEGMENTS[job.type]}/${job.id}`}>
                    <label>
                      {job.id} &mdash; {job.name}
                    </label>
                  </Link>
                </span>,
                <label>
                  {job.created ? formatDateString(job.created) : ''}
                </label>,
                <div style={{ paddingTop: "10px", display: 'flex' }}>
                  <Status>
                    <StatusBar failed={job.status === 'failed'} />
                    {job.status === "failed" ? "Failed" : "Success"}
                  </Status>
                </div>,
                <div>
                  {job.type !== 'system_job' &&
                    job.summary_fields?.user_capabilities?.start ? (
                    <Tooltip content={i18n._(t`Relaunch Job`)} position="top">
                      <LaunchButton resource={job}>
                        {({ handleRelaunch }) => (
                          <Button
                            variant="plain"
                            onClick={handleRelaunch}
                            aria-label={i18n._(t`Relaunch`)}
                          >
                            <Icon src={LaunchIcon} alt="" />
                          </Button>
                        )}
                      </LaunchButton>
                    </Tooltip>
                  ) : (
                    ''
                  )}
                </div>],
              selected: job.selected,
              id: job.id,
              type: job.type,
              summary_fields: job.summary_fields,
            }
          })
          }
          controls={controls ? controls : <>

            <SearchBox />
            <ToolbarDeleteButton
              key="delete"
              onDelete={handleJobDelete}
              itemsToDelete={selected}
              pluralizedItemName="Jobs"
            />
            <JobListCancelButton  i18n={i18n}
              key="cancel"
              onCancel={handleJobCancel}
              jobsToCancel={selected}
            />
            {/*<FilterButton>
              <img src={FilterIcon} alt="" />
            </FilterButton>*/}
          </>
          }
        />
      </Card>
      {deletionError && (
        <AlertModal
          isOpen
          variant="error"
          title={i18n._(t`Error!`)}
          onClose={clearDeletionError}
        >
          {i18n._(t`Failed to delete one or more jobs.`)}
          <ErrorDetail error={deletionError} />
        </AlertModal>
      )}
      {cancelError && (
        <AlertModal
          isOpen
          variant="error"
          title={i18n._(t`Error!`)}
          onClose={dismissCancelError}
        >
          {i18n._(t`Failed to cancel one or more jobs.`)}
          <ErrorDetail error={cancelError} />
        </AlertModal>
      )}
      <Loader loading={isLoading} />
    </>
  );
}

export default withI18n()(JobList);
