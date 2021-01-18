<template>
  <v-card
    v-if="dataReady"
    class="chat-box d-flex flex-column mx-2 rounded-t-lg"
    elevation="3"
    :height="chatHeight"
    :width="chatWidth"
  >
    <M6Loading
      :loading="showLoading"
    />
    <v-dialog
      v-model="showImagesGallery"
      fullscreen
      @keydown.esc="() => showImagesGallery = false"
      @keydown.left="chatGallery.indexOf(currentGalleryItem--)"
      @keydown.right="chatGallery.indexOf(currentGalleryItem++)"
    >
      <v-card
        class="align-center d-flex overflow-hidden px-5"
        style="background: #000000a8"
      >
        <v-btn
          absolute
          class="mt-10"
          color="white"
          fab
          right
          top
        >
          <v-icon
            color="black"
            @click="showImagesGallery = false"
          >
            mdi-close
          </v-icon>
        </v-btn>
        <v-row
          align="center"
          class=""
          justify="center"
          style="height: 100%"
        >
          <carousel
            class="w-full"
            :navigate-to="currentGalleryItem"
            :navigation-enabled="true"
            :pagination-active-color="'#fff'"
            :pagination-color="'#333'"
            :pagination-enabled="true"
            :per-page="1"
          >
            <slide
              v-for="(img, i) of chatGallery"
              :key="`gallery-item${i}`"
            >
              <div
                class="theme--dark v-image v-responsive"
                style="height: 80vh;"
              >
                <div class="align-center d-flex justify-center v-image__image v-image__image--cover">
                  <img
                    alt=""
                    class="max-w-full"
                    :src="img.source"
                  >
                </div>
              </div>
            </slide>
          </carousel>
        </v-row>
      </v-card>
    </v-dialog>
    <div
      class="align-center chat-title d-flex justify-space-between px-3 rounded-t"
      :class="[minimized ? 'blue lighten-2' : '']"
      @click.self="minimizeChatBox"
    >
      <div
        v-if="channel.id.substr(14, 5) === 'group'"
        class="align-center d-flex"
      >
        <v-avatar
          class="mr-2"
          size="42"
          @click="editConfigurationDialog = true"
        >
          <img
            v-if="channel.data.image !== ''"
            :alt="channel.data.image"
            :src="channel.data.image"
          >
          <v-icon v-else>
            mdi-account-group-outline
          </v-icon>
        </v-avatar>
        <div class="ml-1">
          <p
            class="font-weight-medium ma-0 pa-0 text-body-2"
            :class="[minimized ? 'white--text' : '']"
          >
            {{ channel.data.name }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="align-center d-flex"
      >
        <v-badge
          bottom
          class="mr-2"
          :color="users[0].user.online ? 'green accent-3' : 'transparent'"
          dot
          offset-x="10"
          offset-y="10"
        >
          <v-avatar
            class="blue"
            size="42"
          >
            <img
              v-if="users[0].user.image"
              :alt="channel.name"
              :src="users[0].user.image"
            >
            <template v-else>
              <span class="text-uppercase white--text">{{ channel.membersInChannel.user.name.charAt(0) }}</span>
            </template>
          </v-avatar>
        </v-badge>
        <div>
          <p
            class="font-weight-medium ma-0 pa-0 text-body-2"
            :class="[minimized ? 'white--text' : '']"
          >
            {{ users[0].user.name }}
          </p>
          <v-spacer />
          <p
            v-if="users[0].user.online"
            class="font-weight-medium ma-0 pa-0 text-caption"
            :class="[minimized ? 'white--text' : 'green--text text--accent-4']"
          >
            online
          </p>
          <p
            v-else
            class="capitalize font-weight-medium ma-0 pa-0 text-caption"
            :class="[minimized ? 'white--text' : 'blue--text']"
          >
            {{ setDate( new Date( users[0].user.last_active )) }}
          </p>
        </div>
      </div>
      <div
        v-if="!showDeleteOptions"
        class="d-flex"
      >
        <v-btn
          class="btn-chat-shadow ml-2"
          color="white"
          fab
          x-small
          @click="chatExpanded = !chatExpanded"
        >
          <v-icon
            size="15"
          >
            {{ expandIcon }}
          </v-icon>
        </v-btn>
        <v-dialog
          v-if="channel.id.substr(14, 5) === 'group'"
          v-model="editConfigurationDialog"

          width="50%"
        >
          <edit-configuration-dialog
            :channel="channel"
            @close-dialog="() => editConfigurationDialog = false"
          />
        </v-dialog>
        <v-btn
          class="btn-chat-shadow ml-2"
          color="white"
          fab
          x-small
          @click="showDeleteOptions = true"
        >
          <v-icon
            size="15"
          >
            mdi-delete
          </v-icon>
        </v-btn>
        <v-btn
          class="btn-chat-shadow ml-2"
          color="white"
          fab
          x-small
          @click="closeChat"
        >
          <v-icon
            size="15"
          >
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <div
        v-else
        class="d-flex"
      >
        <v-tooltip
          bottom
          color="#7c7c7c"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="btn-chat-shadow ml-2"
              color="white"
              fab
              x-small
              v-on="on"
              @click="deleteMessages"
            >
              <v-icon
                size="15"
              >
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
          <span>Delete Selected</span>
        </v-tooltip>
        <v-tooltip
          bottom
          color="#7c7c7c"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="btn-chat-shadow ml-2"
              color="white"
              fab
              x-small
              v-on="on"
              @click="deleteAll"
            >
              All
            </v-btn>
          </template>
          <span>Delete All</span>
        </v-tooltip>

        <v-btn
          class="btn-chat-shadow ml-2"
          color="white"
          fab
          x-small
          @click="showDeleteOptions = false"
        >
          <v-icon
            size="15"
          >
            mdi-arrow-left-circle
          </v-icon>
        </v-btn>
      </div>
    </div>
    <v-divider
      class="divider-chat"
      :class="[minimized ? 'd-none' : '']"
    />
    <!-- Messages Container -->
    <div
      ref="messages"
      class="messages-container ml-2 px-1 vertical-scroll white"
      :class="[minimized ? 'd-none' : 'h-full']"
    >
      <div
        v-if="messages.length === 0"
        class="align-center d-flex flex-column grey--text h-full justify-center px-3 text-caption"
      >
        <div class="d-flex justify-center w-full">
          <v-icon
            class="grey--text text--lighten-1"
            size="40"
          >
            mdi-message-settings-outline
          </v-icon>
        </div>
        <div class="align-center d-flex mt-3 text-caption w-full">
          <v-divider class="blue-grey lighten-5" />
          <span class="grey--text mx-3 text--lighten-1">No messages yet</span>
          <v-divider class="blue-grey lighten-5" />
        </div>
      </div>
      <!-- Message Bubble -->
      <div
        v-for="(message, index) in messages"
        :key="'message-'+ channel.userId + '-' + index"
      >
        <!-- Day Divider -->
        <div
          v-if="dayDivider(message.created_at, index).show"
          class="align-center d-flex grey--text my-2 text-caption"
        >
          <v-divider class="blue-grey lighten-5" />
          <span class="mx-3">{{ dayDivider(message.created_at, index).value }}</span>
          <v-divider class="blue-grey lighten-5" />
        </div>
        <div
          class="d-flex"
          :class="[message['panel'] && message['panel']['id'] ? 'mx-0' : user.id === message.user.id ? 'ml-8' : 'mr-8' ]"
        >
          <template v-if="user.id === message.user.id">
            <span class="align-center d-flex grey--text mb-3 ml-auto text-caption text-nowrap">{{ messageTime(message.created_at) }}</span>
            <div
              v-if="messageEdit === message.id"
              class="mb-3 ml-2"
            >
              <input
                :ref="'inputMessage-' + index"
                v-model="messageEditInput"
                class="h-full mr-2 px-2 text-body-1"
                size="8"
                @keyup.enter="editMessage('inputMessage-' + index)"
                @keyup.esc="cancelMessage"
              >
              <v-btn
                class="btn-chat-shadow grey--text mb-3 mr-2"
                fab
                height="23"
                width="23"
                x-small
                @click="toogleDialogEmoji"
              >
                <v-icon size="22">
                  mdi-emoticon-happy-outline
                </v-icon>
              </v-btn>
            </div>
            <div
              v-else
              class="arrow-up grey grey--text lighten-4 mb-3 message-arrow ml-1 mr-2 py-2 relative text--darken-3 text-body-2 text-left w-fit"
              :class="message['panel'] && message['panel']['id'] ? 'px-2': 'px-3'"
            >
              <p
                class="ma-0 pa-0"
                v-html="urlify(message.text)['text']"
              />
              <p
                v-if="message.images && message.text == ''"
                class="mb-0"
              >
                {{ getFileNames(message.images) }}
              </p>
              <template v-if="!message.images">
                <v-skeleton-loader
                  v-if="index === messages.length - 1 && (srcImageFiles.length !== 0 || srcVideoFiles.length !== 0)"
                  class="mx-auto"
                  height="100"
                  type="card"
                  width="100"
                />
              </template>
              <div
                v-else
                class="d-flex flex-wrap ml-auto w-fit"
              >
                <div
                  v-for="(image, ind) in message.images"
                  :key="'imagemsg-' + ind"
                  class="mt-2 mx-1 relative w-fit"
                >
                  <template v-if="image">
                    <img
                      v-if="image.split('/').slice(-2)[0].toUpperCase() === 'IMAGE'"
                      class="image-preview"
                      :src="image"
                      @click="openChatGallery(image)"
                    >
                  </template>
                </div>
              </div>
              <div
                v-if="message.files"
                class="d-flex flex-wrap ml-auto w-fit"
              >
                <v-row
                  v-if="message['files'] && message['files'].length > 0"
                  class="my-2 px-1"
                >
                  <v-col
                    v-for="(file, messIndex) of message['files']"
                    :key="messIndex+'-file'"
                    class="align-start d-flex my-0 py-0"
                    cols="12"
                  >
                    <v-icon
                      @click="redirect(file)"
                    >
                      mdi-file-document-outline
                    </v-icon>
                    <p
                      class="font-weight-bold leading-tight mx-1 my-0 pointer py-0 text-caption"
                      @click="redirect(file)"
                    >
                      {{ file.substring(file.lastIndexOf('/')+1).replace(/%20/g, ' ').replace('%28', '(').replace('%29', ')') }}
                    </p>
                  </v-col>
                </v-row>
              </div>
            </div>
            <v-icon
              :class="[ hasMessageBeenViewed(message) ? 'blue--text' : 'grey--text']"
              size="11"
            >
              {{ hasMessageBeenViewed(message) ? 'mdi-check-all' : 'mdi-check' }}
            </v-icon>

            <v-checkbox
              v-if="showDeleteOptions"
              v-model="deleteIds"
              dense
              :value="message.id"
            />
            <v-dialog
              v-else
              v-model="deleteDialog"
              width="500"
            >
              <template #activator="{ on, attrs }">
                <v-hover
                  v-slot="{ hover }"
                >
                  <div class="pointer relative">
                    <v-card
                      v-if="hover"
                      class="absolute d-flex left-0 max-w-none mb-1 message-btns pa-1 rounded-pill top-0 w-fit z-20"
                    >
                      <v-btn
                        v-bind="attrs"
                        class="black--text capitalize px-3 text-caption"
                        elevation="0"
                        height="25"
                        rounded
                        v-on="on"
                        @click="messageEdit = message.id+message.id"
                      >
                        Delete
                      </v-btn>
                      <v-btn
                        class="black--text capitalize ml-1 px-1 text-caption"
                        elevation="0"
                        height="25"
                        rounded
                        @click="edit(message)"
                      >
                        Edit
                      </v-btn>
                    </v-card>
                    <v-icon>
                      mdi-settings-helper
                    </v-icon>
                  </div>
                </v-hover>
              </template>
              <delete-dialog
                v-if="messageEdit === message.id+message.id"
                :element="`message '${message.text}'`"
                @closeDeleteModal="beforeDelete($event, message.id)"
              />
            </v-dialog>
          </template>
          <template v-else>
            <template v-if="firstCommentBeforeAnswer(message.user.id, index)">
              <img
                v-if="users[0].user.image"
                :alt="channel.name"
                class="mr-3 rounded-circle"
                height="30"
                :src="users[0].user.image"
                width="30"
              >
              <div
                v-else
                class="align-center blue d-flex justify-center mr-2 rounded-pill"
                style="width: 35px; height:35px;"
              >
                <span class="text-uppercase white--text">
                  {{ channel.membersInChannel.user.name.charAt(0) }}
                </span>
              </div>
            </template>

            <v-card
              v-else
              class="mr-3"
              elevation="0"
              height="30"
              width="30"
            />
            <div
              class="arrow-down blue mb-3 message-arrow mr-1 mt-1 py-1 relative text-body-2 text-left w-fit white--text"
              :class="message['panel'] && message['panel']['id'] ? 'px-2': 'px-3'"
            >
              <p
                class="ma-0 pa-0 white--text"
                v-html="urlify(message.text)['text']"
              />
              <div
                v-if="message.images"
                class="d-flex mr-auto w-fit"
              >
                <div
                  v-for="(image, messIndex) in message.images"
                  :key="'imagemsg-' + messIndex"
                  class="mt-2 mx-1 relative w-fit"
                >
                  <template v-if="image">
                    <img
                      v-if="image.split('/').slice(-2)[0].toUpperCase() === 'IMAGE'"
                      class="image-preview"
                      :src="image"
                    >
                  </template>
                </div>
              </div>
              <div
                v-if="message.files"
                class="d-flex flex-wrap ml-auto w-fit"
              >
                <v-row
                  v-if="message['files'] && message['files'].length > 0"
                  class="my-2 px-1"
                >
                  <v-col
                    v-for="(file, messIndex) of message['files']"
                    :key="messIndex+'-file'"
                    class="my-0 py-0"
                    cols="12"
                  >
                    <v-icon
                      @click="redirect(file)"
                    >
                      mdi-file-document-outline
                    </v-icon>
                    <p
                      class="font-weight-bold mx-1 my-0 pointer py-0 text-subtitle-1 white--text"
                      @click="redirect(file)"
                    >
                      {{ file.substring(file.lastIndexOf('/')+1).replace(/%20/g, ' ').replace('%28', '(').replace('%29', ')') }}
                    </p>
                  </v-col>
                </v-row>
              </div>
            </div>
            <span class="align-center d-flex grey--text mb-3 mr-auto text-caption text-nowrap">{{ messageTime(message.created_at) }}</span>
          </template>
        </div>
        <record-url
          v-if="message['panel'] && message['panel']['id']"
          class="mb-2"
          :record-info="message['panel']"
          :type="'message'"
        />
        <external-url
          v-if="urlify(message.text)['urls'].length > 0 && urlify(message.text)['youtubeUrls'].length === 0"
          class="mb-2"
          :urls="urlify(message.text)['urls']"
        />
        <youtube-video
          v-if="urlify(message.text)['youtubeUrls'].length > 0"
          class="mb-2"
          :urls="urlify(message.text)['youtubeUrls']"
        />
        <div
          v-for="(row, imageIndex) in message.images"
          :key="imageIndex"
          class="mb-2 video-list__container"
        >
          <template v-if="row">
            <video
              v-if="row.split('/').slice(-2)[0].toUpperCase() === 'VIDEO'"
              controls
            >
              <source
                :src="row"
              >
            </video>
          </template>
        </div>
      </div>
    </div>
    <!-- Emoji Picker -->
    <div
      class="relative"
      :class="[minimized ? 'd-none' : '']"
    >
      <v-emoji-picker
        v-show="showDialog"
        class="absolute bottom-0 card-custom-shadow emoji-component grey lighten-5"
        label-search="Search"
        lang="en"
        @select="onSelectEmoji"
      />
    </div>

    <v-divider
      class="blue-grey lighten-5"
      :class="[minimized ? 'd-none' : '']"
    />
    <!-- Files -->
    <template v-if="docFiles.length > 0 && !hideFilesPreview">
      <div class="d-flex docs images-container mx-1 px-0 py-1">
        <div
          v-for="(docFile, index) in docFiles"
          :key="'previewdoc-' + index"
          class="align-center blue d-flex justify-center mx-1 previewdoc px-2 rounded-pill"
        >
          <v-icon
            class="white--text"
            left
          >
            mdi-file-outline
          </v-icon>
          <span class="docfile-name text-caption white--text">{{ docFile.name }}</span>

          <v-icon
            class="blue lighten-2 ml-2 pa-1 rounded-xl white--text"
            size="12"
            @click="removeDoc(index)"
          >
            mdi-close
          </v-icon>
        </div>
      </div>
    </template>
    <v-divider
      class="blue-grey lighten-5"
      :class="[minimized ? 'd-none' : '']"
    />
    <!-- Images -->
    <template v-if="srcImageFiles.length > 0 && !hideFilesPreview">
      <div class="d-flex images-container mx-1 px-0 py-3">
        <div
          v-for="(srcImageFile, index) in srcImageFiles"
          :key="'previewimage-' + index"
          class="mx-1 relative w-fit"
        >
          <img
            class="image-preview"
            :src="srcImageFile"
          >
          <v-btn
            class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
            color="grey lighten-2"
            fab
            @click="removeImage(index)"
          >
            <v-icon
              size="12"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </div>
    </template>
    <!-- Videos -->
    <template v-if="srcVideoFiles.length > 0 && !hideFilesPreview">
      <div class="d-flex images-container mx-1 px-0 py-0">
        <div
          v-for="(srcVideo, index) in srcVideoFiles"
          :key="'previewimage-' + index"
          class="mx-1 relative w-fit"
        >
          <video
            controls
            height="100"
            width="100"
          >
            <source
              :src="srcVideo.url"
              :type="srcVideo.type"
            >
            Your browser does not support the video tag.
          </video>
          <v-btn
            class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
            color="grey lighten-2"
            fab
            @click="removeImage(index)"
          >
            <v-icon
              size="12"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </div>
    </template>
    <p
      v-if="Object.keys( whoTyping ).length > 0"
      class="font-italic mx-5 my-0 text-caption"
    >
      User {{ whoTyping.name }} is typing
    </p>
    <div
      class="align-center chat-send-section px-4"
      :class="[minimized ? 'd-none' : 'd-flex']"
    >
      <v-menu
        :close-on-content-click="true"
        content-class="elevation-0"
        elevation="0"
        :offset-y="offset"
        top
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            class="align-center btns-message d-flex justify-center white--text"
            elevation="0"
            fab
            height="25"
            width="25"
            x-small
            v-on="on"
          >
            <v-icon size="19">
              mdi-plus
            </v-icon>
          </v-btn>
        </template>

        <v-list
          class="mb-2 pa-0"
          color="transparent"
          elevation="0"
        >
          <v-list-item
            class="ma-0 pa-0 uploadfile-btn"
            elevation="20"
          >
            <v-tooltip
              class="tooltip-upload-file"
              left
            >
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :offset-x="offset"
                    right
                  >
                    <template #activator="{ on, attrs }">
                      <v-avatar
                        class="mr-2"
                        color="indigo darken-1"
                        size="25"
                        style="box-shadow: 1px 1px 4px #000000;"
                      >
                        <v-icon
                          v-bind="attrs"
                          class="align-center d-flex justify-center ma-0 pa-0 upload-icon white--text"
                          color="white"
                          dark
                          hide-input
                          icon
                          size="20"
                          v-on="on"
                        >
                          mdi-apps
                        </v-icon>
                      </v-avatar>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.application_id"
                          item-text="title"
                          item-value="id"
                          :items="availableApps"
                          label="Application"
                          @change="changeApp($event)"
                        />
                      </v-list-item>
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.record_id"
                          :class="{ disabled: itemInfo.application_id === null }"
                          :item-value="Object"
                          :items="options.records"
                          label="Record"
                          @change="selectRecord($event)"
                        >
                          <template
                            slot="selection"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render selected items -->
                            {{ data.item.record_number }} - {{ data.item.title }}
                          </template>
                          <template
                            slot="item"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render items when the select is open -->
                            {{ data.item.record_number }} - {{ data.item.title }}
                          </template>
                        </v-select>
                      </v-list-item>
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.panel"
                          :class="{ disabled: itemInfo.application_id === null }"
                          item-text="label"
                          :item-value="Object"
                          :items="options.panles"
                          label="Panel"
                          @change="selectPanel($event)"
                        />
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
              <span class="black--text blue lighten-2 pa-1 rounded text-caption white--text">Record</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item class="ma-0 pa-0 uploadfile-btn">
            <v-tooltip
              class="tooltip-upload-file"
              left
            >
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-file-input
                    accept="image/*, image/heif, image/heic, video/*, video/mp4, video/x-m4v, video/x-matroska, .mkv"
                    class="align-center d-flex justify-center ma-0 pa-0 upload-icon white--text"
                    hide-input
                    multiple
                    prepend-icon="mdi-image"
                    @change="onImagesChange($event)"
                  />
                </div>
              </template>
              <span class="black--text blue lighten-2 pa-1 rounded text-caption white--text">Image/Video</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item class="ma-0 pa-0 uploadfile-btn">
            <v-tooltip
              class="tooltip-upload-file"
              left
            >
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-file-input
                    class="align-center d-flex justify-center ma-0 pa-0 upload-icon white--text"
                    hide-input
                    multiple
                    prepend-icon="mdi-file-outline"
                    @change="onDocsChange($event)"
                  />
                </div>
              </template>
              <span class="black--text blue lighten-2 pa-1 rounded text-caption white--text">Document</span>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-menu>
      <input
        ref="inputMessage"
        v-model="valueInput"
        class="h-full outline-none px-2 text-body-1 w-full"
        placeholder="Type a message here..."
        @keydown="stopTyping"
        @keyup="typing"
        @keyup.enter="sendMessage"
        @paste="onPasteImage($event)"
      >
      <v-btn
        class="btn-chat-shadow grey--text mr-2"
        fab
        height="23"
        width="23"
        x-small
        @click="toogleDialogEmoji"
      >
        <v-icon size="22">
          mdi-emoticon-happy-outline
        </v-icon>
      </v-btn>
      <v-btn
        class="btns-message white--text"
        fab
        height="25"
        icon
        width="25"
        x-small
        @click="sendMessage"
      >
        <v-icon
          class="-rotate-45"
          size="13"
        >
          mdi-send
        </v-icon>
      </v-btn>
    </div>
    <m6-confirm-delete
      message="Are you sure you want to delete these messages?"
      :show="showChatMessageDelete"
      title="Delete Messages"
      @cancel="cancelMessagesDelete"
      @confirm="confirmMessagesDelete"
    />

    <m6-confirm-delete
      message="Are you sure you want to delete this chat?"
      :show="showChatDeleteModal"
      title="Delete Chat"
      @cancel="cancelChatDelete"
      @confirm="confirmChatDelete"
    />
  </v-card>
</template>

<script>
/* eslint-disable camelcase */
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { VEmojiPicker } from 'v-emoji-picker'
import EditConfigurationDialog from '@/components/Dialogs/EditConfiguration'
import ExternalUrl from '@/components/Home/SocialMedia/ExternalUrl.vue'
import YoutubeVideo from '@/components/Home/SocialMedia/YoutubeVideo'
import RecordUrl from '@/components/Home/SocialMedia/RecordUrl.vue'
import { Carousel, Slide } from 'vue-carousel'
import CarouselImage from '@/components/Shared/ImageCarousselOverlay/CarouselImage.vue'

export default {
  name: 'Chatbox',
  components: {
    EditConfigurationDialog,
    VEmojiPicker,
    ExternalUrl,
    RecordUrl,
    YoutubeVideo,
    Carousel,
    Slide,
    CarouselImage
  },
  props: {
    channel: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    deleteDialog: false,
    showLoading: false,
    showImagesGallery: false,
    currentGalleryItem: 0,
    hover: false,
    menu: false,
    input: '',
    display: true,
    whoTyping: {},
    chatGallery: [],
    // user id john doe
    currentUserId: 2,
    messageEdit: '',
    messageEditInput: '',
    editConfigurationDialog: false,
    dataReady: false,
    messages: [],
    state: {
      messages: [],
      members: [],
      channel: {}
    },
    valueInput: '',
    itemInfo: {
      application_id: null,
      record_id: null,
      panel: null
    },
    showDialog: false,
    imageFiles: [],
    docFiles: [],
    offset: true,
    minimized: false,
    urlInfo: {},
    options: {
      records: [],
      panles: [],
      type: []
    },
    availableApps: [],
    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    hideFilesPreview: false,
    chatExpanded: false,
    showDeleteOptions: false,
    deleteIds: [],
    showChatMessageDelete: false,
    showChatDeleteModal: false
  }),
  computed: {
    ...mapGetters('Auth', { user: 'getUser' }),
    ...mapGetters('GSChat', { client: 'client' }),
    expandIcon() {
      return this.chatExpanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'
    },
    groupedMessages() {
      return this.messages.reduce(function (r, a) {
        r[a.date.day] = [...r[a.date.day] || [], a]
        return r
      }, {})
    },
    owner: function () {
      return this.state.members.find(r => r.role === 'owner')
    },
    users: function () {
      const users = []
      Object.keys(this.channel.state.members).forEach(userKey => {
        if (userKey !== this.user.id) {
          users.push(this.channel.state.members[userKey])
        }
      })
      return users
    },
    srcImageFiles() {
      const srcImages = []
      this.imageFiles.forEach(imageFile => {
        if (imageFile['type'].substr(0, imageFile['type'].indexOf('/')) === 'image') {
          srcImages.push(URL.createObjectURL(imageFile))
        }
      })
      return srcImages
    },
    srcVideoFiles() {
      const srcVideo = []
      this.imageFiles.forEach(file => {
        if (file['type'].substr(0, file['type'].indexOf('/')) === 'video') {
          srcVideo.push({
            url: URL.createObjectURL(file),
            type: file['type']
          })
        }
      })
      return srcVideo
    },
    chatHeight() {
      return this.minimized ? '60' : this.chatExpanded ? '680' : '455'
    },
    chatWidth() {
      return this.chatExpanded && !this.minimized ? '500' : '335'
    }
  },
  watch: {
    messages: function () {
      this.messages.forEach((message, ind) => {
        if (message.type === 'deleted') {
          this.messages.splice(ind, 1)
        }
      })
      this.fetchChatGallery()
    }
  },
  async mounted() {
    this.state = await this.channel.watch()
    this.messages = this.state.messages

    this.fetchChatGallery()

    this.channel.on('message.new', this.addNewMessage)
    this.channel.on('message.deleted', this.deleteMessage)
    this.channel.on('message.updated', this.updateMsg)
    this.channel.on('user.watching.start', this.userLogsOn)
    this.channel.on('user.watching.stop', this.userLogsOff)

    this.getApps().then(response => {
      response.data.map(app => {
        this.availableApps.push({
          id: app.id,
          title: app.title
        })
      })
    })
    this.client.on('typing.start', r => {
      if (r.user.id !== this.user.id && r['channel_id'] === this.channel['id']) {
        this.whoTyping = r.user
      }
    })
    this.client.on('typing.stop', r => {
      if (r.user.id !== this.user.id && r['channel_id'] === this.channel['id']) {
        this.whoTyping = ''
      }
    })

    this.dataReady = true
    this.$nextTick(() => {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
    })
  },
  methods: {
    ...mapActions('GSChat', ['removeMessage', 'updateMessage']),
    ...mapActions('AppAttachments', {
      getFileUrl: 'get_message_file_url',
      setStreamFiles: 'set_stream_attachments'
    }),
    ...mapActions('AppBuilder', {
      getFieldValues: 'getFieldValuesPerPanel'
    }),
    ...mapActions('WorkOrderModule', {
      getApps: 'getAvailableApps',
      getActions: 'getActionsFeed'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    userLogsOn(event) {
      if (!event) return
      const index = this.$h.dg(this, 'state.members', []).map(m => m.user.id).indexOf(event.user.id)
      this.state.members[index].user.last_active = event.received_at.toISOString()
      this.state.members[index].user.online = true
    },
    userLogsOff(event) {
      const index = this.$h.dg(this.state, 'members', []).map(m => m.user.id).indexOf(event.user.id)
      this.state.members[index].user.last_active = event.received_at.toISOString()
      this.state.members[index].user.online = false
    },
    hasMessageBeenViewed(message) {
      const index = this.$h.dg(this.state, 'members', []).map(m => m.user.id).indexOf(this.$h.dg(this.users, '0.user.id', ''))
      return new Date(message.created_at) < new Date(this.state.members[index].user.last_active) || this.state.members[index].user.online
    },
    cancelChatDelete() {
      this.showChatDeleteModal = false
      this.showDeleteOptions = false
    },
    async confirmChatDelete() {
      try {
        this.showloading = true

        for (let x = 0; x < this.messages.length; x++) {
          await this.removeMessage(this.messages[x].id)
        }
        this.cancelChatDelete()
        this.showloading = false
      } catch (e) {
        this.showChatDelete()
        this.notifDanger('There was an error while deleting the chat')
        this.showloading = false
      }
    },
    deleteAll() {
      this.showChatDeleteModal = true
    },
    cancelMessagesDelete(deleted = false) {
      this.showChatMessageDelete = false

      if (deleted) {
        this.showDeleteOptions = false
        this.deleteIds = []
      }
    },
    async confirmMessagesDelete() {
      try {
        this.showLoading = true
        for (let x = 0; x < this.deleteIds.length; x++) {
          await this.removeMessage(this.deleteIds[x])
        }

        this.cancelMessagesDelete(true)
        this.notifSuccess('The messages were deleted')
        this.showloading = false
      } catch (e) {
        this.notifDanger('There was an error while deleting the messages')
        this.showloading = false
      }
    },
    deleteMessages() {
      if (this.deleteIds.length) this.showChatMessageDelete = true
    },
    changeApp(event) {
      this.getActions(event).then(response => {
        this.options['records'] = response.data
      })
    },
    openChatGallery(item = false) {
      if (item) this.currentGalleryItem = this.chatGallery.findIndex(i => i.source === item)

      this.showImagesGallery = true
    },
    fetchChatGallery() {
      const images = []
      if (this.messages) {
        this.messages.forEach(msg => {
          if (typeof (msg.images) !== 'undefined' && this.$h.dg(msg, 'images', []).length > 0) {
            msg.images.forEach(entry => {
              const img = {
                message: msg.id,
                source: entry
              }
              images.push(img)
            })
          }
        })
      }
      this.chatGallery = images
    },
    async selectRecord($event) {
      this.itemInfo['panel'] = null
      this.options['panles'] = []

      const app = await this.$store.dispatch('AppBuilder/getApp', $event['app']['id'])

      app['tabs'].forEach(tab => {
        tab.panels.forEach(panel => {
          this.options['panles'].push({
            id: $event['id'],
            recordTitle: $event.title,
            label: `${tab['title']} - ${panel['title']}`,
            panelTitle: panel['title'],
            fields: panel['fields'],
            panelId: panel['id'],
            subtitle: $event.app.title,
            image: $event.app.iconLink,
            description: $event.description
          })
        })
      })
    },
    async selectPanel($event) {
      const values = await this.getFieldValues({
        recordID: $event['id'],
        panelID: $event['panelId']
      })

      const panel = []

      $event['fields'].forEach(field => {
        panel.push({ name: field.label, value: values['values'][field.id] })
      })

      this.urlInfo = {
        url: `${new URL(location.href)['href']}record/${$event.id}`,
        id: $event.id,
        panel: panel,
        description: $event['description'],
        panel_title: $event['panelTitle'],
        subtitle: $event['subtitle'],
        title: $event['recordTitle'],
        image: $event['image']
      }
      this.menu = false
    },
    redirect(file) {
      window.open(file, '_blank')
    },
    closeModal() {
      this.deleteDialog = false
    },
    edit(message) {
      this.messageEdit = message.id
      this.messageEditInput = message.text
    },
    async addUser(event) {
      this.deleteDialog = false
      this.hover = false
      if (event.users.length > 0) {
        // We make the new conversation
        const res = []
        event.users.forEach(item => {
          if (Object.keys(this.channel.state.members).indexOf(item) < 0) {
            res.push(item)
          }
        })

        if (res.length > 0) {
          await this.channel.addMembers(res)
        }
      }
    },
    removeUser() {
      this.deleteDialog = false
      this.hover = false
    },
    async cleanChat(event) {
      this.deleteDialog = false
      this.hover = false
      if (event) {
        this.messages = []
        await this.channel.hide(null, true)
        await this.channel.show()
      }
    },
    async typing() {
      await this.channel.keystroke()
    },
    async stopTyping() {
      await this.channel.stopTyping()
    },
    setDate(item) {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]

      // If the last session was more than 1 day ago it shows the date else it shows the time.
      return 86400000 - (new Date - item) <= 0 ?
        `Last Online: ${months[item.getMonth()]} ${item.getDate()}, ${item.getFullYear()}` :
        `Last Online: ${
          item.getHours() > 12 ? (item.getHours() - 12).toString().padStart(2, '0') : item.getHours().toString().padStart(2, '0')
        }:${item.getMinutes().toString().padStart(2, '0')} ${item.getHours() > 12 ? 'PM' : 'AM'}`
    },
    urlify(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const youtubeUrlRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/
      const textUrls = []
      let youtubeUrls = []

      const res = text.replace(urlRegex, function (url) {
        const path = new URL(url)
        textUrls.push(url)
        return '<a href="' + url + '" target="_blank" class=" white--text pointer text-subtitle-1 font-weight-bold blue--text" >' + path.origin + '</a>'
      })
      youtubeUrls = textUrls.filter(row => youtubeUrlRegex.test(row))
      return { text: res, urls: textUrls, youtubeUrls: youtubeUrls }
    },
    addNewMessage(event) {
      this.messages = [...this.messages, event.message]
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
        this.$refs.inputMessage.focus()
      })
    },
    cancelMessage() {
      this.messageEdit = ''
      this.messageEditInput = ''
    },
    editMessage() {
      if (this.messageEditInput !== '') {
        this.updateMessage({
          id: this.messageEdit,
          text: this.messageEditInput
        })
        this.messageEdit = ''
        this.messageEditInput = ''
      }
    },
    deleteMessage(event) {
      this.messages.splice(this.messages.indexOf(
        this.messages.filter(e => e.id === event.message.id)[0]
      ), 1)
    },
    updateMsg(event) {
      const msgs = this.messages
      const index = msgs.indexOf(msgs.filter(e => e.id === event.message.id)[0])
      this.messages[index] = Object.assign(...[msgs[index], event.message])
    },
    async closeChat() {
      this.channel.off('message.new', this.addNewMessage)
      await this.$store.dispatch('GSChat/removeChat', this.state.channel.id)
      await this.channel.markRead()
    },
    firstCommentBeforeAnswer(authorId, index) {
      if (index === 0) {
        return true
      } else {
        return authorId === this.messages[index - 1].user.id ? false : true
      }
    },
    dayDivider(messageTime, index) {
      const result = {
        show: false,
        value: ''
      }
      const currentMessageTime = new Date(messageTime)
      const dateNow = new Date()
      if (index !== 0) {
        const beforeMessageTime = new Date(this.messages[index - 1].created_at)
        if (currentMessageTime.getDate() !== beforeMessageTime.getDate()) {
          result.show = true
        }
      } else {
        result.show = true
      }
      if (result.show) {
        const dayCurrentWeekDifference = Math.floor((dateNow.getTime() - currentMessageTime.getTime()) / 86400000)
        switch (dayCurrentWeekDifference) {
          case 0:
            result.value = 'Today'
            break
          case 1:
            result.value = 'Yesterday'
            break
          default:
            result.value = (currentMessageTime.getMonth() + 1) + '/' + currentMessageTime.getDate() + '/' + currentMessageTime.getFullYear()
        }
      }
      return result
    },
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog
    },
    onSelectEmoji(emoji) {
      if (this.messageEdit === '') {
        this.valueInput += emoji.data
        // Optional
        this.toogleDialogEmoji()
        this.$nextTick(() => this.$refs.inputMessage.focus())
      } else {
        this.messageEditInput += emoji.data
        this.toogleDialogEmoji()
      }
    },
    async sendMessage() {
      try {
        this.showLoading = true
        const message = await this.$store.dispatch('GSChat/sendMessage', {
          channel: this.channel,
          message: this.valueInput
        })

        if (this.imageFiles.length > 0) {
          const urls = []
          this.imageFiles.forEach(async (image, index) => {
            const url = await this.setStreamFiles({
              files: image,
              headers: {
                'Content-Type': image['type'],
                'Content-Name': image['name'],
                'Stream-Id': message['message']['id'],
                'Stream-type': 'message'
              }
            })

            urls.push(url['attachUrl'])
            if (index === this.imageFiles.length - 1) {
              await this.updateMessage({
                id: message['message']['id'],
                text: message['message']['text'],
                images: urls
              })
              this.imageFiles = []
            }
          })
        }

        if (this.itemInfo['panel']) {
          await this.updateMessage({
            id: message['message']['id'],
            text: message['message']['text'],
            panel: this.urlInfo
          })
        }


        if (this.docFiles.length > 0) {
          this.showLoading = true
          const urls = []
          this.docFiles.forEach(async (file, index) => {
            const url = await this.setStreamFiles({
              files: file,
              headers: {
                'Content-Type': file['type'],
                'Content-Name': file['name'],
                'Stream-Id': message['message']['id'],
                'Stream-type': 'message'
              }
            })

            urls.push(url['attachUrl'])
            if (this.docFiles.length - 1 === index) {
              this.updateMessage({
                id: message['message']['id'],
                text: message['message']['text'],
                files: urls
              }).then(() => {
                this.showLoading = false
                this.docFiles = []
              })
            }
          })
        }
        this.showLoading = false
        this.hideFilesPreview = true

        this.valueInput = ''
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
          this.$refs.inputMessage.focus()
        })
      } catch (e) {
        this.notifDanger('There was an error while sending the message')
      }
    },

    beforeDelete(decision, messageID) {
      this.messageEdit = ''
      this.deleteDialog = false
      this.hover = false
      if (decision) {
        this.removeMessage(messageID)
      }
    },
    minimizeChatBox() {
      this.minimized = !this.minimized
    },
    onImagesChange(e) {
      this.hideFilesPreview = false
      e.forEach(item => {
        this.imageFiles.push(item)
      })
      this.$refs.inputMessage.focus()
    },
    removeImage(index) {
      this.imageFiles.splice(index, 1)
    },
    onDocsChange(e) {
      this.hideFilesPreview = false
      this.docFiles = e
      this.$refs.inputMessage.focus()
    },
    removeDoc(index) {
      this.docFiles.splice(index, 1)
    },
    messageTime(time) {
      const messageDate = new Date(time)
      const minutes = messageDate.getMinutes() < 10 ? '0' + messageDate.getMinutes() : messageDate.getMinutes()
      const hours = messageDate.getHours() >= 12 ? messageDate.getHours() - 12 : messageDate.getHours()
      const period = messageDate.getHours() >= 12 ? ' pm' : ' am'

      return hours + ':' + minutes + period
    },
    getFileNames(urlArr) {
      return urlArr.map(url => {
        if (url) {
          return url.split('/').pop().replace(/%20/g, ' ')
        } else {
          return ''
        }
      }).join(', ')
    },
    onPasteImage(event) {
      this.hideFilesPreview = false
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          this.imageFiles.push(blob)
        }
      }
    }
  }
}
</script>

