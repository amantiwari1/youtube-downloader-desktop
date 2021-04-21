import React, { useContext } from 'react';
import { Card } from './Card/Card';
import { Input } from "./Input/Input"
import { ThemeContext } from "../App";
import styled from 'styled-components';
import formatBytes from './utils/formatBytes'
import tw from 'twin.macro';


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
        <div tw="flex flex-col">
            <Input />

            <div>
                <br />
                <div>
                    {
                        state.isError.isError && <p>{state.isError.text}</p>
                    }
                </div>

                <div>
                    {
                        state.PlayListLoading && <p>Please wait.. because your link are playlist. it maybe longer time</p>
                    }
                </div>

                <div>
                    {
                        state.AllListOfQuaility.length > 0 &&
                        <div tw="grid grid-cols-1 sm:(grid-cols-6 space-x-5) md:grid-cols-5 justify-center items-center ">


                            <div tw="flex col-span-5 sm:col-span-3 md:col-span-2 space-x-5 justify-center" >
                                <label tw="whitespace-nowrap" >Overall FileSize : </label>
                                <p tw="whitespace-nowrap" >{formatBytes(state.ChangeQuality.totalfilesize[state.ChangeQuality.quality])}</p>
                            </div>


                            <div tw="flex col-span-5 sm:(col-span-3 col-start-4 ) md:col-span-2 space-x-5 justify-center" >
                                <label tw="whitespace-nowrap" >Overall Quality : </label>
                                <select tw=" h-5 dark:(text-black)" value={state.ChangeQuality.quality} onChange={e => HandnleQuality(e.target.value)}>
                                    {
                                        state.AllListOfQuaility.map((quality: string) => (
                                            <option key={quality} >{quality}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div tw="flex justify-center col-span-5  md:col-span-1" >
                                <DownloadAll
                                    tw=" w-24 h-10 "
                                    disabled={AllDetail.length === 0}
                                    type="button"
                                    onClick={() => All_Download_Video(state.ChangeQuality.quality)}>
                                    Download
                                    </DownloadAll>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div>
                {
                    AllDetail.map((data: any) => (
                        <Card key={data.title} UrlExist={state.UrlExist} handleRemoveItem={SetAllDetail} path={state.Path} data={data} />
                    ))
                }
                {
                    state.CardLoading && <h1>*******Loading******</h1>
                }
            </div>


        </div>
    );

}

export default Main;
