import { View, Text } from 'react-native'
import React from 'react'
import Button from '@material-ui/core/Button';


export default function BackToNavBtn({ setShowCurr, setShowButtons }) {
    return (
        <Button
            color="primary"
            variant="contained"
            id="backToNavBtn"
            style={{
                marginTop: "25px",
                marginBottom: "25px",
                width: "25%"
            }}
            onClick={() => {
                setShowCurr(false);
                setShowButtons(true);

            }}
        > חזור</Button>
    )
}