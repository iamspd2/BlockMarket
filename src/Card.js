import React, { Component } from 'react'
import './Card.css'


class Card extends Component {

  render() {
    const selected = this.props.selected
    const path = this.props.path
    const item = this.props.item
    const select = this.props.select
    var balance=335.67
    return (
      <div
        className={`card ${selected ? 'border-primary' : ''}`}
        onClick={(e) => {
          select(e, item)
        }}
      >
      <img className="card-img-top" src={`${path}${item.id}.jpg`} alt={item.name} />
      <div className="card-body">
        <h4 className="card-title">{item.name}</h4>
        <p className="card-text">{item.superpower}</p>
        <p className="card-text">Current Balance: {balance}</p>
        <button className='btn btn-primary btn-block' disabled={selected}>{ selected ? 'Coupon code: C4YZKOG' : 'Get voucher at $c 140!' }</button>
        <button className='btn btn-primary btn-block' disabled={selected}>{ selected ? 'New Balance: $c 195.67' : 'Current Balance: $c 335.67'}</button>
        <button className='btn btn-primary btn-block' disabled={selected}>{ selected ? 'Purchased!' : 'Tap to purchase' }</button>
      </div>
    </div>
    )
  }
}

export default Card
