import React, { useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Button, Chip } from '@patternfly/react-core';
import AlertModal from '../../../components/AlertModal';
import { CardBody, CardActionsRow } from '../../../components/Card';
import {
  DetailList,
  Detail,
  UserDateDetail,
} from '../../../components/DetailList';
import { VariablesDetail } from '../../../components/CodeMirrorInput';
import DeleteButton from '../../../components/DeleteButton';
import ErrorDetail from '../../../components/ErrorDetail';
import ContentError from '../../../components/ContentError';
import ContentLoading from '../../../components/ContentLoading';
import ChipGroup from '../../../components/ChipGroup';
import { InventoriesAPI } from '../../../api';
import useRequest, { useDismissableError } from '../../../util/useRequest';
import { Inventory } from '../../../types';
import styled from 'styled-components';

const CardBodySection = styled(CardBody)`
  padding: 0 0;
  .pf-m-secondary{
      padding: 6px 16px;
      background: #ffffff;
      width: 7.68rem;
      height: 2.37rem;
    }
    .pf-m-primary{
      background: #593CAB ;
      width: 7.68rem;
      height: 2.37rem;
    }
`;
const ClosingDivArticle = styled.div`
  border-bottom: solid 0.5px #d2d2d2;
  border-radius: 5px;
  margin: 20px -25px;
  height: 6.25rem;
`;
const FormActionDiv = styled.div`
  background: #f0f0f0;
  margin: -20px -26px -27px -26px;
  padding: 20px 0px;
`;

function InventoryDetail({ inventory, i18n }) {
  const history = useHistory();

  const {
    result: instanceGroups,
    isLoading,
    error: instanceGroupsError,
    request: fetchInstanceGroups,
  } = useRequest(
    useCallback(async () => {
      const { data } = await InventoriesAPI.readInstanceGroups(inventory.id);
      return data.results;
    }, [inventory.id]),
    []
  );

  useEffect(() => {
    fetchInstanceGroups();
  }, [fetchInstanceGroups]);

  const { request: deleteInventory, error: deleteError } = useRequest(
    useCallback(async () => {
      await InventoriesAPI.destroy(inventory.id);
      history.push(`/inventories`);
    }, [inventory.id, history])
  );

  const { error, dismissError } = useDismissableError(deleteError);

  const {
    organization,
    user_capabilities: userCapabilities,
  } = inventory.summary_fields;

  if (isLoading) {
    return <ContentLoading />;
  }

  if (instanceGroupsError) {
    return <ContentError error={instanceGroupsError} />;
  }

  return (
    <CardBodySection>
    <CardBody>
      <DetailList>
        <Detail
          label={i18n._(t`Name`)}
          value={inventory.name}
          dataCy="inventory-detail-name"
        />
        <Detail label={i18n._(t`Description`)} value={inventory.description} />
        <Detail label={i18n._(t`Type`)} value={i18n._(t`Inventory`)} />
        <Detail
          label={i18n._(t`Organization`)}
          value={
            <Link to={`/organizations/${organization.id}/details`}>
              {organization.name}
            </Link>
          }
        />
        {instanceGroups && instanceGroups.length > 0 && (
          <Detail
            fullWidth
            label={i18n._(t`Instance Groups`)}
            value={
              <ChipGroup numChips={5} totalChips={instanceGroups.length}>
                {instanceGroups.map(ig => (
                  <Chip key={ig.id} isReadOnly>
                    {ig.name}
                  </Chip>
                ))}
              </ChipGroup>
            }
          />
        )}
        <VariablesDetail
          label={i18n._(t`Variables`)}
          value={inventory.variables}
          rows={4}
        />
        <UserDateDetail
          label={i18n._(t`Created`)}
          date={inventory.created}
          user={inventory.summary_fields.created_by}
        />
        <UserDateDetail
          label={i18n._(t`Last Modified`)}
          date={inventory.modified}
          user={inventory.summary_fields.modified_by}
        />
      </DetailList>
      <ClosingDivArticle />
      <FormActionDiv><CardActionsRow>
        {userCapabilities.edit && (
          <Button
            component={Link}
            to={`/inventories/inventory/${inventory.id}/edit`}
          >
            {i18n._(t`Edit`)}
          </Button>
        )}
        {userCapabilities.delete && (
          <DeleteButton
            name={inventory.name}
            modalTitle={i18n._(t`Delete Inventory`)}
            onConfirm={deleteInventory}
          >
            {i18n._(t`Delete`)}
          </DeleteButton>
        )}
      </CardActionsRow></FormActionDiv>
      {/* Update delete modal to show dependencies https://github.com/ansible/awx/issues/5546 */}
      {error && (
        <AlertModal
          isOpen={error}
          variant="error"
          title={i18n._(t`Error!`)}
          onClose={dismissError}
        >
          {i18n._(t`Failed to delete inventory.`)}
          <ErrorDetail error={error} />
        </AlertModal>
      )}
    </CardBody>
    </CardBodySection>
  );
}
InventoryDetail.propTypes = {
  inventory: Inventory.isRequired,
};

export default withI18n()(InventoryDetail);
