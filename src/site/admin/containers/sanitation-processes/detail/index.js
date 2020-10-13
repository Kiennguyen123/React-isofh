import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionSanitationProcesses from "@actions/sanitation-processes";
import { AdminPage, Panel } from "@admin/components/admin";
import "../style.scss";
import moment from "moment";
import DataContants from "@config/data-contants";
function index(props) {
  const id = props.match.params.id;
  useEffect(() => {
    if (id)
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/sanitation-processes");
      });
    else {
      props.updateData({
        id: null,
        name: "",
        value: "",
        specimenTypeId: "",
        lines: [],
      });
    }
  }, []);
  const onClose = () => {
    props.history.push("/sanitation-processes");
  };
  const getStatus = (item) => {
    var status = DataContants.listStatus.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (status.length > 0)
      return status[0];
    return {};
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option === "ROLE_user_ql_moi_truong" || option === "ROLE_user_khac" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong" || checkAuth === "ROLE_user_khac" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage className="mgr-sanitation-processes">
              <Panel
                title="Chi tiết Lịch vệ sinh môi trường"
                id={"mgr-sanitation-processes"}
                allowClose={false}
                allowCollapse={false}
              >
                <div className="detail-body">
                  <div>
                    <InputDetail
                      width={2}
                      title="Tiêu đề: "
                      value={props.name}
                    />
                    <InputDetail
                      width={2}
                      title="Địa điểm: "
                      value={props.location}
                    />
                    <InputDetail
                      width={2}
                      title="Người thực hiện: "
                      value={props.executor}
                    />
                    <InputDetail
                      width={2}
                      title="Thời gian bắt đầu: "
                      value={props.fromDate ? moment(props.fromDate).format("DD-MM-YYYY") : null}
                    />
                    <InputDetail
                      width={2}
                      title="Thời gian kết thúc: "
                      value={props.toDate ? moment(props.toDate).format("DD-MM-YYYY") : null}
                    />
                    <InputDetail
                      width={2}
                      title="Trạng thái: "
                      value={getStatus(props.status) ? getStatus(props.status).name : null}
                    />
                    <InputDetail
                      width={2}
                      title="Kết quả đạt được: "
                      value={props.result}
                    />
                    <InputDetail
                      width={2}
                      title="Ghi chú: "
                      value={props.note}
                    />
                    <InputDetail
                      width={2}
                      title="Quy trình: "
                      value={
                        <table className="table-sanitation-processes" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <td style={{ width: "20%" }}>Nội dung</td>
                              <td style={{ width: "20%" }}>Người thực hiện cụ thể</td>
                              <td style={{ width: "20%" }}>Ngày thực hiện</td>
                              <td style={{ width: "20%" }}>Trạng thái</td>
                              <td style={{ width: "20%" }}>Chi chú</td>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              props.lines.map((option, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{option.content}</td>
                                    <td>{option.executor}</td>
                                    <td>{option.actDate && moment(option.actDate).format("DD/MM/YYYY")}</td>
                                    <td>{getStatus(option.status) && getStatus(option.status).name}</td>
                                    <td>{option.note}</td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    borderTop: "1px solid #e9e9e9",
                    padding: "16px 16px 0px",
                    background: "#fff",
                    textAlign: "right"
                  }}
                >
                  <Button onClick={onClose} type="primary" style={{ marginRight: 8 }}>Quay lại</Button>
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
      name: state.sanitationProcesses.name,
      location: state.sanitationProcesses.location,
      id: state.sanitationProcesses.id,
      toDate: state.sanitationProcesses.toDate || null,
      fromDate: state.sanitationProcesses.fromDate || null,
      status: state.sanitationProcesses.status,
      result: state.sanitationProcesses.result,
      executor: state.sanitationProcesses.executor,
      lines: state.sanitationProcesses.lines || [],
      note: state.sanitationProcesses.note,
    };
  }, {
  loadDetail: actionSanitationProcesses.loadDetail
}
)(index);
