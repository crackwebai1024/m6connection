<template>
  <div
    class="py-4 white app-slider-wrapper mb-5"
    :class="collapseAppPanel ? 'px-13' : 'px-0 full-screen'"
    :style="{
      backgroundImage: 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) )',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      paddingBottom: '6px!important',

      marginBottom: '8px!important',
      position: 'relative',
      overflow: ''
    }"
  >
      <video class="header-background" style='height: 100%; width: 100%;' playsinline autoplay muted loop poster='@/assets/header-background.png' id="bgvid">
        <source src="@/assets/header-background-video.webm" type="video/webm">
      </video>

    }"
  >
    <v-btn
      fab
      dark
      small
      color="primary app-slider--collapse-button"
      @click="appPanelCollapseToggle()"
    >
      <v-icon dark>
        mdi-chevron-{{(collapseAppPanel)?'down':'up'}}
      </v-icon>
    </v-btn>
    <div>
      <v-text-field
        v-model="searchInput"
        background-color="white"
        class="font-weight-bold text-capitalize py-2 pt-0 records-search-box"
        dense
        flat
        height="40"
        hide-details
        :label="placeHolder"
        rounded
        single-line
        @keyup="changeEvent"
      >
        <template #append v-if="collapseAppPanel">
          <general-list-drop-down :currentApp="appList[selected]" v-model="tableView" />
        </template>
      </v-text-field>
    </div>
    <div class="in-here" >
      <flickity
        ref="flickity"
        :options="flickityOptions"
         :class="!collapseAppPanel?'app-slider-grid':''"
      >
        <div
          v-for="(item, index) in appList"
          :key="index"
          :class="selected > -1 ? (selected === index ? 'carousel-cell flicky-item' : 'carousel-cell flicky-item unselected-item') : 'carousel-cell flicky-item'"
          @click="changingApps(item, index)"
        >
          <div class="item-img-container">
            <div
              ref="itemImgs"
              class="item-img"
              :class="selected > -1 ? (selected === index ? 'item-img img-shadow' : 'item-img') : 'item-img'"
              :style="{backgroundColor: getBGColor(item)}"
            >
              <v-img
                v-if="item.iconLink && item.iconLink !== ''"
                alt="m6app_img"
                class="image-icon"
                :src="item.iconLink"
              />
              <template v-else-if="item.metadata">
                <template v-if="item.metadata.appIcon">
                  <v-icon
                    :color="item.metadata.appIcon.iconColor"
                    :size="iconWidth"
                  >
                    {{ item.metadata.appIcon.icon }}
                  </v-icon>
                </template>
                <v-icon
                  v-else
                  :size="iconWidth"
                >
                  mdi-store
                </v-icon>
              </template>
              <v-icon
                v-else
                :size="iconWidth"
              >
                mdi-store
              </v-icon>
            </div>
          </div>
          <div class="item-text">
            {{ item.text }}
          </div>
        </div>
      </flickity>
    </div>
  </div>
</template>

<script>
import GeneralListDropDown from '@/components/Apps/GeneralListDropDown'
import Flickity from 'vue-flickity'

