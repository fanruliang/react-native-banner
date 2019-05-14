import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';
export default class Banner extends Component {

    static navigationOptions = {
        title: '',
    };

    static propTypes =
        {
            autoplay:PropTypes.bool,
            autoplayTimeout:PropTypes.number,
            loop:PropTypes.bool,
            width:PropTypes.number,
            height:PropTypes.number,
        }
    static defaultProps = {
        autoplay:false,
        autoplayTimeout:1,
        loop:true,
        width:Dimensions.get('window').width,
    }


    constructor(props) {
        super(props);
        this.isFirst = true;
        this.state = {
            pageIndex:props.loop?1:0
        }
    }

    componentDidMount() {
        this.initTime();
        this.scrollView.scrollTo({x:this.props.width*this.state.pageIndex, animated:false})
    }

    componentWillUnmount() {
        this.clearTime();
    }

    initTime()
    {
        this.clearTime();
        if (this.props.autoplay)
        {
            this.timer = setTimeout(()=>{
                let pageIndex = this.state.pageIndex +1;
                if (!this.props.loop)
                {
                    if (pageIndex == this.props.children.length)
                    {
                        pageIndex = 0;
                    }
                }
                this.scrollView.scrollTo({x:pageIndex*this.props.width, animated:true})
                this.setState({pageIndex},()=>{
                    if (Platform.OS === 'android')
                    {
                        this.onEnd(pageIndex);

                    }
                })
            },this.props.autoplayTimeout*1000);

        }
    }

    clearTime()
    {
        if (this.timer != null)
        {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    onScrollBegin = e =>{
        console.log('onScrollBegin');
        this.clearTime();
    }

    onScrollEnd = e =>{
        let {layoutMeasurement,contentOffset} = e.nativeEvent;
        let w = layoutMeasurement.width;
        let x = contentOffset.x;
        let pageIndex = Math.round(x/w);
        this.onEnd(pageIndex);
    }

    onEnd(pageIndex)
    {

        let length = this.props.children.length;
        if (this.props.loop)
        {
            if (pageIndex == 0)
            {
                pageIndex = length;
                this.scrollView.scrollTo({x:this.props.width*length,y:0, animated:false})
            }
            else if(pageIndex == length+1)
            {
                pageIndex = 1;
                if (Platform.OS === 'android')
                {
                    setTimeout(()=>{
                        this.scrollView.scrollTo({x:this.props.width,y:0, animated:false})
                    },250);
                }
                else
                {
                    this.scrollView.scrollTo({x:this.props.width,y:0, animated:false})
                }
            }

        }
        this.initTime();
        this.setState({pageIndex})
    }

    onScrollEndDrag = e => {
        const { contentOffset } = e.nativeEvent;
        console.log('onScrollEndDrag');
    }

    onLayout = (e)=>{
        const { width, height } = e.nativeEvent.layout
    }


    renderPagination = () => {
        // By default, dots only show when `total` >= 2
        if (this.props.children <= 1) return null

        let dots = [];
        let {loop} = this.props;
        let index = loop?this.state.pageIndex-1:this.state.pageIndex;
        const ActiveDot = this.props.activeDot || <View style={[{
            backgroundColor: this.props.activeDotColor || '#007aff',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3
        }, this.props.activeDotStyle]} />
        const Dot = this.props.dot || <View style={[{
            backgroundColor: this.props.dotColor || 'rgba(0,0,0,.2)',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3
        }, this.props.dotStyle ]} />
        for (let i = 0; i < this.props.children.length; i++) {
            dots.push(i === index
                ? React.cloneElement(ActiveDot, {key: i})
                : React.cloneElement(Dot, {key: i})
            )
        }
        return (
            <View pointerEvents='none' style={styles.pagination_x}>
                {dots}
            </View>
        )
    }


    render() {
        let {children,loop} = this.props;
        let pages = Object.keys(children)
        if (loop) {
            pages.unshift(children.length - 1 + '')
            pages.push('0')
        }

        return (
            <View style={{width:this.props.width}} onLayout={this.onLayout}>
                <ScrollView
                    {...this.props}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onScrollBeginDrag={this.onScrollBegin}
                    onMomentumScrollEnd={this.onScrollEnd}
                    onScrollEndDrag={this.onScrollEndDrag}
                    ref={(ref)=>this.scrollView = ref}>
                    {pages.map((key,index)=>(
                        children[key]
                    ))}
                </ScrollView>
                {this.renderPagination()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {

    },
    pagination_x: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
});