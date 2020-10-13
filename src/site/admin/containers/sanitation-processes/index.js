import React, { useEffect } from "react";
import { Button, Tooltip, DatePicker } from "antd";
import { connect } from "react-redux";
import actionSanitationProcesses from "@actions/sanitation-processes";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment';
function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };

  const onPageChange = page => {
    props.gotoPage(page);
  };

  useEffect(() => {
    props.gotoPage();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.name,
      col3: item.location,
      col4: item.fromDate ? moment(item.fromDate).format("DD-MM-YYYY") : null,
      col5: item.toDate ? moment(item.toDate).format("DD-MM-YYYY") : null,
      col6: item.result,
      col7: item,
    };
  });
  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  const showCreate = () => {
    props.updateData({
      id: "",
      name: "",
      location: "",
      executor: "",
      result: "",
      fromDate: "",
      sanitationProcessTemplatesId: "",
      toDate: "",
      status: "",
      note: "",
      lines: [],
    });
    props.history.push("/sanitation-processes/create");
  };
  const showEdit = item => () => {
    props.history.push("/sanitation-processes/edit/" + item.id);
  };
  const showDetail = item => () => {
    props.history.push("/sanitation-processes/detail/" + item.id);
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option === "ROLE_user_ql_moi_truong" || option === "ROLE_user_khac" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong" || checkAuth === "ROLE_user_khac" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage
              className="mgr-sanitation-processes"
              icon="subheader-icon fal fa-window"
              header="Quản lý lịch và quy trình vệ sinh môi trường Bệnh viện"
              subheader="Danh sách lịch và quy trình vệ sinh môi trường Bệnh viện"
            >
              <Panel
                id={"mgr-sanitation-processes"}
                title="Danh sách lịch và quy trình vệ sinh môi trường Bệnh viện"
                allowClose={false}
                allowCollapse={false}
                toolbar={
                  <div className="toolbar">
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
                          <div className="title-box">Tiêu đề</div>
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
                                placeholder="Tìm theo tiêu đề"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 300,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Địa điểm</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchLocation}
                                onChange={e => {
                                  props.updateData({
                                    searchLocation: e.target.value
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
                                placeholder="Tìm theo địa điểm"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col3",
                      key: "col3",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Thời gian bắt đầu</div>
                          <div className="addition-box">
                            <DatePicker
                              onChange={e => {
                                props.onSearch(e, "searchFromDate")
                              }}
                              value={props.searchFromDate}
                              style={{ width: "100%" }}
                              format={"DD/MM/YYYY"}
                              placeholder="Nhập thời gian bắt đầu"
                              getPopupContainer={trigger => trigger.parentNode}
                            />
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col4",
                      key: "col4",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Thời gian kết thúc</div>
                          <div className="addition-box">
                            <DatePicker
                              onChange={e => {
                                props.onSearch(e, "searchToDate")
                              }}
                              value={props.searchToDate}
                              style={{ width: "100%" }}
                              format={"DD/MM/YYYY"}
                              placeholder="Nhập thời gian kết thúc"
                              getPopupContainer={trigger => trigger.parentNode}
                            />
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col5",
                      key: "col5",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Kết quả đạt được</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchResult}
                                onChange={e => {
                                  props.updateData({
                                    searchResult: e.target.value
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
                                placeholder="Tìm theo kết quả đạt được"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col6",
                      key: "col6"
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
                      dataIndex: "col7",
                      key: "col7"
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
      data: state.sanitationProcesses.data || [],
      size: state.sanitationProcesses.size || 10,
      page: state.sanitationProcesses.page || 1,
      total: state.sanitationProcesses.total || 0,
      searchName: state.sanitationProcesses.searchName,
      searchLocation: state.sanitationProcesses.searchLocation,
      searchToDate: state.sanitationProcesses.searchToDate ? moment(state.sanitationProcesses.searchToDate) : null,
      searchFromDate: state.sanitationProcesses.searchFromDate ? moment(state.sanitationProcesses.searchFromDate) : null,
      searchResult: state.sanitationProcesses.searchResult,
      clearTimeOutAffterRequest: state.sanitationProcesses.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actionSanitationProcesses.updateData,
    onSizeChange: actionSanitationProcesses.onSizeChange,
    gotoPage: actionSanitationProcesses.gotoPage,
    onSearch: actionSanitationProcesses.onSearch,
    onDeleteItem: actionSanitationProcesses.onDeleteItem,
  }
)(index);
