<template>
  <v-layout>
    <v-navigation-drawer
      v-model="isOpening"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      fixed
      app
    >
      <v-toolbar-side-icon @click="isOpening = !isOpening"/>
      <v-toolbar-title v-text="title"/>
    </v-toolbar>
  </v-layout>
</template>

<script>
export default {
  name: 'v-navbar',
  data: () => {
    return {
      title: 'Vuetify.js!',
      isOpening: false,
      items: [
        {
          icon: 'home',
          title: 'ホーム',
          to: '/'
        },
        {
          icon: 'create',
          title: '新規作成',
          to: '/edit'
        }
      ]
    }
  }
}
</script>
