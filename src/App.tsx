import React, { useState } from 'react';
import { Card } from './components/Card'


// this is eel 
export const eel = window.eel
// talk to python and javscript
eel.set_host('ws://localhost:8080')


const App = () => {

  //  this is useState
  const [AllDetail, SetAllDetail] = useState({
    url: "",
    title: "",
    thumbnail: "",
    DownloadPercent: "",
    list_Of_formats: [],
    formats: {},
    filesize: 0,
    videourl: ""
  })

  
  const handleSubmit = () => {


    // this function come from python line 17 in main.py 
    // then call this function then it will run in python
    // after it will get all details of youtube a video 
    // through 'message'  and all details stored value to AllDetails 
    window.eel.Downloader(AllDetail.url)((message: any) => {
      SetAllDetail({
        ...AllDetail,
        title: message.title,
        thumbnail: message.thumbnail,
        list_Of_formats: message.list_Of_formats,
        formats: message.formats,
        filesize: message.filesize,
        videourl: message.videourl
      })
    })
  }

  // this function to set download percent like downlaoding 50% ...  
  function Set_Download_Percent(text: string) {
    SetAllDetail({ ...AllDetail, DownloadPercent: text })
  }

  // this Set_Download_Percent will be sent in python and 
  // python could run it 
  window.eel.expose(Set_Download_Percent, 'Set_Download_Percent')


  return (
    <div className="App">
      <header className="App-header">
        <form >
          <label>
            <input onChange={(e) => SetAllDetail({ ...AllDetail, url: e.target.value })} />
          </label>
          <br />
          <button type='button' onClick={handleSubmit} >Get The youtube Detail</button>
        </form>
        <br />
        <p>{AllDetail.DownloadPercent}</p>

        {
          AllDetail.title && <Card
            title={AllDetail.title}
            thumbnail={AllDetail.thumbnail}
            viewUrl={AllDetail.url}
            list_Of_formats={AllDetail.list_Of_formats}
            formats={AllDetail.formats}
            filesize={AllDetail.filesize}
            videourl={AllDetail.videourl}
          >
          </Card>
        }
      </header>
    </div >
  );

}

export default App;
