const cron = require('node-cron');
require('dotenv').config();

const updateSiteMapping = require('./updateSiteMapping');

(function() {
    cron.schedule(process.env.SITE_MAPPING_UPDATE_CRON, updateSiteMapping);
})();