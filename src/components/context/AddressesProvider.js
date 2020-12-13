import React, { createContext, useState, useEffect } from 'react'

export const AddressesContext = createContext()

export const AddressesProvider = ({children}) => {
    const [addressesObjects,setAddressesObjets] = useState(undefined)
    
    function onMouseAddressHover(addressObj) {
        setAddressesObjets((addressesObjects) => {
          return addressesObjects.map(addressObject => {
            if(addressObject === addressObj){
              return {
                ...addressObj,
                isListHovered: true,
              };
            }
            else{
              return {
                ...addressObject,
                isLocationClicked: false
              }
            }
          })
        })
      }
      function onMouseAddressOut(addressObj) {
        setAddressesObjets((addressesObjects) => {
          return addressesObjects.map(addressObject => {
            if(addressObject === addressObj){
              return {
                ...addressObj,
                isListHovered: false,
              };
            }
            else{
              return addressObject
            }
          })
        })
      }
    useEffect(() => {
        var url =
          "https://orianshechter.github.io/blood-donation-addresses/addresses.json";
        console.log(url)
        let request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.onload = function () {
          if (this.status === 200) {
            try {
              const dataFromGitHub = JSON.parse(this.response) 
              const dataFromGitHubWithLocations = dataFromGitHub.filter(a => a.address.location && a.address.formatted !== 'bad_address')  
              setAddressesObjets(dataFromGitHubWithLocations.map(addressObj => {
                if(addressObj.address.location)
                  return{
                      ...addressObj,
                      isPopupOpen: false,
                      isListHovered: false,
                  }
              }));
            } catch (e) {
              console.log(e.message);
            }
          } else if (this.status === 400) {
            setAddressesObjets([])
          }
          // console.log(data);
        };
        request.send();
      }, []);
    
      
    return(
        <AddressesContext.Provider value = {{addressesObjects, setAddressesObjets,onMouseAddressHover,onMouseAddressOut}}>
            {children}
        </AddressesContext.Provider>
    )
}