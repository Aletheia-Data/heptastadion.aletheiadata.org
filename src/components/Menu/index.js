import React from 'react';

import { Splide, SplideSlide } from '@splidejs/react-splide';

import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';
import './style.css';

export default ({ departments, select }) => {
  let currentItem = 0;
  return (
    <div className="menu" style={{ width: '100vw' }}>
      <Splide
        className="icon-departments"
        options={ {
          type      : 'loop',
          perPage   : 2,
          perMove   : 1,
          gap       : '1rem',
          rewind      : true,
          pagination  : false,
          fixedHeight : 150,
          focus       : 'center',
        } }
        onMoved={ ( splide, newIndex ) => { currentItem = newIndex; console.log( 'moved', currentItem ) } }
      >
        {
          departments.map((item, key) => {
            return (
              <SplideSlide className="department"  key={`department_${key}`}>
                {/** <img src={ item.icon ? item.icon.url : 'assets/img/logo.svg' } alt={ item.name } />  */}
                <h4>{ item.name }</h4>
              </SplideSlide>
            )
          })
        }
      </Splide>
      <button className="btn" onClick={()=>select(departments[currentItem].id)}>Cambia</button>
    </div>
  );
}