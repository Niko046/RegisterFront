import React, { Component } from 'react';
import '../css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faRightToBracket} from '@fortawesome/free-solid-svg-icons';
import logotipo from '../assets/images/logoo.jpeg';

const baseUrl="https://udos.herokuapp.com/api/v1/usuario/";
const baseUr2="https://udos.herokuapp.com/api/v1/coordinador/";
const baseUr3="https://udos.herokuapp.com/api/v1/lider/";
const cookies = new Cookies();
var testigo=0;

class Login extends Component {
    state={
      administrador: [],
      test: 0,
      data: [],
        form:{
            id: '',
            username: '',
            password: ''
        }
    }
  
    handleChange=async e=>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }
  
  


    iniciarSesion=async()=>{
      console.log(this.state.form.username);
      console.log(this.state.form.password);
      testigo=0;
      axios.get(baseUrl).then(response => {
        this.setState({ administrador: response.data.data });
        this.state.administrador.map(administrado => {
          if(administrado.id== this.state.form.username && administrado.password== this.state.form.password){
            cookies.set('idAdmin', administrado.id, {path: "/"});
            this.setState({ test: 1 });
            swal(`Bienvenido`);
            window.location.href="./principal";
          }
        })
        
        


        axios.get(baseUr2).then(response => {
          this.setState({ administrador: response.data.data });
          this.state.administrador.map(administrado => {
            if(administrado.username== this.state.form.username && administrado.password== this.state.form.password){
              cookies.set('idCoordinador', administrado.username, {path: "/"});
              this.setState({ test: 1 });
              swal(`Bienvenido`);
              window.location.href="./coordinador";
            }
          })


          axios.get(baseUr3).then(response => {
            this.setState({ administrador: response.data.data });
            this.state.administrador.map(administrado => {
              if(administrado.username== this.state.form.username && administrado.password== this.state.form.password){
                cookies.set('idLider', administrado.username, {path: "/"});
                cookies.set('nombreL', administrado.nombres, {path: "/"});
                cookies.set('ApellidoL', administrado.apellido_paterno +" " + administrado.apellido_materno ,{path: "/"});
                this.setState({ test: 1 });
                swal(`Bienvenido`);
                window.location.href="./lider";
              }
            })
            if (this.state.test==0){swal(`Usuario o contraseña incorrectos`);} 
          })

        })





      })


    
      

      
      
      
      
      
  }




  
    componentDidMount() {
      cookies.remove('idAdmin', {path: "/"});
      cookies.remove('idCoordinador', {path: "/"});
      cookies.remove('idLider', {path: "/"});
      testigo=0;
    }
    
  
    render() {
        return (
<div className='todo'>
    <header>
        <div class="container">
             
            <p class="logo"> <img src={logotipo} ></img>  UNIDAD DEMOCRATICA DE ORGANIZACIONES SOCIALES</p>
        </div>
    </header>
    <div className="containerPrincipal">
    

        <div className="containerSecundario">
          <div className="form-group">
          <h1><FontAwesomeIcon icon={faUser}/></h1>
          <h2>Iniciar sesion</h2>
          <br></br>
            <label>Usuario: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="username"
              onChange={this.handleChange}
            />
            <br />
            <label>Contraseña: </label>
            <br />
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={this.handleChange}
            />
            <br />
            <button className="btn btn-primary" onClick={()=> this.iniciarSesion()}>Iniciar Sesión <FontAwesomeIcon icon={faRightToBracket}/></button>
          </div>
        </div>
      </div>
      </div>
        );
    }
  }
  
  
  
  export default Login;