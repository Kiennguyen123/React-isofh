import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.quanLyDoVai + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, dmDungCuTen, soLuong,tenKhoaBanGiao, trangThai,thoiGianThucHienTu,thoiGianThucHienDen,thoiGianBanGiaoTu,thoiGianBanGiaoDen) {
    let url = constants.api.quanLyDoVai + "?sort=createdAt,desc";
    url += "&page=" + (page === 0 ? 0 : page ? page - 1 : 0);
    url += "&size=" + (size || 10);
    if (dmDungCuTen) url += "&dmDungCuTen=" + dmDungCuTen;
    if (soLuong) url += "&soLuong=" + soLuong;
    if (tenKhoaBanGiao) url +="&tenKhoaBanGiao=" + tenKhoaBanGiao;
    if (trangThai) url += "&trangThai=" + trangThai;
    if (thoiGianThucHienTu) url += "&thoiGianThucHienTu=" + thoiGianThucHienTu;
    if (thoiGianThucHienDen) url += "&thoiGianThucHienDen=" + thoiGianThucHienDen;
    if (thoiGianBanGiaoTu) url += "&thoiGianBanGiaoTu=" + thoiGianBanGiaoTu;
    if (thoiGianBanGiaoDen) url += "&thoiGianBanGiaoDen=" + thoiGianBanGiaoDen;
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.quanLyDoVai + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, active, dmDungCuId, soLuong, thoiGianBanGiao, khoaBanGiaoId, thoiGianThucHien,trangThai) {
    if (!id) {
      let url = constants.api.quanLyDoVai;
      return client.requestApi("post", url, {
        dmDungCuId,
        soLuong,
        thoiGianBanGiao,
        khoaBanGiaoId,
        thoiGianThucHien: null,
        trangThai: 10,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.quanLyDoVai + "/" + id;
      return client.requestApi("put", url, {
        dmDungCuId,
        soLuong,
        thoiGianBanGiao,
        khoaBanGiaoId,
        thoiGianThucHien,
        trangThai,
        active: active ? 1 : 0
      });
    }
  }
};
