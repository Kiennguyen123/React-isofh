import React from "react";
import "./style.scss";
import { connect } from "react-redux";
import authAction from "@actions/auth";

function index(props) {
  return (
    <header className="page-header" role="banner">
      <div className="page-logo">
        <a
          href="#"
          className="page-logo-link press-scale-down d-flex align-items-center position-relative"
        >
          <img
            src="/img/logohd.png"
            alt="iSofH"
            aria-roledescription="logo"
          />
          <span className="page-logo-text mr-1">iSofH</span>
          <span className="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span>
          <i className="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i>
        </a>
      </div>

      <div className="hidden-md-down dropdown-icon-menu position-relative">
        <img
          src={require("@images/logo.png")}
          alt="iSofH Portal"
          aria-roledescription="logo"
        />
      </div>
      <div className="hidden-lg-up">
        <a
          href="#"
          className="header-btn btn press-scale-down waves-effect waves-themed"
          data-action="toggle"
          data-class="mobile-nav-on"
        >
          <i className="ni ni-menu"></i>
        </a>

      </div>
      <div className="ml-auto d-flex">
        <div className="hidden-md-down">
          <a
            href="#"
            className="header-icon"
            data-toggle="modal"
            data-target=".js-modal-settings"
          >
            <i className="fal fa-cog"></i>
          </a>
        </div>
        <div>
          <a
            href="#"
            data-toggle="dropdown"
            title={(props.auth || {}).email}
            className="header-icon d-flex align-items-center justify-content-center ml-2"
          >
            <img
              src="/img/demo/avatars/avatar-admin.png"
              className="profile-image rounded-circle"
              alt={(props.auth || {}).full_name}
            />
          </a>
          <div className="dropdown-menu dropdown-menu-animated dropdown-lg">
            <div className="dropdown-header bg-trans-gradient d-flex flex-row py-4 rounded-top">
              <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                <span className="mr-2">
                  <img
                    src="/img/demo/avatars/avatar-admin.png"
                    className="rounded-circle profile-image"
                    alt={(props.auth || {}).full_name}
                  />
                </span>
                <div className="info-card-text">
                  <div className="fs-lg text-truncate text-truncate-lg">
                    {(props.auth || {}).username}
                  </div>
                  <span className="text-truncate text-truncate-md opacity-80">
                    {(props.auth || {}).email}
                  </span>
                </div>
              </div>
            </div>
            <div className="dropdown-divider m-0"></div>
            <a href="#" className="dropdown-item" data-action="app-reset">
              {/* <span data-i18n="drpdwn.reset_layout">Reset Layout</span> */}
              <span data-i18n="drpdwn.reset_layout">Đặt lại bố cục</span>
            </a>
            <a
              href="#"
              className="dropdown-item"
              data-toggle="modal"
              data-target=".js-modal-settings"
            >
              {/* <span data-i18n="drpdwn.settings">Settings</span> */}
              <span data-i18n="drpdwn.settings">Cài đặt</span>
            </a>
            <div className="dropdown-divider m-0"></div>
            <a href="#" className="dropdown-item" data-action="app-fullscreen">
              {/* <span data-i18n="drpdwn.fullscreen">Fullscreen</span> */}
              <span data-i18n="drpdwn.fullscreen">Toàn màn hình</span>
              <i className="float-right text-muted fw-n">F11</i>
            </a>
            <a href="#" className="dropdown-item" data-action="app-print">
              <span data-i18n="drpdwn.print">In</span>
              {/* <span data-i18n="drpdwn.print">Print</span> */}
              <i className="float-right text-muted fw-n">Ctrl + P</i>
            </a>
            <div className="dropdown-divider m-0"></div>
            <a
              onClick={() => {
                props.onLogout();
              }}
              className="dropdown-item fw-500 pt-3 pb-3"
            >
              <span data-i18n="drpdwn.page-logout">{props.auth ? "Đăng xuất" : "Đăng nhập"}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default connect(
  state => {
    return { auth: state.auth.auth };
  },
  {
    onLogout: authAction.onLogout
  }
)(index);
