import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.environmentalTests + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, specimenTypeId, actDateFrom, actDateTo, assessment, assessor, executor) {
    let url = constants.api.environmentalTests + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (specimenTypeId) url += "&specimenTypeId=" + specimenTypeId;
    if (actDateFrom) url += "&actDateFrom=" + actDateFrom;
    if (actDateTo) url += "&actDateTo=" + actDateTo;
    if (assessment) url += "&assessment=" + assessment;
    if (assessor) url += "&assessor=" + assessor;
    if (executor) url += "&executor=" + executor;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.environmentalTests + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, specimenTypeId, mdEnvironmentalId, assessment, assessor, executor, actDate, lines, location) {
    if (!id) {
      let url = constants.api.environmentalTests;
      return client.requestApi("post", url, {
        specimenTypeId,
        mdEnvironmentalId,
        assessment,
        assessor,
        executor,
        actDate,
        lines,
        location
      });
    } else {
      let url = constants.api.environmentalTests + "/" + id;
      return client.requestApi("put", url, {
        specimenTypeId,
        mdEnvironmentalId,
        assessment,
        assessor,
        executor,
        actDate,
        lines,
        location
      });
    }
  }
};
