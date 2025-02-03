import { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";

function Home(){

    const inputRefs = useRef([]);
    const keyboardRefs = useRef({});
    let thresholdValueLower = 0
    let thresholdValueUpper = 4
    let currentIndex;
    const [notification, setNotification] = useState(null);
    const test = () => {
        console.log(currentIndex)
    }

    const rows = [
        "qwertyuiop", // First row
        "asdfghjkl",  // Second row
        "zxcvbnm",    // Third row with Enter and Delete
      ]; 

    function showNotification(message, type = "error") {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000)
        return;
      }

    //This function handles input when key/keybutton is pressed
    //This took so long lmao
    function handleLetter(key){
        console.log(currentIndex, key)

        if(key == "Enter" && currentIndex - 1 == thresholdValueUpper){
            let word = ""
            for(let i = thresholdValueLower ; i <= thresholdValueUpper; i++){
                word += inputRefs.current[i].innerHTML
            }
            console.log(word)
            handleWord(word)
            return;
        }

        else if(key == "Backspace" && currentIndex - 1 >= thresholdValueLower){
        
            inputRefs.current[--currentIndex].innerHTML = ""
            
        }

        else if (currentIndex >= thresholdValueLower && currentIndex <= thresholdValueUpper && /^[a-z]$/.test(key.toLowerCase())){
            inputRefs.current[currentIndex].innerHTML = key;
            currentIndex++;
            return;
        }
    }
    
    //This funtion handles the css when we submit a word
    //shapes and colors make me go crazy
    function handleSubmission(answer) { 
        let count = 0;

        for(let i = thresholdValueLower; i <= thresholdValueUpper; i++){
            inputRefs.current[i].style.backgroundColor = "gray";
            if(keyboardRefs.current[inputRefs.current[i].innerHTML].style.color != "white"){
                keyboardRefs.current[inputRefs.current[i].innerHTML].style.backgroundColor = "gray";
                keyboardRefs.current[inputRefs.current[i].innerHTML].style.color = "white"
            }
        }
        for (const pos in answer) {
          if (answer[pos] === "correct") {
            inputRefs.current[thresholdValueLower + Number(pos)].style.backgroundColor = "seagreen";
            keyboardRefs.current[inputRefs.current[thresholdValueLower + Number(pos)].innerHTML].style.backgroundColor = "seagreen";
            keyboardRefs.current[inputRefs.current[thresholdValueLower + Number(pos)].innerHTML].style.color = "white"
            count++;
          } else if (answer[pos] === "position") {
            inputRefs.current[thresholdValueLower + Number(pos) ].style.backgroundColor = "#E49B0F";
            if(keyboardRefs.current[inputRefs.current[thresholdValueLower + Number(pos)].innerHTML].style.backgroundColor != "seagreen"){
                keyboardRefs.current[inputRefs.current[thresholdValueLower + Number(pos)].innerHTML].style.backgroundColor = "#E49B0F";
                keyboardRefs.current[inputRefs.current[thresholdValueLower + Number(pos)].innerHTML].style.color = "white"
            }

          }
        }
        if(count == 5){
            showNotification("Word found", "success");
            
        }

        else{
            thresholdValueLower += 5;
            thresholdValueUpper += 5;
            console.log(thresholdValueLower, thresholdValueUpper, currentIndex)

        }
        return;
    }

    //This sends a request to backend to check if a word is valid and returns a position array
    async function handleWord(word) {
        try{
            const responce =await fetch("http://localhost:3000/api/word", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({word})
            })

            const data = await responce.json()
            if(data.success){
                 if(data.wordFound == false)
                    showNotification("Word is not in library");
                else{
                    handleSubmission(data.answer);
                }
            } else{
                alert(data.message)
            }
        }catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
          }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            handleLetter(event.key)
          
        };
        currentIndex = 0;
        console.log("here" + currentIndex)
        
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
      }, []);
      
    
    return(
        <div>
        <header className={styles.header}>
            <a href="/" className={styles.logo}>Wordle</a>
            
            <nav className={styles.navbar}>
                <a href="/">Help</a>
                <a href="/">Login</a>
            </nav>
        </header>
        {notification && (
            <div
            className={`${styles.notification} ${
                notification.type === "success" ? styles.success : styles.error
            }`}
            >
            {notification.message}
            </div>
            )}
        <div className={styles.wordArea} >
            {Array(6) 
                .fill("")
                .map((_, rowIndex) => (
                <div className={styles.wordRow} key={rowIndex}>
                    {Array(5)
                    .fill("")
                    .map((_, colIndex) => {
                        const inputIndex = rowIndex * 5 + colIndex; 
                        return (
                        <div className={styles.wordBox} key={colIndex} ref={(el) => (inputRefs.current[inputIndex] = el)} >
                            
                        </div>
                        );
                    })}
                </div>
                ))}

            <div className={styles.keyboard}>
            {rows.map((row, rowIndex) => (
                
                <div key={rowIndex} className={styles.keyboardRow}>
                {rowIndex === 2 && (
                    <>
                    <button className={styles.specialKeyStyle} onClick={() => handleLetter("Enter")}>Enter</button>

                    {[...row].map((key, keyIndex) => (
                        <button key={key} className={styles.keyStyle} onClick={() => handleLetter(key)} ref={(el) => (keyboardRefs.current[key] = el)}>{key.toUpperCase()}</button>
                    ))}

                    <button className={styles.specialKeyStyle} onClick={() => handleLetter("Backspace")}>Delete</button>
                    </>
                )}
                {rowIndex !== 2 &&
                    [...row].map((key, keyIndex) => (
                    <button key={key} className={styles.keyStyle} onClick={() => handleLetter(key)} ref={(el) => (keyboardRefs.current[key] = el)}>{key.toUpperCase()}</button>
                    ))}
                </div>
            ))}
            </div>
        </div>
        <button onClick={test}>Test</button>
        </div>
    )
}

export default Home