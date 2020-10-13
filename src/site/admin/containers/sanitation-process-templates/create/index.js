import React, { useEffect } from "react";
import { Form, Modal, Input, Tooltip } from "antd";
import { connect } from "react-redux";
import actionSanitationProcessTemplates from "@actions/sanitation-process-templates";
import "../style.scss";
const { TextArea } = Input;
function index(props) {
  const { contentLines, dataIndex, index } = props;
  useEffect(() => {
    props.updateData({
      checkButton: false,
      name: "",
      value: "",
      lines: [],
      dataIndex: [],
      active: false,
      content: "",
      contentLines: "",
    })
  }, []);
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
      lines: [],
      dataIndex: [],
      active: false,
      content: "",
      contentLines: "",
    })
  }
  const createDetail = () => {
    let params = {
      content: contentLines ? contentLines : null,
    }
    dataIndex.push(params)
    loadData(dataIndex);
  }
  const loadData = (data) => {
    props.updateData({
      lines: data,
      contentLines: "",
      index: ""
    })
  }
  const updateModalDetail = (data, index) => {
    props.updateData({
      contentLines: data.content,
      index: index,
      checkButton: true
    })

  }
  const updateDetail = () => {
    dataIndex[index] = {
      content: contentLines ? contentLines : null,
    }
    props.updateData({
      checkButton: false
    })
    loadData(dataIndex);
  }
  const deleteDetail = (index) => {
    dataIndex.splice(index, 1);
    loadData(dataIndex);
    props.history.push("/sanitation-process-templates");
  }
  return (
    <Modal
      className="modal-popup"
      width={500}
      title={props.id ? "Cập nhật mẫu quy trình VSMT" : "Thêm mới mẫu quy trình VSMT"}
      visible={true}
      cancelText={"Đóng"}
      onOk={handleSubmit}
      okText={props.id ? "Cập nhật" : "Thêm mới"}
      onCancel={closeModal}
    >
      <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
        <div>
          <Form.Item label="Mã mẫu* ">
            {getFieldDecorator("value", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập mã mẫu quy trình VSMT"
                }
              ],
              initialValue: props.value
            })(
              <Input
                onChange={(event) => {
                  props.updateData({
                    value: event.target.value
                  });
                }}
                placeholder="Nhập mã mẫu quy trình VSMT"
              />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Tên mẫu* ">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Vui lòng nhập tên mẫu quy trình VSMT"
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
                placeholder="Nhập tên mẫu quy trình VSMT"
              />
            )}
          </Form.Item>
          <Form.Item label="Nội dung mẫu quy trình VSMT">
            <div className="procedure">
              <table>
                <tbody className="table-body">
                  <tr>
                    <td style={{ width: "75%" }}>
                      <TextArea
                        value={props.contentLines}
                        onChange={(event) => {
                          props.updateData({
                            contentLines: event.target.value
                          });
                        }}
                        placeholder="Nhập nội dung"
                      />
                    </td>
                    {props.checkButton ?
                      <td style={{ textAlign: "center", paddingTop: 14 }} >
                        <Tooltip placement="topLeft" title={"Lưu"}>
                          <div className="button-modal" onClick={() => { updateDetail() }}>
                            <i className="fal fa-save"></i>
                          </div>
                        </Tooltip>
                      </td> :
                      <td style={{ textAlign: "center", paddingTop: 14 }}>
                        <Tooltip placement="topLeft" title={"Thêm mới"}>
                          <div className="button-modal" onClick={() => { createDetail() }}>
                            <i className="fal fa-plus-square"></i>
                          </div>
                        </Tooltip>
                      </td>}
                  </tr>
                  {
                    props.lines && props.lines.length ? props.lines.map((item, index2) => {
                      return (
                        <tr key={index2}>
                          <td>{item.content}</td>
                          <td style={{ textAlign: "center" }}>
                            <Tooltip placement="topLeft" title={"Chỉnh sửa"}>
                              <span className="button-modal" onClick={() => updateModalDetail(item, index2)}>
                                <i className="fal fa-edit"></i>
                              </span>
                            </Tooltip>
                            <Tooltip placement="topLeft" title={"Xóa"}>
                              <span className="button-modal" onClick={() => deleteDetail(index2)}>
                                <i className="fal fa-trash-alt"></i>
                              </span>
                            </Tooltip>
                          </td>
                        </tr>
                      )
                    }) : null
                  }
                </tbody>
              </table>
            </div>
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
      name: state.sanitationProcessTemplates.name,
      value: state.sanitationProcessTemplates.value,
      id: state.sanitationProcessTemplates.id,
      dataIndex: state.sanitationProcessTemplates.dataIndex || [],
      lines: state.sanitationProcessTemplates.lines || [],
      contentLines: state.sanitationProcessTemplates.contentLines,
      index: state.sanitationProcessTemplates.index,
      isOpen: state.sanitationProcessTemplates.isOpen,
      history: [],
      checkButton: state.sanitationProcessTemplates.checkButton
    };
  }, {
  updateData: actionSanitationProcessTemplates.updateData,
  createOrEdit: actionSanitationProcessTemplates.createOrEdit,
  loadDetail: actionSanitationProcessTemplates.loadDetail,
}
)(Form.create()(index));
