import quanLyDungCu from "@data-access/quan-ly-dung-cu-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "QUAN-LY-DUNG-CU-UPDATE-DATA",
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
    let searchValue = action === "searchValue" ? data : getState().quanLyDungCu.searchValue;
    let searchName = action === "searchName" ? data : getState().quanLyDungCu.searchName;
    let searchFaculty = action === "searchFaculty" ? data : getState().quanLyDungCu.searchFaculty;
    let searchStatus = action === "searchStatus" ? data : getState().quanLyDungCu.searchStatus;

    let searchFromPerform = action === "searchFromPerform" ? (data && new Date(data).format("YYYY-MM-dd")) :
      (getState().quanLyDungCu.searchFromPerform && new Date(getState().quanLyDungCu.searchFromPerform).format("YYYY-MM-dd"));

    let searchToPerform = action === "searchToPerform" ? (data && new Date(data).format("YYYY-MM-dd")) :
      (getState().quanLyDungCu.searchToPerform && new Date(getState().quanLyDungCu.searchToPerform).format("YYYY-MM-dd"));

    let searchFromHandover = action === "searchFromHandover" ? (data && new Date(data).format("YYYY-MM-dd")) :
      (getState().quanLyDungCu.searchFromHandover && new Date(getState().quanLyDungCu.searchFromPerform).format("YYYY-MM-dd"));

    let searchToHandover = action === "searchToHandover" ? (data && new Date(data).format("YYYY-MM-dd")) :
      (getState().quanLyDungCu.searchToHandover && new Date(getState().quanLyDungCu.searchToHandover).format("YYYY-MM-dd"));

    if (searchValue === undefined && searchName === undefined && searchFaculty === undefined && searchStatus === undefined &&
      searchFromPerform === undefined && searchToPerform === undefined && searchFromHandover === undefined && searchToHandover === undefined) {
    } else {
      dispatch(
        updateData({
          searchValue: searchValue,
          searchName: searchName,
          searchFaculty: searchFaculty,
          searchStatus: searchStatus,
          searchFromPerform: searchFromPerform,
          searchToPerform: searchToPerform,
          searchFromHandover: searchFromHandover,
          searchToHandover: searchToHandover,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().quanLyDungCu.size || 10;
    let searchValue = getState().quanLyDungCu.searchValue;
    let searchName = getState().quanLyDungCu.searchName;
    let searchFaculty = getState().quanLyDungCu.searchFaculty;
    let searchStatus = getState().quanLyDungCu.searchStatus;
    let searchFromPerform = getState().quanLyDungCu.searchFromPerform;
    let searchToPerform = getState().quanLyDungCu.searchToPerform;
    let searchFromHandover = getState().quanLyDungCu.searchFromHandover;
    let searchToHandover = getState().quanLyDungCu.searchToHandover;
    quanLyDungCu.search(page, size, searchValue, searchName, searchFaculty, searchStatus, searchFromPerform, searchToPerform, searchFromHandover, searchToHandover).then(s => {
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
      quanLyDungCu
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                maSoHopDungCu: s.data.maSoHopDungCu,
                mauDungCuId: s.data.mauDungCuId,
                trangThai: s.data.trangThai,
                ghiChuT: s.data.ghiChu,
                thoiGianTietKhuan: s.data.thoiGianTietKhuan,
                khoaBanGiao: s.data.khoaBanGiao,
                khoaBanGiaoId: s.data.khoaBanGiaoId,
                thoiGianBanGiao: s.data.thoiGianBanGiao,
                chiTiet: s.data.chiTiet && s.data.chiTiet.length ? s.data.chiTiet.map(item => {
                  return ({
                    ghiChu: item.ghiChu,
                    dmDungCuId: item.dmDungCuId,
                    soLuong: item.soLuong
                  })
                }) : [],
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
    quanLyDungCu.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              quanLyDungCu: s.data,
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
      let id = getState().quanLyDungCu.id;
      let maSoHopDungCu = getState().quanLyDungCu.maSoHopDungCu;
      let mauDungCuId = getState().quanLyDungCu.mauDungCuId;
      let ghiChu = getState().quanLyDungCu.ghiChuT;
      let trangThai = getState().quanLyDungCu.trangThai || 10;
      let thoiGianTietKhuan = getState().quanLyDungCu.thoiGianTietKhuan;
      let thoiGianBanGiao = getState().quanLyDungCu.thoiGianBanGiao;
      let khoaBanGiaoId = getState().quanLyDungCu.khoaBanGiaoId;
      let chiTiet = getState().quanLyDungCu.chiTiet;
      if (chiTiet.length > 0) {
        quanLyDungCu
          .createOrEdit(id, maSoHopDungCu, mauDungCuId, ghiChu, trangThai, thoiGianTietKhuan, thoiGianBanGiao, khoaBanGiaoId, chiTiet)
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
                snackbar.show("Cập nhật dữ liệu thành công", "success");
              }
              dispatch(gotoPage(0));
              resolve(s.data);
            } else {
              if (!id) {
                snackbar.show(s.message || "Thêm dữ liệu không thành công", "danger");
              } else {
                snackbar.show(s.message || "Cập nhật dữ liệu không thành công", "danger");
              }
              reject();
            }
          })
          .catch(e => {
            snackbar.show("Thêm dữ liệu không thành công", "danger");
            reject();
          });
      } else {
        snackbar.show("Phải có ít nhất một dụng cụ", "danger");
      }
    });
  };
}

