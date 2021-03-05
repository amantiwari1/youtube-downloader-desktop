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
  const [Loading, setLoading] = useState(false)
  const [CardLoading, setCardLoading] = useState(false)
  const [AllListOfQuaility, setAllListOfQuaility] = useState([])


  async function Get_Detail(Url: String) {
    // eslint-disable-next-line
    var re = new RegExp(`https:\/\/www\.youtube\.com\/watch?.*=...........`);
    // eslint-disable-next-line
    var playlist = new RegExp(`https://www.youtube.com/playlist`);
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
            setCardLoading(true)
            await window.eel.Add_Details(url)((message: any) => {
              SetAllDetail(arr => [...arr, { ...message }]);
              setCardLoading(false)

            })
          }
        } else if (url.match(playlist)) {
          setLoading(true)
          window.eel.Get_Data_Details_Playlists(url)((data: any) => {

            data.map((data: any) => {
              SetAllDetail(arr => [...arr, { ...data }]);
              return 0;
            })
            setLoading(false)
          })
        }
        else {
          SetWaning(arr => [...arr, url]);
        }
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
  window.eel.expose(Get_Detail, 'Get_Detail')

  // remove a youtube video but not delete
  const handleRemoveItem = (name: string) => {
    SetAllDetail(AllDetail.filter(item => item.title !== name))
  }


  // selecl folder is where save video
  const Select_folder = () => {
    window.eel.Select_folder()((getpath: string) => {
      if (getpath !== "") {
        setPath(getpath)
        window.eel.Set_Path_Folder(getpath)()
      }
    })
  }

  // get the path wehere user is choice save a video in the folder
  React.useEffect(() => {
    window.eel.Get_Path_Folder()((getpath: string) => {
      setPath(getpath)
    })

  }, [])
 
  

  React.useEffect(() => {

    var All_Data_Quality:Array<string> = []
    AllDetail.map((data) => {

      All_Data_Quality.push(data.list_Of_formats)


      return 0;
    })

    window.eel.All_Quality_Match(All_Data_Quality)((data:any) => {
      setAllListOfQuaility(data)
    })
    
  }, [AllDetail])

  // open the folder wehere video are alreddy save
  const Open_Folder = (path: string) => {
    window.eel.Open_Folder(path)()
  }


  const All_Download_Video = (Quality: string) => {
    AllDetail.map((data: any) => {

      console.log(data.title);
      for (let format of data.formats) {
        if (format.format_note === Quality) {
          window.eel.Download_video({ title: data.title, urlvideo: format.url, url: data.url, path: Path })
          break;
        }
      }


      return 0;
    })
  }


  const [ChangeQuality, setChangeQuality] = useState("144p")
  const ChangeQualityHandle = (Quality: string) => {
    setChangeQuality(Quality);
  }

  return (
    <div className="App">
      <header className="App-header">
        <label>Save a video</label>
        <p>{Path}</p>
        <button onClick={Select_folder} >Select</button>
        <button onClick={() => Open_Folder(Path)} >Open</button>
        <br />
        <form >
          <label>
            <textarea rows={5} cols={45} onChange={(e) => Get_Detail(e.target.value)} required />

            {
              Loading && <p>Please wait.. because your link are playlist. it maybe longer time</p>
            }
            {

            AllListOfQuaility.length > 0 && <> <select onChange={e => ChangeQualityHandle(e.target.value)}>
                {
                  AllListOfQuaility.map((quality: string) => (
                    <option>{quality}</option>
                  ))
                }
              </select>

                <button type="button" onClick={() => All_Download_Video(ChangeQuality)}>Download all video</button>

              </> }
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


        <div>
          {
            CardLoading && <p>Loading</p>
          }
        </div>
      </header>
    </div >
  );

}

export default App;

