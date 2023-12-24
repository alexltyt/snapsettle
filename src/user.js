
class User {
    constructor(id, name, billAmount, amountInputError=false, transactions=[]) {
        this.id = id;
        this.name = name;
        this.billAmount = billAmount;
        this.amountInputError = amountInputError;
        this.transactions = transactions;
    }


}

export default User;
