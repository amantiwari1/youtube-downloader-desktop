import React, { useReducer, createContext, useEffect } from 'react';
import { DetailsReducer, stateReducer } from "./Reducer";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyle } from "./components/Themes"
import Main from './components/main'
import styled from 'styled-components';
import { Setting } from './components/Setting';
import { AiFillSetting } from 'react-icons/ai';
import {Container} from 'react-bootstrap'



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
  AllDetail: any;
  SetAllDetail: any;
  dispatch: any;
  state: any;
}

export const ThemeContext = createContext<MyContextType>({
  AllDetail: null,
  SetAllDetail: null,
  state: null,
  dispatch: null,
});


const App = () => {

  //  this is useState

  const initialState = {
    Path: "",
    PlayListLoading: false,
    CardLoading: false,
    AllListOfQuaility: [],
    ChangeQuality: { totalfilesize: {}, quality: "" }, 
    isError: { isError: false, text: "" },
    showModal: false,
    theme: 'light', 
    is_not_connected: false,
    UrlExist: []
  } 

  const [state, dispatch] = useReducer(stateReducer, initialState)
  const [AllDetail, SetAllDetail] = useReducer(DetailsReducer, [])

  
  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme")
    localTheme && dispatch({type: 'setTheme', data: localTheme})
  }, [])

  const openModal = () => {
    dispatch({type: 'showModal'})
  };

  useEffect(() => {
    window.eel.Get_All_Details()((data: any) => {

    SetAllDetail({ data: data.data , type: 'entire' })
    dispatch({type: 'entireUrlExist', data: data.UrlExist})


    })  
  }, [])




  // this function to set download percent like downlaoding 50% ...  
  function Set_Download_Percent(data: any) {
    SetAllDetail({ data, type: 'updateDownloadPercent' })
  }
  
  function Set_Savefile(data: any) {
    SetAllDetail({ data, type: 'updateSavefile' })
  }


  function is_not_connected(bool: boolean) {
    dispatch({ data: bool , type: 'is_not_connected' })
    
  }
  function set_AllDetails(data: any) {
    SetAllDetail({ data: data.data , type: 'entire' })
    dispatch({type: 'entireUrlExist', data: data.UrlExist})
    
  }

  // this Set_Download_Percent will be sent in python and 
  // python could run it 
  window.eel.expose(Set_Download_Percent, 'Set_Download_Percent')
  window.eel.expose(Set_Savefile, 'Set_Savefile')
  window.eel.expose(is_not_connected, 'is_not_connected')
  window.eel.expose(set_AllDetails, 'set_AllDetails')


  return (

    <ThemeProvider theme={state.theme === 'light' ? lightTheme : darkTheme}>
      <ThemeContext.Provider 
      value={{ 
        AllDetail,
        SetAllDetail,
        state,
        dispatch
        }}>
      <Container>
        <Setting  />


        <Button onClick={openModal}  />
      <GlobalStyle />

        <Main />
      
      </Container>
      </ThemeContext.Provider>
    </ThemeProvider>
  );

}

export default App;
