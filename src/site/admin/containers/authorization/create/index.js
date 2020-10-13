import React from "react";
import DataContants from "@config/data-contants";
import { Form, Modal, Input, Select, Radio } from "antd";
import { connect } from "react-redux";
import actionDepartments from "@actions/departments";
import actionAuthorization from "@actions/authorization";
import "../style.scss";
const { Option } = Select;
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
        })
      }
    });
  };

  const closeModal = () => {
    props.updateData({
      isOpen: false,
      id: "",
    })
  }

  const getFullName = (id) => {
    if (props.dataUserName.length > 0) {
      let account = (props.dataUserName || []).filter(item => {
        if (item.id === id) {
          return item;
        }
      })
      console.log(account)
      props.updateData({
        fullName: account[0].fullName,
        id: account[0].id
      })
    }
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  return (
    <Modal
      className="modal-popup"
      width={700}
      title={props.id ? "CHỈNH SỬA PHÂN QUYỀN TÀI KHOẢN" : "PHÂN QUYỀN TÀI KHOẢN"}
      visible={true}
      cancelText={"Hủy"}
      onOk={handleSubmit}
      okText={"Lưu"}
      onCancel={closeModal}
    >
      <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-6" style={{ padding: "30px" }}>
            <Form.Item label="Chọn khoa *">
              {getFieldDecorator("khoa", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng chọn khoa"
                  }
                ],
                initialValue: props.departmentId
              })(
                <Select
                  disabled={props.id ? true : false}
                  onChange={(e) => {
                    props.updateData({
                      departmentId: e,
                      username: "",
                    });
                    props.loadListUserName(0, '', e);
                  }
                  }
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="Chọn khoa"
                >
                  <Option value="">Chọn khoa</Option>
                  {
                    props.listDepartment && props.listDepartment.length && props.listDepartment.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Tên tài khoản *">
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng chọn tên tài khoản"
                  }
                ],
                initialValue: props.username
              })(
                <Select
                  disabled={props.id ? true : false}
                  onChange={e => {
                    getFullName(e);
                  }
                  }
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="Chọn tên tài khoản"
                >
                  <Option value={""}>Chọn tên tài khoản</Option>
                  {
                    props.dataUserName && props.dataUserName.length && props.dataUserName.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>{item.username}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Họ và tên *">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập họ và tên"
                  }
                ],
                initialValue: props.fullName
              })(
                <Input
                  disabled={true}
                  onChange={e => {
                    props.updateData({
                      fullName: e.target.value
                    });
                  }}
                  placeholder="Nhập họ và tên"
                />
              )}
            </Form.Item>
          </div>
          <div className="col-6" style={{ padding: "30px" }}>
            <Form.Item label="Loại tài khoản *">
              {getFieldDecorator("loai", {
                rules: [
                  {
                    required: true,
                    message: "Vui lòng chọn loại tài khoản"
                  }
                ],
                initialValue: props.roleId
              })(
                <Radio.Group
                  onChange={e => {
                    props.updateData({
                      roleId: e.target.value
                    });
                  }}
                >
                  {
                    DataContants.typeUsers && DataContants.typeUsers.length && DataContants.typeUsers.map((item, index) => {
                      return (
                        <Radio style={radioStyle} key={index} value={item.id}>{item.name}</Radio>
                      )
                    })
                  }
                </Radio.Group>
              )}
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      id: state.authorization.id,
      roleId: state.authorization.roleId,
      dataUserName: state.authorization.dataUserName || [],
      isOpen: state.authorization.isOpen,
      username: state.authorization.username,
      fullName: state.authorization.fullName,
      departmentId: state.authorization.departmentId,
      listDepartment: state.departments.departments,
    };
  }, {
  updateData: actionAuthorization.updateData,
  createOrEdit: actionAuthorization.createOrEdit,
  loadListUserName: actionAuthorization.loadListUserName,
  loadListDepartment: actionDepartments.loadList,
}
)(Form.create()(index));
