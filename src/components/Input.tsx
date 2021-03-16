import React, { useContext } from 'react'
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

const Colu = styled(Col)`

    padding:1px;
    z-index: 0;

`

const DownloadAll = styled.button`
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
    transition: 0.3s;
    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
    }
    width: 100%;       
    padding: 13px 32px;
    border: none;
    background: #141414;
    color: #fff; 
    font-size: 24px;
    cursor: pointer;  
    margin: 2px;
    border-radius: 20px;

    &:disabled,
    &[disabled] {
        opacity: 0.3;
        cursor: default;  

    }
`

const Rowu = styled(Row)`
    margin: 0;
`
 
const Input = () => {

    const {  AllDetail, SetAllDetail, state, dispatch } = useContext(ThemeContext)

    const isValidVideoParam = (vParam: string): boolean => {
        let videoParamLength = 11;
        return vParam.length === videoParamLength;
    } 

    const isValidListParam = (listParam: string): boolean => {
        return true;
    }

    const All_Download_Video = (Quality: string) => {
        AllDetail.map(async (data: any) => {
            const { Video_url, ext } = data.videoquality[Quality]
            await window.eel.Download_video({ title: data.title, urlvideo: Video_url, url: data.url, path: state.Path, audiourl: data.videoquality['m4a'].Video_url, ext: ext })
                (() => {
                })
            return 0;
        })
    }

    const oneVideo = async (url: string) => {
        if (AllDetail.every((obj: any) => obj.url !== url)) {
            dispatch({type: 'CardLoading', data: true});
            await window.eel.Add_Details(url)((message: any) => {
                if (!message) {
                    dispatch({type: 'Warning', data: url});
                } else {
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
                    dispatch({type: 'Warning', data: url});
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
        dispatch({type: 'emptyWarning'});

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
                    dispatch({type: 'Warning', data: url});
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
                    onChange={(e) => Get_Detail(e.target.value)}
                />
            </Colu>
            <Colu xs={3}>
                <DownloadAll
                    disabled={AllDetail.length === 0} 
                    type="button"
                    onClick={() => All_Download_Video(state.ChangeQuality.quality)}
                >
                    Download
                    </DownloadAll>
            </Colu>
        </Rowu>
    )
}


export { Input }
