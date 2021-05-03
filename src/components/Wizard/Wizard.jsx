import { Wizard } from '@patternfly/react-core';
import styled from 'styled-components';

Wizard.displayName = 'PFWizard';
export default styled(Wizard)`
  .pf-c-toolbar__content {
    padding: 0 !important;
  }
  & .pf-c-wizard__header{
    height: 2.87rem;
    background: #593CAB 0% 0% no-repeat padding-box;
    padding: 10px 20px ;

    & .pf-c-wizard__title{    
      font-size: 1rem;
      font-weight: 600;
      color: #FFFFFF;
      text-transform: capitalize;
    }
    & .pf-c-wizard__close{
      top: 0px;
    }
    & button{
      outline: none;
    }

  }  
  & .pf-c-wizard__footer{
    .pf-m-primary{
      width: 7.65rem;
      height: 2.37rem;
      background: #593CAB 0% 0% no-repeat padding-box;
      color: #ffffff;
      border: 0.5px solid #707070;
      border-radius: 5px;
    }
    & .pf-m-secondary{
      width: 7.65rem;
      height: 2.37rem;
      background: #ffffff 0% 0% no-repeat padding-box;
      color: #000000;
      border-radius: 5px;

      --pf-c-button--after--BorderColor: none;
    }
    & .pf-m-link{
      width: 7.65rem;
      height: 2.37rem;
      background: #ffffff 0% 0% no-repeat padding-box;
      color: #000000;
      border: 0.5px solid #707070;
      border-radius: 5px;
    }
  }
`;
