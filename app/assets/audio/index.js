const { ChangePasswordScreen } = require('./ChangePasswordScreen')
const { LoginScreen } = require('./LoginScreen')
const { HomeScreen } = require('./HomeScreen')
const { RegistrationScreen } = require('./RegistrationScreen')
const { ContactUsScreen } = require('./ContactUsScreen')
const { DeleteAccountScreen } = require('./DeleteAccountScreen')
const { FAQsScreen } = require('./FAQsScreen')
const { FeedbackScreen } = require('./FeedbackScreen')
const { HelpScreen } = require('./HelpScreen')
const { PasswordRecoveryScreen } = require('./PasswordRecoveryScreen')
const { ProfileScreen } = require('./ProfileScreen')
const { SettingsScreen } = require('./SettingsScreen')
const { SpeakScreen } = require('./SpeakScreen')

export const AUDIO = {
    "LoginScreen": LoginScreen,
    "ChangePasswordScreen": ChangePasswordScreen,
    "HomeScreen": HomeScreen,
    "RegistrationScreen": RegistrationScreen,

    "ContactUsScreen": ContactUsScreen,
    "PasswordRecoveryScreen": PasswordRecoveryScreen,

    "DeleteAccountScreen": DeleteAccountScreen,
    "FAQsScreen": FAQsScreen,
    "FeedbackScreen": FeedbackScreen,
    "HelpScreen": HelpScreen,
    "ProfileScreen": ProfileScreen,
    "SettingsScreen": SettingsScreen,
    "SpeakScreen": SpeakScreen,
}