<template>
  <v-layout>
    <v-flex v-for="photo in localPhotos" v-bind:key="photo.photoFilename" xs12 sm6 md4 row wrap>
      <v-card flat tile>
        <v-img :src="photo.photoFilename" aspect-ratio="2.75"/>

        <v-card-title primary-title>
          <div>
            <div>{{ photo.photoDescription }}</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn color="error" @click="deletePhoto(photo)">Delete</v-btn>
          <v-btn
            v-if="!photo.isPrimary"
            color="blue darken-3 white--text"
            @click="setPrimary(photo)"
          >Make primary</v-btn>
          <v-btn v-if="photo.isPrimary" disabled color="blue darken-3 white--text">Primary photo</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-snackbar :value="errorSnackbar" color="error" :timeout="0">
      {{ error }}
      <v-btn dark flat @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>

    <v-dialog v-model="uploadPhotoDialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Upload Photo</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Upload a photo</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Description"/>
          <v-switch
            v-model="newPhoto.isPrimary"
            :label="newPhoto.isPrimary ? 'Set as primary photo' : 'Don\'t set as primary photo'"
          />

          <v-container>
            <image-input v-model="newPhoto.photo">
              <div slot="activator">
                <v-img
                  v-if="!newPhoto.photo"
                  v-ripple
                  max-height="150px"
                  class="full-width"
                  :src="require('@/assets/imagePlaceholder.jpg')"
                  gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
                >
                  <p
                    class="white--text upload-prompt font-weight-medium text-md-center"
                  >Click to add a venue photo</p>
                </v-img>

                <v-img
                  v-else
                  v-ripple
                  max-height="150px"
                  class="full-width"
                  :src="newPhoto.photo.imageURL"
                  gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
                >
                  <p
                    class="white--text upload-prompt font-weight-medium text-md-center"
                  >Click to change the venue photo</p>
                </v-img>
              </div>
            </image-input>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="uploadPhotoDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="uploadPhotoDialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";

import { Photo } from "@/model/Photo";
import { baseUrl } from "../common";
import ImageInput from "@/components/ImageInput.vue";

export default Vue.extend({
  components: {
    ImageInput
  },
  beforeMount() {
    this.updatePhotos(this.photos);
  },
  props: {
    photos: { type: Array as () => Photo[] },
    venueId: { type: String }
  },
  data: () => ({
    error: "",
    errorSnackbar: false,
    localPhotos: [] as Photo[],
    uploadPhotoDialog: false,
    newPhoto: {
      photo: null,
      isPrimary: false
    },
    descriptionRules: [
      (v: string) =>
        v.length <= 128 || "Description must be less than 128 characters"
    ]
  }),
  methods: {
    async setPrimary(photo: Photo) {
      try {
        await Vue.axiosAuthorized().post(photo.photoFilename + "/setPrimary");
        this.getPhotos();
      } catch (error) {
        this.error = error.response ? error.response.statusText : error;
        this.errorSnackbar = true;
      }
    },
    async deletePhoto(photo: Photo) {
      try {
        await Vue.axiosAuthorized().delete(photo.photoFilename);
        this.getPhotos();
      } catch (error) {
        this.error = error.response ? error.response.statusText : error;
        this.errorSnackbar = true;
      }
    },
    async getPhotos() {
      const res = await Vue.axiosAuthorized().get(`/venues/${this.venueId}`);
      this.updatePhotos(res.data.photos);
    },
    updatePhotos(photos: Photo[]) {
      this.localPhotos = [];
      photos.forEach(photo => {
        this.localPhotos.push({
          ...photo,
          photoFilename: `${baseUrl}/venues/${this.venueId}/photos/${
            photo.photoFilename
          }`
        });
      });
    }
  }
});
</script>

<style>
.primary-div {
  width: 100%;
  padding: 0;
  margin: 0;
}

.primary-text {
  padding: 0;
  margin: 0;
  color: white;
  text-align: center;
}

.upload-prompt {
  line-height: 150px;
}
</style>
