import type { IPluginContext } from '@tarojs/service'

module.exports = function (context: IPluginContext) {
  const framework = context.initialConfig.framework
  if (
    framework !== context.helper.FRAMEWORK_MAP.VUE3
    // && framework !== context.helper.FRAMEWORK_MAP.VUE
  ) return

  /**
   * Transform elements with `taro-env` attribute.
   * <view taro-env="weapp">weapp specific node</view>
   */
  function transformTaroEnv (node, ctx) {
    if (node.type === 1 /* ELEMENT */) {
      node.props.forEach((prop, index) => {
        if (prop.type === 6 && prop.name === 'taro-env') {
          process.env.TARO_ENV !== prop.value.content
            ? ctx.removeNode(node)
            : node.props.splice(index, 1)
        }
      })
    }
  }

  context.modifyWebpackChain(({ chain }) => {
    chain.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vueLoader')
      .loader('vue-loader')
      .tap(opts => {
        // if (framework === 'vue') {
        //   opts.compilerOptions.modules = [
        //     ...opts.compilerOptions.modules,
        //     { preTransformNode: transformTaroEnv }
        //   ]
        // } else {
        opts.compilerOptions.nodeTransforms = [
          transformTaroEnv,
          ...opts.compilerOptions.nodeTransforms
        ]
        // }

        return opts
      })
  })
}

