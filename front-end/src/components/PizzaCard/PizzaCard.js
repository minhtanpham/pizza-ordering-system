import React from 'react';
import {
  Card,
  Button,
} from 'antd';
import PropTypes from 'prop-types';

import './pizzacard.css';

const PizzaCard = ({
  thumbnail,
  flavour,
  size,
  crust,
  topping,
  price,
  placeOrder,
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
        <span>{flavour.flavour}</span>
      </li>
      <li>
        <span className="heading">Size: </span>
        <span>
          {size.size}
        </span>
      </li>
      <li>
        <span className="heading">Crust: </span>
        <span>
          {crust.crust}
        </span>
      </li>
      <li>
        <span className="heading">Toppings: </span>
        <span>
          {topping.topping}
        </span>
      </li>
    </ul>
    <Button className="order-button" type="primary" onClick={() => placeOrder(flavour, size, crust, topping, price)}>
      { `Price (${price}$)` }
    </Button>
  </Card>
);

PizzaCard.propTypes = {
  thumbnail: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  flavour: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  crust: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  topping: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  placeOrder: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default PizzaCard;
