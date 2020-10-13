import React, { useEffect } from "react";
import { Form, Button, Input, Select, DatePicker, Tooltip } from "antd";
import { connect } from "react-redux";
import { Panel } from "@admin/components/admin";
import snackbar from "@utils/snackbar-utils";
import actionAirPollutionIncidents from "@actions/air-pollution-incidents";
import actionCategoryIncidents from '@actions/category-incidents';
import Constant from '@config/data-contants'
import moment from 'moment';
import "../style.scss";
const { Option } = Select;
const { TextArea } = Input;
function index(props) {
  const { criteria, valueQuantitative, weight, result, detailRating, index } = props;
  const id = props.match.params.id;
  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_moi_truong" || option == "ROLE_user_ql_moi_truong" || option == "ROLE_user_mescohn"));
  useEffect(() => {
    props.loadListCategoryIncidents();
    if (id) {
      props.loadDetail(id);
    }
    props.updateData({
      criteria: "",
      valueQuantitative: "",
      weight: "",
      result: "",
      textCriteria: "",
      textValueQuantitative: "",
      textWeight: "",
      textResult: "",
      checkUpdate: false
    })
  }, []);
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/air-pollution-incidents");
        });
      }
    });
  };
  const onClose = () => {
    props.history.push("/air-pollution-incidents");
  }
  const loadData = (data) => {
    props.updateData({
      detailRating: data,
      criteria: "",
      valueQuantitative: "",
      weight: "",
      unit: "",
      result: "",
      index: "",
    })

    if (!id) {
      props.history.push("/air-pollution-incidents/create");
    }
  }
  const createDetail = () => {
    let params = {
      criteria: criteria ? criteria : null,
      valueQuantitative: valueQuantitative ? valueQuantitative : null,
      weight: weight ? weight : null,
      result: result ? result : null
    }
    if (props.criteria) {
      if (isNaN(props.valueQuantitative)) {
        props.updateData({
          textCriteria: "",
          textValueQuantitative: "Sai định dạng trường giá trị định lượng",
          textWeight: "",
          textResult: "",
        })
      } else if (isNaN(props.weight)) {
        props.updateData({
          textCriteria: "",
          textValueQuantitative: "",
          textWeight: "Sai định dạng trường trọng số",
          textResult: "",
        })
      } else if (isNaN(props.result)) {
        props.updateData({
          textCriteria: "",
          textValueQuantitative: "",
          textWeight: "",
          textResult: "Sai định dạng trường kết quả",
        })
      } else {
        detailRating.push(params)
        loadData(detailRating);
      }
    } else {
      props.updateData({
        textCriteria: "Trường tiêu chí không được để trống"
      })
    }

  }
  const updateDetail = () => {
    if (isNaN(props.valueQuantitative)) {
      props.updateData({
        textCriteria: "",
        textValueQuantitative: "Sai định dạng trường giá trị định lượng",
        textWeight: "",
        textResult: "",
      })
    } else if (isNaN(props.weight)) {
      props.updateData({
        textCriteria: "",
        textValueQuantitative: "",
        textWeight: "Sai định dạng trường trọng số",
        textResult: "",
      })
    } else if (isNaN(props.result)) {
      props.updateData({
        textCriteria: "",
        textValueQuantitative: "",
        textWeight: "",
        textResult: "Sai định dạng trường kết quả",
      })
    } else {
      props.updateData({
        checkUpdate: false,
        textCriteria: "",
        textValueQuantitative: "",
        textWeight: "",
        textResult: "",
      })
      detailRating[index] = {
        criteria: criteria ? criteria : null,
        valueQuantitative: valueQuantitative ? valueQuantitative : null,
        weight: weight ? weight : null,
        result: result ? result : null,
        checkUpdate: false,
      }
      loadData(detailRating);
    }

  }
  const updateDataDetail = (data, index) => {
    props.updateData({
      criteria: data.criteria,
      valueQuantitative: data.valueQuantitative,
      weight: data.weight,
      result: data.result,
      index: index,
      checkUpdate: true
    })
  }
  const deleteDetail = (index) => {
    detailRating.splice(index, 1);
    loadData(detailRating);
  }
  return (
    <>
      {checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
        <Panel
          title={props.id ? "Cập nhật thông tin sự cố ô nhiễm" : "Thêm mới thông tin sự cố ô nhiễm"}
          id={"air-pollution-incidents"}
          allowClose={false}
          allowCollapse={false}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <Form.Item label="Tên sự cố *">
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập tên sự cố "
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
                      autoComplete="off"
                      placeholder="Nhập tên sự cố"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Loại sự cố *">
                  {getFieldDecorator("typeIncidentId", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng chọn loại sự cố "
                      }
                    ],
                    initialValue: props.typeIncidentId
                  })(
                    <Select
                      onChange={e => {
                        props.updateData({
                          typeIncidentId: e
                        })
                      }}
                      placeholder="Chọn loại sự cố"
                      optionFilterProp="children"
                    >
                      <Option value={''}>Chọn loại sự cố</Option>
                      {
                        props.listCategoryIncidents && props.listCategoryIncidents.length && props.listCategoryIncidents.map((item, index) => {
                          return (
                            <Option key={index} value={item.id}>{item.incidentType}</Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Tình trạng *">
                  {getFieldDecorator("status", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập tình trạng "
                      }
                    ],
                    initialValue: props.status
                  })(
                    <TextArea
                      onChange={(event) => {
                        props.updateData({
                          status: event.target.value
                        });
                      }}
                      placeholder="Nhập tình trạng"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Nguyên nhân *">
                  {getFieldDecorator("reason", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập nguyên nhân sự cố "
                      }
                    ],
                    initialValue: props.reason
                  })(
                    <TextArea
                      onChange={(event) => {
                        props.updateData({
                          reason: event.target.value
                        });
                      }}
                      placeholder="Nhập nguyên nhân"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Phạm vi *">
                  {getFieldDecorator("arena", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng nhập phạm vi "
                      }
                    ],
                    initialValue: props.arena
                  })(
                    <TextArea
                      onChange={(event) => {
                        props.updateData({
                          arena: event.target.value
                        });
                      }}
                      placeholder="Nhập phạm vi ảnh hưởng"
                    />
                  )}
                </Form.Item>
              </div>
              <div className="col-6">
                <div className="row">
                  <div className="col-6">
                    <Form.Item label="Chọn thời gian bắt đầu *">
                      {getFieldDecorator("fromDate", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng chọn thời gian bắt đầu"
                          }
                        ],
                        initialValue: props.fromDate
                      })(
                        <DatePicker
                          className="date"
                          onChange={e => {
                            props.updateData({
                              fromDate: e
                            });
                          }}
                          format="DD/MM/YYYY"
                        />
                      )}
                    </Form.Item>
                  </div>
                  <div className="col-6">
                    <Form.Item label="Chọn thời gian kết thúc">
                      {getFieldDecorator("toDate", {
                        initialValue: props.toDate
                      })(
                        <DatePicker
                          className="date"
                          onChange={e => {
                            props.updateData({
                              toDate: e
                            });
                          }}
                          format="DD/MM/YYYY"
                        />
                      )}
                    </Form.Item>
                  </div>
                </div>
                <Form.Item label="Giai đoạn của sự cố *">
                  {getFieldDecorator("value", {
                    rules: [
                      {
                        required: true,
                        message: "Vui lòng chọn giai đoạn của sự cố "
                      }
                    ],
                    initialValue: props.stageIncident
                  })(
                    <Select
                      onChange={e => {
                        props.updateData({
                          stageIncident: e
                        })
                      }}
                      placeholder="Chọn giai đoạn sự cố"
                      optionFilterProp="children"
                    >
                      <Option value={''}>Chọn giai đoạn sự cố</Option>
                      {
                        Constant.giaiDoanSuCo && Constant.giaiDoanSuCo.length && Constant.giaiDoanSuCo.map((item, index) => {
                          return (
                            <Option key={index} value={item.id}>{item.name}</Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Cách xử lý">
                  {getFieldDecorator("handling", {
                    initialValue: props.handling
                  })(
                    <TextArea
                      onChange={e => {
                        props.updateData({
                          handling: e.target.value
                        });
                      }}
                      placeholder="Nhập cách xử lý"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Kết luận">
                  {getFieldDecorator("conclusion", {
                    initialValue: props.conclusion
                  })(
                    <TextArea
                      onChange={(event) => {
                        props.updateData({
                          conclusion: event.target.value
                        });
                      }}
                      placeholder="Nhập kết luận"
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
                          <td style={{ width: "15%" }}>Tiêu chí</td>
                          <td style={{ width: "15%" }}>Giá trị định lượng</td>
                          <td style={{ width: "15%" }}>Trọng số</td>
                          <td style={{ width: "15%" }}>Kết quả</td>
                          <td style={{ width: "15%" }}></td>
                        </tr>
                        <tr>
                          <td>
                            <TextArea
                              style={{
                                marginBottom: "0"
                              }}
                              value={props.criteria}
                              onChange={e => {
                                props.updateData({
                                  criteria: e.target.value,
                                  textCriteria: ""
                                });
                              }}
                              placeholder="Nhập tiêu chí"
                            />
                            <p className="notification-error">{props.textCriteria}</p>
                          </td>
                          <td>
                            <Input
                              value={props.valueQuantitative}
                              onChange={e => {
                                props.updateData({
                                  valueQuantitative: e.target.value
                                });
                              }}
                              placeholder="Nhập giá trị định lượng"
                              autoComplete="off"
                            />
                            <p className="notification-error">{props.textValueQuantitative}</p>
                          </td>
                          <td>
                            <Input
                              value={props.weight}
                              onChange={e => {
                                props.updateData({
                                  weight: e.target.value
                                });
                              }}
                              placeholder="Nhập trọng số"
                              autoComplete="off"
                            />
                            <p className="notification-error">{props.textWeight}</p>
                          </td>
                          <td>
                            <Input
                              value={props.result}
                              onChange={e => {
                                props.updateData({
                                  result: e.target.value
                                });
                              }}
                              placeholder="Nhập kết quả"
                              autoComplete="off"
                            />
                            <p className="notification-error">{props.textResult}</p>
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
                          props.detailRating && props.detailRating.length ? props.detailRating.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.criteria}</td>
                                <td>{item.valueQuantitative}</td>
                                <td>{item.weight}</td>
                                <td>{item.result}</td>
                                <td style={{ textAlign: "center" }}>
                                  <Tooltip placement="topLeft" title={"Chỉnh sửa"}>
                                    <span className="button-modal" onClick={() => updateDataDetail(item, index)}>
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
            <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              {props.id ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </Panel> : null
      }
    </>
  );
}


export default connect(
  state => {
    return {
      auth: state.auth.auth,
      id: state.airPollutionIncidents.id,
      name: state.airPollutionIncidents.name,
      reason: state.airPollutionIncidents.reason,
      arena: state.airPollutionIncidents.arena,
      status: state.airPollutionIncidents.status,
      handling: state.airPollutionIncidents.handling,
      stageIncident: state.airPollutionIncidents.stageIncident,
      typeIncidentId: state.airPollutionIncidents.typeIncidentId,
      fromDate: state.airPollutionIncidents.fromDate && moment(state.airPollutionIncidents.fromDate) || null,
      toDate: state.airPollutionIncidents.toDate && moment(state.airPollutionIncidents.toDate) || null,
      checkUpdate: state.airPollutionIncidents.checkUpdate || false,
      conclusion: state.airPollutionIncidents.conclusion,
      detailRating: state.airPollutionIncidents.detailRating || [],
      index: state.airPollutionIncidents.index,
      criteria: state.airPollutionIncidents.criteria,
      valueQuantitative: state.airPollutionIncidents.valueQuantitative,
      weight: state.airPollutionIncidents.weight,
      result: state.airPollutionIncidents.result,
      listCategoryIncidents: state.categoryIncidents.categoryIncidents || [],
      textCriteria: state.airPollutionIncidents.textCriteria || "",
      textValueQuantitative: state.airPollutionIncidents.textValueQuantitative || "",
      textWeight: state.airPollutionIncidents.textWeight || "",
      textResult: state.airPollutionIncidents.textResult || "",
    };
  },
  {
    updateData: actionAirPollutionIncidents.updateData,
    onSizeChange: actionAirPollutionIncidents.onSizeChange,
    gotoPage: actionAirPollutionIncidents.gotoPage,
    onSearch: actionAirPollutionIncidents.onSearch,
    createOrEdit: actionAirPollutionIncidents.createOrEdit,
    onDeleteItem: actionAirPollutionIncidents.onDeleteItem,
    loadDetail: actionAirPollutionIncidents.loadDetail,
    loadListCategoryIncidents: actionCategoryIncidents.loadList,
  }
)(Form.create()(index));
