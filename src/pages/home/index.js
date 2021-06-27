import React, { useEffect, useState } from "react";

import MiniSearch from 'minisearch';
import Papa from 'papaparse'
import numeral from 'numeral';

import {
  BrowserRouter as Router,
  useHistory
} from "react-router-dom";
import '../../styles/main.css';
import './style.css';

export default function Home() {

  let loading = false;

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  let [latest, setLatest] = useState([]);

  let history = useHistory();

  let [openSearch, setOpenSearch] = useState(false);

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setOpenSearch(false);
      history.push(`_search?url=${search}`);
    }
  }

  const getListing = () =>{
    return fetch('http://admin.aletheiadata.org/alexandrias')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.length > 0){
        setLatest(data);
      }
    });
  }

  useEffect(()=>{
    getListing();
  }, [])

  const Card = (result, i) =>{
    return(
      <div className="card" key={`card_${i}}`}>
          <div className="courses-container col-xs-6">
              <div className="course">
                  <div className="course-preview">
                      <h6>{ result.published_at }</h6>
                      <h2>{ result.title }</h2>
                  </div>
                  <div className="course-info">
                    <h6>{ result.description }</h6>
                    <pre>
                      <ul>
                        <li style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}>
                          <b>{ 'Fuente: ' }</b>
                          <a href={result.source_url} target="_blank">
                            <p style={{ margin: 0,marginLeft: 10 }}>{ result.source_url }</p>
                          </a>
                        </li>
                        <li style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}>
                          <b>{ 'Status: ' }</b><p style={{ margin: 0,marginLeft: 10 }}>{ result.status }</p>
                        </li>
                      </ul>
                    </pre>
                    <button className="btn" onClick={()=>history.push(`_search?url=${result.cid}.ipfs.dweb.link`)}>
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

  return (
    <div className="home">
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
        <button id="btn-search-close" onClick={()=>setOpenSearch(false)} className="btn btn--search-close" aria-label="Close search form"><svg className="icon icon--cross"><use xlinkHref="#icon-cross"></use></svg></button>
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
            placeholder="Find..."
            autoComplete="off" 
            autoCorrect="off" 
            autoCapitalize="off" 
            spellCheck="false" />
          <span className="search__info">Hit enter to search or ESC to close</span>
        </div>
      </div>
      <div className={ `page ${openSearch ? 'page--move' : '' }` }>
        
        <div className="page__folder page__folder--dummy"></div>
        <div className="page__folder page__folder--dummy"></div>
        <div className="page__folder page__folder--dummy"></div>
        
        <main className="main-wrap page__folder">
          <header className="listing-header">
            <div className="listing-links">
              {/* <a className="codrops-icon codrops-icon--prev" href="" title="Previous Demo"><svg className="icon icon--arrow"><use xlinkHref="#icon-arrow"></use></svg></a> */}
              <a className="codrops-icon codrops-icon--drop" href="" title="Back to the article"><img style={{ width: '25px' }} src="/assets/img/logo.svg"></img></a>
            </div>
            <h1 className="listing-header__title">Heptastadion (HEP)</h1>
            <div className="search-wrap hide">
              <button id="btn-search" onClick={()=>setOpenSearch(true)} className="btn btn--search"><svg className="icon icon--search"><use xlinkHref="#icon-search"></use></svg></button>
            </div>
          </header>
          <div className="content">
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
            <div className="content-page">
              <div className="content-intro">
                <h1>Heptastadion, el puente hacia Alexandrià<br /></h1>
                <h3>La <b>Biblioteca de Alexandría</b> es un espacio virtual diseñado para preservar y hacer crecer el conocimiento de la humanidad. Haciendo que el Web sea más resistente y abierto. 
                    <br /><br />
                    Este servicio tiene como tarea guardar una copia de la información que viene emitida por parte del estado hacerla “unstoppable” atrevés de la tecnología blockchain. 
                    <br /><br />
                    Todos los archivos seràn disponibles en <a href="https://ipfs.io/" target="_blank">IPFS (Interplanetary File System)</a> en modo que sean incensurables, inmutables, y disponible en todo momento.
                    <br /><br />
                    Esta información estará distribuida P2P y no será posible cancelarla o removerla de la red.</h3>
              </div>
            </div>
            <div className="content-page faq">
              <div className="content-intro">
                <h4>FAQ</h4>
                <h3>¿Que hacer con este tool?</h3>
                Bueno, puedes buscar las botellas del gobierno, puedes consultar el gasto que se hace con tus taxes, tambien nos puedes simplemente <a href="https://www.buymeacoffee.com/aletheiadata" target="_blank">ofrecer una cerveza</a> 🍻
                <br /><br />
                <h3>¿Por que usar una solución descentralizada?</h3>
                Apoyarnos sobre una plataforma descentralizada nos brinda la garantía que la información no va a ser modificada, hackeada, o corrompida. También nos brinda la mejor opción para mantener la información siempre disponible (no hay servers que provisionar).
                <br /><br />
                <h3>¿A que te refieres con hacer la información 'unstoppable'?</h3>
                Unstoppable o decentralized information quiere decir que la información no está ubicada en una localidad fija (o server) sino que está distribuido en la red atrevés de IPFS, no se puede modificar ya que habría que descriptar los bloques del blockchain y te aseguro no es tarea fácil, y ultimo está siempre disponible ya que vive en cada uno de nuestros computadores.
              </div>
            </div>
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
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
