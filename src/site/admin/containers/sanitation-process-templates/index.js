import React, { useEffect } from "react";
import { Button, Tooltip } from "antd";
import { connect } from "react-redux";
import actionSanitationProcessTemplates from "@actions/sanitation-process-templates";
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
    props.loadDetail(item.id);
    props.updateData({
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
  const showDetail = item => () => {
    props.history.push("/sanitation-process-templates/detail/" + item.id);
  }
  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage
              className="mgr-sanitation-process-templates"
              icon="subheader-icon fal fa-window"
              header="Danh mục Mẫu quy trình VSMT"
              subheader="Danh sách danh mục Mẫu quy trình VSMT"
            >
              <Panel
                id={"mgr-sanitation-process-templates"}
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
                          <div className="title-box">Mã mẫu</div>
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
                                placeholder="Tìm theo mã mẫu" />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 200,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custom-header">
                          <div className="title-box">Tên mẫu</div>
                          <div className="addition-box">
                            <div style={{ width: "70%" }} className="search-box">
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
                                placeholder="Tìm theo tên mẫu" />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 750,
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
                      width: 120,
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
      data: state.sanitationProcessTemplates.data || [],
      page: state.sanitationProcessTemplates.page || 1,
      size: state.sanitationProcessTemplates.size || 10,
      total: state.sanitationProcessTemplates.total || 0,
      isOpen: state.sanitationProcessTemplates.isOpen,
      searchName: state.sanitationProcessTemplates.searchName,
      searchValue: state.sanitationProcessTemplates.searchValue,
      clearTimeOutAffterRequest: state.sanitationProcessTemplates.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actionSanitationProcessTemplates.updateData,
    onSizeChange: actionSanitationProcessTemplates.onSizeChange,
    gotoPage: actionSanitationProcessTemplates.gotoPage,
    onDeleteItem: actionSanitationProcessTemplates.onDeleteItem,
    loadList: actionSanitationProcessTemplates.loadList,
    loadDetail: actionSanitationProcessTemplates.loadDetail,
  }
)(index)