<template>
<div class="channel">
  <nav class="navbar navbar-expand-lg bg-dark">
    <div class="user">
      <i class="user_icon fas fa-robot"></i>
      <p class="navbar-brand">{{this.userData.email}}</p>
    </div>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02"></div>
    <span class="nav-channelName badge badge-light">{{this.channelData.name}}</span>
    <button @click="siginOut" class="btn btn-outline-success my-2 my-sm-0 signOutButton">Sign Out</button>
  </nav>

  <div class="containerInner container-fluid">
    <OpenPostList v-if="this.$store.state.isOpenPostList"/>
    <div class="messageHead">
      <form class="form-inline">
        <label class="my-1 mr-2" for="inlineFormCustomSelectPref">發送對像(Post ID)</label>
        <select v-model="postId" class="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
          <option value="null" selected disabled hidden>請選擇...</option>
          <option v-for="post in postGroup" :key="post.id" :value="post.id">{{post.name}}</option>
        </select>
        <button @click="openPostList" type="submit" class="btn btn-primary my-1">列表(PostList)</button>
      </form>
      <button @click="axiosTest" class="sendMsgButton btn btn-lg btn-success">傳送</button>
    </div>
    <hr />
    <div class="messageBody">
      <div class="messageBodyOuter" v-for="(message, index) in messages" :key="`${message.key}`">
        <!-- [Message] - text -->
        <div class="messageBodyInner text" v-if="message.type == 'text'">
          <div class="messageTop form-group" style="background-color: beige;">
            <div class="">
              <b>文字</b>
            </div>
            <div class="messageClose" @click="closeMessage(message.key, index)">
              <i class="far fa-window-close"></i>
            </div>
            </div>
            <div class="messageBottom form-group">
              <textarea v-model="message.text" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
              <div class="bonus">
                <button class="btn btn-success" ><b>表情</b></button>
                <div>0/500</div>
              </div>
          </div>  
        </div>
        <!-- [Message] - sticker -->
        <div class="messageBodyInner sticker" v-if="message.type == 'sticker'">
          <div class="messageTop form-group" style="background-color: burlywood;">
            <div class="">
              <b>貼圖</b>
            </div>
            <div class="messageClose" @click="closeMessage(message.key, index)">
              <i class="far fa-window-close"></i>
            </div>
            </div>
            <div class="messageBottom form-group">
              <div class="input-group mb-3">
                <div class="packageInput">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">packageId</span>
                  </div>
                  <input v-model="message.packageId" type="text" class="form-control" placeholder="packageId" aria-label="packageId" aria-describedby="basic-addon1">
                </div>
                <div class="stickerInput">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">stickerId</span>
                  </div>
                  <input v-model="message.stickerId" type="text" class="form-control" placeholder="stickerId" aria-label="stickerId" aria-describedby="basic-addon1">  
                </div>                
              </div>
              <div class="bonus">
              </div>
          </div>  
        </div>
        <!-- [Message] - image -->
        <div class="messageBodyInner image" v-if="message.type == 'image'">
          <div class="messageTop form-group" style="background-color: darkgrey;">
            <div class="">
              <b>圖片</b>
            </div>
            <div class="messageClose" @click="closeMessage(message.key, index)">
              <i class="far fa-window-close"></i>
            </div>
            </div>
            <div class="messageBottom form-group">
              <div class="input-group mb-3">
                <div class="originalInput">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">原始圖片(Url)</span>
                  </div>
                  <input v-model="message.originalContentUrl" type="text" class="form-control" placeholder="originalContentUrl HTTPS 1MB Max:1024x1024" aria-label="originalContentUrl" aria-describedby="basic-addon1">
                </div>
                <div class="previewInput">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">預覽圖片(Url)</span>
                  </div>
                  <input v-model="message.previewImageUrl" type="text" class="form-control" placeholder="previewImageUrl HTTPS 1MB Max:240x240" aria-label="previewImageUrl" aria-describedby="basic-addon1">  
                </div>                
              </div>
              <div class="bonus">
              </div>
          </div>  
        </div>
        <!-- [Message] - flex -->
        <div v-if="message.type == 'flex'">
          <div style="color:#fff;">客製選單</div>
        </div>
        <!-- [Message] - imagemap -->
        <div class="messageBodyInner imagemap" v-if="message.type == 'imagemap'">
          <div class="messageTop form-group" style="background-color: darkgrey;">
            <div class="">
              <b>圖片連結</b>
            </div>
            <div class="messageClose" @click="closeMessage(message.key, index)">
              <i class="far fa-window-close"></i>
            </div>
            </div>
            <div class="messageBottom form-group">
              <div class="input-group mb-3">
                <div class="baseUrlInput">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">原始圖片(Url)</span>
                  </div>
                  <input v-model="message.baseUrl" type="text" class="form-control" placeholder="baseUrl HTTPS 1MB size:1040x1040" aria-label="baseUrl" aria-describedby="basic-addon1">
                </div>
                <div class="altTextInput">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">說明文字</span>
                  </div>
                  <input v-model="message.altText" type="text" class="form-control" placeholder="altText Max: 400 characters" aria-label="altText" aria-describedby="basic-addon1">  
                </div>
                <div class="linkUriInput">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">連結網址(Url)</span>
                  </div>
                  <input v-model="message.actions[0].linkUri" type="text" class="form-control" placeholder="linkUri Max: 1000 characters" aria-label="linkUri" aria-describedby="basic-addon1">  
                </div>                                  
              </div>
              <div class="bonus">
              </div>
          </div>  
        </div>
      </div>        
    </div>
    <hr />
    <div class="messageFooter">
      <div class="buttomGroup">
        <button class="col-3 btn btn-secondary" name="text" @click="newMessage($event)">文字</button>
        <button class="col-3 btn btn-secondary" name="sticker" @click="newMessage($event)">貼圖</button>
        <button class="col-3 btn btn-secondary" name="image" @click="newMessage($event)">圖片</button>
        <button class="col-4 btn btn-secondary" name="imagemap" @click="newMessage($event)">圖片連結</button>
        <button class="col-4 btn btn-secondary" name="flex" @click="newMessage($event)" disabled>客製選單</button>
        <div class="alert alert-warning" role="alert">
          每次可傳送 <strong>5</strong> 則訊息，請選擇您要傳送的訊息。
      </div>       
      </div>
    </div>
    小工具 
      <span class="badge badge-success"><a href="https://imgur.com/" target="_blank">imgur</a></span> |
      <span class="badge badge-success"><a href="https://www.fotojet.com/tw/apps/?entry=edit" target="_blank">照片編輯器</a></span> |
      <span class="badge badge-success"><a href="https://compressor.io/compress" target="_blank">圖片壓縮</a></span> |
    <hr />
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import OpenPostList from '@/components/OpenPostList.vue'
import firebase from 'firebase';

