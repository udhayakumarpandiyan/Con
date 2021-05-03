import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Formik } from 'formik';
import styled from 'styled-components';
import {
  Button, LoginForm,
  LoginMainFooterLinksItem,
  LoginPage as PFLoginPage,
  Tooltip
} from '@patternfly/react-core';
import {
  AzureIcon,
  GoogleIcon,
  GithubIcon,
  UserCircleIcon,
} from '@patternfly/react-icons';
import useRequest, { useDismissableError } from '../../util/useRequest';
import { AuthAPI, RootAPI } from '../../api';
import AlertModal from '../../components/AlertModal';
import ErrorDetail from '../../components/ErrorDetail';
import { LoginScreenIcon, LoginLogoIcon } from '../../constants/Icons';
import './index.css';
import Loader from '../../components/Loader';

const LoginPage = styled(PFLoginPage)`
  width: 100%;
`;

const Container = styled.div`
position: fixed;
width: 100%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`;

const LoginContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: 40px;
width: 498px;
z-index: 10;

`;

const LogoContainer = styled.div`
display: flex;
height: 140px;
justify-content: center;
align-items: center;
background: #593CAB;
border-top-left-radius: 20px;
border-top-right-radius: 20px;
border: 2px solid #FFFFFF;
`;

const BackgroundImage = styled.img`
width: 100%;
height: 100%;
position: absolute;
top: 0px;
left: 0px;
z-index: 0;
`;

const ForgotPasswordLabel = styled.button`
border: none;
background: transparent;
text-align: left;
margin-top: 20px;
font-size: 14px;
color: #0943A7;
outline: none;
&:hover{
  color: #6809a7;
  text-decoration: underline;
}

