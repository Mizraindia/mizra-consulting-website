// Master-class topics, in the order the website shows them. Keep in step with TOPICS in
// integrations/google-apps-script/classes.gs, which checks the Topic column of the Classes tab.
export const CLASS_TOPICS = [
  'Product',
  'Salesforce and CRM',
  'Zoho',
  'Careers',
  'Agile and software delivery',
  'Small business and automation',
  'AI tools for work',
] as const;

// Topics people can register interest in on the holding page. Used by the form and the server check.
export const INTEREST_TOPICS = [...CLASS_TOPICS, 'Something else'] as const;

