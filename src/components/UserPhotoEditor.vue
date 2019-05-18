<template>
  <v-layout>
    <template v-slot:activator="{ on }">
      <v-btn fab bottom right fixed dark large class="ma-4" color="primary" v-on="on">
        <v-tooltip top>
          <v-btn flat slot="activator">
            <v-icon>add</v-icon>
          </v-btn>
          <span>Change your profile picture</span>
        </v-tooltip>
      </v-btn>
    </template>

    <v-layout align-center justify-start column fill-height>
      <image-input v-model="photo">
        <div slot="activator">
          <v-avatar v-ripple v-if="!photo.imageFile" size="150px" class="ma-3">
            <v-img
              :lazy-src="require('@/assets/imagePlaceholder.jpg')"
              :src="photo.imageURL"
              class="profile-picture"
              gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
              alt="placeholder profile picture"
            >
              <p
                class="white--text upload-prompt font-weight-medium text-xs-center"
              >Update your picture</p>
            </v-img>
          </v-avatar>

          <v-avatar size="150px" v-ripple v-else class="ma-3">
            <v-img :src="photo.imageURL" class="profile-picture" alt="avatar"/>
          </v-avatar>
        </div>
      </image-input>
      <v-btn v-if="photo.imageFile" fab dark small color="primary" @click="savePhoto">
        <v-icon dark>save</v-icon>
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";

import ImageInput from "@/components/ImageInput.vue";
import { baseUrl } from "@/common";

export default Vue.extend({
  props: {
    userId: { type: String }
  },
  beforeMount() {
    this.URL = `/users/${this.userId}/photo`;
    this.getPhoto();
  },
  components: {
    ImageInput
  },
  data: () => ({
    photo: { imageFile: null, imageURL: "" } as {
      imageFile: File | null;
      imageURL: string;
    } | null,
    URL: ""
  }),
  methods: {
    savePhoto() {
      Vue.axiosAuthorized().put(this.URL, this.photo!.imageFile, {
        headers: {
          "Content-Type": this.photo!.imageFile!.type
        }
      });
      this.photo!.imageFile = null;
    },
    getPhoto() {
      this.photo = {
        imageFile: null,
        imageURL: baseUrl + this.URL
      };
      console.log(this.photo);
    }
  }
});
</script>

<style scoped>
.full-width {
  width: 100%;
}

.profile-picture {
  height: 150px;
  width: 150px;
  object-fit: contain;
}

.upload-prompt {
  line-height: 150px;
}
</style>
