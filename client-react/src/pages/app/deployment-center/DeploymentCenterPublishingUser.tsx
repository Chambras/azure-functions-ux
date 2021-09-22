import React, { useContext, useState } from 'react';
import { Field } from 'formik';
import {
  DeploymentCenterFtpsProps,
  DeploymentCenterFieldProps,
  DeploymentCenterContainerFormData,
  DeploymentCenterCodeFormData,
} from './DeploymentCenter.types';
import { ActionButton, Link, MessageBarType, ProgressIndicator } from 'office-ui-fabric-react';
import { useTranslation } from 'react-i18next';
import { additionalTextFieldControl, deploymentCenterContent } from './DeploymentCenter.styles';
import TextField from '../../../components/form-controls/TextField';
import { DeploymentCenterContext } from './DeploymentCenterContext';
import { DeploymentCenterPublishingContext } from './DeploymentCenterPublishingContext';
import CustomBanner from '../../../components/CustomBanner/CustomBanner';
import { learnMoreLinkStyle } from '../../../components/form-controls/formControl.override.styles';
import { DeploymentCenterLinks } from '../../../utils/FwLinks';
import TextFieldNoFormik from '../../../components/form-controls/TextFieldNoFormik';

type PasswordFieldType = 'password' | undefined;

const DeploymentCenterPublishingUser: React.FC<
  DeploymentCenterFtpsProps & DeploymentCenterFieldProps<DeploymentCenterContainerFormData | DeploymentCenterCodeFormData>
