import React, { useEffect } from "react";
import { Button, Tooltip } from "antd";
import { connect } from "react-redux";
import actioninfectiousDiseases from "@actions/infectious-diseases";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import ModalAddUpdate from "./create";
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
      searchValue: "",
    })
    props.gotoPage();
    props.loadList();
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
  const editItem = item => () => {
    props.updateData({
      id: item.id,
      active: item.active,
      dataIndex: item.lines,
      name: item.name,
      value: item.value,
      isOpen: true
    });
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
  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" ?
          <>
            <AdminPage
              className="mgr-infectious-diseases"
              icon="subheader-icon fal fa-window"
              header="Danh mục nhóm bệnh truyền nhiễm"
              subheader="Danh sách danh mục nhóm bệnh truyền nhiễm"
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
                        <div className="custom-header">
                          <div className="title-box">STT</div>
                          <div className="addition-box"></div>
                        </div>
                      ),
                      width: 70,
                      dataIndex: "col1",
                      key: "col1"
                    },
                    {
                      title: (
                        <div className="custom-header">
                          <div className="title-box">Mã nhóm</div>
                          <div className="addition-box">
                            <div className="search-box" style={{ width: "70%" }}>
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
                                placeholder="Tìm theo mã nhóm"
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
                        <div className="custom-header">
                          <div className="title-box">Tên nhóm</div>
                          <div className="addition-box">
                            <div style={{ width: "70%" }} className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                style={{ width: "70%" }}
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
                                placeholder="Tìm theo tên nhóm"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 700,
                      dataIndex: "col3",
                      key: "col3"
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
                      width: 100,
                      render: item => {
                        return (
                          <div className="col-action">
                            <Tooltip placement="topLeft" title={"Sửa"}>
                              <div>
                                <a
                                  href="#"
                                  onClick={editItem(item)}
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
                      dataIndex: "col4",
                      key: "col4"
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
            {props.isOpen && <ModalAddUpdate />}
          </>
          : null}
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.infectiousDiseases.data || [],
      page: state.infectiousDiseases.page || 1,
      size: state.infectiousDiseases.size || 10,
      total: state.infectiousDiseases.total || 0,
      isOpen: state.infectiousDiseases.isOpen,
      searchName: state.infectiousDiseases.searchName,
      searchValue: state.infectiousDiseases.searchValue,
      clearTimeOutAffterRequest: state.infectiousDiseases.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actioninfectiousDiseases.updateData,
    onSizeChange: actioninfectiousDiseases.onSizeChange,
    gotoPage: actioninfectiousDiseases.gotoPage,
    onDeleteItem: actioninfectiousDiseases.onDeleteItem,
    loadList: actioninfectiousDiseases.loadList
  }
)(index)