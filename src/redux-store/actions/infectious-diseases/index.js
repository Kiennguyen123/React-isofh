import infectiousDiseasesProvider from "@data-access/infectious-diseases-provider";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "INFECTIOUS-DISEASES-UPDATE-DATA",
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
    let searchValue = action === "value" ? data : getState().infectiousDiseases.searchValue;
    let searchName = action === "name" ? data : getState().infectiousDiseases.searchName;
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
    let size = getState().infectiousDiseases.size || 10;
    let name = getState().infectiousDiseases.searchName;
    let value = getState().infectiousDiseases.searchValue;
    infectiousDiseasesProvider.search(page, size, name, value, undefined).then(s => {
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
      infectiousDiseasesProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                value: s.data.value,
                description: s.data.description
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
    infectiousDiseasesProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              infectiousDiseases: s.data,
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
      let id = getState().infectiousDiseases.id;
      let active = true;
      let name = getState().infectiousDiseases.name;
      let value = getState().infectiousDiseases.value;
      let lines = getState().infectiousDiseases.dataIndex
      infectiousDiseasesProvider
        .createOrEdit(id, active, name, value, lines)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                value: "",
                lines: [],
                dataIndex: [],
                active: false,
                isOpen: false
              })
            );
            if (!id) {
              snackbar.show("Thêm mới dữ liệu thành công", "success");
            } else {
              snackbar.show("Cập nhật dữ liệu thành công", "success");
            }
            dispatch(gotoPage(0));
            // dispatch(loadList());
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm mới dữ liệu thành công", "danger");
            } else {
              snackbar.show(s.message || "Cập nhật dữ liệu thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm gói dữ liệu không thành công", "danger");
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
        content: `Bạn có muốn xóa nhóm bệnh  ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          infectiousDiseasesProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa dữ liệu thành công", "success");
                let data = getState().infectiousDiseases.data || [];
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
                snackbar.show("Nhóm bệnh truyền nhiễm đã được sử dụng, vui lòng kiểm tra lại!", "danger");
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
