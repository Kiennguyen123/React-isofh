import medicalInstrumentsProvider from "@data-access/medical-instruments-provider";
import snackbar from "@utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "MEDICAL-INSTRUMENTS-UPDATE-DATA",
      data: data
    });
  };
}

function onSizeChange(size) {
  return (dispatch) => {
    dispatch(
      updateData({
        size: size
      })
    );
    dispatch(gotoPage(0));
  };
}

function onSearch(data, action) {
  return (dispatch, getState) => {
    let searchSpecimenType = action === "specimenType" ? data : getState().environmentalTests.searchSpecimenType;
    if (searchSpecimenType === undefined) {
    } else {
      dispatch(
        updateData({
          searchSpecimenType: searchSpecimenType,
          searchAssessment: searchAssessment,
          searchAssessor: searchAssessor,
          searchExecutor: searchExecutor,
          searchDate: searchDate,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().environmentalTests.size || 10;
    medicalInstrumentsProvider.search(page, size).then(s => {
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

function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().environmentalTests.id;
      medicalInstrumentsProvider
        .createOrEdit(id)
        .then(s => {
          if (s.code === 0) {
            dispatch(
              updateData({
              })
            );
            if (!id) {
              snackbar.show("Thêm danh mục loại nhiễm khuẩn thành công", "success");
            } else {
              snackbar.show("Cập nhật danh mục loại nhiễm khuẩn thành công", "success");
            }
            dispatch(gotoPage(0));
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm danh mục loại nhiễm khuẩn không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa danh mục loại nhiễm khuẩn không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm danh mục loại nhiễm khuẩn không thành công", "danger");
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
        content: `Bạn có muốn xóa danh mục loại nhiễm khuẩn ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          medicalInstrumentsProvider
            .delete(item.id)
            .then(s => {
              if (s.code === 0) {
                snackbar.show("Xóa danh mục loại nhiễm khuẩn thành công", "success");
                let data = getState().environmentalTests.data || [];
                let index = data.findIndex(x => x.id === item.id);
                if (index !== -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                resolve();
              } else {
                snackbar.show("Xóa danh mục loại nhiễm khuẩn không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa danh mục loại nhiễm khuẩn không thành công", "danger");
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
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onDeleteItem
};
