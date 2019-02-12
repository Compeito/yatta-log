<template>
  <v-navigation-drawer
    v-model="isActive"
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
</template>

<script>
export default {
  computed: {
    isActive: {
      get() {
        return this.$store.state.navbar.isActive
      },
      set(value) {
        return this.$store.commit('navbar/set', value)
      }
    },
    items() {
      const itemList = [
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
      if (this.$store.state.user.id !== '') {
        itemList.push(
          {
            icon: 'logout',
            title: 'ログアウト',
            to: '/?e=logout'
          }
        )
      }
      return itemList
    }
  }
}
</script>
