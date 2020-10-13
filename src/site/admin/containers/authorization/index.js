import React, { useEffect } from "react";
import { Button, Select, Tooltip } from "antd";
import { connect } from "react-redux";
import actionauthorization from "@actions/authorization";
import DataContants from "@config/data-contants";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import actionDepartments from "@actions/departments";
import ModalPhanQuyen from "./create"
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
      isOpen: false,
      searchUserName: "",
      searchFullName: "",
      searchKhoa: "",
      searchRoleId: "",
    })
    props.gotoPage();
    props.loadListDepartment();
  }, []);

  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.username,
      col3: item.fullName,
      col4: item.department && item.department.name,
      col5: item.roleId,
      col6: item,
    };
  });

  const showModal = () => {
    props.updateData({
      isOpen: true,
      id: "",
      username: "",
      fullName: "",
      roleId: "",
      departmentId: "",
    })
  }

  const editItem = item => {
    props.updateData({
      id: item.id,
      username: item.username,
      fullName: item.fullName,
      departmentId: item.departmentId,
      roleId: item.roleId,
      isOpen: true,
    });
  };

  const reset = (data) => {
    props.updateData({
      id: data.id,
      username: data.username,
      fullName: data.fullName,
      departmentId: data.departmentId,
      roleId: 6,
    });
    props.resetAccount()
  }

  const getStatus = (data) => {
    let status = DataContants.typeUsers && DataContants.typeUsers.length && DataContants.typeUsers.filter(item => {
      return item.id === data
    })
    if (status && status.length) {
      return status[0]
    } else {
      return {}
    }
  }

  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option === "ROLE_admin_ql_nhiem_khuan" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage
              className="mgr-air-pollution-incidents"
              icon="subheader-icon fal fa-window"
              header="Phân quyền tài khoản"
              subheader="Danh sách phân quyền tài khoản"
            >
              <Panel
                id={"mgr-air-pollution-incidents"}
                allowClose={false}
                allowCollapse={false}
                toolbar={
                  checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_user_mescohn" ?
                    <div className="toolbar">
                      <Button className="button" onClick={() => showModal()}>Phân quyền</Button>
                    </div>
                    : null
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
                      width: 150,
                      dataIndex: "col1",
                      key: "col1"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tên tài khoản</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchUserName}
                                onChange={e => {
                                  props.updateData({
                                    searchUserName: e.target.value
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
                                placeholder="Tìm theo tên tài khoản"
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
                          <div className="title-box">Họ và tên</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchFullName}
                                onChange={e => {
                                  props.updateData({
                                    searchFullName: e.target.value
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
                                placeholder="Tìm theo tên tài khoản"
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
                          <div className="title-box">Khoa</div>
                          <div className="addition-box">
                            <Select
                              value={props.searchKhoa}
                              onChange={e => {
                                props.updateData({
                                  searchKhoa: e
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
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              placeholder="Chọn khoa"
                            >
                              <Option value="">Tất cả</Option>
                              {
                                props.listDepartment && props.listDepartment.length && props.listDepartment.map((item, index) => {
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
                      dataIndex: "col4",
                      key: "col4",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Loại tài khoản</div>
                          <div className="addition-box">
                            <Select
                              value={props.searchRoleId}
                              onChange={e => {
                                props.updateData({
                                  searchRoleId: e
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
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              placeholder="Chọn loại tài khoản"
                            >
                              <Option value="">Tất cả</Option>
                              {
                                DataContants.typeUsers && DataContants.typeUsers.length && DataContants.typeUsers.map((item, index) => {
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
                      dataIndex: "col5",
                      key: "col5",
                      render: item => {
                        return (
                          <span>
                            {
                              getStatus(item) && getStatus(item).name
                            }
                          </span>
                        )
                      }
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tiện ích</div>
                          <div className="addition-box"></div>
                        </div>
                      ),
                      key: "col6",
                      fixed: "right",
                      dataIndex: "col6",
                      width: 100,
                      render: item => {
                        return (
                          <>
                            {
                              checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_user_mescohn"
                                ?
                                <div className="col-action">
                                  <Tooltip placement="topLeft" title={"Reset phân quyền"}>
                                    <div>
                                      <a
                                        onClick={(e) => {
                                          e.preventDefault();
                                          reset(item)
                                        }}
                                        className="btn btn-info btn-icon waves-effect waves-themed"
                                      >
                                        <i className="fal fa-redo"></i>
                                      </a>
                                    </div>
                                  </Tooltip>
                                  <Tooltip placement="topLeft" title={"Sửa"}>
                                    <div>
                                      <a
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
                                </div>
                                :
                                <div></div>
                            }

                          </>
                        )

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
              props.isOpen ? <ModalPhanQuyen /> : null
            }
          </>
          : null}
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.authorization.data || [],
      size: state.authorization.size || 10,
      page: state.authorization.page || 1,
      total: state.authorization.total || 0,
      isOpen: state.authorization.isOpen || false,
      clearTimeOutAffterRequest: state.authorization.clearTimeOutAffterRequest || null,
      listDepartment: state.departments.departments,
      searchUserName: state.authorization.searchUserName,
      searchFullName: state.authorization.searchFullName,
      searchKhoa: state.authorization.searchKhoa,
      searchRoleId: state.authorization.searchRoleId,
    };
  },
  {
    updateData: actionauthorization.updateData,
    onSizeChange: actionauthorization.onSizeChange,
    gotoPage: actionauthorization.gotoPage,
    resetAccount: actionauthorization.resetAccount,
    loadListDepartment: actionDepartments.loadList,
  }
)(index);
