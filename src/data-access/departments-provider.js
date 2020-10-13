import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  search(page, size, name, value) {
    let url = constants.api.departments + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (name) url += "&name=" + name;
    if (value) url += "&value=" + value;
    return client.requestApi("get", url, {});
  },
  syncs() {
    return new Promise((resolve, reject) => {
      client.requestApi('get', constants.api.departments + "/syncs", {}).then(x => {
        resolve(x)
      }).catch(e => {
        reject(e)
      })
    })
  },
};
