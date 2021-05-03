import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { TeamsAPI, UsersAPI } from '../../api';
import AddResourceRole from '../AddRole/AddResourceRole';
import AlertModal from '../AlertModal';
import { ToolbarAddButton } from '../PaginatedDataList';
import { getQSConfig, parseQueryString } from '../../util/qs';
import useRequest, { useDeleteItems } from '../../util/useRequest';
import DeleteRoleConfirmationModal from './DeleteRoleConfirmationModal';
import styled from 'styled-components';
import Table from '../Table/Table';
import {
  Chip,
  Text,
  TextContent,
  TextVariants,
  Button,
} from '@patternfly/react-core';

import ChipGroup from '../ChipGroup';
import { DetailList, Detail } from '../DetailList';
import Loader from '../Loader/Loader';

const MainContainer = styled.div`
  background: #FFFFFF 0% 0% no-repeat padding-box;
  border: 0.5px solid #AFAFAF;
  border-radius: 3px;
  margin: 1.6rem;
`;
const MainContainerHead = styled.div`
  background: #646972 0% 0% no-repeat padding-box;
  height: 2.68rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 20px;
`;
const QS_CONFIG = getQSConfig('access', {
  page: 1,
  page_size: 5,
  order_by: 'first_name',
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

const ActionItemsDiv = styled.div`
  height: 0px;
  & a{
    float: right;
    top: -110px;
  }
  & button{
    float: right;
    top: -110px;
    background: #61c7b9 !important;
  }
`;
const TableContainer = styled.div``;
function ResourceAccessList({ i18n, apiModel, resource, controls }) {
  const [deletionRecord, setDeletionRecord] = useState(null);
  const [deletionRole, setDeletionRole] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const location = useLocation();
  let currentAccessRecord = {};
  const {
    result: { accessRecords, itemCount, relatedSearchableKeys, searchableKeys },
    error: contentError,
    isLoading,
    request: fetchAccessRecords,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const [response, actionsResponse] = await Promise.all([
        apiModel.readAccessList(resource.id, params),
        apiModel.readAccessOptions(resource.id),
      ]);
      return {
        accessRecords: response.data.results,
        itemCount: response.data.count,
        relatedSearchableKeys: (
          actionsResponse?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(
          actionsResponse.data.actions?.GET || {}
        ).filter(key => actionsResponse.data.actions?.GET[key].filterable),
      };
    }, [apiModel, location, resource.id]),
    {
      accessRecords: [],
      itemCount: 0,
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  useEffect(() => {
    fetchAccessRecords();
  }, [fetchAccessRecords]);

  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteRole,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      if (typeof deletionRole.team_id !== 'undefined') {
        return TeamsAPI.disassociateRole(deletionRole.team_id, deletionRole.id);
      }
      return UsersAPI.disassociateRole(deletionRecord.id, deletionRole.id);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [deletionRole]),
    {
      qsConfig: QS_CONFIG,
      fetchItems: fetchAccessRecords,
    }
  );

const getRoleLists = (accessRecord) => {
    const teamRoles = [];
    const userRoles = [];
    currentAccessRecord = accessRecord;
    function sort(item) {
      const { role } = item;
      if (role.team_id) {
        teamRoles.push(role);
      } else {
        userRoles.push(role);
      }
    }
    accessRecord.summary_fields.direct_access.map(sort);
    accessRecord.summary_fields.indirect_access.map(sort);
    return [teamRoles, userRoles];
  }

const onRoleDelete= (role, record) => {
  setDeletionRecord(record);
  setDeletionRole(role);
  setShowDeleteModal(true);
}

const renderChip = (role) => {
    return (
      <Chip
        key={role.id}
        onClick={() => {
          onRoleDelete(role, currentAccessRecord);
        }}
        isReadOnly={!role.user_capabilities.unattach}
      >
        {role.name}
      </Chip>
    );
  }
  return (
    <>
    <MainContainer>
      <MainContainerHead>Admin</MainContainerHead>
      <ActionItemsDiv>
        <ToolbarAddButton
          key="add"
          onClick={() => setShowAddModal(true)}
        />
      </ActionItemsDiv>
      <TableContainer><Table contentError={contentError}
        hasContentLoading={isLoading || isDeleteLoading}
        items={accessRecords}
        itemCount={itemCount}
        qsConfig={QS_CONFIG}
        canSelectAll={false}
        selectable={false}
        columns={[
          'NAME',
          'ROLE'
        ]}
        canSelectAll={false}
        rows={accessRecords && accessRecords.map(accessRecord => {
          const [teamRoles, userRoles] = getRoleLists(accessRecord);
          return {
            cells: [
              <div>
                {accessRecord.username && (
                  <TextContent>
                    {accessRecord.id ? (
                      <Text component={TextVariants.h6}>
                        <Link
                          to={{ pathname: `/users/${accessRecord.id}/details` }}
                          css="font-weight: bold"
                        >
                          {accessRecord.username}
                        </Link>
                      </Text>
                    ) : (
                      <Text component={TextVariants.h6} css="font-weight: bold">
                        {accessRecord.username}
                      </Text>
                    )}
                  </TextContent>
                )}
                {accessRecord.first_name || accessRecord.last_name ? (
                  <DetailList stacked>
                    <Detail
                      label={i18n._(t`Name`)}
                      value={`${accessRecord.first_name} ${accessRecord.last_name}`}
                    />
                  </DetailList>
                ) : null}
              </div>,
              <div>
                 <DetailList stacked>
                  {userRoles.length > 0 && (
                    <Detail
                      label={i18n._(t`User Roles`)}
                      value={
                        <ChipGroup numChips={5} totalChips={userRoles.length}>
                          {userRoles.map(renderChip)}
                        </ChipGroup>
                      }
                    />
                  )}
                  {teamRoles.length > 0 && (
                    <Detail
                      label={i18n._(t`Team Roles`)}
                      value={
                        <ChipGroup numChips={5} totalChips={teamRoles.length}>
                          {teamRoles.map(renderChip)}
                        </ChipGroup>
                      }
                    />
                  )}
                </DetailList>
              </div>],
            selected: accessRecord.selected,
            id: accessRecord.id,
            type: accessRecord.type,
            summary_fields: accessRecord.summary_fields,
          }
        })
        }
        controls={<>
        </>
        }
      /></TableContainer>
      </MainContainer>
      {showAddModal && (
        <AddResourceRole
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchAccessRecords();
          }}
          roles={resource.summary_fields.object_roles}
        />
      )}
      {showDeleteModal && (
        <DeleteRoleConfirmationModal
          role={deletionRole}
          username={deletionRecord.username}
          onCancel={() => {
            setDeletionRecord(null);
            setDeletionRole(null);
            setShowDeleteModal(false);
          }}
          onConfirm={async () => {
            await deleteRole();
            setShowDeleteModal(false);
            setDeletionRecord(null);
            setDeletionRole(null);
          }}
        />
      )}
      {deletionError && (
        <AlertModal
          isOpen={deletionError}
          variant="error"
          title={i18n._(t`Error!`)}
          onClose={clearDeletionError}
        >
          {i18n._(t`Failed to delete role`)}
        </AlertModal>
      )}      
      <Loader loading={isLoading} />
    </>
  );
}
export default withI18n()(ResourceAccessList);
