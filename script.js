let idle = $('#idle')
let resetBtn = $('#reset-btn')
let startBtn = $('#start-btn')
let p1Hold = $('#p1-hold')
let p1Roll = $('#p1-roll')
let p2Hold = $('#p2-hold')
let p2Roll = $('#p2-roll')
let roundCount = $('#round')
let roundScore1 = $('#p1-round-score-count')
let score1 = $('#p1-score-count')
let roundScore2 = $('#p2-round-score-count')
let score2 = $('#p2-score-count')
let announcer = $('#announcer')
let diceModel = $('#dice')
let isGameStarted = false

class Game {

    constructor(players) {
        this.players = players
        this.currentRound = 0
        this.currentPlayer = 0
        this.started = false
    }

    init() {
        idle.html('Game is started')
        isGameStarted = true
        showButtons()
        this.reset(false)
        roundCount.html('Round ' + this.currentRound)
        this.currentPlayer = this.pickFirst()
        idle.html('Turn : ' + (this.currentPlayer === 0 ? 'Jotaro' : 'Dio'))
        this.showBtn()
    }

    reset(end) {
        this.currentRound = 1
        this.players.forEach((p) => {
            p.currentRound = 1
            p.points = 0
            p.roundPoints = 0
            p.playedRound = false
        })
        if(end) {
            roundCount.html('')
            idle.html('Waiting for game start...')
            roundScore1.html('0')
            roundScore2.html('0')
            score1.html('0')
            score2.html('0')
            hideButtons()
        }
    }

    showBtn() {
        let otherPlayer

        switch (this.currentPlayer) {
            case 0:
                otherPlayer = 1
                break
            case 1:
                otherPlayer = 0
                break
        }

        if(this.currentPlayer === 0) {
            p2Roll.hide()
            p2Hold.hide()
            p1Roll.show('slow')
            p1Hold.show('slow')
        } else {
            p1Roll.hide()
            p1Hold.hide()
            p2Roll.show('slow')
            p2Hold.show('slow')
        }

    }

    pickFirst() {
        return Math.floor(Math.random() * 2)
    }

    checkPlayers() {
        let otherPlayer

        switch (this.currentPlayer) {
            case 0:
                otherPlayer = 1
                break
            case 1:
                otherPlayer = 0
                break
        }

        if(this.players[this.currentPlayer].points >= 100) {
            this.win()
            return
        }

        if(this.players[this.currentPlayer].playedRound && !this.players[otherPlayer].playedRound) {
            this.changeTurn()
        }
        if(this.players[this.currentPlayer].playedRound && this.players[otherPlayer].playedRound) {
            this.nextRound()
        }

        this.showBtn()
    }

    nextRound() {
        this.currentRound++
        roundCount.html('Round ' + this.currentRound)
        this.players.forEach((p) => {
            p.playedRound = false
        })
        this.changeTurn()
    }

    changeTurn() {

        switch (this.currentPlayer) {
            case 0:
                this.currentPlayer = 1
                break
            case 1:
                this.currentPlayer = 0
                break
        }

        idle.html('Turn : ' + (this.currentPlayer === 0 ? 'Jotaro' : 'Dio'))
    }

    roll() {
        let roundScore

        switch (this.currentPlayer) {
            case 0:
                roundScore = roundScore1
                break
            case 1:
                roundScore = roundScore2
                break
        }
        let dice = rollDice()
        rollAnim(dice)
        setTimeout(() => {
            this.players[this.currentPlayer].roll(dice)
            roundScore.html(this.players[this.currentPlayer].roundPoints)
            game.checkPlayers()
        }, 1000)
    }

    hold() {
        let roundScore
        let score

        switch (this.currentPlayer) {
            case 0:
                roundScore = roundScore1
                score = score1
                break
            case 1:
                roundScore = roundScore2
                score = score2
                break
        }

        this.players[this.currentPlayer].points += this.players[this.currentPlayer].roundPoints
        announce((this.currentPlayer === 0 ? 'Jotaro' : 'Dio') + ' just scored ' + this.players[this.currentPlayer].roundPoints)
        this.players[this.currentPlayer].roundPoints = 0
        roundScore.html(this.players[this.currentPlayer].roundPoints)
        score.html(this.players[this.currentPlayer].points)
        this.players[this.currentPlayer].playedRound = true
        this.checkPlayers()
    }

    win() {
        announce((game.currentPlayer === 0 ? 'Jotaro' : 'Dio') + ' winned the game !')
        this.reset(true)
    }

}

class Player {

    constructor() {
        this.roundPoints = 0
        this.points = 0
        this.playedRound = false
    }

    roll(dice) {
        if(this.playedRound) return
        if(dice === 1) {
            announce((game.currentPlayer === 0 ? 'Jotaro' : 'Dio') + ' picked 1 ! Switching turn')
            this.roundPoints = 0
            this.playedRound = true
            return
        }
        this.roundPoints += dice
    }

}

let player1 = new Player()
let player2 = new Player()
let game = new Game([player1, player2])

$(document).ready(() => {
    hideButtons()
    idle.html('Waiting for game start...')
})

startBtn.on('click', () => {
    game.init()
})

resetBtn.on('click', () => {
    game.reset(true)
    isGameStarted = false
    hideButtons()
})

p1Roll.on('click', () => {
    game.roll()
})

p2Roll.on('click', () => {
    game.roll()
})

p1Hold.on('click', () => {
    game.hold()
})

p2Hold.on('click', () => {
    game.hold()
})

function hideButtons() {
    p1Hold.hide('slow').fadeOut('slow')
    p2Hold.hide('slow').fadeOut('slow')
    p1Roll.hide('slow').fadeOut('slow')
    p2Roll.hide('slow').fadeOut('slow')
    diceModel.hide('fast')
    resetBtn.hide('slow').fadeOut('slow')
    startBtn.show('slow').fadeIn('slow')
}

function showButtons() {
    startBtn.hide('slow').fadeOut('slow')
    resetBtn.show('slow').fadeIn('slow')
    diceModel.show('fast')
}

function rollDice() {
    return Math.floor((Math.random() * 6) + 1)
}

function announce(str) {
    announcer.html(str)
    announcer.show('slow').fadeIn('slow')
    setTimeout(() => {
        announcer.hide('slow').fadeOut('slow')
        clearTimeout(this)
    }, 2000)
}

function rollAnim(dice) {
    let x,y;
    switch (dice) {
        case 1:
            x = -360
            y = -360
            break
        case 6:
            x = 180
            y = 360
            break
        case 5:
            x = 90
            y = 360
            break
        case 2:
            x = 270
            y = 360
            break
        case 3:
            x = -360
            y = 90
            break
        case 4:
            x = 360
            y = -90
            break
        default:
            x = 0
            y = 0
            break
    }
    diceModel.css("transform", "translateZ(100px) rotateX(" + x + "deg) rotateY(" + y + "deg)");
}