<style>
v-icon, p {
  display: inline-block;
}
.chat-box {
  -moz-transition: height .5s;
  -ms-transition: height .5s;
  -o-transition: height .5s;
  -webkit-transition: height .5s;
  transition: height .5s;
}
.chat-title {
  min-height: 60px;
  background: #F7FCFF;
}
.v-close-btn {
  height: 15px!important;
  width: 15px!important;
}
.-rotate-45 {
  transform: rotate(-45deg);
}
.btn-chat-shadow {
  box-shadow: 0px 3px 13px -4px #b4b4ec !important;
}
.btns-message {
  background: #366AF5 !important;
}
.divider-chat {
  border-color: rgba(165, 160, 160, 0.12) !important;
}
.messages-container::-webkit-scrollbar {
  width: 13px;
}
.messages-container::-webkit-scrollbar-thumb {
  background: #B4B1CA;
  border-radius: 2px;
  border: 5px solid #fff;
}
.messages-container::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 2px;
  border: 5px solid #fff;
}
.arrow-down {
  max-width: 240px;
  border-radius: 0 10px 10px 10px;
}
.arrow-up {
  border-radius: 10px 10px 0px 10px;
}
.message-arrow:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
}
.arrow-up:before {
  border-left: 2px solid #f5f5f5;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
  border-bottom: 2px solid #f5f5f5;
  right: -4px;
  bottom: 0px;
}
.arrow-down:before {
  border-left: 2px solid transparent;
  border-right: 2px solid #0c7ff2c7;
  border-top: 2px solid #0c7ff2c7;
  border-bottom: 2px solid transparent;
  left: -4px;
  top: 0px;
}
.chat-send-section {
  min-height: 50px;
}
.container-emoji {
    height: 158px !important;
    margin-right: 5px;
}
.container-emoji::-webkit-scrollbar {
  width: 4px !important;
}
.container-emoji::-webkit-scrollbar-thumb {
  background: #B4B1CA;
  border-radius: 2px;
}
.container-emoji::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 2px;
}
.emoji-component {
  right: 6px;
}
.emoji-component div {
  background: #fff;
}
.emoji-component span {
  display: flex !important;
  padding: 7px 0px;
}
.container-search {
  padding: 0 10px;
}
.container-search input {
  outline: none;
}
.v-list-item {
  min-height: 30px !important;
}
.v-tooltip__content {
  background: transparent !important;
  padding: 0;
}
.message-btns {
  margin-left: -130px;
  margin-top: -13px;
}
.mdi-file-outline::before, .mdi-image::before{
  color: #fff;
  font-size: 15px;
}
.uploadfile-btn * {
  cursor: default;
}
.uploadfile-btn .upload-icon .v-icon--link {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  cursor: pointer;
  box-shadow: 1px 1px 4px #000000;
  background: #366AF5 !important;
}
.uploadfile-btn .v-input__prepend-outer {
  padding: 0;
  margin: 0;
}
.image-preview {
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 6px;
}
.images-container {
  overflow-x: scroll;
  min-height: 60px;
}
.images-container::-webkit-scrollbar {
  height: 5px;
  width: 3px;
}
.images-container::-webkit-scrollbar-thumb {
  background: #B4B1CA;
  border-radius: 2px;
}
.images-container::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 2px;
}
.docfile-name {
  white-space: nowrap;
}
.docs {
  min-height: 42px;
}
.preview-doc {
  height: 30px;
}


.VueCarousel-dot {
  outline: none !important;
}
.VueCarousel-slide {
  max-width: 100%;
}
.VueCarousel-slide .v-image__image {
  background-size: auto !important;
}
.VueCarousel-slide .v-responsive__content {
  max-width: 100%;
}
.VueCarousel-navigation-prev {
  left: 58px !important;
  padding-right: 13px !important;
}
.VueCarousel-navigation-next {
  right: 58px !important;
  padding-left: 13px !important;
}
.VueCarousel-navigation-prev, .VueCarousel-navigation-next {
  border-radius: 100%;
  background: rgb(255 255 255 / 30%) !important;
  color: white !important;
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  outline: none !important;
}
.VueCarousel-pagination {
  height: 10px
}
</style>
