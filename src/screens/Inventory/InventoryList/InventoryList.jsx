import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useRouteMatch, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Card, PageSection, DropdownItem, Button, Tooltip } from '@patternfly/react-core';
import {
  sortable
} from '@patternfly/react-table';
import { InventoriesAPI } from '../../../api';

import AlertModal from '../../../components/AlertModal';
import ErrorDetail from '../../../components/ErrorDetail';
import {
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';

import useRequest, { useDeleteItems } from '../../../util/useRequest';
import { timeOfDay } from '../../../util/dates';
import { getQSConfig, parseQueryString } from '../../../util/qs';

import useWsInventories from './useWsInventories';
import Table from '../../../components/Table';
import SearchBox from '../../../components/SearchBox';
import CopyButton from '../../../components/CopyButton';
import AddDropDownButton from '../../../components/AddDropDownButton';

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

const Badge = styled.label`
  margin-left: 6px;
  font-size: 16px;
  color: #000;
  font-weight: bolder;
`;

const ListGroup = styled.div`
  margin: 0px 8px;
  display: inline-block;
  color: #1362A8;
  font-weight: 600;
`;


const QS_CONFIG = getQSConfig('inventory', {
  page: 1,
  page_size: 20,
  order_by: 'name',
});

function InventoryList({ i18n, controls }) {
  const location = useLocation();
  const match = useRouteMatch();
  const [selected, setSelected] = useState([]);

  const [isDisabled, setIsDisabled] = useState(false);


  const {
    result: {
      results,
      itemCount,
      actions
    },
    error: contentError,
    isLoading,
    request: fetchInventories,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const [response, actionsResponse] = await Promise.all([
        InventoriesAPI.read(params),
        InventoriesAPI.readOptions(),
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

  useEffect(() => {
    fetchInventories();
  }, [fetchInventories]);

  const fetchInventoriesById = useCallback(
    async ids => {
      const params = { ...parseQueryString(QS_CONFIG, location.search) };
      params.id__in = ids.join(',');
      const { data } = await InventoriesAPI.read(params);
      return data.results;
    },
    [location.search] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const inventories = useWsInventories(
    results,
    fetchInventories,
    fetchInventoriesById,
    QS_CONFIG
  );

  const isAllSelected =
    selected.length === inventories.length && selected.length > 0;
  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteInventories,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(selected.map(team => InventoriesAPI.destroy(team.id)));
    }, [selected]),
    {
      allItemsSelected: isAllSelected,
    }
  );

  let localInventory;
  // const copyInventory = useCallback(async (inventory) => {
  //   localInventory = inventory
  //   await InventoriesAPI.copy(localInventory.id, {
  //     name: `${localInventory.name} @ ${timeOfDay()}`,
  //   });
  //   await fetchInventories();
  // }, [localInventory && localInventory.id, localInventory && localInventory.name, fetchInventories]);

  const handleCopyStart = useCallback(() => {
    setIsDisabled(true);
  }, []);

  const handleCopyFinish = useCallback(() => {
    setIsDisabled(false);
  }, []);


  const handleInventoryDelete = async () => {
    await deleteInventories();
    setSelected([]);
  };

  const hasContentLoading = isDeleteLoading || isLoading;
  const canAdd = actions && actions.POST;

  const handleSelectAll = isSelected => {
    inventories.forEach(inventory => {
      inventory.selected = isSelected;
    })
    setSelected(isSelected ? [...inventories] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    inventories.forEach(inventory => {
      if (inventory.id === item.id) {
        inventory.selected = isSelected;
        item = inventory;
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


  const addInventory = i18n._(t`Add inventory`);
  const addSmartInventory = i18n._(t`Add smart inventory`);
  const addButton = (
    <AddDropDownButton
      key="add"
      dropdownItems={[
        <DropdownItem
          to={`${match.url}/inventory/add/`}
          component={Link}
          key={addInventory}
          aria-label={addInventory}
        >
          {addInventory}
        </DropdownItem>,
        <DropdownItem
          to={`${match.url}/smart_inventory/add/`}
          component={Link}
          key={addSmartInventory}
          aria-label={addSmartInventory}
        >
          {addSmartInventory}
        </DropdownItem>,
      ]}
    />
  );
  return (
    <PageSection>
      <Card>
        <Table contentError={contentError}
          handleSelectAll={handleSelectAll}
          handleSelect={handleSelect}
          hasContentLoading={isLoading || isDeleteLoading}
          onRowClick={handleRowClick}
          items={inventories}
          itemCount={itemCount}
          pluralizedItemName={i18n._(t`Inventories`)}
          qsConfig={QS_CONFIG}
          onDelete={handleInventoryDelete}
          columns={[
            { title: 'NAME', transforms: [sortable] },
            'TYPE',
            'ORGANIZATION',
            'HEADING',
            'ACTIONS',
          ]}
          rows={inventories && inventories.map(inventory => {
            return {
              cells: [
                <span style={{ color: '#1362A8', fontSize: "16px", maxWidth: "250px", fontWeight: "600" }}>
                  <Link to={inventory.kind === 'smart'
                    ? `${match.url}/smart_inventory/${inventory.id}/details`
                    : `${match.url}/inventory/${inventory.id}/details`}
                  >
                    <label>{inventory.name}</label>
                  </Link>
                </span>,
                <span>
                  {inventory.kind === 'smart'
                    ? i18n._(t`Smart Inventory`)
                    : i18n._(t`Inventory`)}
                </span>,
                <div>
                  <Link
                    to={`/organizations/${inventory.summary_fields.organization.id}/details`}
                  >
                    {inventory.summary_fields.organization.name}
                  </Link>
                </div>,
                <div>
                  <ListGroup>
                    {i18n._(t`Groups`)}
                    <Badge isRead>{inventory.total_groups}</Badge>
                  </ListGroup>
                  <ListGroup>
                    {i18n._(t`Hosts`)}
                    <Badge isRead>{inventory.total_hosts}</Badge>
                  </ListGroup>
                  <ListGroup>
                    {i18n._(t`Sources`)}
                    <Badge isRead>{inventory.total_inventory_sources}</Badge>
                  </ListGroup>
                </div>,


                <div style={{ paddingTop: "10px" }}>
                  {inventory.summary_fields.user_capabilities.edit ? (
                    <Tooltip content={i18n._(t`Edit Inventory`)} position="top">
                      <Button
                        aria-label={i18n._(t`Edit Inventory`)}
                        variant="plain"
                        component={Link}
                        to={`/inventories/${inventory.kind === 'smart' ? 'smart_inventory' : 'inventory'
                          }/${inventory.id}/edit`}
                      >
                        <img src={EditIcon} />
                      </Button>
                    </Tooltip>
                  ) : (
                      ''
                    )}
                  {inventory.summary_fields.user_capabilities.copy && (
                    <CopyButton
                      isDisabled={isDisabled}
                      onCopyStart={handleCopyStart}
                      onCopyFinish={handleCopyFinish}
                      helperText={{
                        tooltip: i18n._(t`Copy Inventory`),
                        errorMessage: i18n._(t`Failed to copy inventory.`),
                      }}
                    />
                  )}
                </div>,
              ],
              selected: inventory.selected,
              id: inventory.id,
              type: inventory.type,
              name: inventory.name,
              summary_fields: inventory.summary_fields,
            }
          })
          }
          controls={controls ? controls : <>

            <SearchBox />
            <ToolbarDeleteButton
              key="delete"
              onDelete={handleInventoryDelete}
              itemsToDelete={selected ? selected : []}
              pluralizedItemName="Inventories"
            />
            {
              canAdd && addButton
            }
            {/*<FilterButton>
              <img src={FilterIcon} alt="" />
            </FilterButton>*/}
          </>
          }
        />


      </Card>
      <AlertModal
        isOpen={deletionError}
        variant="error"
        aria-label={i18n._(t`Deletion Error`)}
        title={i18n._(t`Error!`)}
        onClose={clearDeletionError}
      >
        {i18n._(t`Failed to delete one or more inventories.`)}
        <ErrorDetail error={deletionError} />
      </AlertModal>
      <Loader loading={hasContentLoading} />
    </PageSection>

  );
}

export default withI18n()(InventoryList);
