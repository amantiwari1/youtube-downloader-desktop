import React, { useState, useReducer, createContext } from 'react';
import { Card } from './components/Card';
import { DetailsReducer } from "./Reducer";
import { PathCompoment } from "./components/Path";
import { Input } from "./components/Input"
import {ThemeProvider} from "styled-components";
import { lightTheme, darkTheme, GlobalStyle } from "./components/Themes"


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
  setIsError: any;
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
  setIsError: null,
});

const App = () => {



  //  this is useState
  const [AllDetail, SetAllDetail] = useReducer(DetailsReducer, [])
  const [Warning, SetWaning] = useState<Array<any>>([])
  const [Path, setPath] = useState("")
  const [PlayListLoading, setPlayListLoading] = useState(false)
  const [CardLoading, setCardLoading] = useState(false)
  const [AllListOfQuaility, setAllListOfQuaility] = useState([])
  const [ChangeQuality, setChangeQuality] = useState({ totalfilesize: {}, quality: "" })
  const [isError, setIsError] = useState({isError: false,  text : ""})
  const [theme, setTheme] = useState('light');
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
}





  // this function to set download percent like downlaoding 50% ...  
  function Set_Download_Percent(data: any) {
    SetAllDetail({ data, type: 'updateDownloadPercent' })
  }
  function isErrorDownload(text: string) {
    setIsError({isError:!isError, text:text})
    SetAllDetail({ type: 'empty' });
  }

  // this Set_Download_Percent will be sent in python and 
  // python could run it 
  window.eel.expose(Set_Download_Percent, 'Set_Download_Percent')
  window.eel.expose(isErrorDownload, 'isErrorDownload')


  React.useEffect(() => {
    window.eel.Get_Path_Folder()((getpath: string) => {
      setPath(getpath)
    })
  }, [])



  React.useEffect(() => {
    type Dict = { [key: string]: any };
    const totalfilesize: Dict = {}
    var All_Data_Quality: Array<Array<string>> = []
    AllDetail.map((data: any) => {
      All_Data_Quality.push(Object.keys(data.videoquality))
      return 0;
    })
    window.eel.All_Quality_Match(All_Data_Quality)((data: any) => {
      data.map((quality: string) => {

        AllDetail.map((data: any) => {
          if (!(quality in totalfilesize)) {
            totalfilesize[quality] = 0
          }
          totalfilesize[quality] = totalfilesize[quality] + data.videoquality[quality].filesize
          return 0;
        })
        return 0;
      })
      setAllListOfQuaility(data)
      setChangeQuality({quality: data[0], totalfilesize: totalfilesize})

    })
  }, [AllDetail])

function formatBytes(a: any, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }


  const All_Download_Video = (Quality: string) => {


    AllDetail.map(async (data: any) => {
      const { Video_url, ext } = data.videoquality[Quality]
      await window.eel.Download_video({ title: data.title, urlvideo: Video_url, url: data.url, path: Path, audiourl: data.videoquality['m4a'].Video_url, ext:ext})
      (() => {
        
      })
      return 0;
    })
  }


  const HandnleQuality = (quality: any) => {

    setChangeQuality({...ChangeQuality, quality:quality })

  }
  return (

    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle/>
      <button onClick={themeToggler}>Switch Theme</button>
    <ThemeContext.Provider value={{setIsError, Path, setPath, AllDetail, SetAllDetail, Warning, SetWaning, PlayListLoading, setPlayListLoading, CardLoading, setCardLoading, setAllListOfQuaility, ChangeQuality, setChangeQuality, }}>
      <div>
        <PathCompoment />
      </div>

      
      <br />
      <div>
        <Input />
      </div>

      <div>
        {
          isError.isError && <p>{isError.text}</p>
        }
      </div>
      <div>
        {
          PlayListLoading && <p>Please wait.. because your link are playlist. it maybe longer time</p>
        }
        {
          AllListOfQuaility.length > 0 && <> 
          
          <p>{formatBytes(ChangeQuality.totalfilesize[ChangeQuality.quality])}</p>
          <select value={ChangeQuality.quality} onChange={e => HandnleQuality(e.target.value)}>
            {
              AllListOfQuaility.map((quality: string) => (
                <option>{quality}</option>
              ))
            }
          </select>
          </>}
        <button disabled={AllDetail.length === 0} type="button" onClick={() => All_Download_Video(ChangeQuality.quality)}>Download</button>
        <br />
        {/* <button type='button' onClick={Get_Detail}  >Get The youtube Detail</button> */}
      </div>
      <div>
        {
          Warning.map(url => (
            <p>{url} is Wrong Link Please fix it</p>
          ))
        }
      </div>
      <br />
      <div>
        {
          AllDetail.map((data: any) => (
            <Card  key={data.title}  handleRemoveItem={SetAllDetail} path={Path} data={data}></Card>
          ))
        }
        {
          CardLoading && <h1>*******Loading******</h1>
        }
      </div>
    </ThemeContext.Provider>
    </ThemeProvider>
  );

}

export default App;
