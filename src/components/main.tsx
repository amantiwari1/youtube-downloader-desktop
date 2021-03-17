import React, { useContext } from 'react';
import { Card } from './Card';
import { Input } from "./Input"
import { ThemeContext } from "../App";
import { Col, Row } from "react-bootstrap";
import styled from 'styled-components';


const DownloadAll = styled.button`
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
    transition: 0.3s;
    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
    }
    width: 100%;       
    border: none;
    background: #141414;
    color: #fff; 
    font-size: 16px;
    cursor: pointer;  
    margin: 2px;
    border-radius: 20px;

    &:disabled,
    &[disabled] {
        opacity: 0.3;
        cursor: default;  

    }
`


const Main = () => {

    const {
        AllDetail,
        SetAllDetail,
        state,
        dispatch
    } = useContext(ThemeContext)


    React.useEffect(() => {
        window.eel.Get_Path_Folder()((getpath: string) => {
            dispatch({ type: 'setPath', data: getpath })
        })
    }, [dispatch])



    React.useEffect(() => {
        type Dict = { [key: string]: any };
        const totalfilesize: Dict = {}
        var All_Data_Quality: Array<Array<string>> = []
        AllDetail.map((data: any) => {
            All_Data_Quality.push(Object.keys(data.videoquality))
            return 0;
        })
        window.eel.All_Quality_Match(All_Data_Quality)((data: any) => {
            data.map((quality: string) => {

                AllDetail.map((data: any) => {
                    if (!(quality in totalfilesize)) {
                        totalfilesize[quality] = 0
                    }
                    totalfilesize[quality] = totalfilesize[quality] + data.videoquality[quality].filesize
                    return 0;
                })
                return 0;
            })

            dispatch({ type: 'AllListOfQuaility', data: data })
            dispatch({ type: 'ChangeQuality', data: { quality: data[0], totalfilesize: totalfilesize } })

        })
    }, [AllDetail, dispatch])

    function formatBytes(a: any, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }





    const HandnleQuality = (quality: any) => {
        dispatch({ type: 'UpdateQuality', data: quality })
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
    return (
        <Row>
            <Col xs={12} >
                <Input />
            </Col>
            <Col xs={12}>

                <Row>
                    <br />
                    <Col xs={12}>
                        {
                            state.isError.isError && <p>{state.isError.text}</p>
                        }
                    </Col>

                    <Col xs={12}>
                        {
                            state.PlayListLoading && <p>Please wait.. because your link are playlist. it maybe longer time</p>
                        }
                    </Col>

                    <Col xs={12}>
                        {
                            state.AllListOfQuaility.length > 0 &&
                            <Row>

                                <Col xs={3}>
                                    <label>Overall FileSize : </label>
                                </Col>

                                <Col xs={2}>

                                    <p>{formatBytes(state.ChangeQuality.totalfilesize[state.ChangeQuality.quality])}</p>
                                </Col>

                                <Col xs={3}>

                                    <label>Overall Quality : </label>
                                </Col>

                                <Col xs={2}>

                                    <select value={state.ChangeQuality.quality} onChange={e => HandnleQuality(e.target.value)}>
                                        {
                                            state.AllListOfQuaility.map((quality: string) => (
                                                <option key={quality} >{quality}</option>
                                            ))
                                        }
                                    </select>
                                </Col>
                                <Col xs={2}>
                                    <DownloadAll
                                        disabled={AllDetail.length === 0}
                                        type="button"
                                        onClick={() => All_Download_Video(state.ChangeQuality.quality)}>
                                        Download
                                        </DownloadAll>

                                </Col>

                            </Row>
                        }
                    </Col>
                </Row>
            </Col>

            <Col xs={12}>
                <>
                    {
                        AllDetail.map((data: any) => (
                            <Card key={data.title} handleRemoveItem={SetAllDetail} path={state.Path} data={data} />
                        ))
                    }
                    {
                        state.CardLoading && <h1>*******Loading******</h1>
                    }
                </>
            </Col>


        </Row>
    );

}

export default Main;
