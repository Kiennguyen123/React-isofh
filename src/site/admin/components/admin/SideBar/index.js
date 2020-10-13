import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { connect } from "react-redux";
import ItemMenu from "../ItemMenu";
import $ from "jquery";
function index(props) {
  const menus = useRef(null);

  const [state, _setState] = useState({
    show: false,
  });

  const getMenu = () => {
    let allMenus = [
      {
        userType: [],
        href: "#",
        i18n: "nav.infections",
        name: "Quản lý",
        icon: "fal fa-shield-virus",
        filter: "infections kiểm soát môi trường",
        image: require("@images/icon-menu/KSMT.png"),
        menus: [
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_nhiem_khuan",
              "ROLE_user_ql_nhiem_khuan"
            ],
            href: "/hospital-infections",
            name: "DSBN nhiểm khuẩn bệnh viện",
            i18n: "nav.hospital-infections",
            image: require("@images/icon-menu/DSBNnhiemkhuanBV.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_nhiem_khuan",
              "ROLE_user_ql_nhiem_khuan",

            ],
            href: "/infection-patients",
            name: "DSBN mắc bệnh truyền nhiễm",
            i18n: "nav.infection-patients",
            image: require("@images/icon-menu/DSBNmacbenhtruyennhiem.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_moi_truong",
              "ROLE_user_ql_moi_truong",
              "ROLE_user_mescohn"
            ],
            href: "/air-pollution-incidents",
            name: "Sự cố ô nhiễm môi trường",
            i18n: "nav.air-pollution-incidents",
            image: require("@images/icon-menu/SucoONMT.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_moi_truong",
              "ROLE_user_ql_moi_truong",
              "ROLE_user_mescohn"
            ],
            href: "/environmental-tests",
            name: "DS xét nghiệm đánh giá MT",
            i18n: "nav.environmental-tests",
            image: require("@images/icon-menu/DSxetnhiemDGMT.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_nhiem_khuan",
              "ROLE_user_ql_nhiem_khuan",
              "ROLE_user_mescohn"
            ],
            href: "/fabric-sterilization",
            name: "Quản lý thanh/ tiệt trùng đồ vải",
            i18n: "nav.quan-ly-do-vai",
            image: require("@images/icon-menu/Thanhtrungdovai.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_moi_truong",
              "ROLE_user_ql_moi_truong",
              "ROLE_user_khac",
              "ROLE_user_mescohn"
            ],
            href: "/sanitation-processes",
            name: "Lịch và QT VSMT",
            i18n: "nav.sanitation-processes",
            image: require("@images/icon-menu/LichvaquytrinhVSMT.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_nhiem_khuan",
              "ROLE_user_ql_nhiem_khuan",
              "ROLE_user_khac",
              "ROLE_user_mescohn"
            ],
            href: "/tool-sterilization",
            name: "Tiệt trùng dung cụ",
            i18n: "nav.quan-ly-dung-cu",
            image: require("@images/icon-menu/tiet_khuan.png"),
          },
        ],
      },
      {
        userType: [],
        href: "#",
        i18n: "nav.category",
        name: "Danh mục",
        icon: "fal fa-list-alt",
        filter: "category danh mục",
        image: require("@images/icon-menu/QuanlyDM.png"),
        menus: [
          {
            userType: [
              "ROLE_super_admin",
            ],
            href: "/departments",
            name: "Danh mục khoa",
            i18n: "nav.departments",
            image: require("@images/icon-menu/DMkhoa.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_nhiem_khuan"
            ],
            href: "/infectious-diseases",
            name: "DM nhóm bệnh truyền nhiễm",
            i18n: "nav.infectious-diseases",
            image: require("@images/icon-menu/DMnhombenhtruyennhiem.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_nhiem_khuan"
            ],
            href: "/infection-types",
            name: "DM loại nhiễm khuẩn",
            i18n: "nav.infectious-diseases",
            image: require("@images/icon-menu/DmLoainhiemkhuan.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_moi_truong",
              "ROLE_user_mescohn"
            ],
            href: "/specimen-types",
            name: "Danh mục loại mẫu xét nghiệm",
            i18n: "nav.specimen-types",
            image: require("@images/icon-menu/Dmloaimauxetnghiem.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_moi_truong",
              "ROLE_user_mescohn"
            ],
            href: "/md-environmental-tests",
            name: "DM gói xét nghiệm môi trường",
            i18n: "nav.md-environmental-tests",
            image: require("@images/icon-menu/DMgoiXNMT.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_moi_truong",
              "ROLE_user_mescohn"
            ],
            href: "/sanitation-process-templates",
            name: "DM mẫu quy trình VSMT",
            i18n: "nav.sanitation-process-templates",
            image: require("@images/icon-menu/DMmauquytrinhVSMT.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_nhiem_khuan",
              "ROLE_user_mescohn"
            ],
            href: "/tool",
            name: "Danh mục đồ vải, dụng cụ y tế",
            i18n: "nav.medical-instruments",
            image: require("@images/icon-menu/DMdovaiDCYT.png")
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_nhiem_khuan",
              "ROLE_user_mescohn"
            ],
            href: "/sample-medical-instruments",
            name: "DM mẫu dụng cụ y tế",
            i18n: "nav.sample-medical-instruments",
            image: require("@images/icon-menu/DMmauDCYT.png"),
          },
          {
            userType: [
              "ROLE_super_admin",
              "ROLE_admin_ql_moi_truong",
              "ROLE_user_mescohn"
            ],
            href: "/category-incidents",
            name: "DM loại sự cố",
            i18n: "nav.category-incidents",
            image: require("@images/icon-menu/loai_su_co.png"),
          },
        ],
      },
      {
        userType: [
          "ROLE_super_admin",
          "ROLE_admin_ql_nhiem_khuan",
          "ROLE_admin_ql_moi_truong",
          "ROLE_user_mescohn"
        ],
        href: "/authorization",
        i18n: "nav.permission",
        name: "Phân quyền tài khoản",
        icon: "fal fa-list-alt",
        filter: "permission danh mục",
        image: require("@images/icon-menu/phan_quyen.png"),
        menus: [
        ],
      },
    ]
    return allMenus.filter(item => {
      if (item.menus && item.menus.length) {
        let data = item.menus.filter((option, index) => {
          if (!(option.userType || []).length) {
            return true;
          } else {
            let data = option.userType.filter((option3) => {
              return option3 === (props.auth.authorities || []).find((option2) => option2 === option3)
            })
            if (data && data.length) {
              return true
            }
          }
        })
        item.menus = data
        if (data && data.length) {
          return true
        }
      } else {
        if (!(item.userType || []).length) {
          return true;
        } else {
          let dataCheck = item.userType.filter((option3) => {
            return option3 === (props.auth.authorities || []).find((option) => option === option3)
          })
          if (dataCheck && dataCheck.length) {
            return true
          }
        }
      }
    })
  }

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  useEffect(() => {
    try {
      window.initApp.listFilter(
        $("#js-nav-menu"),
        $("#nav_filter_input"),
        $("#js-primary-nav")
      );
    } catch (error) { }
  });

  useEffect(() => {
    setState({ menus: getMenu() })
    if (menus.current) {
      setState({ menus: menus.current });
    }
  }, []);

  const toggle = (item) => {
    item.open = !item.open;
    menus.current = [...state.menus];
    setState({ menus: menus.current });
  };

  return (
    <aside className="page-sidebar list-filter-active">
      <div className="info-card">
        <img
          src="/img/demo/avatars/avatar-admin.png"
          className="profile-image rounded-circle"
          alt={(props.auth || {}).full_name}
        />
        <div className="info-card-text">
          <a href="#" className="d-flex align-items-center text-white">
            <span className="text-truncate text-truncate-sm d-inline-block">
              {(props.auth || {}).full_name}
            </span>
          </a>
        </div>
      </div>
      <div className="nav-filter">
        <div className="position-relative">
          <input
            type="text"
            id="nav_filter_input"
            placeholder="Tìm kiếm tính năng"
            className="form-control"
            tabIndex="0"
          />
        </div>
      </div>
      <nav
        id="js-primary-nav"
        className="primary-nav js-list-filter"
        role="navigation"
      >
        < ul id="js-nav-menu" className="nav-menu" >
          {
            state.menus && state.menus.length && state.menus.map((item, index) => {
              return <ItemMenu key={index} item={item} toggle={toggle} />;
            })
          }
        </ul >
        <div className="filter-message js-filter-message bg-success-600"></div>
      </nav >

      <a
        id="toggle-sidebar"
        href="#"
        className="btn js-waves-off"
        data-action="toggle"
        data-class="nav-function-minify"
        title="Minify Navigation"
      >
        <i className="ni ni-chevron-right"></i>
      </a>

    </aside >
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth.auth,
  };
}

export default connect(mapStateToProps)(index);
