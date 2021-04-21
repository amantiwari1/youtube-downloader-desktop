import React, { useEffect, useCallback, useContext } from 'react';
import { useSpring, animated } from 'react-spring';
import { PathCompoment } from '../Path/Path'
import { ThemeContext } from '../../App'
import { Background, ModalWrapper, CloseModalButton } from './SettingStyle'
import Toggle from '../../themes/themeToggle';
import tw from "twin.macro"

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
                dispatch({ type: 'showModalFalse' })
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
                                    <div tw="flex flex-col space-y-4 space-x-4" >
                                        <CloseModalButton onClick={() => dispatch({ type: 'showModal' })} />
                                        <PathCompoment />
                                        <div tw="flex space-x-10 items-center" >
                                            <p>Dark Mode</p>
                                            <Toggle />
                                        </div>
                                    </div>
                            </ModalWrapper>
                        </animated.div>
                    </Background >
                ) : null}
        </>

    );
}