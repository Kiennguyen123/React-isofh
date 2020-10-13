module.exports = {
  key: {
    SUMARY_BY_MONTH: "SUMARY_BY_MONTH",
    SUMARY_BY_YEAR: "SUMARY_BY_YEAR"
  },
  text: {
    internal_server_error: "Xảy ra lỗi, vui lòng thử lại sau",
    user: {
      success_login: "Đăng nhập thành công",
      login_error: "Đăng nhập không thành công"
    }
  },
  api: {
    airPollutionIncidents: "/api/infection-prevention/v1/air-pollution-incidents",
    departments: "/api/infection-prevention/v1/departments",
    sanitationProcessTemplates: "/api/infection-prevention/v1/sanitation-process-templates",
    sanitationProcesses: "/api/infection-prevention/v1/sanitation-processes",
    environmentalTests: '/api/infection-prevention/v1/environmental-tests',
    mdEnvironmentalTests: '/api/infection-prevention/v1/md-environmental-tests',
    specimenTypes: '/api/infection-prevention/v1/specimen-types',
    infectionPatients: '/api/infection-prevention/v1/infection-patients',
    patientHistories: '/api/patient/v1/patient-histories',
    infectiousDiseases: '/api/infection-prevention/v1/infectious-diseases',
    infectionTypes: '/api/infection-prevention/v1/infection-types',
    dmDungCu: '/api/infection-prevention/v1/dm-dung-cu',
    dmMauDungCu:'/api/infection-prevention/v1/dm-mau-dung-cu',
    quanLyDungCu: '/api/infection-prevention/v1/quan-ly-dung-cu',
    quanLyDoVai: '/api/infection-prevention/v1/quan-ly-do-vai',
    categoryIncidents: '/api/infection-prevention/v1/category-incidents',
    user: {
      login: "/api/infection-prevention/v1/auth/sso-login",
      user: '/api/infection-prevention/v1/users'
    },
  }
};
