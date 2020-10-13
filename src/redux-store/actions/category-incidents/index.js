import categoryIncidentsProvider from "@data-access/category-incidents-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "CATEGORY-INCIDENTS-UPDATE-DATA",
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

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().categoryIncidents.size || 10;
    let searchIncidentCode = getState().categoryIncidents.searchIncidentCode;
    let searchIncidentType = getState().categoryIncidents.searchIncidentType;
    let sort = getState().categoryIncidents.sort || {};
    let active = getState().categoryIncidents.searchActive;
    categoryIncidentsProvider.search(page, size, searchIncidentCode, searchIncidentType, active, undefined, sort).then(s => {
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
      let id = getState().categoryIncidents.id;
      let incidentCode = getState().categoryIncidents.incidentCode;
      let incidentType = getState().categoryIncidents.incidentType;
      categoryIncidentsProvider
        .createOrEdit(id, incidentCode, incidentType)
        .then(s => {
          if (s.code === 0) {
            if (!id) {
              snackbar.show("Thêm danh mục loại sự cố thành công", "success");
            } else {
              snackbar.show("Cập nhật danh mục loại sự cố thành công", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm danh mục loại sự cố không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa danh mục loại sự cố không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm danh mục loại sự cố không thành công", "danger");
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
        content: `Bạn có muốn xóa danh mục loại sự cố '${item.incidentType}'?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          categoryIncidentsProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa danh mục loại sự cố thành công", "success");
                let data = getState().categoryIncidents.data || [];
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
                snackbar.show(`Sự cố '${item.incidentType}' đã được sử dụng. Vui lòng kiểm tra lại!`, "danger");
                reject();
              } else {
                snackbar.show("Xóa danh mục loại sự cố không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa danh mục loại sự cố không thành công", "danger");
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
  return (dispatch, getState) => {
    categoryIncidentsProvider.search(0, 1000, "", "").then(s => {
      if (s && s.code === 0) {
        dispatch(
          updateData({
            categoryIncidents: s.data,
            total: s.totalElements,
          })
        );
      }
    });
  };
}

function onSearch(data, action) {
  return (dispatch, getState) => {
    let searchValue = action === "value" ? data : getState().categoryIncidents.searchValue;
    let searchName = action === "name" ? data : getState().categoryIncidents.searchName;
    if (searchValue === undefined && searchName === undefined) {
    } else {
      dispatch(
        updateData({
          searchValue: searchValue,
          searchName: searchName,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

export default {
  onSearch,
  createOrEdit,
  updateData,
  gotoPage,
  onSizeChange,
  onDeleteItem,
  loadList,
};
