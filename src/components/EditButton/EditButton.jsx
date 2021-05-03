import React from 'react';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Button as PFButton} from '@patternfly/react-core';
import styled from 'styled-components';
import EditIcon from '../../assets/icons/edit.svg';

const  Button = styled(PFButton)`
 padding: 0px 8px;
 outline: none;
 &:hover{
   filter: invert(1);
 }
`;

const Icon = styled.img`
 width: fit-content;
`;

function EditButton({
  i18n,
  variant,
  children,
  isDisabled,
}) {
  const  onEditClick = ()=>{
    //
  }

  return (
      <Button
        variant={variant || 'secondary'}
        aria-label={i18n._(t`Edit`)}
        isDisabled={isDisabled}
        onClick={onEditClick}
      >
        {children || <Icon src={EditIcon} alt="" />}
      </Button>
    
  );
}

export default withI18n()(EditButton);
