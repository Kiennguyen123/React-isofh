import mdEnvironmentalTestsProvider from "@data-access/md-environmental-tests-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "MD-ENVIRONMENTAL-TEST-UPDATE-DATA",
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

function onSearch(value, name, active) {
  return (dispatch) => {
    if (name === undefined && value === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: name,
          searchValue: value,
          searchActive: active
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().mdEnvironmentalTests.size || 10;
    mdEnvironmentalTestsProvider.search(page, size).then(s => {
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
      mdEnvironmentalTestsProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                value: s.data.value,
                specimenTypeId: s.data.specimenTypeId,
                lines: s.data.lines,
                specimenType: s.data.specimenType
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

function loadList(specimenTypeId) {
  return (dispatch) => {
    mdEnvironmentalTestsProvider.search(0, 1000, specimenTypeId, "").then(s => {
      if (s && s.code === 0) {
        dispatch(
          updateData({
            mdEnvironmentalTests: s.data,
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
      let id = getState().mdEnvironmentalTests.id;
      let active = true;
      let name = getState().mdEnvironmentalTests.name;
      let value = getState().mdEnvironmentalTests.value;
      let specimenTypeId = getState().mdEnvironmentalTests.specimenTypeId;
      let lines = getState().mdEnvironmentalTests.lines
      mdEnvironmentalTestsProvider
        .createOrEdit(id, active, name, value, specimenTypeId, lines)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                value: "",
                specimenTypeId: "",
                lines: [],
                active: false,
              })
            );
            if (!id) {
              snackbar.show("Thêm gói xét nghiệm môi trường thành công", "success");
            } else {
              snackbar.show("Cập nhật gói xét nghiệm môi trường thành công", "success");
            }
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm gói xét nghiệm môi trường không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa gói xét nghiệm môi trường không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm gói xét nghiệm môi trường không thành công", "danger");
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
        content: `Bạn có muốn xóa gói xét nghiệm môi trường ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          mdEnvironmentalTestsProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa gói xét nghiệm môi trường thành công", "success");
                let data = getState().mdEnvironmentalTests.data || [];
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
                snackbar.show("Gói xét nghiệm đã được sử dụng, vui lòng kiểm tra lại!", "danger");
                reject();

              } else {
                snackbar.show("Xóa gói xét nghiệm môi trường không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa gói xét nghiệm môi trường không thành công", "danger");
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
