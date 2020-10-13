import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.infectionPatients + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, patientName, reason, handling, departmentId, infectiousDiseaseId, treatmentResult, infectionDateFrom, infectionDateTo, curedDateFrom, curedDateTo) {
    let url = constants.api.infectionPatients + "?sort=createdAt,desc";

    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (patientName) url += "&patientName=" + patientName;
    if (departmentId) url += '&departmentId=' + departmentId;
    if (reason) url += '&reason=' + reason;
    if (handling) url += '&handling=' + handling;
    if (infectiousDiseaseId) url += '&infectiousDiseaseId=' + infectiousDiseaseId;
    if (treatmentResult) url += '&treatmentResult=' + treatmentResult;
    if (infectionDateFrom) url += "&infectionDateFrom=" + infectionDateFrom;
    if (infectionDateTo) url += "&infectionDateTo=" + infectionDateTo;
    if (curedDateFrom) url += "&curedDateFrom=" + curedDateFrom;
    if (curedDateTo) url += "&curedDateTo=" + curedDateTo;
    url += "&type=1";
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.infectionPatients + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, active, patientName, patientValue, patientDocument, medicalRecordNo, regDate, birthday,
    gender, phone, address, departmentId, infectiousDiseaseId, reason, handling, infectionDate, curedDate,
    treatmentResult, hospitalizeDate, dischargeHospitalDate) {
    if (!id) {
      let url = constants.api.infectionPatients;
      return client.requestApi("post", url, {
        patientName,
        patientValue,
        patientDocument,
        medicalRecordNo,
        regDate,
        birthday,
        gender,
        phone,
        address,
        departmentId,
        infectiousDiseaseId,
        reason,
        handling,
        infectionDate,
        curedDate,
        treatmentResult,
        hospitalizeDate,
        dischargeHospitalDate,
        active: active ? true : false,
        type: 1,
      });
    } else {
      let url = constants.api.infectionPatients + "/" + id;
      return client.requestApi("put", url, {
        patientName,
        patientValue,
        patientDocument,
        medicalRecordNo,
        regDate,
        birthday,
        gender,
        phone,
        address,
        departmentId,
        infectiousDiseaseId,
        reason,
        handling,
        infectionDate,
        curedDate,
        treatmentResult,
        hospitalizeDate,
        dischargeHospitalDate,
        active: active ? true : false,
        type: 1,
      });
    }
  }
};
