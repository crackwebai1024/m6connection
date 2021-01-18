module.exports = {
  lintOnSave: false,
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/scss/_global.scss";'
      }
    }
  },
  devServer: {
    disableHostCheck: true
  }
}
