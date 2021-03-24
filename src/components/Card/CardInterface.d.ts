/// <reference types="react-scripts" />

export interface CardInterface {
    children?: never[],
    data: {
        thumbnail: string,
        title: any,
        url: string,
        downloadPercent: {
            text: string,
            percent: number
        },
        videoquality: any
        savefile: string

    },
    handleRemoveItem: any
    path: string
    UrlExist: any
}


