import quanLyDoVaiProvider from "@data-access/quan-ly-do-vai-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
import moment from 'moment';
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "QUAN-LY-DO-VAI-UPDATE-DATA",
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
    let searchNameDungcu = action === "dmDungCuTen" ? data : getState().quanLyDoVai.searchNameDungcu;
    let searchSoLuong = action === "soLuong" ? data: getState().quanLyDoVai.searchSoLuong;
    let searchKhoaBanGiao = action === "tenKhoaBanGiao" ? data: getState().quanLyDoVai.searchKhoaBanGiao;
    let searchTrangThai = action === "trangThai" ? data : getState().quanLyDoVai.searchTrangThai;
    let searchThoiGianThucHienTu = action === "thoiGianThucHienTu" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().quanLyDoVai.searchThoiGianThucHienTu && moment(getState().quanLyDoVai.searchThoiGianThucHienTu).format("YYYY-MM-DD"));
    let searchThoiGianThucHienDen = action === "thoiGianThucHienDen" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().quanLyDoVai.searchThoiGianThucHienDen && moment(getState().quanLyDoVai.searchThoiGianThucHienDen).format("YYYY-MM-DD"));
    let searchThoiGianBanGiaoTu = action === "thoiGianBanGiaoTu" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().quanLyDoVai.searchThoiGianBanGiaoTu && moment(getState().quanLyDoVai.searchThoiGianBanGiaoTu).format("YYYY-MM-DD"));
    let searchThoiGianBanGiaoDen = action === "thoiGianBanGiaoDen" ? (data && moment(data).format("YYYY-MM-DD")) :
      (getState().quanLyDoVai.searchThoiGianBanGiaoDen && moment(getState().quanLyDoVai.searchThoiGianBanGiaoDen).format("YYYY-MM-DD"));
    if (searchNameDungcu === undefined && searchSoLuong === undefined && searchKhoaBanGiao===undefined && searchTrangThai===undefined
      && searchThoiGianThucHienTu===undefined && searchThoiGianThucHienDen===undefined && searchThoiGianBanGiaoTu===undefined && searchThoiGianBanGiaoDen===undefined) {
    } else {
      dispatch(
        updateData({
          searchNameDungcu: searchNameDungcu,
          searchSoLuong: searchSoLuong,
          searchKhoaBanGiao: searchKhoaBanGiao,
          searchTrangThai: searchTrangThai,
          searchThoiGianThucHienTu: searchThoiGianThucHienTu,
          searchThoiGianThucHienDen: searchThoiGianThucHienDen,
          searchThoiGianBanGiaoTu: searchThoiGianBanGiaoTu,
          searchThoiGianBanGiaoDen: searchThoiGianBanGiaoDen,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().quanLyDoVai.size || 10;
    let dmDungCuTen = getState().quanLyDoVai.searchNameDungcu;
    let soLuong = getState().quanLyDoVai.searchSoLuong;
    let tenKhoaBanGiao = getState().quanLyDoVai.searchKhoaBanGiao;
    let trangThai= getState().quanLyDoVai.searchTrangThai;
    let thoiGianThucHienTu = getState().quanLyDoVai.searchThoiGianThucHienTu;
    let thoiGianThucHienDen = getState().quanLyDoVai.searchThoiGianThucHienDen;
    let thoiGianBanGiaoTu = getState().quanLyDoVai.searchThoiGianBanGiaoTu;
    let thoiGianBanGiaoDen = getState().quanLyDoVai.searchThoiGianBanGiaoDen;
    quanLyDoVaiProvider.search(page, size, dmDungCuTen, soLuong,tenKhoaBanGiao, trangThai,thoiGianThucHienTu,
      thoiGianThucHienDen,thoiGianBanGiaoTu,thoiGianBanGiaoDen, undefined).then(s => {
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
      quanLyDoVaiProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                dmDungCuId: s.data.dmDungCuId,
                dmDungCu: s.data.dmDungCu,
                soLuong: s.data.soLuong,
                khoaBanGiaoId: s.data.khoaBanGiaoId,
                khoaBanGiao: s.data.khoaBanGiao,
                thoiGianBanGiao: s.data.thoiGianBanGiao,
                thoiGianThucHien: s.data.thoiGianThucHien,
                trangThai: s.data.trangThai,                
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

function loadList(loai) {
  return (dispatch) => {
    quanLyDoVaiProvider.search(0, 1000, "", "",loai).then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              quanLyDoVai: s.data,
              total: s.totalElements,
            })
          );
          break;
      }
    });
  };
}

function loadData() {
  return (dispatch) => {
    quanLyDoVaiProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              quanLyDoVai: s.data,
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
      let id = getState().quanLyDoVai.id;
      let active = true;
      let dmDungCuId = getState().quanLyDoVai.dmDungCuId;
      let soLuong = getState().quanLyDoVai.soLuong;
      let thoiGianBanGiao = getState().quanLyDoVai.thoiGianBanGiao;
      let khoaBanGiaoId = getState().quanLyDoVai.khoaBanGiaoId;
      let thoiGianThucHien = getState().quanLyDoVai.thoiGianThucHien;
      let trangThai = getState().quanLyDoVai.trangThai;
      quanLyDoVaiProvider
        .createOrEdit(id, active, dmDungCuId, soLuong, thoiGianBanGiao, khoaBanGiaoId, thoiGianThucHien, trangThai)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                dmDungCuId: "",
                soLuong: "",
                thoiGianBanGiao: null,
                khoaBanGiaoId: "",
                thoiGianThucHien:null,
                trangThai:"",
                active: false,
                isOpen: false
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

function onDeleteItem(item) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      confirm({
        title: "Xác nhận",
        content: `Bạn có muốn xoá ${item.dmDungCu.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          quanLyDoVaiProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa dữ liệu thành công", "success");
                let data = getState().quanLyDoVai.data || [];
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
  loadData,
};
