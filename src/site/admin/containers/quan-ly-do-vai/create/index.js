import React, { useEffect } from "react";
import { Form, Select, Input, Modal, DatePicker, TimePicker } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import actionDmDungCu from "@actions/dm-dung-cu";
import actionDepartments from '@actions/departments';
import actionQuanLyDoVai from '@actions/quan-ly-do-vai';
import DataContants from '@config/data-contants';
import '../style.scss';
const { Option } = Select;
function index(props) {
  useEffect(() => {
    props.loadListDepartments();
    props.loadListDmDungcu("", "", "10");
    props.updateData({
      checkValidate: false,
    })
  }, []);
  const handleSubmit = e => {
    if (!props.id) {
      if ((props.dmDungCuId !== "") && (props.khoaBanGiaoId !== "")
        && (props.soLuong !== "") && props.soLuong > 0
        && (props.thoiGianBanGiao && props.thoiGianThucHien ? (moment(props.thoiGianBanGiao).format("YYYYMMDD") <= moment(props.thoiGianThucHien).format("YYYYMMDD")) : true)
      ) {
        props.updateData({
          checkValidate: false
        })
        props.createOrEdit().then(s => { })
      } else {
        props.updateData({
          checkValidate: true
        })
        return
      }
    } else if ((props.trangThai !== "") && (props.dmDungCuId !== "") && (props.khoaBanGiaoId !== "")
      && (props.soLuong !== "") && props.soLuong > 0
      && (props.thoiGianBanGiao && props.thoiGianThucHien ? (moment(props.thoiGianBanGiao).format("YYYYMMDD") <= moment(props.thoiGianThucHien).format("YYYYMMDD")) : true)) {
      props.updateData({ checkValidate: false })
      props.createOrEdit().then(s => { })
    } else {
      props.updateData({ checkValidate: true })
      return
    }
  };
  const closeModal = () => {
    props.updateData({
      isOpen: false,
      id: "",
      dmDungCuId: "",
      soLuong: "",
      khoaBanGiaoId: "",
      trangThai: "",
      thoiGianThucHien: "",
      thoiGianBanGiao: "",
    })
  }

  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option === "ROLE_user_ql_nhiem_khuan" || option == "ROLE_user_mescohn"))

  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" || checkAuth === "ROLE_user_mescohn" ?
          <Modal
            className="modal-popup"
            width={500}
            title={props.id ? "Cập nhật danh sách thanh trùng đồ vải" : "Thêm mới danh sách thanh trùng đồ vải"}
            visible={true}
            cancelText={"Đóng"}
            onOk={handleSubmit}
            okText={props.id ? "Cập nhật" : "Thêm mới"}
            onCancel={closeModal}
          >
            <Form layout="vertical" hideRequiredMark={true} onSubmit={handleSubmit}>
              <div>
                <Form.Item label="Tên sản phẩm* ">
                  <Select
                    value={props.dmDungCuId}
                    showSearch
                    onChange={e => {
                      props.updateData({
                        dmDungCuId: e
                      });
                    }}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase().unsignText()
                        .indexOf(input.toLowerCase().unsignText()) >= 0
                    }
                  >
                    <Option value="">Chọn sản phẩm</Option>
                    {props.dmDungCu.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                  {props.checkValidate && !props.dmDungCuId ? <div className="validate">Vui lòng chọn tên sản phẩm</div> : null}
                </Form.Item>
                <Form.Item label="Số lượng* ">
                  <Input
                    value={props.soLuong}
                    type="number"
                    onInput={(e) => e.target.value = e.target.value.slice(0, 5)}
                    onChange={(event) => {
                      props.updateData({
                        soLuong: event.target.value
                      });
                    }}
                    placeholder="Nhập số lượng"
                  />
                  {props.checkValidate && !props.soLuong ? <div className="validate">Vui lòng nhập số lượng sản phẩm</div> :
                    props.checkValidate && (props.soLuong && props.soLuong <= 0 ? <div className="validate">Số lượng phải lớn hơn 0</div> : null)}
                </Form.Item>
                <Form.Item label="Thời gian nhận* ">
                  <DatePicker
                    value={props.thoiGianBanGiao}
                    style={{ width: "100%" }}
                    onChange={(event) => {
                      props.updateData({
                        thoiGianBanGiao: event
                      });
                    }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn thời gian nhận"
                  />
                  {props.checkValidate && !props.thoiGianBanGiao ? <div className="validate">Vui lòng chọn thời gian nhận</div> : null}
                </Form.Item>
                <Form.Item label="Khoa bàn giao*">
                  <Select
                    showSearch
                    value={props.khoaBanGiaoId}
                    onChange={e => {
                      props.updateData({
                        khoaBanGiaoId: e
                      });
                    }}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase().unsignText()
                        .indexOf(input.toLowerCase().unsignText()) >= 0
                    }
                  >
                    <Option value="">Chọn khoa bàn giao</Option>
                    {props.departments.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                  {props.checkValidate && !props.khoaBanGiaoId ? <div className="validate">Vui lòng chọn khoa bàn giao</div> : null}
                </Form.Item>
              </div>
              <div>
                <Form.Item style={props.id ? {} : { display: "none" }} label="Trạng thái*">
                  <Select
                    showSearch
                    onChange={e => {
                      props.updateData({
                        trangThai: e
                      });
                    }}
                    value={props.trangThai}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase().unsignText()
                        .indexOf(input.toLowerCase().unsignText()) >= 0
                    }
                  >
                    <Option value="">Chọn trạng thái</Option>
                    {DataContants.listTrangThai.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                  {props.checkValidate && !props.trangThai ? <div className="validate">Vui lòng chọn trạng thái</div> : null}
                </Form.Item>
                <Form.Item style={props.id ? {} : { display: "none" }} label="Thời gian thực hiện ">
                  <DatePicker
                    style={{ width: "60%", float: "left" }}
                    value={props.thoiGianThucHien}
                    onChange={(event) => {
                      props.updateData({
                        thoiGianThucHien: event
                      });
                    }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn thời gian thực hiện"
                  />
                  <TimePicker
                    style={{ width: "40%", float: "left" }}
                    value={props.thoiGianThucHien}
                    onChange={(event) => {
                      props.updateData({
                        thoiGianThucHien: event
                      });
                    }}
                  />
                  {props.checkValidate && (props.thoiGianBanGiao && props.thoiGianThucHien && props.thoiGianBanGiao > props.thoiGianThucHien ? <div className="validate">Thời gian thực hiện không được nhỏ hơn thời gian nhận</div> : null)}
                </Form.Item>
              </div>
            </Form>
          </Modal>
          : null
      }
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      id: state.quanLyDoVai.id,
      dmDungCuId: state.quanLyDoVai.dmDungCuId,
      trangThai: state.quanLyDoVai.trangThai,
      khoaBanGiaoId: state.quanLyDoVai.khoaBanGiaoId,
      soLuong: state.quanLyDoVai.soLuong,
      departments: state.departments.departments || [],
      dmDungCu: state.dmDungcu.dmDungCu || [],
      thoiGianBanGiao: state.quanLyDoVai.thoiGianBanGiao ? moment(state.quanLyDoVai.thoiGianBanGiao) : null,
      thoiGianThucHien: state.quanLyDoVai.thoiGianThucHien ? moment(state.quanLyDoVai.thoiGianThucHien) : null,
      checkValidate: state.quanLyDoVai.checkValidate,
    }
  },
  {
    updateData: actionQuanLyDoVai.updateData,
    createOrEdit: actionQuanLyDoVai.createOrEdit,
    loadDetail: actionQuanLyDoVai.loadDetail,
    loadListDepartments: actionDepartments.loadList,
    loadListDmDungcu: actionDmDungCu.loadList,
  }
)(index)