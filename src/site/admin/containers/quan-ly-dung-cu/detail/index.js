import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionQuanLyDungCu from "@actions/quan-ly-dung-cu";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment';
import DataContants from "@config/data-contants";
import actionDmDungCu from "@actions/dm-dung-cu";
function index(props) {
  const id = props.match.params.id;
  const getTrangThai = (item) => {
    var trangThai = DataContants.listTrangThaiDungCu.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (trangThai.length)
      return trangThai[0];
    return {};
  }
  useEffect(() => {
    if (id) {
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/tool-sterilization");
      });
    } else {
      props.updateData({
        id: null,
      });
    }
    props.loadListDmDungCu();
  }, []);

  const checkMedical = (item) => {
    let status = props.listDungCu && props.listDungCu.length && props.listDungCu.filter(option => {
      return item === option.id
    })
    if (status && status.length) {
      return status[0]
    } else {
      return []
    }
  }

  const onClose = () => {
    props.history.push("/tool-sterilization");
  };
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option === "ROLE_user_ql_nhiem_khuan" || option === "ROLE_user_khac" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" || checkAuth === "ROLE_user_khac" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage className="quan-ly-dung-cu">
              <Panel
                title="Xem chi tiết"
                id={"quan-ly-dung-cu"}
                allowClose={false}
                allowCollapse={false}
              >
                <div className="detail-body row">
                  <div className="col-md-6">
                    <InputDetail
                      width={4}
                      title="Mã số hộp dụng cụ: "
                      value={props.maSoHopDungCu}
                    />
                    <InputDetail
                      width={4}
                      title="Khoa bàn giao: "
                      value={props.khoaBanGiao && props.khoaBanGiao.name}
                    />
                    <InputDetail
                      width={4}
                      title="Thời gian bàn giao: "
                      value={props.thoiGianBanGiao}
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
                      value={props.thoiGianTietKhuan}
                    />
                    <InputDetail
                      width={4}
                      title="Ghi chú: "
                      value={props.ghiChu}
                    />
                  </div>
                  <div className="col-md-12">
                    <InputDetail
                      width={2}
                      title="Đánh giá chi tiết: "
                      value={
                        <table className="table-sanitation-processes">
                          <thead>
                            <tr>
                              <td style={{ width: "15%" }}>Tên dụng cụ y tế</td>
                              <td style={{ width: "20%" }}>Số lượng</td>
                              <td style={{ width: "15%" }}>Ghi chú</td>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              props.chiTiet.map((option, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{checkMedical(option.dmDungCuId) && checkMedical(option.dmDungCuId).name}</td>
                                    <td>{option.soLuong}</td>
                                    <td>{option.ghiChu}</td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      }
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
      id: state.quanLyDungCu.id,
      maSoHopDungCu: state.quanLyDungCu.maSoHopDungCu,
      chiTiet: state.quanLyDungCu.chiTiet || [],
      khoaBanGiao: state.quanLyDungCu.khoaBanGiao,
      ghiChu: state.quanLyDungCu.ghiChuT,
      trangThai: state.quanLyDungCu.trangThai,
      thoiGianTietKhuan: state.quanLyDungCu.thoiGianTietKhuan && moment(state.quanLyDungCu.thoiGianTietKhuan).format("HH:mm:ss DD/MM/YYYY"),
      thoiGianBanGiao: state.quanLyDungCu.thoiGianBanGiao && moment(state.quanLyDungCu.thoiGianBanGiao).format("DD/MM/YYYY"),
      listDungCu: state.dmDungcu.dmDungCu || []
    }
  },
  {
    loadDetail: actionQuanLyDungCu.loadDetail,
    loadListDmDungCu: actionDmDungCu.loadList,
  }
)(index)