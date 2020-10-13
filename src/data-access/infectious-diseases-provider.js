
import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.infectiousDiseases + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, name, value) {
    let url = constants.api.infectiousDiseases + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (name) url += "&name=" + name;
    if (value) url += "&value=" + value;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.infectiousDiseases + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, active, name, value, specimenTypeId, lines) {
    if (!id) {
      let url = constants.api.infectiousDiseases;
      return client.requestApi("post", url, {
        name,
        value,
        lines,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.infectiousDiseases + "/" + id;
      return client.requestApi("put", url, {
        name,
        value,
        lines,
        active: active ? 1 : 0
      });
    }
  }
};
