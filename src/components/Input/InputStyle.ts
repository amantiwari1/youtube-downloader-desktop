import styled from "styled-components";
import { Col, Row } from "react-bootstrap";

const TextArea = styled.textarea`
  font-size: 13px;
  resize: none;
  text-align: center;
  border: none;
  border-radius: 10px;
  width: 100%;
  &:hover,
  &:focus {
    outline: none;
  }

  &::placeholder {
    font-size: 20px;
    text-align: center;
  }
  margin: 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  transition: 0.3s;
  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
  }

  &::-webkit-scrollbar {
    width: 15px;
  }
  &::-webkit-scrollbar-track {
    background: #1d3557;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e76f51;
    border-radius: 14px;
    border: 3px solid #1d3557;
  }
`;
const Add = styled.button`
  width: 100%;
  width: 100%;
  height: 60px;
  border-radius: 40px;
  color: #ffffff;
  background-color: #000;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 40%);
  transition: 0.3s;
  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
  }
  border: none;
  margin-left: 7px;
`;

const Colu = styled(Col)`
  padding: 1px;
  z-index: 0;
`;

const Rowu = styled(Row)`
  margin: 0;
`;
export { TextArea, Add, Colu, Rowu };
