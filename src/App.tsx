import React, { useState } from 'react';
import './App.css';

// Point Eel web socket to the instance
export const eel = window.eel
eel.set_host('ws://localhost:8080')

// Test anonymous function when minimized. See https://github.com/samuelhwilliams/Eel/issues/363






const App = () => {

  const [AllDetail, SetAllDetail] = useState({ url: "", title: "", thumbnail: "" , DownloadPercent: ""})

  

  const handleSubmit = () => {
    eel.Downloader(AllDetail.url)((message: Array<string>) => {
      SetAllDetail({ ...AllDetail, title: message[0], thumbnail: message[1] })
    })
  }


  eel.expose(say_hello_js);               // Expose this function to Python
  function say_hello_js(text: string) {
    SetAllDetail({ ...AllDetail, DownloadPercent: text  })
  }


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
