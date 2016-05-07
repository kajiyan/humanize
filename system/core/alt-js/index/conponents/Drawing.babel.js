import React from 'react';
import ReactDOM from 'react-dom';
import Painting from './../lib/painting';



class Drawing extends React.Component {
  // --------------------------------------------------
  /**
   * Drawing constructor
   */
  constructor(props) {
    console.log('[Drawing] Component | constructor');
    super(props);
  }


  // --------------------------------------------------
  /**
   * Drawing getDefaultProps
   * 初期値の設定をする
   *
   * width - canvas 幅の初期値
   * height - canvas 高さの初期値
   *
   */
  getDefaultProps() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      isRetinaSupport: false
    };
  }

  // --------------------------------------------------
  componentWillMount() {
    console.log('[Drawing] Component | componentWillMount');
  }


  // --------------------------------------------------
  /**
   * Drawing componentDidMount
   * コンポーネントが実際のDOMに描画された後に一度だけ発火する
   * つまりクライアントサイドでのみ発火する
   */
  componentDidMount() {
    console.log('[Drawing] Component | componentDidMount');

    let pixelRatio = (this.props.isRetinaSupport ? window.devicePixelRatio : 1);

    this.canvas = ReactDOM.findDOMNode(this.refs['canvas--type_drawing']);
    this.canvas.width = this.props.width * pixelRatio;
    this.canvas.height = this.props.height * pixelRatio;

    if (BUILD_MODE !== 'PRODUCTION') {
      this.canvas.style.backgroundColor = '#cccccc';
    }

    this.context = this.canvas.getContext('2d');

    this.painting = new Painting(this.canvas, {});
  }


  // --------------------------------------------------
  // shouldComponentUpdate(nextProps, nextState) {}


  // --------------------------------------------------
  componentWillReceiveProps(nextProps) {

  }


  // --------------------------------------------------
  componentWillUpdate() {

  }


  // --------------------------------------------------
  componentDidUpdate() {

  }


  // --------------------------------------------------
  componentWillUnmount() {

  }


  // --------------------------------------------------
  _onClickHandler(e) {
    console.log('[Drawing] Component | _onClickHandler');
  }


  // --------------------------------------------------
  render() {
    return (
      <canvas
        id="js-canvas--type_drawing"
        className="canvas--type_drawing"
        ref="canvas--type_drawing"
        onClick={this._onClickHandler}
      ></canvas>
    );
  }
}



Drawing.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  isRetinaSupport: React.PropTypes.bool
}



export default Drawing;









