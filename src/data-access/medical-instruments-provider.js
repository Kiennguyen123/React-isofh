import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.environmentalTests + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, name) {
    let url = constants.api.environmentalTests + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (name) url += "&name=" + name;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.environmentalTests + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, name) {
    if (!id) {
      let url = constants.api.environmentalTests;
      return client.requestApi("post", url, {
        name
      });
    } else {
      let url = constants.api.environmentalTests + "/" + id;
      return client.requestApi("put", url, {
        name
      });
    }
  }
};
