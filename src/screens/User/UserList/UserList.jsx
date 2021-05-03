import React, { useEffect, useCallback, useState } from 'react';
import { useLocation, useRouteMatch, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Card, PageSection, Button, Tooltip } from '@patternfly/react-core';
import {
  sortable
} from '@patternfly/react-table';
import { UsersAPI } from '../../../api';
import AlertModal from '../../../components/AlertModal';
import ErrorDetail from '../../../components/ErrorDetail';
import {
  ToolbarAddButton,
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';
import useRequest, { useDeleteItems } from '../../../util/useRequest';
import { getQSConfig, parseQueryString } from '../../../util/qs';
import Table from '../../../components/Table';
import SearchBox from '../../../components/SearchBox';
import { FilterIcon, EditIcon } from '../../../constants/Icons';
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
const Type = styled.label``;

const QS_CONFIG = getQSConfig('user', {
  page: 1,
  page_size: 20,
  order_by: 'username',
});

function UserList({ i18n, controls }) {
  const location = useLocation();
  const match = useRouteMatch();

  const [selected, setSelected] = useState([]);
  const addUrl = `${match.url}/add`;

  let user;

  const {
    result: {
      users,
      itemCount,
      actions,
      relatedSearchableKeys,
      searchableKeys,
    },
    error: contentError,
    isLoading,
    request: fetchUsers,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const [response, actionsResponse] = await Promise.all([
        UsersAPI.read(params),
        UsersAPI.readOptions(),
      ]);
      return {
        users: response.data.results,
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
      users: [],
      itemCount: 0,
      actions: {},
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const isAllSelected = selected.length === users.length && selected.length > 0;
  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteUsers,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(selected.map(({ id }) => UsersAPI.destroy(id)));
    }, [selected]),
    {
      qsConfig: QS_CONFIG,
      allItemsSelected: isAllSelected,
      fetchItems: fetchUsers,
    }
  );

  const handleUserDelete = async () => {
    await deleteUsers();
    setSelected([]);
  };

  const hasContentLoading = isDeleteLoading || isLoading;
  const canAdd = actions && actions.POST;

  const handleSelectAll = isSelected => {
    users.forEach(user => {
      user.selected = isSelected;
    })
    setSelected(isSelected ? [...users] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    users.forEach(user => {
      if (user.id === item.id) {
        user.selected = isSelected;
        item = user;
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

  return (
    <PageSection>
      <Card>
        <Table contentError={contentError}
          handleSelectAll={handleSelectAll}
          handleSelect={handleSelect}
          hasContentLoading={hasContentLoading || isDeleteLoading}
          onRowClick={handleRowClick}
          items={users}
          itemCount={itemCount}
          qsConfig={QS_CONFIG}
          onDelete={handleUserDelete}
          columns={[
            { title: 'NAME', transforms: [sortable] },
            'FIRST NAME',
            'LAST NAME',
            'USER TYPE',
            'ACTIONS',
          ]}
          rows={users && users.map(user => {
            return {
              cells: [
                <span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                  <Link to={`${match.url}/${user.id}`}>
                    <Type>
                      {user.username}
                    </Type>
                  </Link>
                </span>,
                <span>
                  <p>
                    {user.first_name}
                  </p>
                </span>,
                <span>
                  <p>
                    {user.last_name}
                  </p>
                </span>,
                <span>
                  <p>
                    {(!user.is_superuser && !user.is_system_auditor ? 'Normal User' : '')}
                    {(user.is_superuser ? 'System Administrator' : '')}
                    {(user.is_system_auditor ? 'System Auditor' : '')}
                  </p>
                </span>,
                <div style={{ paddingTop: "10px" }}>
                  {user.summary_fields.user_capabilities.edit ? (
                    <Tooltip content={i18n._(t`Edit User`)} position="top">
                      <Button
                        aria-label={i18n._(t`Edit User`)}
                        variant="plain"
                        component={Link}
                        to={`/users/${user.id}/edit`}
                      >
                        <img src={EditIcon} />
                      </Button>
                    </Tooltip>
                  ) : (
                      ''
                    )}
                </div>,
              ],
              selected: user.selected,
              id: user.id,
              type: user.type,
              summary_fields: user.summary_fields,
            }
          })
          }
          controls={controls ? controls : <>
            <SearchBox />
            <ToolbarDeleteButton
              key="delete"
              onDelete={handleUserDelete}
              itemsToDelete={selected}
              pluralizedItemName="users"
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
      <AlertModal
        aria-label={i18n._(t`Deletion Error`)}
        isOpen={deletionError}
        variant="error"
        title={i18n._(t`Error!`)}
        onClose={clearDeletionError}
      >
        {i18n._(t`Failed to delete one or more credentials.`)}
        <ErrorDetail error={deletionError} />
      </AlertModal>
      <Loader loading={isLoading} />
    </PageSection>
  );
}

export default withI18n()(UserList);
