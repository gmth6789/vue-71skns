<template>
<div class="channel">
  <nav class="navbar navbar-expand-lg bg-dark">
    <div class="user">
      <i class="user_icon fas fa-robot"></i>
      <p class="navbar-brand">{{this.userData.email}}</p>
    </div>
    <button class="bar_sm_button navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <i class="fas fa-bars"></i>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0"></ul>        
      <form class="form-inline my-2 my-lg-0">
        <input v-model="searchInput" class="form-control mr-sm-2" type="search" placeholder="Search">
        <button @click="searchData" class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
    <button @click="siginOut" class="btn btn-outline-success my-2 my-sm-0 signOutButton">Sign Out</button>
</nav>

  <div class="containerInner container-fluid">
    <ul class="listChannel">
      <li @click="createNew" class="listChannel-item col-sm-2 button-addChannel">
        <div class="button-addChannelInner">
          <div class="addButton">
              <i class="fas fa-plus-circle icon"></i>
          </div>
          <div class="addLabel">Create new channel</div>
        </div>
      </li>        
      <!-- order channel item -->
      <li v-for="(channel, index) in searchDataList" :key="channel.name" class="listChannel-item col-sm-2">
        <router-link :to="{ name: 'Message', params: { name: channel.name, token: channel.accToken, imgUrl: channel.imgUrl }, query: {name: channel.name}}">
          <div class="listChannel-itemHeader">
            <div class="listChannel-itemImg">
              <img :src="channel.imgUrl" alt="">  
            </div>
          </div>
          <p class="listChannel-itemName">{{channel.name}}</p>
          <p class="listChannel-itemStatus"></p>
          </router-link>
          <div class="listChannel-itemBody">
            <div>
              <ul>
                <li><button @click="deleteChannel(channel.name, index)" class="btn btn-light delete-btn">Delete</button></li>
              </ul>
            </div>
          </div>
      </li>
    </ul>
  </div>
  <!-- Create new channel -->
  <div class="createNewChannel" v-if="createNewChannel">
    <div class="cnc-outer justify-content-md-center col-md-8">
      <div class="cnc-close" @click="closeWrapper">
        <i class="fas fa-window-close"></i>
      </div>
        <div class="cnc-innerHeader">
          <div class="title">Create New Channal</div>
          <div class="subTitle">
            Please input a channel from the following and create a new channel.
          </div>
        </div>
        <div class="cnc-innerBody">
          <form action="">
            <div class="form-group">
              <label for="InputName">Channel Name</label>
              <input v-model="NCNData.name" type="text" class="form-control" id="InputName" placeholder="Enter Name">
            </div>
          </form>
          <form action="">
            <div class="form-group">
              <label for="InputAccessToken">Webhooks Url</label>
              <input v-model="NCNData.webhooks" type="text" class="form-control" id="InputWebhooks" placeholder="Enter Webhooks Url">
            </div>
          </form>
          <form class="cnc-innerBodyFooter" action="">
            <div class="form-group">
              <label for="InputAppIcon">App Icon</label>
              <div class="appIcon">
                <div class="uploadImg col-sm-6">
                  <input @change="uploadImage($event)" class="imgFile" type="file" accept="image/*">
                  <i class="far fa-images"></i>
                </div>
                <div class="showImg col-sm-6">
                  <img v-bind:src="this.NCNData.appIconUrl" alt="">
                </div>
              </div>
              <small id="imgHelp" class="form-text text-muted">Under 1MB; JPEG/PNG/GIF/BMP</small>
            </div>
          </form>
          <div class="modal-footer">
            <button @click="closeWrapper" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button @click="sendNewChannel" type="button" class="cnc-enterButton btn btn-primary">Enter</button>
          </div>                    
        </div>        
    </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase';

