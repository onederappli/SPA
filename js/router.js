define(['backbone'], function (Backbone) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			''				:'index',	// トップ
			'index'			:'index',	// トップ
			'game'			:'game',	// ゲームメイン
		},
		// トップ
		index: function(){
			require(['view/IndexView'], function(View){
				new View();
			});
		},
		// ゲームメイン
		game: function(){
			require(['view/GameView'], function(View){
				new View();
			});
		},
  	});
	return AppRouter;
});
