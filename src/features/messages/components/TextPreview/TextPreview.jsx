import React from 'react'

const TextPreview = ({ txt, isLongTxtShown, toggleLongText, classes }) => {

    if (txt.length < 90) return <section className={classes}>{txt}</section>
    return (
        <section className={classes}>
            {isLongTxtShown ?
                <React.Fragment>
                    {txt}
                    <span className='text-[#4870AD]' onClick={() => toggleLongText(false)}> קרא פחות</span>
                </React.Fragment> :
                <React.Fragment>
                    {txt.substr(0, 90)}
                    <span className='text-[#4870AD]' onClick={() => toggleLongText(true)}> קרא עוד...</span>
                </React.Fragment>}
        </section>
    )
}

export default TextPreview