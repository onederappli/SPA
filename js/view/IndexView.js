// トップ
define(['view/BaseView'], function (BaseView) {
	var View = BaseView.extend({
		pageName: "index",
		tagName: "div",
		id: "cnt-index",

		//イベント登録
		events: {
			"touchstart .btn-other"					: "mOtherAppli",	// その他アプリ
			"touchstart .btn-pop"					: "mPopSample",		// ポップアップ
			"touchstart .pop-sample .btn-select1"	: "mPopHide",		// 閉じる
		},

		// その他アプリ
		mOtherAppli: function(){
			window.open('http://onederappli.jp/?page_id=24');
		},
		// ポップアップサンプル
		mPopSample: function(){
			this.mPopShow({
				class: "pop-sample",
				body: 'ポップアップサンプル',
				select: 1,
				btn1: "閉じる",
			});
		}
	});

	return View;
});