import React, { useEffect } from "react";
import { Button, Select, Tooltip, DatePicker } from "antd";
import { connect } from "react-redux";
import actionAirPollutionIncidents from "@actions/air-pollution-incidents";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import Constant from '@config/data-contants';
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
      searchName: "",
      searchStageIncident: "",
      searchFromDate: null,
      searchToDate: null,
    })
    props.gotoPage();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.name,
      col3: item.stageIncident,
      col4: item.fromDate && moment(item.fromDate).format("DD-MM-YYYY"),
      col5: item.toDate && moment(item.toDate).format("DD-MM-YYYY"),
      col6: item,
    };
  });
  const editItem = item => {
    props.history.push("/air-pollution-incidents/edit/" + item.id);
  };
  const showDetail = item => {
    props.history.push("/air-pollution-incidents/detail/" + item.id);
  }
  const onDeleteItem = item => {
    props.onDeleteItem(item);
  };
  const onCreate = () => {
    props.updateData({
      id: "",
      name: "",
      reason: "",
      arena: "",
      typeIncidentId: "",
      stageIncident: "",
      handling: "",
      fromDate: "",
      toDate: "",
      dataIndex: "",
      status: "",
      checkUpdate: false,
      lines: [],
      index: "",
      criteria: "",
      valueQuantitative: "",
      weight: "",
      result: "",
      searchName: "",
      searchStageIncident: "",
      searchFromDate: "",
      searchToDate: "",
      detailRating: "",
      conclusion: ""
    })
    props.history.push("/air-pollution-incidents/create");
  }
  const checkSuCo = (data) => {
    let status = Constant.giaiDoanSuCo && Constant.giaiDoanSuCo.length && Constant.giaiDoanSuCo.filter(item => {
      if (item.id === data) {
        return item;
      }
    })
    if (status.length > 0) {
      return status[0]
    } else {
      return {}
    }
  }

  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_moi_truong" || option == "ROLE_user_ql_moi_truong" || option == "ROLE_user_mescohn"))

  return (
    <>
      {checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
        <AdminPage
          className="mgr-air-pollution-incidents"
          icon="subheader-icon fal fa-window"
          header="Sự cố ô nhiễm môi trường"
          subheader="Danh sách sự cố ô nhiễm môi trường"
        >
          <Panel
            id={"mgr-air-pollution-incidents"}
            allowClose={false}
            allowCollapse={false}
            toolbar={
              <div className="toolbar">
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
                      <div className="title-box">Tên sự cố</div>
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
                            placeholder="Tìm theo tên sự cố"
                          />
                        </div>
                      </div>
                    </div>
                  ),
                  width: 250,
                  dataIndex: "col2",
                  key: "col2",
                },
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box">Giao đoạn của sự cố</div>
                      <div className="addition-box">
                        <Select
                          showSearch
                          value={props.searchStageIncident}
                          placeholder="Chọn giai đoạn sự cố"
                          optionFilterProp="children"
                          onChange={e =>
                            props.onSearch(e, 'stageIncident')
                          }
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <Option value="">Tất cả</Option>
                          {
                            Constant.giaiDoanSuCo && Constant.giaiDoanSuCo.length && Constant.giaiDoanSuCo.map((item, index) => {
                              return (
                                <Option key={index} value={item.id}>{item.name}</Option>
                              )
                            })
                          }
                        </Select>
                      </div>
                    </div>
                  ),
                  width: 300,
                  dataIndex: "col3",
                  key: "col3",
                  render: item => {
                    return (
                      <span>
                        {
                          checkSuCo(item) && checkSuCo(item).name
                        }
                      </span>
                    )
                  }
                },
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box">Thời gian bắt đầu</div>
                      <div className="addition-box">
                        <DatePicker
                          style={{ "minWidth": "300px" }}
                          value={props.searchFromDate}
                          onChange={e => {
                            props.onSearch(e, "fromDate");
                          }}
                          format="DD/MM/YYYY"
                        />
                      </div>
                    </div>
                  ),
                  width: 400,
                  dataIndex: "col4",
                  key: "col4",
                },
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box">Thời gian kết thúc</div>
                      <div className="addition-box">
                        <DatePicker
                          style={{ "minWidth": "300px" }}
                          value={props.searchToDate}
                          onChange={e => {
                            props.onSearch(e, "toDate");
                          }}
                          format="DD/MM/YYYY"
                        />
                      </div>
                    </div>
                  ),
                  width: 400,
                  dataIndex: "col5",
                  key: "col5",
                },
                {
                  title: (
                    <div className="custome-header">
                      <div className="title-box"></div>
                      <div className="addition-box"></div>
                    </div>
                  ),
                  key: "col6",
                  fixed: "right",
                  dataIndex: "col6",
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
        </AdminPage> : null
      }
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.airPollutionIncidents.data || [],
      size: state.airPollutionIncidents.size || 10,
      page: state.airPollutionIncidents.page || 1,
      total: state.airPollutionIncidents.total || 0,
      isOpen: state.airPollutionIncidents.isOpen,
      searchName: state.airPollutionIncidents.searchName,
      searchStageIncident: state.airPollutionIncidents.searchStageIncident,
      searchFromDate: state.airPollutionIncidents.searchFromDate && moment(state.airPollutionIncidents.searchFromDate) || null,
      searchToDate: state.airPollutionIncidents.searchToDate && moment(state.airPollutionIncidents.searchToDate) || null,
      clearTimeOutAffterRequest: state.airPollutionIncidents.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actionAirPollutionIncidents.updateData,
    onSizeChange: actionAirPollutionIncidents.onSizeChange,
    gotoPage: actionAirPollutionIncidents.gotoPage,
    onSearch: actionAirPollutionIncidents.onSearch,
    onDeleteItem: actionAirPollutionIncidents.onDeleteItem,
    changeItageIncident: actionAirPollutionIncidents.changeItageIncident,
  }
)(index);
