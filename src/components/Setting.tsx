import React, { useEffect, useCallback, useContext } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { PathCompoment } from './Path'
import { ThemeContext } from '../App'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';




const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
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

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;


export const  Setting  = ({ showModal, setShowModal }) => {


    const { theme, themeToggler } = useContext(ThemeContext)

    const animation = useSpring({
        config: {
            duration: 250
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? `translateY(0%)` : `translateY(-100%)`
    });



    const keyPress = useCallback(
        e => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
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
            {showModal ? (
                <Background> 
                    <animated.div style={animation}>
                        <ModalWrapper >
                            <ModalContent>
                                <CloseModalButton
                                    onClick={() => setShowModal(prev => !prev)}
                                    />
                                <PathCompoment />

                                <p>Dark Mode</p>
                                {
                                    theme === 'light' ? <BsToggleOff onClick={themeToggler}></BsToggleOff> : <BsToggleOn onClick={themeToggler}></BsToggleOn>
                                }
                            </ModalContent>
                        </ModalWrapper>
                    </animated.div>
                </Background>
            ) : null}

            </>
    );
}