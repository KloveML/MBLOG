<template>
  <main class="home" ref="home">
    <ul class="home__postList" >
      <li v-for="post in posts.list" :key="post.id" class="home__postListItem">
        <router-link :to="`/post/${post.id}`">
          <h2 v-text="post.title"></h2>
          <h3 v-if="post.subtitle" v-text="post.subtitle"></h3>
        </router-link>
        <span class="tip" v-for="(tag,tIndex) in post.tags" :key="tag.name">
          <router-link class="a" :to="`/tags?name=${tag.name}`" v-text="tag.label"></router-link>
          {{(tIndex < post.tags.length - 1?',':'')}}
        </span>
        <p class="tip p">Posted on {{post.createdTime}}</p>
      </li>
    </ul>
    <p class="home__noMore" v-if="posts.isFinished">没有更多了...</p>
  </main>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
// 暂存绑定函数: 用来解绑window绑定的函数
let tmpFun = null

export default {
  name: 'Home',
  computed: {
    ...mapState({
      loading: state => state.loading
    }),
    ...mapGetters({
      posts: 'home/posts'
    })
  },
  watch: {
    loading(val) {
      this.$emit('onIsShowLoading', val)
    }
  },
  // 预取数据 -- 必须return promise
  asyncData({ store }) {
    if (!store.state.home.posts.list.length) {
      return store.dispatch('home/loadPosts')
    }
  },
  mounted() {
    tmpFun = this.listenPostsByScroll.bind(this)
    window.addEventListener('scroll', tmpFun)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', tmpFun)
  },
  methods: {
    //
    listenPostsByScroll() {
      const homeEl = this.$refs['home']
      const doc_scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      const disDiff =
        homeEl.offsetTop + homeEl.clientHeight - this.getWinHeight()
      if (!this.posts.isFinished && doc_scrollTop >= disDiff - 5) {
        this.loadPosts()
      }
    },
    getWinHeight() {
      if (window.innerHeight) {
        return window.innerHeight
      }
      if (document.body && document.body.clientHeight) {
        return document.body.clientHeight
      }
      if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientHeight
      }
    },
    ...mapActions({
      loadPosts: 'home/loadPosts'
    })
  }
}
</script>

<style lang="scss" src="./index.scss" scoped>

</style>
