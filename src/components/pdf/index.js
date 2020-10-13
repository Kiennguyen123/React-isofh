import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import PropTypes from 'prop-types';
import { getFilePdf } from './utils';
import './style.scss';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const Pdf = ({ pdf, typeUrl }) => {
  const [data, setData] = useState({ numPages: null, pageNumber: 1 });

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    const response = await getFilePdf({ pdf, typeUrl });
    setData({ ...data, pdf: response });
  };

  const onDocumentLoadSuccess = dataPdf => {
    const { numPages } = dataPdf;
    setData({ ...data, numPages });
  };

  const myPdf = (
    <Document file={data.pdf} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(data.numPages), (el, index) => (
        <Page size="A4" key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  );
  return (
    <div>{data.pdf && myPdf}</div>
  );
};

Pdf.propTypes = {
  pdf: PropTypes.string.isRequired,
  typeUrl: PropTypes.number,
};

Pdf.defaultProps = {
  typeUrl: 0,
};

export default Pdf;
