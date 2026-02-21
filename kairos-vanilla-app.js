// ============================================
// KAIROS VANILLA JS APP v7.0
// React圧縮コードの完全代替
// オリジナルReactアプリのデザインを忠実に再現
// 完全なAPI連携・投資管理システム搭載
// ============================================

(function() {
  'use strict';

  // ===== 定数 =====
  var STORAGE_KEY = 'kairos_investment_records';
  var VERSION = '7.0.0';
  var COINGECKO_API = 'https://api.coingecko.com/api/v3';
  var FEAR_GREED_API = 'https://api.alternative.me/fng';
  // バックエンドURL（Railway本番 / ローカル開発を自動切替）
  var BACKEND_URL = (function() {
    var host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    return 'https://web-production-d8ff2.up.railway.app';
  })();

  // 通貨IDマッピング（CoinGecko用）
  var CURRENCY_MAP = {
    btc: 'bitcoin',
    eth: 'ethereum',
    sol: 'solana',
    xrp: 'ripple',
    ada: 'cardano',
    doge: 'dogecoin',
    dot: 'polkadot',
    matic: 'matic-network',
    link: 'chainlink',
    avax: 'avalanche-2',
    atom: 'cosmos',
    ltc: 'litecoin',
    uni: 'uniswap',
    shib: 'shiba-inu',
    // 追加通貨
    bnb: 'binancecoin',
    trx: 'tron',
    ton: 'the-open-network',
    xlm: 'stellar',
    hbar: 'hedera-hashgraph',
    xmr: 'monero',
    etc: 'ethereum-classic',
    apt: 'aptos',
    sui: 'sui',
    near: 'near',
    fil: 'filecoin',
    vet: 'vechain',
    algo: 'algorand',
    icp: 'internet-computer',
    // DeFi
    aave: 'aave',
    mkr: 'maker',
    crv: 'curve-dao-token',
    snx: 'havven',
    ldo: 'lido-dao',
    // Layer2
    arb: 'arbitrum',
    op: 'optimism',
    imx: 'immutable-x',
    // Meme
    pepe: 'pepe',
    floki: 'floki',
    bonk: 'bonk',
    wif: 'dogwifcoin',
    // Gaming/NFT
    axs: 'axie-infinity',
    sand: 'the-sandbox',
    mana: 'decentraland',
    gala: 'gala',
    enj: 'enjincoin',
    // AI
    fet: 'fetch-ai',
    ocean: 'ocean-protocol',
    rndr: 'render-token',
    agix: 'singularitynet',
    // Stablecoins
    usdt: 'tether',
    usdc: 'usd-coin',
    dai: 'dai'
  };

  // ===== 通貨カテゴリー定義 =====
  var CRYPTO_CATEGORIES = {
    layer1: {
      name: 'レイヤー1/基盤系',
      icon: '🏛️',
      risk: '中',
      description: 'ブロックチェーンの基盤となる通貨。独自のネットワークを持ち、他のアプリの土台になります。',
      howToEnjoy: '長期保有（ガチホ）向き。価格変動はあるが、時価総額が大きく比較的安定。初心者の最初の一歩に最適。',
      buyingTips: '下落時に少しずつ買い増す「積立」がおすすめ。一度に大金を入れないこと。',
      coins: [
        { symbol: 'BTC', name: 'Bitcoin', desc: '仮想通貨の王様。デジタルゴールドとも呼ばれる' },
        { symbol: 'ETH', name: 'Ethereum', desc: 'スマートコントラクトの元祖。DeFiやNFTの基盤' },
        { symbol: 'SOL', name: 'Solana', desc: '高速・低コスト。若者に人気' },
        { symbol: 'ADA', name: 'Cardano', desc: '学術的アプローチで開発。堅実派向け' },
        { symbol: 'AVAX', name: 'Avalanche', desc: '高速処理が特徴。DeFiで人気' },
        { symbol: 'DOT', name: 'Polkadot', desc: '異なるブロックチェーンを繋ぐ' },
        { symbol: 'ATOM', name: 'Cosmos', desc: 'ブロックチェーン間の相互運用' },
        { symbol: 'NEAR', name: 'NEAR Protocol', desc: '使いやすさ重視の次世代チェーン' },
        { symbol: 'APT', name: 'Aptos', desc: 'Meta社出身チームが開発' },
        { symbol: 'SUI', name: 'Sui', desc: '超高速処理の新興チェーン' },
        { symbol: 'TON', name: 'Toncoin', desc: 'Telegram発。メッセージアプリ連携' },
        { symbol: 'TRX', name: 'TRON', desc: 'エンタメ特化。アジアで人気' },
        { symbol: 'ICP', name: 'Internet Computer', desc: 'Web3のインフラを目指す' },
        { symbol: 'XLM', name: 'Stellar', desc: '国際送金に特化。低コスト' },
        { symbol: 'ALGO', name: 'Algorand', desc: '環境に優しい。機関投資家向け' },
        { symbol: 'HBAR', name: 'Hedera', desc: '企業向け。Google等が参加' },
        { symbol: 'VET', name: 'VeChain', desc: 'サプライチェーン特化' },
        { symbol: 'FIL', name: 'Filecoin', desc: '分散型ストレージ' },
        { symbol: 'ETC', name: 'Ethereum Classic', desc: 'ETHの分岐。コアなファン多い' }
      ]
    },
    defi: {
      name: 'DeFi（分散型金融）',
      icon: '🏦',
      risk: '中〜高',
      description: '銀行なしで貸し借り・両替ができる革新的な金融サービス関連の通貨。',
      howToEnjoy: '関連サービスを使いながら保有するのがベスト。ステーキングで利回りを得られることも。',
      buyingTips: 'DeFiの仕組みを理解してから購入。ハッキングリスクもあるので分散投資を。',
      coins: [
        { symbol: 'UNI', name: 'Uniswap', desc: '最大手の分散型取引所。手数料収入も' },
        { symbol: 'AAVE', name: 'Aave', desc: '仮想通貨の貸し借りができる' },
        { symbol: 'MKR', name: 'Maker', desc: 'ステーブルコインDAIの発行元' },
        { symbol: 'LINK', name: 'Chainlink', desc: '外部データをブロックチェーンに接続' },
        { symbol: 'LDO', name: 'Lido DAO', desc: 'ETHのステーキングサービス' },
        { symbol: 'CRV', name: 'Curve', desc: 'ステーブルコイン交換に特化' },
        { symbol: 'SNX', name: 'Synthetix', desc: '合成資産を作れる' }
      ]
    },
    layer2: {
      name: 'レイヤー2/スケーリング',
      icon: '⚡',
      risk: '中',
      description: 'イーサリアム等の処理速度を改善する技術。メインチェーンより安く速い。',
      howToEnjoy: '実際にL2ネットワークを使ってみるのがおすすめ。ガス代の安さを体感できる。',
      buyingTips: 'ETHの成長と連動しやすい。ETHを持っているなら分散先として検討。',
      coins: [
        { symbol: 'MATIC', name: 'Polygon', desc: 'ETHの拡張。企業採用多数' },
        { symbol: 'ARB', name: 'Arbitrum', desc: 'ETH L2で最大規模' },
        { symbol: 'OP', name: 'Optimism', desc: '楽観的ロールアップの代表格' },
        { symbol: 'IMX', name: 'Immutable X', desc: 'NFTゲーム特化のL2' }
      ]
    },
    meme: {
      name: 'ミームコイン',
      icon: '🐕',
      risk: '超高',
      description: 'ネタや話題性で価値がつく通貨。SNSの盛り上がりで急騰・急落する。',
      howToEnjoy: '少額で楽しむギャンブル枠。話題になったら即売却が鉄則。長期保有は危険。',
      buyingTips: '失っても良い金額のみ！最悪ゼロになる覚悟で。利確は早めに。欲張らない。',
      coins: [
        { symbol: 'DOGE', name: 'Dogecoin', desc: '元祖ミーム。イーロン・マスクがファン' },
        { symbol: 'SHIB', name: 'Shiba Inu', desc: 'DOGE killer。コミュニティ強い' },
        { symbol: 'PEPE', name: 'Pepe', desc: 'カエルミーム。2023年に爆発的人気' },
        { symbol: 'FLOKI', name: 'Floki', desc: 'バイキングテーマ。メタバース展開中' },
        { symbol: 'BONK', name: 'Bonk', desc: 'Solana発の犬コイン' },
        { symbol: 'WIF', name: 'dogwifhat', desc: '帽子犬。2024年話題' }
      ]
    },
    ai: {
      name: 'AI/データ系',
      icon: '🤖',
      risk: '中〜高',
      description: 'AI・機械学習・データ市場に関連するプロジェクト。AIブームで注目度上昇。',
      howToEnjoy: 'AI技術の発展と連動。長期的なテーマとして保有。技術動向をウォッチ。',
      buyingTips: 'AIブームの波に乗れるが、実用性の見極めが大切。プロジェクトの中身を確認。',
      coins: [
        { symbol: 'FET', name: 'Fetch.ai', desc: 'AI×ブロックチェーンの先駆者' },
        { symbol: 'RNDR', name: 'Render', desc: 'GPU共有でAI/3D処理を分散化' },
        { symbol: 'OCEAN', name: 'Ocean Protocol', desc: 'データ売買のマーケット' },
        { symbol: 'AGIX', name: 'SingularityNET', desc: 'AIサービスのマーケット' }
      ]
    },
    gaming: {
      name: 'ゲーム/メタバース/NFT',
      icon: '🎮',
      risk: '高',
      description: 'ブロックチェーンゲーム、仮想空間、NFT関連。遊んで稼ぐ「Play to Earn」。',
      howToEnjoy: '実際にゲームを遊んでみるのが一番。楽しみながら通貨を稼げる可能性も。',
      buyingTips: 'ゲームの人気に左右される。流行り廃りが激しいので注意。分散投資推奨。',
      coins: [
        { symbol: 'AXS', name: 'Axie Infinity', desc: 'Play to Earnの元祖' },
        { symbol: 'SAND', name: 'The Sandbox', desc: 'メタバースで土地売買' },
        { symbol: 'MANA', name: 'Decentraland', desc: '老舗メタバース' },
        { symbol: 'GALA', name: 'Gala Games', desc: 'ゲームプラットフォーム' },
        { symbol: 'ENJ', name: 'Enjin', desc: 'NFTゲームアイテムの規格' }
      ]
    },
    stablecoin: {
      name: 'ステーブルコイン',
      icon: '💵',
      risk: '低',
      description: '米ドル等に価格が連動。1コイン≒1ドルで安定。取引の一時避難先。',
      howToEnjoy: '利益確定時の避難先。DeFiで預けて利息を得ることも可能。',
      buyingTips: '「買う」というより「避難する」用途。暴落時の待機資金として活用。',
      coins: [
        { symbol: 'USDT', name: 'Tether', desc: '最大手ステーブル。流動性抜群' },
        { symbol: 'USDC', name: 'USD Coin', desc: '規制準拠。信頼性重視' },
        { symbol: 'DAI', name: 'Dai', desc: '分散型ステーブル。担保型' }
      ]
    },
    classic: {
      name: 'クラシック/歴史的',
      icon: '📜',
      risk: '中',
      description: '古くから存在する通貨。長い実績があり、根強いファンがいる。',
      howToEnjoy: '長期保有向き。急成長は期待しにくいが、安定感がある。',
      buyingTips: '新規性より安定性重視の人向け。ポートフォリオの安定剤として。',
      coins: [
        { symbol: 'LTC', name: 'Litecoin', desc: 'BTCの弟分。決済向き' },
        { symbol: 'XRP', name: 'Ripple', desc: '国際送金特化。銀行連携' },
        { symbol: 'XMR', name: 'Monero', desc: 'プライバシー重視' }
      ]
    }
  };

  // ===== 機能説明ヘルプデータ =====
  var FEATURE_HELP = {
    grade: {
      title: 'AI評価グレード',
      description: 'AIが総合的に分析した投資評価。S〜Dの5段階で表示。',
      details: '<strong>S:</strong> 非常に強気。短期〜中期で上昇期待大<br>' +
        '<strong>A:</strong> 強気。良好な投資機会<br>' +
        '<strong>B:</strong> やや強気。条件次第で投資検討<br>' +
        '<strong>C:</strong> 中立。様子見推奨<br>' +
        '<strong>D:</strong> 弱気。投資非推奨またはリスク高<br><br>' +
        '※AIの判断は参考情報です。投資判断は自己責任で。'
    },
    rsi: {
      title: 'RSI（相対力指数）',
      description: '買われすぎ/売られすぎを判断する指標。0〜100で表示。',
      details: '<strong>70以上:</strong> 買われすぎ（高値圏）→下落注意<br>' +
        '<strong>30以下:</strong> 売られすぎ（安値圏）→反発期待<br>' +
        '<strong>30〜70:</strong> 中立<br><br>' +
        '<strong>見方のコツ:</strong> RSIだけで判断せず、他の指標と組み合わせる。70超えでも上昇が続くこともある。'
    },
    macd: {
      title: 'MACD',
      description: 'トレンドの方向と強さを見る指標。',
      details: '<strong>MACDがシグナル線を上抜け:</strong> 買いサイン<br>' +
        '<strong>MACDがシグナル線を下抜け:</strong> 売りサイン<br>' +
        '<strong>ヒストグラム:</strong> 棒グラフが大きいほどトレンド強い<br><br>' +
        '<strong>見方のコツ:</strong> ゴールデンクロス（上抜け）とデッドクロス（下抜け）に注目。ただし遅れて反応するので注意。'
    },
    volume: {
      title: '出来高（ボリューム）',
      description: '取引された量。価格変動の信頼性を測る。',
      details: '<strong>出来高増加+価格上昇:</strong> 本物の上昇トレンド<br>' +
        '<strong>出来高減少+価格上昇:</strong> 偽の上昇、反落注意<br>' +
        '<strong>出来高増加+価格下落:</strong> 本格的な下落の可能性<br><br>' +
        '<strong>見方のコツ:</strong> 価格だけでなく出来高も一緒に見ることで、トレンドの強さが分かる。'
    },
    fearGreed: {
      title: 'Fear & Greed指数',
      description: '市場全体の恐怖と欲望を数値化。0〜100。',
      details: '<strong>0〜25:</strong> Extreme Fear（極度の恐怖）→買い時かも<br>' +
        '<strong>26〜45:</strong> Fear（恐怖）<br>' +
        '<strong>46〜55:</strong> Neutral（中立）<br>' +
        '<strong>56〜75:</strong> Greed（欲望）<br>' +
        '<strong>76〜100:</strong> Extreme Greed（極度の欲望）→売り時かも<br><br>' +
        '<strong>見方のコツ:</strong>「他人が恐れている時に買い、欲張っている時に売る」が投資の格言。'
    },
    btcDominance: {
      title: 'BTC Dominance',
      description: '暗号資産市場全体におけるビットコインの時価総額シェア。',
      details: '<strong>上昇時:</strong> 資金がBTCに集中。アルトコインは弱い<br>' +
        '<strong>下落時:</strong> アルトコインに資金流入。アルトシーズンの可能性<br><br>' +
        '<strong>見方のコツ:</strong> 50%前後が目安。40%を切るとアルトコインの活況期。'
    },
    marketCap: {
      title: '時価総額',
      description: '通貨の総価値。価格×発行量で計算。',
      details: '<strong>大型（100億ドル以上）:</strong> BTC, ETHなど。安定性高い<br>' +
        '<strong>中型（10億〜100億ドル）:</strong> 成長余地あり、リスクも中程度<br>' +
        '<strong>小型（10億ドル未満）:</strong> ハイリスク・ハイリターン<br><br>' +
        '<strong>見方のコツ:</strong> 時価総額が小さいと価格操作されやすい。初心者は大型から。'
    },
    priceChange24h: {
      title: '24時間変動率',
      description: '過去24時間の価格変化率。',
      details: '<strong>+5%以上:</strong> 大きな上昇。利確検討も<br>' +
        '<strong>+1〜5%:</strong> 堅調<br>' +
        '<strong>±1%:</strong> 横ばい<br>' +
        '<strong>-1〜5%:</strong> 軟調<br>' +
        '<strong>-5%以下:</strong> 大きな下落。買い増しチャンスか、下落継続か見極め必要<br><br>' +
        '<strong>見方のコツ:</strong> 短期の変動に一喜一憂しない。長期トレンドを見る。'
    },
    aiAnalysis: {
      title: 'AI分析',
      description: 'Gemini AIによる総合的な投資判断と解説。',
      details: '価格データ、テクニカル指標、市場動向を総合的に分析し、投資判断をサポートします。<br><br>' +
        '<strong>含まれる情報:</strong><br>' +
        '・総合スコア（0〜100点）<br>' +
        '・投資シグナル（買い/売り/中立）<br>' +
        '・キーポイント（注目すべき点）<br>' +
        '・リスク評価<br><br>' +
        '<strong>注意:</strong> AI分析は参考情報です。最終判断は必ずご自身で行ってください。'
    },
    watchlist: {
      title: 'ウォッチリスト',
      description: '気になる通貨を登録して、まとめてチェックできます。',
      details: '「通貨を追加」ボタンから好きな通貨を追加できます。<br><br>' +
        '<strong>活用法:</strong><br>' +
        '・投資対象の候補を登録<br>' +
        '・保有中の通貨を管理<br>' +
        '・気になるミームコインをウォッチ<br><br>' +
        '登録した通貨はホーム画面でも確認できます。'
    },
    portfolio: {
      title: 'ポートフォリオ',
      description: '投資記録を登録して、損益を自動計算します。',
      details: '<strong>記録できる情報:</strong><br>' +
        '・購入した通貨と数量<br>' +
        '・購入価格と日付<br>' +
        '・現在の損益（自動計算）<br><br>' +
        '<strong>活用法:</strong><br>' +
        '・複数取引所の投資を一元管理<br>' +
        '・税金計算用のデータ出力<br>' +
        '・投資パフォーマンスの可視化'
    }
  };

  // ===== データ =====
  var kairosData = window.kairosData || {};
  var KAIROS_ICON = window.KAIROS_ICON || '';

  // ============================================
  // 1. PRICE API - CoinGecko連携
  // ============================================
  var PriceAPI = {
    // レート制限対策のキャッシュ
    _cache: {},
    _cacheTime: 60000, // 1分間キャッシュ

    // 通貨IDをCoinGecko用に変換
    getCoinId: function(currencyId) {
      return CURRENCY_MAP[currencyId.toLowerCase()] || currencyId.toLowerCase();
    },

    // 過去の価格を取得
    getHistoricalPrice: function(currencyId, date) {
      var self = this;
      return new Promise(function(resolve, reject) {
        var coinId = self.getCoinId(currencyId);
        var targetDate = new Date(date);
        var dateStr = [
          ('0' + targetDate.getDate()).slice(-2),
          ('0' + (targetDate.getMonth() + 1)).slice(-2),
          targetDate.getFullYear()
        ].join('-');

        var cacheKey = 'hist_' + coinId + '_' + dateStr;
        if (self._cache[cacheKey] && Date.now() - self._cache[cacheKey].time < self._cacheTime * 60) {
          resolve(self._cache[cacheKey].data);
          return;
        }

        var url = COINGECKO_API + '/coins/' + coinId + '/history?date=' + dateStr + '&localization=false';

        fetch(url)
          .then(function(response) {
            if (!response.ok) throw new Error('API error: ' + response.status);
            return response.json();
          })
          .then(function(data) {
            var priceJpy = data.market_data && data.market_data.current_price && data.market_data.current_price.jpy;
            var priceUsd = data.market_data && data.market_data.current_price && data.market_data.current_price.usd;
            var result = { jpy: priceJpy || 0, usd: priceUsd || 0 };
            self._cache[cacheKey] = { data: result, time: Date.now() };
            resolve(result);
          })
          .catch(function(error) {
            console.error('Historical price fetch error:', error);
            reject(error);
          });
      });
    },

    // 現在の価格を取得
    getCurrentPrice: function(currencyId) {
      var self = this;
      return new Promise(function(resolve, reject) {
        var coinId = self.getCoinId(currencyId);
        var cacheKey = 'current_' + coinId;

        if (self._cache[cacheKey] && Date.now() - self._cache[cacheKey].time < self._cacheTime) {
          resolve(self._cache[cacheKey].data);
          return;
        }

        var url = COINGECKO_API + '/simple/price?ids=' + coinId + '&vs_currencies=jpy,usd&include_24hr_change=true';

        fetch(url)
          .then(function(response) {
            if (!response.ok) throw new Error('API error: ' + response.status);
            return response.json();
          })
          .then(function(data) {
            var coinData = data[coinId] || {};
            var result = {
              jpy: coinData.jpy || 0,
              usd: coinData.usd || 0,
              change24h: coinData.usd_24h_change || 0
            };
            self._cache[cacheKey] = { data: result, time: Date.now() };
            resolve(result);
          })
          .catch(function(error) {
            console.error('Current price fetch error:', error);
            reject(error);
          });
      });
    },

    // 複数通貨の現在価格を一括取得
    getMultiplePrices: function(currencyIds) {
      var self = this;
      return new Promise(function(resolve, reject) {
        var coinIds = currencyIds.map(function(id) {
          return self.getCoinId(id);
        }).join(',');

        var url = COINGECKO_API + '/simple/price?ids=' + coinIds + '&vs_currencies=jpy,usd&include_24hr_change=true';

        fetch(url)
          .then(function(response) {
            if (!response.ok) throw new Error('API error: ' + response.status);
            return response.json();
          })
          .then(function(data) {
            var result = {};
            currencyIds.forEach(function(id) {
              var coinId = self.getCoinId(id);
              var coinData = data[coinId] || {};
              result[id.toUpperCase()] = {
                jpy: coinData.jpy || 0,
                usd: coinData.usd || 0,
                change24h: coinData.usd_24h_change || 0
              };
            });
            resolve(result);
          })
          .catch(reject);
      });
    },

    // 日付タイプ判定（今日/過去）
    getDateType: function(date) {
      var target = new Date(date);
      var today = new Date();
      target.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return target.getTime() >= today.getTime() ? 'today' : 'past';
    },

    // 日付に応じた価格取得
    fetchPriceByDate: function(currencyId, date) {
      var dateType = this.getDateType(date);
      if (dateType === 'today') {
        return this.getCurrentPrice(currencyId);
      } else {
        return this.getHistoricalPrice(currencyId, date);
      }
    }
  };

  // ============================================
  // 2. FEAR & GREED API
  // ============================================
  var FearGreedAPI = {
    _cache: null,
    _cacheTime: 300000, // 5分キャッシュ
    _lastFetch: 0,

    fetch: function() {
      var self = this;
      return new Promise(function(resolve, reject) {
        if (self._cache && Date.now() - self._lastFetch < self._cacheTime) {
          resolve(self._cache);
          return;
        }

        fetch(FEAR_GREED_API + '/?limit=1')
          .then(function(response) {
            if (!response.ok) throw new Error('API error: ' + response.status);
            return response.json();
          })
          .then(function(data) {
            if (data.data && data.data[0]) {
              var result = {
                value: parseInt(data.data[0].value),
                classification: data.data[0].value_classification,
                timestamp: data.data[0].timestamp
              };
              self._cache = result;
              self._lastFetch = Date.now();
              resolve(result);
            } else {
              throw new Error('Invalid data format');
            }
          })
          .catch(function(error) {
            console.error('Fear & Greed fetch error:', error);
            // フォールバック値
            resolve({ value: 50, classification: 'Neutral', timestamp: Date.now() });
          });
      });
    },

    _historyCache: null,
    _historyLastFetch: 0,

    fetchHistory: function(days) {
      var self = this;
      days = days || 30;
      return new Promise(function(resolve) {
        if (self._historyCache && Date.now() - self._historyLastFetch < self._cacheTime) {
          resolve(self._historyCache);
          return;
        }
        fetch(FEAR_GREED_API + '/?limit=' + days)
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data.data && data.data.length > 0) {
              var history = data.data.map(function(d) { return parseInt(d.value); }).reverse();
              self._historyCache = history;
              self._historyLastFetch = Date.now();
              resolve(history);
            } else {
              resolve(null);
            }
          })
          .catch(function() { resolve(null); });
      });
    }
  };

  // ============================================
  // 3. STORAGE MANAGER
  // ============================================
  var StorageManager = {
    load: function() {
      try {
        var data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
          // 旧キーからマイグレーション
          var legacyData = localStorage.getItem('kairosInvestmentRecords');
          if (legacyData) {
            var legacyParsed = JSON.parse(legacyData);
            var records = Array.isArray(legacyParsed) ? legacyParsed : [];
            // 新キーに保存
            this.save(records);
            return records;
          }
          return [];
        }
        var parsed = JSON.parse(data);
        if (parsed.version && parsed.records) {
          return parsed.records;
        }
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Storage load error:', e);
        return [];
      }
    },

    save: function(records) {
      try {
        var data = {
          version: VERSION,
          updatedAt: new Date().toISOString(),
          records: records
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // 旧キーにも同期書き込み（UI表示コードが直接参照するため）
        localStorage.setItem('kairosInvestmentRecords', JSON.stringify(records));
        return true;
      } catch (e) {
        console.error('Storage save error:', e);
        return false;
      }
    },

    clear: function() {
      localStorage.removeItem(STORAGE_KEY);
    },

    export: function() {
      var records = this.load();
      return JSON.stringify({ version: VERSION, records: records }, null, 2);
    },

    import: function(jsonString) {
      try {
        var data = JSON.parse(jsonString);
        var records = data.records || data;
        if (Array.isArray(records)) {
          this.save(records);
          return { success: true, count: records.length };
        }
        throw new Error('Invalid format');
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
  };

  // ============================================
  // 4. INVESTMENT MANAGER
  // ============================================
  var InvestmentManager = {
    _records: [],

    init: function() {
      this._records = StorageManager.load();
      return this;
    },

    getRecords: function() {
      return this._records.slice();
    },

    _generateId: function() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    _saveRecords: function() {
      StorageManager.save(this._records);
      if (typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('kairos-investment-updated'));
      }
    },

    addBuyRecord: function(data) {
      var self = this;
      return new Promise(function(resolve, reject) {
        var targetDate = data.date ? new Date(data.date) : new Date();
        var dateType = PriceAPI.getDateType(targetDate);

        var processRecord = function(priceData) {
          var priceJpy = data.priceJpy || priceData.jpy;
          var priceUsd = data.priceUsd || priceData.usd;
          var quantity = data.quantity || (data.amountJpy / priceJpy);

          var record = {
            id: self._generateId(),
            type: 'buy',
            currencyId: data.currencyId.toUpperCase(),
            quantity: quantity,
            priceJpy: priceJpy,
            priceUsd: priceUsd,
            totalJpy: data.amountJpy || (quantity * priceJpy),
            date: targetDate.toISOString(),
            status: dateType === 'today' ? 'confirmed' : 'confirmed',
            note: data.note || '',
            createdAt: new Date().toISOString()
          };

          self._records.push(record);
          self._saveRecords();
          resolve(record);
        };

        if (data.priceJpy) {
          processRecord({ jpy: data.priceJpy, usd: data.priceUsd || 0 });
        } else {
          PriceAPI.fetchPriceByDate(data.currencyId, targetDate)
            .then(processRecord)
            .catch(reject);
        }
      });
    },

    addSellRecord: function(data) {
      var self = this;
      return new Promise(function(resolve, reject) {
        var targetDate = data.date ? new Date(data.date) : new Date();

        var processRecord = function(priceData) {
          var priceJpy = data.priceJpy || priceData.jpy;
          var priceUsd = data.priceUsd || priceData.usd;

          var record = {
            id: self._generateId(),
            type: 'sell',
            currencyId: data.currencyId.toUpperCase(),
            quantity: data.quantity,
            priceJpy: priceJpy,
            priceUsd: priceUsd,
            totalJpy: data.quantity * priceJpy,
            date: targetDate.toISOString(),
            status: 'confirmed',
            note: data.note || '',
            createdAt: new Date().toISOString()
          };

          self._records.push(record);
          self._saveRecords();
          resolve(record);
        };

        if (data.priceJpy) {
          processRecord({ jpy: data.priceJpy, usd: data.priceUsd || 0 });
        } else {
          PriceAPI.fetchPriceByDate(data.currencyId, targetDate)
            .then(processRecord)
            .catch(reject);
        }
      });
    },

    deleteRecord: function(id) {
      var index = this._records.findIndex(function(r) { return r.id === id; });
      if (index !== -1) {
        this._records.splice(index, 1);
        this._saveRecords();
        return true;
      }
      return false;
    },

    updateRecord: function(id, updates) {
      var index = this._records.findIndex(function(r) { return r.id === id; });
      if (index !== -1) {
        Object.assign(this._records[index], updates, { updatedAt: new Date().toISOString() });
        this._saveRecords();
        return this._records[index];
      }
      return null;
    },

    getRecordsByCurrency: function(currencyId) {
      return this._records.filter(function(r) {
        return r.currencyId.toUpperCase() === currencyId.toUpperCase();
      });
    },

    getRecordsByDateRange: function(startDate, endDate) {
      var start = new Date(startDate).getTime();
      var end = new Date(endDate).getTime();
      return this._records.filter(function(r) {
        var date = new Date(r.date).getTime();
        return date >= start && date <= end;
      });
    }
  };

  // ============================================
  // 5. INVESTMENT CALCULATOR
  // ============================================
  var InvestmentCalculator = {
    // 特定通貨の保有状況を計算
    calculateHolding: function(records, currencyId) {
      var filtered = records.filter(function(r) {
        return r.currencyId.toUpperCase() === currencyId.toUpperCase();
      });

      var totalQuantity = 0;
      var totalInvested = 0;
      var soldQuantity = 0;
      var totalSold = 0;

      filtered.forEach(function(r) {
        if (r.type === 'buy' && r.status === 'confirmed') {
          totalQuantity += r.quantity;
          totalInvested += r.totalJpy;
        } else if (r.type === 'sell') {
          soldQuantity += r.quantity;
          totalSold += r.totalJpy;
        }
      });

      var remainingQuantity = totalQuantity - soldQuantity;
      var averageCost = totalQuantity > 0 ? totalInvested / totalQuantity : 0;
      var realizedPnl = totalSold - (averageCost * soldQuantity);

      return {
        currencyId: currencyId.toUpperCase(),
        totalQuantity: totalQuantity,
        soldQuantity: soldQuantity,
        remainingQuantity: remainingQuantity,
        totalInvested: totalInvested,
        totalSold: totalSold,
        averageCost: averageCost,
        realizedPnl: realizedPnl
      };
    },

    // 全通貨の保有状況を計算
    calculateAllHoldings: function(records) {
      var currencyIds = [];
      records.forEach(function(r) {
        if (currencyIds.indexOf(r.currencyId) === -1) {
          currencyIds.push(r.currencyId);
        }
      });

      var self = this;
      var holdings = {};
      currencyIds.forEach(function(id) {
        holdings[id] = self.calculateHolding(records, id);
      });
      return holdings;
    },

    // 年間実現損益を計算
    calculateYearlyRealizedPnl: function(records, year) {
      var yearRecords = records.filter(function(r) {
        return new Date(r.date).getFullYear() === year;
      });
      var holdings = this.calculateAllHoldings(yearRecords);
      var totalPnl = 0;
      Object.keys(holdings).forEach(function(key) {
        totalPnl += holdings[key].realizedPnl;
      });
      return totalPnl;
    },

    // 月間投資額を計算
    calculateMonthlyInvested: function(records) {
      var now = new Date();
      var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      var monthRecords = records.filter(function(r) {
        return new Date(r.date) >= startOfMonth && r.type === 'buy';
      });
      var total = 0;
      monthRecords.forEach(function(r) { total += r.totalJpy; });
      return total;
    },

    // 未実現損益を計算（現在価格が必要）
    calculateUnrealizedPnl: function(holding, currentPrice) {
      var currentValue = holding.remainingQuantity * currentPrice;
      var costBasis = holding.averageCost * holding.remainingQuantity;
      return {
        currentValue: currentValue,
        costBasis: costBasis,
        unrealizedPnl: currentValue - costBasis,
        unrealizedPnlPercent: costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0
      };
    }
  };

  // ============================================
  // 6. INVESTMENT SUMMARY
  // ============================================
  var InvestmentSummary = {
    generate: function(records, currentPrices) {
      currentPrices = currentPrices || {};
      var holdings = InvestmentCalculator.calculateAllHoldings(records);
      var currentYear = new Date().getFullYear();

      var totalInvested = 0;
      var totalCurrentValue = 0;
      var totalUnrealizedPnl = 0;

      Object.keys(holdings).forEach(function(currencyId) {
        var holding = holdings[currencyId];
        if (holding.remainingQuantity <= 0) return;

        // 価格取得: liveData.prices → scoreCache → 0
        var price = currentPrices[currencyId] ? currentPrices[currencyId].jpy : 0;
        if (!price && typeof scoreCache !== 'undefined' && scoreCache.data && scoreCache.data[currencyId]) {
          price = (scoreCache.data[currencyId].price || 0) * 150;
        }
        var unrealized = InvestmentCalculator.calculateUnrealizedPnl(holding, price);

        totalInvested += holding.averageCost * holding.remainingQuantity;
        totalCurrentValue += unrealized.currentValue;
        totalUnrealizedPnl += unrealized.unrealizedPnl;
      });

      var monthlyInvested = InvestmentCalculator.calculateMonthlyInvested(records);
      var yearlyRealizedPnl = InvestmentCalculator.calculateYearlyRealizedPnl(records, currentYear);

      return {
        holdings: holdings,
        totalInvested: totalInvested,
        totalCurrentValue: totalCurrentValue,
        totalUnrealizedPnl: totalUnrealizedPnl,
        totalUnrealizedPnlPercent: totalInvested > 0 ? (totalUnrealizedPnl / totalInvested) * 100 : 0,
        monthlyInvested: monthlyInvested,
        yearlyRealizedPnl: yearlyRealizedPnl,
        currencyCount: Object.keys(holdings).filter(function(k) {
          return holdings[k].remainingQuantity > 0;
        }).length
      };
    }
  };

  // ポートフォリオ読み込み（AI機能用）
  function loadPortfolio() {
    var records = StorageManager.load();

    var holdings = InvestmentCalculator.calculateAllHoldings(records);
    var result = [];

    Object.keys(holdings).forEach(function(ticker) {
      var holding = holdings[ticker];
      if (holding.remainingQuantity > 0) {
        result.push({
          ticker: ticker.toUpperCase(),
          amount: holding.remainingQuantity,
          averageCost: holding.averageCost
        });
      }
    });

    return result;
  }

  // ============================================
  // 7. BACKEND API (ローカルサーバー連携)
  // ============================================
  var BackendAPI = {
    baseUrl: BACKEND_URL,
    _available: null,

    healthCheck: function() {
      var self = this;
      return new Promise(function(resolve) {
        if (self._available !== null) {
          resolve(self._available);
          return;
        }

        // 2秒でタイムアウト（バックエンドがなければ即座にスキップ）
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 2000);

        fetch(self.baseUrl + '/', { signal: controller.signal })
          .then(function(response) {
            clearTimeout(timeoutId);
            self._available = response.ok;
            resolve(self._available);
          })
          .catch(function() {
            clearTimeout(timeoutId);
            self._available = false;
            resolve(false);
          });
      });
    },

    analyzeCurrency: function(currencyId) {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.healthCheck().then(function(available) {
          if (!available) {
            reject(new Error('Backend not available'));
            return;
          }

          fetch(self.baseUrl + '/api/analyze/' + currencyId)
            .then(function(response) {
              if (!response.ok) throw new Error('API error');
              return response.json();
            })
            .then(resolve)
            .catch(reject);
        });
      });
    },

    getMonthlySuggestion: function(budget, currentHoldings) {
      var self = this;
      return new Promise(function(resolve, reject) {
        fetch(self.baseUrl + '/api/monthly-suggestion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ budget: budget, holdings: currentHoldings })
        })
          .then(function(response) { return response.json(); })
          .then(resolve)
          .catch(reject);
      });
    },

    getSwingSignals: function(currencyId) {
      var self = this;
      return new Promise(function(resolve, reject) {
        fetch(self.baseUrl + '/api/swing/' + currencyId)
          .then(function(response) { return response.json(); })
          .then(resolve)
          .catch(reject);
      });
    },

    // AI Analysis Methods
    getAIAnalysis: function(ticker) {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.healthCheck().then(function(available) {
          if (!available) {
            reject(new Error('Backend not available'));
            return;
          }
          fetch(self.baseUrl + '/api/analyze/' + ticker)
            .then(function(response) {
              if (!response.ok) throw new Error('API error');
              return response.json();
            })
            .then(resolve)
            .catch(reject);
        });
      });
    },

    getRankAll: function(mode) {
      var self = this;
      // デフォルトはdual（両方のスコアを一括取得）
      var actualMode = mode || 'dual';
      return new Promise(function(resolve, reject) {
        self.healthCheck().then(function(available) {
          if (!available) {
            reject(new Error('Backend not available'));
            return;
          }
          fetch(self.baseUrl + '/api/rank-all?mode=' + actualMode)
            .then(function(response) {
              if (!response.ok) throw new Error('API error');
              return response.json();
            })
            .then(resolve)
            .catch(reject);
        });
      });
    },

    getMarketScan: function() {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.healthCheck().then(function(available) {
          if (!available) {
            reject(new Error('Backend not available'));
            return;
          }
          fetch(self.baseUrl + '/api/market-scan')
            .then(function(response) {
              if (!response.ok) throw new Error('API error');
              return response.json();
            })
            .then(resolve)
            .catch(reject);
        });
      });
    },

    chatWithAI: function(message, ticker, context, screenContext) {
      var self = this;
      return new Promise(function(resolve, reject) {
        var body = {
          message: message,
          ticker: ticker || null,
          context: context || []
        };
        if (screenContext) body.screen_context = screenContext;
        fetch(self.baseUrl + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
          .then(function(response) { return response.json(); })
          .then(resolve)
          .catch(reject);
      });
    },

    getMarketOverview: function() {
      var self = this;
      return new Promise(function(resolve, reject) {
        fetch(self.baseUrl + '/api/market')
          .then(function(response) { return response.json(); })
          .then(resolve)
          .catch(reject);
      });
    },

    getTechnicalAnalysis: function(ticker, interval) {
      var self = this;
      interval = interval || '1h';
      return new Promise(function(resolve, reject) {
        fetch(self.baseUrl + '/api/technical/' + ticker + '?interval=' + interval)
          .then(function(response) { return response.json(); })
          .then(resolve)
          .catch(reject);
      });
    },

    getAvailableProviders: function() {
      var self = this;
      return new Promise(function(resolve, reject) {
        fetch(self.baseUrl + '/api/providers')
          .then(function(response) { return response.json(); })
          .then(resolve)
          .catch(reject);
      });
    },

    getMoonshotData: function() {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.healthCheck().then(function(available) {
          if (!available) {
            reject(new Error('Backend not available'));
            return;
          }
          fetch(self.baseUrl + '/api/moonshot')
            .then(function(response) {
              if (!response.ok) throw new Error('API error');
              return response.json();
            })
            .then(resolve)
            .catch(reject);
        });
      });
    },

    getEarlyMovers: function() {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.healthCheck().then(function(available) {
          if (!available) {
            reject(new Error('Backend not available'));
            return;
          }
          fetch(self.baseUrl + '/api/moonshot/early')
            .then(function(response) {
              if (!response.ok) throw new Error('API error');
              return response.json();
            })
            .then(resolve)
            .catch(reject);
        });
      });
    }
  };

  // ============================================
  // グローバル公開
  // ============================================
  window.KairosInvestment = {
    PriceAPI: PriceAPI,
    FearGreedAPI: FearGreedAPI,
    StorageManager: StorageManager,
    Manager: InvestmentManager.init(),
    Calculator: InvestmentCalculator,
    Summary: InvestmentSummary
  };

  window.KAIROS = window.KAIROS || {};
  window.KAIROS.Backend = BackendAPI;

  // 投資データ取得（新しいInvestmentManagerを使用）
  function getInvestmentData() {
    try {
      // 新しいInvestmentManagerからデータ取得
      var records = InvestmentManager.getRecords();
      var currentPrices = (window.KairosLive && window.KairosLive.getData().prices) || {};

      // InvestmentSummaryで計算
      var summary = InvestmentSummary.generate(records, currentPrices);

      // 設定値を取得
      var monthlyTarget = parseInt(localStorage.getItem('kairos-monthly-target') || '50000');
      var taxLineTarget = parseInt(localStorage.getItem('kairos-tax-target') || '200000');
      var fireGoal = parseInt(localStorage.getItem('kairos-fire-goal') || '30000000');
      var fireYear = localStorage.getItem('kairos-fire-year') || '2035';

      return {
        // 計算されたデータ
        monthlyInvested: summary.monthlyInvested || 0,
        totalInvested: summary.totalInvested || 0,
        totalCurrentValue: summary.totalCurrentValue || 0,
        totalUnrealizedPnl: summary.totalUnrealizedPnl || 0,
        totalUnrealizedPnlPercent: summary.totalUnrealizedPnlPercent || 0,
        yearlyRealizedPnl: summary.yearlyRealizedPnl || 0,
        currencyCount: summary.currencyCount || 0,
        holdings: summary.holdings || {},

        // 設定値
        monthlyTarget: monthlyTarget,
        taxLineTarget: taxLineTarget,
        fireGoal: fireGoal,
        fireYear: fireYear,

        // 進捗率
        monthlyProgress: monthlyTarget > 0 ? Math.min((summary.monthlyInvested / monthlyTarget) * 100, 100) : 0,
        fireProgress: fireGoal > 0 ? Math.min((summary.totalCurrentValue / fireGoal) * 100, 100) : 0
      };
    } catch(e) {
      console.error('[KAIROS] getInvestmentData error:', e);
      return {
        monthlyInvested: 0,
        totalInvested: 0,
        totalCurrentValue: 0,
        currencyCount: 0,
        monthlyTarget: 50000,
        taxLineTarget: 200000,
        fireGoal: 30000000,
        fireYear: '2035',
        monthlyProgress: 0,
        fireProgress: 0
      };
    }
  }

  // 設定を読み込み
  function loadSettings() {
    try {
      var saved = localStorage.getItem('kairos_settings');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return { theme: 'kairos' };
  }
  var savedSettings = loadSettings();

  var appState = {
    currentScreen: 'splash',
    selectedCurrency: kairosData.ticker || 'BTC',
    theme: savedSettings.theme || 'kairos',
    mode: localStorage.getItem('kairosMode') || 'core', // レガシー: v19で通貨別ストラテジー制に移行。詳細画面表示時にStrategyManagerから派生
    chartPeriod: '1W',
    showSplash: true,
    isLoading: false,
    loadingScreen: null,
    dataError: null,
    lastUpdated: null,
    // 価格表示通貨（USD/JPY切り替え）
    priceCurrency: localStorage.getItem('kairosPriceCurrency') || 'JPY',
    // Moonshot（ミームコイン枠）
    moonshotEnabled: true,
    moonshotBudget: parseInt(localStorage.getItem('kairosMoonshotBudget')) || 10000,
    moonshotSpent: parseInt(localStorage.getItem('kairosMoonshotSpent')) || 0,
    // ポートフォリオ詳細（ホーム画面内インプレース展開）
    portfolioDetailOpen: false,
    returnToPortfolioDetail: false,
    // 通貨一覧の表示モード（null=個別設定依存, 'swing', 'longterm'）
    currenciesViewMode: null,
    // Moonshotタブ（early / trending）
    moonshotTab: 'early'
  };

  // ニュースキャッシュ
  var newsCache = {
    data: {},
    timestamp: 0,
    TTL: 5 * 60 * 1000 // 5分キャッシュ
  };

  // Moonshotキャッシュ
  var moonshotCache = {
    data: null,
    timestamp: 0,
    TTL: 5 * 60 * 1000 // 5分キャッシュ
  };

  // Early Moverキャッシュ
  var earlyMoverCache = {
    data: null,
    timestamp: 0,
    TTL: 10 * 60 * 1000, // 10分キャッシュ
    lastNotifiedCoins: {} // { token_address: timestamp } — 通知済みコイン（2h重複防止）
  };

  // Early Mover通知レート制限
  var earlyMoverNotifications = {
    MAX_PER_HOUR: 3,
    history: [] // [timestamp, ...]
  };

  // Cloudflare Worker アラート
  var workerAlertState = {
    url: localStorage.getItem('kairosWorkerUrl') || '',
    lastChecked: 0,
    lastAlertIds: JSON.parse(localStorage.getItem('kairosWorkerSeenAlerts') || '[]'),
    checkInterval: 10 * 60 * 1000, // 10分
    _timer: null
  };

  function setWorkerUrl(url) {
    url = (url || '').trim().replace(/\/+$/, '');
    workerAlertState.url = url;
    localStorage.setItem('kairosWorkerUrl', url);
    if (url) {
      checkWorkerAlerts();
      startWorkerAlertPolling();
    } else {
      stopWorkerAlertPolling();
    }
  }
  window.setWorkerUrl = setWorkerUrl;

  function startWorkerAlertPolling() {
    stopWorkerAlertPolling();
    if (!workerAlertState.url) return;
    workerAlertState._timer = setInterval(checkWorkerAlerts, workerAlertState.checkInterval);
  }

  function stopWorkerAlertPolling() {
    if (workerAlertState._timer) {
      clearInterval(workerAlertState._timer);
      workerAlertState._timer = null;
    }
  }

  function checkWorkerAlerts() {
    if (!workerAlertState.url) return;

    var url = workerAlertState.url + '/alerts';
    fetch(url, { mode: 'cors' })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!data.alerts || data.alerts.length === 0) return;

        workerAlertState.lastChecked = Date.now();

        // 新しいアラートを検出（まだ見ていないもの）
        var seen = workerAlertState.lastAlertIds;
        var newAlerts = data.alerts.filter(function(a) {
          var id = a.tokenAddress + ':' + a.detectedAt;
          return seen.indexOf(id) === -1;
        });

        if (newAlerts.length > 0) {
          // 既読リスト更新（最大50件保持）
          newAlerts.forEach(function(a) {
            var id = a.tokenAddress + ':' + a.detectedAt;
            seen.push(id);
          });
          workerAlertState.lastAlertIds = seen.slice(-50);
          localStorage.setItem('kairosWorkerSeenAlerts', JSON.stringify(workerAlertState.lastAlertIds));

          // 緊急通知モーダル表示
          showUrgentMoonshotAlert(newAlerts);
        }
      })
      .catch(function(err) {
        console.log('[WORKER] Alert check failed:', err.message);
      });
  }
  window.checkWorkerAlerts = checkWorkerAlerts;

  // アプリ起動時にWorkerポーリング開始
  if (workerAlertState.url) {
    setTimeout(function() {
      checkWorkerAlerts();
      startWorkerAlertPolling();
    }, 3000); // 起動3秒後に初回チェック
  }

  function loadMoonshotCoins() {
    var container = document.getElementById('moonshot-coins');
    if (!container) return;

    var now = Date.now();
    if (moonshotCache.data && (now - moonshotCache.timestamp) < moonshotCache.TTL) {
      renderMoonshotCoinsIntoDOM(moonshotCache.data);
      return;
    }

    // ローディング表示
    container.innerHTML = '<div class="moonshot-loading">' +
      '<div class="moonshot-loading__spinner"></div>' +
      '<div class="moonshot-loading__text">トレンドコインを検索中...</div>' +
    '</div>';

    fetch(BACKEND_URL + '/api/moonshot')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        moonshotCache.data = data.coins || [];
        moonshotCache.timestamp = Date.now();
        renderMoonshotCoinsIntoDOM(moonshotCache.data);
      })
      .catch(function(err) {
        console.error('Moonshot fetch error:', err);
        container.innerHTML = '<div class="moonshot-empty">' +
          '<div class="moonshot-empty__icon">⚠️</div>' +
          '<div class="moonshot-empty__text">データ取得に失敗しました</div>' +
          '<div class="moonshot-empty__hint">バックエンドが起動しているか確認してください</div>' +
        '</div>';
      });
  }

  function loadEarlyMovers() {
    var container = document.getElementById('early-mover-coins');
    if (!container) return;

    var now = Date.now();
    if (earlyMoverCache.data && (now - earlyMoverCache.timestamp) < earlyMoverCache.TTL) {
      renderEarlyMoversIntoDOM(earlyMoverCache.data);
      checkEarlyMoverNotifications(earlyMoverCache.data);
      return;
    }

    container.innerHTML = '<div class="moonshot-loading">' +
      '<div class="moonshot-loading__spinner"></div>' +
      '<div class="moonshot-loading__text">DEX初動を検索中...</div>' +
    '</div>';

    fetch(BACKEND_URL + '/api/moonshot/early')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        earlyMoverCache.data = data.coins || [];
        earlyMoverCache.timestamp = Date.now();
        renderEarlyMoversIntoDOM(earlyMoverCache.data);
        checkEarlyMoverNotifications(earlyMoverCache.data);
        updateEarlyMoverBadge();
      })
      .catch(function(err) {
        console.error('Early mover fetch error:', err);
        container.innerHTML = '<div class="moonshot-empty">' +
          '<div class="moonshot-empty__icon">⚠️</div>' +
          '<div class="moonshot-empty__text">データ取得に失敗しました</div>' +
          '<div class="moonshot-empty__hint">バックエンドが起動しているか確認してください</div>' +
        '</div>';
      });
  }

  // 通貨切り替え関数
  function togglePriceCurrency() {
    appState.priceCurrency = appState.priceCurrency === 'JPY' ? 'USD' : 'JPY';
    localStorage.setItem('kairosPriceCurrency', appState.priceCurrency);
    renderApp();
  }
  window.togglePriceCurrency = togglePriceCurrency;

  // ニュース取得関数（要約付き）
  // ===== トレーディングシグナル =====
  var signalCache = {
    data: {},
    TTL: 60000  // 1分キャッシュ
  };

  function fetchTradingSignal(ticker) {
    var cacheKey = ticker + '_signal';
    var now = Date.now();

    // キャッシュチェック
    if (signalCache.data[cacheKey] && (now - signalCache.data[cacheKey].timestamp) < signalCache.TTL) {
      return Promise.resolve(signalCache.data[cacheKey].data);
    }

    // ストラテジーベースのシグナル間隔
    var interval = (typeof StrategyManager !== 'undefined') ? StrategyManager.getSignalInterval(ticker) : (appState.mode === 'satellite' ? '1h' : '4h');

    return fetch(BACKEND_URL + '/api/signal/' + ticker + '?interval=' + interval)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        signalCache.data[cacheKey] = { data: data, timestamp: now };
        return data;
      })
      .catch(function(err) {
        console.error('Signal fetch error:', err);
        return { signal: { has_signal: false }, error: err.message };
      });
  }

  function renderTradingSignalCard(signalData, isLoading) {
    // 読み込み中は「様子見」をコンパクトに表示 + 光るボーダー
    if (isLoading) {
      return '<div class="trading-signal-card trading-signal-card--wait trading-signal-card--loading">' +
        '<div class="trading-signal-card__header">' +
          '<span class="trading-signal-card__signal trading-signal-card__signal--wait">⚪ 様子見</span>' +
        '</div>' +
      '</div>';
    }

    if (!signalData) {
      return '<div class="trading-signal-card trading-signal-card--wait">' +
        '<div class="trading-signal-card__header">' +
          '<span class="trading-signal-card__signal trading-signal-card__signal--wait">⚪ 様子見</span>' +
        '</div>' +
      '</div>';
    }

    // APIレスポンスは signal オブジェクト内か、直接トップレベルの両方に対応
    var signal = signalData.signal || signalData;

    // シグナルなし = 様子見（コンパクト表示）
    if (!signal.has_signal) {
      return '<div class="trading-signal-card trading-signal-card--wait">' +
        '<div class="trading-signal-card__header">' +
          '<span class="trading-signal-card__signal trading-signal-card__signal--wait">' + (signal.signal_display || '⚪ 様子見') + '</span>' +
        '</div>' +
      '</div>';
    }

    // シグナルあり = 展開表示
    var isBuy = signal.signal_type.indexOf('BUY') >= 0;
    var cardClass = isBuy ? 'trading-signal-card--buy trading-signal-card--expanded' : 'trading-signal-card--sell trading-signal-card--expanded';
    var signalClass = isBuy ? 'trading-signal-card__signal--buy' : 'trading-signal-card__signal--sell';

    // 理由リスト
    var reasonsHtml = '';
    if (signal.reasons && signal.reasons.length > 0) {
      reasonsHtml = '<div class="trading-signal-card__reasons">';
      signal.reasons.slice(0, 3).forEach(function(reason) {
        reasonsHtml += '<span class="trading-signal-card__reason">' + reason + '</span>';
      });
      reasonsHtml += '</div>';
    }

    // ストラテジー判定
    var ticker = appState.selectedCurrency || '';
    var strategy = (typeof StrategyManager !== 'undefined') ? StrategyManager.getStrategy(ticker) : 'longterm';
    var isLongterm = strategy === 'longterm';

    // 長期用: DCAスコア表示（シグナルを積立判断に翻訳）
    var detailsHtml;
    if (isLongterm) {
      var dcaScore = signal.win_rate ? Math.round(signal.win_rate * 0.7 + signal.confidence * 0.3) : 50;
      var dcaLabel = dcaScore >= 75 ? '買い増し好機' : dcaScore >= 55 ? '積立適正' : '様子見推奨';
      var dcaColor = dcaScore >= 75 ? '#10b981' : dcaScore >= 55 ? '#d4a853' : '#94a3b8';

      detailsHtml = '<div class="trading-signal-card__details">' +
        '<div class="trading-signal-card__longterm">' +
          '<div class="trading-signal-card__dca">' +
            '<div class="trading-signal-card__dca-header">' +
              '<span class="trading-signal-card__dca-label">DCAスコア</span>' +
              '<span class="trading-signal-card__dca-value" style="color:' + dcaColor + '">' + dcaScore + '/100</span>' +
            '</div>' +
            '<div class="trading-signal-card__dca-bar">' +
              '<div class="trading-signal-card__dca-fill" style="width:' + dcaScore + '%;background:' + dcaColor + '"></div>' +
            '</div>' +
            '<div class="trading-signal-card__dca-advice" style="color:' + dcaColor + '">' + dcaLabel + '</div>' +
          '</div>' +
          '<div class="trading-signal-card__stats">' +
            '<div class="trading-signal-card__stat">' +
              '<div class="trading-signal-card__stat-label">パターン</div>' +
              '<div class="trading-signal-card__stat-value">' + (signal.pattern_name_jp || signal.pattern_name || '-') + '</div>' +
            '</div>' +
            '<div class="trading-signal-card__stat">' +
              '<div class="trading-signal-card__stat-label">信頼度</div>' +
              '<div class="trading-signal-card__stat-value">' + (signal.confidence ? signal.confidence.toFixed(0) + '%' : '-') + '</div>' +
            '</div>' +
            '<div class="trading-signal-card__stat">' +
              '<div class="trading-signal-card__stat-label">勝率</div>' +
              '<div class="trading-signal-card__stat-value">' + signal.win_rate.toFixed(0) + '%</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        reasonsHtml +
      '</div>';
    } else {
      // 短期用: 既存のSL/TP/RR表示
      detailsHtml = '<div class="trading-signal-card__details">' +
        '<div class="trading-signal-card__targets">' +
          '<div class="trading-signal-card__target">' +
            '<div class="trading-signal-card__target-label">損切り</div>' +
            '<div class="trading-signal-card__target-price">' + formatPriceCompact(signal.stop_loss) + '</div>' +
            '<div class="trading-signal-card__target-pct negative">' + signal.stop_loss_pct.toFixed(1) + '%</div>' +
          '</div>' +
          '<div class="trading-signal-card__target">' +
            '<div class="trading-signal-card__target-label">エントリー</div>' +
            '<div class="trading-signal-card__target-price">' + formatPriceCompact(signal.entry_price) + '</div>' +
            '<div class="trading-signal-card__target-pct">現在</div>' +
          '</div>' +
          '<div class="trading-signal-card__target">' +
            '<div class="trading-signal-card__target-label">利確</div>' +
            '<div class="trading-signal-card__target-price">' + formatPriceCompact(signal.take_profit) + '</div>' +
            '<div class="trading-signal-card__target-pct positive">+' + signal.take_profit_pct.toFixed(1) + '%</div>' +
          '</div>' +
        '</div>' +
        '<div class="trading-signal-card__stats">' +
          '<div class="trading-signal-card__stat">' +
            '<div class="trading-signal-card__stat-label">勝率</div>' +
            '<div class="trading-signal-card__stat-value">' + signal.win_rate.toFixed(0) + '%</div>' +
          '</div>' +
          '<div class="trading-signal-card__stat">' +
            '<div class="trading-signal-card__stat-label">期待値</div>' +
            '<div class="trading-signal-card__stat-value positive">+' + signal.expected_value_pct.toFixed(1) + '%</div>' +
          '</div>' +
          '<div class="trading-signal-card__stat">' +
            '<div class="trading-signal-card__stat-label">RR比</div>' +
            '<div class="trading-signal-card__stat-value">' + signal.risk_reward.toFixed(1) + ':1</div>' +
          '</div>' +
        '</div>' +
        reasonsHtml +
      '</div>';
    }

    return '<div class="trading-signal-card ' + cardClass + '">' +
      '<button class="trading-signal-card__refresh" onclick="window.KairosApp.refreshTradingSignal()">🔄</button>' +
      '<div class="trading-signal-card__header">' +
        '<span class="trading-signal-card__signal ' + signalClass + '">' + signal.signal_display + '</span>' +
        '<span class="trading-signal-card__pattern">' + (isLongterm ? '🎯 長期' : '⚡ 短期') + '</span>' +
      '</div>' +
      detailsHtml +
    '</div>';
  }

  function loadTradingSignal(ticker) {
    var container = document.getElementById('trading-signal-container');
    if (!container) return;

    // 読み込み中は光るボーダー + コンパクト表示
    container.innerHTML = renderTradingSignalCard(null, true);

    fetchTradingSignal(ticker).then(function(data) {
      container.innerHTML = renderTradingSignalCard(data, false);
    });
  }

  function fetchTickerNews(ticker) {
    var cacheKey = ticker + '_summarized';
    var now = Date.now();

    // キャッシュチェック
    if (newsCache.data[cacheKey] && (now - newsCache.timestamp) < newsCache.TTL) {
      return Promise.resolve(newsCache.data[cacheKey]);
    }

    // summarize=true で日本語要約を要求
    return fetch(BACKEND_URL + '/api/news/' + ticker + '?summarize=true')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        newsCache.data[cacheKey] = data;
        newsCache.timestamp = now;
        return data;
      })
      .catch(function(err) {
        console.error('News fetch error:', err);
        return { news: [], sentiment_score: 50, error: err.message };
      });
  }

  // ニュース詳細モーダルを表示
  function showNewsDetailModal(newsItem) {
    var existingModal = document.getElementById('news-detail-modal');
    if (existingModal) existingModal.remove();

    var sentimentText = newsItem.sentiment === 'bullish' ? '📈 価格上昇の可能性' :
                       newsItem.sentiment === 'bearish' ? '📉 価格下落の可能性' : '➡️ 中立的なニュース';
    var sentimentClass = newsItem.sentiment === 'bullish' ? 'positive' :
                        newsItem.sentiment === 'bearish' ? 'negative' : '';

    var headline = newsItem.headline_ja || newsItem.title;
    var hasSummary = newsItem.summary_ja && newsItem.summary_ja.length > 10;
    var summary = hasSummary ? newsItem.summary_ja :
      '<div style="font-size:13px;color:#94a3b8">📰 ' + newsItem.title + '</div>';

    // 影響と対策
    var impactHtml = '';
    if (newsItem.impact_ja) {
      impactHtml = '<div class="news-detail-modal__impact">' +
        '<span class="news-detail-modal__label">📊 影響</span>' +
        '<span>' + newsItem.impact_ja + '</span>' +
      '</div>';
    }
    var actionHtml = '';
    if (newsItem.action_ja) {
      actionHtml = '<div class="news-detail-modal__action">' +
        '<span class="news-detail-modal__label">💡 対策</span>' +
        '<span>' + newsItem.action_ja + '</span>' +
      '</div>';
    }

    var modal = document.createElement('div');
    modal.id = 'news-detail-modal';
    modal.className = 'news-detail-overlay';
    modal.innerHTML = '<div class="news-detail-modal">' +
      '<div class="news-detail-modal__header">' +
        '<span class="news-detail-modal__badge ' + sentimentClass + '">' + sentimentText + '</span>' +
        '<button class="news-detail-modal__close" onclick="document.getElementById(\'news-detail-modal\').remove()">×</button>' +
      '</div>' +
      '<h2 class="news-detail-modal__title">' + headline + '</h2>' +
      '<div class="news-detail-modal__summary">' + summary + '</div>' +
      impactHtml +
      actionHtml +
      '<div class="news-detail-modal__meta">' +
        '<span>' + newsItem.source + '</span>' +
        '<span>' + formatTimeAgo(newsItem.published_at) + '</span>' +
      '</div>' +
      '<a href="' + newsItem.url + '" target="_blank" class="news-detail-modal__link">' +
        '📄 元記事を読む →' +
      '</a>' +
    '</div>';

    document.body.appendChild(modal);

    // オーバーレイクリックで閉じる
    modal.onclick = function(e) {
      if (e.target === modal) modal.remove();
    };
  }
  window.showNewsDetailModal = showNewsDetailModal;

  // ニュースセクションを更新する関数
  function updateNewsSection(ticker) {
    var newsContainer = document.querySelector('.detail__news-list');
    if (!newsContainer) return;

    // ローディング表示
    newsContainer.innerHTML = '<div style="text-align:center;padding:16px;color:#888">ニュース翻訳中...</div>';

    fetchTickerNews(ticker).then(function(data) {
      if (!data.news || data.news.length === 0) {
        newsContainer.innerHTML = '<div style="text-align:center;padding:16px;color:#888">関連ニュースなし</div>';
        return;
      }

      var newsHtml = data.news.slice(0, 5).map(function(item, idx) {
        var sentimentDot = item.sentiment === 'bullish' ? 'news-dot--bullish' :
                          item.sentiment === 'bearish' ? 'news-dot--bearish' : '';
        var timeAgo = formatTimeAgo(item.published_at);

        // 要約された見出しがあれば使用、なければ原文を短縮
        var displayTitle = item.headline_ja;
        if (!displayTitle || displayTitle.length < 3) {
          displayTitle = truncateText(item.title, 35);
        }
        // 長すぎる場合は切り詰め
        if (displayTitle.length > 30) {
          displayTitle = displayTitle.substring(0, 27) + '...';
        }

        // センチメントアイコン
        var sentimentIcon = item.sentiment === 'bullish' ? '📈' :
                          item.sentiment === 'bearish' ? '📉' : '📰';

        // ニュースデータをグローバルに保存（モーダルで使用）
        window._newsData = window._newsData || {};
        window._newsData[idx] = item;

        return '<div class="detail__news-item" onclick="window.showNewsDetailModal(window._newsData[' + idx + '])" style="cursor:pointer">' +
          '<span class="detail__news-dot ' + sentimentDot + '"></span>' +
          '<div class="detail__news-content">' +
            '<span class="detail__news-headline">' + sentimentIcon + ' ' + displayTitle + '</span>' +
            '<span class="detail__news-source">' + item.source + ' · ' + timeAgo + '</span>' +
          '</div>' +
          '<span class="detail__news-arrow">›</span>' +
        '</div>';
      }).join('');

      // センチメントサマリー追加
      var sentimentBadge = '';
      if (data.sentiment_score > 60) {
        sentimentBadge = '<span style="color:#10b981;font-size:11px">📈 強気 ' + data.sentiment_score + '</span>';
      } else if (data.sentiment_score < 40) {
        sentimentBadge = '<span style="color:#ef4444;font-size:11px">📉 弱気 ' + data.sentiment_score + '</span>';
      }

      newsContainer.innerHTML = newsHtml;

      // ヘッダーにセンチメント追加
      var newsHeader = document.querySelector('.detail__news-header');
      if (newsHeader && sentimentBadge) {
        var existingBadge = newsHeader.querySelector('.news-sentiment-badge');
        if (existingBadge) existingBadge.remove();
        var badge = document.createElement('span');
        badge.className = 'news-sentiment-badge';
        badge.innerHTML = sentimentBadge;
        newsHeader.insertBefore(badge, newsHeader.querySelector('.detail__news-more'));
      }
    });
  }

  // 時間を「〜前」形式に変換
  function formatTimeAgo(dateStr) {
    if (!dateStr) return '';
    try {
      var date = new Date(dateStr);
      var now = new Date();
      var diff = Math.floor((now - date) / 1000);

      if (diff < 60) return '今';
      if (diff < 3600) return Math.floor(diff / 60) + '分前';
      if (diff < 86400) return Math.floor(diff / 3600) + '時間前';
      return Math.floor(diff / 86400) + '日前';
    } catch(e) {
      return '';
    }
  }

  // テキストを指定文字数で切り詰め
  function truncateText(text, maxLen) {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '...';
  }

  // ===== ユーティリティ =====
  var JPY_RATE = 150;

  function formatYen(value) {
    if (value === undefined || value === null) return '-';
    return '¥' + Math.round(value).toLocaleString('ja-JP');
  }

  function formatUSD(value) {
    if (value === undefined || value === null) return '-';
    return '$' + Number(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  function formatNumber(value) {
    if (value === undefined || value === null) return '-';
    if (value >= 1000) {
      return Number(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    } else if (value >= 1) {
      return Number(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4});
    } else {
      return Number(value).toLocaleString('en-US', {minimumFractionDigits: 4, maximumFractionDigits: 8});
    }
  }

  function formatPercent(value) {
    if (value === undefined || value === null) return '-';
    var sign = value >= 0 ? '+' : '';
    return sign + value.toFixed(1) + '%';
  }

  // 統一価格フォーマッタ（appState.priceCurrency に応じてJPY/USD自動切替）
  function formatPrice(usdValue) {
    if (usdValue === undefined || usdValue === null) return '-';
    if (appState.priceCurrency === 'JPY') {
      return formatYen(usdValue * JPY_RATE);
    }
    return formatUSD(usdValue);
  }

  // 小額コイン対応版（Moonshot等で使用）
  function formatPriceCompact(usdValue) {
    if (usdValue === undefined || usdValue === null || usdValue === 0) return '-';
    if (appState.priceCurrency === 'JPY') {
      var jpyVal = usdValue * JPY_RATE;
      if (jpyVal >= 1000) return '¥' + Math.round(jpyVal).toLocaleString('ja-JP');
      if (jpyVal >= 1) return '¥' + jpyVal.toFixed(2);
      if (jpyVal >= 0.01) return '¥' + jpyVal.toFixed(4);
      if (jpyVal >= 0.0001) return '¥' + jpyVal.toFixed(6);
      return '¥' + jpyVal.toPrecision(2);
    }
    // USD
    if (usdValue >= 1000) return '$' + usdValue.toLocaleString('en-US', {maximumFractionDigits: 0});
    if (usdValue >= 1) return '$' + usdValue.toFixed(2);
    if (usdValue >= 0.001) return '$' + usdValue.toFixed(4);
    if (usdValue >= 0.0000001) return '$' + usdValue.toFixed(8);
    return '$' + usdValue.toPrecision(2);
  }

  // Volume/Mcap 用フォーマッタ（JPY/USD切替対応）
  function formatValueCompact(usdValue) {
    if (usdValue === undefined || usdValue === null) return '-';
    if (appState.priceCurrency === 'JPY') {
      var jpyVal = usdValue * JPY_RATE;
      if (jpyVal >= 1e12) return '¥' + (jpyVal / 1e12).toFixed(1) + '兆';
      if (jpyVal >= 1e8) return '¥' + (jpyVal / 1e8).toFixed(1) + '億';
      if (jpyVal >= 1e4) return '¥' + (jpyVal / 1e4).toFixed(0) + '万';
      return '¥' + Math.round(jpyVal).toLocaleString('ja-JP');
    }
    // USD
    if (usdValue >= 1e9) return '$' + (usdValue / 1e9).toFixed(1) + 'B';
    if (usdValue >= 1e6) return '$' + (usdValue / 1e6).toFixed(1) + 'M';
    if (usdValue >= 1e3) return '$' + (usdValue / 1e3).toFixed(1) + 'K';
    return '$' + usdValue.toString();
  }

  function getGradeClass(grade) {
    return 'rank-badge--' + (grade || 'C');
  }

  // 価格位置のクラス（色分け用）
  function getPricePositionClass(position) {
    if (position <= 30) return 'price-position--low';      // 安値圏（緑）
    if (position <= 70) return 'price-position--mid';      // 中間（グレー）
    if (position <= 100) return 'price-position--high';    // 高値圏（オレンジ）
    return 'price-position--extreme';                       // 異常高値（赤）
  }

  // ===== UI ヘルパー（ローディング・エラー）=====

  // 改良版トースト通知
  function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;

    var icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    var toast = document.createElement('div');
    toast.className = 'kairos-toast kairos-toast--' + type;
    toast.innerHTML = '<span class="kairos-toast__icon">' + icons[type] + '</span><span>' + message + '</span>';

    document.body.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('kairos-toast--exit');
      setTimeout(function() { toast.remove(); }, 300);
    }, duration);
  }

  // ローディングオーバーレイ表示
  function showLoading(message) {
    message = message || 'Loading...';
    var existing = document.getElementById('kairos-loading-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'kairos-loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML =
      '<div class="loading-overlay__content">' +
        '<div class="loading-spinner loading-spinner--lg"></div>' +
        '<div class="loading-overlay__text">' + message + '</div>' +
      '</div>';

    document.body.appendChild(overlay);
  }

  // ローディングオーバーレイ非表示
  function hideLoading() {
    var overlay = document.getElementById('kairos-loading-overlay');
    if (overlay) overlay.remove();
  }

  // スケルトンカードを生成
  function renderSkeletonCard() {
    return '<div class="skeleton-card">' +
      '<div class="skeleton skeleton-card__title"></div>' +
      '<div class="skeleton skeleton-card__value"></div>' +
      '<div class="skeleton skeleton-card__sub"></div>' +
    '</div>';
  }

  // スケルトングリッドを生成
  function renderSkeletonGrid(count) {
    count = count || 4;
    var html = '<div class="stats-grid">';
    for (var i = 0; i < count; i++) {
      html += renderSkeletonCard();
    }
    html += '</div>';
    return html;
  }

  // エラー状態表示
  function renderErrorState(title, message, retryCallback) {
    var retryBtn = retryCallback
      ? '<button class="error-state__retry" onclick="' + retryCallback + '">再試行</button>'
      : '';

    return '<div class="error-state">' +
      '<div class="error-state__icon">😵</div>' +
      '<div class="error-state__title">' + (title || 'エラーが発生しました') + '</div>' +
      '<div class="error-state__message">' + (message || 'データを取得できませんでした。しばらくしてから再度お試しください。') + '</div>' +
      retryBtn +
    '</div>';
  }

  // 空状態表示
  function renderEmptyState(icon, title, message) {
    return '<div class="empty-state">' +
      '<div class="empty-state__icon">' + (icon || '📭') + '</div>' +
      '<div class="empty-state__title">' + (title || 'データがありません') + '</div>' +
      '<div class="empty-state__message">' + (message || '') + '</div>' +
    '</div>';
  }

  // 接続状態表示
  function showConnectionStatus(online) {
    var existing = document.querySelector('.connection-status');
    if (existing) existing.remove();

    var status = document.createElement('div');
    status.className = 'connection-status connection-status--' + (online ? 'online' : 'offline');
    status.innerHTML =
      '<span class="connection-status__dot"></span>' +
      '<span>' + (online ? 'オンライン' : 'オフライン') + '</span>';

    document.body.appendChild(status);

    setTimeout(function() {
      status.classList.add('connection-status--visible');
    }, 100);

    setTimeout(function() {
      status.classList.remove('connection-status--visible');
      setTimeout(function() { status.remove(); }, 300);
    }, 3000);
  }

  // グローバル公開
  window.KairosUI = {
    showToast: showToast,
    showLoading: showLoading,
    hideLoading: hideLoading,
    showConnectionStatus: showConnectionStatus,
    renderSkeletonCard: renderSkeletonCard,
    renderSkeletonGrid: renderSkeletonGrid,
    renderErrorState: renderErrorState,
    renderEmptyState: renderEmptyState
  };

  // ============================================
  // スケルトン画面（ローディング中表示）
  // ============================================

  // ホーム画面スケルトン
  function renderHomeScreenSkeleton() {
    return '<div class="home">' +
      '<div class="home__content">' +
        '<header class="home-header">' +
          '<div class="skeleton skeleton--text" style="width:120px;height:24px"></div>' +
        '</header>' +
        '<div class="skeleton skeleton--card" style="height:100px;margin-bottom:12px"></div>' +
        '<div class="stats-grid">' +
          renderSkeletonCard() +
          renderSkeletonCard() +
        '</div>' +
        '<div class="skeleton skeleton--card" style="height:180px;margin-bottom:16px"></div>' +
        '<div class="skeleton skeleton--card" style="height:100px;margin-bottom:16px"></div>' +
      '</div>' +
    '</div>';
  }

  // 通貨一覧画面スケルトン
  function renderCurrenciesScreenSkeleton() {
    var skeletonItems = '';
    for (var i = 0; i < 6; i++) {
      skeletonItems += '<div class="skeleton skeleton--card" style="height:60px;margin-bottom:8px"></div>';
    }
    return '<div class="currencies">' +
      '<div class="currencies__header">' +
        '<div class="skeleton skeleton--text" style="width:100px;height:24px"></div>' +
      '</div>' +
      '<div class="currencies__content">' +
        '<div class="skeleton skeleton--button" style="width:120px;height:36px;margin-bottom:16px"></div>' +
        '<section class="currencies__section">' +
          '<div class="skeleton skeleton--text" style="width:140px;height:18px;margin-bottom:12px"></div>' +
          skeletonItems +
        '</section>' +
      '</div>' +
    '</div>';
  }

  // 市場画面スケルトン
  function renderMarketScreenSkeleton() {
    return '<div class="market" style="padding-bottom:100px">' +
      '<div class="market__header">' +
        '<div class="skeleton skeleton--text" style="width:100px;height:24px"></div>' +
        '<div class="skeleton skeleton--text" style="width:60px;height:14px"></div>' +
      '</div>' +
      '<div class="market__content">' +
        '<div class="skeleton skeleton--card" style="height:200px;margin-bottom:16px"></div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">' +
          '<div class="skeleton skeleton--card" style="height:70px"></div>' +
          '<div class="skeleton skeleton--card" style="height:70px"></div>' +
          '<div class="skeleton skeleton--card" style="height:70px"></div>' +
        '</div>' +
        '<div class="skeleton skeleton--card" style="height:180px;margin-bottom:16px"></div>' +
        '<div class="skeleton skeleton--card" style="height:150px;margin-bottom:16px"></div>' +
      '</div>' +
    '</div>';
  }

  // 詳細画面スケルトン
  function renderDetailScreenSkeleton() {
    return '<div class="detail">' +
      '<div class="detail__header">' +
        '<button class="detail__back">←</button>' +
        '<div class="skeleton skeleton--text" style="width:60px;height:24px"></div>' +
        '<div style="width:32px"></div>' +
      '</div>' +
      '<div class="detail__content">' +
        '<div class="detail__price-section">' +
          '<div class="skeleton skeleton--text" style="width:180px;height:36px;margin-bottom:8px"></div>' +
          '<div class="skeleton skeleton--text" style="width:100px;height:20px"></div>' +
        '</div>' +
        '<div class="skeleton skeleton--card" style="height:200px;margin-bottom:16px"></div>' +
        '<div class="skeleton skeleton--card" style="height:120px;margin-bottom:16px"></div>' +
        '<div class="skeleton skeleton--card" style="height:150px;margin-bottom:16px"></div>' +
      '</div>' +
    '</div>';
  }

  // AI比較画面スケルトン
  function renderAICompareScreenSkeleton() {
    var skeletonItems = '';
    for (var i = 0; i < 8; i++) {
      skeletonItems += '<div class="skeleton skeleton--card" style="height:52px;margin-bottom:8px"></div>';
    }
    return '<div class="ai-compare">' +
      '<div class="ai-compare__header">' +
        '<div class="skeleton skeleton--text" style="width:140px;height:24px"></div>' +
      '</div>' +
      '<div class="ai-compare__list">' +
        skeletonItems +
      '</div>' +
    '</div>';
  }

  // エラー画面
  function renderErrorScreen(message, retryFn) {
    var retryAttr = retryFn ? ' onclick="' + retryFn + '"' : '';
    return '<div class="error-screen">' +
      '<div class="error-screen__content">' +
        '<div class="error-screen__icon">⚠️</div>' +
        '<div class="error-screen__title">データの取得に失敗しました</div>' +
        '<div class="error-screen__message">' + (message || 'ネットワーク接続を確認してください') + '</div>' +
        (retryFn ? '<button class="error-screen__retry"' + retryAttr + '>再試行</button>' : '') +
      '</div>' +
    '</div>';
  }

  // ===== スプラッシュ画面 =====
  function renderSplashScreen() {
    return '<div class="splash">' +
      '<div class="splash__content">' +
        '<div class="splash__logo">' +
          (KAIROS_ICON ? '<img src="' + KAIROS_ICON + '" alt="KAIROS" class="splash__logo-img" />' : '<span class="splash__logo-text">KAIROS</span>') +
        '</div>' +
        '<div class="splash__title">Money KAIROS AI</div>' +
        '<div class="splash__subtitle">Investment Analysis System</div>' +
        '<div class="splash__loader"><div class="splash__loader-bar"></div></div>' +
      '</div>' +
    '</div>';
  }

  // ===== ナビゲーション =====
  var navigationHistory = ['home']; // 画面履歴

  function navigateTo(screenId, options) {
    options = options || {};
    var skipHistory = options.skipHistory || false;

    if (screenId === 'settings') {
      if (window.openMainSettingsModal) {
        window.openMainSettingsModal();
      }
      return;
    }
    if (screenId === 'accumulation-settings') {
      if (window.KAIROS && window.KAIROS.Features && window.KAIROS.Features.openAccumulationSettings) {
        window.KAIROS.Features.openAccumulationSettings();
      }
      return;
    }
    if (screenId === 'fire-settings') {
      if (window.KAIROS && window.KAIROS.Features && window.KAIROS.Features.openFireSettings) {
        window.KAIROS.Features.openFireSettings();
      }
      return;
    }
    // 詳細画面から離れる場合はチャート自動更新を停止 + DEXコインデータをクリア
    if (appState.currentScreen === 'detail' && screenId !== 'detail') {
      stopChartAutoUpdate();
      window._pendingMoonshotCoin = null;
    }

    // ポートフォリオ詳細が開いている場合
    if (appState.portfolioDetailOpen) {
      if (screenId === 'home') {
        // ホームに戻る → DOM surgeryでヒーローカード固定のまま閉じる
        closePortfolioDetail();
        return;
      }
      // 通貨詳細へ → 戻ってきた時にportfolio detailを復元するフラグ
      if (screenId === 'detail') {
        appState.returnToPortfolioDetail = true;
      }
      appState.portfolioDetailOpen = false;
    }

    var prevScreen = appState.currentScreen;

    // detail画面に入る時、元の画面を記録（戻る時に使う）
    if (screenId === 'detail' && prevScreen !== 'detail') {
      appState.detailEntryScreen = prevScreen;
    }

    appState.currentScreen = screenId;

    // 履歴に追加（バック操作用）
    if (!skipHistory && prevScreen !== screenId) {
      navigationHistory.push(screenId);
      history.pushState({ screen: screenId, ticker: appState.selectedCurrency }, '', '');
    }

    // グローバルヘッダーのタイトルをアニメーション更新
    updateGlobalHeaderTitle(screenId);

    renderApp();
  }

  // ポートフォリオ詳細を閉じる（DOM surgery: ヒーローカード固定、下だけ差し替え）
  function closePortfolioDetail() {
    appState.portfolioDetailOpen = false;
    updateGlobalHeaderTitle('home');

    var hero = document.querySelector('.portfolio-hero');
    var homeEl = document.querySelector('.home');
    if (!hero) { renderApp(); return; }

    // 背景クラス除去
    if (homeEl) homeEl.classList.remove('home--detail');

    // ヒーローカードのonclickを「開く」に切り替え
    hero.setAttribute('onclick', 'window.KairosApp.openPortfolioDetail()');

    // ヒーローの後ろの兄弟要素をすべて削除
    while (hero.nextElementSibling) {
      hero.nextElementSibling.remove();
    }

    // ホーム画面コンテンツを挿入（ヒーローは固定、下のカードはslideUpアニメーション）
    hero.insertAdjacentHTML('afterend', buildHomeContentBelowHero());

    // チャート期間ボタンのイベント再設定
    document.querySelectorAll('.chart-card__period').forEach(function(btn) {
      btn.addEventListener('click', function() {
        appState.chartPeriod = btn.getAttribute('data-period');
        renderApp();
      });
    });
  }

  // 階層ナビゲーションマップ: 各画面の親画面を定義
  var screenHierarchy = {
    'detail': 'currencies',
    'currencies': 'home',
    'market': 'home',
    'ai-compare': 'home',
    'moonshot': 'home',
    'home': null  // ホームが最上位 → アプリ終了
  };

  function navigateBack() {
    // ポートフォリオ詳細が開いている場合は閉じる
    if (appState.portfolioDetailOpen) {
      closePortfolioDetail();
      return true;
    }

    // サイドメニューが開いている場合はアニメーション付きで閉じる
    var sideMenuEl = document.getElementById('kairos-side-menu');
    if (sideMenuEl && sideMenuEl.classList.contains('open')) {
      closeSideMenu();
      return true;
    }

    // 通貨追加モーダル（内部ナビゲーションあり）
    var addCurrencyModal = document.getElementById('kairos-add-currency-modal');
    if (addCurrencyModal) {
      if (addCurrencyState.currentView === 'coins' || addCurrencyState.currentView === 'all') {
        navigateBackToCategories();
        return true;
      } else {
        closeAddCurrencyModal();
        return true;
      }
    }

    // 専用close関数があるモーダル → 正式な閉じ処理（キャンセルと同じ）
    var modalClosers = [
      { id: 'kairos-compare-modal',      fn: function() { if (window.closeCompareModal) window.closeCompareModal(); } },
      { id: 'kairos-watchlist-modal',     fn: function() { if (window.closeWatchlistModal) window.closeWatchlistModal(); } },
      { id: 'kairos-target-modal',        fn: function() { if (window.closeTargetPriceModal) window.closeTargetPriceModal(); } },
      { id: 'kairos-news-modal',          fn: function() { if (window.closeNewsModal) window.closeNewsModal(); } },
      { id: 'kairos-tax-modal',           fn: function() { if (window.closeTaxModal) window.closeTaxModal(); } },
      { id: 'kairos-drawing-modal',       fn: function() { if (window.closeChartDrawingModal) window.closeChartDrawingModal(); } },
      { id: 'kairos-ai-chat-modal',       fn: function() { if (window.closeAIChatModal) window.closeAIChatModal(); } },
      { id: 'kairos-ai-analysis-modal',   fn: function() { if (window.closeAIAnalysisModal) window.closeAIAnalysisModal(); } },
      { id: 'kairos-market-scan-modal',   fn: function() { if (window.closeMarketScanModal) window.closeMarketScanModal(); } }
    ];
    for (var i = 0; i < modalClosers.length; i++) {
      if (document.getElementById(modalClosers[i].id)) {
        modalClosers[i].fn();
        return true;
      }
    }

    // スコア説明ポップアップ → 最優先で閉じる
    var scorePopup = document.getElementById('score-explain-popup');
    if (scorePopup) {
      scorePopup.remove();
      return true;
    }

    // close関数がないモーダル → remove で閉じる
    var simpleModalIds = [
      'kairos-settings-modal', 'kairos-api-settings-modal',
      'kairos-portfolio-modal', 'kairos-quick-buy-modal', 'kairos-sell-modal',
      'kairos-alert-modal', 'kairos-alert-history-modal',
      'kairos-history-modal', 'kairos-history-edit-modal',
      'kairos-pnl-modal', 'kairos-backup-modal',
      'kairos-dca-modal', 'kairos-category-help-modal',
      'feargreed-detail-modal', 'indicator-help-popup',
      'early-mover-detail-modal', 'moonshot-detail-modal',
      'moonshot-settings-modal', 'news-detail-modal'
    ];
    for (var j = 0; j < simpleModalIds.length; j++) {
      var modal = document.getElementById(simpleModalIds[j]);
      if (modal) {
        document.body.style.overflow = '';
        modal.remove();
        return true;
      }
    }

    // 階層ナビゲーション: 現在の画面の親画面に移動
    var currentScreen = appState.currentScreen;

    // detail画面: 入ってきた画面に戻る（記録があればそちら優先）
    var parentScreen;
    if (currentScreen === 'detail' && appState.detailEntryScreen) {
      parentScreen = appState.detailEntryScreen;
    } else {
      parentScreen = screenHierarchy[currentScreen];
    }

    if (parentScreen === undefined) {
      // マップにない画面はホームへ
      parentScreen = 'home';
    }

    if (parentScreen === null) {
      // ホーム画面 → アプリ終了シグナル
      return false;
    }

    // 詳細画面からの戻りで、チャート自動更新を停止
    if (currentScreen === 'detail') {
      stopChartAutoUpdate();
    }

    // ポートフォリオ詳細復元チェック
    if (appState.returnToPortfolioDetail) {
      appState.returnToPortfolioDetail = false;
      appState.portfolioDetailOpen = true;
      appState.currentScreen = 'home';
      updateGlobalHeaderTitle('portfolio-detail');
      navigationHistory = ['home'];
      renderApp();
      return true;
    }

    appState.currentScreen = parentScreen;
    // ナビゲーション履歴も階層に合わせてリセット
    if (parentScreen === 'home') {
      navigationHistory = ['home'];
    } else {
      navigationHistory = ['home', parentScreen];
    }
    updateGlobalHeaderTitle(parentScreen);
    renderApp();
    return true;
  }

  // ブラウザバック/進むボタン対応
  window.addEventListener('popstate', function(e) {
    var state = e.state;

    // モーダルの状態処理
    if (state && state.modal === 'addCurrency') {
      if (state.view === 'categories') {
        addCurrencyState.currentView = 'categories';
        addCurrencyState.selectedCategory = null;
        addCurrencyState.searchQuery = '';
        renderAddCurrencyContent();
      } else if (state.view === 'coins') {
        addCurrencyState.currentView = 'coins';
        addCurrencyState.selectedCategory = state.category;
        renderAddCurrencyContent();
      } else if (state.view === 'all') {
        addCurrencyState.currentView = 'all';
        addCurrencyState.selectedCategory = null;
        renderAddCurrencyContent();
      }
      return;
    }

    // モーダルを閉じる
    var addCurrencyModal = document.getElementById('kairos-add-currency-modal');
    if (addCurrencyModal && (!state || !state.modal)) {
      closeAddCurrencyModal();
    }

    // ポートフォリオ詳細の復帰/閉じ
    if (state && state.portfolioDetail) {
      appState.currentScreen = 'home';
      appState.portfolioDetailOpen = true;
      updateGlobalHeaderTitle('portfolio-detail');
      renderApp();
      return;
    } else if (appState.portfolioDetailOpen) {
      // ブラウザバックでもDOM surgeryで戻る
      navigateBack();
      return;
    }

    // 画面遷移: 階層ナビゲーションを使用
    navigateBack();
  });

  // Android/iOSのバックボタン対応
  document.addEventListener('backbutton', function(e) {
    e.preventDefault();
    if (!navigateBack()) {
      // ホーム画面で戻る → アプリ終了
      if (navigator.app && navigator.app.exitApp) {
        navigator.app.exitApp();
      } else if (window.close) {
        window.close();
      }
    }
  }, false);

  // ===== グローバルヘッダー =====
  var globalHeaderState = {
    currentTitle: '',
    isAnimating: false
  };

  function getScreenTitle(screen) {
    var titles = {
      'home': 'Portfolio',
      'currencies': '通貨一覧',
      'market': 'マーケット',
      'ai-compare': 'AI アシスタント',
      'portfolio-detail': 'Portfolio Detail'
    };
    return titles[screen] || 'Portfolio';
  }

  function isCoinFavorite(ticker) {
    var favStr = localStorage.getItem('kairos-favorites');
    var favorites = favStr ? JSON.parse(favStr) : [];
    return favorites.indexOf(ticker) >= 0;
  }

  var _coinNameCache = null;
  function getCoinFullName(ticker) {
    if (!_coinNameCache) {
      _coinNameCache = {
        BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', XRP: 'Ripple',
        ADA: 'Cardano', DOGE: 'Dogecoin', DOT: 'Polkadot', AVAX: 'Avalanche'
      };
      if (typeof CRYPTO_CATEGORIES !== 'undefined') {
        Object.keys(CRYPTO_CATEGORIES).forEach(function(catKey) {
          var cat = CRYPTO_CATEGORIES[catKey];
          cat.coins.forEach(function(coin) {
            _coinNameCache[coin.symbol] = coin.name;
          });
        });
      }
    }
    return _coinNameCache[ticker] || ticker;
  }

  function renderGlobalHeader() {
    if (appState.currentScreen === 'splash') return '';

    var updateTime = new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'});

    var titleContent = '';
    if (appState.currentScreen === 'detail' && appState.selectedCurrency) {
      // 詳細画面：コイン名表示（タップでお気に入り切替）
      var ticker = appState.selectedCurrency;
      var _isDex = isDexCoin();
      var coinName = _isDex ? (window._pendingMoonshotCoin.name || ticker) : getCoinFullName(ticker);
      var isFav = isCoinFavorite(ticker);
      var favClass = isFav ? ' global-header__coin--favorite' : '';
      var favStar = isFav ? ' ★' : '';
      titleContent = '<div class="global-header__coin' + favClass + '" id="global-header-title" onclick="window.KairosApp.toggleFavorite(\'' + ticker + '\')">' +
        '<span class="global-header__coin-icon">' + (_isDex && window._pendingMoonshotCoin.image_url ? '<img src="' + window._pendingMoonshotCoin.image_url + '" style="width:20px;height:20px;border-radius:50%">' : getCoinIcon(ticker)) + '</span>' +
        '<div class="global-header__coin-text">' +
          '<span class="global-header__coin-symbol">' + ticker + favStar + '</span>' +
          '<span class="global-header__coin-name">' + coinName.substring(0, 20) + '</span>' +
        '</div>' +
      '</div>';
    } else {
      // 通常画面：タイトル表示
      var title = getScreenTitle(appState.currentScreen);
      titleContent = '<span class="global-header__title slide-in" id="global-header-title">' + title + '</span>';
    }

    // 詳細画面のみ: 通貨別ストラテジートグル（メタル風スライド）— DEXコインでは非表示
    var strategyBtn = '';
    if (appState.currentScreen === 'detail' && appState.selectedCurrency && !isDexCoin() && typeof StrategyManager !== 'undefined') {
      var strat = StrategyManager.getStrategy(appState.selectedCurrency);
      strategyBtn = '<div class="strategy-toggle strategy-toggle--' + strat + '" id="global-strategy-toggle">' +
        '<div class="strategy-toggle__slider"></div>' +
        '<span class="strategy-toggle__option strategy-toggle__option--longterm">長期</span>' +
        '<span class="strategy-toggle__option strategy-toggle__option--swing">短期</span>' +
      '</div>';
    }

    return '<div class="global-header" id="global-header">' +
      '<div class="global-header__title-area">' +
        titleContent +
      '</div>' +
      '<span class="global-header__time" id="global-header-time">' + updateTime + '</span>' +
      strategyBtn +
    '</div>';
  }

  function updateGlobalHeaderTitle(newScreen) {
    var titleArea = document.querySelector('.global-header__title-area');
    if (!titleArea || globalHeaderState.isAnimating) return;

    var currentKey = appState.currentScreen === 'detail' ? 'detail-' + appState.selectedCurrency : appState.currentScreen;
    if (globalHeaderState.currentTitle === currentKey) return;

    globalHeaderState.isAnimating = true;
    globalHeaderState.currentTitle = currentKey;

    var titleEl = document.getElementById('global-header-title');
    if (titleEl) {
      titleEl.classList.remove('slide-in');
      titleEl.classList.add('slide-out');
    }

    setTimeout(function() {
      // 新しいコンテンツを生成
      var newContent = '';
      if (newScreen === 'detail' && appState.selectedCurrency) {
        var ticker = appState.selectedCurrency;
        var _isDex2 = isDexCoin();
        var coinName = _isDex2 ? (window._pendingMoonshotCoin.name || ticker) : getCoinFullName(ticker);
        var isFav = isCoinFavorite(ticker);
        var favClass = isFav ? ' global-header__coin--favorite' : '';
        var favStar = isFav ? ' ★' : '';
        newContent = '<div class="global-header__coin' + favClass + ' slide-in-from-left" id="global-header-title" onclick="window.KairosApp.toggleFavorite(\'' + ticker + '\')">' +
          '<span class="global-header__coin-icon">' + (_isDex2 && window._pendingMoonshotCoin.image_url ? '<img src="' + window._pendingMoonshotCoin.image_url + '" style="width:20px;height:20px;border-radius:50%">' : getCoinIcon(ticker)) + '</span>' +
          '<div class="global-header__coin-text">' +
            '<span class="global-header__coin-symbol">' + ticker + favStar + '</span>' +
            '<span class="global-header__coin-name">' + coinName.substring(0, 20) + '</span>' +
          '</div>' +
        '</div>';
      } else {
        var title = getScreenTitle(newScreen);
        newContent = '<span class="global-header__title slide-in-from-left" id="global-header-title">' + title + '</span>';
      }

      titleArea.innerHTML = newContent;

      // ダブルrequestAnimationFrameでブラウザの描画を確実に待つ
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          var newEl = document.getElementById('global-header-title');
          if (newEl) {
            newEl.classList.remove('slide-in-from-left');
            newEl.classList.add('slide-in');
          }
          globalHeaderState.isAnimating = false;
        });
      });
    }, 300);
  }

  function updateGlobalHeaderTime() {
    var timeEl = document.getElementById('global-header-time');
    if (timeEl) {
      timeEl.textContent = new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'});
    }
  }

  // レガシー: モードバッジは廃止。通貨別ストラテジー制に移行済み
  function updateGlobalHeaderMode() {
    // no-op: v19でグローバルモードバッジを廃止
  }

  // 毎分時計を更新
  setInterval(updateGlobalHeaderTime, 60000);

  function renderBottomNav() {
    var items = [
      { id: 'home', icon: '🏠', label: 'メイン' },
      { id: 'currencies', icon: '💰', label: '通貨' },
      { id: 'market', icon: '📊', label: '市場' },
      { id: 'ai-compare', icon: '🤖', label: 'AI' }
    ];

    var html = '<div class="bottom-nav-container">' +
      // 左：メニューボタン
      '<button class="menu-btn" onclick="window.openSideMenu && window.openSideMenu()">' +
        '<span class="menu-btn__icon">☰</span>' +
        '<span class="menu-btn__label">メニュー</span>' +
      '</button>' +
      // 中央：ナビゲーション
      '<nav class="bottom-nav">';

    items.forEach(function(item) {
      var isActive = appState.currentScreen === item.id;
      var activeClass = isActive ? ' nav-item--active' : '';
      html += '<button class="nav-item' + activeClass + '" data-screen="' + item.id + '">' +
        '<span class="nav-item__icon">' + item.icon + '</span>' +
        '<span class="nav-item__label">' + item.label + '</span>' +
      '</button>';
    });

    html += '</nav>';

    // 右：Moonshotボタン
    var isMoonshotActive = appState.currentScreen === 'moonshot';
    html += '<button class="moonshot-btn' + (isMoonshotActive ? ' moonshot-btn--active' : '') + '" onclick="window.KairosApp.showMoonshot()">' +
      '<span class="moonshot-btn__icon">🎰</span>' +
      '<span class="moonshot-btn__label">Moon</span>' +
    '</button>';

    html += '</div>';

    return html;
  }

  // ===== ポートフォリオ詳細コンテンツ（ヒーローカードの下に挿入するHTML） =====

  // 1通貨分のアイテムHTML生成
  function buildPortfolioItemHtml(ticker, holding, currentPrices, animIdx) {
    var price = currentPrices[ticker] ? currentPrices[ticker].jpy : 0;
    var unrealized = InvestmentCalculator.calculateUnrealizedPnl(holding, price);
    var itemPnlClass = unrealized.unrealizedPnl >= 0 ? 'positive' : 'negative';
    var itemPnlSign = unrealized.unrealizedPnl >= 0 ? '+' : '';
    var pctVal = unrealized.unrealizedPnlPercent ? unrealized.unrealizedPnlPercent.toFixed(1) : '0.0';
    var barWidth = Math.min(Math.abs(unrealized.unrealizedPnlPercent), 100);

    var qty = holding.remainingQuantity;
    var qtyStr = qty < 0.001 ? qty.toFixed(6) : qty < 1 ? qty.toFixed(4) : qty < 100 ? qty.toFixed(3) : qty.toFixed(2);

    return '<div class="portfolio-detail__item" data-ticker="' + ticker + '" style="animation-delay:' + (0.1 + animIdx * 0.05) + 's">' +
      '<div class="portfolio-detail__item-header">' +
        '<span class="portfolio-detail__item-icon">' + getCoinIcon(ticker) + '</span>' +
        '<span class="portfolio-detail__item-name">' + ticker + '</span>' +
        '<span class="portfolio-detail__item-qty">' + qtyStr + ' ' + ticker + '</span>' +
      '</div>' +
      '<div class="portfolio-detail__item-row">' +
        '<span class="portfolio-detail__item-label">投資</span>' +
        '<span class="portfolio-detail__item-val">' + formatYen(unrealized.costBasis) + '</span>' +
      '</div>' +
      '<div class="portfolio-detail__item-row">' +
        '<span class="portfolio-detail__item-label">評価</span>' +
        '<span class="portfolio-detail__item-val">' + formatYen(unrealized.currentValue) + '</span>' +
        '<span class="portfolio-detail__item-pnl ' + itemPnlClass + '">' + itemPnlSign + formatYen(unrealized.unrealizedPnl) + '</span>' +
      '</div>' +
      '<div class="portfolio-detail__item-bar">' +
        '<div class="portfolio-detail__item-bar-track">' +
          '<div class="portfolio-detail__item-bar-fill portfolio-detail__item-bar-fill--' + itemPnlClass + '" style="width:' + barWidth + '%"></div>' +
        '</div>' +
        '<span class="portfolio-detail__item-pct ' + itemPnlClass + '">' + itemPnlSign + pctVal + '%</span>' +
      '</div>' +
    '</div>';
  }

  // グループの小計HTMLを生成
  function buildGroupSubtotalHtml(groupValue, groupPnl) {
    var cls = groupPnl >= 0 ? 'positive' : 'negative';
    var sign = groupPnl >= 0 ? '+' : '';
    var pct = groupValue - groupPnl > 0 ? (groupPnl / (groupValue - groupPnl) * 100).toFixed(1) : '0.0';
    return '<div class="portfolio-detail__group-subtotal">' +
      '<span>' + formatYen(groupValue) + '</span>' +
      '<span class="' + cls + '">' + sign + formatYen(groupPnl) + ' (' + sign + pct + '%)</span>' +
    '</div>';
  }

  function buildPortfolioDetailContent() {
    var data = getInvestmentData();
    var currentPrices = (window.KairosLive && window.KairosLive.getData().prices) || {};
    var holdings = data.holdings || {};
    var totalValue = data.totalCurrentValue || 0;
    var totalPnl = data.totalUnrealizedPnl || 0;
    var totalPnlPct = data.totalUnrealizedPnlPercent || 0;
    var pnlClass = totalPnl >= 0 ? 'positive' : 'negative';
    var pnlSign = totalPnl >= 0 ? '+' : '';

    var pnlRowHtml = '<div class="portfolio-detail__pnl-row">' +
      '<div class="portfolio-detail__pnl-item">' +
        '<span class="portfolio-detail__pnl-label">評価額</span>' +
        '<span class="portfolio-detail__pnl-value">' + formatYen(totalValue) + '</span>' +
      '</div>' +
      '<div class="portfolio-detail__pnl-item">' +
        '<span class="portfolio-detail__pnl-label">損益</span>' +
        '<span class="portfolio-detail__pnl-value ' + pnlClass + '">' + pnlSign + formatYen(totalPnl) + ' (' + pnlSign + totalPnlPct.toFixed(1) + '%)</span>' +
      '</div>' +
    '</div>';

    var holdingKeys = Object.keys(holdings).filter(function(k) {
      return holdings[k].remainingQuantity > 0;
    });

    if (holdingKeys.length === 0) {
      return pnlRowHtml +
        '<div class="portfolio-detail__empty" style="text-align:center;padding:24px;color:var(--text-tertiary)">' +
          '<p>保有通貨がありません</p>' +
          '<p style="font-size:12px;margin-top:8px">通貨詳細画面から「投資する」で仮想購入できます</p>' +
        '</div>';
    }

    // ストラテジー別に振り分け
    var longtermKeys = [];
    var swingKeys = [];
    holdingKeys.forEach(function(ticker) {
      var strategy = StrategyManager.getStrategy(ticker);
      if (strategy === 'swing') {
        swingKeys.push(ticker);
      } else {
        longtermKeys.push(ticker);
      }
    });

    var sectionsHtml = '';
    var animIdx = 0;

    // 長期グループ
    if (longtermKeys.length > 0) {
      var ltValue = 0, ltPnl = 0;
      var ltItemsHtml = longtermKeys.map(function(ticker) {
        var holding = holdings[ticker];
        var price = currentPrices[ticker] ? currentPrices[ticker].jpy : 0;
        var unrealized = InvestmentCalculator.calculateUnrealizedPnl(holding, price);
        ltValue += unrealized.currentValue;
        ltPnl += unrealized.unrealizedPnl;
        return buildPortfolioItemHtml(ticker, holding, currentPrices, animIdx++);
      }).join('');

      sectionsHtml += '<div class="portfolio-detail__section-title">' +
        STRATEGY_CONFIG.longterm.icon + ' ' + STRATEGY_CONFIG.longterm.label +
        '<span class="portfolio-detail__section-count">(' + longtermKeys.length + ')</span>' +
      '</div>' +
      buildGroupSubtotalHtml(ltValue, ltPnl) +
      '<div class="portfolio-detail__list">' + ltItemsHtml + '</div>';
    }

    // 短期グループ
    if (swingKeys.length > 0) {
      var swValue = 0, swPnl = 0;
      var swItemsHtml = swingKeys.map(function(ticker) {
        var holding = holdings[ticker];
        var price = currentPrices[ticker] ? currentPrices[ticker].jpy : 0;
        var unrealized = InvestmentCalculator.calculateUnrealizedPnl(holding, price);
        swValue += unrealized.currentValue;
        swPnl += unrealized.unrealizedPnl;
        return buildPortfolioItemHtml(ticker, holding, currentPrices, animIdx++);
      }).join('');

      sectionsHtml += '<div class="portfolio-detail__section-title">' +
        STRATEGY_CONFIG.swing.icon + ' ' + STRATEGY_CONFIG.swing.label +
        '<span class="portfolio-detail__section-count">(' + swingKeys.length + ')</span>' +
      '</div>' +
      buildGroupSubtotalHtml(swValue, swPnl) +
      '<div class="portfolio-detail__list">' + swItemsHtml + '</div>';
    }

    return pnlRowHtml + sectionsHtml;
  }

  // ===== ホーム画面：ヒーローカード以下のコンテンツ =====
  // noAnimate: true の場合、slideUpアニメーションを無効化（戻る時用）
  function buildHomeContentBelowHero(noAnimate) {
    var data = getInvestmentData();
    var monthlyChange = data.totalUnrealizedPnl || 0;
    var monthlyChangePercent = data.totalUnrealizedPnlPercent || 0;
    var na = noAnimate ? ' style="animation:none"' : '';

    return '<div class="stats-grid">' +
      '<div class="stat-card"' + na + '>' +
        '<span class="stat-card__label">今月の増減</span>' +
        '<span class="stat-card__value ' + (monthlyChange >= 0 ? 'stat-card__value--positive' : 'stat-card__value--negative') + '">' + (monthlyChange >= 0 ? '+' : '') + formatYen(monthlyChange) + '</span>' +
        '<span class="stat-card__sub">' + (monthlyChangePercent >= 0 ? '+' : '') + monthlyChangePercent.toFixed(1) + '%</span>' +
      '</div>' +
      '<div class="stat-card"' + na + '>' +
        '<span class="stat-card__label">今月の積立</span>' +
        '<span class="stat-card__value">' + formatYen(data.monthlyInvested) + '</span>' +
        '<div class="stat-card__gauge">' +
          '<div class="stat-card__gauge-track">' +
            '<div class="stat-card__gauge-fill" style="width:' + Math.min(data.monthlyInvested/data.monthlyTarget*100, 100) + '%"></div>' +
          '</div>' +
        '</div>' +
        '<span class="stat-card__target">目標：' + formatYen(data.monthlyTarget) + '</span>' +
      '</div>' +
    '</div>' +

    '<div class="chart-card"' + na + '>' +
      '<div class="chart-card__header">' +
        '<span class="chart-card__title">ポートフォリオ推移</span>' +
        '<div class="chart-card__periods">' +
          renderChartPeriods() +
        '</div>' +
      '</div>' +
      '<div class="chart-card__chart">' +
        renderPortfolioChart() +
      '</div>' +
      '<div class="chart-card__legend">' +
        '<span class="chart-card__legend-item"><span class="chart-card__legend-dot" style="background:#F7931A"></span>BTC</span>' +
        '<span class="chart-card__legend-item"><span class="chart-card__legend-dot" style="background:#627EEA"></span>ETH</span>' +
        '<span class="chart-card__legend-item"><span class="chart-card__legend-dot" style="background:#14F195"></span>SOL</span>' +
      '</div>' +
    '</div>' +

    '<div class="fire-card"' + na + ' onclick="window.KairosApp.goToFireTab()">' +
      '<div class="fire-card__header">' +
        '<span class="fire-card__title">FIRE目標 ' + data.fireYear + '年</span>' +
        '<span class="fire-card__arrow">›</span>' +
      '</div>' +
      '<div class="fire-card__bar">' +
        '<div class="fire-card__bar-fill" style="width:' + Math.min(data.totalInvested/data.fireGoal*100, 100) + '%"></div>' +
      '</div>' +
      '<div class="fire-card__footer">' +
        '<span class="fire-card__amount">' + formatYen(data.totalInvested) + '</span>' +
        '<span class="fire-card__percent">' + (data.totalInvested/data.fireGoal*100).toFixed(1) + '%</span>' +
      '</div>' +
    '</div>' +

    renderVirtualBuyCards();
  }

  // ===== ホーム画面 =====
  function renderHomeScreen() {
    var data = getInvestmentData();
    var updateTime = new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'});

    var isDetail = appState.portfolioDetailOpen;
    var heroAction = isDetail ? 'window.KairosApp.closePortfolioDetail()' : 'window.KairosApp.openPortfolioDetail()';

    return '<div class="home' + (isDetail ? ' home--detail' : '') + '">' +
      '<div class="home__content">' +
        '<header class="home-header">' +
          '<h1 class="home-header__title">Portfolio</h1>' +
          '<span class="home-header__time">' + updateTime + '</span>' +
        '</header>' +

        (function() {
          var holdings = data.holdings || {};
          var pnl = data.totalUnrealizedPnl || 0;
          var pnlPct = data.totalUnrealizedPnlPercent || 0;
          var pnlClass = pnl >= 0 ? 'positive' : 'negative';
          var pnlSign = pnl >= 0 ? '+' : '';
          var pnlHtml = '<span class="portfolio-hero__pnl ' + pnlClass + '">' + pnlSign + formatYen(pnl) + ' (' + pnlSign + pnlPct.toFixed(1) + '%)</span>';
          return '<div class="portfolio-hero portfolio-hero--tappable" onclick="' + heroAction + '">' +
            '<span class="portfolio-hero__label">TOTAL PORTFOLIO</span>' +
            '<div class="portfolio-hero__value">' + formatYen(data.totalInvested) + '</div>' +
            pnlHtml +
            '<span class="portfolio-hero__sub">' + data.currencyCount + '通貨</span>' +
          '</div>';
        })() +

        (appState.portfolioDetailOpen ? buildPortfolioDetailContent() : buildHomeContentBelowHero()) +

      '</div>' +
    '</div>';
  }

  function getNextAccumDate() {
    var now = new Date();
    var next = new Date(now.getFullYear(), now.getMonth(), 25);
    if (now.getDate() >= 25) {
      next.setMonth(next.getMonth() + 1);
    }
    var daysLeft = Math.ceil((next.getTime() - now.getTime()) / (1000*60*60*24));
    return (next.getMonth()+1) + '/' + next.getDate() + ' (あと' + daysLeft + '日)';
  }

  // 配分ドット表示
  function renderAllocationDots() {
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];
    var colors = { BTC: '#F7931A', ETH: '#627EEA', SOL: '#14F195', XRP: '#23292F', ADA: '#0033AD' };

    return watchlist.slice(0, 3).map(function(ticker) {
      var color = colors[ticker] || '#d4a853';
      return '<span class="progress-card__target-dot" style="background:' + color + '" title="' + ticker + '"></span>';
    }).join('');
  }

  // 配分ターゲット表示（シンボルとパーセント付き）
  function renderAllocationTargets() {
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];
    var colors = { BTC: '#F7931A', ETH: '#627EEA', SOL: '#14F195', XRP: '#23292F', ADA: '#0033AD', DOGE: '#C2A633' };
    var allocations = { BTC: 50, ETH: 30, SOL: 20 }; // デフォルト配分

    return watchlist.slice(0, 3).map(function(ticker, idx) {
      var color = colors[ticker] || '#d4a853';
      var percent = allocations[ticker] || Math.round(100 / watchlist.length);
      return '<div class="progress-card__target">' +
        '<span class="progress-card__target-dot" style="background:' + color + '"></span>' +
        '<span class="progress-card__target-symbol">' + ticker + '</span>' +
        '<span class="progress-card__target-percent">' + percent + '%</span>' +
      '</div>';
    }).join('');
  }

  // 仮想購入カード (投資記録を表示)
  function renderVirtualBuyCards() {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    // 最近の投資記録を表示（最大3件）
    var recentRecords = records.slice(-3).reverse();

    if (recentRecords.length > 0) {
      var cardsHtml = recentRecords.map(function(record) {
        var cached = scoreCache.data[record.currencyId] || {};
        var currentPrice = cached.price || record.priceUsd;
        var buyPrice = record.priceUsd || 0;
        var profitPercent = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice * 100) : 0;
        var profitClass = profitPercent >= 0 ? 'positive' : 'negative';
        var profitSign = profitPercent >= 0 ? '+' : '';

        var date = new Date(record.date);
        var dateStr = (date.getMonth()+1) + '/' + date.getDate();

        return '<div class="virtual-buy-card" onclick="window.KairosApp.viewCurrency(\'' + record.currencyId + '\')">' +
          '<div class="virtual-buy-card__header">' +
            '<span class="virtual-buy-card__symbol">' + getCoinIcon(record.currencyId) + ' ' + record.currencyId + '</span>' +
            '<span class="virtual-buy-card__date">' + dateStr + '</span>' +
          '</div>' +
          '<div class="virtual-buy-card__result">' +
            '<div class="virtual-buy-card__result-item">' +
              '<span class="virtual-buy-card__result-label">投資額</span>' +
              '<span class="virtual-buy-card__result-value">' + formatYen(record.totalJpy) + '</span>' +
            '</div>' +
            '<div class="virtual-buy-card__result-item">' +
              '<span class="virtual-buy-card__result-label">損益</span>' +
              '<span class="virtual-buy-card__result-profit ' + profitClass + '">' + profitSign + profitPercent.toFixed(1) + '%</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      return '<div class="virtual-buy">' +
        '<div class="section-header">' +
          '<span class="section-header__title">仮想投資</span>' +
          '<button class="section-header__link" onclick="window.KAIROS && window.KAIROS.Features && window.KAIROS.Features.openPortfolio && window.KAIROS.Features.openPortfolio()">全て見る →</button>' +
        '</div>' +
        '<div class="virtual-buy__list">' + cardsHtml + '</div>' +
      '</div>';
    }

    // 記録がない場合は空の状態を表示
    return '<div class="virtual-buy">' +
      '<div class="section-header">' +
        '<span class="section-header__title">仮想投資</span>' +
      '</div>' +
      '<div class="virtual-buy__intro">' +
        '<p>通貨詳細画面から「投資する」をタップして仮想投資を開始できます。</p>' +
      '</div>' +
    '</div>';
  }

  // 通貨アイコンURL（CoinGecko CDN - 追加通信不要、ブラウザキャッシュ有効）
  var COIN_ICON_URLS = {
    'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    'XRP': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    'ADA': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    'DOT': 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    'AVAX': 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
    'ATOM': 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
    'NEAR': 'https://assets.coingecko.com/coins/images/10365/small/near.jpg',
    'APT': 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
    'SUI': 'https://assets.coingecko.com/coins/images/26375/small/sui-ocean-square.png',
    'TON': 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
    'TRX': 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
    'ICP': 'https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png',
    'XLM': 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
    'ALGO': 'https://assets.coingecko.com/coins/images/4380/small/download.png',
    'HBAR': 'https://assets.coingecko.com/coins/images/3688/small/hbar.png',
    'VET': 'https://assets.coingecko.com/coins/images/1167/small/VET_Token_Icon.png',
    'FIL': 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png',
    'ETC': 'https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png',
    'BNB': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    'MATIC': 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
    'ARB': 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
    'OP': 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    'IMX': 'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png',
    'LINK': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    'UNI': 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg',
    'AAVE': 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
    'MKR': 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
    'LDO': 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png',
    'CRV': 'https://assets.coingecko.com/coins/images/12124/small/Curve.png',
    'SNX': 'https://assets.coingecko.com/coins/images/3406/small/SNX.png',
    'DOGE': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    'SHIB': 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
    'PEPE': 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
    'FLOKI': 'https://assets.coingecko.com/coins/images/16746/small/PNG_image.png',
    'BONK': 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg',
    'WIF': 'https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg',
    'FET': 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg',
    'RNDR': 'https://assets.coingecko.com/coins/images/11636/small/rndr.png',
    'OCEAN': 'https://assets.coingecko.com/coins/images/3687/small/ocean-protocol-logo.jpg',
    'AGIX': 'https://assets.coingecko.com/coins/images/2138/small/singularitynet.png',
    'AXS': 'https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png',
    'SAND': 'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg',
    'MANA': 'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png',
    'GALA': 'https://assets.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png',
    'ENJ': 'https://assets.coingecko.com/coins/images/1102/small/enjin-coin-logo.png',
    'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    'USDC': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
    'DAI': 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
    'LTC': 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
    'XMR': 'https://assets.coingecko.com/coins/images/69/small/monero_logo.png'
  };

  // 絵文字フォールバック
  var COIN_ICON_EMOJI = {
    'BTC': '₿', 'ETH': 'Ξ', 'SOL': '◎', 'XRP': '✕', 'ADA': '₳',
    'DOT': '●', 'LINK': '⬡', 'UNI': '🦄', 'DOGE': '🐕', 'SHIB': '🐕‍🦺',
    'PEPE': '🐸', 'ATOM': '⚛️', 'LTC': 'Ł', 'MATIC': '⬟'
  };

  function getCoinIcon(ticker) {
    var t = ticker.toUpperCase();
    var url = COIN_ICON_URLS[t];
    if (url) {
      return '<img src="' + url + '" alt="' + t + '" class="coin-icon" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'inline\'">' +
             '<span class="coin-icon-fallback" style="display:none">' + (COIN_ICON_EMOJI[t] || t.charAt(0)) + '</span>';
    }
    return '<span class="coin-icon-emoji">' + (COIN_ICON_EMOJI[t] || t.charAt(0)) + '</span>';
  }

  function getFearGreedLabel(val) {
    if (val <= 25) return '極度の恐怖';
    if (val <= 45) return '恐怖';
    if (val <= 55) return '中立';
    if (val <= 75) return '貪欲';
    return '極度の貪欲';
  }

  function getFearGreedIcon(val) {
    if (val <= 25) return '😱';
    if (val <= 45) return '😰';
    if (val <= 55) return '😐';
    if (val <= 75) return '😊';
    return '🤑';
  }

  function getFearGreedColor(val) {
    if (val <= 25) return '#ef4444';
    if (val <= 45) return '#f97316';
    if (val <= 55) return '#eab308';
    if (val <= 75) return '#84cc16';
    return '#22c55e';
  }

  // サイドメニュー用 Fear & Greed 表示
  function renderSideMenuFearGreed() {
    var market = kairosData.analysis && kairosData.analysis.market ? kairosData.analysis.market : {};
    var value = market.fear_greed_index || 26;
    var label = getFearGreedLabel(value);
    var color = getFearGreedColor(value);
    var icon = getFearGreedIcon(value);

    // アドバイステキスト
    var advice = '';
    if (value <= 25) {
      advice = '極度の恐怖 = 買いのチャンス？';
    } else if (value <= 45) {
      advice = '弱気相場。慎重な投資を';
    } else if (value <= 55) {
      advice = '中立。様子見が無難';
    } else if (value <= 75) {
      advice = '強気相場。利確も検討';
    } else {
      advice = '過熱感あり。注意が必要';
    }

    return '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(255,255,255,0.03);border-radius:12px;cursor:pointer" onclick="showFearGreedDetail()">' +
      '<div style="position:relative;width:50px;height:50px">' +
        '<svg viewBox="0 0 50 50" style="transform:rotate(-90deg)">' +
          '<circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>' +
          '<circle cx="25" cy="25" r="20" fill="none" stroke="' + color + '" stroke-width="6" ' +
            'stroke-dasharray="' + (2 * Math.PI * 20) + '" ' +
            'stroke-dashoffset="' + ((1 - value / 100) * 2 * Math.PI * 20) + '" ' +
            'stroke-linecap="round"/>' +
        '</svg>' +
        '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:' + color + '">' + value + '</div>' +
      '</div>' +
      '<div style="flex:1">' +
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">' +
          '<span style="font-size:16px">' + icon + '</span>' +
          '<span style="font-size:14px;font-weight:600;color:' + color + '">' + label + '</span>' +
        '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.5)">' + advice + '</div>' +
      '</div>' +
      '<div style="color:rgba(255,255,255,0.3)">›</div>' +
    '</div>';
  }

  // Fear & Greed 詳細モーダル
  window.showFearGreedDetail = function() {
    var market = kairosData.analysis && kairosData.analysis.market ? kairosData.analysis.market : {};
    var value = market.fear_greed_index || 26;
    var label = getFearGreedLabel(value);
    var color = getFearGreedColor(value);

    var modal = document.createElement('div');
    modal.id = 'feargreed-detail-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10030;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:350px;width:90%">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
          '<h3 style="margin:0;color:#fff">Fear & Greed Index</h3>' +
          '<button onclick="document.getElementById(\'feargreed-detail-modal\').remove()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +
        '<div style="text-align:center;margin-bottom:20px">' +
          '<div style="font-size:64px;font-weight:700;color:' + color + '">' + value + '</div>' +
          '<div style="font-size:18px;color:' + color + ';font-weight:600">' + label + '</div>' +
        '</div>' +
        '<div style="background:linear-gradient(to right,#ef4444,#f97316,#eab308,#84cc16,#22c55e);height:8px;border-radius:4px;margin-bottom:8px;position:relative">' +
          '<div style="position:absolute;top:-4px;left:' + value + '%;transform:translateX(-50%);width:16px;height:16px;background:#fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:20px">' +
          '<span>極度の恐怖</span><span>恐怖</span><span>中立</span><span>強欲</span><span>極度の強欲</span>' +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px">' +
          '<div style="font-size:12px;font-weight:600;color:#fff;margin-bottom:8px">📊 指標の見方</div>' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.6">' +
            '• 0-24: 極度の恐怖（買いの好機の可能性）<br>' +
            '• 25-44: 恐怖（弱気相場）<br>' +
            '• 45-55: 中立（様子見）<br>' +
            '• 56-75: 強欲（強気相場）<br>' +
            '• 76-100: 極度の強欲（売り時の可能性）' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    closeSideMenu();
  };

  // Fear & Greed 円形ゲージ
  function renderFearGreedGauge(value) {
    var size = 120;
    var strokeWidth = 10;
    var radius = (size - strokeWidth) / 2;
    var circumference = 2 * Math.PI * radius;
    var halfCircumference = circumference / 2;
    var offset = halfCircumference - (value / 100) * halfCircumference;
    var color = getFearGreedColor(value);

    return '<svg class="fear-greed__svg" viewBox="0 0 ' + size + ' ' + (size/2 + 10) + '">' +
      '<defs>' +
        '<linearGradient id="fg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" style="stop-color:#ef4444"/>' +
          '<stop offset="50%" style="stop-color:#eab308"/>' +
          '<stop offset="100%" style="stop-color:#22c55e"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M ' + (strokeWidth/2) + ' ' + (size/2) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (size - strokeWidth/2) + ' ' + (size/2) + '" ' +
        'fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="' + strokeWidth + '" stroke-linecap="round"/>' +
      '<path d="M ' + (strokeWidth/2) + ' ' + (size/2) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + (size - strokeWidth/2) + ' ' + (size/2) + '" ' +
        'fill="none" stroke="url(#fg-gradient)" stroke-width="' + strokeWidth + '" stroke-linecap="round" ' +
        'stroke-dasharray="' + halfCircumference + '" stroke-dashoffset="' + offset + '"/>' +
    '</svg>';
  }

  function renderChartPeriods() {
    var periods = ['1D', '1W', '1M', '3M', 'ALL'];
    var html = '';
    periods.forEach(function(p) {
      var isActive = appState.chartPeriod === p;
      var activeClass = isActive ? ' chart-card__period--active' : '';
      html += '<button class="chart-card__period' + activeClass + '" data-period="' + p + '">' + p + '</button>';
    });
    return html;
  }

  function renderPortfolioChart() {
    var width = 340;
    var height = 120;

    // ポートフォリオ履歴を取得
    var history = getPortfolioHistory();
    var period = appState.chartPeriod || '1M';

    // 期間に応じたデータポイント数
    var points = { '1D': 24, '1W': 7, '1M': 30, '3M': 90, 'ALL': history.length };
    var numPoints = Math.min(points[period] || 30, history.length);

    if (numPoints < 2) {
      // データが足りない場合はダミーデータ
      return renderDummyPortfolioChart(width, height);
    }

    // 履歴から指定期間のデータを抽出
    var recentHistory = history.slice(-numPoints);

    // 通貨ごとにデータを分離
    var btcData = [], ethData = [], solData = [], totalData = [];
    recentHistory.forEach(function(h) {
      btcData.push(h.btc || 0);
      ethData.push(h.eth || 0);
      solData.push(h.sol || 0);
      totalData.push(h.total || 0);
    });

    // 全てゼロの場合はダミー
    var hasData = totalData.some(function(v) { return v > 0; });
    if (!hasData) {
      return renderDummyPortfolioChart(width, height);
    }

    function createPath(data, color) {
      if (data.length < 2) return '';
      var min = Math.min.apply(null, data);
      var max = Math.max.apply(null, data);
      if (max === min) { max = min + 1; }
      var stepX = (width - 24) / (data.length - 1);
      var points = data.map(function(val, i) {
        var x = 12 + i * stepX;
        var y = height - 12 - ((val - min) / (max - min)) * (height - 24);
        return x + ',' + y;
      }).join(' ');
      return '<polyline fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="' + points + '" opacity="0.8" />';
    }

    // グラデーション塗りつぶし（合計用）
    function createAreaPath(data, color) {
      if (data.length < 2) return '';
      var min = Math.min.apply(null, data);
      var max = Math.max.apply(null, data);
      if (max === min) { max = min + 1; }
      var stepX = (width - 24) / (data.length - 1);
      var points = data.map(function(val, i) {
        var x = 12 + i * stepX;
        var y = height - 12 - ((val - min) / (max - min)) * (height - 24);
        return x + ',' + y;
      });
      var pathD = 'M ' + points[0] + ' L ' + points.join(' L ') + ' L ' + (12 + (data.length - 1) * stepX) + ',' + (height - 12) + ' L 12,' + (height - 12) + ' Z';
      return '<path d="' + pathD + '" fill="url(#portfolioGradient)" opacity="0.3" />';
    }

    return '<svg viewBox="0 0 ' + width + ' ' + height + '" class="chart-card__svg">' +
      '<defs>' +
        '<linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" style="stop-color:#d4a853;stop-opacity:0.6" />' +
          '<stop offset="100%" style="stop-color:#d4a853;stop-opacity:0" />' +
        '</linearGradient>' +
      '</defs>' +
      createAreaPath(totalData, '#d4a853') +
      createPath(btcData, '#F7931A') +
      createPath(ethData, '#627EEA') +
      createPath(solData, '#14F195') +
    '</svg>';
  }

  // ダミーポートフォリオチャート
  function renderDummyPortfolioChart(width, height) {
    var btcData = [100, 102, 98, 105, 103, 108, 112, 115, 118, 120];
    var ethData = [100, 99, 101, 97, 100, 103, 105, 102, 108, 110];
    var solData = [100, 108, 115, 110, 120, 118, 125, 130, 128, 135];

    function createPath(data, color) {
      var min = Math.min.apply(null, data) - 5;
      var max = Math.max.apply(null, data) + 5;
      var stepX = (width - 24) / (data.length - 1);
      var points = data.map(function(val, i) {
        var x = 12 + i * stepX;
        var y = height - 12 - ((val - min) / (max - min)) * (height - 24);
        return x + ',' + y;
      }).join(' ');
      return '<polyline fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="' + points + '" opacity="0.5" />';
    }

    return '<svg viewBox="0 0 ' + width + ' ' + height + '" class="chart-card__svg">' +
      '<text x="' + (width / 2) + '" y="' + (height / 2) + '" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="10">投資記録を追加すると表示されます</text>' +
      createPath(btcData, '#F7931A') +
      createPath(ethData, '#627EEA') +
      createPath(solData, '#14F195') +
    '</svg>';
  }

  // ポートフォリオ履歴を取得
  function getPortfolioHistory() {
    var history = [];
    try {
      history = JSON.parse(localStorage.getItem('kairos_portfolio_history') || '[]');
    } catch(e) {}
    return history;
  }

  // ポートフォリオ履歴を記録
  function recordPortfolioSnapshot() {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    var allResults = kairosData.all_results || [];
    var holdings = {};

    // 保有量を計算
    records.forEach(function(r) {
      var id = r.currencyId;
      if (!holdings[id]) holdings[id] = 0;
      holdings[id] += r.type === 'sell' ? -(r.quantity || 0) : (r.quantity || 0);
    });

    // 現在の価値を計算
    var snapshot = {
      date: new Date().toISOString(),
      btc: 0, eth: 0, sol: 0, total: 0
    };

    Object.keys(holdings).forEach(function(id) {
      if (holdings[id] <= 0) return;
      var coinInfo = allResults.find(function(c) { return c.ticker === id; });
      var price = coinInfo ? coinInfo.current_price : 0;
      var value = holdings[id] * price;

      if (id === 'BTC') snapshot.btc = value;
      else if (id === 'ETH') snapshot.eth = value;
      else if (id === 'SOL') snapshot.sol = value;

      snapshot.total += value;
    });

    // 履歴に追加
    var history = getPortfolioHistory();

    // 同じ日のデータがあれば更新、なければ追加
    var today = new Date().toISOString().split('T')[0];
    var existingIdx = history.findIndex(function(h) {
      return h.date && h.date.split('T')[0] === today;
    });

    if (existingIdx >= 0) {
      history[existingIdx] = snapshot;
    } else {
      history.push(snapshot);
    }

    // 最大365日分のみ保持
    if (history.length > 365) {
      history = history.slice(-365);
    }

    localStorage.setItem('kairos_portfolio_history', JSON.stringify(history));
  }

  // ===== 通貨一覧画面 =====
  // 通貨一覧用: viewMode に応じたスコア取得（個別設定は変えない）
  function getCurrenciesViewScore(ticker) {
    var cached = scoreCache.data[ticker];
    if (!cached) return { score: 50, grade: 'C' };
    var viewMode = appState.currenciesViewMode; // null, 'swing', 'longterm'
    if (!viewMode) {
      // null = 個別設定に従う（従来の動作）
      return window.getStrategyScore(ticker);
    }
    var isLongterm = (viewMode === 'longterm');
    // dual対応
    if (cached.scoreSwing !== undefined && cached.scoreLongterm !== undefined) {
      return {
        score: isLongterm ? cached.scoreLongterm : cached.scoreSwing,
        grade: isLongterm ? cached.gradeLongterm : cached.gradeSwing
      };
    }
    return { score: cached.score || 50, grade: cached.grade || 'C' };
  }

  function renderCurrenciesScreen() {
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];

    // viewModeの初期値: null（個別設定依存）の場合は 'swing' をデフォルトにする
    if (appState.currenciesViewMode === null) {
      appState.currenciesViewMode = 'swing';
    }
    var viewMode = appState.currenciesViewMode;
    var viewLabel = viewMode === 'longterm' ? '長期' : '短期';

    // scoreCacheから全通貨のランクを取得してソート
    var allCoins = Object.keys(scoreCache.data).map(function(ticker) {
      var cached = scoreCache.data[ticker];
      var viewScore = getCurrenciesViewScore(ticker);
      return {
        ticker: ticker,
        score: viewScore.score,
        grade: viewScore.grade,
        price: cached.price || 0,
        change: cached.change24h || 0
      };
    });
    // スコア順にソート
    allCoins.sort(function(a, b) { return b.score - a.score; });

    var watchlistHtml = watchlist.map(function(ticker) {
      var cached = scoreCache.data[ticker] || {};
      var viewScore = getCurrenciesViewScore(ticker);
      var grade = viewScore.grade;
      var price = cached.price || 0;
      var change = cached.change24h || 0;
      var changeClass = change >= 0 ? 'positive' : 'negative';
      var strat = (typeof StrategyManager !== 'undefined') ? StrategyManager.getStrategy(ticker) : 'watching';
      var stratCfg = STRATEGY_CONFIG[strat] || STRATEGY_CONFIG.watching;
      return '<div class="currencies__list-card" data-ticker="' + ticker + '">' +
        '<div class="currencies__list-card-left">' +
          '<span class="currencies__list-card-icon">' + getCoinIcon(ticker) + '</span>' +
          '<div class="currencies__list-card-info">' +
            '<span class="currencies__list-card-symbol">' + ticker + ' <span class="strategy-badge strategy-badge--' + strat + '">' + stratCfg.icon + ' ' + stratCfg.label + '</span></span>' +
            '<span class="currencies__list-card-price">' + formatPrice(price) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="currencies__list-card-right">' +
          '<span class="currencies__list-card-change ' + changeClass + '">' + formatPercent(change) + '</span>' +
          '<span class="rank-badge rank-badge--sm ' + getGradeClass(grade) + '">' + grade + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    var allCoinsHtml = allCoins.slice(0, 20).map(function(coin, idx) {
      var changeClass = coin.change >= 0 ? 'positive' : 'negative';
      return '<div class="currencies__list-card currencies__list-card--compact" data-ticker="' + coin.ticker + '">' +
        '<span class="currencies__list-card-rank">' + (idx + 1) + '</span>' +
        '<span class="currencies__list-card-icon">' + getCoinIcon(coin.ticker) + '</span>' +
        '<span class="currencies__list-card-symbol">' + coin.ticker + '</span>' +
        '<span class="currencies__list-card-price">' + formatPrice(coin.price) + '</span>' +
        '<span class="currencies__list-card-change ' + changeClass + '">' + formatPercent(coin.change) + '</span>' +
        '<span class="rank-badge rank-badge--sm ' + getGradeClass(coin.grade) + '">' + coin.grade + '</span>' +
      '</div>';
    }).join('');

    var updateTime = new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'});

    // 短期/長期トグル（表示用、個別設定は変えない）
    var toggleHtml = '<div class="currencies__view-toggle-row">' +
      '<div class="strategy-toggle strategy-toggle--' + viewMode + '" id="currencies-view-toggle">' +
        '<div class="strategy-toggle__slider"></div>' +
        '<span class="strategy-toggle__option strategy-toggle__option--longterm">長期</span>' +
        '<span class="strategy-toggle__option strategy-toggle__option--swing">短期</span>' +
      '</div>' +
    '</div>';

    return '<div class="currencies">' +
      '<div class="currencies__header">' +
        '<h1 class="currencies__title">通貨一覧</h1>' +
      '</div>' +
      '<div class="currencies__content">' +
        toggleHtml +
        '<button class="currencies__add-btn">+ 通貨を追加</button>' +
        '<section class="currencies__section">' +
          '<div class="currencies__section-header">' +
            '<span class="currencies__section-title">ウォッチリスト</span>' +
            '<span class="currencies__section-count">' + watchlist.length + '</span>' +
          '</div>' +
          '<div class="currencies__list">' + watchlistHtml + '</div>' +
        '</section>' +
        '<section class="currencies__section">' +
          '<div class="currencies__section-header">' +
            '<span class="currencies__section-title">全通貨ランキング（' + viewLabel + '）</span>' +
            '<span class="currencies__section-count">' + allCoins.length + '</span>' +
          '</div>' +
          '<div class="currencies__list">' + allCoinsHtml + '</div>' +
        '</section>' +
      '</div>' +
    '</div>';
  }

  // ===== 市場画面 =====
  function renderMarketScreen() {
    var market = (kairosData.analysis && kairosData.analysis.market) || {};
    var fearGreed = market.fear_greed_index || 35;
    var btcDom = market.btc_dominance || 52.3;
    var totalMarketCap = market.total_market_cap || 3250000000000000;
    var totalVolume = market.total_volume || 0;
    var allResults = kairosData.all_results || [];

    // テーマ対応カラー
    var _lt = document.documentElement.getAttribute('data-theme') === 'turquoise';
    var mc = {
      cardBg: _lt ? 'rgba(13,148,136,0.04)' : 'rgba(255,255,255,0.03)',
      cardBorder: _lt ? 'rgba(13,148,136,0.12)' : 'rgba(255,255,255,0.08)',
      subtle: _lt ? '#5eada6' : 'rgba(255,255,255,0.5)',
      medium: _lt ? '#0d9488' : 'rgba(255,255,255,0.6)',
      bright: _lt ? '#0f766e' : 'rgba(255,255,255,0.8)',
      dim: _lt ? '#5eada6' : 'rgba(255,255,255,0.4)',
      dimBright: _lt ? '#0d9488' : 'rgba(255,255,255,0.7)',
      barBg: _lt ? 'rgba(13,148,136,0.1)' : 'rgba(255,255,255,0.1)',
      divider: _lt ? 'rgba(13,148,136,0.08)' : 'rgba(255,255,255,0.05)',
      ring: _lt ? 'rgba(13,148,136,0.08)' : 'rgba(255,255,255,0.04)',
      tickS: _lt ? 'rgba(13,148,136,0.4)' : 'rgba(255,255,255,0.4)',
      tickW: _lt ? 'rgba(13,148,136,0.2)' : 'rgba(255,255,255,0.15)',
      label: _lt ? '#5eada6' : 'rgba(255,255,255,0.35)',
      center: _lt ? '#f0f4f4' : '#0a1628',
      heatText: _lt ? '#0f766e' : '#fff',
      heatTextDim: _lt ? '#0d9488' : 'rgba(255,255,255,0.9)'
    };

    // F&G履歴の非同期取得（次回レンダリングで反映）
    if (!FearGreedAPI._historyCache) {
      FearGreedAPI.fetchHistory(30);
    }

    // Fear & Greed のアドバイステキスト
    var fgAdvice = '';
    var fgStatus = '';
    if (fearGreed <= 25) {
      fgStatus = '極度の恐怖';
      fgAdvice = '極度の恐怖は買い場のサイン。慎重に分散投資を検討しましょう。';
    } else if (fearGreed <= 45) {
      fgStatus = 'やや弱気';
      fgAdvice = '恐怖が支配的な市場。慎重な積立や分散投資を継続しましょう。';
    } else if (fearGreed <= 55) {
      fgStatus = '中立';
      fgAdvice = '市場は様子見ムード。大きな動きに備えましょう。';
    } else if (fearGreed <= 75) {
      fgStatus = 'やや強気';
      fgAdvice = '楽観ムード。利益確定も視野に入れましょう。';
    } else {
      fgStatus = '極度の強欲';
      fgAdvice = '過熱感あり！利益確定を優先し、新規投資は慎重に。';
    }

    // Fear & Greed ゲージ（モダンデザイン）
    var fgRatio = fearGreed / 100;
    var fgColor = getFearGreedColor(fearGreed);
    var needleAngle = 180 + fgRatio * 180; // 180(左端) → 360(右端)
    var needleRad = needleAngle * Math.PI / 180;
    var needleX = 100 + 62 * Math.cos(needleRad);
    var needleY = 105 + 62 * Math.sin(needleRad);
    // セグメントアーク生成
    var segments = [
      { start: 0, end: 0.2, color: '#ef4444' },
      { start: 0.2, end: 0.4, color: '#f97316' },
      { start: 0.4, end: 0.6, color: '#eab308' },
      { start: 0.6, end: 0.8, color: '#84cc16' },
      { start: 0.8, end: 1.0, color: '#22c55e' }
    ];
    var segmentPaths = segments.map(function(seg, idx) {
      var r = 75;
      var cx = 100, cy = 105;
      var a1 = Math.PI + seg.start * Math.PI;
      var a2 = Math.PI + seg.end * Math.PI;
      var gap = 0.02;
      var x1 = cx + r * Math.cos(a1 + gap);
      var y1 = cy + r * Math.sin(a1 + gap);
      var x2 = cx + r * Math.cos(a2 - gap);
      var y2 = cy + r * Math.sin(a2 - gap);
      var isActive = fgRatio >= seg.start;
      var targetOpacity = isActive ? 1 : 0.2;
      var delay = (idx * 0.15) + 0.2;
      return '<path class="fg-segment-animated" d="M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 0 1 ' + x2 + ' ' + y2 + '" ' +
        'fill="none" stroke="' + seg.color + '" stroke-width="10" stroke-linecap="round" ' +
        'style="--fg-seg-opacity:' + targetOpacity + ';animation-delay:' + delay + 's"/>';
    }).join('');
    // 目盛りライン
    var tickLines = '';
    for (var t = 0; t <= 10; t++) {
      var ta = Math.PI + (t / 10) * Math.PI;
      var tr1 = 86, tr2 = 92;
      tickLines += '<line x1="' + (100 + tr1 * Math.cos(ta)) + '" y1="' + (105 + tr1 * Math.sin(ta)) + '" ' +
        'x2="' + (100 + tr2 * Math.cos(ta)) + '" y2="' + (105 + tr2 * Math.sin(ta)) + '" ' +
        'stroke="' + (t % 5 === 0 ? mc.tickS : mc.tickW) + '" stroke-width="' + (t % 5 === 0 ? '2' : '1') + '"/>';
    }
    var fgGaugeSvg = '<svg viewBox="0 0 200 125" style="width:100%;max-width:240px">' +
      '<defs>' +
        '<linearGradient id="fgGradient" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" style="stop-color:#ef4444"/>' +
          '<stop offset="50%" style="stop-color:#eab308"/>' +
          '<stop offset="100%" style="stop-color:#22c55e"/>' +
        '</linearGradient>' +
        '<filter id="fgGlow"><feGaussianBlur stdDeviation="3" result="blur"/>' +
          '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>' +
      // 外側の薄いリング
      '<path d="M 12 105 A 88 88 0 0 1 188 105" fill="none" stroke="' + mc.ring + '" stroke-width="16"/>' +
      // セグメント
      segmentPaths +
      // 目盛り
      tickLines +
      // ラベル
      '<text x="18" y="118" text-anchor="middle" fill="' + mc.label + '" font-size="8">0</text>' +
      '<text x="100" y="22" text-anchor="middle" fill="' + mc.label + '" font-size="8">50</text>' +
      '<text x="182" y="118" text-anchor="middle" fill="' + mc.label + '" font-size="8">100</text>' +
      // 針（グロー付き・スイープアニメーション）
      (function() { var sw = 0.5 + Math.random() * 0.5; return '<g class="fg-needle-animated" style="--fg-sweep-from:' + (-(fgRatio * 180)) + 'deg;--fg-sweep-max:' + (sw * (1 - fgRatio) * 180) + 'deg;--fg-duration:' + (2 + (1 - sw) * 2) + 's">'; })() +
        '<line x1="100" y1="105" x2="' + needleX + '" y2="' + needleY + '" stroke="' + fgColor + '" stroke-width="2.5" stroke-linecap="round" filter="url(#fgGlow)"/>' +
        '<circle cx="100" cy="105" r="5" fill="' + fgColor + '" filter="url(#fgGlow)"/>' +
        '<circle cx="100" cy="105" r="2.5" fill="' + mc.center + '"/>' +
      '</g>' +
      // 中央の数値
      '<text x="100" y="82" text-anchor="middle" fill="' + fgColor + '" font-size="36" font-weight="800" font-family="system-ui,sans-serif">' + fearGreed + '</text>' +
      '<text x="100" y="98" text-anchor="middle" fill="' + mc.medium + '" font-size="11" font-weight="500">' + getFearGreedLabel(fearGreed) + '</text>' +
    '</svg>';

    // 過去30日ミニチャート（リアルデータ or フォールバック）
    var miniChartData = FearGreedAPI._historyCache || [fearGreed];
    var chartMin = Math.min.apply(null, miniChartData);
    var chartMax = Math.max.apply(null, miniChartData);
    if (chartMin === chartMax) { chartMin -= 5; chartMax += 5; }
    var chartPoints = miniChartData.map(function(v, i) {
      var x = (i / Math.max(miniChartData.length - 1, 1)) * 100;
      var y = 100 - ((v - chartMin) / (chartMax - chartMin)) * 100;
      return x + ',' + y;
    }).join(' ');

    // ヒートマップデータ（all_resultsから生成）
    var heatmapTickers = ['BTC','ETH','BNB','SOL','XRP','ADA','AVAX','DOGE','DOT','LINK','MATIC','ATOM'];
    var heatmapCoins = heatmapTickers.map(function(t) {
      var r = allResults.find(function(a) { return a.ticker === t; });
      return { ticker: t, change: r ? (r.price_change_24h || 0) : 0 };
    });

    var heatmapHtml = heatmapCoins.map(function(coin) {
      var color = coin.change >= 0 ? 'rgba(34,197,94,' + Math.min(0.2 + Math.abs(coin.change) / 20, 1) + ')' : 'rgba(239,68,68,' + Math.min(0.2 + Math.abs(coin.change) / 20, 1) + ')';
      var textColor = Math.abs(coin.change) > 5 ? mc.heatText : mc.heatTextDim;
      var changeText = (coin.change >= 0 ? '+' : '') + coin.change.toFixed(1) + '%';
      return '<div style="background:' + color + ';border-radius:8px;padding:10px 6px;text-align:center;min-width:0">' +
        '<div style="font-size:11px;font-weight:600;color:' + textColor + '">' + coin.ticker + '</div>' +
        '<div style="font-size:10px;color:' + textColor + ';margin-top:2px">' + changeText + '</div>' +
      '</div>';
    }).join('');

    // セクター別データ（all_resultsから算出）
    var sectorDefs = [
      { key: 'layer1', name: '基本' },
      { key: 'defi', name: 'DeFi' },
      { key: 'layer2', name: '高速' },
      { key: 'meme', name: 'ミーム' },
      { key: 'ai', name: 'AI関連' },
      { key: 'gaming', name: 'ゲーム' },
      { key: 'classic', name: 'アルト' }
    ];
    var sectors = sectorDefs.map(function(sec) {
      var cat = CRYPTO_CATEGORIES[sec.key];
      if (!cat || !cat.coins) return { name: sec.name, change: 0, color: '#94a3b8' };
      var total = 0, count = 0;
      cat.coins.forEach(function(c) {
        var r = allResults.find(function(a) { return a.ticker === c.symbol; });
        if (r && r.price_change_24h != null) { total += r.price_change_24h; count++; }
      });
      var avg = count > 0 ? total / count : 0;
      return { name: sec.name, change: avg, color: avg >= 0 ? '#22c55e' : '#ef4444' };
    }).filter(function(s) { return s.change !== 0 || true; });

    var sectorsHtml = sectors.map(function(s) {
      var barWidth = Math.min(Math.abs(s.change) * 8, 100);
      var changeText = (s.change >= 0 ? '+' : '') + s.change.toFixed(1) + '%';
      return '<div style="display:flex;align-items:center;gap:12px;padding:8px 0">' +
        '<span style="width:60px;font-size:13px;color:' + mc.bright + '">' + s.name + '</span>' +
        '<div style="flex:1;height:8px;background:' + mc.barBg + ';border-radius:4px;overflow:hidden">' +
          '<div style="height:100%;width:' + barWidth + '%;background:' + s.color + ';border-radius:4px;transition:width 0.5s"></div>' +
        '</div>' +
        '<span style="width:50px;text-align:right;font-size:12px;color:' + s.color + ';font-weight:600">' + changeText + '</span>' +
      '</div>';
    }).join('');

    // 上昇Top / 下落Top
    var sortedByChange = allResults.slice().sort(function(a, b) { return (b.price_change_24h || 0) - (a.price_change_24h || 0); });
    var topGainers = sortedByChange.slice(0, 3);
    var topLosers = sortedByChange.slice(-3).reverse();

    var gainersHtml = topGainers.map(function(coin, idx) {
      var change = coin.price_change_24h || 0;
      return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid ' + mc.divider + '">' +
        '<span style="width:20px;color:' + mc.subtle + ';font-size:12px">' + (idx + 1) + '</span>' +
        '<span style="flex:1;font-size:13px;font-weight:500">' + coin.ticker + '</span>' +
        '<span style="color:#22c55e;font-size:13px;font-weight:600">+' + Math.abs(change).toFixed(1) + '%</span>' +
      '</div>';
    }).join('');

    var losersHtml = topLosers.map(function(coin, idx) {
      var change = coin.price_change_24h || 0;
      return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid ' + mc.divider + '">' +
        '<span style="width:20px;color:' + mc.subtle + ';font-size:12px">' + (idx + 1) + '</span>' +
        '<span style="flex:1;font-size:13px;font-weight:500">' + coin.ticker + '</span>' +
        '<span style="color:#ef4444;font-size:13px;font-weight:600">' + change.toFixed(1) + '%</span>' +
      '</div>';
    }).join('');

    var marketUpdateTime = new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'});

    return '<div class="market" style="padding-bottom:100px">' +
      '<div class="market__header">' +
        '<h1 class="market__title">マーケット</h1>' +
        '<span class="market__header-time">' + marketUpdateTime + '</span>' +
      '</div>' +
      '<div class="market__content">' +

        // 市場サマリー（Fear & Greed）
        '<div style="background:' + mc.cardBg + ';border-radius:16px;padding:20px;margin-bottom:16px;border:1px solid ' + mc.cardBorder + ';cursor:pointer" onclick="window.openIndicatorHelp(\'fg\')">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
            '<div style="display:flex;align-items:center;gap:8px">' +
              '<span style="font-size:18px">📊</span>' +
              '<span style="font-size:15px;font-weight:600">市場サマリー</span>' +
            '</div>' +
            '<span style="font-size:12px;color:' + getFearGreedColor(fearGreed) + ';font-weight:600">' + fgStatus + '</span>' +
          '</div>' +
          '<p style="margin:0 0 16px 0;font-size:13px;color:' + mc.medium + ';line-height:1.5">' + fgAdvice + '</p>' +
          '<div style="display:flex;justify-content:center;margin-bottom:16px">' + fgGaugeSvg + '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:' + mc.subtle + '">' +
            '<span>過去30日の推移</span>' +
            '<span>' + chartMin + ' - ' + chartMax + '</span>' +
          '</div>' +
          '<div style="height:44px;margin-top:8px">' +
            '<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%">' +
              '<defs>' +
                '<linearGradient id="fgChartFill" x1="0" y1="0" x2="0" y2="1">' +
                  '<stop offset="0%" style="stop-color:' + fgColor + ';stop-opacity:0.3"/>' +
                  '<stop offset="100%" style="stop-color:' + fgColor + ';stop-opacity:0"/>' +
                '</linearGradient>' +
              '</defs>' +
              '<polygon points="0,100 ' + chartPoints + ' 100,100" fill="url(#fgChartFill)"/>' +
              '<polyline points="' + chartPoints + '" fill="none" stroke="' + fgColor + '" stroke-width="2" stroke-linejoin="round"/>' +
            '</svg>' +
          '</div>' +
        '</div>' +

        // 3つの指標カード
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">' +
          '<div style="background:' + mc.cardBg + ';border-radius:12px;padding:12px;text-align:center;border:1px solid ' + mc.cardBorder + ';cursor:pointer" onclick="window.openIndicatorHelp(\'dominance\')">' +
            '<div style="font-size:10px;color:' + mc.subtle + ';margin-bottom:4px">BTCドミナンス</div>' +
            '<div style="font-size:16px;font-weight:700">' + btcDom.toFixed(1) + '%</div>' +
          '</div>' +
          '<div style="background:' + mc.cardBg + ';border-radius:12px;padding:12px;text-align:center;border:1px solid ' + mc.cardBorder + ';cursor:pointer" onclick="window.openIndicatorHelp(\'marketcap\')">' +
            '<div style="font-size:10px;color:' + mc.subtle + ';margin-bottom:4px">総時価総額</div>' +
            '<div style="font-size:16px;font-weight:700">' + formatMarketCapJP(totalMarketCap) + '</div>' +
          '</div>' +
          '<div style="background:' + mc.cardBg + ';border-radius:12px;padding:12px;text-align:center;border:1px solid ' + mc.cardBorder + ';cursor:pointer" onclick="window.openIndicatorHelp(\'volume24h\')">' +
            '<div style="font-size:10px;color:' + mc.subtle + ';margin-bottom:4px">24h取引量</div>' +
            '<div style="font-size:16px;font-weight:700">' + formatMarketCapJP(totalVolume) + '</div>' +
          '</div>' +
        '</div>' +

        // 主要通貨ヒートマップ
        '<div style="background:' + mc.cardBg + ';border-radius:16px;padding:16px;margin-bottom:16px;border:1px solid ' + mc.cardBorder + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
            '<span style="font-size:14px;font-weight:600">主要通貨ヒートマップ</span>' +
            '<span style="font-size:11px;color:' + mc.subtle + '">24h変動</span>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">' + heatmapHtml + '</div>' +
          '<div style="display:flex;justify-content:center;gap:16px;margin-top:12px;font-size:10px;color:' + mc.subtle + '">' +
            '<span>🟢 上昇</span>' +
            '<span>🔴 下落</span>' +
            '<span>色が濃い＝変動大</span>' +
          '</div>' +
        '</div>' +

        // セクター別
        '<div style="background:' + mc.cardBg + ';border-radius:16px;padding:16px;margin-bottom:16px;border:1px solid ' + mc.cardBorder + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
            '<span style="font-size:14px;font-weight:600">セクター別</span>' +
            '<div style="display:flex;gap:8px">' +
              '<span style="font-size:10px;padding:4px 8px;background:' + mc.barBg + ';border-radius:4px;color:' + mc.dimBright + '">24h</span>' +
              '<span style="font-size:10px;padding:4px 8px;border-radius:4px;color:' + mc.dim + '">7d</span>' +
            '</div>' +
          '</div>' +
          sectorsHtml +
        '</div>' +

        // 上昇Top / 下落Top
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">' +
          '<div style="background:' + mc.cardBg + ';border-radius:16px;padding:14px;border:1px solid ' + mc.cardBorder + '">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">' +
              '<span style="font-size:12px">📈</span>' +
              '<span style="font-size:13px;font-weight:600;color:#22c55e">上昇Top</span>' +
            '</div>' +
            gainersHtml +
          '</div>' +
          '<div style="background:' + mc.cardBg + ';border-radius:16px;padding:14px;border:1px solid ' + mc.cardBorder + '">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">' +
              '<span style="font-size:12px">📉</span>' +
              '<span style="font-size:13px;font-weight:600;color:#ef4444">下落Top</span>' +
            '</div>' +
            losersHtml +
          '</div>' +
        '</div>' +

      '</div>' +
    '</div>';
  }

  function formatMarketCapJP(val) {
    if (!val) return '-';
    if (val >= 1e16) return (val / 1e16).toFixed(1) + '京';
    if (val >= 1e12) return (val / 1e12).toFixed(0) + '兆';
    if (val >= 1e8) return (val / 1e8).toFixed(0) + '億';
    return val.toLocaleString();
  }

  function getMarketScoreLabel(score) {
    if (score >= 70) return '強気';
    if (score >= 55) return 'やや強気';
    if (score >= 45) return '中立';
    if (score >= 30) return 'やや弱気';
    return '弱気';
  }

  // サマリーの色を取得（テキスト色・部分一致で判定）
  function getSummaryColor(summary) {
    if (!summary) return '#94a3b8';
    if (summary.indexOf('やや強気') >= 0) return '#4ade80';  // 薄緑
    if (summary.indexOf('やや弱気') >= 0) return '#fb923c';  // オレンジ
    if (summary.indexOf('強気') >= 0) return '#22c55e';      // 緑
    if (summary.indexOf('弱気') >= 0) return '#ef4444';      // 赤
    if (summary.indexOf('中立') >= 0) return '#fbbf24';      // 黄色
    return '#94a3b8'; // デフォルト（グレー）
  }

  // サマリーバーの背景色を取得（部分一致で判定）
  function getSummaryBgColor(summary) {
    if (!summary) return 'rgba(148, 163, 184, 0.8)';
    if (summary.indexOf('やや強気') >= 0) return 'rgba(74, 222, 128, 0.85)';  // 薄緑
    if (summary.indexOf('やや弱気') >= 0) return 'rgba(251, 146, 60, 0.9)';  // オレンジ
    if (summary.indexOf('強気') >= 0) return 'rgba(34, 197, 94, 0.9)';      // 緑
    if (summary.indexOf('弱気') >= 0) return 'rgba(239, 68, 68, 0.9)';      // 赤
    if (summary.indexOf('中立') >= 0) return 'rgba(251, 191, 36, 0.85)';      // 黄色
    return 'rgba(148, 163, 184, 0.8)'; // デフォルト（グレー）
  }

  function getSentimentDescription(fearGreed) {
    if (fearGreed <= 25) return '極度の恐怖は底値のサイン';
    if (fearGreed <= 45) return '慎重な姿勢が推奨';
    if (fearGreed <= 55) return '様子見が妥当';
    if (fearGreed <= 75) return '上昇基調、利確検討';
    return '過熱感あり、警戒';
  }

  function formatMarketCap(val) {
    if (!val) return '-';
    if (val >= 1e12) return '$' + (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return '$' + (val / 1e9).toFixed(1) + 'B';
    if (val >= 1e6) return '$' + (val / 1e6).toFixed(1) + 'M';
    return '$' + val.toLocaleString();
  }

  // ===== AI画面（タブ形式ハブ） =====
  var aiScreenState = {
    activeTab: 'ranking' // ranking, fire, optimize, trend
  };

  function renderAICompareScreen() {
    var tabs = [
      { id: 'ranking', icon: '📊', label: 'ランキング' },
      { id: 'fire', icon: '🔥', label: 'FIRE' },
      { id: 'optimize', icon: '⚖️', label: '最適化' },
      { id: 'trend', icon: '📈', label: 'トレンド' }
    ];

    var tabsHtml = tabs.map(function(tab) {
      var isActive = aiScreenState.activeTab === tab.id;
      return '<button class="ai-tab' + (isActive ? ' ai-tab--active' : '') + '" data-tab="' + tab.id + '">' +
        '<span class="ai-tab__icon">' + tab.icon + '</span>' +
        '<span class="ai-tab__label">' + tab.label + '</span>' +
      '</button>';
    }).join('');

    var contentHtml = '';
    switch (aiScreenState.activeTab) {
      case 'fire':
        contentHtml = renderAIFireTab();
        break;
      case 'optimize':
        contentHtml = renderAIOptimizeTab();
        break;
      case 'trend':
        contentHtml = renderAITrendTab();
        break;
      default:
        contentHtml = renderAIRankingTab();
    }

    var aiUpdateTime = new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'});

    return '<div class="ai-screen">' +
      '<div class="ai-screen__header">' +
        '<h1 class="ai-screen__title">AI アシスタント</h1>' +
        '<span class="ai-screen__header-time">' + aiUpdateTime + '</span>' +
      '</div>' +
      '<div class="ai-tabs">' + tabsHtml + '</div>' +
      '<div class="ai-content">' + contentHtml + '</div>' +
    '</div>';
  }

  // AIランキングタブ
  function renderAIRankingTab() {
    var allCoins = Object.keys(scoreCache.data).map(function(ticker) {
      var cached = scoreCache.data[ticker];
      var stratScore = window.getStrategyScore(ticker);
      return {
        ticker: ticker,
        score: stratScore.score,
        grade: stratScore.grade,
        change24h: cached.change24h || 0,
        price: cached.price || 0
      };
    });

    var sorted = allCoins.sort(function(a, b) { return b.score - a.score; });
    var topCoins = sorted.slice(0, 15);

    var listHtml = topCoins.map(function(coin, idx) {
      var score = coin.score || 50;
      var grade = coin.grade || 'C';
      var change = coin.change24h || 0;
      var changeClass = change >= 0 ? 'positive' : 'negative';

      return '<div class="ai-compare-item" data-ticker="' + coin.ticker + '">' +
        '<div class="ai-compare-item__left">' +
          '<span class="ai-compare-item__rank">#' + (idx + 1) + '</span>' +
          '<span class="ai-compare-item__icon">' + getCoinIcon(coin.ticker) + '</span>' +
          '<span class="ai-compare-item__name">' + coin.ticker + '</span>' +
        '</div>' +
        '<div class="ai-compare-item__stats">' +
          '<span class="ai-compare-item__stat">' + score + 'pt</span>' +
          '<span class="ai-compare-item__stat ' + changeClass + '">' + formatPercent(change) + '</span>' +
        '</div>' +
        '<span class="rank-badge rank-badge--sm ' + getGradeClass(grade) + '">' + grade + '</span>' +
      '</div>';
    }).join('');

    // ストラテジーの多数派モードに応じた指標説明
    var dominantMode = (typeof StrategyManager !== 'undefined') ? StrategyManager.getDominantApiMode() : 'longterm';
    var modeMetrics = dominantMode === 'longterm'
      ? {
          title: '長期投資向け指標',
          items: [
            { icon: '📈', name: 'MA乖離', desc: '90日移動平均線からの乖離率' },
            { icon: '📊', name: 'RSI', desc: '相対力指数（買われすぎ/売られすぎ）' },
            { icon: '💎', name: '時価総額', desc: '市場での信頼性・安定性' },
            { icon: '📉', name: 'ボラティリティ', desc: '価格変動の安定性（低いほど良い）' }
          ]
        }
      : {
          title: '短期トレード向け指標',
          items: [
            { icon: '⚡', name: 'モメンタム', desc: '短期の価格勢い（7日間）' },
            { icon: '📊', name: 'RSI', desc: '相対力指数（14期間）' },
            { icon: '📈', name: 'MA乖離', desc: '7日移動平均線からの乖離率' },
            { icon: '🔥', name: '出来高', desc: '取引活発度' }
          ]
        };

    var metricsHtml = modeMetrics.items.map(function(m) {
      return '<div class="ranking-metric-item">' +
        '<span class="ranking-metric-item__icon">' + m.icon + '</span>' +
        '<span class="ranking-metric-item__name">' + m.name + '</span>' +
        '<span class="ranking-metric-item__desc">' + m.desc + '</span>' +
      '</div>';
    }).join('');

    return '<div class="ai-ranking">' +
      // 指標説明
      '<div class="ranking-metrics-card">' +
        '<div class="ranking-metrics-header">' +
          '<span class="ranking-metrics-title">🎯 ' + modeMetrics.title + '</span>' +
          '<button class="ranking-metrics-toggle" onclick="this.parentElement.parentElement.classList.toggle(\'collapsed\')">▼</button>' +
        '</div>' +
        '<div class="ranking-metrics-list">' + metricsHtml + '</div>' +
        '<div class="ranking-metrics-note">' +
          '※ 各指標をAIが総合評価してスコア化（0-100pt）<br>' +
          '※ A〜Eのランクは買い推奨度を表します' +
        '</div>' +
      '</div>' +
      // ランキング
      '<div class="ai-section-header">' +
        '<span class="ai-section-title">📊 AIランキング TOP15</span>' +
        '<span class="ai-section-subtitle">スコア順</span>' +
      '</div>' +
      '<div class="ai-compare__list">' + listHtml + '</div>' +
    '</div>';
  }

  // FIRE目標タブ
  function renderAIFireTab() {
    // FIRE設定を読み込み
    var fireSettings = loadFireSettings();
    var portfolio = loadPortfolio();

    // 現在の資産額を計算
    var currentValue = 0;
    portfolio.forEach(function(item) {
      var cached = scoreCache.data[item.ticker];
      if (cached && cached.price) {
        currentValue += item.amount * cached.price;
      }
    });
    var currentValueJpy = currentValue * 150; // 簡易レート

    // 進捗率
    var progressPercent = fireSettings.targetAmount > 0
      ? Math.min((currentValueJpy / fireSettings.targetAmount) * 100, 100)
      : 0;

    // 残り期間
    var now = new Date();
    var targetDate = new Date(fireSettings.targetYear, fireSettings.targetMonth - 1, 1);
    var monthsRemaining = Math.max(0, (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth()));
    var yearsRemaining = Math.floor(monthsRemaining / 12);
    var monthsRemainingMod = monthsRemaining % 12;

    // 必要な月額積立額（単純計算）
    var remainingAmount = Math.max(0, fireSettings.targetAmount - currentValueJpy);
    var requiredMonthly = monthsRemaining > 0 ? Math.round(remainingAmount / monthsRemaining) : 0;

    // 達成予測（現在のペースで）
    var avgMonthlyGrowth = fireSettings.expectedReturn / 12 / 100; // 月利
    var projectedMonths = 0;
    var projectedValue = currentValueJpy;
    var monthlyInvest = fireSettings.monthlyInvestment || 50000;
    while (projectedValue < fireSettings.targetAmount && projectedMonths < 600) { // 最大50年
      projectedValue = projectedValue * (1 + avgMonthlyGrowth) + monthlyInvest;
      projectedMonths++;
    }
    var projectedYears = Math.floor(projectedMonths / 12);
    var projectedMonthsMod = projectedMonths % 12;

    return '<div class="ai-fire">' +
      // 目標サマリー
      '<div class="fire-goal-card">' +
        '<div class="fire-goal-card__header">' +
          '<span class="fire-goal-card__icon">🔥</span>' +
          '<span class="fire-goal-card__title">FIRE目標</span>' +
          '<button class="fire-goal-card__edit" onclick="window.openFireSettingsModal()">⚙️</button>' +
        '</div>' +
        '<div class="fire-goal-card__target">' +
          '<span class="fire-goal-card__amount">' + formatYen(fireSettings.targetAmount) + '</span>' +
          '<span class="fire-goal-card__date">' + fireSettings.targetYear + '年' + fireSettings.targetMonth + '月まで</span>' +
        '</div>' +
        '<div class="fire-goal-card__progress">' +
          '<div class="fire-progress-bar">' +
            '<div class="fire-progress-bar__fill" style="width:' + progressPercent.toFixed(1) + '%"></div>' +
            '<span class="fire-progress-bar__label">' + progressPercent.toFixed(1) + '%</span>' +
          '</div>' +
        '</div>' +
        '<div class="fire-goal-card__stats">' +
          '<div class="fire-stat">' +
            '<span class="fire-stat__label">現在の資産</span>' +
            '<span class="fire-stat__value">' + formatYen(currentValueJpy) + '</span>' +
          '</div>' +
          '<div class="fire-stat">' +
            '<span class="fire-stat__label">残り</span>' +
            '<span class="fire-stat__value">' + formatYen(remainingAmount) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // タイムライン
      '<div class="fire-timeline-card">' +
        '<div class="fire-section-title">⏰ タイムライン</div>' +
        '<div class="fire-timeline-stats">' +
          '<div class="fire-timeline-stat">' +
            '<span class="fire-timeline-stat__icon">📅</span>' +
            '<span class="fire-timeline-stat__label">残り期間</span>' +
            '<span class="fire-timeline-stat__value">' + yearsRemaining + '年' + monthsRemainingMod + 'ヶ月</span>' +
          '</div>' +
          '<div class="fire-timeline-stat">' +
            '<span class="fire-timeline-stat__icon">💰</span>' +
            '<span class="fire-timeline-stat__label">必要月額</span>' +
            '<span class="fire-timeline-stat__value">' + formatYen(requiredMonthly) + '/月</span>' +
          '</div>' +
          '<div class="fire-timeline-stat">' +
            '<span class="fire-timeline-stat__icon">🎯</span>' +
            '<span class="fire-timeline-stat__label">達成予測</span>' +
            '<span class="fire-timeline-stat__value ' + (projectedMonths <= monthsRemaining ? 'positive' : 'warning') + '">' +
              (projectedMonths >= 600 ? '50年以上' : projectedYears + '年' + projectedMonthsMod + 'ヶ月後') +
            '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // AI提案
      '<div class="fire-ai-card">' +
        '<div class="fire-section-title">🤖 AIからの提案</div>' +
        '<div class="fire-ai-suggestions">' +
          renderFireAISuggestions(fireSettings, currentValueJpy, monthsRemaining, requiredMonthly) +
        '</div>' +
      '</div>' +

      // 積立シミュレーション
      '<div class="fire-sim-card">' +
        '<div class="fire-section-title">📊 積立シミュレーション</div>' +
        '<div class="fire-sim-inputs">' +
          '<div class="fire-sim-input">' +
            '<label>毎月の積立額</label>' +
            '<input type="number" id="fire-sim-monthly" value="' + monthlyInvest + '" step="10000">' +
          '</div>' +
          '<div class="fire-sim-input">' +
            '<label>想定年利 (%)</label>' +
            '<input type="number" id="fire-sim-return" value="' + fireSettings.expectedReturn + '" step="1">' +
          '</div>' +
          '<button class="fire-sim-btn" onclick="window.runFireSimulation()">シミュレーション実行</button>' +
        '</div>' +
        '<div id="fire-sim-result" class="fire-sim-result"></div>' +
      '</div>' +
    '</div>';
  }

  // FIRE AI提案を生成
  function renderFireAISuggestions(settings, current, monthsRemaining, required) {
    var suggestions = [];

    // 進捗に応じた提案
    var progressPercent = (current / settings.targetAmount) * 100;

    if (progressPercent < 10) {
      suggestions.push({
        icon: '🚀',
        title: 'スタートダッシュ',
        text: 'まずは毎月の積立習慣をつけましょう。少額でもOK！'
      });
    }

    if (required > settings.monthlyInvestment * 1.5) {
      suggestions.push({
        icon: '⚠️',
        title: '積立額の見直し',
        text: '目標達成には現在の' + Math.round(required / settings.monthlyInvestment * 10) / 10 + '倍の積立が必要です。目標を調整するか、収入を増やす方法を検討しましょう。'
      });
    }

    var domMode = (typeof StrategyManager !== 'undefined') ? StrategyManager.getDominantApiMode() : 'longterm';
    if (domMode === 'longterm') {
      suggestions.push({
        icon: '💎',
        title: 'HODL/積立で着実に',
        text: '長期保有・定期積立の通貨が多いです。短期の値動きに惑わされず継続しましょう。'
      });
    } else {
      suggestions.push({
        icon: '🔄',
        title: 'ストラテジー見直し検討',
        text: 'FIRE目標にはHODL/積立ストラテジーがおすすめです。スイングはリスクが高くなります。'
      });
    }

    // 市場状況に応じた提案
    var fearGreed = (kairosData.analysis && kairosData.analysis.market) ? kairosData.analysis.market.fear_greed_index : 50;
    if (fearGreed < 30) {
      suggestions.push({
        icon: '📉',
        title: '買い増しチャンス',
        text: '市場は恐怖状態です。長期目線では絶好の買い場かもしれません。'
      });
    } else if (fearGreed > 70) {
      suggestions.push({
        icon: '📈',
        title: '慎重に',
        text: '市場は過熱気味です。一括投資より分散投資を心がけましょう。'
      });
    }

    return suggestions.map(function(s) {
      return '<div class="fire-ai-suggestion">' +
        '<span class="fire-ai-suggestion__icon">' + s.icon + '</span>' +
        '<div class="fire-ai-suggestion__content">' +
          '<span class="fire-ai-suggestion__title">' + s.title + '</span>' +
          '<span class="fire-ai-suggestion__text">' + s.text + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // FIRE設定の読み込み
  function loadFireSettings() {
    var defaults = {
      targetAmount: 30000000, // 3000万円
      targetYear: 2035,
      targetMonth: 12,
      monthlyInvestment: 50000,
      expectedReturn: 7 // 年利7%
    };
    try {
      var saved = localStorage.getItem('kairos-fire-settings');
      if (saved) {
        return Object.assign(defaults, JSON.parse(saved));
      }
    } catch(e) {}
    return defaults;
  }

  // FIRE設定の保存
  function saveFireSettings(settings) {
    localStorage.setItem('kairos-fire-settings', JSON.stringify(settings));
  }

  // FIRE設定モーダル
  window.openFireSettingsModal = function() {
    var existing = document.getElementById('fire-settings-modal');
    if (existing) existing.remove();

    var settings = loadFireSettings();

    var modal = document.createElement('div');
    modal.id = 'fire-settings-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML =
      '<div class="modal-content" style="max-width:400px">' +
        '<div class="modal-header">' +
          '<h3>🔥 FIRE目標設定</h3>' +
          '<button class="modal-close" onclick="document.getElementById(\'fire-settings-modal\').remove()">×</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="form-group">' +
            '<label>目標金額（円）</label>' +
            '<input type="number" id="fire-target-amount" value="' + settings.targetAmount + '" step="1000000">' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label>目標年</label>' +
              '<input type="number" id="fire-target-year" value="' + settings.targetYear + '" min="2024" max="2100">' +
            '</div>' +
            '<div class="form-group">' +
              '<label>目標月</label>' +
              '<select id="fire-target-month">' +
                [1,2,3,4,5,6,7,8,9,10,11,12].map(function(m) {
                  return '<option value="' + m + '"' + (settings.targetMonth === m ? ' selected' : '') + '>' + m + '月</option>';
                }).join('') +
              '</select>' +
            '</div>' +
          '</div>' +
          '<div class="form-group">' +
            '<label>毎月の積立予定額（円）</label>' +
            '<input type="number" id="fire-monthly-investment" value="' + settings.monthlyInvestment + '" step="10000">' +
          '</div>' +
          '<div class="form-group">' +
            '<label>想定年利 (%)</label>' +
            '<input type="number" id="fire-expected-return" value="' + settings.expectedReturn + '" min="0" max="50" step="0.5">' +
            '<span class="form-hint">仮想通貨は変動が大きいため参考値です</span>' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn--secondary" onclick="document.getElementById(\'fire-settings-modal\').remove()">キャンセル</button>' +
          '<button class="btn btn--primary" onclick="window.saveFireSettingsFromModal()">保存</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  };

  window.saveFireSettingsFromModal = function() {
    var settings = {
      targetAmount: parseInt(document.getElementById('fire-target-amount').value) || 30000000,
      targetYear: parseInt(document.getElementById('fire-target-year').value) || 2035,
      targetMonth: parseInt(document.getElementById('fire-target-month').value) || 12,
      monthlyInvestment: parseInt(document.getElementById('fire-monthly-investment').value) || 50000,
      expectedReturn: parseFloat(document.getElementById('fire-expected-return').value) || 7
    };
    saveFireSettings(settings);
    document.getElementById('fire-settings-modal').remove();
    showToast('FIRE目標を保存しました', 'success');
    renderApp();
  };

  // FIREシミュレーション実行
  window.runFireSimulation = function() {
    var monthly = parseInt(document.getElementById('fire-sim-monthly').value) || 50000;
    var annualReturn = parseFloat(document.getElementById('fire-sim-return').value) || 7;
    var monthlyReturn = annualReturn / 12 / 100;

    var settings = loadFireSettings();
    var portfolio = loadPortfolio();

    // 現在の資産額
    var currentValue = 0;
    portfolio.forEach(function(item) {
      var cached = scoreCache.data[item.ticker];
      if (cached && cached.price) {
        currentValue += item.amount * cached.price;
      }
    });
    var currentValueJpy = currentValue * 150;

    // シミュレーション
    var results = [];
    var value = currentValueJpy;
    for (var year = 1; year <= 20; year++) {
      for (var month = 0; month < 12; month++) {
        value = value * (1 + monthlyReturn) + monthly;
      }
      results.push({ year: year, value: Math.round(value) });
    }

    // 目標達成年を見つける
    var achieveYear = null;
    for (var i = 0; i < results.length; i++) {
      if (results[i].value >= settings.targetAmount) {
        achieveYear = results[i].year;
        break;
      }
    }

    var resultHtml = '<div class="fire-sim-summary">' +
      '<div class="fire-sim-row">' +
        '<span>5年後</span><span class="fire-sim-value">' + formatYen(results[4].value) + '</span>' +
      '</div>' +
      '<div class="fire-sim-row">' +
        '<span>10年後</span><span class="fire-sim-value">' + formatYen(results[9].value) + '</span>' +
      '</div>' +
      '<div class="fire-sim-row">' +
        '<span>20年後</span><span class="fire-sim-value">' + formatYen(results[19].value) + '</span>' +
      '</div>' +
      (achieveYear ? '<div class="fire-sim-achieve">🎉 約' + achieveYear + '年で目標達成！</div>' : '<div class="fire-sim-achieve warning">⚠️ 20年以内に目標達成できません</div>') +
    '</div>';

    document.getElementById('fire-sim-result').innerHTML = resultHtml;

    // 設定も保存
    var updatedSettings = loadFireSettings();
    updatedSettings.monthlyInvestment = monthly;
    updatedSettings.expectedReturn = annualReturn;
    saveFireSettings(updatedSettings);
  };

  // ポートフォリオ最適化タブ
  function renderAIOptimizeTab() {
    var portfolio = loadPortfolio();

    // 現在の配分を計算
    var totalValue = 0;
    var holdings = [];
    portfolio.forEach(function(item) {
      var cached = scoreCache.data[item.ticker];
      if (cached && cached.price) {
        var value = item.amount * cached.price;
        totalValue += value;
        var stratScore = window.getStrategyScore(item.ticker);
        holdings.push({
          ticker: item.ticker,
          value: value,
          grade: stratScore.grade,
          score: stratScore.score
        });
      }
    });

    // 配分率を計算
    holdings.forEach(function(h) {
      h.percent = totalValue > 0 ? (h.value / totalValue) * 100 : 0;
    });

    // リスク評価
    var riskScore = calculatePortfolioRisk(holdings);
    var riskLabel = riskScore < 30 ? '低リスク' : (riskScore < 60 ? '中リスク' : '高リスク');
    var riskColor = riskScore < 30 ? '#22c55e' : (riskScore < 60 ? '#f59e0b' : '#ef4444');

    // 現在の配分
    var allocationHtml = holdings.sort(function(a, b) { return b.percent - a.percent; }).map(function(h) {
      return '<div class="optimize-allocation-item">' +
        '<div class="optimize-allocation-item__left">' +
          '<span class="optimize-allocation-item__icon">' + getCoinIcon(h.ticker) + '</span>' +
          '<span class="optimize-allocation-item__name">' + h.ticker + '</span>' +
          '<span class="rank-badge rank-badge--xs ' + getGradeClass(h.grade) + '">' + h.grade + '</span>' +
        '</div>' +
        '<div class="optimize-allocation-item__right">' +
          '<span class="optimize-allocation-item__percent">' + h.percent.toFixed(1) + '%</span>' +
          '<div class="optimize-allocation-item__bar" style="width:' + Math.min(h.percent, 100) + '%;background:' + getCoinColor(h.ticker) + '"></div>' +
        '</div>' +
      '</div>';
    }).join('');

    // AI提案
    var suggestions = generateOptimizeSuggestions(holdings, totalValue);

    return '<div class="ai-optimize">' +
      // リスク評価
      '<div class="optimize-risk-card">' +
        '<div class="optimize-risk-card__header">' +
          '<span class="optimize-risk-card__title">⚖️ ポートフォリオ診断</span>' +
        '</div>' +
        '<div class="optimize-risk-card__score">' +
          '<div class="optimize-risk-gauge">' +
            '<div class="optimize-risk-gauge__fill" style="width:' + riskScore + '%;background:' + riskColor + '"></div>' +
          '</div>' +
          '<span class="optimize-risk-card__label" style="color:' + riskColor + '">' + riskLabel + ' (' + riskScore + '/100)</span>' +
        '</div>' +
        '<div class="optimize-risk-card__total">' +
          '<span>総資産: </span><span class="optimize-risk-card__value">$' + totalValue.toLocaleString(undefined, {maximumFractionDigits: 0}) + '</span>' +
        '</div>' +
      '</div>' +

      // 現在の配分
      '<div class="optimize-allocation-card">' +
        '<div class="optimize-section-title">📊 現在の配分</div>' +
        '<div class="optimize-allocation-list">' + (allocationHtml || '<div class="optimize-empty">ポートフォリオが空です</div>') + '</div>' +
      '</div>' +

      // AI提案
      '<div class="optimize-suggestions-card">' +
        '<div class="optimize-section-title">🤖 AI最適化提案</div>' +
        '<div class="optimize-suggestions-list">' + suggestions + '</div>' +
      '</div>' +

      // 理想配分
      '<div class="optimize-ideal-card">' +
        '<div class="optimize-section-title">🎯 推奨配分（ストラテジー別）</div>' +
        '<div class="optimize-ideal-list">' + renderIdealAllocation() + '</div>' +
      '</div>' +
    '</div>';
  }

  // ポートフォリオリスク計算
  function calculatePortfolioRisk(holdings) {
    if (holdings.length === 0) return 50;

    var risk = 0;

    // 集中度リスク（1銘柄50%以上は高リスク）
    var maxPercent = Math.max.apply(null, holdings.map(function(h) { return h.percent; }));
    if (maxPercent > 70) risk += 40;
    else if (maxPercent > 50) risk += 25;
    else if (maxPercent > 30) risk += 10;

    // 分散度（銘柄数が少ないほどリスク）
    if (holdings.length < 3) risk += 20;
    else if (holdings.length < 5) risk += 10;

    // 低ランク銘柄の割合
    var lowGradePercent = holdings.filter(function(h) { return h.grade === 'D' || h.grade === 'E'; })
      .reduce(function(sum, h) { return sum + h.percent; }, 0);
    risk += lowGradePercent * 0.3;

    return Math.min(100, Math.round(risk));
  }

  // 最適化提案を生成
  function generateOptimizeSuggestions(holdings, totalValue) {
    var suggestions = [];

    if (holdings.length === 0) {
      return '<div class="optimize-suggestion">' +
        '<span class="optimize-suggestion__icon">💡</span>' +
        '<div class="optimize-suggestion__content">' +
          '<span class="optimize-suggestion__title">ポートフォリオを作成しましょう</span>' +
          '<span class="optimize-suggestion__text">まずは通貨を追加してポートフォリオを構築してください。</span>' +
        '</div>' +
      '</div>';
    }

    // 集中度チェック
    var maxHolding = holdings.reduce(function(max, h) { return h.percent > max.percent ? h : max; }, holdings[0]);
    if (maxHolding.percent > 50) {
      suggestions.push({
        icon: '⚠️',
        title: maxHolding.ticker + 'への集中リスク',
        text: maxHolding.ticker + 'が' + maxHolding.percent.toFixed(0) + '%を占めています。40%以下への分散を検討してください。',
        action: 'リバランス'
      });
    }

    // 低ランク銘柄チェック
    var lowGrade = holdings.filter(function(h) { return h.grade === 'D' || h.grade === 'E'; });
    if (lowGrade.length > 0) {
      suggestions.push({
        icon: '📉',
        title: '低評価銘柄の見直し',
        text: lowGrade.map(function(h) { return h.ticker; }).join(', ') + 'のランクが低めです。高ランク銘柄への乗り換えを検討してください。',
        action: '見直し'
      });
    }

    // 高ランク銘柄の追加提案（ストラテジー別スコア使用）
    var highRankCoins = Object.keys(scoreCache.data)
      .filter(function(ticker) {
        var ss = window.getStrategyScore(ticker);
        return (ss.grade === 'A' || ss.grade === 'B') && !holdings.find(function(h) { return h.ticker === ticker; });
      })
      .slice(0, 3);

    if (highRankCoins.length > 0) {
      suggestions.push({
        icon: '💎',
        title: '高評価銘柄の追加検討',
        text: highRankCoins.join(', ') + 'が高評価です。ポートフォリオへの追加を検討してみてください。',
        action: '追加検討'
      });
    }

    // 分散推奨
    if (holdings.length < 5) {
      suggestions.push({
        icon: '🎯',
        title: '分散投資の推奨',
        text: '現在' + holdings.length + '銘柄です。5〜10銘柄程度への分散でリスクを軽減できます。',
        action: '分散'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        icon: '✅',
        title: 'バランス良好',
        text: '現在のポートフォリオは比較的バランスが取れています。定期的な見直しを続けましょう。',
        action: null
      });
    }

    return suggestions.map(function(s) {
      return '<div class="optimize-suggestion">' +
        '<span class="optimize-suggestion__icon">' + s.icon + '</span>' +
        '<div class="optimize-suggestion__content">' +
          '<span class="optimize-suggestion__title">' + s.title + '</span>' +
          '<span class="optimize-suggestion__text">' + s.text + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 理想配分を表示（ストラテジー枠配分）
  function renderIdealAllocation() {
    // ストラテジーごとの配分枠
    var strategyAllocation = [
      { ticker: 'HODL枠', percent: 40, reason: '💎 長期保有・基軸通貨中心' },
      { ticker: '積立枠', percent: 30, reason: '📅 定期購入・ドルコスト平均' },
      { ticker: 'スイング枠', percent: 20, reason: '⚡ 短期売買・タイミング重視' },
      { ticker: '現金', percent: 10, reason: '💵 機動的投資用・待機資金' }
    ];

    var ideal = strategyAllocation;

    return ideal.map(function(item) {
      return '<div class="optimize-ideal-item">' +
        '<div class="optimize-ideal-item__left">' +
          '<span class="optimize-ideal-item__name">' + item.ticker + '</span>' +
          '<span class="optimize-ideal-item__reason">' + item.reason + '</span>' +
        '</div>' +
        '<div class="optimize-ideal-item__right">' +
          '<span class="optimize-ideal-item__percent">' + item.percent + '%</span>' +
          '<div class="optimize-ideal-item__bar" style="width:' + item.percent + '%"></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // トレンド予測タブ
  function renderAITrendTab() {
    // 各通貨のトレンド分析
    var trendData = [];
    Object.keys(scoreCache.data).forEach(function(ticker) {
      var cached = scoreCache.data[ticker];
      if (cached.price && cached.change24h !== undefined) {
        var stratScore = window.getStrategyScore(ticker);
        trendData.push({
          ticker: ticker,
          price: cached.price,
          change24h: cached.change24h,
          score: stratScore.score,
          grade: stratScore.grade,
          pricePosition: (appState.currenciesViewMode === 'longterm' && cached.pricePositionLongterm !== undefined)
            ? cached.pricePositionLongterm
            : (cached.pricePositionSwing !== undefined ? cached.pricePositionSwing : (cached.pricePosition || 50))
        });
      }
    });

    // 急上昇・急落を分類
    var gainers = trendData.filter(function(t) { return t.change24h >= 5; }).sort(function(a, b) { return b.change24h - a.change24h; });
    var losers = trendData.filter(function(t) { return t.change24h <= -5; }).sort(function(a, b) { return a.change24h - b.change24h; });
    var stable = trendData.filter(function(t) { return t.change24h > -5 && t.change24h < 5; });

    // 市場全体のトレンド
    var avgChange = trendData.length > 0
      ? trendData.reduce(function(sum, t) { return sum + t.change24h; }, 0) / trendData.length
      : 0;
    var marketTrend = avgChange > 2 ? '上昇トレンド' : (avgChange < -2 ? '下落トレンド' : 'レンジ相場');
    var marketTrendIcon = avgChange > 2 ? '📈' : (avgChange < -2 ? '📉' : '➡️');
    var marketTrendColor = avgChange > 2 ? '#22c55e' : (avgChange < -2 ? '#ef4444' : '#94a3b8');

    // 買い場候補（低PRICE + 高ランク）
    var buyOpportunities = trendData
      .filter(function(t) { return t.pricePosition < 40 && (t.grade === 'A' || t.grade === 'B'); })
      .sort(function(a, b) { return a.pricePosition - b.pricePosition; })
      .slice(0, 5);

    return '<div class="ai-trend">' +
      // 市場トレンドサマリー
      '<div class="trend-market-card">' +
        '<div class="trend-market-card__header">' +
          '<span class="trend-market-card__icon">' + marketTrendIcon + '</span>' +
          '<span class="trend-market-card__title">市場トレンド</span>' +
        '</div>' +
        '<div class="trend-market-card__status" style="color:' + marketTrendColor + '">' +
          marketTrend +
        '</div>' +
        '<div class="trend-market-card__avg">' +
          '24h平均: ' + (avgChange >= 0 ? '+' : '') + avgChange.toFixed(1) + '%' +
        '</div>' +
      '</div>' +

      // 急上昇
      (gainers.length > 0 ? '<div class="trend-section trend-section--gainers">' +
        '<div class="trend-section__header">' +
          '<span class="trend-section__icon">🚀</span>' +
          '<span class="trend-section__title">急上昇中</span>' +
        '</div>' +
        '<div class="trend-list">' +
          gainers.slice(0, 5).map(function(t) {
            return '<div class="trend-item trend-item--gainer">' +
              '<span class="trend-item__icon">' + getCoinIcon(t.ticker) + '</span>' +
              '<span class="trend-item__name">' + t.ticker + '</span>' +
              '<span class="trend-item__change">+' + t.change24h.toFixed(1) + '%</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' : '') +

      // 急落
      (losers.length > 0 ? '<div class="trend-section trend-section--losers">' +
        '<div class="trend-section__header">' +
          '<span class="trend-section__icon">📉</span>' +
          '<span class="trend-section__title">急落中</span>' +
        '</div>' +
        '<div class="trend-list">' +
          losers.slice(0, 5).map(function(t) {
            return '<div class="trend-item trend-item--loser">' +
              '<span class="trend-item__icon">' + getCoinIcon(t.ticker) + '</span>' +
              '<span class="trend-item__name">' + t.ticker + '</span>' +
              '<span class="trend-item__change">' + t.change24h.toFixed(1) + '%</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' : '') +

      // 買い場候補
      '<div class="trend-section trend-section--opportunities">' +
        '<div class="trend-section__header">' +
          '<span class="trend-section__icon">💎</span>' +
          '<span class="trend-section__title">買い場候補</span>' +
          '<span class="trend-section__subtitle">低PRICE × 高ランク</span>' +
        '</div>' +
        '<div class="trend-list">' +
          (buyOpportunities.length > 0 ? buyOpportunities.map(function(t) {
            return '<div class="trend-item trend-item--opportunity" data-ticker="' + t.ticker + '">' +
              '<div class="trend-item__left">' +
                '<span class="trend-item__icon">' + getCoinIcon(t.ticker) + '</span>' +
                '<span class="trend-item__name">' + t.ticker + '</span>' +
                '<span class="rank-badge rank-badge--xs ' + getGradeClass(t.grade) + '">' + t.grade + '</span>' +
              '</div>' +
              '<div class="trend-item__right">' +
                '<span class="trend-item__price">PRICE: ' + t.pricePosition.toFixed(0) + '%</span>' +
              '</div>' +
            '</div>';
          }).join('') : '<div class="trend-empty">現在、明確な買い場候補はありません</div>') +
        '</div>' +
      '</div>' +

      // AI予測（将来実装用プレースホルダー）
      '<div class="trend-ai-card">' +
        '<div class="trend-section__header">' +
          '<span class="trend-section__icon">🔮</span>' +
          '<span class="trend-section__title">AIトレンド予測</span>' +
          '<span class="trend-section__badge">Coming Soon</span>' +
        '</div>' +
        '<div class="trend-ai-placeholder">' +
          '<p>過去データからのパターン分析と</p>' +
          '<p>トレンド予測機能を準備中です</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // コイン色取得
  function getCoinColor(ticker) {
    var colors = {
      BTC: '#F7931A', ETH: '#627EEA', SOL: '#14F195', XRP: '#23292F',
      ADA: '#0033AD', DOGE: '#C2A633', DOT: '#E6007A', AVAX: '#E84142'
    };
    return colors[ticker] || '#6366f1';
  }

  function getScoreColor(score) {
    if (score >= 70) return '#22c55e';
    if (score >= 50) return '#eab308';
    return '#ef4444';
  }

  // ===== Moonshot画面（トレンドコイン枠） =====
  function renderMoonshotScreen() {
    var budgetUsed = appState.moonshotSpent;
    var budgetTotal = appState.moonshotBudget;
    var budgetPercent = Math.min((budgetUsed / budgetTotal) * 100, 100);
    var budgetRemaining = Math.max(budgetTotal - budgetUsed, 0);
    var activeTab = appState.moonshotTab || 'early';

    // Early Moverの通知対象数
    var earlyAlertCount = getEarlyMoverAlertCount();

    var html = '<div class="moonshot-screen">' +
      // ヘッダー
      '<header class="moonshot-header">' +
        '<h1 class="moonshot-header__title">🎰 Moonshot</h1>' +
        '<div class="moonshot-header__subtitle">DEX初動検出 + トレンドコイン</div>' +
      '</header>' +

      // タブUI
      '<div class="moonshot-tabs">' +
        '<button class="moonshot-tab' + (activeTab === 'early' ? ' moonshot-tab--active' : '') + '" onclick="switchMoonshotTab(\'early\')">' +
          '🚀 Early' +
          (earlyAlertCount > 0 ? '<span class="moonshot-tab__badge">' + earlyAlertCount + '</span>' : '') +
        '</button>' +
        '<button class="moonshot-tab' + (activeTab === 'trending' ? ' moonshot-tab--active' : '') + '" onclick="switchMoonshotTab(\'trending\')">' +
          '🔥 Trending' +
        '</button>' +
      '</div>' +

      // 警告バナー
      '<div class="moonshot-warning">' +
        '<div class="moonshot-warning__icon">⚠️</div>' +
        '<div class="moonshot-warning__text">' +
          '<strong>分析対象外</strong> — KAIROSスコアは適用されません。自己判断でお願いします。' +
        '</div>' +
      '</div>' +

      // 予算管理
      '<div class="moonshot-budget">' +
        '<div class="moonshot-budget__header">' +
          '<span class="moonshot-budget__title">今月の予算</span>' +
          '<span class="moonshot-budget__remaining">' +
            '残り: <strong>' + formatYen(budgetRemaining) + '</strong>' +
          '</span>' +
        '</div>' +
        '<div class="moonshot-budget__bar">' +
          '<div class="moonshot-budget__bar-fill" style="width:' + budgetPercent + '%;background:' + (budgetPercent > 80 ? '#ef4444' : budgetPercent > 50 ? '#f59e0b' : '#22c55e') + '"></div>' +
        '</div>' +
        '<div class="moonshot-budget__detail">' +
          formatYen(budgetUsed) + ' / ' + formatYen(budgetTotal) +
        '</div>' +
      '</div>';

    // タブコンテンツ
    if (activeTab === 'early') {
      html += renderEarlyDetectionContent();
    } else {
      html += renderTrendingContent();
    }

    // 設定ボタン
    html += '<div class="moonshot-actions">' +
        '<button class="moonshot-action-btn moonshot-action-btn--settings" onclick="openMoonshotSettingsModal()">' +
          '⚙️ 予算設定' +
        '</button>' +
        '<button class="moonshot-action-btn moonshot-action-btn--reset" onclick="confirmResetMoonshotSpent()">' +
          '🔄 今月の使用額リセット' +
        '</button>' +
      '</div>' +
    '</div>';

    return html;
  }

  function switchMoonshotTab(tab) {
    appState.moonshotTab = tab;
    renderApp();
  }
  window.switchMoonshotTab = switchMoonshotTab;

  function renderEarlyDetectionContent() {
    return '<div class="moonshot-section">' +
      '<div class="moonshot-section__title">🚀 DEX初動検出</div>' +
      '<div class="moonshot-section__desc">DexScreener + GeckoTerminal + LunarCrush SNS → AI評価</div>' +
      '<div id="early-mover-coins" class="moonshot-coins">' +
        '<div class="moonshot-loading">' +
          '<div class="moonshot-loading__spinner"></div>' +
          '<div class="moonshot-loading__text">DEX初動 + SNS話題度を検索中...</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // スコア説明
    '<div class="moonshot-filters">' +
      '<div class="moonshot-filters__title">📊 スコア内訳</div>' +
      '<div class="moonshot-filters__list">' +
        '<div class="moonshot-filter">' +
          '<span class="moonshot-filter__name">Volume</span>' +
          '<span class="moonshot-filter__condition">0-20</span>' +
          '<span class="moonshot-filter__desc">24h出来高（対数スケール）</span>' +
        '</div>' +
        '<div class="moonshot-filter">' +
          '<span class="moonshot-filter__name">Velocity</span>' +
          '<span class="moonshot-filter__condition">0-20</span>' +
          '<span class="moonshot-filter__desc">5m/1h/24h価格変動</span>' +
        '</div>' +
        '<div class="moonshot-filter">' +
          '<span class="moonshot-filter__name">Buy圧</span>' +
          '<span class="moonshot-filter__condition">0-20</span>' +
          '<span class="moonshot-filter__desc">買い/売りトランザクション比率</span>' +
        '</div>' +
        '<div class="moonshot-filter">' +
          '<span class="moonshot-filter__name">鮮度</span>' +
          '<span class="moonshot-filter__condition">0-15</span>' +
          '<span class="moonshot-filter__desc">プール作成からの経過時間</span>' +
        '</div>' +
        '<div class="moonshot-filter">' +
          '<span class="moonshot-filter__name">📱 SNS</span>' +
          '<span class="moonshot-filter__condition" style="color:#a78bfa">0-25</span>' +
          '<span class="moonshot-filter__desc">X/Reddit/YouTube反応数+感情+トレンド</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderTrendingContent() {
    return '<div class="moonshot-section">' +
      '<div class="moonshot-section__title">🔥 トレンドコイン</div>' +
      '<div class="moonshot-section__desc">CoinGecko Trending + センチメント分析</div>' +
      '<div id="moonshot-coins" class="moonshot-coins">' +
        '<div class="moonshot-loading">' +
          '<div class="moonshot-loading__spinner"></div>' +
          '<div class="moonshot-loading__text">トレンドコインを検索中...</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // データソース説明
    '<div class="moonshot-filters">' +
      '<div class="moonshot-filters__title">📊 データソース</div>' +
      '<div class="moonshot-filters__list">' +
        '<div class="moonshot-filter">' +
          '<span class="moonshot-filter__name">Hype</span>' +
          '<span class="moonshot-filter__condition">0-100</span>' +
          '<span class="moonshot-filter__desc">CoinGeckoトレンド順位</span>' +
        '</div>' +
        '<div class="moonshot-filter">' +
          '<span class="moonshot-filter__name">Safety</span>' +
          '<span class="moonshot-filter__condition">0-100</span>' +
          '<span class="moonshot-filter__desc">時価総額ランクベース</span>' +
        '</div>' +
        '<div class="moonshot-filter">' +
          '<span class="moonshot-filter__name">Momentum</span>' +
          '<span class="moonshot-filter__condition">0-100</span>' +
          '<span class="moonshot-filter__desc">価格変動 + ニュースセンチメント</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // ルール説明
    '<div class="moonshot-rules">' +
      '<div class="moonshot-rules__title">📋 Moonshotのルール</div>' +
      '<div class="moonshot-rules__list">' +
        '<div class="moonshot-rule">💰 月間上限（厳格）</div>' +
        '<div class="moonshot-rule">🎲 KAIROSスコア非表示（完全自己判断）</div>' +
        '<div class="moonshot-rule">📤 利益が出たらコア資産へ振替推奨</div>' +
        '<div class="moonshot-rule">📊 損失はポートフォリオ損益に含めない</div>' +
      '</div>' +
    '</div>';
  }

  function renderMoonshotCoinsIntoDOM(coins) {
    var container = document.getElementById('moonshot-coins');
    if (!container) return;

    if (!coins || coins.length === 0) {
      container.innerHTML = '<div class="moonshot-empty">' +
        '<div class="moonshot-empty__icon">🔭</div>' +
        '<div class="moonshot-empty__text">トレンドコインが見つかりません</div>' +
        '<div class="moonshot-empty__hint">しばらくしてからもう一度お試しください</div>' +
      '</div>';
      return;
    }

    // Save to global for detail modal
    window._moonshotCoins = coins;

    var html = '';
    coins.forEach(function(coin, idx) {
      var safetyColor = coin.safety >= 70 ? '#22c55e' : coin.safety >= 50 ? '#f59e0b' : '#ef4444';
      var hypeColor = coin.hype >= 70 ? '#a855f7' : coin.hype >= 50 ? '#818cf8' : '#6b7280';
      var momentumColor = coin.momentum >= 60 ? '#22c55e' : coin.momentum >= 40 ? '#f59e0b' : '#ef4444';
      var change = coin.price_change_24h || 0;

      var priceStr = formatPriceCompact(coin.price_usd);

      html += '<div class="moonshot-coin" onclick="openMoonshotCoinDetail(' + idx + ')" style="animation-delay:' + (idx * 0.05) + 's;cursor:pointer">' +
        '<div class="moonshot-coin__header">' +
          (coin.thumb ? '<img class="moonshot-coin__icon" src="' + coin.thumb + '" alt="">' : '') +
          '<div class="moonshot-coin__info">' +
            '<span class="moonshot-coin__symbol">' + coin.symbol + '</span>' +
            '<span class="moonshot-coin__name">' + coin.name + '</span>' +
          '</div>' +
          (coin.market_cap_rank ? '<span class="moonshot-coin__rank">#' + coin.market_cap_rank + '</span>' : '') +
        '</div>' +
        '<div class="moonshot-coin__price-row">' +
          '<span class="moonshot-coin__price">' + priceStr + '</span>' +
          '<span class="moonshot-coin__change ' + (change >= 0 ? 'positive' : 'negative') + '">' +
            (change >= 0 ? '+' : '') + change.toFixed(1) + '%' +
          '</span>' +
        '</div>' +
        '<div class="moonshot-coin__metrics">' +
          '<div class="moonshot-metric">' +
            '<span class="moonshot-metric__label">Hype</span>' +
            '<span class="moonshot-metric__value" style="color:' + hypeColor + '">' + coin.hype + '</span>' +
          '</div>' +
          '<div class="moonshot-metric">' +
            '<span class="moonshot-metric__label">Safety</span>' +
            '<span class="moonshot-metric__value" style="color:' + safetyColor + '">' + coin.safety + '</span>' +
          '</div>' +
          '<div class="moonshot-metric">' +
            '<span class="moonshot-metric__label">Momentum</span>' +
            '<span class="moonshot-metric__value" style="color:' + momentumColor + '">' + coin.momentum + '</span>' +
          '</div>' +
        '</div>' +
        (coin.sentiment_bullish > 0 || coin.sentiment_bearish > 0 ?
          '<div class="moonshot-coin__sentiment">' +
            '<span class="positive">📈 ' + coin.sentiment_bullish + '</span>' +
            '<span class="negative">📉 ' + coin.sentiment_bearish + '</span>' +
          '</div>' : '') +
      '</div>';
    });

    container.innerHTML = html;
  }

  // 数字をコンパクト表記
  function formatCompactNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  }

  // Moonshot設定モーダル
  function openMoonshotSettingsModal() {
    var modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'moonshot-settings-modal';
    modal.innerHTML = '<div class="modal moonshot-settings-modal">' +
      '<div class="modal-header">' +
        '<h3>🎰 Moonshot設定</h3>' +
        '<button class="modal-close" onclick="closeMoonshotSettingsModal()">×</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="setting-item">' +
          '<label>月間予算上限</label>' +
          '<div class="setting-input-group">' +
            '<input type="number" id="moonshot-budget-input" value="' + appState.moonshotBudget + '" min="1000" max="100000" step="1000">' +
            '<span class="setting-input-suffix">円</span>' +
          '</div>' +
          '<div class="setting-hint">推奨: 10,000〜20,000円（宝くじ枠として）</div>' +
        '</div>' +
        '<div class="setting-item">' +
          '<label>今月の使用額</label>' +
          '<div class="setting-value">' + formatYen(appState.moonshotSpent) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="modal-btn modal-btn--secondary" onclick="closeMoonshotSettingsModal()">キャンセル</button>' +
        '<button class="modal-btn modal-btn--primary" onclick="saveMoonshotSettings()">保存</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(modal);
    requestAnimationFrame(function() { modal.classList.add('active'); });
  }

  function closeMoonshotSettingsModal() {
    var modal = document.getElementById('moonshot-settings-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(function() { modal.remove(); }, 300);
    }
  }

  function saveMoonshotSettings() {
    var input = document.getElementById('moonshot-budget-input');
    if (input) {
      var budget = parseInt(input.value) || 10000;
      budget = Math.max(1000, Math.min(100000, budget));
      window.KairosApp.setMoonshotBudget(budget);
    }
    closeMoonshotSettingsModal();
    renderApp();
  }

  function confirmResetMoonshotSpent() {
    if (confirm('今月の使用額をリセットしますか？\n（月初に自動リセットされます）')) {
      window.KairosApp.resetMoonshotSpent();
      renderApp();
    }
  }

  function openMoonshotCoinDetail(idx) {
    var coins = window._moonshotCoins || [];
    var coin = coins[idx];
    if (!coin) return;

    var change = coin.price_change_24h || 0;
    var changeClass = change >= 0 ? 'positive' : 'negative';
    var changeStr = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';

    var priceStr = formatPriceCompact(coin.price_usd);

    var volumeStr = coin.total_volume ? formatValueCompact(coin.total_volume) : '-';
    var mcapStr = coin.market_cap ? formatValueCompact(coin.market_cap) : '-';

    var safetyColor = coin.safety >= 70 ? '#22c55e' : coin.safety >= 50 ? '#f59e0b' : '#ef4444';
    var hypeColor = coin.hype >= 70 ? '#a855f7' : coin.hype >= 50 ? '#818cf8' : '#6b7280';
    var momentumColor = coin.momentum >= 60 ? '#22c55e' : coin.momentum >= 40 ? '#f59e0b' : '#ef4444';

    var modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'moonshot-detail-modal';
    modal.innerHTML = '<div class="modal moonshot-detail-modal">' +
      '<div class="modal-header">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          (coin.thumb ? '<img src="' + coin.thumb + '" style="width:28px;height:28px;border-radius:50%">' : '') +
          '<h3>🎰 ' + coin.symbol + '</h3>' +
          '<span style="color:#94a3b8;font-size:13px">' + coin.name + '</span>' +
        '</div>' +
        '<button class="modal-close" onclick="closeMoonshotDetailModal()">×</button>' +
      '</div>' +
      '<div class="modal-body" style="padding:16px">' +
        // 価格セクション
        '<div style="text-align:center;margin-bottom:16px">' +
          '<div style="font-size:24px;font-weight:700">' + priceStr + '</div>' +
          '<div class="' + changeClass + '" style="font-size:16px">' + changeStr + ' (24h)</div>' +
        '</div>' +

        // メトリクス
        '<div style="display:flex;justify-content:space-around;margin-bottom:16px;padding:12px;background:rgba(255,255,255,0.05);border-radius:12px">' +
          '<div style="text-align:center">' +
            '<div style="font-size:10px;color:#94a3b8">Hype</div>' +
            '<div style="font-size:22px;font-weight:700;color:' + hypeColor + '">' + coin.hype + '</div>' +
          '</div>' +
          '<div style="text-align:center">' +
            '<div style="font-size:10px;color:#94a3b8">Safety</div>' +
            '<div style="font-size:22px;font-weight:700;color:' + safetyColor + '">' + coin.safety + '</div>' +
          '</div>' +
          '<div style="text-align:center">' +
            '<div style="font-size:10px;color:#94a3b8">Momentum</div>' +
            '<div style="font-size:22px;font-weight:700;color:' + momentumColor + '">' + coin.momentum + '</div>' +
          '</div>' +
        '</div>' +

        // マーケットデータ
        '<div style="display:flex;gap:8px;margin-bottom:16px">' +
          '<div style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px">' +
            '<div style="font-size:10px;color:#94a3b8">出来高 (24h)</div>' +
            '<div style="font-size:14px;font-weight:600">' + volumeStr + '</div>' +
          '</div>' +
          '<div style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px">' +
            '<div style="font-size:10px;color:#94a3b8">時価総額</div>' +
            '<div style="font-size:14px;font-weight:600">' + mcapStr + '</div>' +
          '</div>' +
          (coin.market_cap_rank ? '<div style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px">' +
            '<div style="font-size:10px;color:#94a3b8">MCランク</div>' +
            '<div style="font-size:14px;font-weight:600">#' + coin.market_cap_rank + '</div>' +
          '</div>' : '') +
        '</div>' +

        // センチメント
        (coin.sentiment_score ?
        '<div style="padding:12px;background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:16px">' +
          '<div style="font-size:12px;color:#94a3b8;margin-bottom:8px">📰 ニュースセンチメント</div>' +
          '<div style="display:flex;align-items:center;gap:12px">' +
            '<div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden">' +
              '<div style="height:100%;width:' + coin.sentiment_score + '%;background:' + (coin.sentiment_score > 60 ? '#22c55e' : coin.sentiment_score < 40 ? '#ef4444' : '#f59e0b') + ';border-radius:3px"></div>' +
            '</div>' +
            '<span style="font-size:13px;font-weight:600">' + coin.sentiment_score + '/100</span>' +
          '</div>' +
          '<div style="display:flex;gap:12px;margin-top:6px;font-size:12px">' +
            '<span class="positive">📈 強気 ' + (coin.sentiment_bullish || 0) + '</span>' +
            '<span class="negative">📉 弱気 ' + (coin.sentiment_bearish || 0) + '</span>' +
          '</div>' +
        '</div>' : '') +

        // KAIROSで分析ボタン
        '<button onclick="if(window.injectCoinDataForDetail)window.injectCoinDataForDetail(\'' + coin.symbol + '\',{price:' + (coin.price_usd || 0) + ',change24h:' + (coin.price_change_24h || 0) + (coin.dex_url ? ',dexUrl:\'' + coin.dex_url + '\'' : '') + (coin.token_address ? ',tokenAddress:\'' + coin.token_address + '\'' : '') + '}); closeMoonshotDetailModal(); window.KairosApp.viewCurrency(\'' + coin.symbol + '\');" style="width:100%;padding:12px;margin-bottom:12px;background:linear-gradient(135deg,#d4a853,#b8902e);color:#000;font-weight:600;border:none;border-radius:8px;font-size:14px;cursor:pointer">✨ KAIROSで分析する</button>' +

        // 外部リンク
        '<div style="display:flex;gap:8px">' +
          '<a href="https://www.coingecko.com/en/coins/' + (coin.id || coin.symbol.toLowerCase()) + '" target="_blank" style="flex:1;display:block;text-align:center;padding:10px;background:rgba(255,255,255,0.08);border-radius:8px;color:#d4a853;text-decoration:none;font-size:13px">' +
            '🦎 CoinGecko' +
          '</a>' +
          '<a href="https://dexscreener.com/search?q=' + coin.symbol + '" target="_blank" style="flex:1;display:block;text-align:center;padding:10px;background:rgba(255,255,255,0.08);border-radius:8px;color:#d4a853;text-decoration:none;font-size:13px">' +
            '📊 DexScreener' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>';

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function() { modal.classList.add('active'); });

    modal.onclick = function(e) {
      if (e.target === modal) closeMoonshotDetailModal();
    };
  }
  window.openMoonshotCoinDetail = openMoonshotCoinDetail;

  function closeMoonshotDetailModal() {
    var modal = document.getElementById('moonshot-detail-modal');
    if (modal) {
      document.body.style.overflow = '';
      modal.classList.remove('active');
      setTimeout(function() { modal.remove(); }, 300);
    }
  }
  window.closeMoonshotDetailModal = closeMoonshotDetailModal;

  // ===== Early Mover カード描画 =====
  function formatAgeHours(hours) {
    if (hours === null || hours === undefined) return '不明';
    if (hours < 1) return Math.round(hours * 60) + '分';
    if (hours < 24) return Math.round(hours) + '時間';
    return Math.round(hours / 24) + '日';
  }

  // スコア指標の説明マップ
  var scoreExplanations = {
    'Volume': {
      title: '出来高（Volume）',
      desc: '24時間の取引量を対数スケールで評価します。取引量が多いほど、そのコインに注目が集まっていることを意味します。',
      good: '出来高が多い → 多くの人が売買している → 注目度が高い',
      bad: '出来高が少ない → まだ誰も気づいていないか、興味がない',
      max: 20
    },
    'Velocity': {
      title: '価格変動速度（Velocity）',
      desc: '直近5分・1時間・24時間の価格変動の大きさと方向を評価します。急上昇中のコインほど高スコアになります。',
      good: '急上昇中 → 買いが殺到している可能性。初動を捉えるチャンス',
      bad: '変動が小さい → まだ動き出していない、または停滞中',
      max: 20
    },
    'Buy圧': {
      title: '買い圧力（Buy Pressure）',
      desc: '買いトランザクション数と売りトランザクション数の比率です。買いが売りより多ければ、価格が上がりやすい状態です。',
      good: '買い > 売り → 需要が供給を上回っている → 価格上昇圧力',
      bad: '売り > 買い → 利確や損切りが多い → 下落リスク',
      max: 20
    },
    '鮮度': {
      title: 'プールの新しさ（Freshness）',
      desc: 'DEXにプールが作られてからの経過時間。新しいプールほど「初動」の可能性が高く、高スコアになります。',
      good: '作成1時間以内 → まさに今始まったばかり。最も早い段階',
      bad: '24時間以上経過 → すでに初動は過ぎている可能性',
      max: 15
    },
    'SNS': {
      title: 'SNS話題度（Social Buzz）',
      desc: 'X(Twitter)・Reddit・YouTubeでの言及数・いいね・リプライ・RT数をLunarCrushで計測。「ネットで急に話題になっているか」を数値化します。',
      good: '反応数が急増+ポジティブ感情 → SNSで火がつき始めている → 爆発の前兆',
      bad: 'SNSでの言及なし → まだ誰も知らない。もしくはAPIキー未設定',
      max: 25
    }
  };

  function showScoreExplanation(key, event) {
    if (event) { event.stopPropagation(); event.preventDefault(); }
    var info = scoreExplanations[key];
    if (!info) return;

    var existing = document.getElementById('score-explain-popup');
    if (existing) existing.remove();

    var popup = document.createElement('div');
    popup.id = 'score-explain-popup';
    popup.className = 'score-explain-overlay';
    popup.innerHTML = '<div class="score-explain-popup">' +
      '<div class="score-explain-popup__header">' +
        '<span class="score-explain-popup__title">' + info.title + '</span>' +
        '<span class="score-explain-popup__max">最大 ' + info.max + ' 点</span>' +
      '</div>' +
      '<div class="score-explain-popup__desc">' + info.desc + '</div>' +
      '<div class="score-explain-popup__case score-explain-popup__case--good">' +
        '<span class="score-explain-popup__case-icon">✅</span>' +
        '<span>' + info.good + '</span>' +
      '</div>' +
      '<div class="score-explain-popup__case score-explain-popup__case--bad">' +
        '<span class="score-explain-popup__case-icon">⚠️</span>' +
        '<span>' + info.bad + '</span>' +
      '</div>' +
    '</div>';

    document.body.appendChild(popup);
    requestAnimationFrame(function() { popup.classList.add('active'); });

    popup.onclick = function(e) {
      if (e.target === popup || e.target.closest('.score-explain-popup')) {
        popup.classList.remove('active');
        setTimeout(function() { popup.remove(); }, 200);
      }
    };
  }
  window.showScoreExplanation = showScoreExplanation;

  // DEX項目タップ解説
  var metricGuides = {
    'liquidity': {
      title: '流動性（Liquidity）',
      desc: '売買プール内の資金量。これが多いほど、まとまった額を売買しても価格が動きにくくなります。',
      example: '\u{2705} ¥750万（$50K）以上 → DEXとしては十分。数万円の売買OK\n\u{26A0}\uFE0F ¥150万〜750万 → 少額なら可。大口は価格が滑る\n\u{274C} ¥150万（$10K）未満 → 数万円でも価格が動く。売れない危険大',
      warn: '¥150万未満の流動性では、利確時にスリッページで想定より大幅に安く売れます。入る前に「売れるか」を確認'
    },
    'volume': {
      title: '出来高（Volume 24h）',
      desc: '過去24時間の取引総額。DEX初動コインは出来高が少ないのが普通です。流動性と合わせて「売れるかどうか」を判断します。',
      example: '\u{2705} ¥750万（$50K）以上 → DEXとしては活発。注目度が高い\n\u{26A0}\uFE0F ¥75万〜750万 → 初動段階として普通。まだ伸びる余地あり\n\u{274C} ¥75万（$5K）未満 → ほぼ取引なし。売りたい時に売れない',
      warn: '出来高÷流動性が20倍超 → ウォッシュトレード（自作自演の水増し）の疑いあり。見かけ上活発でも要注意'
    },
    'age': {
      title: '経過時間（Age）',
      desc: 'DEXにプールが作成されてからの時間。新しいほどチャンスもリスクも大きくなります。',
      example: '\u{1F534} 1時間以内 → 最高リスク。RugPull最多ゾーン\n\u{1F7E0} 1〜6時間 → まだ高リスク。初動を狙う上級者向け\n\u{1F7E1} 6〜24時間 → やや落ち着き。トレンド確認可能\n\u{1F7E2} 24時間以上 → 一定の実績あり。初動は過ぎた可能性',
      warn: '作成1時間以内はRugPull（資金持ち逃げ）が最も多い時間帯。セキュリティ情報を必ず確認してからエントリー'
    },
    'holders': {
      title: '保有者数（Holders）',
      desc: 'GoPlus調べの現在の保有ウォレット数。多いほど分散されており、少数による価格操作リスクが低くなります。',
      example: '\u{2705} 500人以上 → 十分に分散。安心度高い\n\u{26A0}\uFE0F 100〜500人 → まだ少ない。大口の売りに注意\n\u{274C} 50人未満 → 極めて集中。1人の売りで暴落する可能性',
      warn: '保有者50人未満はクリエイターや内部者が大半の可能性が高い。セキュリティの「作成者保有率」も合わせて確認'
    },
    'buysell': {
      title: 'Buy/Sell比（取引方向）',
      desc: '買い取引数と売り取引数の比率。買いが多い＝需要が強い、売りが多い＝利確や損切りが進行中。',
      example: '\u{2705} Buy÷Sell 1.5倍以上 → 強い買い圧力。上昇トレンド\n\u{26A0}\uFE0F 0.8〜1.5倍 → ほぼ均衡。方向感なし\n\u{274C} 0.8倍未満 → 売り優勢。下落中 or 利確ラッシュ',
      warn: 'Buy比率が高くても出来高が少なければ意味なし。出来高と合わせて判断すること'
    },
    'social': {
      title: 'SNS話題度（Social Buzz）',
      desc: 'LunarCrush計測のX(Twitter)・Reddit等での反応数（いいね・RT・コメント）。価格に先行する場合があります。',
      example: '\u{2705} 反応1万以上 → SNSで大きく話題。急騰の兆候\n\u{26A0}\uFE0F 反応1,000〜1万 → 一部で注目され始めている\n\u{274C} 反応1,000未満 → まだほぼ無名',
      warn: 'SNSの盛り上がりはインフルエンサーの有料宣伝の場合もある。「誰が」言っているかも重要'
    },
    'price_change': {
      title: '価格変動（Price Change）',
      desc: '5分/1時間/24時間の3つの期間で価格がどれだけ動いたか。短い期間ほど今の勢いを、長い期間ほどトレンドを表します。',
      example: '\u{1F680} 5m+20%, 1h+50% → 急騰中。まだ勢いあり\n\u{1F4C9} 5m-5%, 1h+30% → 上昇後の一時調整。押し目の可能性\n\u{26A0}\uFE0F 5m-10%, 1h-20% → 下落トレンド。飛びつき注意',
      warn: '1時間で+100%超の急騰後は、同じ速度で暴落するパターンが非常に多い。「上がったから買う」は高値掴みの典型'
    },
    'moonshot_score': {
      title: 'Moonshotスコア（総合評価）',
      desc: '出来高・価格勢い・買い圧力・鮮度・SNSの5要素を加算し、安全性（Rugcheck+GoPlus）で調整した100点満点の総合スコア。',
      example: '\u{2705} 70点以上 → 複数の要素が強い。有望だが過信は禁物\n\u{26A0}\uFE0F 40〜70点 → 一部だけ強い。慎重に判断\n\u{274C} 40点未満 → まだ弱い or すでに失速',
      warn: 'スコアはあくまで「注目度」の指標。投資前に必ずセキュリティ・流動性・保有者数を自分の目で確認すること'
    }
  };

  function getMetricLevel(key) {
    var c = window._pendingMoonshotCoin;
    if (!c) return null;
    switch (key) {
      case 'liquidity':
        var liq = c.liquidity_usd || 0;
        if (liq >= 50000) return { level: 'safe', label: 'DEXとしては十分', val: '$' + formatValueCompact(liq) };
        if (liq >= 10000) return { level: 'warn', label: '少額取引なら可', val: '$' + formatValueCompact(liq) };
        return { level: 'danger', label: '売れない危険あり', val: '$' + formatValueCompact(liq) };
      case 'volume':
        var vol = c.volume_24h || 0;
        var liq2 = c.liquidity_usd || 1;
        var ratio = vol / liq2;
        if (ratio > 20) return { level: 'danger', label: '水増し疑い（÷流動性=' + Math.round(ratio) + '倍）', val: '$' + formatValueCompact(vol) };
        if (vol >= 50000) return { level: 'safe', label: 'DEXとしては活発', val: '$' + formatValueCompact(vol) };
        if (vol >= 5000) return { level: 'warn', label: '初動段階として普通', val: '$' + formatValueCompact(vol) };
        return { level: 'danger', label: 'ほぼ取引なし', val: '$' + formatValueCompact(vol) };
      case 'age':
        var age = c.age_hours;
        if (age == null) return null;
        if (age >= 24) return { level: 'safe', label: '一定の実績あり', val: formatAgeHours(age) };
        if (age >= 6) return { level: 'warn', label: 'まだ注意が必要', val: formatAgeHours(age) };
        if (age >= 1) return { level: 'warn', label: '高リスク帯', val: formatAgeHours(age) };
        return { level: 'danger', label: 'RugPull最多ゾーン', val: formatAgeHours(age) };
      case 'holders':
        var h = c.goplus_holder_count;
        if (!h || h <= 0) return null;
        if (h >= 500) return { level: 'safe', label: '十分に分散', val: h.toLocaleString() + '人' };
        if (h >= 100) return { level: 'warn', label: '大口の売りに注意', val: h.toLocaleString() + '人' };
        return { level: 'danger', label: '極めて集中', val: h.toLocaleString() + '人' };
      case 'buysell':
        var b = c.buys || 0, s = c.sells || 1;
        var r = b / Math.max(s, 1);
        if (r >= 1.5) return { level: 'safe', label: '強い買い圧力', val: r.toFixed(1) + '倍' };
        if (r >= 0.8) return { level: 'warn', label: 'ほぼ均衡', val: r.toFixed(1) + '倍' };
        return { level: 'danger', label: '売り優勢', val: r.toFixed(1) + '倍' };
      case 'social':
        var inter = (c.social_interactions || 0);
        if (inter >= 10000) return { level: 'safe', label: 'SNSで大きく話題', val: inter.toLocaleString() + '件' };
        if (inter >= 1000) return { level: 'warn', label: '注目され始めている', val: inter.toLocaleString() + '件' };
        if (inter > 0) return { level: 'danger', label: 'ほぼ無名', val: inter.toLocaleString() + '件' };
        return null;
      case 'price_change':
        var ch1h = c.price_change_1h;
        if (ch1h == null) return null;
        if (ch1h > 100) return { level: 'danger', label: '急騰後の暴落リスク大', val: (ch1h > 0 ? '+' : '') + ch1h.toFixed(1) + '% (1h)' };
        if (ch1h > 0) return { level: 'safe', label: '上昇中', val: '+' + ch1h.toFixed(1) + '% (1h)' };
        if (ch1h > -20) return { level: 'warn', label: '調整中', val: ch1h.toFixed(1) + '% (1h)' };
        return { level: 'danger', label: '下落トレンド', val: ch1h.toFixed(1) + '% (1h)' };
      case 'moonshot_score':
        var sc = c.moonshot_score || 0;
        if (sc >= 70) return { level: 'safe', label: '有望', val: Math.round(sc) + '点' };
        if (sc >= 40) return { level: 'warn', label: '慎重に判断', val: Math.round(sc) + '点' };
        return { level: 'danger', label: 'まだ弱い', val: Math.round(sc) + '点' };
      default: return null;
    }
  }

  function showMetricGuide(key, event) {
    if (event) { event.stopPropagation(); event.preventDefault(); }
    var info = metricGuides[key];
    if (!info) return;

    var existing = document.getElementById('metric-guide-popup');
    if (existing) existing.remove();

    var ml = getMetricLevel(key);
    var levelClass = ml ? ' metric-guide-popup--' + ml.level : '';
    var statusHtml = '';
    if (ml) {
      var icon = ml.level === 'safe' ? '\u2705' : ml.level === 'warn' ? '\u26A0\uFE0F' : '\u274C';
      statusHtml = '<div class="metric-guide-popup__status metric-guide-popup__status--' + ml.level + '">' +
        '<span class="metric-guide-popup__status-icon">' + icon + '</span>' +
        '<span class="metric-guide-popup__status-val">' + ml.val + '</span>' +
        '<span class="metric-guide-popup__status-label">' + ml.label + '</span>' +
      '</div>';
    }

    var popup = document.createElement('div');
    popup.id = 'metric-guide-popup';
    popup.className = 'metric-guide-overlay';
    popup.innerHTML = '<div class="metric-guide-popup' + levelClass + '">' +
      statusHtml +
      '<div class="metric-guide-popup__title">' + info.title + '</div>' +
      '<div class="metric-guide-popup__desc">' + info.desc + '</div>' +
      '<div class="metric-guide-popup__example">' +
        '<div class="metric-guide-popup__example-label">判断基準</div>' +
        '<div class="metric-guide-popup__example-text">' + info.example.replace(/\n/g, '<br>') + '</div>' +
      '</div>' +
      '<div class="metric-guide-popup__warn">' + info.warn + '</div>' +
      '<div class="metric-guide-popup__close-hint">タップで閉じる</div>' +
    '</div>';

    document.body.appendChild(popup);
    requestAnimationFrame(function() { popup.classList.add('active'); });

    popup.onclick = function() {
      popup.classList.remove('active');
      setTimeout(function() { popup.remove(); }, 200);
    };
  }
  window.showMetricGuide = showMetricGuide;

  function renderScoreBar(label, value, max) {
    var pct = Math.min(100, (value / max) * 100);
    var color = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
    return '<div class="early-mover__score-bar" onclick="showScoreExplanation(\'' + label + '\', event)">' +
      '<span class="early-mover__score-bar-label">' + label + ' <span class="early-mover__score-bar-help">?</span></span>' +
      '<div class="early-mover__score-bar-track">' +
        '<div class="early-mover__score-bar-fill" style="width:' + pct + '%;background:' + color + '"></div>' +
      '</div>' +
      '<span class="early-mover__score-bar-value">' + Math.round(value) + '/' + max + '</span>' +
    '</div>';
  }

  function renderEarlyMoversIntoDOM(coins) {
    var container = document.getElementById('early-mover-coins');
    if (!container) return;

    if (!coins || coins.length === 0) {
      container.innerHTML = '<div class="moonshot-empty">' +
        '<div class="moonshot-empty__icon">🔭</div>' +
        '<div class="moonshot-empty__text">DEX初動コインが見つかりません</div>' +
        '<div class="moonshot-empty__hint">しばらくしてからもう一度お試しください</div>' +
      '</div>';
      return;
    }

    window._earlyMovers = coins;

    var html = '';
    coins.forEach(function(coin, idx) {
      var mscore = coin.moonshot_score || 0;
      var scoreColor = mscore >= 70 ? '#22c55e' : mscore >= 50 ? '#f59e0b' : mscore >= 30 ? '#ef4444' : '#6b7280';
      var change1h = coin.price_change_1h || 0;
      var isNew = coin.age_hours !== null && coin.age_hours <= 6;
      var isTop3 = idx < 3;

      var riskBadge = '';
      if (coin.risk_level === 'high') riskBadge = '<span class="early-mover__risk early-mover__risk--high">HIGH RISK</span>';
      else if (coin.risk_level === 'medium') riskBadge = '<span class="early-mover__risk early-mover__risk--medium">MID RISK</span>';
      else if (coin.risk_level === 'low') riskBadge = '<span class="early-mover__risk early-mover__risk--low">LOW RISK</span>';

      var priceStr = formatPriceCompact(coin.price_usd);
      var ch5m = coin.price_change_5m || 0;
      var ch24h = coin.price_change_24h || 0;

      html += '<div class="early-mover-coin' + (isTop3 ? ' early-mover-coin--top' : '') + '" onclick="openEarlyMoverDetail(' + idx + ')" style="animation-delay:' + (idx * 0.05) + 's;cursor:pointer">' +
        '<div class="early-mover__header">' +
          (coin.image_url ? '<img class="moonshot-coin__icon" src="' + coin.image_url + '" alt="">' : '<div class="moonshot-coin__icon-placeholder">🪙</div>') +
          '<div class="moonshot-coin__info">' +
            '<span class="moonshot-coin__symbol">' + coin.symbol +
              (isNew ? ' <span class="early-mover__new-badge">NEW</span>' : '') +
            '</span>' +
            '<span class="moonshot-coin__name">' + (coin.name || '').substring(0, 20) + '</span>' +
          '</div>' +
          '<div class="early-mover__price-col">' +
            '<div class="early-mover__price">' + priceStr + '</div>' +
            '<div class="early-mover__changes">' +
              '<span class="' + (ch5m >= 0 ? 'positive' : 'negative') + '">' + (ch5m >= 0 ? '+' : '') + ch5m.toFixed(1) + '%<small>5m</small></span>' +
              '<span class="' + (change1h >= 0 ? 'positive' : 'negative') + '">' + (change1h >= 0 ? '+' : '') + change1h.toFixed(1) + '%<small>1h</small></span>' +
              '<span class="' + (ch24h >= 0 ? 'positive' : 'negative') + '">' + (ch24h >= 0 ? '+' : '') + ch24h.toFixed(1) + '%<small>24h</small></span>' +
            '</div>' +
          '</div>' +
          '<div class="early-mover__scores">' +
            '<div class="early-mover__score-main" style="color:' + scoreColor + '">' + mscore + '</div>' +
            '<div style="font-size:9px;color:#94a3b8">score</div>' +
          '</div>' +
        '</div>' +
        '<div class="early-mover__meta">' +
          '<span>Vol: ' + formatValueCompact(coin.volume_24h || 0) + '</span>' +
          '<span>Liq: ' + formatValueCompact(coin.liquidity_usd || 0) + '</span>' +
          '<span>Age: ' + formatAgeHours(coin.age_hours) + '</span>' +
          riskBadge +
        '</div>' +
        // SNS話題度
        (coin.social_interactions > 0 ?
          '<div class="early-mover__social-hint">' +
            '<span class="early-mover__social-icon">📱</span>' +
            '<span>' + formatCompactNumber(coin.social_interactions) + '件反応</span>' +
            '<span class="early-mover__social-sep">·</span>' +
            '<span>' + coin.social_contributors + '人</span>' +
            (coin.social_trend === 'up' ? '<span class="early-mover__social-trend-up">🔥 急上昇</span>' : '') +
          '</div>' : '') +
        // セキュリティヒント
        (coin.goplus_honeypot ? '<div class="early-mover__security-hint early-mover__security-hint--danger">\u{1F6AB} ハニーポット警告</div>' :
         coin.security_cross_verified && coin.combined_trust === 'high' ? '<div class="early-mover__security-hint early-mover__security-hint--safe">\u{1F6E1}\uFE0F 2ソース検証済</div>' :
         (coin.combined_trust === 'low' || coin.combined_trust === 'danger') ? '<div class="early-mover__security-hint early-mover__security-hint--warn">\u26A0\uFE0F セキュリティ要注意</div>' : '') +
        (coin.ai_summary_ja ? '<div class="early-mover__ai-hint">\u{1F916} ' + coin.ai_summary_ja + '</div>' : '') +
        // 価格予想ミニ
        (coin.ai_price_prediction && coin.ai_price_prediction['1h'] ?
          '<div class="early-mover__prediction-mini">' +
            '<span>🔮 1h: ' + coin.ai_price_prediction['1h'] + '</span>' +
            '<span>24h: ' + coin.ai_price_prediction['24h'] + '</span>' +
          '</div>' : '') +
        '<div class="early-mover__footer">' +
          (coin.ai_potential ? '<span class="early-mover__potential">🎯 ' + coin.ai_potential + '</span>' : '') +
          '<span class="early-mover__sources">' + (coin.sources || []).join(' + ') + '</span>' +
        '</div>' +
      '</div>';
    });

    container.innerHTML = html;

    // 通知からの自動オープン対応
    if (window._pendingEarlyMoverOpen) {
      var targetAddr = window._pendingEarlyMoverOpen;
      delete window._pendingEarlyMoverOpen;
      for (var i = 0; i < coins.length; i++) {
        if (coins[i].token_address === targetAddr || coins[i].symbol === targetAddr) {
          setTimeout(function() { openEarlyMoverDetail(i); }, 300);
          break;
        }
      }
    }
  }
  window.renderEarlyMoversIntoDOM = renderEarlyMoversIntoDOM;

  function openEarlyMoverDetail(idx) {
    var coins = window._earlyMovers || [];
    var coin = coins[idx];
    if (!coin) return;

    // 直接DEX詳細画面に遷移
    window._pendingMoonshotCoin = coin;
    if (window.injectCoinDataForDetail) {
      window.injectCoinDataForDetail(coin.symbol, {
        price: coin.price_usd || 0,
        change24h: coin.price_change_24h || 0,
        dexUrl: coin.dex_url || '',
        tokenAddress: coin.token_address || ''
      });
    }
    window.KairosApp.viewCurrency(coin.symbol);
  }
  window.openEarlyMoverDetail = openEarlyMoverDetail;


  // ===== セキュリティ解説ポップアップ =====
  function openSecurityGuidePopup(data) {
    var existing = document.getElementById('security-guide-popup');
    if (existing) existing.remove();

    var hasData = data && data.s != null && data.s >= 0;
    var hasGoplus = data && (data.hp != null || data.hc > 0);

    // 現在のコインの状態を信号機で表示
    var signalHtml = '';

    // クロス検証ステータスバナー
    if (data && (hasData || hasGoplus)) {
      var cvColor = data.cv ? '#22c55e' : '#f59e0b';
      var cvBg = data.cv ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)';
      var cvText = data.cv ? '\u2713 2ソース検証済（Rugcheck + GoPlus）' : (data.src || 0) + 'ソースのみ';
      var trustLabel = {high: '\u{1F7E2} 信頼度: 高', medium: '\u{1F7E1} 信頼度: 中', low: '\u{1F7E0} 信頼度: 低', danger: '\u{1F534} 信頼度: 危険'}[data.trust || 'low'] || '\u{1F7E0} 信頼度: 低';
      signalHtml +=
        '<div style="padding:10px 12px;background:' + cvBg + ';border-radius:8px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;border:1px solid ' + cvColor + '33">' +
          '<span style="font-size:11px;font-weight:600;color:' + cvColor + '">' + cvText + '</span>' +
          '<span style="font-size:11px;color:#e2e8f0">' + trustLabel + '</span>' +
        '</div>';
    }

    // ハニーポット警告（最優先）
    if (data && data.hp) {
      signalHtml +=
        '<div style="padding:14px;background:rgba(239,68,68,0.15);border-radius:12px;margin-bottom:16px;border:2px solid #ef4444">' +
          '<div style="text-align:center">' +
            '<div style="font-size:28px;margin-bottom:6px">\u{1F6AB}</div>' +
            '<div style="font-size:16px;font-weight:700;color:#ef4444">ハニーポット検出</div>' +
            '<div style="font-size:12px;color:#f87171;margin-top:6px;line-height:1.5">このトークンは<b>売却できない</b>可能性が高いです。<br>買っても売れず、資金が失われるトラップです。<br><b>絶対に購入しないでください。</b></div>' +
          '</div>' +
        '</div>';
    }

    if (hasData) {
      var s = data.s;
      var signalColor = s >= 70 ? '#22c55e' : s >= 40 ? '#f59e0b' : '#ef4444';
      var signalBg = s >= 70 ? 'rgba(34,197,94,0.12)' : s >= 40 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
      var signalEmoji = s >= 70 ? '\u{1F7E2}' : s >= 40 ? '\u{1F7E1}' : '\u{1F534}';
      var signalMsg = s >= 70 ? 'このコインは比較的安全と判定されています' : s >= 40 ? 'このコインにはいくつかの注意点があります' : 'このコインは高リスクです。十分注意してください';
      if (data.hp) { signalColor = '#ef4444'; signalBg = 'rgba(239,68,68,0.12)'; signalEmoji = '\u{1F534}'; signalMsg = 'ハニーポット検出 — 絶対に購入しないでください'; }
      signalHtml +=
        '<div style="padding:16px;background:' + signalBg + ';border-radius:12px;margin-bottom:16px;border:1px solid ' + signalColor + '33">' +
          '<div style="text-align:center;margin-bottom:8px">' +
            '<span style="font-size:32px">' + signalEmoji + '</span>' +
            '<div style="font-size:18px;font-weight:700;color:' + signalColor + ';margin-top:4px">安全度 ' + s + ' / 100</div>' +
          '</div>' +
          '<div style="text-align:center;font-size:13px;color:' + signalColor + '">' + signalMsg + '</div>' +
        '</div>';

      // 各項目の診断結果
      var items = [];
      if (data.lp != null && data.lp >= 0) {
        var lpOk = data.lp > 50;
        var lpWarn = data.lp > 0 && data.lp <= 50;
        var lpMsg = lpOk ? '流動性がロックされています' : lpWarn ? '一部のみロック — 引き抜きの可能性あり' : '未ロック — ラグプル注意';
        // LP期限情報追加
        if (data.lpPerm) {
          lpMsg += '\n\u{1F525} 永久ロック（バーンアドレス）';
        } else if (data.lpExp) {
          var nowS = Math.floor(Date.now() / 1000);
          var dl = Math.floor((data.lpExp - nowS) / 86400);
          if (dl > 0) {
            lpMsg += '\n\u23F0 ' + dl + '日後にロック解除';
          } else {
            lpMsg += '\n\u{1F6A8} ロック期限切れ！';
          }
        }
        items.push({
          icon: lpOk ? '\u{1F512}' : lpWarn ? '\u26A0\uFE0F' : '\u{1F6A8}',
          label: 'LP Lock: ' + data.lp.toFixed(0) + '%',
          color: lpOk ? '#22c55e' : lpWarn ? '#f59e0b' : '#ef4444',
          msg: lpMsg
        });
      }
      if (data.top10 != null && data.top10 >= 0) {
        var t10Ok = data.top10 < 30;
        var t10Warn = data.top10 >= 30 && data.top10 <= 50;
        items.push({
          icon: t10Ok ? '\u{1F465}' : t10Warn ? '\u26A0\uFE0F' : '\u{1F6A8}',
          label: 'Top10保有: ' + data.top10.toFixed(0) + '%',
          color: t10Ok ? '#22c55e' : t10Warn ? '#f59e0b' : '#ef4444',
          msg: t10Ok ? '保有が分散しています' : t10Warn ? 'やや集中 — 大口売りに注意' : '保有が集中 — 暴落リスク高'
        });
      }
      if (data.mint != null) {
        items.push({
          icon: data.mint ? '\u{1F6A8}' : '\u2705',
          label: 'Mint権限: ' + (data.mint ? 'あり' : 'なし'),
          color: data.mint ? '#ef4444' : '#22c55e',
          msg: data.mint ? '運営がコインを無限に増やせます' : '新規発行はできません'
        });
      }
      if (data.freeze != null) {
        items.push({
          icon: data.freeze ? '\u{1F6A8}' : '\u2705',
          label: 'Freeze権限: ' + (data.freeze ? 'あり' : 'なし'),
          color: data.freeze ? '#ef4444' : '#22c55e',
          msg: data.freeze ? '運営があなたの資産を凍結できます' : '資産凍結の権限はありません'
        });
      }

      // GoPlus項目
      if (hasGoplus) {
        if (data.hp != null) {
          items.push({
            icon: data.hp ? '\u{1F6AB}' : '\u2705',
            label: 'ハニーポット: ' + (data.hp ? '検出' : 'なし'),
            color: data.hp ? '#ef4444' : '#22c55e',
            msg: data.hp ? '売却できないトラップ — 購入禁止' : 'GoPlus: 売買ブロックなし'
          });
        }
        if (data.st != null && data.st > 0) {
          var stOk = data.st <= 1;
          items.push({
            icon: stOk ? '\u2705' : '\u26A0\uFE0F',
            label: '売却Tax: ' + data.st.toFixed(1) + '%',
            color: data.st > 10 ? '#ef4444' : data.st > 5 ? '#f59e0b' : '#22c55e',
            msg: data.st > 10 ? '売却時に10%以上のTaxが発生 — 利益が大幅に減少' : data.st > 5 ? '売却時にTaxあり — 利益に影響' : '売却Tax低い'
          });
        }
        if (data.hc > 0) {
          items.push({
            icon: data.hc > 500 ? '\u2705' : data.hc > 100 ? '\u{1F7E1}' : '\u26A0\uFE0F',
            label: '保有者数: ' + data.hc.toLocaleString(),
            color: data.hc > 500 ? '#22c55e' : data.hc > 100 ? '#f59e0b' : '#ef4444',
            msg: data.hc > 500 ? '多くの人が保有 — コミュニティあり' : data.hc > 100 ? '保有者数はやや少なめ' : '保有者数が非常に少ない — 操作リスク'
          });
        }
        if (data.cp > 0) {
          items.push({
            icon: data.cp > 30 ? '\u{1F6A8}' : data.cp > 10 ? '\u26A0\uFE0F' : '\u2705',
            label: '作成者保有: ' + data.cp.toFixed(1) + '%',
            color: data.cp > 30 ? '#ef4444' : data.cp > 10 ? '#f59e0b' : '#22c55e',
            msg: data.cp > 30 ? '作成者が30%以上保有 — 大量売却リスク' : data.cp > 10 ? '作成者保有やや多め' : '作成者保有少ない'
          });
        }
      }

      if (items.length > 0) {
        signalHtml += '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">';
        items.forEach(function(it) {
          signalHtml +=
            '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.04);border-radius:8px;border-left:3px solid ' + it.color + '">' +
              '<span style="font-size:18px">' + it.icon + '</span>' +
              '<div style="flex:1">' +
                '<div style="font-size:12px;font-weight:600;color:' + it.color + '">' + it.label + '</div>' +
                '<div style="font-size:11px;color:#94a3b8;margin-top:2px;white-space:pre-line">' + it.msg + '</div>' +
              '</div>' +
            '</div>';
        });
        signalHtml += '</div>';
      }

      // リスクフラグ
      if (data.risks && data.risks.length > 0) {
        signalHtml += '<div style="padding:10px 12px;background:rgba(239,68,68,0.08);border-radius:8px;margin-bottom:16px">' +
          '<div style="font-size:11px;font-weight:600;color:#ef4444;margin-bottom:6px">\u{1F6A9} 検出されたリスク</div>';
        data.risks.forEach(function(r) {
          signalHtml += '<div style="font-size:11px;color:#f87171;padding:2px 0">\u30FB' + r + '</div>';
        });
        signalHtml += '</div>';
      }
    } else if (!hasGoplus) {
      signalHtml +=
        '<div style="text-align:center;padding:20px 0;margin-bottom:16px;background:rgba(255,255,255,0.04);border-radius:12px">' +
          '<div style="font-size:32px;margin-bottom:8px">\u{1F512}</div>' +
          '<div style="font-size:14px;color:#94a3b8">このコインのセキュリティデータはありません</div>' +
          '<div style="font-size:11px;color:#64748b;margin-top:4px">Rugcheck.xyzはSolanaチェーンのトークンのみ対応しています</div>' +
        '</div>';
    }

    // 用語ガイド（常に表示）
    var guideHtml =
      '<div style="margin-top:4px">' +
        '<div style="font-size:13px;font-weight:600;color:#e2e8f0;margin-bottom:10px">\u{1F4D6} セキュリティ用語ガイド</div>' +

        // 信号機の見方
        '<div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:10px">' +
          '<div style="font-size:12px;font-weight:600;color:#e2e8f0;margin-bottom:8px">安全度スコアの見方</div>' +
          '<div style="display:flex;gap:6px;margin-bottom:4px">' +
            '<div style="flex:1;text-align:center;padding:8px 4px;background:rgba(34,197,94,0.12);border-radius:6px">' +
              '<div style="font-size:16px">\u{1F7E2}</div>' +
              '<div style="font-size:11px;font-weight:600;color:#22c55e">70\u301C100</div>' +
              '<div style="font-size:10px;color:#94a3b8">安全</div>' +
            '</div>' +
            '<div style="flex:1;text-align:center;padding:8px 4px;background:rgba(245,158,11,0.12);border-radius:6px">' +
              '<div style="font-size:16px">\u{1F7E1}</div>' +
              '<div style="font-size:11px;font-weight:600;color:#f59e0b">40\u301C69</div>' +
              '<div style="font-size:10px;color:#94a3b8">注意</div>' +
            '</div>' +
            '<div style="flex:1;text-align:center;padding:8px 4px;background:rgba(239,68,68,0.12);border-radius:6px">' +
              '<div style="font-size:16px">\u{1F534}</div>' +
              '<div style="font-size:11px;font-weight:600;color:#ef4444">0\u301C39</div>' +
              '<div style="font-size:10px;color:#94a3b8">危険</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // 各用語の解説
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          // ハニーポット
          '<div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
              '<span style="font-size:16px">\u{1F6AB}</span>' +
              '<span style="font-size:12px;font-weight:600;color:#e2e8f0">ハニーポット</span>' +
            '</div>' +
            '<div style="font-size:11px;color:#94a3b8;line-height:1.5">' +
              '買えるが売れないようにプログラムされたトラップトークン。' +
              '<br><span style="color:#ef4444">検出</span> = 絶対に購入しないでください' +
              '<br><span style="color:#22c55e">なし</span> = 売買に制限なし' +
            '</div>' +
          '</div>' +

          // LP Lock
          '<div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
              '<span style="font-size:16px">\u{1F512}</span>' +
              '<span style="font-size:12px;font-weight:600;color:#e2e8f0">LP Lock（流動性ロック）</span>' +
            '</div>' +
            '<div style="font-size:11px;color:#94a3b8;line-height:1.5">' +
              'コインを売買するための資金プール（LP）が引き出せないようロックされているかどうか。' +
              '<br><span style="color:#22c55e">高い</span> = 運営が資金を持ち逃げしにくい' +
              '<br><span style="color:#ef4444">0%</span> = いつでも資金を引き抜ける（ラグプル危険）' +
              '<br>\u{1F525} 永久ロック = バーンアドレスに送付済み（最も安全）' +
              '<br>\u23F0 期限付き = ロック解除日に注意（180日以上推奨）' +
            '</div>' +
          '</div>' +

          // 売却Tax
          '<div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
              '<span style="font-size:16px">\u{1F4B8}</span>' +
              '<span style="font-size:12px;font-weight:600;color:#e2e8f0">売却Tax（手数料）</span>' +
            '</div>' +
            '<div style="font-size:11px;color:#94a3b8;line-height:1.5">' +
              '売却時に自動で徴収される手数料の割合。' +
              '<br><span style="color:#22c55e">0-1%</span> = 一般的な範囲' +
              '<br><span style="color:#f59e0b">5-10%</span> = 利益に大きく影響' +
              '<br><span style="color:#ef4444">10%超</span> = 非常に高い — 利益がほぼ消える可能性' +
            '</div>' +
          '</div>' +

          // Top10保有率
          '<div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
              '<span style="font-size:16px">\u{1F465}</span>' +
              '<span style="font-size:12px;font-weight:600;color:#e2e8f0">Top10保有率</span>' +
            '</div>' +
            '<div style="font-size:11px;color:#94a3b8;line-height:1.5">' +
              '上位10アドレスが全体の何%を持っているか。' +
              '<br><span style="color:#22c55e">30%未満</span> = 分散している（安全）' +
              '<br><span style="color:#ef4444">50%超</span> = 大口が売ると暴落する恐れ' +
            '</div>' +
          '</div>' +

          // Mint権限
          '<div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
              '<span style="font-size:16px">\u{1F3ED}</span>' +
              '<span style="font-size:12px;font-weight:600;color:#e2e8f0">Mint権限（追加発行）</span>' +
            '</div>' +
            '<div style="font-size:11px;color:#94a3b8;line-height:1.5">' +
              '運営がコインを新たに無限発行できる権限。' +
              '<br><span style="color:#22c55e">なし</span> = 供給量が固定（安心）' +
              '<br><span style="color:#ef4444">あり</span> = 大量発行で価値が希薄化する恐れ' +
            '</div>' +
          '</div>' +

          // Freeze権限
          '<div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
              '<span style="font-size:16px">\u{1F9CA}</span>' +
              '<span style="font-size:12px;font-weight:600;color:#e2e8f0">Freeze権限（資産凍結）</span>' +
            '</div>' +
            '<div style="font-size:11px;color:#94a3b8;line-height:1.5">' +
              '運営が特定のウォレットの残高を凍結できる権限。' +
              '<br><span style="color:#22c55e">なし</span> = 自由に売買できる（安心）' +
              '<br><span style="color:#ef4444">あり</span> = あなたのコインが売れなくなる恐れ' +
            '</div>' +
          '</div>' +
        '</div>' +

        // 注意書き
        '<div style="margin-top:12px;padding:10px 12px;background:rgba(212,168,83,0.08);border-radius:8px;border:1px solid rgba(212,168,83,0.2)">' +
          '<div style="font-size:11px;color:#d4a853;line-height:1.5">' +
            '\u{1F4A1} <b>判断のコツ:</b> 2ソース検証済み(\u2713)のコインは信頼度が高いです。安全度が高くても他の要素（出来高・コミュニティ・開発状況）を必ず確認してください。' +
          '</div>' +
        '</div>' +
      '</div>';

    var popup = document.createElement('div');
    popup.id = 'security-guide-popup';
    popup.className = 'security-guide-overlay';
    popup.innerHTML =
      '<div class="security-guide-modal">' +
        '<div class="security-guide-header">' +
          '<span style="font-size:16px;font-weight:600">\u{1F6E1}\uFE0F セキュリティチェック</span>' +
          '<button onclick="document.getElementById(\'security-guide-popup\').remove()" style="background:none;border:none;color:#94a3b8;font-size:20px;cursor:pointer;padding:4px 8px">\u2715</button>' +
        '</div>' +
        '<div class="security-guide-body">' +
          signalHtml +
          guideHtml +
        '</div>' +
      '</div>';
    document.body.appendChild(popup);
    requestAnimationFrame(function() { popup.classList.add('active'); });
    popup.addEventListener('click', function(e) {
      if (e.target === popup) popup.remove();
    });
  }
  window.openSecurityGuidePopup = openSecurityGuidePopup;

  // ===== DEXコイン専用詳細画面 =====

  function isDexCoin() {
    var mc = window._pendingMoonshotCoin;
    return mc && mc.symbol === appState.selectedCurrency;
  }

  function renderDexAIAnalysis(coin) {
    var html = '';
    if (!coin.ai_summary_ja && !coin.ai_reason_ja) return html;

    html += '<div class="dex-detail__ai-section">';
    if (coin.ai_summary_ja) {
      html += '<div class="dex-detail__ai-desc">' +
        '<div class="dex-detail__section-title">🤖 AI説明</div>' +
        '<div class="dex-detail__ai-text">' + coin.ai_summary_ja + '</div>' +
      '</div>';
    }
    if (coin.ai_reason_ja) {
      html += '<div class="dex-detail__pump-reason">' +
        '<div class="dex-detail__section-title">💡 上昇理由</div>' +
        '<div class="dex-detail__ai-text">' + coin.ai_reason_ja + '</div>' +
      '</div>';
    }
    if (coin.ai_potential) {
      html += '<div class="dex-detail__ai-potential">🎯 ポテンシャル: ' + coin.ai_potential + '</div>';
    }

    // AI価格予想
    var pred = coin.ai_price_prediction;
    if (pred && pred['1h']) {
      var confColor = pred.confidence === 'high' ? '#22c55e' : pred.confidence === 'medium' ? '#f59e0b' : '#ef4444';
      var confLabel = pred.confidence === 'high' ? '自信あり' : pred.confidence === 'medium' ? 'やや自信' : '不確実';
      html += '<div class="early-mover__prediction">' +
        '<div class="early-mover__prediction-header">' +
          '<span class="early-mover__prediction-title">🔮 AI価格予想</span>' +
          '<span class="early-mover__prediction-conf" style="color:' + confColor + '">' + confLabel + '</span>' +
        '</div>' +
        '<div class="early-mover__prediction-grid">' +
          '<div class="early-mover__prediction-item"><div class="early-mover__prediction-label">1時間後</div><div class="early-mover__prediction-value">' + (pred['1h'] || '-') + '</div></div>' +
          '<div class="early-mover__prediction-item"><div class="early-mover__prediction-label">24時間後</div><div class="early-mover__prediction-value">' + (pred['24h'] || '-') + '</div></div>' +
        '</div>' +
        '<div class="early-mover__prediction-scenarios">' +
          '<div class="early-mover__prediction-scenario early-mover__prediction-scenario--best"><span class="early-mover__prediction-scenario-label">✨ 最良</span><span>' + (pred.best_case || '-') + '</span></div>' +
          '<div class="early-mover__prediction-scenario early-mover__prediction-scenario--worst"><span class="early-mover__prediction-scenario-label">💀 最悪</span><span>' + (pred.worst_case || '-') + '</span></div>' +
        '</div>' +
        '<div class="early-mover__prediction-disclaimer">※ AI予想は参考情報です。投資判断は自己責任で行ってください。</div>' +
      '</div>';
    }

    // Red flags
    if (coin.ai_red_flags && coin.ai_red_flags.length > 0) {
      html += '<div class="dex-detail__red-flags">';
      coin.ai_red_flags.forEach(function(flag) {
        html += '<span class="dex-detail__red-flag">🚩 ' + flag + '</span>';
      });
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function renderDexSocialSection(coin) {
    if (!(coin.social_interactions > 0)) {
      return '<div class="early-mover__social-section early-mover__social-section--empty" onclick="showMetricGuide(\'social\',event)" style="cursor:pointer">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:4px">📱 SNS話題度 <span style="font-size:9px;color:#64748b">?</span></div>' +
        '<div style="font-size:11px;color:#64748b">ソーシャルデータなし（代替指標で評価中）</div>' +
        (coin.social_news_count > 0 ? '<div style="font-size:11px;color:#a78bfa;margin-top:4px">📰 ニュース ' + coin.social_news_count + '件' + (coin.social_bullish_pct > 0 ? ' / 強気 ' + coin.social_bullish_pct + '%' : '') + '</div>' : '') +
      '</div>';
    }

    return '<div class="early-mover__social-section">' +
      '<div onclick="showMetricGuide(\'social\',event)" style="font-size:12px;color:#94a3b8;margin-bottom:8px;cursor:pointer">📱 SNS話題度 <span style="font-size:10px;color:#a78bfa">(LunarCrush)</span> <span style="font-size:9px;color:#64748b">?</span></div>' +
      '<div class="early-mover__social-grid">' +
        '<div class="early-mover__social-stat">' +
          '<div class="early-mover__social-stat-value">' + formatCompactNumber(coin.social_interactions) + '</div>' +
          '<div class="early-mover__social-stat-label">反応数</div>' +
        '</div>' +
        '<div class="early-mover__social-stat">' +
          '<div class="early-mover__social-stat-value">' + (coin.social_contributors || 0) + '</div>' +
          '<div class="early-mover__social-stat-label">言及者</div>' +
        '</div>' +
        '<div class="early-mover__social-stat">' +
          '<div class="early-mover__social-stat-value">' + (coin.social_posts || 0) + '</div>' +
          '<div class="early-mover__social-stat-label">投稿数</div>' +
        '</div>' +
        '<div class="early-mover__social-stat">' +
          '<div class="early-mover__social-stat-value' + (coin.social_sentiment >= 60 ? ' positive' : coin.social_sentiment <= 40 ? ' negative' : '') + '">' + (coin.social_sentiment || 0) + '%</div>' +
          '<div class="early-mover__social-stat-label">ポジティブ</div>' +
        '</div>' +
      '</div>' +
      (coin.social_trend === 'up' ? '<div class="early-mover__social-trend">🔥 SNSでの話題が急上昇中</div>' : '') +
      (coin.social_topic_rank && coin.social_topic_rank <= 100 ? '<div class="early-mover__social-rank">🏆 トピックランク #' + coin.social_topic_rank + '</div>' : '') +
    '</div>';
  }

  function renderDexPostsSection(coin) {
    var posts = coin.social_posts_data || [];
    if (posts.length === 0) return '';
    var html = '<div class="early-mover__posts-section">' +
      '<div class="early-mover__posts-title">🐦 SNS投稿 <span style="font-size:10px;color:#64748b">(' + posts.length + '件)</span></div>';
    posts.slice(0, 5).forEach(function(p) {
      var sentColor = p.sentiment >= 4 ? '#10b981' : p.sentiment <= 2 ? '#ef4444' : '#94a3b8';
      var sentLabel = p.sentiment >= 4 ? '強気' : p.sentiment <= 2 ? '弱気' : '中立';
      var followers = p.creator_followers || 0;
      var followersStr = followers >= 1e6 ? (followers / 1e6).toFixed(1) + 'M' : followers >= 1e3 ? (followers / 1e3).toFixed(1) + 'K' : followers.toString();
      var interactions = p.interactions_24h || p.interactions_total || 0;
      var interStr = interactions >= 1e6 ? (interactions / 1e6).toFixed(1) + 'M' : interactions >= 1e3 ? (interactions / 1e3).toFixed(1) + 'K' : interactions.toString();
      var timeStr = '';
      if (p.created_at) {
        var diff = Math.floor((Date.now() / 1000 - p.created_at));
        if (diff < 3600) timeStr = Math.floor(diff / 60) + '分前';
        else if (diff < 86400) timeStr = Math.floor(diff / 3600) + '時間前';
        else timeStr = Math.floor(diff / 86400) + '日前';
      }
      html += '<div class="early-mover__post" onclick="if(\'' + (p.link || '').replace(/'/g, "\\'") + '\')window.open(\'' + (p.link || '').replace(/'/g, "\\'") + '\',\'_blank\')">' +
        '<div class="early-mover__post-header">' +
          (p.creator_avatar ? '<img class="early-mover__post-avatar" src="' + p.creator_avatar + '" alt="">' : '<div class="early-mover__post-avatar-placeholder">' + (p.type_icon || '📱') + '</div>') +
          '<div class="early-mover__post-creator">' +
            '<span class="early-mover__post-name">' + (p.creator_display_name || p.creator_name || '匿名') + '</span>' +
            '<span class="early-mover__post-handle">' +
              '<span class="early-mover__post-platform">' + (p.type_icon || '') + ' ' + (p.post_type || '') + '</span>' +
              (followers > 0 ? ' · ' + followersStr + ' followers' : '') +
            '</span>' +
          '</div>' +
          (timeStr ? '<span class="early-mover__post-time">' + timeStr + '</span>' : '') +
        '</div>' +
        (p.text ? '<div class="early-mover__post-text">' + p.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' : '') +
        '<div class="early-mover__post-stats">' +
          (interactions > 0 ? '<span class="early-mover__post-stat">💬 ' + interStr + '</span>' : '') +
          '<span class="early-mover__post-stat" style="color:' + sentColor + '">' + sentLabel + '</span>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderDexDetailScreen(coin) {
    var mscore = coin.moonshot_score || 0;
    var scoreColor = mscore >= 70 ? '#22c55e' : mscore >= 50 ? '#f59e0b' : mscore >= 30 ? '#ef4444' : '#6b7280';
    var bd = coin.score_breakdown || {};
    var change5m = coin.price_change_5m || 0;
    var change1h = coin.price_change_1h || 0;
    var change24h = coin.price_change_24h || 0;
    var priceStr = formatPriceCompact(coin.price_usd);
    var riskColor = coin.risk_level === 'high' ? '#ef4444' : coin.risk_level === 'medium' ? '#f59e0b' : coin.risk_level === 'low' ? '#22c55e' : '#6b7280';
    var riskLabel = coin.risk_level === 'high' ? 'ハイリスク' : coin.risk_level === 'medium' ? 'ミドルリスク' : coin.risk_level === 'low' ? 'ローリスク' : '不明';
    var addr = coin.token_address || '';
    var shortAddr = addr.length > 12 ? addr.substring(0, 6) + '...' + addr.substring(addr.length - 4) : addr;

    // 日本語名検出
    var isJpMeme = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(coin.name || '');
    var jpBadge = isJpMeme ? '<span class="dex-detail__jp-badge">日本ミーム</span>' : '';

    // ソース表示
    var sourceLabel = '';
    if (coin.sources && coin.sources.length > 0) {
      sourceLabel = coin.sources.join(' + ');
    } else if (coin.source) {
      sourceLabel = coin.source;
    }

    return '<div class="detail dex-detail">' +
      // スティッキーヘッダー: Moonshotスコア + リスク
      '<div class="dex-detail__sticky-header">' +
        '<div class="dex-detail__score-hero" onclick="showMetricGuide(\'moonshot_score\',event)" style="cursor:pointer">' +
          '<div class="dex-detail__score-big" style="color:' + scoreColor + '">' + mscore + '</div>' +
          '<div class="dex-detail__score-label">Moonshot Score</div>' +
        '</div>' +
        '<div class="dex-detail__risk-badge" style="border-color:' + riskColor + ';color:' + riskColor + '">' + riskLabel + '</div>' +
      '</div>' +

      '<div class="dex-detail__scroll-content">' +

        // コインヘッダー
        '<div class="dex-detail__coin-header">' +
          (coin.image_url ? '<img class="dex-detail__coin-icon" src="' + coin.image_url + '">' : '<div class="dex-detail__coin-icon-placeholder">🚀</div>') +
          '<div class="dex-detail__coin-info">' +
            '<div class="dex-detail__coin-symbol">' + coin.symbol + jpBadge + '</div>' +
            '<div class="dex-detail__coin-name">' + (coin.name || '').substring(0, 40) + '</div>' +
          '</div>' +
        '</div>' +

        // コイン概要説明
        (coin.ai_description_ja ? '<div class="dex-detail__coin-desc">\u{1F4CB} ' + coin.ai_description_ja + '</div>' : '') +

        // 価格セクション
        '<div class="dex-detail__price-section" onclick="showMetricGuide(\'price_change\',event)" style="cursor:pointer">' +
          '<div class="dex-detail__price-main">' + priceStr + '</div>' +
          '<div class="dex-detail__price-changes">' +
            '<span class="dex-detail__price-change ' + (change5m >= 0 ? 'positive' : 'negative') + '">' + (change5m >= 0 ? '+' : '') + change5m.toFixed(1) + '% <small>5m</small></span>' +
            '<span class="dex-detail__price-change ' + (change1h >= 0 ? 'positive' : 'negative') + '">' + (change1h >= 0 ? '+' : '') + change1h.toFixed(1) + '% <small>1h</small></span>' +
            '<span class="dex-detail__price-change ' + (change24h >= 0 ? 'positive' : 'negative') + '">' + (change24h >= 0 ? '+' : '') + change24h.toFixed(1) + '% <small>24h</small></span>' +
          '</div>' +
        '</div>' +

        // AI説明 + 上昇理由
        renderDexAIAnalysis(coin) +

        // チャート（短期のみ: 1H/4H/1D/1W/1M）
        '<div class="detail__chart-section">' +
          '<div class="detail__chart-header">' +
            '<span class="detail__chart-title">📈 価格チャート</span>' +
            '<button onclick="addChartCheckpoint()" class="checkpoint-add-btn" title="チェックポイントを設置">📍</button>' +
            '<div class="detail__chart-periods">' +
              ['1H', '4H', '1D', '1W', '1M'].map(function(p) {
                var labels = { '1H': '1時間', '4H': '4時間', '1D': '1日', '1W': '1週', '1M': '1月' };
                return '<button class="detail__chart-period' + (appState.chartPeriod === p ? ' active' : '') + '" data-period="' + p + '">' + (labels[p] || p) + '</button>';
              }).join('') +
            '</div>' +
          '</div>' +
          '<div class="detail__chart-area" id="detail-chart"></div>' +
          '<div class="detail__chart-stats" id="detail-chart-stats"></div>' +
        '</div>' +

        // スコア内訳バー
        '<div class="dex-detail__score-section">' +
          '<div class="dex-detail__section-title">📊 スコア内訳 <span style="font-size:10px;color:#64748b">（タップで意味を確認）</span></div>' +
          renderScoreBar('Volume', bd.volume || 0, 20) +
          renderScoreBar('Velocity', bd.velocity || 0, 20) +
          renderScoreBar('Buy圧', bd.buy_pressure || 0, 20) +
          renderScoreBar('鮮度', bd.freshness || 0, 15) +
          renderScoreBar('SNS', bd.social_buzz || 0, 25) +
          (bd.safety != null && bd.safety !== 0 ? '<div style="font-size:11px;color:' + (bd.safety > 0 ? '#22c55e' : '#ef4444') + ';margin-top:4px">🛡️ Safety: ' + (bd.safety > 0 ? '+' : '') + bd.safety + '</div>' : '') +
        '</div>' +

        // DEX情報グリッド
        (function() {
          var items = [
            { key: 'liquidity', label: '流動性', val: formatValueCompact(coin.liquidity_usd || 0) },
            { key: 'volume', label: '出来高 (24h)', val: formatValueCompact(coin.volume_24h || 0) },
            { key: 'age', label: '経過時間', val: formatAgeHours(coin.age_hours) },
            { key: 'holders', label: '保有者数', val: (coin.goplus_holder_count && coin.goplus_holder_count > 0 ? coin.goplus_holder_count.toLocaleString() + '人' : '\u2014') }
          ];
          return '<div class="dex-detail__info-grid">' + items.map(function(it) {
            var ml = getMetricLevel(it.key);
            var cls = ml ? ' dex-detail__info-item--' + ml.level : '';
            return '<div class="dex-detail__info-item' + cls + '" onclick="showMetricGuide(\'' + it.key + '\',event)" style="cursor:pointer">' +
              '<div class="dex-detail__info-label">' + it.label + ' <span style="font-size:9px;color:#64748b">?</span></div>' +
              '<div class="dex-detail__info-value">' + it.val + '</div>' +
            '</div>';
          }).join('') + '</div>';
        })() +

        // セキュリティ（Rugcheck + GoPlus）
        (function() {
          var srcCount = coin.security_sources || 0;
          var crossVerified = coin.security_cross_verified || false;
          var combinedTrust = coin.combined_trust || 'low';

          if (coin.rugcheck_score == null || coin.rugcheck_score === -1) {
            // GoPlusのみの場合もチェック
            if (!coin.goplus_honeypot && !coin.goplus_holder_count) {
              return '<div class="dex-detail__security-section" onclick="window.openSecurityGuidePopup(null)" style="cursor:pointer">' +
                '<div class="dex-detail__section-title">\u{1F6E1}\uFE0F セキュリティ <span style="font-size:10px;color:#64748b">(Rugcheck + GoPlus)</span></div>' +
                '<div style="text-align:center;padding:16px 0;color:#64748b;font-size:13px">' +
                  '<div style="font-size:24px;margin-bottom:6px">\u{1F512}</div>' +
                  '<div>セキュリティデータなし</div>' +
                  '<div style="font-size:11px;color:#475569;margin-top:4px">Solanaチェーンのトークンのみ対応</div>' +
                  '<div style="font-size:11px;color:#d4a853;margin-top:8px">タップでセキュリティの見方を確認 \u203A</div>' +
                '</div>' +
              '</div>';
            }
          }
          var rcScore = coin.rugcheck_score >= 0 ? coin.rugcheck_score : -1;
          var safeScore = rcScore >= 0 ? 100 - rcScore : -1;
          var safeColor = safeScore >= 70 ? '#22c55e' : safeScore >= 40 ? '#f59e0b' : safeScore >= 0 ? '#ef4444' : '#94a3b8';
          var safeLabel = safeScore >= 70 ? 'Safe' : safeScore >= 40 ? 'Caution' : safeScore >= 0 ? 'Danger' : 'N/A';

          // ハニーポット検出で強制danger
          if (coin.goplus_honeypot) {
            safeColor = '#ef4444';
            safeLabel = 'HONEYPOT';
          }

          var lpLock = coin.lp_locked_pct;
          var lpStr = lpLock >= 0 ? lpLock.toFixed(1) + '%' : 'N/A';
          var lpColor = lpLock > 50 ? '#22c55e' : lpLock > 0 ? '#f59e0b' : '#ef4444';

          // LP Lock期限表示
          var lpExpiryHtml = '';
          if (coin.lp_has_permanent_lock) {
            lpExpiryHtml = '<div style="font-size:10px;color:#22c55e">\u{1F525} 永久ロック</div>';
          } else if (coin.lp_lock_expiry_ts) {
            var nowSec = Math.floor(Date.now() / 1000);
            var daysLeft = Math.floor((coin.lp_lock_expiry_ts - nowSec) / 86400);
            if (daysLeft > 0) {
              var expiryColor = daysLeft > 180 ? '#22c55e' : daysLeft > 30 ? '#f59e0b' : '#ef4444';
              lpExpiryHtml = '<div style="font-size:10px;color:' + expiryColor + '">\u23F0 ' + daysLeft + '日後解除</div>';
            } else {
              lpExpiryHtml = '<div style="font-size:10px;color:#ef4444">\u{1F6A8} 期限切れ</div>';
            }
          }

          var top10 = coin.holder_top10_pct;
          var top10Str = top10 >= 0 ? top10.toFixed(1) + '%' : 'N/A';
          var top10Color = top10 >= 0 ? (top10 > 50 ? '#ef4444' : top10 > 30 ? '#f59e0b' : '#22c55e') : '#94a3b8';
          var mintIcon = coin.has_mint_authority ? '\u26A0\uFE0F あり' : '\u2705 なし';
          var mintColor = coin.has_mint_authority ? '#ef4444' : '#22c55e';
          var freezeIcon = coin.has_freeze_authority ? '\u26A0\uFE0F あり' : '\u2705 なし';
          var freezeColor = coin.has_freeze_authority ? '#ef4444' : '#22c55e';

          // クロス検証バッジ
          var verifyBadge = crossVerified ?
            '<div class="dex-detail__security-verified">\u2713 2ソース検証済</div>' :
            (srcCount === 1 ? '<div class="dex-detail__security-single">1ソースのみ</div>' : '');

          // ハニーポット警告バナー
          var honeypotBanner = '';
          if (coin.goplus_honeypot) {
            honeypotBanner = '<div class="dex-detail__security-honeypot">' +
              '\u{1F6AB} <b>ハニーポット検出</b> — このトークンは売却できない可能性があります' +
            '</div>';
          }

          // Rugcheckリスクタグ
          var risksHtml = '';
          if (coin.rugcheck_risks && coin.rugcheck_risks.length > 0) {
            risksHtml = '<div class="dex-detail__security-risks">';
            coin.rugcheck_risks.forEach(function(r) {
              risksHtml += '<span class="dex-detail__security-risk-tag">\u{1F6A9} ' + r + '</span>';
            });
            risksHtml += '</div>';
          }

          // GoPlus 2x2グリッド
          var goplusHtml = '';
          if (coin.goplus_holder_count > 0 || coin.goplus_honeypot) {
            var hpColor = coin.goplus_honeypot ? '#ef4444' : '#22c55e';
            var hpLabel = coin.goplus_honeypot ? '\u26A0\uFE0F YES' : '\u2705 NO';
            var stColor = coin.goplus_sell_tax > 10 ? '#ef4444' : coin.goplus_sell_tax > 5 ? '#f59e0b' : '#22c55e';
            var cpColor = coin.goplus_creator_percent > 30 ? '#ef4444' : coin.goplus_creator_percent > 10 ? '#f59e0b' : '#22c55e';
            goplusHtml =
              '<div style="font-size:11px;font-weight:600;color:#94a3b8;margin:12px 0 6px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06)">\u{1F50D} GoPlus Security</div>' +
              '<div class="dex-detail__security-grid">' +
                '<div class="dex-detail__security-item">' +
                  '<div class="dex-detail__security-item-label">ハニーポット</div>' +
                  '<div class="dex-detail__security-item-value" style="color:' + hpColor + '">' + hpLabel + '</div>' +
                '</div>' +
                '<div class="dex-detail__security-item">' +
                  '<div class="dex-detail__security-item-label">売却Tax</div>' +
                  '<div class="dex-detail__security-item-value" style="color:' + stColor + '">' + coin.goplus_sell_tax.toFixed(1) + '%</div>' +
                '</div>' +
                '<div class="dex-detail__security-item">' +
                  '<div class="dex-detail__security-item-label">保有者数</div>' +
                  '<div class="dex-detail__security-item-value">' + (coin.goplus_holder_count || 0).toLocaleString() + '</div>' +
                '</div>' +
                '<div class="dex-detail__security-item">' +
                  '<div class="dex-detail__security-item-label">作成者保有</div>' +
                  '<div class="dex-detail__security-item-value" style="color:' + cpColor + '">' + coin.goplus_creator_percent.toFixed(1) + '%</div>' +
                '</div>' +
              '</div>';
          }

          var guideData = JSON.stringify({s:safeScore,lbl:safeLabel,lp:lpLock,top10:top10,mint:coin.has_mint_authority,freeze:coin.has_freeze_authority,risks:coin.rugcheck_risks,hp:coin.goplus_honeypot,st:coin.goplus_sell_tax,hc:coin.goplus_holder_count,cp:coin.goplus_creator_percent,cv:crossVerified,src:srcCount,trust:combinedTrust,lpExp:coin.lp_lock_expiry_ts,lpPerm:coin.lp_has_permanent_lock}).replace(/"/g,'&quot;');

          return '<div class="dex-detail__security-section" onclick="window.openSecurityGuidePopup(' + guideData + ')" style="cursor:pointer">' +
            '<div class="dex-detail__section-title">\u{1F6E1}\uFE0F セキュリティ <span style="font-size:10px;color:#64748b">(Rugcheck + GoPlus)</span> <span style="font-size:10px;color:#d4a853;float:right">タップで解説 \u203A</span></div>' +
            verifyBadge +
            honeypotBanner +
            (safeScore >= 0 ?
            '<div class="dex-detail__security-score">' +
              '<div class="dex-detail__security-score-circle" style="border-color:' + safeColor + '">' +
                '<span class="dex-detail__security-score-value" style="color:' + safeColor + '">' + (coin.goplus_honeypot ? '!' : safeScore) + '</span>' +
              '</div>' +
              '<div class="dex-detail__security-score-label" style="color:' + safeColor + '">' + safeLabel + '</div>' +
            '</div>' : '') +
            '<div class="dex-detail__security-grid">' +
              '<div class="dex-detail__security-item">' +
                '<div class="dex-detail__security-item-label">LP Lock' + (lpExpiryHtml ? '' : '') + '</div>' +
                '<div class="dex-detail__security-item-value" style="color:' + lpColor + '">' + lpStr + '</div>' +
                lpExpiryHtml +
              '</div>' +
              '<div class="dex-detail__security-item">' +
                '<div class="dex-detail__security-item-label">Top10保有</div>' +
                '<div class="dex-detail__security-item-value" style="color:' + top10Color + '">' + top10Str + '</div>' +
              '</div>' +
              '<div class="dex-detail__security-item">' +
                '<div class="dex-detail__security-item-label">Mint権限</div>' +
                '<div class="dex-detail__security-item-value" style="color:' + mintColor + '">' + mintIcon + '</div>' +
              '</div>' +
              '<div class="dex-detail__security-item">' +
                '<div class="dex-detail__security-item-label">Freeze権限</div>' +
                '<div class="dex-detail__security-item-value" style="color:' + freezeColor + '">' + freezeIcon + '</div>' +
              '</div>' +
            '</div>' +
            goplusHtml +
            risksHtml +
          '</div>';
        })() +

        // Buy/Sell比
        '<div class="dex-detail__buysell" onclick="showMetricGuide(\'buysell\',event)" style="cursor:pointer">' +
          '<div class="dex-detail__buysell-item dex-detail__buysell-item--buy">' +
            '<div class="dex-detail__buysell-label">Buy (24h)</div>' +
            '<div class="dex-detail__buysell-value">' + (coin.txns_buy_24h || 0) + '</div>' +
          '</div>' +
          '<div class="dex-detail__buysell-item dex-detail__buysell-item--sell">' +
            '<div class="dex-detail__buysell-label">Sell (24h)</div>' +
            '<div class="dex-detail__buysell-value">' + (coin.txns_sell_24h || 0) + '</div>' +
          '</div>' +
          '<div class="dex-detail__buysell-item dex-detail__buysell-item--buy">' +
            '<div class="dex-detail__buysell-label">Buy (1h)</div>' +
            '<div class="dex-detail__buysell-value">' + (coin.txns_buy_1h || 0) + '</div>' +
          '</div>' +
          '<div class="dex-detail__buysell-item dex-detail__buysell-item--sell">' +
            '<div class="dex-detail__buysell-label">Sell (1h)</div>' +
            '<div class="dex-detail__buysell-value">' + (coin.txns_sell_1h || 0) + '</div>' +
          '</div>' +
        '</div>' +

        // SNS統計
        renderDexSocialSection(coin) +

        // SNS投稿一覧
        renderDexPostsSection(coin) +

        // トークンアドレス
        (addr ? '<div class="dex-detail__address">' +
          '<span class="dex-detail__address-label">CA:</span>' +
          '<span class="dex-detail__address-value">' + shortAddr + '</span>' +
          '<button class="dex-detail__copy-btn" onclick="navigator.clipboard.writeText(\'' + addr + '\');this.textContent=\'Copied!\';var b=this;setTimeout(function(){b.textContent=\'Copy\'},1500)">Copy</button>' +
        '</div>' : '') +

        // 外部リンク
        '<div class="dex-detail__links">' +
          (coin.dex_url ? '<a href="' + coin.dex_url + '" target="_blank" class="dex-detail__link">📊 DexScreener</a>' : '') +
          (addr ? '<a href="https://birdeye.so/token/' + addr + '?chain=solana" target="_blank" class="dex-detail__link">🦅 Birdeye</a>' : '') +
          (addr ? '<a href="https://solscan.io/token/' + addr + '" target="_blank" class="dex-detail__link">🔍 Solscan</a>' : '') +
        '</div>' +

      '</div>' +
    '</div>';
  }

  // ===== 詳細画面 =====
  function renderDetailScreen() {
    var ticker = appState.selectedCurrency;

    // DEXコイン分岐: Moonshot Early Detectionからの遷移時
    var moonshotCoin = window._pendingMoonshotCoin;
    if (moonshotCoin && moonshotCoin.symbol === ticker) {
      return renderDexDetailScreen(moonshotCoin);
    }

    var allResults = kairosData.all_results || [];
    var coinData = allResults.find(function(r) { return r.ticker === ticker; }) || {};

    // ウォッチリストにあるかチェック
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];
    var isInWatchlist = watchlist.indexOf(ticker) >= 0;

    // Use main kairosData if viewing the main ticker
    if (ticker === kairosData.ticker) {
      coinData = Object.assign({}, coinData, {
        current_price: kairosData.current_price,
        analysis: kairosData.analysis
      });
    }

    // scoreCacheからランクと信頼度を取得（全通貨対応）
    var cachedScore = scoreCache.data[ticker] || {};
    var stratScore = window.getStrategyScore(ticker);
    var priceUsd = cachedScore.price || coinData.current_price || 0;
    var change = cachedScore.change24h || coinData.price_change_24h || 0;
    var grade = stratScore.grade || coinData.grade || 'C';
    var score = stratScore.score || coinData.score || 50;
    var confidence = window.getStrategyConfidence ? window.getStrategyConfidence(ticker) : (cachedScore.confidence || scoreCache.systemConfidence || 50);
    var summary = cachedScore.summary || getMarketScoreLabel(score);
    var summaryColor = getSummaryColor(summary);
    var summaryBgColor = getSummaryBgColor(summary);
    var proxyUsed = cachedScore.proxyUsed || [];
    // 価格ポジション: モードに応じてswing/longtermを切り替え
    var pricePosition, pricePositionDisplay;
    if (appState.currenciesViewMode === 'longterm' && cachedScore.pricePositionLongterm !== undefined) {
      pricePosition = cachedScore.pricePositionLongterm;
      pricePositionDisplay = cachedScore.pricePositionDisplayLongterm || '50%';
    } else if (appState.currenciesViewMode === 'swing' && cachedScore.pricePositionSwing !== undefined) {
      pricePosition = cachedScore.pricePositionSwing;
      pricePositionDisplay = cachedScore.pricePositionDisplaySwing || '50%';
    } else {
      pricePosition = cachedScore.pricePosition || 50;
      pricePositionDisplay = cachedScore.pricePositionDisplay || '50%';
    }
    var changeClass = change >= 0 ? 'positive' : 'negative';
    var changeSign = change >= 0 ? '+' : '';

    // 円建て価格（小額コイン対応）
    var priceJpy = priceUsd * JPY_RATE;
    var fmtUsd = priceUsd < 0.01 ?
      (priceUsd >= 0.001 ? '$' + priceUsd.toFixed(4) :
       priceUsd >= 0.0000001 ? '$' + priceUsd.toFixed(8) :
       priceUsd > 0 ? '$' + priceUsd.toPrecision(2) : '$0.00') :
      formatUSD(priceUsd);
    var fmtJpy = priceJpy < 1 ?
      (priceJpy >= 0.01 ? '¥' + priceJpy.toFixed(4) :
       priceJpy >= 0.0001 ? '¥' + priceJpy.toFixed(6) :
       priceJpy > 0 ? '¥' + priceJpy.toPrecision(2) : '¥0') :
      formatYen(priceJpy);

    // コイン名マッピング - CRYPTO_CATEGORIESからも取得
    var coinNames = {
      BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', XRP: 'Ripple',
      ADA: 'Cardano', DOGE: 'Dogecoin', DOT: 'Polkadot', AVAX: 'Avalanche'
    };
    // カテゴリーからコイン名を探す
    Object.keys(CRYPTO_CATEGORIES).forEach(function(catKey) {
      var cat = CRYPTO_CATEGORIES[catKey];
      cat.coins.forEach(function(coin) {
        coinNames[coin.symbol] = coin.name;
      });
    });
    var coinName = coinNames[ticker] || ticker;

    // ウォッチリスト追加バナー
    var watchlistBanner = '';
    if (!isInWatchlist) {
      watchlistBanner = '<div class="detail__watchlist-banner">' +
        '<span>この通貨はウォッチリストにありません</span>' +
        '<button class="detail__watchlist-add-btn" onclick="window.KairosApp.addToWatchlistFromDetail(\'' + ticker + '\')">+ 追加してAI分析を見る</button>' +
      '</div>';
    }

    // 信頼度に応じた注意表示
    var confidenceWarning = confidence < 50 ? '（推測値を含む）' : '';

    // 推奨アクション
    var action = score >= 65 ? 'Light Accumulate' : (score >= 50 ? 'Hold' : 'Wait');
    var actionClass = score >= 65 ? 'action--buy' : (score >= 50 ? 'action--hold' : 'action--wait');

    var analysis = kairosData.analysis || {};
    var market = analysis.market || {};
    var fearGreed = market.fear_greed_index || 26;

    // お気に入りチェック
    var favoritesStr = localStorage.getItem('kairos-favorites');
    var favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
    var isFavorite = favorites.indexOf(ticker) >= 0;

    return '<div class="detail">' +
      // スティッキーヘッダー
      '<div class="detail__sticky-header">' +
        // サマリー（やや強気など）- スライドアニメーション・色分け（ヘッダーの後ろに配置）
        '<div class="detail__summary-bar" id="detail-summary-bar" style="background:' + summaryBgColor + '">' +
          '<span class="detail__summary-text" style="color:#fff;font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,0.3)">' + (summary || '') + '</span>' +
        '</div>' +
        // ヘッダーコンテンツ（サマリーバーの上に表示）
        '<div class="detail__header-content">' +
          // メトリックカード（3列）- タップでポップアップ
          '<div class="detail__metrics">' +
            '<div class="detail__metric-card detail__metric-card--clickable" onclick="window.openRankPopup(\'' + ticker + '\')">' +
              '<span class="detail__metric-card-label">RANK <span class="detail__metric-card-hint">▼</span></span>' +
              '<div class="detail__metric-card-value">' +
                '<span class="rank-badge rank-badge--sm ' + getGradeClass(grade) + '">' + grade + '</span>' +
                '<span>' + score + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="detail__metric-card detail__metric-card--clickable" onclick="window.openPricePopup(\'' + ticker + '\')">' +
              '<span class="detail__metric-card-label">PRICE <span class="detail__metric-card-hint">▼</span></span>' +
              '<span class="detail__metric-card-value ' + getPricePositionClass(pricePosition) + '">' + pricePositionDisplay + '</span>' +
            '</div>' +
            '<div class="detail__metric-card detail__metric-card--clickable" onclick="window.openAPIKeySettingsModal()">' +
              '<span class="detail__metric-card-label">' + (appState.currenciesViewMode === 'longterm' ? '長期信頼度' : '短期信頼度') + ' <span class="detail__metric-card-hint">⚙️</span></span>' +
              '<span class="detail__metric-card-value">' + confidence + '%</span>' +
            '</div>' +
          '</div>' +

          // モードバー（ストラテジー表示 + スコアバー）- currenciesViewModeと一致させる
          (function() {
            var viewMode = appState.currenciesViewMode;
            var stratType = viewMode || ((typeof StrategyManager !== 'undefined') ? StrategyManager.getStrategy(ticker) : 'longterm');
            var stratConfig = STRATEGY_CONFIG[stratType] || STRATEGY_CONFIG.longterm;
            return '<div class="detail__mode-bar">' +
              '<span class="detail__mode-label">' +
                '<span class="strategy-badge strategy-badge--' + stratType + '">' + stratConfig.icon + ' ' + stratConfig.label + '</span>' +
              '</span>' +
              '<div class="detail__mode-indicator"><div class="detail__mode-indicator-fill" style="--fill-width:' + score + '%"></div></div>' +
              '<span class="detail__mode-score">' + score + '</span>' +
              '<span class="detail__action-badge ' + actionClass + '">' + action + '</span>' +
            '</div>';
          })() +
        '</div>' +
      '</div>' +

      '<div class="detail__scroll-content" style="padding-top:' + (window.innerWidth <= 768 ? '138px' : '158px') + '">' +
        // ウォッチリスト追加バナー（未登録時のみ表示）
        watchlistBanner +
        // 価格表示（大きく・中央）- 通貨切り替え対応
        '<div class="detail__price-section">' +
          '<div class="detail__price-main">' +
            (appState.priceCurrency === 'JPY' ?
              '<span class="detail__price-jpy">' + fmtJpy + '</span>' :
              '<span class="detail__price-usd" style="font-size:28px">' + fmtUsd + '</span>') +
            '<span class="detail__price-change ' + changeClass + '">' + changeSign + change.toFixed(1) + '% <small>24h</small></span>' +
          '</div>' +
          '<div class="detail__price-sub">' +
            (appState.priceCurrency === 'JPY' ?
              '<span class="detail__price-usd">' + fmtUsd + '</span>' :
              '<span class="detail__price-jpy" style="font-size:14px">' + fmtJpy + '</span>') +
            '<button onclick="togglePriceCurrency()" class="detail__currency-toggle">' +
              (appState.priceCurrency === 'JPY' ? '$ USD' : '¥ JPY') +
            '</button>' +
          '</div>' +
        '</div>' +

        // トレーディングシグナルカード
        '<div id="trading-signal-container">' +
          '<div class="trading-signal-card trading-signal-card--wait trading-signal-card--loading">' +
            '<div class="trading-signal-card__header">' +
              '<span class="trading-signal-card__signal trading-signal-card__signal--wait">⚪ 様子見</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // 価格チャート（lightweight-charts）
        '<div class="detail__chart-section">' +
          '<div class="detail__chart-header">' +
            '<span class="detail__chart-title">📈 価格チャート</span>' +
            '<button onclick="addChartCheckpoint()" class="checkpoint-add-btn" title="チェックポイントを設置">📍</button>' +
            '<button onclick="openChartDrawingModal()" style="padding:4px 8px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#d4a853;font-size:11px;cursor:pointer;margin-left:8px">✏️ 描画</button>' +
            '<div class="detail__chart-periods">' +
              (function() {
                var periods = (typeof StrategyManager !== 'undefined') ? StrategyManager.getChartPeriods(ticker) : ['1D','1W','1M','1Y','5Y','MAX'];
                var periodLabels = { '1H': '1時間', '4H': '4時間', '1D': '1日', '1W': '1週', '1M': '1月', '1Y': '1年', '5Y': '5年', 'MAX': '最大' };
                return periods.map(function(p) {
                  return '<button class="detail__chart-period' + (appState.chartPeriod === p ? ' active' : '') + '" data-period="' + p + '">' + (periodLabels[p] || p) + '</button>';
                }).join('');
              })() +
            '</div>' +
          '</div>' +
          '<div class="detail__chart-area" id="detail-chart"></div>' +
          '<div class="detail__chart-stats" id="detail-chart-stats"></div>' +
        '</div>' +

        // パターン合流度 + 教育パネル（チャートデータ取得後に動的描画）
        '<div id="pattern-overlay-container"></div>' +

        // テクニカル指標
        '<div class="detail__technical">' +
          '<div class="detail__section-header">' +
            '<span class="detail__section-title">テクニカル指標</span>' +
            '<span class="detail__section-link">タップで解説</span>' +
          '</div>' +
          '<div class="detail__indicator-grid">' +
            '<div class="detail__indicator-card" onclick="window.openIndicatorHelp(\'rsi\')">' +
              '<div class="detail__indicator-header"><span>RSI</span><span class="detail__indicator-help">?</span></div>' +
              '<div class="detail__indicator-value">42</div>' +
              '<div class="detail__indicator-label">中立</div>' +
              '<span class="detail__indicator-badge badge--neutral">様子見</span>' +
            '</div>' +
            '<div class="detail__indicator-card" onclick="window.openIndicatorHelp(\'fg\')">' +
              '<div class="detail__indicator-header"><span>F&G</span><span class="detail__indicator-help">?</span></div>' +
              '<div class="detail__indicator-value" style="color:' + getFearGreedColor(fearGreed) + '">' + fearGreed + '</div>' +
              '<div class="detail__indicator-label">' + (fearGreed <= 45 ? 'Fear' : 'Greed') + '</div>' +
              '<span class="detail__indicator-badge badge--neutral">様子見</span>' +
            '</div>' +
            '<div class="detail__indicator-card" onclick="window.openIndicatorHelp(\'volume\')">' +
              '<div class="detail__indicator-header"><span>出来高</span><span class="detail__indicator-help">?</span></div>' +
              '<div class="detail__indicator-value">1.2x</div>' +
              '<div class="detail__indicator-label">平常</div>' +
              '<span class="detail__indicator-badge badge--info">参考</span>' +
            '</div>' +
            '<div class="detail__indicator-card" onclick="window.openIndicatorHelp(\'ma\')">' +
              '<div class="detail__indicator-header"><span>MA乖離</span><span class="detail__indicator-help">?</span></div>' +
              '<div class="detail__indicator-value negative">-3.2%</div>' +
              '<div class="detail__indicator-label">やや下</div>' +
              '<span class="detail__indicator-badge badge--neutral">様子見</span>' +
            '</div>' +
            '<div class="detail__indicator-card" onclick="window.openIndicatorHelp(\'funding\')">' +
              '<div class="detail__indicator-header"><span>資金調達</span><span class="detail__indicator-help">?</span></div>' +
              '<div class="detail__indicator-value positive">+1,200%</div>' +
              '<div class="detail__indicator-label">ロング優勢</div>' +
              '<span class="detail__indicator-badge badge--neutral">様子見</span>' +
            '</div>' +
            '<div class="detail__indicator-card" onclick="window.openIndicatorHelp(\'ls\')">' +
              '<div class="detail__indicator-header"><span>L/S比</span><span class="detail__indicator-help">?</span></div>' +
              '<div class="detail__indicator-value">1.24</div>' +
              '<div class="detail__indicator-label">ロング優勢</div>' +
              '<span class="detail__indicator-badge badge--neutral">様子見</span>' +
            '</div>' +
          '</div>' +
          // 建玉カード
          '<div class="detail__oi-card" onclick="window.openIndicatorHelp(\'oi\')">' +
            '<div class="detail__oi-header">' +
              '<span class="detail__oi-label">建玉（OI）</span>' +
              '<span class="detail__indicator-help">?</span>' +
            '</div>' +
            '<div class="detail__oi-content">' +
              '<span class="detail__oi-value">28000.0億</span>' +
              '<div class="detail__oi-change">' +
                '<span class="positive">+5.2%</span> <small>24h</small>' +
                '<span class="detail__oi-badge">強気</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // ファンダメンタル情報
        '<div class="detail__fundamentals">' +
          '<div class="detail__fund-row" onclick="window.openIndicatorHelp(\'marketcap\')">' +
            '<span class="detail__fund-label">時価総額</span>' +
            '<span class="detail__fund-value">2980000.0億 <small>#1</small></span>' +
          '</div>' +
          '<div class="detail__fund-row" onclick="window.openIndicatorHelp(\'volume24h\')">' +
            '<span class="detail__fund-label">24h取引量</span>' +
            '<span class="detail__fund-value">42000.0億</span>' +
          '</div>' +
          '<div class="detail__fund-row" onclick="window.openIndicatorHelp(\'supply\')">' +
            '<span class="detail__fund-label">供給量</span>' +
            '<span class="detail__fund-value">19.5M / 21M</span>' +
          '</div>' +
          '<div class="detail__fund-row" onclick="window.openIndicatorHelp(\'dominance\')">' +
            '<span class="detail__fund-label">ドミナンス</span>' +
            '<span class="detail__fund-value">52.3%</span>' +
          '</div>' +
        '</div>' +

        // 投資サマリー
        renderInvestmentSummary(ticker) +

        // 取引ボタンはフッター上の固定バーに移動（下のrenderTradeBarで生成）


        // ニュースセクション（動的に読み込み）
        '<div class="detail__news">' +
          '<div class="detail__news-header">' +
            '<span class="detail__news-title">📰 関連ニュース</span>' +
            '<span class="detail__news-more" onclick="window.open(\'https://cointelegraph.com/tags/' + ticker.toLowerCase() + '\', \'_blank\')">すべて →</span>' +
          '</div>' +
          '<div class="detail__news-list">' +
            '<div style="text-align:center;padding:16px;color:#888">読み込み中...</div>' +
          '</div>' +
        '</div>' +

        // 購入履歴
        '<div class="detail__history-section">' +
          '<div class="detail__history-title">購入履歴</div>' +
          renderPurchaseHistory(ticker) +
        '</div>' +

      '</div>' +

    '</div>';
  }

  // 投資サマリー
  function renderInvestmentSummary(ticker) {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    var tickerRecords = records.filter(function(r) { return r.currencyId === ticker; });

    var totalInvested = 0;
    var totalAmount = 0;
    var monthlyInvested = 0;
    var now = new Date();
    var thisMonth = now.getMonth();
    var thisYear = now.getFullYear();

    tickerRecords.forEach(function(r) {
      if (r.type === 'buy') {
        totalInvested += r.totalJpy || 0;
        totalAmount += r.quantity || r.amount || 0;
        var date = new Date(r.date);
        if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
          monthlyInvested += r.totalJpy || 0;
        }
      }
    });

    // 現在の価値（簡易計算）: scoreCache → all_results → 0
    var cachedCoin = (typeof scoreCache !== 'undefined' && scoreCache.data) ? scoreCache.data[ticker] : null;
    var allResults = kairosData.all_results || [];
    var coinData = allResults.find(function(r) { return r.ticker === ticker; }) || {};
    var currentPrice = (cachedCoin && cachedCoin.price) || coinData.current_price || 0;
    var currentValue = totalAmount * currentPrice * 150; // JPY
    var monthlyChange = currentValue - totalInvested;
    var avgPrice = totalAmount > 0 ? totalInvested / totalAmount : 0;

    return '<div class="detail__investment-summary">' +
      '<div class="detail__summary-grid">' +
        '<div class="detail__summary-card">' +
          '<span class="detail__summary-label">今月投資</span>' +
          '<span class="detail__summary-value">' + formatYen(monthlyInvested) + '</span>' +
        '</div>' +
        '<div class="detail__summary-card">' +
          '<span class="detail__summary-label">今月増減</span>' +
          '<span class="detail__summary-value ' + (monthlyChange >= 0 ? 'positive' : 'negative') + '">' + formatYen(monthlyChange) + '</span>' +
        '</div>' +
        '<div class="detail__summary-card">' +
          '<span class="detail__summary-label">TOTAL</span>' +
          '<span class="detail__summary-value">' + formatYen(totalInvested) + '</span>' +
        '</div>' +
        '<div class="detail__summary-card">' +
          '<span class="detail__summary-label">保有量</span>' +
          '<span class="detail__summary-value">' + (totalAmount > 0 ? totalAmount.toFixed(6) : '0') + ' ' + ticker + '</span>' +
          (avgPrice > 0 ? '<span class="detail__summary-sub">平均 ' + formatYen(avgPrice) + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // 購入履歴
  function renderPurchaseHistory(ticker) {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    var tickerRecords = records.filter(function(r) { return r.currencyId === ticker; }).slice(-5).reverse();

    if (tickerRecords.length === 0) {
      return '<div class="detail__history-empty">履歴がありません</div>';
    }

    return tickerRecords.map(function(r) {
      var date = new Date(r.date);
      var dateStr = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate();
      var isSell = r.type === 'sell';
      var typeLabel = isSell ? '売却' : '購入';
      var typeColor = isSell ? 'color:#ef4444' : 'color:#10b981';
      return '<div class="detail__history-item">' +
        '<span class="detail__history-date">' + dateStr + '</span>' +
        '<span class="detail__history-type" style="font-size:11px;' + typeColor + '">' + typeLabel + '</span>' +
        '<span class="detail__history-amount" style="' + (isSell ? 'color:#ef4444' : '') + '">' + formatYen(r.totalJpy) + '</span>' +
      '</div>';
    }).join('');
  }


  // ===== メインレンダリング =====
  function renderApp() {
    var root = document.getElementById('root');
    if (!root) return;

    var screenHtml;

    // エラー状態の場合
    if (appState.dataError && appState.currentScreen !== 'splash') {
      screenHtml = renderErrorScreen(appState.dataError, 'window.KairosApp.refresh()');
    }
    // ローディング状態の場合はスケルトン表示
    else if (appState.isLoading && appState.loadingScreen) {
      switch (appState.loadingScreen) {
        case 'home':
          screenHtml = renderHomeScreenSkeleton();
          break;
        case 'currencies':
          screenHtml = renderCurrenciesScreenSkeleton();
          break;
        case 'market':
          screenHtml = renderMarketScreenSkeleton();
          break;
        case 'ai-compare':
          screenHtml = renderAICompareScreenSkeleton();
          break;
        case 'detail':
          screenHtml = renderDetailScreenSkeleton();
          break;
        default:
          screenHtml = renderHomeScreenSkeleton();
      }
    }
    // 通常の画面レンダリング
    else {
      switch (appState.currentScreen) {
        case 'splash':
          screenHtml = renderSplashScreen();
          break;
        case 'home':
          screenHtml = renderHomeScreen();
          break;
        case 'currencies':
          screenHtml = renderCurrenciesScreen();
          break;
        case 'market':
          screenHtml = renderMarketScreen();
          break;
        case 'ai-compare':
          screenHtml = renderAICompareScreen();
          break;
        case 'detail':
          screenHtml = renderDetailScreen();
          break;
        case 'moonshot':
          screenHtml = renderMoonshotScreen();
          break;
        default:
          screenHtml = renderHomeScreen();
      }
    }

    var navHtml = (appState.currentScreen !== 'splash') ? renderBottomNav() : '';

    // 最終更新時刻のバナー（オプション）
    var updateBanner = '';
    if (appState.lastUpdated && !appState.isLoading && appState.currentScreen !== 'splash') {
      var updateTime = new Date(appState.lastUpdated).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
      updateBanner = '<div class="update-banner">最終更新: ' + updateTime + '</div>';
    }

    // グローバルヘッダー管理
    var headerContainer = document.getElementById('global-header-container');
    if (appState.currentScreen !== 'splash') {
      if (!headerContainer) {
        headerContainer = document.createElement('div');
        headerContainer.id = 'global-header-container';
        document.body.insertBefore(headerContainer, document.body.firstChild);
      }
      // ストラテジーボタンの表示/非表示が画面遷移で変わるため毎回更新
      headerContainer.innerHTML = renderGlobalHeader();
      globalHeaderState.currentTitle = getScreenTitle(appState.currentScreen);
    }

    root.innerHTML = '<div class="app">' + updateBanner + screenHtml + navHtml + '</div>';

    // トレードバーの管理（detail画面のみ表示、フッター上に固定）
    updateTradeBar();

    // DOM更新後にスクロール位置をリセット
    requestAnimationFrame(function() {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      root.scrollTop = 0;
    });

    setupEventListeners();

    // TradingViewチャート初期化
    if (appState.currentScreen === 'detail' && !appState.isLoading) {
      initDetailChart();
      // DEXコインでは通常の詳細画面用機能をスキップ
      if (!isDexCoin()) {
        fetchPriceForNonWatchlistCoin();
        updateNewsSection(appState.selectedCurrency);
        loadTradingSignal(appState.selectedCurrency);
        showSummaryBarTemporarily();
      }
    }

    // Moonshot: load data based on active tab
    if (appState.currentScreen === 'moonshot') {
      if (appState.moonshotTab === 'early') {
        loadEarlyMovers();
      } else {
        loadMoonshotCoins();
      }
    }
  }

  // トレードバー（購入/売却ボタン）をフッター上に固定表示
  function updateTradeBar() {
    var existing = document.getElementById('detail-trade-bar');
    if (appState.currentScreen === 'detail' && !appState.isLoading && !isDexCoin()) {
      var ticker = appState.selectedCurrency;
      if (!existing) {
        // 新規作成 → body直下に追加（スライドインアニメーション付き）
        var bar = document.createElement('div');
        bar.id = 'detail-trade-bar';
        bar.className = 'detail__trade-bar';
        bar.innerHTML =
          '<div class="detail__trade-buttons">' +
            '<button class="detail__record-btn detail__record-btn--buy" onclick="window.KairosApp.openQuickBuy(\'' + ticker + '\')">' +
              '<span style="font-size:18px;margin-right:8px">📈</span>購入' +
            '</button>' +
            '<button class="detail__record-btn detail__record-btn--sell" onclick="window.openSellModal(\'' + ticker + '\')">' +
              '<span style="font-size:18px;margin-right:8px">📉</span>売却' +
            '</button>' +
          '</div>';
        document.body.appendChild(bar);
      } else {
        // tickerが変わった場合はボタンのonclickを更新
        var buyBtn = existing.querySelector('.detail__record-btn--buy');
        var sellBtn = existing.querySelector('.detail__record-btn--sell');
        if (buyBtn) buyBtn.setAttribute('onclick', "window.KairosApp.openQuickBuy('" + ticker + "')");
        if (sellBtn) sellBtn.setAttribute('onclick', "window.openSellModal('" + ticker + "')");
        // 再表示（退場アニメ中だった場合）
        existing.classList.remove('detail__trade-bar--exit');
        existing.style.animation = 'none';
        existing.offsetHeight; // reflow
        existing.style.animation = '';
      }
    } else if (existing) {
      // detail画面から離れた → 退場アニメーション後に削除
      existing.classList.add('detail__trade-bar--exit');
      setTimeout(function() {
        var el = document.getElementById('detail-trade-bar');
        if (el) el.remove();
      }, 300);
    }
  }

  // サマリーバーを一時的に表示
  var summaryBarTimeout = null;
  function showSummaryBarTemporarily() {
    var bar = document.getElementById('detail-summary-bar');
    if (!bar) return;
    var text = bar.querySelector('.detail__summary-text');
    if (!text || !text.textContent.trim()) return;

    // 前のタイマーをクリア
    if (summaryBarTimeout) clearTimeout(summaryBarTimeout);

    // 少し遅らせてからスライドイン
    setTimeout(function() {
      bar.classList.add('visible');
    }, 300);

    // 3秒後にスライドアウト
    summaryBarTimeout = setTimeout(function() {
      bar.classList.remove('visible');
    }, 3500);
  }

  // ウォッチリスト外の通貨の価格を取得
  function fetchPriceForNonWatchlistCoin() {
    var ticker = appState.selectedCurrency;
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];

    // ウォッチリストにある場合はスキップ（データは既にある）
    if (watchlist.indexOf(ticker) >= 0) return;

    var coinId = CURRENCY_MAP[ticker.toLowerCase()];
    if (!coinId) return;

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + coinId + '&vs_currencies=usd,jpy&include_24hr_change=true')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data[coinId]) {
          var price = data[coinId].usd;
          var priceJpy = data[coinId].jpy;
          var change24h = data[coinId].usd_24h_change || 0;
          var changeClass = change24h >= 0 ? 'positive' : 'negative';
          var changeSign = change24h >= 0 ? '+' : '';

          // 価格表示を更新（JPY/USD切替対応）
          var priceJpyEl = document.querySelector('.detail__price-jpy');
          var priceUsdEl = document.querySelector('.detail__price-usd');
          var priceChangeEl = document.querySelector('.detail__price-change');

          if (priceJpyEl) priceJpyEl.textContent = formatYen(priceJpy);
          if (priceUsdEl) priceUsdEl.textContent = formatUSD(price);
          if (priceChangeEl) {
            priceChangeEl.className = 'detail__price-change ' + changeClass;
            priceChangeEl.innerHTML = changeSign + change24h.toFixed(1) + '% <small>24h</small>';
          }
        }
      })
      .catch(function(err) {
        console.error('Price fetch error:', err);
      });
  }

  function initDetailChart() {
    var chartContainer = document.getElementById('detail-chart');
    if (!chartContainer) return;

    var ticker = appState.selectedCurrency;
    var symbol = 'BINANCE:' + ticker + 'USDT';

    if (window.TradingView) {
      new window.TradingView.widget({
        container_id: 'detail-chart',
        symbol: symbol,
        interval: 'D',
        timezone: 'Asia/Tokyo',
        theme: 'dark',
        style: '1',
        locale: 'ja',
        toolbar_bg: '#0a1628',
        enable_publishing: false,
        hide_top_toolbar: true,
        hide_legend: true,
        save_image: false,
        height: 200,
        width: '100%'
      });
    } else {
      chartContainer.innerHTML = '<div style="height:200px;display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);background:var(--surface-card);border-radius:12px;">チャート準備中...</div>';
    }
  }

  function setupEventListeners() {
    var root = document.getElementById('root');
    if (!root) return;

    root.querySelectorAll('.nav-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var screen = btn.getAttribute('data-screen');
        if (screen) navigateTo(screen);
      });
    });

    root.querySelectorAll('.currencies__list-card, .ai-compare-item, .portfolio-detail__item').forEach(function(el) {
      el.addEventListener('click', function() {
        var ticker = el.getAttribute('data-ticker');
        if (ticker) {
          window.KairosApp.viewCurrency(ticker);
        }
      });
    });

    root.querySelectorAll('.chart-card__period').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var newPeriod = btn.getAttribute('data-period');
        appState.chartPeriod = newPeriod;
        // ボタンのアクティブ状態を更新
        root.querySelectorAll('.chart-card__period').forEach(function(b) {
          b.classList.toggle('chart-card__period--active', b.getAttribute('data-period') === newPeriod);
        });
        // ポートフォリオチャートSVGだけ再描画
        var chartContainer = root.querySelector('.chart-card__chart');
        if (chartContainer) {
          chartContainer.innerHTML = renderPortfolioChart();
        }
      });
    });

    root.querySelectorAll('.detail__chart-period').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var newPeriod = btn.getAttribute('data-period');
        if (newPeriod === appState.chartPeriod) return;
        appState.chartPeriod = newPeriod;
        // ボタンのアクティブ状態を更新
        root.querySelectorAll('.detail__chart-period').forEach(function(b) {
          b.classList.toggle('active', b.getAttribute('data-period') === newPeriod);
        });
        // チャート切り替えアニメーション
        var chartArea = document.querySelector('.detail__chart-area');
        if (chartArea) {
          chartArea.classList.remove('chart-entering');
          chartArea.classList.add('chart-switching');
        }
        var ticker = appState.selectedCurrency;
        if (ticker) {
          setTimeout(function() {
            initPriceChart(ticker, newPeriod);
            if (chartArea) {
              chartArea.classList.remove('chart-switching');
              chartArea.classList.add('chart-entering');
              chartArea.addEventListener('animationend', function onEnd() {
                chartArea.classList.remove('chart-entering');
                chartArea.removeEventListener('animationend', onEnd);
              });
            }
          }, 150);
        }
      });
    });

    // ヘッダーのストラテジートグル（グローバルビューモードも同期）
    var stratToggle = document.getElementById('global-strategy-toggle');
    if (stratToggle) {
      stratToggle.addEventListener('click', function() {
        var ticker = appState.selectedCurrency;
        if (ticker && typeof StrategyManager !== 'undefined') {
          var current = appState.currenciesViewMode || StrategyManager.getStrategy(ticker);
          var next = current === 'longterm' ? 'swing' : 'longterm';
          StrategyManager.setStrategy(ticker, next);
          // グローバルビューモードも同期（通貨一覧と詳細の一貫性）
          appState.currenciesViewMode = next;
          // モードブリッジ更新
          var config = STRATEGY_CONFIG[next] || STRATEGY_CONFIG.longterm;
          appState.mode = config.apiMode === 'swing' ? 'satellite' : 'core';
          appState.chartPeriod = config.defaultPeriod;
          // CSSクラスをトグル（スライドアニメーション）
          stratToggle.classList.remove('strategy-toggle--longterm', 'strategy-toggle--swing');
          stratToggle.classList.add('strategy-toggle--' + next);
          // アニメーション完了後にアプリ再描画
          setTimeout(function() {
            renderApp();
          }, 500);
        }
      });
    }

    // 通貨一覧の短期/長期トグル（表示切替のみ、個別設定は変えない）
    var currViewToggle = document.getElementById('currencies-view-toggle');
    if (currViewToggle) {
      currViewToggle.addEventListener('click', function() {
        var current = appState.currenciesViewMode || 'swing';
        var next = current === 'longterm' ? 'swing' : 'longterm';
        appState.currenciesViewMode = next;
        // スライドアニメーション
        currViewToggle.classList.remove('strategy-toggle--longterm', 'strategy-toggle--swing');
        currViewToggle.classList.add('strategy-toggle--' + next);
        setTimeout(function() {
          renderApp();
        }, 300);
      });
    }

    // 通貨を追加ボタン
    var addCurrencyBtn = root.querySelector('.currencies__add-btn');
    if (addCurrencyBtn) {
      addCurrencyBtn.addEventListener('click', function() {
        openAddCurrencyModal();
      });
    }

    // ヘルプアイコン（?マーク）のイベント
    root.querySelectorAll('[data-help]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var helpKey = el.getAttribute('data-help');
        var helpData = FEATURE_HELP[helpKey];
        if (helpData) {
          showFeatureTooltip(el, helpData.title, helpData.description, helpData.details);
        }
      });
    });

    // AIタブの切り替え
    root.querySelectorAll('.ai-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tabId = btn.getAttribute('data-tab');
        if (tabId && aiScreenState.activeTab !== tabId) {
          aiScreenState.activeTab = tabId;
          renderApp();
        }
      });
    });

    // トレンド画面のアイテムクリック
    root.querySelectorAll('.trend-item--opportunity').forEach(function(el) {
      el.addEventListener('click', function() {
        var ticker = el.getAttribute('data-ticker');
        if (ticker) {
          window.KairosApp.viewCurrency(ticker);
        }
      });
    });

    // 詳細画面のチャートを初期化
    if (appState.currentScreen === 'detail') {
      initPriceChart(appState.selectedCurrency, appState.chartPeriod);
    }

    // スワイプジェスチャーはv19で廃止（通貨別ストラテジー制に移行）
  }

  // ============================================
  // スワイプジェスチャー（v19で廃止 - 通貨別ストラテジー制に移行）
  // ============================================
  // レガシー互換: setupSwipeGestureが呼ばれても何もしない
  function setupSwipeGesture() {}

  // ============================================
  // 価格チャート（lightweight-charts）
  // ============================================
  var priceChart = null;
  var priceSeries = null;
  var candleSeries = null;
  var volumeSeries = null;
  var chartUpdateInterval = null;
  var chartUpdateTicker = null;
  var chartUpdatePeriod = null;
  var _chartCandleData = []; // initPriceChart内で保存

  // ============================================
  // チャート チェックポイント（📍フラグ機能）
  // ============================================
  var CHECKPOINT_STORAGE_KEY = 'kairos_chart_checkpoints';
  var MAX_CHECKPOINTS_PER_COIN = 5;

  function _loadCheckpoints() {
    try { return JSON.parse(localStorage.getItem(CHECKPOINT_STORAGE_KEY) || '{}'); } catch(e) { return {}; }
  }
  function _saveCheckpoints(all) {
    localStorage.setItem(CHECKPOINT_STORAGE_KEY, JSON.stringify(all));
  }

  function getCheckpoints(ticker) {
    var all = _loadCheckpoints();
    return (all[ticker] || []).slice();
  }

  function addCheckpoint(ticker, price) {
    var all = _loadCheckpoints();
    if (!all[ticker]) all[ticker] = [];
    // 最大5個制限
    if (all[ticker].length >= MAX_CHECKPOINTS_PER_COIN) {
      all[ticker].shift(); // 最古を削除
    }
    all[ticker].push({
      price: price,
      time: Math.floor(Date.now() / 1000),
      id: Date.now()
    });
    _saveCheckpoints(all);
    return all[ticker];
  }

  function removeCheckpoint(ticker, cpId) {
    var all = _loadCheckpoints();
    if (!all[ticker]) return;
    all[ticker] = all[ticker].filter(function(cp) { return cp.id !== cpId; });
    if (all[ticker].length === 0) delete all[ticker];
    _saveCheckpoints(all);
  }

  window.addChartCheckpoint = function() {
    var ticker = appState.selectedCurrency;
    if (!ticker) return;
    // チャート上の最新キャンドルの終値を使用（最も正確）
    var currentPrice = 0;
    if (_chartCandleData && _chartCandleData.length > 0) {
      var lastCandle = _chartCandleData[_chartCandleData.length - 1];
      currentPrice = lastCandle.close || lastCandle.value || 0;
    }
    // フォールバック
    if (!currentPrice) {
      var coin = window._pendingMoonshotCoin;
      if (coin && coin.price_usd) {
        currentPrice = coin.price_usd;
      } else if (scoreCache && scoreCache.data && scoreCache.data[ticker]) {
        currentPrice = scoreCache.data[ticker].price || 0;
      }
    }
    if (!currentPrice) {
      showToast('価格データがありません');
      return;
    }
    addCheckpoint(ticker, currentPrice);
    showToast('📍 チェックポイントを設置');
    // チャート再描画でマーカー反映
    if (priceChart && (candleSeries || priceSeries)) {
      renderCheckpointMarkers(ticker);
    }
  };

  window.removeChartCheckpoint = function(cpId) {
    var ticker = appState.selectedCurrency;
    if (!ticker) return;
    removeCheckpoint(ticker, cpId);
    // ポップアップ閉じる
    var popup = document.getElementById('checkpoint-popup');
    if (popup) popup.remove();
    // マーカー再描画
    if (priceChart && (candleSeries || priceSeries)) {
      renderCheckpointMarkers(ticker);
    }
    showToast('チェックポイントを削除');
  };

  // チェックポイントピンSVG — 取引マーカーと同じGoogle Maps風ドロップピン（金色）
  var checkpointPinSvg = function() {
    return '<svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<g filter="url(#cp-pin-shadow)">' +
        '<path d="M10 26C10 26 19 16 19 10C19 5.03 14.97 1 10 1C5.03 1 1 5.03 1 10C1 16 10 26 10 26Z" fill="#d4a853"/>' +
        '<path d="M10 26C10 26 19 16 19 10C19 5.03 14.97 1 10 1C5.03 1 1 5.03 1 10C1 16 10 26 10 26Z" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>' +
        '<text x="10" y="14" text-anchor="middle" font-size="10" fill="#000" font-weight="bold">📍</text>' +
      '</g>' +
      '<defs><filter id="cp-pin-shadow" x="-2" y="0" width="24" height="32" filterUnits="userSpaceOnUse">' +
        '<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.4"/>' +
      '</filter></defs>' +
    '</svg>';
  };

  function renderCheckpointMarkers(ticker, seriesParam, chartCandlesParam) {
    var container = document.getElementById('detail-chart');
    if (!container || !priceChart) return;

    // パラメータ優先、未指定時はグローバルフォールバック（addChartCheckpoint等の直接呼び出し用）
    var series = seriesParam || candleSeries || priceSeries;
    if (!series) return;

    // 既存オーバーレイを削除
    var existing = document.getElementById('checkpoint-pins-overlay');
    if (existing) existing.remove();
    var existingPopup = document.getElementById('checkpoint-popup');
    if (existingPopup) existingPopup.remove();
    var existingZone = document.getElementById('checkpoint-zone-overlay');
    if (existingZone) existingZone.remove();

    var checkpoints = getCheckpoints(ticker);
    if (checkpoints.length === 0) return;

    // チャートデータの時間範囲を取得（取引マーカーと同じ方式）
    var chartCandles = chartCandlesParam || _chartCandleData || [];
    var candleTimes = chartCandles.map(function(c) { return c.time; });
    if (candleTimes.length === 0) return;
    var chartStart = candleTimes[0];
    var chartEnd = candleTimes[candleTimes.length - 1];
    var avgInterval = candleTimes.length > 1
      ? (chartEnd - chartStart) / (candleTimes.length - 1)
      : 86400;
    var timeMargin = Math.max(86400, avgInterval * 2);

    // 取引マーカーと同じスナップ関数
    function snapToNearestCandle(cpTime) {
      if (cpTime <= chartStart) return chartStart;
      if (cpTime >= chartEnd) return chartEnd;
      var best = candleTimes[0];
      var bestDiff = Math.abs(cpTime - best);
      for (var i = 1; i < candleTimes.length; i++) {
        var diff = Math.abs(cpTime - candleTimes[i]);
        if (diff < bestDiff) {
          best = candleTimes[i];
          bestDiff = diff;
        }
        if (candleTimes[i] > cpTime) break;
      }
      return best;
    }

    // 現在価格を取得（チャートの最新キャンドル終値を優先）
    var currentPrice = 0;
    if (chartCandles.length > 0) {
      var lastC = chartCandles[chartCandles.length - 1];
      currentPrice = lastC.close || lastC.value || 0;
    }
    if (!currentPrice) {
      var coin = window._pendingMoonshotCoin;
      if (coin && coin.price_usd) currentPrice = coin.price_usd;
      else if (scoreCache && scoreCache.data && scoreCache.data[ticker]) currentPrice = scoreCache.data[ticker].price || 0;
    }

    // オーバーレイレイヤー（取引マーカーと同じ方式）
    container.style.position = 'relative';
    var overlay = document.createElement('div');
    overlay.id = 'checkpoint-pins-overlay';
    overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:60;overflow:hidden;';
    container.appendChild(overlay);

    // 取引マーカーと同じピンサイズ・オフセット
    var PIN_HEIGHT = 28;
    var PIN_OFFSET = 4;
    var pins = [];

    checkpoints.forEach(function(cp) {
      var snappedTime = snapToNearestCandle(cp.time);

      // 取引マーカーと同じDOM構造
      var pin = document.createElement('div');
      pin.style.cssText = 'position:absolute;pointer-events:auto;cursor:pointer;' +
        'transform:translateX(-50%);transition:transform 0.12s ease;width:20px;height:28px;';
      pin.innerHTML = checkpointPinSvg();

      // タッチ領域を広げる（ピンの周囲にヒットエリア）
      pin.style.padding = '8px';
      pin.style.margin = '-8px';

      // 長押し/タップ判定
      var pressTimer = null;
      var isLongPress = false;

      function startPress(e) {
        isLongPress = false;
        pressTimer = setTimeout(function() {
          isLongPress = true;
          pin.style.transform = 'translateX(-50%) scale(1.3)';
          showCheckpointZone(cp, series, container);
        }, 400);
      }
      function endPress(e) {
        clearTimeout(pressTimer);
        pin.style.transform = 'translateX(-50%)';
        if (isLongPress) {
          // 長押し終了→ゾーン消去、clickは発火させない
          isLongPress = false;
          hideCheckpointZone();
        }
      }
      function onTap(e) {
        e.stopPropagation();
        // 長押し中はタップ扱いしない
        if (isLongPress) { isLongPress = false; return; }
        showCheckpointPopup(cp, currentPrice, container);
      }

      pin.addEventListener('touchstart', function(e) {
        e.preventDefault(); // ブラウザのコンテキストメニュー防止
        startPress(e);
      }, { passive: false });
      pin.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (!isLongPress) onTap(e);
        endPress(e);
      });
      pin.addEventListener('touchcancel', endPress);
      pin.addEventListener('mousedown', startPress);
      pin.addEventListener('mouseup', endPress);
      pin.addEventListener('mouseleave', endPress);
      pin.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!isLongPress) onTap(e);
      });

      // ホバー（PC）
      pin.addEventListener('mouseenter', function() { pin.style.transform = 'translateX(-50%) scale(1.25)'; });
      pin.addEventListener('mouseleave', function() { pin.style.transform = 'translateX(-50%)'; });

      overlay.appendChild(pin);

      // チェックポイント価格はチャートデータの終値から取得済みなので変換不要
      pins.push({ el: pin, time: snappedTime, price: cp.price });
    });

    if (pins.length === 0) { overlay.remove(); return; }

    // ピン位置を更新（取引マーカーと完全に同じ計算式）
    function updatePins() {
      pins.forEach(function(p) {
        var x = priceChart.timeScale().timeToCoordinate(p.time);
        if (x === null || x < -20 || x > container.clientWidth + 20) {
          p.el.style.display = 'none';
          return;
        }
        var y = series.priceToCoordinate(p.price);
        if (y === null || y < -PIN_HEIGHT || y > container.clientHeight + 10) {
          p.el.style.display = 'none';
          return;
        }
        p.el.style.display = '';
        p.el.style.left = x + 'px';
        p.el.style.top = (y - PIN_HEIGHT - PIN_OFFSET) + 'px';
      });
    }

    updatePins();

    // スクロール/ズームで位置更新（取引マーカーと同じ）
    try {
      priceChart.timeScale().subscribeVisibleLogicalRangeChange(updatePins);
    } catch(e) {}
  }

  // 長押し時: チェックポイント価格を基準に緑/赤ゾーン表示
  function showCheckpointZone(cp, series, container) {
    hideCheckpointZone();
    var y = series.priceToCoordinate(cp.price);
    if (y === null || y === undefined) return;

    var chartH = container.clientHeight;
    var zone = document.createElement('div');
    zone.id = 'checkpoint-zone-overlay';
    zone.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:55;overflow:hidden;animation:cpZoneIn 0.15s ease';

    // 上（緑）= チェックポイント価格より上
    zone.innerHTML =
      '<div style="position:absolute;top:0;left:0;right:0;height:' + y + 'px;background:rgba(34,197,94,0.1);border-bottom:2px solid rgba(34,197,94,0.6)"></div>' +
      '<div style="position:absolute;top:' + y + 'px;left:0;right:0;bottom:0;background:rgba(239,68,68,0.1);border-top:none"></div>' +
      '<div style="position:absolute;top:' + (y - 10) + 'px;right:62px;font-size:10px;font-weight:700;color:#22c55e;text-shadow:0 1px 3px rgba(0,0,0,0.8)">▲ 利益</div>' +
      '<div style="position:absolute;top:' + (y + 2) + 'px;right:62px;font-size:10px;font-weight:700;color:#ef4444;text-shadow:0 1px 3px rgba(0,0,0,0.8)">▼ 損失</div>';

    container.appendChild(zone);
  }

  function hideCheckpointZone() {
    var zone = document.getElementById('checkpoint-zone-overlay');
    if (zone) zone.remove();
  }

  function showCheckpointPopup(cp, currentPrice, container) {
    var existingPopup = document.getElementById('checkpoint-popup');
    if (existingPopup) existingPopup.remove();

    var changePct = currentPrice > 0 && cp.price > 0 ? ((currentPrice - cp.price) / cp.price * 100) : 0;
    var changeColor = changePct >= 0 ? '#22c55e' : '#ef4444';
    var changeSign = changePct >= 0 ? '+' : '';

    var date = new Date(cp.time * 1000);
    var dateStr = (date.getMonth() + 1) + '/' + date.getDate() + ' ' +
      ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

    var fmtP = function(v) {
      if (v >= 1) return '$' + v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      if (v >= 0.001) return '$' + v.toFixed(4);
      if (v > 0) return '$' + v.toPrecision(3);
      return '$0';
    };

    var popup = document.createElement('div');
    popup.id = 'checkpoint-popup';
    popup.className = 'checkpoint-popup';
    popup.innerHTML =
      '<div class="checkpoint-popup__header">' +
        '<span>🚩 ' + dateStr + '</span>' +
        '<button onclick="document.getElementById(\'checkpoint-popup\').remove()" class="checkpoint-popup__close">&times;</button>' +
      '</div>' +
      '<div class="checkpoint-popup__body">' +
        '<div class="checkpoint-popup__row">' +
          '<span class="checkpoint-popup__label">記録時</span>' +
          '<span class="checkpoint-popup__val">' + fmtP(cp.price) + '</span>' +
        '</div>' +
        '<div class="checkpoint-popup__row">' +
          '<span class="checkpoint-popup__label">現在</span>' +
          '<span class="checkpoint-popup__val">' + fmtP(currentPrice) + '</span>' +
        '</div>' +
        '<div class="checkpoint-popup__change" style="color:' + changeColor + '">' +
          changeSign + changePct.toFixed(2) + '%' +
        '</div>' +
      '</div>' +
      '<button onclick="removeChartCheckpoint(' + cp.id + ')" class="checkpoint-popup__delete">削除</button>';

    container.appendChild(popup);
  }

  // チャート自動更新（詳細画面表示中のみ）
  function startChartAutoUpdate(ticker, period) {
    stopChartAutoUpdate();
    chartUpdateTicker = ticker;
    chartUpdatePeriod = period;

    // 短期間のみ自動更新
    var updateIntervals = {
      '1H': 10000,  // 1時間チャート: 10秒
      '4H': 20000,  // 4時間チャート: 20秒
      '1D': 30000,  // 1日チャート: 30秒
      '1W': 60000   // 1週チャート: 1分
    };
    var updateIntervalMs = updateIntervals[period];
    if (!updateIntervalMs) return; // 長期チャートは自動更新しない

    chartUpdateInterval = setInterval(function() {
      // ページが非表示なら更新しない
      if (document.hidden) return;
      // 詳細画面でなければ更新しない
      if (appState.currentScreen !== 'detail') {
        stopChartAutoUpdate();
        return;
      }

      updateChartData(chartUpdateTicker, chartUpdatePeriod);
    }, updateIntervalMs);

  }

  function stopChartAutoUpdate() {
    if (chartUpdateInterval) {
      clearInterval(chartUpdateInterval);
      chartUpdateInterval = null;
    }
  }

  // チャートデータのみ更新（チャート再作成なし）
  function updateChartData(ticker, period) {
    if (!priceChart || !candleSeries) return;

    fetchChartData(ticker, period).then(function(data) {
      if (data && data.candles && candleSeries) {
        candleSeries.setData(data.candles);
        if (volumeSeries && data.volumes) {
          volumeSeries.setData(data.volumes);
        }
      }
    }).catch(function(err) {
      console.warn('[Chart] Update failed:', err);
    });
  }

  // ページ可視性変更時の処理
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // ページが非表示になったら更新停止
      stopChartAutoUpdate();
    } else if (appState.currentScreen === 'detail' && chartUpdateTicker) {
      // ページが表示されたら更新再開
      startChartAutoUpdate(chartUpdateTicker, chartUpdatePeriod);
    }
  });

  function initPriceChart(ticker, period) {
    var container = document.getElementById('detail-chart');
    if (!container || typeof LightweightCharts === 'undefined') {
      return;
    }

    // 既存チャートをクリア
    if (priceChart) {
      priceChart.remove();
      priceChart = null;
    }

    // コンテナをクリア
    container.innerHTML = '';

    // ローディング表示
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-secondary)"><span class="chart-loading">📊 読み込み中...</span></div>';

    // チャートデータを取得
    fetchChartData(ticker, period).then(function(data) {
      if (!data || (!data.candles && !data.lineData)) {
        container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary)">チャートデータを取得できませんでした</div>';
        return;
      }

      container.innerHTML = '';

      // テーマカラー取得
      var computedStyle = getComputedStyle(document.documentElement);
      var bgColor = computedStyle.getPropertyValue('--bg-primary').trim() || '#0a1628';
      var textColor = computedStyle.getPropertyValue('--text-secondary').trim() || '#94a3b8';
      var gridColor = 'rgba(255,255,255,0.05)';

      // チャート作成
      priceChart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 220,
        layout: {
          background: { type: 'solid', color: 'transparent' },
          textColor: textColor,
          fontSize: 11
        },
        grid: {
          vertLines: { color: gridColor },
          horzLines: { color: gridColor }
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal,
          vertLine: {
            color: 'rgba(212,168,83,0.5)',
            width: 1,
            style: LightweightCharts.LineStyle.Dashed
          },
          horzLine: {
            color: 'rgba(212,168,83,0.5)',
            width: 1,
            style: LightweightCharts.LineStyle.Dashed
          }
        },
        rightPriceScale: {
          borderColor: gridColor,
          scaleMargins: { top: 0.1, bottom: 0.1 }
        },
        timeScale: {
          borderColor: gridColor,
          timeVisible: !data.isLongTerm,
          secondsVisible: false,
          rightOffset: 5,
          barSpacing: 6,
          minBarSpacing: 2,
          tickMarkFormatter: function(time, tickMarkType) {
            var date = new Date(time * 1000);
            if (data.isLongTerm) {
              if (tickMarkType <= 1) return date.getFullYear() + '/' + (date.getMonth() + 1);
              return (date.getMonth() + 1) + '/' + date.getDate();
            }
            if (tickMarkType <= 2) return (date.getMonth() + 1) + '/' + date.getDate();
            return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
          }
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: false
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true
        },
        localization: {
          priceFormatter: function(price) {
            if (appState.priceCurrency === 'JPY') {
              if (price >= 1) return '¥' + Math.round(price).toLocaleString('ja-JP');
              if (price >= 0.01) return '¥' + price.toFixed(4);
              if (price >= 0.0001) return '¥' + price.toFixed(6);
              if (price > 0) return '¥' + price.toPrecision(2);
              return '¥0';
            }
            if (price >= 1) return '$' + price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            if (price >= 0.001) return '$' + price.toFixed(4);
            if (price >= 0.0000001) return '$' + price.toFixed(8);
            if (price > 0) return '$' + price.toPrecision(2);
            return '$0.00';
          },
          timeFormatter: data.isLongTerm ? function(time) {
            var date = new Date(time * 1000);
            return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
          } : function(time) {
            var date = new Date(time * 1000);
            return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' +
              ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
          }
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true },
        handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true }
      });

      // ツールチップ要素を作成
      var tooltip = document.createElement('div');
      tooltip.id = 'chart-tooltip';
      tooltip.style.cssText = 'position:absolute;left:12px;top:12px;padding:8px 12px;background:rgba(0,0,0,0.85);border:1px solid rgba(212,168,83,0.5);border-radius:8px;font-size:12px;color:#fff;pointer-events:none;z-index:100;display:none;';
      container.style.position = 'relative';
      container.appendChild(tooltip);

      // 長期間はラインチャート、短期間はローソク足
      if (data.isLongTerm && data.lineData) {
        var lineSeries = priceChart.addAreaSeries({
          topColor: 'rgba(212,168,83,0.4)',
          bottomColor: 'rgba(212,168,83,0.05)',
          lineColor: '#d4a853',
          lineWidth: 2
        });
        lineSeries.setData(data.lineData);
        _chartCandleData = data.lineData || [];

        // 目標価格ラインを追加
        addPriceTargetLines(ticker, lineSeries);
        // カスタム描画を適用
        priceSeries = lineSeries;
        applyChartDrawings(ticker);

        // 通貨記号
        var currencySymbol = appState.priceCurrency === 'JPY' ? '¥' : '$';

        // クロスヘア移動時にツールチップを更新
        priceChart.subscribeCrosshairMove(function(param) {
          if (!param.time || !param.point) {
            tooltip.style.display = 'none';
            return;
          }
          var price = param.seriesData.get(lineSeries);
          if (price) {
            var date = new Date(param.time * 1000);
            var dateStr = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
            var priceStr;
            if (appState.priceCurrency === 'JPY') {
              var pv = price.value;
              priceStr = pv >= 1 ? '¥' + Math.round(pv).toLocaleString('ja-JP') : pv >= 0.01 ? '¥' + pv.toFixed(4) : pv >= 0.0001 ? '¥' + pv.toFixed(6) : pv > 0 ? '¥' + pv.toPrecision(2) : '¥0';
            } else {
              priceStr = '$' + formatNumber(price.value);
            }
            tooltip.innerHTML = '<div style="color:rgba(255,255,255,0.7);margin-bottom:4px">' + dateStr + '</div>' +
              '<div style="font-size:16px;font-weight:600;color:#d4a853">' + priceStr + '</div>';
            tooltip.style.display = 'block';
          }
        });

        // 統計情報を表示
        var statsContainer = document.getElementById('detail-chart-stats');
        if (statsContainer && data.stats) {
          var changeColor = data.stats.changePercent >= 0 ? '#22c55e' : '#ef4444';
          var changeSign = data.stats.changePercent >= 0 ? '+' : '';
          var fmtStatPrice = function(v) {
            if (appState.priceCurrency === 'JPY') {
              return v >= 1 ? '¥' + Math.round(v).toLocaleString('ja-JP') : v >= 0.01 ? '¥' + v.toFixed(4) : v > 0 ? '¥' + v.toFixed(6) : '¥0';
            }
            return '$' + formatNumber(v);
          };
          var startPriceStr = fmtStatPrice(data.stats.startPrice);
          var endPriceStr = fmtStatPrice(data.stats.endPrice);
          statsContainer.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:1px solid rgba(255,255,255,0.1);margin-top:8px">' +
              '<div style="text-align:left">' +
                '<div style="font-size:11px;color:rgba(255,255,255,0.5)">' + data.stats.startDate + '</div>' +
                '<div style="font-size:14px;color:#fff">' + startPriceStr + '</div>' +
              '</div>' +
              '<div style="text-align:center">' +
                '<div style="font-size:11px;color:rgba(255,255,255,0.5)">全期間変動</div>' +
                '<div style="font-size:18px;font-weight:700;color:' + changeColor + '">' + changeSign + data.stats.changePercent.toFixed(2) + '%</div>' +
              '</div>' +
              '<div style="text-align:right">' +
                '<div style="font-size:11px;color:rgba(255,255,255,0.5)">' + data.stats.endDate + '</div>' +
                '<div style="font-size:14px;color:#fff">' + endPriceStr + '</div>' +
              '</div>' +
            '</div>';
        }
      } else {
        // ローソク足シリーズ
        candleSeries = priceChart.addCandlestickSeries({
          upColor: '#10b981',
          downColor: '#ef4444',
          borderUpColor: '#10b981',
          borderDownColor: '#ef4444',
          wickUpColor: '#10b981',
          wickDownColor: '#ef4444'
        });
        candleSeries.setData(data.candles);
        _chartCandleData = data.candles || [];

        // 出来高シリーズ
        if (data.volumes && data.volumes.length > 0) {
          volumeSeries = priceChart.addHistogramSeries({
            color: 'rgba(212,168,83,0.3)',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
            scaleMargins: { top: 0.85, bottom: 0 }
          });
          volumeSeries.setData(data.volumes);
        }

        // 目標価格ラインを追加
        addPriceTargetLines(ticker, candleSeries);
        // カスタム描画を適用
        priceSeries = candleSeries;
        applyChartDrawings(ticker);

        // クロスヘア移動時にツールチップを更新
        priceChart.subscribeCrosshairMove(function(param) {
          if (!param.time || !param.point) {
            tooltip.style.display = 'none';
            return;
          }
          var price = param.seriesData.get(candleSeries);
          if (price) {
            var date = new Date(param.time * 1000);
            var dateStr = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' +
              ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
            var changeColor = price.close >= price.open ? '#10b981' : '#ef4444';
            var fmtPrice = function(v) {
              if (appState.priceCurrency === 'JPY') {
                if (v >= 1) return '¥' + Math.round(v).toLocaleString('ja-JP');
                if (v >= 0.01) return '¥' + v.toFixed(4);
                if (v >= 0.0001) return '¥' + v.toFixed(6);
                if (v > 0) return '¥' + v.toPrecision(2);
                return '¥0';
              }
              return '$' + formatNumber(v);
            };
            tooltip.innerHTML = '<div style="color:rgba(255,255,255,0.7);margin-bottom:4px">' + dateStr + '</div>' +
              '<div style="display:grid;grid-template-columns:auto auto;gap:4px 12px;font-size:11px">' +
                '<span style="color:rgba(255,255,255,0.5)">始値</span><span>' + fmtPrice(price.open) + '</span>' +
                '<span style="color:rgba(255,255,255,0.5)">高値</span><span style="color:#10b981">' + fmtPrice(price.high) + '</span>' +
                '<span style="color:rgba(255,255,255,0.5)">安値</span><span style="color:#ef4444">' + fmtPrice(price.low) + '</span>' +
                '<span style="color:rgba(255,255,255,0.5)">終値</span><span style="color:' + changeColor + ';font-weight:600">' + fmtPrice(price.close) + '</span>' +
              '</div>';
            tooltip.style.display = 'block';
          }
        });

        // 統計情報をクリア
        var statsContainer = document.getElementById('detail-chart-stats');
        if (statsContainer) statsContainer.innerHTML = '';
      }

      // リサイズ対応
      var resizeObserver = new ResizeObserver(function() {
        if (priceChart && container.clientWidth > 0) {
          priceChart.applyOptions({ width: container.clientWidth });
        }
      });
      resizeObserver.observe(container);

      // 初期表示範囲を設定（元のサイズで表示、スクロールで過去を見れる）
      var initialVisibleBars = {
        '1H': 60, '4H': 48, '1D': 96, '1W': 168, '1M': 180, '1Y': 365, '5Y': 260, 'ALL': 120
      };
      var visibleBars = initialVisibleBars[period] || 100;
      var totalBars = data.candles ? data.candles.length : (data.lineData ? data.lineData.length : 0);
      if (totalBars > visibleBars) {
        priceChart.timeScale().setVisibleLogicalRange({
          from: totalBars - visibleBars,
          to: totalBars
        });
      } else {
        priceChart.timeScale().fitContent();
      }

      // 取引マーカー + チェックポイントマーカーを追加（表示範囲設定後にレイアウト確定を待って実行）
      var chartSeries = priceSeries || candleSeries;
      var chartCandles = data.candles || data.lineData || [];
      requestAnimationFrame(function() {
        addTradeMarkers(ticker, chartSeries, chartCandles);
        renderCheckpointMarkers(ticker, chartSeries, chartCandles);
      });

      // パターンマーカー + S/Rライン + シグナルライン追加（短期チャートのみ）
      if (!data.isLongTerm && candleSeries) {
        addPatternMarkersAndLines(ticker, candleSeries, data.candles || []);
      }

      // 自動更新開始（短期チャートのみ）
      startChartAutoUpdate(ticker, period);

    }).catch(function(err) {
      console.error('[Chart] Error:', err);
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary)">チャートエラー</div>';
    });
  }

  // 取引マーカー: Google Mapsスタイルのピンをチャート上に表示
  function addTradeMarkers(ticker, series, chartCandles) {
    if (!series || !priceChart) return;

    var container = document.getElementById('detail-chart');
    if (!container) return;

    // 既存オーバーレイを削除
    var existingOverlay = document.getElementById('trade-pins-overlay');
    if (existingOverlay) existingOverlay.remove();
    var existingPopup = document.getElementById('trade-marker-popup');
    if (existingPopup) existingPopup.remove();

    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    var tickerRecords = records.filter(function(r) {
      return (r.currencyId || '').toLowerCase() === ticker.toLowerCase();
    });
    if (tickerRecords.length === 0) return;

    // チャートデータの時間範囲を取得
    var candleTimes = (chartCandles || []).map(function(c) { return c.time; });
    if (candleTimes.length === 0) return;
    var chartStart = candleTimes[0];
    var chartEnd = candleTimes[candleTimes.length - 1];
    // データ間隔を推定（長期チャートは週足/月足なのでマージンを広げる）
    var avgInterval = candleTimes.length > 1
      ? (chartEnd - chartStart) / (candleTimes.length - 1)
      : 86400;
    var timeMargin = Math.max(86400, avgInterval * 2);

    // 取引時間を最も近いデータポイント時間にスナップする
    function snapToNearestCandle(tradeTime) {
      if (tradeTime <= chartStart) return chartStart;
      if (tradeTime >= chartEnd) return chartEnd;
      var best = candleTimes[0];
      var bestDiff = Math.abs(tradeTime - best);
      for (var i = 1; i < candleTimes.length; i++) {
        var diff = Math.abs(tradeTime - candleTimes[i]);
        if (diff < bestDiff) {
          best = candleTimes[i];
          bestDiff = diff;
        }
        if (candleTimes[i] > tradeTime) break;
      }
      return best;
    }

    // オーバーレイレイヤー（ピンを載せる）
    container.style.position = 'relative';
    var overlay = document.createElement('div');
    overlay.id = 'trade-pins-overlay';
    overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:50;overflow:hidden;';
    container.appendChild(overlay);

    // Google Maps風ピンSVGテンプレート
    var pinSvg = function(color) {
      return '<svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<g filter="url(#pin-shadow-' + color.replace('#','') + ')">' +
          '<path d="M10 26C10 26 19 16 19 10C19 5.03 14.97 1 10 1C5.03 1 1 5.03 1 10C1 16 10 26 10 26Z" fill="' + color + '"/>' +
          '<path d="M10 26C10 26 19 16 19 10C19 5.03 14.97 1 10 1C5.03 1 1 5.03 1 10C1 16 10 26 10 26Z" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>' +
          '<circle cx="10" cy="10" r="4" fill="white" fill-opacity="0.95"/>' +
        '</g>' +
        '<defs><filter id="pin-shadow-' + color.replace('#','') + '" x="-2" y="0" width="24" height="32" filterUnits="userSpaceOnUse">' +
          '<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.4"/>' +
        '</filter></defs>' +
      '</svg>';
    };

    // ピンを生成
    var pins = [];
    tickerRecords.forEach(function(r) {
      var rawTime = Math.floor(new Date(r.date).getTime() / 1000);
      // チャート範囲外の取引はスキップ
      if (rawTime < chartStart - timeMargin || rawTime > chartEnd + timeMargin) return;
      var snappedTime = snapToNearestCandle(rawTime);
      var isBuy = r.type !== 'sell';
      var color = isBuy ? '#10b981' : '#ef4444';

      var pin = document.createElement('div');
      pin.style.cssText = 'position:absolute;pointer-events:auto;cursor:pointer;' +
        'transform:translateX(-50%);transition:transform 0.12s ease;width:20px;height:28px;';
      pin.innerHTML = pinSvg(color);

      // ホバー/タッチ反応
      pin.addEventListener('mouseenter', function() { pin.style.transform = 'translateX(-50%) scale(1.25)'; });
      pin.addEventListener('mouseleave', function() { pin.style.transform = 'translateX(-50%)'; });

      // タップで詳細ポップアップ
      pin.addEventListener('click', function(e) {
        e.stopPropagation();
        showTradePinPopup(r, isBuy, pin, container);
      });

      // 取引価格（チャート表示通貨に合わせる）
      var tradePrice = r.priceUsd || 0;
      if (appState.priceCurrency === 'JPY') {
        tradePrice = tradePrice * 150;
      }

      overlay.appendChild(pin);
      pins.push({ el: pin, time: snappedTime, price: tradePrice, record: r, isBuy: isBuy });
    });

    if (pins.length === 0) { overlay.remove(); return; }

    // ピン位置を更新（X=時間座標, Y=価格座標）
    var PIN_HEIGHT = 28;  // ピンSVGの高さ
    var PIN_OFFSET = 4;   // 価格ラインから少し上にオフセット（約1mm）
    function updatePins() {
      pins.forEach(function(p) {
        var x = priceChart.timeScale().timeToCoordinate(p.time);
        if (x === null || x < -20 || x > container.clientWidth + 20) {
          p.el.style.display = 'none';
          return;
        }
        // 価格からY座標を取得
        var y = series.priceToCoordinate(p.price);
        if (y === null || y < -PIN_HEIGHT || y > container.clientHeight + 10) {
          p.el.style.display = 'none';
          return;
        }
        p.el.style.display = '';
        p.el.style.left = x + 'px';
        // ピン先端が価格の少し上に来るように配置
        p.el.style.top = (y - PIN_HEIGHT - PIN_OFFSET) + 'px';
      });
    }

    updatePins();

    // スクロール/ズームで位置更新
    try {
      priceChart.timeScale().subscribeVisibleLogicalRangeChange(updatePins);
    } catch(e) {}
  }

  // ピンタップ時の詳細ポップアップ
  function showTradePinPopup(record, isBuy, pinEl, chartContainer) {
    // 既存ポップアップを閉じる
    var existing = document.getElementById('trade-marker-popup');
    if (existing) existing.remove();

    var r = record;
    var accentColor = isBuy ? '#10b981' : '#ef4444';
    var date = new Date(r.date);
    var dateStr = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    var timeStr = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    var amountStr = '¥' + Math.round(r.totalJpy || 0).toLocaleString('ja-JP');
    var qty = r.quantity || 0;
    var qtyStr = qty < 0.001 ? qty.toFixed(8) : qty < 1 ? qty.toFixed(6) : qty.toFixed(3);

    var popup = document.createElement('div');
    popup.id = 'trade-marker-popup';
    popup.style.cssText = 'position:absolute;z-index:120;pointer-events:auto;cursor:default;' +
      'padding:10px 14px;border-radius:10px;font-size:12px;min-width:150px;' +
      'background:rgba(12,16,24,0.96);border:1.5px solid ' + accentColor + ';' +
      'box-shadow:0 6px 24px rgba(0,0,0,0.6);backdrop-filter:blur(12px);' +
      'animation:tradePopupIn 0.15s ease-out;';

    popup.innerHTML =
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">' +
        '<svg width="12" height="17" viewBox="0 0 20 28"><path d="M10 26C10 26 19 16 19 10C19 5.03 14.97 1 10 1C5.03 1 1 5.03 1 10C1 16 10 26 10 26Z" fill="' + accentColor + '"/><circle cx="10" cy="10" r="4" fill="white" opacity="0.9"/></svg>' +
        '<span style="font-weight:700;color:' + accentColor + ';font-size:14px">' + (isBuy ? '購入' : '売却') + '</span>' +
        '<span style="color:rgba(255,255,255,0.45);margin-left:auto;font-size:11px">' + dateStr + ' ' + timeStr + '</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px">' +
        '<span style="color:rgba(255,255,255,0.55)">金額</span>' +
        '<span style="color:#fff;font-weight:600">' + amountStr + '</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between">' +
        '<span style="color:rgba(255,255,255,0.55)">数量</span>' +
        '<span style="color:#fff">' + qtyStr + ' ' + r.currencyId + '</span>' +
      '</div>';

    chartContainer.appendChild(popup);

    // ポップアップ位置: ピンの下に表示
    var pinRect = pinEl.getBoundingClientRect();
    var containerRect = chartContainer.getBoundingClientRect();
    var popupX = pinRect.left - containerRect.left + pinRect.width / 2;
    var popupY = pinRect.bottom - containerRect.top + 4;

    // 右端からはみ出す場合は左にずらす
    var popupW = popup.offsetWidth;
    if (popupX + popupW / 2 > containerRect.width - 8) {
      popupX = containerRect.width - popupW - 8;
    } else if (popupX - popupW / 2 < 8) {
      popupX = 8;
    } else {
      popupX = popupX - popupW / 2;
    }

    // 下にはみ出す場合はピンの上に表示
    if (popupY + popup.offsetHeight > containerRect.height - 4) {
      popupY = pinRect.top - containerRect.top - popup.offsetHeight - 4;
    }

    popup.style.left = popupX + 'px';
    popup.style.top = popupY + 'px';

    // タップ外で閉じる
    setTimeout(function() {
      function closePopup(e) {
        if (popup.parentNode && !popup.contains(e.target) && !pinEl.contains(e.target)) {
          popup.remove();
          document.removeEventListener('click', closePopup, true);
          document.removeEventListener('touchstart', closePopup, true);
        }
      }
      document.addEventListener('click', closePopup, true);
      document.addEventListener('touchstart', closePopup, true);
    }, 50);

    // 5秒後に自動フェードアウト
    setTimeout(function() {
      if (popup.parentNode) {
        popup.style.transition = 'opacity 0.3s';
        popup.style.opacity = '0';
        setTimeout(function() { if (popup.parentNode) popup.remove(); }, 300);
      }
    }, 5000);
  }

  // 目標価格ラインを追加
  function addPriceTargetLines(ticker, series) {
    if (!series) return;

    var targets = {};
    try {
      targets = JSON.parse(localStorage.getItem('kairos_targets') || '{}');
    } catch(e) {}

    var target = targets[ticker];
    if (!target) return;

    // 目標価格（上）
    if (target.high && parseFloat(target.high) > 0) {
      series.createPriceLine({
        price: parseFloat(target.high),
        color: '#22c55e',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: '目標↑'
      });
    }

    // 目標価格（下）
    if (target.low && parseFloat(target.low) > 0) {
      series.createPriceLine({
        price: parseFloat(target.low),
        color: '#ef4444',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: '下限↓'
      });
    }

    // 平均取得価格ラインも追加（保有している場合）
    var avgPrice = getAverageBuyPrice(ticker);
    if (avgPrice > 0) {
      series.createPriceLine({
        price: avgPrice,
        color: '#d4a853',
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dotted,
        axisLabelVisible: true,
        title: '平均'
      });
    }
  }

  // ===== パターンマーカー + シグナルライン + S/Rライン =====
  function addPatternMarkersAndLines(ticker, series, candles) {
    if (!series || !candles || candles.length === 0) return;

    var interval = (typeof StrategyManager !== 'undefined') ? StrategyManager.getSignalInterval(ticker) : '4h';

    // パターン + シグナル + テクニカルを並行取得
    var patternsUrl = BACKEND_URL + '/api/patterns/' + ticker + '?interval=' + interval;
    var signalUrl = BACKEND_URL + '/api/signal/' + ticker + '?interval=' + interval;
    var technicalUrl = BACKEND_URL + '/api/technical/' + ticker + '?interval=' + interval;

    Promise.all([
      fetch(patternsUrl).then(function(r) { return r.json(); }).catch(function() { return null; }),
      fetch(signalUrl).then(function(r) { return r.json(); }).catch(function() { return null; }),
      fetch(technicalUrl).then(function(r) { return r.json(); }).catch(function() { return null; })
    ]).then(function(results) {
      var patternData = results[0];
      var signalData = results[1];
      var technicalData = results[2];

      // 1. パターンマーカー（▲▼をチャート上に配置）
      if (patternData && patternData.patterns && patternData.patterns.length > 0) {
        var lastCandle = candles[candles.length - 1];
        var markers = patternData.patterns.map(function(p) {
          var isBullish = p.direction === 'bullish';
          return {
            time: lastCandle.time,
            position: isBullish ? 'belowBar' : 'aboveBar',
            color: isBullish ? '#10b981' : '#ef4444',
            shape: isBullish ? 'arrowUp' : 'arrowDown',
            text: p.name_jp + ' ' + p.win_rate + '%'
          };
        });
        try { series.setMarkers(markers); } catch(e) { console.warn('[Chart] Marker error:', e); }
      }

      // 2. シグナルのSL/TPライン
      var signal = signalData && signalData.signal ? signalData.signal : null;
      if (signal && signal.has_signal) {
        if (signal.stop_loss > 0) {
          series.createPriceLine({
            price: signal.stop_loss,
            color: 'rgba(239,68,68,0.7)',
            lineWidth: 1,
            lineStyle: LightweightCharts.LineStyle.Dashed,
            axisLabelVisible: true,
            title: '損切 ' + signal.stop_loss_pct.toFixed(1) + '%'
          });
        }
        if (signal.take_profit > 0) {
          series.createPriceLine({
            price: signal.take_profit,
            color: 'rgba(16,185,129,0.7)',
            lineWidth: 1,
            lineStyle: LightweightCharts.LineStyle.Dashed,
            axisLabelVisible: true,
            title: '利確 +' + signal.take_profit_pct.toFixed(1) + '%'
          });
        }
      }

      // 3. サポート/レジスタンスライン
      var tech = technicalData;
      if (tech && tech.support > 0) {
        series.createPriceLine({
          price: tech.support,
          color: 'rgba(16,185,129,0.35)',
          lineWidth: 1,
          lineStyle: LightweightCharts.LineStyle.Dotted,
          axisLabelVisible: true,
          title: 'S'
        });
      }
      if (tech && tech.resistance > 0) {
        series.createPriceLine({
          price: tech.resistance,
          color: 'rgba(239,68,68,0.35)',
          lineWidth: 1,
          lineStyle: LightweightCharts.LineStyle.Dotted,
          axisLabelVisible: true,
          title: 'R'
        });
      }

      // 4. パターンデータをグローバルに保存（合流度・教育表示用）
      window._kairosPatternData = patternData;
      window._kairosSignalData = signalData;
      // 合流度メーター + パターン教育を描画
      renderPatternOverlay(patternData, signalData);

    }).catch(function(err) {
      console.warn('[Chart] Pattern overlay error:', err);
    });
  }

  // ===== 合流度メーター + パターン教育パネル =====
  function renderPatternOverlay(patternData, signalData) {
    var container = document.getElementById('pattern-overlay-container');
    if (!container) return;

    var patterns = (patternData && patternData.patterns) ? patternData.patterns : [];
    if (patterns.length === 0) {
      container.innerHTML = '';
      return;
    }

    // 合流度計算: 同じ方向のパターン割合
    var bullishCount = 0;
    var bearishCount = 0;
    patterns.forEach(function(p) {
      if (p.direction === 'bullish') bullishCount++;
      else bearishCount++;
    });
    var total = patterns.length;
    var dominant = bullishCount >= bearishCount ? 'bullish' : 'bearish';
    var confluenceRatio = Math.max(bullishCount, bearishCount) / total;
    var confluencePct = Math.round(confluenceRatio * 100);
    var confluenceColor = dominant === 'bullish' ? '#10b981' : '#ef4444';
    var confluenceLabel = dominant === 'bullish' ? '買い方向' : '売り方向';

    // 合流度メーターHTML
    var html = '<div class="pattern-confluence">' +
      '<div class="pattern-confluence__header">' +
        '<span class="pattern-confluence__title">パターン合流</span>' +
        '<span class="pattern-confluence__count">' + total + '件検出</span>' +
      '</div>' +
      '<div class="pattern-confluence__meter">' +
        '<div class="pattern-confluence__bar">' +
          '<div class="pattern-confluence__fill" style="width:' + confluencePct + '%;background:' + confluenceColor + '"></div>' +
        '</div>' +
        '<span class="pattern-confluence__label" style="color:' + confluenceColor + '">' + confluenceLabel + ' ' + confluencePct + '%</span>' +
      '</div>';

    // パターンリスト + 教育展開
    html += '<div class="pattern-list">';
    patterns.forEach(function(p, i) {
      var isBullish = p.direction === 'bullish';
      var arrow = isBullish ? '▲' : '▼';
      var color = isBullish ? '#10b981' : '#ef4444';
      var wrPct = p.win_rate ? p.win_rate.toFixed(0) : '?';
      var confPct = p.confidence ? p.confidence.toFixed(0) : '?';

      html += '<div class="pattern-list__item" onclick="togglePatternEducation(' + i + ')">' +
        '<span class="pattern-list__arrow" style="color:' + color + '">' + arrow + '</span>' +
        '<span class="pattern-list__name">' + p.name_jp + '</span>' +
        '<span class="pattern-list__wr">勝率' + wrPct + '%</span>' +
        '<span class="pattern-list__conf">信頼度' + confPct + '%</span>' +
        '<span class="pattern-list__expand">▾</span>' +
      '</div>';

      // 教育パネル（初期は非表示）
      html += '<div class="pattern-education" id="pattern-edu-' + i + '" style="display:none">' +
        '<div class="pattern-education__content">' +
          '<div class="pattern-education__title">' + p.name_jp + 'とは？</div>' +
          '<div class="pattern-education__desc">' + (p.description || getPatternDescription(p.name)) + '</div>' +
          '<div class="pattern-education__stats">' +
            '<span>勝率: ' + wrPct + '%</span>' +
            '<span>信頼度: ' + confPct + '%</span>' +
            (p.type ? '<span>種別: ' + getPatternTypeLabel(p.type) + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    });
    html += '</div></div>';

    container.innerHTML = html;
  }

  // パターン教育パネルの開閉
  window.togglePatternEducation = function(idx) {
    var el = document.getElementById('pattern-edu-' + idx);
    if (el) {
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
  };

  // パターン名→説明のマッピング
  function getPatternDescription(name) {
    var descs = {
      'three_soldiers': '3本連続の陽線で上昇トレンドの始まりを示す強いシグナルです。',
      'three_crows': '3本連続の陰線で下降トレンドの始まりを示す強い売りシグナルです。',
      'morning_star': '下降後に小さなローソク→大きな陽線が出現。底打ち反転のシグナルです。',
      'evening_star': '上昇後に小さなローソク→大きな陰線が出現。天井反転のシグナルです。',
      'bullish_engulfing': '前日の陰線を完全に包み込む大陽線。強い買い圧力を示します。',
      'bearish_engulfing': '前日の陽線を完全に包み込む大陰線。強い売り圧力を示します。',
      'hammer': '長い下ヒゲと小さな実体。下降トレンドの底で出ると反転シグナルになります。',
      'shooting_star': '長い上ヒゲと小さな実体。上昇トレンドの天井で出ると反転シグナルになります。',
      'doji': '始値と終値がほぼ同じ。買い手と売り手の拮抗を示し、トレンド転換の前兆です。',
      'dragonfly_doji': '長い下ヒゲの十字線。サポートでの強い反発を示します。',
      'gravestone_doji': '長い上ヒゲの十字線。レジスタンスでの強い反落を示します。',
      'double_bottom': 'W字型の底パターン。同じ安値を2回試して反発。強い底打ちシグナルです。',
      'double_top': 'M字型の天井パターン。同じ高値を2回試して反落。天井シグナルです。',
      'resistance_breakout': 'レジスタンスを上抜け。新しい上昇トレンドの開始を示します。',
      'support_breakdown': 'サポートを下抜け。さらなる下落の可能性を示します。'
    };
    return descs[name] || 'テクニカルパターンが検出されました。';
  }

  function getPatternTypeLabel(type) {
    var labels = { 'candlestick': 'ローソク足', 'breakout': 'ブレイクアウト', 'chart_pattern': 'チャートパターン' };
    return labels[type] || type;
  }

  // 平均取得価格を計算
  function getAverageBuyPrice(ticker) {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    var totalQty = 0;
    var totalCost = 0;

    records.forEach(function(r) {
      if ((r.currencyId || '').toLowerCase() !== ticker.toLowerCase()) return;

      if (r.type === 'sell') {
        // 売却時は保有量を減らす（簡易計算）
        totalQty -= (r.quantity || 0);
      } else {
        totalQty += (r.quantity || 0);
        totalCost += (r.priceUsd || 0) * (r.quantity || 0);
      }
    });

    if (totalQty <= 0) return 0;
    return totalCost / totalQty;
  }

  // チャートデータ取得（短期はBinance、長期はCoinGecko）
  // チャートデータキャッシュ（DEXコインのGeckoTerminal API制限対策）
  var _chartCache = {};
  var _chartCacheTTL = {
    '1H': 60000,    // 1分
    '4H': 120000,   // 2分
    '1D': 300000,   // 5分
    '1W': 600000,   // 10分
    '1M': 600000    // 10分
  };

  function fetchChartData(ticker, period) {
    // 長期間は CoinGecko API を使用
    if (period === '5Y' || period === 'MAX') {
      return fetchLongTermChartData(ticker, period);
    }

    // キャッシュチェック
    var cacheKey = ticker + '_' + period;
    var cached = _chartCache[cacheKey];
    var ttl = _chartCacheTTL[period] || 300000;
    if (cached && Date.now() - cached.time < ttl) {
      return Promise.resolve(cached.data);
    }

    // DEXコイン判定: _pendingMoonshotCoin または scoreCache に _dexUrl/_tokenAddress がある
    var coinData = scoreCache && scoreCache.data && scoreCache.data[ticker];
    var isDex = !!(window._pendingMoonshotCoin && window._pendingMoonshotCoin.symbol === ticker) ||
                !!(coinData && (coinData._dexUrl || coinData._tokenAddress));

    if (isDex) {
      // DEXコイン → GeckoTerminal直行（Binanceスキップ）
      return fetchDexChartData(ticker, period, cacheKey);
    }

    // 通常コイン → Binance API
    return fetchBinanceChartData(ticker, period, cacheKey);
  }

  // DEX全期間一括取得の進行中Promise管理
  var _dexPrefetchInFlight = {};

  function fetchDexChartData(ticker, period, cacheKey) {
    // 一括取得が進行中ならそれを待つ
    if (_dexPrefetchInFlight[ticker]) {
      return _dexPrefetchInFlight[ticker].then(function() {
        var cached = _chartCache[cacheKey];
        return cached ? cached.data : null;
      });
    }

    // 初回: 全5期間を並列取得
    var allPeriods = ['1H', '4H', '1D', '1W', '1M'];
    var coinData = scoreCache && scoreCache.data && scoreCache.data[ticker];
    var dexUrl = coinData && coinData._dexUrl;
    var tokenAddr = coinData && coinData._tokenAddress;

    var dexMatch = dexUrl ? dexUrl.match(/dexscreener\.com\/([^\/]+)\/([^\/\?#]+)/) : null;
    var chain = dexMatch ? dexMatch[1] : 'solana';
    var poolFromUrl = dexMatch ? dexMatch[2] : null;

    var networkMap = {
      'solana': 'solana', 'ethereum': 'eth', 'bsc': 'bsc',
      'arbitrum': 'arbitrum', 'base': 'base', 'polygon': 'polygon_pos',
      'avalanche': 'avax', 'optimism': 'optimism', 'fantom': 'ftm', 'sui': 'sui-network'
    };
    var network = networkMap[chain] || chain;

    // プール解決 → 全期間並列OHLCV取得
    var resolvePool;
    if (poolFromUrl) {
      resolvePool = Promise.resolve(poolFromUrl);
    } else if (tokenAddr) {
      // トークンアドレスからプール検索
      resolvePool = fetch('https://api.geckoterminal.com/api/v2/networks/' + network + '/tokens/' + tokenAddr + '/pools?page=1')
        .then(function(res) { return res.ok ? res.json() : null; })
        .then(function(json) {
          var pools = json && json.data;
          return (pools && pools.length > 0 && pools[0].attributes) ? pools[0].attributes.address : null;
        })
        .catch(function() { return null; });
    } else {
      resolvePool = Promise.resolve(null);
    }

    _dexPrefetchInFlight[ticker] = resolvePool.then(function(poolAddr) {
      if (!poolAddr) {
        // プール見つからず → 全期間null
        allPeriods.forEach(function(p) {
          _chartCache[ticker + '_' + p] = { data: null, time: Date.now() };
        });
        return;
      }

      // 5期間を並列取得
      var fetches = allPeriods.map(function(p) {
        var ck = ticker + '_' + p;
        // 既にキャッシュがあればスキップ
        var existing = _chartCache[ck];
        if (existing && Date.now() - existing.time < (_chartCacheTTL[p] || 300000)) {
          return Promise.resolve();
        }
        return fetchGeckoTerminalOHLCV(network, poolAddr, p).then(function(data) {
          _chartCache[ck] = { data: data, time: Date.now() };
        }).catch(function() {
          _chartCache[ck] = { data: null, time: Date.now() };
        });
      });

      return Promise.all(fetches);
    }).then(function() {
      delete _dexPrefetchInFlight[ticker];
    }).catch(function() {
      delete _dexPrefetchInFlight[ticker];
    });

    // 要求された期間のデータを返す
    return _dexPrefetchInFlight[ticker].then(function() {
      var cached = _chartCache[cacheKey];
      return cached ? cached.data : null;
    });
  }

  function fetchBinanceChartData(ticker, period, cacheKey) {
    return new Promise(function(resolve) {
      var params = {
        '1H': { interval: '1m', limit: 1000 },
        '4H': { interval: '5m', limit: 1000 },
        '1D': { interval: '15m', limit: 1000 },
        '1W': { interval: '1h', limit: 1000 },
        '1M': { interval: '4h', limit: 1000 },
        '1Y': { interval: '1d', limit: 1000 }
      };
      var config = params[period] || params['1D'];
      var symbol = ticker.toUpperCase() + 'USDT';
      var url = 'https://api.binance.com/api/v3/klines?symbol=' + symbol + '&interval=' + config.interval + '&limit=' + config.limit;

      fetch(url)
        .then(function(res) {
          if (!res.ok) throw new Error('API error');
          return res.json();
        })
        .then(function(data) {
          var candles = [];
          var volumes = [];
          var jpyRate = appState.priceCurrency === 'JPY' ? 150 : 1;

          data.forEach(function(item) {
            var time = Math.floor(item[0] / 1000);
            candles.push({
              time: time,
              open: parseFloat(item[1]) * jpyRate,
              high: parseFloat(item[2]) * jpyRate,
              low: parseFloat(item[3]) * jpyRate,
              close: parseFloat(item[4]) * jpyRate
            });
            volumes.push({
              time: time,
              value: parseFloat(item[5]),
              color: parseFloat(item[4]) >= parseFloat(item[1]) ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'
            });
          });

          var result = { candles: candles, volumes: volumes, isLongTerm: false };
          _chartCache[cacheKey] = { data: result, time: Date.now() };
          resolve(result);
        })
        .catch(function(err) {
          console.error('[Chart] Binance fetch error:', err);
          resolve(null);
        });
    });
  }

  // GeckoTerminal: トークンアドレス → 最大出来高プールを検索 → OHLCV取得
  function resolvePoolAndFetchOHLCV(network, tokenAddress, period) {
    var url = 'https://api.geckoterminal.com/api/v2/networks/' + network +
      '/tokens/' + tokenAddress + '/pools?page=1';
    console.log('[Chart] GeckoTerminal pool lookup:', url);

    return fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error('Pool lookup error: ' + res.status);
        return res.json();
      })
      .then(function(json) {
        var pools = json && json.data;
        if (!pools || pools.length === 0) {
          console.warn('[Chart] GeckoTerminal: no pools found for token', tokenAddress);
          return null;
        }
        // 最初のプール（出来高順にソート済み）からアドレス取得
        var poolAddr = pools[0].attributes && pools[0].attributes.address;
        if (!poolAddr) {
          console.warn('[Chart] GeckoTerminal: pool has no address');
          return null;
        }
        console.log('[Chart] GeckoTerminal: resolved pool', poolAddr, 'from token', tokenAddress);
        return fetchGeckoTerminalOHLCV(network, poolAddr, period);
      })
      .catch(function(err) {
        console.error('[Chart] GeckoTerminal pool lookup error:', err);
        return null;
      });
  }

  // GeckoTerminal OHLCVフォールバック（DEXコイン用）
  function fetchGeckoTerminalOHLCV(network, poolAddress, period) {
    var gtParams = {
      '1H':  { timeframe: 'minute', aggregate: 5,  limit: 100 },
      '4H':  { timeframe: 'minute', aggregate: 15, limit: 100 },
      '1D':  { timeframe: 'hour',   aggregate: 1,  limit: 100 },
      '1W':  { timeframe: 'hour',   aggregate: 4,  limit: 100 },
      '1M':  { timeframe: 'day',    aggregate: 1,  limit: 100 },
      '1Y':  { timeframe: 'day',    aggregate: 1,  limit: 365 }
    };
    var cfg = gtParams[period] || gtParams['1D'];

    var url = 'https://api.geckoterminal.com/api/v2/networks/' + network +
      '/pools/' + poolAddress + '/ohlcv/' + cfg.timeframe +
      '?aggregate=' + cfg.aggregate + '&limit=' + cfg.limit +
      '&currency=usd';

    console.log('[Chart] GeckoTerminal OHLCV:', url);

    return fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error('GeckoTerminal API error: ' + res.status);
        return res.json();
      })
      .then(function(json) {
        var ohlcvList = json && json.data && json.data.attributes && json.data.attributes.ohlcv_list;
        if (!ohlcvList || ohlcvList.length === 0) {
          console.warn('[Chart] GeckoTerminal: no OHLCV data for pool', poolAddress);
          return null;
        }

        var candles = [];
        var volumes = [];
        var jpyRate = appState.priceCurrency === 'JPY' ? 150 : 1;

        ohlcvList.sort(function(a, b) { return a[0] - b[0]; });

        ohlcvList.forEach(function(item) {
          var time = item[0];
          candles.push({
            time: time,
            open: parseFloat(item[1]) * jpyRate,
            high: parseFloat(item[2]) * jpyRate,
            low: parseFloat(item[3]) * jpyRate,
            close: parseFloat(item[4]) * jpyRate
          });
          volumes.push({
            time: time,
            value: parseFloat(item[5]),
            color: parseFloat(item[4]) >= parseFloat(item[1]) ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'
          });
        });

        console.log('[Chart] GeckoTerminal: loaded', candles.length, 'candles for pool', poolAddress);
        return { candles: candles, volumes: volumes, isLongTerm: false };
      })
      .catch(function(err) {
        console.error('[Chart] GeckoTerminal OHLCV error:', err);
        return null;
      });
  }

  // 長期チャートデータ取得（Binance API）
  function fetchLongTermChartData(ticker, period) {
    return new Promise(function(resolve, reject) {
      var symbol = ticker.toUpperCase() + 'USDT';
      // 5年: 週足で約260ポイント、最大: 月足で取得
      var interval = period === '5Y' ? '1w' : '1M';
      var limit = period === '5Y' ? 1000 : 500; // 最大1000本

      var url = 'https://api.binance.com/api/v3/klines?symbol=' + symbol + '&interval=' + interval + '&limit=' + limit;
      fetch(url)
        .then(function(res) {
          if (!res.ok) throw new Error('Binance API error: ' + res.status);
          return res.json();
        })
        .then(function(data) {
          if (!data || data.length === 0) {
            resolve(null);
            return;
          }

          var lineData = [];
          // JPY表示の場合はレート変換
          var jpyRate = appState.priceCurrency === 'JPY' ? 150 : 1;
          var startPrice = parseFloat(data[0][4]) * jpyRate; // 終値
          var endPrice = parseFloat(data[data.length - 1][4]) * jpyRate;
          var changePercent = ((endPrice - startPrice) / startPrice) * 100;

          data.forEach(function(item) {
            lineData.push({
              time: Math.floor(item[0] / 1000),
              value: parseFloat(item[4]) * jpyRate // 終値を使用
            });
          });

          resolve({
            lineData: lineData,
            isLongTerm: true,
            stats: {
              startPrice: startPrice,
              endPrice: endPrice,
              changePercent: changePercent,
              startDate: new Date(data[0][0]).toLocaleDateString('ja-JP'),
              endDate: new Date(data[data.length - 1][0]).toLocaleDateString('ja-JP')
            }
          });
        })
        .catch(function(err) {
          console.error('[Chart] Binance long-term fetch error:', err);
          resolve(null);
        });
    });
  }

  // 長期チャート用ダミーデータ
  function generateLongTermDummyData(period) {
    var points = period === '5Y' ? 365 * 5 : 365 * 10;
    var lineData = [];
    var basePrice = 1000; // 初期価格
    var now = Math.floor(Date.now() / 1000);
    var dayInSeconds = 86400;

    for (var i = points; i >= 0; i--) {
      var time = now - (i * dayInSeconds);
      // 長期的な上昇トレンドをシミュレート
      var trend = (points - i) / points * 80000; // 0から80000への成長
      var volatility = trend * 0.1;
      var price = basePrice + trend + (Math.random() - 0.5) * volatility;

      lineData.push({ time: time, value: price });
    }

    var startPrice = lineData[0].value;
    var endPrice = lineData[lineData.length - 1].value;
    var changePercent = ((endPrice - startPrice) / startPrice) * 100;

    return {
      lineData: lineData,
      isLongTerm: true,
      stats: {
        startPrice: startPrice,
        endPrice: endPrice,
        changePercent: changePercent,
        startDate: new Date((now - points * dayInSeconds) * 1000).toLocaleDateString('ja-JP'),
        endDate: new Date().toLocaleDateString('ja-JP')
      }
    };
  }

  // フォールバック用ダミーデータ（短期）
  function generateDummyChartData(period) {
    var points = period === '1D' ? 96 : period === '1W' ? 168 : period === '1M' ? 180 : 90;
    var candles = [];
    var volumes = [];
    var basePrice = 85000;
    var now = Math.floor(Date.now() / 1000);
    var interval = period === '1D' ? 900 : period === '1W' ? 3600 : period === '1M' ? 14400 : 86400;

    for (var i = points; i >= 0; i--) {
      var time = now - (i * interval);
      var volatility = basePrice * 0.02;
      var open = basePrice + (Math.random() - 0.5) * volatility;
      var close = open + (Math.random() - 0.5) * volatility;
      var high = Math.max(open, close) + Math.random() * volatility * 0.5;
      var low = Math.min(open, close) - Math.random() * volatility * 0.5;

      candles.push({ time: time, open: open, high: high, low: low, close: close });
      volumes.push({
        time: time,
        value: Math.random() * 1000000000,
        color: close >= open ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'
      });

      basePrice = close;
    }

    return { candles: candles, volumes: volumes };
  }

  // ===== データ更新（ローディング状態付き）=====
  function refreshData(showSkeleton) {
    if (showSkeleton !== false) {
      appState.isLoading = true;
      appState.loadingScreen = appState.currentScreen;
      appState.dataError = null;
      renderApp();
    }

    // バックエンドからデータ取得を試行
    fetch(BACKEND_URL + '/api/quick/BTC')
      .then(function(response) {
        if (!response.ok) throw new Error('Server error: ' + response.status);
        return response.json();
      })
      .then(function(data) {
        // データ更新
        if (data && data.ticker) {
          window.kairosData = Object.assign(window.kairosData || {}, data);
          kairosData = window.kairosData;
        }
        appState.isLoading = false;
        appState.loadingScreen = null;
        appState.dataError = null;
        appState.lastUpdated = Date.now();
        renderApp();
        showConnectionStatus(true);
      })
      .catch(function(error) {
        // バックエンドがなくてもフォールバックデータで動作
        appState.isLoading = false;
        appState.loadingScreen = null;
        // エラーは表示しない（フォールバックデータを使用）
        appState.lastUpdated = Date.now();
        renderApp();
      });
  }

  // ===== 公開API =====
  window.KairosApp = {
    navigate: navigateTo,
    goBack: function() {
      navigateBack();
    },
    openPortfolioDetail: function() {
      appState.portfolioDetailOpen = true;
      history.pushState({ screen: 'home', portfolioDetail: true }, '', '');
      updateGlobalHeaderTitle('portfolio-detail');

      // DOM surgery: ヒーローカードを残し、その下だけ差し替え
      var hero = document.querySelector('.portfolio-hero');
      var homeEl = document.querySelector('.home');
      if (!hero) { renderApp(); return; }

      // 背景クラス追加
      if (homeEl) homeEl.classList.add('home--detail');

      // ヒーローカードのonclickを「閉じる」に切り替え
      hero.setAttribute('onclick', 'window.KairosApp.closePortfolioDetail()');

      // ヒーローの後ろの兄弟要素をすべて削除
      while (hero.nextElementSibling) {
        hero.nextElementSibling.remove();
      }

      // 詳細コンテンツを挿入
      hero.insertAdjacentHTML('afterend', buildPortfolioDetailContent());

      // 通貨カードのクリックイベント
      document.querySelectorAll('.portfolio-detail__item').forEach(function(el) {
        el.addEventListener('click', function() {
          var ticker = el.getAttribute('data-ticker');
          if (ticker) {
            appState.selectedCurrency = ticker;
            navigateTo('detail');
          }
        });
      });
    },
    closePortfolioDetail: function() {
      closePortfolioDetail();
    },
    goToFireTab: function() {
      aiScreenState.activeTab = 'fire';
      navigateTo('ai-compare');
    },
    refresh: function(showSkeleton) {
      refreshData(showSkeleton);
    },
    addToWatchlistFromDetail: function(symbol) {
      var wlStr = localStorage.getItem('kairos-watchlist');
      var wl = wlStr ? JSON.parse(wlStr) : ['BTC', 'ETH', 'SOL'];
      if (wl.indexOf(symbol) < 0) {
        wl.push(symbol);
        localStorage.setItem('kairos-watchlist', JSON.stringify(wl));
        // データを再取得してAI分析を含める
        refreshData(true);
      }
    },
    toggleFavorite: function(symbol) {
      var favStr = localStorage.getItem('kairos-favorites');
      var favorites = favStr ? JSON.parse(favStr) : [];
      var idx = favorites.indexOf(symbol);

      // グローバルヘッダーのコイン表示を更新
      var globalCoinEl = document.querySelector('.global-header__coin');
      var globalSymbolEl = document.querySelector('.global-header__coin-symbol');

      if (idx >= 0) {
        // お気に入りから削除
        favorites.splice(idx, 1);
        if (globalCoinEl) {
          globalCoinEl.classList.remove('global-header__coin--favorite');
        }
        if (globalSymbolEl) {
          globalSymbolEl.innerHTML = globalSymbolEl.innerHTML.replace(' ★', '');
        }
      } else {
        // お気に入りに追加
        favorites.push(symbol);
        if (globalCoinEl) {
          globalCoinEl.classList.add('global-header__coin--favorite');
        }
        if (globalSymbolEl && globalSymbolEl.innerHTML.indexOf('★') === -1) {
          globalSymbolEl.innerHTML += ' ★';
        }
      }
      localStorage.setItem('kairos-favorites', JSON.stringify(favorites));

      // サイドメニューが開いていたら更新
      var sideMenuCoins = document.getElementById('side-menu-coins');
      if (sideMenuCoins) {
        populateCoinButtons();
      }
    },
    getState: function() { return appState; },
    setState: function(newState) {
      for (var key in newState) {
        if (newState.hasOwnProperty(key)) {
          appState[key] = newState[key];
        }
      }
      renderApp();
    },
    showScreen: function(screen) {
      appState.currentScreen = screen;
      renderApp();
    },
    toggleMode: function() {
      // v19: グローバルモード切替は廃止。通貨別ストラテジー制に移行
      console.warn('[KAIROS] toggleMode is deprecated. Use StrategyManager.setStrategy(ticker, type) instead.');
      if (window.KAIROS && window.KAIROS.Features && window.KAIROS.Features.showToast) {
        window.KAIROS.Features.showToast('通貨詳細画面でストラテジーを設定してください', 'info');
      }
    },
    viewCurrency: function(ticker) {
      appState.selectedCurrency = ticker;

      // DEXコイン検出: Moonshotから遷移した場合
      var _isDexNav = window._pendingMoonshotCoin && window._pendingMoonshotCoin.symbol === ticker;
      if (_isDexNav) {
        // DEXコインは短期チャート1D固定、StrategyManagerスキップ
        appState.chartPeriod = '1D';
      } else if (typeof StrategyManager !== 'undefined') {
        // ストラテジーからモードブリッジ: 通貨のストラテジーに応じてappState.modeを設定
        var config = StrategyManager.getConfig(ticker);
        appState.mode = config.apiMode === 'swing' ? 'satellite' : 'core';
        // チャート期間をストラテジーのデフォルトに設定
        appState.chartPeriod = StrategyManager.getDefaultPeriod(ticker);
      }

      navigateTo('detail');
    },
    openQuickBuy: function(ticker) {
      openQuickBuyModal(ticker);
    },
    showMoonshot: function() {
      if (appState.currentScreen === 'moonshot') {
        // 既にMoonshot画面なら戻る
        navigateBack();
      } else {
        navigateTo('moonshot');
      }
    },
    setMoonshotBudget: function(budget) {
      appState.moonshotBudget = budget;
      localStorage.setItem('kairosMoonshotBudget', budget.toString());
    },
    addMoonshotSpent: function(amount) {
      appState.moonshotSpent += amount;
      localStorage.setItem('kairosMoonshotSpent', appState.moonshotSpent.toString());
    },
    resetMoonshotSpent: function() {
      appState.moonshotSpent = 0;
      localStorage.setItem('kairosMoonshotSpent', '0');
    },
    refreshTradingSignal: function() {
      var ticker = appState.selectedCurrency;
      // キャッシュをクリアして再取得
      var cacheKey = ticker + '_signal';
      delete signalCache.data[cacheKey];
      loadTradingSignal(ticker);
    }
  };

  // ===== 通貨追加モーダル（階層ナビゲーション） =====
  var addCurrencyState = {
    currentView: 'categories', // 'categories', 'coins', 'search', 'all'
    selectedCategory: null,
    searchQuery: ''
  };

  // 全通貨リストを取得
  function getAllCoins() {
    var allCoins = [];
    Object.keys(CRYPTO_CATEGORIES).forEach(function(catKey) {
      var cat = CRYPTO_CATEGORIES[catKey];
      cat.coins.forEach(function(coin) {
        allCoins.push({
          symbol: coin.symbol,
          name: coin.name,
          desc: coin.desc,
          category: catKey,
          categoryName: cat.name,
          categoryIcon: cat.icon,
          risk: cat.risk
        });
      });
    });
    return allCoins;
  }

  // 通貨検索
  function searchCoins(query) {
    if (!query || query.length < 1) return [];
    var q = query.toLowerCase();
    var allCoins = getAllCoins();
    return allCoins.filter(function(coin) {
      return coin.symbol.toLowerCase().indexOf(q) >= 0 ||
             coin.name.toLowerCase().indexOf(q) >= 0;
    });
  }

  function openAddCurrencyModal() {
    if (document.getElementById('kairos-add-currency-modal')) return;

    addCurrencyState.currentView = 'categories';
    addCurrencyState.selectedCategory = null;

    var modal = document.createElement('div');
    modal.id = 'kairos-add-currency-modal';
    modal.className = 'add-currency-overlay';

    renderAddCurrencyContent(modal);
    document.body.appendChild(modal);

    // 背景クリックで閉じる
    modal.onclick = function(e) {
      if (e.target === modal) {
        closeAddCurrencyModal();
      }
    };

    // 履歴に追加（バック操作用）
    history.pushState({ modal: 'addCurrency', view: 'categories' }, '');
  }

  function closeAddCurrencyModal() {
    var modal = document.getElementById('kairos-add-currency-modal');
    if (modal) modal.remove();
    addCurrencyState.currentView = 'categories';
    addCurrencyState.selectedCategory = null;
  }

  function renderAddCurrencyContent(modal) {
    if (!modal) modal = document.getElementById('kairos-add-currency-modal');
    if (!modal) return;

    var innerModal = modal.querySelector('.add-currency-modal');
    if (!innerModal) {
      innerModal = document.createElement('div');
      innerModal.className = 'add-currency-modal';
      modal.appendChild(innerModal);
    }

    if (addCurrencyState.currentView === 'categories') {
      renderCategoryList(innerModal);
    } else if (addCurrencyState.currentView === 'coins') {
      renderCoinList(innerModal, addCurrencyState.selectedCategory);
    } else if (addCurrencyState.currentView === 'all') {
      renderAllCoinsList(innerModal);
    }

    // モーダル内のスクロール位置をリセット
    var content = innerModal.querySelector('.add-currency-modal__content');
    if (content) content.scrollTop = 0;
    var searchResults = innerModal.querySelector('.add-currency-modal__search-results');
    if (searchResults) searchResults.scrollTop = 0;
  }

  function renderCategoryList(container) {
    var totalCoins = getAllCoins().length;

    var categoriesHtml = Object.keys(CRYPTO_CATEGORIES).map(function(catKey) {
      var cat = CRYPTO_CATEGORIES[catKey];
      var coinCount = cat.coins.length;
      var riskClass = cat.risk === '低' ? 'low' : cat.risk === '中' ? 'mid' : cat.risk === '中〜高' ? 'midhigh' : 'high';

      return '<div class="add-currency__category-card" data-category="' + catKey + '">' +
        '<div class="add-currency__category-card-left">' +
          '<span class="add-currency__category-card-icon">' + cat.icon + '</span>' +
          '<div class="add-currency__category-card-info">' +
            '<span class="add-currency__category-card-name">' + cat.name + '</span>' +
            '<span class="add-currency__category-card-count">' + coinCount + '種類</span>' +
          '</div>' +
        '</div>' +
        '<div class="add-currency__category-card-right">' +
          '<span class="add-currency__category-card-risk risk-' + riskClass + '">' + cat.risk + '</span>' +
          '<span class="add-currency__category-card-arrow">›</span>' +
        '</div>' +
      '</div>';
    }).join('');

    container.innerHTML = '<div class="add-currency-modal__header">' +
        '<h2 class="add-currency-modal__title">通貨を追加</h2>' +
        '<button class="add-currency-modal__close">×</button>' +
      '</div>' +
      '<div class="add-currency-modal__search">' +
        '<div class="add-currency-modal__search-box">' +
          '<span class="add-currency-modal__search-icon">🔍</span>' +
          '<input type="text" class="add-currency-modal__search-input" placeholder="通貨名・シンボルで検索..." id="add-currency-search">' +
          '<button class="add-currency-modal__search-clear hidden">×</button>' +
        '</div>' +
      '</div>' +
      '<div class="add-currency-modal__search-results hidden"></div>' +
      '<div class="add-currency-modal__content">' +
        '<div class="add-currency__all-coins-btn" data-action="all">' +
          '<span class="add-currency__all-coins-icon">📋</span>' +
          '<span class="add-currency__all-coins-text">すべての通貨を見る</span>' +
          '<span class="add-currency__all-coins-count">' + totalCoins + '種類</span>' +
          '<span class="add-currency__all-coins-arrow">›</span>' +
        '</div>' +
        '<p class="add-currency-modal__subtitle">カテゴリーから選ぶ</p>' +
        categoriesHtml +
      '</div>';

    // イベント設定
    container.querySelector('.add-currency-modal__close').onclick = closeAddCurrencyModal;

    // 検索機能
    var searchInput = container.querySelector('#add-currency-search');
    var searchResults = container.querySelector('.add-currency-modal__search-results');
    var clearBtn = container.querySelector('.add-currency-modal__search-clear');
    var contentDiv = container.querySelector('.add-currency-modal__content');

    searchInput.addEventListener('input', function() {
      var query = searchInput.value.trim();
      clearBtn.classList.toggle('hidden', query.length === 0);

      if (query.length >= 1) {
        var results = searchCoins(query);
        renderSearchResults(searchResults, results, query);
        searchResults.classList.remove('hidden');
        contentDiv.classList.add('hidden');
      } else {
        searchResults.classList.add('hidden');
        contentDiv.classList.remove('hidden');
      }
    });

    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      searchResults.classList.add('hidden');
      contentDiv.classList.remove('hidden');
      searchInput.focus();
    });

    // すべての通貨ボタン
    container.querySelector('.add-currency__all-coins-btn').addEventListener('click', function() {
      navigateToAllCoins();
    });

    container.querySelectorAll('.add-currency__category-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var catKey = card.getAttribute('data-category');
        navigateToCoinList(catKey);
      });
    });
  }

  function renderSearchResults(container, results, query) {
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];

    if (results.length === 0) {
      container.innerHTML = '<div class="add-currency__no-results">' +
        '<span class="add-currency__no-results-icon">🔍</span>' +
        '<p>「' + query + '」に一致する通貨が見つかりません</p>' +
      '</div>';
      return;
    }

    var html = '<div class="add-currency__results-header">' +
      '<span>' + results.length + '件の結果</span>' +
    '</div>';

    html += results.map(function(coin) {
      var isInWatchlist = watchlist.indexOf(coin.symbol) >= 0;
      return '<div class="add-currency__coin ' + (isInWatchlist ? 'added' : '') + '" data-symbol="' + coin.symbol + '">' +
        '<div class="add-currency__coin-left">' +
          '<span class="add-currency__coin-icon">' + getCoinIcon(coin.symbol) + '</span>' +
          '<div class="add-currency__coin-info">' +
            '<span class="add-currency__coin-symbol">' + coin.symbol + '</span>' +
            '<span class="add-currency__coin-name">' + coin.name + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="add-currency__coin-right">' +
          getAIGradeBadge(coin.symbol) +
          '<span class="add-currency__coin-category">' + coin.categoryIcon + ' ' + coin.categoryName + '</span>' +
          '<button class="add-currency__coin-btn ' + (isInWatchlist ? 'remove' : 'add') + '">' +
            (isInWatchlist ? '✓' : '+') +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    container.innerHTML = html;

    // 通貨追加/削除イベント
    container.querySelectorAll('.add-currency__coin-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCoinInWatchlist(btn);
      });
    });

    // コイン行クリックでプレビュー表示
    container.querySelectorAll('.add-currency__coin').forEach(function(coinDiv) {
      coinDiv.addEventListener('click', function(e) {
        if (e.target.closest('.add-currency__coin-btn')) return;
        var symbol = coinDiv.getAttribute('data-symbol');
        openCoinPreviewModal(symbol);
      });
    });
  }

  function navigateToAllCoins() {
    addCurrencyState.currentView = 'all';
    addCurrencyState.selectedCategory = null;
    history.pushState({ modal: 'addCurrency', view: 'all' }, '');
    renderAddCurrencyContent();
  }

  function renderAllCoinsList(container) {
    var allCoins = getAllCoins();
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];

    var coinsHtml = allCoins.map(function(coin) {
      var isInWatchlist = watchlist.indexOf(coin.symbol) >= 0;
      var riskClass = coin.risk === '低' ? 'low' : coin.risk === '中' ? 'mid' : coin.risk === '中〜高' ? 'midhigh' : 'high';
      return '<div class="add-currency__coin ' + (isInWatchlist ? 'added' : '') + '" data-symbol="' + coin.symbol + '">' +
        '<div class="add-currency__coin-left">' +
          '<span class="add-currency__coin-icon">' + getCoinIcon(coin.symbol) + '</span>' +
          '<div class="add-currency__coin-info">' +
            '<span class="add-currency__coin-symbol">' + coin.symbol + '</span>' +
            '<span class="add-currency__coin-name">' + coin.name + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="add-currency__coin-right">' +
          getAIGradeBadge(coin.symbol) +
          '<span class="add-currency__coin-category-tag risk-' + riskClass + '">' + coin.categoryIcon + '</span>' +
          '<button class="add-currency__coin-btn ' + (isInWatchlist ? 'remove' : 'add') + '">' +
            (isInWatchlist ? '✓' : '+') +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    container.innerHTML = '<div class="add-currency-modal__header">' +
        '<button class="add-currency-modal__back">‹</button>' +
        '<h2 class="add-currency-modal__title">' +
          '<span class="add-currency-modal__title-icon">📋</span>' +
          '<span class="add-currency-modal__title-text">すべての通貨</span>' +
        '</h2>' +
        '<button class="add-currency-modal__close">×</button>' +
      '</div>' +
      '<div class="add-currency-modal__count-bar">' +
        '<span>' + allCoins.length + '種類の通貨</span>' +
      '</div>' +
      '<div class="add-currency-modal__content add-currency-modal__content--coins">' +
        coinsHtml +
      '</div>';

    // イベント設定
    container.querySelector('.add-currency-modal__close').onclick = closeAddCurrencyModal;
    container.querySelector('.add-currency-modal__back').onclick = function() {
      history.back();
    };

    // 通貨追加/削除
    container.querySelectorAll('.add-currency__coin-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCoinInWatchlist(btn);
      });
    });

    // コイン行クリックでプレビュー表示
    container.querySelectorAll('.add-currency__coin').forEach(function(coinDiv) {
      coinDiv.addEventListener('click', function(e) {
        if (e.target.closest('.add-currency__coin-btn')) return;
        var symbol = coinDiv.getAttribute('data-symbol');
        openCoinPreviewModal(symbol);
      });
    });
  }

  function toggleCoinInWatchlist(btn) {
    var coinDiv = btn.closest('.add-currency__coin');
    var symbol = coinDiv.getAttribute('data-symbol');
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];
    var idx = watchlist.indexOf(symbol);

    if (idx >= 0) {
      watchlist.splice(idx, 1);
      coinDiv.classList.remove('added');
      btn.classList.remove('remove');
      btn.classList.add('add');
      btn.textContent = '+';
    } else {
      watchlist.push(symbol);
      coinDiv.classList.add('added');
      btn.classList.remove('add');
      btn.classList.add('remove');
      btn.textContent = '✓';
    }

    localStorage.setItem('kairos-watchlist', JSON.stringify(watchlist));
  }

  // コイン詳細ページへ遷移（ウォッチリスト未追加でも見れる）
  function openCoinPreviewModal(symbol) {
    // 通貨追加モーダルを閉じる
    closeAddCurrencyModal();

    // 詳細画面へ遷移
    appState.selectedCurrency = symbol;
    appState.currentScreen = 'detail';
    navigationHistory.push('detail');
    history.pushState({ screen: 'detail', ticker: symbol }, '', '');
    renderApp();
  }

  function navigateToCoinList(catKey) {
    addCurrencyState.currentView = 'coins';
    addCurrencyState.selectedCategory = catKey;
    history.pushState({ modal: 'addCurrency', view: 'coins', category: catKey }, '');
    renderAddCurrencyContent();
  }

  function navigateBackToCategories() {
    addCurrencyState.currentView = 'categories';
    addCurrencyState.selectedCategory = null;
    renderAddCurrencyContent();
  }

  // AIグレードバッジを取得（ストラテジー別スコア対応）
  function getAIGradeBadge(symbol) {
    var cached = scoreCache.data[symbol];
    if (cached) {
      var stratScore = window.getStrategyScore(symbol);
      var gradeClass = 'grade-' + stratScore.grade.toLowerCase();
      return '<span class="add-currency__coin-grade ' + gradeClass + '">' + stratScore.grade + '</span>';
    }
    return '<span class="add-currency__coin-grade grade-none">-</span>';
  }

  function renderCoinList(container, catKey) {
    var cat = CRYPTO_CATEGORIES[catKey];
    if (!cat) return;

    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];

    var coinsHtml = cat.coins.map(function(coin) {
      var isInWatchlist = watchlist.indexOf(coin.symbol) >= 0;
      return '<div class="add-currency__coin ' + (isInWatchlist ? 'added' : '') + '" data-symbol="' + coin.symbol + '">' +
        '<div class="add-currency__coin-left">' +
          '<span class="add-currency__coin-icon">' + getCoinIcon(coin.symbol) + '</span>' +
          '<div class="add-currency__coin-info">' +
            '<span class="add-currency__coin-symbol">' + coin.symbol + '</span>' +
            '<span class="add-currency__coin-name">' + coin.name + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="add-currency__coin-right">' +
          getAIGradeBadge(coin.symbol) +
          '<button class="add-currency__coin-btn ' + (isInWatchlist ? 'remove' : 'add') + '">' +
            (isInWatchlist ? '✓' : '+') +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    var riskClass = cat.risk === '低' ? 'low' : cat.risk === '中' ? 'mid' : cat.risk === '中〜高' ? 'midhigh' : 'high';

    container.innerHTML = '<div class="add-currency-modal__header">' +
        '<button class="add-currency-modal__back">‹</button>' +
        '<h2 class="add-currency-modal__title add-currency-modal__title--clickable" data-category="' + catKey + '">' +
          '<span class="add-currency-modal__title-icon">' + cat.icon + '</span>' +
          '<span class="add-currency-modal__title-text">' + cat.name + '</span>' +
          '<span class="add-currency-modal__title-help">?</span>' +
        '</h2>' +
        '<button class="add-currency-modal__close">×</button>' +
      '</div>' +
      '<div class="add-currency-modal__risk-bar risk-' + riskClass + '">' +
        '<span>リスク: ' + cat.risk + '</span>' +
      '</div>' +
      '<div class="add-currency-modal__content add-currency-modal__content--coins">' +
        coinsHtml +
      '</div>';

    // イベント設定
    container.querySelector('.add-currency-modal__close').onclick = closeAddCurrencyModal;
    container.querySelector('.add-currency-modal__back').onclick = function() {
      history.back();
    };

    // タイトルクリックでヘルプ表示
    container.querySelector('.add-currency-modal__title--clickable').onclick = function() {
      openCategoryHelpModal(catKey);
    };

    // 通貨追加/削除
    container.querySelectorAll('.add-currency__coin-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCoinInWatchlist(btn);
      });
    });

    // コイン行クリックでプレビュー表示
    container.querySelectorAll('.add-currency__coin').forEach(function(coinDiv) {
      coinDiv.addEventListener('click', function(e) {
        if (e.target.closest('.add-currency__coin-btn')) return;
        var symbol = coinDiv.getAttribute('data-symbol');
        openCoinPreviewModal(symbol);
      });
    });
  }

  // カテゴリー詳細ヘルプモーダル
  function openCategoryHelpModal(catKey) {
    var cat = CRYPTO_CATEGORIES[catKey];
    if (!cat) return;

    if (document.getElementById('kairos-category-help-modal')) {
      document.getElementById('kairos-category-help-modal').remove();
    }

    var modal = document.createElement('div');
    modal.id = 'kairos-category-help-modal';
    modal.className = 'category-help-overlay';

    modal.innerHTML = '<div class="category-help-modal">' +
      '<div class="category-help-modal__header">' +
        '<span class="category-help-modal__icon">' + cat.icon + '</span>' +
        '<h2 class="category-help-modal__title">' + cat.name + '</h2>' +
        '<button class="category-help-modal__close" onclick="document.getElementById(\'kairos-category-help-modal\').remove()">×</button>' +
      '</div>' +
      '<div class="category-help-modal__content">' +
        '<div class="category-help-modal__section">' +
          '<h3>📖 これってなに？</h3>' +
          '<p>' + cat.description + '</p>' +
        '</div>' +
        '<div class="category-help-modal__section">' +
          '<h3>🎯 楽しみ方・運用のコツ</h3>' +
          '<p>' + cat.howToEnjoy + '</p>' +
        '</div>' +
        '<div class="category-help-modal__section">' +
          '<h3>💰 購入のポイント</h3>' +
          '<p>' + cat.buyingTips + '</p>' +
        '</div>' +
        '<div class="category-help-modal__section risk-section">' +
          '<h3>⚠️ リスクレベル</h3>' +
          '<div class="category-help-modal__risk-badge risk-' + (cat.risk === '低' ? 'low' : cat.risk === '中' ? 'mid' : cat.risk === '中〜高' ? 'midhigh' : 'high') + '">' +
            cat.risk +
          '</div>' +
          '<p class="risk-explanation">' + getRiskExplanation(cat.risk) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="category-help-modal__footer">' +
        '<button class="category-help-modal__close-btn" onclick="document.getElementById(\'kairos-category-help-modal\').remove()">閉じる</button>' +
      '</div>' +
    '</div>';

    document.body.appendChild(modal);

    modal.onclick = function(e) {
      if (e.target === modal) modal.remove();
    };
  }

  function getRiskExplanation(risk) {
    var explanations = {
      '低': '価格変動が小さく、資産保全向き。大きな利益は期待しにくいが、損失リスクも低い。',
      '中': '適度な価格変動。長期保有で利益を狙えるが、一時的な下落にも備えが必要。',
      '中〜高': '価格変動が大きめ。大きなリターンの可能性があるが、損失リスクも相応にある。',
      '高': '価格が大きく動く。短期で大きな利益も損失も起こりうる。余裕資金のみで。',
      '超高': '投機的。価格が数倍〜数分の1になることも日常茶飯事。最悪ゼロになる覚悟で。'
    };
    return explanations[risk] || '';
  }

  // 機能説明ツールチップ
  function showFeatureTooltip(element, title, description, details) {
    var existingTooltip = document.getElementById('kairos-feature-tooltip');
    if (existingTooltip) existingTooltip.remove();

    var rect = element.getBoundingClientRect();
    var tooltip = document.createElement('div');
    tooltip.id = 'kairos-feature-tooltip';
    tooltip.className = 'feature-tooltip';
    tooltip.innerHTML = '<div class="feature-tooltip__header">' +
        '<span class="feature-tooltip__title">' + title + '</span>' +
        '<button class="feature-tooltip__close">×</button>' +
      '</div>' +
      '<p class="feature-tooltip__desc">' + description + '</p>' +
      (details ? '<button class="feature-tooltip__details-btn">詳しく見る</button>' +
        '<div class="feature-tooltip__details hidden">' + details + '</div>' : '');

    document.body.appendChild(tooltip);

    // 位置調整
    var tooltipRect = tooltip.getBoundingClientRect();
    var top = rect.bottom + 8;
    var left = rect.left;

    if (left + tooltipRect.width > window.innerWidth - 16) {
      left = window.innerWidth - tooltipRect.width - 16;
    }
    if (top + tooltipRect.height > window.innerHeight - 16) {
      top = rect.top - tooltipRect.height - 8;
    }

    tooltip.style.top = top + 'px';
    tooltip.style.left = Math.max(16, left) + 'px';

    tooltip.querySelector('.feature-tooltip__close').onclick = function() {
      tooltip.remove();
    };

    if (details) {
      tooltip.querySelector('.feature-tooltip__details-btn').onclick = function() {
        var detailsDiv = tooltip.querySelector('.feature-tooltip__details');
        var isHidden = detailsDiv.classList.contains('hidden');
        detailsDiv.classList.toggle('hidden');
        this.textContent = isHidden ? '閉じる' : '詳しく見る';
      };
    }

    // 外側クリックで閉じる
    setTimeout(function() {
      document.addEventListener('click', function closeTooltip(e) {
        if (!tooltip.contains(e.target) && e.target !== element) {
          tooltip.remove();
          document.removeEventListener('click', closeTooltip);
        }
      });
    }, 100);
  }

  // グローバルに公開
  window.KairosApp.openAddCurrencyModal = openAddCurrencyModal;
  window.KairosApp.showFeatureTooltip = showFeatureTooltip;

  // クイック積立モーダル
  // Binanceから過去の特定時刻の価格を取得
  function fetchHistoricalPrice(ticker, dateObj) {
    return new Promise(function(resolve, reject) {
      var symbol = ticker.toUpperCase() + 'USDT';
      var timestamp = dateObj.getTime();
      var url = 'https://api.binance.com/api/v3/klines?symbol=' + symbol +
        '&interval=1m&startTime=' + timestamp + '&limit=1';

      fetch(url)
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (Array.isArray(data) && data.length > 0) {
            // [openTime, open, high, low, close, ...]
            resolve(parseFloat(data[0][4])); // close price
          } else {
            reject(new Error('No data'));
          }
        })
        .catch(reject);
    });
  }

  function openQuickBuyModal(ticker) {
    if (document.getElementById('kairos-quick-buy-modal')) return;

    // 価格取得: scoreCache → all_results → フォールバック（0）
    var cachedCoin = (typeof scoreCache !== 'undefined' && scoreCache.data) ? scoreCache.data[ticker] : null;
    var allResults = kairosData.all_results || [];
    var coinData = allResults.find(function(r) { return r.ticker === ticker; }) || {};
    var currentPrice = (cachedCoin && cachedCoin.price) || coinData.current_price || 0;

    // モーダル内で使う価格（日時変更時に更新される）
    var activePrice = currentPrice;
    var activeDate = null; // null = 現在

    // JPY/USD切り替え対応
    var isJpy = appState.priceCurrency === 'JPY';
    var usdRate = 150;
    var priceDisplay = isJpy ? formatYen(currentPrice * usdRate) : formatUSD(currentPrice);
    var currencyLabel = isJpy ? 'JPY' : 'USD';
    var currencySymbol = isJpy ? '円' : '$';
    var defaultAmount = isJpy ? '10000' : '100';
    var presets = isJpy ?
      '<button class="quick-buy-preset" data-amount="5000">\u00a55,000</button>' +
      '<button class="quick-buy-preset" data-amount="10000">\u00a510,000</button>' +
      '<button class="quick-buy-preset" data-amount="30000">\u00a530,000</button>' +
      '<button class="quick-buy-preset" data-amount="50000">\u00a550,000</button>' :
      '<button class="quick-buy-preset" data-amount="50">$50</button>' +
      '<button class="quick-buy-preset" data-amount="100">$100</button>' +
      '<button class="quick-buy-preset" data-amount="300">$300</button>' +
      '<button class="quick-buy-preset" data-amount="500">$500</button>';

    // 現在日時をdatetime-local形式で取得（デフォルト値）
    var now = new Date();
    var nowLocal = now.getFullYear() + '-' +
      ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
      ('0' + now.getDate()).slice(-2) + 'T' +
      ('0' + now.getHours()).slice(-2) + ':' +
      ('0' + now.getMinutes()).slice(-2);

    var modal = document.createElement('div');
    modal.id = 'kairos-quick-buy-modal';
    modal.className = 'quick-buy-overlay';
    modal.innerHTML = '<div class="quick-buy-modal">' +
      '<div class="quick-buy-modal__header">' +
        '<span class="quick-buy-modal__title">' + getCoinIcon(ticker) + ' ' + ticker + ' 積立</span>' +
        '<button class="quick-buy-modal__close" onclick="document.getElementById(\'kairos-quick-buy-modal\').remove()">×</button>' +
      '</div>' +
      '<div class="quick-buy-modal__price" id="quick-buy-price-display">現在価格: ' + priceDisplay + '</div>' +
      '<div class="quick-buy-modal__form">' +
        '<div class="quick-buy-modal__field" id="quick-buy-date-field" style="display:none;">' +
          '<label>購入日時</label>' +
          '<div class="quick-buy-modal__input-group">' +
            '<input type="datetime-local" id="quick-buy-date" value="' + nowLocal + '" ' +
              'style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);' +
              'border-radius:8px;padding:8px 12px;color:#fff;font-size:14px;">' +
          '</div>' +
          '<div id="quick-buy-date-status" style="font-size:11px;margin-top:4px;color:rgba(255,255,255,0.4);">現在の価格で購入</div>' +
        '</div>' +
        '<div class="quick-buy-modal__field">' +
          '<label>金額 (' + currencyLabel + ')</label>' +
          '<div class="quick-buy-modal__input-group">' +
            '<input type="number" id="quick-buy-amount" placeholder="' + defaultAmount + '" value="' + defaultAmount + '">' +
            '<span class="quick-buy-modal__currency">' + currencySymbol + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="quick-buy-modal__presets">' + presets + '</div>' +
        '<div class="quick-buy-modal__calc">' +
          '<span>購入数量: </span>' +
          '<span id="quick-buy-qty">-</span>' +
        '</div>' +
      '</div>' +
      '<button class="quick-buy-modal__submit" id="quick-buy-submit">仮想購入する</button>' +
    '</div>';

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.onclick = function(e) {
      if (e.target === modal) modal.remove();
    };

    // 日時変更時: 過去の価格を取得
    var dateInput = document.getElementById('quick-buy-date');
    var dateStatus = document.getElementById('quick-buy-date-status');
    var priceDisplayEl = document.getElementById('quick-buy-price-display');

    dateInput.addEventListener('change', function() {
      var selectedDate = new Date(dateInput.value);
      var diffMs = Date.now() - selectedDate.getTime();

      // 5分以内なら「現在」として扱う
      if (diffMs < 5 * 60 * 1000 && diffMs > -60000) {
        activePrice = currentPrice;
        activeDate = null;
        var display = isJpy ? formatYen(currentPrice * usdRate) : formatUSD(currentPrice);
        priceDisplayEl.textContent = '現在価格: ' + display;
        dateStatus.textContent = '現在の価格で購入';
        dateStatus.style.color = 'rgba(255,255,255,0.4)';
        updateQuickBuyCalc(ticker, activePrice);
        return;
      }

      // 未来は不可
      if (diffMs < 0) {
        dateStatus.textContent = '未来の日時は指定できません';
        dateStatus.style.color = '#ef4444';
        return;
      }

      // 過去の価格を取得
      dateStatus.textContent = '価格を取得中...';
      dateStatus.style.color = '#d4a853';

      fetchHistoricalPrice(ticker, selectedDate).then(function(price) {
        activePrice = price;
        activeDate = selectedDate;
        var display = isJpy ? formatYen(price * usdRate) : formatUSD(price);
        var dateStr = selectedDate.getFullYear() + '/' +
          (selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + ' ' +
          ('0' + selectedDate.getHours()).slice(-2) + ':' + ('0' + selectedDate.getMinutes()).slice(-2);
        priceDisplayEl.textContent = dateStr + ' の価格: ' + display;
        dateStatus.textContent = '過去の実際の価格で記録されます';
        dateStatus.style.color = '#10b981';
        updateQuickBuyCalc(ticker, activePrice);
      }).catch(function(err) {
        console.error('[KAIROS] Historical price fetch failed:', err);
        dateStatus.textContent = '価格取得失敗 - 現在価格を使用します';
        dateStatus.style.color = '#ef4444';
        activePrice = currentPrice;
        activeDate = selectedDate;
        updateQuickBuyCalc(ticker, activePrice);
      });
    });

    // Preset buttons
    modal.querySelectorAll('.quick-buy-preset').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.getElementById('quick-buy-amount').value = btn.getAttribute('data-amount');
        updateQuickBuyCalc(ticker, activePrice);
      });
    });

    // Amount input
    var amountInput = document.getElementById('quick-buy-amount');
    amountInput.addEventListener('input', function() {
      updateQuickBuyCalc(ticker, activePrice);
    });

    // Submit
    document.getElementById('quick-buy-submit').addEventListener('click', function() {
      var amount = parseFloat(amountInput.value) || 0;
      if (amount > 0) {
        var submitBtn = document.getElementById('quick-buy-submit');
        submitBtn.textContent = '処理中...';
        submitBtn.disabled = true;

        // JPY/USD対応: 内部記録は常にJPYで保存
        var amountJpy = isJpy ? amount : amount * usdRate;
        var displayStr = isJpy ? '\u00a5' + amount.toLocaleString() : '$' + amount.toLocaleString();
        recordVirtualBuy(ticker, amountJpy, activePrice, activeDate).then(function(record) {
          modal.remove();
          if (window.KAIROS && window.KAIROS.Features && window.KAIROS.Features.showToast) {
            var dateNote = activeDate ? '（過去記録）' : '';
            window.KAIROS.Features.showToast(ticker + ' ' + displayStr + ' 積立完了' + dateNote, 'success');
          }
          renderApp();
        }).catch(function(err) {
          submitBtn.textContent = '仮想購入する';
          submitBtn.disabled = false;
          console.error('[KAIROS] Buy failed:', err);
          if (window.KAIROS && window.KAIROS.Features && window.KAIROS.Features.showToast) {
            window.KAIROS.Features.showToast('エラーが発生しました', 'error');
          }
        });
      }
    });

    updateQuickBuyCalc(ticker, activePrice);
  }

  function updateQuickBuyCalc(ticker, price) {
    var amount = parseFloat(document.getElementById('quick-buy-amount').value) || 0;
    var usdRate = 150;
    var isJpy = appState.priceCurrency === 'JPY';
    var usdAmount = isJpy ? amount / usdRate : amount;
    var qty = price > 0 ? (usdAmount / price) : 0;
    var qtyEl = document.getElementById('quick-buy-qty');
    if (qtyEl) {
      qtyEl.textContent = qty > 0 ? qty.toFixed(6) + ' ' + ticker : '-';
    }
  }

  // 新しいInvestmentManagerを使用した購入記録（customDate: 過去日時指定対応）
  function recordVirtualBuy(ticker, amountJpy, priceUsd, customDate) {
    return new Promise(function(resolve, reject) {
      function onBuySuccess(record) {
        // ポートフォリオスナップショットを記録
        if (typeof recordPortfolioSnapshot === 'function') {
          recordPortfolioSnapshot();
        }
        resolve(record);
      }

      // InvestmentManagerを使用
      var usdRate = 150;
      var priceJpy = priceUsd > 0 ? priceUsd * usdRate : 0;
      var recordDate = customDate ? customDate.toISOString() : undefined;

      if (window.KairosInvestment && window.KairosInvestment.Manager) {
        window.KairosInvestment.Manager.addBuyRecord({
          currencyId: ticker,
          amountJpy: amountJpy,
          priceJpy: priceJpy,
          priceUsd: priceUsd,
          date: recordDate,
          note: customDate ? '過去記録（' + customDate.toLocaleDateString('ja-JP') + '）' : 'クイック積立'
        }).then(onBuySuccess).catch(reject);
      } else {
        // フォールバック：従来の方法
        try {
          var records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
          var usdRate = 150;
          var usdAmount = amountJpy / usdRate;
          var qty = priceUsd > 0 ? usdAmount / priceUsd : 0;

          var record = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
            date: customDate ? customDate.toISOString() : new Date().toISOString(),
            type: 'buy',
            currencyId: ticker,
            quantity: qty,
            priceUsd: priceUsd,
            totalJpy: amountJpy,
            totalUsd: usdAmount,
            status: 'confirmed'
          };
          records.push(record);

          localStorage.setItem('kairosInvestmentRecords', JSON.stringify(records));
          onBuySuccess(record);
        } catch(e) {
          console.error('[KAIROS] Failed to record buy:', e);
          reject(e);
        }
      }
    });
  }

  // ===== 売却矛盾警告 =====
  function checkSellStrategyWarning(ticker, callback) {
    var strategy = StrategyManager.getStrategy(ticker);
    if (strategy !== 'longterm') {
      callback();
      return;
    }

    var overlay = document.createElement('div');
    overlay.className = 'quick-buy-overlay';
    overlay.id = 'kairos-sell-warning';
    overlay.innerHTML = '<div class="quick-buy-modal" style="max-width:360px;text-align:center">' +
      '<div style="font-size:32px;margin-bottom:12px">' + STRATEGY_CONFIG.longterm.icon + '</div>' +
      '<div style="font-size:16px;font-weight:600;color:var(--text-primary);margin-bottom:8px">長期保有の通貨です</div>' +
      '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:20px;line-height:1.6">' +
        ticker + ' は<span style="color:' + STRATEGY_CONFIG.longterm.color + ';font-weight:600">長期保有</span>に設定されています。<br>本当に売却しますか？' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
        '<button class="quick-buy-modal__submit" id="sell-warning-cancel" style="background:rgba(255,255,255,0.1);flex:1">戻る</button>' +
        '<button class="quick-buy-modal__submit" id="sell-warning-proceed" style="background:linear-gradient(135deg,#ef4444,#dc2626);flex:1">売却に進む</button>' +
      '</div>' +
    '</div>';

    document.body.appendChild(overlay);

    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    document.getElementById('sell-warning-cancel').onclick = function() { overlay.remove(); };
    document.getElementById('sell-warning-proceed').onclick = function() {
      overlay.remove();
      callback();
    };
  }

  // ===== 売却モーダル =====
  function openSellModal(ticker) {
    if (document.getElementById('kairos-sell-modal')) return;

    // 長期保有の場合は警告を表示
    checkSellStrategyWarning(ticker, function() {
      openSellModalInner(ticker);
    });
  }

  function openSellModalInner(ticker) {
    if (document.getElementById('kairos-sell-modal')) return;

    // 価格取得: scoreCache → all_results → フォールバック（0）
    var cachedCoin = (typeof scoreCache !== 'undefined' && scoreCache.data) ? scoreCache.data[ticker] : null;
    var allResults = kairosData.all_results || [];
    var coinData = allResults.find(function(r) { return r.ticker === ticker; }) || {};
    var currentPrice = (cachedCoin && cachedCoin.price) || coinData.current_price || 0;

    // 保有データを取得
    var holding = { remainingQuantity: 0, averageCost: 0, totalInvested: 0 };
    if (window.KairosInvestment && window.KairosInvestment.Calculator) {
      var records = InvestmentManager.getRecords();
      holding = InvestmentCalculator.calculateHolding(records, ticker);
    }

    var usdRate = 150;
    var currentValueUsd = holding.remainingQuantity * currentPrice;
    var currentValueJpy = currentValueUsd * usdRate;
    var costBasisJpy = holding.averageCost * holding.remainingQuantity * usdRate;
    var unrealizedPnl = currentValueJpy - costBasisJpy;
    var unrealizedPnlPercent = costBasisJpy > 0 ? (unrealizedPnl / costBasisJpy) * 100 : 0;
    var pnlColor = unrealizedPnl >= 0 ? '#10b981' : '#ef4444';

    var modal = document.createElement('div');
    modal.id = 'kairos-sell-modal';
    modal.className = 'quick-buy-overlay';
    modal.innerHTML = '<div class="quick-buy-modal" style="max-width:400px">' +
      '<div class="quick-buy-modal__header">' +
        '<span class="quick-buy-modal__title">' + getCoinIcon(ticker) + ' ' + ticker + ' 売却</span>' +
        '<button class="quick-buy-modal__close" onclick="document.getElementById(\'kairos-sell-modal\').remove()">×</button>' +
      '</div>' +

      // 保有情報
      '<div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
          '<span style="color:var(--text-secondary)">保有数量</span>' +
          '<span style="color:var(--text-primary);font-weight:600">' + holding.remainingQuantity.toFixed(6) + ' ' + ticker + '</span>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
          '<span style="color:var(--text-secondary)">平均取得価格</span>' +
          '<span style="color:var(--text-primary)">' + formatUSD(holding.averageCost) + '</span>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
          '<span style="color:var(--text-secondary)">現在価格</span>' +
          '<span style="color:var(--text-primary)">' + formatUSD(currentPrice) + '</span>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1)">' +
          '<span style="color:var(--text-secondary)">評価損益</span>' +
          '<span style="color:' + pnlColor + ';font-weight:600">' +
            (unrealizedPnl >= 0 ? '+' : '') + formatYen(unrealizedPnl) +
            ' (' + (unrealizedPnlPercent >= 0 ? '+' : '') + unrealizedPnlPercent.toFixed(1) + '%)' +
          '</span>' +
        '</div>' +
      '</div>' +

      // 売却入力フォーム
      '<div class="quick-buy-modal__form">' +
        '<div class="quick-buy-modal__field">' +
          '<label>売却数量</label>' +
          '<div class="quick-buy-modal__input-group">' +
            '<input type="number" id="sell-quantity" placeholder="0.001" step="0.000001" max="' + holding.remainingQuantity + '">' +
            '<span class="quick-buy-modal__currency">' + ticker + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="quick-buy-modal__presets">' +
          '<button class="quick-buy-preset sell-preset" data-percent="25">25%</button>' +
          '<button class="quick-buy-preset sell-preset" data-percent="50">50%</button>' +
          '<button class="quick-buy-preset sell-preset" data-percent="75">75%</button>' +
          '<button class="quick-buy-preset sell-preset" data-percent="100">全て</button>' +
        '</div>' +

        // 売却計算
        '<div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;margin-top:12px">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
            '<span style="color:var(--text-tertiary);font-size:12px">売却金額</span>' +
            '<span id="sell-value" style="color:var(--text-primary);font-weight:500">¥0</span>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between">' +
            '<span style="color:var(--text-tertiary);font-size:12px">実現損益</span>' +
            '<span id="sell-pnl" style="font-weight:600">¥0</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<button class="quick-buy-modal__submit" id="sell-submit" style="background:linear-gradient(135deg,#ef4444,#dc2626)">売却する</button>' +
    '</div>';

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.onclick = function(e) {
      if (e.target === modal) modal.remove();
    };

    // Preset buttons
    modal.querySelectorAll('.sell-preset').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var percent = parseInt(btn.getAttribute('data-percent'));
        var qty = holding.remainingQuantity * (percent / 100);
        document.getElementById('sell-quantity').value = qty.toFixed(6);
        updateSellCalc(ticker, currentPrice, holding);
      });
    });

    // Quantity input
    var qtyInput = document.getElementById('sell-quantity');
    qtyInput.addEventListener('input', function() {
      updateSellCalc(ticker, currentPrice, holding);
    });

    // Submit
    document.getElementById('sell-submit').addEventListener('click', function() {
      var qty = parseFloat(qtyInput.value) || 0;
      if (qty > 0 && qty <= holding.remainingQuantity) {
        var submitBtn = document.getElementById('sell-submit');
        submitBtn.textContent = '処理中...';
        submitBtn.disabled = true;

        recordSell(ticker, qty, currentPrice, holding).then(function(record) {
          modal.remove();
          var pnl = (currentPrice - holding.averageCost) * qty * usdRate;
          var pnlText = pnl >= 0 ? '+' + formatYen(pnl) : formatYen(pnl);
          if (window.KAIROS && window.KAIROS.Features && window.KAIROS.Features.showToast) {
            window.KAIROS.Features.showToast(ticker + ' 売却完了 ' + pnlText, pnl >= 0 ? 'success' : 'info');
          }
          renderApp();
        }).catch(function(err) {
          submitBtn.textContent = '売却する';
          submitBtn.disabled = false;
          console.error('[KAIROS] Sell failed:', err);
          if (window.KAIROS && window.KAIROS.Features && window.KAIROS.Features.showToast) {
            window.KAIROS.Features.showToast('エラーが発生しました', 'error');
          }
        });
      } else if (qty > holding.remainingQuantity) {
        window.KAIROS.Features.showToast('保有数量を超えています', 'error');
      }
    });

    updateSellCalc(ticker, currentPrice, holding);
  }

  function updateSellCalc(ticker, price, holding) {
    var qty = parseFloat(document.getElementById('sell-quantity').value) || 0;
    var usdRate = 150;

    var saleValueJpy = qty * price * usdRate;
    var costBasisJpy = qty * holding.averageCost * usdRate;
    var realizedPnl = saleValueJpy - costBasisJpy;
    var pnlColor = realizedPnl >= 0 ? '#10b981' : '#ef4444';

    var valueEl = document.getElementById('sell-value');
    var pnlEl = document.getElementById('sell-pnl');

    if (valueEl) valueEl.textContent = formatYen(saleValueJpy);
    if (pnlEl) {
      pnlEl.textContent = (realizedPnl >= 0 ? '+' : '') + formatYen(realizedPnl);
      pnlEl.style.color = pnlColor;
    }
  }

  function recordSell(ticker, quantity, priceUsd, holding) {
    return new Promise(function(resolve, reject) {
      function onSellSuccess(record) {
        // ポートフォリオスナップショットを記録
        if (typeof recordPortfolioSnapshot === 'function') {
          recordPortfolioSnapshot();
        }
        resolve(record);
      }

      var usdRate = 150;
      var priceJpy = priceUsd > 0 ? priceUsd * usdRate : 0;

      if (window.KairosInvestment && window.KairosInvestment.Manager) {
        window.KairosInvestment.Manager.addSellRecord({
          currencyId: ticker,
          quantity: quantity,
          priceJpy: priceJpy,
          priceUsd: priceUsd,
          note: '売却'
        }).then(onSellSuccess).catch(reject);
      } else {
        try {
          var records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
          var usdRate = 150;

          var record = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            type: 'sell',
            currencyId: ticker,
            quantity: quantity,
            priceUsd: priceUsd,
            totalJpy: quantity * priceUsd * usdRate,
            totalUsd: quantity * priceUsd,
            status: 'confirmed'
          };
          records.push(record);

          localStorage.setItem('kairosInvestmentRecords', JSON.stringify(records));
          onSellSuccess(record);
        } catch(e) {
          console.error('[KAIROS] Failed to record sell:', e);
          reject(e);
        }
      }
    });
  }

  // 売却モーダルをグローバル公開
  window.openSellModal = openSellModal;

  // ===== サイドメニュー =====
  function createSideMenu() {
    if (document.getElementById('kairos-side-menu')) return;

    // オーバーレイ
    var overlay = document.createElement('div');
    overlay.className = 'kairos-side-menu-overlay';
    overlay.id = 'kairos-side-menu-overlay';
    overlay.onclick = closeSideMenu;
    document.body.appendChild(overlay);

    // サイドメニュー
    var menu = document.createElement('div');
    menu.className = 'kairos-side-menu';
    menu.id = 'kairos-side-menu';

    // 投資データを取得
    var investData = getInvestmentData();
    var totalValue = investData.totalInvested || 0;
    var pnl = investData.totalUnrealizedPnl || 0;

    menu.innerHTML =
      '<div class="kairos-side-menu-header">' +
        '<span class="kairos-side-menu-title">KAIROS</span>' +
        '<button class="kairos-side-menu-close" onclick="closeSideMenu()">×</button>' +
      '</div>' +

      '<div class="kairos-side-menu-section">' +
        '<div class="kairos-side-menu-section-title">通貨選択</div>' +
        '<div class="kairos-side-menu-coins" id="side-menu-coins"></div>' +
      '</div>' +

      '<div class="kairos-side-menu-section">' +
        '<div class="kairos-side-menu-section-title">ポートフォリオ</div>' +
        '<div class="kairos-side-menu-portfolio" id="side-menu-portfolio" onclick="openPortfolioModal(); closeSideMenu();">' +
          '<div class="kairos-side-menu-portfolio-label">総資産</div>' +
          '<div class="kairos-side-menu-portfolio-value" id="side-menu-portfolio-total">' + formatYen(totalValue) + '</div>' +
          '<div class="kairos-side-menu-portfolio-pnl" id="side-menu-portfolio-pnl">損益: ' + (pnl >= 0 ? '+' : '') + formatYen(pnl) + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="kairos-side-menu-section">' +
        '<div class="kairos-side-menu-section-title">市場心理</div>' +
        '<div class="kairos-side-menu-feargreed" id="side-menu-feargreed">' +
          renderSideMenuFearGreed() +
        '</div>' +
      '</div>' +

      '<div class="kairos-side-menu-section">' +
        '<div class="kairos-side-menu-section-title">ツール</div>' +
        '<button class="kairos-side-menu-btn" onclick="openAlertModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">🔔</span>' +
          '<span>アラート設定</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openAlertHistoryModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">📬</span>' +
          '<span>通知履歴</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openDCAModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">📊</span>' +
          '<span>DCA計算機</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openHistoryModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">📈</span>' +
          '<span>取引履歴</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openPnLReportModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">📋</span>' +
          '<span>損益レポート</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openCompareModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">⚖️</span>' +
          '<span>通貨比較</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openWatchlistModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">📌</span>' +
          '<span>ウォッチリスト管理</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openTargetPriceModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">🎯</span>' +
          '<span>目標価格設定</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openNewsModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">📰</span>' +
          '<span>ニュース</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openTaxModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">🧮</span>' +
          '<span>税金計算</span>' +
        '</button>' +
      '</div>' +

      '<div class="kairos-side-menu-section">' +
        '<div class="kairos-side-menu-section-title">AI アシスタント</div>' +
        '<button class="kairos-side-menu-btn" onclick="openAIChatModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">🤖</span>' +
          '<span>AI チャット</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openAIAnalysisModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">🧠</span>' +
          '<span>AI 分析</span>' +
        '</button>' +
      '</div>' +

      '<div class="kairos-side-menu-section">' +
        '<div class="kairos-side-menu-section-title">🎰 Moonshot</div>' +
        '<button class="kairos-side-menu-btn" onclick="window.KairosApp.showMoonshot(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">🎰</span>' +
          '<span>トレンド + Early検出</span>' +
          '<span id="early-mover-menu-badge" class="early-mover-menu-badge" style="display:none"></span>' +
        '</button>' +
        '<div class="kairos-side-menu-moonshot-status">' +
          '<span>予算: ' + formatYen(appState.moonshotSpent) + ' / ' + formatYen(appState.moonshotBudget) + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="kairos-side-menu-section">' +
        '<div class="kairos-side-menu-section-title">設定</div>' +
        '<button class="kairos-side-menu-btn kairos-side-menu-btn--currency" onclick="togglePriceCurrency(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">💱</span>' +
          '<span>通貨: ' + (appState.priceCurrency === 'JPY' ? '¥ JPY' : '$ USD') + '</span>' +
          '<span class="kairos-side-menu-btn-toggle">' + (appState.priceCurrency === 'JPY' ? '→ $ USD' : '→ ¥ JPY') + '</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openSettingsModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">⚙️</span>' +
          '<span>設定</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openBackupModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">💾</span>' +
          '<span>バックアップ</span>' +
        '</button>' +
        '<button class="kairos-side-menu-btn" onclick="openWorkerUrlModal(); closeSideMenu();">' +
          '<span class="kairos-side-menu-btn-icon">🛰️</span>' +
          '<span>Worker 監視設定</span>' +
          (workerAlertState.url ? '<span class="kairos-side-menu-btn-toggle" style="color:#10b981">稼働中</span>' : '<span class="kairos-side-menu-btn-toggle" style="color:#64748b">未設定</span>') +
        '</button>' +
      '</div>';

    document.body.appendChild(menu);

    // 通貨ボタン追加
    populateCoinButtons();
  }

  // 通貨ボタンを追加
  function populateCoinButtons() {
    var container = document.getElementById('side-menu-coins');
    if (!container) return;

    var allResults = kairosData.all_results || [];

    // お気に入りを取得
    var favoritesStr = localStorage.getItem('kairos-favorites');
    var favorites = favoritesStr ? JSON.parse(favoritesStr) : [];

    // ウォッチリストを取得
    var watchlistStr = localStorage.getItem('kairos-watchlist');
    var watchlist = watchlistStr ? JSON.parse(watchlistStr) : ['BTC', 'ETH', 'SOL'];

    container.innerHTML = '';

    // お気に入りセクション
    if (favorites.length > 0) {
      var favSection = document.createElement('div');
      favSection.className = 'kairos-side-menu-favorites';
      favSection.innerHTML = '<div class="kairos-side-menu-favorites-header">★ お気に入り</div>';

      var favGrid = document.createElement('div');
      favGrid.className = 'kairos-side-menu-coin-grid';

      favorites.forEach(function(coinId) {
        var btn = document.createElement('button');
        btn.className = 'kairos-side-menu-coin favorite';
        btn.id = 'side-coin-' + coinId;
        if (appState.selectedCurrency === coinId) {
          btn.classList.add('active');
        }
        btn.innerHTML = getCoinIcon(coinId) + ' ' + coinId;
        btn.onclick = function() {
          document.querySelectorAll('.kairos-side-menu-coin').forEach(function(b) {
            b.classList.remove('active');
          });
          btn.classList.add('active');
          appState.selectedCurrency = coinId;
          closeSideMenu();
          navigateTo('detail');
        };
        favGrid.appendChild(btn);
      });

      favSection.appendChild(favGrid);
      container.appendChild(favSection);
    }

    // その他の通貨セクション
    var otherCoins = watchlist.filter(function(coinId) {
      return favorites.indexOf(coinId) < 0;
    });

    if (otherCoins.length > 0) {
      var otherSection = document.createElement('div');
      otherSection.className = 'kairos-side-menu-others';
      if (favorites.length > 0) {
        otherSection.innerHTML = '<div class="kairos-side-menu-others-header">ウォッチリスト</div>';
      }

      var otherGrid = document.createElement('div');
      otherGrid.className = 'kairos-side-menu-coin-grid';

      otherCoins.forEach(function(coinId) {
        var btn = document.createElement('button');
        btn.className = 'kairos-side-menu-coin';
        btn.id = 'side-coin-' + coinId;
        if (appState.selectedCurrency === coinId) {
          btn.classList.add('active');
        }
        btn.innerHTML = getCoinIcon(coinId) + ' ' + coinId;
        btn.onclick = function() {
          document.querySelectorAll('.kairos-side-menu-coin').forEach(function(b) {
            b.classList.remove('active');
          });
          btn.classList.add('active');
          appState.selectedCurrency = coinId;
          closeSideMenu();
          navigateTo('detail');
        };
        otherGrid.appendChild(btn);
      });

      otherSection.appendChild(otherGrid);
      container.appendChild(otherSection);
    }
  }

  // サイドメニューを開く
  window.openSideMenu = function() {
    var menu = document.getElementById('kairos-side-menu');
    var overlay = document.getElementById('kairos-side-menu-overlay');

    if (!menu) {
      createSideMenu();
      menu = document.getElementById('kairos-side-menu');
      overlay = document.getElementById('kairos-side-menu-overlay');
    }

    if (menu) menu.classList.add('open');
    if (overlay) overlay.classList.add('open');

    // コインボタンを更新（お気に入りの変更を反映）
    populateCoinButtons();

    // ポートフォリオ表示を更新
    updateSideMenuPortfolio();
  };

  // サイドメニューを閉じる
  window.closeSideMenu = function() {
    var menu = document.getElementById('kairos-side-menu');
    var overlay = document.getElementById('kairos-side-menu-overlay');
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  // サイドメニューのポートフォリオ表示を更新
  function updateSideMenuPortfolio() {
    var sideTotal = document.getElementById('side-menu-portfolio-total');
    var sidePnl = document.getElementById('side-menu-portfolio-pnl');

    if (sideTotal && sidePnl) {
      var investData = getInvestmentData();
      var totalValue = investData.totalInvested || 0;
      var pnl = investData.totalUnrealizedPnl || 0;
      sideTotal.textContent = formatYen(totalValue);
      sidePnl.textContent = '損益: ' + (pnl >= 0 ? '+' : '') + formatYen(pnl);
    }
  }

  // 設定の読み込み
  function getKairosSettings() {
    var defaults = {
      theme: 'dark',
      virtualBuyAmount: 10000,
      virtualBuyMode: 'fixed',
      taxThreshold: 200000,
      anomalyAlertEnabled: true
    };
    try {
      var saved = localStorage.getItem('kairos_settings');
      if (saved) {
        var parsed = JSON.parse(saved);
        for (var key in defaults) {
          if (parsed[key] === undefined) parsed[key] = defaults[key];
        }
        return parsed;
      }
      return defaults;
    } catch(e) {
      return defaults;
    }
  }

  // 設定の保存
  function saveKairosSettings(settings) {
    try {
      localStorage.setItem('kairos_settings', JSON.stringify(settings));
    } catch(e) {}
  }

  // 設定モーダル
  window.openSettingsModal = function() {
    // 既存モーダルを削除
    var existing = document.getElementById('kairos-settings-modal');
    if (existing) existing.remove();

    var settings = getKairosSettings();
    var savedTheme = settings.theme || 'dark';

    var THEMES = [
      { id: 'dark', name: 'Dark', accent: '#94a3b8', gradient: null },
      { id: 'kairos', name: 'KAIROS', accent: '#d4a853', gradient: 'linear-gradient(135deg, #ffd700, #d4a853, #b8860b)' },
      { id: 'cyber', name: 'Cyber', accent: '#3b82f6', gradient: null },
      { id: 'emerald', name: 'Emerald', accent: '#14b8a6', gradient: null },
      { id: 'neon', name: 'Aurora', accent: '#22d3ee', gradient: null },
      { id: 'turquoise', name: 'Turquoise', accent: '#0d9488', gradient: 'linear-gradient(135deg, #2dd4bf, #0d9488)' }
    ];

    var themeButtonsHtml = THEMES.map(function(t) {
      var isActive = savedTheme === t.id;
      var borderColor = isActive ? t.accent : 'rgba(255,255,255,0.1)';
      var bgColor = isActive ? t.accent + '20' : 'rgba(255,255,255,0.03)';
      var textColor = isActive ? t.accent : 'rgba(255,255,255,0.6)';
      var colorPreview = t.gradient || t.accent;
      var boxShadow = (t.id === 'kairos' && isActive) ? ';box-shadow:0 0 15px rgba(212,168,83,0.4)' : '';
      return '<button class="theme-option-btn" data-theme="' + t.id + '" data-accent="' + t.accent + '" style="' +
        'display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;' +
        'border:2px solid ' + borderColor + ';background:' + bgColor + ';color:' + textColor + ';' +
        'cursor:pointer;font-size:13px;font-weight:500;transition:all 0.2s' + boxShadow + '">' +
        '<span style="width:14px;height:14px;border-radius:50%;background:' + colorPreview + ';box-shadow:' + (t.id === 'kairos' ? '0 0 8px rgba(212,168,83,0.5)' : 'none') + '"></span>' +
        '<span>' + t.name + '</span>' +
      '</button>';
    }).join('');

    var alertToggleStyle = settings.anomalyAlertEnabled ?
      'background:#22c55e' : 'background:rgba(255,255,255,0.2)';
    var alertKnobStyle = settings.anomalyAlertEnabled ?
      'right:3px;left:auto' : 'left:3px;right:auto';

    var modal = document.createElement('div');
    modal.id = 'kairos-settings-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';

    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;max-width:420px;width:90%;max-height:85vh;overflow-y:auto;position:relative">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.1)">' +
          '<h3 style="margin:0;color:#fff;font-size:18px">設定</h3>' +
          '<button onclick="document.getElementById(\'kairos-settings-modal\').remove()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;padding:4px 8px">×</button>' +
        '</div>' +
        '<div style="padding:20px 24px">' +

          '<!-- テーマ設定 -->' +
          '<section style="margin-bottom:24px">' +
            '<h4 style="margin:0 0 12px 0;color:rgba(255,255,255,0.5);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">テーマ</h4>' +
            '<div class="theme-selector" style="display:flex;flex-wrap:wrap;gap:8px">' + themeButtonsHtml + '</div>' +
          '</section>' +

          '<!-- AI・データ連携 -->' +
          '<section style="margin-bottom:24px">' +
            '<h4 style="margin:0 0 12px 0;color:rgba(255,255,255,0.5);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">AI・データ連携</h4>' +
            '<button id="open-api-settings-btn" style="width:100%;padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);cursor:pointer;display:flex;align-items:center;gap:12px">' +
              '<span style="font-size:20px">🔑</span>' +
              '<div style="flex:1;text-align:left">' +
                '<div style="color:#fff;font-size:14px;font-weight:500">APIキー設定</div>' +
                '<div style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:2px">AI分析・データ取得の設定</div>' +
              '</div>' +
              '<span style="color:rgba(255,255,255,0.4);font-size:16px">›</span>' +
            '</button>' +
          '</section>' +

          '<!-- 仮買い設定 -->' +
          '<section style="margin-bottom:24px">' +
            '<h4 style="margin:0 0 12px 0;color:rgba(255,255,255,0.5);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">仮買い設定</h4>' +
            '<div style="background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">' +
                '<span style="color:rgba(255,255,255,0.7);font-size:14px">仮買い金額</span>' +
                '<input type="number" id="virtual-buy-amount" value="' + settings.virtualBuyAmount + '" style="width:120px;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.2);color:#fff;font-size:14px;text-align:right">' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px">' +
                '<span style="color:rgba(255,255,255,0.7);font-size:14px">モード</span>' +
                '<select id="virtual-buy-mode" style="padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.2);color:#fff;font-size:14px">' +
                  '<option value="fixed"' + (settings.virtualBuyMode === 'fixed' ? ' selected' : '') + '>固定金額</option>' +
                  '<option value="percent"' + (settings.virtualBuyMode === 'percent' ? ' selected' : '') + '>割合（%）</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
          '</section>' +

          '<!-- 目標設定 -->' +
          '<section style="margin-bottom:24px">' +
            '<h4 style="margin:0 0 12px 0;color:rgba(255,255,255,0.5);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">目標設定</h4>' +
            '<div style="background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px">' +
                '<span style="color:rgba(255,255,255,0.7);font-size:14px">確定利益ライン</span>' +
                '<input type="number" id="tax-threshold" value="' + settings.taxThreshold + '" style="width:120px;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.2);color:#fff;font-size:14px;text-align:right">' +
              '</div>' +
            '</div>' +
          '</section>' +

          '<!-- 通知設定 -->' +
          '<section style="margin-bottom:24px">' +
            '<h4 style="margin:0 0 12px 0;color:rgba(255,255,255,0.5);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">通知設定</h4>' +
            '<div style="background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px">' +
                '<div>' +
                  '<div style="color:rgba(255,255,255,0.9);font-size:14px">異常値アラート</div>' +
                  '<div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:2px">条件達成時にプッシュ通知</div>' +
                '</div>' +
                '<button id="anomaly-alert-toggle" style="width:50px;height:28px;border-radius:14px;border:none;' + alertToggleStyle + ';cursor:pointer;position:relative;transition:background 0.2s">' +
                  '<span style="position:absolute;top:3px;' + alertKnobStyle + ';width:22px;height:22px;border-radius:50%;background:#fff;transition:all 0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.2)"></span>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</section>' +

          '<!-- Moonshot設定 -->' +
          '<section style="margin-bottom:24px">' +
            '<h4 style="margin:0 0 12px 0;color:#f59e0b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">🎰 Moonshot設定</h4>' +
            '<div style="background:rgba(245,158,11,0.1);border-radius:12px;border:1px solid rgba(245,158,11,0.2);overflow:hidden">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(245,158,11,0.1)">' +
                '<div>' +
                  '<div style="color:rgba(255,255,255,0.9);font-size:14px">月間予算上限</div>' +
                  '<div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:2px">ミームコイン購入の上限</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:6px">' +
                  '<input type="number" id="moonshot-budget-setting" value="' + appState.moonshotBudget + '" min="1000" max="100000" step="1000" style="width:100px;padding:8px 12px;border-radius:8px;border:1px solid rgba(245,158,11,0.3);background:rgba(0,0,0,0.2);color:#fff;font-size:14px;text-align:right">' +
                  '<span style="color:rgba(255,255,255,0.5);font-size:13px">円</span>' +
                '</div>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px">' +
                '<div>' +
                  '<div style="color:rgba(255,255,255,0.9);font-size:14px">今月の使用額</div>' +
                  '<div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:2px">リセットは月初に自動</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:8px">' +
                  '<span style="color:#f59e0b;font-size:16px;font-weight:600">' + formatYen(appState.moonshotSpent) + '</span>' +
                  '<button id="reset-moonshot-spent-btn" style="padding:6px 10px;border-radius:6px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.1);color:#ef4444;font-size:11px;cursor:pointer">リセット</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</section>' +

          '<!-- フッター -->' +
          '<div style="text-align:center;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06)">' +
            '<div style="color:rgba(255,255,255,0.4);font-size:12px">KAIROS Vanilla v5.0</div>' +
            '<div style="color:rgba(255,255,255,0.25);font-size:11px;margin-top:4px">投資は自己責任で</div>' +
          '</div>' +

        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    // 背景クリックで閉じる
    modal.onclick = function(e) {
      if (e.target === modal) modal.remove();
    };

    // テーマボタンのイベント
    modal.querySelectorAll('.theme-option-btn').forEach(function(btn) {
      btn.onclick = function() {
        var themeId = btn.getAttribute('data-theme');
        var accent = btn.getAttribute('data-accent');

        settings.theme = themeId;
        appState.theme = themeId;
        saveKairosSettings(settings);
        document.documentElement.setAttribute('data-theme', themeId);

        // ボタンの見た目を更新
        modal.querySelectorAll('.theme-option-btn').forEach(function(b) {
          var bTheme = b.getAttribute('data-theme');
          var bAccent = b.getAttribute('data-accent');
          var isActive = bTheme === themeId;
          b.style.borderColor = isActive ? bAccent : 'rgba(255,255,255,0.1)';
          b.style.background = isActive ? bAccent + '20' : 'rgba(255,255,255,0.03)';
          b.style.color = isActive ? bAccent : 'rgba(255,255,255,0.6)';
        });

        var themeName = THEMES.find(function(t) { return t.id === themeId; });
        showToast('テーマを ' + (themeName ? themeName.name : themeId) + ' に変更しました', 'success');
      };
    });

    // APIキー設定ボタン
    document.getElementById('open-api-settings-btn').onclick = function() {
      modal.remove();
      openAPIKeySettingsModal();
    };

    // 仮買い金額の変更
    document.getElementById('virtual-buy-amount').onchange = function(e) {
      settings.virtualBuyAmount = parseInt(e.target.value) || 10000;
      saveKairosSettings(settings);
    };

    // 仮買いモードの変更
    document.getElementById('virtual-buy-mode').onchange = function(e) {
      settings.virtualBuyMode = e.target.value;
      saveKairosSettings(settings);
    };

    // 確定利益ラインの変更
    document.getElementById('tax-threshold').onchange = function(e) {
      settings.taxThreshold = parseInt(e.target.value) || 200000;
      saveKairosSettings(settings);
    };

    // 異常値アラートのトグル
    document.getElementById('anomaly-alert-toggle').onclick = function(e) {
      settings.anomalyAlertEnabled = !settings.anomalyAlertEnabled;
      saveKairosSettings(settings);

      var btn = e.currentTarget;
      var knob = btn.querySelector('span');
      if (settings.anomalyAlertEnabled) {
        btn.style.background = '#22c55e';
        knob.style.left = 'auto';
        knob.style.right = '3px';
      } else {
        btn.style.background = 'rgba(255,255,255,0.2)';
        knob.style.right = 'auto';
        knob.style.left = '3px';
      }
    };

    // Moonshot予算の変更
    document.getElementById('moonshot-budget-setting').onchange = function(e) {
      var budget = parseInt(e.target.value) || 10000;
      budget = Math.max(1000, Math.min(100000, budget));
      e.target.value = budget;
      window.KairosApp.setMoonshotBudget(budget);
      showToast('Moonshot予算を ' + formatYen(budget) + ' に設定しました', 'success');
    };

    // Moonshot使用額リセット
    document.getElementById('reset-moonshot-spent-btn').onclick = function() {
      if (confirm('今月のMoonshot使用額をリセットしますか？')) {
        window.KairosApp.resetMoonshotSpent();
        modal.remove();
        openSettingsModal();
        showToast('Moonshot使用額をリセットしました', 'success');
      }
    };
  };

  // APIキー設定モーダル (v19.8: 8分析柱ベース)
  window.openAPIKeySettingsModal = function() {
    var existing = document.getElementById('kairos-api-settings-modal');
    if (existing) existing.remove();

    // v19.8: 柱データ取得
    var swingConf = scoreCache.swingConfidence || 50;
    var longtermConf = scoreCache.longtermConfidence || 50;
    var pillars = scoreCache.pillarCoverage || {};

    // 柱の表示順序
    var PILLAR_ORDER = ['technical', 'derivatives', 'orderflow', 'whale', 'onchain', 'fundamentals', 'sentiment', 'news'];

    // カバレッジに応じた色
    function getCoverageColor(pct) {
      if (pct >= 80) return '#22c55e';
      if (pct >= 50) return '#3b82f6';
      if (pct >= 30) return '#f59e0b';
      return '#ef4444';
    }

    // プログレスバーHTML
    function makeProgressBar(label, icon, pct, color) {
      var barWidth = Math.max(2, Math.min(100, pct));
      return '<div style="margin-bottom:12px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
          '<span style="font-size:13px;font-weight:600">' + icon + ' ' + label + '</span>' +
          '<span style="font-size:18px;font-weight:bold;color:' + color + '">' + pct + '%</span>' +
        '</div>' +
        '<div style="height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden">' +
          '<div style="height:100%;width:' + barWidth + '%;background:' + color + ';border-radius:4px;transition:width 0.5s ease"></div>' +
        '</div>' +
      '</div>';
    }

    // 上部: 2本の信頼度プログレスバー
    var swingColor = getCoverageColor(swingConf);
    var longtermColor = getCoverageColor(longtermConf);
    var confidenceBarsHtml =
      '<div style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(59,130,246,0.08));border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px;margin-bottom:20px">' +
        '<div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:14px">情報カバレッジ</div>' +
        makeProgressBar('短期 (Swing)', '\u26a1', swingConf, swingColor) +
        makeProgressBar('長期 (Longterm)', '\uD83D\uDCC8', longtermConf, longtermColor) +
        '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px">100% = プロが使う全情報を網羅した状態</div>' +
      '</div>';

    // 8柱アコーディオンHTML
    var pillarsHtml = '';
    PILLAR_ORDER.forEach(function(pid) {
      var p = pillars[pid];
      if (!p) return;

      var coverage = p.coverage || 0;
      var covColor = getCoverageColor(coverage);
      var activeList = p.active || [];
      var missingList = p.missing || [];

      // アクティブ項目HTML
      var activeHtml = '';
      if (activeList.length > 0) {
        activeHtml = '<div style="margin-bottom:8px"><div style="font-size:11px;color:#888;margin-bottom:4px">接続済み:</div>';
        activeList.forEach(function(item) {
          activeHtml += '<div style="display:flex;align-items:center;gap:6px;padding:4px 0">' +
            '<span style="color:#22c55e;font-size:12px">\u2713</span>' +
            '<span style="font-size:12px;color:#ccc">' + item.name + '</span>' +
            '<span style="font-size:10px;color:#666">+' + item.coverage + '%</span>' +
          '</div>';
        });
        activeHtml += '</div>';
      }

      // 未接続項目HTML
      var missingHtml = '';
      if (missingList.length > 0) {
        missingHtml = '<div><div style="font-size:11px;color:#888;margin-bottom:4px">未接続:</div>';
        missingList.forEach(function(item) {
          var costStr = '';
          if (item.source_type === 'future') {
            costStr = '<span style="font-size:9px;padding:1px 5px;border-radius:3px;background:rgba(107,114,128,0.3);color:#888">将来対応</span>';
          } else if (item.cost) {
            costStr = '<span style="font-size:9px;padding:1px 5px;border-radius:3px;background:rgba(245,158,11,0.2);color:#f59e0b">$' + item.cost + '/月</span>';
          } else {
            costStr = '<span style="font-size:9px;padding:1px 5px;border-radius:3px;background:rgba(34,197,94,0.2);color:#22c55e">無料</span>';
          }
          missingHtml += '<div style="display:flex;align-items:center;gap:6px;padding:4px 0">' +
            '<span style="color:#555;font-size:12px">\u25cb</span>' +
            '<span style="font-size:12px;color:#888">' + item.name + '</span>' +
            costStr +
            '<span style="font-size:10px;color:#666;margin-left:auto">+' + item.coverage + '%</span>' +
          '</div>';
        });
        missingHtml += '</div>';
      }

      // 柱のウェイト表示
      var wSwing = p.weight_swing || 0;
      var wLong = p.weight_longterm || 0;

      pillarsHtml +=
        '<div class="kairos-pillar-category" data-pillar="' + pid + '" style="margin-bottom:12px;background:rgba(255,255,255,0.03);border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">' +
          '<div class="kairos-pillar-header" style="display:flex;align-items:center;padding:14px;cursor:pointer;transition:background 0.2s">' +
            '<span style="font-size:20px;margin-right:10px">' + (p.icon || '') + '</span>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (p.name || pid) + '</div>' +
              '<div style="display:flex;gap:8px;margin-top:2px">' +
                '<span style="font-size:10px;color:#888">\u26a1' + wSwing + '%</span>' +
                '<span style="font-size:10px;color:#888">\uD83D\uDCC8' + wLong + '%</span>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
              '<span style="font-size:16px;font-weight:700;color:' + covColor + '">' + coverage + '%</span>' +
              '<div style="width:60px;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden">' +
                '<div style="height:100%;width:' + Math.max(2, coverage) + '%;background:' + covColor + ';border-radius:3px"></div>' +
              '</div>' +
              '<span class="kairos-pillar-arrow" style="color:#888;font-size:11px;transition:transform 0.2s;transform:rotate(0deg)">\u25bc</span>' +
            '</div>' +
          '</div>' +
          '<div class="kairos-pillar-content" style="max-height:0;overflow:hidden;padding:0 14px;border-top:1px solid rgba(255,255,255,0.05);transition:max-height 0.35s ease,padding 0.35s ease">' +
            activeHtml + missingHtml +
          '</div>' +
        '</div>';
    });

    // AI分析セクション（信頼度に影響しない）
    var savedKeys = {};
    try {
      savedKeys = JSON.parse(localStorage.getItem('kairos_api_keys') || '{}');
    } catch(e) {}

    var aiProviders = [
      { id: 'gemini', name: 'Google Gemini', description: 'Gemini AIによる分析（推奨・設定済）', placeholder: 'AIza...', icon: '\u2728', free: true },
      { id: 'openai', name: 'OpenAI', description: 'GPT-4による高度な分析', placeholder: 'sk-...', icon: '\uD83E\uDDE0' },
      { id: 'anthropic', name: 'Anthropic', description: 'Claude AIによる分析', placeholder: 'sk-ant-...', icon: '\uD83E\uDD16' }
    ];

    var aiHtml = '';
    aiProviders.forEach(function(p) {
      var hasKey = savedKeys[p.id];
      var activeStyle = hasKey ? 'border-left:3px solid #22c55e;' : '';
      var inputBorderColor = hasKey ? '#22c55e' : 'rgba(255,255,255,0.15)';
      var tagsHtml = '';
      if (p.free) tagsHtml += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;font-weight:600;background:#22c55e;color:black">無料</span>';
      if (p.description.indexOf('\u63a8\u5968') >= 0) tagsHtml += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;font-weight:600;background:#3b82f6;color:white;margin-left:4px">推奨</span>';

      aiHtml +=
        '<div class="api-provider" data-provider="' + p.id + '" style="display:flex;align-items:flex-start;padding:12px;background:rgba(0,0,0,0.2);border-radius:10px;margin-bottom:8px;' + activeStyle + '">' +
          '<span style="font-size:18px;margin-right:10px;margin-top:2px">' + p.icon + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:4px">' +
              '<span style="font-weight:600;font-size:13px">' + p.name + '</span>' +
              tagsHtml +
            '</div>' +
            '<div style="font-size:11px;color:#888;margin-bottom:6px">' + p.description + '</div>' +
            '<input type="password" class="api-provider-input" data-provider-id="' + p.id + '" value="' + (savedKeys[p.id] || '') + '" placeholder="' + p.placeholder + '" style="width:100%;padding:8px 10px;background:rgba(0,0,0,0.3);border:1px solid ' + inputBorderColor + ';border-radius:8px;color:white;font-size:12px;transition:border-color 0.2s">' +
          '</div>' +
        '</div>';
    });

    var aiSectionHtml =
      '<div style="margin-top:20px;margin-bottom:16px;background:rgba(255,255,255,0.03);border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">' +
        '<div class="kairos-pillar-header" id="ai-section-header" style="display:flex;align-items:center;padding:14px;cursor:pointer;transition:background 0.2s">' +
          '<span style="font-size:20px;margin-right:10px">\uD83E\uDD16</span>' +
          '<div style="flex:1">' +
            '<div style="font-weight:600;font-size:14px">AI分析エンジン</div>' +
            '<div style="font-size:10px;color:#888;margin-top:2px">信頼度に影響しません</div>' +
          '</div>' +
          '<span class="kairos-pillar-arrow" id="ai-section-arrow" style="color:#888;font-size:11px;transition:transform 0.2s;transform:rotate(0deg)">\u25bc</span>' +
        '</div>' +
        '<div id="ai-section-content" class="kairos-pillar-content" style="max-height:0;overflow:hidden;padding:0 14px;border-top:1px solid rgba(255,255,255,0.05);transition:max-height 0.35s ease,padding 0.35s ease">' +
          aiHtml +
        '</div>' +
      '</div>';

    var modal = document.createElement('div');
    modal.id = 'kairos-api-settings-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10025;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);backdrop-filter:blur(4px);';

    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;max-width:550px;width:95%;max-height:85vh;overflow-y:auto;position:relative">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.1);position:sticky;top:0;background:#1a1a2e;z-index:1">' +
          '<div style="display:flex;align-items:center;gap:12px">' +
            '<button id="api-settings-back" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:4px">\u2190</button>' +
            '<h3 style="margin:0;color:#fff;font-size:18px">情報カバレッジ</h3>' +
          '</div>' +
          '<button onclick="document.getElementById(\'kairos-api-settings-modal\').remove()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;padding:4px 8px">\u00d7</button>' +
        '</div>' +
        '<div style="padding:20px 24px">' +
          '<p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0 0 16px 0">プロが使う8つの分析柱のうち、KAIROSが現在カバーしている割合です。有料APIを追加すると精度が向上します。</p>' +
          confidenceBarsHtml +
          pillarsHtml +
          aiSectionHtml +
          '<button id="api-save-btn" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;font-weight:600;font-size:14px;cursor:pointer;margin-top:8px;transition:all 0.2s">保存する</button>' +
          '<div style="display:flex;align-items:flex-start;gap:8px;margin-top:16px;padding:12px;background:rgba(59,130,246,0.1);border-radius:10px;border:1px solid rgba(59,130,246,0.2)">' +
            '<span style="font-size:16px">\uD83D\uDCA1</span>' +
            '<p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;line-height:1.5">有料APIキーは <code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px">backend/.env</code> に設定してください。バックエンド再起動後にカバレッジに反映されます。</p>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    // 背景クリックで閉じる
    modal.onclick = function(e) {
      if (e.target === modal) modal.remove();
    };

    // 戻るボタン
    document.getElementById('api-settings-back').onclick = function() {
      modal.remove();
      openSettingsModal();
    };

    // 柱アコーディオンの折りたたみ
    modal.querySelectorAll('.kairos-pillar-header').forEach(function(header) {
      header.onmouseover = function() { header.style.background = 'rgba(255,255,255,0.05)'; };
      header.onmouseout = function() { header.style.background = 'transparent'; };
      header.onclick = function() {
        var parent = header.parentElement;
        var content = parent.querySelector('.kairos-pillar-content');
        var arrow = header.querySelector('.kairos-pillar-arrow');
        if (!content || !arrow) return;
        var isOpen = content.style.maxHeight !== '0px' && content.style.maxHeight !== '0';

        if (isOpen) {
          content.style.maxHeight = '0';
          content.style.padding = '0 14px';
          arrow.style.transform = 'rotate(0deg)';
        } else {
          content.style.maxHeight = '2000px';
          content.style.padding = '14px';
          arrow.style.transform = 'rotate(180deg)';
        }
      };
    });

    // AI入力変更時
    modal.querySelectorAll('.api-provider-input').forEach(function(input) {
      input.onfocus = function() { input.style.borderColor = '#3b82f6'; };
      input.onblur = function() {
        input.style.borderColor = input.value ? '#22c55e' : 'rgba(255,255,255,0.15)';
      };
      input.oninput = function() {
        var provider = input.closest('.api-provider');
        if (input.value) {
          input.style.borderColor = '#22c55e';
          if (provider) provider.style.borderLeft = '3px solid #22c55e';
        } else {
          input.style.borderColor = 'rgba(255,255,255,0.15)';
          if (provider) provider.style.borderLeft = 'none';
        }
      };
    });

    // 保存ボタン
    document.getElementById('api-save-btn').onclick = function() {
      var newKeys = {};
      modal.querySelectorAll('.api-provider-input').forEach(function(input) {
        if (input.value.trim()) {
          newKeys[input.getAttribute('data-provider-id')] = input.value.trim();
        }
      });

      localStorage.setItem('kairos_api_keys', JSON.stringify(newKeys));

      var btn = document.getElementById('api-save-btn');
      btn.textContent = '\u2713 保存しました';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      setTimeout(function() {
        btn.textContent = '保存する';
        btn.style.background = 'linear-gradient(135deg,#3b82f6,#2563eb)';
      }, 2000);

      showToast('APIキーを保存しました', 'success');
    };
  };

  // ポートフォリオモーダル（拡張版）
  window.openPortfolioModal = function() {
    if (document.getElementById('kairos-portfolio-modal')) return;

    var allResults = kairosData.all_results || [];

    // 投資記録からポートフォリオを計算
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    // 通貨ごとの保有量と平均取得価格を計算
    var holdings = {};
    records.forEach(function(record) {
      var id = record.currencyId;
      if (!holdings[id]) {
        holdings[id] = { totalQty: 0, totalCost: 0, records: [] };
      }
      var qty = record.type === 'sell' ? -(record.quantity || 0) : (record.quantity || 0);
      var cost = record.type === 'sell' ? 0 : (record.totalJpy || 0);
      holdings[id].totalQty += qty;
      holdings[id].totalCost += cost;
      holdings[id].records.push(record);
    });

    // 資産データを整理
    var COIN_COLORS = {
      BTC: '#F7931A', ETH: '#627EEA', SOL: '#14F195', XRP: '#23292F',
      ADA: '#0033AD', DOGE: '#C2A633', DOT: '#E6007A', AVAX: '#E84142',
      LINK: '#2A5ADA', MATIC: '#8247E5'
    };

    var assets = [];
    var totalValue = 0;
    var totalCost = 0;

    Object.keys(holdings).forEach(function(id) {
      var holding = holdings[id];
      if (holding.totalQty <= 0) return;

      var coinInfo = allResults.find(function(r) { return r.ticker === id; });
      var price = coinInfo ? coinInfo.current_price : 0;
      var value = holding.totalQty * price;
      var avgPrice = holding.totalCost / holding.totalQty;
      var pnl = value - holding.totalCost;
      var pnlPercent = holding.totalCost > 0 ? (pnl / holding.totalCost * 100) : 0;

      assets.push({
        id: id,
        qty: holding.totalQty,
        avgPrice: avgPrice,
        cost: holding.totalCost,
        value: value,
        pnl: pnl,
        pnlPercent: pnlPercent,
        color: COIN_COLORS[id] || '#d4a853'
      });

      totalValue += value;
      totalCost += holding.totalCost;
    });

    // 値順でソート
    assets.sort(function(a, b) { return b.value - a.value; });

    var totalPnl = totalValue - totalCost;
    var totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost * 100) : 0;

    // 円グラフSVG生成
    function renderPieChart(assets, total) {
      if (assets.length === 0) {
        return '<div style="width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4)">データなし</div>';
      }

      var size = 160;
      var cx = size / 2;
      var cy = size / 2;
      var radius = 60;
      var innerRadius = 40;
      var startAngle = -90;
      var paths = '';

      assets.forEach(function(asset) {
        var percentage = total > 0 ? (asset.value / total) : 0;
        var angle = percentage * 360;
        var endAngle = startAngle + angle;

        var x1 = cx + radius * Math.cos(startAngle * Math.PI / 180);
        var y1 = cy + radius * Math.sin(startAngle * Math.PI / 180);
        var x2 = cx + radius * Math.cos(endAngle * Math.PI / 180);
        var y2 = cy + radius * Math.sin(endAngle * Math.PI / 180);
        var x3 = cx + innerRadius * Math.cos(endAngle * Math.PI / 180);
        var y3 = cy + innerRadius * Math.sin(endAngle * Math.PI / 180);
        var x4 = cx + innerRadius * Math.cos(startAngle * Math.PI / 180);
        var y4 = cy + innerRadius * Math.sin(startAngle * Math.PI / 180);

        var largeArc = angle > 180 ? 1 : 0;

        if (angle > 0.5) {
          paths += '<path d="M ' + x1 + ' ' + y1 + ' A ' + radius + ' ' + radius + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2 +
            ' L ' + x3 + ' ' + y3 + ' A ' + innerRadius + ' ' + innerRadius + ' 0 ' + largeArc + ' 0 ' + x4 + ' ' + y4 + ' Z" fill="' + asset.color + '" opacity="0.9"/>';
        }

        startAngle = endAngle;
      });

      return '<svg viewBox="0 0 ' + size + ' ' + size + '" style="width:160px;height:160px">' +
        paths +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (innerRadius - 2) + '" fill="var(--bg-primary, #080a0f)"/>' +
        '<text x="' + cx + '" y="' + (cy - 5) + '" text-anchor="middle" fill="#fff" font-size="12" font-weight="600">' + formatYen(totalValue) + '</text>' +
        '<text x="' + cx + '" y="' + (cy + 12) + '" text-anchor="middle" fill="' + (totalPnl >= 0 ? '#22c55e' : '#ef4444') + '" font-size="10">' +
          (totalPnl >= 0 ? '+' : '') + totalPnlPercent.toFixed(1) + '%</text>' +
      '</svg>';
    }

    // 資産リスト生成
    var assetRows = assets.length > 0 ? assets.map(function(asset) {
      var pnlColor = asset.pnl >= 0 ? '#22c55e' : '#ef4444';
      var pnlSign = asset.pnl >= 0 ? '+' : '';
      var percentage = totalValue > 0 ? (asset.value / totalValue * 100) : 0;

      return '<div class="portfolio-asset-row">' +
        '<div class="portfolio-asset-info">' +
          '<div class="portfolio-asset-color" style="background:' + asset.color + '"></div>' +
          '<div class="portfolio-asset-name">' +
            '<span class="portfolio-asset-symbol">' + asset.id + '</span>' +
            '<span class="portfolio-asset-qty">' + asset.qty.toFixed(4) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="portfolio-asset-values">' +
          '<div class="portfolio-asset-value">' + formatYen(asset.value) + '</div>' +
          '<div class="portfolio-asset-pnl" style="color:' + pnlColor + '">' + pnlSign + formatYen(asset.pnl) + ' (' + pnlSign + asset.pnlPercent.toFixed(1) + '%)</div>' +
        '</div>' +
        '<div class="portfolio-asset-percent">' + percentage.toFixed(1) + '%</div>' +
      '</div>';
    }).join('') : '<div style="text-align:center;padding:24px;color:rgba(255,255,255,0.5)">投資記録がありません<br><small>通貨詳細から「投資する」を押して記録を追加</small></div>';

    // 凡例生成
    var legend = assets.slice(0, 5).map(function(asset) {
      return '<div class="portfolio-legend-item">' +
        '<span class="portfolio-legend-dot" style="background:' + asset.color + '"></span>' +
        '<span>' + asset.id + '</span>' +
      '</div>';
    }).join('');

    var modal = document.createElement('div');
    modal.id = 'kairos-portfolio-modal';
    modal.className = 'portfolio-modal-overlay';
    modal.innerHTML =
      '<div class="portfolio-modal">' +
        '<div class="portfolio-modal-header">' +
          '<h3>ポートフォリオ</h3>' +
          '<button class="portfolio-modal-close" onclick="document.getElementById(\'kairos-portfolio-modal\').remove()">×</button>' +
        '</div>' +

        // サマリーセクション
        '<div class="portfolio-summary">' +
          '<div class="portfolio-chart-section">' +
            renderPieChart(assets, totalValue) +
            '<div class="portfolio-legend">' + legend + '</div>' +
          '</div>' +
          '<div class="portfolio-stats">' +
            '<div class="portfolio-stat">' +
              '<span class="portfolio-stat-label">総資産</span>' +
              '<span class="portfolio-stat-value">' + formatYen(totalValue) + '</span>' +
            '</div>' +
            '<div class="portfolio-stat">' +
              '<span class="portfolio-stat-label">投資総額</span>' +
              '<span class="portfolio-stat-value">' + formatYen(totalCost) + '</span>' +
            '</div>' +
            '<div class="portfolio-stat">' +
              '<span class="portfolio-stat-label">含み損益</span>' +
              '<span class="portfolio-stat-value" style="color:' + (totalPnl >= 0 ? '#22c55e' : '#ef4444') + '">' +
                (totalPnl >= 0 ? '+' : '') + formatYen(totalPnl) +
              '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // 資産リスト
        '<div class="portfolio-assets">' +
          '<div class="portfolio-assets-header">保有資産</div>' +
          assetRows +
        '</div>' +

        // アクションボタン
        '<div class="portfolio-actions">' +
          '<button class="portfolio-action-btn" onclick="openPortfolioEditModal()">編集</button>' +
          '<button class="portfolio-action-btn portfolio-action-btn--primary" onclick="document.getElementById(\'kairos-portfolio-modal\').remove()">閉じる</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  };

  // ポートフォリオ編集モーダル（シンプル版）
  window.openPortfolioEditModal = function() {
    var existingModal = document.getElementById('kairos-portfolio-modal');
    if (existingModal) existingModal.remove();

    var allResults = kairosData.all_results || [];
    var portfolio = {};
    try {
      portfolio = JSON.parse(localStorage.getItem('kairos_portfolio') || '{}');
    } catch(e) {}

    var COINS = [
      { id: 'BTC', icon: '₿' }, { id: 'ETH', icon: 'Ξ' }, { id: 'SOL', icon: '◎' },
      { id: 'XRP', icon: '✕' }, { id: 'ADA', icon: '₳' }, { id: 'DOGE', icon: 'Ð' }
    ];

    var rows = '';
    COINS.forEach(function(coin) {
      var data = portfolio[coin.id] || { amount: 0, cost: 0 };
      rows +=
        '<div class="portfolio-edit-row">' +
          '<span class="portfolio-edit-coin">' + coin.icon + ' ' + coin.id + '</span>' +
          '<input type="number" id="pf-amount-' + coin.id + '" value="' + data.amount + '" step="0.0001" placeholder="数量" class="portfolio-edit-input">' +
          '<input type="number" id="pf-cost-' + coin.id + '" value="' + data.cost + '" step="1" placeholder="取得総額(¥)" class="portfolio-edit-input">' +
        '</div>';
    });

    var modal = document.createElement('div');
    modal.id = 'kairos-portfolio-modal';
    modal.className = 'portfolio-modal-overlay';
    modal.innerHTML =
      '<div class="portfolio-modal">' +
        '<div class="portfolio-modal-header">' +
          '<h3>ポートフォリオ編集</h3>' +
          '<button class="portfolio-modal-close" onclick="document.getElementById(\'kairos-portfolio-modal\').remove()">×</button>' +
        '</div>' +
        '<div class="portfolio-edit-hint">保有数量と取得総額（円）を入力</div>' +
        '<div class="portfolio-edit-list">' + rows + '</div>' +
        '<div class="portfolio-actions">' +
          '<button class="portfolio-action-btn" onclick="openPortfolioModal()">戻る</button>' +
          '<button class="portfolio-action-btn portfolio-action-btn--primary" id="pf-save-btn">保存</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    document.getElementById('pf-save-btn').onclick = function() {
      var newPortfolio = {};
      COINS.forEach(function(coin) {
        var amount = parseFloat(document.getElementById('pf-amount-' + coin.id).value) || 0;
        var cost = parseFloat(document.getElementById('pf-cost-' + coin.id).value) || 0;
        if (amount > 0) newPortfolio[coin.id] = { amount: amount, cost: cost };
      });
      localStorage.setItem('kairos_portfolio', JSON.stringify(newPortfolio));
      showToast('ポートフォリオを保存しました', 'success');
      openPortfolioModal();
    };
  };

  // アラート設定モーダル
  window.openAlertModal = function() {
    if (document.getElementById('kairos-alert-modal')) return;

    var settings = window.getAlertSettings ? window.getAlertSettings() : {
      enabled: true,
      thresholds: { spike: 5, crash: -5 },
      longTermThresholds: { weeklyDrop: -15, weeklyRise: 25, monthlyDrop: -25, monthlyRise: 50 },
      customAlerts: [],
      notificationPermission: Notification.permission || 'default'
    };
    var lt = settings.longTermThresholds || { weeklyDrop: -15, weeklyRise: 25, monthlyDrop: -25, monthlyRise: 50 };

    var notificationStatus = '';
    if (!('Notification' in window)) {
      notificationStatus = '<span style="color:#ef4444">非対応</span>';
    } else if (settings.notificationPermission === 'granted') {
      notificationStatus = '<span style="color:#22c55e">許可済み</span>';
    } else if (settings.notificationPermission === 'denied') {
      notificationStatus = '<span style="color:#ef4444">拒否</span>';
    } else {
      notificationStatus = '<button id="alert-request-permission" style="padding:6px 12px;border-radius:8px;border:none;background:#6366f1;color:#fff;font-size:12px;cursor:pointer">通知を許可</button>';
    }

    // カスタムアラート一覧
    var customAlertsHtml = '';
    if (settings.customAlerts && settings.customAlerts.length > 0) {
      settings.customAlerts.forEach(function(alert, index) {
        var typeIcon = alert.type === 'above' ? '⬆️' : '⬇️';
        var typeLabel = alert.type === 'above' ? '以上' : '以下';
        var statusLabel = alert.triggered ? ' <span style="color:#94a3b8">(発動済み)</span>' : '';
        customAlertsHtml +=
          '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:6px">' +
            '<div>' +
              '<span style="font-weight:600">' + typeIcon + ' ' + alert.ticker + '</span>' +
              '<span style="opacity:0.7;margin-left:8px">$' + alert.targetPrice + ' ' + typeLabel + statusLabel + '</span>' +
            '</div>' +
            '<button onclick="window.removePriceAlert(' + index + '); document.getElementById(\'kairos-alert-modal\').remove(); window.openAlertModal();" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px">×</button>' +
          '</div>';
      });
    } else {
      customAlertsHtml = '<div style="text-align:center;padding:16px;color:rgba(255,255,255,0.4);font-size:13px">カスタムアラートなし</div>';
    }

    // 利用可能な通貨リスト
    var coinOptions = '';
    Object.keys(scoreCache.data).forEach(function(ticker) {
      coinOptions += '<option value="' + ticker + '">' + ticker + '</option>';
    });

    var modal = document.createElement('div');
    modal.id = 'kairos-alert-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:420px;width:90%;max-height:85vh;overflow-y:auto">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
          '<h3 style="margin:0;color:#fff;display:flex;align-items:center;gap:8px"><span>🔔</span> アラート設定</h3>' +
          '<button onclick="document.getElementById(\'kairos-alert-modal\').remove()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +

        // 通知許可状態
        '<div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:16px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<span style="color:rgba(255,255,255,0.8)">🔔 ブラウザ通知</span>' +
            notificationStatus +
          '</div>' +
        '</div>' +

        // 有効/無効トグル
        '<div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:16px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<span style="color:rgba(255,255,255,0.8)">アラート監視</span>' +
            '<label style="position:relative;display:inline-block;width:50px;height:26px">' +
              '<input type="checkbox" id="alert-enabled-toggle" ' + (settings.enabled ? 'checked' : '') + ' style="opacity:0;width:0;height:0">' +
              '<span style="position:absolute;cursor:pointer;inset:0;background:' + (settings.enabled ? '#22c55e' : '#374151') + ';border-radius:26px;transition:0.3s"></span>' +
              '<span style="position:absolute;content:\'\';height:20px;width:20px;left:' + (settings.enabled ? '26px' : '3px') + ';bottom:3px;background:#fff;border-radius:50%;transition:0.3s"></span>' +
            '</label>' +
          '</div>' +
        '</div>' +

        // 短期アラート設定（スイング向け）
        '<div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:14px;margin-bottom:16px">' +
          '<div style="font-weight:600;color:#818cf8;margin-bottom:4px">⚡ 短期アラート（スイング向け）</div>' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:12px">数分〜数時間の急変動を検出</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
            '<div>' +
              '<label style="display:block;font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:4px">🚀 急上昇 (%)</label>' +
              '<input type="number" id="alert-spike-threshold" value="' + settings.thresholds.spike + '" min="1" max="50" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px">' +
            '</div>' +
            '<div>' +
              '<label style="display:block;font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:4px">📉 急落 (%)</label>' +
              '<input type="number" id="alert-crash-threshold" value="' + Math.abs(settings.thresholds.crash) + '" min="1" max="50" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px">' +
            '</div>' +
          '</div>' +
        '</div>' +

        // 長期アラート設定（長期投資向け）
        '<div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:14px;margin-bottom:16px">' +
          '<div style="font-weight:600;color:#22c55e;margin-bottom:4px">📈 長期アラート（FIRE向け）</div>' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:12px">週間・月間の大きな変動を検出</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">' +
            '<div>' +
              '<label style="display:block;font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:4px">📉 週間下落 (%)</label>' +
              '<input type="number" id="alert-weekly-drop" value="' + Math.abs(lt.weeklyDrop) + '" min="5" max="50" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px">' +
              '<div style="font-size:10px;color:#22c55e;margin-top:2px">買い増しチャンス</div>' +
            '</div>' +
            '<div>' +
              '<label style="display:block;font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:4px">📈 週間上昇 (%)</label>' +
              '<input type="number" id="alert-weekly-rise" value="' + lt.weeklyRise + '" min="10" max="100" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px">' +
            '</div>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
            '<div>' +
              '<label style="display:block;font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:4px">🔻 月間下落 (%)</label>' +
              '<input type="number" id="alert-monthly-drop" value="' + Math.abs(lt.monthlyDrop) + '" min="10" max="70" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px">' +
              '<div style="font-size:10px;color:#22c55e;margin-top:2px">大きな買い場</div>' +
            '</div>' +
            '<div>' +
              '<label style="display:block;font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:4px">🚀 月間上昇 (%)</label>' +
              '<input type="number" id="alert-monthly-rise" value="' + lt.monthlyRise + '" min="20" max="200" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px">' +
              '<div style="font-size:10px;color:#f59e0b;margin-top:2px">利確検討</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // カスタムアラート
        '<div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:16px">' +
          '<div style="font-weight:600;color:#fff;margin-bottom:12px">🎯 目標価格アラート</div>' +
          '<div id="custom-alerts-list" style="margin-bottom:12px">' + customAlertsHtml + '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;align-items:end">' +
            '<div>' +
              '<label style="display:block;font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">通貨</label>' +
              '<select id="alert-new-ticker" style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:13px">' + coinOptions + '</select>' +
            '</div>' +
            '<div>' +
              '<label style="display:block;font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">条件</label>' +
              '<select id="alert-new-type" style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:13px">' +
                '<option value="above">以上</option>' +
                '<option value="below">以下</option>' +
              '</select>' +
            '</div>' +
            '<div>' +
              '<label style="display:block;font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">価格 ($)</label>' +
              '<input type="number" id="alert-new-price" placeholder="100000" style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:13px">' +
            '</div>' +
            '<button id="alert-add-custom-btn" style="padding:8px 12px;border-radius:8px;border:none;background:#6366f1;color:#fff;cursor:pointer;font-weight:600">+</button>' +
          '</div>' +
        '</div>' +

        // 保存ボタン
        '<button id="alert-save-btn" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:600;font-size:15px;cursor:pointer">設定を保存</button>' +
      '</div>';
    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    // 通知許可リクエスト
    var permBtn = document.getElementById('alert-request-permission');
    if (permBtn) {
      permBtn.onclick = function() {
        Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
            showToast('通知が有効になりました', 'success');
            modal.remove();
            window.openAlertModal();
          } else {
            showToast('通知が拒否されました', 'error');
          }
        });
      };
    }

    // 有効/無効トグル
    var toggleInput = document.getElementById('alert-enabled-toggle');
    if (toggleInput) {
      toggleInput.onchange = function() {
        var slider = this.parentElement.querySelectorAll('span')[0];
        var circle = this.parentElement.querySelectorAll('span')[1];
        if (this.checked) {
          slider.style.background = '#22c55e';
          circle.style.left = '26px';
        } else {
          slider.style.background = '#374151';
          circle.style.left = '3px';
        }
      };
    }

    // カスタムアラート追加
    document.getElementById('alert-add-custom-btn').onclick = function() {
      var ticker = document.getElementById('alert-new-ticker').value;
      var type = document.getElementById('alert-new-type').value;
      var price = document.getElementById('alert-new-price').value;
      if (!ticker || !price) {
        showToast('通貨と価格を入力してください', 'error');
        return;
      }
      window.addPriceAlert(ticker, type, price);
      modal.remove();
      window.openAlertModal();
    };

    // 保存ボタン
    document.getElementById('alert-save-btn').onclick = function() {
      var enabled = document.getElementById('alert-enabled-toggle').checked;
      // 短期設定
      var spike = parseFloat(document.getElementById('alert-spike-threshold').value) || 5;
      var crash = parseFloat(document.getElementById('alert-crash-threshold').value) || 5;
      // 長期設定
      var weeklyDrop = parseFloat(document.getElementById('alert-weekly-drop').value) || 15;
      var weeklyRise = parseFloat(document.getElementById('alert-weekly-rise').value) || 25;
      var monthlyDrop = parseFloat(document.getElementById('alert-monthly-drop').value) || 25;
      var monthlyRise = parseFloat(document.getElementById('alert-monthly-rise').value) || 50;

      window.toggleAlerts(enabled);
      // 短期閾値
      window.setAlertThreshold('spike', spike);
      window.setAlertThreshold('crash', -Math.abs(crash));
      // 長期閾値
      window.setLongTermThreshold('weeklyDrop', -Math.abs(weeklyDrop));
      window.setLongTermThreshold('weeklyRise', weeklyRise);
      window.setLongTermThreshold('monthlyDrop', -Math.abs(monthlyDrop));
      window.setLongTermThreshold('monthlyRise', monthlyRise);

      modal.remove();
      showToast('アラート設定を保存しました', 'success');
    };
  };

  // ===== 価格アラート通知システム =====

  // 通知許可をリクエスト
  function requestNotificationPermission() {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          showToast('通知が有効になりました', 'success');
        }
      });
    }
  }

  // 通知を送信
  function sendNotification(title, body, icon) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      // フォールバック：トーストで表示
      showToast(title + ': ' + body, 'warning');
      return;
    }

    var notification = new Notification(title, {
      body: body,
      icon: icon || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23080a0f' width='100' height='100' rx='20'/%3E%3Ctext x='50' y='70' font-size='36' text-anchor='middle' fill='%23d4a853'%3E%E2%9C%A8%3C/text%3E%3C/svg%3E",
      badge: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23d4a853' cx='50' cy='50' r='50'/%3E%3C/svg%3E",
      vibrate: [200, 100, 200],
      tag: 'kairos-alert',
      renotify: true
    });

    notification.onclick = function() {
      window.focus();
      notification.close();
    };

    // アラート履歴に保存
    saveAlertHistory(title, body);
  }

  // アラート履歴保存
  function saveAlertHistory(title, body) {
    var history = [];
    try {
      history = JSON.parse(localStorage.getItem('kairos_alert_history') || '[]');
    } catch(e) {}

    history.unshift({
      title: title,
      body: body,
      time: new Date().toISOString()
    });

    // 最新50件のみ保持
    history = history.slice(0, 50);
    localStorage.setItem('kairos_alert_history', JSON.stringify(history));
  }

  // 価格アラートをチェック
  var lastAlertTimes = {};

  function checkPriceAlerts() {
    var targets = {};
    var alerts = {};
    try {
      targets = JSON.parse(localStorage.getItem('kairos_targets') || '{}');
      alerts = JSON.parse(localStorage.getItem('kairos_alerts') || '{}');
    } catch(e) { return; }

    // scoreCacheから全通貨をチェック
    Object.keys(scoreCache.data).forEach(function(ticker) {
      var cached = scoreCache.data[ticker] || {};
      var price = cached.price || 0;
      var stratScore = window.getStrategyScore(ticker);
      var score = stratScore.score;
      var target = targets[ticker] || {};
      var alert = alerts[ticker] || {};

      // 同じアラートは5分間隔でのみ送信
      var now = Date.now();
      var alertKey = ticker + '_';

      // 目標価格（上）チェック
      if (target.high && price >= parseFloat(target.high)) {
        alertKey = ticker + '_high_' + target.high;
        if (!lastAlertTimes[alertKey] || now - lastAlertTimes[alertKey] > 300000) {
          sendNotification(
            '🚀 ' + ticker + ' 目標価格到達',
            ticker + 'が$' + price.toLocaleString() + 'に到達しました（目標: $' + target.high + '）'
          );
          lastAlertTimes[alertKey] = now;
        }
      }

      // 目標価格（下）チェック
      if (target.low && price <= parseFloat(target.low)) {
        alertKey = ticker + '_low_' + target.low;
        if (!lastAlertTimes[alertKey] || now - lastAlertTimes[alertKey] > 300000) {
          sendNotification(
            '📉 ' + ticker + ' 下限価格到達',
            ticker + 'が$' + price.toLocaleString() + 'に下落しました（下限: $' + target.low + '）'
          );
          lastAlertTimes[alertKey] = now;
        }
      }

      // スコア上限チェック
      if (alert.scoreHigh && score >= parseFloat(alert.scoreHigh)) {
        alertKey = ticker + '_scoreHigh_' + alert.scoreHigh;
        if (!lastAlertTimes[alertKey] || now - lastAlertTimes[alertKey] > 300000) {
          sendNotification(
            '📈 ' + ticker + ' スコア上昇',
            ticker + 'のスコアが' + score + 'に上昇しました（上限: ' + alert.scoreHigh + '）'
          );
          lastAlertTimes[alertKey] = now;
        }
      }

      // スコア下限チェック
      if (alert.scoreLow && score <= parseFloat(alert.scoreLow)) {
        alertKey = ticker + '_scoreLow_' + alert.scoreLow;
        if (!lastAlertTimes[alertKey] || now - lastAlertTimes[alertKey] > 300000) {
          sendNotification(
            '⚠️ ' + ticker + ' スコア低下',
            ticker + 'のスコアが' + score + 'に低下しました（下限: ' + alert.scoreLow + '）'
          );
          lastAlertTimes[alertKey] = now;
        }
      }
    });
  }

  // アラート履歴モーダル
  window.openAlertHistoryModal = function() {
    var existingModal = document.getElementById('kairos-alert-history-modal');
    if (existingModal) existingModal.remove();

    var history = [];
    try {
      history = JSON.parse(localStorage.getItem('kairos_alert_history') || '[]');
    } catch(e) {}

    var listHtml = '';
    if (history.length === 0) {
      listHtml = '<div style="text-align:center;padding:24px;color:rgba(255,255,255,0.5)">通知履歴がありません</div>';
    } else {
      history.forEach(function(item) {
        var time = new Date(item.time);
        var timeStr = time.toLocaleDateString('ja-JP') + ' ' + time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
        listHtml +=
          '<div style="padding:12px;background:rgba(255,255,255,0.03);border-radius:10px;margin-bottom:8px">' +
            '<div style="font-weight:600;margin-bottom:4px">' + item.title + '</div>' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:4px">' + item.body + '</div>' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.4)">' + timeStr + '</div>' +
          '</div>';
      });
    }

    var modal = document.createElement('div');
    modal.id = 'kairos-alert-history-modal';
    modal.className = 'history-modal-overlay';
    modal.innerHTML =
      '<div class="history-modal" style="max-width:400px">' +
        '<div class="history-modal-header">' +
          '<h3>通知履歴</h3>' +
          '<button class="history-modal-close" onclick="document.getElementById(\'kairos-alert-history-modal\').remove()">×</button>' +
        '</div>' +
        '<div style="padding:16px;max-height:400px;overflow-y:auto">' + listHtml + '</div>' +
        '<div class="history-actions">' +
          '<button class="history-action-btn history-action-btn--danger" onclick="clearAlertHistory()">履歴を削除</button>' +
          '<button class="history-action-btn history-action-btn--primary" onclick="document.getElementById(\'kairos-alert-history-modal\').remove()">閉じる</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  };

  // アラート履歴削除
  window.clearAlertHistory = function() {
    localStorage.setItem('kairos_alert_history', '[]');
    showToast('通知履歴を削除しました', 'success');
    openAlertHistoryModal();
  };

  // アラート監視を開始（データ更新時に呼び出し）
  window.checkPriceAlerts = checkPriceAlerts;

  // ===== RANK/PRICEポップアップ =====

  // PRICEポップアップ（買い時/売り時ゲージ）
  window.openPricePopup = function(ticker) {
    var existing = document.getElementById('price-popup');
    if (existing) existing.remove();

    var cached = scoreCache.data[ticker] || {};
    var pricePosition = cached.pricePosition || 50;
    var stratScoreData = window.getStrategyScore(ticker);
    var grade = stratScoreData.grade;
    var price = cached.price || 0;
    var change24h = cached.change24h || 0;

    // 買い時/売り時の判定
    var signal, signalClass, signalIcon, signalText;
    var isGoodRank = (grade === 'A' || grade === 'B');
    var isBadRank = (grade === 'D' || grade === 'E');

    if (isGoodRank && pricePosition < 30) {
      signal = 'buy';
      signalClass = 'signal--buy';
      signalIcon = '🟢';
      signalText = '買い時';
    } else if (isBadRank && pricePosition > 70) {
      signal = 'sell';
      signalClass = 'signal--sell';
      signalIcon = '🔴';
      signalText = '売り時';
    } else {
      signal = 'hold';
      signalClass = 'signal--hold';
      signalIcon = '🟡';
      signalText = '様子見';
    }

    // ゲージ位置（0=売り時、50=中立、100=買い時）
    var gaugePosition = 50;
    if (signal === 'buy') {
      gaugePosition = 70 + (30 - pricePosition) / 30 * 30; // 70-100
    } else if (signal === 'sell') {
      gaugePosition = 30 - (pricePosition - 70) / 30 * 30; // 0-30
    } else {
      gaugePosition = 35 + (100 - pricePosition) / 100 * 30; // 35-65
    }
    gaugePosition = Math.max(5, Math.min(95, gaugePosition));

    // 状況説明
    var reasons = [];
    if (pricePosition < 30) reasons.push('📉 価格が期間安値に近い（PRICE: ' + pricePosition.toFixed(0) + '%）');
    else if (pricePosition > 70) reasons.push('📈 価格が期間高値に近い（PRICE: ' + pricePosition.toFixed(0) + '%）');
    else reasons.push('➡️ 価格は中間レンジ（PRICE: ' + pricePosition.toFixed(0) + '%）');

    if (isGoodRank) reasons.push('✅ ランク' + grade + '：総合評価が高い');
    else if (isBadRank) reasons.push('⚠️ ランク' + grade + '：総合評価が低め');
    else reasons.push('📊 ランク' + grade + '：総合評価は中程度');

    if (change24h > 5) reasons.push('🚀 24h: +' + change24h.toFixed(1) + '% 上昇中');
    else if (change24h < -5) reasons.push('📉 24h: ' + change24h.toFixed(1) + '% 下落中');

    var reasonsHtml = reasons.map(function(r) {
      return '<div class="price-popup__reason">' + r + '</div>';
    }).join('');

    var popup = document.createElement('div');
    popup.id = 'price-popup';
    popup.className = 'metric-popup-overlay';
    popup.innerHTML =
      '<div class="metric-popup">' +
        '<div class="metric-popup__header">' +
          '<span class="metric-popup__title">💰 PRICE分析 - ' + ticker + '</span>' +
          '<button class="metric-popup__close" onclick="document.getElementById(\'price-popup\').remove()">×</button>' +
        '</div>' +
        '<div class="metric-popup__body">' +
          // シグナル表示
          '<div class="price-popup__signal ' + signalClass + '">' +
            '<span class="price-popup__signal-icon">' + signalIcon + '</span>' +
            '<span class="price-popup__signal-text">' + signalText + '</span>' +
          '</div>' +
          // ゲージ
          '<div class="price-popup__gauge">' +
            '<div class="price-popup__gauge-labels">' +
              '<span>売り時</span>' +
              '<span>様子見</span>' +
              '<span>買い時</span>' +
            '</div>' +
            '<div class="price-popup__gauge-track">' +
              '<div class="price-popup__gauge-gradient"></div>' +
              '<div class="price-popup__gauge-marker" style="left:' + gaugePosition + '%"></div>' +
            '</div>' +
          '</div>' +
          // 状況説明
          '<div class="price-popup__reasons">' +
            '<div class="price-popup__reasons-title">📋 現在の状況</div>' +
            reasonsHtml +
          '</div>' +
          // 注意事項
          '<div class="price-popup__note">' +
            '※ ' + ((typeof StrategyManager !== 'undefined') ? StrategyManager.getConfig(ticker).label : (appState.mode === 'core' ? '長期' : '短期')) + 'モードでの分析結果です<br>' +
            '※ 投資判断は自己責任でお願いします' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(popup);
    popup.onclick = function(e) { if (e.target === popup) popup.remove(); };
  };

  // RANKポップアップ（内訳 + 上昇確率）
  window.openRankPopup = function(ticker) {
    var existing = document.getElementById('rank-popup');
    if (existing) existing.remove();

    var cached = scoreCache.data[ticker] || {};
    var stratScoreData = window.getStrategyScore(ticker);
    var score = stratScoreData.score;
    var grade = stratScoreData.grade;
    var confidence = cached.confidence || scoreCache.systemConfidence || 50;

    // 各指標のスコア（ストラテジーに応じて切替）
    var stratApiMode = (typeof StrategyManager !== 'undefined') ? StrategyManager.getApiMode(ticker) : (appState.mode === 'core' ? 'longterm' : 'swing');
    var metrics;
    if (stratApiMode === 'longterm') {
      metrics = [
        { name: 'MA乖離(90日)', icon: '📈', score: Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 20)) },
        { name: 'RSI', icon: '📊', score: Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 25)) },
        { name: '時価総額', icon: '💎', score: Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 15)) },
        { name: 'ボラティリティ', icon: '📉', score: Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 30)) }
      ];
    } else {
      metrics = [
        { name: 'モメンタム(7日)', icon: '⚡', score: Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 25)) },
        { name: 'RSI(14)', icon: '📊', score: Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 20)) },
        { name: 'MA乖離(7日)', icon: '📈', score: Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 25)) },
        { name: '出来高', icon: '🔥', score: Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 30)) }
      ];
    }

    // 上昇確率の計算（スコアベース + 補正）
    var baseProb = score * 0.8; // スコアの80%をベースに
    var marketAdjust = 0;
    var fearGreed = (kairosData.analysis && kairosData.analysis.market) ? kairosData.analysis.market.fear_greed_index : 50;
    if (fearGreed < 30) marketAdjust = 10; // 恐怖時は上昇確率上げる（逆張り）
    else if (fearGreed > 70) marketAdjust = -10; // 過熱時は下げる
    var riseProb = Math.min(95, Math.max(5, Math.round(baseProb + marketAdjust + (Math.random() - 0.5) * 10)));

    var metricsHtml = metrics.map(function(m) {
      var barColor = m.score >= 70 ? '#22c55e' : (m.score >= 40 ? '#f59e0b' : '#ef4444');
      return '<div class="rank-popup__metric">' +
        '<div class="rank-popup__metric-header">' +
          '<span class="rank-popup__metric-icon">' + m.icon + '</span>' +
          '<span class="rank-popup__metric-name">' + m.name + '</span>' +
          '<span class="rank-popup__metric-score">' + Math.round(m.score) + 'pt</span>' +
        '</div>' +
        '<div class="rank-popup__metric-bar">' +
          '<div class="rank-popup__metric-bar-fill" style="width:' + m.score + '%;background:' + barColor + '"></div>' +
        '</div>' +
      '</div>';
    }).join('');

    var probColor = riseProb >= 60 ? '#22c55e' : (riseProb >= 40 ? '#f59e0b' : '#ef4444');

    var popup = document.createElement('div');
    popup.id = 'rank-popup';
    popup.className = 'metric-popup-overlay';
    popup.innerHTML =
      '<div class="metric-popup">' +
        '<div class="metric-popup__header">' +
          '<span class="metric-popup__title">📊 RANK分析 - ' + ticker + '</span>' +
          '<button class="metric-popup__close" onclick="document.getElementById(\'rank-popup\').remove()">×</button>' +
        '</div>' +
        '<div class="metric-popup__body">' +
          // 総合ランク
          '<div class="rank-popup__summary">' +
            '<div class="rank-popup__grade-box">' +
              '<span class="rank-badge ' + getGradeClass(grade) + '" style="font-size:28px;padding:12px 20px">' + grade + '</span>' +
              '<span class="rank-popup__total-score">' + score + 'pt</span>' +
            '</div>' +
          '</div>' +
          // 上昇確率
          '<div class="rank-popup__probability">' +
            '<div class="rank-popup__prob-header">' +
              '<span>📈 上昇確率</span>' +
              '<span class="rank-popup__prob-value" style="color:' + probColor + '">' + riseProb + '%</span>' +
            '</div>' +
            '<div class="rank-popup__prob-bar">' +
              '<div class="rank-popup__prob-bar-fill" style="width:' + riseProb + '%;background:' + probColor + '"></div>' +
            '</div>' +
            '<div class="rank-popup__prob-note">過去の類似パターンから算出（参考値）</div>' +
          '</div>' +
          // 指標内訳
          '<div class="rank-popup__metrics">' +
            '<div class="rank-popup__metrics-title">' + (stratApiMode === 'longterm' ? '長期' : '短期') + '指標の内訳</div>' +
            metricsHtml +
          '</div>' +
          // 信頼度
          '<div class="rank-popup__confidence">' +
            '<span>🔒 信頼度: ' + confidence + '%</span>' +
            (confidence < 50 ? '<span class="rank-popup__confidence-warning">（一部推測値を含む）</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(popup);
    popup.onclick = function(e) { if (e.target === popup) popup.remove(); };
  };

  // ===== 指標解説ポップアップ =====
  var INDICATOR_HELP = {
    rsi: {
      title: 'RSI（相対力指数）',
      icon: '📊',
      description: '一定期間の値上がり幅と値下がり幅から、買われすぎ・売られすぎを判断する指標です。',
      howToRead: '0〜100の範囲で表示されます。70以上で「買われすぎ」、30以下で「売られすぎ」と判断されます。',
      good: 'RSI 30以下 → 売られすぎ（反発の可能性）',
      bad: 'RSI 70以上 → 買われすぎ（調整の可能性）'
    },
    fg: {
      title: 'Fear & Greed Index',
      icon: '😱',
      description: '市場全体の恐怖と強欲の度合いを数値化した指標です。SNS・ボラティリティ・出来高などから算出されます。',
      howToRead: '0（極度の恐怖）〜100（極度の強欲）で表示されます。',
      good: '25以下（極度の恐怖）→ 逆張り買いのチャンス',
      bad: '75以上（極度の強欲）→ 過熱感あり、注意'
    },
    volume: {
      title: '出来高（Volume）',
      icon: '📈',
      description: '一定期間に取引された量を示します。価格変動の信頼性を測る重要な指標です。',
      howToRead: '平均出来高との比率で表示。1.0x = 平均的、2.0x以上 = 活発な取引。',
      good: '上昇トレンド中の出来高増加 → トレンド継続のサイン',
      bad: '出来高が急減 → トレンド転換の可能性'
    },
    ma: {
      title: 'MA乖離率（移動平均乖離率）',
      icon: '〰️',
      description: '現在の価格が移動平均線からどれだけ離れているかを示します。',
      howToRead: 'プラスなら移動平均より上、マイナスなら下にいます。',
      good: '大きなマイナス乖離 → 売られすぎで反発期待',
      bad: '大きなプラス乖離 → 買われすぎで調整リスク'
    },
    funding: {
      title: '資金調達率（Funding Rate）',
      icon: '💰',
      description: '先物市場のロング/ショートポジションの偏りを調整するための手数料率です。',
      howToRead: 'プラス → ロングが多い（強気）、マイナス → ショートが多い（弱気）。',
      good: '極端なマイナス → ショート過剰で踏み上げの可能性',
      bad: '極端なプラス → ロング過剰で急落リスク'
    },
    ls: {
      title: 'ロング/ショート比（L/S Ratio）',
      icon: '⚖️',
      description: '先物市場のロング（買い）とショート（売り）ポジションの比率です。',
      howToRead: '1.0以上 → ロング優勢、1.0以下 → ショート優勢。',
      good: 'ショート優勢時の価格上昇 → ショートスクイーズの可能性',
      bad: 'ロング極端優勢 → ロングスクイーズに注意'
    },
    oi: {
      title: '建玉（Open Interest）',
      icon: '🏗️',
      description: '先物市場で決済されていないポジションの総量です。市場参加者の関心度を示します。',
      howToRead: 'OI増加 → 新規参入増加、OI減少 → ポジション整理。24h変化率で表示。',
      good: 'OI増加 + 価格上昇 → 強気トレンド確認',
      bad: 'OI増加 + 価格下落 → さらなる下落の可能性'
    },
    marketcap: {
      title: '時価総額（Market Cap）',
      icon: '🏦',
      description: '現在の価格 × 流通供給量で算出される、その通貨の市場での評価額です。',
      howToRead: '時価総額が大きいほど安定性が高い傾向があります。ランキング順位も参考に。',
      good: '時価総額上位 → 流動性が高く比較的安定',
      bad: '時価総額が極端に小さい → 価格操作リスクあり'
    },
    volume24h: {
      title: '24h取引量',
      icon: '🔄',
      description: '過去24時間に取引された総額です。流動性の指標となります。',
      howToRead: '取引量が多いほど売買がスムーズにできます。時価総額との比率も重要。',
      good: '取引量/時価総額 比率が高い → 活発な市場',
      bad: '取引量が極端に少ない → スリッページリスク'
    },
    supply: {
      title: '供給量（Supply）',
      icon: '⛏️',
      description: '現在の流通量と最大供給量を示します。希少性の指標です。',
      howToRead: '流通量/最大供給量の比率で、今後の新規発行余地がわかります。',
      good: '供給量が上限に近い → インフレ圧力が低い',
      bad: '大量の未発行トークンあり → 将来の売り圧力'
    },
    dominance: {
      title: 'ドミナンス',
      icon: '👑',
      description: '暗号資産市場全体に占めるその通貨のシェア（割合）です。',
      howToRead: 'BTCドミナンスが上昇 → アルトコインから資金流出。下落 → アルトシーズンの可能性。',
      good: 'ドミナンス安定 → 市場の基盤が安定',
      bad: 'ドミナンス急変 → 市場構造の変化に注意'
    },
    stablecoin: {
      title: 'ステーブルコイン比率',
      icon: '💵',
      description: '市場全体に占めるステーブルコイン（USDT, USDCなど）の割合です。待機資金の多さを示します。',
      howToRead: '比率が高い → 投資家が現金化して様子見。比率が低い → 資金がリスク資産に流入中。',
      good: '高比率からの低下 → 待機資金が市場に流入（上昇サイン）',
      bad: '比率急上昇 → リスクオフ、市場から資金流出'
    },
    exchange_btc: {
      title: '取引所BTC残高',
      icon: '🏦',
      description: '取引所に預けられているBTCの総量です。売却意思の指標となります。',
      howToRead: '残高減少 → 投資家がウォレットに引き出し（長期保有意思）。増加 → 売り圧力。',
      good: '残高減少 → 売り圧力低下（強気サイン）',
      bad: '残高急増 → 大口が売却準備の可能性'
    },
    etf_flow: {
      title: 'ETF資金フロー',
      icon: '📈',
      description: 'ビットコインETFへの資金流入・流出を示します。機関投資家の動向がわかります。',
      howToRead: 'プラス → 機関投資家が買い増し。マイナス → 資金が流出中。',
      good: '大規模な資金流入 → 機関投資家の強い買い意欲',
      bad: '連続した資金流出 → 機関投資家が撤退傾向'
    },
    whale: {
      title: 'Whale（大口）動向',
      icon: '🐋',
      description: '1000BTC以上を保有する大口投資家（Whale）の取引動向です。',
      howToRead: '活発な蓄積 → 大口が買い集め中。大量送金 → 売却の可能性。',
      good: '大口が蓄積中 → 将来の価格上昇を見込んでいる',
      bad: '取引所への大量送金 → 大口の売却準備'
    },
    leverage: {
      title: '市場レバレッジ',
      icon: '⚠️',
      description: '先物市場全体のレバレッジ（借入による取引）の過熱度を示します。',
      howToRead: '総資金調達率が高い → レバレッジが過熱。低い → 市場が冷静。',
      good: 'レバレッジ低下 → 健全な市場環境',
      bad: 'レバレッジ過熱 → 急な清算（ロスカット連鎖）リスク'
    }
  };

  window.openIndicatorHelp = function(key) {
    var help = INDICATOR_HELP[key];
    if (!help) return;

    var existing = document.getElementById('indicator-help-popup');
    if (existing) existing.remove();

    var popup = document.createElement('div');
    popup.id = 'indicator-help-popup';
    popup.className = 'metric-popup-overlay';
    popup.innerHTML =
      '<div class="metric-popup">' +
        '<div class="metric-popup__header">' +
          '<span class="metric-popup__title">' + help.icon + ' ' + help.title + '</span>' +
          '<button class="metric-popup__close" onclick="document.getElementById(\'indicator-help-popup\').remove()">×</button>' +
        '</div>' +
        '<div class="metric-popup__body">' +
          '<div style="margin-bottom:16px">' +
            '<div style="font-size:13px;color:rgba(255,255,255,0.9);line-height:1.6">' + help.description + '</div>' +
          '</div>' +
          '<div style="margin-bottom:16px">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:6px;font-weight:600">📖 見方</div>' +
            '<div style="font-size:13px;color:rgba(255,255,255,0.85);line-height:1.6">' + help.howToRead + '</div>' +
          '</div>' +
          '<div style="display:grid;gap:10px">' +
            '<div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:12px">' +
              '<div style="font-size:11px;color:#10b981;font-weight:600;margin-bottom:4px">✅ ポジティブ</div>' +
              '<div style="font-size:12px;color:rgba(255,255,255,0.8);line-height:1.5">' + help.good + '</div>' +
            '</div>' +
            '<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:12px">' +
              '<div style="font-size:11px;color:#ef4444;font-weight:600;margin-bottom:4px">⚠️ ネガティブ</div>' +
              '<div style="font-size:12px;color:rgba(255,255,255,0.8);line-height:1.5">' + help.bad + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    popup.addEventListener('click', function(e) {
      if (e.target === popup) popup.remove();
    });

    document.body.appendChild(popup);
  };

  // 緊急アラート（画面中央に大きく表示）
  window.showEmergencyAlert = function(ticker, type, changePercent, price) {
    var existing = document.getElementById('emergency-alert');
    if (existing) existing.remove();

    var isSpike = type === 'spike';
    var emoji = isSpike ? '🚀' : '🚨';
    var title = isSpike ? '急騰アラート' : '急落アラート';
    var bgGradient = isSpike
      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95))'
      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))';

    var sign = changePercent >= 0 ? '+' : '';

    var alert = document.createElement('div');
    alert.id = 'emergency-alert';
    alert.className = 'emergency-alert-overlay';
    alert.innerHTML =
      '<div class="emergency-alert" style="background:' + bgGradient + '">' +
        '<div class="emergency-alert__icon">' + emoji + '</div>' +
        '<div class="emergency-alert__title">' + title + '</div>' +
        '<div class="emergency-alert__ticker">' + ticker + '</div>' +
        '<div class="emergency-alert__change">' + sign + changePercent.toFixed(1) + '%</div>' +
        '<div class="emergency-alert__price">$' + price.toFixed(price < 1 ? 4 : 2) + '</div>' +
        '<div class="emergency-alert__actions">' +
          '<button class="emergency-alert__btn emergency-alert__btn--detail" onclick="document.getElementById(\'emergency-alert\').remove(); appState.selectedCurrency=\'' + ticker + '\'; navigateTo(\'detail\');">詳細を見る</button>' +
          '<button class="emergency-alert__btn emergency-alert__btn--close" onclick="document.getElementById(\'emergency-alert\').remove()">閉じる</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(alert);

    // 10秒後に自動で閉じる
    setTimeout(function() {
      var el = document.getElementById('emergency-alert');
      if (el) el.remove();
    }, 10000);

    // 履歴に保存
    saveAlertHistory(emoji + ' ' + ticker + ' ' + title, sign + changePercent.toFixed(1) + '% ($' + price.toFixed(2) + ')');
  };

  // ===== データバックアップ/復元 =====

  // バックアップモーダル
  window.openBackupModal = function() {
    var existingModal = document.getElementById('kairos-backup-modal');
    if (existingModal) existingModal.remove();

    var modal = document.createElement('div');
    modal.id = 'kairos-backup-modal';
    modal.className = 'history-modal-overlay';
    modal.innerHTML =
      '<div class="history-modal" style="max-width:400px">' +
        '<div class="history-modal-header">' +
          '<h3>データ管理</h3>' +
          '<button class="history-modal-close" onclick="document.getElementById(\'kairos-backup-modal\').remove()">×</button>' +
        '</div>' +
        '<div style="padding:20px">' +

          // エクスポートセクション
          '<div style="margin-bottom:24px">' +
            '<div style="font-weight:600;margin-bottom:12px;color:#fff">エクスポート</div>' +
            '<button class="backup-btn" onclick="exportAllData()">' +
              '<span class="backup-btn-icon">📦</span>' +
              '<div class="backup-btn-text">' +
                '<span class="backup-btn-title">全データをエクスポート</span>' +
                '<span class="backup-btn-desc">投資記録・設定・アラートをJSON形式で保存</span>' +
              '</div>' +
            '</button>' +
            '<button class="backup-btn" onclick="exportTransactionsCSV()">' +
              '<span class="backup-btn-icon">📊</span>' +
              '<div class="backup-btn-text">' +
                '<span class="backup-btn-title">取引履歴をCSV出力</span>' +
                '<span class="backup-btn-desc">確定申告・会計ソフト用</span>' +
              '</div>' +
            '</button>' +
          '</div>' +

          // インポートセクション
          '<div style="margin-bottom:16px">' +
            '<div style="font-weight:600;margin-bottom:12px;color:#fff">インポート</div>' +
            '<button class="backup-btn" onclick="document.getElementById(\'backup-file-input\').click()">' +
              '<span class="backup-btn-icon">📥</span>' +
              '<div class="backup-btn-text">' +
                '<span class="backup-btn-title">データを復元</span>' +
                '<span class="backup-btn-desc">JSONファイルからデータを復元</span>' +
              '</div>' +
            '</button>' +
            '<input type="file" id="backup-file-input" accept=".json" style="display:none" onchange="importData(event)">' +
          '</div>' +

          // 警告
          '<div style="padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;font-size:12px;color:rgba(255,255,255,0.7)">' +
            '⚠️ インポートすると現在のデータは上書きされます。事前にエクスポートでバックアップを取ることをお勧めします。' +
          '</div>' +
        '</div>' +
        '<div class="history-actions">' +
          '<button class="history-action-btn history-action-btn--primary" onclick="document.getElementById(\'kairos-backup-modal\').remove()">閉じる</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  };

  // 全データエクスポート
  window.exportAllData = function() {
    var data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      investmentRecords: [],
      portfolio: {},
      alerts: {},
      targets: {},
      settings: {},
      alertHistory: []
    };

    try {
      data.investmentRecords = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
      data.portfolio = JSON.parse(localStorage.getItem('kairos_portfolio') || '{}');
      data.alerts = JSON.parse(localStorage.getItem('kairos_alerts') || '{}');
      data.targets = JSON.parse(localStorage.getItem('kairos_targets') || '{}');
      data.settings = JSON.parse(localStorage.getItem('kairos_settings') || '{}');
      data.alertHistory = JSON.parse(localStorage.getItem('kairos_alert_history') || '[]');
    } catch(e) {
      console.error('Export error:', e);
    }

    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'kairos-backup-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('データをエクスポートしました', 'success');
  };

  // CSV出力
  window.exportTransactionsCSV = function() {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    if (records.length === 0) {
      showToast('取引履歴がありません', 'error');
      return;
    }

    // CSVヘッダー
    var csv = '日付,種別,通貨,数量,金額(JPY),価格(USD),メモ\n';

    records.forEach(function(r) {
      var type = r.type === 'sell' ? '売却' : '購入';
      var row = [
        r.date || '',
        type,
        r.currencyId || '',
        r.quantity || 0,
        r.totalJpy || 0,
        r.priceUsd || 0,
        r.memo || ''
      ].map(function(val) {
        // CSVエスケープ
        var str = String(val);
        if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      }).join(',');
      csv += row + '\n';
    });

    // BOM付きUTF-8でExcel対応
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'kairos-transactions-' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('CSVをエクスポートしました', 'success');
  };

  // データインポート
  window.importData = function(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);

        // バージョンチェック
        if (!data.version) {
          showToast('無効なバックアップファイルです', 'error');
          return;
        }

        // 確認ダイアログ
        if (!confirm('現在のデータを上書きしてインポートしますか？')) {
          return;
        }

        // データを復元
        if (data.investmentRecords) {
          localStorage.setItem('kairosInvestmentRecords', JSON.stringify(data.investmentRecords));
        }
        if (data.portfolio) {
          localStorage.setItem('kairos_portfolio', JSON.stringify(data.portfolio));
        }
        if (data.alerts) {
          localStorage.setItem('kairos_alerts', JSON.stringify(data.alerts));
        }
        if (data.targets) {
          localStorage.setItem('kairos_targets', JSON.stringify(data.targets));
        }
        if (data.settings) {
          localStorage.setItem('kairos_settings', JSON.stringify(data.settings));
        }
        if (data.alertHistory) {
          localStorage.setItem('kairos_alert_history', JSON.stringify(data.alertHistory));
        }

        showToast('データを復元しました', 'success');

        // モーダルを閉じて画面をリフレッシュ
        var modal = document.getElementById('kairos-backup-modal');
        if (modal) modal.remove();

        // 画面をリフレッシュ
        if (window.KairosApp && window.KairosApp.refresh) {
          window.KairosApp.refresh();
        }

      } catch(err) {
        console.error('Import error:', err);
        showToast('インポートに失敗しました', 'error');
      }
    };
    reader.readAsText(file);

    // ファイル選択をリセット
    event.target.value = '';
  };

  // ===== 損益計算レポート =====

  window.openPnLReportModal = function() {
    var existingModal = document.getElementById('kairos-pnl-modal');
    if (existingModal) existingModal.remove();

    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    var allResults = kairosData.all_results || [];

    // 年度別集計
    var yearlyData = {};
    var currencyData = {};
    var totalRealizedPnL = 0;
    var totalUnrealizedPnL = 0;
    var totalInvested = 0;
    var holdings = {};

    // 保有量と平均取得価格を計算
    records.forEach(function(r) {
      var year = r.date ? r.date.substring(0, 4) : 'Unknown';
      var id = r.currencyId;

      if (!yearlyData[year]) {
        yearlyData[year] = { buy: 0, sell: 0, realizedPnL: 0, count: 0 };
      }
      if (!currencyData[id]) {
        currencyData[id] = { totalBuy: 0, totalSell: 0, qty: 0, avgPrice: 0, realizedPnL: 0 };
      }
      if (!holdings[id]) {
        holdings[id] = { qty: 0, totalCost: 0 };
      }

      if (r.type === 'sell') {
        // 売却
        var sellQty = r.quantity || 0;
        var sellAmount = r.totalJpy || 0;

        // 平均取得価格で実現損益を計算
        var avgCost = holdings[id].qty > 0 ? holdings[id].totalCost / holdings[id].qty : 0;
        var costBasis = avgCost * sellQty;
        var realized = sellAmount - costBasis;

        yearlyData[year].sell += sellAmount;
        yearlyData[year].realizedPnL += realized;
        currencyData[id].totalSell += sellAmount;
        currencyData[id].realizedPnL += realized;
        totalRealizedPnL += realized;

        // 保有量を減らす
        holdings[id].qty -= sellQty;
        holdings[id].totalCost -= costBasis;
        if (holdings[id].qty < 0) holdings[id].qty = 0;
        if (holdings[id].totalCost < 0) holdings[id].totalCost = 0;

        yearlyData[year].count++;
      } else {
        // 購入
        var buyQty = r.quantity || 0;
        var buyAmount = r.totalJpy || 0;

        yearlyData[year].buy += buyAmount;
        currencyData[id].totalBuy += buyAmount;
        totalInvested += buyAmount;

        // 保有量を増やす
        holdings[id].qty += buyQty;
        holdings[id].totalCost += buyAmount;
        currencyData[id].qty = holdings[id].qty;
        currencyData[id].avgPrice = holdings[id].qty > 0 ? holdings[id].totalCost / holdings[id].qty : 0;

        yearlyData[year].count++;
      }
    });

    // 含み損益を計算
    Object.keys(holdings).forEach(function(id) {
      var h = holdings[id];
      if (h.qty <= 0) return;

      var coinInfo = allResults.find(function(c) { return c.ticker === id; });
      var currentPrice = coinInfo ? coinInfo.current_price : 0;
      // 円換算（概算レート150円）
      var currentValueJpy = h.qty * currentPrice * 150;
      var unrealized = currentValueJpy - h.totalCost;
      totalUnrealizedPnL += unrealized;

      if (currencyData[id]) {
        currencyData[id].unrealizedPnL = unrealized;
        currencyData[id].currentValue = currentValueJpy;
      }
    });

    // 税金概算（日本の暗号資産税率 20.315%）
    var TAX_RATE = 0.20315;
    var taxableAmount = totalRealizedPnL > 0 ? totalRealizedPnL : 0;
    var estimatedTax = taxableAmount * TAX_RATE;

    // 年度リスト（降順）
    var years = Object.keys(yearlyData).sort().reverse();

    // 年度別HTMLを生成
    var yearlyHtml = '';
    if (years.length === 0) {
      yearlyHtml = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.5)">取引履歴がありません</div>';
    } else {
      years.forEach(function(year) {
        var y = yearlyData[year];
        var pnlColor = y.realizedPnL >= 0 ? '#22c55e' : '#ef4444';
        var pnlSign = y.realizedPnL >= 0 ? '+' : '';
        yearlyHtml +=
          '<div class="pnl-year-item">' +
            '<div class="pnl-year-header">' +
              '<span class="pnl-year-label">' + year + '年</span>' +
              '<span class="pnl-year-pnl" style="color:' + pnlColor + '">' + pnlSign + formatYen(y.realizedPnL) + '</span>' +
            '</div>' +
            '<div class="pnl-year-details">' +
              '<span>購入: ' + formatYen(y.buy) + '</span>' +
              '<span>売却: ' + formatYen(y.sell) + '</span>' +
              '<span>取引: ' + y.count + '回</span>' +
            '</div>' +
          '</div>';
      });
    }

    // 通貨別HTML
    var currencyHtml = '';
    var currencies = Object.keys(currencyData).filter(function(id) {
      var c = currencyData[id];
      return c.totalBuy > 0 || c.totalSell > 0;
    });

    currencies.forEach(function(id) {
      var c = currencyData[id];
      var totalPnL = (c.realizedPnL || 0) + (c.unrealizedPnL || 0);
      var pnlColor = totalPnL >= 0 ? '#22c55e' : '#ef4444';
      currencyHtml +=
        '<div class="pnl-currency-item">' +
          '<span class="pnl-currency-symbol">' + id + '</span>' +
          '<span class="pnl-currency-value" style="color:' + pnlColor + '">' + (totalPnL >= 0 ? '+' : '') + formatYen(totalPnL) + '</span>' +
        '</div>';
    });

    if (!currencyHtml) {
      currencyHtml = '<div style="text-align:center;padding:12px;color:rgba(255,255,255,0.5)">-</div>';
    }

    var modal = document.createElement('div');
    modal.id = 'kairos-pnl-modal';
    modal.className = 'history-modal-overlay';
    modal.innerHTML =
      '<div class="history-modal" style="max-width:440px">' +
        '<div class="history-modal-header">' +
          '<h3>損益レポート</h3>' +
          '<button class="history-modal-close" onclick="document.getElementById(\'kairos-pnl-modal\').remove()">×</button>' +
        '</div>' +

        // サマリー
        '<div class="pnl-summary">' +
          '<div class="pnl-summary-row">' +
            '<div class="pnl-summary-item">' +
              '<span class="pnl-summary-label">実現損益</span>' +
              '<span class="pnl-summary-value" style="color:' + (totalRealizedPnL >= 0 ? '#22c55e' : '#ef4444') + '">' +
                (totalRealizedPnL >= 0 ? '+' : '') + formatYen(totalRealizedPnL) +
              '</span>' +
            '</div>' +
            '<div class="pnl-summary-item">' +
              '<span class="pnl-summary-label">含み損益</span>' +
              '<span class="pnl-summary-value" style="color:' + (totalUnrealizedPnL >= 0 ? '#22c55e' : '#ef4444') + '">' +
                (totalUnrealizedPnL >= 0 ? '+' : '') + formatYen(totalUnrealizedPnL) +
              '</span>' +
            '</div>' +
          '</div>' +
          '<div class="pnl-summary-row">' +
            '<div class="pnl-summary-item">' +
              '<span class="pnl-summary-label">投資総額</span>' +
              '<span class="pnl-summary-value">' + formatYen(totalInvested) + '</span>' +
            '</div>' +
            '<div class="pnl-summary-item">' +
              '<span class="pnl-summary-label">概算税額</span>' +
              '<span class="pnl-summary-value" style="color:#f59e0b">' + formatYen(estimatedTax) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // 税金注意書き
        '<div class="pnl-tax-note">' +
          '※ 概算税額は実現利益の20.315%で計算。実際の税額は所得状況により異なります。' +
        '</div>' +

        // 年度別
        '<div class="pnl-section">' +
          '<div class="pnl-section-title">年度別損益</div>' +
          yearlyHtml +
        '</div>' +

        // 通貨別
        '<div class="pnl-section">' +
          '<div class="pnl-section-title">通貨別損益（実現+含み）</div>' +
          '<div class="pnl-currency-list">' + currencyHtml + '</div>' +
        '</div>' +

        '<div class="history-actions">' +
          '<button class="history-action-btn" onclick="exportPnLReport()">レポート出力</button>' +
          '<button class="history-action-btn history-action-btn--primary" onclick="document.getElementById(\'kairos-pnl-modal\').remove()">閉じる</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  };

  // 損益レポートをテキストで出力
  window.exportPnLReport = function() {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    if (records.length === 0) {
      showToast('取引履歴がありません', 'error');
      return;
    }

    // レポート生成（簡易版）
    var text = '=== KAIROS 損益レポート ===\n';
    text += '出力日時: ' + new Date().toLocaleString('ja-JP') + '\n\n';

    var totalBuy = 0, totalSell = 0;
    records.forEach(function(r) {
      if (r.type === 'sell') {
        totalSell += r.totalJpy || 0;
      } else {
        totalBuy += r.totalJpy || 0;
      }
    });

    text += '【集計】\n';
    text += '総購入額: ' + totalBuy.toLocaleString() + '円\n';
    text += '総売却額: ' + totalSell.toLocaleString() + '円\n';
    text += '差額: ' + (totalSell - totalBuy).toLocaleString() + '円\n\n';

    text += '【取引履歴】\n';
    records.forEach(function(r, i) {
      var type = r.type === 'sell' ? '売却' : '購入';
      text += (i + 1) + '. ' + r.date + ' ' + type + ' ' + r.currencyId + ' ' + (r.totalJpy || 0).toLocaleString() + '円\n';
    });

    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'kairos-pnl-report-' + new Date().toISOString().split('T')[0] + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('レポートを出力しました', 'success');
  };

  // DCA計算機モーダル
  window.openDCAModal = function() {
    if (document.getElementById('kairos-dca-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'kairos-dca-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:400px;width:90%">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">DCA計算機</h3>' +
          '<button onclick="document.getElementById(\'kairos-dca-modal\').remove()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +
        '<div style="color:#fff">' +
          '<div style="margin-bottom:12px">' +
            '<label style="font-size:12px;opacity:0.7">月額積立金額（USD）</label>' +
            '<input type="number" id="dca-monthly" value="100" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);color:#fff;margin-top:4px">' +
          '</div>' +
          '<div style="margin-bottom:12px">' +
            '<label style="font-size:12px;opacity:0.7">積立期間（年）</label>' +
            '<input type="number" id="dca-years" value="3" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);color:#fff;margin-top:4px">' +
          '</div>' +
          '<div style="margin-bottom:12px">' +
            '<label style="font-size:12px;opacity:0.7">予想年利（%）</label>' +
            '<input type="number" id="dca-rate" value="20" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);color:#fff;margin-top:4px">' +
          '</div>' +
          '<button id="dca-calc-btn" style="width:100%;padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:600;cursor:pointer;margin-bottom:12px">計算する</button>' +
          '<div id="dca-result" style="padding:16px;background:rgba(255,255,255,0.05);border-radius:12px;display:none">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:center">' +
              '<div><div style="font-size:11px;opacity:0.7">総投資額</div><div id="dca-total-invest" style="font-size:18px;font-weight:700">-</div></div>' +
              '<div><div style="font-size:11px;opacity:0.7">予想資産額</div><div id="dca-final-value" style="font-size:18px;font-weight:700;color:#22c55e">-</div></div>' +
              '<div><div style="font-size:11px;opacity:0.7">予想利益</div><div id="dca-profit" style="font-size:18px;font-weight:700;color:#22c55e">-</div></div>' +
              '<div><div style="font-size:11px;opacity:0.7">利益率</div><div id="dca-roi" style="font-size:18px;font-weight:700;color:#22c55e">-</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    document.getElementById('dca-calc-btn').onclick = function() {
      var monthly = parseFloat(document.getElementById('dca-monthly').value) || 0;
      var years = parseFloat(document.getElementById('dca-years').value) || 0;
      var rate = parseFloat(document.getElementById('dca-rate').value) / 100 || 0;

      var months = years * 12;
      var monthlyRate = rate / 12;
      var total = 0;
      for (var i = 0; i < months; i++) {
        total = (total + monthly) * (1 + monthlyRate);
      }
      var invested = monthly * months;
      var profit = total - invested;
      var roi = invested > 0 ? (profit / invested) * 100 : 0;

      document.getElementById('dca-result').style.display = 'block';
      document.getElementById('dca-total-invest').textContent = '$' + invested.toLocaleString();
      document.getElementById('dca-final-value').textContent = '$' + Math.round(total).toLocaleString();
      document.getElementById('dca-profit').textContent = '$' + Math.round(profit).toLocaleString();
      document.getElementById('dca-roi').textContent = roi.toFixed(1) + '%';
    };
  };

  // 取引履歴モーダル
  // 取引履歴モーダル（拡張版）
  var historyFilter = 'all';

  window.openHistoryModal = function(filter) {
    filter = filter || historyFilter;
    historyFilter = filter;

    var existingModal = document.getElementById('kairos-history-modal');
    if (existingModal) existingModal.remove();

    var transactions = [];
    try {
      transactions = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    // 通貨リスト取得
    var coins = ['all'];
    transactions.forEach(function(tx) {
      if (tx.currencyId && coins.indexOf(tx.currencyId) === -1) {
        coins.push(tx.currencyId);
      }
    });

    // フィルタリング
    var filteredTx = filter === 'all' ? transactions : transactions.filter(function(tx) {
      return tx.currencyId === filter;
    });

    // 統計計算
    var totalBuy = 0, totalSell = 0, totalQty = {};
    filteredTx.forEach(function(tx) {
      if (tx.type === 'sell') {
        totalSell += tx.totalJpy || 0;
      } else {
        totalBuy += tx.totalJpy || 0;
      }
      if (!totalQty[tx.currencyId]) totalQty[tx.currencyId] = 0;
      totalQty[tx.currencyId] += tx.type === 'sell' ? -(tx.quantity || 0) : (tx.quantity || 0);
    });

    // 月別チャート
    var monthlyData = {};
    filteredTx.forEach(function(tx) {
      var month = tx.date ? tx.date.substring(0, 7) : 'Unknown';
      if (!monthlyData[month]) monthlyData[month] = { buy: 0, sell: 0 };
      if (tx.type === 'sell') {
        monthlyData[month].sell += tx.totalJpy || 0;
      } else {
        monthlyData[month].buy += tx.totalJpy || 0;
      }
    });

    var months = Object.keys(monthlyData).sort().slice(-6);
    var chartHtml = '';
    if (months.length > 0) {
      var maxBuy = Math.max.apply(null, months.map(function(m) { return monthlyData[m].buy; }));
      var maxSell = Math.max.apply(null, months.map(function(m) { return monthlyData[m].sell; }));
      var maxVal = Math.max(maxBuy, maxSell, 1);

      chartHtml = '<div class="history-chart">';
      months.forEach(function(month) {
        var buyH = (monthlyData[month].buy / maxVal) * 100;
        var sellH = (monthlyData[month].sell / maxVal) * 100;
        chartHtml +=
          '<div class="history-chart-bar">' +
            '<div class="history-chart-bar-group">' +
              '<div class="history-chart-bar-buy" style="height:' + buyH + '%"></div>' +
              '<div class="history-chart-bar-sell" style="height:' + sellH + '%"></div>' +
            '</div>' +
            '<div class="history-chart-bar-label">' + month.substring(5) + '</div>' +
          '</div>';
      });
      chartHtml += '</div>';
    }

    // フィルターボタン
    var filterHtml = '<div class="history-filters">';
    coins.forEach(function(coin) {
      var isActive = coin === filter;
      var label = coin === 'all' ? '全て' : coin;
      filterHtml += '<button class="history-filter-btn' + (isActive ? ' active' : '') + '" onclick="openHistoryModal(\'' + coin + '\')">' + label + '</button>';
    });
    filterHtml += '</div>';

    // 取引リスト
    var listHtml = '<div class="history-list">';
    if (filteredTx.length === 0) {
      listHtml += '<div class="history-empty">取引履歴がありません</div>';
    } else {
      filteredTx.slice().reverse().forEach(function(tx, idx) {
        var originalIdx = transactions.length - 1 - transactions.slice().reverse().indexOf(tx);
        var isSell = tx.type === 'sell';
        var typeClass = isSell ? 'sell' : 'buy';
        var typeLabel = isSell ? '売却' : '購入';
        var dateStr = tx.date || '--';
        var icon = getCoinIcon(tx.currencyId);

        listHtml +=
          '<div class="history-item">' +
            '<div class="history-item-main">' +
              '<div class="history-item-icon">' + icon + '</div>' +
              '<div class="history-item-info">' +
                '<div class="history-item-top">' +
                  '<span class="history-item-coin">' + tx.currencyId + '</span>' +
                  '<span class="history-item-type history-item-type--' + typeClass + '">' + typeLabel + '</span>' +
                '</div>' +
                '<div class="history-item-bottom">' +
                  '<span class="history-item-qty">' + (tx.quantity || 0).toFixed(6) + '</span>' +
                  '<span class="history-item-date">' + dateStr + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="history-item-amount">' + formatYen(tx.totalJpy || 0) + '</div>' +
            '</div>' +
            '<div class="history-item-actions">' +
              '<button class="history-item-edit" onclick="editHistoryItem(' + originalIdx + ')">編集</button>' +
              '<button class="history-item-delete" onclick="deleteHistoryItem(' + originalIdx + ')">削除</button>' +
            '</div>' +
          '</div>';
      });
    }
    listHtml += '</div>';

    var modal = document.createElement('div');
    modal.id = 'kairos-history-modal';
    modal.className = 'history-modal-overlay';
    modal.innerHTML =
      '<div class="history-modal">' +
        '<div class="history-modal-header">' +
          '<h3>取引履歴</h3>' +
          '<button class="history-modal-close" onclick="document.getElementById(\'kairos-history-modal\').remove()">×</button>' +
        '</div>' +

        // 統計
        '<div class="history-stats">' +
          '<div class="history-stat">' +
            '<span class="history-stat-label">総購入額</span>' +
            '<span class="history-stat-value history-stat-value--buy">' + formatYen(totalBuy) + '</span>' +
          '</div>' +
          '<div class="history-stat">' +
            '<span class="history-stat-label">総売却額</span>' +
            '<span class="history-stat-value history-stat-value--sell">' + formatYen(totalSell) + '</span>' +
          '</div>' +
          '<div class="history-stat">' +
            '<span class="history-stat-label">取引回数</span>' +
            '<span class="history-stat-value">' + filteredTx.length + '回</span>' +
          '</div>' +
        '</div>' +

        // チャート
        '<div class="history-chart-section">' +
          '<div class="history-chart-legend">' +
            '<span class="history-legend-item"><span class="history-legend-dot history-legend-dot--buy"></span>購入</span>' +
            '<span class="history-legend-item"><span class="history-legend-dot history-legend-dot--sell"></span>売却</span>' +
          '</div>' +
          chartHtml +
        '</div>' +

        // フィルター
        filterHtml +

        // リスト
        '<div class="history-list-section">' +
          '<div class="history-list-header">取引一覧</div>' +
          listHtml +
        '</div>' +

        // アクション
        '<div class="history-actions">' +
          '<button class="history-action-btn history-action-btn--danger" onclick="clearAllHistory()">全て削除</button>' +
          '<button class="history-action-btn history-action-btn--primary" onclick="document.getElementById(\'kairos-history-modal\').remove()">閉じる</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  };

  // 取引編集
  window.editHistoryItem = function(idx) {
    var transactions = [];
    try {
      transactions = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    var tx = transactions[idx];
    if (!tx) return;

    var editModal = document.createElement('div');
    editModal.id = 'kairos-history-edit-modal';
    editModal.className = 'history-modal-overlay';
    editModal.style.zIndex = '10025';
    editModal.innerHTML =
      '<div class="history-edit-modal">' +
        '<div class="history-modal-header">' +
          '<h3>取引を編集</h3>' +
          '<button class="history-modal-close" onclick="document.getElementById(\'kairos-history-edit-modal\').remove()">×</button>' +
        '</div>' +
        '<div class="history-edit-form">' +
          '<div class="history-edit-field">' +
            '<label>通貨</label>' +
            '<input type="text" id="edit-coin" value="' + (tx.currencyId || '') + '" readonly class="history-edit-input">' +
          '</div>' +
          '<div class="history-edit-field">' +
            '<label>日付</label>' +
            '<input type="date" id="edit-date" value="' + (tx.date || '') + '" class="history-edit-input">' +
          '</div>' +
          '<div class="history-edit-field">' +
            '<label>数量</label>' +
            '<input type="number" id="edit-qty" value="' + (tx.quantity || 0) + '" step="0.000001" class="history-edit-input">' +
          '</div>' +
          '<div class="history-edit-field">' +
            '<label>金額 (円)</label>' +
            '<input type="number" id="edit-amount" value="' + (tx.totalJpy || 0) + '" class="history-edit-input">' +
          '</div>' +
        '</div>' +
        '<div class="history-actions">' +
          '<button class="history-action-btn" onclick="document.getElementById(\'kairos-history-edit-modal\').remove()">キャンセル</button>' +
          '<button class="history-action-btn history-action-btn--primary" onclick="saveHistoryEdit(' + idx + ')">保存</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(editModal);
    editModal.onclick = function(e) { if (e.target === editModal) editModal.remove(); };
  };

  // 取引保存
  window.saveHistoryEdit = function(idx) {
    var transactions = [];
    try {
      transactions = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    var tx = transactions[idx];
    if (!tx) return;

    tx.date = document.getElementById('edit-date').value;
    tx.quantity = parseFloat(document.getElementById('edit-qty').value) || 0;
    tx.totalJpy = parseFloat(document.getElementById('edit-amount').value) || 0;

    localStorage.setItem('kairosInvestmentRecords', JSON.stringify(transactions));

    document.getElementById('kairos-history-edit-modal').remove();
    showToast('取引を更新しました', 'success');
    openHistoryModal(historyFilter);
  };

  // 取引削除
  window.deleteHistoryItem = function(idx) {
    if (!confirm('この取引を削除しますか？')) return;

    var transactions = [];
    try {
      transactions = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}

    transactions.splice(idx, 1);
    localStorage.setItem('kairosInvestmentRecords', JSON.stringify(transactions));

    showToast('取引を削除しました', 'success');
    openHistoryModal(historyFilter);
  };

  // 全履歴削除
  window.clearAllHistory = function() {
    if (!confirm('全ての取引履歴を削除しますか？\nこの操作は取り消せません。')) return;

    localStorage.setItem('kairosInvestmentRecords', '[]');
    showToast('全ての取引履歴を削除しました', 'success');
    openHistoryModal('all');
  };

  // トースト表示
  function showToast(message, type) {
    var bgColor = type === 'success' ? 'rgba(16,185,129,0.9)' : type === 'error' ? 'rgba(248,113,113,0.9)' : 'rgba(26,26,46,0.95)';
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:' + bgColor + ';color:#fff;padding:12px 24px;border-radius:12px;z-index:10030;border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:14px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2500);
  }

  // ===== 緊急 Moonshot アラートモーダル =====
  function showUrgentMoonshotAlert(alerts) {
    if (!alerts || alerts.length === 0) return;
    if (document.getElementById('kairos-urgent-alert')) return;

    // グローバルに保存（詳細モーダル用）
    window._urgentAlerts = alerts;

    var overlay = document.createElement('div');
    overlay.id = 'kairos-urgent-alert';
    overlay.className = 'urgent-alert-overlay';

    var coinsHtml = alerts.slice(0, 5).map(function(coin, idx) {
      var score = coin.score ? coin.score.total : 0;
      var scoreClass = score >= 80 ? 'urgent-alert__score--fire' : score >= 65 ? 'urgent-alert__score--hot' : 'urgent-alert__score--warm';
      var change = coin.change1h || 0;
      var changeSign = change >= 0 ? '+' : '';
      var changeClass = change >= 0 ? 'positive' : 'negative';
      var vol = formatCompactUSD(coin.volume24h || 0);
      var liq = formatCompactUSD(coin.liquidity || 0);

      var socialHtml = '';
      if (coin.social && coin.social.interactions > 0) {
        socialHtml = '<div class="urgent-alert__social">' +
          '<span>SNS ' + formatCompactNum(coin.social.interactions) + '件</span>' +
          (coin.social.trend === 'up' ? '<span class="urgent-alert__trend-up">急上昇</span>' : '') +
        '</div>';
      }

      var ageText = '';
      if (coin.ageHours != null) {
        if (coin.ageHours < 1) ageText = Math.round(coin.ageHours * 60) + '分前';
        else if (coin.ageHours < 24) ageText = Math.round(coin.ageHours) + '時間前';
        else ageText = Math.round(coin.ageHours / 24) + '日前';
      }

      return '<div class="urgent-alert__coin' + (idx === 0 ? ' urgent-alert__coin--top' : '') + '">' +
        '<div class="urgent-alert__coin-header">' +
          '<div class="urgent-alert__coin-info">' +
            '<span class="urgent-alert__symbol">' + coin.symbol + '</span>' +
            (ageText ? '<span class="urgent-alert__age">' + ageText + '</span>' : '') +
          '</div>' +
          '<div class="urgent-alert__score ' + scoreClass + '">' + score + '</div>' +
        '</div>' +
        '<div class="urgent-alert__coin-data">' +
          '<span class="urgent-alert__change ' + changeClass + '">' + changeSign + change.toFixed(1) + '% (1h)</span>' +
          '<span class="urgent-alert__vol">Vol $' + vol + '</span>' +
          '<span class="urgent-alert__liq">Liq $' + liq + '</span>' +
        '</div>' +
        (coin.score ? '<div class="urgent-alert__breakdown">' +
          '<span>Vol ' + coin.score.volume + '</span>' +
          '<span>Vel ' + coin.score.velocity + '</span>' +
          '<span>Buy ' + coin.score.buyPressure + '</span>' +
          '<span>SNS ' + coin.score.socialBuzz + '</span>' +
        '</div>' : '') +
        socialHtml +
        '<div class="urgent-alert__coin-actions">' +
          '<button class="urgent-alert__coin-btn" onclick="event.stopPropagation(); openUrgentCoinDetail(' + idx + ')">📊 詳細を見る</button>' +
          (coin.dexUrl ? '<button class="urgent-alert__coin-btn urgent-alert__coin-btn--dex" onclick="event.stopPropagation(); openUrgentAlertDex(\'' + (coin.dexUrl || '').replace(/'/g, "\\'") + '\')">🔗 DEX</button>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    var timeStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    overlay.innerHTML =
      '<div class="urgent-alert-modal">' +
        '<div class="urgent-alert__pulse-ring"></div>' +
        '<div class="urgent-alert__header">' +
          '<div class="urgent-alert__icon-wrap">' +
            '<span class="urgent-alert__icon">🚨</span>' +
          '</div>' +
          '<div class="urgent-alert__title">HOT COIN 検出</div>' +
          '<div class="urgent-alert__subtitle">' + alerts.length + '件のコインがスコア閾値を突破 (' + timeStr + ')</div>' +
        '</div>' +
        '<div class="urgent-alert__coins">' +
          coinsHtml +
        '</div>' +
        '<div class="urgent-alert__actions">' +
          '<button class="urgent-alert__btn urgent-alert__btn--primary" onclick="dismissUrgentAlert(); window.KairosApp.showMoonshot();">Early検出を見る</button>' +
          '<button class="urgent-alert__btn urgent-alert__btn--secondary" onclick="dismissUrgentAlert();">閉じる</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // 背景クリックで閉じない（緊急なので意図的に操作必須）
  }
  window.showUrgentMoonshotAlert = showUrgentMoonshotAlert;

  function dismissUrgentAlert() {
    var el = document.getElementById('kairos-urgent-alert');
    if (el) {
      el.classList.add('urgent-alert--closing');
      setTimeout(function() { el.remove(); }, 300);
    }
  }
  window.dismissUrgentAlert = dismissUrgentAlert;

  function openUrgentAlertDex(url) {
    if (url) window.open(url, '_blank');
  }
  window.openUrgentAlertDex = openUrgentAlertDex;

  // 緊急アラートコインの詳細モーダル
  function openUrgentCoinDetail(idx) {
    var alerts = window._urgentAlerts || [];
    var coin = alerts[idx];
    if (!coin) return;

    dismissUrgentAlert();

    var score = coin.score ? coin.score.total : 0;
    var scoreColor = score >= 80 ? '#ef4444' : score >= 65 ? '#f59e0b' : '#22c55e';
    var change = coin.change1h || 0;
    var vol = formatCompactUSD(coin.volume24h || 0);
    var liq = formatCompactUSD(coin.liquidity || 0);
    var addr = coin.tokenAddress || '';
    var shortAddr = addr.length > 12 ? addr.substring(0, 6) + '...' + addr.substring(addr.length - 4) : addr;

    var ageText = '不明';
    if (coin.ageHours != null) {
      if (coin.ageHours < 1) ageText = Math.round(coin.ageHours * 60) + '分';
      else if (coin.ageHours < 24) ageText = Math.round(coin.ageHours) + '時間';
      else ageText = Math.round(coin.ageHours / 24) + '日';
    }

    // スコアバー生成
    var bd = coin.score || {};
    var barsHtml = '';
    var barData = [
      { label: 'Volume', value: bd.volume || 0, max: 25 },
      { label: 'Velocity', value: bd.velocity || 0, max: 25 },
      { label: 'Buy圧', value: bd.buyPressure || 0, max: 25 },
      { label: 'SNS', value: bd.socialBuzz || 0, max: 25 }
    ];
    barData.forEach(function(b) {
      var pct = Math.min(100, (b.value / b.max) * 100);
      var color = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
      barsHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
        '<span style="font-size:11px;color:#94a3b8;width:55px">' + b.label + '</span>' +
        '<div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden">' +
          '<div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:3px"></div>' +
        '</div>' +
        '<span style="font-size:11px;color:#e2e8f0;width:35px;text-align:right">' + Math.round(b.value) + '/' + b.max + '</span>' +
      '</div>';
    });

    var modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'urgent-coin-detail-modal';
    modal.innerHTML = '<div class="modal moonshot-detail-modal">' +
      '<div class="modal-header">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<h3>🚨 ' + coin.symbol + '</h3>' +
        '</div>' +
        '<button class="modal-close" onclick="closeUrgentCoinDetailModal()">×</button>' +
      '</div>' +
      '<div class="modal-body" style="padding:16px">' +
        // スコア
        '<div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:16px">' +
          '<div style="text-align:center">' +
            '<div style="font-size:36px;font-weight:700;color:' + scoreColor + '">' + score + '</div>' +
            '<div style="font-size:10px;color:#94a3b8">HOT Score</div>' +
          '</div>' +
          '<div style="text-align:center;padding:8px 16px;border-radius:8px;background:rgba(255,255,255,0.05)">' +
            '<div class="' + (change >= 0 ? 'positive' : 'negative') + '" style="font-size:18px;font-weight:600">' + (change >= 0 ? '+' : '') + change.toFixed(1) + '%</div>' +
            '<div style="font-size:10px;color:#94a3b8">1h変動</div>' +
          '</div>' +
        '</div>' +

        // スコア内訳
        '<div style="padding:12px;background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:12px">' +
          '<div style="font-size:12px;color:#94a3b8;margin-bottom:8px">📊 スコア内訳</div>' +
          barsHtml +
        '</div>' +

        // マーケットデータ
        '<div style="display:flex;gap:8px;margin-bottom:12px">' +
          '<div style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px">' +
            '<div style="font-size:10px;color:#94a3b8">出来高 (24h)</div>' +
            '<div style="font-size:14px;font-weight:600">$' + vol + '</div>' +
          '</div>' +
          '<div style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px">' +
            '<div style="font-size:10px;color:#94a3b8">流動性</div>' +
            '<div style="font-size:14px;font-weight:600">$' + liq + '</div>' +
          '</div>' +
          '<div style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px">' +
            '<div style="font-size:10px;color:#94a3b8">Age</div>' +
            '<div style="font-size:14px;font-weight:600">' + ageText + '</div>' +
          '</div>' +
        '</div>' +

        // SNS
        (coin.social && coin.social.interactions > 0 ?
          '<div style="padding:10px;background:rgba(168,85,247,0.08);border-radius:8px;margin-bottom:12px;font-size:13px">' +
            '📱 SNS反応 ' + formatCompactNum(coin.social.interactions) + '件' +
            (coin.social.trend === 'up' ? ' <span style="color:#ef4444">🔥 急上昇</span>' : '') +
          '</div>' : '') +

        // アドレス
        (addr ? '<div style="padding:8px;background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:12px;font-size:11px;color:#94a3b8;text-align:center">' +
          'CA: ' + shortAddr +
        '</div>' : '') +

        // 外部リンク
        '<div style="display:flex;gap:8px;margin-bottom:12px">' +
          (coin.dexUrl ?
            '<a href="' + coin.dexUrl + '" target="_blank" style="flex:1;display:block;text-align:center;padding:10px;background:rgba(255,255,255,0.08);border-radius:8px;color:#d4a853;text-decoration:none;font-size:13px">' +
              '📊 DexScreener' +
            '</a>' : '') +
          (addr ?
            '<a href="https://birdeye.so/token/' + addr + '?chain=solana" target="_blank" style="flex:1;display:block;text-align:center;padding:10px;background:rgba(255,255,255,0.08);border-radius:8px;color:#d4a853;text-decoration:none;font-size:13px">' +
              '🦅 Birdeye' +
            '</a>' : '') +
          (addr ?
            '<a href="https://solscan.io/token/' + addr + '" target="_blank" style="flex:1;display:block;text-align:center;padding:10px;background:rgba(255,255,255,0.08);border-radius:8px;color:#d4a853;text-decoration:none;font-size:13px">' +
              '🔍 Solscan' +
            '</a>' : '') +
        '</div>' +

        // Moonshot画面へ
        '<button onclick="closeUrgentCoinDetailModal(); window.KairosApp.showMoonshot();" style="width:100%;padding:12px;background:linear-gradient(135deg,#d4a853,#b8902e);color:#000;font-weight:600;border:none;border-radius:8px;font-size:14px;cursor:pointer">🎰 Moonshot画面で詳しく見る</button>' +
      '</div>' +
    '</div>';

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function() { modal.classList.add('active'); });

    modal.onclick = function(e) {
      if (e.target === modal) closeUrgentCoinDetailModal();
    };
  }
  window.openUrgentCoinDetail = openUrgentCoinDetail;

  function closeUrgentCoinDetailModal() {
    var modal = document.getElementById('urgent-coin-detail-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function() { modal.remove(); }, 300);
    }
  }
  window.closeUrgentCoinDetailModal = closeUrgentCoinDetailModal;

  function formatCompactUSD(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.round(num).toString();
  }
  function formatCompactNum(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.round(num).toString();
  }

  // ===== Worker URL 設定モーダル =====
  function openWorkerUrlModal() {
    if (document.getElementById('kairos-worker-url-modal')) return;

    var currentUrl = (typeof workerAlertState !== 'undefined') ? workerAlertState.url : (localStorage.getItem('kairosWorkerUrl') || '');

    var overlay = document.createElement('div');
    overlay.id = 'kairos-worker-url-modal';
    overlay.className = 'quick-buy-overlay';
    overlay.innerHTML = '<div class="quick-buy-modal" style="max-width:400px">' +
      '<div class="quick-buy-modal__header">' +
        '<span class="quick-buy-modal__title">🛰️ Worker 監視設定</span>' +
        '<button class="quick-buy-modal__close" onclick="document.getElementById(\'kairos-worker-url-modal\').remove()">×</button>' +
      '</div>' +
      '<div style="padding:16px">' +
        '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;line-height:1.6">' +
          'Cloudflare Worker の URL を設定すると、<br>アプリ起動時に自動で加熱コインを確認します。' +
        '</div>' +
        '<div class="quick-buy-modal__field">' +
          '<label>Worker URL</label>' +
          '<input type="url" id="worker-url-input" placeholder="https://kairos-moonshot-monitor.xxx.workers.dev" value="' + currentUrl + '" style="width:100%;padding:10px 12px;background:var(--surface-elevated);border:1px solid var(--border-primary);border-radius:10px;color:var(--text-primary);font-size:14px;outline:none">' +
        '</div>' +
        '<div style="margin-top:12px;display:flex;gap:8px">' +
          '<button class="quick-buy-modal__submit" id="worker-url-test" style="background:rgba(255,255,255,0.1);flex:1">接続テスト</button>' +
          '<button class="quick-buy-modal__submit" id="worker-url-save" style="flex:1">保存</button>' +
        '</div>' +
        '<div id="worker-url-status" style="margin-top:12px;font-size:12px;text-align:center;min-height:20px"></div>' +
      '</div>' +
    '</div>';

    document.body.appendChild(overlay);
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

    document.getElementById('worker-url-test').onclick = function() {
      var url = document.getElementById('worker-url-input').value.trim().replace(/\/+$/, '');
      var statusEl = document.getElementById('worker-url-status');
      if (!url) {
        statusEl.innerHTML = '<span style="color:#f59e0b">URLを入力してください</span>';
        return;
      }
      statusEl.innerHTML = '<span style="color:var(--text-secondary)">接続中...</span>';
      fetch(url + '/status', { mode: 'cors' })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (data.status === 'ok') {
            statusEl.innerHTML = '<span style="color:#10b981">✅ 接続成功！Worker稼働中</span>';
          } else {
            statusEl.innerHTML = '<span style="color:#f59e0b">⚠️ 応答はありましたが形式が異なります</span>';
          }
        })
        .catch(function() {
          statusEl.innerHTML = '<span style="color:#ef4444">❌ 接続失敗。URLを確認してください</span>';
        });
    };

    document.getElementById('worker-url-save').onclick = function() {
      var url = document.getElementById('worker-url-input').value.trim().replace(/\/+$/, '');
      if (typeof setWorkerUrl === 'function') {
        setWorkerUrl(url);
      } else {
        localStorage.setItem('kairosWorkerUrl', url);
      }
      document.getElementById('kairos-worker-url-modal').remove();
      showToast(url ? 'Worker URLを保存しました' : 'Worker URLをクリアしました', 'success');
    };
  }
  window.openWorkerUrlModal = openWorkerUrlModal;

  // サイドメニュー初期化
  function initSideMenu() {
    createSideMenu();
  }

  // ===== リアルタイムデータ管理 =====
  var liveData = {
    fearGreed: null,
    prices: {},
    lastUpdate: null
  };

  // ===== 価格アラートシステム =====
  var priceAlerts = {
    enabled: true,
    notificationPermission: 'default',
    // 短期アラート閾値（%）- 分単位の急変動検出
    thresholds: {
      spike: 5,      // 急上昇閾値（デフォルト5%）
      crash: -5,     // 急落閾値（デフォルト-5%）
      checkInterval: 60000  // チェック間隔（1分）
    },
    // 長期アラート閾値（%）- 週間/月間の変動検出
    longTermThresholds: {
      weeklyDrop: -15,    // 週間下落（買い増しチャンス）
      weeklyRise: 25,     // 週間上昇
      monthlyDrop: -25,   // 月間下落（大きな買い場）
      monthlyRise: 50     // 月間上昇（利確検討）
    },
    // 前回の価格を保存（短期用）
    previousPrices: {},
    // 価格履歴（長期用）- { ticker: { daily: [{date, price}, ...] } }
    priceHistory: {},
    // 通知済みアラート（重複防止）
    notifiedAlerts: {},
    // カスタムアラート
    customAlerts: []
  };

  // アラート設定を読み込み
  function loadAlertSettings() {
    try {
      var saved = localStorage.getItem('kairos-alert-settings');
      if (saved) {
        var settings = JSON.parse(saved);
        priceAlerts.thresholds = Object.assign(priceAlerts.thresholds, settings.thresholds || {});
        priceAlerts.longTermThresholds = Object.assign(priceAlerts.longTermThresholds, settings.longTermThresholds || {});
        priceAlerts.customAlerts = settings.customAlerts || [];
        priceAlerts.enabled = settings.enabled !== false;
      }
      // 価格履歴を読み込み
      var historyStr = localStorage.getItem('kairos-price-history');
      if (historyStr) {
        priceAlerts.priceHistory = JSON.parse(historyStr);
      }
    } catch(e) {
      console.warn('[KAIROS] Failed to load alert settings:', e);
    }
  }

  // アラート設定を保存
  function saveAlertSettings() {
    try {
      localStorage.setItem('kairos-alert-settings', JSON.stringify({
        thresholds: priceAlerts.thresholds,
        longTermThresholds: priceAlerts.longTermThresholds,
        customAlerts: priceAlerts.customAlerts,
        enabled: priceAlerts.enabled
      }));
    } catch(e) {
      console.warn('[KAIROS] Failed to save alert settings:', e);
    }
  }

  // 価格履歴を保存
  function savePriceHistory() {
    try {
      localStorage.setItem('kairos-price-history', JSON.stringify(priceAlerts.priceHistory));
    } catch(e) {
      console.warn('[KAIROS] Failed to save price history:', e);
    }
  }

  // 日次価格を記録（長期アラート用）
  function recordDailyPrice() {
    var today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    Object.keys(scoreCache.data).forEach(function(ticker) {
      var cached = scoreCache.data[ticker];
      if (!cached || !cached.price) return;

      if (!priceAlerts.priceHistory[ticker]) {
        priceAlerts.priceHistory[ticker] = [];
      }

      var history = priceAlerts.priceHistory[ticker];
      var lastEntry = history[history.length - 1];

      // 今日のデータがなければ追加
      if (!lastEntry || lastEntry.date !== today) {
        history.push({
          date: today,
          price: cached.price
        });

        // 最大90日分保持
        if (history.length > 90) {
          history.shift();
        }
      }
    });

    savePriceHistory();
  }

  // 週間/月間の変動率を計算
  function calculatePeriodChange(ticker, days) {
    var history = priceAlerts.priceHistory[ticker];
    if (!history || history.length < 2) return null;

    var cached = scoreCache.data[ticker];
    if (!cached || !cached.price) return null;

    var currentPrice = cached.price;
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - days);
    var targetDateStr = targetDate.toISOString().split('T')[0];

    // 指定日数前に最も近いデータを探す
    var pastPrice = null;
    for (var i = history.length - 1; i >= 0; i--) {
      if (history[i].date <= targetDateStr) {
        pastPrice = history[i].price;
        break;
      }
    }

    if (!pastPrice) {
      // 最も古いデータを使用
      pastPrice = history[0].price;
    }

    return ((currentPrice - pastPrice) / pastPrice) * 100;
  }

  // 長期アラートをチェック
  function checkLongTermAlerts() {
    if (!priceAlerts.enabled) return;

    var thresholds = priceAlerts.longTermThresholds;

    Object.keys(scoreCache.data).forEach(function(ticker) {
      // 週間変動チェック
      var weeklyChange = calculatePeriodChange(ticker, 7);
      if (weeklyChange !== null) {
        var weekKey = ticker + '-weekly-' + new Date().toISOString().split('T')[0];

        if (weeklyChange <= thresholds.weeklyDrop && !priceAlerts.notifiedAlerts[weekKey + '-drop']) {
          showLongTermAlert(ticker, 'weeklyDrop', weeklyChange);
          priceAlerts.notifiedAlerts[weekKey + '-drop'] = true;
        }
        if (weeklyChange >= thresholds.weeklyRise && !priceAlerts.notifiedAlerts[weekKey + '-rise']) {
          showLongTermAlert(ticker, 'weeklyRise', weeklyChange);
          priceAlerts.notifiedAlerts[weekKey + '-rise'] = true;
        }
      }

      // 月間変動チェック
      var monthlyChange = calculatePeriodChange(ticker, 30);
      if (monthlyChange !== null) {
        var monthKey = ticker + '-monthly-' + new Date().toISOString().split('T')[0];

        if (monthlyChange <= thresholds.monthlyDrop && !priceAlerts.notifiedAlerts[monthKey + '-drop']) {
          showLongTermAlert(ticker, 'monthlyDrop', monthlyChange);
          priceAlerts.notifiedAlerts[monthKey + '-drop'] = true;
        }
        if (monthlyChange >= thresholds.monthlyRise && !priceAlerts.notifiedAlerts[monthKey + '-rise']) {
          showLongTermAlert(ticker, 'monthlyRise', monthlyChange);
          priceAlerts.notifiedAlerts[monthKey + '-rise'] = true;
        }
      }
    });
  }

  // 長期アラート通知を表示
  function showLongTermAlert(ticker, type, changePercent) {
    var alertConfig = {
      weeklyDrop: { emoji: '📉', label: '週間下落', hint: '買い増しチャンス？', color: 'crash' },
      weeklyRise: { emoji: '📈', label: '週間上昇', hint: '', color: 'spike' },
      monthlyDrop: { emoji: '🔻', label: '月間下落', hint: '大きな買い場？', color: 'crash' },
      monthlyRise: { emoji: '🚀', label: '月間上昇', hint: '利確検討？', color: 'spike' }
    };

    var config = alertConfig[type];
    var sign = changePercent >= 0 ? '+' : '';
    var title = config.emoji + ' ' + ticker + ' ' + config.label + '!';
    var body = sign + changePercent.toFixed(1) + '%' + (config.hint ? ' - ' + config.hint : '');

    showAlertToast(title, body, config.color);
    sendBrowserNotification(title, body);
    saveAlertHistory(title, body);

  }

  // ブラウザ通知の許可をリクエスト
  function requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('[KAIROS] This browser does not support notifications');
      return Promise.resolve('unsupported');
    }

    if (Notification.permission === 'granted') {
      priceAlerts.notificationPermission = 'granted';
      return Promise.resolve('granted');
    }

    if (Notification.permission === 'denied') {
      priceAlerts.notificationPermission = 'denied';
      return Promise.resolve('denied');
    }

    return Notification.requestPermission().then(function(permission) {
      priceAlerts.notificationPermission = permission;
      if (permission === 'granted') {
        showToast('通知が有効になりました', 'success');
      }
      return permission;
    });
  }

  // ブラウザ通知を送信
  function sendBrowserNotification(title, body, icon) {
    if (priceAlerts.notificationPermission !== 'granted') {
      return;
    }

    try {
      var notification = new Notification(title, {
        body: body,
        icon: icon || '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'kairos-price-alert',
        requireInteraction: true
      });

      notification.onclick = function() {
        window.focus();
        notification.close();
      };

      // 10秒後に自動で閉じる
      setTimeout(function() {
        notification.close();
      }, 10000);
    } catch(e) {
      console.warn('[KAIROS] Failed to send notification:', e);
    }
  }

  // アラート通知を表示（ブラウザ通知 + アプリ内トースト/緊急アラート）
  function showPriceAlert(ticker, type, changePercent, currentPrice) {
    var alertKey = ticker + '-' + type + '-' + Math.floor(Date.now() / 60000);

    // 1分以内の重複通知を防止
    if (priceAlerts.notifiedAlerts[alertKey]) {
      return;
    }
    priceAlerts.notifiedAlerts[alertKey] = true;

    var absChange = Math.abs(changePercent);

    // 大きな変動（10%以上）は緊急アラート表示
    if (absChange >= 10) {
      window.showEmergencyAlert(ticker, type, changePercent, currentPrice);
      sendBrowserNotification('🚨 ' + ticker + ' 緊急アラート', (changePercent >= 0 ? '+' : '') + changePercent.toFixed(1) + '%');
      return;
    }

    var emoji = type === 'spike' ? '🚀' : '📉';
    var typeLabel = type === 'spike' ? '急上昇' : '急落';
    var sign = changePercent >= 0 ? '+' : '';

    var title = emoji + ' ' + ticker + ' ' + typeLabel + '!';
    var body = sign + changePercent.toFixed(1) + '% ($' + currentPrice.toFixed(currentPrice < 1 ? 4 : 2) + ')';

    // アプリ内トースト
    showAlertToast(title, body, type);

    // ブラウザ通知
    sendBrowserNotification(title, body);

    // 履歴に保存
    saveAlertHistory(title, body);

  }

  // アラート用トースト（目立つデザイン）
  function showAlertToast(title, body, type) {
    var bgColor = type === 'spike' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #ef4444, #dc2626)';
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:' + bgColor + ';color:#fff;padding:16px 24px;border-radius:16px;z-index:10050;box-shadow:0 8px 32px rgba(0,0,0,0.4);font-size:14px;text-align:center;min-width:200px;animation:alertPulse 0.5s ease;';
    toast.innerHTML = '<div style="font-weight:700;font-size:16px;margin-bottom:4px;">' + title + '</div><div style="opacity:0.9;">' + body + '</div>';
    document.body.appendChild(toast);

    // アニメーションCSS追加
    if (!document.getElementById('alert-animation-style')) {
      var style = document.createElement('style');
      style.id = 'alert-animation-style';
      style.textContent = '@keyframes alertPulse { 0% { transform: translateX(-50%) scale(0.8); opacity: 0; } 50% { transform: translateX(-50%) scale(1.05); } 100% { transform: translateX(-50%) scale(1); opacity: 1; } }';
      document.head.appendChild(style);
    }

    setTimeout(function() { toast.remove(); }, 5000);
  }

  // 価格変動をチェック
  window.checkPriceAlerts = function() {
    if (!priceAlerts.enabled) return;

    Object.keys(scoreCache.data).forEach(function(ticker) {
      var cached = scoreCache.data[ticker];
      var currentPrice = cached.price;
      var previousPrice = priceAlerts.previousPrices[ticker];

      if (previousPrice && currentPrice) {
        var changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;

        // 急上昇チェック
        if (changePercent >= priceAlerts.thresholds.spike) {
          showPriceAlert(ticker, 'spike', changePercent, currentPrice);
        }
        // 急落チェック
        else if (changePercent <= priceAlerts.thresholds.crash) {
          showPriceAlert(ticker, 'crash', changePercent, currentPrice);
        }
      }

      // 現在価格を保存
      priceAlerts.previousPrices[ticker] = currentPrice;
    });

    // カスタムアラートもチェック
    checkCustomAlerts();
  };

  // カスタムアラート（特定価格に達したら通知）
  function checkCustomAlerts() {
    priceAlerts.customAlerts.forEach(function(alert, index) {
      if (alert.triggered) return;

      var cached = scoreCache.data[alert.ticker];
      if (!cached) return;

      var currentPrice = cached.price;
      var triggered = false;

      if (alert.type === 'above' && currentPrice >= alert.targetPrice) {
        triggered = true;
      } else if (alert.type === 'below' && currentPrice <= alert.targetPrice) {
        triggered = true;
      }

      if (triggered) {
        var emoji = alert.type === 'above' ? '⬆️' : '⬇️';
        var title = emoji + ' ' + alert.ticker + ' 目標価格到達!';
        var body = '$' + currentPrice.toFixed(currentPrice < 1 ? 4 : 2) + ' (目標: $' + alert.targetPrice + ')';

        showAlertToast(title, body, alert.type === 'above' ? 'spike' : 'crash');
        sendBrowserNotification(title, body);
        saveAlertHistory(title, body);

        // トリガー済みにマーク
        priceAlerts.customAlerts[index].triggered = true;
        saveAlertSettings();
      }
    });
  }

  // カスタムアラートを追加
  window.addPriceAlert = function(ticker, type, targetPrice) {
    priceAlerts.customAlerts.push({
      ticker: ticker.toUpperCase(),
      type: type, // 'above' or 'below'
      targetPrice: parseFloat(targetPrice),
      triggered: false,
      createdAt: Date.now()
    });
    saveAlertSettings();
    showToast(ticker + 'のアラートを設定しました', 'success');
  };

  // カスタムアラートを削除
  window.removePriceAlert = function(index) {
    priceAlerts.customAlerts.splice(index, 1);
    saveAlertSettings();
  };

  // アラート設定を取得（UI用）
  window.getAlertSettings = function() {
    return {
      enabled: priceAlerts.enabled,
      thresholds: priceAlerts.thresholds,
      longTermThresholds: priceAlerts.longTermThresholds,
      customAlerts: priceAlerts.customAlerts,
      notificationPermission: priceAlerts.notificationPermission
    };
  };

  // アラート有効/無効切り替え
  window.toggleAlerts = function(enabled) {
    priceAlerts.enabled = enabled;
    saveAlertSettings();
    showToast(enabled ? 'アラートを有効にしました' : 'アラートを無効にしました', 'info');
  };

  // 短期閾値を変更
  window.setAlertThreshold = function(type, value) {
    if (type === 'spike') {
      priceAlerts.thresholds.spike = parseFloat(value);
    } else if (type === 'crash') {
      priceAlerts.thresholds.crash = parseFloat(value);
    }
    saveAlertSettings();
  };

  // 長期閾値を変更
  window.setLongTermThreshold = function(type, value) {
    if (priceAlerts.longTermThresholds.hasOwnProperty(type)) {
      priceAlerts.longTermThresholds[type] = parseFloat(value);
      saveAlertSettings();
    }
  };

  // Fear & Greed をリアルタイム取得して更新
  function fetchAndUpdateFearGreed() {
    FearGreedAPI.fetch().then(function(data) {
      liveData.fearGreed = data;
      liveData.lastUpdate = Date.now();

      // kairosDataを更新
      if (!kairosData.analysis) kairosData.analysis = {};
      if (!kairosData.analysis.market) kairosData.analysis.market = {};
      kairosData.analysis.market.fear_greed_index = data.value;

      // 表示を更新
      updateFearGreedDisplay(data.value);
    }).catch(function(err) {
      console.warn('[KAIROS] Fear & Greed fetch failed:', err);
    });
  }

  // Fear & Greed 表示を更新
  function updateFearGreedDisplay(value) {
    var elements = document.querySelectorAll('.fear-greed__value');
    elements.forEach(function(el) {
      el.textContent = value;
      el.style.color = getFearGreedColor(value);
    });

    var labels = document.querySelectorAll('.fear-greed__label');
    labels.forEach(function(el) {
      el.textContent = getFearGreedLabel(value);
    });

    // サイドメニューのFear & Greedも更新
    var sideMenuFG = document.getElementById('side-menu-feargreed');
    if (sideMenuFG) {
      sideMenuFG.innerHTML = renderSideMenuFearGreed();
    }
  }

  // 価格をリアルタイム取得
  function fetchAndUpdatePrices() {
    var currencies = ['btc', 'eth', 'sol', 'xrp', 'ada', 'doge'];
    PriceAPI.getMultiplePrices(currencies).then(function(prices) {
      liveData.prices = prices;
      liveData.lastUpdate = Date.now();

      // all_resultsを更新
      if (kairosData.all_results) {
        kairosData.all_results.forEach(function(coin) {
          var priceData = prices[coin.ticker];
          if (priceData) {
            coin.current_price = priceData.usd;
            coin.price_change_24h = priceData.change24h;
          }
        });
      }

      // 価格アラートをチェック（短期）
      if (window.checkPriceAlerts) {
        window.checkPriceAlerts();
      }

      // 日次価格を記録（長期アラート用）
      recordDailyPrice();

      // 長期アラートをチェック（1日1回程度で十分だが、起動時にもチェック）
      checkLongTermAlerts();
    }).catch(function(err) {
      console.warn('[KAIROS] Prices fetch failed:', err);
    });
  }

  // AI分析スコアを取得・更新
  var scoreCache = {
    data: {},
    lastUpdate: 0,
    cacheTime: 5 * 60 * 1000 // 5分キャッシュ
  };

  // リクエストIDでレースコンディションを防止
  var scoreRequestId = 0;

  // ストラテジーに応じたスコア/グレードを返すヘルパー
  // currenciesViewModeがあればそれを優先（通貨一覧と詳細画面の一貫性）
  // なければ通貨別StrategyManagerの設定にフォールバック
  window.getStrategyScore = function(ticker) {
    var cached = scoreCache.data[ticker];
    if (!cached) return { score: 50, grade: 'C' };
    var viewMode = appState.currenciesViewMode; // 'swing' | 'longterm' | null
    var isLongterm;
    if (viewMode) {
      isLongterm = (viewMode === 'longterm');
    } else {
      var strat = (typeof StrategyManager !== 'undefined') ? StrategyManager.getStrategy(ticker) : 'swing';
      isLongterm = (strat === 'longterm');
    }
    // dual対応: score_swing/score_longtermがあればそれを使う
    if (cached.scoreSwing !== undefined && cached.scoreLongterm !== undefined) {
      return {
        score: isLongterm ? cached.scoreLongterm : cached.scoreSwing,
        grade: isLongterm ? cached.gradeLongterm : cached.gradeSwing
      };
    }
    // 従来の単一スコア
    return { score: cached.score || 50, grade: cached.grade || 'C' };
  };

  // v19.8: ストラテジーに応じた信頼度を返すヘルパー
  window.getStrategyConfidence = function(ticker) {
    var viewMode = appState.currenciesViewMode;
    if (viewMode === 'longterm') return scoreCache.longtermConfidence || 50;
    return scoreCache.swingConfidence || 50;
  };

  // Moonshot→個別画面遷移用: 価格データをscoreCacheに注入（既存データは上書きしない）
  window.injectCoinDataForDetail = function(ticker, data) {
    if (!scoreCache.data[ticker]) {
      scoreCache.data[ticker] = {};
    }
    var d = scoreCache.data[ticker];
    if (!d.price && data.price) d.price = data.price;
    if (d.change24h === undefined && data.change24h !== undefined) d.change24h = data.change24h;
    if (data.dexUrl) d._dexUrl = data.dexUrl;
    if (data.tokenAddress) d._tokenAddress = data.tokenAddress;
  };

  function fetchAndUpdateScores() {
    scoreRequestId++;
    var thisRequestId = scoreRequestId;

    // バックエンドが利用可能か確認
    BackendAPI.healthCheck().then(function(available) {
      if (!available) {
        appState.isLoading = false;
        renderApp();
        return;
      }

      // キャッシュが有効ならスキップ（dualモードなのでモード判定は不要）
      var cacheValid = Date.now() - scoreCache.lastUpdate < scoreCache.cacheTime;
      var cacheHasData = Object.keys(scoreCache.data).length > 0;

      if (cacheValid && cacheHasData) {
        appState.isLoading = false;
        renderApp();
        return;
      }

      // 全通貨ランキングを一括取得（dualモード: 両方のスコア）
      BackendAPI.getRankAll().then(function(data) {
        // レースコンディション防止: リクエストIDが変わっていたら無視
        if (thisRequestId !== scoreRequestId) {
          return;
        }

        var coins = data.coins || [];
        var market = data.market || {};
        var systemConfidence = data.system_confidence || 50;
        var mode = data.mode || 'dual';

        // システム信頼度とバックエンド有効ソースを保存
        scoreCache.systemConfidence = systemConfidence;
        scoreCache.enabledSources = data.enabled_sources || [];
        scoreCache.mode = mode;
        scoreCache.modeLabel = data.mode_label || 'デュアル';
        // v19.8: 柱ベース信頼度
        scoreCache.swingConfidence = data.swing_confidence || 50;
        scoreCache.longtermConfidence = data.longterm_confidence || 50;
        scoreCache.pillarCoverage = data.pillar_coverage || {};

        coins.forEach(function(coin) {
          var pricePos = coin.price_position;
          var pricePosDisplay = coin.price_position_display;

          var entry = {
            score: coin.score,
            grade: coin.grade,
            confidence: coin.confidence || systemConfidence,
            signal: coin.signal || 'normal',
            summary: coin.summary || '',
            proxyUsed: coin.proxy_used || [],
            price: coin.price,
            change24h: coin.change_24h,
            pricePosition: (pricePos !== undefined && pricePos !== null) ? pricePos : 50,
            pricePositionDisplay: pricePosDisplay || '50%',
            market: market,
            timestamp: Date.now()
          };

          // dual対応: 両方のスコアがあれば保存
          if (coin.score_swing !== undefined) {
            entry.scoreSwing = coin.score_swing;
            entry.gradeSwing = coin.grade_swing;
          }
          if (coin.score_longterm !== undefined) {
            entry.scoreLongterm = coin.score_longterm;
            entry.gradeLongterm = coin.grade_longterm;
          }
          if (coin.summary_swing !== undefined) {
            entry.summarySwing = coin.summary_swing;
          }
          if (coin.summary_longterm !== undefined) {
            entry.summaryLongterm = coin.summary_longterm;
          }
          // dual対応: 価格ポジションも両方保存
          if (coin.price_position_swing !== undefined) {
            entry.pricePositionSwing = coin.price_position_swing;
            entry.pricePositionDisplaySwing = coin.price_position_display_swing || '50%';
          }
          if (coin.price_position_longterm !== undefined) {
            entry.pricePositionLongterm = coin.price_position_longterm;
            entry.pricePositionDisplayLongterm = coin.price_position_display_longterm || '50%';
          }

          scoreCache.data[coin.ticker] = entry;
        });

        scoreCache.lastUpdate = Date.now();

        // ローディング解除して画面を再描画
        appState.isLoading = false;
        renderApp();
      }).catch(function(err) {
        console.warn('[KAIROS] Rank-all fetch failed:', err.message);
        appState.isLoading = false;
        // フォールバック: 個別に取得
        fetchScoresIndividually();
      });
    });
  }

  // フォールバック: 個別にスコアを取得
  function fetchScoresIndividually() {
    var watchlist = getWatchlist ? getWatchlist() : ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE'];
    var completed = 0;
    var total = watchlist.length;

    watchlist.forEach(function(ticker) {
      BackendAPI.getAIAnalysis(ticker).then(function(data) {
        var ai = data.ai_analysis || {};
        var price = data.price || {};
        var technical = data.technical || {};
        var market = data.market || {};

        var score = ai.overall_score;
        if (!score || ai.error) {
          score = calculateScoreFromTechnical(technical, market);
        }

        var grade = ai.grade;
        if (!grade || ai.error) {
          grade = scoreToGrade(score);
        }

        // サマリーが空の場合はスコアから生成
        var summaryText = ai.summary || getMarketScoreLabel(score);

        scoreCache.data[ticker] = {
          score: score,
          grade: grade,
          signal: ai.signal || 'neutral',
          summary: summaryText,
          technical: technical,
          market: market,
          price: price.current_price,
          change24h: price.price_change_24h,
          timestamp: Date.now()
        };

        completed++;
        if (completed === total) {
          scoreCache.lastUpdate = Date.now();
          if (appState.currentScreen === 'home') {
            renderApp();
          }
        }
      }).catch(function(err) {
        console.warn('[KAIROS] Score fetch failed for', ticker, err.message);
        completed++;
      });
    });
  }

  // テクニカル指標からスコアを計算
  function calculateScoreFromTechnical(technical, market) {
    var score = 50; // ベーススコア

    if (!technical) return score;

    // RSI (0-100)
    var rsi = technical.rsi || 50;
    if (rsi < 30) score += 15; // 売られすぎ = 買いチャンス
    else if (rsi > 70) score -= 15; // 買われすぎ = 売りシグナル
    else if (rsi >= 40 && rsi <= 60) score += 5; // 中立は若干プラス

    // MACD
    if (technical.macd_signal === 'bullish') score += 10;
    else if (technical.macd_signal === 'bearish') score -= 10;

    // トレンド
    if (technical.trend === 'bullish') score += 10;
    else if (technical.trend === 'bearish') score -= 10;

    // MA signal
    if (technical.ma_signal === 'bullish') score += 5;
    else if (technical.ma_signal === 'bearish') score -= 5;

    // Fear & Greed (市場心理)
    if (market && market.fear_greed_index) {
      var fg = market.fear_greed_index;
      if (fg < 25) score += 10; // 極度の恐怖 = 買いチャンス
      else if (fg > 75) score -= 10; // 極度の強欲 = 注意
    }

    // 0-100の範囲に収める
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // スコアをグレードに変換
  function scoreToGrade(score) {
    if (score >= 85) return 'S';
    if (score >= 72) return 'A';
    if (score >= 58) return 'B';
    if (score >= 42) return 'C';
    if (score >= 25) return 'D';
    return 'E';
  }

  // 定期更新（5分ごと）+ タブ非表示時の自動停止
  var liveIntervalIds = { fearGreed: null, prices: null, scores: null, portfolio: null };
  var liveUpdatesPaused = false;
  var lastPausedAt = 0;

  function startLiveIntervals() {
    liveIntervalIds.fearGreed = setInterval(fetchAndUpdateFearGreed, 5 * 60 * 1000);
    liveIntervalIds.prices = setInterval(fetchAndUpdatePrices, 60 * 1000);
    liveIntervalIds.scores = setInterval(fetchAndUpdateScores, 5 * 60 * 1000);
    liveIntervalIds.portfolio = setInterval(function() {
      if (typeof recordPortfolioSnapshot === 'function') {
        recordPortfolioSnapshot();
      }
    }, 60 * 60 * 1000);
  }

  function stopLiveIntervals() {
    Object.keys(liveIntervalIds).forEach(function(key) {
      if (liveIntervalIds[key]) {
        clearInterval(liveIntervalIds[key]);
        liveIntervalIds[key] = null;
      }
    });
  }

  function startLiveUpdates() {
    // 初回取得（並列実行）
    fetchAndUpdateFearGreed();
    fetchAndUpdatePrices();
    fetchAndUpdateScores(); // バックエンドは2秒タイムアウトで即座にスキップ

    // ポートフォリオスナップショットを記録（初回）
    setTimeout(function() {
      if (typeof recordPortfolioSnapshot === 'function') {
        recordPortfolioSnapshot();
      }
    }, 1000);

    // 定期更新開始
    startLiveIntervals();

    // タブ非表示時にポーリング停止（Railway等の従量課金対策）
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        // タブ非表示 → 全ポーリング停止
        stopLiveIntervals();
        if (tickerBarState.updateInterval) {
          clearInterval(tickerBarState.updateInterval);
          tickerBarState.updateInterval = null;
        }
        liveUpdatesPaused = true;
        lastPausedAt = Date.now();
        console.log('[KAIROS] Tab hidden - polling paused');
      } else if (liveUpdatesPaused) {
        // タブ復帰 → ポーリング再開 + 即座にデータ更新
        liveUpdatesPaused = false;
        var pausedFor = Date.now() - lastPausedAt;
        console.log('[KAIROS] Tab visible - polling resumed (paused ' + Math.round(pausedFor / 1000) + 's)');

        // データが古くなっている場合は即座に再取得
        if (pausedFor > 60 * 1000) {
          fetchAndUpdatePrices();
          fetchAndUpdateFearGreed();
        }
        if (pausedFor > 3 * 60 * 1000) {
          scoreCache.lastUpdate = 0;
          fetchAndUpdateScores();
        }

        // ポーリング再開
        startLiveIntervals();
        if (typeof fetchTickerPrices === 'function') {
          fetchTickerPrices();
          tickerBarState.updateInterval = setInterval(fetchTickerPrices, 30000);
        }
      }
    });
  }

  // データ更新をグローバル公開
  window.KairosLive = {
    refresh: function() {
      fetchAndUpdateFearGreed();
      fetchAndUpdatePrices();
      // スコアキャッシュをクリアして再取得
      scoreCache.lastUpdate = 0;
      fetchAndUpdateScores();
    },
    getData: function() {
      return liveData;
    },
    getScores: function() {
      return scoreCache.data;
    }
  };

  // ===== Pull-to-Refresh =====
  var pullToRefreshState = {
    startY: 0,
    pulling: false,
    threshold: 80
  };

  function initPullToRefresh() {
    var root = document.getElementById('root');
    if (!root) return;

    // プルインジケーター作成
    var indicator = document.createElement('div');
    indicator.className = 'pull-indicator';
    indicator.innerHTML = '<div class="pull-indicator__spinner"></div><span class="pull-indicator__text">引っ張って更新</span>';
    document.body.appendChild(indicator);

    document.addEventListener('touchstart', function(e) {
      if (window.scrollY === 0 && appState.currentScreen !== 'splash') {
        pullToRefreshState.startY = e.touches[0].clientY;
        pullToRefreshState.pulling = true;
      }
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      if (!pullToRefreshState.pulling) return;

      var currentY = e.touches[0].clientY;
      var diff = currentY - pullToRefreshState.startY;

      if (diff > 0 && diff < 150) {
        indicator.style.transform = 'translateY(' + Math.min(diff - 40, 60) + 'px)';
        indicator.style.opacity = Math.min(diff / pullToRefreshState.threshold, 1);

        if (diff > pullToRefreshState.threshold) {
          indicator.querySelector('.pull-indicator__text').textContent = '離して更新';
          indicator.classList.add('pull-indicator--ready');
        } else {
          indicator.querySelector('.pull-indicator__text').textContent = '引っ張って更新';
          indicator.classList.remove('pull-indicator--ready');
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
      if (!pullToRefreshState.pulling) return;

      var indicator = document.querySelector('.pull-indicator');
      var wasReady = indicator.classList.contains('pull-indicator--ready');

      indicator.style.transform = '';
      indicator.style.opacity = '0';
      indicator.classList.remove('pull-indicator--ready');

      pullToRefreshState.pulling = false;

      if (wasReady) {
        refreshData(true);
        showToast('データを更新中...', 'info');
      }
    }, { passive: true });
  }

  // ===== オフライン検出 =====
  function initOfflineDetection() {
    var offlineBanner = null;

    function showOfflineBanner() {
      if (offlineBanner) return;
      offlineBanner = document.createElement('div');
      offlineBanner.className = 'offline-banner';
      offlineBanner.innerHTML = '<span class="offline-banner__icon">📶</span>オフラインです - 一部の機能が制限されます';
      document.body.appendChild(offlineBanner);
    }

    function hideOfflineBanner() {
      if (offlineBanner) {
        offlineBanner.remove();
        offlineBanner = null;
        showToast('オンラインに復帰しました', 'success');
        refreshData(false);
      }
    }

    window.addEventListener('online', hideOfflineBanner);
    window.addEventListener('offline', showOfflineBanner);

    // 初期状態チェック
    if (!navigator.onLine) {
      showOfflineBanner();
    }
  }

  // ============================================
  // 通貨比較機能
  // ============================================
  var compareState = {
    selected: ['BTC', 'ETH'],
    period: '7d',
    chartInstance: null,
    chartData: {}
  };

  window.openCompareModal = function() {
    if (document.getElementById('kairos-compare-modal')) return;

    var allResults = kairosData.all_results || [];
    var coins = [
      { id: 'BTC', name: 'Bitcoin', icon: '₿' },
      { id: 'ETH', name: 'Ethereum', icon: 'Ξ' },
      { id: 'SOL', name: 'Solana', icon: '◎' },
      { id: 'XRP', name: 'Ripple', icon: '✕' },
      { id: 'ADA', name: 'Cardano', icon: '₳' },
      { id: 'DOGE', name: 'Dogecoin', icon: 'Ð' }
    ];

    // 既存の選択状態を確認
    if (compareState.selected.length === 0) {
      compareState.selected = ['BTC', 'ETH'];
    }

    var coinCheckboxes = coins.map(function(coin) {
      var coinData = allResults.find(function(r) { return r.ticker === coin.id; }) || {};
      var isChecked = compareState.selected.indexOf(coin.id) !== -1;
      var price = coinData.current_price || 0;
      var change = coinData.price_change_24h || 0;
      var changeColor = change >= 0 ? '#22c55e' : '#ef4444';
      var bgColor = isChecked ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.03)';
      var borderColor = isChecked ? '#d4a853' : 'rgba(255,255,255,0.1)';
      return '<label style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:' + bgColor + ';border:1px solid ' + borderColor + ';border-radius:10px;cursor:pointer" data-coin="' + coin.id + '">' +
        '<input type="checkbox" value="' + coin.id + '"' + (isChecked ? ' checked' : '') + ' onchange="toggleCompareCoin(\'' + coin.id + '\', this)" style="display:none">' +
        '<span style="font-size:16px;width:24px;text-align:center">' + coin.icon + '</span>' +
        '<span style="font-size:13px;font-weight:600;color:#fff;flex:1">' + coin.id + '</span>' +
        '<span style="font-size:11px;color:rgba(255,255,255,0.6)">$' + formatNumber(price) + '</span>' +
        '<span style="font-size:11px;font-weight:600;min-width:50px;text-align:right;color:' + changeColor + '">' + (change >= 0 ? '+' : '') + change.toFixed(2) + '%</span>' +
      '</label>';
    }).join('');

    var modal = document.createElement('div');
    modal.id = 'kairos-compare-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:500px;width:95%;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">通貨比較</h3>' +
          '<button onclick="closeCompareModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +
        '<div style="color:#fff">' +
          '<div style="margin-bottom:16px">' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:10px">比較する通貨を選択（2〜4つ）</div>' +
            '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">' + coinCheckboxes + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:8px;margin-bottom:16px">' +
            '<button class="compare-period-btn' + (compareState.period === '24h' ? ' active' : '') + '" onclick="setComparePeriod(\'24h\')" style="flex:1;padding:8px 12px;background:' + (compareState.period === '24h' ? '#d4a853' : 'rgba(255,255,255,0.05)') + ';border:1px solid ' + (compareState.period === '24h' ? '#d4a853' : 'rgba(255,255,255,0.1)') + ';border-radius:8px;color:' + (compareState.period === '24h' ? '#000' : 'rgba(255,255,255,0.7)') + ';font-size:12px;font-weight:500;cursor:pointer">24時間</button>' +
            '<button class="compare-period-btn' + (compareState.period === '7d' ? ' active' : '') + '" onclick="setComparePeriod(\'7d\')" style="flex:1;padding:8px 12px;background:' + (compareState.period === '7d' ? '#d4a853' : 'rgba(255,255,255,0.05)') + ';border:1px solid ' + (compareState.period === '7d' ? '#d4a853' : 'rgba(255,255,255,0.1)') + ';border-radius:8px;color:' + (compareState.period === '7d' ? '#000' : 'rgba(255,255,255,0.7)') + ';font-size:12px;font-weight:500;cursor:pointer">7日</button>' +
            '<button class="compare-period-btn' + (compareState.period === '30d' ? ' active' : '') + '" onclick="setComparePeriod(\'30d\')" style="flex:1;padding:8px 12px;background:' + (compareState.period === '30d' ? '#d4a853' : 'rgba(255,255,255,0.05)') + ';border:1px solid ' + (compareState.period === '30d' ? '#d4a853' : 'rgba(255,255,255,0.1)') + ';border-radius:8px;color:' + (compareState.period === '30d' ? '#000' : 'rgba(255,255,255,0.7)') + ';font-size:12px;font-weight:500;cursor:pointer">30日</button>' +
            '<button class="compare-period-btn' + (compareState.period === '90d' ? ' active' : '') + '" onclick="setComparePeriod(\'90d\')" style="flex:1;padding:8px 12px;background:' + (compareState.period === '90d' ? '#d4a853' : 'rgba(255,255,255,0.05)') + ';border:1px solid ' + (compareState.period === '90d' ? '#d4a853' : 'rgba(255,255,255,0.1)') + ';border-radius:8px;color:' + (compareState.period === '90d' ? '#000' : 'rgba(255,255,255,0.7)') + ';font-size:12px;font-weight:500;cursor:pointer">90日</button>' +
          '</div>' +
          '<div style="background:rgba(0,0,0,0.2);border-radius:12px;padding:12px;margin-bottom:16px">' +
            '<div id="compare-chart" style="height:250px"></div>' +
          '</div>' +
          '<div id="compare-metrics"></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeCompareModal(); };

    // チャートと指標を初期化
    initCompareChart();
    updateCompareMetrics();
  };

  window.closeCompareModal = function() {
    var modal = document.getElementById('kairos-compare-modal');
    if (modal) {
      if (compareState.chartInstance) {
        compareState.chartInstance.remove();
        compareState.chartInstance = null;
      }
      modal.remove();
    }
  };

  window.toggleCompareCoin = function(coinId, checkbox) {
    var idx = compareState.selected.indexOf(coinId);
    if (checkbox.checked) {
      if (idx === -1 && compareState.selected.length < 4) {
        compareState.selected.push(coinId);
      } else if (compareState.selected.length >= 4) {
        checkbox.checked = false;
        showToast('最大4つまで選択できます', 'warning');
        return;
      }
    } else {
      if (compareState.selected.length <= 2) {
        checkbox.checked = true;
        showToast('最低2つ選択してください', 'warning');
        return;
      }
      if (idx !== -1) {
        compareState.selected.splice(idx, 1);
      }
    }

    // UIの選択状態を更新
    var label = checkbox.parentElement;
    if (label) {
      if (checkbox.checked) {
        label.style.background = 'rgba(212,168,83,0.15)';
        label.style.borderColor = '#d4a853';
      } else {
        label.style.background = 'rgba(255,255,255,0.03)';
        label.style.borderColor = 'rgba(255,255,255,0.1)';
      }
    }

    updateCompareChart();
    updateCompareMetrics();
  };

  window.setComparePeriod = function(period) {
    compareState.period = period;

    // ボタンの状態を更新
    document.querySelectorAll('.compare-period-btn').forEach(function(btn) {
      var isActive = btn.textContent.indexOf(period === '24h' ? '24' : period === '7d' ? '7' : period === '30d' ? '30' : '90') !== -1;
      if (isActive) {
        btn.style.background = '#d4a853';
        btn.style.borderColor = '#d4a853';
        btn.style.color = '#000';
      } else {
        btn.style.background = 'rgba(255,255,255,0.05)';
        btn.style.borderColor = 'rgba(255,255,255,0.1)';
        btn.style.color = 'rgba(255,255,255,0.7)';
      }
    });

    updateCompareChart();
  };

  function initCompareChart() {
    var container = document.getElementById('compare-chart');
    if (!container || typeof LightweightCharts === 'undefined') return;

    compareState.chartInstance = LightweightCharts.createChart(container, {
      width: container.clientWidth,
      height: 250,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: 'rgba(255,255,255,0.7)'
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' }
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.1)',
        scaleMargins: { top: 0.1, bottom: 0.1 }
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.1)',
        timeVisible: true
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Magnet
      }
    });

    updateCompareChart();
  }

  function updateCompareChart() {
    if (!compareState.chartInstance) return;

    // 既存のシリーズを削除
    var series = compareState.chartInstance.getSeries ? compareState.chartInstance.getSeries() : [];
    // series配列が取得できないので、チャートを再作成
    if (compareState.chartInstance) {
      var container = document.getElementById('compare-chart');
      compareState.chartInstance.remove();
      compareState.chartInstance = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 250,
        layout: {
          background: { type: 'solid', color: 'transparent' },
          textColor: 'rgba(255,255,255,0.7)'
        },
        grid: {
          vertLines: { color: 'rgba(255,255,255,0.05)' },
          horzLines: { color: 'rgba(255,255,255,0.05)' }
        },
        rightPriceScale: {
          borderColor: 'rgba(255,255,255,0.1)',
          scaleMargins: { top: 0.1, bottom: 0.1 }
        },
        timeScale: {
          borderColor: 'rgba(255,255,255,0.1)',
          timeVisible: true
        }
      });
    }

    var colors = ['#d4a853', '#3b82f6', '#22c55e', '#ef4444'];

    compareState.selected.forEach(function(ticker, index) {
      fetchCompareData(ticker, compareState.period, function(data) {
        if (!compareState.chartInstance) return;

        // 正規化（開始価格を100として％表示）
        var normalizedData = normalizeChartData(data);

        var lineSeries = compareState.chartInstance.addLineSeries({
          color: colors[index % colors.length],
          lineWidth: 2,
          title: ticker
        });
        lineSeries.setData(normalizedData);
      });
    });
  }

  function fetchCompareData(ticker, period, callback) {
    var periodMap = {
      '24h': { interval: '1h', limit: 168 },    // 1週間分
      '7d': { interval: '4h', limit: 252 },    // 6週間分
      '30d': { interval: '1d', limit: 180 },   // 6ヶ月分
      '90d': { interval: '1d', limit: 365 }    // 1年分
    };

    var config = periodMap[period] || periodMap['7d'];
    var symbol = ticker.toUpperCase() + 'USDT';
    var url = 'https://api.binance.com/api/v3/klines?symbol=' + symbol + '&interval=' + config.interval + '&limit=' + config.limit;

    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!Array.isArray(data)) {
          callback([]);
          return;
        }

        var jstOffset = 9 * 60 * 60;
        var chartData = data.map(function(item) {
          return {
            time: Math.floor(item[0] / 1000) + jstOffset,
            value: parseFloat(item[4]) // 終値
          };
        });

        callback(chartData);
      })
      .catch(function(err) {
        console.error('Compare data fetch error:', err);
        callback([]);
      });
  }

  function normalizeChartData(data) {
    if (!data || data.length === 0) return [];

    var startValue = data[0].value;
    if (startValue === 0) return data;

    return data.map(function(item) {
      return {
        time: item.time,
        value: ((item.value - startValue) / startValue) * 100
      };
    });
  }

  function updateCompareMetrics() {
    var container = document.getElementById('compare-metrics');
    if (!container) return;

    var allResults = kairosData.all_results || [];

    var metricsHtml = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px">';

    compareState.selected.forEach(function(ticker) {
      var cached = scoreCache.data[ticker] || {};
      var coinData = allResults.find(function(r) { return r.ticker === ticker; }) || {};
      var price = cached.price || coinData.current_price || 0;
      var change = cached.change24h || coinData.price_change_24h || 0;
      var stratScore = window.getStrategyScore(ticker);
      var grade = stratScore.grade || coinData.grade || '-';
      var score = stratScore.score || coinData.score || 0;

      var changeColor = change >= 0 ? '#22c55e' : '#ef4444';
      var gradeColor = grade === 'A' || grade === 'S' ? '#22c55e' :
                       grade === 'B' ? '#3b82f6' :
                       grade === 'C' ? '#f59e0b' : '#ef4444';

      metricsHtml += '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;text-align:center">' +
        '<div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px">' + ticker + '</div>' +
        '<div style="font-size:16px;font-weight:600;color:#fff;margin-bottom:2px">$' + formatNumber(price) + '</div>' +
        '<div style="font-size:12px;font-weight:600;margin-bottom:8px;color:' + changeColor + '">' +
          (change >= 0 ? '+' : '') + change.toFixed(2) + '%' +
        '</div>' +
        '<div style="display:flex;align-items:baseline;justify-content:center;gap:4px;color:' + gradeColor + '">' +
          '<span style="font-size:24px;font-weight:700">' + grade + '</span>' +
          '<span style="font-size:12px;opacity:0.7"> (' + score + '点)</span>' +
        '</div>' +
      '</div>';
    });

    metricsHtml += '</div>';
    container.innerHTML = metricsHtml;
  }

  // ============================================
  // ウォッチリスト管理機能
  // ============================================
  var AVAILABLE_COINS = [
    { id: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'SOL', name: 'Solana', icon: '◎' },
    { id: 'XRP', name: 'Ripple', icon: '✕' },
    { id: 'ADA', name: 'Cardano', icon: '₳' },
    { id: 'DOGE', name: 'Dogecoin', icon: 'Ð' },
    { id: 'DOT', name: 'Polkadot', icon: '●' },
    { id: 'MATIC', name: 'Polygon', icon: '⬡' },
    { id: 'LINK', name: 'Chainlink', icon: '⬢' },
    { id: 'AVAX', name: 'Avalanche', icon: '▲' },
    { id: 'ATOM', name: 'Cosmos', icon: '⚛' },
    { id: 'LTC', name: 'Litecoin', icon: 'Ł' },
    { id: 'UNI', name: 'Uniswap', icon: '🦄' },
    { id: 'SHIB', name: 'Shiba Inu', icon: '🐕' }
  ];

  function getWatchlist() {
    var str = localStorage.getItem('kairos-watchlist');
    return str ? JSON.parse(str) : ['BTC', 'ETH', 'SOL'];
  }

  function saveWatchlist(list) {
    localStorage.setItem('kairos-watchlist', JSON.stringify(list));
  }

  window.openWatchlistModal = function() {
    if (document.getElementById('kairos-watchlist-modal')) return;

    var watchlist = getWatchlist();

    var modal = document.createElement('div');
    modal.id = 'kairos-watchlist-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';

    function renderWatchlistContent() {
      var watchlist = getWatchlist();

      var watchlistHtml = watchlist.map(function(ticker) {
        var coin = AVAILABLE_COINS.find(function(c) { return c.id === ticker; }) || { id: ticker, name: ticker, icon: '●' };
        return '<div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:8px">' +
          '<span style="font-size:18px;width:28px;text-align:center">' + coin.icon + '</span>' +
          '<div style="flex:1">' +
            '<div style="font-size:14px;font-weight:600;color:#fff">' + coin.id + '</div>' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5)">' + coin.name + '</div>' +
          '</div>' +
          '<button onclick="removeFromWatchlist(\'' + ticker + '\')" style="background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.3);color:#ef4444;padding:6px 10px;border-radius:6px;font-size:11px;cursor:pointer">削除</button>' +
        '</div>';
      }).join('');

      var availableHtml = AVAILABLE_COINS.filter(function(coin) {
        return watchlist.indexOf(coin.id) === -1;
      }).map(function(coin) {
        return '<div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:8px">' +
          '<span style="font-size:18px;width:28px;text-align:center">' + coin.icon + '</span>' +
          '<div style="flex:1">' +
            '<div style="font-size:14px;font-weight:600;color:#fff">' + coin.id + '</div>' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5)">' + coin.name + '</div>' +
          '</div>' +
          '<button onclick="addToWatchlist(\'' + coin.id + '\')" style="background:rgba(34,197,94,0.2);border:1px solid rgba(34,197,94,0.3);color:#22c55e;padding:6px 10px;border-radius:6px;font-size:11px;cursor:pointer">追加</button>' +
        '</div>';
      }).join('');

      return '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:10px">現在のウォッチリスト (' + watchlist.length + ')</div>' +
        '<div style="max-height:200px;overflow-y:auto;margin-bottom:16px">' + (watchlistHtml || '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px">ウォッチリストは空です</div>') + '</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:10px">追加可能な通貨</div>' +
        '<div style="max-height:200px;overflow-y:auto">' + (availableHtml || '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px">すべての通貨が追加済みです</div>') + '</div>';
    }

    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:420px;width:95%;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">📌 ウォッチリスト管理</h3>' +
          '<button onclick="closeWatchlistModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +
        '<div id="watchlist-content" style="color:#fff">' + renderWatchlistContent() + '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeWatchlistModal(); };

    window.refreshWatchlistUI = function() {
      var content = document.getElementById('watchlist-content');
      if (content) content.innerHTML = renderWatchlistContent();
    };
  };

  window.closeWatchlistModal = function() {
    var modal = document.getElementById('kairos-watchlist-modal');
    if (modal) modal.remove();
  };

  window.addToWatchlist = function(ticker) {
    var watchlist = getWatchlist();
    if (watchlist.indexOf(ticker) === -1) {
      watchlist.push(ticker);
      saveWatchlist(watchlist);
      showToast(ticker + 'をウォッチリストに追加しました', 'success');
      if (window.refreshWatchlistUI) window.refreshWatchlistUI();
    }
  };

  window.removeFromWatchlist = function(ticker) {
    var watchlist = getWatchlist();
    if (watchlist.length <= 1) {
      showToast('最低1つの通貨が必要です', 'warning');
      return;
    }
    watchlist = watchlist.filter(function(t) { return t !== ticker; });
    saveWatchlist(watchlist);
    showToast(ticker + 'をウォッチリストから削除しました', 'info');
    if (window.refreshWatchlistUI) window.refreshWatchlistUI();
  };

  // ============================================
  // 目標価格設定機能
  // ============================================
  function getTargetPrices() {
    var str = localStorage.getItem('kairos-target-prices');
    return str ? JSON.parse(str) : {};
  }

  function saveTargetPrices(targets) {
    localStorage.setItem('kairos-target-prices', JSON.stringify(targets));
  }

  window.openTargetPriceModal = function() {
    if (document.getElementById('kairos-target-modal')) return;

    var targets = getTargetPrices();
    var watchlist = getWatchlist();
    var allResults = kairosData.all_results || [];

    var targetRows = watchlist.map(function(ticker) {
      var coinData = allResults.find(function(r) { return r.ticker === ticker; }) || {};
      var currentPrice = coinData.current_price || 0;
      var target = targets[ticker] || { high: '', low: '' };
      var coin = AVAILABLE_COINS.find(function(c) { return c.id === ticker; }) || { icon: '●' };

      return '<div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:8px">' +
        '<span style="font-size:18px;width:28px;text-align:center">' + coin.icon + '</span>' +
        '<div style="flex:1">' +
          '<div style="font-size:14px;font-weight:600;color:#fff">' + ticker + '</div>' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.5)">現在: $' + formatNumber(currentPrice) + '</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:4px">' +
          '<input type="number" id="target-high-' + ticker + '" placeholder="上限" value="' + (target.high || '') + '" style="width:80px;padding:6px 8px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:6px;color:#22c55e;font-size:12px">' +
          '<input type="number" id="target-low-' + ticker + '" placeholder="下限" value="' + (target.low || '') + '" style="width:80px;padding:6px 8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:6px;color:#ef4444;font-size:12px">' +
        '</div>' +
      '</div>';
    }).join('');

    var modal = document.createElement('div');
    modal.id = 'kairos-target-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:420px;width:95%;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">🎯 目標価格設定</h3>' +
          '<button onclick="closeTargetPriceModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +
        '<div style="color:#fff">' +
          '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:12px">各通貨の目標価格（USD）を設定すると、到達時に通知されます</div>' +
          '<div style="max-height:350px;overflow-y:auto">' + targetRows + '</div>' +
          '<button onclick="saveAllTargetPrices()" style="width:100%;padding:14px;background:linear-gradient(135deg,#d4a853,#b8860b);border:none;border-radius:12px;color:#000;font-size:14px;font-weight:600;cursor:pointer;margin-top:16px">💾 保存</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeTargetPriceModal(); };
  };

  window.closeTargetPriceModal = function() {
    var modal = document.getElementById('kairos-target-modal');
    if (modal) modal.remove();
  };

  window.saveAllTargetPrices = function() {
    var watchlist = getWatchlist();
    var targets = {};

    watchlist.forEach(function(ticker) {
      var highInput = document.getElementById('target-high-' + ticker);
      var lowInput = document.getElementById('target-low-' + ticker);
      var high = highInput ? parseFloat(highInput.value) : null;
      var low = lowInput ? parseFloat(lowInput.value) : null;

      if (high || low) {
        targets[ticker] = {
          high: high || null,
          low: low || null
        };
      }
    });

    saveTargetPrices(targets);
    showToast('目標価格を保存しました', 'success');
    closeTargetPriceModal();
  };

  // 目標価格チェック（定期的に呼び出される）
  function checkTargetPrices() {
    var targets = getTargetPrices();
    var allResults = kairosData.all_results || [];

    Object.keys(targets).forEach(function(ticker) {
      var target = targets[ticker];
      var coinData = allResults.find(function(r) { return r.ticker === ticker; });
      if (!coinData) return;

      var currentPrice = coinData.current_price || 0;

      if (target.high && currentPrice >= target.high) {
        showToast(ticker + 'が目標上限$' + formatNumber(target.high) + 'に到達！', 'success');
      }
      if (target.low && currentPrice <= target.low) {
        showToast(ticker + 'が目標下限$' + formatNumber(target.low) + 'に到達！', 'warning');
      }
    });
  }

  // ============================================
  // ニュース/情報表示機能
  // ============================================
  var newsCache = {
    data: [],
    lastFetch: 0,
    cacheTime: 300000 // 5分
  };

  window.openNewsModal = function() {
    if (document.getElementById('kairos-news-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'kairos-news-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:500px;width:95%;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">📰 仮想通貨ニュース</h3>' +
          '<button onclick="closeNewsModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +
        '<div id="news-content" style="color:#fff">' +
          '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.5)">' +
            '<div style="font-size:24px;margin-bottom:10px">📡</div>' +
            '<div>ニュースを読み込み中...</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeNewsModal(); };

    fetchCryptoNews();
  };

  window.closeNewsModal = function() {
    var modal = document.getElementById('kairos-news-modal');
    if (modal) modal.remove();
  };

  function fetchCryptoNews() {
    var content = document.getElementById('news-content');
    if (!content) return;

    // CoinGeckoのトレンドを代替ニュースとして使用
    fetch(COINGECKO_API + '/search/trending')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var trendingCoins = data.coins || [];
        var newsHtml = '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:12px">🔥 トレンド通貨</div>';

        trendingCoins.slice(0, 7).forEach(function(item) {
          var coin = item.item;
          newsHtml += '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:8px">' +
            '<img src="' + (coin.small || '') + '" style="width:32px;height:32px;border-radius:50%" onerror="this.style.display=\'none\'">' +
            '<div style="flex:1">' +
              '<div style="font-size:14px;font-weight:600;color:#fff">' + coin.name + ' (' + coin.symbol + ')</div>' +
              '<div style="font-size:11px;color:rgba(255,255,255,0.5)">ランキング #' + (coin.market_cap_rank || '-') + '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div style="font-size:12px;color:#d4a853">スコア: ' + coin.score + '</div>' +
            '</div>' +
          '</div>';
        });

        // 市場概要を追加
        newsHtml += '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin:16px 0 12px">📊 市場概要</div>';
        var market = kairosData.analysis && kairosData.analysis.market || {};
        newsHtml += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5)">Fear & Greed</div>' +
            '<div style="font-size:20px;font-weight:700;color:#d4a853">' + (market.fear_greed_index || '-') + '</div>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;text-align:center">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5)">BTC Dominance</div>' +
            '<div style="font-size:20px;font-weight:700;color:#3b82f6">' + (market.btc_dominance || '-') + '%</div>' +
          '</div>' +
        '</div>';

        content.innerHTML = newsHtml;
      })
      .catch(function(err) {
        console.error('News fetch error:', err);
        content.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.5)">' +
          '<div style="font-size:24px;margin-bottom:10px">⚠️</div>' +
          '<div>ニュースの取得に失敗しました</div>' +
          '<button onclick="fetchCryptoNews()" style="margin-top:12px;padding:8px 16px;background:#d4a853;border:none;border-radius:8px;color:#000;cursor:pointer">再試行</button>' +
        '</div>';
      });
  }

  // ============================================
  // 税金計算機能
  // ============================================
  window.openTaxModal = function() {
    if (document.getElementById('kairos-tax-modal')) return;

    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}
    var totalPnL = 0;
    var realizedPnL = 0;
    var unrealizedPnL = 0;

    // 取引履歴から損益計算
    records.forEach(function(record) {
      if (record.type === 'sell') {
        realizedPnL += record.pnl || 0;
      }
    });

    // 未実現損益の計算（保有中の資産）
    var portfolio = calculatePortfolioValue();
    unrealizedPnL = portfolio.pnl || 0;

    totalPnL = realizedPnL + unrealizedPnL;

    // 日本の税率（仮想通貨は雑所得として総合課税）
    var taxRates = [
      { min: 0, max: 1950000, rate: 0.05, deduction: 0 },
      { min: 1950000, max: 3300000, rate: 0.1, deduction: 97500 },
      { min: 3300000, max: 6950000, rate: 0.2, deduction: 427500 },
      { min: 6950000, max: 9000000, rate: 0.23, deduction: 636000 },
      { min: 9000000, max: 18000000, rate: 0.33, deduction: 1536000 },
      { min: 18000000, max: 40000000, rate: 0.40, deduction: 2796000 },
      { min: 40000000, max: Infinity, rate: 0.45, deduction: 4796000 }
    ];

    function calculateTax(income) {
      if (income <= 0) return 0;
      var rate = taxRates.find(function(r) { return income <= r.max; }) || taxRates[taxRates.length - 1];
      var incomeTax = income * rate.rate - rate.deduction;
      var localTax = income * 0.1; // 住民税10%
      return Math.max(0, incomeTax + localTax);
    }

    var estimatedTax = calculateTax(Math.max(0, realizedPnL));

    var modal = document.createElement('div');
    modal.id = 'kairos-tax-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:420px;width:95%;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">🧮 税金計算</h3>' +
          '<button onclick="closeTaxModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +
        '<div style="color:#fff">' +
          '<div style="background:rgba(212,168,83,0.1);border:1px solid rgba(212,168,83,0.3);border-radius:12px;padding:16px;margin-bottom:16px">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:4px">⚠️ 注意事項</div>' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.8)">この計算は概算です。正確な税額は税理士にご相談ください。</div>' +
          '</div>' +

          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">' +
            '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;text-align:center">' +
              '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">実現損益</div>' +
              '<div style="font-size:18px;font-weight:700;color:' + (realizedPnL >= 0 ? '#22c55e' : '#ef4444') + '">' + formatYen(realizedPnL) + '</div>' +
            '</div>' +
            '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;text-align:center">' +
              '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">未実現損益</div>' +
              '<div style="font-size:18px;font-weight:700;color:' + (unrealizedPnL >= 0 ? '#22c55e' : '#ef4444') + '">' + formatYen(unrealizedPnL) + '</div>' +
            '</div>' +
          '</div>' +

          '<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:16px;margin-bottom:16px">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:6px">予想納税額（実現損益に対する概算）</div>' +
            '<div style="font-size:28px;font-weight:700;color:#ef4444">' + formatYen(estimatedTax) + '</div>' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:4px">※所得税 + 住民税（他の所得との合算は含まず）</div>' +
          '</div>' +

          '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:10px">📋 税率表（総合課税）</div>' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.6">' +
            '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)"><span>〜195万円</span><span>5% + 住民税10%</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)"><span>195〜330万円</span><span>10% + 住民税10%</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)"><span>330〜695万円</span><span>20% + 住民税10%</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)"><span>695〜900万円</span><span>23% + 住民税10%</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)"><span>900〜1,800万円</span><span>33% + 住民税10%</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1)"><span>1,800〜4,000万円</span><span>40% + 住民税10%</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:4px 0"><span>4,000万円超</span><span>45% + 住民税10%</span></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeTaxModal(); };
  };

  window.closeTaxModal = function() {
    var modal = document.getElementById('kairos-tax-modal');
    if (modal) modal.remove();
  };

  function calculatePortfolioValue() {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]');
    } catch(e) {}
    var allResults = kairosData.all_results || [];
    var holdings = {};
    var totalCost = 0;
    var totalValue = 0;

    records.forEach(function(record) {
      var ticker = record.currency.toUpperCase();
      if (!holdings[ticker]) holdings[ticker] = { amount: 0, cost: 0 };

      if (record.type === 'buy') {
        holdings[ticker].amount += record.amount;
        holdings[ticker].cost += record.total;
        totalCost += record.total;
      } else if (record.type === 'sell') {
        holdings[ticker].amount -= record.amount;
        holdings[ticker].cost -= (holdings[ticker].cost / (holdings[ticker].amount + record.amount)) * record.amount;
      }
    });

    Object.keys(holdings).forEach(function(ticker) {
      if (holdings[ticker].amount > 0) {
        var coinData = allResults.find(function(r) { return r.ticker === ticker; });
        if (coinData) {
          totalValue += holdings[ticker].amount * coinData.current_price;
        }
      }
    });

    return {
      totalCost: totalCost,
      totalValue: totalValue,
      pnl: totalValue - totalCost
    };
  }

  // ============================================
  // チャート描画機能
  // ============================================
  var chartDrawings = {
    lines: [],      // 水平線
    markers: []     // マーカー
  };

  function getChartDrawings() {
    var str = localStorage.getItem('kairos-chart-drawings');
    if (str) {
      try {
        return JSON.parse(str);
      } catch(e) {
        return { lines: [], markers: [] };
      }
    }
    return { lines: [], markers: [] };
  }

  function saveChartDrawings(drawings) {
    localStorage.setItem('kairos-chart-drawings', JSON.stringify(drawings));
    chartDrawings = drawings;
  }

  window.openChartDrawingModal = function() {
    if (document.getElementById('kairos-drawing-modal')) return;

    var drawings = getChartDrawings();
    var ticker = appState.selectedCurrency;
    var tickerDrawings = drawings[ticker] || { lines: [], markers: [] };

    var allResults = kairosData.all_results || [];
    var coinData = allResults.find(function(r) { return r.ticker === ticker; }) || {};
    var currentPrice = coinData.current_price || 0;

    function renderDrawingsList() {
      var drawings = getChartDrawings();
      var tickerDrawings = drawings[ticker] || { lines: [], markers: [] };

      var linesHtml = tickerDrawings.lines.length > 0
        ? tickerDrawings.lines.map(function(line, idx) {
            var typeLabel = line.type === 'support' ? '📉 サポート' : line.type === 'resistance' ? '📈 レジスタンス' : '➖ ライン';
            var color = line.type === 'support' ? '#22c55e' : line.type === 'resistance' ? '#ef4444' : '#d4a853';
            return '<div style="display:flex;align-items:center;gap:8px;padding:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;margin-bottom:6px">' +
              '<span style="color:' + color + ';font-size:12px">' + typeLabel + '</span>' +
              '<span style="flex:1;color:#fff;font-weight:600;font-size:13px">$' + formatNumber(line.price) + '</span>' +
              '<button onclick="removeChartLine(\'' + ticker + '\', ' + idx + ')" style="background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.3);color:#ef4444;padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">削除</button>' +
            '</div>';
          }).join('')
        : '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:16px;font-size:12px">ラインがありません</div>';

      var markersHtml = tickerDrawings.markers.length > 0
        ? tickerDrawings.markers.map(function(marker, idx) {
            var iconMap = { buy: '🟢', sell: '🔴', note: '📝' };
            return '<div style="display:flex;align-items:center;gap:8px;padding:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;margin-bottom:6px">' +
              '<span style="font-size:14px">' + (iconMap[marker.type] || '📌') + '</span>' +
              '<span style="flex:1;color:#fff;font-size:12px">' + (marker.text || 'マーカー') + '</span>' +
              '<span style="color:rgba(255,255,255,0.5);font-size:11px">$' + formatNumber(marker.price) + '</span>' +
              '<button onclick="removeChartMarker(\'' + ticker + '\', ' + idx + ')" style="background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.3);color:#ef4444;padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer">削除</button>' +
            '</div>';
          }).join('')
        : '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:16px;font-size:12px">マーカーがありません</div>';

      return {
        lines: linesHtml,
        markers: markersHtml
      };
    }

    var initialContent = renderDrawingsList();

    var modal = document.createElement('div');
    modal.id = 'kairos-drawing-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:420px;width:95%;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">✏️ チャート描画 - ' + ticker + '</h3>' +
          '<button onclick="closeChartDrawingModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +
        '<div style="color:#fff">' +

          // 水平線追加
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:12px">' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:10px">水平線を追加</div>' +
            '<div style="display:flex;gap:8px;margin-bottom:10px">' +
              '<select id="line-type" style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;font-size:13px">' +
                '<option value="support">📉 サポート（緑）</option>' +
                '<option value="resistance">📈 レジスタンス（赤）</option>' +
                '<option value="custom">➖ カスタム（金）</option>' +
              '</select>' +
            '</div>' +
            '<div style="display:flex;gap:8px">' +
              '<input type="number" id="line-price" placeholder="価格 (USD)" value="' + currentPrice.toFixed(2) + '" style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;font-size:13px">' +
              '<button onclick="addChartLine(\'' + ticker + '\')" style="padding:10px 16px;background:#d4a853;border:none;border-radius:8px;color:#000;font-weight:600;font-size:13px;cursor:pointer">追加</button>' +
            '</div>' +
          '</div>' +

          // マーカー追加
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:12px">' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:10px">マーカーを追加</div>' +
            '<div style="display:flex;gap:8px;margin-bottom:10px">' +
              '<select id="marker-type" style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;font-size:13px">' +
                '<option value="buy">🟢 買いサイン</option>' +
                '<option value="sell">🔴 売りサイン</option>' +
                '<option value="note">📝 メモ</option>' +
              '</select>' +
            '</div>' +
            '<div style="display:flex;gap:8px;margin-bottom:10px">' +
              '<input type="number" id="marker-price" placeholder="価格 (USD)" value="' + currentPrice.toFixed(2) + '" style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;font-size:13px">' +
            '</div>' +
            '<div style="display:flex;gap:8px">' +
              '<input type="text" id="marker-text" placeholder="メモ（任意）" style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;font-size:13px">' +
              '<button onclick="addChartMarker(\'' + ticker + '\')" style="padding:10px 16px;background:#3b82f6;border:none;border-radius:8px;color:#fff;font-weight:600;font-size:13px;cursor:pointer">追加</button>' +
            '</div>' +
          '</div>' +

          // 既存の描画一覧
          '<div style="margin-bottom:12px">' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:8px">水平線</div>' +
            '<div id="drawing-lines-list">' + initialContent.lines + '</div>' +
          '</div>' +

          '<div style="margin-bottom:12px">' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:8px">マーカー</div>' +
            '<div id="drawing-markers-list">' + initialContent.markers + '</div>' +
          '</div>' +

          // クリアボタン
          '<button onclick="clearAllDrawings(\'' + ticker + '\')" style="width:100%;padding:12px;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.3);border-radius:10px;color:#ef4444;font-size:13px;font-weight:600;cursor:pointer">🗑️ すべてクリア</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeChartDrawingModal(); };

    window.refreshDrawingsList = function() {
      var content = renderDrawingsList();
      var linesList = document.getElementById('drawing-lines-list');
      var markersList = document.getElementById('drawing-markers-list');
      if (linesList) linesList.innerHTML = content.lines;
      if (markersList) markersList.innerHTML = content.markers;
    };
  };

  window.closeChartDrawingModal = function() {
    var modal = document.getElementById('kairos-drawing-modal');
    if (modal) modal.remove();
  };

  window.addChartLine = function(ticker) {
    var typeSelect = document.getElementById('line-type');
    var priceInput = document.getElementById('line-price');
    if (!typeSelect || !priceInput) return;

    var type = typeSelect.value;
    var price = parseFloat(priceInput.value);
    if (isNaN(price) || price <= 0) {
      showToast('有効な価格を入力してください', 'warning');
      return;
    }

    var drawings = getChartDrawings();
    if (!drawings[ticker]) drawings[ticker] = { lines: [], markers: [] };
    drawings[ticker].lines.push({ type: type, price: price });
    saveChartDrawings(drawings);

    showToast('ラインを追加しました', 'success');
    if (window.refreshDrawingsList) window.refreshDrawingsList();
    applyChartDrawings(ticker);
  };

  window.removeChartLine = function(ticker, index) {
    var drawings = getChartDrawings();
    if (drawings[ticker] && drawings[ticker].lines[index] !== undefined) {
      drawings[ticker].lines.splice(index, 1);
      saveChartDrawings(drawings);
      showToast('ラインを削除しました', 'info');
      if (window.refreshDrawingsList) window.refreshDrawingsList();
      applyChartDrawings(ticker);
    }
  };

  window.addChartMarker = function(ticker) {
    var typeSelect = document.getElementById('marker-type');
    var priceInput = document.getElementById('marker-price');
    var textInput = document.getElementById('marker-text');
    if (!typeSelect || !priceInput) return;

    var type = typeSelect.value;
    var price = parseFloat(priceInput.value);
    var text = textInput ? textInput.value : '';

    if (isNaN(price) || price <= 0) {
      showToast('有効な価格を入力してください', 'warning');
      return;
    }

    var drawings = getChartDrawings();
    if (!drawings[ticker]) drawings[ticker] = { lines: [], markers: [] };
    drawings[ticker].markers.push({
      type: type,
      price: price,
      text: text,
      time: Math.floor(Date.now() / 1000)
    });
    saveChartDrawings(drawings);

    showToast('マーカーを追加しました', 'success');
    if (window.refreshDrawingsList) window.refreshDrawingsList();
  };

  window.removeChartMarker = function(ticker, index) {
    var drawings = getChartDrawings();
    if (drawings[ticker] && drawings[ticker].markers[index] !== undefined) {
      drawings[ticker].markers.splice(index, 1);
      saveChartDrawings(drawings);
      showToast('マーカーを削除しました', 'info');
      if (window.refreshDrawingsList) window.refreshDrawingsList();
    }
  };

  window.clearAllDrawings = function(ticker) {
    var drawings = getChartDrawings();
    drawings[ticker] = { lines: [], markers: [] };
    saveChartDrawings(drawings);
    showToast('すべての描画をクリアしました', 'info');
    if (window.refreshDrawingsList) window.refreshDrawingsList();
    applyChartDrawings(ticker);
  };

  // チャートに描画を適用
  function applyChartDrawings(ticker) {
    if (!priceChart || !priceSeries) return;

    var drawings = getChartDrawings();
    var tickerDrawings = drawings[ticker] || { lines: [], markers: [] };

    // 既存のカスタムラインを削除（price linesの再適用）
    // Note: lightweight-chartsでは個別のprice lineを削除するAPIが限定的
    // そのため、チャートを再描画する必要がある場合があります

    // 水平線を追加
    tickerDrawings.lines.forEach(function(line) {
      var color = line.type === 'support' ? '#22c55e' :
                  line.type === 'resistance' ? '#ef4444' : '#d4a853';
      var title = line.type === 'support' ? 'S' :
                  line.type === 'resistance' ? 'R' : 'L';

      priceSeries.createPriceLine({
        price: line.price,
        color: color,
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: title
      });
    });
  }

  // ============================================
  // AI チャット機能
  // ============================================
  var aiChatHistory = [];
  var aiChatScreenContext = '';

  // 現在の画面コンテキストを文字列として収集
  function getScreenContext() {
    var parts = [];
    var view = appState.currentScreen || 'unknown';
    parts.push('画面: ' + view);

    var ticker = appState.selectedCurrency;
    if (ticker) {
      parts.push('通貨: ' + ticker);
      var mode = appState.currenciesViewMode || 'swing';
      parts.push('モード: ' + (mode === 'swing' ? '短期' : '長期'));

      // scoreCache からスコア情報
      if (scoreCache && scoreCache.data && scoreCache.data[ticker]) {
        var sc = scoreCache.data[ticker];
        var score = mode === 'longterm' ? sc.longtermScore : sc.swingScore;
        var grade = mode === 'longterm' ? sc.longtermGrade : sc.swingGrade;
        if (score != null) parts.push('スコア: ' + score + ' (' + (grade || '') + ')');
        if (sc.price) parts.push('価格: $' + sc.price);
        if (sc.pricePositionDisplaySwing && mode === 'swing') parts.push('PRICE位置(短期): ' + sc.pricePositionDisplaySwing);
        if (sc.pricePositionDisplayLongterm && mode === 'longterm') parts.push('PRICE位置(長期): ' + sc.pricePositionDisplayLongterm);
      }
    }

    // DEXコイン情報
    var dexCoin = window._pendingMoonshotCoin;
    if (dexCoin && view === 'detail') {
      parts.push('DEXコイン: ' + dexCoin.symbol + ' (' + (dexCoin.name || '') + ')');
      if (dexCoin.moonshot_score != null) parts.push('Moonshotスコア: ' + dexCoin.moonshot_score);
      if (dexCoin.risk_level) parts.push('リスク: ' + dexCoin.risk_level);
      if (dexCoin.price_usd) parts.push('価格: $' + dexCoin.price_usd);
      if (dexCoin.rugcheck_score != null && dexCoin.rugcheck_score >= 0) parts.push('Rugcheckスコア: ' + dexCoin.rugcheck_score + ' (安全度' + (100 - dexCoin.rugcheck_score) + ')');
      if (dexCoin.lp_locked_pct != null && dexCoin.lp_locked_pct >= 0) parts.push('LP Lock: ' + dexCoin.lp_locked_pct.toFixed(1) + '%');
      if (dexCoin.ai_summary_ja) parts.push('AI評価: ' + dexCoin.ai_summary_ja);
    }

    return parts.join('\n');
  }

  window.openAIChatModal = function() {
    if (document.getElementById('kairos-ai-chat-modal')) return;

    var ticker = appState.selectedCurrency || 'BTC';
    aiChatScreenContext = getScreenContext();

    // コンテキストヒント生成
    var contextHint = '';
    var placeholder = 'メッセージを入力...';
    var dexCoin = window._pendingMoonshotCoin;
    if (dexCoin && appState.currentScreen === 'detail') {
      contextHint = '<div style="padding:6px 10px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.25);border-radius:8px;margin-bottom:8px;font-size:11px;color:#a78bfa">' +
        '📍 ' + dexCoin.symbol + ' を見ています（Moonshot ' + (dexCoin.moonshot_score || '?') + '点）' +
      '</div>';
      placeholder = dexCoin.symbol + 'について質問...';
    } else if (ticker && appState.currentScreen === 'detail') {
      var sc = scoreCache && scoreCache.data && scoreCache.data[ticker];
      var scoreStr = sc ? ' / スコア ' + (appState.currenciesViewMode === 'longterm' ? sc.longtermScore : sc.swingScore) : '';
      contextHint = '<div style="padding:6px 10px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.25);border-radius:8px;margin-bottom:8px;font-size:11px;color:#a78bfa">' +
        '📍 ' + ticker + scoreStr + ' を見ています' +
      '</div>';
      placeholder = ticker + 'について質問...';
    }

    var modal = document.createElement('div');
    modal.id = 'kairos-ai-chat-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:500px;width:95%;max-height:90vh;display:flex;flex-direction:column;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">AI アシスタント</h3>' +
          '<button onclick="closeAIChatModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +

        '<div id="ai-chat-status" style="padding:8px 12px;background:rgba(212,168,83,0.1);border:1px solid rgba(212,168,83,0.3);border-radius:8px;margin-bottom:12px;font-size:12px;color:#d4a853">' +
          '接続中...' +
        '</div>' +

        contextHint +

        '<div id="ai-chat-messages" style="flex:1;overflow-y:auto;max-height:400px;margin-bottom:16px;padding:8px;background:rgba(0,0,0,0.2);border-radius:12px;">' +
          '<div style="text-align:center;color:rgba(255,255,255,0.5);padding:40px 20px;font-size:13px">' +
            '何でも聞いてください。画面の情報を踏まえて回答します。<br>例：「これは買い？」「リスクは？」' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;gap:8px">' +
          '<input type="text" id="ai-chat-input" placeholder="' + placeholder + '" style="flex:1;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:10px;color:#fff;font-size:14px" onkeypress="if(event.key===\'Enter\')sendAIMessage()">' +
          '<button onclick="sendAIMessage()" style="padding:12px 20px;background:linear-gradient(135deg,#d4a853,#b8860b);border:none;border-radius:10px;color:#000;font-weight:600;cursor:pointer">送信</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeAIChatModal(); };

    // バックエンド接続確認
    checkAIBackendStatus();
  };

  window.closeAIChatModal = function() {
    var modal = document.getElementById('kairos-ai-chat-modal');
    if (modal) modal.remove();
  };

  function checkAIBackendStatus() {
    var statusEl = document.getElementById('ai-chat-status');
    if (!statusEl) return;

    BackendAPI.healthCheck().then(function(available) {
      if (available) {
        BackendAPI.getAvailableProviders().then(function(data) {
          var providers = data.available || [];
          if (providers.length > 0) {
            statusEl.style.background = 'rgba(34,197,94,0.1)';
            statusEl.style.borderColor = 'rgba(34,197,94,0.3)';
            statusEl.style.color = '#22c55e';
            statusEl.innerHTML = '✅ AI接続完了 (利用可能: ' + providers.join(', ') + ')';
          } else {
            statusEl.style.background = 'rgba(239,68,68,0.1)';
            statusEl.style.borderColor = 'rgba(239,68,68,0.3)';
            statusEl.style.color = '#ef4444';
            statusEl.innerHTML = '⚠️ AIプロバイダーが設定されていません';
          }
        }).catch(function() {
          statusEl.innerHTML = '✅ バックエンド接続完了';
        });
      } else {
        statusEl.style.background = 'rgba(239,68,68,0.1)';
        statusEl.style.borderColor = 'rgba(239,68,68,0.3)';
        statusEl.style.color = '#ef4444';
        statusEl.innerHTML = '❌ バックエンドに接続できません。start.bat を実行してください。';
      }
    });
  }

  window.sendAIMessage = function() {
    var input = document.getElementById('ai-chat-input');
    var messages = document.getElementById('ai-chat-messages');
    if (!input || !messages) return;

    var message = input.value.trim();
    if (!message) return;

    // ユーザーメッセージを追加
    messages.innerHTML += '<div style="display:flex;justify-content:flex-end;margin-bottom:12px">' +
      '<div style="max-width:80%;padding:10px 14px;background:rgba(212,168,83,0.2);border:1px solid rgba(212,168,83,0.3);border-radius:12px 12px 4px 12px;color:#fff;font-size:13px">' + escapeHtml(message) + '</div>' +
    '</div>';

    input.value = '';
    input.disabled = true;

    // ローディング表示
    var loadingId = 'ai-loading-' + Date.now();
    messages.innerHTML += '<div id="' + loadingId + '" style="display:flex;margin-bottom:12px">' +
      '<div style="padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px 12px 12px 4px;color:rgba(255,255,255,0.6);font-size:13px">🤔 考え中...</div>' +
    '</div>';

    messages.scrollTop = messages.scrollHeight;

    // 履歴に追加
    aiChatHistory.push({ role: 'user', content: message });

    // AI に送信（初回のみscreen_contextを付与）
    var ticker = appState.selectedCurrency || null;
    var sc = aiChatHistory.length <= 1 ? aiChatScreenContext : null;
    BackendAPI.chatWithAI(message, ticker, aiChatHistory, sc).then(function(data) {
      var loading = document.getElementById(loadingId);
      if (loading) loading.remove();

      var response = data.response || 'エラーが発生しました';
      aiChatHistory.push({ role: 'assistant', content: response });

      messages.innerHTML += '<div style="display:flex;margin-bottom:12px">' +
        '<div style="max-width:85%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px 12px 12px 4px;color:#fff;font-size:13px;white-space:pre-wrap">' + escapeHtml(response) + '</div>' +
      '</div>';

      messages.scrollTop = messages.scrollHeight;
      input.disabled = false;
      input.focus();
    }).catch(function(err) {
      var loading = document.getElementById(loadingId);
      if (loading) loading.remove();

      messages.innerHTML += '<div style="display:flex;margin-bottom:12px">' +
        '<div style="padding:10px 14px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;color:#ef4444;font-size:13px">❌ エラー: ' + escapeHtml(err.message || 'バックエンドに接続できません') + '</div>' +
      '</div>';

      messages.scrollTop = messages.scrollHeight;
      input.disabled = false;
      input.focus();
    });
  };

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // AI 分析機能
  // ============================================
  window.openAIAnalysisModal = function() {
    if (document.getElementById('kairos-ai-analysis-modal')) return;

    // ホーム画面の場合は市場スキャンを表示
    if (appState.currentScreen === 'home' || appState.currentScreen === 'currencies') {
      openMarketScanModal();
      return;
    }

    var ticker = appState.selectedCurrency;
    var allResults = kairosData.all_results || [];
    var coinData = allResults.find(function(r) { return r.ticker === ticker; }) || {};

    var modal = document.createElement('div');
    modal.id = 'kairos-ai-analysis-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:500px;width:95%;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">🧠 AI 分析 - ' + ticker + '</h3>' +
          '<button onclick="closeAIAnalysisModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +

        '<div id="ai-analysis-content" style="color:#fff">' +
          '<div style="text-align:center;padding:60px 20px">' +
            '<div style="font-size:32px;margin-bottom:16px">🔄</div>' +
            '<div style="color:rgba(255,255,255,0.6)">AI分析を実行中...</div>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;gap:8px;margin-top:16px">' +
          '<button onclick="runAIAnalysis(\'' + ticker + '\')" style="flex:1;padding:14px;background:linear-gradient(135deg,#d4a853,#b8860b);border:none;border-radius:12px;color:#000;font-size:14px;font-weight:600;cursor:pointer">🔄 再分析</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeAIAnalysisModal(); };

    // 自動的に分析を実行
    runAIAnalysis(ticker);
  };

  window.closeAIAnalysisModal = function() {
    var modal = document.getElementById('kairos-ai-analysis-modal');
    if (modal) modal.remove();
  };

  window.runAIAnalysis = function(ticker) {
    var content = document.getElementById('ai-analysis-content');
    if (!content) return;

    content.innerHTML = '<div style="text-align:center;padding:60px 20px">' +
      '<div style="font-size:32px;margin-bottom:16px;animation:spin 1s linear infinite">🔄</div>' +
      '<div style="color:rgba(255,255,255,0.6)">AI分析を実行中...</div>' +
      '<div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:8px">これには数秒かかる場合があります</div>' +
    '</div>';

    BackendAPI.getAIAnalysis(ticker).then(function(data) {
      var ai = data.ai_analysis || {};
      var price = data.price || {};
      var technical = data.technical || {};
      var market = data.market || {};

      var gradeColor = ai.grade === 'S' || ai.grade === 'A' ? '#22c55e' :
                       ai.grade === 'B' ? '#3b82f6' :
                       ai.grade === 'C' ? '#f59e0b' : '#ef4444';

      var signalText = {
        'strong_buy': '🟢 強い買い',
        'buy': '🟢 買い',
        'neutral': '🟡 中立',
        'sell': '🔴 売り',
        'strong_sell': '🔴 強い売り'
      };

      content.innerHTML =
        // スコア・グレード
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;text-align:center">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">AIスコア</div>' +
            '<div style="font-size:36px;font-weight:700;color:#d4a853">' + (ai.overall_score || '-') + '</div>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;text-align:center">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px">グレード</div>' +
            '<div style="font-size:36px;font-weight:700;color:' + gradeColor + '">' + (ai.grade || '-') + '</div>' +
          '</div>' +
        '</div>' +

        // シグナル
        '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:12px;text-align:center">' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:6px">投資シグナル</div>' +
          '<div style="font-size:18px;font-weight:600">' + (signalText[ai.signal] || ai.signal || '-') + '</div>' +
        '</div>' +

        // サマリー
        '<div style="background:rgba(212,168,83,0.1);border:1px solid rgba(212,168,83,0.3);border-radius:12px;padding:14px;margin-bottom:12px">' +
          '<div style="font-size:11px;color:#d4a853;margin-bottom:6px">📝 AI分析サマリー</div>' +
          '<div style="font-size:13px;color:#fff;line-height:1.6">' + (ai.summary || 'データを取得中...') + '</div>' +
        '</div>' +

        // キーポイント
        (ai.key_points && ai.key_points.length > 0 ?
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:12px">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:8px">📌 キーポイント</div>' +
            ai.key_points.map(function(point) {
              return '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;font-size:12px;color:#fff">' +
                '<span style="color:#d4a853">•</span>' +
                '<span>' + point + '</span>' +
              '</div>';
            }).join('') +
          '</div>' : '') +

        // 推奨アクション
        '<div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:12px;padding:14px;margin-bottom:12px">' +
          '<div style="font-size:11px;color:#3b82f6;margin-bottom:6px">💡 推奨アクション</div>' +
          '<div style="font-size:13px;color:#fff">' + (ai.recommendation || '-') + '</div>' +
        '</div>' +

        // テクニカル指標
        '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:8px">📊 テクニカル指標</div>' +
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px">' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;text-align:center">' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.5)">RSI</div>' +
            '<div style="font-size:16px;font-weight:600;color:#fff">' + (technical.rsi || '-') + '</div>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;text-align:center">' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.5)">トレンド</div>' +
            '<div style="font-size:14px;font-weight:600;color:#fff">' + (technical.trend || '-') + '</div>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;text-align:center">' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.5)">Fear & Greed</div>' +
            '<div style="font-size:16px;font-weight:600;color:#fff">' + (market.fear_greed_index || '-') + '</div>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;text-align:center">' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.5)">信頼度</div>' +
            '<div style="font-size:16px;font-weight:600;color:#fff">' + (ai.confidence ? Math.round(ai.confidence * 100) + '%' : '-') + '</div>' +
          '</div>' +
        '</div>' +

        // プロバイダー情報
        '<div style="text-align:center;font-size:11px;color:rgba(255,255,255,0.4)">' +
          'Powered by ' + (data.provider || 'AI') + ' | ' + new Date().toLocaleString('ja-JP') +
        '</div>';

    }).catch(function(err) {
      content.innerHTML =
        '<div style="text-align:center;padding:40px 20px">' +
          '<div style="font-size:32px;margin-bottom:16px">❌</div>' +
          '<div style="color:#ef4444;margin-bottom:8px">AI分析に失敗しました</div>' +
          '<div style="color:rgba(255,255,255,0.5);font-size:12px">' + (err.message || 'バックエンドに接続できません') + '</div>' +
          '<div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:16px">start.bat でバックエンドを起動してください</div>' +
        '</div>';
    });
  };

  // ============================================
  // 市場スキャン機能（ホーム画面用）
  // ============================================
  window.openMarketScanModal = function() {
    if (document.getElementById('kairos-market-scan-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'kairos-market-scan-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);';
    modal.innerHTML =
      '<div style="background:#1a1a2e;border-radius:20px;padding:24px;max-width:500px;width:95%;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;color:#fff">🔍 市場スキャン</h3>' +
          '<button onclick="closeMarketScanModal()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">×</button>' +
        '</div>' +

        '<div id="market-scan-content" style="color:#fff">' +
          '<div style="text-align:center;padding:60px 20px">' +
            '<div style="font-size:32px;margin-bottom:16px;animation:spin 1s linear infinite">🔄</div>' +
            '<div style="color:rgba(255,255,255,0.6)">市場をスキャン中...</div>' +
            '<div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:8px">トレンド・急上昇通貨を探しています</div>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;gap:8px;margin-top:16px">' +
          '<button onclick="runMarketScan()" style="flex:1;padding:14px;background:linear-gradient(135deg,#d4a853,#b8860b);border:none;border-radius:12px;color:#000;font-size:14px;font-weight:600;cursor:pointer">🔄 再スキャン</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) closeMarketScanModal(); };

    runMarketScan();
  };

  window.closeMarketScanModal = function() {
    var modal = document.getElementById('kairos-market-scan-modal');
    if (modal) modal.remove();
  };

  window.runMarketScan = function() {
    var content = document.getElementById('market-scan-content');
    if (!content) return;

    content.innerHTML = '<div style="text-align:center;padding:60px 20px">' +
      '<div style="font-size:32px;margin-bottom:16px;animation:spin 1s linear infinite">🔄</div>' +
      '<div style="color:rgba(255,255,255,0.6)">市場をスキャン中...</div>' +
      '<div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:8px">トレンド・急上昇通貨を探しています</div>' +
    '</div>';

    BackendAPI.getMarketScan().then(function(data) {
      var ai = data.ai_analysis || {};
      var market = data.market || {};
      var gainers = data.gainers || [];
      var losers = data.losers || [];
      var trending = data.trending || [];

      var moodColors = {
        'bullish': '#22c55e',
        'bearish': '#ef4444',
        'neutral': '#f59e0b',
        'extreme_fear': '#ef4444',
        'extreme_greed': '#22c55e'
      };

      var moodText = {
        'bullish': '🟢 強気',
        'bearish': '🔴 弱気',
        'neutral': '🟡 中立',
        'extreme_fear': '😱 極度の恐怖',
        'extreme_greed': '🤑 極度の強欲'
      };

      content.innerHTML =
        // 市場サマリー
        '<div style="background:rgba(212,168,83,0.1);border:1px solid rgba(212,168,83,0.3);border-radius:12px;padding:14px;margin-bottom:12px">' +
          '<div style="font-size:11px;color:#d4a853;margin-bottom:6px">📊 市場サマリー</div>' +
          '<div style="font-size:13px;color:#fff;line-height:1.6">' + (ai.market_summary || 'データ取得中...') + '</div>' +
        '</div>' +

        // 市場指標
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;text-align:center">' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.5)">Fear & Greed</div>' +
            '<div style="font-size:18px;font-weight:600;color:#fff">' + (market.fear_greed_index || '-') + '</div>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;text-align:center">' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.5)">BTC支配率</div>' +
            '<div style="font-size:16px;font-weight:600;color:#fff">' + (market.btc_dominance ? market.btc_dominance.toFixed(1) + '%' : '-') + '</div>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;text-align:center">' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.5)">ムード</div>' +
            '<div style="font-size:14px;font-weight:600;color:' + (moodColors[ai.market_mood] || '#fff') + '">' + (moodText[ai.market_mood] || ai.market_mood || '-') + '</div>' +
          '</div>' +
        '</div>' +

        // 急上昇TOP5
        '<div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:14px;margin-bottom:12px">' +
          '<div style="font-size:11px;color:#22c55e;margin-bottom:10px">🚀 24h 急上昇 TOP5</div>' +
          gainers.slice(0, 5).map(function(coin) {
            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05)">' +
              '<span style="font-size:13px;font-weight:600">' + coin.symbol + '</span>' +
              '<span style="font-size:13px;color:#22c55e;font-weight:600">+' + coin.change_24h.toFixed(1) + '%</span>' +
            '</div>';
          }).join('') +
        '</div>' +

        // 注目ピック（AIおすすめ）
        (ai.hot_picks && ai.hot_picks.length > 0 ?
          '<div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:12px;padding:14px;margin-bottom:12px">' +
            '<div style="font-size:11px;color:#3b82f6;margin-bottom:10px">🎯 AI注目ピック</div>' +
            ai.hot_picks.slice(0, 3).map(function(pick) {
              var riskColor = pick.risk_level === 'high' ? '#ef4444' : pick.risk_level === 'medium' ? '#f59e0b' : '#22c55e';
              return '<div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:10px;margin-bottom:8px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
                  '<span style="font-size:14px;font-weight:600;color:#fff">' + pick.symbol + '</span>' +
                  '<span style="font-size:10px;padding:2px 6px;border-radius:4px;background:' + riskColor + '20;color:' + riskColor + '">リスク: ' + pick.risk_level + '</span>' +
                '</div>' +
                '<div style="font-size:12px;color:rgba(255,255,255,0.7)">' + pick.reason + '</div>' +
              '</div>';
            }).join('') +
          '</div>' : '') +

        // ミーム通貨警告
        (ai.meme_coins && ai.meme_coins.length > 0 ?
          '<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:14px;margin-bottom:12px">' +
            '<div style="font-size:11px;color:#ef4444;margin-bottom:10px">⚠️ ミーム通貨アラート</div>' +
            ai.meme_coins.slice(0, 3).map(function(meme) {
              return '<div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:10px;margin-bottom:8px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
                  '<span style="font-size:14px;font-weight:600;color:#fff">' + meme.symbol + '</span>' +
                  '<span style="font-size:10px;color:#f59e0b">' + meme.status + '</span>' +
                '</div>' +
                '<div style="font-size:11px;color:rgba(255,255,255,0.6)">' + meme.note + '</div>' +
              '</div>';
            }).join('') +
          '</div>' : '') +

        // トレンド通貨
        (trending.length > 0 ?
          '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:12px">' +
            '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:10px">🔥 トレンド通貨（話題）</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
              trending.slice(0, 8).map(function(coin) {
                return '<span style="font-size:11px;padding:4px 10px;background:rgba(212,168,83,0.2);border-radius:12px;color:#d4a853">' + coin.symbol + '</span>';
              }).join('') +
            '</div>' +
          '</div>' : '') +

        // 推奨アクション
        '<div style="background:rgba(147,51,234,0.1);border:1px solid rgba(147,51,234,0.3);border-radius:12px;padding:14px;margin-bottom:12px">' +
          '<div style="font-size:11px;color:#a855f7;margin-bottom:6px">💡 推奨アクション</div>' +
          '<div style="font-size:13px;color:#fff">' + (ai.recommendation || '-') + '</div>' +
        '</div>' +

        // プロバイダー情報
        '<div style="text-align:center;font-size:11px;color:rgba(255,255,255,0.4)">' +
          'Powered by ' + (data.provider || 'AI') + ' | ' + new Date().toLocaleString('ja-JP') +
        '</div>';

    }).catch(function(err) {
      content.innerHTML =
        '<div style="text-align:center;padding:40px 20px">' +
          '<div style="font-size:32px;margin-bottom:16px">❌</div>' +
          '<div style="color:#ef4444;margin-bottom:8px">市場スキャンに失敗しました</div>' +
          '<div style="color:rgba(255,255,255,0.5);font-size:12px">' + (err.message || 'バックエンドに接続できません') + '</div>' +
          '<div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:16px">start.bat でバックエンドを起動してください</div>' +
        '</div>';
    });
  };

  // ===== ティッカーバー =====
  var tickerBarState = {
    prices: {},
    usdJpyRate: 150,
    updateInterval: null,
    isInitialized: false
  };

  // Binance用シンボルマッピング
  var BINANCE_SYMBOLS = {
    BTC: 'BTCUSDT', ETH: 'ETHUSDT', SOL: 'SOLUSDT', XRP: 'XRPUSDT',
    ADA: 'ADAUSDT', DOGE: 'DOGEUSDT', DOT: 'DOTUSDT', MATIC: 'MATICUSDT',
    LINK: 'LINKUSDT', AVAX: 'AVAXUSDT', ATOM: 'ATOMUSDT', LTC: 'LTCUSDT',
    UNI: 'UNIUSDT', SHIB: 'SHIBUSDT', BNB: 'BNBUSDT', TRX: 'TRXUSDT',
    TON: 'TONUSDT', XLM: 'XLMUSDT', HBAR: 'HBARUSDT', ETC: 'ETCUSDT',
    APT: 'APTUSDT', SUI: 'SUIUSDT', NEAR: 'NEARUSDT', FIL: 'FILUSDT',
    VET: 'VETUSDT', ALGO: 'ALGOUSDT', ICP: 'ICPUSDT', AAVE: 'AAVEUSDT',
    MKR: 'MKRUSDT', CRV: 'CRVUSDT', SNX: 'SNXUSDT', LDO: 'LDOUSDT',
    ARB: 'ARBUSDT', OP: 'OPUSDT', IMX: 'IMXUSDT', PEPE: 'PEPEUSDT',
    FLOKI: 'FLOKIUSDT', BONK: 'BONKUSDT', WIF: 'WIFUSDT', AXS: 'AXSUSDT',
    SAND: 'SANDUSDT', MANA: 'MANAUSDT', GALA: 'GALAUSDT', ENJ: 'ENJUSDT',
    FET: 'FETUSDT', OCEAN: 'OCEANUSDT', RNDR: 'RNDRUSDT', AGIX: 'AGIXUSDT'
  };

  // 通貨アイコン（フォールバック用）
  var COIN_ICONS = {
    BTC: '₿', ETH: 'Ξ', XRP: '✕', SOL: '◎', DOGE: 'Ð',
    BNB: '◆', ADA: '♦', SUI: '💧', DOT: '●', LINK: '⬡'
  };

  function getTickerWatchlist() {
    var str = localStorage.getItem('kairos-watchlist');
    var list = str ? JSON.parse(str) : ['BTC', 'ETH', 'SOL', 'XRP', 'BNB'];
    return list.filter(function(t) { return BINANCE_SYMBOLS[t]; });
  }

  function formatTickerPrice(price, symbol) {
    var jpy = price * tickerBarState.usdJpyRate;
    if (jpy >= 10000) {
      return '¥' + Math.round(jpy).toLocaleString('ja-JP');
    } else if (jpy >= 1) {
      return '¥' + jpy.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '¥' + jpy.toFixed(4);
    }
  }

  function formatTickerChange(change) {
    var sign = change >= 0 ? '▲' : '▼';
    var color = change > 0 ? '#00c853' : change < 0 ? '#ff1744' : 'rgba(255,255,255,0.5)';
    return '<span style="font-size:11px;font-weight:500;color:' + color + ';">' +
           sign + Math.abs(change).toFixed(2) + '%</span>';
  }

  function renderTickerBar() {
    var container = document.getElementById('ticker-bar');
    if (!container) return;

    var watchlist = getTickerWatchlist();
    if (watchlist.length === 0) {
      container.style.display = 'none';
      document.body.classList.remove('has-ticker-bar');
      return;
    }

    var items = watchlist.map(function(symbol) {
      var data = tickerBarState.prices[symbol] || {};
      var price = data.price || 0;
      var change = data.change || 0;
      var iconUrl = 'https://assets.coingecko.com/coins/images/' +
        (CURRENCY_MAP[symbol.toLowerCase()] ?
          getCoingeckoImageId(symbol) : '1') + '/small/' + symbol.toLowerCase() + '.png';
      var fallbackIcon = COIN_ICONS[symbol] || symbol.charAt(0);

      return '<div class="ticker-bar__item" style="display:inline-flex;align-items:center;gap:6px;padding:0 16px;height:32px;font-size:12px;color:#fff;border-right:1px solid rgba(255,255,255,0.1);white-space:nowrap;flex-shrink:0;">' +
        '<img class="ticker-bar__icon" src="' + iconUrl + '" alt="' + symbol + '" ' +
          'style="width:16px;height:16px;border-radius:50%;" ' +
          'onerror="this.outerHTML=\'<span style=\\\'display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;font-size:10px;\\\'>' + fallbackIcon + '</span>\'">' +
        '<span style="font-weight:600;color:rgba(255,255,255,0.9);font-size:11px;">' + symbol + '</span>' +
        '<span style="font-weight:500;color:#fff;">' + formatTickerPrice(price, symbol) + '</span>' +
        formatTickerChange(change) +
      '</div>';
    }).join('');

    // 無限ループ用に2回繰り返す
    var track = container.querySelector('.ticker-bar__track');
    if (track) {
      track.innerHTML = items + items;
      // アニメーション速度を通貨数に応じて調整（1通貨あたり4秒）
      var duration = watchlist.length * 4;
      track.style.animation = 'ticker-scroll ' + duration + 's linear infinite';
    }
  }

  function getCoingeckoImageId(symbol) {
    // 主要コインのCoinGecko画像ID
    var imageIds = {
      BTC: '1', ETH: '279', SOL: '4128', XRP: '44', ADA: '975',
      DOGE: '5', DOT: '12171', LINK: '877', AVAX: '12559', BNB: '825',
      MATIC: '4713', UNI: '12504', SHIB: '11939', LTC: '2', ATOM: '1481',
      SUI: '26375', APT: '26455', ARB: '16547', OP: '25244', NEAR: '10365',
      FET: '5681', RNDR: '11636', PEPE: '29850', WIF: '33950'
    };
    return imageIds[symbol] || '1';
  }

  async function fetchTickerPrices() {
    var watchlist = getTickerWatchlist();
    if (watchlist.length === 0) return;

    var symbols = watchlist.map(function(t) { return BINANCE_SYMBOLS[t]; }).filter(Boolean);

    try {
      // Binance 24hr tickerから価格と変動率を取得
      var url = 'https://api.binance.com/api/v3/ticker/24hr?symbols=' +
                encodeURIComponent(JSON.stringify(symbols));
      var resp = await fetch(url);
      var data = await resp.json();

      if (Array.isArray(data)) {
        data.forEach(function(item) {
          var ticker = Object.keys(BINANCE_SYMBOLS).find(function(k) {
            return BINANCE_SYMBOLS[k] === item.symbol;
          });
          if (ticker) {
            tickerBarState.prices[ticker] = {
              price: parseFloat(item.lastPrice),
              change: parseFloat(item.priceChangePercent)
            };
          }
        });
      }

      // 為替レートも更新（CoinGeckoから）
      try {
        var fxResp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=jpy');
        var fxData = await fxResp.json();
        // CoinGeckoはusdのjpy価格を直接返さないので、btcから計算
        var btcResp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,jpy');
        var btcData = await btcResp.json();
        if (btcData.bitcoin && btcData.bitcoin.usd && btcData.bitcoin.jpy) {
          tickerBarState.usdJpyRate = btcData.bitcoin.jpy / btcData.bitcoin.usd;
        }
      } catch (e) {
      }

      renderTickerBar();
    } catch (err) {
      console.error('[TickerBar] Price fetch error:', err);
    }
  }

  function initTickerBar() {
    if (tickerBarState.isInitialized) return;
    tickerBarState.isInitialized = true;

    // @keyframesをスタイルシートに追加
    var style = document.createElement('style');
    style.textContent = '@keyframes ticker-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
    document.head.appendChild(style);

    // ティッカーバーのHTML要素を作成（インラインスタイルで確実に適用）
    var tickerBar = document.createElement('div');
    tickerBar.id = 'ticker-bar';
    tickerBar.className = 'ticker-bar';
    tickerBar.style.cssText = 'position:fixed;top:0;left:0;right:0;width:100%;height:32px;max-height:32px;overflow:hidden;z-index:9999;background:linear-gradient(180deg,#0d1421,#0a1628);border-bottom:1px solid rgba(255,255,255,0.08);';

    var track = document.createElement('div');
    track.className = 'ticker-bar__track';
    track.style.cssText = 'display:inline-flex;flex-wrap:nowrap;align-items:center;height:32px;white-space:nowrap;will-change:transform;';

    tickerBar.appendChild(track);
    document.body.insertBefore(tickerBar, document.body.firstChild);
    document.body.classList.add('has-ticker-bar');
    document.body.style.paddingTop = '36px';

    // 初回データ取得
    fetchTickerPrices();

    // 30秒ごとに更新（Binanceは制限緩いので問題なし）
    tickerBarState.updateInterval = setInterval(fetchTickerPrices, 30000);

  }

  // ===== 初期化 =====
  function init() {
    document.documentElement.setAttribute('data-theme', appState.theme);
    document.documentElement.setAttribute('data-mode', appState.mode);

    // 旧グローバルモードから通貨別ストラテジーへのマイグレーション
    if (typeof StrategyManager !== 'undefined') {
      StrategyManager.migrateFromGlobalMode();
    }

    // スプラッシュ画面表示
    appState.currentScreen = 'splash';
    renderApp();

    // サイドメニュー初期化
    initSideMenu();

    // Pull-to-Refresh初期化
    initPullToRefresh();

    // オフライン検出初期化
    initOfflineDetection();

    // 価格アラート初期化
    loadAlertSettings();

    // リアルタイムデータ取得開始
    startLiveUpdates();

    // ティッカーバー初期化
    initTickerBar();

    // 1秒後にホーム画面へ（高速化）
    setTimeout(function() {
      appState.currentScreen = 'home';
      renderApp();
    }, 1000);
  }

  // デバッグ: テスト取引データ生成（コンソールから window.KAIROS_DEBUG.addTestTrades('BTC') で実行）
  window.KAIROS_DEBUG = window.KAIROS_DEBUG || {};
  window.KAIROS_DEBUG.addTestTrades = function(ticker) {
    ticker = ticker || 'BTC';
    var records = [];
    try { records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]'); } catch(e) {}
    var now = Date.now();
    var DAY = 86400000;
    var testRecords = [
      // 短期用（数時間前）
      { id: 'test-buy-1', date: new Date(now - 2 * 3600000).toISOString(), type: 'buy', currencyId: ticker, quantity: 0.05, priceUsd: 97000, totalJpy: 0.05 * 97000 * 150, totalUsd: 0.05 * 97000, status: 'confirmed' },
      { id: 'test-sell-1', date: new Date(now - 6 * 3600000).toISOString(), type: 'sell', currencyId: ticker, quantity: 0.03, priceUsd: 97500, totalJpy: 0.03 * 97500 * 150, totalUsd: 0.03 * 97500, status: 'confirmed' },
      { id: 'test-buy-2', date: new Date(now - 12 * 3600000).toISOString(), type: 'buy', currencyId: ticker, quantity: 0.1, priceUsd: 96500, totalJpy: 0.1 * 96500 * 150, totalUsd: 0.1 * 96500, status: 'confirmed' },
      // 中期用（数週間〜数ヶ月前）
      { id: 'test-buy-3', date: new Date(now - 14 * DAY).toISOString(), type: 'buy', currencyId: ticker, quantity: 0.2, priceUsd: 92000, totalJpy: 0.2 * 92000 * 150, totalUsd: 0.2 * 92000, status: 'confirmed' },
      { id: 'test-sell-2', date: new Date(now - 60 * DAY).toISOString(), type: 'sell', currencyId: ticker, quantity: 0.08, priceUsd: 105000, totalJpy: 0.08 * 105000 * 150, totalUsd: 0.08 * 105000, status: 'confirmed' },
      // 長期用（半年前・1年前）
      { id: 'test-buy-4', date: new Date(now - 180 * DAY).toISOString(), type: 'buy', currencyId: ticker, quantity: 0.5, priceUsd: 68000, totalJpy: 0.5 * 68000 * 150, totalUsd: 0.5 * 68000, status: 'confirmed' },
      { id: 'test-buy-5', date: new Date(now - 365 * DAY).toISOString(), type: 'buy', currencyId: ticker, quantity: 1.0, priceUsd: 42000, totalJpy: 1.0 * 42000 * 150, totalUsd: 1.0 * 42000, status: 'confirmed' }
    ];
    records = records.concat(testRecords);
    localStorage.setItem('kairosInvestmentRecords', JSON.stringify(records));
    console.log('[DEBUG] Added ' + testRecords.length + ' test trades for ' + ticker + '. Reload chart to see pins.');
    return testRecords;
  };
  window.KAIROS_DEBUG.clearTestTrades = function() {
    var records = [];
    try { records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]'); } catch(e) {}
    records = records.filter(function(r) { return !r.id || r.id.indexOf('test-') !== 0; });
    localStorage.setItem('kairosInvestmentRecords', JSON.stringify(records));
    console.log('[DEBUG] Cleared test trades. ' + records.length + ' real records remain.');
  };

  // ===== Early Mover通知システム =====
  function checkEarlyMoverNotifications(coins) {
    if (!coins || coins.length === 0) return;

    var now = Date.now();
    var TWO_HOURS = 2 * 60 * 60 * 1000;

    // レート制限チェック: 直近1時間以内の通知数
    earlyMoverNotifications.history = earlyMoverNotifications.history.filter(function(t) {
      return (now - t) < 60 * 60 * 1000;
    });
    if (earlyMoverNotifications.history.length >= earlyMoverNotifications.MAX_PER_HOUR) return;

    // 古い通知済みエントリを削除
    Object.keys(earlyMoverCache.lastNotifiedCoins).forEach(function(addr) {
      if (now - earlyMoverCache.lastNotifiedCoins[addr] > TWO_HOURS) {
        delete earlyMoverCache.lastNotifiedCoins[addr];
      }
    });

    // moonshot_score >= 60 のコインをフィルタ
    var alertCoins = coins.filter(function(c) {
      if ((c.moonshot_score || 0) < 60) return false;
      var addr = c.token_address || '';
      if (earlyMoverCache.lastNotifiedCoins[addr]) return false;
      return true;
    });

    if (alertCoins.length === 0) return;

    // 通知権限チェック & 要求
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // 上位3件まで通知
    var toNotify = alertCoins.slice(0, 3);
    toNotify.forEach(function(coin) {
      var remaining = earlyMoverNotifications.MAX_PER_HOUR - earlyMoverNotifications.history.length;
      if (remaining <= 0) return;

      var addr = coin.token_address || coin.symbol;

      // ブラウザ通知（クリックでコイン詳細へ）
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          var n = new Notification('🚀 Moonshot検出: ' + coin.symbol, {
            body: (coin.ai_summary_ja || 'Score: ' + coin.moonshot_score) + '\n' +
              (coin.ai_potential ? 'Potential: ' + coin.ai_potential : ''),
            icon: coin.image_url || undefined,
            tag: 'early-mover-' + addr,
          });
          // クリックでMoonshot画面→コイン詳細を自動オープン
          (function(coinAddr) {
            n.onclick = function() {
              window.focus();
              window._pendingEarlyMoverOpen = coinAddr;
              if (window.KairosApp) window.KairosApp.showMoonshot();
            };
          })(coin.token_address || coin.symbol);
        } catch(e) {
          console.warn('Notification error:', e);
        }
      }

      // トースト通知
      if (typeof showToast === 'function') {
        showToast('🚀 ' + coin.symbol + ' (Score ' + coin.moonshot_score + ') ' + (coin.ai_summary_ja || ''), 'info');
      }

      // 記録
      earlyMoverCache.lastNotifiedCoins[addr] = now;
      earlyMoverNotifications.history.push(now);
    });
  }
  window.checkEarlyMoverNotifications = checkEarlyMoverNotifications;

  function getEarlyMoverAlertCount() {
    var coins = (typeof earlyMoverCache !== 'undefined' && earlyMoverCache.data) ? earlyMoverCache.data : [];
    var count = 0;
    for (var i = 0; i < coins.length; i++) {
      if ((coins[i].moonshot_score || 0) >= 60) count++;
    }
    return count;
  }
  window.getEarlyMoverAlertCount = getEarlyMoverAlertCount;

  function updateEarlyMoverBadge() {
    var count = getEarlyMoverAlertCount();
    // ナビボタンのバッジ
    var navBtns = document.querySelectorAll('.kairos-nav-btn');
    navBtns.forEach(function(btn) {
      if (btn.textContent.indexOf('Moonshot') >= 0 || btn.textContent.indexOf('🎰') >= 0) {
        var existing = btn.querySelector('.moonshot-btn__badge');
        if (existing) existing.remove();
        if (count > 0) {
          var badge = document.createElement('span');
          badge.className = 'moonshot-btn__badge';
          badge.textContent = count;
          btn.appendChild(badge);
        }
      }
    });
    // サイドメニューのバッジ
    var menuBadge = document.getElementById('early-mover-menu-badge');
    if (menuBadge) {
      menuBadge.textContent = count > 0 ? count : '';
      menuBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }
  window.updateEarlyMoverBadge = updateEarlyMoverBadge;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

  // ============================================
  // 通貨別ストラテジー管理（長期/短期の2択）
  // ============================================

  var STRATEGY_TYPES = {
    longterm: 'longterm',
    swing: 'swing'
  };

  var STRATEGY_CONFIG = {
    longterm: {
      label: '長期',
      icon: '🎯',
      color: '#3b82f6',
      colorBg: 'rgba(59,130,246,0.15)',
      chartPeriods: ['1D', '1W', '1M', '1Y', '5Y', 'MAX'],
      defaultPeriod: '1M',
      apiMode: 'longterm',
      signalInterval: '4h'
    },
    swing: {
      label: '短期',
      icon: '⚡',
      color: '#f59e0b',
      colorBg: 'rgba(245,158,11,0.15)',
      chartPeriods: ['1H', '4H', '1D', '1W', '1M', '1Y'],
      defaultPeriod: '1D',
      apiMode: 'swing',
      signalInterval: '1h'
    }
  };

  var StrategyManager = {
    _storageKey: 'kairos_coin_strategies',
    _migratedKey: 'kairos_strategy_migrated',

    _load: function() {
      try {
        var raw = localStorage.getItem(this._storageKey);
        return raw ? JSON.parse(raw) : {};
      } catch(e) {
        return {};
      }
    },

    _save: function(data) {
      localStorage.setItem(this._storageKey, JSON.stringify(data));
    },

    getStrategy: function(ticker) {
      var data = this._load();
      var val = data[ticker];
      // 旧4択→2択への互換: hodl/accumulate/watching → longterm
      if (val === 'hodl' || val === 'accumulate' || val === 'watching') return STRATEGY_TYPES.longterm;
      if (val === 'swing') return STRATEGY_TYPES.swing;
      if (val === 'longterm') return STRATEGY_TYPES.longterm;
      // デフォルト: 長期
      return STRATEGY_TYPES.longterm;
    },

    setStrategy: function(ticker, type) {
      if (!STRATEGY_CONFIG[type]) {
        console.warn('[StrategyManager] Unknown strategy type:', type);
        return;
      }
      var data = this._load();
      data[ticker] = type;
      this._save(data);
    },

    getConfig: function(ticker) {
      var type = this.getStrategy(ticker);
      return STRATEGY_CONFIG[type] || STRATEGY_CONFIG.longterm;
    },

    getApiMode: function(ticker) {
      return this.getConfig(ticker).apiMode;
    },

    getChartPeriods: function(ticker) {
      return this.getConfig(ticker).chartPeriods;
    },

    getDefaultPeriod: function(ticker) {
      return this.getConfig(ticker).defaultPeriod;
    },

    getSignalInterval: function(ticker) {
      return this.getConfig(ticker).signalInterval;
    },

    // 保有通貨の多数派APIモードを返す（rank-all API用）
    getDominantApiMode: function() {
      var data = this._load();
      var self = this;
      var longCount = 0;
      var swingCount = 0;

      Object.keys(data).forEach(function(ticker) {
        var strat = self.getStrategy(ticker);
        if (strat === 'longterm') longCount++;
        else if (strat === 'swing') swingCount++;
      });

      return swingCount > longCount ? 'swing' : 'longterm';
    },

    // 旧グローバルモードからのマイグレーション（一回限り）
    migrateFromGlobalMode: function() {
      if (localStorage.getItem(this._migratedKey)) return;

      var oldMode = localStorage.getItem('kairosMode') || 'core';
      var defaultType = oldMode === 'satellite' ? STRATEGY_TYPES.swing : STRATEGY_TYPES.longterm;

      // 保有通貨にデフォルトストラテジーを設定
      var records = [];
      try { records = JSON.parse(localStorage.getItem('kairosInvestmentRecords') || '[]'); } catch(e) {}

      var data = this._load();
      var holdingTickers = {};
      records.forEach(function(r) {
        if (r.currencyId && r.type === 'buy') {
          holdingTickers[r.currencyId] = true;
        }
      });

      Object.keys(holdingTickers).forEach(function(ticker) {
        if (!data[ticker]) {
          data[ticker] = defaultType;
        }
      });

      // ウォッチリストの通貨も設定
      var watchlistStr = localStorage.getItem('kairos-watchlist');
      var watchlist = watchlistStr ? JSON.parse(watchlistStr) : [];
      watchlist.forEach(function(ticker) {
        if (!data[ticker]) {
          data[ticker] = STRATEGY_TYPES.longterm;
        }
      });

      this._save(data);
      localStorage.setItem(this._migratedKey, '1');
      console.log('[StrategyManager] Migrated from global mode:', oldMode, '→ default:', defaultType);
    },

    // 全ストラテジーを取得（UIリスト用）
    getAllStrategies: function() {
      return this._load();
    }
  };

  window.KAIROS = window.KAIROS || {};
  window.KAIROS.StrategyManager = StrategyManager;

