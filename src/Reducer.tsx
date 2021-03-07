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

export { DetailsReducer }