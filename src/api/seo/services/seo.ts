'use strict';

const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

module.exports = {
  async collectEntries() {
    const siteUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:3000';
      const contentTypesFromEnv = process.env.SITEMAP_CONTENT_TYPES;
      let contentTypes;

      if (contentTypesFromEnv) {
          contentTypes = contentTypesFromEnv.split(',').map(s => s.trim()).filter(Boolean);
      } else if (typeof strapi !== 'undefined' && strapi.contentTypes) {
          contentTypes = Object.keys(strapi.contentTypes).filter((uid) => {
              const ct = strapi.contentTypes[uid];
              return ct && ct.attributes && ct.attributes.publishedAt;
          });
      } else {
          contentTypes = ['api::post.post', 'api::page.page'];
      }
    const entries = [];

    for (const uid of contentTypes) {
      try {
        const items = await strapi.entityService.findMany(uid, {
          filters: { publishedAt: { $notNull: true } },
          sort: { publishedAt: 'desc' },
          fields: ['id', 'title', 'slug', 'publishedAt'],
          populate: {
            seo: true,
            shareImage: true
          }
        });

        items.forEach((item) => {
          entries.push({ uid, item });
        });
      } catch (e) {
      }
    }

    return { siteUrl, entries };
  },

  async generateSitemap() {
    const { siteUrl, entries } = await this.collectEntries();
    const urls = entries.map(({ uid, item }) => {
      const typeName = uid.split('::')[1].split('.')[0]; // ex: article
      const slug = item.slug || item.id;
      const loc = `${siteUrl}/${typeName}/${slug}`.replace(/\/\/+/g, '/').replace(':/', '://');
      const lastmod = item.publishedAt ? new Date(item.publishedAt).toISOString() : null;
      return { loc, lastmod };
    });

    const urlset = urls
      .map(
        (u) =>
          `<url><loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

    return xml;
  },

  async generateRss() {
    const siteTitle = process.env.SITE_TITLE || 'Mon site';
    const siteDesc = process.env.SITE_DESCRIPTION || '';
    const { siteUrl, entries } = await this.collectEntries();

    const items = entries
      .map(({ uid, item }) => {
        const typeName = uid.split('::')[1].split('.')[0];
        const slug = item.slug || item.id;
        const link = `${siteUrl}/${typeName}/${slug}`.replace(/\/\/+/g, '/').replace(':/', '://');
        const title = escapeXml(item.title || 'Sans titre');
        const pubDate = item.publishedAt ? new Date(item.publishedAt).toUTCString() : new Date().toUTCString();
        // description: prefer seo.metaDescription
        const description = item.seo && item.seo.metaDescription ? escapeXml(item.seo.metaDescription) : '';
        return `<item>
  <title>${title}</title>
  <link>${escapeXml(link)}</link>
  <guid isPermaLink="true">${escapeXml(link)}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${description}</description>
</item>`;
      })
      .join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteTitle)}</title>
  <link>${escapeXml(siteUrl)}</link>
  <description>${escapeXml(siteDesc)}</description>
  ${items}
</channel>
</rss>`;

    return rss;
  }
};

