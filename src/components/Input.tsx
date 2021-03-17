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

    const {  AllDetail, SetAllDetail, state, dispatch } = useContext(ThemeContext)

    useEffect(() => {
        if (state.is_not_connected) {
            dispatch({type: 'isError', data: {isError: true, text: 'Please check your internet and try again'}});
        }
       
    }, [state.is_not_connected, dispatch])

    // useEffect(() => {
    //     setUrl(Url)
    // })
    const isValidVideoParam = (vParam: string): boolean => {
        let videoParamLength = 11;
        return vParam.length === videoParamLength;
    } 

    const isValidListParam = (listParam: string): boolean => {
        return true;
    }

   

    const oneVideo = async (url: string) => {
        if (AllDetail.every((obj: any) => obj.url !== url)) {
            dispatch({type: 'CardLoading', data: true});
            await window.eel.Add_Details(url)((message: any) => {
                if (!message) {
                    if (state.is_not_connected) {
                        dispatch({type: 'isError', data: {isError: true, text: 'Please check your internet and try again'}});
                    } else {
                        dispatch({type: 'isError', data: {isError: true, text: 'Please enter a valid YouTube URL'}});
                    }
                }                   
                else {
                    SetAllDetail({ message, type: 'add' });
                }
                dispatch({type: 'CardLoading', data: false});

            })
        }
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
                        SetAllDetail({ message, type: 'add' });
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
        SetAllDetail({ type: 'empty' });

        if (textarea === "") {
            return 0;
        }

        const AllUrl = textarea.split('\n');


        for await (url of AllUrl) {
            isOneVideoUrl = false;
            isPlaylistUrl = false;
            if (isValidLinkPattern.test(url)) {
                urlParams = (new URL(url)).searchParams;
                if (urlParams.has('list')) {
                    isPlaylistUrl = isValidListParam(urlParams.get('list'));
                } else if (urlParams.has('v')) {
                    isOneVideoUrl = isValidVideoParam(urlParams.get('v'));
                }
            }

            if (url !== "") {
                // one video url  
                if (isOneVideoUrl) {
                    oneVideo(url);
                }
                // playlist url
                else if (isPlaylistUrl) {
                    onePlaylist(url);
                }
                // Url is wrong
                else {
                    dispatch({type: 'isError', data: {isError: true, text: 'Please enter a valid YouTube URL'}});
                }
            }
        }
        return false;
    }


    return (
        <Rowu>
            <Colu xs={9} >
                <TextArea
                    placeholder="Enter multiple url youtube video"
                    rows={3}
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
