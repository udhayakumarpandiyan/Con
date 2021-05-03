import React, { useCallback, useState } from 'react';
import { Formik, useField, useFormikContext } from 'formik';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { arrayOf, func, object, shape } from 'prop-types';
import { ActionGroup, Button, Form as OrchestrationForm, FormGroup } from '@patternfly/react-core';
import FormField, { FormSubmitError } from '../../../components/FormField';
import {
  FormColumnLayout,
  FormFullWidthLayout,
} from '../../../components/FormLayout';
import AnsibleSelect from '../../../components/AnsibleSelect';
import { required } from '../../../util/validators';
import OrganizationLookup from '../../../components/Lookup/OrganizationLookup';
import TypeInputsSubForm from './TypeInputsSubForm';
import ExternalTestModal from './ExternalTestModal';
import styled from 'styled-components';

const Form = styled(OrchestrationForm)`
  .pf-c-form__label {
    font-size: 1rem;
    --pf-c-form__label--FontWeight: var(--pf-global--FontWeight--bold);
  }
  .pf-c-form-control{    
    --pf-global--BackgroundColor--100: #eeeeee;
    --pf-c-form-control--BorderBottomColor: #eeeeee;
  }
`;

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
  const ClosingDivArticle = styled.div`
  border-bottom: solid 0.5px #d2d2d2;
  margin: -24px -26px;
  border-radius: 5px;
  height: 6.25rem;
`;
const FormActionDiv = styled.div`
  display: flex;
  justify-content: center;
  background: #f0f0f0;
  margin: 0px -30px -26px -30px;
  padding-bottom: 20px;
`;
function CredentialFormFields({
  i18n,
  credentialTypes,
  formik,
  initialValues,
}) {
  const { setFieldValue } = useFormikContext();

  const [credTypeField, credTypeMeta, credTypeHelpers] = useField({
    name: 'credential_type',
    validate: required(i18n._(t`Select a value for this field`), i18n),
  });

  const isGalaxyCredential =
    !!credTypeField.value &&
    credentialTypes[credTypeField.value].kind === 'galaxy';

  const [orgField, orgMeta, orgHelpers] = useField({
    name: 'organization',
    validate:
      isGalaxyCredential &&
      required(
        i18n._(t`Galaxy credentials must be owned by an Organization.`),
        i18n
      ),
  });

  const credentialTypeOptions = Object.keys(credentialTypes)
    .map(key => {
      return {
        value: credentialTypes[key].id,
        key: credentialTypes[key].id,
        label: credentialTypes[key].name,
      };
    })
    .sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1));

  const resetSubFormFields = (newCredentialType, form) => {
    const fields = credentialTypes[newCredentialType].inputs.fields || [];
    fields.forEach(
      ({ ask_at_runtime, type, id, choices, default: defaultValue }) => {
        if (
          parseInt(newCredentialType, 10) === form.initialValues.credential_type
        ) {
          form.setFieldValue(`inputs.${id}`, initialValues.inputs[id]);
          if (ask_at_runtime) {
            form.setFieldValue(
              `passwordPrompts.${id}`,
              initialValues.passwordPrompts[id]
            );
          }
        } else {
          switch (type) {
            case 'string':
              form.setFieldValue(`inputs.${id}`, defaultValue || '');
              break;
            case 'boolean':
              form.setFieldValue(`inputs.${id}`, defaultValue || false);
              break;
            default:
              break;
          }

          if (choices) {
            form.setFieldValue(`inputs.${id}`, defaultValue);
          }

          if (ask_at_runtime) {
            form.setFieldValue(`passwordPrompts.${id}`, false);
          }
        }
        form.setFieldTouched(`inputs.${id}`, false);
      }
    );
  };

  const onOrganizationChange = useCallback(
    value => {
      setFieldValue('organization', value);
    },
    [setFieldValue]
  );

  return (
    <>
      <FormField
        id="credential-name"
        label={i18n._(t`Name`)}
        name="name"
        type="text"
        validate={required(null, i18n)}
        isRequired
      />
      <FormField
        id="credential-description"
        label={i18n._(t`Description`)}
        name="description"
        type="text"
      />
      <OrganizationLookup
        helperTextInvalid={orgMeta.error}
        isValid={!orgMeta.touched || !orgMeta.error}
        onBlur={() => orgHelpers.setTouched()}
        onChange={onOrganizationChange}
        value={orgField.value}
        touched={orgMeta.touched}
        error={orgMeta.error}
        required={isGalaxyCredential}
      />
      <FormGroup
        fieldId="credential-Type"
        helperTextInvalid={credTypeMeta.error}
        isRequired
        validated={
          !credTypeMeta.touched || !credTypeMeta.error ? 'default' : 'error'
        }
        label={i18n._(t`Credential Type`)}
      >
        <AnsibleSelect
          {...credTypeField}
          id="credential-type"
          data={[
            {
              value: '',
              key: '',
              label: i18n._(t`Choose a Credential Type`),
              isDisabled: true,
            },
            ...credentialTypeOptions,
          ]}
          onChange={(event, value) => {
            credTypeHelpers.setValue(value);
            resetSubFormFields(value, formik);
          }}
        />
      </FormGroup>
      {credTypeField.value !== undefined &&
        credTypeField.value !== '' &&
        credentialTypes[credTypeField.value]?.inputs?.fields && (
          <TypeInputsSubForm
            credentialType={credentialTypes[credTypeField.value]}
          />
        )}
    </>
  );
}

