import React, { useState } from 'react';
import { Card } from './components/Card'

export const eel = window.eel
eel.set_host('ws://localhost:8080')


const App = () => {


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
    window.eel.Downloader(AllDetail.url)((message: any) => {
      Set_Download_Percent("...")
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

  function Set_Download_Percent(text: string) {
    SetAllDetail({ ...AllDetail, DownloadPercent: text })
  }

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