export default {
name: 'home',
created: function() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      this.userData.uid = user.uid;
      this.userData.email = user.email;
      this.userData.photoURL = user.photoURL;

      let msgRef = firebase.database().ref(`/${user.uid}/`);
        msgRef.once('value', (snapshot) => {
        let val = snapshot.val();
        
        for(let i in val) {
          this.channelData.push({
            name: val[i].channelName,
            webhooks: val[i].webhooks,
            imgUrl: val[i].imgUrl
          })
        }
        this.searchDataList = this.channelData; // 將資料統一
        }) 
    } else {
      console.log('no sign in')
      this.$router.push({ name: 'Login', params: { userId: 'channel'}});
    }
  });  
},
data() {
  return {
    userData: {     // 使用者的資料
      uid: '',
      email: '',
      photoURL: ''
    },
    channelData: [], // 畫面呈現依據資料 , 新增修改後改動的資料  ( key:[name, accToken, imgUrl] )
    searchInput: '', // 搜尋欄位的 input
    searchDataList: [],  // 搜尋後的資料結果 綁定畫面 ( key:[name, accToken, imgUrl] )
    NCNData: {       // 新增頻道的資料 
      name: '',
      webhooks: '',
      appIconUrl: ''
    },
    imgFile: {},     // 新增頻道的圖片資料 (file) 
    createNewChannel: false  // 新增畫面 => true: open : false: close
  }
},
methods: {
  siginOut: function() {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  },
  createNew: function() {
    console.log('true')
    this.createNewChannel = true;
  },
  deleteChannel: function(cname, index) {
    let msgRef = firebase.database().ref(`/${this.userData.uid}/`);
    this.searchDataList.splice(index, 1);
    console.log(`${cname} : ${index}`);
    msgRef.child(cname).remove();
  },
  closeWrapper: function() {
    this.createNewChannel = false;
    this.NCNData = {
      name: '',
      webhooks: '',
      appIconUrl: ''
    },
    this.imgFile = {};
  },
  uploadImage: function(e) {
    this.imgFile = e.target.files[0];
    console.log(this.imgFile);

    var reader = new FileReader();
      reader.onload = (img) => {
        this.NCNData.appIconUrl = img.target.result;
    };
    reader.readAsDataURL(e.target.files[0]); 
  },
  sendNewChannel: function() {
    if(this.NCNData.name != '' && this.userData.AccToken != '' && this.imgFile.lastModified){
      let fileName = `${this.NCNData.name}_${this.imgFile.name}`;
      let metadata = {
        contentType: 'image/*'
      };
      let storageRef = firebase.storage().ref(this.userData.uid);
      let uploadTask = storageRef.child(fileName).put(this.imgFile, metadata);
      
      // 
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
         let progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if(progress >= 100) {
            console.log('img upload success');
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              let msgRef = firebase.database().ref().child(`${this.userData.uid}`);
                msgRef.child(`${this.NCNData.name}`).set({
                  channelName: this.NCNData.name,
                  webhooks: this.NCNData.webhooks,
                  imgUrl: downloadURL
                });

                // 在畫面上新增 
                this.channelData.push({
                  name: this.NCNData.name,
                  webhooksUrl: this.NCNData.webhooks,
                  imgUrl: downloadURL
                });
              // close Wrapper
              this.closeWrapper();
            });
          }
        },
        function(error) {
          switch (error.code) {
            case 'storage/unauthorized':
              console.log("User doesn't have permission to access the object");
            break;

            case 'storage/canceled':
              console("User canceled the upload");
            break;

            case 'storage/unknown':
              console("Unknown error occurred, inspect error.serverResponse");
            break;
          }
        });
      console.log('senNewChannel');
    }else{     
      console.log('CNC error');
    }
  },
  searchData: function() {
    let input = this.searchInput.trim().toLowerCase();
    console.log(`search Input = ${input}`);
    if(input === '') {
      return this.channelData;
    }else {
      this.searchDataList = this.channelData.filter((item) => {
        return item.name.toLowerCase().indexOf(input) != -1
      });
    }
  }
},
watch: {
  searchInput: function(input) {
    if(!input) {
      this.searchDataList = this.channelData;
    }
  }
}
}
</script>

<style scoped>
::placeholder {
color: #EFD8DD;
opacity: 1; /* Firefox */
}

a {
text-decoration: none;
color: #1b1e21;
}

p {
margin-top: 0;
}

ul {
list-style: none;
margin: 0;
padding: 1rem 0;
}

.user {
margin-left: 2rem;
color: #28a745;
}

.user_icon {
font-size: 1.5rem;
margin-right: 1rem;
margin-top: .35rem
}

.bar_sm_button {
border: 1px solid rgb(40, 167, 69);
color: rgb(40, 167, 69);
}

.bar_sm_button i {
font-size: 1rem;
}

.signOutButton {
margin-left: .5rem;
}

.containerInner {
margin-top: 1rem;
background-color: rgba(255, 255, 255, 0.5);
}

.listChannel {
display:flex;
flex-wrap: wrap;
padding: 1rem;
}

.button-addChannel {
position: relative;
min-height: 230px;
display: flex; 
flex-direction: column;
}

.button-addChannelInner {
flex: 1;
height:100%;
width: 100%;
min-height: 230px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
cursor: pointer;
}

.button-addChannelInner:hover {
color: #FFF;
background-color: #16C464;
border-radius: 25px 25px;
}

.delete-btn {
background-color: #F7F8F9;
color: #1b1e21;
}

