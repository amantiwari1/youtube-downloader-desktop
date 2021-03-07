import React, { useState, useReducer, createContext } from 'react';
import { Card } from './components/Card';
import { DetailsReducer } from "./Reducer";
import { PathCompoment } from "./components/Path";
import {Input} from "./components/Input"


// this is eel 
export const eel = window.eel
// talk to python and javscript
eel.set_host('ws://localhost:8080')


interface MyContextType {
  Path: any,
  setPath: any;
  AllDetail: any;
  SetAllDetail: any;
  Warning: any;
  SetWaning: any;
  PlayListLoading: any;
  setPlayListLoading: any;
  CardLoading: any;
  setCardLoading: any;
  setAllListOfQuaility: any;
  ChangeQuality: any;
  setChangeQuality: any;
  
}


export const ThemeContext = createContext<MyContextType>({
  Path: null,
  setPath: null,
  AllDetail: null,
  SetAllDetail: null,
  Warning: null,
  SetWaning: null,
  PlayListLoading: null,
  setPlayListLoading: null,
  CardLoading: null,
  setCardLoading: null,
  setAllListOfQuaility: null,
  ChangeQuality: null,
  setChangeQuality: null,
});

const App = () => {

  
 
  //  this is useState
  const [AllDetail, SetAllDetail] = useReducer(DetailsReducer, [])
  const [Warning, SetWaning] = useState<Array<any>>([])
  const [Path, setPath] = useState("")
  const [PlayListLoading, setPlayListLoading] = useState(false)
  const [CardLoading, setCardLoading] = useState(false)
  const [AllListOfQuaility, setAllListOfQuaility] = useState([])
  const [ChangeQuality, setChangeQuality] = useState("144p")
  
 

  // this function to set download percent like downlaoding 50% ...  
  function Set_Download_Percent(data: any) {
    SetAllDetail({ data, type: 'updateDownloadPercent' })
  }

  // this Set_Download_Percent will be sent in python and 
  // python could run it 
  window.eel.expose(Set_Download_Percent, 'Set_Download_Percent')


  React.useEffect(() => {
    window.eel.Get_Path_Folder()((getpath: string) => {
      setPath(getpath)
    })
  }, [])



  React.useEffect(() => {

    type Dict = { [key: string]: number };
    const totalfilesize: Dict  = {}

    
    var All_Data_Quality: Array<Array<string>> = []
    AllDetail.map((data: any) => {
    

      All_Data_Quality.push(Object.keys(data.videoquality))
      return 0;
    })
    window.eel.All_Quality_Match(All_Data_Quality)((data: any) => {

      

      data.map( (quality: string) => {

        AllDetail.map((data: any) => {
          

          if (!(quality in totalfilesize)) {
            totalfilesize[quality] = 0
          }

          
          totalfilesize[quality] = totalfilesize[quality] + data.videoquality[quality].filesize

          console.log(totalfilesize);


          return 0;
        })


        return 0;
      })

      setAllListOfQuaility(data)
    })


    
    
  }, [AllDetail])


  

  const All_Download_Video = (Quality: string) => {
    AllDetail.map((data: any) => {
      for (let format of data.formats) {
        if (format.format_note === Quality) {
          window.eel.Download_video({ title: data.title, urlvideo: format.url, url: data.url, path: Path })
          break;
        }
      }
      return 0;
    })
  }

  return (

    <ThemeContext.Provider  value = {{Path, setPath, AllDetail,  SetAllDetail,  Warning,  SetWaning,  PlayListLoading,  setPlayListLoading,  CardLoading,  setCardLoading,setAllListOfQuaility,  ChangeQuality,  setChangeQuality,}}>

      <div className="App">
        <header className="App-header">
          <PathCompoment></PathCompoment>
          <br />
          <form >
            <label>
            <Input />
              {
                PlayListLoading && <p>Please wait.. because your link are playlist. it maybe longer time</p>
              }
              {

                AllListOfQuaility.length > 0 && <> <select onChange={e => setChangeQuality(e.target.value)}>
                  {
                    AllListOfQuaility.map((quality: string) => (
                      <option>{quality}</option>
                    ))
                  }
                </select>
                </>}
                  <button disabled={AllListOfQuaility.length === 0} type="button" onClick={() => All_Download_Video(ChangeQuality)}>Download</button>
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
          {
            AllDetail.map((data: any) => (
              <Card handleRemoveItem={SetAllDetail} path={Path} data={data}></Card>
            ))
          }
          <div>
            {
              CardLoading && <p>Loading</p>
            }
          </div>
        </header>
      </div >
    </ThemeContext.Provider>
  );

}

export default App;
