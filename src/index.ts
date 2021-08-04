import type { IPluginContext } from '@tarojs/service'

module.exports = function (context: IPluginContext) {
  const framework = context.initialConfig.framework
  if (
    framework !== context.helper.FRAMEWORK_MAP.VUE3
    // && framework !== context.helper.FRAMEWORK_MAP.VUE
  ) return

  function findEnv (source: string) {
    const envReg = /(?<=(taro-env|taroEnv)=")([a-z0-9]+)(?=")/g
    const found = source.match(envReg)
    return found !== null ? found[0] : found
  }

  function isTaroEnv (propName: string) {
    return propName === 'taro-env' || propName === 'taroEnv'
  }

  /**
   * Transform elements with `taro-env` or `taroEnv` attribute.
   * <view taro-env="weapp">weapp specific node</view>
   * <view taroEnv="h5">h5 specific node</view>
   */
  function transformTaroEnv (node, ctx) {
    // if, if-branch, v-for
    if (node.type >= 9 && node.type <= 11) {
      const source = node.type === 11
        ? node.codegenNode.loc.source
        : node.loc.source

      const targetEnv = findEnv(source)

      if (targetEnv !== process.env.TARO_ENV) {
        ctx.removeNode(node)
      }
    } else if (node.type === 1 /* ELEMENT */) {
      node.props.forEach((prop, index) => {
        if (prop.type === 6 && isTaroEnv(prop.name)) {
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

