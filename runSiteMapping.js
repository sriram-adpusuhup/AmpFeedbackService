const updateSiteMapping = require('./src/updateSiteMapping');

(async function() {
    await updateSiteMapping();
    process.exit(0);
})();