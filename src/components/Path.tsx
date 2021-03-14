import React, { useContext, useState } from 'react'
import { ThemeContext } from "../App";
import { Col, Row } from "react-bootstrap";


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
    <Row>

      <Col xs={4} >
        <label>Save a video</label>
      </Col>
      <Col xs={4} >
        <p>{Path}</p>
      </Col>
      <Col xs={4} >
        <button disabled={isSelect} onClick={Select_folder} >Change Path</button>
      </Col>

    </Row>
  ) 
}


export { PathCompoment };