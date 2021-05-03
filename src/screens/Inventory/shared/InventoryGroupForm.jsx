import React from 'react';
import { withI18n } from '@lingui/react';
import { Formik } from 'formik';
import { Form as OrchestrationForm, Card } from '@patternfly/react-core';
import { t } from '@lingui/macro';

import { CardBody } from '../../../components/Card';
import FormField, { FormSubmitError } from '../../../components/FormField';
import FormActionGroup from '../../../components/FormActionGroup/FormActionGroup';
import { VariablesField } from '../../../components/CodeMirrorInput';
import { required } from '../../../util/validators';
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
function InventoryGroupForm({
  i18n,
  error,
  group = {},
  handleSubmit,
  handleCancel,
}) {
  const initialValues = {
    name: group.name || '',
    description: group.description || '',
    variables: group.variables || '---',
  };

  return (
    <Card>
      <CardBody>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {formik => (
            <Form autoComplete="off" onSubmit={formik.handleSubmit}>
              <FormColumnLayout>
                <FormField
                  id="inventoryGroup-name"
                  name="name"
                  type="text"
                  label={i18n._(t`Name`)}
                  validate={required(null, i18n)}
                  isRequired
                />
                <FormField
                  id="inventoryGroup-description"
                  name="description"
                  type="text"
                  label={i18n._(t`Description`)}
                />
                <FormFullWidthLayout>
                  <VariablesField
                    id="host-variables"
                    name="variables"
                    label={i18n._(t`Variables`)}
                  />
                </FormFullWidthLayout>
              </FormColumnLayout>
                <ClosingDivArticle />
                <FormActionDiv><FormActionGroup
                  onCancel={handleCancel}
                  onSubmit={formik.handleSubmit}
                /></FormActionDiv>
                {error && <FormSubmitError error={error} />}
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
}

export default withI18n()(InventoryGroupForm);
