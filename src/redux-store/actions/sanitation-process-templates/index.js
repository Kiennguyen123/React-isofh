import sanitationProcessTemplatesProvider from "@data-access/sanitation-process-templates-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "SANITATION-PROCESS-TEMPLATES-UPDATE-DATA",
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
    let searchValue = action === "value" ? data : getState().sanitationProcessTemplates.searchValue;
    let searchName = action === "name" ? data : getState().sanitationProcessTemplates.searchName;
    if (searchName === undefined && searchValue === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: searchName,
          searchValue: searchValue,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().sanitationProcessTemplates.size || 10;
    let name = getState().sanitationProcessTemplates.searchName;
    let value = getState().sanitationProcessTemplates.searchValue;
    sanitationProcessTemplatesProvider.search(page, size, name, value, undefined).then(s => {
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
      sanitationProcessTemplatesProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                value: s.data.value,
                lines: s.data.lines,
                dataIndex: s.data.lines,
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
    sanitationProcessTemplatesProvider.search(0, null, "", "").then(s => {
      if (s && s.code === 0) {
        dispatch(
          updateData({
            sanitationProcessTemplates: s.data,
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
      let id = getState().sanitationProcessTemplates.id;
      let active = true;
      let name = getState().sanitationProcessTemplates.name;
      let value = getState().sanitationProcessTemplates.value;
      let lines = getState().sanitationProcessTemplates.dataIndex
      sanitationProcessTemplatesProvider
        .createOrEdit(id, active, name, value, lines)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: null,
                name: "",
                value: "",
                lines: [],
                dataIndex: [],
                active: false,
                isOpen: false,
              })
            );
            if (!id) {
              snackbar.show("Thêm mẫu quy trình VSMT thành công", "success");
            } else {
              snackbar.show("Cập nhật mẫu quy trình VSMT thành công", "success");
            }
            dispatch(gotoPage(0));
            // dispatch(loadList());
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm mẫu quy trình VSMT không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa mẫu quy trình VSMT không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm mẫu quy trình VSMT không thành công", "danger");
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
        content: `Bạn có muốn xóa mẫu quy trình VSMT ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          sanitationProcessTemplatesProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa mẫu quy trình VSMT thành công", "success");
                let data = getState().sanitationProcessTemplates.data || [];
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
                snackbar.show("Xóa mẫu quy trình VSMT không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa mẫu quy trình VSMT không thành công", "danger");
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
