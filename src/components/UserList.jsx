import React, { useState } from 'react';
import User from '../user';
import Transaction from '../transaction';

const UserList = () => {
    const [numOfUsers, setNumOfUsers] = useState(5);
    const [users, setUsers] = useState([]);
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const [inputError, setInputError] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [finalTransactions, setFinalTransactions] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showDivider, setShowDivider] = useState(false)
    const [customDivider,setCustomeDivider] = useState(1);
    const [currencyDivider, setCurrencyDivider] = useState(1);
    const [dividerInputError, setDividerInputError] = useState(false);


    
    const createUsers = () => {
        let newUsers = [];
        for (let i = 0; i < numOfUsers; i++) {
            newUsers.push(new User(i, `User ${i}`, 0));
        }
        setUsers(newUsers);
    };

    const handleNameChange = (id, newName) => {
        const tempUsers = users.map(user => {
            if (user.id === id) {
                return new User(user.id, newName, user.billAmount);
            }
            return user;
        });
        setUsers(tempUsers);
    };

    const handleBillAmountChange = (id, value) => {
      const tempUsers = users.map(user => {
          if (user.id === id) {
              if (/^-?\d*$/.test(value)) {
                  setInputError(false);
                  return new User(user.id, user.name, value, false);
              } else {
                  setInputError(true);
                  return new User(user.id, user.name, value, true);
              }
          }
          return user;
      });
      setUsers(tempUsers);
      };

      const handleDividerInput = (dividerName, divider) => {
        // Regular expression for a positive number with up to two decimal places,
        // allowing inputs ending with a decimal point for further typing
        const regex = /^$|^(0\.\d{0,2}|[1-9]\d*(\.\d{0,2})?)$/;
    
        if (regex.test(divider)) {
            setDividerInputError(false);
            if (dividerName === 'customDivider'){
                setCustomeDivider(divider);
            } else if (dividerName === 'currencyDivider'){
                setCurrencyDivider(divider);            
            }
        } else {
            setDividerInputError(true);
        }
      };
    


    const sortByPayer = () => {
        setFinalTransactions(transactions => [...transactions].sort((a, b) => a.payer.localeCompare(b.payer)));
  };

    const sortByReceiver = () => {
        setFinalTransactions(transactions => [...transactions].sort((a, b) => a.receiver.localeCompare(b.receiver)));
    };

    const swapShowDivider = () =>{
        setShowDivider(!showDivider);
    }

    const resetApp = () => {
        setUsers([]); 
        setTransactions([]);
        setUpdatedUsers([]); 
        setAlertMessage('');
    };


    
    const processAllTransactions = () => {
      setTransactions([]);
      let tempUsers = users.map(user => new User(user.id, user.name, user.billAmount));
      // let tempUsers = [...users]; // Copy the users array
      tempUsers.sort((a, b) => b.billAmount - a.billAmount); // Sort the array
      let newTransactions = [];

      while (tempUsers[0].billAmount > 0 && tempUsers[tempUsers.length - 1].billAmount < 0) {
        // Convert billAmount to number and calculate the transaction amount
        let maxAmount = Number(tempUsers[0].billAmount);
        let minAmount = Number(tempUsers[tempUsers.length - 1].billAmount);
        let amount = Math.min(maxAmount, -minAmount);
        console.log(tempUsers[0].name, tempUsers[tempUsers.length - 1].name, amount);
        newTransactions.push(new Transaction(amount, tempUsers[tempUsers.length - 1].name, tempUsers[0].name));      
        // Update the bill amounts for the two users involved in the transaction
        tempUsers[0].billAmount = maxAmount - amount;
        tempUsers[tempUsers.length - 1].billAmount = minAmount + amount;
        tempUsers.sort((a, b) => b.billAmount - a.billAmount); // Resort after updating amounts
        }
        setTransactions(transactions => [...transactions, ...newTransactions]); 
        setUpdatedUsers(tempUsers); // Update the state after all transactions are processed

        
        newTransactions.map(transaction => {
        transaction.amount = transaction.amount = parseFloat((transaction.amount / currencyDivider / customDivider).toFixed(2));
        return transaction;})
        setFinalTransactions(newTransactions);
      };

    // const processAllTransactionsWithDivider = () => {
    //   let tempTransactions = [...transactions];
    //   tempTransactions.map(transaction => {
    //     transaction.amount = transaction.amount / currencyDivider / customDivider;
    //     return transaction;
    //   })
    //   setFinalTransactions(tempTransactions);
    // }


    const confirmChanges = () => {
        const sum = users.reduce((acc, user) => acc + Number(user.billAmount), 0);

        if (sum === 0) {
          processAllTransactions();
          setAlertMessage(''); // Clear any previous alert messages
        } else {
          // Set an alert message showing the difference
          setAlertMessage(`The total bill amounts do not balance out. The difference is ${sum}.`);
        }

    };


        
    return (
        <div className=''>
            <h1 className='text-7xl m-8 font-extrabold italic mx-auto bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-400 inline-block text-transparent bg-clip-text'>SnapSettle</h1>
            {inputError && <div
            className="inline-flex ml-3 mb-4 overflow-hidden bg-white rounded-lg shadow-md"
          >
            <div className="flex items-center justify-center w-12 bg-red-500">
              <svg
                classname="w-6 h-10 text-white fill-current"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                />
              </svg>
            </div>

            <div className="px-4 py-0.5 -mx-3">
              <div className="">
                <span className="font-semibold text-red-500">Error</span>
                <p className="text-xs text-gray-600">
                  Please enter a valid amount
                </p>
              </div>
            </div>
          </div>}
            <div>
              {alertMessage && <div
            className="inline-flex ml-3 mb-4 overflow-hidden bg-white rounded-lg shadow-md"
          >
            <div className="flex items-center justify-center w-12 bg-red-500">
              <svg
                className="w-6 h-10 text-white fill-current"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                />
              </svg>
            </div>

            <div className="px-4 py-0.5 -mx-3">
              <div className="">
                <span className="font-semibold text-red-500">Error</span>
                <p className="text-xs text-gray-600">
                  {alertMessage}
                </p>
              </div>
            </div>
          </div>}
            </div>
            <p>Number of users</p>
            <div className='flex flex-row justify-center gap-3'>
              <input 
                  type="number" 
                  value={numOfUsers} 
                  onChange={(e) => setNumOfUsers(e.target.value)} 
                  className=' h-10 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500 '
              />
              <button onClick={createUsers} className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500'>Create Users</button>
            </div>
            <div className='m-4'>
                {users.map(user => (
                    <div key={user.id}>
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => handleNameChange(user.id, e.target.value)}
                            className='m-1 h-8 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500'
                        />
                        <input
                            type="text"
                            value={user.billAmount}
                            onChange={(e) => handleBillAmountChange(user.id, e.target.value)}
                            className={`{user.amountInputError ? 'border-red-500 border' : 'border'} m-1 h-8 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500`}
                        />
                        {user.amountInputError && <div className="text-red-500">Invalid amount</div>}
                    </div>
                ))}
            </div>
            <button onClick={confirmChanges} className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500'>Confirm</button>
            <br/>
            <div className='flex flex-col justify-center mx-auto mt-8'>
              <div className='flex flex-row justify-center gap-3'>
                  <button onClick={sortByPayer} className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500'>Sort by Payer</button>
                  <button onClick={sortByReceiver} className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500'>Sort by Receiver</button>
                  <button onClick={swapShowDivider} className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500'>Add Divider</button>
                  <button onClick={resetApp} className='flex items-center px-2 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500'>
                    <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                    </svg>
                    <span className="mx-1">Reset</span>
                  </button>
              </div>
              {dividerInputError && showDivider &&
                <div className="inline-flex ml-3 mb-4 overflow-hidden bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-center w-12 bg-red-500">
                    <svg
                      classname="w-6 h-10 text-white fill-current"
                      viewBox="0 0 40 40"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                      />
                    </svg>
                  </div>

                  <div className="px-4 py-0.5 -mx-3">
                    <div className="">
                      <span className="font-semibold text-red-500">Error</span>
                      <p className="text-xs text-gray-600">
                        Please enter a valid number
                      </p>
                    </div>
                  </div>
              </div>}
              {showDivider && 
                <div className='flex flex-row justify-center m-6  border-indigo-600 w-screen  sm:w-max rounded-xl mx-auto gap-3'>
                <div className='flex flex-col'>
                  <div>Currency Divider</div>
                  <div>
                  <input
                    type="text"
                    value={currencyDivider}
                    onChange={(e) => handleDividerInput('currencyDivider',e.target.value)}
                    className={`{dividerInputError ? 'border-red-500 border' : 'border'} m-1 h-8 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500`}
                  />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div>Custom Divider</div>
                  <div>
                  <input
                    type="text"
                    value={customDivider}
                    onChange={(e) => handleDividerInput('customDivider',e.target.value)}
                    className={`{dividerInputError ? 'border-red-500 border' : 'border'} m-1 h-8 border border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500`}
                  />
                  </div>
                </div>
              </div>
              }
              <div className='border-double border-indigo-600/75 m-2 rounded-3xl border-4 w-screen sm:w-fit mx-auto mt-8'>
                <div className='m-2'>
                        <div className='flex flex-row justify-center '>
                            <div className='w-24'>Payer ID</div>
                            <div className='w-24'>Amount</div>
                            <div className='w-24'>Receiver ID</div>
                        </div>
                </div>
                <div className='m-2'>
                    {finalTransactions.map((transaction, index) => (
                        <div className='flex flex-row justify-center ' key={index}>
                            <div className='w-24'>{transaction.payer}</div>
                            <div className='w-24'>--{transaction.amount}--{'>'}</div>
                            <div className='w-24'>{transaction.receiver}</div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
        </div>
    );
};

export default UserList;
