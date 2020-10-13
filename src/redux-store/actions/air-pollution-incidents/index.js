import airPollutionIncidentsProvider from "@data-access/air-pollution-incidents-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "AIR-POLLUTION-INCIDENTS-UPDATE-DATA",
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
    let searchName = action === "name" ? data : getState().airPollutionIncidents.searchName;
    let searchStageIncident = action === "stageIncident" ? data : getState().airPollutionIncidents.searchsearchStageIncident;
    let searchFromDate = action === "fromDate" ? (data && new Date(data).format("YYYY-MM-dd")) :
      (getState().airPollutionIncidents.searchFromDate && new Date(getState().airPollutionIncidents.searchFromDate).format("YYYY-MM-dd"));
    let searchToDate = action === "toDate" ? (data && new Date(data).format("YYYY-MM-dd")) :
      (getState().airPollutionIncidents.searchToDate && new Date(getState().airPollutionIncidents.searchToDate).format("YYYY-MM-dd"));
    if (searchName === undefined && searchStageIncident === undefined && searchFromDate === undefined && searchToDate === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: searchName,
          searchStageIncident: searchStageIncident,
          searchFromDate: searchFromDate,
          searchToDate: searchToDate,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().airPollutionIncidents.size || 10;
    let name = getState().airPollutionIncidents.searchName;
    let stageIncident = getState().airPollutionIncidents.searchStageIncident;
    let fromDate = getState().airPollutionIncidents.searchFromDate;
    let toDate = getState().airPollutionIncidents.searchToDate;
    let sort = getState().airPollutionIncidents.sort || {};
    let active = getState().airPollutionIncidents.searchActive;
    airPollutionIncidentsProvider.search(page, size, name, stageIncident, fromDate, toDate, active, undefined, sort).then(s => {
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
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      airPollutionIncidentsProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                reason: s.data.reason,
                arena: s.data.arena,
                stageIncident: s.data.stageIncident,
                typeIncidentId: s.data.typeIncidentId,
                status: s.data.status,
                handling: s.data.handling,
                fromDate: s.data.fromDate,
                toDate: s.data.toDate,
                conclusion: s.data.conclusion,
                detailRating: s.data.detailRating,
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


function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().airPollutionIncidents.id;
      let name = getState().airPollutionIncidents.name;
      let typeIncidentId = getState().airPollutionIncidents.typeIncidentId;
      let stageIncident = getState().airPollutionIncidents.stageIncident;
      let reason = getState().airPollutionIncidents.reason;
      let arena = getState().airPollutionIncidents.arena;
      let fromDate = getState().airPollutionIncidents.fromDate;
      let toDate = getState().airPollutionIncidents.toDate;
      let status = getState().airPollutionIncidents.status;
      let handling = getState().airPollutionIncidents.handling;
      let conclusion = getState().airPollutionIncidents.conclusion;
      let detailRating = getState().airPollutionIncidents.detailRating;
      airPollutionIncidentsProvider
        .createOrEdit(id, name, typeIncidentId, stageIncident, reason, arena, fromDate, toDate, status, handling, conclusion, detailRating)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                typeIncidentId: "",
                stageIncident: "",
                reason: "",
                arena: "",
                fromDate: "",
                toDate: "",
                status: "",
                handling: "",
                detailRating: "",
              })
            );
            if (!id) {
              snackbar.show("Thêm mới dữ liệu thành công!", "success");
            } else {
              snackbar.show("Cập nhật dữ liệu thành công", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm mới dữ liệu không thành công!", "danger");
            } else {
              snackbar.show(s.message || "Cập nhật dữ liệu không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm mới dữ liệu không thành công!", "danger");
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
        content: `Bạn có muốn xóa sự cố ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          airPollutionIncidentsProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa dữ liệu thành công", "success");
                let data = getState().airPollutionIncidents.data || [];
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
