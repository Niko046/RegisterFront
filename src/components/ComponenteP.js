import React, { Component } from "react";

class ComponenteP extends Component{

    render(){
        let receta= {
            nombre: 'pizza',
            ingredientes: ['tomate','queso','jamon cocido'],
            calorias: 500
        }

        return(
           <React.Fragment>
           <h1>{'Receta '+ receta.nombre}</h1>
           <h2>{'Calorias '+ receta.calorias}</h2>
           <ol>
               {
                  receta.ingredientes.map((ingrediente,i)=>{
                      console.log(ingrediente);
                      return(
                          <li key= {i}>
                              {ingrediente}
                          </li>
                      );
                  })

               }
           </ol>
           </React.Fragment>
        );
    }
}

export default ComponenteP;