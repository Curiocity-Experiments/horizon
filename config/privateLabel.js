// config/privateLabel.js

// TODO: Implement a caching mechanism for config to improve performance
// TODO: Add validation for config objects to ensure all required fields are present

const defaultConfig = {
  name: 'Abstracta Feedback',
  logo: '/logo.svg',
  favicon: '/images/favicon/favicon.ico',
  colors: {
    primary: '#3B82F6', // blue-500
    secondary: '#1D4ED8', // blue-700
    accent: '#EAB308', // yellow-500
    background: '#F3F4F6', // gray-100
    text: '#1F2937', // gray-800
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

const configs = {
  'default': defaultConfig,
  'client1.abstractafeedback.com': {
    ...defaultConfig,
    name: 'Client 1 Feedback',
    logo: '/client1-logo.svg',
    colors: {
      ...defaultConfig.colors,
      primary: '#10B981', // green-500
      secondary: '#059669', // green-600
    },
    googleClientId: process.env.CLIENT1_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.CLIENT1_GOOGLE_CLIENT_SECRET,
  },
  // Add more client configurations as needed
};

export function getConfig(hostname = '') {
  // TODO: Implement fallback mechanism if hostname is not found in configs
  return configs[hostname] || defaultConfig;
}