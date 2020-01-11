# HMIS

##指定私服地址
```
npm config set registry https://maven.bestvike.com/repository/group-npm/
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 打包命令
```
指定运行路径
http://xxx.com/ 对应打包命令
npx cross-env VUE_APP_ROOT=/ vue-cli-service build --modern
http://xxx.com 对应打包命令
npx cross-env VUE_APP_ROOT=/ VUE_APP_CENTER_API=/center VUE_APP_PUBLIC_API=/public vue-cli-service build
```
