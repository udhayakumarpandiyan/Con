import React, { useCallback } from 'react';
import { func, shape } from 'prop-types';
import { Formik, useField } from 'formik';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import {
  Button,
  Tooltip,
  Wizard as OrchestrationWizard,
  WizardContextConsumer,
  WizardFooter,
} from '@patternfly/react-core';
import CredentialsStep from './CredentialsStep';
import MetadataStep from './MetadataStep';
import { CredentialsAPI } from '../../../../../api';
import useRequest from '../../../../../util/useRequest';
import { CredentialPluginTestAlert } from '..';
import styled from 'styled-components';

const Wizard = styled(OrchestrationWizard)`
  .pf-c-toolbar__content {
    padding: 0 !important;
  }
  & .pf-c-wizard__header{
    height: 2.87rem;
    background: #593CAB 0% 0% no-repeat padding-box;
    padding: 10px 20px ;

    & .pf-c-wizard__title{    
      font-size: 1rem;
      font-weight: 600;
      color: #FFFFFF;
      text-transform: capitalize;
    }
    & .pf-c-wizard__close{
      top: 0px;
    }
  }  
  & .pf-c-wizard__footer{
    .pf-m-primary{
      width: 7.65rem;
      height: 2.37rem;
      background: #593CAB 0% 0% no-repeat padding-box;
      color: #ffffff;
      border: 0.5px solid #707070;
      border-radius: 5px;
    }
    & .pf-m-secondary{
      width: 7.65rem;
      height: 2.37rem;
      background: #ffffff 0% 0% no-repeat padding-box;
      color: #000000;
      border-radius: 5px;

      --pf-c-button--after--BorderColor: none;
    }
    & .pf-m-link{
      width: 7.65rem;
      height: 2.37rem;
      background: #ffffff 0% 0% no-repeat padding-box;
      color: #000000;
      border: 0.5px solid #707070;
      border-radius: 5px;
    }
  }
`;

function CredentialPluginWizard({ i18n, handleSubmit, onClose }) {
  const [selectedCredential] = useField('credential');
  const [inputValues] = useField('inputs');

  const {
    result: testPluginSuccess,
    error: testPluginError,
    request: testPluginMetadata,
  } = useRequest(
    useCallback(
      async () =>
        CredentialsAPI.test(selectedCredential.value.id, {
          metadata: inputValues.value,
        }),
      [selectedCredential, inputValues]
    ),
    null
  );

  const steps = [
    {
      id: 1,
      name: i18n._(t`Credential`),
      key: 'credential',
      component: <CredentialsStep />,
      enableNext: !!selectedCredential.value,
    },
    {
      id: 2,
      name: i18n._(t`Metadata`),
      key: 'metadata',
      component: <MetadataStep />,
      canJumpTo: !!selectedCredential.value,
    },
  ];

  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack }) => (
          <>
            <Button
              id="credential-plugin-prompt-next"
              variant="primary"
              onClick={onNext}
              isDisabled={!selectedCredential.value}
            >
              {activeStep.key === 'metadata' ? i18n._(t`OK`) : i18n._(t`Next`)}
            </Button>
            {activeStep && activeStep.key === 'metadata' && (
              <>
                <Tooltip
                  content={i18n._(
                    t`Click this button to verify connection to the secret management system using the selected credential and specified inputs.`
                  )}
                  position="right"
                >
                  <Button
                    id="credential-plugin-prompt-test"
                    variant="secondary"
                    onClick={() => testPluginMetadata()}
                  >
                    {i18n._(t`Test`)}
                  </Button>
                </Tooltip>

                <Button
                  id="credential-plugin-prompt-back"
                  variant="secondary"
                  onClick={onBack}
                >
                  {i18n._(t`Back`)}
                </Button>
              </>
            )}
            <Button
              id="credential-plugin-prompt-cancel"
              variant="link"
              onClick={onClose}
            >
              {i18n._(t`Cancel`)}
            </Button>
          </>
        )}
      </WizardContextConsumer>
    </WizardFooter>
  );

  return (
    <>
      <Wizard
        isOpen
        onClose={onClose}
        title={i18n._(t`External Secret Management System`)}
        steps={steps}
        onSave={handleSubmit}
        footer={CustomFooter}
      />
      {selectedCredential.value && (
        <CredentialPluginTestAlert
          credentialName={selectedCredential.value.name}
          successResponse={testPluginSuccess}
          errorResponse={testPluginError}
        />
      )}
    </>
  );
}

function CredentialPluginPrompt({ i18n, onClose, onSubmit, initialValues }) {
  return (
    <Formik
      initialValues={{
        credential: initialValues?.credential || null,
        inputs: initialValues?.inputs || {},
      }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <CredentialPluginWizard
          handleSubmit={handleSubmit}
          i18n={i18n}
          onClose={onClose}
        />
      )}
    </Formik>
  );
}

CredentialPluginPrompt.propTypes = {
  onClose: func.isRequired,
  onSubmit: func.isRequired,
  initialValues: shape({}),
};

CredentialPluginPrompt.defaultProps = {
  initialValues: {},
};

export default withI18n()(CredentialPluginPrompt);
