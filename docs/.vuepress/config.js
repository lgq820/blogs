module.exports = {
  title: 'Lee的博客',
  description: 'Lee',
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  theme: 'reco',
  base: '/blogs/',
  themeConfig: {
    logo: "/avatar.png",
    authorAvatar: "/avatar.png",
    type: "blog",
    nav: [
      { text: "首页", link: "/" },
      {
        text: "Lee 的博客",
        items: [
          { text: "掘金", link: "https://juejin.cn/user/3755587450438797" },
          { text: "Github", link: "https://github.com/lgq820" },
          { text: "标签", link: "https://github.com/lgq820" }
        ]
      }
    ],
  },
  plugins: [
    [
      "sakura",
      {
        num: 20, // 默认数量
        show: true, //  是否显示
        zIndex: -1, // 层级
        img: {
          replace: false, // false 默认图 true 换图 需要填写httpUrl地址
        },
      },
    ],
    [
      "cursor-effects",
      {
        size: 4, // size of the particle, default: 2
        shape: "star", // ['star' | 'circle'], // shape of the particle, default: 'star'
        zIndex: 999999999, // z-index property of the canvas, default: 999999999
      },
    ],
 ]
}
