import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionInfectioPatients from "@actions/infection-patients";
import actionInfectionPatients from "@actions/infection-patients";
import { AdminPage, Panel } from "@admin/components/admin";
import DataContants from '../../../../../config/data-contants';
import moment from "moment";
import "../style.scss";
function index(props) {
  const id = props.match.params.id;
  useEffect(() => {
    if (id) {
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/infection-patients");
      });
    }
    else {
      props.updateData({
        id: null,
        patientDocument: '',
        patientValue: '',
        patientName: '',
        medicalRecordNo: '',
        regDate: null,
        birthday: null,
        gender: '',
        phone: '',
        hospitalizeDate: null,
        dischargeHospitalDate: null,
        address: '',
        departments: '',
        infectiousDiseaseId: '',
        reason: '',
        handling: '',
        infectionDate: null,
        curedDate: null,
        treatmentResult: '',
      });
    }
  }, []);
  const onClose = () => {
    props.history.push("/infection-patients");
  };
  const getTreatmentResult = (item) => {
    var status = DataContants.listTreatmentResult.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (status.length > 0)
      return status[0];
    return {};
  }
  const getDepartment = (item) => {
    var status = props.departments.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (status.length > 0)
      return status[0];
    return {};
  }
  const getInfectiousDisease = (item) => {
    var status = props.infectiousDisease.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (status.length > 0)
      return status[0];
    return {};
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option === "ROLE_user_ql_nhiem_khuan"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" ?
          <>
            <AdminPage className="mgr-infection-patients-detail">
              <Panel
                title="Chi tiết danh mục danh sách người bệnh mắc bênh truyền nhiễm trong bệnh viện"
                id={"mgr-infection-patients-detail"}
                allowClose={false}
                allowCollapse={false}
              >
                <div className="detail-body row">
                  <div className='col-md-6'>
                    <InputDetail
                      width={4}
                      title="Mã hồ sơ: "
                      value={props.patientDocument}
                    />
                    <InputDetail
                      width={4}
                      title="Mã người bệnh: "
                      value={props.patientValue}
                    />
                    <InputDetail
                      width={4}
                      title="Tên người bệnh: "
                      value={props.patientName}
                    />
                    <InputDetail
                      width={4}
                      title="Mã bệnh án: "
                      value={props.medicalRecordNo}
                    />
                    <InputDetail
                      width={4}
                      title="Ngày đăng ký: "
                      value={props.regDate}
                    />

                  </div>
                  <div className='col-md-6'>
                    <InputDetail
                      width={4}
                      title="Ngày sinh: "
                      value={props.birthday}
                    />
                    <InputDetail
                      width={4}
                      title="Giới tính: "
                      value={props.gender === 1 ? "Nam" : props.gender === 2 ? "Nữ" : null}
                    />
                    <InputDetail
                      width={4}
                      title="Số điện thoại: "
                      value={props.phone}
                    />
                    <InputDetail
                      width={4}
                      title="Ngày nhập viện: "
                      value={props.hospitalizeDate}
                    />
                    <InputDetail
                      width={4}
                      title="Ngày xuất viện: "
                      value={props.dischargeHospitalDate}
                    />
                  </div>
                  <div className="col-12" style={{ padding: 0 }}>
                    <InputDetail
                      width={2}
                      title="Địa chỉ: "
                      value={props.address}
                    />
                  </div>
                  <div className='col-md-6'>
                    <InputDetail
                      width={4}
                      title="Khoa: "
                      value={getDepartment(props.departmentId) ? getDepartment(props.departmentId).name : null}
                    />
                    <InputDetail
                      width={4}
                      title="Nhóm bệnh truyền nhiễm: "
                      value={getInfectiousDisease(props.infectiousDiseaseId) ? getInfectiousDisease(props.infectiousDiseaseId).name : null}
                    />
                  </div>
                  <div className='col-md-6'>
                    <InputDetail
                      width={4}
                      title="Thời gian mắc bệnh: "
                      value={props.infectionDate}
                    />
                    <InputDetail
                      width={4}
                      title="Thời gian điều trị xong: "
                      value={props.curedDate}
                    />
                  </div>
                  <div className="col-12" style={{ padding: 0 }}>
                    <InputDetail
                      width={2}
                      title="Nguyên nhân: "
                      value={props.reason}
                    />
                    <InputDetail
                      width={2}
                      title="Cách xử lý: "
                      value={props.handling}
                    />
                    <InputDetail
                      width={2}
                      title="Kết quả điều trị: "
                      value={getTreatmentResult(props.treatmentResult) ? getTreatmentResult(props.treatmentResult).name : null}
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
      patientDocument: state.infectionPatients.patientDocument,
      patientValue: state.infectionPatients.patientValue,
      patientName: state.infectionPatients.patientName,
      medicalRecordNo: state.infectionPatients.medicalRecordNo,
      regDate: state.infectionPatients.regDate && moment(state.infectionPatients.regDate).format("DD/MM/YYYY"),
      birthday: state.infectionPatients.birthday && moment(state.infectionPatients.birthday).format("DD/MM/YYYY"),
      gender: state.infectionPatients.gender,
      phone: state.infectionPatients.phone,
      hospitalizeDate: state.infectionPatients.hospitalizeDate && moment(state.infectionPatients.hospitalizeDate).format("DD/MM/YYYY"),
      dischargeHospitalDate: state.infectionPatients.dischargeHospitalDate && moment(state.infectionPatients.dischargeHospitalDate).format("DD/MM/YYYY"),
      address: state.infectionPatients.address,
      departmentId: state.infectionPatients.departmentId,
      departments: state.departments.departments || [],
      infectiousDiseaseId: state.infectionPatients.infectiousDiseaseId,
      infectiousDisease: state.infectiousDiseases.infectiousDiseases || [],
      reason: state.infectionPatients.reason,
      handling: state.infectionPatients.handling,
      infectionDate: state.infectionPatients.infectionDate && moment(state.infectionPatients.infectionDate).format("DD/MM/YYYY"),
      curedDate: state.infectionPatients.curedDate && moment(state.infectionPatients.curedDate).format("DD/MM/YYYY"),
      treatmentResult: state.infectionPatients.treatmentResult,

    };
  }, {
  loadDetail: actionInfectioPatients.loadDetail,
  updateData: actionInfectionPatients.updateData,
}
)(index);
