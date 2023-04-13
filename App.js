import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [counter, setCounter] = React.useState(-1);
    const [bestRolls, setBestRolls] = React.useState(
        () => JSON.parse(localStorage.getItem("bestRolls")) || [100,100]
    )

    React.useEffect(() => {
        localStorage.setItem("bestRolls", JSON.stringify(bestRolls))
    }, [bestRolls])
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        console.log(bestRolls)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setBestRolls(oldBest=>([
                oldBest[0]= oldBest[0]>rolls?rolls:oldBest[0],
                oldBest[1]= oldBest[1]>counter?counter:oldBest[1]
            ]))
        }
    }, [dice])

    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    React.useEffect(() => {
        if(!tenzies){
            const timer = counter >= 0 && setTimeout(() => setCounter(counter + 1), 1000);
        }
      }, [counter]);
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRolls(oldRolls => oldRolls+1)
        } else {                      
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
            setCounter(-1)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {id: die.id, value: die.value, isHeld: !die.isHeld} :
                die
        }))
        if(counter < 0) setCounter(0)
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="rolls">
                <h3>Roll count: {rolls}</h3>     
                <h3>Time played: {counter>=0?counter:""}</h3>     
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div>
                <h3>Best rolls: {bestRolls[0]<50 && bestRolls[0]}</h3>
                <h3>Best time: {bestRolls[1]<50 && bestRolls[1]}</h3>
            </div>
        </main>
    )
}