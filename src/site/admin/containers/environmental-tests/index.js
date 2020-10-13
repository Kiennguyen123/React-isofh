import React, { useEffect } from "react";
import { Button, Select, Tooltip, DatePicker } from "antd";
import { connect } from "react-redux";
import actionEnvironmentalTest from "@actions/environmental-tests";
import actionSpecimenTypes from "@actions/specimen-types";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import './style.scss'
import moment from 'moment';
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
      searchSpecimenType: "",
      searchAssessment: "",
      searchAssessor: "",
      searchExecutor: "",
      searchDateFrom: null,
      searchDateTo: null,
    })
    props.loadList();
    props.gotoPage();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: (item.specimenType || {}).name,
      col3: item.actDate && new Date(item.actDate).format("dd-MM-YYYY"),
      col4: item.assessment,
      col5: item.executor,
      col6: item.assessor,
      col7: item,
    };
  });
  const editItem = item => {
    props.updateData({
      id: item.id,
      specimenTypeId: item.specimenTypeId,
      mdEnvironmentalId: item.mdEnvironmentalId,
      assessment: item.assessment,
      assessor: item.assessor,
      executor: item.executor,
      actDate: item.actDate,
      dataIndex: item.lines,
      location: item.location,
    });
    props.history.push("/environmental-tests/edit/" + item.id);
  };
  const showDetail = item => {
    props.updateData({
      mdEnvironmentalId: item.mdEnvironmentalId
    })
    props.history.push("/environmental-tests/detail/" + item.id);
  }
  const onDeleteItem = item => {
    props.onDeleteItem(item);
  };
  const onCreate = () => {
    props.updateData({
      id: "",
      specimenTypeId: "",
      mdEnvironmentalId: "",
      assessment: "",
      assessor: "",
      executor: "",
      actDate: "",
      dataIndex: "",
      location: "",
      lines: "",
      searchAssessment: "",
      searchAssessor: "",
      searchExecutor: "",
      searchSpecimenType: "",
    });
    props.history.push("/environmental-tests/create");
  }
  // const excel = () => {}
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option === "ROLE_user_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage
              className="mgr-air-pollution-incidents"
              icon="subheader-icon fal fa-window"
              header="Danh sách xét nghiệm đánh giá Môi Trường"
              subheader="Danh sách xét nghiệm đánh giá Môi Trường"
            >
              <Panel
                id={"mgr-air-pollution-incidents"}
                allowClose={false}
                allowCollapse={false}
                toolbar={
                  <div className="toolbar">
                    {/* <Button className="button" onClick={() => excel()}>Xuất Excel</Button> */}
                    <Button className="button" onClick={() => onCreate()}>Thêm mới</Button>
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
                            LỌC THEO
                          </div>
                        </div>
                      ),
                      width: 100,
                      dataIndex: "col1",
                      key: "col1"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Loại mẫu xét nghiệm</div>
                          <div className="addition-box">
                            <Select
                              showSearch
                              placeholder="Chọn loại mẫu xét nghiệm"
                              optionFilterProp="children"
                              onChange={e => props.onSearch(e, 'specimenType')}
                              filterOption={(input, option) =>
                                option.props && option.props.children && option.props.children
                                  .toLowerCase().unsignText()
                                  .indexOf(input.toLowerCase().unsignText()) >= 0
                              }
                            >
                              <Option value="">--- Tất cả ---</Option>
                              {
                                props.dataSpecimenTypes.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.id}>{item.name}</Option>
                                  )
                                })
                              }
                            </Select>
                          </div>
                        </div>
                      ),
                      width: 200,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Thời gian thực hiện</div>
                          <div className="addition-box">
                            <DatePicker
                              defaultValue={props.searchDateFrom}
                              placeholder="Từ ngày"
                              onChange={e => {
                                props.onSearch(e, "searchDateFrom");
                              }}
                              format="DD/MM/YYYY"
                            />
                            <DatePicker
                              defaultValue={props.searchDateTo}
                              placeholder="Đến ngày"
                              onChange={e => {
                                props.onSearch(e, "searchDateTo");
                              }}
                              format="DD/MM/YYYY"
                            />
                          </div>
                        </div>
                      ),
                      width: 300,
                      dataIndex: "col3",
                      key: "col3",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Đánh giá mức độ ô nhiễm</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchAssessment}
                                onChange={e => {
                                  props.updateData({
                                    searchAssessment: e.target.value
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
                                placeholder="Tìm theo mức độ ô nhiễm"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 200,
                      dataIndex: "col4",
                      key: "col4",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Người lấy mẫu</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchExecutor}
                                onChange={e => {
                                  props.updateData({
                                    searchExecutor: e.target.value
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
                                placeholder="Tìm theo người lấy mẫu"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 150,
                      dataIndex: "col5",
                      key: "col5",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Người đánh giá</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchAssessor}
                                onChange={e => {
                                  props.updateData({
                                    searchAssessor: e.target.value
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
                                placeholder="Tìm theo người đánh giá"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 400,
                      dataIndex: "col6",
                      key: "col6",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box"></div>
                          <div className="addition-box"></div>
                        </div>
                      ),
                      key: "col7",
                      fixed: "right",
                      dataIndex: "col7",
                      width: 170,
                      render: item => {
                        return (
                          <div className="col-action">
                            <Tooltip placement="topLeft" title={"Xem chi tiết"}>
                              <div>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    showDetail(item)
                                  }}
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
                                  onClick={(e) => {
                                    e.preventDefault();
                                    editItem(item)
                                  }}
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
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onDeleteItem(item)
                                  }}
                                  className="btn btn-info btn-icon waves-effect waves-themed"
                                >
                                  <i className="fal fa-trash-alt"></i>
                                </a>
                              </div>
                            </Tooltip>
                          </div>
                        );
                      }
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
          </>
          : null}
    </>
  );
}
export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.environmentalTests.data || [],
      size: state.environmentalTests.size || 10,
      page: state.environmentalTests.page || 1,
      total: state.environmentalTests.total || 0,
      specimenType: state.environmentalTests.specimenType,
      assessment: state.environmentalTests.assessment,
      assessor: state.environmentalTests.assessor,
      executor: state.environmentalTests.executor,
      location: state.environmentalTests.location,
      searchSpecimenType: state.environmentalTests.searchSpecimenType,
      searchAssessment: state.environmentalTests.searchassessment,
      searchAssessor: state.environmentalTests.searchAssessor,
      searchExecutor: state.environmentalTests.searchExecutor,
      searchDateFrom: state.environmentalTests.searchDateFrom && moment(state.environmentalTests.searchDateFrom),
      searchDateTo: state.environmentalTests.searchDateTo && moment(state.environmentalTests.searchDateTo),
      dataSpecimenTypes: state.specimenTypes.specimenTypes || [],
      clearTimeOutAffterRequest: state.environmentalTests.clearTimeOutAffterRequest
    };
  },
  {
    updateData: actionEnvironmentalTest.updateData,
    onSizeChange: actionEnvironmentalTest.onSizeChange,
    gotoPage: actionEnvironmentalTest.gotoPage,
    onSearch: actionEnvironmentalTest.onSearch,
    onDeleteItem: actionEnvironmentalTest.onDeleteItem,
    loadList: actionSpecimenTypes.loadList,
  }
)(index);
