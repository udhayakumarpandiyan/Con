import React, { useState } from 'react';
import { bool, func, shape } from 'prop-types';
import { Formik, useField } from 'formik';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

import { Form as OrchestrationForm, FormGroup } from '@patternfly/react-core';
import FormField, { FormSubmitError } from '../FormField';
import FormActionGroup from '../FormActionGroup/FormActionGroup';
import { VariablesField } from '../CodeMirrorInput';
import { InventoryLookup } from '../Lookup';
import { FormColumnLayout, FormFullWidthLayout } from '../FormLayout';
import Popover from '../Popover';
import { required } from '../../util/validators';
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
`;
const FormActionDiv = styled.div`
  display: flex;
  justify-content: center;
  background: #f0f0f0;
  margin: 0px -30px -26px -30px;
  padding-bottom: 20px;
`;

const InventoryLookupField = withI18n()(({ i18n, host }) => {
  const [inventory, setInventory] = useState(
    host ? host.summary_fields.inventory : ''
  );

  const [, inventoryMeta, inventoryHelpers] = useField({
    name: 'inventory',
    validate: required(i18n._(t`Select a value for this field`), i18n),
  });

  return (
    <FormGroup
      label={i18n._(t`Inventory`)}
      labelIcon={
        <Popover
          content={i18n._(
            t`Select the inventory that this host will belong to.`
          )}
        />
      }
      isRequired
      fieldId="inventory-lookup"
      validated={
        !inventoryMeta.touched || !inventoryMeta.error ? 'default' : 'error'
      }
      helperTextInvalid={inventoryMeta.error}
    >
      <InventoryLookup
        fieldId="inventory-lookup"
        value={inventory}
        onBlur={() => inventoryHelpers.setTouched()}
        tooltip={i18n._(t`Select the inventory that this host will belong to.`)}
        isValid={!inventoryMeta.touched || !inventoryMeta.error}
        helperTextInvalid={inventoryMeta.error}
        onChange={value => {
          inventoryHelpers.setValue(value.id);
          setInventory(value);
        }}
        required
        touched={inventoryMeta.touched}
        error={inventoryMeta.error}
      />
    </FormGroup>
  );
});

const HostForm = ({
  handleCancel,
  handleSubmit,
  host,
  isInventoryVisible,
  i18n,
  submitError,
}) => {
  return (
    <Formik
      initialValues={{
        name: host.name,
        description: host.description,
        inventory: host.inventory || '',
        variables: host.variables,
      }}
      onSubmit={handleSubmit}
    >
      {formik => (
        <Form autoComplete="off" onSubmit={formik.handleSubmit}>
          <FormColumnLayout>
            <FormField
              id="host-name"
              name="name"
              type="text"
              label={i18n._(t`Name`)}
              validate={required(null, i18n)}
              isRequired
            />
            <FormField
              id="host-description"
              name="description"
              type="text"
              label={i18n._(t`Description`)}
            />
            {isInventoryVisible && <InventoryLookupField host={host} />}
            <FormFullWidthLayout>
              <VariablesField
                id="host-variables"
                name="variables"
                label={i18n._(t`Variables`)}
              />
            </FormFullWidthLayout>
          </FormColumnLayout>
          <ClosingDivArticle />
            {submitError && <FormSubmitError error={submitError} />}
            <FormActionDiv><FormActionGroup
              onCancel={handleCancel}
              onSubmit={formik.handleSubmit}
            /></FormActionDiv>
        </Form>
      )}
    </Formik>
  );
};

HostForm.propTypes = {
  handleCancel: func.isRequired,
  handleSubmit: func.isRequired,
  host: shape({}),
  isInventoryVisible: bool,
  submitError: shape({}),
};

HostForm.defaultProps = {
  host: {
    name: '',
    description: '',
    inventory: undefined,
    variables: '---\n',
    summary_fields: {
      inventory: null,
    },
  },
  isInventoryVisible: true,
  submitError: null,
};

export { HostForm as _HostForm };
export default withI18n()(HostForm);
