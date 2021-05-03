import React from 'react';
import _ from "lodash";
import './modal.css';



export default function Process({ currentStep, steps, setStep = () => { } }) {
    return (<div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0px 60px'
    }}>
        <div style={{ display: 'flex', width: '100%', flexDirection: 'row' }}>{
            steps.map((step, index) => {
                if (index === currentStep) {
                    step.selected = true;
                }
                if ( step.selected && index > currentStep) {
                    step.selected = false;
                }
                return (
                    <div style={{ width: index <= steps.length - 2 ? `${100 / (steps.length - 1)}%` : '', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{
                            width: '24px', height: '22px', borderRadius: '50%',
                            border: `1px solid ${step.selected ? '#4BC6B9' : '#707070'}`,
                            backgroundColor: step.selected ? '#4BC6B9' : '#FFFFFF'
                        }}>
                        </div>
                        {index <= steps.length - 2 && <div style={{ height: '4px', backgroundColor: '#4BC6B9', width: '100%' }} />}
                    </div>
                )
            })
        }
        </div>
        <div style={{ display: 'flex', width: '100%', margin: '10px 0px', flexDirection: 'row' }}>
            {steps.map((step, index) => {
                return <div style={{ width: `${100 / steps.length}%`, textAlign: index === 0 ? 'left' : index === steps.length - 1 ? 'right' : 'center' }}>
                    <label className={`btn btn-link ${(currentStep === index) ? 'current-active-tab' : ''}`} onClick={() => {
                        setStep(index);
                    }}>{step.name}</label>
                </div>
            })
            }
        </div>
    </div>)
}