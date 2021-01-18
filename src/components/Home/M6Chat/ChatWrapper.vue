<template>
  <div
    class="chat-wrapper align-end bottom-0 d-flex fixed mx-2 pa-0 right-0 z-20"
  >
    <chatbox
      v-for="chatData in chats"
      :key="'chatbox-user' + chatData.id"
      :channel="chatData"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chatbox from '@/components/Home/M6Chat/Chatbox'


export default {
  name: 'ChatWrapper',
  components: {
    Chatbox
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters('GSChat', [
      'chats'
    ])
  }
}
</script>
<style>
  .chat-wrapper {
    height: 455px;
  }
</style>
