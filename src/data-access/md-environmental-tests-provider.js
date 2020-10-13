import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.mdEnvironmentalTests + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, specimenTypeId, name) {
    let url = constants.api.mdEnvironmentalTests + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (specimenTypeId) url += "&specimenTypeId=" + specimenTypeId;
    if (name) url += "&name=" + name;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.mdEnvironmentalTests + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, active, name, value, specimenTypeId, lines) {
    if (!id) {
      let url = constants.api.mdEnvironmentalTests;
      return client.requestApi("post", url, {
        name,
        value,
        specimenTypeId,
        lines,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.mdEnvironmentalTests + "/" + id;
      return client.requestApi("put", url, {
        name,
        value,
        specimenTypeId,
        lines,
        active: active ? 1 : 0
      });
    }
  }
};
