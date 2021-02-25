import React, { useState } from 'react';
import './App.css';

export const eel = window.eel
eel.set_host('ws://localhost:8080')


const App = () => {


  const [AllDetail, SetAllDetail] = useState({ url: "", title: "", thumbnail: "" , DownloadPercent: ""})

  

  const handleSubmit = () => {
    eel.Downloader(AllDetail.url)((message: Array<string>) => {
      SetAllDetail({ ...AllDetail, title: message[0], thumbnail: message[1], DownloadPercent: message[2] })
    })
  }


  function sayHelloJS(text: string) {
    SetAllDetail({ ...AllDetail, DownloadPercent: text  })
  }

  window.eel.expose( sayHelloJS, 'say_hello_js' )


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
        {
          AllDetail.thumbnail && <img src={AllDetail.thumbnail} height="200" alt="thumbnail" />
        }
        <p>{AllDetail.title}</p>
        <p>{AllDetail.DownloadPercent}</p>
      </header>
    </div>
  );

}

export default App;
