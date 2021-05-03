import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useLocation, useRouteMatch, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Card, PageSection, Button, Tooltip } from '@patternfly/react-core';
import { SyncIcon } from '@patternfly/react-icons';
import {
  sortable
} from '@patternfly/react-table';
import { ProjectsAPI } from '../../../api';
import useRequest, { useDeleteItems } from '../../../util/useRequest';
import AlertModal from '../../../components/AlertModal';
import ErrorDetail from '../../../components/ErrorDetail';
import {
  ToolbarAddButton,
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';
import Table from '../../../components/Table/Table';
import styled from 'styled-components';
import useWsProjects from './useWsProjects';
import { getQSConfig, parseQueryString } from '../../../util/qs';
import ProjectSyncButton from '../shared/ProjectSyncButton';
import SearchBox from '../../../components/SearchBox';
import { FilterIcon, EditIcon } from '../../../constants/Icons';
import { timeOfDay } from '../../../util/dates';
import ClipboardCopyButton from '../../../components/ClipboardCopyButton';
import CopyButton from '../../../components/CopyButton';
import Loader from '../../../components/Loader';

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
const Label = styled.span`
  color: #007BFF;
`;

const QS_CONFIG = getQSConfig('project', {
  page: 1,
  page_size: 20,
  order_by: 'name',
});

function ProjectList({ i18n }) {
  const location = useLocation();
  const match = useRouteMatch();
  const [selected, setSelected] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  let canEdit;

  const {
    result: {
      results,
      itemCount,
      actions,
      relatedSearchableKeys,
      searchableKeys,
    },
    error: contentError,
    isLoading,
    request: fetchProjects,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const [response, actionsResponse] = await Promise.all([
        ProjectsAPI.read(params),
        ProjectsAPI.readOptions(),
      ]);
      return {
        results: response.data.results,
        itemCount: response.data.count,
        actions: actionsResponse.data.actions,
        relatedSearchableKeys: (
          actionsResponse?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(
          actionsResponse.data.actions?.GET || {}
        ).filter(key => actionsResponse.data.actions?.GET[key].filterable),
      };
    }, [location]),
    {
      results: [],
      itemCount: 0,
      actions: {},
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );
  let project;
  const copyProject = useCallback(async (value) => {
    project = value;
    await ProjectsAPI.copy(project.id, {
      name: `${project.name} @ ${timeOfDay()}`,
    });
    await fetchProjects();
  }, [fetchProjects]);

  const handleCopyStart = useCallback(() => {
    setIsDisabled(true);
  }, []);

  const handleCopyFinish = useCallback(() => {
    setIsDisabled(false);
  }, []);



  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const projects = useWsProjects(results);

  const isAllSelected =
    selected.length === projects.length && selected.length > 0;
  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteProjects,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(selected.map(({ id }) => ProjectsAPI.destroy(id)));
    }, [selected]),
    {
      qsConfig: QS_CONFIG,
      allItemsSelected: isAllSelected,
      fetchItems: fetchProjects,
    }
  );

  const handleDelete = async () => {
    await deleteProjects();
    setSelected([]);
  };

  const hasContentLoading = isDeleteLoading || isLoading;
  const canAdd = actions && actions.POST;

  const handleSelectAll = isSelected => {
    projects.forEach(project => {
      project.selected = isSelected;
    })
    setSelected(isSelected ? [...projects] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    projects.forEach(project => {
      if (project.id === item.id) {
        project.selected = isSelected;
        item = project;
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
    <Fragment>
      <PageSection>
        <Card>
          <Table contentError={contentError}
            handleSelectAll={handleSelectAll}
            handleSelect={handleSelect}
            hasContentLoading={isLoading || isDeleteLoading}
            onRowClick={handleRowClick}
            items={projects}
            itemCount={itemCount}
            qsConfig={QS_CONFIG}
            onDelete={handleDelete}
            columns={[
              { title: 'PROJECT NAME', transforms: [sortable] },
              'SOURCE TYPE',
              'HEADING',
              'ACTIONS'
            ]}
            rows={projects && projects.map(project => {
              canEdit = project.summary_fields.user_capabilities.edit;
              return {
                cells: [
                  <span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                    <Link to={`projects/${project.id}/details`}>
                      <label>
                        {project.name}
                      </label>
                    </Link>
                  </span>,
                  <label>
                    {
                      project.type
                    }
                  </label>,
                  <div>
                    <Label> {project.scm_revision.substring(0, 7)}</Label>

                    {!project.scm_revision && (
                      <Label aria-label={i18n._(t`copy to clipboard disabled`)}>
                        {i18n._(t`Sync for revision`)}
                      </Label>
                    )}
                    <ClipboardCopyButton
                      isDisabled={!project.scm_revision}
                      stringToCopy={project.scm_revision}
                      copyTip={i18n._(t`Copy full revision to clipboard.`)}
                      copiedSuccessTip={i18n._(t`Successfully copied to clipboard!`)}
                    />
                  </div>,
                  <div>
                    {project.summary_fields.user_capabilities.start ? (
                      <Tooltip content={i18n._(t`Sync Project`)} position="top">
                        <ProjectSyncButton projectId={project.id}>
                          {handleSync => (
                            <Button
                              isDisabled={isDisabled}
                              aria-label={i18n._(t`Sync Project`)}
                              variant="plain"
                              onClick={handleSync}
                            >
                              <SyncIcon />
                            </Button>
                          )}
                        </ProjectSyncButton>
                      </Tooltip>
                    ) : (
                        ''
                      )}
                    {canEdit && (
                      <Tooltip content={i18n._(t`Edit Project`)} position="top">
                        <Button
                          isDisabled={isDisabled}
                          aria-label={i18n._(t`Edit Project`)}
                          variant="plain"
                          component={Link}
                          to={`/projects/${project.id}/edit`}
                        >
                          <Icon src={EditIcon} alt="" />
                        </Button>
                      </Tooltip>
                    )}
                    {project.summary_fields.user_capabilities.copy && (
                      <CopyButton
                        isDisabled={isDisabled}
                        onCopyStart={handleCopyStart}
                        onCopyFinish={handleCopyFinish}
                        copyItem={copyProject}
                        helperText={{
                          tooltip: i18n._(t`Copy Project`),
                          errorMessage: i18n._(t`Failed to copy project.`),
                        }}
                      />
                    )}
                  </div>],
                selected: project.selected,
                id: project.id,
                type: project.type,
                summary_fields: project.summary_fields,
              }
            })
            }
            controls={<>
              <SearchBox />
              <ToolbarDeleteButton
                key="delete"
                onDelete={handleDelete}
                itemsToDelete={selected}
                pluralizedItemName="Jobs"
              />
              {canAdd
                ? [<ToolbarAddButton key="add" linkTo="/projects/add" />]
                : []
              }
              {/*<FilterButton>
                <img src={FilterIcon} alt="" />
              </FilterButton>*/}
            </>
            }
          />

        </Card>
      </PageSection>
      <AlertModal
        isOpen={deletionError}
        variant="error"
        aria-label={i18n._(t`Deletion Error`)}
        title={i18n._(t`Error!`)}
        onClose={clearDeletionError}
      >
        {i18n._(t`Failed to delete one or more projects.`)}
        <ErrorDetail error={deletionError} />
      </AlertModal>
      <Loader loading={isLoading} />
    </Fragment>
  );
}

export default withI18n()(ProjectList);
