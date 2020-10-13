import specimenTypesProvider from "@data-access/specimen-types-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "SPECIMEN-TYPES-UPDATE-DATA",
      data: data
    });
  };
}

function onSizeChange(size) {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        size: size
      })
    );
    dispatch(gotoPage(0)); 
  };
}

function onSearch(item, action) {
  return (dispatch, getState) => {
    let searchName = action === "name" ? item : getState().specimenTypes.searchName
  let searchValue= action === "value" ? item : getState().specimenTypes.searchValue
  let searchActive = action === "active" ? item : getState().specimenTypes.searchActive
    if (searchName === undefined && searchValue === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: searchName,
          searchValue: searchName,
          searchActive: searchActive,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().specimenTypes.size || 10;
    let name = getState().specimenTypes.searchName;
    let value = getState().specimenTypes.searchValue;
    let sort = getState().specimenTypes.sort || {};
    let active = getState().specimenTypes.searchActive;
    specimenTypesProvider.search(page, size, name, value, active, undefined, sort).then(s => {
      if (s && s.code === 0) {
        dispatch(
          updateData({
            total: s.totalElements || size,
            data: s.data || []
          })
        );
      }
    });
  };
}

function loadDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      specimenTypesProvider
        .getById(id)
        .then(s => {
          if (s && s.code === 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                value: s.data.value,
                description: s.data.description,
              })
            );
            resolve(s.data);
            return;
          }
          snackbar.show("Không tìm thấy kết quả phù hợp", "danger");
          reject(s);
        })
        .catch(e => {
          snackbar.show(
            e && e.message ? e.message : "Xảy ra lỗi, vui lòng thử lại sau",
            "danger"
          );
          reject(e);
        });
    });
  };
}

function loadList(specimenTypeId) {
  return (dispatch, getState) => {
    specimenTypesProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              specimenTypes: s.data,
              total: s.totalElements,
            })
          );
          break;
      }
    });
  };
}

function loadData() {
  return (dispatch, getState) => {
    specimenTypesProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              specimenTypes: s.data,
              total: s.totalElements,
            })
          );
          break;
      }
    });
  };
}

function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().specimenTypes.id;
      let active = true;
      let name = getState().specimenTypes.name;
      let value = getState().specimenTypes.value;
      let specimenTypeId = getState().specimenTypes.specimenTypeId;
      let lines = getState().specimenTypes.dataIndex
      specimenTypesProvider
        .createOrEdit(id, active, name, value, specimenTypeId, lines)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                value: "",
                specimenTypeId: "",
                lines: [],
                dataIndex: [],
                active: false,
                isOpen: false
              })
            );
            if (!id) {
              snackbar.show("Thêm loại mẫu xét nghiệm thành công", "success");
            } else {
              snackbar.show("Cập nhật loại mẫu xét nghiệm thành công", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          } else if(s.code === 1403){
            snackbar.show(`Mã ${value} đã tồn tại. Vui lòng kiểm tra lại!`, "danger");
            reject();
          } 
          else if(s.code === 1402){
            snackbar.show(`${name} đã tồn tại. Vui lòng kiểm tra lại!`, "danger");
          reject();
        } 
          else {
            if (!id) {
              snackbar.show(s.message || "Thêm loại mẫu xét nghiệm không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa loại mẫu xét nghiệm không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm loại mẫu xét nghiệm không thành công", "danger");
          reject();
        });
    });
  };
}

function onDeleteItem(item) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      confirm({
        title: "Xác nhận",
        content: `Bạn có muốn xóa loại mẫu xét nghiệm ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          specimenTypesProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa loại mẫu xét nghiệm thành công", "success");
                let data = getState().specimenTypes.data || [];
                let index = data.findIndex(x => x.id === item.id);
                if (index !== -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                resolve();
              } 
              else if(s.code === 605){
                snackbar.show(`${item.name} đã được sử dụng. Vui lòng kiểm tra lại!`, "danger")
                reject();
              }
              else {
                snackbar.show("Xóa loại mẫu xét nghiệm không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa loại mẫu xét nghiệm không thành công", "danger");
              reject();
            });
        },
        onCancel() {
          reject();
        }
      });
    });
  };
}

export default {
  loadList,
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onDeleteItem,
  loadDetail,
};
