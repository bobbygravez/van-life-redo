import React from 'react'
import income from "../../images/income.jpg"

function Income() {
    const transactionsData = [
        { amount: 720, date: "Jan 3, 23", id: "1" },
        { amount: 560, date: "Dec 12, 22", id: "2" },
        { amount: 980, date: "Dec 3, 22", id: "3" },
    ]
  return (
    <section className='income'>
        <div className='padding'>
            <h1>Income</h1>
            <h3>Last <span>30 days</span></h3>
            <h1 className='income-amount'>$2,260</h1>
        </div>
        <div className='income-img-container'>
            <img src={income} alt="income-image" className='income-img' />
        </div>
        <div className='padding income-transaction'>
            <h2>Your last transactions (3)</h2>
            <h3>Last <span>30 days</span></h3>
        </div>
        <div className="transactions">
                {transactionsData.map((item) => (
                    <div key={item.id} className="transaction">
                        <h2>${item.amount}</h2>
                        <h3>{item.date}</h3>
                    </div>
                ))}
            </div>
    </section>
  )
}

export default Income
