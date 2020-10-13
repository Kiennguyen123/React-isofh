import hospitalInfectionsProvider from "@data-access/hospital-infections-provider";
import snackbar from "@utils/snackbar-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "HOSPITAL-INFECTIONS-UPDATE-DATA",
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

function onSearch(data, action) {
  return (dispatch, getState) => {
    let searchName = action === "patientName" ? data : getState().hospitalInfections.searchName;
    let searchDepartment = action === "departmentId" ? data : getState().hospitalInfections.searchDepartment;
    let searchInfectionType = action === "infectionTypeId" ? data : getState().hospitalInfections.searchInfectionType;
    let searchReason = action === "reason" ? data : getState().hospitalInfections.searchReason;
    let searchHandling = action === "handling" ? data : getState().hospitalInfections.searchHandling;
    let searchInfectionDateFrom = action === "infectionDateFrom" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().hospitalInfections.searchInfectionDateFrom && moment(getState().hospitalInfections.searchInfectionDateFrom).format("YYYY-MM-DD"));

    let searchInfectionDateTo = action === "infectionDateTo" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().hospitalInfections.searchInfectionDateTo && moment(getState().hospitalInfections.searchInfectionDateTo).format("YYYY-MM-DD"));

    let searchCuredDateFrom = action === "curedDateFrom" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().hospitalInfections.searchCuredDateFrom && moment(getState().hospitalInfections.searchCuredDateFrom).format("YYYY-MM-DD"));

    let searchCuredDateTo = action === "curedDateTo" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().hospitalInfections.searchCuredDateTo && moment(getState().hospitalInfections.searchCuredDateTo).format("YYYY-MM-DD"));

    let searchTreatmentResult = action === "treatmentResult" ? data : getState().hospitalInfections.searchTreatmentResult;
    if (searchName === undefined && searchDepartment === undefined && searchReason === undefined && searchHandling === undefined && searchInfectionDateFrom === undefined
      && searchInfectionDateTo === undefined && searchCuredDateFrom === undefined && searchCuredDateTo === undefined && searchInfectionType === undefined && searchTreatmentResult === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: searchName,
          searchDepartment: searchDepartment,
          searchReason: searchReason,
          searchHandling: searchHandling,
          searchInfectionDateFrom: searchInfectionDateFrom,
          searchInfectionDateTo: searchInfectionDateTo,
          searchInfectionType: searchInfectionType,
          searchCuredDateFrom: searchCuredDateFrom,
          searchCuredDateTo: searchCuredDateTo,
          searchTreatmentResult: searchTreatmentResult,
        })
      );
    }

    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().hospitalInfections.size || 10;
    let patientName = getState().hospitalInfections.searchName;
    let departmentId = getState().hospitalInfections.searchDepartment;
    let infectionTypeId = getState().hospitalInfections.searchInfectionType;
    let reason = getState().hospitalInfections.searchReason;
    let handling = getState().hospitalInfections.searchHandling;
    let infectionDateFrom = getState().hospitalInfections.searchInfectionDateFrom;
    let infectionDateTo = getState().hospitalInfections.searchInfectionDateTo;
    let curedDateFrom = getState().hospitalInfections.searchCuredDateFrom;
    let curedDateTo = getState().hospitalInfections.searchCuredDateTo;
    let treatmentResult = getState().hospitalInfections.searchTreatmentResult;
    hospitalInfectionsProvider.search(page, size, patientName, reason, departmentId, infectionTypeId, handling, infectionDateFrom, infectionDateTo, curedDateFrom, curedDateTo, treatmentResult).then(s => {
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
      hospitalInfectionsProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                patientName: s.data.patientName,
                patientValue: s.data.patientValue,
                regDate: s.data.regDate,
                birthday: s.data.birthday,
                gender: s.data.gender,
                phone: s.data.phone,
                patientValue: s.data.patientValue,
                patientDocument: s.data.patientDocument,
                address: s.data.address,
                medicalRecordNo: s.data.medicalRecordNo,
                hospitalizeDate: s.data.hospitalizeDate,
                dischargeHospitalDate: s.data.dischargeHospitalDate,
                department: s.data.department,
                departmentId: s.data.departmentId,
                infectionTypeId: s.data.infectionTypeId,
                infectionType: s.data.infectionType,
                reason: s.data.reason,
                handling: s.data.handling,
                infectionDate: s.data.infectionDate,
                curedDate: s.data.curedDate,
                treatmentResultId: s.data.treatmentResultId,
                treatmentResult: s.data.treatmentResult,
                dataIndex: s.data.department,
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
    hospitalInfectionsProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              hospitalInfections: s.data,
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
      let id = getState().hospitalInfections.id;
      let active = true;
      let patientName = getState().hospitalInfections.patientName;
      let patientValue = getState().hospitalInfections.patientValue;
      let patientDocument = getState().hospitalInfections.patientDocument;
      let medicalRecordNo = getState().hospitalInfections.medicalRecordNo
      let regDate = getState().hospitalInfections.regDate
      let birthday = getState().hospitalInfections.birthday
      let gender = getState().hospitalInfections.gender
      let phone = getState().hospitalInfections.phone
      let address = getState().hospitalInfections.address
      let departmentId = getState().hospitalInfections.departmentId
      let infectionTypeId = getState().hospitalInfections.infectionTypeId
      let reason = getState().hospitalInfections.reason
      let handling = getState().hospitalInfections.handling
      let infectionDate = getState().hospitalInfections.infectionDate
      let curedDate = getState().hospitalInfections.curedDate
      let treatmentResult = getState().hospitalInfections.treatmentResult
      let hospitalizeDate = getState().hospitalInfections.hospitalizeDate
      let dischargeHospitalDate = getState().hospitalInfections.dischargeHospitalDate
      hospitalInfectionsProvider
        .createOrEdit(id, active, patientName, patientValue, patientDocument, medicalRecordNo, regDate, birthday,
          gender, phone, address, departmentId, infectionTypeId, reason, handling, infectionDate, curedDate,
          treatmentResult, hospitalizeDate, dischargeHospitalDate)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: '',
                patientDocument: '',
                patientValue: '',
                patietName: '',
                medicalRecordNo: '',
                regDate: null,
                birthday: null,
                gender: '',
                phone: '',
                address: '',
                departmentId: '',
                infectionTypeId: '',
                reason: '',
                handling: '',
                infectionDate: null,
                curedDante: null,
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
        content: `Bạn có muốn xóa người bệnh ${item.patientName}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          hospitalInfectionsProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa người bệnh thành công", "success");
                let data = getState().hospitalInfections.data || [];
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
