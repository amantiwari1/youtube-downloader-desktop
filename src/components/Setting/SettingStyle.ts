import {  Col, Row } from "react-bootstrap";
import { IoMdArrowRoundBack } from 'react-icons/io';
import styled from 'styled-components';
import tw from "twin.macro"


export const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  padding: 10px;
  ${tw`bg-lightmode dark:(bg-darkmode)`}
`;

export const ModalWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;   
  z-index: 10;
  ${tw`mx-auto max-w-2xl pt-3`}
`;


export const CloseModalButton = styled(IoMdArrowRoundBack)`
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

