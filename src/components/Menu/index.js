import React from 'react';

import { Splide, SplideSlide } from '@splidejs/react-splide';

import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';
import './style.css';

export default () => {
  
  return (
    <div className="menu">
      <Splide
        className="icon-departments"
        options={ {
          type      : 'loop',
          width     : 800,
          perPage   : 2,
          perMove   : 1,
          gap       : '1rem',
          rewind      : true,
          pagination  : false,
          fixedHeight : 150,
          focus       : 'center',
        } }
        onMoved={ ( splide, newIndex ) => { console.log( 'moved', newIndex ) } }
      >
        <SplideSlide className="department">
          <img src="assets/img/icons/logo_miner_gray.png" alt="Image 1"/>
        </SplideSlide>
        <SplideSlide className="department">
          <img src="assets/img/icons/logo_mitur_gray.png" alt="Image 2"/>
        </SplideSlide>
        <SplideSlide className="department">
          <img src="assets/img/icons/logo_mirex_gray.jpeg" alt="Image 2"/>
        </SplideSlide>
        <SplideSlide className="department">
          <img src="assets/img/icons/logo_miner_gray.png" alt="Image 1"/>
        </SplideSlide>
        <SplideSlide className="department">
          <img src="assets/img/icons/logo_mitur_gray.png" alt="Image 2"/>
        </SplideSlide>
        <SplideSlide className="department">
          <img src="assets/img/icons/logo_mirex_gray.jpeg" alt="Image 2"/>
        </SplideSlide>
      </Splide>
      <button className="btn">Cambia</button>
    </div>
  );
}