const couchbase = require("./couchbase");
const utils = require("./utils");
const redis = require("./redis");

const getSiteMappingWithDomain = async () => {
  const query =
    'SELECT ARRAY_AGG(DISTINCT [SPLIT(bidRequest.id, ":")[0], bidRequest.site.domain, bidRequest.site.page]) as sites FROM `StoredRequestsBucket`';
  const results = await couchbase.queryDB(query);
  return results[0].sites;
};

const updateSiteMappings = async () => {
  const mappings = await getSiteMappingWithDomain();

  const domainSiteMap = mappings.reduce((result, [siteId, siteDomain, siteUrl]) => {
    if (!siteId || !siteDomain) return result;
    const normalizedUrl = utils.normalizeDomain(siteDomain);
    return {
      ...result,
      [normalizedUrl]: {
        siteId,
        siteDomain,
        siteUrl
      },
    };
  }, {});

  redis.setData("siteMapping", JSON.stringify(domainSiteMap));
};

module.exports = updateSiteMappings;
