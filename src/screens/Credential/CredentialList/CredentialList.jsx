import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Button, Card, PageSection, Tooltip } from '@patternfly/react-core';
import {
  sortable
} from '@patternfly/react-table';
import { CredentialsAPI } from '../../../api';
import AlertModal from '../../../components/AlertModal';
import ErrorDetail from '../../../components/ErrorDetail';
import {
  ToolbarAddButton,
  ToolbarDeleteButton,
} from '../../../components/PaginatedDataList';
import useRequest, { useDeleteItems } from '../../../util/useRequest';
import { getQSConfig, parseQueryString } from '../../../util/qs';
import Table from '../../../components/Table/Table';
import styled from 'styled-components';
import SearchBox from '../../../components/SearchBox';
import { FilterIcon, EditIcon } from '../../../constants/Icons';
import { timeOfDay } from '../../../util/dates';
import CopyButton from '../../../components/CopyButton';
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
const Icon = styled.img`
 margin-right: 10px;
`;

const Type = styled.label``;

const QS_CONFIG = getQSConfig('credential', {
  page: 1,
  page_size: 20,
  order_by: 'name',
});

function CredentialList({ i18n }) {
  const [selected, setSelected] = useState([]);
  const location = useLocation();

  const [isDisabled, setIsDisabled] = useState(false);

  let canEdit;
  let credential;

  const {
    result: { credentials, credentialCount, actions },
    error: contentError,
    isLoading,
    request: fetchCredentials,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(QS_CONFIG, location.search);
      const [creds, credActions] = await Promise.all([
        CredentialsAPI.read(params),
        CredentialsAPI.readOptions(),
      ]);
      return {
        credentials: creds.data.results,
        credentialCount: creds.data.count,
        actions: credActions.data.actions,
      };
    }, [location]),
    {
      credentials: [],
      credentialCount: 0,
      actions: {},
    }
  );


  const copyCredential = useCallback(async (value) => {
    credential = value;
    await CredentialsAPI.copy(credential.id, {
      name: `${credential.name} @ ${timeOfDay()}`,
    });
    await fetchCredentials();
  }, [fetchCredentials]);

  const handleCopyStart = useCallback(() => {
    setIsDisabled(true);
  }, []);

  const handleCopyFinish = useCallback(() => {
    setIsDisabled(false);
  }, []);





  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const isAllSelected =
    selected.length > 0 && selected.length === credentials.length;
  const {
    isLoading: isDeleteLoading,
    deleteItems: deleteCredentials,
    deletionError,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(() => {
      return Promise.all(selected.map(({ id }) => CredentialsAPI.destroy(id)));
    }, [selected]),
    {
      qsConfig: QS_CONFIG,
      allItemsSelected: isAllSelected,
      fetchItems: fetchCredentials,
    }
  );

  const handleDelete = async () => {
    await deleteCredentials();
    setSelected([]);
  };

  const handleSelectAll = isSelected => {
    credentials.forEach(credential => {
      credential.selected = isSelected;
    })
    setSelected(isSelected ? [...credentials] : []);
  };

  const setSelectedItems = (item, isSelected) => {
    credentials.forEach(credential => {
      if (credential.id === item.id) {
        credential.selected = isSelected;
        item = credential;
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
    if (event.target.nodeName === "INPUT" || event.target.nodeName === "BUTTON" || event.target.nodeName === "path" || event.target.nodeName === "LABEL" || event.target.nodeName === "IMG") {
      event.stopPropagation();
    }
    else {
      item.selected = !item.selected;
      setSelectedItems(item, item.selected);
    }
  };



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
          items={credentials}
          itemCount={credentialCount}
          qsConfig={QS_CONFIG}
          onDelete={handleDelete}
          columns={[
            { title: 'NAME', transforms: [sortable] },
            'CREDENTIAL TYPE',
            'ACTIONS'
          ]}
          rows={credentials && credentials.map(credential => {
            canEdit = credential.summary_fields.user_capabilities.edit;
            return {
              cells: [
                <span style={{ color: '#1362A8', fontSize: "16px", fontWeight: "600" }}>
                  <Link to={`credentials/${credential.id}/details`}>
                    <Type>
                      {credential.name}
                    </Type>
                  </Link>
                </span>,
                <label>
                  {
                    credential.type
                  }
                </label>,
                <div>
                  {canEdit && (
                    <Tooltip content={i18n._(t`Edit Credential`)} position="top">
                      <Button
                        isDisabled={isDisabled}
                        aria-label={i18n._(t`Edit Credential`)}
                        variant="plain"
                        component={Link}
                        to={`/credentials/${credential.id}/edit`}
                      >
                        <Icon src={EditIcon} alt="" />
                      </Button>
                    </Tooltip>
                  )}
                  {credential.summary_fields.user_capabilities.copy && (
                    <CopyButton
                      isDisabled={isDisabled}
                      onCopyStart={handleCopyStart}
                      onCopyFinish={handleCopyFinish}
                      copyItem={() => copyCredential(credential)}
                      helperText={{
                        tooltip: i18n._(t`Copy Credential`),
                        errorMessage: i18n._(t`Failed to copy credential.`),
                      }}
                    />
                  )}
                </div>],
              selected: credential.selected,
              id: credential.id,
              type: credential.type,
              summary_fields: credential.summary_fields,
            }
          })
          }
          controls={<>

            <SearchBox />
            <ToolbarDeleteButton
              key="delete"
              onDelete={handleDelete}
              itemsToDelete={selected}
              pluralizedItemName="Jobs"
            />
            {canAdd
              ? [<ToolbarAddButton key="add" linkTo="/credentials/add" />]
              : []
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

export default withI18n()(CredentialList);
