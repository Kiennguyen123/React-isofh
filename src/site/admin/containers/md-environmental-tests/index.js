import React, { useEffect } from "react";
import { Button, Tooltip } from "antd";
import { connect } from "react-redux";
import actionMdEnvironmentalTests from "@actions/md-environmental-tests";
import actionSpecimenTypes from "@actions/specimen-types";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };
  const onPageChange = page => {
    props.gotoPage(page);
  };
  useEffect(() => {
    props.gotoPage();
    props.loadList();
  }, []);
  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.value,
      col3: item.name,
      col4: item.specimenTypeId,
      col5: item,
    };
  });
  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  const showCreate = () => {
    props.updateData({
      id: null,
      name: "",
      value: "",
      specimenTypeId: "",
      lines: [],
      dataIndex: [],
      specimenType: {}
    });
    props.history.push("/md-environmental-tests/create");
  };
  const showEdit = item => () => {
    props.history.push("/md-environmental-tests/edit/" + item.id);
    props.updateData({
      ...item
    })
  };
  const showDetail = item => () => {
    props.history.push("/md-environmental-tests/detail/" + item.id);
  }
  const checkSpecimenType = (item) => {
    var status = props.dataSpecimenTypes && props.dataSpecimenTypes.length ? props.dataSpecimenTypes.filter((data) => {
      return parseInt(data.id) === Number(item)
    }) : []
    if (status.length > 0)
      return status[0];
    return {};
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage
              className="mgr-md-environmental-tests"
              icon="subheader-icon fal fa-window"
              header="Quản lý Danh mục gói xét nghiệm môi trường"
              subheader="Danh sách danh mục gói xét nghiệm môi trường"
            >
              <Panel
                id={"mgr-md-environmental-tests"}
                title="Danh mục gói xét nghiệm môi trường"
                allowClose={false}
                allowCollapse={false}
                toolbar={
                  <div className="toolbar">
                    <Button className="button" onClick={showCreate}>Thêm mới</Button>
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
                        </div>
                      ),
                      width: 150,
                      dataIndex: "col2",
                      key: "col2"
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Tên gói</div>
                        </div>
                      ),
                      width: 300,
                      dataIndex: "col3",
                      key: "col3",
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box">Loại mẫu xét nghiệm</div>
                        </div>
                      ),
                      width: 300,
                      dataIndex: "col4",
                      key: "col4",
                      render: item => {
                        return (
                          <>{checkSpecimenType(item) && checkSpecimenType(item).name}</>
                        )
                      }
                    },
                    {
                      title: (
                        <div className="custome-header">
                          <div className="title-box"></div>
                        </div>
                      ),
                      key: "operation",
                      fixed: "right",
                      width: 80,
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
                      dataIndex: "col5",
                      key: "col5"
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
          </> : null}
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.mdEnvironmentalTests.data || [],
      size: state.mdEnvironmentalTests.size || 10,
      page: state.mdEnvironmentalTests.page || 1,
      total: state.mdEnvironmentalTests.total || 0,
      dataSpecimenTypes: state.specimenTypes.specimenTypes || []
    };
  },
  {
    updateData: actionMdEnvironmentalTests.updateData,
    onSizeChange: actionMdEnvironmentalTests.onSizeChange,
    gotoPage: actionMdEnvironmentalTests.gotoPage,
    onDeleteItem: actionMdEnvironmentalTests.onDeleteItem,
    loadList: actionSpecimenTypes.loadList
  }
)(index);
