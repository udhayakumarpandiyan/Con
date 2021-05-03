import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  mountWithContexts,
  waitForElement,
} from '../../../../testUtils/enzymeHelpers';
import { IntegrationsAPI } from '../../../api';
import Integration from './Integration';

jest.mock('../../../api/models/Integrations');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  history: () => ({
    location: '/integrations',
  }),
  useParams: () => ({ id: 1 }),
}));
const options = {
  data: {
    actions: {
      GET: {
        client_type: {
          choices: [
            ['confidential', 'Confidential'],
            ['public', 'Public'],
          ],
        },
        authorization_grant_type: {
          choices: [
            ['authorization-code', 'Authorization code'],
            ['password', 'Resource owner password-based'],
          ],
        },
      },
    },
  },
};
const integration = {
  id: 1,
  name: 'Foo',
  summary_fields: {
    organization: { name: 'Org 1', id: 10 },
    user_capabilities: { edit: true, delete: true },
  },
  url: '',
  organization: 10,
};
describe('<Integration />', () => {
  let wrapper;
  test('mounts properly', async () => {
    IntegrationsAPI.readOptions.mockResolvedValue(options);
    IntegrationsAPI.readDetail.mockResolvedValue(integration);
    await act(async () => {
      wrapper = mountWithContexts(<Integration setBreadcrumb={() => {}} />);
    });
    expect(wrapper.find('Integration').length).toBe(1);
    expect(IntegrationsAPI.readOptions).toBeCalled();
    expect(IntegrationsAPI.readDetail).toBeCalledWith(1);
  });
  test('should throw error', async () => {
    IntegrationsAPI.readOptions.mockResolvedValue(options);
    IntegrationsAPI.readDetail.mockRejectedValue(
      new Error({
        response: {
          config: {
            method: 'get',
            url: '/api/v2/integrations/1',
          },
          data: 'An error occurred',
          status: 404,
        },
      })
    );
    await act(async () => {
      wrapper = mountWithContexts(<Integration setBreadcrumb={() => {}} />);
    });
    await waitForElement(wrapper, 'ContentError', el => el.length > 0);
    expect(wrapper.find('ContentError').length).toBe(1);
    expect(wrapper.find('IntegrationAdd').length).toBe(0);
    expect(wrapper.find('IntegrationDetails').length).toBe(0);
    expect(wrapper.find('Integration').length).toBe(1);
    expect(IntegrationsAPI.readOptions).toBeCalled();
    expect(IntegrationsAPI.readDetail).toBeCalledWith(1);
  });
});
