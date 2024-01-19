import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

export default function Shownavbar({children}) {
    const navigate = useLocation();
    const [shownavbar, setshownavbar]= useState(false);
  
    useEffect(()=>{console.log(navigate)
                  if(navigate.pathname==='/login' || navigate.pathname==='/register'){
                    setshownavbar(false)
                  }
                  else{
                    setshownavbar(true)
                  }
    
    
    
    },[navigate])
  return (
    <div>{shownavbar && children}</div>
  )
}
