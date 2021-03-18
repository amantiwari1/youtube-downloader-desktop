const DetailsReducer = (state: any, action: any) => {
    switch(action.type) {
      case 'add':
        return [...state, {...action.message}]

      case 'remove':
        return state.filter((item: any) => item.title !== action.name)

      case 'updateDownloadPercent':
        let updatedList = state.map((item: any) => {
          if (item.url === action.data.url) {
            return { ...item, downloadPercent: action.data.text };
          }
          return item;
        }
        )

        return [...updatedList]

      case 'empty':
        return []

    }
}

const stateReducer = (state: any, action: any) => {
  switch(action.type) {
    case 'setPath':
      return {...state, Path: action.data}
      
    case 'CardLoading':
      return {...state, CardLoading: action.data}
      
    case 'PlayListLoading':
      return {...state, PlayListLoading: action.data}
    
    case 'isError':
      return {...state, isError: {...action.data}}

    case `AllListOfQuaility`:
      return {...state, AllListOfQuaility: action.data}

    case `ChangeQuality`:
      return {...state, ChangeQuality:{ ...action.data} }
    
    case `UpdateQuality`:
      return {...state, ChangeQuality:{ ...state.ChangeQuality, quality: action.data} }

    case 'showModalFalse':
      return {...state, showModal:false }

    case `showModal`:
      return {...state, showModal:!state.showModal} 

    case `theme`:
      if (state.theme === 'light') {

        window.localStorage.setItem("theme", 'dark')
        return {...state, theme: 'dark'}
        
      } else {
        window.localStorage.setItem("theme", 'light')
        return {...state, theme: 'light'}
      }      
    case `setTheme`:
      return {...state, theme: action.data}

    case `is_not_connected`:
      return {...state, is_not_connected: action.data}
    
    case `addUrlExist`:
      return {...state, UrlExist: [...state.UrlExist, action.data]}
    
    case `removeUrlExist`:
      let UpdatedUrlExist = state.UrlExist.filter(arr => arr !== action.data)
      return {...state, UrlExist:  UpdatedUrlExist }
  
    }
}

export { DetailsReducer, stateReducer }
