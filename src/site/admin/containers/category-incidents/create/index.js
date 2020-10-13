import React from "react";
import { Form, Modal, Input } from "antd";
import { connect } from "react-redux";
import actionCategoryIncidents from "@actions/category-incidents";
import "../style.scss";
function index(props) {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.updateData({
            isOpen: false
          })
        });
      }
    });
  };
  const closeModal = () => {
    props.updateData({
      id: "",
      incidentCode: "",
      incidentType: "",
      isOpen: false,
    })
  }
  return (
    <Modal
      className="modal-popup"
      width={500}
      title={props.id ? "Cập nhật loại sự cố" : "Thêm mới loại sự cố"}
      visible={true}
      cancelText={"Đóng"}
      onOk={handleSubmit}
      okText={props.id ? "Cập nhật" : "Thêm mới"}
      onCancel={closeModal}
    >
      <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
        <div>
          <Form.Item label="Mã số*">
            {getFieldDecorator("value", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập mã số"
                }
              ],
              initialValue: props.incidentCode
            })(
              <Input
                disabled={props.id ? true : false}
                onChange={(event) => {
                  props.updateData({
                    incidentCode: event.target.value
                  });
                }}
                placeholder="Nhập mã số"
              />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Loại sự cố*">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập loại sự cố"
                }
              ],
              initialValue: props.incidentType
            })(
              <Input
                onChange={(event) => {
                  props.updateData({
                    incidentType: event.target.value
                  });
                }}
                placeholder="Nhập loại sự cố"
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
      id: state.categoryIncidents.id,
      incidentCode: state.categoryIncidents.incidentCode,
      incidentType: state.categoryIncidents.incidentType,
    };
  }, {
  updateData: actionCategoryIncidents.updateData,
  createOrEdit: actionCategoryIncidents.createOrEdit,
}
)(Form.create()(index));
