import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import actionDepartments from "@actions/departments";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";

function index(props) {
    const checkAuth = (props.auth.authorities || []).find(option => option == "ROLE_super_admin")
    const onSizeChange = size => {
        props.onSizeChange(size);
    };
    const onPageChange = page => {
        props.gotoPage(page);
    };
    useEffect(() => {
        props.updateData({
            searchValue: "",
            searchName: "",
        })
        props.gotoPage();
    }, []);

    let data = (props.data || []).map((item, index) => {
        return {
            key: index,
            col1: (props.page - 1) * props.size + index + 1,
            col2: item.value,
            col3: item.name,
            col4: item,
        };
    });
    return (
        <>
            {checkAuth === "ROLE_super_admin" ?
                <AdminPage
                    className="mgr-md-environmental-tests"
                    icon="subheader-icon fal fa-window"
                    header="Danh mục khoa"
                    subheader="Danh sách danh mục khoa"
                >
                    <Panel
                        id={"mgr-departments"}
                        title="Danh mục khoa"
                        allowClose={false}
                        allowCollapse={false}
                        toolbar={
                            <div className="toolbar">
                                <Button className="button" onClick={() => props.reset()}>Đồng bộ</Button>
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
                                            <div className="addition-box"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    color: "#000"
                                                }}
                                            >LỌC THEO</div>
                                        </div>
                                    ),
                                    width: 100,
                                    dataIndex: "col1",
                                    key: "col1"
                                },
                                {
                                    title: (
                                        <div className="custome-header">
                                            <div className="title-box">Mã khoa</div>
                                            <div className="addition-box">
                                                <div className="search-box">
                                                    <img src={require("@images/icon/ic-search.png")} alt="" />
                                                    <input
                                                        value={props.searchValue}
                                                        onChange={e => {
                                                            props.updateData({
                                                                searchValue: e.target.value
                                                            })
                                                            if (props.clearTimeOutAffterRequest) {
                                                                try {
                                                                    clearTimeout(props.clearTimeOutAffterRequest);
                                                                } catch (error) { }
                                                            }
                                                            let data = setTimeout(() => {
                                                                props.gotoPage()
                                                            }, 500)
                                                            props.updateData({
                                                                clearTimeOutAffterRequest: data
                                                            })
                                                        }
                                                        }
                                                        placeholder="Tìm theo mã khoa"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    width: 200,
                                    dataIndex: "col2",
                                    key: "col2"
                                },
                                {
                                    title: (
                                        <div className="custome-header">
                                            <div className="title-box">Tên khoa</div>
                                            <div className="addition-box">
                                                <div className="search-box">
                                                    <img src={require("@images/icon/ic-search.png")} alt="" />
                                                    <input
                                                        value={props.searchName}
                                                        onChange={e => {
                                                            props.updateData({
                                                                searchName: e.target.value
                                                            })
                                                            if (props.clearTimeOutAffterRequest) {
                                                                try {
                                                                    clearTimeout(props.clearTimeOutAffterRequest);
                                                                } catch (error) { }
                                                            }
                                                            let data = setTimeout(() => {
                                                                props.gotoPage();
                                                            }, 500)
                                                            props.updateData({
                                                                clearTimeOutAffterRequest: data
                                                            })
                                                        }
                                                        }
                                                        placeholder="Tìm theo tên khoa"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                    width: 200,
                                    dataIndex: "col3",
                                    key: "col3",
                                },

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
                </AdminPage> : null
            }
        </>
    );
}
export default connect(
    state => {
        return {
            auth: state.auth.auth,
            data: state.departments.data || [],
            size: state.departments.size || 10,
            page: state.departments.page || 1,
            total: state.departments.total || 0,
            searchName: state.departments.searchName,
            searchValue: state.departments.searchValue,
            clearTimeOutAffterRequest: state.departments.clearTimeOutAffterRequest || null
        };
    },
    {
        updateData: actionDepartments.updateData,
        onSizeChange: actionDepartments.onSizeChange,
        gotoPage: actionDepartments.gotoPage,
        reset: actionDepartments.reset,
    }
)(index);
