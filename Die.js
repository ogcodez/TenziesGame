import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    const Pip = () => <span className="pip" />;
    const Face = ({ children }) => <div className="face" style={styles} onClick={props.holdDice}>{children}</div>;
    let pips = Number.isInteger(props.value)
		? Array(props.value)
				.fill(0)
				.map((_, i) => <Pip key={i} />)
		: null;

    return (
         <Face>{pips}</Face>
        )
}


