import userProvider from "@data-access/user-provider";
import constants from "@strings";
import snackbar from "../../../utils/snackbar-utils";
import clientUtils from "@utils/client-utils";

function getDetailUser() {
  return (dispath, getState) => {
    userProvider
      .getDetailUser()
      .then(s => {
        if (s && s.code === 0)
          dispath(
            updateData({
              detail: s.data
            })
          );
        else
          dispath(
            updateData({
              detail: null
            })
          );
      })
      .catch(e => {
        dispath(
          updateData({
            detail: null
          })
        );
      });
  };
}
function onLogin(redirect_uri, code) {
  return (dispath, getState) => {
    return new Promise((resolve, reject) => {
      if (!redirect_uri || !code) {
        snackbar.show("Thông tin đăng nhập không chính xác", "error");
        reject();
        return;
      }
      userProvider.login(redirect_uri, code).then(res => {
        switch (res.code) {
          case 0:
            snackbar.show(constants.text.user.success_login, "success");
            dispath(
              updateData({
                auth: res.data,
                detail: null
              })
            );
            resolve(res.data);
            return;
        }
        reject("Đăng nhập không thành công");
      }).catch(e => {
        reject(e);
        console.log(e);
      });
    });
  };
}
function updateData(data) {
  return dispatch => {
    dispatch({
      type: "AUTH-UPDATE-DATA",
      data: data
    });
  };
}
export default {
  onLogin,
  onLogout(query) {
    return dispatch => {
      return new Promise((resolve, reject) => {
        localStorage.clear()
        window.location.href =
          clientUtils.serverApi + "/auth/logout?redirect_uri=" +
          window.location.origin +
          (query ? query : "");
        resolve();
      });
    };
  },
  updateData,
  getDetailUser
};
