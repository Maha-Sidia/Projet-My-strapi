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
          'img-src': ["'self'", 'data:', 'blob:', 'https://projet-my-blog-ohzo8xspr-maha-sidias-projects.vercel.app'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://projet-my-blog-ohzo8xspr-maha-sidias-projects.vercel.app'],
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
        'https://projet-my-blog-ohzo8xspr-maha-sidias-projects.vercel.app', // ✅ ton vrai domaine Vercel
        'http://localhost:3000', // ✅ pour dev local
      ],
      headers: '*', // 👈 ajoute cette ligne pour tout autoriser
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 👈 et les méthodes HTTP autorisées
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
