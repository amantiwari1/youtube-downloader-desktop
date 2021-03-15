import React, { useEffect, useCallback, useContext } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { PathCompoment } from './Path'
import { ThemeContext } from '../App'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import {  Col, Row } from "react-bootstrap";


const Colu = styled(Col)`

    

`

const Rowu = styled(Row)`
  margin: 0;
`



const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;

  margin-left: -15px;
`;

const ModalWrapper = styled.div`
    width: 100%;
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  position: relative;   
  z-index: 10;
`;

const ModalContent = styled.div`  
  color: ${props => props.theme.textColor};
`;

const CloseModalButton = styled(IoMdArrowRoundBack)`
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;


export const Setting = () => {


    const { state, dispatch } = useContext(ThemeContext)

    const animation = useSpring({
        config: {
            duration: 250
        },
        opacity: state.showModal ? 1 : 0,
        transform: state.showModal ? `translateX(0%)` : `translateX(-100%)`
    });



    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && state.showModal) {
                dispatch({type: 'showModalFalse'})
            }
        },
        [dispatch, state.showModal]
    );

    useEffect(
        () => {
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
    );


    return (
        <>

            {
                state.showModal ? (
                    <Background>
                        <animated.div style={animation}>
                            <ModalWrapper >
                                <ModalContent>
                                    <Rowu>

                                        <Colu xs={12}>
                                            <CloseModalButton onClick={() => dispatch({type: 'showModal'})} />
                                        </Colu>

                                        <Colu xs={12}>
                                            <PathCompoment />
                                        </Colu>

                                        <Colu xs={4}>
                                            <p>Dark Mode</p>
                                        </Colu>

                                        <Colu xs={8}>
                                            {
                                                state.theme === 'light' ? <BsToggleOff onClick={() => dispatch({type:'theme'}) }></BsToggleOff> : <BsToggleOn onClick={() => dispatch({type:'theme'})}></BsToggleOn>
                                            }
                                        </Colu>
                                        
                                    </Rowu>
                                </ModalContent>
                            </ModalWrapper>
                        </animated.div>
                    </Background >
                ) : null}
        </>

    );
}