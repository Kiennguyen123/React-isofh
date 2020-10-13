import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionHospitalInfections from "@actions/hospital-infections";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment';
import DataContants from "@config/data-contants";
import "../style.scss";
function index(props) {
  const id = props.match.params.id;
  const getTreatmentResult = (item) => {
    var treatmentResult = DataContants.listTreatmentResult.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (treatmentResult.length > 0)
      return treatmentResult[0];
    return {};
  }
  const getGender = (item) => {
    var gender = DataContants.listGender.filter((data) => {
      return parseInt(data.id) === Number(item)
    })
    if (gender.length > 0)
      return gender[0];
    return {};
  }
  useEffect(() => {
    if (id) {
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/hospital-infections");
      });
    }
    else {
      props.updateData({
        id: null,
        patientName: "",
        departmentId: "",
        infectionTypeId: "",
        reason: "",
        handling: "",
        infectionDate: "",
        curedDate: "",
        treatmentResult: "",
        dataIndex: [],
      });
    }
  }, []);

  const onClose = () => {
    props.history.push("/hospital-infections");
  };
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option === "ROLE_user_ql_nhiem_khuan"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" ?
          <>
            <AdminPage className="mgr-hospital-infections">
              <Panel
                title="Chi tiết danh sách bệnh nhân nhiễm khuẩn bệnh viện"
                id={"mgr-hospital-infections"}
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
                      value={getGender(props.gender) ? getGender(props.gender).name : null}
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
                      value={props.department && props.department.name}
                    />
                    <InputDetail
                      width={4}
                      title="Loại nhiễm khuẩn : "
                      value={props.infectionType && props.infectionType.name}
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
      id: state.hospitalInfections.id,
      patientName: state.hospitalInfections.patientName,
      patientValue: state.hospitalInfections.patientValue,
      birthday: state.hospitalInfections.birthday && moment(state.hospitalInfections.birthday).format("DD/MM/YYYY"),
      departmentId: state.hospitalInfections.departmentId,
      gender: state.hospitalInfections.gender,
      address: state.hospitalInfections.address,
      dischargeHospitalDate: state.hospitalInfections.dischargeHospitalDate && moment(state.hospitalInfections.dischargeHospitalDate).format("DD/MM/YYYY"),
      phone: state.hospitalInfections.phone,
      patientDocument: state.hospitalInfections.patientDocument,
      regDate: state.hospitalInfections.regDate && moment(state.hospitalInfections.regDate).format("DD/MM/YYYY"),
      infectionTypeId: state.hospitalInfections.infectionTypeId,
      reason: state.hospitalInfections.reason,
      handling: state.hospitalInfections.handling,
      hospitalizeDate: state.hospitalInfections.hospitalizeDate && moment(state.hospitalInfections.hospitalizeDate).format("DD/MM/YYYY"),
      medicalRecordNo: state.hospitalInfections.medicalRecordNo,
      department: state.hospitalInfections.department,
      infectionType: state.hospitalInfections.infectionType,
      infectionDate: state.hospitalInfections.infectionDate && moment(state.hospitalInfections.infectionDate).format("DD/MM/YYYY"),
      curedDate: state.hospitalInfections.curedDate && moment(state.hospitalInfections.curedDate).format("DD/MM/YYYY"),
      treatmentResult: state.hospitalInfections.treatmentResult,
      dataIndex: state.hospitalInfections.dataIndex || [],
    };
  }, {
  loadDetail: actionHospitalInfections.loadDetail
}
)(index);
