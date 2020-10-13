import React, { useEffect } from "react";
import { Button, Tooltip } from "antd";
import { connect } from "react-redux";
import actionCategoryIncidents from "@actions/category-incidents";
import moment from 'moment';
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import ModalCreatOrUpdate from "./create";
import './style.scss';
function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };
  const onPageChange = page => {
    props.gotoPage(page);
  };

  useEffect(() => {
    props.updateData({
      searchIncidentCode: "",
      searchIncidentType: "",
      isOpen: false
    })
    props.gotoPage();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.incidentCode,
      col3: item.incidentType,
      col4: item.createdAt ? moment(item.createdAt).format("DD-MM-YYYY") : null,
      col5: item,
    };
  });
  const editItem = (item) => {
    props.updateData({
      id: item.id,
      incidentCode: item.incidentCode,
      incidentType: item.incidentType,
      isOpen: true,
    });
  };
  const onDeleteItem = item => {
    props.onDeleteItem(item);
  };
  const showModalCreateOrEdit = (data) => {
    if (data) {
      props.updateData({
        ...data,
        isOpen: true,
      })
    } else {
      props.updateData({
        isOpen: true,
        id: "",
        incidentCode: "",
        incidentType: ""
      })
    }
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage
              className="mgr-infectious-diseases"
              icon="subheader-icon fal fa-window"
              header="Danh mục loại sự cố"
              subheader="Danh sách danh mục loại sự cố"
            >
              <Panel
                id={"mgr-infectious-diseases"}
                allowClose={false}
                allowCollapse={false}
                toolbar={
                  <div className="toolbar">
                    <Button className="button" onClick={() => showModalCreateOrEdit()}>Thêm mới</Button>
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
                          <div className="addition-box"></div>
                        </div>
                      ),
                      width: 150,
                      dataIndex: "col1",
                      key: "col1"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Mã số</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchIncidentCode}
                                onChange={e => {
                                  props.updateData({
                                    searchIncidentCode: e.target.value
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
                                placeholder="Tìm kiếm theo mã số"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Loại sự cố</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchIncidentType}
                                onChange={e => {
                                  props.updateData({
                                    searchIncidentType: e.target.value
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
                                placeholder="Tìm kiếm theo loại sự cố"
                              />
                            </div>
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
                          <div className="title-box">	Ngày tạo</div>
                          <div className="addition-box">
                          </div>
                        </div>
                      ),
                      width: 600,
                      dataIndex: "col4",
                      key: "col4",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box"></div>
                          <div className="addition-box"></div>
                        </div>
                      ),
                      key: "col5",
                      fixed: "right",
                      dataIndex: "col5",
                      width: 100,
                      render: item => {
                        return (
                          <div className="col-action">
                            <Tooltip placement="topLeft" title={"Sửa"}>
                              <div>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    editItem(item);
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
            {
              props.isOpen
                ?
                <ModalCreatOrUpdate />
                : null
            }
          </>
          : null
      }
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.categoryIncidents.data || [],
      size: state.categoryIncidents.size || 10,
      page: state.categoryIncidents.page || 1,
      total: state.categoryIncidents.total || 0,
      isOpen: state.categoryIncidents.isOpen,
      searchIncidentCode: state.categoryIncidents.searchIncidentCode,
      searchIncidentType: state.categoryIncidents.searchIncidentType,
      clearTimeOutAffterRequest: state.categoryIncidents.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actionCategoryIncidents.updateData,
    onSizeChange: actionCategoryIncidents.onSizeChange,
    gotoPage: actionCategoryIncidents.gotoPage,
    onDeleteItem: actionCategoryIncidents.onDeleteItem,
  }
)(index);
