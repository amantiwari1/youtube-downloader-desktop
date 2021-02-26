import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

interface CardInterface {
    children?: never[],
    thumbnail: string,
    title: any,
    formats?: any,
    list_Of_formats: Array<string>,
    viewUrl: string,
    filesize: number,
    videourl: string
}

const CardDiv = styled.div``

function formatBytes(a: any, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }



const Card = ({
    thumbnail,
    title,
    viewUrl,
    list_Of_formats,
    formats,
    filesize,
    videourl
}: CardInterface) => {

    const [ChangeQuality, setChangeQuality] = useState({ video_url: "", filesize: 0, quality: "" })
    const ChangeQualityHandle = (Quality: string) => {
        for (let format of formats) {
            if (format.format_note === Quality) {
                setChangeQuality({ video_url: format.url, filesize: format.filesize, quality: format.format_note });
                break;
            }
        }
    }

    useEffect(() => {
        setChangeQuality({ video_url: videourl, filesize: filesize, quality: list_Of_formats[0] })

    }, [videourl, filesize, list_Of_formats])

    return (
        <CardDiv>
            <img height="200" src={thumbnail} alt={title} />
            <p>{title}</p>
            <select value={ChangeQuality.quality} onChange={e => ChangeQualityHandle(e.target.value)}>
                {
                    list_Of_formats.map(quality => (
                        <option>{quality}</option>
                    ))
                }
            </select>
            <p>size : {formatBytes(ChangeQuality.filesize)}</p>
            <button type="button" onClick={() => window.eel.Download_video({ title: title, urlvideo: ChangeQuality.video_url })} >Download</button>
            <a target="_blank" rel="noopener noreferrer" href={viewUrl} >View</a>
        </CardDiv>
    )
}
export { Card }