export const APP_CONFIG = {
  name: 'EMMS',
  fullName: 'Enterprise Maintenance Management System',
  version: '1.0.0',
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    timeout: 30000,
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  dateFormat: 'yyyy-MM-dd',
  dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
  supportedLanguages: ['en', 'ar'] as const,
  defaultLanguage: 'en' as const,
} as const;

export type SupportedLanguage = (typeof APP_CONFIG.supportedLanguages)[number];
