import React, { useEffect } from "react";
import { Form, Button, Select, Input, DatePicker } from "antd";
import { connect } from "react-redux";
import actionHospitalInfections from "@actions/hospital-infections";
import actionPatientHistories from "@actions/patient-histories";
import actionDepartments from "@actions/departments";
import actionInfectionTypes from '@actions/infection-types'
import { AdminPage, Panel } from "@admin/components/admin";
import moment from "moment";
import "../style.scss";
import DataContants from "@config/data-contants";
const { Option } = Select;
const { TextArea } = Input;
function index(props) {
  const id = props.match.params.id;
  useEffect(() => {
    props.loadListInfectionTypes();
    props.loadListDepartments();
    props.updateData({
      checkValidatePatientDocument: false,
      checkValidate: false
    })
    if (id) {
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/hospital-infections");
      });
    } else {
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
        departmentId: '',
        infectionTypeId: '',
        reason: '',
        handling: '',
        infectionDate: null,
        curedDate: null,
        treatmentResult: '',
      });
    }
  }, []);

  const handleSubmit = () => {
    if (props.patientDocument && !props.checkValidatePatientDocument
      && (moment(props.birthday).format("YYYYMMDD") <= moment(new Date()).format("YYYYMMDD"))
      && (props.regDate && props.birthday ? (moment(props.regDate).format("YYYYMMDD") >= moment(props.birthday).format("YYYYMMDD")) : true)
      && (props.hospitalizeDate && props.birthday ? (moment(props.hospitalizeDate).format("YYYYMMDD") >= moment(props.birthday).format("YYYYMMDD")) : true)
      && (props.hospitalizeDate && props.dischargeHospitalDate ? (moment(props.hospitalizeDate).format("YYYYMMDD") <= moment(props.dischargeHospitalDate).format("YYYYMMDD")) : true)
      && (props.hospitalizeDate && props.curedDate ? (moment(props.hospitalizeDate).format("YYYYMMDD") <= moment(props.curedDate).format("YYYYMMDD")) : true)
      && (props.dischargeHospitalDate && props.birthday ? (moment(props.dischargeHospitalDate).format("YYYYMMDD") >= moment(props.birthday).format("YYYYMMDD")) : true)
      && (props.dischargeHospitalDate && props.hospitalizeDate ? (moment(props.dischargeHospitalDate).format("YYYYMMDD") >= moment(props.hospitalizeDate).format("YYYYMMDD")) : true)
      && (props.curedDate !== null ? (moment(props.curedDate).format("YYYYMMDD") <= moment(props.dischargeHospitalDate).format("YYYYMMDD")) : true)
      && (props.infectionDate && props.birthday ? (moment(props.infectionDate).format("YYYYMMDD") >= moment(props.birthday).format("YYYYMMDD")) : true)
      && (props.infectionDate && props.curedDate ? (moment(props.infectionDate).format("YYYYMMDD") <= moment(props.curedDate).format("YYYYMMDD")) : true)
      && (props.curedDate && props.birthday ? (moment(props.curedDate).format("YYYYMMDD") >= moment(props.birthday).format("YYYYMMDD")) : true)
      && (props.curedDate && props.infectionDate ? (moment(props.curedDate).format("YYYYMMDD") >= moment(props.infectionDate).format("YYYYMMDD")) : true)
      && (props.curedDate && props.dischargeHospitalDate ? (moment(props.curedDate).format("YYYYMMDD") <= moment(props.dischargeHospitalDate).format("YYYYMMDD")) : true)
      && (props.curedDate && props.hospitalizeDate ? (moment(props.curedDate).format("YYYYMMDD") >= moment(props.hospitalizeDate).format("YYYYMMDD")) : true)
      && checkPhone()
      && (props.gender !== "") && (props.regDate !== "")
      && (props.treatmentResult !== "")
      && (props.patientValue !== "") && (props.patientName !== "")
      && (props.birthday !== "") && (props.phone !== "")
    ) {
      props.updateData({
        checkValidate: false
      })
      props.createOrEdit().then(s => {
        props.history.push("/hospital-infections");
      });
    } else {
      props.updateData({
        checkValidate: true
      })
      return
    }
  };
  const onClose = () => {
    props.history.push("/hospital-infections");
  };
  const checkPhone = () => {
    if (props.phone == 0) {
      return true;
    }
    if (props.phone && props.phone.isPhoneNumber()) {
      return true;
    } else {
      return false;
    }
  }

  const getPatientHistories = (patientDocument) => {
    props.gotoPage(0, patientDocument).then(s => {
      if (s && s.code === 0) {
        if (s && s.data && s.data.length) {
          let data = s.data && s.data[0]
          props.updateData({
            patientValue: data.patientValue,
            patientDocument: patientDocument,
            patientName: data.patientName,
            medicalRecordNo: data.medicalRecordNo,
            regDate: data.regDate,
            birthday: data.birthday,
            gender: data.gender,
            phone: data.phone,
            address: data.address,
            departmentId: data.departmentId,
            hospitalizeDate: data.timeGoIn,
            dischargeHospitalDate: data.timeGoOut,
            infectionTypeId: '',
            reason: '',
            handling: '',
            infectionDate: null,
            curedDate: null,
            treatmentResult: "",
            checkValidatePatientDocument: false
          })
        } else {
          props.updateData({
            checkValidatePatientDocument: true
          })
        }
      }
    })
  }
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_nhiem_khuan" || option === "ROLE_user_ql_nhiem_khuan"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_nhiem_khuan" || checkAuth === "ROLE_user_ql_nhiem_khuan" ?
          <>
            <AdminPage className="mgr-create-hospital-infections">
              <Panel
                title={props.id ? "Cập nhật NB nhiễm khuẩn Bệnh viện" : "Thêm mới NB nhiễm khuẩn Bệnh viện"}
                id={"mgr-create-hospital-infections"}
                allowClose={false}
                allowCollapse={false}
              >
                <Form layout="vertical" hideRequiredMark>
                  <div className="row">
                    <div className="col-4">
                      <Form.Item label="Mã hồ sơ * ">
                        <Input
                          onChange={(event) => {
                            props.updateData({
                              patientDocument: event.target.value
                            });
                          }}
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              getPatientHistories(e.target.value);
                            }
                          }}
                          placeholder="Nhập mã hồ sơ"
                          value={props.patientDocument}
                        />
                        {props.checkValidatePatientDocument ? <div className="validate">Mã hồ sơ không hợp lệ</div> :
                          props.checkValidate && !props.patientDocument ? <div className="validate">Vui lòng nhập mã hồ sơ!</div> : null}
                      </Form.Item>
                      <Form.Item label="Mã người bệnh * ">
                        <Input
                          onChange={(event) => {
                            props.updateData({
                              patientValue: event.target.value
                            });
                          }}
                          placeholder="Nhập mã người bệnh"
                          value={props.patientValue}
                        />
                        {props.checkValidate && !props.patientValue ? <div className="validate">Vui lòng nhập mã người bệnh!</div> : null}
                      </Form.Item>
                      <Form.Item label="Tên người bệnh  * ">
                        <Input
                          onChange={(event) => {
                            props.updateData({
                              patientName: event.target.value
                            });
                          }}
                          placeholder="Nhập tên người bệnh"
                          value={props.patientName}
                        />
                        {props.checkValidate && !props.patientName ? <div className="validate">Vui lòng nhập tên người bệnh!</div> : null}
                      </Form.Item>
                      <Form.Item label="Mã BA">
                        <Input
                          onChange={(event) => {
                            props.updateData({
                              medicalRecordNo: event.target.value
                            });
                          }}
                          placeholder="Nhập mã bệnh án"
                          value={props.medicalRecordNo}
                        />
                      </Form.Item>
                      <Form.Item label="Ngày đăng ký * ">
                        <DatePicker
                          onChange={(event) => {
                            props.updateData({
                              regDate: event
                            });
                          }}
                          format="DD/MM/YYYY"
                          placeholder="Nhập ngày đăng ký"
                          value={props.regDate}
                        />
                        {props.checkValidate && !props.regDate ? <div className="validate">Vui lòng nhập ngày đăng kí!</div> : null}
                        {props.checkValidate && (props.regDate && props.birthday && props.regDate.format("YYYYMMDD") < props.birthday.format("YYYYMMDD") ? <div className="validate">Ngày đăng kí không được nhỏ hơn ngày sinh</div> : null)}
                        {props.checkValidate && (props.dischargeHospitalDate && props.regDate && props.regDate.format("YYYYMMDD") > props.dischargeHospitalDate.format("YYYYMMDD") ? <div className="validate">Ngày đăng kí không được lớn hơn ngày xuất viện</div> : null)}
                      </Form.Item>
                      <Form.Item label="Ngày sinh * ">
                        <DatePicker
                          onChange={(event) => {
                            props.updateData({
                              birthday: event
                            });
                          }}
                          disabledDate={d => {
                            return d._d > new Date();
                          }}
                          format="DD/MM/YYYY"
                          placeholder="Nhập ngày sinh"
                          value={props.birthday}
                        />
                        {props.checkValidate && !props.birthday ? <div className="validate">Vui lòng nhập ngày sinh!</div> : null}
                        {props.checkValidate && ((props.birthday && moment(props.birthday).format("YYYYMMDD")) > moment(new Date()).format("YYYYMMDD")) ? <div className="validate">Ngày sinh không được lớn hơn ngày hiện tại!</div> : null}
                      </Form.Item>
                    </div>
                    <div className="col-4">
                      <Form.Item label="Giới tính * ">
                        <Select
                          showSearch
                          onChange={e => {
                            props.updateData({
                              gender: e
                            });
                          }}
                          value={props.gender}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase().unsignText()
                              .indexOf(input.toLowerCase().unsignText()) >= 0
                          }
                        >
                          <Option value="">Chọn giới tính</Option>
                          {DataContants.listGender.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                        {props.checkValidate && !props.gender ? <div className="validate">Vui lòng chọn giới tính</div> : null}
                      </Form.Item>
                      <Form.Item label="Số điện thoại * ">
                        <Input
                          onChange={(event) => {
                            props.updateData({
                              phone: event.target.value
                            });
                          }}
                          value={props.phone}
                          placeholder="Nhập số điện thoại"
                        />
                        {props.checkValidate && !props.phone ? <div className="validate">Vui lòng nhập số điện thoại!</div> :
                        props.checkValidate && (checkPhone() ? null : <div className="validate">Số điện thoại không đúng định dạng</div>)}
                      </Form.Item>
                      <Form.Item label="Địa chỉ">
                        <TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          onChange={(event) => {
                            props.updateData({
                              address: event.target.value
                            });
                          }}
                          value={props.address}
                          placeholder="Nhập địa chỉ"
                        />
                      </Form.Item>
                      <Form.Item label="Ngày nhập viện">
                        <DatePicker
                          onChange={(event) => {
                            props.updateData({
                              hospitalizeDate: event
                            });
                          }}
                          value={props.hospitalizeDate}
                          format="DD/MM/YYYY"
                          placeholder="Nhập ngày nhập viện"
                        />
                        {props.checkValidate && ((props.dischargeHospitalDate && props.hospitalizeDate && props.hospitalizeDate.format("YYYYMMDD") > props.dischargeHospitalDate.format("YYYYMMDD")) ? <div className="validate">Ngày nhập viện không được lớn hơn ngày xuất viện</div> : null)}
                        {props.checkValidate && ((props.birthday && props.hospitalizeDate && props.hospitalizeDate.format("YYYYMMDD") < props.birthday.format("YYYYMMDD")) ? <div className="validate">Ngày nhập viện không được nhỏ hơn ngày sinh </div> : null)}
                      </Form.Item>
                      <Form.Item label="Ngày xuất viện">
                        <DatePicker
                          onChange={(event) => {
                            props.updateData({
                              dischargeHospitalDate: event
                            });
                          }}
                          value={props.dischargeHospitalDate}
                          format="DD/MM/YYYY"
                          placeholder="Nhập ngày xuất viện"
                        />
                        {props.checkValidate && (props.infectionDate && props.dischargeHospitalDate && props.infectionDate.format("YYYYMMDD") > props.dischargeHospitalDate.format("YYYYMMDD") ? <div className="validate">Thời gian mắc bệnh không thể lớn hơn ngày xuất viện</div> : null)}
                      </Form.Item>
                      <Form.Item label="Khoa">
                        <Select
                          showSearch
                          onChange={e => {
                            props.updateData({
                              departmentId: e
                            });
                          }}
                          value={props.departmentId}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase().unsignText()
                              .indexOf(input.toLowerCase().unsignText()) >= 0
                          }
                        >
                          <Option value="">Chọn khoa</Option>
                          {props.departments.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="col-4">
                      <Form.Item label="Loại nhiễm khuẩn">
                        <Select
                          showSearch
                          onChange={e => {
                            props.updateData({
                              infectionTypeId: e
                            });
                          }}
                          value={props.infectionTypeId}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase().unsignText()
                              .indexOf(input.toLowerCase().unsignText()) >= 0
                          }
                        >
                          <Option value="">Chọn loại nhiễm khuẩn</Option>
                          {props.infectionTypes.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item label="Nguyên nhân">
                        <TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          value={props.reason}
                          onChange={(event) => {
                            props.updateData({
                              reason: event.target.value
                            });
                          }}
                          placeholder="Nhập nguyên nhân"
                        />
                      </Form.Item>
                      <Form.Item label="Cách xử lý">
                        <TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          value={props.handling}
                          onChange={(event) => {
                            props.updateData({
                              handling: event.target.value
                            });
                          }}
                          placeholder="Nhập cách xử lý"
                        />
                      </Form.Item>
                      <Form.Item label="Thời gian mắc bệnh">
                        <DatePicker
                          format="DD/MM/YYYY"
                          onChange={(event) => {
                            props.updateData({
                              infectionDate: event
                            });
                          }}
                          value={props.infectionDate}
                          placeholder="Nhập thời gian mắc bệnh"
                        />
                        {props.checkValidate && (props.infectionDate && props.curedDate && props.infectionDate.format("YYYYMMDD") > props.curedDate.format("YYYYMMDD") ? <div className="validate">Thời gian mắc bệnh không thể lớn hơn thời gian trị khỏi</div> : null)}
                      </Form.Item>
                      <Form.Item label="Thời gian điều trị xong">
                        <DatePicker
                          value={props.curedDate}
                          onChange={(event) => {
                            props.updateData({
                              curedDate: event
                            });
                          }}
                          format="DD/MM/YYYY"
                          placeholder="Nhập thời gian điều trị xong"
                        />
                        {props.checkValidate && ((props.curedDate && props.dischargeHospitalDate && props.curedDate.format("YYYYMMDD") > props.dischargeHospitalDate.format("YYYYMMDD")) ? <div className="validate">Thời gian trị khỏi không thể lớn hơn ngày xuất viện</div> : null)}
                      </Form.Item>
                      <Form.Item label="Kết quả điều trị * ">
                        <Select
                          value={props.treatmentResult}
                          showSearch
                          onChange={e => {
                            props.updateData({
                              treatmentResult: e
                            });
                          }}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase().unsignText()
                              .indexOf(input.toLowerCase().unsignText()) >= 0
                          }
                        >
                          <Option value="">Chọn kết quả điều trị</Option>
                          {DataContants.listTreatmentResult.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                        {props.checkValidate && !props.treatmentResult ? <div className="validate">Vui lòng chọn kết quả điểu trị</div> : null}
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      borderTop: "1px solid #e9e9e9",
                      padding: "16px 16px 0px",
                      background: "#fff",
                      textAlign: "right"
                    }} >
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                      Hủy
                            </Button>
                    <Button type="primary" onClick={() => handleSubmit()}>
                      {id ? "Lưu thay đổi" : "Tạo mới"}
                    </Button>
                  </div>
                </Form>
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
      patientDocument: state.hospitalInfections.patientDocument,
      patientValue: state.hospitalInfections.patientValue,
      patientName: state.hospitalInfections.patientName,
      medicalRecordNo: state.hospitalInfections.medicalRecordNo,
      regDate: state.hospitalInfections.regDate ? moment(state.hospitalInfections.regDate) : null,
      birthday: state.hospitalInfections.birthday ? moment(state.hospitalInfections.birthday) : null,
      gender: state.hospitalInfections.gender,
      phone: state.hospitalInfections.phone,
      hospitalizeDate: state.hospitalInfections.hospitalizeDate ? moment(state.hospitalInfections.hospitalizeDate) : null,
      dischargeHospitalDate: state.hospitalInfections.dischargeHospitalDate ? moment(state.hospitalInfections.dischargeHospitalDate) : null,
      address: state.hospitalInfections.address,
      reason: state.hospitalInfections.reason,
      handling: state.hospitalInfections.handling,
      infectionDate: state.hospitalInfections.infectionDate ? moment(state.hospitalInfections.infectionDate) : null,
      curedDate: state.hospitalInfections.curedDate ? moment(state.hospitalInfections.curedDate) : null,
      treatmentResult: state.hospitalInfections.treatmentResult,
      id: state.hospitalInfections.id,
      departments: state.departments.departments || [],
      departmentId: state.hospitalInfections.departmentId || '',
      infectionTypeId: state.hospitalInfections.infectionTypeId || '',
      infectionTypes: state.infectionTypes.infectionTypes || [],
      checkValidatePatientDocument: state.hospitalInfections.checkValidatePatientDocument,
      checkValidate: state.hospitalInfections.checkValidate
    };
  }, {
  updateData: actionHospitalInfections.updateData,
  createOrEdit: actionHospitalInfections.createOrEdit,
  loadListDepartments: actionDepartments.loadList,
  loadListInfectionTypes: actionInfectionTypes.loadList,
  loadDetail: actionHospitalInfections.loadDetail,
  gotoPage: actionPatientHistories.gotoPage
}
)(index);
