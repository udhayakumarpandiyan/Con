import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useRouteMatch, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Badge as PFBadge, Card, PageSection, Button, Tooltip } from '@patternfly/react-core';
import {
  sortable
} from '@patternfly/react-table';

import { OrganizationsAPI } from '../../../api';
import useRequest, { useDeleteItems } from '../../../util/useRequest';
import { getQSConfig, parseQueryString } from '../../../util/qs';

import {
  ToolbarAddButton,
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';
import Table from '../../../components/Table';
import SearchBox from '../../../components/SearchBox';
import Loader from '../../../components/Loader';
import AlertModal from '../../../components/AlertModal';
import ErrorDetail from '../../../components/ErrorDetail';

import { FilterIcon, EditIcon } from '../../../constants/Icons';
import styled from 'styled-components';


const FilterButton = styled(Button)`
height: 30px;
background-color: transparent !important;
border: none !important;
& img{
    height: 26px;
    width: 26px;
}
`;


const Badge = styled(PFBadge)`
  margin-left: 8px;
`;

const ListGroup = styled.span`
  margin-left: 24px;

  &:first-of-type {
    margin-left: 0;
  }
`;


const QS_CONFIG = getQSConfig('organization', {
  page: 1,
  page_size: 20,
  order_by: 'name',
});

function OrganizationsList({ i18n, controls }) {
  const location = useLocation();
  const match = useRouteMatch();

  const [selected, setSelected] = useState([]);

  const addUrl = `${match.url}/add`;

  const {
    result: {
      organizations,
      organizationCount,
      actions
    },
    error: contentError,
    isLoading: isOrgsLoading,
    request: fetchOrganizations,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const [orgs, orgActions] = await Promise.all([
        OrganizationsAPI.read(params),
        OrganizationsAPI.readOptions(),
      ]);
      return {
        organizations: orgs.data.results,
        organizationCount: orgs.data.count,
        actions: orgActions.data.actions,
        relatedSearchableKeys: (
          orgActions?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(orgActions.data.actions?.GET || {}).filter(
          key => orgActions.data.actions?.GET[key].filterable
        ),
      };
    }, [location]),
    {
      organizations: [],
      organizationCount: 0,
      actions: {},
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const isAllSelected =
    selected.length === organizations.length && selected.length > 0;
  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteOrganizations,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(
        selected.map(({ id }) => OrganizationsAPI.destroy(id))
      );
    }, [selected]),
    {
      qsConfig: QS_CONFIG,
      allItemsSelected: isAllSelected,
      fetchItems: fetchOrganizations,
    }
  );

  const handleOrganizationDelete = async () => {
    await deleteOrganizations();
    setSelected([]);
  };

  const hasContentLoading = isDeleteLoading || isOrgsLoading;
  const canAdd = actions && actions.POST;

  const handleSelectAll = isSelected => {
    organizations.forEach(organization => {
      organization.selected = isSelected;
    })
    setSelected(isSelected ? [...organizations] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    organizations.forEach(organization => {
      if (organization.id === item.id) {
        organization.selected = isSelected;
        item = organization;
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


  return (
    <>
      <PageSection>
        <Card>
          <Table contentError={contentError}
            handleSelectAll={handleSelectAll}
            handleSelect={handleSelect}
            hasContentLoading={hasContentLoading || isDeleteLoading}
            onRowClick={handleRowClick}
            items={organizations}
            itemCount={organizationCount}
            qsConfig={QS_CONFIG}
            onDelete={handleOrganizationDelete}
            columns={[
              { title: 'NAME', transforms: [sortable] },
              'HEADING',
              'ACTIONS',
            ]}
            rows={organizations && organizations.map(organization => {
              return {
                cells: [
                  <span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                    <Link to={`${match.url}/${organization.id}`}>
                      <label>
                        {organization.name}
                      </label>
                    </Link>
                  </span>,
                  <span>
                    <ListGroup>
                      {i18n._(t`Members`)}
                      <Badge isRead>
                        {organization.summary_fields.related_field_counts.users}
                      </Badge>
                    </ListGroup>
                    <ListGroup>
                      {i18n._(t`Teams`)}
                      <Badge isRead>
                        {organization.summary_fields.related_field_counts.teams}
                      </Badge>
                    </ListGroup>
                  </span>,
                  <div style={{ paddingTop: "10px" }}>
                    {organization.summary_fields.user_capabilities.edit ? (
                      <Tooltip content={i18n._(t`Edit Organization`)} position="top">
                        <Button
                          aria-label={i18n._(t`Edit Organization`)}
                          variant="plain"
                          component={Link}
                          to={`/organizations/${organization.id}/edit`}
                        >
                          <img src={EditIcon} />
                        </Button>
                      </Tooltip>
                    ) : (
                        ''
                      )}
                  </div>,
                ],
                selected: organization.selected,
                id: organization.id,
                type: organization.type,
                summary_fields: organization.summary_fields,
              }
            })
            }
            controls={controls ? controls : <>

              <SearchBox />
              <ToolbarDeleteButton
                key="delete"
                onDelete={handleOrganizationDelete}
                itemsToDelete={selected}
                pluralizedItemName="organizations"
              />
              {
                canAdd ? <ToolbarAddButton key="add" linkTo={addUrl} /> : null
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
        title={i18n._(t`Error!`)}
        onClose={clearDeletionError}
      >
        {i18n._(t`Failed to delete one or more organizations.`)}
        <ErrorDetail error={deletionError} />
      </AlertModal>
      <Loader loading={hasContentLoading} />
    </>
  );
}

export { OrganizationsList as _OrganizationsList };
export default withI18n()(OrganizationsList);
