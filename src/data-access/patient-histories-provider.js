import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.patientHistories + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, patientDocument) {
    let url = constants.api.patientHistories + "?sort=createdAt,desc";
    
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if(patientDocument) url += "&patientDocument=" + patientDocument;
    return client.requestApi("get", url, {});
  },
  // delete(id) {
  //   let url = constants.api.patientHistories + "/" + id;
  //   return client.requestApi("delete", url, {});
  // },
  // createOrEdit(id,active, patientName, patientValue, patientDocument, medicalRecordNo, regDate, birthday,
  //   gender, phone, address, departmentId, infectiousDiseaseId, reason, handling, infectionDate, curedDate,
  //   treatmentResult, hospitalizeDate,dischargeHospitalDate) {
  //   if (!id) {
  //     let url = constants.api.infectionPatients;
  //     return client.requestApi("post", url, {
  //       patientName, 
  //       patientValue, 
  //       patientDocument, 
  //       medicalRecordNo, 
  //       regDate, 
  //       birthday,
  //       gender, 
  //       phone, 
  //       address, 
  //       departmentId, 
  //       infectiousDiseaseId, 
  //       reason, 
  //       handling, 
  //       infectionDate, 
  //       curedDate,  
  //       treatmentResult,
  //       hospitalizeDate,
  //       dischargeHospitalDate,
  //       active: active ? true : false,
  //       type : 1

  //     });
  //   } else {
  //     let url = constants.api.infectionPatients + "/" + id;
  //     return client.requestApi("put", url, {
  //       patientName, 
  //       patientValue, 
  //       patientDocument, 
  //       medicalRecordNo, 
  //       regDate, 
  //       birthday,
  //       gender, 
  //       phone, 
  //       address, 
  //       departmentId, 
  //       infectiousDiseaseId, 
  //       reason, 
  //       handling, 
  //       infectionDate, 
  //       curedDate,
  //       treatmentResult,
  //       hospitalizeDate,
  //       dischargeHospitalDate,
  //       active: active ? true : false,
  //       type : 1
  //     });
  //   }
  // }
};
