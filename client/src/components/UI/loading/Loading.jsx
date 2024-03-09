import React, { useEffect } from 'react'
import "./loading.scss"

const Loading = ({setLoadingData,service,delay}) => {
  
  useEffect(()=>{
    setTimeout(()=>{
      if(service){
        setLoadingData(false)
      }
    },parseInt(`${delay}000`))
  },[service])
  return (
    <div className='loadingContainer'>
<span className="loader"></span>
    </div>
    
  )
}

export default Loading