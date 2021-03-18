import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components';
import { Col, Row } from "react-bootstrap";
import { BsDownload } from 'react-icons/bs'
import { AiFillCloseCircle, AiOutlineLink } from 'react-icons/ai'
import { ThemeContext } from "../App";


const Colu = styled(Col)`
    margin:0;
    padding: 0;
    text-align: center;
`
const Thumbnail = styled.img`
    width: 140px;
    height: 79px;
`
const Download = styled(BsDownload)`

    height: 25px;
    width: 25px;

`
const Close = styled(AiFillCloseCircle)`
    cursor: pointer;
    height: 25px;
    width: 25px;


`
const View = styled(AiOutlineLink)`
    height: 25px;
    width: 25px;
    color: ${props => props.theme.textColor};
`
const Filesize = styled.p`

    font-size: 14px;
`

const CardDiv = styled.div`
    margin-top: 20px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
    transition: 0.3s;
    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
    }
`

const Select = styled.select`
    display: block;
	font-size: 13px;
	font-family: sans-serif;
	font-weight: 700;
	color: #444;
	line-height: 1.3;
	padding: .6em 1.4em .5em .8em;
	width: 100%;
	max-width: 100%;
	box-sizing: border-box;
	margin: 0;
	border: 1px solid #aaa;
	box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
	border-radius: .5em;
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	background-color: #fff;
	background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
	  linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
	background-repeat: no-repeat, repeat;
	background-position: right .7em top 50%, 0 0;
	background-size: .65em auto, 100%;

&::-ms-expand {
	display: none;
}
&:hover {
	border-color: #888;
}
&:focus {
	border-color: #aaa;
	box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
	box-shadow: 0 0 0 3px -moz-mac-focusring;
	color: #222;
	outline: none;
}
option {
	font-weight:normal;
}

`

interface CardInterface {
    children?: never[],
    data: {
        thumbnail: string,
        title: any,
        url: string,
        downloadPercent: string,
        videoquality: any
        id: number

    },
    handleRemoveItem: any
    path: string
    UrlExist: any
}



function formatBytes(a: any, b = 0) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }



const Card = ({ UrlExist, data, handleRemoveItem, path }: CardInterface) => {


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

                                <Colu xs={3}>
                                    <Filesize>size : {formatBytes(ChangeQuality.filesize)}</Filesize>
                                </Colu >

                                <Colu xs={1}>
                                    <Download aria-disabled={isDownloading}  title='start download' type="button" onClick={starting_download} >Download</Download>
                                </Colu>

                                <Colu xs={1}>
                                    <Close onClick={() => {
                                         handleRemoveItem({ name: data.title, type: 'remove' });

                                         window.eel.DeleteVideo(data.id)
                                         dispatch({type: 'removeUrlExist', data: data.url })
                                         
                                         }}>Remove</Close>
                                </Colu>

                                <Colu xs={1}>
                                    <a target="_blank" rel="noopener noreferrer" href={data.url} ><View /></a>
                                </Colu>

                                <Colu xs={4}>
                                    <p>{data.downloadPercent}</p>
                                </Colu>
                            </Row>
                        </Col>

                    </Row>
                </Col >
            </Row>
        </CardDiv>
    )
}
export { Card }