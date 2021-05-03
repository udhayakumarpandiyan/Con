import React, { Fragment, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Button, Modal as OrchestrationModal } from '@patternfly/react-core';
import OptionsList from '../OptionsList';
import useRequest from '../../util/useRequest';
import { getQSConfig, parseQueryString } from '../../util/qs';
import useSelected from '../../util/useSelected';
import styled from 'styled-components';

const Modal = styled(OrchestrationModal)`
  & footer{
    display: flex;
    justify-content: center;
  }
  & header{
    background: #593CAB 0% 0% no-repeat padding-box;
    margin: 0px 0px !important;
    padding-bottom: 8px;
    color: #ffffff;
    height: 3.875rem;
    padding-top: 1rem;
  }
  & .pf-c-button.pf-m-plain{
    color: #ffffff !important;
    top: 0.85rem;
    outline: none;
  }
  & .pf-c-title.pf-m-2xl{
    font-size: 1.25rem;
  }
`;

const QS_CONFIG = (order_by = 'name') => {
  return getQSConfig('associate', {
    page: 1,
    page_size: 5,
    order_by,
  });
};

function AssociateModal({
  i18n,
  header = i18n._(t`Items`),
  title = i18n._(t`Select Items`),
  onClose,
  onAssociate,
  fetchRequest,
  optionsRequest,
  isModalOpen = false,
  displayKey = 'name',
}) {
  const history = useHistory();
  const { selected, handleSelect } = useSelected([]);

  const {
    request: fetchItems,
    result: { items, itemCount, relatedSearchableKeys, searchableKeys },
    error: contentError,
    isLoading,
  } = useRequest(
    useCallback(async () => {
      const params = parseQueryString(
        QS_CONFIG(displayKey),
        history.location.search
      );
      const [
        {
          data: { count, results },
        },
        actionsResponse,
      ] = await Promise.all([fetchRequest(params), optionsRequest()]);

      return {
        items: results,
        itemCount: count,
        relatedSearchableKeys: (
          actionsResponse?.data?.related_search_fields || []
        ).map(val => val.slice(0, -8)),
        searchableKeys: Object.keys(
          actionsResponse.data.actions?.GET || {}
        ).filter(key => actionsResponse.data.actions?.GET[key].filterable),
      };
    }, [fetchRequest, optionsRequest, history.location.search, displayKey]),
    {
      items: [],
      itemCount: 0,
      relatedSearchableKeys: [],
      searchableKeys: [],
    }
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const clearQSParams = () => {
    const parts = history.location.search.replace(/^\?/, '').split('&');
    const { namespace } = QS_CONFIG(displayKey);
    const otherParts = parts.filter(
      param => !param.startsWith(`${namespace}.`)
    );
    history.replace(`${history.location.pathname}?${otherParts.join('&')}`);
  };

  const handleSave = async () => {
    await onAssociate(selected);
    clearQSParams();
    onClose();
  };

  const handleClose = () => {
    clearQSParams();
    onClose();
  };

  return (
    <Fragment>
      <Modal
        variant="large"
        title={title}
        aria-label={i18n._(t`Association modal`)}
        isOpen={isModalOpen}
        onClose={handleClose}
        actions={[
          <Button
            aria-label={i18n._(t`Save`)}
            key="select"
            variant="primary"
            onClick={handleSave}
            isDisabled={selected.length === 0}
          >
            {i18n._(t`Save`)}
          </Button>,
          <Button
            aria-label={i18n._(t`Cancel`)}
            key="cancel"
            variant="secondary"
            onClick={handleClose}
          >
            {i18n._(t`Cancel`)}
          </Button>,
        ]}
      >
        <OptionsList
          displayKey={displayKey}
          contentError={contentError}
          deselectItem={handleSelect}
          header={header}
          isLoading={isLoading}
          multiple
          optionCount={itemCount}
          options={items}
          qsConfig={QS_CONFIG(displayKey)}
          readOnly={false}
          selectItem={handleSelect}
          value={selected}
          searchColumns={[
            {
              name: i18n._(t`Name`),
              key: `${displayKey}__icontains`,
              isDefault: true,
            },
            {
              name: i18n._(t`Created By (Username)`),
              key: 'created_by__username__icontains',
            },
            {
              name: i18n._(t`Modified By (Username)`),
              key: 'modified_by__username__icontains',
            },
          ]}
          sortColumns={[
            {
              name: i18n._(t`Name`),
              key: `${displayKey}`,
            },
          ]}
          searchableKeys={searchableKeys}
          relatedSearchableKeys={relatedSearchableKeys}
        />
      </Modal>
    </Fragment>
  );
}

export default withI18n()(AssociateModal);
