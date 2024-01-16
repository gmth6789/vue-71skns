<template>
<div class="login_outer row justify-content-center align-items-center">
  <div class="col login col-sm-10 col-md-10">
    <div class="login_mainIcon">
      <i class="fab fa-line"></i>
    </div>
    <div class="login_form">
      <div class="login_row">
        <i class="input_icon fas fa-envelope col-sm-3"></i>
        <input class="email_input col-sm-9" type="text" v-model="email" placeholder="Email">
      </div>
      <div class="login_row">
        <i class="password_icon fas fa-unlock-alt col-sm-3"></i>
        <input class="password_input col-sm-9" type="password" v-model="password" placeholder="Password">
      </div>
        <button class="login_btn btn btn-primary" @click="login">Sign in</button>
        <div class="social-icon">
          <a @click="socialLogin" class="btn btn-lg btn-block btn-social btn-google">
            <i class="fab fa-google"></i>Sign in with Google
          </a>
      </div> 
        <br />        
        <!-- <p class="note">You don't have an account ? You can <router-link to="/signUpMak">create one</router-link></p> -->
    </div>
  </div> 
</div>    
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Home',
  data() {
      return {
          email: '',
          password: '',
          uid: ''
      };
  },
  methods: {
      login: function() {
          firebase.auth().signInWithEmailAndPassword(this.email.trim(), this.password).then((data) => {
              this.uid = data.user.uid;
              this.$store.commit('UserLogin', {
                  email: data.user.email,
                  uid: data.user.uid 
              });
              console.log(data);
              this.$router.push({ path: '/channel', query: { user: data.user.email }, params: { userId: data.user.uid }})
          }).catch((err) => {
              alert('Oops. ' + err.message);    
          });
      },
      socialLogin() {
          const provider = new firebase.auth.GoogleAuthProvider();

          firebase.auth().signInWithPopup(provider).then((data) => {
              this.uid = data.user.uid;

              if(data.additionalUserInfo.isNewUser == true){
                  console.log('create new user');
              }else{
                  console.log('Old User');
              }
              console.log(data);
              this.$router.push({ name: 'Channel', params: { userId: data.user.uid}})
          }).catch((err) => {
              alert('Oops. ' + err.message);
          });
      }
  },
  mounted: function() {
      console.log(firebase.auth());
      console.log(firebase.auth().currentUser);
  },
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

.login_outer {
height: 100%;
min-width: 290px;
}

.login {
background-color: rgba(255, 255, 255, 0.7);
max-width: 576px;
border-radius: 17px;
box-shadow: 0 2px 32px 0 rgba(255,255,255,.5);
}

.login_mainIcon i {
margin-top: 1rem;
font-size: 12rem;
color: #00c300;
}

.login_form {
padding: 1.5rem 1.5rem;
text-align: center;
}

.login_row {
height: auto;
padding-top: 1rem;
border-bottom: 1px solid rgba(0, 0, 0, 0.2);  
}

.login_row i {
font-size: 2rem;
display:inline-block;
margin-bottom: 10px;
}

.login_btn {
width: 100%;
max-width: 320px;
font-size: 1rem;
margin: 2rem 0 1rem;
color: rgba(255, 255, 255, 0.8);
/* background-color: #FF3366; */
border-radius: 3rem;
}

.social-icon {
color: rgba(255, 255, 255, 0.8);
width: 100%;
max-width: 250px;
display: inline-block;
margin: 2rem 0 1rem;
}

.social-icon i {
  line-height: 40px !important;
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