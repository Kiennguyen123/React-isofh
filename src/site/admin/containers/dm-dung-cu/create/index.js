import React from "react";
import { Form, Modal, Input, Radio } from "antd";
import { connect } from "react-redux";
import actionDungCu from "@actions/dm-dung-cu";
import snackbar from "@utils/snackbar-utils";
import "../style.scss";
function index(props) {

  const { getFieldDecorator } = props.form;

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit();
      }
    });
  };
  const closeModal = () => {
    props.updateData({
      isOpen: false,
      id: "",
      value: "",
      name: "",
      loai: ""
    })
  }
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  return (
    <Modal
      className="modal-popup"
      width={500}
      title={props.id ? "Cập nhật danh mục đồ vải, dụng cụ y tế" : "Thêm mới danh mục đồ vải, dụng cụ y tế"}
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
                  message: "Vui lòng nhập mã số"
                }
              ],
              initialValue: props.value
            })(
              <Input
                style={props.id ? { color: '#d9d9d9' } : { color: 'rgba(0, 0, 0, 0.65)' }}
                readOnly={props.id}
                onChange={e => {
                  props.updateData({
                    value: e.target.value
                  });
                }}
                autoComplete="off"
                placeholder="Nhập mã số"
              />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Tên sản phẩm *">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập tên sản phẩm"
                }
              ],
              initialValue: props.name
            })(
              <Input
                onChange={e => {
                  props.updateData({
                    name: e.target.value
                  });
                }}
                autoComplete="off"
                placeholder="Nhập tên sản phẩm"
              />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Loại sản phẩm *">
            {getFieldDecorator("loai", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng chọn loại sản phẩm"
                }
              ],
              initialValue: props.loai
            })(
              <Radio.Group
                onChange={e => {
                  props.updateData({
                    loai: e.target.value
                  });
                }}
              >
                <Radio style={radioStyle} value={10}>
                  Đồ vải
                </Radio>
                <Radio style={radioStyle} value={20}>
                  Dụng cụ y tế
                </Radio>
              </Radio.Group>
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
      data: state.dmDungcu.data || [],
      id: state.dmDungcu.id,
      name: state.dmDungcu.name,
      value: state.dmDungcu.value,
      loai: state.dmDungcu.loai,
    };
  }, {
  updateData: actionDungCu.updateData,
  createOrEdit: actionDungCu.createOrEdit,
}
)(Form.create()(index));
