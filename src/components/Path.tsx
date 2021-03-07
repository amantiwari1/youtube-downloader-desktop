import React, { useContext } from 'react'

import { ThemeContext } from "../App";



const PathCompoment = () => {
  const context = useContext(ThemeContext)


  const { Path, setPath } = context
  const Select_folder = () => {
    window.eel.Select_folder()((getpath: string) => {
      if (getpath !== "") {
        setPath(getpath)
        window.eel.Set_Path_Folder(getpath)()
      }
    })
  }

  const Open_Folder = (path: string) => {
    window.eel.Open_Folder(path)()
  }

  return (
    <>
      <label>Save a video</label>
      <p>{Path}</p>
      <button onClick={Select_folder} >Select</button>
      <button onClick={() => Open_Folder(Path)} >Open</button>
    </>
  )
}


export { PathCompoment };