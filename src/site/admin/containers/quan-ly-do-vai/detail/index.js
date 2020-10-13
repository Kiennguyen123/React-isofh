import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionQuanLyDoVai from "@actions/quan-ly-do-vai";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment';
import DataContants from "@config/data-contants";
function index(props) {
  const id = props.match.params.id;
  const getTrangThai = (item) => {
    var trangThai = DataContants.listTrangThai.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (trangThai.length > 0)
      return trangThai[0];
    return {};
  }
  useEffect(() => {
    if (id) {
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/fabric-sterilization");
      });
    }
    else {
      props.updateData({
        id: null,
        dmDungCuId: "",
        soLuong: "",
        khoaBanGiaoId: "",
        trangThai: "",
        thoiGianThucHien: null,
        thoiGianBanGiao: null,
      });
    }
  }, []);
  const onClose = () => {
    props.history.push("/fabric-sterilization");
    props.updateData({
      id: null,
      dmDungCuId: "",
      soLuong: "",
      khoaBanGiaoId: "",
      trangThai: "",
      thoiGianThucHien: null,
      thoiGianBanGiao: null,
    });
  };
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option === "ROLE_user_ql_nhiem_khuan" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage className="quan-ly-do-vai">
              <Panel
                title="Chi tiết danh sách thanh trùng đồ vải"
                id={"quan-ly-do-vai"}
                allowClose={false}
                allowCollapse={false}
              >
                <div className="detail-body row">
                  <div className="col-md-6">
                    <InputDetail
                      width={4}
                      title="Tên sản phẩm: "
                      value={props.dmDungCu && props.dmDungCu.name}
                    />
                    <InputDetail
                      width={4}
                      title="Số lượng: "
                      value={props.soLuong}
                    />
                    <InputDetail
                      width={4}
                      title="Thời gian nhận: "
                      value={props.thoiGianBanGiao}
                    />
                    <InputDetail
                      width={4}
                      title="Khoa bàn giao: "
                      value={props.khoaBanGiao && props.khoaBanGiao.name}
                    />
                  </div>
                  <div className="col-md-6">
                    <InputDetail
                      width={4}
                      title="Trạng thái: "
                      value={getTrangThai(props.trangThai) ? getTrangThai(props.trangThai).name : null}
                    />
                    <InputDetail
                      width={4}
                      title="Thời gian thực hiện: "
                      value={props.thoiGianThucHien}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    borderTop: "1px solid #e9e9e9",
                    padding: "16px 16px 0px",
                    background: "#fff",
                    textAlign: "right"
                  }}
                >
                  <Button onClick={onClose} type="primary" style={{ marginRight: 8 }}>Quay lại</Button>
                </div>
              </Panel>
            </AdminPage>
          </> : null}
    </>
  )
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      id: state.quanLyDoVai.id,
      dmDungCuId: state.quanLyDoVai.dmDungCuId,
      dmDungCu: state.quanLyDoVai.dmDungCu,
      soLuong: state.quanLyDoVai.soLuong,
      thoiGianThucHien: state.quanLyDoVai.thoiGianThucHien && moment(state.quanLyDoVai.thoiGianThucHien).format("HH:mm:ss DD/MM/YYYY"),
      thoiGianBanGiao: state.quanLyDoVai.thoiGianBanGiao && moment(state.quanLyDoVai.thoiGianBanGiao).format("DD/MM/YYYY"),
      trangThai: state.quanLyDoVai.trangThai,
      khoaBanGiaoId: state.quanLyDoVai.khoaBanGiaoId,
      khoaBanGiao: state.quanLyDoVai.khoaBanGiao,
    }
  },
  {
    loadDetail: actionQuanLyDoVai.loadDetail,
    updateData: actionQuanLyDoVai.updateData,
  }
)(index)