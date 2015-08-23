// ゲームメイン
define(['view/BaseView'], function (BaseView) {
	var View = BaseView.extend({
		pageName: "game",
		tagName: "div",
		id: "cnt-game",
	});

	return View;
});