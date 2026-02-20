import React from 'react'
import Card from '../Images/Card.jpg'
import { Link } from 'react-router'



export default function TrackingCard() {
    return (
        <div className='tracking-card-page'>

            <p>
                Managing your money shouldn’t feel confusing or overwhelming. With MoneyMap,
                you can easily track all your income and expenses in one organized place. Log
                each entry with a date, amount, and description to keep your financial picture
                clear and up to date.

                Our tracking tools help you stay aware of where your money is coming from and where
                it’s going. Whether you’re budgeting for monthly bills, saving for something special,
                or simply trying to build better habits, MoneyMap gives you the clarity you need to
                stay on top of your finances.
            </p>
            <img src={Card} alt="Card" className="tracking-card-image"></img>
            <div className='tracking-buttons'>
                <Link to='/income'>
                    <button className='tracking-button'>Income</button>
                </Link>

                <Link to='/expenses'>
                    <button className='tracking-button'>Expenses</button>
                </Link>
            </div>

        </div>
    )
}