function CredentialForm({
  i18n,
  credential = {},
  credentialTypes,
  inputSources,
  onSubmit,
  onCancel,
  submitError,
  ...rest
}) {
  const [showExternalTestModal, setShowExternalTestModal] = useState(false);
  const initialValues = {
    name: credential.name || '',
    description: credential.description || '',
    organization: credential?.summary_fields?.organization || null,
    credential_type: credential.credential_type || '',
    inputs: {},
    passwordPrompts: {},
  };

  Object.values(credentialTypes).forEach(credentialType => {
    const fields = credentialType.inputs.fields || [];
    fields.forEach(
      ({ ask_at_runtime, type, id, choices, default: defaultValue }) => {
        if (credential?.inputs && credential.inputs[id]) {
          if (ask_at_runtime) {
            initialValues.passwordPrompts[id] =
              credential.inputs[id] === 'ASK' || false;
          }
          initialValues.inputs[id] = credential.inputs[id];
        } else {
          switch (type) {
            case 'string':
              initialValues.inputs[id] = defaultValue || '';
              break;
            case 'boolean':
              initialValues.inputs[id] = defaultValue || false;
              break;
            default:
              break;
          }

          if (choices) {
            initialValues.inputs[id] = defaultValue;
          }

          if (ask_at_runtime) {
            initialValues.passwordPrompts[id] = false;
          }
        }
      }
    );
  });

  Object.values(inputSources).forEach(inputSource => {
    initialValues.inputs[inputSource.input_field_name] = {
      credential: inputSource.summary_fields.source_credential,
      inputs: inputSource.metadata,
    };
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        onSubmit(values);
      }}
    >
      {formik => (
        <>
          <Form autoComplete="off" onSubmit={formik.handleSubmit}>
            <FormColumnLayout>
              <CredentialFormFields
                formik={formik}
                initialValues={initialValues}
                credentialTypes={credentialTypes}
                i18n={i18n}
                {...rest}
              />              
            </FormColumnLayout>
            <ClosingDivArticle />
            <FormSubmitError error={submitError} />
              <FormActionDiv>
                <ActionGroup>
                  {formik?.values?.credential_type &&
                    credentialTypes[formik.values.credential_type]?.kind ===
                      'external' && (
                      <OrchestrationSecondaryButtonDiv><Button
                        id="credential-form-test-button"
                        aria-label={i18n._(t`Test`)}
                        variant="secondary"
                        type="button"
                        onClick={() => setShowExternalTestModal(true)}
                        isDisabled={!formik.isValid}
                        style={OrchestrationSecondaryButton}
                      >
                        {i18n._(t`Test`)}
                      </Button></OrchestrationSecondaryButtonDiv>
                    )}
                  <OrchestrationSecondaryButtonDiv><Button
                    id="credential-form-cancel-button"
                    aria-label={i18n._(t`Cancel`)}
                    variant="secondary"
                    type="button"
                    onClick={onCancel}
                    style={OrchestrationSecondaryButton}
                  >
                    {i18n._(t`Cancel`)}
                  </Button></OrchestrationSecondaryButtonDiv>
                  <Button
                    id="credential-form-save-button"
                    aria-label={i18n._(t`Save`)}
                    variant="primary"
                    type="button"
                    onClick={formik.handleSubmit}
                    style={OrchestrationPrimaryButton}
                  >
                    {i18n._(t`Save`)}
                  </Button>
                </ActionGroup>
              </FormActionDiv>
          </Form>
          {showExternalTestModal && (
            <ExternalTestModal
              credential={credential}
              credentialType={credentialTypes[formik.values.credential_type]}
              credentialFormValues={formik.values}
              onClose={() => setShowExternalTestModal(false)}
            />
          )}
        </>
      )}
    </Formik>
  );
}

CredentialForm.proptype = {
  handleSubmit: func.isRequired,
  handleCancel: func.isRequired,
  credentialTypes: shape({}).isRequired,
  credential: shape({}),
  inputSources: arrayOf(object),
  submitError: shape({}),
};

CredentialForm.defaultProps = {
  credential: {},
  inputSources: [],
  submitError: null,
};

export default withI18n()(CredentialForm);