.delete-btn:hover {
background-color: #F7F8F9;
}

.addButton {
display: inline-block !important;
text-align: center;
outline: none;
border: none;
border-radius: 50%;
cursor: pointer;
line-height: normal;
width: 54px;
height: 54px;
color: #FFF;
background-color: #16C464;
text-decoration: none;
transition: background-color .25s ease-out, box-shadow .25s ease-out, color .25s ease-out;
font-weight: bold;
}

.button-addChannel:hover .addButton {
margin-top: -8px;
transition: all .35s ease-out;
background-color: #FFF;
color: #16C464;
}

.addButton .icon {
line-height:55px;
font-size: 42px;
}

.addLabel {
padding-top: 12px;
font-weight: bold;
}

.listChannel-item {
width: 230px;
min-height: 300px;
margin-right: 30px;
margin-bottom: 30px;
padding: 0;
border: 1px solid #DEE5EC;
border-radius: 25px;
background-color: #FFF;
}

.listChannel-item:hover {
transition: all 0.25s ease-out;
box-shadow: 0 6px 17px 0 rgba(0, 0, 0, .1);
}

.listChannel-item a {
margin: 0;
padding: 0;
width: 100%;
/* height:100%; */
display: flex;
flex-direction: column;
}

.listChannel-itemHeader {
text-align: center;
position: relative;
padding-top:52px;
box-sizing: border-box;
}

.listChannel-item:hover:hover .listChannel-itemHeader {
padding-top: 48px;
margin-bottom: 4px;
transition: all 0.25s ease-out;
}

.listChannel-itemImg {
width: 60px;
height: 60px;
margin: 0 auto 10px;
border-radius: 20px;
overflow: hidden;
background: #d5d5d5;
}

.listChannel-itemImg img {
width: 100%;
height: 100%;
object-fit: cover;
border-style: none;
}

.listChannel-itemName {
font-size: 14px;
font-weight: bold;
line-height: 1.2em;
padding-left: 0.25em;
padding-right: 0.25em;
}

.listChannel-item:hover:hover .listChannel-itemName {
color: #00BE00;
}

.listChannel-itemStatus {
font-size: 12px;
font-weight: bold;
color: #6C7985;
min-height: 19px;
margin-bottom: 16px;
}

.listChannel-itemBody {
margin-top: auto;
background-color: #F7F8F9;
height: 140px;
text-align: center;
padding-top: 20px;
box-sizing: border-box;
border-radius: 0 0 25px 25px;
}

.listChannel-item:hover:hover .listChannel-itemBody {
background-color: #16C464;
transition: all 0.25s ease-out;
border-radius: 0 0 25px 25px;
}

.listChannel-item:hover:hover .listChannel-itemBody div {
color: #FFF;
}

.listChannel-item:hover:hover .listChannel-itemBody button {
color: #16C464;
box-shadow: 0 6px 17px 0 rgba(0, 0, 0, .1);
transition: all 0.25s ease-out;
border-radius: .2rem
}

.createNewChannel {
background: rgba(0, 0, 0, .5);
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 200;
}

.cnc-outer {
max-width: 800px;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
text-align: left;
border-radius: 20px;
background: #FFF;
box-sizing: border-box;
}

.cnc-close {
position: absolute;
top:-68px;
right: 0px;
font-size: 48px;
cursor: pointer;
color: #FAEBD7;
}

.cnc-close:hover {
transition: all 0.25s ease-out;
color: #FF4500;
}

.cnc-innerHeader {
position: relative;
margin-bottom: 20px;
padding: 36px 36px 0 36px;
text-align: center;
box-sizing: border-box;
}

.cnc-innerHeader .title {
font-weight: bold;
font-size: 16px;
padding: 0;
margin: 0;
}

.cnc-innerHeader .subTitle {
font-size: 14px;
color: #6A6A6A;
padding: 10px 0 0;
}

.cnc-innerBody {
flex: 1 1 0%;
padding: 0 36px 28px 36px;
font-size: 16px;
font-weight: bold;
color: #696969;
box-sizing: border-box;
}

.appIcon {
  display:block;
  font-size: 28px;
}

.appIcon i {
font-size: 2.5em;
}

.imgFile {
opacity: 0;
position: absolute;
cursor: pointer;
height: 2em;
}

#imgHelp {
margin-top: 1rem;
}

.appIcon div {
display: inline-block;
}

.cnc-innerBodyFooter .form-group img {
width: 60px;
height:60px;
vertical-align: unset;
}

@media screen and (max-width: 576px){
.listChannel-item {
  margin: 0 auto 1rem;

}

.cnc-innerHeader .subTitle {
  font-size: .7rem;
}
}
</style>