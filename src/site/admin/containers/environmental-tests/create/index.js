import React, { useEffect } from "react";
import { Form, Button, Input, Select, DatePicker, Tooltip } from "antd";
import { connect } from "react-redux";
import { Panel } from "@admin/components/admin";
import actionEnvironmentalTests from "@actions/environmental-tests";
import actionSpecimenTypes from "@actions/specimen-types";
import actionMdEnvironmentalTests from "@actions/md-environmental-tests";
import moment from 'moment';
import "../style.scss";
const { Option } = Select;
const { TextArea } = Input;
function index(props) {
  const { name, testMethod, referenceRange, unit, result, lines, index } = props;
  const id = props.match.params.id
  useEffect(() => {
    props.loadSpecimenTypes(props.specimenTypeId);
    if (props.specimenTypeId) {
      props.loadMdEnvironmentalTests(props.specimenTypeId);
    } else {
      props.loadUpdateMdEnvironmentalTests({
        mdEnvironmentalTests: []
      });
    }
    if (props.id) {
      if (id) {
        props.loadDetail(id).then(s => {
        }).catch(e => {
          props.history.replace("/environmental-tests");
        });
      }
      else {
        props.updateData({
          id: null,
          value: "",
          specimenTypeId: "",
          lines: [],
          active: false,
          name: "",
          testMethod: "",
          referenceRange: "",
          result: "",
          unit: "",
          specimenType: {}
        });
      }
    }
  }, []);
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/environmental-tests");
        });
      }
    });
  };
  const onClose = () => {
    props.history.push("/environmental-tests");
  }
  const loadData = (data) => {
    props.updateData({
      lines: data,
      name: "",
      testMethod: "",
      referenceRange: "",
      unit: "",
      result: "",
      index: ""
    })
  }
  const createDetail = () => {
    let params = {
      name: name ? name : null,
      testMethod: testMethod ? testMethod : null,
      referenceRange: referenceRange ? referenceRange : null,
      unit: unit ? unit : null,
      result: result ? result : null
    }
    lines.push(params)
    loadData(lines);
  }
  const updateDetail = () => {
    props.updateData({
      checkUpdate: false
    })
    lines[index] = {
      name: name ? name : null,
      testMethod: testMethod ? testMethod : null,
      referenceRange: referenceRange ? referenceRange : null,
      unit: unit ? unit : null,
      result: result ? result : null,
      checkUpdate: false,
    }
    loadData(lines);
  }
  const updateModalDetail = (data, index) => {
    props.updateData({
      name: data.name,
      testMethod: data.testMethod,
      referenceRange: data.referenceRange,
      unit: data.unit,
      result: data.result,
      index: index,
      checkUpdate: true
    })
  }
  const deleteDetail = (index) => {
    lines.splice(index, 1);
    loadData(lines);
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_moi_truong" || option == "ROLE_user_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <Panel
              title={props.id ? "Cập nhật xét nghiệm đánh giá môi trường" : "Thêm mới xét nghiệm đánh giá môi trường"}
              id={"environmenttal-tests"}
              allowClose={false}
              allowCollapse={false}
            >
              <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-6">
                    <Form.Item label="Loại mẫu xét nghiệm *">
                      {getFieldDecorator("specimenTypeId", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng chọn loại mẫu xét nghiệm"
                          }
                        ],
                        initialValue: props.specimenTypeId
                      })(
                        <Select
                          showSearch
                          placeholder="Chọn loại mẫu xét nghiệm"
                          optionFilterProp="children"
                          onChange={e => {
                            props.loadMdEnvironmentalTests(e)
                            props.updateData({
                              specimenTypeId: e,
                              mdEnvironmentalId: "",
                            })
                          }}
                          filterOption={(input, option) =>
                            option.props && option.props.children && option.props.children
                              .toLowerCase().unsignText()
                              .indexOf(input.toLowerCase().unsignText()) >= 0
                          }
                        >
                          <Option value="">-- Chọn loại mẫu xét nghiệm --</Option>
                          {
                            props.dataSpecimenTypes && props.dataSpecimenTypes.length ? props.dataSpecimenTypes.map((item, index) => {
                              return (
                                <Option key={index} value={item.id}>{item.name}</Option>
                              )
                            }) : null
                          }
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="Gói xét nghiệm *">
                      {getFieldDecorator("mdEnvironmentalId", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng chọn gói xét nghiệm"
                          }
                        ],
                        initialValue: props.mdEnvironmentalId
                      })(
                        <Select
                          showSearch
                          placeholder="Chọn gói xét nghiệm"
                          optionFilterProp="children"
                          onChange={(e) => {
                            props.loadDetailMdEnviromentalTests(e)
                              .then(s => {
                                let data = (s.lines || []).map(item => {
                                  return (
                                    {
                                      name: item.name,
                                      testMethod: item.testMethod,
                                      referenceRange: item.referenceRange,
                                      unit: item.unit,
                                      result: item.result,
                                    }
                                  )
                                })
                                props.updateData({
                                  lines: data,
                                  mdEnvironmentalId: e,
                                })
                              })

                          }}
                          filterOption={(input, option) =>
                            option.props && option.props.children && option.props.children
                              .toLowerCase().unsignText()
                              .indexOf(input.toLowerCase().unsignText()) >= 0
                          }
                        >
                          <Option value="">Chọn gói xét nghiệm</Option>
                          {
                            props.dataMdEnvironmentalTest.map((item, index) => {
                              return (
                                <Option key={index} value={item.id}>{item.name}</Option>
                              )
                            })
                          }
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="Địa điểm lấy mẫu *">
                      {getFieldDecorator("location", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập địa điểm lấy mẫu "
                          }
                        ],
                        initialValue: props.location
                      })(
                        <TextArea
                          onChange={(event) => {
                            props.updateData({
                              location: event.target.value
                            });
                          }}
                          placeholder="Nhập địa điểm lấy mẫu"
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="Đánh giá mức độ ô nhiễm *">
                      {getFieldDecorator("assessment", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập đánh giá mức độ ô nhiễm "
                          }
                        ],
                        initialValue: props.assessment
                      })(
                        <TextArea
                          onChange={(event) => {
                            props.updateData({
                              assessment: event.target.value
                            });
                          }}
                          placeholder="Nhập đánh giá mức độ ô nhiễm"
                        />
                      )}
                    </Form.Item>
                  </div>
                  <div className="col-6">
                    <Form.Item label="Chọn thời gian thực hiện *">
                      {getFieldDecorator("actDate", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng chọn thời gian bắt đầu"
                          }
                        ],
                        initialValue: props.actDate
                      })(
                        <DatePicker
                          className="date"
                          onChange={e => {
                            props.updateData({
                              actDate: e
                            });
                          }}
                          format="DD/MM/YYYY"
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="Người lấy mẫu">
                      {getFieldDecorator("executor", {
                        initialValue: props.executor
                      })(
                        <Input
                          onChange={(event) => {
                            props.updateData({
                              executor: event.target.value
                            });
                          }}
                          placeholder="Nhập tên người lấy mẫu"
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="Người đánh giá">
                      {getFieldDecorator("assessor", {
                        initialValue: props.assessor
                      })(
                        <Input
                          onChange={(event) => {
                            props.updateData({
                              assessor: event.target.value
                            });
                          }}
                          placeholder="Nhập tên người đánh giá"
                        />
                      )}
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Form.Item label="Đánh giá chi tiết">
                      <div className="evaluate-detail">
                        <table>
                          <tbody className="table-body">
                            <tr>
                              <td style={{ width: "15%" }}>Thông số</td>
                              <td style={{ width: "15%" }}>Phương thức xác định</td>
                              <td style={{ width: "15%" }}>Dải thảm chiếu</td>
                              <td style={{ width: "15%" }}>Đơn vị</td>
                              <td style={{ width: "15%" }}>Kết quả</td>
                              <td style={{ width: "15%" }}></td>
                            </tr>
                            <tr>
                              <td>
                                <TextArea
                                  value={props.name}
                                  onChange={(event) => {
                                    props.updateData({
                                      name: event.target.value
                                    });
                                  }}
                                />
                              </td>
                              <td>
                                <TextArea
                                  value={props.testMethod}
                                  onChange={(event) => {
                                    props.updateData({
                                      testMethod: event.target.value
                                    });
                                  }}
                                />
                              </td>
                              <td>
                                <TextArea
                                  value={props.referenceRange}
                                  onChange={(event) => {
                                    props.updateData({
                                      referenceRange: event.target.value
                                    });
                                  }}
                                />
                              </td>
                              <td>
                                <TextArea
                                  value={props.unit}
                                  onChange={(event) => {
                                    props.updateData({
                                      unit: event.target.value
                                    });
                                  }}
                                />
                              </td>
                              <td>
                                <TextArea
                                  value={props.result}
                                  onChange={(event) => {
                                    props.updateData({
                                      result: event.target.value
                                    });
                                  }}
                                />
                              </td>
                              <td className="check-button-plus">
                                {
                                  props.checkUpdate ?
                                    <Tooltip placement="topLeft" title={"Cập nhật"}>
                                      <div className="button-modal" onClick={() => { updateDetail() }}>
                                        <i className="fal fa-save"></i>
                                      </div>
                                    </Tooltip>
                                    :
                                    <Tooltip placement="topLeft" title={"Thêm mới"}>
                                      <div className="button-modal" onClick={() => { createDetail() }}>
                                        <i className="fal fa-plus-square"></i>
                                      </div>
                                    </Tooltip>
                                }
                              </td>
                            </tr>
                            {
                              props.lines && props.lines.length ? props.lines.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.testMethod}</td>
                                    <td>{item.referenceRange}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.result}</td>
                                    <td style={{ textAlign: "center" }}>
                                      <Tooltip placement="topLeft" title={"Chỉnh sửa"}>
                                        <span className="button-modal" onClick={() => updateModalDetail(item, index)}>
                                          <i className="fal fa-edit"></i>
                                        </span>
                                      </Tooltip>
                                      <Tooltip placement="topLeft" title={"Xóa"}>
                                        <span className="button-modal" onClick={() => deleteDetail(index)}>
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
              <div className="creat-button">
                <Button onClick={onClose} style={{ marginRight: 8 }}>
                  Hủy
                  </Button>
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                  {props.id ? "Lưu thay đổi" : "Tạo mới"}
                </Button>
              </div>
            </Panel>
          </> : null
      }
    </>
  );
}
export default connect(
  state => {
    return {
      auth: state.auth.auth,
      id: state.environmentalTests.id,
      specimenType: state.environmentalTests.specimenType,
      specimenTypeId: state.environmentalTests.specimenTypeId,
      mdEnvironmentalId: state.environmentalTests.mdEnvironmentalId,
      assessment: state.environmentalTests.assessment,
      assessor: state.environmentalTests.assessor,
      executor: state.environmentalTests.executor,
      assessorId: state.environmentalTests.assessorId,
      executorId: state.environmentalTests.executorId,
      location: state.environmentalTests.location,
      actDate: state.environmentalTests.actDate && moment(state.environmentalTests.actDate) || null,
      checkUpdate: state.environmentalTests.checkUpdate || false,
      dataUsers: state.users.users || [],
      dataSpecimenTypes: state.specimenTypes.specimenTypes || [],
      dataMdEnvironmentalTest: state.mdEnvironmentalTests.mdEnvironmentalTests || [],
      lines: state.environmentalTests.lines || [],
      index: state.environmentalTests.index,
      name: state.environmentalTests.name,
      testMethod: state.environmentalTests.testMethod,
      referenceRange: state.environmentalTests.referenceRange,
      unit: state.environmentalTests.unit,
      result: state.environmentalTests.result,
    };
  },
  {
    updateData: actionEnvironmentalTests.updateData,
    createOrEdit: actionEnvironmentalTests.createOrEdit,
    loadDetail: actionEnvironmentalTests.loadDetail,
    loadMdEnvironmentalTests: actionMdEnvironmentalTests.loadList,
    loadDetailMdEnviromentalTests: actionMdEnvironmentalTests.loadDetail,
    loadUpdateMdEnvironmentalTests: actionMdEnvironmentalTests.updateData,
    loadSpecimenTypes: actionSpecimenTypes.loadList,
    createOrEditSpecimenTypes: actionSpecimenTypes.createOrEdit,
  }
)(Form.create()(index));
