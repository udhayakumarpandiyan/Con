import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { ActionGroup as OrchestrationActionGroup, Button } from '@patternfly/react-core';
import { FormFullWidthLayout } from '../FormLayout';
import styled from 'styled-components';

const FormActionGroup = ({ onCancel, onSubmit, submitDisabled, i18n }) => {
  const OrchestrationPrimaryButton = {
    width: "7.65rem",
    height: "2.37rem",
    background: "#593CAB 0% 0% no-repeat padding-box",
  }
  const OrchestrationSecondaryButton = {
    width: "7.65rem",
    height: "2.37rem",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    color: "#000000",
  }
  const OrchestrationSecondaryButtonDiv = styled.div`
    .pf-m-secondary{
      --pf-c-button--after--BorderColor: #7D7F7D;
      --pf-c-button--m-secondary--hover--after--BorderColor: #593CAB;
    }
  `;
  const ActionGroup = styled(OrchestrationActionGroup)`
    display: flex;
    justify-content: center;
  `;
  return (
    <FormFullWidthLayout>
      <ActionGroup>
        <OrchestrationSecondaryButtonDiv><Button
          aria-label={i18n._(t`Cancel`)}
          variant="secondary"
          type="button"
          onClick={onCancel}
          style={OrchestrationSecondaryButton}
        >
          {i18n._(t`Cancel`)}
        </Button></OrchestrationSecondaryButtonDiv>
        <Button
          aria-label={i18n._(t`Save`)}
          variant="primary"
          type="button"
          onClick={onSubmit}
          isDisabled={submitDisabled}
          style={OrchestrationPrimaryButton}
        >
          {i18n._(t`Save`)}
        </Button>        
      </ActionGroup>
    </FormFullWidthLayout>
  );
};

FormActionGroup.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitDisabled: PropTypes.bool,
};

FormActionGroup.defaultProps = {
  submitDisabled: false,
};

export default withI18n()(FormActionGroup);
