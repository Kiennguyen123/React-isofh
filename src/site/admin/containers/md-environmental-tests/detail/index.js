import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionMdEnvironmentalTests from "@actions/md-environmental-tests";
import { AdminPage, Panel } from "@admin/components/admin";
import "../style.scss";
function index(props) {
  const id = props.match.params.id;
  useEffect(() => {
    if (id)
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/md-environmental-tests");
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
    props.history.push("/md-environmental-tests");
  };
  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage className="mgr-md-environmental-tests-detail">
              <Panel
                title="Chi tiết danh mục gói xét nghiệm môi trường"
                id={"mgr-md-environmental-tests-detail"}
                allowClose={false}
                allowCollapse={false}
              >
                <div className="detail-body">
                  <div>
                    <InputDetail
                      width={2}
                      title="Tên gói: "
                      value={props.name}
                    />
                    <InputDetail
                      width={2}
                      title="Mã số: "
                      value={props.value}
                    />
                    <InputDetail
                      width={2}
                      title="Loại mẫu xét nghiệm: "
                      value={props.specimenType && props.specimenType.name}
                    />
                    <InputDetail
                      width={2}
                      title="Chi tiết: "
                      value={
                        <table className="table-sanitation-processes" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <td style={{ width: "20%" }}>Mã thông số</td>
                              <td style={{ width: "20%" }}>Thông số</td>
                              <td style={{ width: "20%" }}>Phương pháp xác định</td>
                              <td style={{ width: "20%" }}>Dải tham chiếu</td>
                              <td style={{ width: "20%" }}>Đơn vị</td>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              props.lines.map((option, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{option.value}</td>
                                    <td>{option.name}</td>
                                    <td>{option.testMethod}</td>
                                    <td>{option.referenceRange}</td>
                                    <td>{option.unit}</td>
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
      specimenType: state.mdEnvironmentalTests.specimenType || {},
      specimenTypeId: state.mdEnvironmentalTests.specimenTypeId || "",
      name: state.mdEnvironmentalTests.name,
      value: state.mdEnvironmentalTests.value,
      id: state.mdEnvironmentalTests.id,
      lines: state.mdEnvironmentalTests.lines || [],
      dataSpecimenTypes: state.specimenTypes.specimenTypes || []
    };
  }, {
  loadDetail: actionMdEnvironmentalTests.loadDetail
}
)(index);
