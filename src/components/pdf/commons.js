import clientUtils from '../../utils/client-utils';
export default {
  getPdf(typeUrl, pdf) {
    let url = clientUtils.serverApi;

    return clientUtils.requestApiFiles("get", `${url}files/${pdf}`, {});
  },
};
