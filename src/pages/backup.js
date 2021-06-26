import React from 'react';
import { ReactiveBase, DataSearch, ReactiveList, SingleRange, MultiList, DynamicRangeSlider, SingleList  } from '@appbaseio/reactivesearch';

import { nav, container, leftCol, rightCol, search, logo} from '../../styles';

import '../../styles/search.css';

var numeral = require('numeral');

class Education extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
  }

  customQuery = (value) => {
    //console.log(value);
    if (!value) return;

    return {
      "query": {
        "match": { "NOMBRE_COMPLETO": value }
      }
      /*
      "size":0,
      "aggs":{
        "NOMBRE_COMPLETO":{
          "terms":{
            "field":"NOMBRE_COMPLETO",
            "size":100,
            "order":{
              "_count":"desc"
            }
          }
        }
      },
      "sort": [
        {
          "_timestamp": {
            "order": "desc"
          }
        }
      ]
      */
    }
  }

  renderInfo = (result) =>{
    return Object.keys(result).forEach( (key) =>{
      //console.log(key, result[key]);
      return (
        <li>
          <b>{ key }:</b> { result[key] }
        </li>
      )
    })
  }

  isServiceField = (key) =>{
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

  getLabelInfo = (key, value) =>{
    //console.log(key, value);
    let isServiceField = this.isServiceField(key);
    if (!isServiceField){
      let skip = false;
      let isLink = false;
      switch (key) {
        case 'ANO':
          key = 'Año'
          break;
        case 'NOMBRE_COMPLETO':
            key = 'Nombre Completo'
            break;
        case 'SEGURO_PENSION_EMPLEADO':
            skip = true;
            key = 'SEGURO_PENSION_EMPLEADO'
            break;
        case 'SUBTOTAL_TSS':
            skip = true;
            key = 'Subtotal Tss'
            break;
        case 'SEGURO_PENSION_PATRONAL':
            skip = true;
            key = 'SEGURO_PENSION_PATRONAL'
            break;
        case 'SEGURO_SALUD_EMPLEADO_PATRONAL':
            skip = true;
            key = 'SEGURO_SALUD_EMPLEADO_PATRONAL'
            break;
        case 'REGISTRO_DEPENDIENTES_ADD':
            skip = true;
            key = 'REGISTRO_DEPENDIENTES_ADD'
            break;
        case 'FUENTE':
            isLink=true;
            key = 'Fuente'
            break;
        case 'TERMINO':
            if (value === '00/00/0000') skip=true
            key = 'Termino'
            break;
        case 'ISR':
            if (value === 0) skip=true
            key = 'ISR'
            break;
        case 'APORTES_PATRONAL':
            skip = true;
            key = 'APORTES_PATRONAL'
            break;
        case 'SUELDO_BRUTO':
            value = `RD$ ${ numeral(value).format('0,0.00') }`;
            key = 'Sueldo Bruto'
            break;
        case 'TIPO_DE_EMPLEADO':
            key = 'Tipo de Empleado'
            break;
        case 'CARGO':
            key = 'Cargo'
            break;
        case 'MINISTERIO':
            key = 'Ministerio'
            break;
        case 'SUELDO_NETO':
            value = `RD$ ${ numeral(value).format('0,0.00') }`;
            key = 'Sueldo Neto'
            break;
        case 'SUELDO_US':
            if (value === 0) skip=true
            value = `$US ${ numeral(value).format('0,0.00') }`;
            key = 'Sueldo'
            break;
        case 'SEGURO_SAV_ICA':
            skip = true;
            key = 'SEGURO_SAV_ICA'
            break;
        case 'RIESGOS_LABORALES':
            skip = true;
            key = 'RIESGOS_LABORALES'
            break;
        case 'INICIO':
            if (value === '00/00/0000') skip=true
            key = 'Inicio'
            break;
        case 'MES':
            key = 'Mes'
            break;
        case 'DEPARTAMENTO':
            key = 'Departamento'
            break;
        case 'TOT_RETENCIONES_DEDUCCION_EMPLEADO':
            skip = true;
            key = 'TOT_RETENCIONES_DEDUCCION_EMPLEADO'
            break;
        case 'SEGURO_SALUD_EMPLEADO':
            skip = true;
            key = 'SEGURO_SALUD_EMPLEADO'
            break;
        case 'GASTOS_DE_REPRESENTACION_US':
            if (value === 0) skip=true
            value = `$US ${ numeral(value).format('0,0.00') }`;
            key = 'Gastos de Representacion'
            break;
        case 'TIPO_DE_EMPLEADO_CARGO':
            key = 'Tipo de Cargo'
            break;
        case 'ESTATU_EMPLEADO':
            key = 'Estatus Empleado'
            break;
        case 'TASA_RD':
          if (value === 0) skip=true
          value = `$RD ${ numeral(value).format('0,0.00') }`;
          key = 'Tasa de Cambio'
          break;
        case 'SUELDO_EUR':
          if (value === 0) skip=true
          value = `$EUR ${ numeral(value).format('0,0.00') }`;
          key = 'Sueldo'
          break;
        default:
      }
      if (!skip){
        if (isLink) return <li key={key} style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}><b>{ key }:</b> <p style={{ margin: 0,marginLeft: 10 }}><a href={value} target='_blank' >{ 'Portal' }</a></p></li>;
        
        return <li key={key} style={{ display: 'flex',alignItems: 'flex-start', whiteSpace: 'break-spaces' }}><b>{ key }:</b> <p style={{ margin: 0,marginLeft: 10 }}>{ value }</p></li>;
      }
    }
  }

  render(){
    
    let indexes = [
      "mirex-nominas-personal-2018-2020",
      "mopc-nominas-personal-2020",
      "map-nominas-personal-2020",
      "mj-nominas-personal-2017-2020",
      "fonper-nominas-personal-jun-2020",
      "indotel-nominas-personal-jul-2020",
      "mitur-nominas-personal-jul-2020"
    ]
    let indexSearch = indexes.join(',');
    
    return (
      <div className={container}>
        <ReactiveBase
          app={ indexSearch }
          url={`${process.env.REACT_APP_ELASTICSEARCH_ENDPOINT}`}
          transformRequest={props => {
            let new_url = `${process.env.REACT_APP_ELASTICSEARCH_ENDPOINT}/${indexSearch}/_msearch?`;
            let token = Buffer.from(`${process.env.REACT_APP_ELASTICSEARCH_USER}:${process.env.REACT_APP_ELASTICSEARCH_PWD}`, 'utf8').toString('base64');
            props.headers['Authorization'] = `Basic ${token}`;
            return {
              ...props,
              url: new_url
            };
          }}
          theme={{
            colors: {
              primaryColor: '#1d3557',
            },
          }}
        >
          <nav className={nav}>
            <DataSearch componentId="SearchSensor" 
              dataField='NOMBRE_COMPLETO'
              enableQuerySuggestions={true} 
              //customQuery={this.customQuery}
              showClear={true} 
              className={search}
            />
          </nav>

          <div className={leftCol}>

            <SingleList
              showSearch={false}
              componentId="MinisterioSensor" 
              dataField="MINISTERIO" 
              title="Busca por Ministerio" />

            <DynamicRangeSlider 
              componentId="SueldoBaseSensor" 
              title="Filtra port Sueldo Base" 
              rangeLabels={(min, max) => ({
                start: `RD$${min}`,
                end: `RD$${max}`,
              })}
              dataField="SUELDO_BRUTO" />

            <div style={{ height: '0.1px' }}></div>

            <SingleList 
              showSearch={false}
              componentId="AnoSensor" 
              dataField="ANO" 
              defaultValue="2020"
              title="Busca por Ano" />

            <div style={{ height: '0.1px' }}></div>

            <SingleList 
              componentId="CargoSensor" 
              dataField="CARGO" 
              title="Busca por Cargo" />

            <div style={{ height: '0.1px' }}></div>

            <SingleList 
              componentId="TipoEmpleado" 
              dataField="TIPO_DE_EMPLEADO" 
              title="Busca por Tipo Empleado" />
            
          </div>
          
          <ReactiveList
            componentId="SearchResult"
            className={rightCol}
            dataField="NOMBRE_COMPLETO"
            renderResultStats = {
              function(stats) {
                //console.log(stats);
                let resultStatsHTML = `Showing ${stats.displayedResults} of total ${stats.numberOfResults} in ${stats.time} ms`;
                  return resultStatsHTML;
              }
            }     
            showResultStats={false}         
            pagination
            react={{
                and: ['SearchSensor','TipoEmpleado','SueldoBaseSensor','MinisterioSensor','CargoSensor','AnoSensor'],
            }}
            render={({ data }) => (
                <ReactiveList.ResultCardsWrapper>
                    {
                      data.length > 0 &&
                      data.map(( item, i) => {
                      //console.log(item);
                      let result = item;
                      return(
                        <div style={{ width: '100%' }} key={`card_${i}}`}>
                          <div className="courses-container col-xs-6">
                              <div className="course">
                                  <div className="course-preview">
                                      <h6>{ result.MINISTERIO }</h6>
                                      <h2>{ result.NOMBRE_COMPLETO }</h2>
                                      {/**<a href="#">View all details <i className="fas fa-chevron-right"></i></a> */}
                                  </div>
                                  <div className="course-info">
                                      <h6>{ result.DEPARTAMENTO }</h6>
                                      <pre>
                                        <ul>
                                          {
                                            Object.keys(result).map((k, v) => {
                                              let val = result[k];
                                              let label = this.getLabelInfo(k,val);
                                              return label
                                            })
                                          }
                                      </ul></pre>
                                      <button className="btn">RD$ { numeral(result.SUELDO_BRUTO).format('0,0.00') }</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                      )
                    })}
              </ReactiveList.ResultCardsWrapper>
          )}
      />

        
      </ReactiveBase>
	</div>  
    );
  }
}

export default Education;
