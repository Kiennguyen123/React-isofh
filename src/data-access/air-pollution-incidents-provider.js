import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.airPollutionIncidents + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, name, stageIncident, fromDate, toDate) {
    let url = constants.api.airPollutionIncidents + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (name) url += "&name=" + name;
    if (stageIncident) url += "&stageIncident=" + stageIncident;
    if (fromDate) url += "&fromDateStart=" + fromDate;
    if (toDate) url += "&fromDateFinish=" + toDate;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.airPollutionIncidents + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, name, typeIncidentId, stageIncident, reason, arena, fromDate, toDate, status, handling, conclusion, detailRating) {
    if (!id) {
      let url = constants.api.airPollutionIncidents;
      return client.requestApi("post", url, {
        name,
        typeIncidentId,
        stageIncident,
        reason,
        arena,
        fromDate,
        toDate,
        status,
        handling,
        conclusion,
        detailRating,
      });
    } else {
      let url = constants.api.airPollutionIncidents + "/" + id;
      return client.requestApi("put", url, {
        name,
        typeIncidentId,
        stageIncident,
        reason,
        arena,
        fromDate,
        toDate,
        status,
        handling,
        conclusion,
        detailRating,
      });
    }
  }
};
