import departmentsProvider from "@data-access/departments-provider";
import snackbar from "@utils/snackbar-utils";

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "DEPARTMENTS-UPDATE-DATA",
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

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().departments.size || 10;
    let name = getState().departments.searchName;
    let value = getState().departments.searchValue;
    departmentsProvider.search(page, size, name, value).then(s => {
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

function loadList() {
  return (dispatch) => {
    departmentsProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              departments: s.data,
              total: s.totalElements,
            })
          );
          break;
      }
    });
  };
}

function reset (){
  return (dispatch) => {
  departmentsProvider.syncs().then(s => {
    if (s && s.code === 0) {
      snackbar.show("Đồng bộ dữ liệu thành công!", "success");
      dispatch(gotoPage());
      dispatch(loadList());
    } else {
      snackbar.show("Đồng bộ dữ liệu thất bại!", "danger");
    }
  }).catch(e => {

      })
  }
}
export default {
  loadList,
  updateData,
  gotoPage,
  onSizeChange,
  reset,
};
