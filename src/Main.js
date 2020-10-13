import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import RouterWithPaths from "@components/RouterWithPaths";
import Admin from "@admin";
import User from "@user";
import { connect } from "react-redux";
import actionAuth from "@actions/auth";
import clientUtils from './utils/client-utils';
import queryString from "query-string";
import dateUtils from "mainam-react-native-date-utils";
function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) staticContext.status = code;
        return children;
      }}
    />
  );
}

function NotFound() {
  return (
    <>
      <Status code={404} />
      <h2>Not found</h2>;
    </>
  );
}
String.prototype.uintTextBox = function () {
  var re = /^\d*$/;
  return re.test(this);
}
function App(props) {
  const routers = [
    {
      path: ["/dang-xuat"],
      component: connect(state => { }, {
        onLogout: actionAuth.onLogout
      })(props => {
        useEffect(() => {
          let queries = queryString.parse(window.location.search);
          props.onLogout(queries.redirect);
        }, []);
        return <div></div>;
      })
    },
    {
      path: ["/print/:id"],
      component: User
    },
    {
      path: ["/", "/:function1", "/:function1/:id", "/:function1/:function2/:id"],
      component: Admin
    },
  ];

  let location = window.location;
  const values = queryString.parse(location.search);
  if (!props.auth) {
    if (values.code) {
      props.onLogin(location.origin, values.code).then(s => {
      }).catch(e => {
      });
      return null;
    } else {
      if (window.location.pathname != "/dang-xuat") {
        window.location.href = clientUtils.serverApi + `/auth/oauth/authorize?client_id=isofh&response_type=code&redirect_uri=${
          location.origin
          }&state=${encodeURIComponent(location.pathname + location.search)}`;
      }
    }
  } else {
    if (values.code && values.state) {
      setTimeout(() => {
        window.location.href = values.state;
      }, 1000);
    }
  }
  return (
    <BrowserRouter>
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
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
function mapStateToProps(state) {
  return {
    auth: state.auth.auth
  };
}

export default connect(mapStateToProps, {
  onLogin: actionAuth.onLogin
})(App);

