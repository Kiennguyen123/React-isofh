import React, { useEffect } from "react";
import { Button, Select, Tooltip, DatePicker } from "antd";
import { connect } from "react-redux";
import actionInfectionPatients from "@actions/infection-patients";
import actionDepartments from "@actions/departments";
import actioninfectiousDiseases from '@actions/infectious-diseases';
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import DataContants from '../../../../config/data-contants';
import './style.scss'
import moment from 'moment'
const { Option } = Select;
function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };
  const onPageChange = page => {
    props.gotoPage(page);
  };
  useEffect(() => {
    props.updateData({
      searchPatientName: "",
      searchReason: "",
      searchHandling: "",
      searchDepartmentId: "",
      searchInfectiousDiseaseId: "",
      searchTreatmentResult: "",
      searchInfectionDateFrom: null,
      searchInfectionDateTo: null,
      searchCuredDateFrom: null,
      searchCuredDateTo: null,
    })
    props.onSearch("", "");
    props.loadListDepartments();
    props.loadListInfectiousDiseases();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.patientName,
      col3: item.departmentId,
      col4: item.infectiousDiseaseId,
      col5: item.reason,
      col6: item.handling,
      col7: new Date(item.infectionDate).format("dd-MM-YYYY"),
      col8: new Date(item.curedDate).format("dd-MM-YYYY"),
      col9: item.treatmentResult,
      col10: item,
    };
  });
  const onDeleteItem = item => {
    props.onDeleteItem(item);
  };
  const showCreate = () => {
    props.updateData({
      id: null,
      patientName: "",
      reason: '',
      handling: '',
      treatmentResult: '',
    });
    props.history.push("/infection-patients/create");
  };
  const showEdit = item => () => {
    props.history.push("/infection-patients/edit/" + item.id);
  };
  const showDetail = item => () => {
    props.history.push("/infection-patients/detail/" + item.id);
  }
  const getTreatmentResult = (item) => {
    var status = DataContants.listTreatmentResult.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (status.length > 0)
      return status[0];
    return {};
  }
  const checkDepartment = (item) => {
    var status = props.departments && props.departments.length ? props.departments.filter((data) => {
      return parseInt(data.id) === Number(item)
    }) : []
    if (status.length > 0)
      return status[0];
    return {};
  }
  const checkInfectionDiseases = (item) => {
    var status = props.infectiousDisease && props.infectiousDisease.length ? props.infectiousDisease.filter((data) => {
      return parseInt(data.id) === Number(item)
    }) : []
    if (status.length > 0)
      return status[0];
    return {};
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option === "ROLE_user_ql_nhiem_khuan"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" ?
          <>
            <AdminPage
              className="mgr-sanitation-processes"
              icon="subheader-icon fal fa-window"
              header="Danh sách NB mắc bệnh truyền nhiễm trong Bệnh viện"
              subheader="Danh sách NB mắc bệnh truyền nhiễm trong Bệnh viện"
            >
              <Panel
                id={"mgr-sanitation-processes"}
                title="Danh sách NB mắc bệnh truyền nhiễm trong Bệnh viện"
                allowClose={false}
                allowCollapse={false}
                toolbar={
                  <div className="toolbar">
                    <Button className="button" onClick={() => { }}>Xuất Excel</Button>
                    <Button className="button" onClick={showCreate}>Thêm mới</Button>
                  </div>
                }
              >
                <Table
                  scroll={{ x: 800, y: 500 }}
                  style={{ marginLeft: -10, marginRight: -10 }}
                  className="custom"
                  columns={[
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">STT</div>
                          <div className="addition-box"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#000"
                            }}
                          >
                          </div>
                        </div>
                      ),
                      width: 70,
                      dataIndex: "col1",
                      key: "col1"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tên bệnh nhân</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchPatientName}
                                onChange={e => {
                                  props.updateData({
                                    searchPatientName: e.target.value
                                  })
                                  if (props.clearTimeOutAffterRequest) {
                                    try {
                                      clearTimeout(props.clearTimeOutAffterRequest);
                                    } catch (error) { }
                                  }
                                  let data = setTimeout(() => {
                                    props.gotoPage()
                                  }, 500)
                                  props.updateData({
                                    clearTimeOutAffterRequest: data
                                  })
                                }
                                }
                                placeholder="Tìm theo tên bệnh nhân"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 150,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Khoa</div>
                          <div className="addition-box">
                            <div className="">
                              <Select
                                showSearch
                                value={props.searchDepartmentId ? props.searchDepartmentId : ''}
                                onChange={e => {
                                  props.updateData({
                                    searchDepartmentId: e
                                  });
                                  props.onSearch(e, 'departmentId')
                                }}
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase().unsignText()
                                    .indexOf(input.toLowerCase().unsignText()) >= 0
                                }
                              >
                                <Option value="">Tất cả</Option>
                                {props.departments.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.id}>
                                      {item.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </div>
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col3",
                      key: "col3",
                      render: item => {
                        return (
                          <>{checkDepartment(item) && checkDepartment(item).name}</>
                        )
                      }
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Nhóm bệnh truyền nhiễm</div>
                          <div className="addition-box">
                            <div className="">
                              <Select
                                showSearch
                                value={props.searchInfectiousDiseaseId ? props.searchInfectiousDiseaseId : ''}
                                onChange={e => {
                                  props.updateData({
                                    searchInfectiousDiseaseId: e
                                  });
                                  props.onSearch(e, 'infectiousDiseaseId')
                                }}
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase().unsignText()
                                    .indexOf(input.toLowerCase().unsignText()) >= 0
                                }
                              >
                                <Option value="">Tất cả</Option>
                                {props.infectiousDisease.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.id}>
                                      {item.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </div>
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col4",
                      key: "col4",
                      render: item => {
                        return (
                          <>{checkInfectionDiseases(item) && checkInfectionDiseases(item).name}</>
                        )
                      }
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Nguyên nhân</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchReason}
                                onChange={e => {
                                  props.updateData({
                                    searchReason: e.target.value
                                  })
                                  if (props.clearTimeOutAffterRequest) {
                                    try {
                                      clearTimeout(props.clearTimeOutAffterRequest);
                                    } catch (error) { }
                                  }
                                  let data = setTimeout(() => {
                                    props.gotoPage()
                                  }, 500)
                                  props.updateData({
                                    clearTimeOutAffterRequest: data
                                  })
                                }
                                }
                                placeholder="Tìm theo nguyên nhân"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 200,
                      dataIndex: "col5",
                      key: "col5"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Cách xử lý</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchHandling}
                                onChange={e => {
                                  props.updateData({
                                    searchHandling: e.target.value
                                  })
                                  if (props.clearTimeOutAffterRequest) {
                                    try {
                                      clearTimeout(props.clearTimeOutAffterRequest);
                                    } catch (error) { }
                                  }
                                  let data = setTimeout(() => {
                                    props.gotoPage()
                                  }, 500)
                                  props.updateData({
                                    clearTimeOutAffterRequest: data
                                  })
                                }
                                }
                                placeholder="Tìm theo cách xử lý"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 200,
                      dataIndex: "col6",
                      key: "col6"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Kết quả điều trị</div>
                          <div className="addition-box">
                            <Select
                              showSearch
                              value={props.searchTreatmentResult ? props.searchTreatmentResult : ''}
                              onChange={e => {
                                props.updateData({
                                  searchTreatmentResult: e
                                });
                                props.onSearch(e, 'treatmentResult')
                              }}
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase().unsignText()
                                  .indexOf(input.toLowerCase().unsignText()) >= 0
                              }
                            >
                              <Option value="">Tất cả</Option>
                              {DataContants.listTreatmentResult.map((item, index) => {
                                return (
                                  <Option key={index} value={item.id}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                      ),
                      width: 150,
                      dataIndex: "col9",
                      key: "col9",
                      render: item => {
                        return (
                          <>{getTreatmentResult(item) ? getTreatmentResult(item).name : null}</>
                        )
                      }
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Thời gian mắc bệnh</div>
                          <div className="addition-box">
                            <DatePicker
                              value={props.searchInfectionDateFrom}
                              onChange={e => {
                                props.onSearch(e, "infectionDateFrom")
                              }}
                              placeholder='Từ ngày'
                              format='DD/MM/YYYY'

                            />
                            <DatePicker
                              value={props.searchInfectionDateTo}
                              onChange={e => {
                                props.onSearch(e, "infectionDateTo")
                              }}
                              placeholder='Đến ngày'
                              className='date-box'
                              format='DD/MM/YYYY'

                            />
                          </div>
                        </div>
                      ),
                      width: 300,
                      dataIndex: "col7",
                      key: "col7",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Thời gian điều trị xong</div>
                          <div className="addition-box">
                            <DatePicker
                              value={props.searchCuredDateFrom}
                              onChange={e => {
                                props.onSearch(e, "curedDateFrom")
                              }}
                              placeholder='Từ ngày'
                              format='DD/MM/YYYY'
                            />
                            <DatePicker
                              value={props.searchCuredDateTo}
                              onChange={e => {
                                props.onSearch(e, "curedDateTo")
                              }}
                              placeholder='Đến ngày'
                              className='date-box'
                              format='DD/MM/YYYY'
                            />
                          </div>
                        </div>
                      ),
                      width: 300,
                      dataIndex: "col8",
                      key: "col8",

                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box"></div>
                          <div className="addition-box"></div>
                        </div>
                      ),
                      key: "operation",
                      fixed: "right",
                      width: 170,
                      render: item => {
                        return (
                          <div className="col-action">
                            <Tooltip placement="topLeft" title={"Xem chi tiết"}>
                              <div>
                                <a
                                  href="#"
                                  onClick={showDetail(item)}
                                  className="btn btn-info btn-icon waves-effect waves-themed"
                                >
                                  <i className="fal fa-eye"></i>
                                </a>
                              </div>
                            </Tooltip>
                            <Tooltip placement="topLeft" title={"Sửa"}>
                              <div>
                                <a
                                  href="#"
                                  onClick={showEdit(item)}
                                  className="btn btn-info btn-icon waves-effect waves-themed"
                                >
                                  <i className="fal fa-edit"></i>
                                </a>
                              </div>
                            </Tooltip>
                            <Tooltip placement="topLeft" title={"Xóa"}>
                              <div>
                                <a
                                  href="#"
                                  onClick={() => onDeleteItem(item)}
                                  className="btn btn-info btn-icon waves-effect waves-themed"
                                >
                                  <i className="fal fa-trash-alt"></i>
                                </a>
                              </div>
                            </Tooltip>
                          </div>
                        );
                      },
                      dataIndex: "col10",
                      key: "col10"
                    }
                  ]}
                  dataSource={data}
                ></Table>
                <div className="footer">
                  <SelectSize value={props.size} selectItem={onSizeChange} />
                  <Pagination
                    onPageChange={onPageChange}
                    page={props.page}
                    size={props.size}
                    total={props.total}
                    style={{ flex: 1, justifyContent: "flex-end" }}
                  />
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
      data: state.infectionPatients.data || [],
      size: state.infectionPatients.size || 10,
      page: state.infectionPatients.page || 1,
      total: state.infectionPatients.total || 0,
      departments: state.departments.departments || [],
      departmentId: state.infectionPatients.departmentId || '',
      infectiousDisease: state.infectiousDiseases.infectiousDiseases || [],
      searchPatientName: state.infectionPatients.searchPatientName,
      searchReason: state.infectionPatients.searchReason,
      searchHandling: state.infectionPatients.searchHandling,
      searchDepartmentId: state.infectionPatients.searchDepartmentId,
      searchInfectiousDiseaseId: state.infectionPatients.searchInfectiousDiseaseId,
      searchTreatmentResult: state.infectionPatients.searchTreatmentResult,
      clearTimeOutAffterRequest: state.infectionPatients.clearTimeOutAffterRequest || null,
      searchInfectionDateFrom: state.infectionPatients.searchInfectionDateFrom ? moment(state.infectionPatients.searchInfectionDateFrom) : null,
      searchInfectionDateTo: state.infectionPatients.searchInfectionDateTo ? moment(state.infectionPatients.searchInfectionDateTo) : null,
      searchCuredDateFrom: state.infectionPatients.searchCuredDateFrom ? moment(state.infectionPatients.searchCuredDateFrom) : null,
      searchCuredDateTo: state.infectionPatients.searchCuredDateTo ? moment(state.infectionPatients.searchCuredDateTo) : null,

    };
  },
  {
    updateData: actionInfectionPatients.updateData,
    onSizeChange: actionInfectionPatients.onSizeChange,
    gotoPage: actionInfectionPatients.gotoPage,
    onSearch: actionInfectionPatients.onSearch,
    onDeleteItem: actionInfectionPatients.onDeleteItem,
    loadListDepartments: actionDepartments.loadList,
    loadListInfectiousDiseases: actioninfectiousDiseases.loadList,
  }
)(index);
