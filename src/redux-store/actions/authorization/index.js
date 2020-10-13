import authorizationProvider from "@data-access/authorization-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "AUTHORIZATION-DATA",
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

function onSearch() {
  return (dispatch, getState) => {
    let searchUserName = getState().authorization.searchUserName;
    let searchFullName = getState().authorization.searchFullName;
    let searchKhoa = getState().authorization.searchKhoa;
    let searchRoleId = getState().authorization.searchRoleId;
    if (searchUserName === undefined && searchFullName === undefined && searchKhoa === undefined && searchRoleId === undefined) {
    } else {
      dispatch(
        updateData({
          searchUserName: searchUserName,
          searchFullName: searchFullName,
          searchKhoa: searchKhoa,
          searchRoleId: searchRoleId,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().authorization.size || 10;
    let searchUserName = getState().authorization.searchUserName;
    let searchFullName = getState().authorization.searchFullName;
    let searchKhoa = getState().authorization.searchKhoa;
    let searchRoleId = getState().authorization.searchRoleId;
    authorizationProvider.search(page, size, searchUserName, searchFullName, searchKhoa, searchRoleId).then(s => {
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
      authorizationProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
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

function loadListUserName(page, username, departmentId) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().authorization.size || 1000;
    authorizationProvider.searchFull(page, size, username, departmentId).then(s => {
      if (s && s.code === 0) {
        dispatch(
          updateData({
            total: s.totalElements || size,
            dataUserName: s.data || []
          })
        );
      }
    });
  };
}

function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().authorization.id;
      let username = getState().authorization.username;
      let fullName = getState().authorization.fullName;
      let departmentId = getState().authorization.departmentId;
      let roleId = getState().authorization.roleId;
      authorizationProvider
        .createOrEdit(id, username, fullName, departmentId, roleId)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
              })
            );
            if (!id) {
              snackbar.show("Thêm dữ liệu thành công", "success");
            } else {
              snackbar.show("Phân quyền dữ liệu thành công", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm dữ liệu không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa dữ liệu không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm dữ liệu không thành công", "danger");
          reject();
        });
    });
  };
}

function resetAccount() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().authorization.id;
      let username = getState().authorization.username;
      let fullName = getState().authorization.fullName;
      let departmentId = getState().authorization.departmentId;
      let roleId = 6;
      confirm({
        title: "Xác nhận",
        content: `Bạn có muốn chuyển tài khoản ${username} về loại tài khoản mặc định?`,
        okText: "Đồng ý",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          authorizationProvider
            .reset(id, username, fullName, departmentId, roleId)
            .then(s => {
              if (s.code === 0) {
                dispatch(
                  updateData({
                    id: "",
                  })
                );
                snackbar.show("Reset tài khoản thành công", "success");
                dispatch(gotoPage(0));
                resolve(s.data);
              } else {
                snackbar.show(s.message || "Reset tài khoản không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Reset tài khoản không thành công", "danger");
              reject();
            });
        },
        onCancel() {
          dispatch(
            updateData({
              id: "",
            })
          );
          reject();
        }
      });
    });
  };
}

export default {
  createOrEdit,
  resetAccount,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  loadListUserName,
  loadDetail
};
