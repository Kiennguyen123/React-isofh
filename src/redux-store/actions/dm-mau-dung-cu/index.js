import dmMauDungCuProvider from "@data-access/dm-mau-dung-cu-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "DM-MAU-DUNG-CU-UPDATE-DATA",
      data: data
    });
  };
}

function onSizeChange(size) {
  return (dispatch) => {
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
    let searchName = action === "name" ? item : getState().dmMauDungCu.searchName
    let searchValue = action === "value" ? item : getState().dmMauDungCu.searchValue
    let searchActive = action === "active" ? item : getState().dmMauDungCu.searchActive
    if (searchName === undefined && searchValue === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: searchName,
          searchValue: searchValue,
          searchActive: searchActive,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().dmMauDungCu.size || 10;
    let name = getState().dmMauDungCu.searchName;
    let value = getState().dmMauDungCu.searchValue;
    dmMauDungCuProvider.search(page, size, name, value).then(s => {
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
      dmMauDungCuProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                value: s.data.value,
                dungCuIds: s.data.dungCuIds,
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
    dmMauDungCuProvider.search(0, 1000, "", "").then(s => {
      if (s && s.code === 0) {
        dispatch(
          updateData({
            listData: s.data,
            total: s.totalElements,
          })
        );
      }
    });
  };
}

function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().dmMauDungCu.id;
      let active = true;
      let name = getState().dmMauDungCu.name;
      let value = getState().dmMauDungCu.value;
      let dungCuIds = getState().dmMauDungCu.dungCuIds;
      dmMauDungCuProvider
        .createOrEdit(id, active, name, value, dungCuIds)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                value: "",
                dungCuIds: [],
                active: false,
                isOpen: false,
              })
            );
            if (!id) {
              snackbar.show("Thêm mẫu dụng cụ y tế thành công", "success");
            } else {
              snackbar.show("Cập nhật mẫu dụng cụ y tế thành công", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          }
          else if (s.code === 1303) {
            snackbar.show(`Mã số ${value} đã tồn tại. Vui lòng kiểm tra lại!`, "danger");
            reject();
          }
          else if (s.code === 1302) {
            snackbar.show(`${name} đã tồn tại. Vui lòng kiểm tra lại!`, "danger");
            reject();
          }
          else {
            if (!id) {
              snackbar.show(s.message || "Thêm mẫu dụng cụ y tế không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa mẫu dụng cụ y tế không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm mẫu dụng cụ y tế không thành công", "danger");
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
        content: `Bạn có muốn xóa mẫu dụng cụ y tế ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          dmMauDungCuProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa mẫu dụng cụ y tế thành công", "success");
                let data = getState().dmMauDungCu.data || [];
                let index = data.findIndex(x => x.id === item.id);
                if (index !== -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                resolve();
              }
              else if (s.code === 605) {
                snackbar.show(`${item.name} đã được sử dụng. Vui lòng kiểm tra lại!`, "danger");
                reject();
              }
              else {
                snackbar.show("Xóa mẫu dụng cụ y tế không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa mẫu dụng cụ y tế không thành công", "danger");
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
