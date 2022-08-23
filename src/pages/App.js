import React, { Component } from 'react';
import './App.css';


import Cookies from 'universal-cookie';

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEdit, faEye, faPrint, faTrashAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ReactToPrint from 'react-to-print';
import swal from 'sweetalert';
const url = "https://udos.herokuapp.com/api/v1/lider/";
const ur2 = "https://udos.herokuapp.com/api/v1/promovido/promovidos/";
const ur3 = "https://udos.herokuapp.com/api/v1/promovido/";
const ur4 = "https://udos.herokuapp.com/api/v1/lider/lideres/";

const cookies = new Cookies();




/* *******************************************************************************************************************************************/



/* *******************************************************************************************************************************************/


class App extends Component {
  state = {
    data: [],
    registros:[],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      username: '',
      password: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      coordinador: '',
      tipoModal: ''
    }
  }


  peticionGet = () => {
    axios.get(ur4+cookies.get('idCoordinador')).then(response => {
      this.setState({ data: response.data.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => { 
    this.state.form.coordinador=cookies.get('idCoordinador');
    if(this.state.form!=null){
if(this.state.form.nombres!=null && this.state.form.nombres!='' && 
this.state.form.apellido_paterno!=null  && this.state.form.apellido_paterno!=''&&
this.state.form.apellido_materno!=null  && this.state.form.apellido_materno!=''&&
this.state.form.username!=null  && this.state.form.username!=''&&
this.state.form.password!=null  && this.state.form.password!=''){
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      swal(response.data.mensaje);
    }).catch(error => {
      console.log(error.message);
    })
    }
    else{swal("Todos los campos son requeridos"); }}
    else{swal("Todos los campos son requeridos");}
  }


  peticionPut = () => {
    axios.put(url + this.state.form.username, this.state.form).then(response => {
      
      this.modalEditar();
      this.peticionGet();
      this.modalEstado();

    })
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.username).then(response => {
      

      axios.get(ur2 + this.state.form.username).then(response => {
        this.setState({ registros: response.data.data });
        console.log(this.state.registros);
      

        this.state.registros.map(registro => {
          return (
            axios.delete(ur3 + registro.curp).then(response => {
              
            })
          )
        })
      })
      this.setState({ modalEliminar: false });
      this.peticionGet();

    })

    
    

  }

  liderSeleccionados = () => {
    axios.delete(url + this.state.form.username).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  modalEditar = () => {
    this.setState({ modalEditar: !this.state.modalEditar });
  }

  modalEstado = () => {
    this.setState({ modalEstado: !this.state.modalEstado });
  }


  modalEliminar = () => {
    this.setState({ modalEliminar: !this.state.modalEliminar })
  }

  seleccionarLider = (lider) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        username: lider.username,
        nombres: lider.nombres,
        apellido_paterno: lider.apellido_paterno,
        apellido_materno: lider.apellido_materno,
        password: lider.password,
        coordinador: lider.coordinador
      }
      
    })
    cookies.set('identificador', lider.username, {path: "/"});
    cookies.set('idLider', lider.username, {path: "/"});
  }

  ObtenerLider = (lider) => {
    cookies.set('idLider', lider.username, {path: "/"});
    cookies.set('identificador', lider.username, {path: "/"});
    cookies.set('nombreL', lider.nombres, {path: "/"});
    cookies.set('ApellidoL', lider.apellido_paterno +" " + lider.apellido_materno ,{path: "/"});
    window.location.href="./lider";
  }



  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount() {
    if(!cookies.get('idCoordinador')){
      window.location.href="./";
  }

  this.peticionGet();
  }
  
  cerrarSesion=()=>{
    cookies.remove('idCoordinador', {path: "/"});
    cookies.remove('idLider', {path: "/"});
    window.location.href='./';
}

