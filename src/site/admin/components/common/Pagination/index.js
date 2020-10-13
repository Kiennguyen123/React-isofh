import React from 'react'
import './style.scss';
import { Pagination } from 'antd';
function index(props) {
    let className = 'pagination-table ';
    if (props.className)
        className += props.className
    let { page, size, total } = props;
    let current = page * size;
    let current1 = (Number(page) - 1) * size + 1;
    current = Math.min(current, total);
    let totalPage = parseInt(total / size);
    if (totalPage * size < total)
        totalPage += 1;
    if (page > totalPage) {
        page = totalPage;
    }
    if (page <= 0)
        page = 1;
    const onClick = (type) => () => {
        if (props.onPageChange) {
            props.onPageChange(type)
        }
    }
    return (
        <div className={className}>
            <label className='label'> {
                total > 0 ? `${current1} - ${current} trong ${total}` : ''
            } </label>
            <span onClick={onClick(1)} className={'btn-pre ' + (Number(page) === 1 ? " not-allowed" : "")}>Trang đầu</span>
            <Pagination simple onChange={props.onPageChange} pageSize={Number(size)} current={Number(page)} total={total} />
            <span onClick={onClick(totalPage)} className={'btn-next ' + (Number(page) === Number(totalPage) ? " not-allowed" : "")}>Trang cuối</span>
        </div>
    )
}
export default index;