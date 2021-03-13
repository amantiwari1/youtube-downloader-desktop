import React, { useContext, useState } from 'react'
import { ThemeContext } from "../App";
import { Col, Row } from "react-bootstrap";
import styled from 'styled-components';

const Rowu = styled(Row)`
`

const Colu = styled(Col)`

   

`



const PathCompoment = () => {
  const { Path, setPath } = useContext(ThemeContext)

  const [isSelect, setisSelect] = useState(false)


  const Select_folder = async () => {
    setisSelect(true)
    await window.eel.Select_folder()(async (getpath: string) => {
      if (getpath !== "") {
        setPath(getpath)
        await window.eel.Set_Path_Folder(getpath)(
          () => {
          }
        )
      }
      setisSelect(false)
    })
  }

  

  return (
    <Rowu>

      <Colu xs={4} >
        <label>Save a video</label>
      </Colu>
      <Colu xs={4} >
        <p>{Path}</p>
      </Colu>
      <Colu xs={4} >
        <button disabled={isSelect} onClick={Select_folder} >Change Path</button>
      </Colu>
     
    </Rowu>
  )
}


export { PathCompoment };