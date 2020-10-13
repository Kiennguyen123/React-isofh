import React, { useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import './style.scss'
// import { useRouter } from 'next/router'
function index(props) {
  // const router = useRouter();
  const getBreadcrumbs = () => {
    let url = (window.location.pathname || "").toLowerCase();
    let obj = [];
    let checkId = window.location.pathname && window.location.pathname.split("/")
    switch (url) {
      case "/":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          }
        ];
        break;
      case "/md-environmental-tests":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục gói xét nghiệm môi trường"
          }
        ];
        break;
      case "/md-environmental-tests/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/md-environmental-tests",
            name: "Danh mục gói xét nghiệm môi trường"
          },
          {
            name: "Thêm mới"
          }
        ];
        break;
      case "/departments":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục khoa"
          }
        ];
        break;
      case "/infectious-diseases":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục nhóm bệnh truyền nhiễm"
          }
        ];
        break;
      case "/infection-types":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục loại nhiễm khuẩn"
          }
        ];
        break;
      case "/specimen-types":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục loại mẫu xét nghiệm"
          }
        ];
        break;
      case "/sanitation-process-templates":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục Mẫu quy trình vệ sinh môi trường"
          }
        ];
        break;
      case "/hospital-infections":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh sách NB nhiễm khuẩn Bệnh viện"
          }
        ];
        break;
      case "/hospital-infections/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/hospital-infections",
            name: "Danh sách NB nhiễm khuẩn Bệnh viện"
          },
          {
            name: "Thêm mới"
          }
        ];
        break;
      case "/infection-patients":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh sách NB mắc bệnh truyền nhiễm trong Bệnh viện"
          }
        ];
        break;
      case "/infection-patients/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/infection-patients",
            name: "Danh sách NB mắc bệnh truyền nhiễm trong Bệnh viện"
          },
          {
            name: "Thêm mới"
          }
        ];
        break;
      case "/air-pollution-incidents":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Sự cố ô nhiễm không khí trong Bệnh viện"
          }
        ];
        break;
      case "/air-pollution-incidents/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/air-pollution-incidents",
            name: "Sự cố ô nhiễm không khí trong Bệnh viện"
          },
          {
            name: "Thêm mới"
          }
        ];
        break;
      case "/environmental-tests":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh sách xét nghiệm đánh giá môi trường"
          }
        ];
        break;
      case "/environmental-tests/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/environmental-tests",
            name: "Danh sách xét nghiệm đánh giá môi trường"
          },
          {
            name: "Thêm mới"
          }
        ];
        break;
      case "/sanitation-processes":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Quản lý lịch và quy trình vệ sinh môi trường Bệnh viện"
          }
        ];
        break;
      case "/tool-sterilization":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Quản lý tiệt trùng dụng cụ y tế"
          }
        ];
        break;
      case "/tool-sterilization/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/tool-sterilization",
            name: "Danh sách tiệt trùng dụng cụ y tế"
          },
          {
            name: "Thêm mới"
          }
        ];
        break;
      case "/tool":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục đồ vải, dụng cụ y tế"
          }
        ];
        break;
      case "/sample-medical-instruments":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục mẫu dụng cụ y tế"
          }
        ];
        break;
      case "/sanitation-processes/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/sanitation-processes",
            name: "Quản lý lịch và quy trình vệ sinh môi trường Bệnh viện"
          },
          {
            name: "Thêm mới"
          }
        ];
        break;
      case "/fabric-sterilization":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Quản lý thanh trùng đồ vải"
          }
        ];
        break;
      case "/fabric-sterilization/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/fabric-sterilization",
            name: "Quản lý thanh trùng đồ vải"
          },
          {
            name: "Thêm mới"
          }
        ];
        break;
      case "/category-incidents":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục loại sự cố"
          }
        ];
        break;
      case "/authorization":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Phân quyền tài khoản"
          }
        ];
        break;
      default:
        if (url.indexOf("/hospital-infections/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/hospital-infections",
              name: "Danh sách NB nhiễm khuẩn Bệnh viện"
            },
            {
              name: "Cập nhật"
            }
          ];
        } else if (url.indexOf("/hospital-infections/detail") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/hospital-infections",
              name: "Danh sách NB nhiễm khuẩn Bệnh viện"
            },
            {
              name: "Chi tiết NB nhiễm khuẩn Bệnh viện"
            }
          ];
        } else if (url.indexOf("/infection-patients/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/infection-patients",
              name: "Danh sách NB mắc bệnh truyền nhiễm trong Bệnh viện"
            },
            {
              name: "Cập nhật"
            }
          ];
        } else if (url.indexOf("/air-pollution-incidents/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/air-pollution-incidents",
              name: "Sự cố ô nhiễm không khí trong Bệnh viện"
            },
            {
              name: "Cập nhật"
            }
          ];
        } else if (url.indexOf("/air-pollution-incidents/detail") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/air-pollution-incidents",
              name: "Sự cố ô nhiễm không khí trong Bệnh viện"
            },
            {
              name: "Chi tiết"
            }
          ];
        } else if (url.indexOf("/environmental-tests/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/environmental-tests",
              name: "Danh sách xét nghiệm đánh giá môi trường"
            },
            {
              name: "Cập nhật"
            }
          ];
        } else if (url.indexOf("/sanitation-processes/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/sanitation-processes",
              name: "Quản lý lịch và quy trình vệ sinh môi trường Bệnh viện"
            },
            {
              name: "Cập nhật"
            }
          ];
        } else if (url.indexOf("/sanitation-processes/detail") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/sanitation-processes",
              name: "Quản lý lịch và quy trình vệ sinh môi trường Bệnh viện"
            },
            {
              name: "Chi tiết lịch và quy trình vệ sinh môi trường Bệnh viện"
            }
          ];
        } else if (url.indexOf("/md-environmental-tests/detail") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/md-environmental-tests",
              name: "Danh mục gói xét nghiệm môi trường"
            },
            {
              name: "Chi tiết gói xét nghiệm môi trường"
            }
          ];
        } else if (url.indexOf("/environmental-tests/detail") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/environmental-tests",
              name: "Danh sách xét nghiệm đánh giá môi trường"
            },
            {
              name: "Chi tiết danh sách xét nghiệm đánh giá môi trường"
            }
          ];
        } else if (url.indexOf("/tool-sterilization/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/tool-sterilization",
              name: "Danh sách dụng cụ tiệt trùng dụng cụ y tế"
            },
            {
              name: "Chỉnh sửa"
            }
          ];
        } else if (url.indexOf("/tool-sterilization/detail") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/tool-sterilization",
              name: "Danh sách dụng cụ tiệt trùng dụng cụ y tế"
            },
            {
              name: "Chi tiết dụng cụ tiệt trùng dụng cụ y tế"
            }
          ];
        } else if (url.indexOf("/fabric-sterilization/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/fabric-sterilization",
              name: "Quản lý thanh trùng đồ vải"
            },
            {
              name: "Chỉnh sửa"
            }
          ];
        } else if (url.indexOf("/fabric-sterilization/detail") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/fabric-sterilization",
              name: "Quản lý thanh trùng đồ vải"
            },
            {
              name: "Chi tiết thanh trùng đồ vải"
            }
          ];
        }

        break;
    }
    return obj;
  };

  const breadCrumb = getBreadcrumbs();
  return (
    <ol className="breadcrumb bg-info-400">
      {breadCrumb.map((item, index) => {
        if (index < breadCrumb.length - 1)
          return (
            <li className="breadcrumb-item" key={index}>
              <Link to={item.url || "#"} className="text-white">
                {item.icon && <i className="fal fa-home mr-1"></i>}
                {item.name}
              </Link>
            </li>
          );
        return (
          <li className="breadcrumb-item active text-white" key={index}>
            {item.name}
          </li>
        );
      })}
    </ol>
  );
}
export default index;
