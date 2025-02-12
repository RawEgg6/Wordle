import { useState } from "react"

function Auth() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault()

        if(!email || !password ) {
            alert("Fill in all the feilds")
            return
        }

        const responce = await fetch("http://localhost:3000/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
    })
    }

    return(
        <>
        <h1>Login to continue</h1>
        <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} 
            onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            <input type="reset"/>
            <input type="submit"/>
        </form>
        </>
    )
}

export default Auth