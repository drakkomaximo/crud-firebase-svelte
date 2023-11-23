<script>
    import { auth } from '../firebase.js';
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

    import { push } from 'svelte-spa-router';

    let email = '';
    let password = '';

    auth.onAuthStateChanged((user) => {
        if (user) {
            push('/crud');
        }else{
            push('/');
        }
    });

    const registro = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuario registrado');
        } catch (error) {
            console.log(error);
        }
    }

    const login = async () => {
        try {
            const resp = await signInWithEmailAndPassword(auth, email, password);
            if (resp) {
                push('/crud');
            }
        } catch (error) {
            console.log(error);
        }
    }
</script>

<h1>Login</h1>
<input type="email" placeholder="Email" bind:value={email}>
<input type="password" placeholder="Password" bind:value={password}>
<button on:click={registro(email, password)}>Registrase</button>
<button on:click={login(email, password)}>Login</button>
<style>
    h1 {
        font-size: 24px;
        margin-bottom: 16px;
    }

    input {
        margin-bottom: 8px;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 8px 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
