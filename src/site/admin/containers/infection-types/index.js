import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Select, Tooltip } from "antd";
import { connect } from "react-redux";
import actionInfectionTypes from "@actions/infection-types";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import ModalCreatOrUpdate from "./create";
import './style.scss'
function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };
  const onPageChange = page => {
    props.gotoPage(page);
  };
  useEffect(() => {
    props.updateData({
      searchValue: "",
      searchName: "",
    })
    props.gotoPage();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.value,
      col3: item.name,
      col4: item,
    };
  });

  const editItem = (item) => {
    props.updateData({
      id: item.id,
      name: item.name,
      value: item.value,
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
      })
    }
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_nhiem_khuan"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" ?
          <div>
            <AdminPage
              className="mgr-infectious-diseases"
              icon="subheader-icon fal fa-window"
              header="Danh mục loại nhiễm khuẩn"
              subheader="Danh sách danh mục loại nhiễm khuẩn"
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
                                value={props.searchValue}
                                onChange={e => {
                                  props.updateData({
                                    searchValue: e.target.value
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
                                placeholder="Tìm theo mã số loại nhiễm khuẩn"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 400,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tên loại nhiễm khuẩn</div>
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
                                placeholder="Tìm theo tên loại nhiễm khuẩn"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 800,
                      dataIndex: "col3",
                      key: "col3",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box"></div>
                          <div className="addition-box"></div>
                        </div>
                      ),
                      key: "col4",
                      fixed: "right",
                      dataIndex: "col4",
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
            {
              props.isOpen
                ?
                <ModalCreatOrUpdate />
                : null
            }
          </div>
          : null}
    </>
  );
}
export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.infectionTypes.data || [],
      size: state.infectionTypes.size || 10,
      page: state.infectionTypes.page || 1,
      total: state.infectionTypes.total || 0,
      isOpen: state.infectionTypes.isOpen,
      searchValue: state.infectionTypes.searchValue,
      searchName: state.infectionTypes.searchName,
      clearTimeOutAffterRequest: state.infectionTypes.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actionInfectionTypes.updateData,
    onSizeChange: actionInfectionTypes.onSizeChange,
    gotoPage: actionInfectionTypes.gotoPage,
    onDeleteItem: actionInfectionTypes.onDeleteItem,
    changeStatus: actionInfectionTypes.changeStatus,
  }
)(index);
