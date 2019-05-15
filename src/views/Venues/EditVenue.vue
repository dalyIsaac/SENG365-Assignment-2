<template>
  <div>Hello edit venue!</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Category } from "@/model/Category";

export default Vue.extend({
  props: {
    id: { type: String }
  },
  beforeMount() {
    this.getCategories();
    Vue.axiosAuthorized()
      .get("/venues/" + this.id)
      .then(res => {
        if (this.id !== res.data.admin.userId.toString()) {
          this.$router.push("/");
          return;
        }
        this.venueName = res.data.venueName;
        this.city = this.city;
        this.shortDescription = this.shortDescription;
        this.longDescription = this.longDescription;
        this.latitude = this.latitude;
        this.longitude = this.longitude;
        this.photos = this.photos;
      })
      .catch(error => {
        console.error({ ...error });
        this.$router.push("/");
      });
  },
  data: () => ({
    venueName: "",
    city: "",
    shortDescription: "",
    longDescription: "",
    address: "",
    latitude: -1,
    longitude: -1,
    photos: [] as string[],
    categories: [] as Category[],
    selectedCategory: {} as Category,
    categoryId: -1
  }),
  methods: {
    getCategories(): void {
      Vue.axiosAuthorized()
        .get("/categories")
        .then(res => {
          this.categories = res.data;
        })
        .catch(err => {
          console.error({ ...err });
          this.$router.push("/");
        });
    }
  }
});
</script>
