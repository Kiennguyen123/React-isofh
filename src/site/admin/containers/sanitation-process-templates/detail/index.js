import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { InputDetail } from "@admin/components/common/input";
import actionSanitationProcessTemplates from "@actions/sanitation-process-templates";
import { AdminPage, Panel } from "@admin/components/admin";
import "../style.scss";
function index(props) {
  const id = props.match.params.id;
  useEffect(() => {
    if (id)
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/sanitation-process-templates");
      });
    else {
      props.updateData({
        id: null,
        name: "",
        value: "",
        content: "",
        lines: [],
        dataIndex:[],
      });
    }
  }, []);
  const onClose = () => {
    props.history.push("/sanitation-process-templates");
    props.updateData({
      id: null,
      name: "",
      value: "",
      content: "",
      lines: [],
      dataIndex:[],
    });
  };
  const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option == "ROLE_user_mescohn"))
  return (
    <>
      {
        checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
          <>
            <AdminPage className="mgr-sanitation-process-templates">
              <Panel
                title="Chi tiết mẫu quy trình vệ sinh môi trường"
                id={"mgr-sanitation-process-templates"}
                allowClose={false}
                allowCollapse={false}
              >
                <div className="detail-body">
                  <div>
                    <InputDetail
                      width={2}
                      title="Tên mẫu : "
                      value={props.name}
                    />
                    <InputDetail
                      width={2}
                      title="Mã mẫu : "
                      value={props.value}
                    />
                    <InputDetail
                      width={2}
                      title="Nội dung công việc : "
                      value={
                        <div>
                          {
                            props.lines && props.lines.length && props.lines.map((item, index) => {
                              return (
                                <div key={index}>{"+ " + item.content}</div>
                              )
                            })
                          }
                        </div>
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
          </>
          : null}
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      name: state.sanitationProcessTemplates.name,
      value: state.sanitationProcessTemplates.value,
      content: state.sanitationProcessTemplates.content,
      id: state.sanitationProcessTemplates.id,
      lines: state.sanitationProcessTemplates.lines || [],
    };
  }, {
  loadDetail: actionSanitationProcessTemplates.loadDetail,
  updateData: actionSanitationProcessTemplates.updateData,
}
)(index);
