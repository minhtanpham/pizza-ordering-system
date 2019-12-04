import React from 'react';
import {
  Card,
  Button,
} from 'antd';

import './pizzacard.css';

const PizzaCard = () => (
  <Card className="pizza-card">
    <div
      className="thumbnail"
      style={{
        backgroundImage: 'url(https://cdn.britannica.com/08/177308-131-DFD947AD/Food-Pizza-Basil-Tomato.jpg)',
      }}
    />
    <ul className="meta-list">
      <li>
        <span className="heading">Flavours: </span>
        <span>Peperoni</span>
      </li>
      <li>
        <span className="heading">Size: </span>
        <span>14&apos;</span>
      </li>
      <li>
        <span className="heading">Crust: </span>
        <span>Chessy</span>
      </li>
      <li>
        <span className="heading">Toppings: </span>
        <span>No</span>
      </li>
    </ul>
    <Button className="order-button" type="primary">Price (30$)</Button>
  </Card>
);

export default PizzaCard;
