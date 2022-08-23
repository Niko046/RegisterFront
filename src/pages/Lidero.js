import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEdit, faEye, faPrint, faTrashAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';
const url = "https://udos.herokuapp.com/api/v1/promovido/";
const ur2 = "https://udos.herokuapp.com/api/v1/promovido/promovidos/";
const cookies = new Cookies();

class Lidero extends Component {

    cerrarSesion=()=>{
        cookies.remove('idLider', {path: "/"});
        window.location.href='./';
    }

    atrasar=()=>{
      cookies.remove('idLider', {path: "/"});
      window.location.href='./coordinador';
  }



    state = {
      data: [],
      datos: [],
      modalInsertar: false,
      modalEliminar: false,
      form: {
        usuarioCE: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        curp: '',
        calle: '',
        numero: '',
        colonia: '',
        municipio: '',
        seccion: '',
        telefono: '',
        email: '',
        documentos: '',
        identificador: '',
        nombrelider: ''
      }
    }
  
  
    peticionGet = () => {
      axios.get(ur2+cookies.get('idLider')).then(response => {
        this.setState({ data: response.data.data });
      }).catch(error => {
        console.log(error.message);
      })
    }
  
    peticionPost = async () => { 
        this.state.form.identificador=cookies.get('idLider');
        this.state.form.nombrelider=cookies.get('nombreL') +" "+cookies.get('ApellidoL');
        
      if(this.state.form!=null){
      if(this.state.form.usuarioCE!=null && this.state.form.nombre!=null && this.state.form.usuarioCE!='' && this.state.form.nombre!='' 
      && this.state.form.apellido_paterno!=null && this.state.form.apellido_paterno!=''
      && this.state.form.curp!=null && this.state.form.curp!=''
      && this.state.form.calle!=null && this.state.form.calle!=''
      && this.state.form.numero!=null && this.state.form.numero!=''
      && this.state.form.colonia!=null && this.state.form.colonia!=''
      && this.state.form.municipio!=null && this.state.form.municipio!=''
      && this.state.form.seccion!=null && this.state.form.seccion!=''
      && this.state.form.telefono!=null && this.state.form.numetelefonoro!=''
      && this.state.form.email!=null && this.state.form.email!=''
      && this.state.form.documentos!=null && this.state.form.documentos!=''
      ){

        this.state.form.usuarioCE=this.state.form.usuarioCE.toUpperCase();
        this.state.form.curp=this.state.form.curp.toUpperCase();

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
      axios.put(url + this.state.form.curp, this.state.form).then(response => {
        
        this.modalEditar();
        this.peticionGet();
        this.modalEstado();
  
      })
    }
  
    peticionDelete = () => {
      axios.delete(url + this.state.form.curp).then(response => {
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
  
    seleccionarPromovido = (promovido) => {
      this.setState({
        tipoModal: 'actualizar',
        form: {
            curp: promovido.curp,
            usuarioCE: promovido.usuarioCE,
            nombre: promovido.nombre,
            apellido_paterno: promovido.apellido_paterno,
            apellido_materno: promovido.apellido_materno,
            calle: promovido.calle,
            numero: promovido.numero,
            colonia: promovido.colonia,
            municipio: promovido.municipio,
            seccion: promovido.seccion,
            telefono: promovido.telefono,
            email: promovido.email,
            documentos: promovido.documentos,
            identificador: promovido.identificador,
            nombrelider: promovido.nombrelider
        }
      })
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
      if(!cookies.get('idLider')){
        window.location.href="./";
    }
      this.peticionGet();
    }
  
  
    render() {
        console.log('identificador: '+ cookies.get('identificador'));
        console.log('nombreL: '+ cookies.get('nombreL'));
        console.log('ApellidoL: '+ cookies.get('ApellidoL'));
      const { form } = this.state;
      return (
  
        <div className="App">
  

  <header>
        <div class="container">
             
            <p class="logo"> Registro de promovidos de {" "+cookies.get('nombreL') +" "+cookies.get('ApellidoL')}</p>
        </div>
    </header>

  
          <br></br>
         
          <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Crear Promovido</button>
          {"   "}
          
          {
          
          cookies.get('idCoordinador') ?
                <button className="btn btn-warning" onClick={()=>this.atrasar()}>
                  Atras
                </button> : <button className="btn btn-danger" onClick={()=>this.cerrarSesion()}>
                Cerrar sesion
                </button>
              }

          
          <br /><br />
          <h5> El numero de Promovidos registrados es: {this.state.data.length}</h5>
        <br></br>
          <table className="table table-hover table-responsive text-justify">
            <thead className='table-dark '>
              <tr>
              <th>Usuario C.E</th>
                <th>Nombre</th>
                <th>Apellido paterno</th>
                <th>Apellido materno</th>
                <th>Curp</th>
                <th>Calle</th>
                <th>Numero</th>
                <th>Colonia</th>
                <th>Municipio</th>
                <th>Seccion</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Documentos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(promovido => {
                return (
                  <tr key={promovido.curp}>
                    <td>{promovido.usuarioCE}</td>
                    <td>{promovido.nombre}</td>
                    <td>{promovido.apellido_paterno}</td>
                    <td>{promovido.apellido_materno}</td>
                    <td>{promovido.curp}</td>
                    <td>{promovido.calle}</td>
                    <td>{promovido.numero}</td>
                    <td>{promovido.colonia}</td>
                    <td>{promovido.municipio}</td>
                    <td>{promovido.seccion}</td>
                    <td>{promovido.telefono}</td>
                    <td>{promovido.email}</td>
                    <td>{promovido.documentos ? <p>Entregados</p> : <p>Pendientes</p>}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => { this.seleccionarPromovido(promovido); this.modalEditar() }}><FontAwesomeIcon icon={faEdit} /></button>
                      {"   "}
                      <button className="btn btn-danger" onClick={() => { this.seleccionarPromovido(promovido); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                      {"   "}
                    </td>
  
  
                  </tr>
                )
              })}
            </tbody>
          </table>
  
  
  
          <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{ display: 'block' }} className='bg-success text-white'>
              CREAR NUEVO PROMOVIDO
              <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="usuarioCE">Usuario C.E</label>
                <input className="form-control" type="text" name="usuarioCE" id="usuarioCE" required onChange={this.handleChange} value={form ? form.usuarioCE : ''} />
                <br />
                <label htmlFor="nombre">Nombre</label>
                <input className="form-control" type="text" name="nombre" id="nombre" required onChange={this.handleChange} value={form ? form.nombre : ''} />
                <br />
                <label htmlFor="apellido_paterno">Apellido paterno</label>
                <input className="form-control" type="text" name="apellido_paterno" id="apellido_paterno" required onChange={this.handleChange} value={form ? form.apellido_paterno : ''} />
                <br />
                <label htmlFor="apellido_materno">Apellido materno</label>
                <input className="form-control" type="text" name="apellido_materno" id="apellido_materno" required onChange={this.handleChange} value={form ? form.apellido_materno : ''} />
                <br />
                <label htmlFor="curp">Curp</label>
                <input className="form-control" type="text" name="curp" id="curp" required onChange={this.handleChange} value={form ? form.curp : ''} />
                <br />
                <label htmlFor="calle">Calle</label>
                <input className="form-control" type="text" name="calle" id="calle" required onChange={this.handleChange} value={form ? form.calle : ''} />
                <br />
                <label htmlFor="numero">Numero</label>
                <input className="form-control" type="text" name="numero" id="numero" required onChange={this.handleChange} value={form ? form.numero : ''} />
                <br />
                <label htmlFor="colonia">Colonia</label>
                <input className="form-control" type="text" name="colonia" id="colonia" required onChange={this.handleChange} value={form ? form.colonia : ''} />
                <br />
                <label htmlFor="municipio">Municipio</label>
                <input className="form-control" type="text" name="municipio" id="municipio" required onChange={this.handleChange} value={form ? form.municipio : ''} />
                <br />
                <label htmlFor="seccion">Seccion</label>
                <input className="form-control" type="text" name="seccion" id="seccion" required onChange={this.handleChange} value={form ? form.seccion : ''} />
                <br />
                <label htmlFor="telefono">Telefono</label>
                <input className="form-control" type="text" name="telefono" id="telefono" required onChange={this.handleChange} value={form ? form.telefono : ''} />
                <br />
                <label htmlFor="email">Email</label>
                <input className="form-control" type="text" name="email" id="email" required onChange={this.handleChange} value={form ? form.email : ''} />
                <br />
                <label htmlFor="documentos">Documentos</label>
                <select className="form-control" type="text" name="documentos" id="documentos" onChange={this.handleChange} value={form ? form.documentos : ''}>
                <option value=''>Elegir</option>
                <option value="true">Entregados</option>
                <option value="false">Pendientes</option>
              </select>
                <br />
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
              ACTUALIZAR PROMOVIDO
              <span style={{ float: 'right' }} onClick={() => this.modalEditar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
              <label htmlFor="usuarioCE">Usuario C.E</label>
                <input className="form-control" type="text" name="usuarioCE" id="usuarioCE" readOnly required onChange={this.handleChange} value={form ? form.usuarioCE : this.state.data} />
                <br />
                <label htmlFor="nombre">Nombre</label>
                <input className="form-control" type="text" name="nombre" id="nombre" required onChange={this.handleChange} value={form ? form.nombre : this.state.data} />
                <br />
                <label htmlFor="apellido_paterno">Apellido paterno</label>
                <input className="form-control" type="text" name="apellido_paterno" id="apellido_paterno" required onChange={this.handleChange} value={form ? form.apellido_paterno : this.state.data} />
                <br />
                <label htmlFor="apellido_materno">Apellido materno</label>
                <input className="form-control" type="text" name="apellido_materno" id="apellido_materno" required onChange={this.handleChange} value={form ? form.apellido_materno : this.state.data} />
                <br />
                <label htmlFor="curp">Curp</label>
                <input className="form-control" type="text" name="curp" id="curp" readOnly required onChange={this.handleChange} value={form ? form.curp : this.state.data} />
                <br />
                <label htmlFor="calle">Calle</label>
                <input className="form-control" type="text" name="calle" id="calle" required onChange={this.handleChange} value={form ? form.calle : this.state.data} />
                <br />
                <label htmlFor="numero">Numero</label>
                <input className="form-control" type="text" name="numero" id="numero" required onChange={this.handleChange} value={form ? form.numero : this.state.data} />
                <br />
                <label htmlFor="colonia">Colonia</label>
                <input className="form-control" type="text" name="colonia" id="colonia" required onChange={this.handleChange} value={form ? form.colonia : this.state.data} />
                <br />
                <label htmlFor="municipio">Municipio</label>
                <input className="form-control" type="text" name="municipio" id="municipio" required onChange={this.handleChange} value={form ? form.municipio : this.state.data} />
                <br />
                <label htmlFor="seccion">Seccion</label>
                <input className="form-control" type="text" name="seccion" id="seccion" required onChange={this.handleChange} value={form ? form.seccion : this.state.data} />
                <br />
                <label htmlFor="telefono">Telefono</label>
                <input className="form-control" type="text" name="telefono" id="telefono" required onChange={this.handleChange} value={form ? form.telefono : this.state.data} />
                <br />
                <label htmlFor="email">Email</label>
                <input className="form-control" type="text" name="email" id="email" required onChange={this.handleChange} value={form ? form.email : this.state.data} />
                <br />
                <label htmlFor="identificador">Lider</label>
                <input className="form-control" type="text" name="identificador" id="identificador" readOnly required onChange={this.handleChange} value={cookies.get('identificador')} />
                <br />
                <label htmlFor="documentos">Documentos</label>
                <select className="form-control" type="text" name="documentos" id="documentos" onChange={this.handleChange} value={form ? form.documentos : this.state.data}>
                <option value="true">Entregados</option>
                <option value="false">Pendientes</option>
              </select>
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
              ELIMINAR Promovido
              <span style={{ float: 'right' }} onClick={() => this.modalEliminar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
            </ModalHeader>
            <ModalBody>
              Estás seguro que deseas eliminar a {form && form.nombre +" " +form.apellido_paterno+ ""+ form.apellido_materno}
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



export default Lidero;