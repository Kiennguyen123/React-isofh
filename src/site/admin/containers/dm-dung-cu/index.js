import React, { useEffect } from "react";
import { Button, Select, Tooltip } from "antd";
import { connect } from "react-redux";
import actionDMDungcu from "@actions/dm-dung-cu";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import contants from '@src/config/data-contants'
import ModalMedical from "./create"
import './style.scss'
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
      searchValue: "",
      searchLoai: "",
    })
    props.gotoPage();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.value,
      col3: item.name,
      col4: item.loai,
      col5: item.createdAt && new Date(item.createdAt).format("dd-MM-YYYY"),
      col6: item,
    };
  });
  const checkTypeProduct = (data) => {
    let status = contants.loaiSanPham && contants.loaiSanPham.length && contants.loaiSanPham.filter(item => {
      return item.id === data
    })
    if (status && status.length) {
      return status[0]
    } else {
      return {}
    }
  }
  const editItem = (item) => {
    props.updateData({
      isOpen: true,
      id: item.id,
      value: item.value,
      name: item.name,
      loai: item.loai
    });
  };
  const onDeleteItem = item => {
    props.onDeleteItem(item);
  };
  const onCreate = () => {
    props.updateData({
      isOpen: true,
    });
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_mescohn" ?
          <div>
            <AdminPage
              className="mgr-air-pollution-incidents"
              icon="subheader-icon fal fa-window"
              header="Danh mục đồ vải, dụng cụ y tế"
              subheader="Danh mục đồ vải, dụng cụ y tế"
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
                          >LỌC THEO </div>
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
                      width: 200,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tên sản phẩm</div>
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
                      width: 250,
                      dataIndex: "col3",
                      key: "col3",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Loại sản phẩm</div>
                          <div className="addition-box">
                            <Select
                              showSearch
                              placeholder="Tất cả"
                              optionFilterProp="children"
                              value={props.searchLoai}
                              onChange={e => props.onSearch(e, 'loai')}
                              filterOption={(input, option) =>
                                option.props && option.props.children && option.props.children
                                  .toLowerCase().unsignText()
                                  .indexOf(input.toLowerCase().unsignText()) >= 0
                              }
                            >
                              <Option value="">Tất cả</Option>
                              {contants.loaiSanPham && contants.loaiSanPham.length && contants.loaiSanPham.map((item, index) => {
                                return (
                                  <Option key={index} value={item.id}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col4",
                      key: "col4",
                      render: item => {
                        return (
                          <span>
                            {checkTypeProduct(item) && checkTypeProduct(item).name}
                          </span>
                        )
                      }
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Ngày tạo</div>
                          <div className="addition-box"></div>
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
                <ModalMedical />
                : null
            }
          </div>
          : null
      }
    </>
  );
}
export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.dmDungcu.data || [],
      size: state.dmDungcu.size || 10,
      page: state.dmDungcu.page || 1,
      total: state.dmDungcu.total || 0,
      isOpen: state.dmDungcu.isOpen || false,
      searchName: state.dmDungcu.searchName,
      searchValue: state.dmDungcu.searchValue,
      searchLoai: state.dmDungcu.searchLoai || "",
      clearTimeOutAffterRequest: state.dmDungcu.clearTimeOutAffterRequest || null
    };
  },
  {
    updateData: actionDMDungcu.updateData,
    onSizeChange: actionDMDungcu.onSizeChange,
    gotoPage: actionDMDungcu.gotoPage,
    onSearch: actionDMDungcu.onSearch,
    onDeleteItem: actionDMDungcu.onDeleteItem,
  }
)(index);
