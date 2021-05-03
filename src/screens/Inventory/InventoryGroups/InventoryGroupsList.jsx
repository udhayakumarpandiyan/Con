import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Tooltip, Button } from '@patternfly/react-core';
import { getQSConfig, parseQueryString } from '../../../util/qs';
import useSelected from '../../../util/useSelected';
import useRequest, { useDeleteItems } from '../../../util/useRequest';
import { InventoriesAPI, GroupsAPI } from '../../../api';
import DataListToolbar from '../../../components/DataListToolbar';
import PaginatedDataList, {
  ToolbarAddButton,
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';

import InventoryGroupItem from './InventoryGroupItem';
import InventoryGroupsDeleteModal from '../shared/InventoryGroupsDeleteModal';

import AdHocCommands from '../../../components/AdHocCommands/AdHocCommands';
import Table from '../../../components/Table/Table';
import SearchBox from '../../../components/SearchBox';
import { FilterIcon, EditIcon } from '../../../constants/Icons';
import styled from 'styled-components';

const QS_CONFIG = getQSConfig('group', {
  page: 1,
  page_size: 20,
  order_by: 'name',
});

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
    top: -42px; 
    background: #4BC6B9 !important;
    --pf-c-button--m-secondary--after--BorderColor: #61c7b9;
  }
  & button{
    float: right;
    top: -42px;
  }
`;

function cannotDelete(item) {
  return !item.summary_fields.user_capabilities.delete;
}

function InventoryGroupsList({ i18n, controls }) {
  const location = useLocation();
  const { id: inventoryId } = useParams();
  const [selected, setSelected] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  let canEdit;
  const {
    result: {
      groups,
      groupCount,
      actions,
      relatedSearchableKeys,
      searchableKeys,
    },
    error: contentError,
    isLoading,
    request: fetchData,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const [response, groupOptions] = await Promise.all([
        InventoriesAPI.readGroups(inventoryId, params),
        InventoriesAPI.readGroupsOptions(inventoryId),
      ]);

      return {
        groups: response.data.results,
        groupCount: response.data.count,
        actions: groupOptions.data.actions,
        relatedSearchableKeys: (
          groupOptions?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(
          groupOptions.data.actions?.GET || {}
        ).filter(key => groupOptions.data.actions?.GET[key].filterable),
      };
    }, [inventoryId, location]),
    {
      groups: [],
      groupCount: 0,
      actions: {},
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const isAllSelected = selected.length === groups.length && selected.length > 0;
const {
  isLoading: isDeleteLoading,
  deleteItems: deleteGroups,
  deletionError,
  clearDeletionError,
} = useDeleteItems(
  useCallback(() => {
    return Promise.all(selected.map(({ id }) => GroupsAPI.destroy(id)));
  }, [selected]),
  {
    qsConfig: QS_CONFIG,
    allItemsSelected: isAllSelected,
    fetchItems: fetchData,
  }
);

  const handleDelete = async () => {
    await deleteGroups();
    setSelected([]);
  };

  const hasContentLoading = isDeleteLoading || isLoading;
  const canAdd = actions && actions.POST;

  const handleSelectAll = isSelected => {
    groups.forEach(group => {
      group.selected = isSelected;
    })
    setSelected(isSelected ? [...groups] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    groups.forEach(group => {
      if (group.id === item.id) {
        group.selected = isSelected;
        item = group;
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

  const renderTooltip = () => {
    const itemsUnableToDelete = selected
      .filter(cannotDelete)
      .map(item => item.name)
      .join(', ');

    if (selected.some(cannotDelete)) {
      return (
        <div>
          {i18n._(
            t`You do not have permission to delete the following Groups: ${itemsUnableToDelete}`
          )}
        </div>
      );
    }
    if (selected.length) {
      return i18n._(t`Delete`);
    }
    return i18n._(t`Select a row to delete`);
  };

  return (
    <>
    <ActionItemsDiv>
    {canAdd
      ? [<ToolbarAddButton key="add" linkTo={`/inventories/inventory/${inventoryId}/groups/add`} />]
      : []
    }
    <ToolbarDeleteButton
      key="delete"
      onDelete={handleDelete}
      itemsToDelete={selected}
      pluralizedItemName="Inventory Groups"
    />
    </ActionItemsDiv>
    <Table contentError={contentError}            
            handleSelectAll={handleSelectAll}
            handleSelect={handleSelect}
            hasContentLoading={isLoading || isDeleteLoading}
            onRowClick={handleRowClick}
            items={groups}
            itemCount={groupCount}
            qsConfig={QS_CONFIG}
            onDelete={handleDelete}
            columns={[
              { title: 'GROUP NAME' },
              'ACTIONS'
            ]}
            rows={groups && groups.map(group => {
              canEdit = group.summary_fields.user_capabilities.edit;
              return {
                cells: [
                  <span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                    <Link to={`groups/${group.id}/details`}>
                      <label>
                        {group.name}
                      </label>
                    </Link>
                  </span>,
                  <div>
                    {canEdit && (
                      <Tooltip content={i18n._(t`Edit Group`)} position="top">
                        <Button
                          isDisabled={isDisabled}
                          aria-label={i18n._(t`Edit Group`)}
                          variant="plain"
                          component={Link}
                          to={`/inventories/inventory/${inventoryId}/groups/${group.id}/edit`}
                        >
                          <Icon src={EditIcon} alt="" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>],
                selected: group.selected,
                id: group.id,
                summary_fields: group.summary_fields,
              }
            })
            }
            controls={controls ? controls : <>
              <SearchBox />
              {/*<FilterButton>
                <img src={FilterIcon} alt="" />
              </FilterButton>*/}
            </>
            }
          />
        </>
  );
}
export default withI18n()(InventoryGroupsList);