function changeStatus() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().quanLyDungCu.id;
      let maSoHopDungCu = getState().quanLyDungCu.maSoHopDungCu;
      let mauDungCuId = getState().quanLyDungCu.mauDungCuId;
      let ghiChu = getState().quanLyDungCu.ghiChu;
      let trangThai = getState().quanLyDungCu.trangThai;
      let thoiGianTietKhuan = getState().quanLyDungCu.thoiGianTietKhuan;
      let thoiGianBanGiao = getState().quanLyDungCu.thoiGianBanGiao;
      let khoaBanGiaoId = getState().quanLyDungCu.khoaBanGiaoId;
      let chiTiet = getState().quanLyDungCu.chiTiet;
      quanLyDungCu
        .changeStatus(id, maSoHopDungCu, mauDungCuId, ghiChu, trangThai, thoiGianTietKhuan, thoiGianBanGiao, khoaBanGiaoId, chiTiet)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
              })
            );
            snackbar.show("Chuyển trạng thái thành công", "success");
            dispatch(gotoPage(0));
            resolve(s.data);
          } else {
            snackbar.show(s.message || "Cập nhật trạng thái không thành công", "danger");
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Cập nhật trạng thái không thành công", "danger");
          reject();
        });
    });
  };
}

function duyetDungCu() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().quanLyDungCu.id;
      let maSoHopDungCu = getState().quanLyDungCu.maSoHopDungCu;
      let mauDungCuId = getState().quanLyDungCu.mauDungCuId;
      let ghiChu = getState().quanLyDungCu.ghiChu;
      let trangThai = 20;
      let thoiGianTietKhuan = getState().quanLyDungCu.thoiGianTietKhuan;
      let thoiGianBanGiao = getState().quanLyDungCu.thoiGianBanGiao;
      let khoaBanGiaoId = getState().quanLyDungCu.khoaBanGiaoId;
      let chiTiet = getState().quanLyDungCu.chiTiet;
      quanLyDungCu
        .duyetDungCu(id, maSoHopDungCu, mauDungCuId, ghiChu, trangThai, thoiGianTietKhuan, thoiGianBanGiao, khoaBanGiaoId, chiTiet)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
              })
            );
            snackbar.show("Duyệt dụng cụ thành công", "success");
            dispatch(gotoPage(0));
            resolve(s.data);
          } else {
            snackbar.show(s.message || "Duyệt dụng cụ không thành công", "danger");
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Duyệt dụng cụ không thành công", "danger");
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
        content: `Bạn có muốn xoá hộp dụng cụ mã '${item.maSoHopDungCu}'?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          quanLyDungCu
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa dữ liệu thành công", "success");
                let data = getState().quanLyDungCu.data || [];
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
  changeStatus,
  duyetDungCu
};
