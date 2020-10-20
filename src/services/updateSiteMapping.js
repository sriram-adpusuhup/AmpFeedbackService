const couchbase = require("../utils/couchbase");
const utils = require("../utils/utils");
const redis = require("../utils/redis");
const constants = require('../utils/constants');

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

  redis.setData(constants.SITE_MAPPING_KEY, JSON.stringify(domainSiteMap));
};

module.exports = updateSiteMappings;
