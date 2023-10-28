import React, { useState } from "react";
import StateContext from "./Mycontext";

const NoteState = (props) => {
    const s1 = {
        "speak": false,
        "loading": false
    }

    const [state, setState] = useState(s1.speak);
    const [loading, setLoading] = useState(s1.loading);

    const updateloadingValue = (newValue) => {
        setLoading({ ...state, loading: newValue });
    };

    const updateSpeakValue = (newValue) => {
        setState({ ...state, speak: newValue });
    };
    const update = () => {
        setState(!s1.speak)
    }
    return (
        <StateContext.Provider value={{ state, loading, updateloadingValue, updateSpeakValue }}>
            {props.children}
        </StateContext.Provider>
    )
}

export default NoteState;