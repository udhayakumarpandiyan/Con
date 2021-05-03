import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';
import ComponentHeader from '../../resources/DashboardHeader';
import { failureToast } from '../../../actions/commons/toaster';
import { generateToken } from '../../../actions/commons/commonActions';
import Loader from '../../resources/Loader';


function GroupPermissions() {

    return (
        <>
            <ComponentHeader
                dashboardText={[{ name: 'Admin', className: "component-head-text " }]}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Map/UnMap Features To Groups', path: '' }]}
            />
            {/* < Loader loading={loading} /> */}

        </>
    )
}

export default GroupPermissions;
