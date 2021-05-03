import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, useField, useFormikContext } from 'formik';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Form as OrchestrationForm, FormGroup } from '@patternfly/react-core';

import { OrganizationsAPI } from '../../../api';
import { ConfigContext, useConfig } from '../../../contexts/Config';
import AnsibleSelect from '../../../components/AnsibleSelect';
import ContentError from '../../../components/ContentError';
import ContentLoading from '../../../components/ContentLoading';
import FormField, { FormSubmitError } from '../../../components/FormField';
import FormActionGroup from '../../../components/FormActionGroup/FormActionGroup';
import { InstanceGroupsLookup } from '../../../components/Lookup';
import { getAddedAndRemoved } from '../../../util/lists';
import { required, minMaxValue } from '../../../util/validators';
import { FormColumnLayout } from '../../../components/FormLayout';
import CredentialLookup from '../../../components/Lookup/CredentialLookup';
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

function OrganizationFormFields({ i18n, instanceGroups, setInstanceGroups }) {
  const { setFieldValue } = useFormikContext();
  const [venvField] = useField('custom_virtualenv');
  const { license_info = {}, me = {} } = useConfig();

  const [
    galaxyCredentialsField,
    galaxyCredentialsMeta,
    galaxyCredentialsHelpers,
  ] = useField('galaxy_credentials');

  const defaultVenv = {
    label: i18n._(t`Use Default Ansible Environment`),
    value: '/venv/ansible/',
    key: 'default',
  };
  const { custom_virtualenvs } = useContext(ConfigContext);

  const handleCredentialUpdate = useCallback(
    value => {
      setFieldValue('galaxy_credentials', value);
    },
    [setFieldValue]
  );

  return (
    <>
      <FormField
        id="org-name"
        name="name"
        type="text"
        label={i18n._(t`Name`)}
        validate={required(null, i18n)}
        isRequired
      />
      <FormField
        id="org-description"
        name="description"
        type="text"
        label={i18n._(t`Description`)}
      />
      {license_info?.license_type !== 'open' && (
        <FormField
          id="org-max_hosts"
          name="max_hosts"
          type="number"
          label={i18n._(t`Max Hosts`)}
          tooltip={i18n._(
            t`The maximum number of hosts allowed to be managed by this organization.
            Value defaults to 0 which means no limit. Refer to the Ansible
            documentation for more details.`
          )}
          validate={minMaxValue(0, Number.MAX_SAFE_INTEGER, i18n)}
          me={me}
          isDisabled={!me.is_superuser}
        />
      )}

      {custom_virtualenvs && custom_virtualenvs.length > 1 && (
        <FormGroup
          fieldId="org-custom-virtualenv"
          label={i18n._(t`Ansible Environment`)}
        >
          <AnsibleSelect
            id="org-custom-virtualenv"
            data={[
              defaultVenv,
              ...custom_virtualenvs
                .filter(value => value !== defaultVenv.value)
                .map(value => ({ value, label: value, key: value })),
            ]}
            {...venvField}
          />
        </FormGroup>
      )}
      <InstanceGroupsLookup
        value={instanceGroups}
        onChange={setInstanceGroups}
        tooltip={i18n._(
          t`Select the Instance Groups for this Organization to run on.`
        )}
      />
      <CredentialLookup
        credentialTypeNamespace="galaxy_api_token"
        label={i18n._(t`Galaxy Credentials`)}
        helperTextInvalid={galaxyCredentialsMeta.error}
        isValid={!galaxyCredentialsMeta.touched || !galaxyCredentialsMeta.error}
        onBlur={() => galaxyCredentialsHelpers.setTouched()}
        onChange={handleCredentialUpdate}
        value={galaxyCredentialsField.value}
        multiple
      />
    </>
  );
}

function OrganizationForm({
  organization,
  onCancel,
  onSubmit,
  submitError,
  ...rest
}) {
  const [contentError, setContentError] = useState(null);
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const [initialInstanceGroups, setInitialInstanceGroups] = useState([]);
  const [instanceGroups, setInstanceGroups] = useState([]);

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = values => {
    const { added, removed } = getAddedAndRemoved(
      initialInstanceGroups,
      instanceGroups
    );
    const addedIds = added.map(({ id }) => id);
    const removedIds = removed.map(({ id }) => id);
    if (
      typeof values.max_hosts !== 'number' ||
      values.max_hosts === 'undefined'
    ) {
      values.max_hosts = 0;
    }
    onSubmit(values, addedIds, removedIds);
  };

  useEffect(() => {
    (async () => {
      const { id } = organization;
      if (!id) {
        setHasContentLoading(false);
        return;
      }
      setContentError(null);
      setHasContentLoading(true);
      try {
        const {
          data: { results = [] },
        } = await OrganizationsAPI.readInstanceGroups(id);
        setInitialInstanceGroups(results);
        setInstanceGroups(results);
      } catch (error) {
        setContentError(error);
      } finally {
        setHasContentLoading(false);
      }
    })();
  }, [organization]);

  if (contentError) {
    return <ContentError error={contentError} />;
  }

  if (hasContentLoading) {
    return <ContentLoading />;
  }

  return (
    <Formik
      initialValues={{
        name: organization.name,
        description: organization.description,
        custom_virtualenv: organization.custom_virtualenv || '',
        max_hosts: organization.max_hosts || '0',
        galaxy_credentials: organization.galaxy_credentials || [],
      }}
      onSubmit={handleSubmit}
    >
      {formik => (
        <Form autoComplete="off" onSubmit={formik.handleSubmit}>
          <FormColumnLayout>
            <OrganizationFormFields
              instanceGroups={instanceGroups}
              setInstanceGroups={setInstanceGroups}
              {...rest}
            />
          </FormColumnLayout>
          <ClosingDivArticle />
          <FormSubmitError error={submitError} />
          <FormActionDiv><FormActionGroup
            onCancel={handleCancel}
            onSubmit={formik.handleSubmit}
          /></FormActionDiv>
        </Form>
      )}
    </Formik>
  );
}

OrganizationForm.propTypes = {
  organization: PropTypes.shape(),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitError: PropTypes.shape(),
};

OrganizationForm.defaultProps = {
  organization: {
    name: '',
    description: '',
    max_hosts: '0',
    custom_virtualenv: '',
  },
  submitError: null,
};

OrganizationForm.contextTypes = {
  custom_virtualenvs: PropTypes.arrayOf(PropTypes.string),
};

export { OrganizationForm as _OrganizationForm };
export default withI18n()(OrganizationForm);
