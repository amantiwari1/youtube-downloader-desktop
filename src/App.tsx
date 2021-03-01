import React, { useState } from 'react';
import { Card } from './components/Card'


// this is eel 
export const eel = window.eel
// talk to python and javscript
eel.set_host('ws://localhost:8080')


const App = () => {

  //  this is useState
  const [AllDetail, SetAllDetail] = useState<Array<any>>([])
  const [Url, SetUrl] = useState("")


  const Get_Detail = () => {


    // this function come from python line 17 in main.py 
    // then call this function then it will run in python
    // after it will get all details of youtube a video 
    // through 'message'  and all details stored value to AllDetails 
    // split mean 2 url in textarea into ["url", "url"]



    Url.split('\n').map((url: any) => {
      if (AllDetail.every(obj => obj.url !== url)) {

        window.eel.Add_Details(url)((message: any) => {
          SetAllDetail(arr => [...arr, { ...message }]);
        })
      }

      return 1;
    })
  }

  // this function to set download percent like downlaoding 50% ...  
  function Set_Download_Percent(data: any) {
    let updatedList = AllDetail.map(item => {
      if (item.url === data.url) {
        return { ...item, downloadPercent: data.text };
      }

      return item;
    }
    )
    SetAllDetail([...updatedList])
  }

  // this Set_Download_Percent will be sent in python and 
  // python could run it 
  window.eel.expose(Set_Download_Percent, 'Set_Download_Percent')

  const handleRemoveItem = (name: string) => {
    SetAllDetail(AllDetail.filter(item => item.title !== name))
  }

  return (
    <div className="App">
      <header className="App-header">
        <form >
          <label>
            <textarea onChange={(e) => SetUrl(e.target.value)} />
          </label>
          <br />
          <button type='button' onClick={Get_Detail} >Get The youtube Detail</button>
        </form>
        <br />
        {/* <p>{AllDetail.DownloadPercent}</p> */}

        {
          AllDetail.map((data: any) => (
            <Card handleRemoveItem={handleRemoveItem} data={data}></Card>
          ))
        }
      </header>
    </div >
  );

}

export default App;
