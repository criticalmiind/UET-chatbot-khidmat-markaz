import { question1 } from './FAQS/question1'
import { question2 } from './FAQS/question2'
import { question3 } from './FAQS/question3'
import { question4 } from './FAQS/question4'
import { question5 } from './FAQS/question5'
import { question6 } from './FAQS/question6'
import { question7 } from './FAQS/question7'
import { question8 } from './FAQS/question8'
import { question9 } from './FAQS/question9'

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
    "FAQSQUESTION1":question1,
    "FAQSQUESTION2":question2,
    "FAQSQUESTION3":question3,
    "FAQSQUESTION4":question4,
    "FAQSQUESTION5":question5,
    "FAQSQUESTION6":question6,
    "FAQSQUESTION7":question7,
    "FAQSQUESTION8":question8,
    "FAQSQUESTION9":question9,
}