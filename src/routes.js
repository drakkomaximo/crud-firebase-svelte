import Login from './components/Login.svelte';
import Crud from './components/Crud.svelte';
import ErrorRuta from './components/ErrorRuta.svelte';

const routes = {
    '/': Login,
    '/crud': Crud,
    '*': ErrorRuta
}

export default routes;