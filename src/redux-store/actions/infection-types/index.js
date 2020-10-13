import infectionTypeProvider from "@data-access/infection-types-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "INFECTION-TYPES-UPDATE-DATA",
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
    let searchName = action === "searchName" ? data : getState().infectionTypes.searchName;
    let searchValue = action === "searchValue" ? data : getState().infectionTypes.searchValue;
    if (searchName === undefined && searchValue === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: searchName,
          searchValue: searchValue
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().infectionTypes.size || 10;
    let name = getState().infectionTypes.searchName;
    let value = getState().infectionTypes.searchValue;
    let sort = getState().infectionTypes.sort || {};
    let active = getState().infectionTypes.searchActive;
    infectionTypeProvider.search(page, size, name, value, active, undefined, sort).then(s => {
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

function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().infectionTypes.id;
      let name = getState().infectionTypes.name;
      let value = getState().infectionTypes.value;
      infectionTypeProvider
        .createOrEdit(id, name, value)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                value: "",
                searchName: "",
                searchValue: "",
                isOpen: false
              })
            );
            if (!id) {
              snackbar.show("Thêm danh mục loại nhiễm khuẩn thành công", "success");
            } else {
              snackbar.show("Cập nhật danh mục loại nhiễm khuẩn thành công", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm danh mục loại nhiễm khuẩn không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa danh mục loại nhiễm khuẩn không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm danh mục loại nhiễm khuẩn không thành công", "danger");
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
        content: `Bạn có muốn xóa danh mục loại nhiễm khuẩn ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          infectionTypeProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa danh mục loại nhiễm khuẩn thành công", "success");
                let data = getState().infectionTypes.data || [];
                let index = data.findIndex(x => x.id === item.id);
                if (index !== -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data],
                    searchName: "",
                    searchValue: "",
                  })
                );
                resolve();
              } else if (s.code === 605) {
                snackbar.show("Loại nhiễm khuẩn đã được sử dụng, vui lòng kiểm tra lại!", "danger");
                reject();
              } else {
                snackbar.show("Xóa danh mục loại nhiễm khuẩn không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa danh mục loại nhiễm khuẩn không thành công", "danger");
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

function loadList() {
  return (dispatch) => {
    infectionTypeProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              infectionTypes: s.data,
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
};
