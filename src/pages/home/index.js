import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import Clipboard from 'react-clipboard.js';

import moment from 'moment';
import 'moment/locale/es';

import {
  BrowserRouter as Router,
  useHistory
} from "react-router-dom";

import Menu from '../../components/Menu';
import ModalUpload from '../../components/ModalUpload';
import ModalVerify from '../../components/ModalVerify';

import '../../styles/main.css';
import './style.css';

moment.locale('es');

export default function Home() {

  const web3 = new Web3(window.ethereum);

  let [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  let [latest, setLatest] = useState([]);
  let [all, setAll] = useState([]);
  let [departments, setDepartments] = useState([]);

  let [connected, setConnected] = useState(false);
  let [account, setAccount] = useState('');
  let [balance, setBalance] = useState('');
  let [netId, setNetId] = useState('');
  let [accounts, setAccounts] = useState('');

  let [openModal, setOpenModal] = useState(false);
  let [modalData, setModalData] = useState({});

  let history = useHistory();

  let [openSearch, setOpenSearch] = useState(false);

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setOpenSearch(false);
      history.push(`_search?url=${search}`);
    }
  }

  // init web3 if available
  const initWeb3 = async () =>{
    if(typeof window.ethereum!=='undefined'){
      // first of all enabled ethereum
      await window.ethereum.enable();
        
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()

      // console.log(web3, accounts);

      //load balance
      if(accounts[0] && typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])

        // console.log('check accounts: ', accounts);

        setConnected(true);
        setBalance(balance);
        setAccount(accounts[0]);
        setNetId(netId);
        setAccounts(accounts);
        
      } else {
        window.alert('Please login with MetaMask');
        return;
      }

      //load contracts
      /*
      TODO: create contracts for uploads' credit
      */
    } else {
      window.alert('Please install MetaMask')
    }
  }

  const getListing = () =>{
    setLoading(true);
    let endpoint_admin = 'https://aletheia-alexandria.herokuapp.com';
    return fetch(`${endpoint_admin}/alexandrias`)
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      if (data.length > 0){
        setLatest(data);
        setAll(data);
        setLoading(false);
      }
    });
  }

  const getDepartment = () =>{
    let endpoint_admin = 'https://aletheia-alexandria.herokuapp.com';
    return fetch(`${endpoint_admin}/departments`)
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      if (data.length > 0){
        setDepartments(data);
      }
    });
  }

  useEffect(()=>{
    getListing();
    getDepartment();
    initWeb3();
  }, [])

  const Card = (result, i) =>{

    const api_host = 'https://api-aletheiadata.herokuapp.com';
    const api_endpoint = 'https://rapidapi.com/aletheia-data-aletheia-data-default/api/aletheia2';
    
    return(
      <div className="card" key={`card_${i}}`}>
          <div className="courses-container col-xs-6">
              <div className="course">
                  <div className="course-preview">
                      <h6>{ moment(result.published_at).format('MMMM Do YYYY') }</h6>
                      <h2>{ result.title }</h2>
                  </div>
                  <div className="course-info">
                    <h6>{ result.description }</h6>
                    <pre>
                      <ul>
                        <li style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}>
                          <b>{ 'CID: ' }</b>
                          <a href={`https://${result.cid}.ipfs.dweb.link`} target="_blank">
                            <p style={{ margin: 0,marginLeft: 10 }}>{ result.cid }</p>
                          </a>
                        </li>
                        <li style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}>
                          <b>{ 'Source: ' }</b>
                          <a href={result.source_url} target="_blank">
                            <p style={{ margin: 0,marginLeft: 10 }}>{ result.source_url }</p>
                          </a>
                        </li>
                        <li style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}>
                          <b>{ 'Proof: ' }</b>
                          <a href={ result.proof ? result.proof.url : '#'} target="_blank">
                            <p style={{ margin: 0, marginLeft: 10 }}>{ result.proof ? result.proof.url : 'Not yet available' }</p>
                          </a>
                        </li>
                        <li style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}>
                          <b>{ 'API: ' }</b>
                          <a href={ api_endpoint } target="_blank">
                            <p style={{ margin: 0,marginLeft: 10 }}>{ result.api_enabled ? result.api_endpoint ? result.api_endpoint : api_endpoint : `Not available yet` }</p>
                          </a>
                        </li>
                        <li style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}>
                          <b>{ 'Status: ' }</b><p style={{ margin: 0,marginLeft: 10 }}>{ result.status }</p>
                        </li>
                        <li style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}>
                          <b>{ 'Type: ' }</b><p style={{ margin: 0,marginLeft: 10 }}>{ result.type }</p>
                        </li> 
                      </ul>
                    </pre>
                    <button className="btn" onClick={()=>{
                      if (result.type === 'csv'){
                        history.push(`_search?url=${result.cid}.ipfs.dweb.link`)                        
                      } else {
                        window.open(`https://${result.cid}.ipfs.dweb.link`,'_blank');
                      }
                    }}>
                      <p style={{ margin: 0 }}>{ 'CONSULTAR' }</p>
                    </button>
                </div>
              </div>
          </div>
      </div>
    )
  }

  const searchChange = (e) =>{
    loading = true;
    let value = e.target.value;
    setSearch(value);
    if (!value){
      setResults([])
    }
  }

  const selectDepartment = (e) =>{
    console.log(e, latest);
    let new_items = all.filter( i => i.department?.id === e);
    setLatest(new_items);
    console.log(latest);
    setOpenSearch(false);
    // results
  }

  return (
    <div className="home">
      <a href="https://github.com/EnzoVezzaro/heptastadion.aletheiadata.org" className="github-corner" aria-label="View source on GitHub" target="_blank">
        <svg width="80" height="80" viewBox="0 0 250 250" style={{ fill:'#f5f5dc', color:'#22295f', position: 'absolute', top: 0, border: 0, right: 0 }} aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: '130px 106px' }} className="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path>
        </svg>
      </a>
      <svg className="hidden">
        <defs>
          <symbol id="icon-arrow" viewBox="0 0 24 24">
            <title>arrow</title>
            <polygon points="6.3,12.8 20.9,12.8 20.9,11.2 6.3,11.2 10.2,7.2 9,6 3.1,12 9,18 10.2,16.8 "/>
          </symbol>
          <symbol id="icon-drop" viewBox="0 0 24 24">
            <title>drop</title>
            <path d="M12,21c-3.6,0-6.6-3-6.6-6.6C5.4,11,10.8,4,11.4,3.2C11.6,3.1,11.8,3,12,3s0.4,0.1,0.6,0.3c0.6,0.8,6.1,7.8,6.1,11.2C18.6,18.1,15.6,21,12,21zM12,4.8c-1.8,2.4-5.2,7.4-5.2,9.6c0,2.9,2.3,5.2,5.2,5.2s5.2-2.3,5.2-5.2C17.2,12.2,13.8,7.3,12,4.8z"/><path d="M12,18.2c-0.4,0-0.7-0.3-0.7-0.7s0.3-0.7,0.7-0.7c1.3,0,2.4-1.1,2.4-2.4c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7C15.8,16.5,14.1,18.2,12,18.2z"/>
          </symbol>
          <symbol id="icon-search" viewBox="0 0 24 24">
            <title>search</title>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </symbol>
          <symbol id="icon-cross" viewBox="0 0 24 24">
            <title>cross</title>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </symbol>
        </defs>
      </svg>
      <div className={ `search ${openSearch ? 'search--open' : '' }` }>
        <button id="btn-search-close" onClick={()=>setOpenSearch(false)} className="btn btn--search-close" aria-label="Close search form">
          <svg className="icon icon--cross"><use xlinkHref="#icon-cross"></use></svg>
        </button>
        <div className="search__form icon-departments-container">
          {
            departments.length > 0 &&
            <Menu departments={departments} select={selectDepartment} />
          }
          {/**
           * <input 
            className="search__input" 
            onKeyDown={_handleKeyDown} 
            name="search" 
            type="search" 
            name= {'search'}
            value = {search}
            disabled = { loading }
            onChange={searchChange}
            placeholder="Find..."
            autoComplete="off" 
            autoCorrect="off" 
            autoCapitalize="off" 
            spellCheck="false" />
          <span className="search__info">Hit enter to search or ESC to close</span>
           */}
        </div>
      </div>
      <div className={ `page ${openSearch ? 'page--move' : '' }` }>
        
        <div className="page__folder page__folder--dummy"></div>
        <div className="page__folder page__folder--dummy"></div>
        <div className="page__folder page__folder--dummy"></div>
        
        <main className="main-wrap page__folder">
          <header className="listing-header">
            <div className="logo">
              <div className="listing-links">
                {/* <a className="codrops-icon codrops-icon--prev" href="" title="Previous Demo"><svg className="icon icon--arrow"><use xlinkHref="#icon-arrow"></use></svg></a> */}
                <a className="codrops-icon codrops-icon--drop" href="" title="Back to the article"><img style={{ width: '60px' }} src="/assets/img/logo.svg"></img></a>
              </div>
              <h1 className="listing-header__title">Heptastadion (HEP)</h1>
            </div>
            <button onClick={initWeb3} title="Rewards coming soon!" className="connect-btn">
              <div className={ `${connected ? 'connected' : 'disconnected'}-light` } ></div>
              {connected ? 'connected' : 'disconnected' }
            </button>
            <div className="metamask">
              Whant to help? Download a crypto wallet to help us out.<br />we recommend using <b><a href="https://metamask.io/" target="_blank">Metamask</a></b>
            </div>
            {/*
            <div className="search-bar">
              <div className={ `search search--open` }>
                <div className="search__form">
                  <input 
                    className="search__input" 
                    onKeyDown={_handleKeyDown} 
                    name="search" 
                    type="search" 
                    name= {'search'}
                    value = {search}
                    disabled = { loading }
                    onChange={searchChange}
                    placeholder="Entra URL..."
                    autoComplete="off" 
                    autoCorrect="off" 
                    autoCapitalize="off" 
                    spellCheck="false" />
                  <span className="search__info">Hit enter to search</span>
                </div>
              </div>
            </div>
             */}
            <div className="search-wrap">
              <button id="btn-search" onClick={()=>setOpenSearch(true)} className="btn btn--search">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-back" viewBox="0 0 16 16">
                  <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
                </svg>
              </button>
            </div>
          </header>
          <div className="content">
            <div className="content-page">
              <div className="content-intro">
                <h1><b>Heptastadion</b>: el puente hacia Alexandria<br /></h1>
                <h3>La <b>Biblioteca de Alexandria</b> es un espacio virtual diseñado para preservar y hacer crecer el conocimiento de la humanidad, haciendo la Web más resistente y abierto. 
                    <br /><br />
                    Este servicio tiene como tarea registrar una copia de toda información publica emitida por las autoridades y hacerlas “<b>unstoppable</b>” a trevés de la tecnología blockchain. 
                    <br /><br />
                    Todos los archivos seràn distribuidos por <a href="https://ipfs.io/" target="_blank">IPFS (Interplanetary File System)</a> haciéndolos incensurables, inmutables, y disponible en todo momento.
                    <br /><br />
                    Una vez en la red <b>P2P</b> no será posible <b>cancelar</b> o <b>remover</b> la información de la red.</h3>
              </div>
            </div>
            <div className="content-page faq">
              <div className="content-intro">
                <h2>FAQ</h2>
                <br />
                <h3>¿Qué hacer con este tool?</h3>
                Bueno, puedes usar nuestro API para crear herramientas para la busqueda de las botellas del gobierno, o para consultar el gasto que se hace con nuestros impuestos, o simplemente usar la data con fines analíticos o de investigación.
                <br /><br />
                <h3>¿Por qué usar una solución descentralizada?</h3>
                Usar una plataforma descentralizada nos brinda la garantía que la información no va a ser modificada, hackeada, o corrompida. También nos brinda la mejor opción para mantener la información segura y siempre disponible ( 24h/7d ); ya que nuestro gobierno hace un <a href="#" onClick={()=>{history.push(`_why`)}}>horrible trabajo</a> en esto.
                <br /><br />
                <h3>¿A qué te refieres con hacer la información 'unstoppable'?</h3>
                Unstoppable o decentralized information quiere decir que la información no está ubicada en una localidad fija (o server) sino que está distribuido en la red P2P de IPFS. Una vez un archivo entra en el sistema no se puede modificar ni cancelar, ya que vive en cada uno de nuestros computadores.
                <br /><br />
                <h3>¿Qué es un CID en IPFS?</h3>
                Un identificador de contenido, o CID (<a href="https://docs.ipfs.io/concepts/content-addressing/" target="_blank">Content Identifier</a> por su siglas en ingles), es un hash criptográfico del contenido que se usa para indicar el archivo digital en IPFS. No indica dónde se almacena el contenido, sino que forma una especie de "dirección" basada en el contenido mismo. El CID es corto, independientemente del tamaño de su contenido subyacente.
                <br /><br />
              </div>
            </div>
            {
              connected && departments.length > 0 &&
              <div className="content-page contributor-section">
                <div className="contributor-container">
                  <h3>¿Quieres contribuir?<sup>*</sup> </h3>
                  Puedes ayudarnos de varias formas:
                  <br /><br />
                  <div className="contributor-choices">
                    <div className="contributor-buttons">
                      <ModalUpload wallet={account} departments={departments} />
                      <ul>
                        <li>Puedes contribuir alimentando<br />el ecosistema Aletheia</li>
                      </ul>
                    </div>
                    <div className="contributor-buttons">
                      <ModalVerify wallet={account} departments={departments} />
                      <ul>
                        <li>Puedes contribuir verficando<br />que la información sea correcta</li>
                      </ul>
                    </div>
                  </div>
                  <span className="contribution-disc"><sup>*</sup> all contributors' wallets will be saved for <b>future Airdrop</b> 🚀</span>
                </div>
              </div>
            }
            <div className="content-page listing">
              <div className="content-intro">
                <h3>Latest Uploads</h3>
                El acceso a la informacion es vital para una democracia saludable. Por eso en Aletheia estamos comprometidos con hacer el flujo de la información fácil, rápida, y disponible en todo momento.
                <br /><br />
                <div className="latest">
                  {
                    latest &&
                    latest.map((item, i) => {
                      return Card(item, i);
                    })
                  }
                  {
                    loading &&
                    <div className="loader-container">
                      <div className="loader"></div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="copyright">
                  Made by 👨‍💻 who believe in a better world
                  <br /><br />
                  <a 
                    href="https://gitcoin.co/grants/3179/aletheia-data"
                    target="_blank"
                  >
                    <b>Donate to wallet</b>
                  </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
