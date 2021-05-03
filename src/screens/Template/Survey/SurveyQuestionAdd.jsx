import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { CardBody } from '../../../components/Card';
import SurveyQuestionForm from './SurveyQuestionForm';
import { Card, CardTitle as OrchestrationCardTilte } from '@patternfly/react-core';
import styled from 'styled-components';

const CardTitle = styled(OrchestrationCardTilte)`
  font-size: 1.25rem;
  padding-bottom: 0 !important;
`;

export default function SurveyQuestionAdd({ survey, updateSurvey }) {
  const [formError, setFormError] = useState(null);
  const history = useHistory();
  const match = useRouteMatch();

  const handleSubmit = async question => {
    try {
      if (survey.spec?.some(q => q.variable === question.variable)) {
        setFormError(
          new Error(
            `Survey already contains a question with variable named “${question.variable}”`
          )
        );
        return;
      }
      if (question.type === 'multiselect') {
        question.default = question.default
          .split('\n')
          .filter(v => v !== '' || '\n')
          .map(v => v.trim())
          .join('\n');
      }
      const newSpec = survey.spec ? survey.spec.concat(question) : [question];
      await updateSurvey(newSpec);
      history.push(match.url.replace('/add', ''));
    } catch (err) {
      setFormError(err);
    }
  };

  const handleCancel = () => {
    history.push(match.url.replace('/add', ''));
  };

  return (
    <Card>
    <CardTitle>Create New Survey</CardTitle>
    <CardBody>
      <SurveyQuestionForm
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        submitError={formError}
      />
    </CardBody>
    </Card>
  );
}
