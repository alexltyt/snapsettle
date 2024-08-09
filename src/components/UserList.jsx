import React, { useState } from "react";
import User from "../user";
import Transaction from "../transaction";

const UserList = () => {
	const [numOfUsers, setNumOfUsers] = useState('');
	const [users, setUsers] = useState([]);
	const [updatedUsers, setUpdatedUsers] = useState([]);
	const [inputError, setInputError] = useState(false);
	const [transactions, setTransactions] = useState([]);
	const [finalTransactions, setFinalTransactions] = useState([]);
	const [alertMessage, setAlertMessage] = useState("");
	const [showDivider, setShowDivider] = useState(false);
	const [customDivider, setCustomDivider] = useState(1);
	const [currencyDivider, setCurrencyDivider] = useState(1);
	const [dividerInputError, setDividerInputError] = useState(false);
	const [gameName, setGameName] = useState("");
	const [showMain, setShowMain] = useState(false);
	const [showGameNameBox, setShowGameNameBox] = useState(true);

	const handleGameNameChange = (e) => {
		setGameName(e.target.value);
	};

	const handleStart = () => {
		setShowGameNameBox(false);
		setShowMain(true);
		console.log(gameName);
	};

	const createUsers = () => {
		let newUsers = [];
		if (numOfUsers < 2) {
			setAlertMessage("Please enter a number greater than 1");
			return;
		} else {
			setAlertMessage("");
		}
		for (let i = 0; i < numOfUsers; i++) {
			newUsers.push(new User(i, `User ${i}`, ''));
		}
		setUsers(newUsers);
	};

	const handleNameChange = (id, newName) => {
		const tempUsers = users.map((user) => {
			if (user.id === id) {
				return new User(user.id, newName, user.billAmount);
			}
			return user;
		});
		setUsers(tempUsers);
	};

	const handleBillAmountChange = (id, value) => {
		const tempUsers = users.map((user) => {
			if (user.id === id) {
				// Allow negative numbers with up to two decimal places
				if (/^-?\d*\.?\d{0,2}$/.test(value)) {
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
			if (dividerName === "customDivider") {
				setCustomDivider(divider);
        setDividerInputError(false);
			} else if (dividerName === "currencyDivider") {
				setCurrencyDivider(divider);
				setDividerInputError(false);
			}
		} else {
			setDividerInputError(true);
		}
	};

	const sortByPayer = () => {
		setFinalTransactions((transactions) => [...transactions].sort((a, b) => a.payer.localeCompare(b.payer)));
	};

	const sortByReceiver = () => {
		setFinalTransactions((transactions) => [...transactions].sort((a, b) => a.receiver.localeCompare(b.receiver)));
	};

	const swapShowDivider = () => {
		setShowDivider(!showDivider);
	};

	const resetApp = () => {
		setUsers([]);
		setTransactions([]);
		setUpdatedUsers([]);
		setAlertMessage("");
	};

	const processAllTransactions = () => {
		setTransactions([]);
		let tempUsers = users.map((user) => new User(user.id, user.name, user.billAmount));
		// let tempUsers = [...users]; // Copy the users array
		tempUsers.sort((a, b) => b.billAmount - a.billAmount); // Sort the array
		let newTransactions = [];

		while (tempUsers[0].billAmount > 0 && tempUsers[tempUsers.length - 1].billAmount < 0) {
			// Convert billAmount to number and calculate the transaction amount
			let maxAmount = Number(tempUsers[0].billAmount);
			let minAmount = Number(tempUsers[tempUsers.length - 1].billAmount);
			let amount = Math.min(maxAmount, -minAmount);
			console.table(tempUsers);
			// console.log(tempUsers[0].name, tempUsers[tempUsers.length - 1].name, amount);
			newTransactions.push(new Transaction(amount, tempUsers[tempUsers.length - 1].name, tempUsers[0].name));
			// Update the bill amounts for the two users involved in the transaction
			tempUsers[0].billAmount = maxAmount - amount;
			tempUsers[tempUsers.length - 1].billAmount = minAmount + amount;
			tempUsers.sort((a, b) => b.billAmount - a.billAmount); // Resort after updating amounts
		}
		setTransactions((transactions) => [...transactions, ...newTransactions]);
		setUpdatedUsers(tempUsers); // Update the state after all transactions are processed

		newTransactions.map((transaction) => {
			transaction.amount = transaction.amount = parseFloat(
				(transaction.amount / currencyDivider / customDivider).toFixed(2)
			);
			return transaction;
		});
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
		if (users.length === 0) {
			setAlertMessage("Please enter the amount for each users");
			return;
		}
		const sum = users.reduce((acc, user) => acc + Number(user.billAmount), 0);
		const roundedSum = Math.round(sum * 100) / 100; // Round to two decimal places

		if (roundedSum === 0) {
			processAllTransactions();
			setAlertMessage(""); // Clear any previous alert messages
		} else {
			// Set an alert message showing the difference
			setAlertMessage(`The total bill amounts do not balance out. The difference is ${roundedSum}.`);
		}
	};

	return (
		<div className="md:w-2/5 mx-auto bg-base-200 h-screen text-primary">
			<div className="mb-4 shadow-md">
				<h1 className="text-6xl m-8 it mx-auto font-sriracha font-extrabold inline-block text-primary">
					SnapSettle
				</h1>
			</div>
			{showGameNameBox && (
				<div className="flex flex-col justify-center items-center h-[80%]">
					<div className="flex flex-col justify-center items-center">
						<div className="flex flex-col gap-5 justify-center items-center text-accent">
							Please Enter the Game/Event Name
							<input
								type="text"
								value={gameName}
								onChange={handleGameNameChange}
								className="w-full input input-lg input-bordered input-primary"
							/>
							<button
								onClick={() => handleStart()}
								className="btn btn-secondary text-white tracking-wide text-xl">
								Start
							</button>
						</div>
					</div>
				</div>
			)}
			{showMain && (
				<>
					<div className="flex flex-row justify-center items-center mx-4">
						<h1 className="font-bold">{gameName}</h1>
					</div>
					{inputError && (
						<div
							role="alert"
							className="alert alert-warning shadow-md flex flex-row justify-center items-center w-[85%] mx-auto h-10 py-2 ">
							<svg
								className="w-4 h-8 text-white fill-current"
								viewBox="0 0 40 40"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
							</svg>
							<div className="flex flex-row justify-center items-center gap-2">
								<span className="text-sm font-semibold text-white">Error:</span>
								<p className="text-xs text-white">Please enter a valid amount</p>
							</div>
						</div>
					)}
					<div>
						{alertMessage && (
							<div
								role="alert"
								className="alert alert-warning shadow-md flex flex-row justify-center items-center w-[85%] mx-auto h-10 py-2 ">
								<svg
									className="w-4 h-8 text-white fill-current"
									viewBox="0 0 40 40"
									xmlns="http://www.w3.org/2000/svg">
									<path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
								</svg>
								<div className="flex flex-row justify-center items-center gap-2">
									<span className="text-sm font-semibold text-white">Error:</span>
									<p className="text-xs text-white">{alertMessage}</p>
								</div>
							</div>
						)}
					</div>
					<div className="flex flex-col w-4/5 mx-auto md:w-max md:mx-auto mb-4">
						<div className="mb-2">
							<p className="tracking-wide text-left">Number of users</p>
						</div>
						<div className="flex flex-row justify-around gap-3 h-8 w-max">
							<input
								type="number"
								value={numOfUsers}
								placeholder="Enter number of users"
								onChange={(e) => setNumOfUsers(e.target.value)}
								className="input input-sm input-bordered input-primary"
							/>
							<button
								onClick={createUsers}
								className="btn btn-secondary btn-sm text-white tracking-wider">
								CreateUsers
							</button>
						</div>
					</div>
					<div className="m-4 flex flex-col gap-2">
						{users.map((user) => (
							<div key={user.id} className="flex flex-row justify-center items-center join">
								<input
									type="text"
									value={user.name}
									onChange={(e) => handleNameChange(user.id, e.target.value)}
									className="input input-sm input-bordered w-1/3 input-primary join-item"
								/>
								<input
									type="text"
									value={user.billAmount ?? ''}
									onChange={(e) => handleBillAmountChange(user.id, e.target.value)}
									className={`${user.amountInputError ? 'input-secondary' : 'input-primary'} input input-sm join-item`}
								/>
								{/* {user.amountInputError && <div className="text-red-500">Invalid amount</div>} */}
							</div>
						))}
					</div>
					<div className="flex flex-row justify-center gap-6">
						<button
							onClick={swapShowDivider}
							className="btn btn-secondary text-white tracking-wider">
							Add Divider
						</button>
						<button
							onClick={confirmChanges}
							className="btn btn-accent text-white tracking-wider">
							Confirm
						</button>
					</div>
					<br />
					{dividerInputError && showDivider && (
						<div
            role="alert"
            className="alert alert-warning shadow-md flex flex-row justify-center items-center w-[85%] mx-auto h-10 py-2 mb-4 ">
            <svg
              className="w-4 h-8 text-white fill-current"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
            </svg>
            <div className="flex flex-row justify-center items-center gap-2">
              <span className="text-sm font-semibold text-white">Error:</span>
              <p className="text-xs text-white">Please enter a valid number</p>
            </div>
          </div>
					)}
					{showDivider && (
						<div className="flex flex-row justify-center w-screen  sm:w-max rounded-xl mx-auto -mt-2 mb-4 gap-3">
							<div className="flex flex-col ">
								<div className="text-primary">Currency Divider</div>
								<div>
									<input
										type="text"
										value={currencyDivider}
										onChange={(e) => handleDividerInput("currencyDivider", e.target.value)}
										className={`${dividerInputError ? 'input-secondary' : 'input-primary'} input input-bordered input-sm`}
									/>
								</div>
							</div>
							<div className="flex flex-col">
								<div className="text-primary">Custom Divider</div>
								<div>
									<input
										type="text"
										value={customDivider}
										onChange={(e) => handleDividerInput("customDivider", e.target.value)}
										className={`${dividerInputError ? 'input-secondary' : 'input-primary'} input input-bordered input-sm`}
									/>
								</div>
							</div>
						</div>
					)}
					<div className="flex flex-col justify-center mx-auto ">
						<div className="flex flex-row justify-center gap-2 mx-2">
							<button
								onClick={sortByPayer}
								className="btn btn-secondary text-white tracking-wider">
								Sort by Payer
							</button>
							<button
								onClick={sortByReceiver}
								className="btn btn-secondary text-white tracking-wider">
								Sort by Receiver
							</button>{" "}
							<button
								onClick={resetApp}
								className="btn btn-accent text-white tracking-wider">
								<svg
									className="w-5 h-5 mx-1"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
									/>
								</svg>
								<span className="mx-1">Reset</span>
							</button>
						</div>
						{finalTransactions.length > 0 && (
							<>
								<div className="card bg-base-100 w-96 shadow-xl m-4 p-2 mx-auto">
									{gameName && (
										<h1 className="font-extrabold tracking-wider underline underline-offset-4 underline-double">
											{gameName}
										</h1>
									)}
									<div className="m-2">
										<div className="flex flex-row justify-center gap-4 ">
											<div className="w-24 text-white bg-secondary font-sriracha rounded-md tracking-wider font-bold">Payer</div>
											<div className="w-24 text-white bg-primary rounded-md tracking-wider font-bold">Amount</div>
											<div className="w-24 text-white bg-accent font-sriracha rounded-md tracking-wider font-bold">Receiver</div>
										</div>
									</div>
									<div className="m-2 flex flex-col gap-2">
										{finalTransactions.map((transaction, index) => (
											<div className="flex flex-row justify-center " key={index}>
												<div className="w-24 text-white bg-secondary font-sriracha rounded-md tracking-wider font-bold">{transaction.payer}</div>
												<div className="w-24 text-primary rounded-md tracking-wider font-bold">
													--{transaction.amount}--{">"}
												</div>
												<div className="w-24 text-white bg-accent font-sriracha rounded-md tracking-wider font-bold">{transaction.receiver}</div>
											</div>
										))}
									</div>
								</div>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default UserList;
