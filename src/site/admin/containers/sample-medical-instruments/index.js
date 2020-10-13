import React, { useEffect } from "react";
import { Button, Tooltip } from "antd";
import { connect } from "react-redux";
import actionDmMauDungCu from "@actions/dm-mau-dung-cu";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import ModalMedical from "./create"
import './style.scss'
function index(props) {
  useEffect(() => {
    props.updateData({
      searchValue: "",
      searchName: "",
    })
    props.gotoPage();
  }, []);
  const onSizeChange = size => {
    props.onSizeChange(size);
  };

  const onPageChange = page => {
    props.gotoPage(page);
  };

  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.value,
      col3: item.name,
      col4: item.createdAt && new Date(item.createdAt).format("dd-MM-YYYY"),
      col5: item,
    };
  });

  const editItem = (item) => {
    props.updateData({
      id: item.id,
      active: item.active,
      name: item.name,
      value: item.value,
      dungCuIds: item.dungCuIds,
      isOpen: true,
    });
  };

  const onDeleteItem = item => {
    props.onDeleteItem(item);
  };

  const onCreate = (data) => {
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
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage
              className="mgr-air-pollution-incidents"
              icon="subheader-icon fal fa-window"
              header="Danh mục mẫu dụng cụ y tế"
              subheader="Danh mục mẫu dụng cụ y tế"
            >
              <Panel
                id={"mgr-air-pollution-incidents"}
                title="Danh mục mẫu dụng cụ y tế"
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
                                placeholder="Tìm theo mã số"
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
                          <div className="title-box">Tên mẫu dụng cụ y tế</div>
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
                                placeholder="Tìm theo tên sản phẩm"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 350,
                      dataIndex: "col3",
                      key: "col3",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Ngày tạo</div>
                          <div className="addition-box"></div>
                        </div>
                      ),
                      width: 400,
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
              props.isOpen ?
                <ModalMedical />
                : null
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
      data: state.dmMauDungCu.data || [],
      size: state.dmMauDungCu.size || 10,
      page: state.dmMauDungCu.page || 1,
      total: state.dmMauDungCu.total || 0,
      isOpen: state.dmMauDungCu.isOpen || false,
      dungCuIds: state.dmMauDungCu.dungCuIds,
      searchValue: state.dmMauDungCu.searchValue,
      searchName: state.dmMauDungCu.searchName,
      dataMedical: [],
      clearTimeOutAffterRequest: state.dmMauDungCu.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actionDmMauDungCu.updateData,
    onSizeChange: actionDmMauDungCu.onSizeChange,
    gotoPage: actionDmMauDungCu.gotoPage,
    onDeleteItem: actionDmMauDungCu.onDeleteItem,
  }
)(index);

