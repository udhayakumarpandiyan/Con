import React, { useState } from 'react';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Button as PFButton} from '@patternfly/react-core';
import AlertModal from '../AlertModal';
import styled from 'styled-components';
import DeleteIcon from '../../assets/icons/delete.svg';

const  TrashButton = styled(PFButton)`
 padding: 0px 8px;
 outline: none;
 &:hover{
   filter: invert(1);
 }
`;

const  Button = styled(PFButton)`
 outline: none;
`;

const Icon = styled.img`
 width: fit-content;
`;
const DeleteButtonDiv = styled.div`
  display: inline-flex;
  
  & > .pf-c-button{
    color: #000000;
  }
  & > .pf-c-button::after{
      border: 0.5px solid #7D7F7D;
    }
`;
function DeleteButton({
  onConfirm,
  modalTitle,
  name,
  i18n,
  variant,
  children,
  isDisabled,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <DeleteButtonDiv>
      <TrashButton
        variant={variant || 'secondary'}
        aria-label={i18n._(t`Delete`)}
        isDisabled={isDisabled}
        onClick={() => setIsOpen(true)}
      >
        {children || <Icon src={DeleteIcon} alt="" />}
      </TrashButton></DeleteButtonDiv>
      <AlertModal
        isOpen={isOpen}
        title={modalTitle}
        variant="danger"
        onClose={() => setIsOpen(false)}
        actions={[
          <Button
            key="delete"
            variant="danger"
            aria-label={i18n._(t`Delete`)}
            isDisabled={isDisabled}
            onClick={onConfirm}
          >
            {i18n._(t`Delete`)}
          </Button>,
          <Button
            key="cancel"
            variant="secondary"
            aria-label={i18n._(t`Cancel`)}
            onClick={() => setIsOpen(false)}
          >
            {i18n._(t`Cancel`)}
          </Button>,
        ]}
      >
        {i18n._(t`Are you sure you want to delete:`)}
        <br />
        <strong>{name}</strong>
      </AlertModal>
    </>
  );
}

export default withI18n()(DeleteButton);
