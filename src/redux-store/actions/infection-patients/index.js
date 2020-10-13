import infectionPatientsProvider from "@data-access/infection-patients-provider";
import snackbar from "@utils/snackbar-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "INFECTION-PATIENTS-UPDATE-DATA",
      data: data
    });
  };
}

function onSizeChange(size) {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        size: size
      })
    );
    dispatch(gotoPage(0));
  };
}

function onSearch(item, action) {
  return (dispatch, getState) => {
    let searchPatientName = action === "patientName" ? item : getState().infectionPatients.searchPatientName
    let searchReason = action === "reason" ? item : getState().infectionPatients.searchReason
    let searchHandling = action === "handling" ? item : getState().infectionPatients.searchHandling
    let searchDepartmentId = action === "departmentId" ? item : getState().infectionPatients.searchDepartmentId
    let searchInfectiousDiseaseId = action === "infectiousDiseaseId" ? item : getState().infectionPatients.searchInfectiousDiseaseId
    let searchTreatmentResult = action === "treatmentResult" ? item : getState().infectionPatients.searchTreatmentResult
    let searchInfectionDateFrom = action === "infectionDateFrom" ? (item && moment(item).format("YYYY-MM-DD")) :
      (getState().infectionPatients.searchInfectionDateFrom && moment(getState().infectionPatients.searchInfectionDateFrom).format("YYYY-MM-DD"));

    let searchInfectionDateTo = action === "infectionDateTo" ? (item && moment(item).format("YYYY-MM-DD")) :
      (getState().infectionPatients.searchInfectionDateTo && moment(getState().infectionPatients.searchInfectionDateTo).format("YYYY-MM-DD"));

    let searchCuredDateFrom = action === "curedDateFrom" ? (item && moment(item).format("YYYY-MM-DD")) :
      (getState().infectionPatients.searchCuredDateFrom && moment(getState().infectionPatients.searchCuredDateFrom).format("YYYY-MM-DD"));

    let searchCuredDateTo = action === "curedDateTo" ? (item && moment(item).format("YYYY-MM-DD")) :
      (getState().infectionPatients.searchCuredDateTo && moment(getState().infectionPatients.searchCuredDateTo).format("YYYY-MM-DD"));

    if (searchPatientName === undefined && searchReason === undefined && searchHandling === undefined &&
      searchDepartmentId === undefined && searchInfectiousDiseaseId === undefined &&
      searchTreatmentResult === undefined && searchInfectionDateFrom === undefined && searchInfectionDateTo === undefined
      && searchCuredDateFrom === undefined && searchCuredDateTo === undefined
    ) {
    } else {
      dispatch(
        updateData({
          searchPatientName: searchPatientName,
          searchReason: searchReason,
          searchHandling: searchHandling,
          searchDepartmentId: searchDepartmentId,
          searchInfectiousDiseaseId: searchInfectiousDiseaseId,
          searchTreatmentResult: searchTreatmentResult,
          searchInfectionDateFrom: searchInfectionDateFrom,
          searchInfectionDateTo: searchInfectionDateTo,
          searchCuredDateFrom: searchCuredDateFrom,
          searchCuredDateTo: searchCuredDateTo,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().infectionPatients.size || 10;
    let patientName = getState().infectionPatients.searchPatientName;
    let reason = getState().infectionPatients.searchReason;
    let handling = getState().infectionPatients.searchHandling;
    let departmentId = getState().infectionPatients.searchDepartmentId;
    let infectiousDiseaseId = getState().infectionPatients.searchInfectiousDiseaseId
    let treatmentResult = getState().infectionPatients.searchTreatmentResult
    let infectionDateFrom = getState().infectionPatients.searchInfectionDateFrom;
    let infectionDateTo = getState().infectionPatients.searchInfectionDateTo;
    let curedDateFrom = getState().infectionPatients.searchCuredDateFrom;
    let curedDateTo = getState().infectionPatients.searchCuredDateTo;
    infectionPatientsProvider.search(page, size, patientName, reason, handling, departmentId, infectiousDiseaseId, treatmentResult,
      infectionDateFrom, infectionDateTo, curedDateFrom, curedDateTo).then(s => {
        if (s && s.code === 0) {
          dispatch(
            updateData({
              total: s.totalElements || size,
              data: s.data || []
            })
          );
        }
      });
  };
}

function loadDetail(id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      infectionPatientsProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                patientDocument: s.data.patientDocument,
                patientValue: s.data.patientValue,
                patientName: s.data.patientName,
                medicalRecordNo: s.data.medicalRecordNo,
                regDate: s.data.regDate,
                birthday: s.data.birthday,
                gender: s.data.gender,
                phone: s.data.phone,
                address: s.data.address,
                departmentId: s.data.departmentId,
                infectiousDiseaseId: s.data.infectiousDiseaseId,
                reason: s.data.reason,
                handling: s.data.handling,
                infectionDate: s.data.infectionDate,
                curedDate: s.data.curedDate,
                treatmentResult: s.data.treatmentResult,
                hospitalizeDate: s.data.hospitalizeDate,
                dischargeHospitalDate: s.data.dischargeHospitalDate,
              })
            );
            resolve(s.data);
            return;
          }
          snackbar.show("Không tìm thấy kết quả phù hợp", "danger");
          reject(s);
        })
        .catch(e => {
          snackbar.show(
            e && e.message ? e.message : "Xảy ra lỗi, vui lòng thử lại sau",
            "danger"
          );
          reject(e);
        });
    });
  };
}

