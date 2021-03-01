import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

interface CardInterface {
    children?: never[],
    data: {
    thumbnail: string,
    title: any,
    formats?: any,
    list_Of_formats: Array<string>,
    url: string,
    filesize: number,
    videourl: string,
    downloadPercent: string,
},
handleRemoveItem: any
}

const CardDiv = styled.div``

function formatBytes(a: any, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }



const Card = ({data, handleRemoveItem}: CardInterface) => {

    console.log(data.videourl)

    const [ChangeQuality, setChangeQuality] = useState({ video_url: "", filesize: 0, quality: "" })
    const ChangeQualityHandle = (Quality: string) => {
        for (let format of data.formats) {
            if (format.format_note === Quality) {
                setChangeQuality({ video_url: format.url, filesize: format.filesize, quality: format.format_note });
                break;
            }
        }
    }

    useEffect(() => {
        setChangeQuality({ video_url: data.videourl, filesize: data.filesize, quality: data.list_Of_formats[0] })

    }, [data.videourl, data.filesize, data.list_Of_formats])

    return (
        <CardDiv>
            <img height="200" src={data.thumbnail} alt={data.title} />
            
            <p>{data.title}</p>
            <select value={ChangeQuality.quality} onChange={e => ChangeQualityHandle(e.target.value)}>
                {
                    data.list_Of_formats.map((quality: string) => (
                        <option>{quality}</option>
                    ))
                }
            </select>
            <p>size : {formatBytes(ChangeQuality.filesize)}</p>
            <p>{data.downloadPercent}</p>
            <button type="button" onClick={() => window.eel.Download_video({ title: data.title, urlvideo: ChangeQuality.video_url, url:data.url })} >Download</button>
            <button onClick={() => handleRemoveItem(data.title)}>
              Remove
            </button>
            <a target="_blank" rel="noopener noreferrer" href={data.url} >View</a>
            
        </CardDiv>
    )
}
export { Card }