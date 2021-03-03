import React, { useState } from 'react';
import { Card } from './components/Card'


// this is eel 
export const eel = window.eel
// talk to python and javscript
eel.set_host('ws://localhost:8080')


const App = () => {



  //  this is useState
  const [AllDetail, SetAllDetail] = useState<Array<any>>([])
  const [Warning, SetWaning] = useState<Array<any>>([])
  const [Path, setPath] = useState("")


  const Get_Detail = async (Url: String) => {
    // eslint-disable-next-line
    var re = new RegExp(`https:\/\/www\.youtube\.com\/watch?.*=...........`);
    SetAllDetail([]);
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
          if (AllDetail.every(obj => obj.url !== url)) {
            await window.eel.Add_Details(url)((message: any) => {
              SetAllDetail(arr => [...arr, { ...message }]);
            })
          }
        } else {
          SetWaning(arr => [...arr, url]);
        }
      }
      return 1;
    })


  }

  // this function to set download percent like downlaoding 50% ...  
  const Set_Download_Percent = (data: any) => {
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


  const Select_Form = () => {
    window.eel.Select_folder()((getpath: string) => {
      if (getpath !== "") {
        setPath(getpath)
        window.eel.Set_Path_Folder(getpath)()
      }
    })
  }

  React.useEffect(() => {
    window.eel.Get_Path_Folder()((getpath: string) => {
      setPath(getpath)
    })

  }, [])


  const Open_Folder = (path: string) => {
    window.eel.Open_Folder(path)()
  } 

  return (
    <div className="App">
      <header className="App-header">
        <label>Save a video</label>
        <p>{Path}</p>
        <button onClick={Select_Form} >Select</button>
        <button onClick={() => Open_Folder(Path)} >Open</button>
        <br />
        <form >
          <label>
            <textarea rows={5} cols={45} onChange={(e) => Get_Detail(e.target.value)} required />
          </label>
          <br />
          {/* <button type='button' onClick={Get_Detail}  >Get The youtube Detail</button> */}
        </form>

        <div>
          {
            Warning.map(url => (
              <p>{url} is Wrong Link Please fix it</p>
            ))
          }
        </div>
        <br />


        <br />


        {
          AllDetail.map((data: any) => (
            <Card handleRemoveItem={handleRemoveItem} path={Path} data={data}></Card>
          ))
        }
      </header>
    </div >
  );

}

export default App;
