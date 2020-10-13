import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.user.user + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, searchUserName, searchFullName, searchKhoa, searchRoleId) {
    let url = constants.api.user.user + "?otherRole=true&sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (searchUserName) url += "&username=" + searchUserName;
    if (searchFullName) url += "&fullName=" + searchFullName;
    if (searchKhoa) url += "&departmentId=" + searchKhoa;
    if (searchRoleId) url += "&roleId=" + searchRoleId;
    return client.requestApi("get", url, {});
  },
  searchFull(page, size, username, departmentId) {
    let url = constants.api.user.user + "?otherRole=false&sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 1000);
    if (username) url += "&username=" + username;
    if (departmentId) url += "&departmentId=" + departmentId;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.user.user + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, username, fullName, departmentId, roleId) {
    if (!id) {
      let url = constants.api.user.user;
      return client.requestApi("post", url, {
        username,
        fullName,
        departmentId,
        roleId,
      });
    } else {
      let url = constants.api.user.user + "/edit-authorization/" + id;
      return client.requestApi("put", url, {
        roleId,
      });
    }
  },
  reset(id, username, fullName, departmentId, roleId) {
    let url = constants.api.user.user + "/reset-authorization/" + id;
    return client.requestApi("put", url, {
      username,
      fullName,
      departmentId,
      roleId,
    });
  },
};









