const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const MobileDetect = require("mobile-detect");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;

const redis = require('./redis');
const utils = require('./utils');

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
    platform: 'DESKTOP',
    referrer,
    url: referrer,
  };

  const md = new MobileDetect(userAgent);
  if (md.mobile()) feedback.platform = "MOBILE";
  else if (md.tablet()) feedback.platform = "TABLET";

  const siteMappingString = await redis.getData('siteMapping');
  const siteMapping = JSON.parse(siteMappingString);

  feedback.siteId = siteMapping[utils.normalizeDomain(referrer)].siteId;

  return res.json(feedback);
});

module.exports = app;
