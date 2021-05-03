import React, { useContext, useEffect, useState } from 'react';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { arrayOf, func } from 'prop-types';
import { Button, DropdownItem, Tooltip } from '@patternfly/react-core';
import { KebabifiedContext } from '../../contexts/Kebabified';
import AlertModal from '../AlertModal';
import { Job } from '../../types';
import styled from 'styled-components';

const CancelButton = styled(Button)`
 margin: 0px 10px;
 background: #593CAB!important;
 color: #FFF !important;
 border-radius: 0px !important;
 &:disabled{
   opacity: 0.5;
 }

`;
function cannotCancel(job) {
  return !job.summary_fields.user_capabilities.start;
}

function JobListCancelButton({ i18n, jobsToCancel, onCancel }) {
  const { isKebabified, onKebabModalChange } = useContext(KebabifiedContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const numJobsToCancel = jobsToCancel.length;
  const zeroOrOneJobSelected = numJobsToCancel < 2;

  const handleCancelJob = () => {
    onCancel();
    toggleModal();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (isKebabified) {
      onKebabModalChange(isModalOpen);
    }
  }, [isKebabified, isModalOpen, onKebabModalChange]);

  const renderTooltip = () => {
    const jobsUnableToCancel = jobsToCancel
      .filter(cannotCancel)
      .map(job => job.name);
    const numJobsUnableToCancel = jobsUnableToCancel.length;
    if (numJobsUnableToCancel > 0) {
      return (
        <div>
          {
            numJobsUnableToCancel === 1 ? 'You do not have permission to cancel the following job' : 'You do not have permission to cancel the following jobs'
          }
        </div>
      );
    }
    if (numJobsToCancel > 0) {
      return numJobsToCancel === 1 ? 'Cancel selected job' : 'Cancel selected jobs'
      

    }
    return i18n._(t`Select a job to cancel`);
  };

  const isDisabled =
    jobsToCancel.length === 0 || jobsToCancel.some(cannotCancel);

  const cancelJobText = !isDisabled && jobsToCancel.length > 1 ? 'Cancel Jobs': 'Cancel Job';
   

  return (
    <>
      {isKebabified ? (
        <DropdownItem
          key="cancel-job"
          isDisabled={isDisabled}
          component="button"
          onClick={toggleModal}
        >
          {cancelJobText}
        </DropdownItem>
      ) : (
        <Tooltip content={renderTooltip()} position="top">
          <div>
            <CancelButton
              variant="secondary"
              aria-label={cancelJobText}
              onClick={toggleModal}
              isDisabled={isDisabled}
            >
              {cancelJobText}
            </CancelButton>
          </div>
        </Tooltip>
      )}
      {isModalOpen && (
        <AlertModal
          variant="danger"
          title={cancelJobText}
          isOpen={isModalOpen}
          onClose={toggleModal}
          actions={[
            <Button
              id="cancel-job-confirm-button"
              key="delete"
              variant="danger"
              aria-label={cancelJobText}
              onClick={handleCancelJob}
            >
              {cancelJobText}
            </Button>,
            <Button
              id="cancel-job-return-button"
              key="cancel"
              variant="secondary"
              aria-label={i18n._(t`Return`)}
              onClick={toggleModal}
            >
              {i18n._(t`Return`)}
            </Button>,
          ]}
        >
          <div>
            {i18n._(
              '{numJobsToCancel, plural, one {This action will cancel the following job:} other {This action will cancel the following jobs:}}',
              {
                numJobsToCancel,
              }
            )}
          </div>
          {jobsToCancel.map(job => (
            <span key={job.id}>
              <strong>{job.name}</strong>
              <br />
            </span>
          ))}
        </AlertModal>
      )}
    </>
  );
}

JobListCancelButton.propTypes = {
  jobsToCancel: arrayOf(Job),
  onCancel: func,
};

JobListCancelButton.defaultProps = {
  jobsToCancel: [],
  onCancel: () => { },
};

export default withI18n()(JobListCancelButton);
