import React, { useState } from 'react';
import './App.css';
import { Card } from './components/Card'

export const eel = window.eel
eel.set_host('ws://localhost:8080')


const App = () => {


  const [AllDetail, SetAllDetail] = useState({ url: "", title: "", thumbnail: "", DownloadPercent: "", filesize: 0, VideoUrl: "" })



  const handleSubmit = () => {
    window.eel.Downloader(AllDetail.url)((message: any) => {
      SetAllDetail({ ...AllDetail, title: message[0], thumbnail: message[1], DownloadPercent: message[2], filesize: message[3], VideoUrl: message[4] })
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
          AllDetail.title &&  <Card
          title={AllDetail.title}
          thumbnail={AllDetail.thumbnail}
          downloadUrl={AllDetail.VideoUrl}
          filesize={AllDetail.filesize}
          viewUrl={AllDetail.url}
        >
        </Card>
          }
      </header>
    </div>
  );

}

export default App;
