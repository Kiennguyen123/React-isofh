import constants from '@strings'
import clientUtils from '@utils/client-utils';
import dataCacheProvider from '@data-access/datacache-provider';
const reducer = (state = {}, action) => {
	let newState = { ...state }
	switch (action.type) {
		case 'AUTH-UPDATE-DATA':
			// clientUtils.auth = ((action.data || {}).access_token || "")
			clientUtils.auth = action.data && action.data.auth && action.data.auth.access_token
			newState.auth = action.data && action.data.auth;
			if (clientUtils.auth) {
				clientUtils.auth = "Bearer " + clientUtils.auth;
			}
			return newState;
		case 'persist/REHYDRATE':
			if (action.payload && action.payload.auth && Object.keys(action.payload.auth).length) {
				clientUtils.auth = action.payload.auth && action.payload.auth.auth.access_token;
			}
			if (clientUtils.auth) {
				clientUtils.auth = "Bearer " + clientUtils.auth;
				dataCacheProvider.save('', "DATA-UPDATE-DATA", action.payload.auth)
			}
		default:
			return state
	}

}
export default reducer
