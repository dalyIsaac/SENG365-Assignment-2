<template>
  <v-layout align-start justify-start column fill-height>
    <v-layout align-start justify-start row>
      <user-photo-editor v-if="email" :userId="id"/>
      <v-avatar v-else size="150px" v-ripple class="ma-3">
        <v-img
          :lazy-src="require('@/assets/imagePlaceholder.jpg')"
          :src="profileImage"
          class="profile-picture"
          alt="avatar"
        />
      </v-avatar>

      <h1 class="ma-3">
        <span v-if="email">Hello</span>
        {{ familyName }}, {{ givenName }}
      </h1>
    </v-layout>

    <v-container grid-list-xl fluid>
      <v-card class="full-width">
        <div class="tile">
          <p class="subheading label">Username:</p>
          <p class="subheading value">{{ username }}</p>
        </div>

        <v-divider/>

        <div v-if="email">
          <div class="tile">
            <p class="subheading label">Email:</p>
            <p class="subheading value">{{ email }}</p>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Given name:</p>
            <div class="value">
              <v-layout row>
                <v-btn flat :disabled="!givenNameValid" icon color="primary" @click="editGivenName">
                  <v-icon v-if="editingGivenName">save</v-icon>
                  <v-icon v-else class="flipped-icon">edit</v-icon>
                </v-btn>
                <v-form v-model="givenNameValid">
                  <v-text-field
                    v-model="givenName"
                    :rules="nameRules"
                    :counter="userMaximums.name"
                    label="Given name"
                    required
                    :disabled="!editingGivenName"
                  />
                </v-form>
              </v-layout>
            </div>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Family name:</p>
            <div class="value">
              <v-layout row>
                <v-btn
                  flat
                  :disabled="!familyNameValid"
                  icon
                  color="primary"
                  @click="editFamilyName"
                >
                  <v-icon v-if="editingFamilyName">save</v-icon>
                  <v-icon v-else class="flipped-icon">edit</v-icon>
                </v-btn>
                <v-form v-model="familyNameValid">
                  <v-text-field
                    v-model="familyName"
                    :rules="nameRules"
                    :counter="userMaximums.name"
                    label="Family name"
                    required
                    :disabled="!editingFamilyName"
                  />
                </v-form>
              </v-layout>
            </div>
          </div>

          <v-divider/>

          <div v-if="editingPassword">
            <div class="tile">
              <p class="subheading label">Old password:</p>
              <div class="value">
                <v-layout row>
                  <!-- Empty button for alignment -->
                  <v-btn :disabled="editingPassword" flat icon/>
                  <v-form v-model="oldPasswordValid" class="full-width">
                    <v-text-field
                      v-model="oldPassword"
                      :rules="passwordRules"
                      :counter="userMaximums.password"
                      label="Old password"
                      required
                      class="input-group--focused"
                      type="password"
                    />
                  </v-form>
                </v-layout>
              </div>
            </div>
          </div>

          <div class="tile">
            <p class="subheading label">New password:</p>
            <div class="value">
              <v-layout row>
                <v-btn :disabled="editingPassword" flat icon color="primary" @click="editPassword">
                  <v-icon v-if="!editingPassword" class="flipped-icon">edit</v-icon>
                </v-btn>
                <v-text-field
                  v-model="newPassword"
                  :rules="passwordRules"
                  :counter="userMaximums.password"
                  label="New password"
                  required
                  @input="validatePassword"
                  class="input-group--focused"
                  :disabled="!editingPassword"
                  type="password"
                />
              </v-layout>
            </div>
          </div>

          <div class="tile" v-if="editingPassword" transition="slide-x-transition">
            <p class="subheading label">Confirm new password:</p>
            <div class="value">
              <v-layout row>
                <v-btn
                  v-if="editingPassword"
                  :disabled="!(newPasswordValid && oldPasswordValid)"
                  flat
                  icon
                  color="primary"
                  @click="editPassword"
                >
                  <v-icon>save</v-icon>
                </v-btn>
                <v-form v-model="newPasswordValid" class="full-width">
                  <v-text-field
                    v-model="newConfirmPassword"
                    :error-messages="newConfirmPasswordError"
                    :rules="[...passwordRules, validateConfirmPassword]"
                    :counter="userMaximums.password"
                    label="Confirm new password"
                    required
                    class="input-group--focused"
                    :disabled="!editingPassword"
                    type="password"
                  />
                </v-form>
              </v-layout>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="tile">
            <p class="subheading label">Given name:</p>
            <p class="subheading value">{{ givenName }}</p>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Family name:</p>
            <p class="subheading value">{{ familyName }}</p>
          </div>
        </div>
      </v-card>
    </v-container>

    <v-snackbar :value="errorSnackbar" color="error" :timeout="0">
      {{ error }}
      <v-btn dark flat @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script lang="ts">
