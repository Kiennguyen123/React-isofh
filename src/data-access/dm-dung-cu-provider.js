import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.dmDungCu + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, value, name, loai) {
    let url = constants.api.dmDungCu + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (value) url += "&value=" + value;
    if (name) url += "&name=" + name;
    if (loai) url += "&loai=" + loai;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.dmDungCu + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, value, name, loai) {
    if (!id) {
      let url = constants.api.dmDungCu;
      return client.requestApi("post", url, {
        value,
        name,
        loai
      });
    } else {
      let url = constants.api.dmDungCu + "/" + id;
      return client.requestApi("put", url, {
        value,
        name,
        loai
      });
    }
  }
};
