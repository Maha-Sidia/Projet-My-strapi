export default {
  routes: [
    {
      method: 'GET',
      path: '/rss.xml',
      handler: 'seo.rss',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/sitemap.xml',
      handler: 'seo.sitemap',
      config: { auth: false },
    },
  ],
};
