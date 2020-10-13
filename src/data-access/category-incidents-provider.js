import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.categoryIncidents + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, searchIncidentCode, searchIncidentType) {
    let url = constants.api.categoryIncidents + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (searchIncidentCode) url += "&incidentCode=" + searchIncidentCode;
    if (searchIncidentType) url += "&incidentType=" + searchIncidentType;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.categoryIncidents + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, incidentCode, incidentType) {
    if (!id) {
      let url = constants.api.categoryIncidents;
      return client.requestApi("post", url, {
        incidentCode,
        incidentType,
      });
    } else {
      let url = constants.api.categoryIncidents + "/" + id;
      return client.requestApi("put", url, {
        incidentCode,
        incidentType,
      });
    }
  }
};
