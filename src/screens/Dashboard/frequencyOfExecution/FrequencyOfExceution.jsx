import React, { useState } from 'react';
import CollapsibleSection from '../../../components/CollapsibleSection/CollapsibleSection';
import {
    Chart, ChartAxis, ChartBar,
    ChartGroup, ChartThemeColor, ChartVoronoiContainer
} from '@patternfly/react-charts';
import { DatePicker as PFDatePicker, DropdownItem as PFDropDownItem } from '@patternfly/react-core';
import DropdownSelect from '../../../components/DropdownSelect';
import styled from 'styled-components';

const DropdownItem = styled(PFDropDownItem)`

`;

const DatePicker = styled(PFDatePicker)`
& input{
    border: 0.5px solid #707070;
    outline: none;
}
& button{
    outline: none;
    &:after{
    border-left: none;
    --pf-c-button--after--BorderColor: #707070;
    }

    & svg{
        color:#593CAB;
    }
}

`;

const Container = styled.div`
   display: flex;
   align-items: flex-start;
   width: 100%;
   padding: 20px 10px 10px 10px;
`;

const LeftContainer = styled.div`
width: 25%;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
padding-left: 20px;
& .pf-c-dropdown{
    border-bottom-color: transparent !important;
    & .pf-c-dropdown__toggle{
        width: 192px !important;
    }
}
& .dropdown{
    width: 192px !important;
    & .pf-c-dropdown__toggle{
        width: 192px !important;
        height: 35px;
    }
}
`;

const InnerContainer = styled.div`
display: flex;
flex-direction: column;
padding: 10px 0px;
`;

const ChartContainer = styled.div`
width: 80%;
height: 300px;
& svg{
    & g{
        & text[id^="chart-axis-0"]{
    position: absolute;
    top: 10px;
    transform-box: fill-box;
    ${props => props.length > 5 && 'transform-origin: 125px 40px'};
    ${props => props.length > 5 && 'margin-top: 67px'};
    ${props => props.length > 5 && 'transform: rotate(332deg)'};
}
}
}
`;


const dropdownItems = [
    <DropdownItem key="24hours" className="dropdown-item dropdown-item-hover">
        Past 24 hours
    </DropdownItem>,
    <DropdownItem key="week" className="dropdown-item dropdown-item-hover">
        Past Week
    </DropdownItem>,
    <DropdownItem key="month" className="dropdown-item dropdown-item-hover">
        Past Month
    </DropdownItem>
];


