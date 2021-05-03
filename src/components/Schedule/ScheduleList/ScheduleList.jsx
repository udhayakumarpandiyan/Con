import React, { useState, useEffect, useCallback } from 'react';
import { bool, func } from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Button, Tooltip } from '@patternfly/react-core';
import {
  sortable
} from '@patternfly/react-table';
import { SchedulesAPI } from '../../../api';
import AlertModal from '../../AlertModal';
import ErrorDetail from '../../ErrorDetail';
import {
  ToolbarDeleteButton,
  ToolbarAddButton,
} from '../../PaginatedDataList';
import useRequest, { useDeleteItems } from '../../../util/useRequest';
import { getQSConfig, parseQueryString } from '../../../util/qs';
import { DetailList, Detail } from '../../DetailList';
import { ScheduleToggle } from '..';
import { formatDateString } from '../../../util/dates';
import Table from '../../Table/Table';
import styled from 'styled-components';
import SearchBox from '../../../components/SearchBox';
import { FilterIcon, EditIcon } from '../../../constants/Icons';
import Loader from '../../Loader';

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

const QS_CONFIG = getQSConfig('schedule', {
  page: 1,
  page_size: 20,
  order_by: 'name',
});

const ActionItemsDiv = styled.div`
  height: 0px;
  & a{
    float: right;
    top: -42px;
  }
  & button{
    float: right;
    top: -42px;
  }
`;

