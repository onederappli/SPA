// グローバル変数
var Global = {};
Global.enable_sound = [];	// 読み込みが完了して再生可能なサウンドファイル
Global.loading = false;		// ページローディング中フラグ
Global.review_flag = false;	// 申請時用フラグ
Global.os = '';				// os (iOS or Android)
Global.storeURL = '';		// その他のアプリへのリンク

// ブラウザチェック
//========================================================
// iOS
if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0) {
	Global.os = 'iOS';
	Global.storeURL = 'https://itunes.apple.com/jp/artist/koike-jun/id999607803';
// Android
} else if ( navigator.userAgent.indexOf('Android') > 0 ) {
	Global.os = 'Android';
	Global.storeURL = 'https://play.google.com/store/apps/developer?id=OnederAppli';
// PC (PCからアクセスは禁止　別ページに飛ばす)
} else {
 	location.href = 'http://onederappli.jp';
}

//画面サイズフィット対応
//========================================================
if ( Global.os==='Android' || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0){
	// 画面サイズフィット処理
	var zoom = window.innerWidth / 320;
	var html = document.getElementsByTagName('html')[0];
	html.style.zoom = zoom;
}

// Require設定
//========================================================
require.config({
	baseUrl: 'js/',
	shim: {
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	},
	paths: {
		'jquery':        'lib/jquery.min',
		'underscore':    'lib/underscore-min',
		'backbone':      'lib/backbone-min',
		'app':      'app',
	},
	urlArgs: 'bust=' +  (new Date()).getTime()  //開発用（キャッシュさせないようにする）
});
     
// アプリ開始
//========================================================
require(['router','lib/boombox.min'], function (AppRouter, boombox) {
	// iOSの場合はヘッダーにロゴを表示
	if ( Global.os != 'Android' ) $('.img-ad').css({'display':'block'});

	// サウンド初期設定
	Global.boombox = boombox;
	if ( Global.os=='iOS' ) {
		Global.boombox.setup({
			webaudio:  { use: true  },
			htmlaudio: { use: false },
			htmlvideo: { use: false }
		});
	} else {
		Global.boombox.setup({});
	}

	// 共通サウンド読み込み
	var list = ["se_button_1"];
	_.each(list, function(file){
		var options = { src: [{media: 'audio/mp3',path: 'sound/' + file + ".mp3"}] };
		Global.boombox.load(file, options, function (err, audio) {
			Global.enable_sound[file] = true;
		});
	});
	// se属性指定によるサウンド再生設定
	$("#wrapper").on("touchstart", "[se]", function(e){
		var se = $(e.currentTarget).attr("se");
		if( typeof(Global.enable_sound[se])!="undefined" ){
			Global.boombox.get(se).power(Global.boombox.POWER_OFF);
			Global.boombox.get(se).power(Global.boombox.POWER_ON);
			Global.boombox.get(se).volume(1.0);
			Global.boombox.get(se).play();
		}
	});

	// ボタン押下設定
	$("#content").on("touchstart", "[class^='btn-']", function(e){
		$(e.currentTarget).addClass("on");
	}).on("touchend", "[class^='btn-']", function(e){
		$(e.currentTarget).removeClass("on");
	});

	// 再読み込み
	$('.reload').on("touchstart", function(e){
		// オンライン時は再読み込み
		if (navigator.onLine){
			location.reload();
		// オフライン時は注意文表示
		} else {
			$('.txt-offline').show();
		}
	});

	new AppRouter();
	Backbone.history.start();
});

