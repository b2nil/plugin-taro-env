# plugin-taro-env
> 支持对 Vue SFC 模板进行条件编译

## 使用
- 在编译配置文件中配置插件：
```ts
// config/index.js
{
  plugins: ['plugin-taro-env'],
}
```

- 使用 `taro-env` 属性标注平台特有的组件，编译后会删除目标平台不需要的代码。`taro-env` 的值应与 `process.env.TARO_ENV` 一致。


  例如，如下 SFC 模板：
  ```html
  <view>
    <view taro-env="weapp">weapp specific node</view>
    <view taro-env="h5">h5 specific node</view>
  </view>
  ```

  编译到 `weapp` 平台后，相当于：
  ```html
  <view>
    <view>weapp specific node</view>
  </view>
  ```

  编译到 `h5` 平台后，相当于：
  ```html
  <view>
    <view>h5 specific node</view>
  </view>
  ```
