export  default  (state  =  [],  action)  =>  {
    switch  (action.type) {

        case  'SET_ACTIONBAR_CLIENT':
            return  action.actionClientId;

        default:
            return  state;
    }
} 