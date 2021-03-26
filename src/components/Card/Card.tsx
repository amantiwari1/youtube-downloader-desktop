import React, { useState, useEffect, useContext } from 'react'
import { Col, Row, ProgressBar, Spinner, Dropdown } from "react-bootstrap";
import { ThemeContext } from "../../App";
import { CardInterface } from './CardInterface'
import { CardDiv, Thumbnail, Colu, Select, Filesize, Download, Play, View, Close, DropdownToggle } from './CardStyle'
import formatBytes from '../utils/formatBytes'

const Card = ({ data, handleRemoveItem, path }: CardInterface) => { 


    const [ChangeQuality, setChangeQuality] = useState({ video_url: "", filesize: 0, quality: "", ext: "" })
    const [isDownloading, setisDownloading] = useState(false)

    const { dispatch } = useContext(ThemeContext)

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
        <CardDiv>
            <Row>

                <Col xs={3}>
                    <Thumbnail src={data.thumbnail} alt={data.title} />
                </Col>

                <Col xs={9}>

                    <Row>
                        <Col xs={12}>
                            <p>{data.title}</p>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Colu xs={2}>
                                    <Select value={ChangeQuality.quality} onChange={e => ChangeQualityHandle(e.target.value)}>
                                        {

                                            Object.keys(data.videoquality).map((quality: string) => (
                                                <option key={quality} >{quality}</option>
                                            ))

                                        }
                                    </Select>
                                </Colu>

                                <Colu xs={4}>
                                    <Filesize>size : {formatBytes(ChangeQuality.filesize)}</Filesize>
                                </Colu >

                                <Colu xs={1}>
                                    {
                                        isDownloading ?
                                            <Spinner animation="border" variant="primary" />
                                            : <Download title='start download' type="button" onClick={starting_download} />
                                    }
                                </Colu>
                                {
                                    data.savefile !== "" ? (
                                        <Colu xs={1}>
                                            <Play aria-disabled={isDownloading} title='start download' type="button" onClick={() => window.eel.Open_Folder_or_file(data.savefile)} />
                                        </Colu>
                                    ) : null
                                }


                                <Colu xs={1}>
                                    <Close onClick={() => {
                                        handleRemoveItem({ name: data.title, type: 'remove' });

                                        window.eel.DeleteVideo(data.url)
                                        dispatch({ type: 'removeUrlExist', data: data.url })

                                    }}>Remove</Close>
                                </Colu>

                                <Colu xs={1}>
                                    <a target="_blank" rel="noopener noreferrer" href={data.url} ><View /></a>
                                </Colu>
                                <Colu xs={2}>
                                    {
                                        data.savefile !== "" ?
                                            <Dropdown>
                                                <DropdownToggle variant="primary" id="dropdown-basic"></DropdownToggle>
                                                <Dropdown.Menu>
                                                    <Play aria-disabled={isDownloading} title='start download' type="button" onClick={() => window.eel.Open_Folder_or_file(data.savefile)} />
                                                </Dropdown.Menu>
                                            </Dropdown> : null
                                    }
                                </Colu>
                            </Row>
                        </Col>

                    </Row>
                </Col >
            </Row>
            <Row>
                <Col>
                    {
                        <ProgressBar animated now={data.downloadPercent.percent} label={data.downloadPercent.text} />
                    }
                </Col>
            </Row>
        </CardDiv>
    )
}
export { Card }