import sanitationProcessesProvider from "@data-access/sanitation-processes-provider";
import snackbar from "@utils/snackbar-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "SANITATION-PROCESSES-UPDATE-DATA",
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
    let searchName = action === "name" ? item : getState().sanitationProcesses.searchName
    let searchLocation = action === "location" ? item : getState().sanitationProcesses.searchLocation
    let searchFromDate = action === "searchFromDate" ? (item && moment(item).format("YYYY-MM-DD")) :
      (getState().sanitationProcesses.searchFromDate && moment(getState().sanitationProcesses.searchFromDate).format("YYYY-MM-DD"))
    let searchToDate = action === "searchToDate" ? (item && moment(item).format("YYYY-MM-DD")) :
      (getState().sanitationProcesses.searchToDate && moment(getState().sanitationProcesses.searchToDate).format("YYYY-MM-DD"))
    let searchResult = action === "result" ? item : getState().sanitationProcesses.searchResult
    if (searchName === undefined && searchLocation === undefined && searchToDate === undefined && searchFromDate === undefined && searchResult === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: searchName,
          searchLocation: searchLocation,
          searchToDate: searchToDate,
          searchFromDate: searchFromDate,
          searchResult: searchResult
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().sanitationProcesses.size || 10;
    let name = getState().sanitationProcesses.searchName
    let location = getState().sanitationProcesses.searchLocation
    let toDate = getState().sanitationProcesses.searchToDate
    let fromDate = getState().sanitationProcesses.searchFromDate
    let result = getState().sanitationProcesses.searchResult
    sanitationProcessesProvider.search(page, size, name, location, fromDate, toDate, result).then(s => {
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
      sanitationProcessesProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                location: s.data.location,
                fromDate: s.data.fromDate,
                toDate: s.data.toDate,
                result: s.data.result,
                status: s.data.status,
                executor: s.data.executor,
                note: s.data.note,
                lines: s.data.lines,
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
  return (dispatch, getState) => {
    sanitationProcessesProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              sanitationProcesses: s.data,
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
      let id = getState().sanitationProcesses.id;
      let active = true;
      let name = getState().sanitationProcesses.name;
      let location = getState().sanitationProcesses.location;
      let fromDate = getState().sanitationProcesses.fromDate;
      let toDate = getState().sanitationProcesses.toDate;
      let result = getState().sanitationProcesses.result;
      let status = getState().sanitationProcesses.status;
      let executor = getState().sanitationProcesses.executor;
      let note = getState().sanitationProcesses.note;
      let lines = getState().sanitationProcesses.lines;
      sanitationProcessesProvider
        .createOrEdit(id, active, name, location, fromDate, toDate, result, status, executor, note, lines)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                location: "",
                fromDate: null,
                toDate: null,
                result: "",
                status: "",
                executor: "",
                note: "",
                lines: [],
                content: "",
                executorLines: "",
                actDate: "",
                statusLines: "",
                noteLines: "",
                active: false,
                sanitationProcessTemplatesId: ""
              })
            );
            if (!id) {
              snackbar.show("Thêm lịch và quy trình vệ sinh môi trường Bệnh viện thành công", "success");
            } else {
              snackbar.show("Cập nhật lịch và quy trình vệ sinh môi trường Bệnh viện thành công", "success");

            }
            // dispatch(gotoPage());
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm lịch và quy trình vệ sinh môi trường Bệnh viện không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa lịch và quy trình vệ sinh môi trường Bệnh viện không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm lịch và quy trình vệ sinh môi trường Bệnh viện không thành công", "danger");
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
        content: `Bạn có muốn xóa lịch và quy trình vệ sinh môi trường Bệnh viện ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          sanitationProcessesProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa lịch và quy trình vệ sinh môi trường Bệnh viện thành công", "success");
                let data = getState().sanitationProcesses.data || [];
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
                snackbar.show("Xóa lịch và quy trình vệ sinh môi trường Bệnh viện không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa lịch và quy trình vệ sinh môi trường Bệnh viện không thành công", "danger");
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
