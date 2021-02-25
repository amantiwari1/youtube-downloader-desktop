import React from 'react'
import styled from 'styled-components';

interface CardInterface {
    children?: never[],
    thumbnail: string,
    title: any,
    downloadUrl: string,
    filesize: number,
    viewUrl: string
}

const CardDiv = styled.div``



const Card = ({  thumbnail, title, downloadUrl, filesize, viewUrl }: CardInterface) => {
    return (
        <CardDiv>
            <img height="200" src={thumbnail} alt={title} />
            <p>{title}</p>
            <p>Size : {Number.parseFloat(`${filesize/1000000}`).toFixed(2)}  mb</p>
            <button type="button" onClick={() => window.eel.Download_video({urlvideo: downloadUrl, title: title})()} >Download</button>
            <a href={viewUrl} >View</a>
        </CardDiv>
    )
}
export { Card }