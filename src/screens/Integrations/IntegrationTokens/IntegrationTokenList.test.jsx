import React from 'react';
import { act } from 'react-dom/test-utils';

import {
  mountWithContexts,
  waitForElement,
} from '../../../../testUtils/enzymeHelpers';
import { IntegrationsAPI, TokensAPI } from '../../../api';
import IntegrationTokenList from './IntegrationTokenList';

jest.mock('../../../api/models/Integrations');
jest.mock('../../../api/models/Tokens');

const tokens = {
  data: {
    results: [
      {
        id: 2,
        type: 'o_auth2_access_token',
        url: '/api/v2/tokens/2/',
        related: {
          user: '/api/v2/users/1/',
          integration: '/api/v2/integrations/3/',
          activity_stream: '/api/v2/tokens/2/activity_stream/',
        },
        summary_fields: {
          user: {
            id: 1,
            username: 'admin',
            first_name: '',
            last_name: '',
          },
          integration: {
            id: 3,
            name: 'hg',
          },
        },
        created: '2020-06-23T19:56:38.422053Z',
        modified: '2020-06-23T19:56:38.441353Z',
        description: 'cdfsg',
        user: 1,
        token: '************',
        refresh_token: '************',
        integration: 3,
        expires: '3019-10-25T19:56:38.395635Z',
        scope: 'read',
      },
      {
        id: 3,
        type: 'o_auth2_access_token',
        url: '/api/v2/tokens/3/',
        related: {
          user: '/api/v2/users/1/',
          integration: '/api/v2/integrations/3/',
          activity_stream: '/api/v2/tokens/3/activity_stream/',
        },
        summary_fields: {
          user: {
            id: 1,
            username: 'admin',
            first_name: '',
            last_name: '',
          },
          integration: {
            id: 3,
            name: 'hg',
          },
        },
        created: '2020-06-23T19:56:50.536169Z',
        modified: '2020-06-23T19:56:50.549521Z',
        description: 'fgds',
        user: 1,
        token: '************',
        refresh_token: '************',
        integration: 3,
        expires: '3019-10-25T19:56:50.529306Z',
        scope: 'write',
      },
    ],
    count: 2,
  },
};
describe('<IntegrationTokenList/>', () => {
  let wrapper;

  beforeEach(() => {
    IntegrationsAPI.readTokenOptions.mockResolvedValue({
      data: {
        actions: {
          GET: {},
          POST: {},
        },
        related_search_fields: [],
      },
    });
  });

  test('should mount properly', async () => {
    IntegrationsAPI.readTokens.mockResolvedValue(tokens);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationTokenList />);
    });
    await waitForElement(wrapper, 'IntegrationTokenList', el => el.length > 0);
  });
  test('should have data fetched and render 2 rows', async () => {
    IntegrationsAPI.readTokens.mockResolvedValue(tokens);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationTokenList />);
    });
    await waitForElement(wrapper, 'IntegrationTokenList', el => el.length > 0);
    expect(wrapper.find('IntegrationTokenListItem').length).toBe(2);
    expect(IntegrationsAPI.readTokens).toBeCalled();
  });

  test('should delete item successfully', async () => {
    IntegrationsAPI.readTokens.mockResolvedValue(tokens);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationTokenList />);
    });
    waitForElement(wrapper, 'IntegrationTokenList', el => el.length > 0);

    wrapper
      .find('input#select-token-2')
      .simulate('change', tokens.data.results[0]);

    wrapper.update();

    expect(wrapper.find('input#select-token-2').prop('checked')).toBe(true);
    await act(async () =>
      wrapper.find('Button[aria-label="Delete"]').prop('onClick')()
    );

    wrapper.update();

    await act(async () =>
      wrapper.find('Button[aria-label="confirm delete"]').prop('onClick')()
    );
    expect(TokensAPI.destroy).toBeCalledWith(tokens.data.results[0].id);
  });

  test('should throw content error', async () => {
    IntegrationsAPI.readTokens.mockRejectedValue(
      new Error({
        response: {
          config: {
            method: 'get',
            url: '/api/v2/integrations/',
          },
          data: 'An error occurred',
        },
      })
    );
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationTokenList />);
    });

    await waitForElement(wrapper, 'IntegrationTokenList', el => el.length > 0);
    expect(wrapper.find('ContentError').length).toBe(1);
  });

  test('should render deletion error modal', async () => {
    TokensAPI.destroy.mockRejectedValue(
      new Error({
        response: {
          config: {
            method: 'delete',
            url: '/api/v2/tokens/',
          },
          data: 'An error occurred',
        },
      })
    );
    IntegrationsAPI.readTokens.mockResolvedValue(tokens);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationTokenList />);
    });
    waitForElement(wrapper, 'IntegrationTokenList', el => el.length > 0);

    wrapper.find('input#select-token-2').simulate('change', 'a');

    wrapper.update();

    expect(wrapper.find('input#select-token-2').prop('checked')).toBe(true);
    await act(async () =>
      wrapper.find('Button[aria-label="Delete"]').prop('onClick')()
    );

    wrapper.update();

    await act(async () =>
      wrapper.find('Button[aria-label="confirm delete"]').prop('onClick')()
    );
    wrapper.update();
    expect(wrapper.find('ErrorDetail').length).toBe(1);
  });

  test('should not render add button', async () => {
    IntegrationsAPI.readTokens.mockResolvedValue(tokens);

    await act(async () => {
      wrapper = mountWithContexts(<IntegrationTokenList />);
    });
    waitForElement(wrapper, 'IntegrationTokenList', el => el.length > 0);
    expect(wrapper.find('ToolbarAddButton').length).toBe(0);
  });
});