import { isBoolean } from "lodash";
import Vue from "vue";

import { nameRules, passwordRules, userMaximums } from "@/model/User";
import UserPhotoEditor from "@/components/UserPhotoEditor";
import { baseUrl } from "@/common";

export default Vue.extend({
  components: {
    UserPhotoEditor
  },
  beforeMount() {
    this.getUser();
    this.profileImage = baseUrl + `/users/${this.id}/photo`;
  },
  props: {
    id: { type: String }
  },
  data: () => ({
    error: "",
    errorSnackbar: false,
    userMaximums,
    profileImage: "",
    username: "",
    givenName: "",
    givenNameValid: true,
    editingGivenName: false,
    familyName: "",
    familyNameValid: true,
    editingFamilyName: false,
    email: "",
    oldPassword: "",
    oldPasswordValid: false,
    newPassword: "",
    newConfirmPassword: "",
    newPasswordValid: false,
    editingPassword: false,
    nameRules,
    passwordRules,
    newConfirmPasswordError: [] as Array<string | boolean>
  }),
  methods: {
    async getUser(props?: Array<"givenName" | "familyName">) {
      const res = await Vue.axiosAuthorized().get("/users/" + this.id);

      if (props) {
        for (const key of props) {
          this[key] = res.data[key];
        }
      } else {
        this.username = res.data.username;
        this.givenName = res.data.givenName;
        this.familyName = res.data.familyName;

        // if this email is populated, then we know we're viewing ourselves,
        // per the API spec.
        this.email = res.data.email;
      }
    },
    async editGivenName() {
      if (this.editingGivenName && this.givenNameValid) {
        this.editingGivenName = false;
        await Vue.axiosAuthorized().patch("/users/" + this.id, {
          givenName: this.givenName
        });
        this.getUser(["givenName"]);
      } else {
        this.editingGivenName = true;
      }
    },
    async editFamilyName() {
      if (this.editingFamilyName && this.familyNameValid) {
        this.editingFamilyName = false;
        await Vue.axiosAuthorized().patch("/users/" + this.id, {
          familyName: this.familyName
        });
        this.getUser(["familyName"]);
      } else {
        this.editingFamilyName = true;
      }
    },
    async editPassword() {
      try {
        if (this.editingPassword && this.newPassword) {
          this.editingPassword = false;
          const validOldPassword = await Vue.login({
            username: this.username,
            password: this.oldPassword
          });
          if (validOldPassword) {
            await Vue.axiosAuthorized().patch("/users/" + this.id, {
              password: this.newPassword
            });
          } else {
            throw new Error("Invalid old password");
          }
        } else {
          this.editingPassword = true;
        }
      } catch (error) {
        this.error = error.response ? error.response.statusText : error;
        this.errorSnackbar = true;
      }
    },
    validatePassword() {
      this.validateConfirmPassword(this.newConfirmPassword);
    },
    validateConfirmPassword(v: string) {
      const status = v === this.newPassword || "The passwords do not match";
      this.newConfirmPasswordError = isBoolean(status) ? [] : [status];
      return status;
    }
  }
});
</script>

<style scoped>
.tile {
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 16px;
}

/* Credit to https://codepen.io/anon/pen/VqPRyp */
.flipped-icon {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
}

.label {
  grid-column: 1;
  margin: 0;
  padding: 0;
}

.value {
  grid-column: 2;
  text-align: right;
  margin: 0;
  padding: 0;
}

.full-width {
  width: 100%;
}

h1 {
  line-height: 150px;
}

.profile-picture {
  height: 150px;
  width: 150px;
  object-fit: contain;
}
</style>
