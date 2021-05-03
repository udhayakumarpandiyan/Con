import React, { useCallback, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Card, Button, Tooltip } from '@patternfly/react-core';
import { JobTemplatesAPI, DashboardAPI } from '../../../api';
import AlertModal from '../../../components/AlertModal';
import DatalistToolbar from '../../../components/DataListToolbar';
import ErrorDetail from '../../../components/ErrorDetail';
import PaginatedDataList, {
  ToolbarAddButton,
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';
import { getQSConfig, parseQueryString } from '../../../util/qs';
import useSelected from '../../../util/useSelected';
import useRequest, { useDeleteItems } from '../../../util/useRequest';
import ProjectTemplatesListItem from './ProjectJobTemplatesListItem';
import Table from '../../../components/Table/Table';
import styled from 'styled-components';
import { toTitleCase } from '../../../util/strings';
import LaunchButton from '../../../components/LaunchButton';
import { LaunchIcon, EditIcon } from '../../../constants/Icons';
import SearchBox from '../../../components/SearchBox';
import { FilterIcon } from '../../../constants/Icons';
import Loader from '../../../components/Loader';
import JobListCancelButton from '../../../components/JobList/JobListCancelButton';
import {
  ExclamationTriangleIcon,
  PencilAltIcon,
  RocketIcon,
} from '@patternfly/react-icons';

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

const QS_CONFIG = getQSConfig('template', {
  page: 1,
  page_size: 20,
  order_by: 'name',
});

function ProjectJobTemplatesList({ i18n, controls }) {
  const { id: projectId } = useParams();
  const location = useLocation();

const {
    result: {
      jobTemplates,
      itemCount,
      actions,
      relatedSearchableKeys,
      searchableKeys,
    },
    error: contentError,
    isLoading,
    request: fetchTemplates,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      params.project = projectId;
      const [response, actionsResponse] = await Promise.all([
        JobTemplatesAPI.read(params),
        JobTemplatesAPI.readOptions(),
      ]);
      return {
        jobTemplates: response.data.results,
        itemCount: response.data.count,
        actions: actionsResponse.data.actions,
        relatedSearchableKeys: (
          actionsResponse?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(
          actionsResponse.data.actions?.GET || {}
        ).filter(key => actionsResponse.data.actions?.GET[key].filterable),
      };
    }, [location, projectId]),
    {
      jobTemplates: [],
      itemCount: 0,
      actions: {},
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const { selected, isAllSelected, setSelected } = useSelected(
    jobTemplates
  );

  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteTemplates,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(
        selected.map(template => JobTemplatesAPI.destroy(template.id))
      );
    }, [selected]),
    {
      qsConfig: QS_CONFIG,
      allItemsSelected: isAllSelected,
      fetchItems: fetchTemplates,
    }
  );

  const handleTemplateDelete = async () => {
    await deleteTemplates();
    setSelected([]);
  };

  const handleSelectAll = isSelected => {
    jobTemplates.forEach(jobTemplate => {
      jobTemplate.selected = isSelected;
    })
    setSelected(isSelected ? [...jobTemplates] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    jobTemplates.forEach(jobTemplate => {
      if (jobTemplate.id === item.id) {
        jobTemplate.selected = isSelected;
        item = jobTemplate;
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

  const canAddJT =
    actions && Object.prototype.hasOwnProperty.call(actions, 'POST');

  const addButton = (
    <ToolbarAddButton key="add" linkTo="/templates/job_template/add/" />
  );

  return (
    <>
      <Card>
        <Table contentError={contentError}
          handleSelectAll={handleSelectAll}
          handleSelect={handleSelect}
          hasContentLoading={isLoading || isDeleteLoading}
          onRowClick={handleRowClick}
          items={jobTemplates}
          itemCount={itemCount}
          qsConfig={QS_CONFIG}
          onDelete={handleTemplateDelete}
          columns={[
            { title: 'TEMPLATE NAME' },
            'TEMPLATE TYPE',
            'NO OF JOBS',
            'ACTIONS',
          ]}
          rows={jobTemplates && jobTemplates.map(jobTemplate => {
            let jobs = jobTemplate.summary_fields.recent_jobs;
            return {
              cells: [
                <div><span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                  <Link to={`/templates/${jobTemplate.type}/${jobTemplate.id}/details`}>
                    <label>
                      {jobTemplate.name}
                    </label>
                  </Link>
                </span>
                {jobTemplate.type === 'job_template' &&
    (!jobTemplate.summary_fields.project ||
      (!jobTemplate.summary_fields.inventory &&
        !jobTemplate.ask_inventory_on_launch)) && (
                  <span>
                    <Tooltip
                      content={i18n._(
                        t`Resources are missing from this template.`
                      )}
                      position="right"
                    >
                      <ExclamationTriangleIcon css="color: #c9190b; margin-left: 20px;" />
                    </Tooltip>
                  </span>
                )}
                </div>,
                <label>
                  {toTitleCase(jobTemplate.type)}
                </label>,
                <div style={{
                  paddingTop: "10px", display: "flex", maxWidth: "250px",
                  overflow: "scroll", overflowY: "auto"
                }}>
                {jobs && jobs.length>0 && jobs.map(job => {
                  return <Status>
                      <StatusBar failed={job.status === 'failed'} />
                    </Status>
                })}
                {!jobs && jobs.length<=0 &&
                 <label>No Jobs</label>
                }
                </div>,
                <div>
                  {jobTemplate.summary_fields.user_capabilities.start && jobTemplate.type === 'job_template' && (
                    <Tooltip content={i18n._(t`Launch Template`)} position="top">
                      <LaunchButton resource={jobTemplate}>
                        {({ handleLaunch }) => (
                          <Button
                            aria-label={i18n._(t`Launch template`)}
                            css="grid-column: 2"
                            variant="plain"
                            onClick={handleLaunch}
                          >
                            <Icon src={LaunchIcon} alt="" />
                          </Button>
                        )}
                      </LaunchButton>
                    </Tooltip>
                  )}
                  {jobTemplate.summary_fields.user_capabilities.edit && (
                    <Tooltip content={i18n._(t`Edit Template`)} position="top">
                      <Button
                        aria-label={i18n._(t`Edit Template`)}
                        css="grid-column: 3"
                        variant="plain"
                        component={Link}
                        to={`/templates/${jobTemplate.type}/${jobTemplate.id}/edit`}
                      >
                        <Icon src={EditIcon} alt="" />
                      </Button>
                    </Tooltip>
                  )}
                </div>],
              selected: jobTemplate.selected,
              id: jobTemplate.id,
              type: jobTemplate.type,
              summary_fields: jobTemplate.summary_fields,
            }
          })
          }
          controls={<>
          </>
          }
        />
      </Card>
      <AlertModal
        isOpen={deletionError}
        variant="danger"
        title={i18n._(t`Error!`)}
        onClose={clearDeletionError}
      >
        {i18n._(t`Failed to delete one or more job templates.`)}
        <ErrorDetail error={deletionError} />
      </AlertModal>
    </>
  );
}

export default withI18n()(ProjectJobTemplatesList);
