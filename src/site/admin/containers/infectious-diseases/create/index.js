import React from "react";
import { Form, Modal, Input } from "antd";
import { connect } from "react-redux";
import actioninfectiousDiseases from "@actions/infectious-diseases";
import "../style.scss";
function index(props) {
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;
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
      title={props.id ? "Cập nhật nhóm bệnh truyền nhiễm" : "Thêm mới nhóm bệnh truyền nhiễm"}
      visible={true}
      cancelText={"Đóng"}
      onOk={handleSubmit}
      okText={props.id ? "Cập nhật" : "Thêm mới"}
      onCancel={closeModal}
    >
      <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
        <div>
          <Form.Item label="Mã Nhóm* ">
            {getFieldDecorator("value", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập mã nhóm bệnh truyền nhiễm"
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
                placeholder="Nhập mã"
              />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Tên nhóm* ">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập tên nhóm bệnh truyền nhiễm"
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
                placeholder="Nhập tên"
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
      name: state.infectiousDiseases.name,
      value: state.infectiousDiseases.value,
      id: state.infectiousDiseases.id,
    };
  }, {
  updateData: actioninfectiousDiseases.updateData,
  createOrEdit: actioninfectiousDiseases.createOrEdit,
}
)(Form.create()(index));
