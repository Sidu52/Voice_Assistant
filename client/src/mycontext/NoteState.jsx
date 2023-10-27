import React, { useState } from "react";
import StateContext from "./Mycontext";

const NoteState = (props) => {
    const s1 = {
        "speak": false,
    }

    const [state, setState] = useState(s1.speak)

    const updateSpeakValue = (newValue) => {
        setState({ ...state, speak: newValue });
    };
    const update = () => {
        setState(!s1.speak)
    }
    return (
        <StateContext.Provider value={{ state, updateSpeakValue }}>
            {props.children}
        </StateContext.Provider>
    )
}

export default NoteState;