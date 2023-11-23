<script>
    import { auth } from "../firebase";
    import { push } from "svelte-spa-router";
    import { db } from "../firebase";
    import { storage } from "../firebase";
    import {
        onSnapshot,
        collection,
        addDoc,
        deleteDoc,
        doc,
        updateDoc,
    } from "firebase/firestore";

    import {
        ref,
        uploadBytesResumable,
        getDownloadURL,
        deleteObject,
    } from "firebase/storage";

    let userEmail = "";
    let userId = "";

    let nombre = "";
    let email = "";
    let idUpdate = "";
    let users = [];

    let files = "";
    let proggres = 0;
    let imgDelete = "";

    const cleanUser = () => {
        nombre = "";
        email = "";
        idUpdate = "";
        files = "";
    };

    onSnapshot(collection(db, "users"), (snapshot) => {
        users = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
    });

    const addUser = async (url, fileName) => {
        try {
            if (!nombre.trim() || !email.trim()) {
                alert("todos los campos son obligatorios");
                return;
            }

            await addDoc(collection(db, "users"), {
                nombre,
                email,
                url,
                fileName,
            });
            console.log("Usuario agregado");
            cleanUser();
        } catch (error) {
            console.log(error);
        }
    };

    const addUserWithImages = async () => {
        let file = "";
        if (files && files[0]) {
            file = files[0].name + Math.random().toString(30);
        }

        const storageRef = ref(storage, `images/${file}`);
        const uploadTask = uploadBytesResumable(storageRef, files[0]);

        uploadTask.on(
            "state-changed",
            (snapshot) => {
                proggres =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    addUser(downloadURL, file);
                    proggres = 0;
                });
            },
        );
    };

    const updateUser = async (url, fileName) => {
        try {
            await updateDoc(doc(db, "users", idUpdate), {
                nombre,
                email,
                url,
                fileName
            });
            console.log("Usuario actualizado");
            cleanUser();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUser = async (id, fileName) => {
        try {
            await deleteDoc(doc(db, "users", id));
            await deleteImage(fileName);
            console.log("Usuario eliminado");
            cleanUser();
        } catch (error) {
            console.log(error);
        }
    };

    const edituserWithImage = async () => {
        let file = "";
        if (files && files[0]) {
            file = files[0].name + Math.random().toString(30);
        }

        const storageRef = ref(storage, `images/${file}`);
        const uploadTask = uploadBytesResumable(storageRef, files[0]);

        uploadTask.on(
            "state-changed",
            (snapshot) => {
                proggres =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    deleteImage(imgDelete);
                    updateUser(downloadURL, file);
                    proggres = 0;
                });
            },
        );
    };

    const deleteImage = async (fileName) => {
        try {
            const storageRef = ref(storage, `images/${fileName}`);
            await deleteObject(storageRef);
            console.log("Imagen eliminada");
        } catch (error) {
            console.log(error);
        }
    };

    const enviarForm = (name, correo, id, fileName) => {
        nombre = name;
        email = correo;
        idUpdate = id;
        imgDelete = fileName;
    };

    auth.onAuthStateChanged((user) => {
        if (user) {
            userEmail = user.email;
            userId = user.uid;
            console.log(userEmail, userId);
        } else {
            push("/");
        }
    });

    const salir = () => {
        auth.signOut();
    };
</script>

<div class="container">
    <h1>CRUD</h1>

    <div>
        <input class="form-input" type="hidden" bind:value={idUpdate} />
        <input
            class="form-input"
            type="text"
            placeholder="Nombre"
            bind:value={nombre}
        />
        <input
            class="form-input"
            type="text"
            placeholder="Email"
            bind:value={email}
        />
        <input type="file" bind:files />

        <br>
        <br>
        
        {#if proggres > 0}
        <div class="progress-bar">
            <div class="progress-bar-fill" style="width: {proggres}%"></div>
        </div>
        {/if}

        {#if idUpdate}
            <button class="form-button update" on:click={edituserWithImage}
                >Actualizar</button
            >
        {:else}
            <button class="form-button add" on:click={addUserWithImages}
                >Guardar</button
            >
        {/if}
    </div>

    <br />
    <hr />
    <br />

    <table class="table">
        <thead>
            <tr>
                <th></th>
                <th>Id</th>
                <th>Nombre</th>
                <th>Email</th>
                <th colspan="2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user}
                <tr>
                    <th>
                        <img
                            src={user.url}
                            alt={user.nombre}
                            width="100"
                            height="100"
                            class="circular-image"
                        />
                    </th>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>
                        <button
                            class="table-button"
                            on:click={enviarForm(
                                user.nombre,
                                user.email,
                                user.id,
                                user.fileName
                            )}>Editar</button
                        >
                    </td>
                    <td>
                        <button
                            class="table-button"
                            on:click={() => deleteUser(user.id, user.fileName)}
                            >Eliminar</button
                        >
                    </td>
                </tr>
            {:else}
                <tr>
                    <td colspan="5" class="no-users">No hay usuarios</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <button class="logout-button" on:click={salir}>Cerrar Sesión</button>
</div>

<style>
    .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    .form-input {
        margin-bottom: 1rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
    }

    .form-button {
        padding: 0.5rem 1rem;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .add {
        background-color: #4caf50;
    }

    .update {
        background-color: #af904c;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
    }

    .table th,
    .table td {
        text-align: center;
        padding: 0.5rem;
        border-bottom: 1px solid #ccc;
    }

    .table th {
        background-color: #f2f2f2;
    }

    .table td button {
        padding: 0.25rem 0.5rem;
        background-color: #f44336;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .no-users {
        text-align: center;
        font-style: italic;
    }

    .logout-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #f44336;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .progress-bar {
        width: 100%;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        background-color: #007bff;
        transition: width 0.3s ease-in-out;
    }

    .circular-image{
        border-radius: 50%;
    }
</style>
