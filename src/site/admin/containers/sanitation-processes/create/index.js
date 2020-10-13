import React, { useEffect } from "react";
import { Form, Button, Select, Tooltip, Input, DatePicker } from "antd";
import { connect } from "react-redux";
import actionSanitationProcesses from "@actions/sanitation-processes";
import actionSanitationProcessTemplates from "@actions/sanitation-process-templates";
import { AdminPage, Panel } from "@admin/components/admin";
import "../style.scss";
import moment from "moment";
import DataContants from "@config/data-contants";
const { Option } = Select;
const { TextArea } = Input;

function index(props) {
  const { content, executorLines, noteLines, statusLines, actDate, lines, index } = props;
  const id = props.match.params.id;
  useEffect(() => {
    props.updateData({
      checkButton: false
    })
    props.loadListSanitationProcessTemplates();
    if (!props.id) {
      if (id) {
        props.loadDetail(id).then(s => {
        }).catch(e => {
          props.history.replace("/sanitation-processes");
        });
      }
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/sanitation-processes");
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;
  const onClose = () => {
    props.updateData({
      id: null,
      name: "",
      location: "",
      fromDate: null,
      toDate: null,
      result: "",
      status: "",
      executor: "",
      note: "",
      content: "",
      executorLines: "",
      statusLines: "",
      noteLines: "",
      lines: [],
      actDate: null,
      sanitationProcessTemplatesId: ""
    });
    props.history.push("/sanitation-processes");
  };
  const createDetail = () => {
    let params = {
      content: content ? content : null,
      executor: executorLines ? executorLines : null,
      actDate: actDate ? actDate : null,
      status: statusLines ? statusLines : null,
      note: noteLines ? noteLines : null
    }
    lines.push(params)
    loadData(lines);
  }
  const loadData = (data) => {
    props.updateData({
      lines: data,
      content: "",
      executorLines: "",
      noteLines: "",
      statusLines: "",
      index: "",
      actDate: null,
      specimenType: {}
    })
  }
  const updateModalDetail = (data, index) => {
    props.updateData({
      content: data.content,
      executorLines: data.executor,
      actDate: data.actDate,
      statusLines: data.status,
      noteLines: data.note,
      index: index,
      detailId: data.id,
      checkButton: true
    })
  }
  const updateDetail = () => {
    lines[index] = {
      content: content ? content : null,
      executor: executorLines ? executorLines : null,
      actDate: actDate ? actDate : null,
      note: noteLines ? noteLines : null,
      status: statusLines ? statusLines : null,
    }
    loadData(lines);
    props.updateData({
      checkButton: false
    })
  }
  const deleteDetail = (index) => {
    lines.splice(index, 1);
    loadData(lines);
    props.updateData({
      checkDelete: true
    })
    let link = window.location.pathname
    props.history.push(link);
  }
  const getStatus = (item) => {
    var status = DataContants.listStatus.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (status.length > 0)
      return status[0];
    return {};
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option === "ROLE_user_ql_moi_truong" || option === "ROLE_user_khac" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong" || checkAuth === "ROLE_user_khac" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage className="mgr-sanitation-processes">
              <Panel
                title={props.id ? "Cập nhật lịch vệ sinh môi trường" : "Thêm mới lịch vệ sinh môi trường"}
                id={"mgr-sanitation-processes"}
                allowClose={false}
                allowCollapse={false}
              >
                <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6">
                      <Form.Item label="Tiêu đề (*)">
                        {getFieldDecorator("name", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng nhập tiêu đề!"
                            }
                          ],
                          initialValue: props.name
                        })(
                          <TextArea
                            onChange={(event) => {
                              props.updateData({
                                name: event.target.value
                              });
                            }}
                            placeholder="Nhập tiêu đề"
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="Người thực hiện">
                        {getFieldDecorator("executor", {
                          initialValue: props.executor
                        })(
                          <TextArea
                            onChange={(event) => {
                              props.updateData({
                                executor: event.target.value
                              });
                            }}
                            placeholder="Nhập người thực hiện"
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="Thời gian bắt đầu">
                        {getFieldDecorator("fromDate", {
                          initialValue: props.fromDate
                        })(
                          <DatePicker
                            onChange={e => {
                              props.updateData({
                                fromDate: e
                              });
                            }}
                            style={{ width: "100%" }}
                            format={"DD/MM/YYYY"}
                            placeholder="Nhập thời gian bắt đầu"
                            getPopupContainer={trigger => trigger.parentNode}
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="Mẫu quy trình">
                        {getFieldDecorator("sanitationProcessTemplatesId", {
                          initialValue: props.sanitationProcessTemplatesId
                        })(
                          <Select
                            showSearch
                            onChange={(e) => {
                              props.loadDetailSanitationProcessTemplates(e).then(s => {
                                let data = (s.lines || []).map(item => {
                                  return (
                                    {
                                      content: item.content,
                                      executorLines: item.executor,
                                      actDate: item.actDate,
                                      status: item.status,
                                      note: item.note,
                                    }
                                  )
                                })
                                props.updateData({
                                  lines: data,
                                })
                              })
                            }}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase().unsignText()
                                .indexOf(input.toLowerCase().unsignText()) >= 0
                            }
                          >
                            <Option value="">Chọn mẫu quy trình</Option>
                            {props.dataSanitationProcessTemplates.map((item, index) => {
                              return (
                                <Option key={index} value={item.id}> {item.name} </Option>
                              );
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <Form.Item label="Địa chỉ">
                        {getFieldDecorator("location", {
                          initialValue: props.location
                        })(
                          <TextArea
                            onChange={(event) => {
                              props.updateData({
                                location: event.target.value
                              });
                            }}
                            placeholder="Nhập địa điểm"
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="Kết quả đạt được">
                        {getFieldDecorator("result", {
                          initialValue: props.result
                        })(
                          <TextArea
                            onChange={(event) => {
                              props.updateData({
                                result: event.target.value
                              });
                            }}
                            placeholder="Nhập kết quả đạt được"
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="Thời gian kết thúc">
                        {getFieldDecorator("toDate", {
                          initialValue: props.toDate
                        })(
                          <DatePicker
                            onChange={e => {
                              props.updateData({
                                toDate: e
                              });
                            }}
                            style={{ width: "100%" }}
                            format={"DD/MM/YYYY"}
                            placeholder="Nhập thời gian kết thúc"
                            getPopupContainer={trigger => trigger.parentNode}
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="Trạng thái (*)">
                        {getFieldDecorator("status", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng chọn trạng thái"
                            }
                          ],
                          initialValue: props.status
                        })(
                          <Select
                            showSearch
                            onChange={e => {
                              props.updateData({
                                status: e
                              });
                            }}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase().unsignText()
                                .indexOf(input.toLowerCase().unsignText()) >= 0
                            }
                          >
                            <Option value="">Chọn trạng thái</Option>
                            {DataContants.listStatus.map((item, index) => {
                              return (
                                <Option key={index} value={item.id}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item label="Ghi chú">
                        {getFieldDecorator("note", {
                          initialValue: props.note
                        })(
                          <TextArea
                            onChange={(event) => {
                              props.updateData({
                                note: event.target.value
                              });
                            }}
                            placeholder="Nhập ghi chú"
                          />
                        )}
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Item label="Quy trình">
                        <div className="procedure">
                          <table>
                            <tbody className="table-body">
                              <tr>
                                <td style={{ width: "15%" }}>Nội dung</td>
                                <td style={{ width: "20%" }}>Người thực hiện cụ thể</td>
                                <td style={{ width: "15%" }}>Ngày thực hiện</td>
                                <td style={{ width: "15%" }}>Trạng thái</td>
                                <td style={{ width: "20%" }}>Ghi chú</td>
                                <td style={{ width: "15%" }}></td>
                              </tr>
                              <tr>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <TextArea
                                    rows={1}
                                    value={props.content}
                                    onChange={(event) => {
                                      props.updateData({
                                        content: event.target.value
                                      });
                                    }}
                                    placeholder="Nhập nội dung"
                                  />
                                </td>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <TextArea
                                    rows={1}
                                    value={props.executorLines}
                                    onChange={(event) => {
                                      props.updateData({
                                        executorLines: event.target.value
                                      });
                                    }}
                                    placeholder="Nhập người thực hiện"
                                  />
                                </td>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <DatePicker
                                    onChange={e => {
                                      props.updateData({
                                        actDate: e
                                      });
                                    }}
                                    value={props.actDate ? moment(props.actDate) : null}
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YYYY"}
                                    placeholder="Nhập ngày thực hiện"
                                    getPopupContainer={trigger => trigger.parentNode}
                                  />
                                </td>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <Select
                                    showSearch
                                    onChange={e => {
                                      props.updateData({
                                        statusLines: e
                                      });
                                    }}
                                    filterOption={(input, option) =>
                                      option.props.children
                                        .toLowerCase().unsignText()
                                        .indexOf(input.toLowerCase().unsignText()) >= 0
                                    }
                                    placeholder="Chọn trạng thái"
                                    value={props.statusLines}
                                  >
                                    <Option value="">Chọn trạng thái</Option>
                                    {DataContants.listStatus.map((item, index) => {
                                      return (
                                        <Option key={index} value={item.id}>
                                          {item.name}
                                        </Option>
                                      );
                                    })}
                                  </Select>
                                </td>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <TextArea
                                    rows={1}
                                    value={props.noteLines}
                                    onChange={(event) => {
                                      props.updateData({
                                        noteLines: event.target.value
                                      });
                                    }}
                                    placeholder="Nhập ghi chú"
                                  />
                                </td>
                                {props.checkButton ?
                                  <td style={{ textAlign: "center", paddingTop: 14 }}  >
                                    <Tooltip placement="topLeft" title={"Lưu"}>
                                      <div className="button-modal" onClick={() => { updateDetail() }}>
                                        <i className="fal fa-save"></i>
                                      </div>
                                    </Tooltip>
                                  </td> :
                                  <td style={{ textAlign: "center", paddingTop: 14 }} >
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
                                      <td>{item.executor}</td>
                                      <td>{item.actDate && moment(item.actDate).format("DD-MM-YYYY")}</td>
                                      <td>{getStatus(item.status) ? getStatus(item.status).name : null}</td>
                                      <td>{item.note}</td>
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
                  </div>

                </Form>
                <div
                  style={{
                    width: "100%",
                    borderTop: "1px solid #e9e9e9",
                    padding: "16px 16px 0px",
                    background: "#fff",
                    textAlign: "right",
                    display: "block"
                  }}
                >
                  <Button onClick={onClose} style={{ marginRight: 8 }}>
                    Hủy
                    </Button>
                  <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                    {props.id ? "Lưu thay đổi" : "Tạo mới"}
                  </Button>
                </div>
              </Panel>
            </AdminPage>
          </> : null}
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      specimenTypeId: state.sanitationProcesses.specimenTypeId || "",
      name: state.sanitationProcesses.name,
      location: state.sanitationProcesses.location,
      id: state.sanitationProcesses.id,
      lines: state.sanitationProcesses.lines || [],
      fromDate: state.sanitationProcesses.fromDate ? moment(state.sanitationProcesses.fromDate) : null,
      toDate: state.sanitationProcesses.toDate ? moment(state.sanitationProcesses.toDate) : null,
      result: state.sanitationProcesses.result,
      status: state.sanitationProcesses.status,
      executor: state.sanitationProcesses.executor,
      note: state.sanitationProcesses.note,
      dataSpecimenTypes: state.sanitationProcesses.dataSpecimenTypes || [],
      content: state.sanitationProcesses.content,
      executorLines: state.sanitationProcesses.executorLines,
      actDate: state.sanitationProcesses.actDate ? moment(state.sanitationProcesses.actDate) : null,
      statusLines: state.sanitationProcesses.statusLines,
      noteLines: state.sanitationProcesses.noteLines,
      sanitationProcessTemplatesId: state.sanitationProcesses.sanitationProcessTemplatesId,
      dataSanitationProcessTemplates: state.sanitationProcessTemplates.sanitationProcessTemplates || [],
      checkDelete: state.sanitationProcesses.checkDelete,
      index: state.sanitationProcesses.index,
      checkButton: state.sanitationProcesses.checkButton
    };
  }, {
  updateData: actionSanitationProcesses.updateData,
  createOrEdit: actionSanitationProcesses.createOrEdit,
  loadDetail: actionSanitationProcesses.loadDetail,
  loadListSanitationProcessTemplates: actionSanitationProcessTemplates.loadList,
  loadDetailSanitationProcessTemplates: actionSanitationProcessTemplates.loadDetail,

}
)(Form.create()(index));