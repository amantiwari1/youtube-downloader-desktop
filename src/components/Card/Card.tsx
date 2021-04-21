import React, { useState, useEffect, useContext } from 'react'
import { Col, Row, ProgressBar, Spinner, Dropdown } from "react-bootstrap";
import { ThemeContext } from "../../App";
import { CardInterface } from './CardInterface'
import { CardDiv, Thumbnail, Colu, Select, Filesize, Download, Play, View, Close, DropdownToggle } from './CardStyle'
import formatBytes from '../utils/formatBytes'
import tw from "twin.macro"

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
            <div tw="grid grid-cols-6 space-x-2" >

                <Thumbnail src={data.thumbnail} alt={data.title} />

                <div tw="flex flex-col  col-span-5 space-y-3 p-3" >

                    <p >{data.title}</p>
                    <div tw="flex flex-wrap space-x-4" >
                        <Select tw="w-24" value={ChangeQuality.quality} onChange={e => ChangeQualityHandle(e.target.value)}>
                            {

                                Object.keys(data.videoquality).map((quality: string) => (
                                    <option key={quality} >{quality}</option>
                                ))

                            }
                        </Select>

                        <Filesize>size : {formatBytes(ChangeQuality.filesize)}</Filesize>

                        {
                            isDownloading ?
                                <Spinner animation="border" variant="primary" />
                                : <Download title='start download' type="button" onClick={starting_download} />
                        }
                        {
                            data.savefile !== "" ? (
                                <Colu xs={1}>
                                    <Play aria-disabled={isDownloading} title='start download' type="button" onClick={() => window.eel.Open_Folder_or_file(data.savefile)} />
                                </Colu>
                            ) : null
                        }

                        <a target="_blank" rel="noopener noreferrer" href={data.url} ><View /></a>

                        <Close onClick={() => {
                            handleRemoveItem({ name: data.title, type: 'remove' });
                            window.eel.DeleteVideo(data.url)
                            dispatch({ type: 'removeUrlExist', data: data.url })
                        }} />

                        {
                            data.savefile !== "" ?
                                <Dropdown>
                                    <DropdownToggle variant="primary" id="dropdown-basic"></DropdownToggle>
                                    <Dropdown.Menu>
                                        <Play aria-disabled={isDownloading} title='start download' type="button" onClick={() => window.eel.Open_Folder_or_file(data.savefile)} />
                                    </Dropdown.Menu>
                                </Dropdown> : null
                        }
                    </div>

                </div >
            </div>
            <div>
                <ProgressBar animated now={data.downloadPercent.percent} label={data.downloadPercent.text} />
            </div>
        </CardDiv>
    )
}
export { Card }