// import {useAtom} from "jotai";
// import {jwtAtom} from "../atoms/autoAtom.ts";


function Login() {
    /*
    const [, setJwt] = useAtom(jwtAtom);

    function handleSubmit() {
        try {
            const response = await restClient.login({
                username,
                password
            });
            const token = response.data.jwt;
            setJwt(token)

            toast.success('You are now logged in!');
        } catch (error) {
            toast.error('Login failed. Please ');
    }
    */


    return(
        <>
            <input className={"username"} placeholder={"Username"}></input>
            <input className={"password"} placeholder={"Password"}></input>
            <button>Login</button>
        </>
    )
}

export default Login;