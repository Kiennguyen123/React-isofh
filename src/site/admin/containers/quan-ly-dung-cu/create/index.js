import React, { useEffect } from "react";
import { Form, Button, Select, Input, DatePicker, Tooltip } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import actionQuanLyDungCu from '@actions/quan-ly-dung-cu';
import actionDmMauDungCu from "@actions/dm-mau-dung-cu";
import actionauthorization from "@actions/authorization";
import actionDmDungCu from "@actions/dm-dung-cu"
import actionDepartment from "@actions/departments"
import { AdminPage, Panel } from "@admin/components/admin";
import '../style.scss'
const { Option } = Select;
const { TextArea } = Input;
function index(props) {

  const { getFieldDecorator } = props.form;

  const { dmDungCuId, soLuongLines, ghiChuLines, chiTiet, index } = props;

  const id = props.match.params.id;

  let id_auth = props.auth.id;

  useEffect(() => {
    if (id) {
      props.loadDetail(id);
    }
    if (!props.khoaBanGiaoId) {
      props.loadDetailAuth(id_auth).then(s => {
        props.updateData({
          khoaBanGiaoId: s.departmentId
        })
      })
    }
    props.loadListDmMauDungCu("", "", -1);
    props.loadListDepartments("", "", -1);
    props.loadListMedical();
    props.loadListDmDungCu();
    props.updateData({
      isEdit: true,
      dmDungCuId: "",
      soLuongLines: "",
      ghiChuLines: "",
    })
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/tool-sterilization");
        });
      }
    });
  };

  const onClose = () => {
    props.history.push("/tool-sterilization");
  }

  const createDetail = () => {
    let params = {
      dmDungCuId: dmDungCuId ? dmDungCuId : null,
      soLuong: soLuongLines ? soLuongLines : null,
      ghiChu: ghiChuLines ? ghiChuLines : null,
    }
    chiTiet.push(params);
    loadData(chiTiet);
  }

  const loadData = (data) => {
    props.updateData({
      chiTiet: data,
      dmDungCuId: "",
      soLuongLines: "",
      ghiChuLines: "",
    })
    if (!id) {
      props.history.push("/tool-sterilization/create");
    }
  }

  const updateDetail = () => {
    chiTiet[index] = {
      dmDungCuId: dmDungCuId ? dmDungCuId : null,
      soLuong: soLuongLines ? soLuongLines : null,
      ghiChu: ghiChuLines ? ghiChuLines : null,
    }
    loadData(chiTiet);
    props.updateData({
      isEdit: true,
    })
  }

  const updateModalDetail = (data, index) => {
    props.updateData({
      dmDungCuId: data.dmDungCuId,
      soLuong: data.soLuongLines,
      ghiChu: data.ghiChuLines,
      index: index,
      isEdit: false,
    })
  }

  const deleteDetail = (index) => {
    chiTiet.splice(index, 1);
    loadData(chiTiet);
  }

  const checkMedical = (item) => {
    let status = props.listDungCu && props.listDungCu.length && props.listDungCu.filter(option => {
      return item === option.id
    })
    if (status && status.length) {
      return status[0]
    } else {
      return []
    }
  }

  const changeMauDungCu = (e, lists) => {
    let listData = lists.props.data && lists.props.data.length ? lists.props.data.map(item => {
      return (
        {
          dmDungCuId: item.id,
          ghiChuLines: item.ghiChu,
          soLuongLines: item.soLuong
        }
      )
    }) : [];
    let newList = [...chiTiet, ...listData];
    let result = newList.reduce((unique, item) =>
      unique.some(item2 => item.dmDungCuId === item2.dmDungCuId) ? unique : [...unique, item], []);

    if (props.chiTiet.length > 0) {
      props.updateData({
        mauDungCuId: e,
        chiTiet: result,
      });
    } else {
      props.updateData({
        mauDungCuId: e,
        chiTiet: listData,
      });
    }
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_nhiem_khuan" || option == "ROLE_user_ql_nhiem_khuan" || option == "ROLE_user_khac" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" || checkAuth === "ROLE_user_khac" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage>
              <Panel
                id={"mgr-sanitation-processes"}
                title="Danh sách tiệt trùng dụng cụ y tế"
                allowClose={false}
                allowCollapse={false}
              >
                <Form layout="vertical" hideRequiredMark={true} onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6">
                      <Form.Item label="Mẫu dụng cụ y tế">
                        <Select
                          showSearch
                          placeholder="Chọn mẫu dụng cụ y tế"
                          onChange={(e, lists) => changeMauDungCu(e, lists)}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase().unsignText()
                              .indexOf(input.toLowerCase().unsignText()) >= 0
                          }
                        >
                          {props.listDmMauDungCu.map((item, index) => {
                            return (
                              <Option key={index} value={item.id} data={item.dungCu}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item label="Ghi chú">
                        <TextArea
                          value={props.ghiChuT}
                          style={{ "height": "32px" }}
                          placeholder="Nhập ghi chú"
                          onChange={e => {
                            props.updateData({
                              ghiChuT: e.target.value
                            })
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <Form.Item label="Thời gian bàn giao* ">
                        {getFieldDecorator("thoiGianBanGiao", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng chọn thời gian bàn giao"
                            }
                          ],
                          initialValue: props.thoiGianBanGiao
                        })(
                          <DatePicker
                            style={{ "width": "100%" }}
                            placeholder="chọn thời gian bàn giao"
                            onChange={e => {
                              props.updateData({
                                thoiGianBanGiao: e
                              })
                            }}
                            format="DD/MM/YYYY"
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="Khoa bàn giao*">
                        {getFieldDecorator("faculty", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng chọn danh mục khoa"
                            }
                          ],
                          initialValue: props.khoaBanGiaoId
                        })(
                          <Select
                            showSearch
                            placeholder="Chọn danh mục khoa"
                            onChange={e => {
                              props.updateData({
                                khoaBanGiaoId: e
                              });
                            }}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase().unsignText()
                                .indexOf(input.toLowerCase().unsignText()) >= 0
                            }
                          >
                            {props.listDepartments.map((item, index) => {
                              return (
                                <Option key={index} value={item.id}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </div>
                  </div>
                  <div>
                    <Form.Item label="Chi tiết">
                      <div className="procedure">
                        <table>
                          <tbody className="table-body">
                            <tr>
                              <td style={{ width: "30%" }}>Tên dụng cụ y tế</td>
                              <td style={{ width: "20%" }}>Số lượng</td>
                              <td style={{ width: "40%" }}>Ghi chú</td>
                              <td style={{ width: "10%" }}></td>
                            </tr>
                            <tr>
                              <td style={{ padding: "10px 3px 5px" }}>
                                <Select
                                  value={props.dmDungCuId}
                                  showSearch
                                  placeholder="Chọn dụng cụ y tế"
                                  onChange={e => {
                                    props.updateData({
                                      dmDungCuId: e,
                                    });
                                  }}
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase().unsignText()
                                      .indexOf(input.toLowerCase().unsignText()) >= 0
                                  }
                                >
                                  {props.listMedical.map((item, index) => {
                                    return (
                                      <Option key={index} value={item.id} name={item.name}>{item.name}</Option>
                                    );
                                  })}
                                </Select>
                              </td>
                              <td style={{ padding: "10px 3px 5px" }}>
                                <TextArea
                                  style={{ "height": "32px" }}
                                  value={props.soLuongLines}
                                  onChange={e => {
                                    props.updateData({
                                      soLuongLines: e.target.value
                                    });
                                  }}
                                  placeholder="Nhập số lượng"
                                />
                              </td>
                              <td style={{ padding: "10px 3px 5px" }}>
                                <TextArea
                                  style={{ "height": "32px" }}
                                  value={props.ghiChuLines}
                                  onChange={e => {
                                    props.updateData({
                                      ghiChuLines: e.target.value
                                    });
                                  }}
                                  placeholder="Nhập ghi chú"
                                />
                              </td>
                              {
                                props.isEdit
                                  ?
                                  <td style={{ textAlign: "center", paddingTop: 14 }} className="check-button-plus">
                                    <Tooltip placement="topLeft" title={"Thêm mới"}>
                                      <div className="button-modal" onClick={() => { createDetail() }}>
                                        <i className="fal fa-plus-square"></i>
                                      </div>
                                    </Tooltip>
                                  </td>
                                  :
                                  <td style={{ textAlign: "center", paddingTop: 14 }} className="check-button-save" >
                                    <Tooltip placement="topLeft" title={"Lưu"}>
                                      <div className="button-modal" onClick={() => { updateDetail() }}>
                                        <i className="fal fa-save"></i>
                                      </div>
                                    </Tooltip>
                                  </td>
                              }
                            </tr>
                            {
                              props.chiTiet && props.chiTiet.length ? props.chiTiet.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{checkMedical(item.dmDungCuId) && checkMedical(item.dmDungCuId).name}</td>
                                    <td>{item.soLuong}</td>
                                    <td>{item.ghiChu}</td>
                                    <td style={{ textAlign: "center" }}>
                                      <Tooltip placement="topLeft" title={"Chỉnh sửa"}>
                                        <span className="button-modal" onClick={() => updateModalDetail(item, index)}>
                                          <i className="fal fa-edit"></i>
                                        </span>
                                      </Tooltip>
                                      <Tooltip placement="topLeft" title={"Xóa"}>
                                        <span className="button-modal" onClick={() => deleteDetail(index)}>
                                          <i className="fal fa-trash-alt"></i>
                                        </span>
                                      </Tooltip>
                                    </td>
                                  </tr>
                                )
                              }) : null
                            }
                          </tbody>
                        </table>
                      </div>
                    </Form.Item>
                  </div>

                </Form>
                <div
                  style={{
                    width: "100%",
                    borderTop: "1px solid #e9e9e9",
                    padding: "16px 16px 0px",
                    background: "#fff",
                    textAlign: "right"
                  }}
                >
                  <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
                  <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                    {props.id ? "Lưu thay đổi" : "Tạo mới"}
                  </Button>
                </div>
              </Panel>
            </AdminPage>
          </> : null}
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      id: state.quanLyDungCu.id,
      value: state.quanLyDungCu.value,
      mauDungCuId: state.quanLyDungCu.mauDungCuId,
      status: state.quanLyDungCu.status,
      ghiChuT: state.quanLyDungCu.ghiChuT,
      khoaBanGiao: state.quanLyDungCu.khoaBanGiao,
      khoaBanGiaoId: state.quanLyDungCu.khoaBanGiaoId,
      thoiGianBanGiao: state.quanLyDungCu.thoiGianBanGiao ? moment(state.quanLyDungCu.thoiGianBanGiao) : null,
      chiTiet: state.quanLyDungCu.chiTiet || [],
      listDmMauDungCu: state.dmMauDungCu.listData || [],
      listDepartments: state.departments.departments || [],
      keyActive: state.quanLyDungCu.keyActive,
      dmDungCu: state.quanLyDungCu.dmDungCu,
      dmDungCuId: state.quanLyDungCu.dmDungCuId,
      soLuongLines: state.quanLyDungCu.soLuongLines,
      ghiChuLines: state.quanLyDungCu.ghiChuLines,
      index: state.quanLyDungCu.index,
      isEdit: state.quanLyDungCu.isEdit || false,
      listMedical: state.dmDungcu.listMedical || [],
      listDungCu: state.dmDungcu.dmDungCu || [],
    }
  },
  {
    updateData: actionQuanLyDungCu.updateData,
    createOrEdit: actionQuanLyDungCu.createOrEdit,
    loadDetail: actionQuanLyDungCu.loadDetail,
    loadListDmMauDungCu: actionDmMauDungCu.loadList,
    loadListDepartments: actionDepartment.loadList,
    loadListDmDungCu: actionDmDungCu.loadList,
    loadListMedical: actionDmDungCu.loadListMedical,
    loadDetailAuth: actionauthorization.loadDetail
  }
)(Form.create()(index))