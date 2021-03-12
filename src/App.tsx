import React, { useState, useReducer, createContext, useEffect } from 'react';
import { DetailsReducer } from "./Reducer";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyle } from "./components/Themes"
import Main from './components/main'
import styled from 'styled-components';
import { Setting } from './components/Setting';
import { AiFillSetting } from 'react-icons/ai';
import {Container} from 'react-bootstrap';



const Button = styled(AiFillSetting)`
  border: none; 
  cursor: pointer;
  height: 50px;
  width: 30px;
`;



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
  AllListOfQuaility: any; 
  isError: any;
  themeToggler: any; 
  theme: any;
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
  AllListOfQuaility: null,
  isError: null,
  themeToggler: null,
  theme: null,
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
  const [isError, setIsError] = useState({ isError: false, text: "" })
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState('light');
  const themeToggler = () => {
    if (theme === 'light') {

      setTheme('dark')
      window.localStorage.setItem("theme", 'dark')
      
    } else {
      setTheme('light')
      window.localStorage.setItem("theme", 'light')

    }
    
    
  }

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme")
    localTheme && setTheme(localTheme)
  }, [])

  const openModal = () => {
    setShowModal(prev => !prev);
  };




  // this function to set download percent like downlaoding 50% ...  
  function Set_Download_Percent(data: any) {
    SetAllDetail({ data, type: 'updateDownloadPercent' })
  }
  function isErrorDownload(text: string) {
    setIsError({ isError: !isError, text: text })
    SetAllDetail({ type: 'empty' });
  }

  // this Set_Download_Percent will be sent in python and 
  // python could run it 
  window.eel.expose(Set_Download_Percent, 'Set_Download_Percent')
  window.eel.expose(isErrorDownload, 'isErrorDownload')


  return (

    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <ThemeContext.Provider 
      value={{ 
        isError,
        setIsError,
        Path,
        setPath,
        AllDetail,
        SetAllDetail,
        Warning,
        SetWaning,
        PlayListLoading,
        setPlayListLoading,
        CardLoading,
        setCardLoading,
        setAllListOfQuaility,
        ChangeQuality,
        setChangeQuality,
        AllListOfQuaility,
        themeToggler,
        theme,
        }}>

          <Container>

        <Setting showModal={showModal} setShowModal={setShowModal} />


        <Button onClick={openModal}  />
      <GlobalStyle />

        <Main />
      
          </Container>
      </ThemeContext.Provider>
    </ThemeProvider>
  );

}

export default App;
