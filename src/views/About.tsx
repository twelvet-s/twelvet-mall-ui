const About: React.FC = () => {
  return (
    <div className={`p-8`}>
      <h2 className={`text-2xl font-bold mb-4`}>关于 twelvet-mall</h2>
      <p className={`text-lg mb-4`}>
        twelvet-mall 是一个基于 React
        的电商平台前端框架。它提供了一套美观、易用的用户界面组件和样式，让开发者能够快速构建功能丰富的电商网站。
      </p>
      <p className={`text-lg mb-4`}>
        使用 twelvet-mall，您可以轻松设置商品展示、购物车、结算流程等功能。同时，它还集成了
        unocss，可以通过自定义主题和样式轻松定制您的网站外观。
      </p>
      <p className={`text-lg mb-4`}>
        我们希望 twelvet-mall 能够成为您开发电商项目的理想选择。感谢您的支持和使用！
      </p>
    </div>
  )
}

export default About
