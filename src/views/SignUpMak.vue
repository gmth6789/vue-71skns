<template>
<div class="signUp_outer row justify-content-center align-items-center">
    <div class="col signUp col-sm-10 col-md-10">
        <div class="signUp_mainIcon">
            <i class="fab fa-line"></i>
        </div>
        <div class="signUp_form">
            <div class="signUp_row">
                <i class="input_icon fas fa-envelope col-sm-3"></i>
                <input class="email_input col-sm-9" type="text" v-model="email" placeholder="Email">
            </div>
            <div class="signUp_row">
                <i class="password_icon fas fa-unlock-alt col-sm-3"></i>
                <input class="password_input col-sm-9" type="password" v-model="password" placeholder="Password">
            </div>
            <button class="signUp_btn btn btn-primary" @click="signUp">Sign in</button>
            <br />        
            <p class="note">or go back to <router-link to="/login">login</router-link>.</p>
        </div>
    </div>
</div>        
</template>

<script>
import firebase from 'firebase';

export default {
name: 'signUpMak',
data() {
    return {
        email: '',
        password: ''
    };
},
methods: {
    signUp: function() {
        firebase.auth().createUserWithEmailAndPassword(this.email.trim(), this.password).then((data) => {
            console.log(data);
            this.$router.push({ name: 'Login', params: { userId: data.user.uid}})
        }).catch((err) => {
            alert('Oops. ' + err.message);    
        });
    }
}
}
</script>

<style scoped>
*, *:before, *:after {
box-sizing: border-box;
margin: 0;
font-size: 100%;
}

input {
outline: none;
border: none;
display: inline-block;
height: 3rem;
padding-left: 1.5rem;
font-size: 1rem;
background: transparent;
color: #020302;  
}

.signUp_outer {
height: 100%;
min-width: 290px;
}

.signUp {
background-color: rgba(255, 255, 255, 0.7);
max-width: 576px;
border-radius: 17px;
}

.signUp_mainIcon i {
margin-top: 1rem;
font-size: 12rem;
color: #00c300;
}

.signUp_form {
padding: 1.5rem 1.5rem;
text-align: center;
}

.signUp_row {
height: auto;
padding-top: 1rem;
border-bottom: 1px solid rgba(0, 0, 0, 0.2);  
}

.signUp_row i {
font-size: 2rem;
display:inline-block;
margin-bottom: 10px;
}

.signUp_btn {
width: 100%;
max-width: 320px;
font-size: 1rem;
margin: 2rem 0 1rem;
color: rgba(255, 255, 255, 0.8);
border-radius: 3rem;
}

.note {
font-size: .85rem;
}

@media screen and (max-width: 576px){
.login_row .fas {
display: none;
}
}
</style>