`;
const SSOButton = styled(Button)`
box-shadow: 0px 5px 22px #0000001A;
background: #FFFFFF !important;
border: 1px solid #484848 !important;
color: #484848 !important;
margin-top: 20px;
`;

function AWXLogin({ i18n, isAuthenticated }) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    isLoading: isCustomLoginInfoLoading,
    error: customLoginInfoError,
    request: fetchCustomLoginInfo,
    result: { brandName, loginInfo, socialAuthOptions },
  } = useRequest(
    useCallback(async () => {
      const [
        {
          data: { custom_login_info },
        },
        {
          data: { BRAND_NAME },
        },
        { data: authData },
      ] = await Promise.all([RootAPI.read(),
      RootAPI.readAssetVariables(),
      AuthAPI.read(),]);
      return {
        brandName: BRAND_NAME,
        loginInfo: custom_login_info,
        socialAuthOptions: authData
      };
    }, []),
    { brandName: null, loginInfo: null, authData: {} }
  );

  const {
    error: loginInfoError,
    dismissError: dismissLoginInfoError,
  } = useDismissableError(customLoginInfoError);

  useEffect(() => {
    fetchCustomLoginInfo();
  }, [fetchCustomLoginInfo]);

  const {
    isLoading: isAuthenticating,
    error: authenticationError,
    request: authenticate,
  } = useRequest(
    useCallback(async ({ username, password }) => {
      await RootAPI.login(username, password);
      setIsLoading(false);
    }, [])
  );

  const {
    error: authError,
    dismissError: dismissAuthError,
  } = useDismissableError(authenticationError);

  const onSSOLogin = () => {
    let url = `https://idpdemo.concierto.in/samldevidp/saml2/idp/SSOService.php?spentityid=https://orchestrationsandbox.concierto.in:8043&RelayState=conciertoAuth`;
    window.location.replace(url);
  }

  const handleSubmit = async values => {
    dismissAuthError();
    setIsLoading(true);
    await authenticate(values);
    // need to call conciertio login;

  };

  if (isCustomLoginInfoLoading) {
    return null;
  }

  // if (isAuthenticated(document.cookie)) {
  //   return <Redirect to="/" />;
  // }

  let helperText;
  if (authError?.response?.status === 401) {
    helperText = i18n._(t`Invalid username or password. Please try again.`);
  } else {
    helperText = i18n._(t`There was a problem signing in. Please try again.`);
  }

  if (isLoading && authError) {
    setIsLoading(false);
  }
  return (
    <Container className="login-container">

      <BackgroundImage src={LoginScreenIcon} alt="" />

      <LoginContainer>
        <LogoContainer>
          <img src={LoginLogoIcon} />
        </LogoContainer>
        <LoginPage
          loginTitle={
            brandName
              ? i18n._(t`Login`)
              : ''
          }
          textContent={loginInfo}
          socialMediaLoginContent={
            <>
              {socialAuthOptions &&
                Object.keys(socialAuthOptions).map(authKey => {
                  const loginUrl = socialAuthOptions[authKey].login_url;
                  if (authKey === 'azuread-oauth2') {
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip content={i18n._(t`Sign in with Azure AD`)}>
                          <AzureIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }
                  if (authKey === 'github') {
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip content={i18n._(t`Sign in with GitHub`)}>
                          <GithubIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }
                  if (authKey === 'github-org') {
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip
                          content={i18n._(t`Sign in with GitHub Organizations`)}
                        >
                          <GithubIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }
                  if (authKey === 'github-team') {
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip content={i18n._(t`Sign in with GitHub Teams`)}>
                          <GithubIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }
                  if (authKey === 'github-enterprise') {
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip
                          content={i18n._(t`Sign in with GitHub Enterprise`)}
                        >
                          <GithubIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }
                  if (authKey === 'github-enterprise-org') {
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip
                          content={i18n._(
                            t`Sign in with GitHub Enterprise Organizations`
                          )}
                        >
                          <GithubIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }
                  if (authKey === 'github-enterprise-team') {
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip
                          content={i18n._(t`Sign in with GitHub Enterprise Teams`)}
                        >
                          <GithubIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }
                  if (authKey === 'google-oauth2') {
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip content={i18n._(t`Sign in with Google`)}>
                          <GoogleIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }
                  if (authKey.startsWith('saml')) {
                    const samlIDP = authKey.split(':')[1] || null;
                    return (
                      <LoginMainFooterLinksItem href={loginUrl} key={authKey}>
                        <Tooltip
                          content={
                            samlIDP
                              ? i18n._(t`Sign in with SAML ${samlIDP}`)
                              : i18n._(t`Sign in with SAML`)
                          }
                        >
                          <UserCircleIcon />
                        </Tooltip>
                      </LoginMainFooterLinksItem>
                    );
                  }

                  return null;
                })}
            </>
          }
        >
          <Formik
            initialValues={{
              password: '',
              username: '',
            }}
            onSubmit={handleSubmit}
          >
            {formik => (
              <>
                <LoginForm
                  className={authError ? 'pf-m-error' : ''}
                  helperText={helperText}
                  isLoginButtonDisabled={isAuthenticating}
                  isValidPassword={!authError}
                  isValidUsername={!authError}
                  onChangePassword={val => {
                    formik.setFieldValue('password', val);
                    dismissAuthError();
                  }}
                  onChangeUsername={val => {
                    formik.setFieldValue('username', val);
                    dismissAuthError();
                  }}
                  onLoginButtonClick={formik.handleSubmit}
                  passwordLabel={i18n._(t`Password`)}
                  passwordValue={formik.values.password}
                  showHelperText={authError}
                  usernameLabel={i18n._(t`Username`)}
                  usernameValue={formik.values.username}
                />
                <SSOButton onClick={onSSOLogin}>SSO</SSOButton>
                {/* <ForgotPasswordLabel> Forgot your password ?</ForgotPasswordLabel> */}
              </>
            )}
          </Formik>
          {loginInfoError && (
            <AlertModal
              isOpen={loginInfoError}
              variant="error"
              title={i18n._(t`Error!`)}
              onClose={dismissLoginInfoError}
            >
              {i18n._(
                t`Failed to fetch custom login configuration settings.  System defaults will be shown instead.`
              )}
              <ErrorDetail error={loginInfoError} />
            </AlertModal>
          )}
        </LoginPage>
        <Loader loading={isLoading} />
      </LoginContainer>
    </Container >
  );
}

export default withI18n()(withRouter(AWXLogin));
export { AWXLogin as _AWXLogin };