function ScheduleList({
  i18n,
  loadSchedules,
  loadScheduleOptions,
  hideAddButton,
  controls,
  tabHeaderSection
}) {
  const [selected, setSelected] = useState([]);

  const location = useLocation();

  const jobTypeLabels = {
    inventory_update: i18n._(t`Inventory Sync`),
    job: i18n._(t`Playbook Run`),
    project_update: i18n._(t`Source Control Update`),
    system_job: i18n._(t`Management Job`),
    workflow_job: i18n._(t`Workflow Job`),
  };

  let scheduleBaseUrl;

  const getScheduleURL = (schedule) => {
    switch (schedule.summary_fields.unified_job_template.unified_job_type) {
      case 'inventory_update':
        scheduleBaseUrl = `/inventories/inventory/${schedule.summary_fields.inventory.id}/sources/${schedule.summary_fields.unified_job_template.id}/schedules/${schedule.id}`;
        break;
      case 'job':
        scheduleBaseUrl = `/templates/job_template/${schedule.summary_fields.unified_job_template.id}/schedules/${schedule.id}`;
        break;
      case 'project_update':
        scheduleBaseUrl = `/projects/${schedule.summary_fields.unified_job_template.id}/schedules/${schedule.id}`;
        break;
      case 'system_job':
        scheduleBaseUrl = `/management_jobs/${schedule.summary_fields.unified_job_template.id}/schedules/${schedule.id}`;
        break;
      case 'workflow_job':
        scheduleBaseUrl = `/templates/workflow_job_template/${schedule.summary_fields.unified_job_template.id}/schedules/${schedule.id}`;
        break;
      default:
        break;
    }
  }


  const {
    result: {
      schedules,
      itemCount,
      actions
    },
    error: contentError,
    isLoading,
    request: fetchSchedules,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const [
        {
          data: { count, results },
        },
        scheduleActions,
      ] = await Promise.all([loadSchedules(params), loadScheduleOptions()]);
      return {
        schedules: results,
        itemCount: count,
        actions: scheduleActions.data.actions,
        relatedSearchableKeys: (
          scheduleActions?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(
          scheduleActions.data.actions?.GET || {}
        ).filter(key => scheduleActions.data.actions?.GET[key].filterable),
      };
    }, [location, loadSchedules, loadScheduleOptions]),
    {
      schedules: [],
      itemCount: 0,
      actions: {},
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const isAllSelected =
    selected.length === schedules.length && selected.length > 0;

  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteSchedules,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(async () => {
      return Promise.all(selected.map(({ id }) => SchedulesAPI.destroy(id)));
    }, [selected]),
    {
      qsConfig: QS_CONFIG,
      allItemsSelected: isAllSelected,
      fetchItems: fetchSchedules,
    }
  );

  const handleSelectAll = isSelected => {
    schedules.forEach(schedule => {
      schedule.selected = isSelected;
    })
    setSelected(isSelected ? [...schedules] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    schedules.forEach(schedule => {
      if (schedule.id === item.id) {
        schedule.selected = isSelected;
        item = schedule;
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


  const handleDelete = async () => {
    await deleteSchedules();
    setSelected([]);
  };

  const canAdd =
    actions &&
    Object.prototype.hasOwnProperty.call(actions, 'POST') &&
    !hideAddButton;

  return (

    <>
      { tabHeaderSection &&
        <ActionItemsDiv>
          <ToolbarAddButton
            key="add"
            linkTo={`${location.pathname}/add`}
          />
          <ToolbarDeleteButton
            key="delete"
            onDelete={handleDelete}
            itemsToDelete={selected}
            pluralizedItemName="Schedules"
          />
        </ActionItemsDiv>
      }
      <Table contentError={contentError}
        handleSelectAll={handleSelectAll}
        handleSelect={handleSelect}
        hasContentLoading={isLoading || isDeleteLoading}
        onRowClick={handleRowClick}
        items={schedules}
        itemCount={itemCount}
        qsConfig={QS_CONFIG}
        onDelete={handleDelete}
        columns={[
          { title: 'SCHEDULE NAME', transforms: [sortable] },
          'SCHEDULE TYPE',
          'SCHEDULE RUN TYPE',
          'SCHEDULE STATUS',
          'ACTIONS'
        ]}
        rows={schedules && schedules.map(schedule => {
          getScheduleURL(schedule);
          return {
            cells: [
              <span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                <Link to={`management_jobs/${schedule.id}/schedules/${schedule.id}/details`}>
                  <label>
                    {schedule.name}
                  </label>
                </Link>
              </span>,
              <label>
                {
                  jobTypeLabels[
                  schedule.summary_fields.unified_job_template.unified_job_type
                  ]
                }
              </label>,
              <div style={{ paddingTop: "10px" }}>
                {schedule.next_run && (
                  <DetailList stacked>
                    <Detail
                      label={i18n._(t`Next Run`)}
                      value={formatDateString(schedule.next_run)}
                    />
                  </DetailList>
                )}
              </div>,
              <div>
                <ScheduleToggle schedule={schedule} />
              </div>,
              <div>
                {schedule.summary_fields.user_capabilities.edit ? (
                  <Tooltip content={i18n._(t`Edit Schedule`)} position="top">
                    <Button
                      aria-label={i18n._(t`Edit Schedule`)}
                      css="grid-column: 2"
                      variant="plain"
                      component={Link}
                      to={`${scheduleBaseUrl}/edit`}
                    >
                      <Icon src={EditIcon} alt="" />
                    </Button>
                  </Tooltip>
                ) : (
                    ''
                  )}
              </div>],
            selected: schedule.selected,
            id: schedule.id,
            type: schedule.type,
            summary_fields: schedule.summary_fields,
          }
        })
        }
        controls={controls ? controls : <>

          <SearchBox />
          <ToolbarAddButton
            key="add"
            linkTo={`${location.pathname}/add`}
          />
          <ToolbarDeleteButton
            key="delete"
            onDelete={handleDelete}
            itemsToDelete={selected}
            pluralizedItemName="Jobs"
          />
          {/*<FilterButton>
            <img src={FilterIcon} alt="" />
          </FilterButton>*/}
        </>
        }
      />

      {deletionError && (
        <AlertModal
          isOpen={deletionError}
          variant="danger"
          title={i18n._(t`Error!`)}
          onClose={clearDeletionError}
        >
          {i18n._(t`Failed to delete one or more schedules.`)}
          <ErrorDetail error={deletionError} />
        </AlertModal>
      )}
      <Loader loading={isLoading} />
    </>
  );
}

ScheduleList.propTypes = {
  hideAddButton: bool,
  loadSchedules: func.isRequired,
  loadScheduleOptions: func.isRequired,
};
ScheduleList.defaultProps = {
  hideAddButton: false,
};

export default withI18n()(ScheduleList);