atrasar=()=>{
  cookies.remove('idCoordinador', {path: "/"});
  cookies.remove('idLider', {path: "/"});
  window.location.href='./principal';
}


  render() {
    console.log("la id es: "+cookies.get('id'));
    console.log("el usuario es: "+cookies.get('username'));

    const { form } = this.state;
    return (

      <div className="App">

<header>
        <div class="container">
             
            <p class="logo"> REGISTRO DE LIDERES</p>
        </div>
    </header>

        <br></br>

        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Crear lider</button>
        {"   "}
        {
          cookies.get('idAdmin') ?
                <button className="btn btn-warning" onClick={()=>this.atrasar()}>
                  Atras
                </button> : <button className="btn btn-danger" onClick={()=>this.cerrarSesion()}>
                Cerrar sesion
                </button>
              }
        <br /><br />
        <h5> El numero de Lideres registrados es: {this.state.data.length}</h5>
        <br></br>
        <table className="table table-hover table-responsive text-justify">
          <thead className='table-dark '>
            <tr>
              <th>Usuario</th>
              <th>Nombres</th>
              <th>Apellido paterno</th>
              <th>Apellido materno</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(lider => {
              return (
                <tr key={lider.username}>
                  <td>{lider.username}</td>
                  <td>{lider.nombres}</td>
                  <td>{lider.apellido_paterno}</td>
                  <td>{lider.apellido_materno}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarLider(lider); this.modalEditar() }}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarLider(lider); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                    {"   "}
                    <button className="btn btn-warning" onClick={() => { this.ObtenerLider(lider);  }}><FontAwesomeIcon icon={faEye} /></button>
                  </td>


                </tr>
              )
            })}
          </tbody>
        </table>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }} className='bg-success text-white'>
            CREAR NUEVO LIDER
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
            <label htmlFor="nombres">Nombres</label>
              <input className="form-control" type="text" name="nombres" id="nombres" required onChange={this.handleChange} value={form ? form.nombres : ''} />
              <br />
              <label htmlFor="apellido_paterno">Apellido paterno</label>
              <input className="form-control" type="text" name="apellido_paterno" id="apellido_paterno" required onChange={this.handleChange} value={form ? form.apellido_paterno : ''} />
              <br />
              <label htmlFor="apellido_materno">Apellido materno</label>
              <input className="form-control" type="text" name="apellido_materno" id="apellido_materno" required onChange={this.handleChange} value={form ? form.apellido_materno : ''} />
              <br />
              <label htmlFor="username">Usuario</label>
              <input className="form-control" type="text" name="username" id="username" required onChange={this.handleChange} value={form ? form.username : ''} />
              <br />
              <label htmlFor="password">Contraseña</label>
              <input className="form-control" type="text" name="password" id="password" required onChange={this.handleChange} value={form ? form.password : ''} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader style={{ display: 'block' }} className="bg-primary text-white">
            ACTUALIZAR LIDER
            <span style={{ float: 'right' }} onClick={() => this.modalEditar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input className="form-control" type="text" name="nombres" id="nombres"  onChange={this.handleChange} value={form ? form.nombres : this.state.data} />
              <br />
              <label htmlFor="apellido_paterno">Apellido paterno</label>
              <input className="form-control" type="text" name="apellido_paterno" id="apellido_paterno" onChange={this.handleChange}  value={form ? form.apellido_paterno : this.state.data} />
              <br />
              <label htmlFor="apellido_materno">Apellido materno</label>
              <input className="form-control" type="text" name="apellido_materno" id="apellido_materno" onChange={this.handleChange}  value={form ? form.apellido_materno : this.state.data} />
              <br />
              <label htmlFor="username">Usuario</label>
              <input className="form-control" type="text" name="username" id="username" readOnly required onChange={this.handleChange} value={form ? form.username : this.state.data} />
              <br />
              <label htmlFor="password">Contraseña</label>
              <input className="form-control" type="text" name="password" id="password" required onChange={this.handleChange} value={form ? form.password : this.state.data} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalEditar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
          <ModalHeader style={{ display: 'block' }} className="bg-danger text-white">
            ELIMINAR LIDER
            <span style={{ float: 'right' }} onClick={() => this.modalEliminar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
          </ModalHeader>
          <ModalBody>
            Estás seguro que deseas eliminar a {form && form.nombres +" " +form.apellido_paterno+" "+ form.apellido_materno}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-primary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>

        
      </div>








    );
  }
}






export default App;