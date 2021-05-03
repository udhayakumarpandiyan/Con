import 'styled-components/macro';
import React from 'react';
import { Modal as OrchestrationModal, Title } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  TimesCircleIcon,
} from '@patternfly/react-icons';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  svg {
    margin-right: 16px;
  }
`;
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
function AlertModal({
  i18n,
  isOpen = null,
  title,
  label,
  variant,
  children,
  i18nHash,
  ...props
}) {
  const variantIcons = {
    danger: (
      <ExclamationCircleIcon
        size="lg"
        css="color: var(--pf-global--danger-color--100)"
      />
    ),
    error: (
      <TimesCircleIcon
        size="lg"
        css="color: var(--pf-global--danger-color--100)"
      />
    ),
    info: (
      <InfoCircleIcon
        size="lg"
        css="color: var(--pf-global--info-color--100)"
      />
    ),
    success: (
      <CheckCircleIcon
        size="lg"
        css="color: var(--pf-global--success-color--100)"
      />
    ),
    warning: (
      <ExclamationTriangleIcon
        size="lg"
        css="color: var(--pf-global--warning-color--100)"
      />
    ),
  };

  const customHeader = (
    <Header>
      {/*{variant ? variantIcons[variant] : null}*/}
      <Title id="alert-modal-header-label" size="2xl" headingLevel="h2">
        {title}
      </Title>
    </Header>
  );
  const customClose = (
    <div>showClose</div>
  );

  return (
    <Modal
      header={customHeader}
      aria-label={label || i18n._(t`Alert modal`)}
      aria-labelledby="alert-modal-header-label"
      isOpen={Boolean(isOpen)}
      variant="small"
      title={title}
      showClose={customClose}
      {...props}
    >
      {children}
    </Modal>
  );
}

export default withI18n()(AlertModal);
