import React, { useContext, useState } from 'react'
import { ThemeContext } from "../../App";
import tw from "twin.macro"

const PathCompoment = () => {
  const { state, dispatch } = useContext(ThemeContext)

  const [isSelect, setisSelect] = useState(false) 


  const Select_folder = async () => {
    setisSelect(true)
    await window.eel.Select_folder()(async (getpath: string) => {
      if (getpath !== "") {
        dispatch({type: "setPath" , data:getpath})
        await window.eel.Set_Path_Folder(getpath)(
          () => {
          }
        )
      }
      setisSelect(false)
    })
  }

  

  return (
    <div tw="flex space-x-10 items-center">
        <label>Save a video</label>
        <p>{state.Path}</p>
        <button disabled={isSelect} onClick={Select_folder} >Change Path</button>
    </div>
  ) 
}


export { PathCompoment };