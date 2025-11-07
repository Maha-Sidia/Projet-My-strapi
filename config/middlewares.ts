export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://projet-my-blog-3h2uitqj3-maha-sidias-projects.vercel.app/'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://projet-my-blog.vercel.app'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://projet-my-blog-3h2uitqj3-maha-sidias-projects.vercel.app/', // ton frontend déployé
        'http://localhost:3000',              // pour développement local
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
