import React, { useEffect, useState } from "react";
import { Button, Select, Tooltip, DatePicker } from "antd";
import { connect } from "react-redux";
import actionQuanLyDungCu from "@actions/quan-ly-dung-cu";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment';
import ChangeStatus from "./changeStatus";
import DuyetDungCu from "./duyetDungCu";
import Iframe from 'react-iframe';
import DataContants from "@config/data-contants";
import ic1 from "../../../../resources/images/icon/ic-duyetDungCu.png"
import ic2 from "../../../../resources/images/icon/ic_changeStatus.png"
import ic3 from "../../../../resources/images/icon/ic_print.png"
const { Option } = Select;
function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };
  const onPageChange = page => {
    props.gotoPage(page);
    props.loadList();
  }
  const onDeleteItem = item => {
    props.onDeleteItem(item);
  };
  useEffect(() => {
    props.onSearch("", "", -1);
    props.updateData({
      openModalChangeStatus: false,
      openModalDuyetDungCu: false,
      openModalPrintPH: false,
      searchName: "",
      searchStatus: "",
      searchToHandover: "",
      searchToPerform: "",
      searchFromHandover: "",
      searchFromPerform: "",
      searchValue: "",
      searchFaculty: "",
    })
  }, []);

  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.maSoHopDungCu,
      col4: item.khoaBanGiao && item.khoaBanGiao.name,
      col5: item.trangThai,
      col6: item.thoiGianTietKhuan ? moment(item.thoiGianTietKhuan).format("HH:mm:ss DD-MM-YYYY") : null,
      col7: item.thoiGianBanGiao ? moment(item.thoiGianBanGiao).format("DD-MM-YYYY") : null,
      col8: item,
    };
  });
  const getStatus = (data) => {
    let status = DataContants.listTrangThaiDungCu && DataContants.listTrangThaiDungCu.length && DataContants.listTrangThaiDungCu.filter(item => {
      return item.id === data
    })
    if (status && status.length) {
      return status[0]
    } else {
      return {}
    }
  }
  const showModalCreateOrEdit = (data) => {
    if (data) {
      props.history.push("/tool-sterilization/edit/" + data.id);

    } else {
      props.updateData({
        id: "",
        name: "",
        maSoHopDungCu: "",
        trangThai: "",
        thoiGianTietKhuan: "",
        khoaBanGiao: "",
        khoaBanGiaoId: "",
        thoiGianBanGiao: "",
        chiTiet: "",
        dmDungCuId: "",
        ghiChuLines: "",
        soLuongLines: "",
        soLuong: "",
        ghiChuT: "",
        isEdit: true,
      })
      props.history.push("/tool-sterilization/create");
    }
  }
  // const exportExcel = () => {}
  const showDetail = item => {
    props.history.push("/tool-sterilization/detail/" + item.id);
  }

  const duyetDungCu = (data) => {
    props.updateData({
      openModalDuyetDungCu: true,
      chiTiet: data.chiTiet,
      ghiChu: data.ghiChu,
      id: data.id,
      khoaBanGiao: data.khoaBanGiao,
      khoaBanGiaoId: data.khoaBanGiaoId,
      maSoHopDungCu: data.maSoHopDungCu,
      thoiGianBanGiao: data.thoiGianBanGiao,
      dateTietKhuan: data.thoiGianTietKhuan,
      timeTietKhuan: data.thoiGianTietKhuan,
      trangThai: data.trangThai,
    })
  }

  const changeStatus = (data) => {
    props.updateData({
      openModalChangeStatus: true,
      chiTiet: data.chiTiet,
      ghiChu: data.ghiChu,
      id: data.id,
      khoaBanGiao: data.khoaBanGiao,
      khoaBanGiaoId: data.khoaBanGiaoId,
      maSoHopDungCu: data.maSoHopDungCu,
      thoiGianBanGiao: data.thoiGianBanGiao,
      thoiGianTietKhuan: data.thoiGianTietKhuan,
      trangThai: data.trangThai,
    })
  }

  const togglePrint = (data) => {
    props.updateData({
      ...data,
      id: data.id,
      printInfo: true,
    })
    setTimeout(() => {
      props.updateData({
        printInfo: false,
      });
      window.close();
    }, 3000);
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option === "ROLE_user_ql_nhiem_khuan" || option === "ROLE_user_khac" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" || checkAuth === "ROLE_user_khac" || checkAuth === "ROLE_user_mescohn" ?
          <div>
            <AdminPage
              className="mgr-sanitation-processes"
              icon="subheader-icon fal fa-window"
              header="Quản lý tiệt trùng dụng cụ y tế"
              subheader="Danh sách tiệt trùng dụng cụ y tế"
            >
              <Panel
                id={"mgr-sanitation-processes"}
                title="Danh sách tiệt trùng dụng cụ y tế"
                allowClose={false}
                allowCollapse={false}
                toolbar={
                  <div className="toolbar">
                    {/* <Button className="button" onClick={() => exportExcel()}>Xuất Excel</Button> */}
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
                          <div className="title-box">	Mã số</div>
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
                          <div className="title-box">Khoa bàn giao</div>
                          <div className="addition-box">
                            <div className="search-box">
                              <img src={require("@images/icon/ic-search.png")} alt="" />
                              <input
                                value={props.searchFaculty}
                                onChange={e => {
                                  props.updateData({
                                    searchFaculty: e.target.value
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
                      width: 200,
                      dataIndex: "col4",
                      key: "col4"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Trạng thái</div>
                          <div className="addition-box">
                            <Select
                              value={props.searchStatus}
                              onChange={e =>
                                props.onSearch(e, "searchStatus")
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
                              {
                                DataContants.listTrangThaiDungCu && DataContants.listTrangThaiDungCu.length && DataContants.listTrangThaiDungCu.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.id}>{item.name}</Option>
                                  )
                                })
                              }
                            </Select>
                          </div>
                        </div>
                      ),
                      width: 200,
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
                          <div className="title-box">Thời gian thực hiện</div>
                          <div className="addition-box">
                            <DatePicker
                              style={{ "width": "48%" }}
                              placeholder='Từ ngày'
                              defaultValue={props.searchFromPerform}
                              format='DD/MM/YYYY'
                              onChange={e =>
                                props.onSearch(e, "searchFromPerform")
                              }
                            />
                            <DatePicker
                              style={{ "width": "48%", "marginLeft": "5px" }}
                              placeholder='Đến ngày'
                              format='DD/MM/YYYY'
                              defaultValue={props.searchToPerform}
                              onChange={e =>
                                props.onSearch(e, "searchToPerform")
                              }
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
                          <div className="title-box">Thời gian bàn giao</div>
                          <div className="addition-box">
                            <DatePicker
                              style={{ "width": "48%" }}
                              placeholder='Từ ngày'
                              format='DD/MM/YYYY'
                              defaultValue={props.searchFromHandover}
                              onChange={e =>
                                props.onSearch(e, "searchFromHandover")
                              }
                            />
                            <DatePicker
                              style={{ "width": "48%", "marginLeft": "5px" }}
                              placeholder='Đến ngày'
                              format='DD/MM/YYYY'
                              defaultValue={props.searchToHandover}
                              onChange={e =>
                                props.onSearch(e, "searchToHandover")
                              }
                            />
                          </div>
                        </div>
                      ),
                      width: 300,
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
                      width: 270,
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
                                    showModalCreateOrEdit(item)
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
                                  onClick={() => onDeleteItem(item)}
                                  className="btn btn-info btn-icon waves-effect waves-themed"
                                >
                                  <i className="fal fa-trash-alt"></i>
                                </a>
                              </div>
                            </Tooltip>
                            {
                              checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" || checkAuth === "ROLE_user_mescohn" ?
                                <>
                                  <Tooltip placement="topLeft" title={"Duyệt dụng cụ"}>
                                    <div>
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          duyetDungCu(item)
                                        }
                                        }
                                        className="btn btn-info btn-icon waves-effect waves-themed"
                                      >
                                        <img className="" style={{ maxWidth: "16px" }} src={ic1} alt=""></img>
                                      </a>
                                    </div>
                                  </Tooltip>
                                  <Tooltip placement="topLeft" title={"Chuyển trạng thái"}>
                                    <div>
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          changeStatus(item)
                                        }}
                                        className="btn btn-info btn-icon waves-effect waves-themed"
                                      >
                                        <img className="" style={{ maxWidth: "16px" }} src={ic2} alt=""></img>
                                      </a>
                                    </div>
                                  </Tooltip>
                                  <Tooltip placement="topLeft" title={"In phiếu hẹn"}>
                                    <div>
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          togglePrint(item)
                                        }}
                                        className="btn btn-info btn-icon waves-effect waves-themed"
                                      >
                                        <img className="" style={{ maxWidth: "16px" }} src={ic3} alt=""></img>
                                      </a>
                                    </div>
                                  </Tooltip>
                                </> : null
                            }
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
            {props.openModalDuyetDungCu ?
              <DuyetDungCu></DuyetDungCu>
              :
              null
            }
            {props.openModalChangeStatus ?
              <ChangeStatus></ChangeStatus>
              :
              null
            }
            {props.printInfo &&
              <Iframe
                url={window.location.origin + "/print/" + props.id}
                width="0"
                height="0"
                id="import-ticket-store"
                className="import-ticket-store"
                display="block"
                position="relative"
              />
            }
          </div>
          : null}
    </>
  )
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.quanLyDungCu.data || [],
      size: state.quanLyDungCu.size || 10,
      page: state.quanLyDungCu.page || 1,
      total: state.quanLyDungCu.total || 0,
      searchValue: state.quanLyDungCu.searchValue,
      searchName: state.quanLyDungCu.searchName,
      searchFaculty: state.quanLyDungCu.searchFaculty,
      searchStatus: state.quanLyDungCu.searchStatus,
      id: state.quanLyDungCu.id,
      printInfo: state.quanLyDungCu.printInfo || false,
      searchFromPerform: state.quanLyDungCu.searchFromPerform && moment(state.quanLyDungCu.searchFromPerform) || null,
      searchToPerform: state.quanLyDungCu.searchToPerform && moment(state.quanLyDungCu.searchToPerform) || null,
      searchFromHandover: state.quanLyDungCu.searchFromHandover && moment(state.quanLyDungCu.searchFromHandover) || null,
      searchToHandover: state.quanLyDungCu.searchToHandover && moment(state.quanLyDungCu.searchToHandover) || null,

      openModalDuyetDungCu: state.quanLyDungCu.openModalDuyetDungCu || false,
      openModalChangeStatus: state.quanLyDungCu.openModalChangeStatus || false,
      openModalPrintPH: state.quanLyDungCu.openModalPrintPH || false,

      clearTimeOutAffterRequest: state.quanLyDungCu.clearTimeOutAffterRequest || null
    }
  },
  {
    updateData: actionQuanLyDungCu.updateData,
    onSizeChange: actionQuanLyDungCu.onSizeChange,
    gotoPage: actionQuanLyDungCu.gotoPage,
    onSearch: actionQuanLyDungCu.onSearch,
    onDeleteItem: actionQuanLyDungCu.onDeleteItem,
    loadList: actionQuanLyDungCu.loadList,
    createOrEdit: actionQuanLyDungCu.createOrEdit,
    changeStatus: actionQuanLyDungCu.changeStatus,
    duyetDungCu: actionQuanLyDungCu.duyetDungCu,
  }
)(index)
