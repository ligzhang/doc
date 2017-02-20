var e = function (ele) {
    return document.querySelector(ele)
}

var log = function () {
    console.log.apply(console,arguments)
}



var maindiv =  e('.maindiv')
var canvasarray = []
// 2048背景
var canvasbg = function () {
    for (var i = 0;i < 4;i++) {
        var rowdiv = document.createElement('div')
      //  rowdiv.style.fontSize = '0px'
        var rowarray = []
        for (var j = 0; j < 4; j++) {
            var coldiv = document.createElement('div')
            coldiv.className = 'col'
            coldiv.innerHTML = 0
            rowdiv.appendChild(coldiv)
            //var coldivText = coldiv.innetText || ''
            rowarray.push(coldiv)
        }
        maindiv.appendChild(rowdiv)
        canvasarray.push(rowarray)

    }
    maindiv.style.width = 4 *130 +4 * 10 + 'px'
    maindiv.style.height = 4 *130 +4 * 10 + 'px'
    maindiv.style.margin = 'auto'
    //log(canvasarray)
}


var randomNew = function (max) {
    return parseInt(Math.random()*max)
}

//初始化界面
var init = function () {
  var x1 = randomNew(4)
  var y1 = randomNew(4)
  var x2 = randomNew(4)
  var y2 = randomNew(4)
  //log('x1,y1,x2,y2',x1,y1,x2,y2)
  //如果重合了，重新初始化
  if(x1 == x2 && y1 == y2){
      init()
  } else {
  canvasarray[x1][y1].classList.add('div2')
  canvasarray[x1][y1].innerHTML = 2
  canvasarray[x2][y2].classList.add('div2')
  canvasarray[x2][y2].innerHTML = 2
  //log(canvasarray)
  }
}

//随机产生数字2 或4
var randomShow = function () {
    var x = randomNew(4)
    var y = randomNew(4)
    if(parseInt(canvasarray[x][y].innerHTML) > 0 ){
        randomShow()
    } else {
      if(Math.random() < 0.8){
        canvasarray[x][y].innerHTML = 2
        canvasarray[x][y].classList.add('div2')
      } else {
        canvasarray[x][y].innerHTML = 4
        canvasarray[x][y].classList.add('div4')
      }

    }

    //log(x,y)
    //log(canvasarray[x][y])
}





//键盘添加事件
document.onkeydown = function (event) {
    event = event || window.event
    switch(event.keyCode){
        case 37:
        direction = 'left'
        //log('left',direction)
        break;
        case 38:
        direction = 'up'
        //log('up')
        break;
        case 39:
        direction = 'right'
        //log('right')
        break;
        case 40:
        direction = 'down'
        //log('down')
        break;
        default:
    }
    //判断游戏结束
    if(gameOver() > 0){
        //alert('gameOver')
        var b = e('.mdiv')
        b.style.display = 'block'
        return false
    }

    //数字移动
    move(direction)

    //判断游戏胜利
    if(victory() > 0){

        var b = e('.mdiv')
        b.style.display = 'block'
        return false
    }

}

//合并选项
var join = function (next,now,combine) {

    //log('进入了合并选项')
    var nextText = parseInt(next.innerHTML)
    var nowText = parseInt(now.innerHTML)
    //log('nextText',nextText,nowText,'nowText')

    if(nowText > 0){
    //  log(nowText,'nowText')
        if(nextText == 0){
            next.innerHTML = nowText
            var classChanged = 'div' + nowText
            next.classList.add(classChanged)
            now.innerHTML = 0
            now.classList.remove(classChanged)
            //console.log(combine)
            if(combine[now]){
              combine[next] = true
              combine[now] = false
            }


        } else if(nextText == nowText && !combine[now] && !combine[next]){
            next.innerHTML = nowText * 2
            var classChanged = 'div' + nowText * 2
            var classChangedBefore = 'div' + nowText
            next.classList.remove(classChangedBefore)
            next.classList.add(classChanged)
            now.innerHTML = 0
            now.classList.remove(classChangedBefore)
            //合并过一次了
            combine[next] = true
            console.log('com',combine[next])
            console.log(combine,'++++')


        }

    }
    //console.log(combine,'++++')
   return combine
}