export default {
name: 'home',
components: {
  OpenPostList
},
created: function() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      this.userData.uid = user.uid;
      this.userData.email = user.email;
      this.userData.photoURL = user.photoURL;

      let msgRef = firebase.database().ref(`/${user.uid}/${this.$route.query.name}`);
        msgRef.on('value', (snapshot) => {
          let val = snapshot.val();
        
          this.channelData.name = val.channelName;
          this.channelData.webhooks = val.webhooks;
          this.channelData.imgUrl = val.imgUrl;
          //postList資料更動時防止重複寫入
          this.postGroup = []; 
           
          if(typeof(val.post) === 'object'){
            for(let i in val.post) {
              this.postGroup.push({
                key: val.post[i].key,
                name: val.post[i].postName,
                id: val.post[i].postId
              })
            }
          }else{
            console.log('PostGroup empty');
          }

          this.$store.commit('channelData', {
            userId: user.uid,
            channelName: val.channelName,
            postData: this.postGroup
          })
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
    channelData: {
      name: '',
      webhooks: '',
      imgUrl: '',
      post: ''
    },
    postGroup: [],
    postId: '',
    messages: [],
    buttonDisable: false
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
  newMessage: function(e) {
    if(this.messages.length < 5) {
      let key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      console.log(key)
      let type = e.target.name;

      switch(type) {
        case 'text':
          this.messages.push({
            key: `${type}-${key}`,
            type: type,
            text: ''
          });
          break;
        
        case 'sticker':
          this.messages.push({
            key: `${type}-${key}`,
            type: type,
            packageId: '',
            stickerId: ''
          });
          break;

        case 'image':
          this.messages.push({
            key: `${type}-${key}`,
            type: type,
            originalContentUrl: '',
            previewImageUrl: ''
          });
          break;

        case 'imagemap':
          this.messages.push({
            key: `${type}-${key}`,
            type: type,
            baseUrl: '',
            altText: '',
            baseSize: {
              width: 1040,
              height: 1040
            },
            actions: [{
              type: 'uri',
              linkUri: '',
              area: {
                x: 0,
                y: 0,
                width: 1040,
                height: 1040
              }
            }]
          });
          break;                        

        case 'flex':
          this.messages.push({
            key: `${type}-${key}`,
            type: type,
          });
          break;
      }
    }
  },
  closeMessage: function(key, index) {
    this.messages.splice(index, 1);
    console.log(key + ' : ' + index);
  },
  openPostList: function() {
    this.$store.commit('postListStatus', {status: true});
  },
  axiosTest: function() {
    if(this.messages.length > 0 && this.postId != '') {
      const qs = require('qs');
      let postMsg = this.messages;
      postMsg[0].postId = this.postId;
      console.log(postMsg);

      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(postMsg, { arrayFormat: 'indices' }),
        url: this.channelData.webhooks
      };
      this.axios(options);
    }else{
      return;
    }
  }
},
watch: {
  '$route': function() {
    console.log(this.$route.fullPath);
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
margin-top: .35rem;
display: inline-block;
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
background-color: rgba(255, 255, 255, 0.6);
}

.nav-channelName {
color: rgb(40, 167, 69);
font-size: 1.5rem;
margin: 0 auto;
max-width: 100vw; 
overflow: hidden;
}

.messageHead {
display: flex;
flex-direction: column;
align-items: start;
}

.sendMsgButton {
margin-top: 1rem;
align-self: flex-end;
}

.messageBody {
display: flex; 
flex-direction: column; 
align-items: center;
}

.messageBodyOuter {
margin:1rem 0; 
min-width:50%;
}

.messageBodyInner {
background-color:#fff; 
border-radius: 12px;
}

.messageTop {
display: flex; 
flex-direction: row; 
justify-content: space-between; 
padding: 1rem; 
border-radius: 12px 12px 0 0; 
}

.messageClose {
cursor: pointer;
}

.messageClose i {
font-size: 2rem;
}

.messageBottom {
padding: 1rem; 
border-radius: 0 0 12px 12px;
}

.messageBottom .bonus {
display: flex; 
flex-direction: row; 
justify-content: space-between; 
margin-top: 1rem;
}

.sticker .input-group, .image .input-group, .imagemap .input-group {
display: flex;
flex-direction: column;
}

.sticker .packageInput, .sticker .stickerInput, .image .originalInput, .image .previewInput, .imagemap .baseUrlInput, .imagemap .linkUriInput, .imagemap .linkUriInput {
margin-bottom: 1rem;
}

.buttomGroup {
background-color: #fff;
max-width: 800px;
border-radius: 6px;
margin: 1rem auto;
}

.buttomGroup button {
margin: 1rem;
}
</style>