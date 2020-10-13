import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.quanLyDungCu + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, searchValue, searchName, searchFaculty, searchStatus, searchFromPerform, searchToPerform, searchFromHandover, searchToHandover) {
    let url = constants.api.quanLyDungCu + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (searchValue) url += "&maSoHopDungCu=" + searchValue;
    if (searchName) url += "&name=" + searchName;
    if (searchFaculty) url += "&tenKhoaBanGiao=" + searchFaculty;
    if (searchStatus) url += "&trangThai=" + searchStatus;
    if (searchFromPerform) url += "&thoiGianTietKhuanTu=" + searchFromPerform;
    if (searchToPerform) url += "&thoiGianTietKhuanDen=" + searchToPerform;
    if (searchFromHandover) url += "&thoiGianBanGiaoTu=" + searchFromHandover;
    if (searchToHandover) url += "&thoiGianBanGiaoDen=" + searchToHandover;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.quanLyDungCu + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, maSoHopDungCu, mauDungCuId, ghiChu, trangThai, thoiGianTietKhuan, thoiGianBanGiao, khoaBanGiaoId, chiTiet) {
    if (!id) {
      let url = constants.api.quanLyDungCu;
      return client.requestApi("post", url, {
        maSoHopDungCu,
        mauDungCuId,
        ghiChu,
        trangThai,
        thoiGianTietKhuan,
        thoiGianBanGiao,
        khoaBanGiaoId,
        chiTiet,
      });
    } else {
      let url = constants.api.quanLyDungCu + "/" + id;
      return client.requestApi("put", url, {
        mauDungCuId,
        maSoHopDungCu,
        ghiChu,
        trangThai,
        thoiGianTietKhuan,
        thoiGianBanGiao,
        khoaBanGiaoId,
        chiTiet,
      });
    }
  },
  changeStatus(id, maSoHopDungCu, mauDungCuId, ghiChu, trangThai, thoiGianTietKhuan, thoiGianBanGiao, khoaBanGiaoId, chiTiet) {
    let url = constants.api.quanLyDungCu + "/doi-trang-thai/" + id;
    return client.requestApi("put", url, {
      maSoHopDungCu,
      mauDungCuId,
      ghiChu,
      trangThai,
      thoiGianTietKhuan,
      thoiGianBanGiao,
      khoaBanGiaoId,
      chiTiet
    });
  },
  duyetDungCu(id, maSoHopDungCu, mauDungCuId, ghiChu, trangThai, thoiGianTietKhuan, thoiGianBanGiao, khoaBanGiaoId, chiTiet) {
    let url = constants.api.quanLyDungCu + "/duyet-dung-cu/" + id;
    return client.requestApi("put", url, {
      maSoHopDungCu,
      mauDungCuId,
      ghiChu,
      trangThai,
      thoiGianTietKhuan,
      thoiGianBanGiao,
      khoaBanGiaoId,
      chiTiet
    });
  }
};









