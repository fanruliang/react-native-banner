# react-native-banner
banner轮播图
## Usage
```javascript
<Banner
  containerStyle={{borderRadius:8,overflow:'hidden'}}
  autoplay={true}
  autoplayTimeout={5}
  dot={
     <View style={{ height: scaleSize(8), width: scaleSize(8), borderRadius: scaleSize(4), backgroundColor:'#fff', marginLeft: scaleSize(8), marginRight: scaleSize(8) }}></View>
     }
  activeDot={
     <View style={{ height: scaleSize(8), width: scaleSize(16), borderRadius: scaleSize(4), backgroundColor: "#fff",  marginLeft: scaleSize(8), marginRight: scaleSize(8) }}></View>
      }>
   <Image source={require('../../image/banner.png')}/>
   <Image source={require('../../image/banner2.png')}/>
   <Image source={require('../../image/banner3.png')}/>
   </Banner>
   ```
