import React, { useState, useEffect } from "react";
import { Form, Modal, Input, Select, Tooltip, Radio } from "antd";
import { connect } from "react-redux";
import snackbar from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
import actionDmMauDungCu from "@actions/dm-mau-dung-cu";
import actionDmDungCu from "@actions/dm-dung-cu";
import "../style.scss";
const { Option } = Select;
const { TextArea } = Input;
function index(props) {
  useEffect(() => {
    props.loadList("", "", "20");
    props.updateData({
      checkValidate: false,
      checkValue: false,
      checkName: false,
    })
  }, []);
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
        });
      }
    });
  };
  const closeModal = () => {
    props.updateData({
      id: "",
      name: "",
      value: "",
      dungCuIds: [],
      active: false,
      isOpen: false,
    })
  }
  return (
    <Modal
      className="modal-popup"
      width={500}
      title={props.id ? "Cập nhật danh mục mẫu dụng cụ y tế" : "Thêm mới danh mục mẫu dụng cụ y tế"}
      visible={true}
      cancelText={"Đóng"}
      onOk={handleSubmit}
      okText={props.id ? "Cập nhật" : "Thêm mới"}
      onCancel={closeModal}
    >
      <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
        <div>
          <Form.Item label="Mã số *">
          {getFieldDecorator("value", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập mã số!"
                }
              ],
              initialValue: props.value
            })(
            <Input
              style={props.id ? {  backgroundColor: '#f5f5ef' } : {  }}
              readOnly={props.id}
              onChange={(event) => {
                props.updateData({
                  value: event.target.value
                });
              }}
              placeholder="Nhập mã số"
            />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Tên mẫu dụng cụ y tế *">
          {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập tên mẫu dụng cụ y tế!"
                }
              ],
              initialValue: props.name
            })(
            <Input
              onChange={(event) => {
                props.updateData({
                  name: event.target.value
                });
              }}
              placeholder="Nhập tên mẫu"
            />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Tên dụng cụ y tế *">
          {getFieldDecorator("dungCuIds", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng chọn tên dụng cụ y tế!"
                }
              ],
              initialValue: props.dungCuIds
            })(
            <Select
              mode='multiple'
              showSearch
              onChange={e => props.updateData({
                dungCuIds: e.map(item => Number(item))
              })}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase().unsignText()
                  .indexOf(input.toLowerCase().unsignText()) >= 0
              }
              placeholder='Chọn tên dụng cụ y tế'
            >
              {props.dmDungcu.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
            )}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.dmMauDungCu.data || [],
      id: state.dmMauDungCu.id,
      name: state.dmMauDungCu.name,
      value: state.dmMauDungCu.value,
      dungCuIds: state.dmMauDungCu.dungCuIds || [],
      dungCu: state.dmMauDungCu.dungCu,
      dmDungcu: state.dmDungcu.dmDungCu || [],
      checkValue: state.dmMauDungCu.checkValidate,
      checkName: state.dmMauDungCu.checkName,
      checkValue: state.dmMauDungCu.checkValue,
      checkValidate: state.dmMauDungCu.checkValidate,
    };
  }, {
  updateData: actionDmMauDungCu.updateData,
  createOrEdit: actionDmMauDungCu.createOrEdit,
  loadList: actionDmDungCu.loadList,
}
)(Form.create()(index));
