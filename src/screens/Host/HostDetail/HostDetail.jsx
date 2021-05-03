import 'styled-components/macro';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Button } from '@patternfly/react-core';
import { Host } from '../../../types';
import { CardBody, CardActionsRow } from '../../../components/Card';
import AlertModal from '../../../components/AlertModal';
import ErrorDetail from '../../../components/ErrorDetail';
import {
  DetailList,
  Detail,
  UserDateDetail,
} from '../../../components/DetailList';
import { VariablesDetail } from '../../../components/CodeMirrorInput';
import Sparkline from '../../../components/Sparkline';
import DeleteButton from '../../../components/DeleteButton';
import { HostsAPI } from '../../../api';
import HostToggle from '../../../components/HostToggle';
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

function HostDetail({ i18n, host }) {
  const {
    created,
    description,
    id,
    modified,
    name,
    variables,
    summary_fields: {
      inventory,
      recent_jobs,
      created_by,
      modified_by,
      user_capabilities,
    },
  } = host;

  const [isLoading, setIsloading] = useState(false);
  const [deletionError, setDeletionError] = useState(false);
  const history = useHistory();

  const handleHostDelete = async () => {
    setIsloading(true);
    try {
      await HostsAPI.destroy(id);
      history.push('/hosts');
    } catch (err) {
      setDeletionError(err);
    } finally {
      setIsloading(false);
    }
  };

  if (!isLoading && deletionError) {
    return (
      <AlertModal
        isOpen={deletionError}
        variant="error"
        title={i18n._(t`Error!`)}
        onClose={() => setDeletionError(false)}
      >
        {i18n._(t`Failed to delete ${name}.`)}
        <ErrorDetail error={deletionError} />
      </AlertModal>
    );
  }

  const recentPlaybookJobs = recent_jobs.map(job => ({ ...job, type: 'job' }));
  return (
    <CardBodySection>
    <CardBody>
      <HostToggle host={host} css="padding-bottom: 40px" />
      <DetailList gutter="sm">
        <Detail label={i18n._(t`Name`)} value={name} dataCy="host-name" />
        {recentPlaybookJobs?.length > 0 && (
          <Detail
            label={i18n._(t`Activity`)}
            value={<Sparkline jobs={recentPlaybookJobs} />}
          />
        )}
        <Detail label={i18n._(t`Description`)} value={description} />
        <Detail
          label={i18n._(t`Inventory`)}
          dataCy="host-inventory"
          value={
            <Link to={`/inventories/inventory/${inventory.id}/details`}>
              {inventory.name}
            </Link>
          }
        />
        <UserDateDetail
          date={created}
          label={i18n._(t`Created`)}
          user={created_by}
          dataCy="host-created-by"
        />
        <UserDateDetail
          date={modified}
          label={i18n._(t`Last Modified`)}
          user={modified_by}
          dataCy="host-last-modified-by"
        />
        <VariablesDetail
          label={i18n._(t`Variables`)}
          rows={4}
          value={variables}
        />
      </DetailList>
      <ClosingDivArticle />
      <FormActionDiv>
      <CardActionsRow>
        {user_capabilities?.edit && (
          <Button
            aria-label={i18n._(t`edit`)}
            component={Link}
            to={`/hosts/${id}/edit`}
          >
            {i18n._(t`Edit`)}
          </Button>
        )}
        {user_capabilities?.delete && (
          <DeleteButton
            onConfirm={() => handleHostDelete()}
            modalTitle={i18n._(t`Delete Host`)}
            name={name}
          >
          {i18n._(t`Delete`)}
          </DeleteButton>
        )}
      </CardActionsRow>
      </FormActionDiv>
      {deletionError && (
        <AlertModal
          isOpen={deletionError}
          variant="error"
          title={i18n._(t`Error!`)}
          onClose={() => setDeletionError(null)}
        >
          {i18n._(t`Failed to delete host.`)}
          <ErrorDetail error={deletionError} />
        </AlertModal>
      )}
    </CardBody>
    </CardBodySection>
  );
}

HostDetail.propTypes = {
  host: Host.isRequired,
};

export default withI18n()(HostDetail);
