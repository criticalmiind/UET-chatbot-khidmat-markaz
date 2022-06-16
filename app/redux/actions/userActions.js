export const mapStateToProps = (state) => {
    let store = state.userReducer;
    return {
    }
};

export const mapDispatchToProps = (dispatch) => {
    return {
        updateRedux: (obj)=>{
            dispatch({ type:'update_redux', payload:obj })
        },
    }
}
