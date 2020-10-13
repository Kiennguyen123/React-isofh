import dmDungCu from "@data-access/dm-dung-cu-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "DM-DUNG-CU-UPDATE-DATA",
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

function onSearch(data, action) {
  return (dispatch, getState) => {
    let searchValue = action === "value" ? data : getState().dmDungcu.searchValue;
    let searchName = action === "name" ? data : getState().dmDungcu.searchName;
    let searchLoai = action === "loai" ? data : getState().dmDungcu.searchLoai;
    if (searchValue === undefined && searchName === undefined && searchLoai === undefined) {
    } else {
      dispatch(
        updateData({
          searchValue: searchValue,
          searchName: searchName,
          searchLoai: searchLoai,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().dmDungcu.size || 10;
    let value = getState().dmDungcu.searchValue;
    let name = getState().dmDungcu.searchName;
    let loai = getState().dmDungcu.searchLoai;
    dmDungCu.search(page, size, value, name, loai).then(s => {
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

function loadListMedical() {
  return (dispatch) => {
    dmDungCu.search(0, 1000, "", "", 20).then(s => {
      if (s && s.code === 0) {
        dispatch(
          updateData({
            listMedical: s.data,
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
      let id = getState().dmDungcu.id;
      let name = getState().dmDungcu.name;
      let value = getState().dmDungcu.value;
      let loai = getState().dmDungcu.loai;
      dmDungCu
        .createOrEdit(id, value, name, loai)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                isOpen: false,
                id: "",
                value: "",
                name: "",
                loai: "",
              })
            );
            if (!id) {
              snackbar.show("Thêm mới dữ liệu thành công!", "success");
            } else {
              snackbar.show("Cập nhật dữ liệu thành công!", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          } else if (s.code === 1602) {
            snackbar.show(`${name} đã tồn tại. Vui lòng kiểm tra lại!`, "danger");
          }
          else if (s.code === 1603) {
            snackbar.show(`${value} đã tồn tại. Vui lòng kiểm tra lại!`, "danger");
          }
          else if (s.code === 1604) {
            snackbar.show(`${name} đã được sử dụng. Vui lòng kiểm tra lại!`, "danger");
          }
          else {
            if (!id) {
              snackbar.show(s.message || "Thêm mới dữ liệu không thành công!", "danger");
            } else {
              snackbar.show(s.message || "Cập nhật dữ liệu không thành công!", "danger");
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
        content: `Bạn có muốn xóa ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          dmDungCu
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa dữ liệu thành công!", "success");
                let data = getState().dmDungcu.data || [];
                let index = data.findIndex(x => x.id === item.id);
                if (index !== -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                resolve();
              } else if (s.code === 605) {
                snackbar.show(`${item.name} đã được sử dụng. Vui lòng kiểm tra lại!`, "danger");
                reject();
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

function loadList(value, name, loai) {
  return (dispatch) => {
    dmDungCu.search(0, 1000, value, name, loai).then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              dmDungCu: s.data,
              total: s.totalElements,
            })
          );
          break;
      }
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
  loadList,
  loadListMedical
};
