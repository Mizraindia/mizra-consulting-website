// Draft consent wording for class registration (version 1). A lawyer must approve it
// before registration opens. It is shown on the form and stored with every registration.
// If the wording changes, bump CONSENT_VERSION so each record shows which version was agreed.

export const CONSENT_VERSION = 'v1-draft';

export const CONSENT_PARTS = {
  before:
    'I confirm I am 18 or older and, if I am registering a child, that I am their parent or legal guardian. I agree to the ',
  link: 'privacy policy',
  after: ' and to receive emails and WhatsApp messages about this class.',
};

export const CONSENT_TEXT = `${CONSENT_PARTS.before}${CONSENT_PARTS.link}${CONSENT_PARTS.after}`;
