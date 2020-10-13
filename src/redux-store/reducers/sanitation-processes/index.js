const reducer = (state = {}, action) => {
	let newState = { ...state }
	switch (action.type) {
		case 'SANITATION-PROCESSES-UPDATE-DATA':
			newState = { ...state, ...action.data || {} }
			return newState;
		default:
			return state
	}

}
export default reducer
