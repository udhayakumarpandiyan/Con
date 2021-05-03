import Notify from 'simple-notify'
import 'simple-notify/dist/simple-notify.min.css'

export function successToast(message) {
    new Notify({
        status: 'success',
        title: 'Success',
        text: message,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
    })
    return function (dispatch) {
        dispatch({
            type: 'SUCCESS_TOAST',
            success: true,
            message
        });
    };
}


export function infoToast(message) {
    new Notify({
        status: 'warning',
        title: 'Info',
        text: message,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
    });
    return function (dispatch) {
        dispatch({
            type: 'INFO_TOAST',
            success: true,
            message
        });
    }
}

export function failureToast(message) {
    new Notify({
        status: 'error',
        title: 'Error',
        text: message,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
    });
    return function (dispatch) {
        dispatch({
            type: 'FAILURE_TOAST',
            success: false,
            message
        });
    };
}
