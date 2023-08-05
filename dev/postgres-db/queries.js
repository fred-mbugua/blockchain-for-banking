const pswdEncrypt = require('../networknode');
const bcrypt = pswdEncrypt.bcrypt;
const saltRnds = pswdEncrypt.saltRounds;

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'fredrick',
    host: 'localhost',
    database: 'fred_block_chain',
    password: 'JEEPhammer77',
    port: 5432,
})

const getUsers = (req, res) => {
    pool.query('SELECT * FROM customers.customers_list ORDER BY id ASC', (err, results) => {
        if (err) {
            throw err
        }
        res.status(200).json(results.rows)
    })
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM customers.customers_list WHERE customers_customer_id = $1', [customers_customer_id], (err, results) => {
        if (err) {
            throw err
        }
        res.status(200).json(results.rows)
    })
}

const getUserByAddress = (req, res) => {
    const customers_customer_address = req.body.customerAddress;
    pool.query('SELECT * FROM customers.customers_list WHERE customers_customer_address = $1', [customers_customer_address], (err, results) => {
        if (err) {
            throw err
        }
        // res.status(200).json(results.rows)
        res.json({success: results.rows})
    })
}


const loginUser = (req, res) => {

    const {customers_customer_email_address, customers_customer_user_name, customers_customer_password} = req.body.data;
    const validateUser = (pass, email, username) => {
        pool.query('SELECT * FROM customers.customers_list WHERE customers_customer_email_address = $1 and customers_customer_user_name = $2', [email, username], (err, results) => {
            if(err) {
                throw err
            }
            bcrypt.compare(pass, results.rows[0].customers_customer_password).then(response => {
                console.log(response) //return true
                const sessionStorageData = {
                    customerAddress: results.rows[0].customers_customer_address,
                    customerName: results.rows[0].customers_customer_first_name
                }
                res.json({success: "Logged in successfully", data: sessionStorageData});
            })
            .catch(err => console.error(err.message))
        })
    }
    validateUser(customers_customer_password, customers_customer_email_address, customers_customer_user_name);
    
}

const createUser = (req, res) => {
    const pswd = req.body.data.customers_customer_password;
    let customers_customer_password;
    
    const password = (pswd, saltRnds) => {
        bcrypt.hash(pswd, saltRnds).then(hash => {
            
            customers_customer_password = hash;
        
            const {customers_customer_id, customers_customer_first_name, customers_customer_second_name, customers_customer_user_name, customers_customer_address, customers_customer_registration_date, customers_customer_last_transaction_date, customers_customer_last_transaction_id, customers_customer_email_address} = req.body.data

            pool.query('INSERT INTO customers.customers_list (customers_customer_id, customers_customer_first_name, customers_customer_second_name, customers_customer_user_name, customers_customer_address, customers_customer_registration_date, customers_customer_last_transaction_date, customers_customer_last_transaction_id, customers_customer_password, customers_customer_email_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [customers_customer_id, customers_customer_first_name, customers_customer_second_name, customers_customer_user_name, customers_customer_address, customers_customer_registration_date, customers_customer_last_transaction_date, customers_customer_last_transaction_id, customers_customer_password, customers_customer_email_address], (err, results) => {
                if (err) {
                    throw err
                }
                // res.status(201).send(`User adder with ID: ${results.rows[0].customers_customer_id}`)
                res.json({success: `User adder with ID: ${results.rows[0].customers_customer_id}`, error: err});
            })
        })
        .catch(err => console.error(err.message))
        return
    }
    password(pswd, saltRnds);
}

const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    const {name, email} = req.body
    pool.query(
        'UPDATE customers.customers_list SET name = $1, email = $2 WHERE id = $3', 
        [name, email, id],
        (err, results) => {
            if (err) {
                throw err
            }

            res.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM customers.customers_list WHERE id = $1', [id], (err, results) => {
        if (err) {
            throw err
        }
        res.status(200).send(`User deleted with ID: ${id}`)
    })
}

//Exporting above functions
module.exports = {
    getUsers,
    getUserById,
    getUserByAddress,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
}

