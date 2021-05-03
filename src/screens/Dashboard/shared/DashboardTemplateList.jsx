import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Card, DropdownItem as PFDropdownItem, Button, Tooltip } from '@patternfly/react-core';
import {
  ProjectDiagramIcon
} from '@patternfly/react-icons';

import {
  DashboardAPI,
  JobTemplatesAPI,
  UnifiedJobTemplatesAPI,
  WorkflowJobTemplatesAPI,
} from '../../../api';
import AlertModal from '../../../components/AlertModal';
import ErrorDetail from '../../../components/ErrorDetail';
import {
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';
import { timeOfDay } from '../../../util/dates';

import useRequest, { useDeleteItems } from '../../../util/useRequest';
import { getQSConfig, parseQueryString } from '../../../util/qs';
import useWsTemplates from '../../../util/useWsTemplates';
import AddDropDownButton from '../../../components/AddDropDownButton';
import { JOB_TYPE_URL_SEGMENTS } from '../../../constants';
import Table from '../../../components/Table';
import {
  sortable
} from '@patternfly/react-table';
import styled from 'styled-components';
import { LaunchIcon, EditIcon } from '../../../constants/Icons';
import LaunchButton from '../../../components/LaunchButton';
import CopyButton from '../../../components/CopyButton';
import SearchBox from '../../../components/SearchBox';
import { FilterIcon } from '../../../constants/Icons';
import { formatDateString } from '../../../util/dates';
import Loader from '../../../components/Loader';

const Status = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px 5px;
`;
const StatusBar = styled.div`
display: inline-block;
width: 30px;
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

const DropdownItem = styled(PFDropdownItem)`
&:hover{
  background: #E7DFFE;
}
`;

const QS_CONFIG = getQSConfig(
  'template',
  {
    page: 1,
    page_size: 5,
    order_by: 'name',
    type: 'job_template,workflow_job_template',
  },
  ['id', 'page', 'page_size']
);

function DashboardTemplateList({ i18n,
}) {
  // The type value in const QS_CONFIG below does not have a space between job_template and
  // workflow_job_template so the params sent to the API match what the api expects.

  const location = useLocation();

  const [selected, setSelected] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    result: { jobs },
    request: fetchJobs,
  } = useRequest(
    useCallback(async (results) => {
      let templatesRequest = results.map(template => {
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

      return {
        jobs: jobs,
      };
    }, []),
    {
      jobs: [],
    }
  );



  const {
    result: {
      results,
      count,
      jtActions,
      wfjtActions,
    },
    error: contentError,
    isLoading,
    request: fetchTemplates,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const responses = await Promise.all([
        UnifiedJobTemplatesAPI.read(params),
        JobTemplatesAPI.readOptions(),
        WorkflowJobTemplatesAPI.readOptions(),
        UnifiedJobTemplatesAPI.readOptions(),
      ]);

      await fetchJobs(responses[0].data.results);
      return {
        results: responses[0].data.results,
        count: responses[0].data.count,
        jtActions: responses[1].data.actions,
        wfjtActions: responses[2].data.actions,
        relatedSearchableKeys: (
          responses[3]?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(
          responses[3].data.actions?.GET || {}
        ).filter(key => responses[3].data.actions?.GET[key].filterable),
      };
    }, [location]),
    {
      results: [],
      count: 0,
      jtActions: {},
      wfjtActions: {},
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  //const labelId = `check-action-${template && template.id}`;

  const copyTemplate = useCallback(async (event, template) => {
    if (template.type === 'job_template') {
      await JobTemplatesAPI.copy(template.id, {
        name: `${template.name} @ ${timeOfDay()}`,
      });
    } else {
      await WorkflowJobTemplatesAPI.copy(template.id, {
        name: `${template.name} @ ${timeOfDay()}`,
      });
    }
    await fetchTemplates();
  }, [fetchTemplates]);

  const handleCopyStart = useCallback(() => {
    setIsDisabled(true);
  }, []);

  const handleCopyFinish = useCallback(() => {
    setIsDisabled(false);
  }, []);
  useEffect(() => {
    fetchTemplates();

  }, [fetchTemplates, fetchJobs]);

  const templates = useWsTemplates(results);

  const isAllSelected =
    selected.length === templates.length && selected.length > 0;
  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteTemplates,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(
        selected.map(({ type, id }) => {
          if (type === 'job_template') {
            return JobTemplatesAPI.destroy(id);
          }
          if (type === 'workflow_job_template') {
            return WorkflowJobTemplatesAPI.destroy(id);
          }
          return false;
        })
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
    templates.forEach(template => {
      template.selected = isSelected;
    })
    setSelected(isSelected ? [...templates] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    templates.forEach(template => {
      if (template.id === item.id) {
        template.selected = isSelected;
        item = template;
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

    if (event.target.nodeName === "INPUT" || event.target.nodeName === "DIV" || event.target.nodeName === "INPUT" || event.target.nodeName === "LABEL" || event.target.nodeName === "IMG") {
      event.stopPropagation();
    }
    else {
      item.selected = !item.selected;
      setSelectedItems(item, item.selected);
    }
  };



  const addTemplate = i18n._(t`Add job template`);
  const addWFTemplate = i18n._(t`Add workflow template`);

  const generateTooltip = job => (
    <Fragment>
      <div>
        {i18n._(t`JOB ID:`)} {job.id}
      </div>
      <div>
        {i18n._(t`STATUS:`)} {job.status.toUpperCase()}
      </div>
      {job.finished && (
        <div>
          {i18n._(t`FINISHED:`)} {formatDateString(job.finished)}
        </div>
      )}
    </Fragment>
  );


  const addButton = (
    <AddDropDownButton
      key="add"
      dropdownItems={[
        <DropdownItem
          key={addTemplate}
          component={Link}
          to="/templates/job_template/add/"
          aria-label={addTemplate}
        >
          {addTemplate}
        </DropdownItem>,
        <DropdownItem
          component={Link}
          to="/templates/workflow_job_template/add/"
          key={addWFTemplate}
          aria-label={addWFTemplate}
        >
          {addWFTemplate}
        </DropdownItem>,
      ]}
    />
  );

  return (

    <Fragment>
      <Card>
        <Table contentError={contentError}
          handleSelectAll={handleSelectAll}
          handleSelect={handleSelect}
          hasContentLoading={isLoading || isDeleteLoading}
          onRowClick={handleRowClick}
          items={templates}
          itemCount={count}
          qsConfig={QS_CONFIG}
          controls={<>
            <SearchBox />
            <ToolbarDeleteButton
              key="delete"
              onDelete={handleTemplateDelete}
              itemsToDelete={selected}
              pluralizedItemName="Templates"
            />
            {addButton}
            {/*<FilterButton>
              <img src={FilterIcon} alt="" />
            </FilterButton>*/}
          </>
          }
          columns={[
            { title: 'TEMPLATE NAME' , transforms: [sortable] },
            { title: 'TEMPLATE TYPE' },
            'NO OF JOBS',
            'ACTIONS'
          ]}
          rows={templates && templates.map(template => {
            let totalJobs = 0;
            return {
              cells: [
                <span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                  <Link to={`/templates/${template.type}/${template.id}`}>
                    <label>
                      {template.id} &mdash; {template.name}
                    </label>
                  </Link>
                </span>,
                <label>{template.type}</label>,
                <div style={{ display: 'flex',
                  paddingTop: "10px", display: "flex", maxWidth: "250px",
                  overflow: "scroll", overflowY: "auto"
                }}>
                  {jobs && jobs.map(job => {
                    if (template.id === job.job_template) {
                      totalJobs += 1;
                      return <Tooltip position="bottom" content={generateTooltip(job)} key={job.id}>
                        <Link
                          aria-label={i18n._(t`View job ${job.id}`)}
                          to={`/jobs/${JOB_TYPE_URL_SEGMENTS[job.type]}/${job.id}`}
                        >
                          <Status>
                            <StatusBar failed={job.status === 'failed'} />
                          </Status>
                        </Link>
                      </Tooltip>


                    }
                    else {
                      return '';
                    }
                  })}
                  {
                    totalJobs === 0 && <label>No Jobs</label>
                  }
                </div>,
                <div>
                  {template.type === 'workflow_job_template' && (
                    <Tooltip content={i18n._(t`Visualizer`)} position="top">
                      <Button
                        isDisabled={isDisabled}
                        aria-label={i18n._(t`Visualizer`)}
                        css="grid-column: 1"
                        variant="plain"
                        component={Link}
                        to={`/templates/workflow_job_template/${template.id}/visualizer`}
                      >
                        <ProjectDiagramIcon />
                      </Button>
                    </Tooltip>
                  )}
                  {template.summary_fields.user_capabilities.start && (
                    <Tooltip content={i18n._(t`Launch Template`)} position="top">
                      <LaunchButton resource={template}>
                        {({ handleLaunch }) => (
                          <Button
                            isDisabled={isDisabled}
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
                  {template.summary_fields.user_capabilities.edit && (
                    <Tooltip content={i18n._(t`Edit Template`)} position="top">
                      <Button
                        isDisabled={isDisabled}
                        aria-label={i18n._(t`Edit Template`)}
                        css="grid-column: 3"
                        variant="plain"
                        component={Link}
                        to={`/templates/${template.type}/${template.id}/edit`}
                      >
                        <Icon src={EditIcon} alt="" />
                      </Button>
                    </Tooltip>
                  )}
                  {template.summary_fields.user_capabilities.copy && (
                    <CopyButton
                      helperText={{
                        tooltip: i18n._(t`Copy Template`),
                        errorMessage: i18n._(t`Failed to copy template.`),
                      }}
                      isDisabled={isDisabled}
                      onCopyStart={handleCopyStart}
                      onCopyFinish={handleCopyFinish}
                      copyItem={(event) => copyTemplate(event, template)}
                    />
                  )}
                </div>
              ],
              selected: template.selected,
              id: template.id,
              type: template.type,
              summary_fields: template.summary_fields,
            }
          })
          }

        />

      </Card>
      <AlertModal
        aria-label={i18n._(t`Deletion Error`)}
        isOpen={deletionError}
        variant="error"
        title={i18n._(t`Error!`)}
        onClose={clearDeletionError}
      >
        {i18n._(t`Failed to delete one or more templates.`)}
        <ErrorDetail error={deletionError} />
      </AlertModal>
      <Loader loading={isLoading} />
    </Fragment>
  );
}

export default withI18n()(DashboardTemplateList);
