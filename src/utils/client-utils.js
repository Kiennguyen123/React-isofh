import axios from 'axios';

const getServerUrl = () => {
  const domain = window.location.origin;
  switch (domain) {
    case 'http://10.0.0.94:2146': // test 110
      return 'https://110.api.emr.test.isofh.vn';
    case 'http://localhost:3000': // dev
      return 'https://110.api.emr.test.isofh.vn';
    case 'http://192.168.2.233:2396': // production
      return 'http://192.168.2.233:2301';
    case 'http://10.110.102.67:2396': // daotao
      return 'http://10.110.102.67:2301';
    case 'http://cnk.benhvien110.vn': // production domain
      return 'http://api.cnk.benhvien110.vn';
    case 'http://mescohn.vn:9667': // mescohn
      return 'http://api.mescohn.vn:9666';
    case 'http://10.110.102.11:2396': // 
      return 'http://10.110.102.11:2301'
    default:
      return 'https://110.api.emr.test.isofh.vn';
  }
}
const server_url = getServerUrl();
String.prototype.absoluteUrl = String.prototype.absolute || function (defaultValue) {
  var _this = this.toString();
  if (_this == "")
    if (defaultValue != undefined)
      return defaultValue;
    else
      return _this;
  if (_this.startsWith("http") || _this.startsWith("blob")) {
    return _this;
  }
  if (_this.endsWith(".jpg") || _this.endsWith(".png") || _this.endsWith(".JPG") || _this.endsWith(".PNG") || _this.endsWith(".gif")) {
    return (_this + "").resolveResource();
  }
  if (!_this.endsWith(".jpg") || !_this.endsWith(".png") || _this.endsWith(".JPG") || _this.endsWith(".PNG") || !_this.endsWith(".gif")) {
    return defaultValue;
  }
  if (_this.startsWith("jira.isofh.com.vn"))
    return "htts://" + _this + "";
  return server_url + _this + ""
}

String.prototype.absoluteFileUrl = String.prototype.absoluteFileUrl || function (defaultValue) {
  var _this = this.toString();
  if (_this == "")
    if (defaultValue != undefined)
      return defaultValue;
    else
      return _this;
  if (_this.startsWith("http") || _this.startsWith("blob")) {
    return _this;
  }
  return server_url + "/view-file/" + _this + ""
}

String.prototype.getServiceUrl = String.prototype.absolute || function (defaultValue) {
  if (this == "")
    if (defaultValue != undefined)
      return defaultValue;
    else
      return this;
  if (this.startsWith("http") || this.startsWith("blob")) {
    return this;
  }
  return server_url + this;
}

export default {
  auth: "",
  serverApi: server_url,
  uploadFile(url, file) {
    const formData = new FormData();
    formData.append('file', file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': this.auth,
      }
    }
    return axios.post(url.getServiceUrl(), formData, config)
  },
  requestApi(methodType, url, body) {
    return new Promise((resolve, reject) => {
      var dataBody = "";
      if (!body)
        body = {};
      dataBody = JSON.stringify(body);
      this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.auth,
        }, dataBody).then(s => {
          s.json().then(val => {
            if (val && val.code == 401) {
              localStorage.clear()
              window.location.href =
                "/dang-xuat?redirect=" +
                decodeURIComponent(
                  window.location.pathname + window.location.search
                );
            }
            resolve(val);
          }).catch(e => { reject(e) });
        }).catch(e => {
          if (e && e.status === 401) {
            localStorage.clear()
            window.location.href =
              "/dang-xuat?redirect=" +
              decodeURIComponent(
                window.location.pathname + window.location.search
              );
          }
          reject(e);
        });
    });
  },
  requestApiFiles(methodType, url, body) {
    return new Promise((resolve, reject) => {
      var dataBody = "";
      if (!body)
        body = {};
      dataBody = JSON.stringify(body);
      this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.auth,
        }, dataBody).then((s) => {
          resolve(s);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  requestFetch(methodType, url, headers, body) {
    return new Promise((resolve, reject) => {
      let fetchParam = {
        method: methodType,
        headers,
      }

      if (methodType.toLowerCase() !== "get") {
        fetchParam.body = body;

      }
      return fetch(url.getServiceUrl(), fetchParam).then((json) => {
        if (!json.ok) {
          reject(json);
        }
        else
          resolve(json);
      }).catch((e) => {
        reject(e);
      });
    })
  },
  requestService(url) {
    return new Promise(function (resolve, reject) {
      axios.get(server_url + url)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        })
    });
  },
}