function loadList() {
  return (dispatch) => {
    infectionPatientsProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              infectionPatients: s.data,
              total: s.totalElements,
            })
          );
          break;
      }
    });
  };
}

function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().infectionPatients.id;
      let active = true;
      let patientName = getState().infectionPatients.patientName;
      let patientValue = getState().infectionPatients.patientValue;
      let patientDocument = getState().infectionPatients.patientDocument;
      let medicalRecordNo = getState().infectionPatients.medicalRecordNo
      let regDate = getState().infectionPatients.regDate
      let birthday = getState().infectionPatients.birthday
      let gender = getState().infectionPatients.gender
      let phone = getState().infectionPatients.phone
      let address = getState().infectionPatients.address
      let departmentId = getState().infectionPatients.departmentId
      let infectiousDiseaseId = getState().infectionPatients.infectiousDiseaseId
      let reason = getState().infectionPatients.reason
      let handling = getState().infectionPatients.handling
      let infectionDate = getState().infectionPatients.infectionDate
      let curedDate = getState().infectionPatients.curedDate
      let treatmentResult = getState().infectionPatients.treatmentResult
      let hospitalizeDate = getState().infectionPatients.hospitalizeDate
      let dischargeHospitalDate = getState().infectionPatients.dischargeHospitalDate
      infectionPatientsProvider
        .createOrEdit(id, active, patientName, patientValue, patientDocument, medicalRecordNo, regDate, birthday,
          gender, phone, address, departmentId, infectiousDiseaseId, reason, handling, infectionDate, curedDate,
          treatmentResult, hospitalizeDate, dischargeHospitalDate)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: '',
                patientDocument: '',
                patientValue: '',
                patientName: '',
                medicalRecordNo: '',
                regDate: null,
                birthday: null,
                gender: '',
                phone: '',
                address: '',
                departmentId: '',
                infectiousDiseaseId: '',
                reason: '',
                handling: '',
                infectionDate: null,
                curedDate: null,
                treatmentResult: '',
                hospitalizeDate: null,
                dischargeHospitalDate: null,
              })
            );
            if (!id) {
              snackbar.show("Thêm người bệnh thành công", "success");
            } else {
              snackbar.show("Cập nhật người bệnh thành công", "success");
            }
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm người bệnh không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa thông tin người bệnh không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm người bệnh không thành công", "danger");
          reject();
        });
    });
  };
}

function onDeleteItem(item) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      confirm({
        title: "Xác nhận",
        content: `Bạn muốn xóa người bệnh mắc bệnh truyền nhiễm ${item.patientName}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          infectionPatientsProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa người bệnh thành công", "success");
                let data = getState().infectionPatients.data || [];
                let index = data.findIndex(x => x.id === item.id);
                if (index !== -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                resolve();
              } else {
                snackbar.show("Xóa người bệnh không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa người bệnh không thành công", "danger");
              reject();
            });
        },
        onCancel() {
          reject();
        }
      });
    });
  };
}

export default {
  loadList,
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onDeleteItem,
  loadDetail,
};
