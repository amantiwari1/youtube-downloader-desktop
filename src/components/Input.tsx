import React, { useContext } from 'react'
import { ThemeContext } from "../App";



const Input = () => {

    const { SetWaning, AllDetail, SetAllDetail, setCardLoading, setPlayListLoading } = useContext(ThemeContext)

    const Get_Detail = async (Url: String) => {
        // eslint-disable-next-line
        var re = new RegExp(`https:\/\/www\.youtube\.com\/watch?.*=...........`);
        // eslint-disable-next-line
        var playlist = new RegExp(`https://www.youtube.com/playlist`);
        SetAllDetail({ type: 'empty' });
        SetWaning([]);

        if (Url === "") {
            return 0;
        }

        // this function come from python line 17 in main.py 
        // then call this function then it will run in python
        // after it will get all details of youtube a video 
        // through 'message'  and all details stored value to AllDetails 
        // split mean 2 url in textarea into ["url", "url"]
        Url.split('\n').map(async (url: String) => {

            if (url !== "") {
                if (url.match(re)) {
                    if (AllDetail.every((obj: any) => obj.url !== url)) {
                        setCardLoading(true)
                        await window.eel.Add_Details(url)((message: any) => {
                            SetAllDetail({ message, type: 'add' });
                            setCardLoading(false)

                        })
                    }
                } else if (url.match(playlist)) {
                    setPlayListLoading(true)
                    window.eel.Get_Data_Details_Playlists(url)((data: Array<any>) => {
                        console.log(data);

                        data.map((message: any) => {
                            SetAllDetail({ message, type: 'add' });
                            return 0;
                        })
                        setPlayListLoading(false)
                    })
                }
                else {
                    SetWaning((arr: any) => [...arr, url]);
                }
            }
            return 1;
        })
    }


    return (

        <textarea rows={5} cols={45} onChange={(e) => Get_Detail(e.target.value)} required />

    )
}


export { Input }