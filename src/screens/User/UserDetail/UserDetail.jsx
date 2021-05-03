import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

import { Button, Label } from '@patternfly/react-core';
import AlertModal from '../../../components/AlertModal';
import { CardBody, CardActionsRow } from '../../../components/Card';
import DeleteButton from '../../../components/DeleteButton';
import { DetailList, Detail } from '../../../components/DetailList';
import ErrorDetail from '../../../components/ErrorDetail';
import { formatDateString } from '../../../util/dates';
import { UsersAPI } from '../../../api';
import useRequest, { useDismissableError } from '../../../util/useRequest';
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

function UserDetail({ user, i18n }) {
  const {
    id,
    username,
    email,
    first_name,
    last_name,
    last_login,
    created,
    is_superuser,
    is_system_auditor,
    summary_fields,
  } = user;
  const history = useHistory();

  const { request: deleteUser, isLoading, error: deleteError } = useRequest(
    useCallback(async () => {
      await UsersAPI.destroy(id);
      history.push(`/users`);
    }, [id, history])
  );

  const { error, dismissError } = useDismissableError(deleteError);

  let user_type;
  if (is_superuser) {
    user_type = i18n._(t`System Administrator`);
  } else if (is_system_auditor) {
    user_type = i18n._(t`System Auditor`);
  } else {
    user_type = i18n._(t`Normal User`);
  }

  let userAuthType;
  if (user.ldap_dn) {
    userAuthType = i18n._(t`LDAP`);
  } else if (user.auth.length > 0) {
    userAuthType = i18n._(t`SOCIAL`);
  }

  return (
    <CardBodySection>
    <CardBody>
      <DetailList>
        <Detail
          label={i18n._(t`Username`)}
          value={username}
          dataCy="user-detail-username"
        />
        <Detail label={i18n._(t`Email`)} value={email} />
        <Detail label={i18n._(t`First Name`)} value={`${first_name}`} />
        <Detail label={i18n._(t`Last Name`)} value={`${last_name}`} />
        <Detail label={i18n._(t`User Type`)} value={`${user_type}`} />
        {userAuthType && (
          <Detail
            label={i18n._(t`Type`)}
            value={
              <Label aria-label={i18n._(t`login type`)}>{userAuthType}</Label>
            }
          />
        )}
        {last_login && (
          <Detail
            label={i18n._(t`Last Login`)}
            value={formatDateString(last_login)}
          />
        )}
        <Detail label={i18n._(t`Created`)} value={formatDateString(created)} />
      </DetailList>
      <ClosingDivArticle />
      <FormActionDiv>
      <CardActionsRow>
        {summary_fields.user_capabilities &&
          summary_fields.user_capabilities.edit && (
            <Button
              aria-label={i18n._(t`edit`)}
              component={Link}
              to={`/users/${id}/edit`}
            >
              {i18n._(t`Edit`)}
            </Button>
          )}
        {summary_fields.user_capabilities &&
          summary_fields.user_capabilities.delete && (
            <DeleteButton
              name={username}
              modalTitle={i18n._(t`Delete User`)}
              onConfirm={deleteUser}
              isDisabled={isLoading}
            >
              {i18n._(t`Delete`)}
            </DeleteButton>
          )}
      </CardActionsRow>
      </FormActionDiv>
      {error && (
        <AlertModal
          isOpen={error}
          variant="error"
          title={i18n._(t`Error!`)}
          onClose={dismissError}
        >
          {i18n._(t`Failed to delete user.`)}
          <ErrorDetail error={error} />
        </AlertModal>
      )}
    </CardBody>
    </CardBodySection>
  );
}

export default withI18n()(UserDetail);
