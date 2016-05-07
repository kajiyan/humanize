import React from 'react';
import ReactDOM from 'react-dom';
import Flickity from 'flickity/dist/flickity.pkgd.min';



class Howto extends React.Component {
  // --------------------------------------------------
  constructor(props) {
    console.log('[Howto] Component | props');
    super(props);
  }


  // --------------------------------------------------
  /**
   * Howto componentDidMount
   * コンポーネントが実際のDOMに描画された後に一度だけ発火する
   * つまりクライアントサイドでのみ発火する
   */
  componentDidMount() {
    console.log('[Howto] Component | componentDidMount');
  
    this.images = React.findDOMNode(this.refs['howto-images']);
    this.flickity = new Flickity(this.images, {
      cellAlign: 'left',
      contain: true,
      prevNextButtons: false
    });

    this.flickity.on('settle', this._settleHandler.bind(this));
  }

  // --------------------------------------------------
  /**
   * Howto _settleHandler
   * スライダーの表示位置が変わったタイミングで呼び出される
   */
  _settleHandler() {
    console.log('[Howto] Component | _settleHandler');
    console.log('Flickity settled at ' + this.flickity.selectedIndex);
  }

  // --------------------------------------------------
  render() {
    return (
      <div className="howto is-debug">
        <div className="howto-inner">
          <section className="howto-section">
            <header className="howto-header">
              <h2 className="howto-header__title">使い方</h2>
              <div className="howto-header__close">
                <button className="howto-header__close-btn">
                  <img className="howto-header__close-src l-fluid-image" src="images/return-arrow-0.svg" alt="「使い方」を閉じる" />
                </button>
              </div>
            </header>{/* .howto-header */}

            <div className="howto-images" ref="howto-images">
              <div className="howto-image__holder howto-image__holder--step_1">
                <img className="howto-image__src l-fluid-image" src="images/howto-1-0.png" alt="画像: howto 1" />
              </div>{/* .howto-image__holder */}

              <div className="howto-image__holder howto-image__holder--step_2">
                <img className="howto-image__src l-fluid-image" src="images/howto-2-0.png" alt="画像: howto 2" />
              </div>{/* .howto-image__holder */}

              <div className="howto-image__holder howto-image__holder--step_3">
                <img className="howto-image__src l-fluid-image" src="images/howto-3-0.png" alt="画像: howto 3" />
              </div>{/* .howto-image__holder */}

              <div className="howto-image__holder howto-image__holder--step_4">
                <img className="howto-image__src l-fluid-image" src="images/howto-4-0.png" alt="画像: howto 4" />
              </div>{/* .howto-image__holder */}
            </div>{/* .howto-images */}

            <footer className="policy-footer">
              <div className="policy__texts">
                <p className="policy__text policy__text--step_1 policy__text--active_on">カメラボタンを押して、<br />イベントのいろんなシーンを撮影しよう。</p>
                <p className="policy__text policy__text--step_2">撮った写真に絵を描いたり、<br />スタンプを貼ってデコレーションしよう。</p>
                <p className="policy__text policy__text--step_3">スクリーンに向かってスマホをシェイク。<br />撮影した写真がスクリーンに表示されるよ。</p>
                <p className="policy__text policy__text--step_4">投げた写真をシェアして、<br />イベントをもっと盛り上げよう!</p>
              </div>{/* .policy__texts */}
              {/* 最後のステップに達するとラベルが「はじめよう！」に変わる */}
              <div className="policy-footer__agree">
                <button className="policy-footer__agree-btn">次のステップ<span className="is-hidden">へ進む</span></button>
              </div>
            </footer>{/* .policy-footer */}
          </section>
        </div>{/* .howto-inner */}
      </div>
    );
  }
}



export default Howto;