<template>
  <v-layout align-start justify-start column fill-height>
    <v-layout align-start justify-start row wrap fill-height>
      <v-flex v-for="photo in localPhotos" v-bind:key="photo.photoFilename" xs12 sm6 md4 row pa-2>
        <v-card flat tile>
          <v-img :src="photo.photoFilename" aspect-ratio="2.75"/>

          <v-card-title primary-title>
            <div class="photo-description">{{ photo.photoDescription }}</div>
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
    </v-layout>

    <v-snackbar :value="errorSnackbar" color="error" :timeout="0">
      {{ error }}
      <v-btn dark flat @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>

    <v-dialog v-model="uploadPhotoDialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn fab bottom right fixed dark large class="ma-4" color="primary" v-on="on">
          <v-tooltip top>
            <v-btn flat slot="activator">
              <v-icon>add</v-icon>
            </v-btn>
            <span>Add another photo</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Upload a photo</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Description"
            v-model="newPhoto.description"
            counter="maximums.description"
          />
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
                    class="white--text upload-prompt font-weight-medium text-xs-center"
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
                    class="white--text upload-prompt font-weight-medium text-xs-center"
                  >Click to change the venue photo</p>
                </v-img>
              </div>
            </image-input>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="uploadPhotoDialog = false">Close</v-btn>
          <v-btn v-if="newPhoto.photo" color="blue darken-1" flat @click="uploadPhoto">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";

const maximums = {
  description: 128
};

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
    maximums,
    error: "",
    errorSnackbar: false,
    localPhotos: [] as Photo[],
    uploadPhotoDialog: false,
    newPhoto: {
      photo: null as { imageFile: File; imageUrl: string } | null,
      isPrimary: false,
      description: ""
    },
    descriptionRules: [
      (v: string) =>
        v.length <= maximums.description ||
        `Description must be less than ${maximums.description} characters`
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
    },
    uploadPhoto() {
      if (
        this.newPhoto.photo === null ||
        this.newPhoto.photo.imageFile === null
      ) {
        this.error = "Please select a photo";
        this.errorSnackbar = true;
      }
      const data = new FormData();
      data.set("description", this.newPhoto.description);
      data.set("makePrimary", String(this.newPhoto.isPrimary));
      data.set(
        "photo",
        this.newPhoto.photo!.imageFile,
        this.newPhoto.photo!.imageUrl
      );

      Vue.axiosAuthorized()
        .post(`/venues/${this.venueId}/photos`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
          this.uploadPhotoDialog = false;
          this.newPhoto = { photo: null, isPrimary: false, description: "" };
          this.getPhotos();
        })
        .catch(error => {
          this.error = error.response ? error.response.statusText : error;
          this.errorSnackbar = true;
        });
    }
  }
});
</script>

<style scoped>
.full-width {
  width: 100%;
}

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

.photo-description {
  height: 150px;
}
</style>
