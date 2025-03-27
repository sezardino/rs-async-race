export const ApplicationUrls = Object.freeze({
  garage: '/',
  winners: '/winners',
});

export type ApplicationUrls =
  (typeof ApplicationUrls)[keyof typeof ApplicationUrls];
