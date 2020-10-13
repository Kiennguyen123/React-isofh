import React, { useEffect, useState } from "react";
import { Button, Select, Form, Input, Tooltip, Modal, DatePicker, TimePicker } from "antd";
import { connect } from "react-redux";
import actionQuanLyDungCu from "@actions/quan-ly-dung-cu";
import moment from 'moment';
import DataContants from "@config/data-contants";
const { Option } = Select;
const { TextArea } = Input;

function index(props) {

  const { getFieldDecorator } = props.form;

  useEffect(() => {
  }, []);

  const handleOk = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        let a = new Date(`${(props.dateTietKhuan && moment(props.dateTietKhuan).format("YYYY-MM-DD"))} ${(props.timeTietKhuan
          && moment(props.timeTietKhuan).format("HH:mm:ss"))}`)
        props.updateData({
          thoiGianTietKhuan: a
        })
        props.duyetDungCu().then(s => {
          props.updateData({
            openModalDuyetDungCu: false
          })
        })
      }
    });
  }

  const handleCancel = () => {
    props.updateData({
      openModalDuyetDungCu: false,
    })
  }

  return (
    <Modal
      title="DUYỆT DỤNG CỤ Y TẾ"
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
      <Form layout="vertical" hideRequiredMark={true} onSubmit={handleOk}>
        <div>
          <Form.Item label="Mã số hộp dụng cụ* ">
            {getFieldDecorator("maSoHopDungCu", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng chọn thời gian bàn giao"
                }
              ],
              initialValue: props.maSoHopDungCu
            })(
              <Input
                onChange={e => {
                  props.updateData({
                    maSoHopDungCu: e.target.value
                  })
                }}
                placeholder="Nhập mã số hộp dụng cụ"
              />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Thời gian dự kiến tiệt khuẩn* ">
            {getFieldDecorator("dateTietKhuan", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập mã số hộp dụng cụ"
                }
              ],
              initialValue: props.dateTietKhuan
            })(
              <DatePicker
                style={{ "minWidth": "200px" }}
                onChange={e => {
                  props.updateData({
                    dateTietKhuan: e && e._d
                  })
                }}
                format="DD-MM-YYYY"
              />
            )}
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập mã số hộp dụng cụ"
                }
              ],
              initialValue: props.timeTietKhuan
            })(
              <TimePicker
                style={{ "marginLeft": "7px" }}
                format="HH:mm"
                onChange={e => {
                  props.updateData({
                    timeTietKhuan: e && e._d
                  })
                }}
              />
            )}
          </Form.Item>
        </div>
      </Form >
    </Modal >
  );
}

export default connect(
  state => {
    return {
      maSoHopDungCu: state.quanLyDungCu.maSoHopDungCu,
      thoiGianTietKhuan: state.quanLyDungCu.thoiGianTietKhuan,
      dateTietKhuan: state.quanLyDungCu.dateTietKhuan && moment(state.quanLyDungCu.dateTietKhuan) || moment(new Date()),
      timeTietKhuan: state.quanLyDungCu.timeTietKhuan && moment(state.quanLyDungCu.timeTietKhuan) || moment(new Date()),
    }
  },
  {
    updateData: actionQuanLyDungCu.updateData,
    duyetDungCu: actionQuanLyDungCu.duyetDungCu,
  }
)(Form.create()(index))
