import React, { useEffect } from "react";
import Loadable from "react-loadable";
import { Switch } from "react-router-dom";
import RouterWithPaths from "@components/RouterWithPaths";
import actionAuth from "@actions/auth";
import {
  SideBar,
  Header,
  Breadcrumbs,
  Footer,
  SettingLayout,
} from "@admin/components/admin";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import { Loading } from "@admin/components/admin";
import './style.scss';
function index(props) {
  useEffect(() => {
    window.registerEvent();
  });
  const routers = [
    {
      path: ["/md-environmental-tests"],
      component: Loadable({
        loader: () => import("@admin/containers/md-environmental-tests"),
        loading: Loading
      })
    },
    {
      path: ["/departments"],
      component: Loadable({
        loader: () => import("@admin/containers/departments"),
        loading: Loading
      })
    },
    {
      path: ["/hospital-infections"],
      component: Loadable({
        loader: () => import("@admin/containers/hospital-infections"),
        loading: Loading
      })
    },
    {
      path: ["/sanitation-process-templates"],
      component: Loadable({
        loader: () => import("@admin/containers/sanitation-process-templates"),
        loading: Loading
      })
    },
    {
      path: ["/infectious-diseases"],
      component: Loadable({
        loader: () => import("@admin/containers/infectious-diseases"),
        loading: Loading
      })
    },
    {
      path: ["/air-pollution-incidents"],
      component: Loadable({
        loader: () => import("@admin/containers/air-pollution-incidents"),
        loading: Loading
      })
    },
    {
      path: ["/air-pollution-incidents/create", "/air-pollution-incidents/edit/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/air-pollution-incidents/create"),
        loading: Loading
      })
    },
    {
      path: ["/air-pollution-incidents/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/air-pollution-incidents/detail"),
        loading: Loading
      })
    },
    {
      path: ["/environmental-tests"],
      component: Loadable({
        loader: () => import("@admin/containers/environmental-tests"),
        loading: Loading
      })
    },
    {
      path: ["/environmental-tests/create", "/environmental-tests/edit/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/environmental-tests/create"),
        loading: Loading
      })
    },
    {
      path: ["/environmental-tests/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/environmental-tests/detail"),
        loading: Loading
      })
    },
    {
      path: ["/hospital-infections/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/hospital-infections/detail"),
        loading: Loading
      })
    },
    {
      path: ["/infection-types"],
      component: Loadable({
        loader: () => import("@admin/containers/infection-types"),
        loading: Loading
      })
    },
    {
      path: ["/md-environmental-tests/edit/:id", "/md-environmental-tests/create"],
      component: Loadable({
        loader: () => import("@admin/containers/md-environmental-tests/create"),
        loading: Loading
      })
    },
    {
      path: ["/md-environmental-tests/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/md-environmental-tests/detail"),
        loading: Loading
      })
    },
    {
      path: ["/sanitation-processes"],
      component: Loadable({
        loader: () => import("@admin/containers/sanitation-processes"),
        loading: Loading
      })
    },
    {
      path: ["/sanitation-processes/edit/:id", "/sanitation-processes/create"],
      component: Loadable({
        loader: () => import("@admin/containers/sanitation-processes/create"),
        loading: Loading
      })
    },
    {
      path: ["/sanitation-processes/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/sanitation-processes/detail"),
        loading: Loading
      })
    },
    {
      path: ["/specimen-types"],
      component: Loadable({
        loader: () => import("@admin/containers/specimen-types"),
        loading: Loading
      })
    },
    {
      path: ["/sanitation-process-templates/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/sanitation-process-templates/detail"),
        loading: Loading
      })
    },
    {
      path: ["/infection-patients"],
      component: Loadable({
        loader: () => import("@admin/containers/infection-patients"),
        loading: Loading
      })
    },
    {
      path: ["/infection-patients/edit/:id", "/infection-patients/create"],
      component: Loadable({
        loader: () => import("@admin/containers/infection-patients/create"),
        loading: Loading
      })
    },
    {
      path: ["/infection-patients/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/infection-patients/detail"),
        loading: Loading
      })
    },
    {
      path: ["/hospital-infections/edit/:id", "/hospital-infections/create"],
      component: Loadable({
        loader: () => import("@admin/containers/hospital-infections/create"),
        loading: Loading
      })
    },
    {
      path: ["/tool"],
      component: Loadable({
        loader: () => import("@admin/containers/dm-dung-cu"),
        loading: Loading
      })
    },
    {
      path: ["/sample-medical-instruments"],
      component: Loadable({
        loader: () => import("@admin/containers/sample-medical-instruments"),
        loading: Loading
      })
    },
    {
      path: ["/fabric-sterilization"],
      component: Loadable({
        loader: () => import("@admin/containers/quan-ly-do-vai"),
        loading: Loading
      })
    },
    {
      path: ["/fabric-sterilization/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/quan-ly-do-vai/detail"),
        loading: Loading
      })
    },
    {
      path: ["/tool-sterilization"],
      component: Loadable({
        loader: () => import("@admin/containers/quan-ly-dung-cu"),
        loading: Loading
      })
    },
    {
      path: ["/tool-sterilization/create"],
      component: Loadable({
        loader: () => import("@admin/containers/quan-ly-dung-cu/create"),
        loading: Loading
      })
    },
    {
      path: ["/tool-sterilization/edit/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/quan-ly-dung-cu/create"),
        loading: Loading
      })
    },
    {
      path: ["/tool-sterilization/detail/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/quan-ly-dung-cu/detail"),
        loading: Loading
      })
    },
    {
      path: ["/authorization"],
      component: Loadable({
        loader: () => import("@admin/containers/authorization"),
        loading: Loading
      })
    },
    {
      path: ["/category-incidents"],
      component: Loadable({
        loader: () => import("@admin/containers/category-incidents"),
        loading: Loading
      })
    },
    {
      path: ["/category-incidents/edit/:id"],
      component: Loadable({
        loader: () => import("@admin/containers/category-incidents/create"),
        loading: Loading
      })
    },
  ];
  return (
    <div>
      <div className="page-wrapper">
        <div className="page-inner">
          <SideBar />
          <div className="page-content-wrapper">
            <Header />
            <main id="js-page-content" role="main" className="page-content">
              <Breadcrumbs />
              <Switch>
                {routers.map((route, key) => {
                  if (route.component)
                    return (
                      <RouterWithPaths
                        exact
                        key={key}
                        path={route.path}
                        render={(props) => {
                          return <route.component {...props} />;
                        }}
                      />
                    );
                  return null;
                })}
              </Switch>
            </main>
            <div
              className="page-content-overlay"
              data-action="toggle"
              data-class="mobile-nav-on"
            ></div>
            <Footer />
            <div
              className="modal fade modal-backdrop-transparent"
              id="modal-shortcut"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="modal-shortcut"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-top modal-transparent"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-body">
                    <ul className="app-list w-auto h-auto p-0 text-left">
                      <li>
                        <a
                          href="intel_introduction.html"
                          className="app-list-item text-white border-0 m-0"
                        >
                          <div className="icon-stack">
                            <i className="base base-7 icon-stack-3x opacity-100 color-primary-500 "></i>
                            <i className="base base-7 icon-stack-2x opacity-100 color-primary-300 "></i>
                            <i className="fal fa-home icon-stack-1x opacity-100 color-white"></i>
                          </div>
                          <span className="app-list-name">Home</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="page_inbox_general.html"
                          className="app-list-item text-white border-0 m-0"
                        >
                          <div className="icon-stack">
                            <i className="base base-7 icon-stack-3x opacity-100 color-success-500 "></i>
                            <i className="base base-7 icon-stack-2x opacity-100 color-success-300 "></i>
                            <i className="ni ni-envelope icon-stack-1x text-white"></i>
                          </div>
                          <span className="app-list-name">Inbox</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="intel_introduction.html"
                          className="app-list-item text-white border-0 m-0"
                        >
                          <div className="icon-stack">
                            <i className="base base-7 icon-stack-2x opacity-100 color-primary-300 "></i>
                            <i className="fal fa-plus icon-stack-1x opacity-100 color-white"></i>
                          </div>
                          <span className="app-list-name">Add More</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <p id="js-color-profile" className="d-none">
              <span className="color-primary-50"></span>
              <span className="color-primary-100"></span>
              <span className="color-primary-200"></span>
              <span className="color-primary-300"></span>
              <span className="color-primary-400"></span>
              <span className="color-primary-500"></span>
              <span className="color-primary-600"></span>
              <span className="color-primary-700"></span>
              <span className="color-primary-800"></span>
              <span className="color-primary-900"></span>
              <span className="color-info-50"></span>
              <span className="color-info-100"></span>
              <span className="color-info-200"></span>
              <span className="color-info-300"></span>
              <span className="color-info-400"></span>
              <span className="color-info-500"></span>
              <span className="color-info-600"></span>
              <span className="color-info-700"></span>
              <span className="color-info-800"></span>
              <span className="color-info-900"></span>
              <span className="color-danger-50"></span>
              <span className="color-danger-100"></span>
              <span className="color-danger-200"></span>
              <span className="color-danger-300"></span>
              <span className="color-danger-400"></span>
              <span className="color-danger-500"></span>
              <span className="color-danger-600"></span>
              <span className="color-danger-700"></span>
              <span className="color-danger-800"></span>
              <span className="color-danger-900"></span>
              <span className="color-warning-50"></span>
              <span className="color-warning-100"></span>
              <span className="color-warning-200"></span>
              <span className="color-warning-300"></span>
              <span className="color-warning-400"></span>
              <span className="color-warning-500"></span>
              <span className="color-warning-600"></span>
              <span className="color-warning-700"></span>
              <span className="color-warning-800"></span>
              <span className="color-warning-900"></span>
              <span className="color-success-50"></span>
              <span className="color-success-100"></span>
              <span className="color-success-200"></span>
              <span className="color-success-300"></span>
              <span className="color-success-400"></span>
              <span className="color-success-500"></span>
              <span className="color-success-600"></span>
              <span className="color-success-700"></span>
              <span className="color-success-800"></span>
              <span className="color-success-900"></span>
              <span className="color-fusion-50"></span>
              <span className="color-fusion-100"></span>
              <span className="color-fusion-200"></span>
              <span className="color-fusion-300"></span>
              <span className="color-fusion-400"></span>
              <span className="color-fusion-500"></span>
              <span className="color-fusion-600"></span>
              <span className="color-fusion-700"></span>
              <span className="color-fusion-800"></span>
              <span className="color-fusion-900"></span>
            </p>
          </div>
        </div>
      </div>
      <SettingLayout />
    </div>
  );
}
function mapStateToProps(state) {
  return {
    auth: state.auth.auth,
  };
}
export default connect(mapStateToProps, {
  onLogin: actionAuth.onLogin
})(index)
