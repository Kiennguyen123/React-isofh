import React, { useEffect } from "react";
import { Form, Button, Select, Tooltip, Input } from "antd";
import { connect } from "react-redux";
import actionMdEnvironmentalTests from "@actions/md-environmental-tests";
import actionSpecimenTypes from "@actions/specimen-types";
import { AdminPage, Panel } from "@admin/components/admin";
import "../style.scss";
const { Option } = Select;
const { TextArea } = Input;
function index(props) {
  const { nameLines, valueLines, referenceRange, unit, testMethod, lines, index } = props;
  const id = props.match.params.id;
  useEffect(() => {
    props.updateData({
      checkValidateCreate: false,
      checkButton: false
    })
    if (!props.checkDelete) {
      props.loadListSpecimenTypes();
      if (id)
        props.loadDetail(id).then(s => {
        }).catch(e => {
          props.history.replace("/md-environmental-tests");
        });
      else {
        props.updateData({
          id: null,
          name: "",
          value: "",
          specimenTypeId: "",
          lines: [],
          active: false,
          nameLines: "",
          valueLines: "",
          referenceRange: "",
          testMethod: "",
          unit: "",
          specimenType: {}
        });
      }
    }
  }, []);
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/md-environmental-tests");
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;
  const onClose = () => {
    props.history.push("/md-environmental-tests");
  };
  const createDetail = () => {
    if (props.valueLines && props.valueLines.length && props.nameLines && props.nameLines.length) {
      let params = {
        name: nameLines ? nameLines : null,
        value: valueLines ? valueLines : null,
        referenceRange: referenceRange ? referenceRange : null,
        unit: unit ? unit : null,
        testMethod: testMethod ? testMethod : null
      }
      lines.push(params);
      props.updateData({
        checkValidateCreate: false
      })
      loadData(lines);
    } else {
      props.updateData({
        checkValidateCreate: true
      })
      return
    }
  }
  const loadData = (data) => {
    props.updateData({
      lines: data,
      nameLines: "",
      valueLines: "",
      referenceRange: "",
      unit: "",
      testMethod: "",
      index: "",
      specimenType: {}
    })
  }
  const updateModalDetail = (data, index) => {
    props.updateData({
      nameLines: data.name,
      valueLines: data.value,
      referenceRange: data.referenceRange,
      unit: data.unit,
      testMethod: data.testMethod,
      index: index,
      checkValidateCreate: false,
      checkButton: true
    })
  }
  const updateDetail = () => {
    if (props.valueLines && props.valueLines.length && props.nameLines && props.nameLines.length) {
      lines[index] = {
        name: nameLines ? nameLines : null,
        value: valueLines ? valueLines : null,
        referenceRange: referenceRange ? referenceRange : null,
        unit: unit ? unit : null,
        testMethod: testMethod ? testMethod : null
      }
      loadData(lines);
      props.updateData({
        checkButton: false
      })
    } else {
      props.updateData({
        checkValidateCreate: true,
      })
      return
    }
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
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage className="mgr-md-environmental-tests">
              <Panel
                title={props.id ? "Cập nhật gói xét nghiệm môi trường" : "Thêm mới gói xét nghiệm môi trường"}
                id={"mgr-md-environmental-tests"}
                allowClose={false}
                allowCollapse={false}
              >
                <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-4">
                      <Form.Item label="Mã số*:">
                        {getFieldDecorator("value", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng nhập mã gói xét nghiệm môi trường!"
                            }
                          ],
                          initialValue: props.value
                        })(
                          <TextArea
                            rows={1}
                            onChange={(event) => {
                              props.updateData({
                                value: event.target.value
                              });
                            }}
                            placeholder="Nhập mã gói xét nghiệm môi trường"
                          />
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-4">
                      <Form.Item label="Tên gói*:">
                        {getFieldDecorator("name", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng nhập tên gói xét nghiệm môi trường!"
                            }
                          ],
                          initialValue: props.name
                        })(
                          <TextArea
                            rows={1}
                            onChange={(event) => {
                              props.updateData({
                                name: event.target.value
                              });
                            }}
                            placeholder="Nhập tên gói xét nghiệm môi trường"
                          />
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-4">
                      <Form.Item label="Loại mẫu xét nghiệm*:">
                        {getFieldDecorator("specimenTypeId", {
                          initialValue: props.specimenTypeId
                        })(
                          <Select
                            showSearch
                            onChange={e => {
                              props.updateData({
                                specimenTypeId: e
                              });
                            }}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase().unsignText()
                                .indexOf(input.toLowerCase().unsignText()) >= 0
                            }
                          >
                            <Option value="">Chọn loại mẫu xét nghiệm</Option>
                            {props.dataSpecimenTypes.map((item, index) => {
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
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Item label="Chi tiết">
                        <div className="procedure">
                          <table>
                            <tbody className="table-body">
                              <tr>
                                <td style={{ width: "15%" }}>Mã thông số</td>
                                <td style={{ width: "18%" }}>Thông số</td>
                                <td style={{ width: "22%" }}>Phương pháp xác định</td>
                                <td style={{ width: "20%" }}>Dải tham chiếu</td>
                                <td style={{ width: "15%" }}>Đơn vị</td>
                                <td style={{ width: "10%" }}></td>
                              </tr>
                              <tr>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <TextArea
                                    value={props.valueLines}
                                    onChange={(event) => {
                                      props.updateData({
                                        valueLines: event.target.value
                                      });
                                    }}
                                    placeholder="Nhập mã thông số"
                                  />
                                </td>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <TextArea
                                    value={props.nameLines}
                                    onChange={(event) => {
                                      props.updateData({
                                        nameLines: event.target.value
                                      });
                                    }}
                                    placeholder="Nhập thông số"
                                  />
                                </td>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <TextArea
                                    value={props.testMethod}
                                    onChange={(event) => {
                                      props.updateData({
                                        testMethod: event.target.value
                                      });
                                    }}
                                    placeholder="Nhập phương pháp xác định"
                                  />
                                </td>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <TextArea
                                    value={props.referenceRange}
                                    onChange={(event) => {
                                      props.updateData({
                                        referenceRange: event.target.value
                                      });
                                    }}
                                    placeholder="Nhập dải tham chiếu"
                                  />
                                </td>
                                <td style={{ padding: "10px 3px 5px" }}>
                                  <TextArea
                                    value={props.unit}
                                    onChange={(event) => {
                                      props.updateData({
                                        unit: event.target.value
                                      });
                                    }}
                                    placeholder="Nhập đơn vị"
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
                              <tr>
                                <td>{props.checkValidateCreate && props.valueLines.length === 0 ? <span className="validate">Vui lòng nhập mã thông số</span> : null}</td>
                                <td>{props.checkValidateCreate && props.nameLines.length === 0 ? <span className="validate">Vui lòng nhập thông số</span> : null}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                              {
                                props.lines && props.lines.length ? props.lines.map((item, index2) => {
                                  return (
                                    <tr key={index2}>
                                      <td>{item.value}</td>
                                      <td>{item.name}</td>
                                      <td>{item.testMethod}</td>
                                      <td>{item.referenceRange}</td>
                                      <td>{item.unit}</td>
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
                    textAlign: "right"
                  }}
                >
                  <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
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
      specimenTypeId: state.mdEnvironmentalTests.specimenTypeId || "",
      name: state.mdEnvironmentalTests.name,
      value: state.mdEnvironmentalTests.value,
      id: state.mdEnvironmentalTests.id,
      lines: state.mdEnvironmentalTests.lines || [],
      valueLines: state.mdEnvironmentalTests.valueLines,
      nameLines: state.mdEnvironmentalTests.nameLines,
      referenceRange: state.mdEnvironmentalTests.referenceRange,
      testMethod: state.mdEnvironmentalTests.testMethod,
      unit: state.mdEnvironmentalTests.unit,
      index: state.mdEnvironmentalTests.index,
      dataSpecimenTypes: state.specimenTypes.specimenTypes || [],
      checkDelete: state.mdEnvironmentalTests.checkDelete,
      checkValidateCreate: state.mdEnvironmentalTests.checkValidateCreate,
      checkButton: state.mdEnvironmentalTests.checkButton
    };
  }, {
  updateData: actionMdEnvironmentalTests.updateData,
  createOrEdit: actionMdEnvironmentalTests.createOrEdit,
  loadListSpecimenTypes: actionSpecimenTypes.loadList,
  loadDetail: actionMdEnvironmentalTests.loadDetail
}
)(Form.create()(index));