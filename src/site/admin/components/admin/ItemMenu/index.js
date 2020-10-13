import React from "react";
import { Link } from "react-router-dom";
import Collapse from "@kunukn/react-collapse";
function index(props) {
  let url = window.location.pathname;
  const onClick = (item) => (e) => {
    if (props.toggle) {
      props.toggle(item);
    }
    if (!item.href || item.href === "#") {
      e.preventDefault();
      e.stopPropagation();
    } else {
    }
  };
  return (
    <li>
      {props.item.href && (!props.item.menus || !props.item.menus.length) ? (
        <Link
          onClick={onClick(props.item)}
          to={props.item.href}
          title={props.item.name}
          data-filter-tags={props.item.name + " " + props.item.filter}
          className={props.item.href === url ? "active waves-effect waves-themed" : "waves-effect waves-themed"}
        >
          <img style={{ width: "24px", marginRight: "10px" }} src={props.item.image} alt="" />
          <span className="nav-link-text" data-i18n={props.item.i18n}>
            {props.item.name}
          </span>
        </Link>
      ) : (
          <a
            onClick={onClick(props.item)}
            href="#"
            title={props.item.name}
            data-filter-tags={props.item.name + " " + props.item.filter}
            className=" waves-effect waves-themed"
          >
            <img style={{ width: "24px", marginRight: "10px" }} src={props.item.image} alt="" />
            <span className="nav-link-text" data-i18n={props.item.i18n}>
              {props.item.name}
            </span>
            <b className="collapse-sign">
              {props.item.open ? (
                <em className="fal fa-angle-down"></em>
              ) : (
                  <em className="fal fa-angle-up"></em>
                )}
            </b>
          </a>
        )}
      {props.item.menus && props.item.menus.length ? (
        <Collapse
          elementType="ul"
          isOpen={props.item.open}
          collapseHeight="0px"
          transition={`height 290ms cubic-bezier(.4, 0, .2, 1)`}
        >
          {props.item.menus.map((item, index) => {

            return (
              <li
                key={index}
                className={item.href === url ? "active" : ""}
              >
                <Link
                  onClick={onClick(item)}
                  to={item.href}
                  title={item.name}
                  data-filter-tags={item.name + " " + item.filter}
                  className=" waves-effect waves-themed"
                  style={{ marginLeft: "-20px" }}
                >
                  <img style={{ width: "24px", marginRight: "10px" }} key={index} src={item.image} alt="" />
                  <span className="nav-link-text" data-i18n={item.i18n}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </Collapse>
      ) : null}
    </li>
  );
}

export default index;
