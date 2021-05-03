import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Card, PageSection, Button, Tooltip } from '@patternfly/react-core';
import {
  sortable
} from '@patternfly/react-table';

import { HostsAPI } from '../../../api';

import { JOB_TYPE_URL_SEGMENTS } from '../../../constants';
import {
  ToolbarAddButton,
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';
import useRequest, { useDeleteItems } from '../../../util/useRequest';
import { getQSConfig, parseQueryString } from '../../../util/qs';
import { formatDateString } from '../../../util/dates';

import Table from '../../../components/Table';
import SearchBox from '../../../components/SearchBox';
import HostToggle from '../../../components/HostToggle';
import AlertModal from '../../../components/AlertModal';
import ErrorDetail from '../../../components/ErrorDetail';

import { EditIcon, FilterIcon } from '../../../constants/Icons';
import styled from 'styled-components';
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


const QS_CONFIG = getQSConfig('host', {
  page: 1,
  page_size: 20,
  order_by: 'name',
});

function HostList({ i18n, controls }) {
  const location = useLocation();
  const match = useRouteMatch();
  const [selected, setSelected] = useState([]);

  const {
    result: { hosts, count, actions },
    error: contentError,
    isLoading,
    request: fetchHosts,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const results = await Promise.all([
        HostsAPI.read(params),
        HostsAPI.readOptions(),
      ]);
      return {
        hosts: results[0].data.results,
        count: results[0].data.count,
        actions: results[1].data.actions,
        relatedSearchableKeys: (
          results[1]?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(results[1].data.actions?.GET || {}).filter(
          key => results[1].data.actions?.GET[key].filterable
        ),
      };
    }, [location]),
    {
      hosts: [],
      count: 0,
      actions: {},
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  useEffect(() => {
    fetchHosts();
  }, [fetchHosts]);

  const isAllSelected = selected.length === hosts.length && selected.length > 0;
  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteHosts,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(selected.map(host => HostsAPI.destroy(host.id)));
    }, [selected]),
    {
      qsConfig: QS_CONFIG,
      allItemsSelected: isAllSelected,
      fetchItems: fetchHosts,
    }
  );

  const handleHostDelete = async () => {
    await deleteHosts();
    setSelected([]);
  };

  const handleSelectAll = isSelected => {
    hosts.forEach(host => {
      host.selected = isSelected;
    })
    setSelected(isSelected ? [...hosts] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    hosts.forEach(host => {
      if (host.id === item.id) {
        host.selected = isSelected;
        item = host;
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

    if (event.target.nodeName === "INPUT" || event.target.nodeName === "DIV" || event.target.nodeName === "LABEL" || event.target.nodeName === "IMG") {
      event.stopPropagation();
    }
    else {
      item.selected = !item.selected;
      setSelectedItems(item, item.selected);
    }
  };


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

  const canAdd =
    actions && Object.prototype.hasOwnProperty.call(actions, 'POST');

  return (
    <PageSection>
      <Card>
        <Table contentError={contentError}
          handleSelectAll={handleSelectAll}
          handleSelect={handleSelect}
          hasContentLoading={isLoading || isDeleteLoading}
          onRowClick={handleRowClick}
          items={hosts}
          itemCount={count}
          qsConfig={QS_CONFIG}
          onDelete={handleHostDelete}
          columns={[
            { title: 'NAME', transforms: [sortable] },
            'INVENTORY',
            'HEADING',
            'ACTIONS',
          ]}
          rows={hosts && hosts.map(host => {
            return {
              cells: [
                <span style={{ color: '#1362A8', fontSize: "16px", maxWidth: "250px", fontWeight: "600" }}>
                  <Link to={`${match.url}/${host.id}/details`}>
                    <label>{host.name}</label>
                  </Link>
                </span>,
                <span>
                  {host.summary_fields.inventory && (
                    <Link
                      to={`/inventories/inventory/${host.summary_fields.inventory.id}/details`}
                    >
                      {host.summary_fields.inventory.name}
                    </Link>
                  )}
                </span>,
                <div style={{
                  paddingTop: "10px", display: "flex", maxWidth: "250px",
                  overflow: "scroll", overflowY: "auto"
                }}>
                  {host.summary_fields.recent_jobs && host.summary_fields.recent_jobs.map(job => {
                    return <Tooltip position="top" content={generateTooltip(job)} key={job.id}>
                      <Link
                        aria-label={i18n._(t`View job ${job.id}`)}
                        to={`/jobs/${JOB_TYPE_URL_SEGMENTS[job.type]}/${job.id}`}
                      >
                        <Status>
                          <label style={{ color: "#007BFF", paddingRight: "6px" }}>{`${job.id}`}</label><StatusBar failed={job.status === 'failed'} />
                        </Status>
                      </Link>
                    </Tooltip>

                  })}
                </div>,


                <div style={{ paddingTop: "10px" }}>
                  <HostToggle host={host} />
                  {host.summary_fields.user_capabilities.edit ? (
                    <Tooltip content={i18n._(t`Edit Host`)} position="top">
                      <Button
                        aria-label={i18n._(t`Edit Host`)}
                        variant="plain"
                        component={Link}
                        to={`/hosts/${host.id}/edit`}
                      >
                        <img src={EditIcon} />
                      </Button>
                    </Tooltip>
                  ) : (
                      ''
                    )}
                </div>,
              ],
              selected: host.selected,
              id: host.id,
              type: host.type,
              summary_fields: host.summary_fields,
            }
          })
          }
          controls={controls ? controls : <>

            <SearchBox />
            <ToolbarDeleteButton
              key="delete"
              onDelete={handleHostDelete}
              itemsToDelete={selected}
              pluralizedItemName="hosts"
            />
            {
              canAdd ? <ToolbarAddButton key="add" linkTo={`${match.url}/add`} /> : null
            }
            {/*<FilterButton>
              <img src={FilterIcon} alt="" />
            </FilterButton>*/}
          </>
          }
        />

      </Card>
      {deletionError && (
        <AlertModal
          isOpen={deletionError}
          variant="error"
          title={i18n._(t`Error!`)}
          onClose={clearDeletionError}
        >
          {i18n._(t`Failed to delete one or more hosts.`)}
          <ErrorDetail error={deletionError} />
        </AlertModal>
      )}
      <Loader loading={isLoading} />
    </PageSection>
  );
}

export default withI18n()(HostList);
