import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionEnvironmentalTests from "@actions/environmental-tests";
import actionMdEnvironmentalTests from "@actions/md-environmental-tests";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment'
import "../style.scss";
function index(props) {
  const id = props.match.params.id;
  useEffect(() => {
    props.loadMdEnvironmentalTests(props.mdEnvironmentalId)
    if (id) {
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/environmental-tests");
      });
    }
    else {
      props.updateData({
        id: null,
        name: "",
        value: "",
        specimenTypeId: "",
        lines: [],
        dataIndex: [],
      });
    }
  }, []);
  const onClose = () => {
    props.history.push("/environmental-tests");
    props.updateData({
      id: "",
      specimenTypeId: "",
      mdEnvironmentalId: "",
      assessment: "",
      assessor: "",
      executor: "",
      actDate: "",
      dataIndex: "",
      location: "",
      lines: "",
      searchAssessment: "",
      searchAssessor: "",
      searchExecutor: "",
      searchSpecimenType: "",
    })
  };
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option === "ROLE_user_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <AdminPage className="mgr-environmental-tests">
            <Panel
              title="Chi tiết danh sách xét nghiệm đánh giá môi trường"
              id={"mgr-environmental-tests"}
              allowClose={false}
              allowCollapse={false}
            >
              <div className="detail-body">
                <div>
                  <InputDetail
                    width={2}
                    title="Loại mẫu xét nghiệm: "
                    value={props.specimenType}
                  />
                  <InputDetail
                    width={2}
                    title="Gói xét nghiệm: "
                    value={props.mdEnvironmentalTests}
                  />
                  <InputDetail
                    width={2}
                    title="Địa điểm lấy mẫu: "
                    value={props.location}
                  />
                  <InputDetail
                    width={2}
                    title="Thời gian thực hiện: "
                    value={props.actDate && moment(props.actDate).format("DD/MM/YYYY")}
                    format="DD/MM/YYYY"
                  />
                  <InputDetail
                    width={2}
                    title="Người lấy mẫu: "
                    value={props.executor}
                  />
                  <InputDetail
                    width={2}
                    title="Người đánh giá: "
                    value={props.assessor}
                  />
                  <InputDetail
                    width={2}
                    title="Đánh giá mức độ ô nhiễm: "
                    value={props.executor && props.assessment}
                  />
                  <InputDetail
                    width={2}
                    title="Đánh giá chi tiết: "
                    value={
                      <table className="table-sanitation-processes">
                        <thead>
                          <tr>
                            <td style={{ width: "15%" }}>Thông số</td>
                            <td style={{ width: "20%" }}>Phương pháp xác định</td>
                            <td style={{ width: "15%" }}>	Dải tham chiếu</td>
                            <td style={{ width: "15%" }}>	Đơn vị</td>
                            <td style={{ width: "15%" }}>Kết quả</td>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            props.lines.map((option, index) => {
                              return (
                                <tr key={index}>
                                  <td>{option.name}</td>
                                  <td>{option.testMethod}</td>
                                  <td>{option.referenceRange}</td>
                                  <td>{option.unit}</td>
                                  <td>{option.result}</td>
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

          : null}
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      id: state.environmentalTests.id,
      specimenType: state.environmentalTests.specimenType && state.environmentalTests.specimenType.name,
      specimenTypeId: state.environmentalTests.specimenTypeId,
      mdEnvironmentalId: state.environmentalTests.mdEnvironmentalId,
      assessment: state.environmentalTests.assessment,
      assessor: state.environmentalTests.assessor,
      executor: state.environmentalTests.executor,
      assessorId: state.environmentalTests.assessorId,
      executorId: state.environmentalTests.executorId,
      location: state.environmentalTests.location,
      actDate: state.environmentalTests.actDate && moment(state.environmentalTests.actDate),
      checkUpdate: state.environmentalTests.checkUpdate || false,
      dataSpecimenTypes: state.specimenTypes.specimenTypes || [],
      mdEnvironmentalTests: state.mdEnvironmentalTests.name,
      lines: state.environmentalTests.lines || [],
      name: state.environmentalTests.name,
      testMethod: state.environmentalTests.testMethod,
      referenceRange: state.environmentalTests.referenceRange,
      unit: state.environmentalTests.unit,
      result: state.environmentalTests.result,
    };
  }, {
  updateData: actionEnvironmentalTests.updateData,
  loadDetail: actionEnvironmentalTests.loadDetail,
  loadMdEnvironmentalTests: actionMdEnvironmentalTests.loadDetail,
}
)(index);
