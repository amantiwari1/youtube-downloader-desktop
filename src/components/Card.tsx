import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

interface CardInterface {
    children?: never[],
    data: {
    thumbnail: string,
    title: any,
    formats?: any,
    url: string,
    downloadPercent: string,
    videoquality: any
},
handleRemoveItem: any
path: string
}

const CardDiv = styled.div``

function formatBytes(a: any, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }



const Card = ({data, handleRemoveItem, path}: CardInterface) => {


    const [ChangeQuality, setChangeQuality] = useState({ video_url: "", filesize: 0, quality: "", ext:"" })
    const [isDownloading, setisDownloading] = useState(false)
    
    const ChangeQualityHandle = (Quality: string) => {
        const {format_note, Video_url, filesize, ext} = data.videoquality[Quality]
        setChangeQuality({ video_url: Video_url, filesize: filesize, quality: format_note, ext:ext })   
    }

    useEffect(() => {

        
        const{format_note, Video_url, filesize, ext} = data.videoquality[Object.keys(data.videoquality)[1]]
        setChangeQuality({ video_url: Video_url, filesize: filesize, quality: format_note, ext:ext })
    }, [data.videoquality])


    const starting_download = () => {
        setisDownloading(true)
        window.eel.Download_video({ title: data.title, urlvideo: ChangeQuality.video_url, url:data.url, path:path, audiourl:data.videoquality['m4a'].Video_url, ext:ChangeQuality.ext })
        (() => {
            setisDownloading(false)
        }
        )
    }

    

    return (
        <>
        <CardDiv>
            <img height="200" src={data.thumbnail} alt={data.title} />
            
            <p>{data.title}</p>
            <select value={ChangeQuality.quality} onChange={e => ChangeQualityHandle(e.target.value)}>
                {
                    Object.keys(data.videoquality).map((quality: string) => (
                        <option>{quality}</option>
                    ))
                }
            </select>
            <p>size : {formatBytes(ChangeQuality.filesize)}</p>
            <p>{data.downloadPercent}</p>
            <button disabled={isDownloading} type="button" onClick={starting_download} >Download</button>
            <button  onClick={() => handleRemoveItem({name: data.title, type: 'remove'})}>
              Remove
            </button>
            <a target="_blank" rel="noopener noreferrer" href={data.url} >View</a>
            
        </CardDiv>

    
    </>)
}
export { Card }