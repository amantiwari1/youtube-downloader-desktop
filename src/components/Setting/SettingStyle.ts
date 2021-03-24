import {  Col, Row } from "react-bootstrap";
import { IoMdArrowRoundBack } from 'react-icons/io';
import styled from 'styled-components';

export const Colu = styled(Col)`

    

`

export const Rowu = styled(Row)`
  margin: 0;
`



export const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;

  margin-left: -15px;
`;

export const ModalWrapper = styled.div`
    width: 100%;
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  position: relative;   
  z-index: 10;
`;

export const ModalContent = styled.div`  
  color: ${props => props.theme.textColor};
`;

export const CloseModalButton = styled(IoMdArrowRoundBack)`
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

