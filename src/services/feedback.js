const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const MobileDetect = require("mobile-detect");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;
const axios = require('axios').default;

const redis = require('../utils/redis');
const utils = require('../utils/utils');
const constants = require("../utils/constants");

const app = express();

const loadCookie = fs.readFileSync(
  path.join(__dirname, '..' ,"assets", "load-cookie.html")
);

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  // must not cache load cookie, so that we capture all requests
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.send(loadCookie);

  const referrer = req.get("Referrer") || "-";
  const userAgent = req.headers["user-agent"];

  const feedback = {
    createdTS: Date.now(),
    errorCode: 1,
    isGeniee: false,
    mode: 3,
    packetId: uuid(),
    platform: constants.DEVICE_TYPES.DESKTOP,
    referrer,
    siteDomain: referrer,
  };

  const md = new MobileDetect(userAgent);
  if (md.mobile()) feedback.platform = constants.DEVICE_TYPES.MOBILE;
  else if (md.tablet()) feedback.platform = constants.DEVICE_TYPES.TABLET;

  const siteMappingString = await redis.getData(constants.SITE_MAPPING_KEY);
  const siteMapping = JSON.parse(siteMappingString);

  const siteConfig = siteMapping[utils.normalizeDomain(referrer)];
  if (siteConfig && siteConfig.siteId) {
    feedback.siteId = siteConfig.siteId;
  }

  return axios.post(process.env.AP_FEEDBACK_URL, feedback);
});

module.exports = app;
