import React, { useCallback } from 'react';
import { Formik, useField, useFormikContext } from 'formik';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { func, number, shape } from 'prop-types';

import { Form as OrchestrationForm } from '@patternfly/react-core';
import { VariablesField } from '../../../components/CodeMirrorInput';
import FormField, { FormSubmitError } from '../../../components/FormField';
import FormActionGroup from '../../../components/FormActionGroup';
import { required } from '../../../util/validators';
import InstanceGroupsLookup from '../../../components/Lookup/InstanceGroupsLookup';
import OrganizationLookup from '../../../components/Lookup/OrganizationLookup';
import CredentialLookup from '../../../components/Lookup/CredentialLookup';
import {
  FormColumnLayout,
  FormFullWidthLayout,
} from '../../../components/FormLayout';
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

function InventoryFormFields({ i18n, credentialTypeId, inventory }) {
  const { setFieldValue } = useFormikContext();
  const [organizationField, organizationMeta, organizationHelpers] = useField({
    name: 'organization',
    validate: required(i18n._(t`Select a value for this field`), i18n),
  });
  const [instanceGroupsField, , instanceGroupsHelpers] = useField(
    'instanceGroups'
  );
  const [insightsCredentialField] = useField('insights_credential');
  const onOrganizationChange = useCallback(
    value => {
      setFieldValue('organization', value);
    },
    [setFieldValue]
  );
  const onCredentialChange = useCallback(
    value => {
      setFieldValue('insights_credential', value);
    },
    [setFieldValue]
  );

  return (
    <>
      <FormField
        id="inventory-name"
        label={i18n._(t`Name`)}
        name="name"
        type="text"
        validate={required(null, i18n)}
        isRequired
      />
      <FormField
        id="inventory-description"
        label={i18n._(t`Description`)}
        name="description"
        type="text"
      />
      <OrganizationLookup
        helperTextInvalid={organizationMeta.error}
        isValid={!organizationMeta.touched || !organizationMeta.error}
        onBlur={() => organizationHelpers.setTouched()}
        onChange={onOrganizationChange}
        value={organizationField.value}
        touched={organizationMeta.touched}
        error={organizationMeta.error}
        required
        autoPopulate={!inventory?.id}
      />
      <CredentialLookup
        label={i18n._(t`Insights Credential`)}
        credentialTypeId={credentialTypeId}
        onChange={onCredentialChange}
        value={insightsCredentialField.value}
      />
      <InstanceGroupsLookup
        value={instanceGroupsField.value}
        onChange={value => {
          instanceGroupsHelpers.setValue(value);
        }}
      />
      <FormFullWidthLayout>
        <VariablesField
          tooltip={i18n._(
            t`Enter inventory variables using either JSON or YAML syntax. Use the radio button to toggle between the two. Refer to the Ansible Tower documentation for example syntax`
          )}
          id="inventory-variables"
          name="variables"
          label={i18n._(t`Variables`)}
        />
      </FormFullWidthLayout>
    </>
  );
}

function InventoryForm({
  inventory = {},
  onSubmit,
  onCancel,
  submitError,
  instanceGroups,
  ...rest
}) {
  const initialValues = {
    name: inventory.name || '',
    description: inventory.description || '',
    variables: inventory.variables || '---',
    organization:
      (inventory.summary_fields && inventory.summary_fields.organization) ||
      null,
    instanceGroups: instanceGroups || [],
    insights_credential:
      (inventory.summary_fields &&
        inventory.summary_fields.insights_credential) ||
      null,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        onSubmit(values);
      }}
    >
      {formik => (
        <Form autoComplete="off" onSubmit={formik.handleSubmit}>
          <FormColumnLayout>
            <InventoryFormFields {...rest} inventory={inventory} />
          </FormColumnLayout>
          <ClosingDivArticle />
          <FormActionDiv>
            <FormSubmitError error={submitError} />
            <FormActionGroup
              onCancel={onCancel}
              onSubmit={formik.handleSubmit}
            />
          </FormActionDiv>
        </Form>
      )}
    </Formik>
  );
}

InventoryForm.proptype = {
  handleSubmit: func.isRequired,
  handleCancel: func.isRequired,
  instanceGroups: shape(),
  inventory: shape(),
  credentialTypeId: number.isRequired,
  submitError: shape(),
};

InventoryForm.defaultProps = {
  inventory: {},
  instanceGroups: [],
  submitError: null,
};

export default withI18n()(InventoryForm);
