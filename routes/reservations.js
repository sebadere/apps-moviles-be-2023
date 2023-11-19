const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();




router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));



const MAX_USERS = 11;
const LAST_TURN = 23;


const RESERVATIONS = [
    {
        userId: '40514133',
        turnId: 'TueDec1410',
    }
    
]


router.get('/:date', (req, res) => {
    const date = req.params.date;
    let turnsLeft = calculateLeftHours(date);
    let startingHour = calculateStartingHour(date)
    let turns = createTurnsForTheDay(date, startingHour, turnsLeft);
    res.send({
        turnsLeft: turnsLeft,
        turns: turns
    });
});


router.post('/reserve', (req, res) => {
    const userId = req.body.userId
    const turnId = req.body.turnId
    
    if(checkForDisponibility(turnId)) {
        addReservation(userId, turnId);
        res.status(200).send({
            status: 'SUCCEED',
            message:'Turn created succesfully'
            });
    } else {
        res.status(200).send({
            status: 'FAILED',
            message: 'There is no available turns for this time'
         });
    }    
})


router.get('/by/:userId', (req, res) => {
    const userId = req.params.userId;
    const userHistory = searchUserTurns(userId);
    res.status(200).send({
        oldTurns: userHistory.userHistory,
        upComingTurn: userHistory.upComingTurn
    })
});

router.delete('/delete/:turnId/:userId', (req, res) => {
    console.log(req.params);
    const turnId = req.params.turnId;
    const userId = req.params.userId;
    for(let i = 0; i < RESERVATIONS.length; i++) {
        if(isValidTurn(userId, turnId, RESERVATIONS[i])) {
            RESERVATIONS.splice(i, 1)
        }
    }
    res.send({status: 'SUCCEED'});
})

router.get('/byTurn/:turnId', (req, res) => {
    const turnId = req.params.turnId;
    const reservationsPerTurn = []
    for(let i = 0; i<RESERVATIONS.length; i++) {
        if(checkIfIsUpComing(RESERVATIONS[i].turnId) && RESERVATIONS[i].turnId == turnId) {
            reservationsPerTurn.push(RESERVATIONS[i]);
        }
    }

    res.send({reservationsPerTurn:reservationsPerTurn })
})



const isValidTurn = (userId, turnId, turn) => {
    const conditionOne = turn.userId == userId && turn.turnId == turnId
    const conditionTwo = checkIfIsUpComing(turnId)
    return conditionOne && conditionTwo ? true : false
}

const calculateId = (day, time) => {
    return (day + time).trim().replace(/\s+/g, '');
}

const checkForDisponibility = (turnId) => {
    let count = 0;
    for( let i = 0; i < RESERVATIONS.length; i++) {
        if(RESERVATIONS[i].turnId == turnId) {
            count++
        }
    }
    return count < 15 ? true : false
}

const addReservation = (user, turn) => {
    RESERVATIONS.push({userId: user, turnId: turn})
}

const calculateLeftHours = (date) => {
    let leftHours = 22 - new Date().getHours();
    if(isToday(date)) {
        if(leftHours > 0 ) {
            return leftHours;
        }
        return 0;
    } else {
        return 14
    }
}

const isToday = (date) => {
    let today = new Date().toString();
    const condition = date.split('2023')[0].trim() === today.split('2023')[0].trim()
    return condition ? true : false;
}

const createTurn = (id, from, reservations, numberOfTurnsAvailable) => {
    let turn = {
        turnId: id,
        from:from,
        reservations:reservations,
        availability: numberOfTurnsAvailable
    }
    return turn
}

const calculateStartingHour = (date) => {
    if(isToday(date)) {
        return new Date().getHours() + 1;
    } 
    return 8;
}

const createTurnsForTheDay = (date, startingHour, turnsLeft) => {
    let turns = []
    for( let i = 0; i< turnsLeft; i++) {
        let from = startingHour + i;
        let id = calculateId(date, from);
        if(from.toString().length == 1) {
            from = '0' + from;
        }
        let startingHourFormatted = from + ':00hs'
        let numberOfTurnsAvailable = numberOfTurnsAvailableForId(id);
        let turn = createTurn(id, startingHourFormatted,['40514133' , '456566'], numberOfTurnsAvailable)
        turns.push(turn);
    }
    return turns
}

const numberOfTurnsAvailableForId = (turnId) => {
    let numberOfTurns = 15;
    for( let i=0; i< RESERVATIONS.length; i++ ) {
        if(RESERVATIONS[i].turnId == turnId) {
            numberOfTurns--
        }
    }
    return numberOfTurns
}

const searchUserTurns = (userId) => {
    let userHistory = [];
    let upComingTurn;
    for( let i=0; i< RESERVATIONS.length; i++ ) {
        if(RESERVATIONS[i].userId == userId) {
            if(checkIfIsUpComing(RESERVATIONS[i].turnId)) {
                upComingTurn = RESERVATIONS[i];
            } else {
                userHistory.push(RESERVATIONS[i]);
            }
        }
    }
    return {userHistory: userHistory, upComingTurn: upComingTurn};
}


const checkIfIsUpComing = (turnId) => {
    const today = new Date()
    const todayFormatted = today.toString().split('2023')[0].trim().replace(/\s+/g, '') + today.getHours();
    return getNumberOfFormattedDate(turnId) > getNumberOfFormattedDate(todayFormatted) ? true : false 
}

const getNumberOfFormattedDate = (date) => {
    return date.substring(6)
}


module.exports = router;