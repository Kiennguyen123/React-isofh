import React, { useEffect } from "react";
import { Button, Tooltip } from "antd";
import { connect } from "react-redux";
import actionSpecimenTypes from "@actions/specimen-types";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import ModalAddUpdate from "./create";
function index(props) {
    const onSizeChange = size => {
        props.onSizeChange(size);
    };

    const onPageChange = page => {
        props.gotoPage(page);
    };

    useEffect(() => {
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

    const editItem = item => () => {
        props.updateData({
            id: item.id,
            active: item.active,
            dataIndex: item.lines,
            name: item.name,
            value: item.value,
            isOpen: true
        });
    };
    const showModalCreateOrEdit = (data) => {
        if (data) {
            props.updateData({
                ...data,
                isOpen: true,
            })
        } else {
            props.updateData({
                isOpen: true,
            })
        }
    }
    const onDeleteItem = item => () => {
        props.onDeleteItem(item);
    };
    const checkAuth = (props.auth.authorities || []).find(option => (option === "ROLE_super_admin" || option === "ROLE_admin_ql_moi_truong" || option == "ROLE_user_mescohn"))
    return (
        <>
            {
                checkAuth === "ROLE_super_admin" || checkAuth === "ROLE_admin_ql_moi_truong" || checkAuth === "ROLE_user_mescohn" ?
                    <>
                        <AdminPage
                            className="mgr-infectious-diseases"
                            icon="subheader-icon fal fa-window"
                            header="Danh mục loại mẫu xét nghiệm"
                            subheader="Danh sách danh mục loại mẫu xét nghiệm"
                        >
                            <Panel
                                id={"mgr-infectious-diseases "}
                                title="Danh mục loại mẫu xét nghiệm"
                                allowClose={false}
                                allowCollapse={false}
                                toolbar={
                                    <div className="toolbar">
                                        <Button className="button" onClick={() => showModalCreateOrEdit()}>Thêm mới</Button>
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
                                                <div className="custom-header">
                                                    <div className="title-box">STT</div>
                                                </div>
                                            ),
                                            width: 100,
                                            dataIndex: "col1",
                                            key: "col1"
                                        },
                                        {
                                            title: (
                                                <div className="custom-header">
                                                    <div className="title-box">Mã mẫu xét nghiệm</div>
                                                </div>
                                            ),
                                            width: 300,
                                            dataIndex: "col2",
                                            key: "col2"
                                        },
                                        {
                                            title: (
                                                <div className="custom-header">
                                                    <div className="title-box">Tên loại mẫu xét nghiệm</div>
                                                </div>
                                            ),
                                            width: 450,
                                            dataIndex: "col3",
                                            key: "col3"
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
                                                        <Tooltip placement="topLeft" title={"Sửa"}>
                                                            <div>
                                                                <a
                                                                    href="#"
                                                                    onClick={editItem(item)}
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
                                            dataIndex: "col4",
                                            key: "col4"
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
                        {
                            props.isOpen
                                ?
                                <ModalAddUpdate />
                                : null
                        }
                    </> : null}
        </>
    );
}

export default connect(
    state => {
        return {
            auth: state.auth.auth,
            data: state.specimenTypes.data || [],
            page: state.specimenTypes.page || 1,
            size: state.specimenTypes.size || 10,
            total: state.specimenTypes.total || 0,
            isOpen: state.specimenTypes.isOpen,
            clearTimeOutAffterRequest: state.specimenTypes.clearTimeOutAffterRequest || null
        };
    },
    {
        updateData: actionSpecimenTypes.updateData,
        onSizeChange: actionSpecimenTypes.onSizeChange,
        gotoPage: actionSpecimenTypes.gotoPage,
        onDeleteItem: actionSpecimenTypes.onDeleteItem,
        changeStatus: actionSpecimenTypes.changeStatus,
    }
)(index)