import React, { useEffect, useState } from "react";
import { Button, Select, Tooltip, DatePicker } from "antd";
import { connect } from "react-redux";
import actionHospitalInfections from "@actions/hospital-infections";
import departmentsProvider from "@data-access/departments-provider";
import infectionTypeProvider from "@data-access/infection-types-provider";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment';
import './style.scss';
import DataContants from "@config/data-contants";
const { Option } = Select;
function index(props) {
  const [state, _setState] = useState({
    listDepartment: [],
    listInfectionType: [],
  });
  const setState = (data = {}) => {
    _setState((state) => {
      return { ...state, ...data };
    });
  };
  const [departmentId, setDepartmentId] = useState('');
  const [infectionTypeId, setInfectionTypeId] = useState('');
  const getTreatmentResult = (item) => {
    var treatmentResult = DataContants.listTreatmentResult.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (treatmentResult.length > 0)
      return treatmentResult[0];
    return {};
  }
  const onSizeChange = size => {
    props.onSizeChange(size);
  };
  const onPageChange = page => {
    props.gotoPage(page);
    props.loadList();
  }
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
    props.onSearch("", "", -1);
    getDepartment();
    getInfectionType();
  }, []);
  const getDepartment = () => {
    departmentsProvider
      .search(0, 9999)
      .then((s) => {
        setState({
          listDepartment: s.data,
        });
      })
      .catch((e) => { });
  }
  const getInfectionType = () => {
    infectionTypeProvider
      .search(0, 9999)
      .then((s) => {
        setState({
          listInfectionType: s.data,
        });
      })
      .catch((e) => { });
  }
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.patientName,
      col3: item.department && item.department.name,
      col4: item.infectionType && item.infectionType.name,
      col5: item.reason,
      col6: item.handling,
      col8: item.infectionDate ? moment(item.infectionDate).format("DD-MM-YYYY") : null,
      col9: item.curedDate ? moment(item.curedDate).format("DD-MM-YYYY") : null,
      col7: getTreatmentResult(item.treatmentResult) ? getTreatmentResult(item.treatmentResult).name : null,
      col10: item,
    };
  });
  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  const showCreate = () => {
    props.updateData({
      id: null,
      patientDocument: '',
      patientName: "",
      reason: "",
      handling: "",
      infectionDate: "",
      curedDate: "",
      treatmentResult: ""
    });
    props.history.push("/hospital-infections/create");
  };
  const showEdit = item => (e) => {
    e.preventDefault();
    props.history.push("/hospital-infections/edit/" + item.id);
  };
  const showDetail = item => (e) => {
    e.preventDefault();
    props.history.push("/hospital-infections/detail/" + item.id);
  }
  const ExportExcel = () =>{}
  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_nhiem_khuan" || option == "ROLE_user_ql_nhiem_khuan"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" ?
          <>
            <AdminPage
              className="mgr-hospital-infections"
              icon="subheader-icon fal fa-window"
              header="Quản lý danh sách bệnh nhân nhiễm khuẩn bệnh viện"
              subheader="Danh sách bệnh nhân nhiễm khuẩn bệnh viện"
            >
              <Panel
                id={"mgr-hospital-infections"}
                title={"Danh sách NB nhiễm khuẩn bệnh viện"}
                allowClose={false}
                allowCollapse={false}
                toolbar={
                  <>
                    <div className="toolbar">
                      <Button className="button" onClick={ExportExcel}>Xuất Excel</Button>
                    </div>
                    <div className="toolbar">
                      <Button className="button" onClick={showCreate}>Thêm mới</Button>
                    </div>
                  </>  
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
                          ></div>
                        </div>
                      ),
                      width: 50,
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
                                value={props.searchName}
                                onChange={e => {
                                  props.updateData({
                                    searchName: e.target.value
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
                                placeholder="Tìm tên NB"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 190,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Khoa</div>
                          <div className="addition-box">
                            <Select
                              value={state.departmentId}
                              onChange={(e) => {
                                props.onSearch(e, "departmentId")
                                setState({
                                  departmentId: e,
                                });
                                setDepartmentId(e)
                              }}
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              placeholder="Chọn khoa khám bệnh"
                            >
                              <Option value={""}>Tất cả</Option>
                              {state.listDepartment &&
                                state.listDepartment.length &&
                                state.listDepartment.map((option, index) => {
                                  return (
                                    <Option key={index} value={option.id}>
                                      {option.name}
                                    </Option>
                                  );
                                })}
                            </Select>
                          </div>
                        </div>
                      ),
                      width: 210,
                      dataIndex: "col3",
                      key: "col3"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Loại nhiễm khuẩn</div>
                          <div className="addition-box">
                            <Select
                              value={state.infectionTypeId}
                              onChange={(e) => {
                                props.onSearch(e, "infectionTypeId")
                                setState({
                                  infectionTypeId: e,
                                });
                                setInfectionTypeId(e)
                              }}
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              placeholder="Chọn loại nhiễm khuẩn"
                            >
                              <Option value={""}>Tất cả</Option>
                              {state.listInfectionType &&
                                state.listInfectionType.length &&
                                state.listInfectionType.map((option, index) => {
                                  return (
                                    <Option key={index} value={option.id}>
                                      {option.name}
                                    </Option>
                                  );
                                })}
                            </Select>
                          </div>
                        </div>
                      ),
                      width: 210,
                      dataIndex: "col4",
                      key: "col4"
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
                                placeholder="Tìm nguyên nhân"
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
                                placeholder="Tìm cách xử lý"
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
                              // style={{width:"70%"}}
                              value={props.searchTreatmentResult}
                              onChange={e =>
                                props.onSearch(e, "treatmentResult")
                              }
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              placeholder="Chọn kết quả khám"
                            >
                              <Option value={""}>Tất cả</Option>
                              {DataContants.listTreatmentResult &&
                                DataContants.listTreatmentResult.length &&
                                DataContants.listTreatmentResult.map((option, index) => {
                                  return (
                                    <Option key={index} value={option.id}>
                                      {option.name}
                                    </Option>
                                  );
                                })}
                            </Select>
                          </div>

                        </div>
                      ),
                      width: 180,
                      dataIndex: "col7",
                      key: "col7"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Thời gian mắc bệnh</div>
                          <div className="addition-box">
                            <DatePicker
                              value={props.searchInfectionDateFrom}
                              placeholder='Từ ngày'
                              format='DD/MM/YYYY'
                              onChange={e => {
                                props.onSearch(e, "infectionDateFrom")
                              }}
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
                      width: 250,
                      dataIndex: "col8",
                      key: "col8"
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
                      width: 250,
                      dataIndex: "col9",
                      key: "col9"
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
                      width: 165,
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
                                  onClick={onDeleteItem(item)}
                                  className="btn btn-info btn-icon waves-effect waves-themed"
                                >
                                  <i className="fal fa-trash-alt"></i>
                                </a>
                              </div>
                            </Tooltip>
                          </div>
                        );
                      },
                      key: "col10",
                      dataIndex: "col10",
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
          </> : null
      }
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.hospitalInfections.data || [],
      size: state.hospitalInfections.size || 10,
      page: state.hospitalInfections.page || 1,
      total: state.hospitalInfections.total || 0,
      searchName: state.hospitalInfections.searchName,
      searchReason: state.hospitalInfections.searchReason,
      searchHandling: state.hospitalInfections.searchHandling,
      searchInfectionDateFrom: state.hospitalInfections.searchInfectionDateFrom ? moment(state.hospitalInfections.searchInfectionDateFrom) : null,
      searchInfectionDateTo: state.hospitalInfections.searchInfectionDateTo ? moment(state.hospitalInfections.searchInfectionDateTo) : null,
      searchCuredDateFrom: state.hospitalInfections.searchCuredDateFrom ? moment(state.hospitalInfections.searchCuredDateFrom) : null,
      searchCuredDateTo: state.hospitalInfections.searchCuredDateTo ? moment(state.hospitalInfections.searchCuredDateTo) : null,
      department: state.hospitalInfections.department,
      infectionType: state.hospitalInfections.infectionType,
      searchTreatmentResult: state.hospitalInfections.searchTreatmentResult,
      patientDocument: state.hospitalInfections.patientDocument,
      clearTimeOutAffterRequest: state.hospitalInfections.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actionHospitalInfections.updateData,
    onSizeChange: actionHospitalInfections.onSizeChange,
    gotoPage: actionHospitalInfections.gotoPage,
    onSearch: actionHospitalInfections.onSearch,
    onDeleteItem: actionHospitalInfections.onDeleteItem,
    loadList: actionHospitalInfections.loadList
  }
)(index)