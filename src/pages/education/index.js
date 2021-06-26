import React, { useState, useEffect } from "react";

import MiniSearch from 'minisearch';
import Papa from 'papaparse'
import numeral from 'numeral';

import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

import '../../styles/main.css';
import './style.css';

export default function MINERD() {

  let [miniSearch, setMiniSearch] = useState("");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const file = urlParams.get('url');

  var response_index = '';

  const csv = `${file}`;
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const csvData = Papa.parse(csv, {
      download: true,
      header: true,
      complete: response => {
        
        let data = response.data;
        // console.log(data);
        if (data){
          let fields = response.meta.fields;
          let errors = response.meta.errors;
          console.log('GET Data: ', response);
          response_index = response;
          // add ids
          data.map((r, i) => { r.id = i; if (r.Nombre) return r; });
          // init minisearch
          miniSearch = new MiniSearch({
            fields: fields, // fields to index for full-text search
            storeFields: fields, // fields to return with search results
            searchOptions: {
              boost: { Nombre: 2 },
              fuzzy: 0.15
            }
          })
          setMiniSearch(miniSearch)
          // console.log(miniSearch);
          // Index all documents
          miniSearch.addAll(data);
          let input = document.getElementById('search');
          input.disabled = false;
          input.placeholder='Busca por nombre, función...';
  
          // add meta
          let filters = document.getElementById('filters');
          var filters_html = document.createElement('filters_html'); // is a node
          console.log(response_index.meta);
          filters_html.innerHTML = `<div>
            <div className="records-imported"></div>
            <div className="records-error"></div>
            <div className="records-meta">
              <div>
                <b>Delimiter: </b>
                <span>"${ response_index.meta.delimiter }"</span>
              </div>
              <br />
              <div>
                <b>Fields: </b>
                <span>
                  ${ response_index.meta.fields.map(field => {
                    return ' ' + field;
                  }) }
                </span>
              </div>
              <br />
              <div>
                <b>Total records: </b>
                <span>${ response_index.data.length }</span>
              </div>
              <br />
              <div>
                <b>Total error: </b>
                <span>${ response_index.errors.length }</span>
              </div>
              <br />
              <div>
                <b>Errors: </b><br />
                ${ response_index.errors.map(({ row, message })=> {
                  return `
                  <span>
                    row: ${row} - ${message} - ${ JSON.stringify(response_index.data[row])}
                  </span>`;
                }) }
              </div>
            </div>
          </div>`;
          filters.appendChild(filters_html);
        } else {
          let input = document.getElementById('search');
          input.classList.add("invalid");
          input.disabled = true;
          
          input.placeholder='File not alid';
        }
      },
      error: function(err, file, inputElem, reason)
      {
        let input = document.getElementById('search');
        input.classList.add("invalid");
        input.disabled = true;
        input.placeholder='File not found';
        // executed if an error occurs while loading the file,
        // or if before callback aborted for some reason
      }
    });
  }, [])

  let loading = false;

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState([]);
  let [page, setPage] = useState(1);
  let [perPage, setPerPage] = useState(20);
  let [pageCount, setPageCount] = useState(1);
  let [noResult, setNoResult] = useState(false);

  let [openSearch, setOpenSearch] = useState(false);

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setOpenSearch(false);
      let res = miniSearch.search(search);
      console.log('setting query result: ', res);

      setResults(res);
      if (res.length > 0){
        changePage(page, res);
      } else {
        setResultsPerPage(res);
        setNoResult(true);
      }
    }
  }
  
  const isServiceField = (key) =>{
    switch (key) {
      case 'highlight':
        return true
      case '_index':
        return true
      case '_type':
        return true
      case '_doc':
        return true
      case '_id':
        return true
      case '_score':
        return true
      case '_click_id':
        return true
      default:
        return false
    }
  }

  const getLabelInfo = (key, value) =>{
    //console.log(key, value);
    if (!isServiceField(key)){
      let skip = false;
      let isLink = false;
      switch (key) {
        case 'id':
          skip=true
          value = 0;
          key = 'id'
          break;
        case 'ANO':
          key = 'Año'
          break;
        case 'Funci�n':
          key = 'Función'
          break;
        case 'A�o':
          key = 'Año'
          break;
        case 'terms':
          skip=true
          value = 0;
          key = 'terms'
          break;
        case 'Estatus':
          skip=true
          value = 0;
          key = 'Estatus'
          break;
        case 'score':
          skip=true
          value = 0;
          key = 'score'
          break;
        case 'match':
          skip=true
          value = 0;
          key = 'Match'
          break;
        default:
      }
      // console.log(value);
      if (!skip){
        if (isLink) return <li key={key} style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}><b>{ key }:</b> <p style={{ margin: 0,marginLeft: 10 }}><a href={value} target='_blank' >{ 'Portal' }</a></p></li>;
        return <li key={key} style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}><b>{ key }:</b> <p style={{ margin: 0,marginLeft: 10 }}>{ value }</p></li>;
      }
    }
  }

  const Card = (result, i) =>{
    return(
      <div className="card" key={`card_${i}}`}>
          <div className="courses-container col-xs-6">
              <div className="course">
                  <div className="course-preview">
                      <h6>{ result.Estatus }</h6>
                      <h2>{ result.Nombre }</h2>
                  </div>
                  <div className="course-info">
                    <h6>{ result.Departamento }</h6>
                    <pre>
                      <ul>
                        {
                          Object.keys(result).map((k, v) => {
                            let val = result[k];
                            let label = getLabelInfo(k,val);
                            return label
                          })
                        }
                    </ul></pre>
                    <button className="btn">RD$ { numeral(result['Sueldo Bruto']).format('0,0.00') }</button>
                </div>
              </div>
          </div>
      </div>
    )
  }

  const EmptyCard = (title, description, body, button) =>{
    return(
      <div className="card">
          <div className="courses-container col-xs-6">
              <div className="course">
                  <div className="course-preview">
                      <h6>{ title }</h6>
                      <h2>{ description }</h2>
                  </div>
                  <div className="course-info">
                    <h6>{ body }</h6>
                    <button className="btn">{ button }</button>
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
      setResultsPerPage([])
      setPage(1);
      setPerPage(20);
    }
  }

  const handlePageClick = (data) =>{
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    this.setState({ offset: offset }, () => {
      this.loadCommentsFromServer();
    });
  };

  const prevPage = () =>
  {
      if (page > 1) {
        page--;
        changePage(page, results);
      }
  }

  const nextPage = () =>
  {
      if (page < numPages(results, page)) {
        page++;
        changePage(page, results);
      }
  }

  const changePage = (page, results) =>
  {
      // console.log('changing page: ', page);

      var btn_next = document.getElementById("btn_next");
      var btn_prev = document.getElementById("btn_prev");

      console.log(page);
      let pageCount = numPages(results, page);
      setPageCount(pageCount)
      console.log(pageCount);
      
      // Validate page
      if (page < 1) page = 1;
      if (page > pageCount) page = pageCount;

      // console.log(results);
      let res = [];
      for (var i = (page-1) * perPage; i < (page * perPage); i++) {
        // console.log('i: ', i);
        // console.log('from: ', (page-1) * perPage);
        // console.log('to: ', page * perPage);
        // console.log('res: ', results[Math.abs(i)]);
        let item = results[Math.abs(i)];
        if (item){
          res.push(item);
        }
      }
      
      // setResults(results)
      console.log(results.length);
      setResultsPerPage(res);
      
      if (page == 1) {
          btn_prev.style.visibility = "hidden";
      } else {
          btn_prev.style.visibility = "visible";
      }

      if (page == pageCount) {
          btn_next.style.visibility = "hidden";
      } else {
          btn_next.style.visibility = "visible";
      }

      // set new page
      if (page > 0){
        setPage(page);
      } else {
        resetSearch();
      }
  }

  const resetSearch = () =>
  {
    setPage(1);
    setPageCount(1)
  }

  const numPages = (res, page) =>
  {
      return Math.ceil(res.length / page);
  }

  return (
    <div className="listing">
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
              <Link className="codrops-icon codrops-icon--prev" to="/"><svg className="icon icon--arrow"><use xlinkHref="#icon-arrow"></use></svg></Link>
              <Link className="codrops-icon codrops-icon--drop" to="/"><img style={{ width: '25px' }} src="/assets/img/logo.svg"></img></Link> 
            </div>
            <h1 className="listing-header__title">Heptastadion</h1>
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
                    id="search" 
                    onKeyDown={_handleKeyDown} 
                    name="search" 
                    type="search" 
                    name= {'search'}
                    value = {search}
                    disabled = { loading }
                    onChange={searchChange}
                    placeholder="Loading..."
                    autoComplete="off" 
                    autoCorrect="off" 
                    autoCapitalize="off" 
                    spellCheck="false" />
                  <span className="search__info">Hit enter para buscar</span>
                </div>
              </div>
            </div>
            <div className="content-page">
              <div className="filters" id="filters"></div>
              <div className="results">
                {
                  resultsPerPage.length > 0 &&
                  resultsPerPage.map((res, i) => {
                    return Card(res, i);
                  })
                }
                {
                  resultsPerPage.length == 0 &&
                  noResult &&
                  EmptyCard('not found', 'not found', 'not found', 'not found')
                }
              </div>
            </div>
          </div>
          <div className="bottom-nav">
            <nav className="pagination-units">
              <div className="pagination">
                <a href="#" onClick={prevPage} id="btn_prev">Prev</a>
                <div>
                  page: <span id="page">{ page } / { pageCount }</span>
                </div>
                <a href="#" onClick={nextPage} id="btn_next">Next</a>
              </div>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}
