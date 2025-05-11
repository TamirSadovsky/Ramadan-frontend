import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import ReactModal from 'react-modal';
import Button from '@material-ui/core/Button';


export default function Modal(
    {
        show,
        content,
        title,
        buttonText = "שגיאה",
        toggleShowModal,
        buttonFunction = () => { },
    }) {
    const { height } = Dimensions.get('window');
    if (show) {
        return (
            <ReactModal
                appElement={document.getElementById('root')}
                isOpen={show}
                style={{
                    content: {
                        writingDirection: "rtl",
                        height: (height * 0.60),
                        textAlign: "center",
                        zIndex: '500'
                    }
                }}
            >
                {<h2>{title}</h2>}
                <div style={{ height: '60%' }}>
                    {content}
                </div>
                <Button
                    variant="contained"
                    id="searchOrderBtn"
                    color="primary"
                    style={{
                        margin: "0 auto",
                        width: "100%",
                        bottom: "0"
                    }}
                    onClick={() => {
                        toggleShowModal(false);
                        buttonFunction();
                        // setOrderViewd(true);
                    }}
                >
                    {buttonText}
                </Button>
            </ReactModal>
        )
    }
    else return null
}
