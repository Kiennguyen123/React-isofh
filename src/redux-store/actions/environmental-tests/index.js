import environmentalTestsProvider from "@data-access/environmental-tests-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
import moment from "moment"
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "ENVIROMENTAL-TESTS-UPDATE-DATA",
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
    let searchSpecimenType = action === "specimenType" ? data : getState().environmentalTests.searchSpecimenType;
    let searchAssessment = action === "assessment" ? data : getState().environmentalTests.searchAssessment;
    let searchAssessor = action === "assessor" ? data : getState().environmentalTests.searchAssessor;
    let searchExecutor = action === "executor" ? data : getState().environmentalTests.searchExecutor;
    let searchDateFrom = action === "searchDateFrom" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().environmentalTests.searchDateFrom && moment(getState().environmentalTests.searchDateFrom).format("YYYY-MM-DD"));
    let searchDateTo = action === "searchDateTo" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().environmentalTests.searchDateTo && moment(getState().environmentalTests.searchDateTo).format("YYYY-MM-DD"));
    if (searchSpecimenType === undefined && searchAssessment === undefined && searchAssessor === undefined && searchExecutor === undefined &&
      searchDateFrom === undefined && searchDateTo === undefined) {
    } else {
      dispatch(
        updateData({
          searchSpecimenType: searchSpecimenType,
          searchAssessment: searchAssessment,
          searchAssessor: searchAssessor,
          searchExecutor: searchExecutor,
          searchDateFrom: searchDateFrom,
          searchDateTo: searchDateTo,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().environmentalTests.size || 10;
    let specimenType = getState().environmentalTests.searchSpecimenType;
    let assessment = getState().environmentalTests.searchAssessment;
    let assessor = getState().environmentalTests.searchAssessor;
    let executor = getState().environmentalTests.searchExecutor;
    let actDateFrom = getState().environmentalTests.searchDateFrom;
    let actDateTo = getState().environmentalTests.searchDateTo;
    environmentalTestsProvider.search(page, size, specimenType, actDateFrom, actDateTo, assessment, assessor, executor, undefined).then(s => {
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
      environmentalTestsProvider
        .getById(id)
        .then(s => {
          if (s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                lines: s.data.lines,
                assessment: s.data.assessment,
                assessor: s.data.assessor,
                assessorId: s.data.assessorId,
                executor: s.data.executor,
                executorId: s.data.executorId,
                actDate: s.data.actDate,
                location: s.data.location,
                mdEnvironmentalId: s.data.mdEnvironmentalId,
                specimenType: s.data.specimenType,
                specimenTypeId: s.data.specimenTypeId
              })
            );
            resolve(s.data);
            return;
          } else {
            snackbar.show("Không tìm thấy kết quả phù hợp", "danger");
            reject(s);
          }
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


function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().environmentalTests.id;
      let specimenTypeId = getState().environmentalTests.specimenTypeId;
      let mdEnvironmentalId = getState().environmentalTests.mdEnvironmentalId;
      let assessment = getState().environmentalTests.assessment;
      let assessor = getState().environmentalTests.assessor;
      let executor = getState().environmentalTests.executor;
      let actDate = getState().environmentalTests.actDate;
      let location = getState().environmentalTests.location;
      let lines = getState().environmentalTests.lines;
      environmentalTestsProvider
        .createOrEdit(id, specimenTypeId, mdEnvironmentalId, assessment, assessor, executor, actDate, lines, location)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                specimenType: "",
                assessment: "",
                assessor: "",
                executor: "",
                actDate: "",
                lines: "",
                location: "",
                searchSpecimenType: "",
                searchAssessment: "",
                searchAssessor: "",
                searchExecutor: "",
                dataIndex: "",
              })
            );
            if (!id) {
              snackbar.show("Thêm mới dữ liệu thành công", "success");
            } else {
              snackbar.show("Cập nhật dữ liệu thành công", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm mới dữ liệu không thành công", "danger");
            } else {
              snackbar.show(s.message || "Cập nhật dữ liệu không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm mới dữ liệu không thành công", "danger");
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
        content: `Bạn có muốn xóa ${(item.specimenType || {}).name} ngày ${item.actDate && moment(item.actDate).format("DD-MM-YYYY")}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          environmentalTestsProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa dữ liệu thành công", "success");
                let data = getState().environmentalTests.data || [];
                let index = data.findIndex(x => x.id === item.id);
                if (index !== -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data],
                    searchSpecimenType: "",
                    searchAssessment: "",
                    searchAssessor: "",
                    searchExecutor: "",
                  })
                );
                resolve();
              } else {
                snackbar.show("Xóa dữ liệu không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa dữ liệu không thành công", "danger");
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
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onDeleteItem,
  loadDetail
};
