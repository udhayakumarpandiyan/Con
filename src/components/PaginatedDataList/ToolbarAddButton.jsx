import React from 'react';
import { string, func } from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, DropdownItem as PFDropDownItem, Tooltip } from '@patternfly/react-core';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { useKebabifiedMenu } from '../../contexts/Kebabified';
import styled from 'styled-components';


const DropdownItem  = styled(PFDropDownItem)`
&:hover{
  background: #E7DFFE;
}
`;

const AddButton = styled(Button)`
width: 100px;
height: 37px;
background: #593CAB !important;
color: #FFF !important;
border-radius: 0px !important;
font-size: 16px;
margin: 0px 10px;
&:disabled{
  opacity: 0.5;
}
`;


function ToolbarAddButton({
  linkTo,
  onClick,
  i18n,
  isDisabled,
  defaultLabel = i18n._(t`Add`),
  showToggleIndicator,
}) {
  const { isKebabified } = useKebabifiedMenu();

  if (!linkTo && !onClick) {
    throw new Error(
      'ToolbarAddButton requires either `linkTo` or `onClick` prop'
    );
  }

  if (isKebabified) {
    return (
      <DropdownItem
        key="add"
        isDisabled={isDisabled}
        component={linkTo ? Link : 'button'}
        to={linkTo}
        onClick={!onClick ? undefined : onClick}
      >
        {defaultLabel}
      </DropdownItem>
    );
  }
  if (linkTo) {
    return (
      <Tooltip content={defaultLabel} position="top">
        <AddButton
          isDisabled={isDisabled}
          component={Link}
          to={linkTo}
          variant="secondary"
          aria-label={defaultLabel}
        >
          {defaultLabel}
        </AddButton>
      </Tooltip>
    );
  }
  return (
    <AddButton
      icon={showToggleIndicator ? <CaretDownIcon /> : null}
      iconPosition={showToggleIndicator ? 'right' : null}
      variant="secondary"
      aria-label={defaultLabel}
      onClick={onClick}

    >
      {defaultLabel}
    </AddButton>
  );
}
ToolbarAddButton.propTypes = {
  linkTo: string,
  onClick: func,
};
ToolbarAddButton.defaultProps = {
  linkTo: null,
  onClick: null,
};

export default withI18n()(ToolbarAddButton);
