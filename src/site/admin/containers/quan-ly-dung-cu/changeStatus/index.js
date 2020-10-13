import React from "react";
import { Button, Select, Form, Input, Modal, DatePicker, TimePicker } from "antd";
import { connect } from "react-redux";
import actionQuanLyDungCu from "@actions/quan-ly-dung-cu";
import moment from 'moment';
import DataContants from "@config/data-contants";
const { Option } = Select;
function index(props) {
  const handleOk = () => {
    let a = new Date(`${(props.dateTietKhuan && moment(props.dateTietKhuan).format("YYYY-MM-DD"))} ${(props.timeTietKhuan
      && moment(props.timeTietKhuan).format("HH:mm:ss"))}`)
    props.updateData({
      thoiGianTietKhuan: a,
    })
    props.changeStatus().then(s => {
      props.updateData({
        openModalChangeStatus: false,
      })
    })
  }

  const handleCancel = () => {
    props.updateData({
      openModalChangeStatus: false,
    })
  }
  return (
    <Modal
      title="CHUYỂN TRẠNG THÁI DỤNG CỤ Y TẾ"
      visible={true}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Xác nhận
        </Button>,
      ]}
    >
      <Form layout="vertical" hideRequiredMark onSubmit={handleOk}>
        <div>
          <Form.Item label="Trạng thái">
            <Select
              value={props.trangThai}
              onChange={e =>
                props.updateData({
                  trangThai: e
                })
              }
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Chọn trạng thái"
            >
              {
                DataContants.listChuyenTrangThaiDungCu && DataContants.listChuyenTrangThaiDungCu.length && DataContants.listChuyenTrangThaiDungCu.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Thời gian thực hiện*">
            <DatePicker
              value={props.dateTietKhuan}
              style={{ "minWidth": "200px" }}
              onChange={e => {
                props.updateData({
                  dateTietKhuan: e && e._d
                })
              }}
            />
            <TimePicker
              value={props.timeTietKhuan}
              style={{ "marginLeft": "7px" }}
              format="HH:mm"
              onChange={e => {
                props.updateData({
                  timeTietKhuan: e && e._d
                })
              }}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default connect(
  state => {
    return {
      trangThai: state.quanLyDungCu.trangThai,
      thoiGianTietKhuan: state.quanLyDungCu.thoiGianTietKhuan,
      dateTietKhuan: state.quanLyDungCu.dateTietKhuan && moment(state.quanLyDungCu.dateTietKhuan) || moment(new Date()),
      timeTietKhuan: state.quanLyDungCu.timeTietKhuan && moment(state.quanLyDungCu.timeTietKhuan) || moment(new Date()),
    }
  },
  {
    updateData: actionQuanLyDungCu.updateData,
    changeStatus: actionQuanLyDungCu.changeStatus,
  }
)(index);
