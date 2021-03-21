import React, { useContext , useEffect} from 'react'
import { ThemeContext } from "../App";
import styled from 'styled-components';
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


`

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

`

const Colu = styled(Col)`

    padding:1px;
    z-index: 0;

`



const Rowu = styled(Row)`
    margin: 0;
`
 
const Input = () => {

    const {SetAllDetail, state, dispatch} = useContext(ThemeContext)

    useEffect(() => {
        if (state.is_not_connected) {
            dispatch({type: 'isError', data: {isError: true, text: 'Please check your internet and try again'}});
        }
    }, [state.is_not_connected, dispatch])

    const isValidVideoParam = (vParam: string): boolean => {
        let videoParamLength = 11;
        return vParam.length === videoParamLength;
    } 

    const isValidListParam = (listParam: string): boolean => {
        return true;
    }

    const catchDetailsError = () => {
        if (state.is_not_connected) {
            dispatch({type: 'isError', data: {isError: true, text: 'Please check your internet and try again'}});
        } else {
            dispatch({type: 'isError', data: {isError: true, text: 'Please enter a valid YouTube URL'}});
        }
    }

    const handlerBackendMessage = message => {
        if (!message) {
            catchDetailsError();
        } else {
            let urlAlreadyExist = state.UrlExist.includes(message.url);
            if (urlAlreadyExist) {
                dispatch({type: 'isError', data: {isError: true, text: 'Warning: this url has been added'}});
            } else {
                SetAllDetail({type: 'add', message});
            }  
        }
    }

    const oneVideo = async (url: string) => {
            dispatch({type: 'CardLoading', data: true});
            await window.eel.Add_Details(url)((message: any) => {
                if (!message) {
                    if (state.is_not_connected) {
                        dispatch({type: 'isError', data: {isError: true, text: 'Please check your internet and try again'}});
                    } else {
                        dispatch({type: 'isError', data: {isError: true, text: 'Please enter a valid YouTube URL'}});
                    }
                }                   
                dispatch({type: 'CardLoading', data: false});

            })
    }


    const onePlaylist = async (url: string) => {
        dispatch({type: 'PlayListLoading', data: true});
        await window.eel.Get_Data_Details_Playlists(url)((data: Array<any>) => {
            if (data.length === 0) {
                if (state.is_not_connected) {
                    dispatch({type: 'isError', data: {isError: true, text: 'Please check your internet and try again'}});
                } else {
                    dispatch({type: 'isError', data: {isError: true, text: 'Please enter a valid YouTube URL'}});
                }
            } else {
                data.forEach((message: any) => {
                    if (message) {
                        if (state.UrlExist.includes(message.url)) {
                            dispatch({type: 'isError', data: {isError: true, text: 'Warning: this url has been added'}});
                        } 
                    }
                })
            }
            dispatch({type: 'PlayListLoading', data: false});
        })
    }


    const Get_Detail = async (textarea: String) => {
        let url;
        let isOneVideoUrl;
        let isPlaylistUrl;
        let urlParams;
        let isValidLinkPattern = /^https:\/\/www\.youtube\.com\/(watch|playlist)\?/;
        dispatch({ data: false, type: 'isError' });

        if (textarea === "") {
            return 0;
        }

        const AllUrl = textarea.split('\n');


        for await (url of AllUrl) {

            let removeSpaceUrl  = url.split(" ").join("");
            isOneVideoUrl = false;
            isPlaylistUrl = false;
            if (isValidLinkPattern.test(removeSpaceUrl)) {
                urlParams = (new URL(removeSpaceUrl)).searchParams;
                if (urlParams.has('list')) {
                    isPlaylistUrl = isValidListParam(urlParams.get('list'));
                } else if (urlParams.has('v')) {
                    isOneVideoUrl = isValidVideoParam(urlParams.get('v'));
                }
            }

            if (removeSpaceUrl !== "") {
                // one video url  
                if (isOneVideoUrl) {
                    console.log(state.UrlExist);
                    
                    if (state.UrlExist.includes(removeSpaceUrl)) {
                        dispatch({type: 'isError', data: {isError: true, text: 'Warning: this url has been added'}});
                    } else {
                        oneVideo(removeSpaceUrl);
                    }
                }
                // playlist url
                else if (isPlaylistUrl) {
                    if (state.UrlExist.includes(removeSpaceUrl)) {
                        dispatch({type: 'isError', data: {isError: true, text: 'Warning: this playlist url has been added'}});
                    } else {
                        dispatch({ data: removeSpaceUrl, type: 'addUrlExist' });
                        onePlaylist(removeSpaceUrl);
                    }
                }
                // Url is wrong
                else {
                    dispatch({type: 'isError', data: {isError: true, text: 'Please enter a valid YouTube URL'}});
                }
            }
        }
        return 0;
    }


    return (
        <Rowu>
            <Colu xs={9} >
                <TextArea
                    placeholder="Enter multiple url youtube video"
                    rows={3}
                    onChange={() => {
                        dispatch({type: 'isError', data: {isError: false, text: ''}});
                    }}
                />
            </Colu>
            <Colu xs={3}>
                <Add
                    type="button"
                    onClick={() => {
                        let textarea = document.querySelector('textarea')
                        if (textarea) {
                            Get_Detail(textarea.value)
                            textarea.value = ''
                        }
                    }}
                >
                    Add
                </Add>
            </Colu>
        </Rowu>
    )
}


export { Input }
