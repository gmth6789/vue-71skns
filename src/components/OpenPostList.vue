<template>
<div class="postList">
  <div class="postListOuter">
    <div class="postList-Header">
      <span class="badge badge-warning">Post List</span>
      <div @click="closePostList" class="closeButton">
        <i class="far fa-window-close"></i>
      </div>
    </div>
    <form class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">name</th>
            <th scope="col">ID</th>
            <th scope="col">Modification</th>
            </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">NEW</th>
            <td><input class="newPostName" v-model="newPostData.name" type="text"></td>
            <td><input class="newPostId" v-model="newPostData.id" type="text"></td>
            <td><button @click="addPostList" class="btn btn-outline-primary">新增</button></td>
          </tr>            
          <tr v-for="(post, index) in this.$store.state.channelData.post" :key="post.key">
            <th class="col-3" scope="row">{{ index }}</th>
            <td class="col-3">{{post.name}}</td>
            <td class="col-3">{{post.id}}</td>
            <td class="col-3"><button @click="removePost(post.key)" class="btn btn-outline-warning">刪除</button></td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</div>
</template>

<script>
import firebase from 'firebase';

export default {
name: 'OpenPostList',
data: function() {
  return {
    newPostData: {
      name: '',
      id: ''
    }
  }
},
methods: {
  closePostList: function() {
    this.$store.commit('postListStatus', {status: false});
  },
  addPostList: function() {
    if(this.newPostData.name.trim() != '' && this.newPostData.id.trim() != ''){
      let key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
      let msgRef = firebase.database().ref().child(`${this.$store.state.channelData.userId}/${this.$store.state.channelData.channelName}`);
        msgRef.child(`post/${key}`).set({
          key: key,
          postName: this.newPostData.name,
          postId: this.newPostData.id
        }).then(() => {
          this.newPostData = {
            name: '',
            id: ''
          }
        });
    }else{
      alert('請填寫正確欄位!');
    }
  },
  removePost: function(key) {
    let msgRef = firebase.database().ref().child(`${this.$store.state.channelData.userId}/${this.$store.state.channelData.channelName}/post`);
    msgRef.child(`${key}`).remove();
    console.log('remove post: ' + key);
  }
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.postList {
background: rgba(0, 0, 0, .5);
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 200;
}

.postListOuter {
max-width: 800px;
top: 50%;
left: 50%;
transform: translate(0%, 5%);
text-align: left;
/* border-radius: 20px; */
background: #FFF;
box-sizing: border-box;
margin: 0 auto;
}

.postList-Header {
padding: 1rem;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center
}

.postList-Header .badge {
font-size: 1.6rem;
}

.closeButton {
cursor: pointer;
}

.closeButton i {
font-size: 3rem;
color: darkred;
}

.closeButton:hover i {
background-color: darkred;
color: #fff;
padding: 0 3px;
}

.table {
text-align: center;
}

form {
background-color: #fff
}
</style>