const dateFormat = date => date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
const dateParse = date => {
    if (date) {
        const split = date.split('/');
        if (split.length !== 3) {
            return new Date();
        }
        let month = split[0];
        let day = split[1];
        let year = split[2];
        return new Date(`${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
    }
    return '';
};
const cloneObject = (inObject) => {
    let outObject, value, key
    if (typeof inObject !== "object" || inObject === null) {
        return inObject;
    }
    outObject = Array.isArray(inObject) ? [] : {}
    for (key in inObject) {
        value = inObject[key]

        outObject[key] = cloneObject(value)
    }
    return outObject
}

export default function FrequencyOfExecution({ templates, jobs }) {
    let templateJobs = cloneObject(jobs);
    const [filteredJobs, setFilteredJobs] = useState(templateJobs);
    const [selectedPeriod, setSelectedPeriod] = useState("Select");
    let startDate = new Date();
    let endDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);

    let startTime = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`
    let endTime = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;

    const [jobsEndTime, setJobEndTime] = useState(endTime);
    const [jobsStartTime, setJobStartTime] = useState(startTime);

    templateJobs = filteredJobs.length > 0 ? filteredJobs : templateJobs;
    if (templates && templateJobs) {
        templates.forEach((template) => {
            let failedJobs = 0;
            let totalJobs = 0;
            templateJobs.forEach((job) => {
                if (template.id === job.job_template) {
                    failedJobs = job.failed ? failedJobs + 1 : failedJobs;
                    totalJobs++;
                }
            })
            template.totalJobs = totalJobs;
            template.failedJobs = failedJobs;
        })
    }

    templates = templates.filter((template, index) => template.totalJobs > 0);

    const onStartDateChange = (selected) => {
        setSelectedPeriod("Select");
        let selectedDate = new Date(selected);
        let filtered = [];
        let endedTime = new Date(jobsEndTime).getTime();
        let startedTime;
        jobs.forEach(job => {
            startedTime = new Date(job.finished).getTime();
            if (selectedDate.getTime() < startedTime && selectedDate.getTime() < endedTime) {
                filtered.push(job);
            }
        });
        setFilteredJobs(filtered);
        setJobStartTime(`${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`);


    }

    const onEndDateChange = (selected) => {
        setSelectedPeriod("Select");
        let selectedDate = new Date(selected);
        let filtered = [];
        let startedTime = new Date(jobsStartTime).getTime();
        let endedTime;
        jobs.forEach(job => {
            endedTime = new Date(job.finished).getTime();
            if (selectedDate.getTime() > endedTime && selectedDate.getTime() > startedTime) {
                filtered.push(job);
            }
        });
        setFilteredJobs(filtered);
        setJobEndTime(`${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`);

    }

    const onPeriodChange = (selected) => {
        setSelectedPeriod(selected);
        let currentTime = new Date();
        let startTime;
        let timeDifference;
        let days;
        templateJobs = [];
        jobs.forEach(job => {
            startTime = new Date(job.finished);
            timeDifference = (currentTime - startTime) / 1000;
            days = (timeDifference > 86400) ? Math.floor(timeDifference / 86400) : 1;

            switch (selected) {
                case "Past 24 hours":
                    {
                        if (days <= 1) {
                            templateJobs.push(job);
                        }
                        break;
                    }
                case "Past Week":
                    {
                        if (days <= 7) {
                            templateJobs.push(job);
                        }
                        break;
                    }
                case "Past Month":
                    {
                        if (days <= 30) {
                            templateJobs.push(job);
                        }
                        break;
                    }
                default: {
                    break;
                }
            }
            setFilteredJobs(templateJobs);
        });

    }
    return (
        <CollapsibleSection id="frequency-container"
            style={{ width: "100%" }}
            label="Frequency of Execution"
            startExpanded={true}>
            <Container>
                <LeftContainer>
                    <InnerContainer>
                        <div>
                            <label className="required">*</label>
                            <label className="label"> Start Date</label>
                        </div>
                        <DatePicker
                            value={jobsStartTime}
                            placeholder="MM/dd/yyyy"
                            dateFormat={dateFormat}
                            dateParse={dateParse}
                            onChange={onStartDateChange}
                        />
                    </InnerContainer>

                    <InnerContainer>
                        <div>
                            <label className="required">*</label>
                            <label className="label"> End Date</label>
                        </div>
                        <DatePicker
                            value={jobsEndTime}
                            placeholder="MM/dd/yyyy"
                            dateFormat={dateFormat}
                            dateParse={dateParse}
                            onChange={onEndDateChange}
                        />
                    </InnerContainer>
                    <InnerContainer id="execution-frequency">
                        <label className="label">Period</label>
                        <DropdownSelect id="frequency" style={{ width: "200px" }}
                            dropdownItems={dropdownItems}
                            value={selectedPeriod}
                            onSelect={onPeriodChange} />
                    </InnerContainer>
                </LeftContainer>

                <ChartContainer length={templates.length}>
                    <Chart
                        ariaDesc="Frequency of Execution of Jobs"
                        ariaTitle="Frequency of Execution"
                        containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
                        domainPadding={{ x: [50, 50] }}
                        height={350}
                        padding={{
                            bottom: templates.length > 5 ? 100 : 50,
                            left: 50,
                            right: 50, // Adjusted to accommodate legend
                            top: 20
                        }}
                        themeColor={ChartThemeColor.multiUnordered}
                        width={800}
                    >
                        <ChartAxis />
                        <ChartAxis dependentAxis showGrid />
                        <ChartGroup offset={20} colorScale={["#377BB8", "#ed7d31", "#CCCCCC"]}>
                            {/* style={{ data: { fill: "#ed7d31" } }} */}
                            <ChartBar
                                barWidth={18} data={templates && templates.map(template => {
                                    return ({
                                        name: 'Total Jobs', x: template.name, y: template.totalJobs
                                    });
                                })
                                }
                            />
                            <ChartBar
                                barWidth={18} data={templates.map(template => {
                                    return ({
                                        name: 'Success', x: template.name, y: template.totalJobs - template.failedJobs
                                    });
                                })
                                }
                            />
                            <ChartBar barWidth={18}
                                data={templates.map(template => {
                                    return ({
                                        name: 'Failure', x: template.name, y: template.failedJobs
                                    });
                                })
                                }
                            />
                        </ChartGroup>
                    </Chart>

                </ChartContainer>
            </Container>
        </CollapsibleSection>
    )
}