> = props => {
  const { t } = useTranslation();
  const { formProps } = props;
  const deploymentCenterContext = useContext(DeploymentCenterContext);
  const deploymentCenterPublishingContext = useContext(DeploymentCenterPublishingContext);
  const [providerPasswordType, setProviderPasswordType] = useState<PasswordFieldType>('password');
  const [providerConfirmPasswordType, setProviderConfirmPasswordType] = useState<PasswordFieldType>('password');
  const [textFieldPassword, setTextFieldPassword] = useState<string>('');
  const [textFieldConfirmPassword, setTextFieldConfirmPassword] = useState<string>('');

  const { publishingUser, publishingUserFetchFailedMessage } = deploymentCenterPublishingContext;

  const publishingUserLoading = !publishingUser && !publishingUserFetchFailedMessage;
  const publishingUserError = !publishingUser && publishingUserFetchFailedMessage;
  const webProviderUsername = publishingUser && publishingUser.properties.publishingUserName;

  const siteDescriptor = deploymentCenterContext && deploymentCenterContext.siteDescriptor;
  const sampleAppNameDomain =
    siteDescriptor && siteDescriptor.slot
      ? `${siteDescriptor.site}-${siteDescriptor.slot}`
      : siteDescriptor && siteDescriptor.site
      ? siteDescriptor.site
      : '';

  const sampleWebProviderDomainUsername = webProviderUsername
    ? `${sampleAppNameDomain}\\${webProviderUsername}`
    : `${sampleAppNameDomain}\\${t('deploymentCenterFtpsUserScopeSampleUsername')}`;

  const sampleWebProviderUsername = webProviderUsername ? webProviderUsername : t('deploymentCenterFtpsUserScopeSampleUsername');

  const toggleShowProviderPassword = () => {
    setProviderPasswordType(!providerPasswordType ? 'password' : undefined);
  };

  const toggleShowConfirmProviderPassword = () => {
    setProviderConfirmPasswordType(!providerConfirmPasswordType ? 'password' : undefined);
  };

  const changeTextFieldPassword = (e: any, newPassword: string) => {
    setTextFieldPassword(newPassword);
    formProps.setFieldValue('publishingPassword', newPassword);
  };

  const changeTextFieldConfirmPassword = (e: any, newConfirmPassword: string) => {
    setTextFieldConfirmPassword(newConfirmPassword);
    formProps.setFieldValue('publishingConfirmPassword', newConfirmPassword);
  };

  return (
    <div className={deploymentCenterContent}>
      <h3>{t('deploymentCenterFtpsUserScopeTitle')}</h3>
      <p>
        <span id="deployment-publishing-user-message">
          {t('deploymentCenterFtpsUserScopeDescription').format(sampleWebProviderDomainUsername, sampleWebProviderUsername)}
        </span>
        <Link
          id="deployment-center-settings-learnMore"
          href={DeploymentCenterLinks.publishingUserDocumentation}
          target="_blank"
          className={learnMoreLinkStyle}
          aria-labelledby="deployment-center-settings-message">
          {` ${t('learnMore')}`}
        </Link>
      </p>

      {publishingUserLoading && (
        <ProgressIndicator
          description={t('deploymentCenterPublishingUserLoadingMessage')}
          ariaValueText={t('deploymentCenterPublishingUserLoadingAriaLabel')}
        />
      )}

      {publishingUserError && (
        <CustomBanner id="publishing-user-fetch-failed-message" message={publishingUserFetchFailedMessage} type={MessageBarType.error} />
      )}

      {publishingUser && (
        <>
          <Field
            id="deployment-center-ftps-provider-username"
            name="publishingUsername"
            component={TextField}
            label={t('deploymentCenterFtpsUsernameLabel')}
          />

          <Field
            id="deployment-center-ftps-provider-password"
            name="publishingPassword"
            component={TextFieldNoFormik}
            label={t('deploymentCenterFtpsPasswordLabel')}
            value={textFieldPassword}
            onChange={changeTextFieldPassword}
            type={providerPasswordType}
            additionalControls={[
              <ActionButton
                id="deployment-center-ftps-provider-password-visibility-toggle"
                key="deployment-center-ftps-provider-password-visibility-toggle"
                className={additionalTextFieldControl}
                ariaLabel={providerPasswordType === 'password' ? t('showProviderPasswordAriaLabel') : t('hideProviderPasswordAriaLabel')}
                onClick={toggleShowProviderPassword}
                iconProps={{ iconName: providerPasswordType === 'password' ? 'RedEye' : 'Hide' }}>
                {providerPasswordType === 'password' ? t('show') : t('hide')}
              </ActionButton>,
            ]}
          />

          {/* <TextField
            id="deployment-center-ftps-provider-password"
            name="publishingPassword"
            label={t('deploymentCenterFtpsPasswordLabel')}
            value={textFieldPassword}
            onChange={changeTextFieldPassword}
            type={providerPasswordType}
            additionalControls={[
              <ActionButton
                id="deployment-center-ftps-user-password-visibility-toggle"
                key="deployment-center-ftps-user-password-visibility-toggle"
                className={additionalTextFieldControl}
                ariaLabel={
                  providerPasswordType === 'password' ? t('showProviderPasswordAriaLabel') : t('hideProviderPasswordAriaLabel')
                }
                onClick={toggleShowProviderPassword}
                iconProps={{ iconName: providerPasswordType === 'password' ? 'RedEye' : 'Hide' }}>
                {providerPasswordType === 'password' ? t('show') : t('hide')}
              </ActionButton>,
            ]}
          /> */}

          <Field
            id="deployment-center-ftps-provider-confirm-password"
            name="publishingConfirmPassword"
            component={TextFieldNoFormik}
            label={t('deploymentCenterFtpsConfirmPasswordLabel')}
            value={textFieldConfirmPassword}
            onChange={changeTextFieldConfirmPassword}
            type={providerConfirmPasswordType}
            additionalControls={[
              <ActionButton
                id="deployment-center-ftps-provider-confirm-password-visibility-toggle"
                key="deployment-center-ftps-provider-confirm-password-visibility-toggle"
                className={additionalTextFieldControl}
                ariaLabel={
                  providerConfirmPasswordType === 'password'
                    ? t('showProviderConfirmPasswordAriaLabel')
                    : t('hideProviderConfirmPasswordAriaLabel')
                }
                onClick={toggleShowConfirmProviderPassword}
                iconProps={{ iconName: providerConfirmPasswordType === 'password' ? 'RedEye' : 'Hide' }}>
                {providerConfirmPasswordType === 'password' ? t('show') : t('hide')}
              </ActionButton>,
            ]}
          />
          {/* <TextField
            id="deployment-center-ftps-provider-confirm-password"
            name="publishingConfirmPassword"
            label={t('deploymentCenterFtpsConfirmPasswordLabel')}
            value={textFieldConfirmPassword}
            onChange={changeTextFieldConfirmPassword}
            type={providerConfirmPasswordType}
            additionalControls={[
              <ActionButton
                id="deployment-center-ftps-user-password-visibility-toggle"
                key="deployment-center-ftps-user-password-visibility-toggle"
                className={additionalTextFieldControl}
                ariaLabel={
                  providerConfirmPasswordType === 'password' ? t('showProviderConfirmPasswordAriaLabel') : t('hideProviderConfirmPasswordAriaLabel')
                }
                onClick={toggleShowConfirmProviderPassword}
                iconProps={{ iconName: providerConfirmPasswordType === 'password' ? 'RedEye' : 'Hide' }}>
                {providerConfirmPasswordType === 'password' ? t('show') : t('hide')}
              </ActionButton>,
            ]}
          /> */}
        </>
      )}
    </div>
  );
};

export default DeploymentCenterPublishingUser;
