export const mapStateToProps = (state) => {
    let store = state.userReducer;
    return {
        ...store
        // "userData": store.userData,
    }
};

export const mapDispatchToProps = (dispatch) => {
    return {
        updateRedux: (obj)=>{
            dispatch({ type:'update_redux', payload:obj })
        },
    }
}
