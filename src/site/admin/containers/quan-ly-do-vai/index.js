import React, { useEffect, useState } from "react";
import { Button, Select, Tooltip, DatePicker } from "antd";
import { connect } from "react-redux";
import actionQuanLyDoVai from "@actions/quan-ly-do-vai";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment';
import ModalAddUpdate from "./create";
import DataContants from "@config/data-contants";
const { Option } = Select;
function index(props) {
  const getTrangThai = (item) => {
    var trangThai = DataContants.listTrangThai.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (trangThai.length > 0)
      return trangThai[0];
    return {};
  }
  const onSizeChange = size => {
    props.onSizeChange(size);
  };
  const onPageChange = page => {
    props.gotoPage(page);
    props.loadList();
  }
  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  useEffect(() => {
    props.updateData({
      searchNameDungcu: "",
      searchTrangThai: "",
      searchSoLuong: "",
      searchKhoaBanGiao: "",
      searchThoiGianThucHienTu: "",
      searchThoiGianThucHienDen: "",
      searchThoiGianBanGiaoTu: "",
      searchThoiGianBanGiaoDen: "",
    })
    props.gotoPage();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.dmDungCu && item.dmDungCu.name,
      col3: item.soLuong,
      col4: item.khoaBanGiao && item.khoaBanGiao.name,
      col5: getTrangThai(item.trangThai) ? getTrangThai(item.trangThai).name : null,
      col6: item.thoiGianThucHien ? moment(item.thoiGianThucHien).format("HH:mm:ss DD-MM-YYYY") : null,
      col7: item.thoiGianBanGiao ? moment(item.thoiGianBanGiao).format("DD-MM-YYYY") : null,
      col8: item,
    };
  });
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
  const showEdit = item => () => {
    props.updateData({
      id: item.id,
      active: item.active,
      dmDungCuId: item.dmDungCuId,
      soLuong: item.soLuong,
      thoiGianBanGiao: item.thoiGianBanGiao,
      khoaBanGiaoId: item.khoaBanGiaoId,
      thoiGianThucHien: item.thoiGianThucHien,
      trangThai: item.trangThai ? item.trangThai : "",
      isOpen: true
    });
  }
  const showDetail = item => () => {
    props.history.push("/fabric-sterilization/detail/" + item.id);
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_nhiem_khuan" || option == "ROLE_user_ql_nhiem_khuan" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage
              className="mgr-sanitation-processes"
              icon="subheader-icon fal fa-window"
              header="Quản lý thanh trùng đồ vải"
              subheader="Danh sách thanh trùng đồ vải"
            >
              <Panel
                id={"mgr-sanitation-processes"}
                title="Danh sách thanh trùng đồ vải "
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
                      width: 60,
                      dataIndex: "col1",
                      key: "col1"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tên sản phẩm</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchNameDungcu}
                                onChange={e => {
                                  props.updateData({
                                    searchNameDungcu: e.target.value
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
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Số lượng</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                type="number"
                                value={props.searchSoLuong}
                                onChange={e => {
                                  props.updateData({
                                    searchSoLuong: e.target.value
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
                                placeholder="Tìm theo SL"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 165,
                      dataIndex: "col3",
                      key: "col3"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Khoa bàn giao</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchKhoaBanGiao}
                                onChange={e => {
                                  props.updateData({
                                    searchKhoaBanGiao: e.target.value
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
                                placeholder="Tìm theo khoa bàn giao"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                      width: 250,
                      dataIndex: "col4",
                      key: "col4"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Trạng thái</div>
                          <div className="addition-box">
                            <Select
                              value={props.searchTrangThai}
                              onChange={e => {
                                props.updateData({
                                  searchTrangThai: e
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
                              placeholder="Chọn trạng thái"
                            >
                              <Option value="">Tất cả</Option>
                              {DataContants.listTrangThai && DataContants.listTrangThai.length && DataContants.listTrangThai.map((option, index) => {
                                return (
                                  <Option key={index} value={option.id}>{option.name}</Option>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                      ),
                      width: 200,
                      dataIndex: "col5",
                      key: "col5"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Thời gian thực hiện</div>
                          <div className="addition-box">
                            <DatePicker
                              value={props.searchThoiGianThucHienTu}
                              onChange={e => {
                                props.onSearch(e && e._d, "thoiGianThucHienTu")
                              }
                              }
                              style={{ width: "48%" }}
                              placeholder='Từ ngày'
                              format='DD/MM/YYYY'
                            />
                            <DatePicker
                              value={props.searchThoiGianThucHienDen}
                              onChange={e => {
                                props.onSearch(e && e._d, "thoiGianThucHienDen")
                              }
                              }
                              style={{ width: "48%", marginLeft: "6px" }}
                              placeholder='Đến ngày'
                              format='DD/MM/YYYY'
                            />
                          </div>
                        </div>
                      ),
                      width: 300,
                      dataIndex: "col6",
                      key: "col6"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Thời gian nhận</div>
                          <div className="addition-box">
                            <DatePicker
                              value={props.searchThoiGianBanGiaoTu}
                              onChange={e => {
                                props.onSearch(e && e._d, "thoiGianBanGiaoTu")
                              }
                              }
                              style={{ width: "48%" }}
                              placeholder='Từ ngày'
                              format='DD/MM/YYYY'
                            />
                            <DatePicker
                              value={props.searchThoiGianBanGiaoDen}
                              onChange={e => {
                                props.onSearch(e && e._d, "thoiGianBanGiaoDen")
                              }
                              }
                              style={{ width: "48%", marginLeft: "6px" }}
                              placeholder='Đến ngày'
                              format='DD/MM/YYYY'
                            />
                          </div>
                        </div>
                      ),
                      width: 280,
                      dataIndex: "col7",
                      key: "col7"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tiện ích</div>
                          <div className="addition-box"></div>
                        </div>
                      ),
                      key: "operation",
                      fixed: "right",
                      width: 165,
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
                      dataIndex: "col8",
                      key: "col8"
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
          </> : null}
    </>
  )
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.quanLyDoVai.data || [],
      size: state.quanLyDoVai.size || 10,
      page: state.quanLyDoVai.page || 1,
      total: state.quanLyDoVai.total || 0,
      isOpen: state.quanLyDoVai.isOpen || false,
      khoaBanGiao: state.quanLyDoVai.khoaBanGiao,
      soLuong: state.quanLyDoVai.soLuong,
      thoiGianBanGiao: state.quanLyDoVai.thoiGianBanGiao ? moment(state.quanLyDoVai.thoiGianBanGiao) : null,
      thoiGianThucHien: state.quanLyDoVai.thoiGianThucHien ? moment(state.quanLyDoVai.thoiGianThucHien) : null,
      searchNameDungcu: state.quanLyDoVai.searchNameDungcu,
      searchTrangThai: state.quanLyDoVai.searchTrangThai,
      searchSoLuong: state.quanLyDoVai.searchSoLuong,
      searchKhoaBanGiao: state.quanLyDoVai.searchKhoaBanGiao,
      clearTimeOutAffterRequest: state.quanLyDoVai.clearTimeOutAffterRequest || null,
      searchThoiGianThucHienTu: state.quanLyDoVai.searchThoiGianThucHienTu ? moment(state.quanLyDoVai.searchThoiGianThucHienTu) : null,
      searchThoiGianThucHienDen: state.quanLyDoVai.searchThoiGianThucHienDen ? moment(state.quanLyDoVai.searchThoiGianThucHienDen) : null,
      searchThoiGianBanGiaoTu: state.quanLyDoVai.searchThoiGianBanGiaoTu ? moment(state.quanLyDoVai.searchThoiGianBanGiaoTu) : null,
      searchThoiGianBanGiaoDen: state.quanLyDoVai.searchThoiGianBanGiaoDen ? moment(state.quanLyDoVai.searchThoiGianBanGiaoDen) : null,
    }
  },
  {
    updateData: actionQuanLyDoVai.updateData,
    onSizeChange: actionQuanLyDoVai.onSizeChange,
    gotoPage: actionQuanLyDoVai.gotoPage,
    onSearch: actionQuanLyDoVai.onSearch,
    onDeleteItem: actionQuanLyDoVai.onDeleteItem,
    loadList: actionQuanLyDoVai.loadList
  }
)(index)