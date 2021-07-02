// App.js
import React from 'react';

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Home from './pages/home';
import Search from './pages/search';
import View from './pages/view';

//const Home = () => <h1><Link to="/about">Click Me</Link></h1>
//const About = () => <h1>About Us</h1>

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/_search" component={Search} />
      <Route path="/_view" component={View} />
    </Switch>
  </Router>
)

export default App;