import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.sanitationProcesses + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, name, location, fromDate, toDate, result) {
    let url = constants.api.sanitationProcesses + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (name) url += "&name=" + name;
    if (location) url += "&location=" + location;
    if (fromDate) url += "&fromDateStart=" + fromDate;
    if (toDate) url += "&fromDateFinish=" + toDate;
    if (result) url += "&result=" + result;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.sanitationProcesses + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, active, name, location, fromDate, toDate, result, status, executor, note, lines) {
    if (!id) {
      let url = constants.api.sanitationProcesses;
      return client.requestApi("post", url, {
        name, location, fromDate, toDate, result, status, executor, note, lines,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.sanitationProcesses + "/" + id;
      return client.requestApi("put", url, {
        name, location, fromDate, toDate, result, status, executor, note, lines,
        active: active ? 1 : 0
      });
    }
  }
};
