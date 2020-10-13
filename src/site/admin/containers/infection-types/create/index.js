import React from "react";
import { Form, Modal, Input } from "antd";
import { connect } from "react-redux";
import actionsInfectionTypes from "@actions/infection-types";
import "../style.scss";
function index(props) {
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
      isOpen: false,
      id: "",
      name: "",
      value: "",
    })
  }
  return (
    <Modal
      className="modal-popup"
      width={500}
      title={props.id ? "Cập nhật loại nhiễm khuẩn" : "Thêm mới loại nhiễm khuẩn"}
      visible={true}
      cancelText={"Đóng"}
      onOk={handleSubmit}
      okText={props.id ? "Cập nhật" : "Thêm mới"}
      onCancel={closeModal}
    >
      <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
        <div>
          <Form.Item label="Mã loại nhiễm khuẩn">
            {getFieldDecorator("value", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập mã loại nhiễm khuẩn"
                }
              ],
              initialValue: props.value
            })(
              <Input
                disabled={props.id ? true : false}
                onChange={(event) => {
                  props.updateData({
                    value: event.target.value
                  });
                }}
                placeholder="Nhập mã loại nhiễm khuẩn"
              />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Tên loại nhiễm khuẩn">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập tên loại nhiễm khuẩn"
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
                placeholder="Nhập tên loại nhiễm khuẩn"
              />
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
      name: state.infectionTypes.name,
      value: state.infectionTypes.value,
      id: state.infectionTypes.id
    };
  }, {
  updateData: actionsInfectionTypes.updateData,
  createOrEdit: actionsInfectionTypes.createOrEdit,
}
)(Form.create()(index));
