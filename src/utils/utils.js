const Utils = {
  normalizeDomain: (domain) => {
    let regex = /^(?:https?:\/\/)?(?:www\.)?([^:\/?]+)/;
    return domain.match(regex)[1];
  },
};

module.exports = Utils;
