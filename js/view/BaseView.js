// 共通ビュークラス
define(['jquery','underscore','backbone'], function ($, _, Backbone) {
	var BaseView = Backbone.View.extend({
		//================================
		// 初期化
		//================================
		before: function(attr){
			// initialize前に何か処理をする場合にオーバーライドして使う
		},
		initialize: function(attr){
			this.before(attr);
			console.log("View初期化:" + this.pageName);
			this.template = _.template( this.mGetTemplate(this.pageName) );

			// 属性指定による遷移イベント追加
			var _this = this;
			this.$el.on("touchstart", "[auto-href]", function(e){
				_this.mLocation($(e.currentTarget).attr("auto-href"));
			});

			// SE読み込み
			if( typeof(this.se_list)!="undefined" ){
				_.each(this.se_list, function(file){
					_this.mSoundLoad({file:file});
				});
			}

			this.initialized(attr);
		},
		initialized: function(attr){
			// データを取得してからrenderしたい場合にオーバーライドして使う
			this.render(attr);
		},

		//================================
		// 描画
		//================================
		render: function(attr){
			var obj = {};
			if ( typeof(attr)!="undefined" && typeof(attr.obj)!="undefined" ) obj = attr.obj;
			this.$el.html(this.template(obj));
			$("#content").html(this.el);

			//スクロール禁止
			$("body").on("touchstart", function(e) { e.preventDefault(); });

			//ローディング画面非表示
			$("#css").load(function(){
				$(".loading").fadeOut(500,function(){ Global.loading = false; });
			});

			// 描画後処理
			this.rendered(attr);

			return this;
		},
		rendered: function(attr){
			// render終了後に呼ばれるので各ページでオーバーライドして使う
		},

		//================================
		// 画面遷移(ページ指定)
		//================================
		mLocation: function(page) {
			Global.loading = true;
			this.delegateEvents({});	// 念のためイベントを切っておく
			$(".loading").fadeIn(500, function(){
				$('.mask').hide();
				location.href = page;
			});
		},

		//================================
		// テンプレート取得
		//================================
		mGetTemplate: function(tmpl_name) {
			var tmpl_url = 'views/' + tmpl_name + '.php';
			var tmpl_string;
			$.ajax({
				url: tmpl_url,
				method: 'GET',
				async: false,
				dataType: "html",
				success: function(data) {
					tmpl_string = data;
				},
				error: function(){
					console.log("error");
				}
			});
			return tmpl_string;
		},
		//================================
		// データ取得用モデルを返す
		//================================
		mGetDataModel: function(url){
			var DataModel = new ( Backbone.Model.extend({ urlRoot:url }) );
			return DataModel;
		},
		//================================
		// 共通ポップアップ表示
		//================================
		mPopShow: function(setting) {
			var $pop = $("#pop-common").off().removeClass().addClass(setting.class).attr({"select": setting.select});
			$pop.find(".prt-pop-body").html(setting.body);
			$pop.find(".btn-select1").html(setting.btn1);
			$pop.find(".btn-select2").html(setting.btn2);
			// 表示位置設定
			var top = 100;
			if ( typeof(setting.top)!="undefined" ) top = setting.top;

			$pop.removeClass("pop-hide").addClass("pop-show").show().css({top:top+'px'});
			$(".mask").show();
			this.mSoundPlay({file:"se_popup_show"});
		},
		//================================
		// 共通ポップアップ非表示
		//================================
		mPopHide: function() {
			$("#pop-common").removeClass("pop-show").addClass("pop-hide").one("webkitAnimationEnd", function(){
				$(this).removeClass().hide();
			});
			$(".mask").hide();
			this.mSoundStop({file:"se_popup_show"});
		},
		//================================
		// サウンドを読み込む
		//================================
		mSoundLoad: function(setting){
			var options = { src: [ {media: 'audio/mp3', path: 'sound/' + setting.file + '.mp3'}] };
			Global.boombox.load(setting.file, options, function (err, audio) {
				Global.enable_sound[setting.file] = true;
				if ( typeof(setting.deferred)!="undefined" ) {
					setting.deferred.resolve();
				}
			});
		},
		//================================
		// サウンド再生
		//================================
		mSoundPlay: function(option){
			if ( typeof(Global.enable_sound[option.file])=="undefined" ) return;
			if ( typeof(option.loop) && option.loop==true ) {
				Global.boombox.get(option.file).setLoop(Global.boombox.LOOP_NATIVE);
			}
			Global.boombox.get(option.file).power(Global.boombox.POWER_OFF);
			Global.boombox.get(option.file).power(Global.boombox.POWER_ON);
			Global.boombox.get(option.file).volume(1.0);
			Global.boombox.get(option.file).play();
		},
		//================================
		// サウンド停止
		//================================
		mSoundStop: function(option){
			if ( typeof(Global.enable_sound[option.file])=="undefined" ) return;
			Global.boombox.get(option.file).power(Global.boombox.POWER_OFF);
		},
	});

	return BaseView;
});