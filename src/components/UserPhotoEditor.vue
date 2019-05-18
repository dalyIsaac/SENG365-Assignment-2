<template>
  <v-layout align-center justify-start row fill-height>
    <image-input v-model="photo">
      <div slot="activator">
        <v-avatar v-ripple size="150px" class="avatar">
          <v-img
            :key="photo.imageURL"
            :lazy-src="require('@/assets/profilePicturePlaceholder.png')"
            :src="photo.imageURL"
            v-on:error="resetUrl"
            class="profile-picture"
            gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
            alt="placeholder profile picture"
          >
            <p
              v-if="photo.imageURL"
              class="white--text upload-prompt font-weight-medium text-xs-center"
            >Update your picture</p>
            <p
              v-else
              class="white--text upload-prompt font-weight-medium text-xs-center"
            >Upload a picture</p>
          </v-img>
        </v-avatar>
      </div>
    </image-input>

    <v-btn v-if="photo.imageFile" fab dark small color="primary" @click="savePhoto">
      <v-icon dark>save</v-icon>
    </v-btn>

    <v-btn v-else-if="photo.imageURL" fab dark small color="error" @click="deletePhoto">
      <v-icon dark>delete</v-icon>
    </v-btn>
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
    },
    async deletePhoto() {
      await Vue.axiosAuthorized().delete(this.URL);
      this.photo = { imageFile: null, imageURL: "" };
    },
    resetUrl() {
      this.photo = { imageFile: null, imageURL: "" };
    }
  }
});
</script>

<style scoped>
.profile-picture {
  height: 150px;
  width: 150px;
  object-fit: contain;
}

.upload-prompt {
  line-height: 150px;
}

.avatar {
  cursor: grab;
}
</style>
