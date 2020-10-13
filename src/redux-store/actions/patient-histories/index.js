import patientHistoriesProvider from "@data-access/patient-histories-provider";
import snackbar from "@utils/snackbar-utils";

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "PATIENT-HISTORIES-UPDATE-DATA",
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
    let searchPatientDocument = action === "patientDocument" ? data: getState().patientHistories.searchPatientDocument;
    if (searchPatientDocument === undefined) {
    } else {
      dispatch(
        updateData({
          searchPatientDocument: searchPatientDocument,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page, data) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(updateData({
        page: page,
        searchPatientDocument: data,
      }));
      let size = getState().patientHistories.size || 10;
      let patientDocument = data ? data : getState().patientHistories.searchPatientDocument;
      patientHistoriesProvider.search(page, size, patientDocument).then(s => {
        if (s && s.code === 0) {
          dispatch(
            updateData({
              total: s.totalElements || size,
              dataPatient: s.data || []
            })
          );
          resolve(s)
        }
      });
    })
  };
}

function loadDetail(id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      patientHistoriesProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                patientName: s.data.patientName,
                patientValue: s.data.patientValue,
                medicalRecordNo: s.data.medicalRecordNo,
                patientDocument: s.data.patientDocument,
                regDate: s.data.regDate,
                birthday: s.data.birthday,
                phone: s.data.phone,
                gender: s.data.gender,
                departmentId: s.data.departmentId,
                address: s.data.address,
                patientType: s.data.patientType,
                reason: s.data.reason,
                timeGoIn: s.data.timeGoIn,
                timeGoOut: s.data.timeGoOut,
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
    patientHistoriesProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              patientHistories: s.data,
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
      let id = getState().patientHistories.id;
      let active = true;
      let patientName = getState().patientHistories.patientName;
      let patientValue = getState().patientHistories.patientValue;
      let patientDocument = getState().patientHistories.patientDocument;
      let medicalRecordNo = getState().patientHistories.medicalRecordNo
      let regDate = getState().patientHistories.regDate
      let birthday = getState().patientHistories.birthday
      let gender = getState().patientHistories.gender
      let phone = getState().patientHistories.phone
      let address = getState().patientHistories.address
      let departmentId = getState().patientHistories.departmentId
      patientHistoriesProvider
        .createOrEdit(id, active, patientName, patientValue, patientDocument, medicalRecordNo, regDate, birthday,
          gender, phone, address, departmentId)
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

              })
            );
            if (!id) {
              snackbar.show("Thêm người bệnh mắc bệnh truyền nhiễm trong bệnh viện thành công", "success");
            } else {
              snackbar.show("Cập nhật người bệnh mắc bệnh truyền nhiễm trong bệnh viện thành công", "success");
            }
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm người bệnh mắc bệnh truyền nhiễm trong bệnh viện thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa người bệnh mắc bệnh truyền nhiễm trong bệnh viện thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm người bệnh mắc bệnh truyền nhiễm trong bệnh viện thành công", "danger");
          reject();
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
  loadDetail,
};
