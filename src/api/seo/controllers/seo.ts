'use strict';

module.exports = {
  async sitemap(ctx) {
    const xml = await strapi.service('api::seo.seo').generateSitemap();
    ctx.type = 'application/xml';
    ctx.body = xml;
  },

  async rss(ctx) {
    const xml = await strapi.service('api::seo.seo').generateRss();
    ctx.type = 'application/xml';
    ctx.body = xml;
  }
};

