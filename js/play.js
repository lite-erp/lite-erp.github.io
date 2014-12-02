



/**
 * 播放器
 */
var XPlayer = function(player){
	this.title = $("#player-author");
	this.playlist = {};//当前的播放列表
	this.list = [];
	this.playing = {};//当前正在播放的mp3
	this.lrcs = {};//lrc内容缓存
	this.currentIndex = 0;
    this.lyric = null;//当前播放mp3的歌词
    this.lyricStyle = 0;
    this.lyricWrapper = $("#lyricWrapper");
    this.lyricContainer = $("#lyricContainer");
    this.playlistul = $("#playlist");
    
    //初始化
    this.init = function(){
    	this.initList();
    };
    
    //初始化播放列表
    this.initList = function(){
    	var scope = this;
    	 $.getJSON("content/content.json",function(content){
    	 	if(!content.data||content.data.length==0)return;
    	 	playlist = content.data;
	    	scope.list = [];//添加组player的
	    	for (var i=0;i<content.data.length;i++) {
	    		scope.list.push(content.data[i].song);
	    		var line = '<li id="m-'+i+'" mid="'+content.data[i].id+'" msrc="'+content.data[i].song+'" class="mui-table-view-cell">'+content.data[i].name+'-'+content.data[i].artist+'</li>';
	    		scope.playlistul.append(line);
	    	}
	    	//给每个歌曲绑定点击事件
	    	scope.playlistul.find("li").each(function(){
	    			var $this = $(this);
	    			$(this).click(function(){
	    				//配置css
	    				scope.playlistul.find("li").each(function(){
	    					$(this).css("color","#000");
	    				});
	    				$this.css("color","#A6E22D");
	    				var src = $this.attr("msrc");
			    		scope.play(scope.getDataByUrl(src));
			    		
	    		});
	    	});
	    	player.add(scope.list);
	    	scope.playing = playlist[0];
	    	scope.play(scope.playing);
	    	$("#m-0").css("color","#A6E22D");
	    	scope.getLyricBySong(scope.playing,function(lrc){});
	    	/*
	    	//自动加载第1个歌曲的歌词
	    	scope.getLyric(scope.playing.song,function(lrc){
//	    		console.log(lrc);
				scope.play(scope.playing);
	    	});*/
	    	
    	});
    };
    //初始化歌词播放界面 
    this.initLyric = function(){
//  	this.lyricContainer.css("margin-top","120px");
    	this.lyric = null;
    	this.lyricContainer.html("加载歌词......");
    	this.lyricStyle =  Math.floor(Math.random() * 4);
    };
    //根据歌曲对象处理歌词
    this.getLyricBySong = function(data,func){
    	if(!data)return null;
    	//1.从缓存中找
    	if(this.lrcs[data.id]){
    		func(this.lrcs[data.id]);
    		return ;
    	}
    	var scope = this;
    	//2.从后台获取
    	$.get(data.lrc,function(result){
    		scope.lrcs[data.id] = scope.parseLyric(result);//格式化
    		func(scope.lrcs[data.id]);
    		return;
    	});
    	return;
    };
    //根据歌曲链接处理歌词
    this.getLyric = function(song/**歌曲链接*/,func){
    	if(!song)return null;
    	var data = this.getDataByUrl(song);
    	return this.getLyricBySong(data,func);
    };
    //根据song的地址，查找歌曲模型对象
    this.getDataByUrl = function(song){
    	for(var i=0;i<playlist.length;i++){
    		if(song==playlist[i].song){
    			return playlist[i];
    		}
    	}
    	return null;
    };
    //格式化歌词
    this.parseLyric = function(text){
    	 //get each line from the text
        var lines = text.split('\n'),
            //this regex mathes the time [00.12.78]
            pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
            result = [];
        // Get offset from lyrics
        var offset = this.getOffset(text);

        //exclude the description parts or empty parts of the lyric
        while (!pattern.test(lines[0])) {
            lines = lines.slice(1);
        };
        //remove the last empty item
        lines[lines.length - 1].length === 0 && lines.pop();
        //display all content on the page
        lines.forEach(function(v, i, a) {
            var time = v.match(pattern),
                value = v.replace(pattern, '');
            time.forEach(function(v1, i1, a1) {
                //convert the [min:sec] to secs format then store into result
                var t = v1.slice(1, -1).split(':');
                result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]) + parseInt(offset) / 1000, value]);
            });
        });
        //sort the result by time
        result.sort(function(a, b) {
            return a[0] - b[0];
        });
        return result;
    };//end this.ParseLyric
    
     this.getOffset = function(text) {
        //Returns offset in miliseconds.
        var offset = 0;
        try {
            // Pattern matches [offset:1000]
            var offsetPattern = /\[offset:\-?\+?\d+\]/g,
                // Get only the first match.
                offset_line = text.match(offsetPattern)[0],
                // Get the second part of the offset.
                offset_str = offset_line.split(':')[1];
            // Convert it to Int.
            offset = parseInt(offset_str);
        } catch (err) {
            //alert("offset error: "+err.message);
            offset = 0;
        }
        return offset;
    };
    //播放歌词,lrc为格式化好的数组
    this.playLyric = function(lrcing){
    	var scope = this;
    	scope.lyricContainer.innerHTML='';//清空显示区域
    	lrcing.forEach(function(v,i,a){
    		var line = '<p id="line-'+i+'">'+v[1]+'</p>'
    		scope.lyricContainer.innerHTML+=line;
    	});
    	
    	for(var k=0;k<lrcing.length;k++){
			if(k>=0&&k<=10){
				$("#line-"+k).show();
			}else{
				$("#line-"+k).hide();
			}
		}
    	
		this.lyric = lrcing;    
		this.lyricStyle = Math.floor(Math.random() * 4);
    	var scope = this;
    	player.on("timeupdate",function(){
    		var pos = player.curPos();
    		var cls = "current-line-"+scope.lyricStyle;
    		var num = 0;
    		for(var i=0;i<lrcing.length;i++){
    			if(pos>lrcing[i][0]-0.30){
    				num = i;
    				var line = $("#line-"+i);
    				var preline = $("#line-"+(i>0?i-1:i));
    				preline.removeClass(cls);
    				line.addClass(cls);
//  				scope.lyricContainer.style.top=130-line.offsetTop+"px";
    			}
    		}
    		var start = num-5;
    				var end = num+5;
    				if(start<0){
    					start=0;
    				}
    				if(end<=10){
    					end = 10;
    				}
    				
    				for(var k=0;k<lrcing.length;k++){
    					if(k>=start&&k<=end){
    						$("#line-"+k).show();
    					}else{
    						$("#line-"+k).hide();
    					}
    				}
    	});
    	
    	
    };
    //根据src演示歌词
    this.workLyric = function(songsrc){
    	var scope = this;
    	scope.getLyric(songsrc,function(lrcing){
    		scope.playLyric(lrcing);
    	});
    };
    
    //开始播放，如果data有参数，则播放指定的歌曲，否则播放第1首
    this.play = function(data){
    	//设置当前播放歌 曲
    	if(data){
    		this.playing = data;
    	}else{
    		this.playing = this.playlist[0];
    	}
    	if(!this.playing)return;
    	this.lyricWrapper.attr("style","background:url("+this.playing.cover+") 50% 50% no-repeat fixed;");
    	this.title.text(this.playing.name+"-"+this.playing.artist);
    	//调用播放器播放
    	player.reset().add(this.list).setMode("loop").setCur(this.playing.song).play();
    	this.initLyric();
    	//加载歌词，并展示
    	var scope = this;
    	this.getLyricBySong(this.playing,scope.playLyric);
    	
    };
    
    
    
	
};


var xx = new XPlayer(player);
xx.init();
player.on("player:next",function(auto,cur){
	//当前播放歌曲
	xx.playing = xx.getDataByUrl(cur);
	xx.title.text(xx.playing.name+"-"+xx.playing.artist);
	xx.getLyricBySong(xx.playing,xx.playLyric);
});
