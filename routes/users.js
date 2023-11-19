const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

  
const USERS = [
    {
        id: 40514133,
        name: 'batman',
        userName: 'seba',
        password: 'dere',
        isAdmin: false
    },
    {
        id: 40514134,
        name: 'spiderman',
        userName: 'nico',
        password: 'gota',
        isAdmin: false
    },
    {
        id: 11111111,
        name: 'admin',
        userName: 'admin',
        password: 'admin',
        isAdmin: true
    }
]


router.post('/', (req, res) => {
    let isUserRegistered = false;
    let user = null;
    for( let i = 0; i < USERS.length; i++) {
        console.log(req.body)
        if(USERS[i].id == req.body.id) {
            isUserRegistered = true;
            user = {
                id: USERS[i].id,
                username: USERS[i].userName,
                isAdmin: USERS[i].isAdmin
            }
        }
    }
    if( isUserRegistered ) {
        res.status(200).send(user);
    } else {
        res.status(404).send({
            ERROR: 'User is not a client!'
         });
    }
});



router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.send('user with id '); 
});





module.exports = router;