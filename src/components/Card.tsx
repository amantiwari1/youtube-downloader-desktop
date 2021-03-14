import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { Col, Row } from "react-bootstrap";

const Colu = styled(Col)`
    margin:0;
    padding: 0;
    text-align: center;

`

const Filesize = styled.p`

    font-size: 14px;
`

const CardDiv = styled.div`
    margin: 5px;
`

interface CardInterface {
    children?: never[],
    data: {
        thumbnail: string,
        title: any,
        url: string,
        downloadPercent: string,
        videoquality: any
    },
    handleRemoveItem: any
    path: string
}



function formatBytes(a: any, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }



const Card = ({ data, handleRemoveItem, path }: CardInterface) => {


    const [ChangeQuality, setChangeQuality] = useState({ video_url: "", filesize: 0, quality: "", ext: "" })
    const [isDownloading, setisDownloading] = useState(false)

    const ChangeQualityHandle = (Quality: string) => {
        const { format_note, Video_url, filesize, ext } = data.videoquality[Quality]
        setChangeQuality({ video_url: Video_url, filesize: filesize, quality: format_note, ext: ext })
    }

    useEffect(() => {


        const { format_note, Video_url, filesize, ext } = data.videoquality[Object.keys(data.videoquality)[1]]
        setChangeQuality({ video_url: Video_url, filesize: filesize, quality: format_note, ext: ext })
    }, [data.videoquality])


    const starting_download = () => {
        setisDownloading(true)
        window.eel.Download_video({ title: data.title, urlvideo: ChangeQuality.video_url, url: data.url, path: path, audiourl: data.videoquality['m4a'].Video_url, ext: ChangeQuality.ext })
            (() => {
                setisDownloading(false)
            }
            )
    }



    return (
        <>
            <CardDiv>
                <Row>

                    <Col xs={2}>
                        <img height="62" width="90" src={data.thumbnail} alt={data.title} />
                    </Col>

                    <Col xs={10}>

                        <Row>
                            <Col xs={12}>
                                <p>{data.title}</p>
                            </Col>
                            <Col xs={12}>
                                <Row>
                                    <Colu xs={2}>
                                        <select value={ChangeQuality.quality} onChange={e => ChangeQualityHandle(e.target.value)}>
                                            {

                                                Object.keys(data.videoquality).map((quality: string) => (
                                                    <option key={quality} >{quality}</option>
                                                ))

                                            }
                                        </select>
                                    </Colu>

                                    <Colu xs={2}>
                                        <Filesize>size : {formatBytes(ChangeQuality.filesize)}</Filesize>
                                    </Colu >

                                    <Colu xs={2}>
                                        <button disabled={isDownloading} type="button" onClick={starting_download} >Download</button>
                                    </Colu>

                                    <Colu xs={2}>
                                        <button onClick={() => handleRemoveItem({ name: data.title, type: 'remove' })}>Remove</button>
                                    </Colu>

                                    <Colu xs={2}>
                                        <a target="_blank" rel="noopener noreferrer" href={data.url} >View</a>
                                    </Colu>

                                    <Colu xs={2}>
                                        <p>{data.downloadPercent}</p>
                                    </Colu>
                                </Row>
                            </Col>

                        </Row>
                    </Col >
                </Row>
            </CardDiv>


        </>)
}
export { Card }