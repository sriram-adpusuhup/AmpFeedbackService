const updateSiteMapping = require('../services/updateSiteMapping');

(async function() {
    await updateSiteMapping();
    process.exit(0);
})();