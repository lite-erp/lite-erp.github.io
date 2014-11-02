 $(document).ready(function() {
    $.fn.fullpage({
        slidesColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#f90'],
        anchors: ['index', 'articles', 'download', 'about'],
        menu: '#menu',
        afterLoad:function(anchorLink, index){
            if(index==1){
               
            }else if(index==2){
                
            }else if(index==3){
                AfterLoadDownload();
            }
        },
        onLeave:function(index, direction){
            
        }
    });
     
     $('.img').jqthumb({
        width:'100%',
         height:'100%'
     });
      AfterLoadIndex();
     
});



//加载完第1页后
function AfterLoadIndex(){
    $("#index-title").fadeIn(500);

}
//离开第1页时
function OnLeaveIndex(){
    $("#index-title").fadeOut(500);
}
//加载完第2页后
function AfterLoadArticle(){
}
//加载完下载页(3)
function AfterLoadDownload(){
    $(".download-page").find('h3').fadeOut(1000).fadeIn(1000);
}
//加载完关于页(4)
function AfterLoadAbout(){
}