export default {
  name: 'RecordListHeader',
  components: {
    Flickity,
    GeneralListDropDown
  },
  props: {
    appList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    iconWidth: function() {
      return this.viconWidth
    }
  },
  mounted() {
    this.updateViconWidth(this.$refs.itemImgs[0].offsetWidth)
  },
  data: () => ({
    viconWidth: 0,
    searchInput: '',
    tableView: {},
    placeHolder: 'Search All Records',
    flickityOptions: {
      initialIndex: 1,
      prevNextButtons: true,
      pageDots: false,
      wrapAround: true,
      contain: true,
      percentPosition: true,
      draggable: false
    },
    selected: -1,
    collapseAppPanel: true
  }),
  watch: {
    tableView() {
      this.$emit('tableViewChange', this.tableView)
    },
    selected() {
      if (this.selected !== -1) {
        this.placeHolder = 'Search ' + this.appList.find((row, index) => index === this.selected).text
      } else {
        this.placeHolder = 'Search All Records'
      }
    }
  },
  methods: {
    changeEvent(event) {
      this.$emit('changeEvent', this.searchInput)
    },
    changingApps(item, index) {
      this.appPanelCollapseToggle(true);
      this.selected = index
      this.$emit('changingApps', item)
    },
    getBGColor(item) {
      if (item.metadata) {
        if (item.metadata.appIcon) return item.metadata.appIcon.background
      }
      return item.bgColor
    },
    updateViconWidth(number) {
      this.viconWidth = number
    },
    editApp(appItem) {
      this.$router.push(`/dev/${appItem.id}`)
    },
    appPanelCollapseToggle(status = null) {

      let condition = false;
      if(status != null){
         if(status){
          condition = true;
        } else {
          condition = false;
        }
      } else {
        if(!this.collapseAppPanel){
          condition = true;
        } else {
          condition = false;
        }
      }


      if(condition){
        this.$refs.flickity.init();
        this.collapseAppPanel = true;
        this.placeHolder = 'Search All Records'
      } else {
        this.$refs.flickity.destroy();
        this.collapseAppPanel = false;
        this.placeHolder = 'Search Apps'
        }

      this.$emit('collapseAppPanelEvent', this.collapseAppPanel)
    }
  }
}
</script>

<style lang="scss">
.header-background {
  object-fit: cover;
  width: 60vw;
  height: 30vh;
  position: absolute;
  top: 0;
  left: 0;
  filter: brightness(.7)
}
.header-title {
  font-size: 1.6em;
  line-height: 1;
}
.flicky-item {
  width: calc(20% - 20px);
  height: auto;
  margin-right: 20px;
  text-align: center;
}
.flicky-item:hover {
  cursor: pointer;
}
.item-img-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
}
.item-img {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 15px;
}
.item-text {
  color: white;
}
.image-icon {
  border-radius: 15px;
  height: 100%;
  width: 100%;
}
.unselected-item {
  opacity: 0.7;
}
/* no circle */
.flickity-button {
  background: transparent;
}
/* big previous & next buttons */
.flickity-prev-next-button {
  width: 100px;
  height: 100px;
}
/* icon color */
.flickity-button-icon {
  fill: white;
}
/* hide disabled button */
.flickity-button:disabled {
  display: none;
}
.flickity-prev-next-button {
  .flickity-button-icon {
    top: 0;
    width: 50%;
    height: 50%;
    left: 25%;
  }
}
.flickity-prev-next-button:hover {
  background: transparent;
}
.flickity-prev-next-button:hover {
  background: transparent;
}
.flickity-prev-next-button.previous {
  left: -70px;
}
.flickity-prev-next-button.next {
  right: -70px;
}
.custom-field-input-field {
  background-color: white;
  color: grey;
}
.img-shadow {
  box-shadow: 0px 0px 4px 4px #ffffff7a;
}
.edit-app-button {
  color: white !important;
  position: absolute !important;
  right: -10px;
  top: -10px;
  z-index: 99;
}
.records-search-box {
  &.v-text-field{
    margin-top: 0!important;
    padding-bottom: 6px!important;
    margin-left: 10px;
    margin-right: 10px;
    &.v-input--dense:not(.v-text-field--outlined) input {
      padding: 8px 0 8px;
    }
    .v-btn {
      height: 40px;
    }
  }
}
@media(max-width: 599px) {
  .flicky-item {
    width: calc(4 * 100% / 12 - 10px);
    height: auto;
    margin-right: 10px;
    text-align: center;
  }
  .records-search-box {
    &.v-text-field{
      margin-top: 0!important;
      padding-bottom: 6px!important;
      margin-left: 10px;
      margin-right: 10px;
      }
  }
}
.app-slider-wrapper{
  position: relative;
}
.app-slider-wrapper.full-screen{
  min-height: calc(100vh - 110px);
}
.app-slider-wrapper .app-slider--collapse-button{
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%)
}
.app-slider-wrapper .app-slider-grid{
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

@media only screen and (max-device-width: 600px) {
  .app-slider-wrapper .app-slider--collapse-button{
    transform: translate(8px, 50%)
  }
  .app-slider-wrapper.full-screen .app-slider--collapse-button{
    position: fixed;
    bottom: 90px;
    z-index: 100;
  }
}
</style>
