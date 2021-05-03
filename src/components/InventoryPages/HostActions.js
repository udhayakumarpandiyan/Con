import React from 'react';

function HostActions(props) {
    const { buttonsList } = props;

    return (
        <>
            <div className='hots-actions'>
                <div>

                </div>
                <div className='flex-content'>
                    {
                        Array.isArray(buttonsList) && buttonsList.map((button, index) =>
                            <React.Fragment key={index}> {button}</React.Fragment>)
                    }
                </div>
            </div>
        </>
    )
}

export { HostActions }