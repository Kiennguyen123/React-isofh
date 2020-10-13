import React, { useEffect, useState } from "react";
import { Button, Select, Form, Input, Tooltip, Modal, DatePicker, TimePicker } from "antd";
import { connect } from "react-redux";
import actionQuanLyDungCu from "@actions/quan-ly-dung-cu";
import moment from 'moment';
import actionDmDungCu from "@actions/dm-dung-cu"
import DataContants from "@config/data-contants";
import './style.scss'
const { Option } = Select;
const { TextArea } = Input;
function index(props) {

  useEffect(() => {
    props.loadDetail(props.id);
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  const getDate = () => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `Ngày ${date} tháng ${month} năm ${year}`
  }

  const getCurrentDate = () => {
    let newDate = new Date();
    let second = newDate.getSeconds();
    let minite = newDate.getMinutes();
    let hour = newDate.getHours();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${hour}:${minite}:${second} ${date}/${month}/${year}`
  }

  const checkMedical = (item) => {
    let status = props.listDungCu && props.listDungCu.length && props.listDungCu.filter(option => {
      return item === option.id
    })
    if (status && status.length) {
      return status[0]
    } else {
      return []
    }
  }

  return (
    <div className="form-print">
      <div className="form-header">
        <div className="row">
          <div className="col-4">
            <h3 className="text-center">CỤC HẬU CẦN QUÂN KHU I</h3>
            <p className="text-center">Bệnh viện Quân y 110</p>
          </div>
          <div className="col-8"></div>
        </div>
      </div>
      <div className="form-content">
        <h2 className="title text-center">PHIẾU HẸN LẤY DỤNG CỤ Y TẾ ĐÃ TIỆT KHUẨN</h2>
        <div className="content">
          <div className="content-detail">
            <label>Mã số hộp: </label><span>{props.maSoHopDungCu}</span>
          </div>
          <div className="content-detail">
            <label>Khoa bàn giao: </label><span>{props.khoaBanGiao && props.khoaBanGiao.name}</span>
          </div>
          <div className="content-detail">
            <label>Thời gian bàn giao: </label><span>{props.thoiGianBanGiao}</span>
          </div>
          <div className="content-detail">
            <label>Thời gian dự kiến lấy: </label><span>{props.thoiGianTietKhuan}</span>
          </div>
          <div className="content-detail">
            <label>Chi tiết: </label>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Tên dụng cụ y tế</th>
                  <th>Số lượng</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              {
                props.chiTiet && props.chiTiet.length ? props.chiTiet.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{checkMedical(item.dmDungCuId) && checkMedical(item.dmDungCuId).name}</td>
                      <td>{item.soLuong}</td>
                      <td>{item.ghiChu}</td>
                    </tr>
                  )
                }) : null
              }
            </table>
          </div>
        </div>
      </div>
      <div className="form-footer">
        <div className="row">
          <div className="col-6">
            <p style={{ "marginTop": "34px" }} className="text-center">Khoa phẫu thuật</p>
          </div>
          <div className="col-6">
            <p className="text-center get-date">{getDate()}</p>
            <p className="text-center">Người lập</p>
          </div>
        </div>
      </div>
      <div className="sign-print">
        <p>ISOFH - Ngày in: {getCurrentDate()}</p>
      </div>
    </div>
  );
}

export default connect(
  state => {
    return {
      maSoHopDungCu: state.quanLyDungCu.maSoHopDungCu,
      id: state.quanLyDungCu.id,
      chiTiet: state.quanLyDungCu.chiTiet || [],
      khoaBanGiao: state.quanLyDungCu.khoaBanGiao,
      ghiChu: state.quanLyDungCu.ghiChu,
      thoiGianTietKhuan: state.quanLyDungCu.thoiGianTietKhuan && moment(state.quanLyDungCu.thoiGianTietKhuan).format("HH:mm:ss DD/MM/YYYY") || null,
      thoiGianBanGiao: state.quanLyDungCu.thoiGianBanGiao && moment(state.quanLyDungCu.thoiGianBanGiao).format("DD/MM/YYYY") || null,
      listDungCu: state.dmDungcu.dmDungCu || []
    }
  },
  {
    loadDetail: actionQuanLyDungCu.loadDetail,
    loadListDmDungCu: actionDmDungCu.loadList,
  }
)(index)
