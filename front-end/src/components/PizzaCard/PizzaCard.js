import React from 'react';
import {
  Card,
  Button,
} from 'antd';
import PropTypes from 'prop-types';

import './pizzacard.css';

const PizzaCard = ({
  thumbnail,
  flavours,
  sizes,
  crusts,
  toppings,
  price,
}) => (
  <Card className="pizza-card">
    <div
      className="thumbnail"
      style={{
        backgroundImage: `url(${thumbnail})`,
      }}
    />
    <ul className="meta-list">
      <li>
        <span className="heading">Flavours: </span>
        <span>{flavours}</span>
      </li>
      <li>
        <span className="heading">Size: </span>
        <span>
          {sizes}
        </span>
      </li>
      <li>
        <span className="heading">Crust: </span>
        <span>
          {crusts}
        </span>
      </li>
      <li>
        <span className="heading">Toppings: </span>
        <span>
          {toppings}
        </span>
      </li>
    </ul>
    <Button className="order-button" type="primary">
      { `Price (${price}$)` }
    </Button>
  </Card>
);

PizzaCard.propTypes = {
  thumbnail: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  flavours: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  sizes: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  crusts: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  toppings: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default PizzaCard;
