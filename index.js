var draggables = document.querySelectorAll('.draggable');
var selectedElement = null;
var offsetX, offsetY;
var delayDragging = false; // 用于控制延迟拖动的标志
let x=0;
let y=0;

// var guidanceButton = document.getElementById('guidanceBtn'); 
// var finishCreationBtn = document.getElementById('finishCreationButton'); 

document.addEventListener('DOMContentLoaded', function() {
  var guidanceButton = document.getElementById('guidanceBtn'); 
  var finishCreationBtn = document.getElementById('finishCreationButton'); 
  var submitBtn = document.getElementById('submitbutton'); 

  if (guidanceButton) {
      guidanceButton.addEventListener('click', function() {
          window.location.href = 'page2.html';
      });
  }

  if (finishCreationBtn) {
    finishCreationBtn.addEventListener('click', function() {
        // captureAndDownload(function() {
        //     // 下载完成后，跳转到新页面
            window.location.href = 'page3.html';
        // });
    });
}
if (submitBtn){
    submitBtn.addEventListener('click', function(){
        window.location.href = 'page1.html';
    } )
}
});

function captureAndDownload(callback) {
  var canvasArea = document.getElementById('canvas-area');
  html2canvas(canvasArea).then(function(canvas) {
      var link = document.createElement('a');
      link.download = 'creation.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      // 调用回调函数
      if (callback) callback();
  }).catch(function(error) {
      console.error('Error capturing canvas:', error);
  });
}

draggables.forEach(function(img) {
    img.addEventListener('mousedown', function(e) {
        if (delayDragging) {
            // 如果处于延迟状态，则不执行操作
            return;
        }

        // 设置延迟，防止快速连续点击
        delayDragging = true;
        setTimeout(function() {
            delayDragging = false;
        }, 200); // 设置200毫秒的延迟

        // 处理拖动逻辑
        handleDrag(e, img);
    });
});

function handleDrag(e, img) {
    if (!selectedElement) {
        // 开始拖动
        selectedElement = img;
        selectedElement.style.zIndex = 10; // 提高 z-index
        offsetX = e.clientX - selectedElement.getBoundingClientRect().left;
        offsetY = e.clientY - selectedElement.getBoundingClientRect().top;
        document.addEventListener('mousemove', mouseMove);
    } else if (selectedElement === img) {
        // 放置图片
        selectedElement.style.zIndex = 2; // 恢复 z-index
        document.removeEventListener('mousemove', mouseMove);
        
        selectedElement = null;
        // document.getElementById('canvas').innerHTML+=`
        // <>`;
        
    }
}

function mouseMove(e) {
    if (!selectedElement) return;
    selectedElement.style.position = 'absolute';
    selectedElement.style.left = e.clientX - offsetX + 'px';
    // x=selectedElement.style.left;
    selectedElement.style.top = e.clientY - offsetY + 'px';
    // y=selectedElement.style.top;
}
document.getElementById('finishCreationButton').addEventListener('click', function() {
    var state = captureState();
    localStorage.setItem('pageState', JSON.stringify(state));
    window.location.href = 'newpage.html'; // 新页面的 URL
});

function captureState() {
    var state = {};
    var draggables = document.querySelectorAll('.draggable');
    draggables.forEach(function(img) {
        state[img.id] = {
            left: img.style.left,
            top: img.style.top
        };
    });
    return state;
}