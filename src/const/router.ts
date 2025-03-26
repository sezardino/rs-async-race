export const ApplicationUrls = Object.freeze({
  home: '/',
  winners: '/winners',
});

export type ApplicationUrls =
  (typeof ApplicationUrls)[keyof typeof ApplicationUrls];
