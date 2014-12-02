 // 初始化一个MuPlayer的实例。注意，我们默认使用了_mu全局命名空间。
    var player = new _mu.Player({
        // baseDir是必填初始化参数，指向刚才签出的MuPlayer静态资源目录
        baseDir: 'js'
    });
    // 通过add方法添加需要播放的音频，并调用play方法开始播放。
//  player.add('http://music.baidu.com/cms/app/muplayer/test_mp3/1.mp3').play();
    //歌词
    
    //获取当前的歌曲，并配置好歌曲名称，背景图，歌词等 
    
    
    //通过add添加多个mp3
      var  $player = $('.player-widget'),
        $opts = $player.find('.opts'),
        $ctrlBtn = $opts.find('.ctrl'),
        $ctrlIcon = $ctrlBtn.find('i'),
        $prevBtn = $opts.find('.prev'),
        $nextBtn = $opts.find('.next'),
        $modeBtn = $opts.find('.mode'),
        $modeIcon = $modeBtn.find('i'),
        $volume = $player.find('.volume'),
        $progress = $player.find('.progress-bar'),
        $avatar = $player.find('.avatar'),
        $author = $("#player-author"),

        // 监听播放时派发的timeupdate事件以更新播放进度条等相关UI
       handleTimeupdate = function() {
            var pos = player.curPos(),
                duration = player.duration();
            $progress.slider('option', 'value', duration ? pos / duration * 1000 : 0);
        };
        
          // 在各个按钮上监听点击事件，触发时改变按钮的对应样式，并执行player的相应方法
    $ctrlBtn.click(function() {
        if ($ctrlIcon.hasClass('fa-play')) {
            $ctrlIcon.removeClass('fa-play').addClass('fa-pause');
            player.pause();
        } else if ($ctrlIcon.hasClass('fa-pause')) {
            $ctrlIcon.removeClass('fa-pause').addClass('fa-play');
             player.play();
        }
    });

  $prevBtn.click(function() {
        player.prev();
    });

    $nextBtn.click(function() {
        player.next();
    });

    var modes = ['loop', 'list-random'],
        modeIndex = 0;
    $modeBtn.click(function() {
        var mode = modes[++modeIndex % 2];
        player.setMode(mode);
        if (mode === 'loop') {
            $modeIcon.removeClass('fa-random').addClass('fa-refresh');
        } else {
            $modeIcon.removeClass('fa-refresh').addClass('fa-random');
        }
    });

    $volume.find('i').click(function() {
        var $this = $(this),
            isMute = player.getMute();

        if (isMute) {
            $this.removeClass('fa-volume-off')
                .addClass('fa-volume-down').parent().removeClass('mute');
            player.setMute(false);
        } else {
            $this.removeClass('fa-volume-down')
                .addClass('fa-volume-off').parent().addClass('mute');
            player.setMute(true);
        }
    });

    $volume.find('.bar').slider({
        value: player.getVolume(),
        range: 'min',
        slide: function(e, ui) {
            player.setVolume(ui.value);
        },
        stop: function(e, ui) {
            $(ui.handle).blur();
        }
    });

    // 通过jquery-ui的slider组件实现播放进度条的交互
    $progress.slider({
        range: 'min',
        max: 1000,
        disabled: true,
        start: function() {
            // 为了使拖动操作不受打断，进度条拖动操作开始时即暂停对timeupdate事件的监听
//          player.off('timeupdate');
        },
        stop: function(e, ui) {
            // 拖动结束时再恢复对timeupdate事件的监听
            player.on('timeupdate', handleTimeupdate).play(ui.value * player.duration());
            $(ui.handle).blur();
        }
    });
    
     // 事件驱动的UI：即UI应监听player派发的事件，以决定是否切换到对应的状态
    player.on('player:play', function() {
        $progress.slider('enable');
        $ctrlIcon.removeClass('fa-pause').addClass('fa-play');
    }).on('player:pause player:stop', function() {
        $progress.slider('disable');
        $ctrlIcon.removeClass('fa-play').addClass('fa-pause');
    }).on('timeupdate', handleTimeupdate).on('player:fetchend', function(r) {
    	console.log(r);
        var info = r.songinfo;
        if (info) {
            var title = info.title + ' - ' + info.author;
            $avatar.attr({
                title: title
            }).find('img').attr({
                alt: title,
                src: info.pic_small
            });
        }
    });


var showMp3Body = true;

//顶部，打开列表界面 
$("#info").click(function(){
	if(showMp3Body){
		//歌曲歌词隐藏
		$("#mp3body").css("display","none");
		//歌曲列表界面显示
		$("#player-list").css("display","block");
		showMp3Body = false;
	}else{
		//歌曲歌词隐藏
		$("#mp3body").css("display","block");
		//歌曲列表界面显示
		$("#player-list").css("display","none");
		showMp3Body = true;
	}
});

$("#player-list").css("display","none");








    