var canMove = function (direction) {
    //默认为不能移动
    var bool = 0
    if(direction == 'left'){
        for (var i = 0; i < 4; i++) {
            for(var j = 1;j < 4;j++){
                var now = parseInt(canvasarray[i][j].innerHTML)
                var next = parseInt(canvasarray[i][j-1].innerHTML)
                if(now != 0){
                    if(next == 0 || next == now){
                        bool = 1
                        return bool
                    }
                }
            }
         }
        return bool
    } else if(direction == 'up') {
          for (var j = 0; j < 4; j++) {
              for(var i = 1;i < 4;i++){
                  var now = parseInt(canvasarray[i][j].innerHTML)
                  var next = parseInt(canvasarray[i-1][j].innerHTML)
                  if(now != 0){
                      if(next == 0 || next == now){
                          bool = 1
                          return bool
                      }
                  }
              }
           }
          return bool
    } else if(direction == 'right') {
        for (var i = 0; i < 4; i++) {
            for(var j = 0;j < 3;j++){
                var now = parseInt(canvasarray[i][j].innerHTML)
                var next = parseInt(canvasarray[i][j+1].innerHTML)
                if(now != 0){
                    if(next == 0 || next == now){
                        bool = 1
                        return bool
                    }
                }
            }
         }
        return bool
    } else if(direction == 'down') {
        for (var i = 0; i < 3; i++) {
            for(var j = 0;j < 4;j++){
                var now = parseInt(canvasarray[i][j].innerHTML)
                var next = parseInt(canvasarray[i+1][j].innerHTML)
                if(now != 0){
                    if(next == 0 || next == now){
                        bool = 1
                        return bool
                    }
                }
            }
         }
        return bool
    }
}



//游戏左右上下移动
var move = function (direction) {

    switch(direction){
        case 'left':
        //log('***')
        //如果能向左移动，就随机产生一个数字
        //否则不生成数字
        if(!canMove('left')) {
              return false
        }
        for(var i = 0;i < 4;i++){
            var combine = {}
            for(var j = 1;j < 4;j++){
                var k = j
                //从右往左依次遍历
                while(k > 0){
                    join(canvasarray[i][k-1],canvasarray[i][k],combine)
                    k--
                }
              }
            }
        break;
        case 'up':
        if(!canMove('up')){
            return false
        }
        for(var j = 0;j < 4;j++) {
            var combine = {}
            for(var i = 1; i < 4 ; i++) {
                var k = i
                //从下往上依次遍历
                while(k > 0){
                    join(canvasarray[k-1][j],canvasarray[k][j],combine)
                    k--
                }
            }
        }
        break;
        case 'right':
        if(!canMove('right')){
            return false
        }
        for(var i = 0;i < 4;i++){
            var combine = {}
            for(var j = 2; j > -1;j--){
                var k = j
                while(k < 3){
                    join(canvasarray[i][k+1],canvasarray[i][k],combine)
                    k++
                }
            }
        }
        break;
        case 'down':
        if(!canMove('down')){
            return false
        }
        for(var j = 0;j < 4;j++){
            var combine = {}
            for(var i = 2;i > -1;i--){
                var k = i
                while(k < 3){
                    join(canvasarray[k+1][j],canvasarray[k][j],combine)
                    k++

                }
            }
        }
        break;

        default:
    }
    //随机生成新的数字
    randomShow()

}

var direction

//判断游戏胜利
var victory = function () {
    var bool = 0
    for(var i = 0;i < 4;i++){
        for(var j = 0;j < 4;j++){
           var num = parseInt(canvasarray[i][j].innerHTML)
           //log(num,'num')
           if(num == 2048){
              //alert('win')
              bool = 1
              log(bool,'bool')
              return bool
           }
        }
    }
    return bool
}

//游戏结束
var gameOver = function () {
    var bool = 1
    //只要还有0存在就不会结束游戏
    for(var i = 0;i < 4;i++){
        for(var j = 0;j < 4;j++){
            var value = parseInt(canvasarray[i][j].innerHTML)
            if(value == 0){
                 bool = 0
                 return bool
            }
        }
    }
    //只要相邻的元素相等就不会结束游戏
    //横向相等
    for(var i = 0 ;i < 4;i++){
        for(var j = 0;j < 3;j++){
            var valueY1 = parseInt(canvasarray[i][j].innerHTML)
            var valueY2 = parseInt(canvasarray[i][j+1].innerHTML)
            if(valueY1 == valueY2){
                bool = 0
                return bool
            }
        }
    }
    //纵向相等
    for(var i = 0 ;i < 3;i++){
        for(var j = 0;j < 4;j++){
            var valueY3 = parseInt(canvasarray[i][j].innerHTML)
            var valueY4 = parseInt(canvasarray[i+1][j].innerHTML)
            if(valueY3 == valueY4){
                bool = 0
                return bool
            }
        }
    }

    return bool
}

var button = e('.again')
button.addEventListener('click',function(){
    window.location.reload()
})


var _main = function () {
    //背景
    canvasbg()
    //初始化
    init()


}

_main()
