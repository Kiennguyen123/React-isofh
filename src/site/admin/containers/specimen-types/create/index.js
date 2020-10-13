
import React, { useEffect } from "react";
import { Form, Modal, Input, Select } from "antd";
import { connect } from "react-redux";
import actionSpecimenTypes from "@actions/specimen-types";
import "../style.scss";
function index(props) {
  useEffect(() => {
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
      title={props.id ? "Cập nhật loại mẫu xét nghiệm" : "Thêm mới loại mẫu xét nghiệm"}
      visible={true}
      cancelText={"Đóng"}
      onOk={handleSubmit}
      okText={props.id ? "Cập nhật" : "Thêm mới"}
      onCancel={closeModal}
    >
      <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
        <div>
          <Form.Item label="Mã số*:">
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
                style={props.id ? { backgroundColor: '#f5f5ef' } : {}}
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
          <Form.Item label="Loại mẫu xét nghiệm*:">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập loại mẫu xét nghiệm!"
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
                placeholder="Nhập loại mẫu"
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
      data: state.specimenTypes.data || [],
      name: state.specimenTypes.name,
      value: state.specimenTypes.value,
      id: state.specimenTypes.id,
      checkValue: state.specimenTypes.checkValue,
      checkName: state.specimenTypes.checkName,
      checkValidate: state.specimenTypes.checkValidate,
    };
  }, {
  updateData: actionSpecimenTypes.updateData,
  createOrEdit: actionSpecimenTypes.createOrEdit,
}
)(Form.create()(index));
