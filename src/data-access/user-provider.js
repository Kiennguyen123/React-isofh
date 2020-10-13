import client from "../utils/client-utils";
import stringUtils from "mainam-react-native-string-utils";
import constants from "../resources/strings";
import datacacheProvider from "./datacache-provider";
import clientUtils from "../utils/client-utils";

export default {
  login(redirectURI, code) {
    let object = {
      code: code,
      redirectURI: redirectURI
    }
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi("post", constants.api.user.login, object)
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  getDetailUser() {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi("get", constants.api.user.user, {})
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  getById(id) {
    let url = constants.api.user.user + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, username, fullName, selected, sort) {
    let url = constants.api.user.user + "?";
    url += "page=" + (page || 0) + "&";
    url += "size=" + (size || 10);
    if (username) url += "&username=" + username;
    if (fullName) url += "&fullName=" + fullName;
    // if (sort) url += "sort=" + sort;
    if (selected !== undefined) url += "&selected=" + (selected ? 1 : 0);
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.user.user + "/" + id;
    return client.requestApi("delete", url, {});
  },
  uploadImageSign(data) {
    let url = constants.api.user.user + "/sign-images";
    return client.uploadFile(url, data);
  },
  createOrEdit(id, name, fullName, signImage, serialNumber, privileges, username) {
    if (!id) {
      let url = constants.api.user.user;
      return client.requestApi("post", url, {
        name,
        fullName,
        signImage,
        serialNumber,
        privileges,
        username
      });
    } else {
      let url = constants.api.user.user + "/" + id;
      return client.requestApi("put", url, {
        name,
        fullName,
        signImage,
        serialNumber,
        privileges,
        username
      });
    }
  },
  syncs() {
    let url = constants.api.userSyncs;
    return client.requestApi("get", url, {});
  }
};
