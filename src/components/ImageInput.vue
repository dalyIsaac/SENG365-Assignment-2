// https://medium.freecodecamp.org/how-to-build-a-flexible-image-uploader-component-using-vue-js-2-0-5ee7fc77516

<template>
  <div>
    <!-- slot for parent component to activate the file changer -->
    <div @click="launchFilePicker()">
      <slot name="activator"></slot>
    </div>

    <form id="input-file-id" style="display:none">
      <!-- image input: style is set to hidden and assigned a ref so that it can be triggered -->
      <input
        type="file"
        ref="file"
        :name="uploadFieldName"
        @change="onFileChange(
            $event.target.name, $event.target.files)"
        style="display:none"
      >
    </form>

    <v-snackbar :value="errorSnackbar" color="error" :timeout="0">
      {{ errorText }}
      <v-btn dark flat @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "image-input",
  data: () => ({
    errorSnackbar: false,
    errorText: "",
    uploadFieldName: "file",
    maxSize: 20000000
  }),
  props: {
    // Use "value" to enable using v-model
    value: Object
  },
  methods: {
    launchFilePicker() {
      (this.$refs.file as HTMLFormElement).click();
    },
    onFileChange(fieldName: string, file: FileList) {
      const { maxSize } = this;
      const imageFile = file[0];
      if (file.length > 0) {
        if (
          !(
            imageFile.type.match("image/jpeg") ||
            imageFile.type.match("image/png")
          )
        ) {
          // check whether the upload is an image
          this.errorSnackbar = true;
          this.errorText = "Please choose either a JPEG or PNG image file";
        } else if (imageFile.size > this.maxSize) {
          // check whether the size is greater than the size limit
          this.errorSnackbar = true;
          this.errorText =
            "Your file is too big! Please select an image under 20MB";
        } else {
          // Append file into FormData and turn file into image URL
          const imageURL = URL.createObjectURL(imageFile);
          // Emit the FormData and image URL to the parent component
          this.$emit("input", { imageFile, imageURL });
          (document.getElementById("input-file-id") as HTMLFormElement).reset();
        }
      }
    }
  }
});
</script>