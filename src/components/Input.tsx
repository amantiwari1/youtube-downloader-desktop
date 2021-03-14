import React, { useContext } from 'react'
import { ThemeContext } from "../App";
import styled from 'styled-components';
import { Col, Row } from "react-bootstrap";

const TextArea = styled.textarea`
    border: none;
    border-radius: 4px;
    width: 100%;       
    &:hover,
    &:focus {
    outline: none;
    }

    &::placeholder {
    font-size: 20px;
    }
    margin: 2px;


`

const Colu = styled(Col)`

    padding:1px;
    z-index: 0;

`

const DownloadAll = styled.button`
    width: 100%;       
    padding: 16px 32px;
    border-radius: 4px;
    border: none;
    background: #141414;
    color: #fff;
    font-size: 24px;
    cursor: pointer;  
    margin: 2px;
`

const Rowu = styled(Row)`
    margin: 0;
`

const Input = () => {

    const { ChangeQuality, setIsError, SetWaning, AllDetail, SetAllDetail, setCardLoading, setPlayListLoading, Path } = useContext(ThemeContext)

    const All_Download_Video = (Quality: string) => {


        AllDetail.map(async (data: any) => {
            const { Video_url, ext } = data.videoquality[Quality]
            await window.eel.Download_video({ title: data.title, urlvideo: Video_url, url: data.url, path: Path, audiourl: data.videoquality['m4a'].Video_url, ext: ext })
                (() => {

                })
            return 0;
        })
    }


    const Get_Detail = async (textarea: String) => {
        setIsError(false)
        let oneVideoUrl = (
            /^https:\/\/www\.youtube\.com\/watch\?v=\S{11}\s*$/
        )
        let playlistUrl = (
            /^https:\/\/www\.youtube\.com\/playlist\?list=\S{34}\s*$/
        )
        let playlistUrlWithTheFirstVideoSpecified = (
            /^https:\/\/www\.youtube\.com\/watch\?v=\S{11}&list=\S{34}\s*$/
        )
        SetAllDetail({ type: 'empty' });
        SetWaning([]);

        if (textarea === "") {
            return 0;
        }

        const AllUrl = textarea.split('\n');

        // this function come from python line 17 in main.py 
        // then call this function then it will run in python
        // after it will get all details of youtube a video 
        // through 'message'  and all details stored value to AllDetails 
        // split mean 2 url in textarea into ["url", "url"]

        for (let url of AllUrl) {
            let isOneVideoUrl = oneVideoUrl.test(url);
            let isPlaylistUrl = (
                playlistUrl.test(url) ||
                playlistUrlWithTheFirstVideoSpecified.test(url)
            );

            if (url !== "") {

                // one video url  
                if (isOneVideoUrl) {
                    if (AllDetail.every((obj: any) => obj.url !== url)) {
                        setCardLoading(true)
                        await window.eel.Add_Details(url)((message: any) => {

                            if (message !== true) {
                                SetAllDetail({ message, type: 'add' });
                            }
                            setCardLoading(false)
                        })
                    }

                // playlist url
                } else if (isPlaylistUrl) {
                    setPlayListLoading(true)
                    await window.eel.Get_Data_Details_Playlists(url)((data: Array<any>) => {

                        data.map((message: any) => {
                            if (message !== true) {
                                SetAllDetail({ message, type: 'add' });
                            }
                            return 0;
                        })
                        setPlayListLoading(false)
                    })
                }

                // Url is wrong
                else {
                    SetWaning((arr: any) => [...arr, url]);
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
                        onClick={() => All_Download_Video(ChangeQuality.quality)}
                    >
                        Download
                    </DownloadAll>
                </Colu>
            </Rowu>
    )
}


export { Input }
