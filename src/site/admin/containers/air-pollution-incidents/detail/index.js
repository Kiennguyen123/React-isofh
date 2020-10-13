import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionAirPollutionIncidents from "@actions/air-pollution-incidents";
import actionCategoryIncidents from '@actions/category-incidents';
import { AdminPage, Panel } from "@admin/components/admin";
import Constant from '@config/data-contants'
import moment from 'moment'
import "../style.scss";
function index(props) {
  const id = props.match.params.id;
  const checkAuth = (props.auth.authorities || []).find(option => (option == "ROLE_super_admin" || option == "ROLE_admin_ql_moi_truong" || option == "ROLE_user_ql_moi_truong" || option == "ROLE_user_mescohn"))
  useEffect(() => {
    props.loadListCategoryIncidents();
    if (id) {
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/air-pollution-incidents");
      });
    }
  }, []);
  const onClose = () => {
    props.history.push("/air-pollution-incidents");
  };
  const checkSuCo = (data) => {
    let status = Constant.giaiDoanSuCo && Constant.giaiDoanSuCo.length && Constant.giaiDoanSuCo.filter(item => {
      if (item.id === data) {
        return item;
      }
    })
    if (status.length > 0) {
      return status[0]
    } else {
      return {}
    }
  }
  const checkCategoryIncidents = (data) => {
    let category = props.listCategoryIncidents && props.listCategoryIncidents.length && props.listCategoryIncidents.filter(item => {
      if (item.id === data) {
        return item;
      }
    })
    if (category.length > 0) {
      return category[0]
    } else {
      return {}
    }
  }
  return (
    <>
      {checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_ql_moi_truong"  || checkAuth === "ROLE_user_mescohn" ?
        <AdminPage
          className="mgr-air-pollution-incidents" >
          <Panel
            title="Chi tiết thông tin sự cố ô nhiễm"
            id={"mgr-air-pollution-incidents"}
            allowClose={false}
            allowCollapse={false}
          >
            <div className="detail-body">
              <div>
                <InputDetail
                  width={2}
                  title="Tên sự cố: "
                  value={props.name}
                />
                <InputDetail
                  width={2}
                  title="Loại sự cố: "
                  value={checkCategoryIncidents(props.typeIncidentId) ? checkCategoryIncidents(props.typeIncidentId).incidentType : null}
                />
                <InputDetail
                  width={2}
                  title="Giai đoạn của sự cố: "
                  value={checkSuCo(props.stageIncident) ? checkSuCo(props.stageIncident).name : null}
                />
                <InputDetail
                  width={2}
                  title="Thời gian bắt đầu: "
                  value={props.fromDate}
                />
                <InputDetail
                  width={2}
                  title="Thời gian kết thúc: "
                  value={props.toDate}
                />
                <InputDetail
                  width={2}
                  title="Tình trạng: "
                  value={props.status}
                />
                <InputDetail
                  width={2}
                  title="Nguyên nhân: "
                  value={props.reason}
                />
                <InputDetail
                  width={2}
                  title="Phạm vi: "
                  value={props.arena}
                />
                <InputDetail
                  width={2}
                  title="Cách xử lý: "
                  value={props.handling}
                />
                <InputDetail
                  width={2}
                  title="Kết luận: "
                  value={props.conclusion}
                />
                <InputDetail
                  width={2}
                  title="Đánh giá chi tiết: "
                  value={
                    <table className="table-sanitation-processes">
                      <thead>
                        <tr>
                          <td style={{ width: "30%" }}>Tiêu chí</td>
                          <td style={{ width: "20%" }}>Giá trị định lượng</td>
                          <td style={{ width: "20%" }}>Trọng số</td>
                          <td style={{ width: "20%" }}>Kết quả</td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          props.detailRating.map((option, index) => {
                            return (
                              <tr key={index}>
                                <td>{option.criteria}</td>
                                <td>{option.valueQuantitative}</td>
                                <td>{option.weight}</td>
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
        </AdminPage> : null}
    </>
  );
}
export default connect(
  state => {
    return {
      auth: state.auth.auth,
      id: state.airPollutionIncidents.id,
      name: state.airPollutionIncidents.name,
      reason: state.airPollutionIncidents.reason,
      detailRating: state.airPollutionIncidents.detailRating || [],
      arena: state.airPollutionIncidents.arena,
      status: state.airPollutionIncidents.status,
      stageIncident: state.airPollutionIncidents.stageIncident,
      typeIncidentId: state.airPollutionIncidents.typeIncidentId,
      handling: state.airPollutionIncidents.handling,
      conclusion: state.airPollutionIncidents.conclusion,
      fromDate: state.airPollutionIncidents.fromDate && moment(state.airPollutionIncidents.fromDate).format("DD-MM-YYYY") || null,
      toDate: state.airPollutionIncidents.toDate && moment(state.airPollutionIncidents.toDate).format("DD-MM-YYYY") || null,
      listCategoryIncidents: state.categoryIncidents.categoryIncidents || [],
    };
  }, {
  loadDetail: actionAirPollutionIncidents.loadDetail,
  loadListCategoryIncidents: actionCategoryIncidents.loadList,
}
)(index);
