import {ADD_SCHEDULE_TASK, SET_SCHEDULETASK_CLIENTS,
    SET_SCHEDULE_TASK, UPDATE_SCHEDULE_TASK } from "./../../constants/index"


export   function tasks(state = [], action = {} )  {
switch(action.type) {
case SET_SCHEDULE_TASK: 
    return action.tasks
    
default: return state;
}
}

export  function scheduleTaskClients(state = [], action = {} )  {
switch(action.type) {
case SET_SCHEDULETASK_CLIENTS: 
    return action.scheduleTaskClients
    
default: return state;
}
}

export  function newScheduleTask(state = [], action = {} )  {
switch(action.type) {
case ADD_SCHEDULE_TASK: 
    return action.newScheduleTask
    
default: return state;
}
}

export  function updateScheduledTask(state = [], action = {} )  {
switch(action.type) {
case UPDATE_SCHEDULE_TASK: 
    return action.updateScheduledTask
    
default: return state;
}
}