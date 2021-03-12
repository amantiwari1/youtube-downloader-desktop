import React, { useContext, useState } from 'react'
import { ThemeContext } from "../App";




const PathCompoment = () => {
  const { Path, setPath } = useContext(ThemeContext)

  const [isOpen, setIsOpen] = useState(false)
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

  const Open_Folder = async (path: string) => {
    setIsOpen(true)
    await window.eel.Open_Folder(path)(
      () => {
        setIsOpen(false)
      }
    )
  }

  return (
    <>
      <label>Save a video</label>
      <p>{Path}</p>
      <button disabled={isSelect} onClick={Select_folder} >Select</button>
      <button disabled={isOpen} onClick={() => Open_Folder(Path)} >Open</button>
    </>
  )
}


export { PathCompoment };